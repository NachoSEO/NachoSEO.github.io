/**
 * Formulario de contacto (Cloudflare Pages Function). Valida, comprueba Turnstile y pasa el
 * mensaje al Worker contact-mailer (service binding), que lo envía por email a Nacho.
 *
 * Bindings y secretos (Cloudflare Pages):
 *   CONTACT_MAILER        service binding al Worker contact-mailer (wrangler.toml)
 *   TURNSTILE_SECRET_KEY  clave secreta del widget de Turnstile
 */
import { EMAIL_PATTERN, isForeignOrigin, redirectTo, verifyTurnstile } from '../../src/lib/form-guard';

interface Env {
  CONTACT_MAILER: { fetch: (input: string, init?: RequestInit) => Promise<Response> };
  TURNSTILE_SECRET_KEY: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // Solo envíos desde la propia web
  if (isForeignOrigin(request)) {
    return redirectTo(request, '/contacto/error/?code=origin');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectTo(request, '/contacto/error/?code=body');
  }

  const lang = form.get('lang') === 'en' ? 'en' : 'es';
  const okPath = lang === 'en' ? '/en/contact/thanks/' : '/contacto/gracias/';
  const errorPath = lang === 'en' ? '/en/contact/error/' : '/contacto/error/';

  // Honeypot: los bots rellenan el campo oculto; les respondemos como si nada
  if (form.get('company')) return redirectTo(request, okPath);

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const website = String(form.get('website') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  const page = String(form.get('page') ?? '').slice(0, 300);

  if (!name || name.length > 100 || !EMAIL_PATTERN.test(email) || email.length > 254 || website.length > 200) {
    return redirectTo(request, `${errorPath}?code=fields`);
  }
  if (message.length < 10 || message.length > 5000) return redirectTo(request, `${errorPath}?code=message`);

  if (!env.TURNSTILE_SECRET_KEY) return redirectTo(request, `${errorPath}?code=missing-env`);
  const token = String(form.get('cf-turnstile-response') ?? '');
  const human = token && (await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')));
  if (!human) return redirectTo(request, `${errorPath}?code=captcha`);

  const sent = await env.CONTACT_MAILER.fetch('https://contact-mailer/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, website, message, lang, page }),
  }).catch(() => null);
  if (!sent?.ok) return redirectTo(request, `${errorPath}?code=send-${sent?.status ?? 'fetch'}`);

  return redirectTo(request, okPath);
};
