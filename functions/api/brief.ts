/**
 * Briefing de presupuesto (Cloudflare Pages Function). Valida, comprueba Turnstile y envía a Nacho
 * las respuestas de los servicios marcados, agrupadas por bloque, mediante el Worker contact-mailer.
 *
 * Bindings y secretos (Cloudflare Pages): los mismos que functions/api/contact.ts
 *   CONTACT_MAILER        service binding al Worker contact-mailer (wrangler.toml)
 *   TURNSTILE_SECRET_KEY  clave secreta del widget de Turnstile
 */
import { briefSections, briefServices, detailFieldName, isFieldActive, type BriefField, type ServiceId } from '../../src/lib/brief';

interface Env {
  CONTACT_MAILER: { fetch: (input: string, init?: RequestInit) => Promise<Response> };
  TURNSTILE_SECRET_KEY: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OK_PATH = '/briefing/gracias/';
const ERROR_PATH = '/briefing/error/';

const redirectTo = (request: Request, path: string) => Response.redirect(new URL(path, request.url).href, 303);

const verifyTurnstile = async (secret: string, token: string, ip: string | null) => {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = (await response.json().catch(() => ({}))) as { success?: boolean };
  return result.success === true;
};

const text = (form: FormData, name: string, max: number) => String(form.get(name) ?? '').trim().slice(0, max);

// Respuesta legible de un campo; las opciones con detalle se muestran como "Tienda online (500 productos)"
const answerFor = (form: FormData, field: BriefField) => {
  if (field.kind === 'text' || field.kind === 'textarea') return text(form, field.name, 3000);

  const chosen = new Set(form.getAll(field.name).map(String));
  return (field.options ?? [])
    .map((option, index) => {
      if (!chosen.has(option.label)) return null;
      const detail = text(form, detailFieldName(field.name, index), 200);
      return detail ? `${option.label} (${detail})` : option.label;
    })
    .filter(Boolean)
    .join(', ');
};

const formatBrief = (form: FormData, selected: Set<ServiceId>, company: string) => {
  const services = briefServices.filter((service) => selected.has(service.id)).map((service) => service.label);
  const blocks = briefSections
    .filter((section) => !section.service || selected.has(section.service))
    .map((section) => {
      const lines = section.fields
        .filter((field) => isFieldActive(section, field, selected))
        .map((field) => {
          const answer = answerFor(form, field);
          return field.kind === 'textarea' && answer.includes('\n')
            ? `${field.label}\n${answer}`
            : `${field.label}: ${answer || '—'}`;
        });
      return [`== ${section.title.toUpperCase()} ==`, ...lines].join('\n');
    });

  return [`Empresa: ${company || '—'}`, `Servicios: ${services.join(', ')}`, '', ...blocks.flatMap((block) => [block, ''])]
    .join('\n')
    .trim();
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // Solo envíos desde la propia web
  const origin = request.headers.get('Origin');
  if (origin && origin !== 'null' && new URL(origin).host !== new URL(request.url).host) {
    return redirectTo(request, `${ERROR_PATH}?code=origin`);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectTo(request, `${ERROR_PATH}?code=body`);
  }

  // Honeypot: los bots rellenan el campo oculto; les respondemos como si nada
  if (form.get('company')) return redirectTo(request, OK_PATH);

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const website = String(form.get('website') ?? '').trim();
  const company = text(form, 'empresa', 150);
  const knownServices = new Set<string>(briefServices.map((service) => service.id));
  const selected = new Set(form.getAll('servicios').map(String).filter((id) => knownServices.has(id)) as ServiceId[]);

  if (!name || name.length > 100 || !EMAIL_PATTERN.test(email) || email.length > 254 || website.length > 200) {
    return redirectTo(request, `${ERROR_PATH}?code=fields`);
  }
  if (selected.size === 0) return redirectTo(request, `${ERROR_PATH}?code=services`);
  const missingRequired = briefSections.some((section) =>
    section.fields.some((field) => field.required && isFieldActive(section, field, selected) && !form.get(field.name)),
  );
  if (missingRequired) return redirectTo(request, `${ERROR_PATH}?code=required`);

  if (!env.TURNSTILE_SECRET_KEY) return redirectTo(request, `${ERROR_PATH}?code=missing-env`);
  const token = String(form.get('cf-turnstile-response') ?? '');
  const human = token && (await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')));
  if (!human) return redirectTo(request, `${ERROR_PATH}?code=captcha`);

  const serviceTags = briefServices.filter((service) => selected.has(service.id)).map((service) => service.shortLabel);
  const subject = `Briefing [${serviceTags.join(' + ')}]: ${company || name}`;

  const sent = await env.CONTACT_MAILER.fetch('https://contact-mailer/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      website,
      message: formatBrief(form, selected, company),
      lang: 'es',
      page: '/briefing/',
      subject,
    }),
  }).catch(() => null);
  if (!sent?.ok) return redirectTo(request, `${ERROR_PATH}?code=send-${sent?.status ?? 'fetch'}`);

  return redirectTo(request, OK_PATH);
};
