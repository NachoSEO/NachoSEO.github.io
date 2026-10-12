/**
 * Motivo de desinstalación de la extensión SEO & GEO Inspector (Cloudflare Pages Function): POST /api/extension-feedback
 * Formulario nativo de la página de desinstalación; llega a Nacho por email a través del Worker contact-mailer.
 *   CONTACT_MAILER        service binding al Worker contact-mailer (wrangler.toml)
 *   TURNSTILE_SECRET_KEY  clave secreta del widget de Turnstile
 */
import { isForeignOrigin, redirectTo, verifyTurnstile } from '../../src/lib/form-guard';
import { extensionPaths, uninstallReasons } from '../../src/data/extension';

interface Env {
  CONTACT_MAILER: { fetch: (input: string, init?: RequestInit) => Promise<Response> };
  TURNSTILE_SECRET_KEY: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const form = await request.formData().catch(() => null);
  const lang = form?.get('lang') === 'en' ? 'en' : 'es';
  const page = extensionPaths[lang].uninstalled;
  const sentParam = lang === 'en' ? 'sent' : 'enviado';
  if (isForeignOrigin(request) || !form) return redirectTo(request, `${page}?error=origin`);
  // Honeypot: un bot rellena el campo oculto; se le da por enviado sin hacer nada
  if (form.get('website')) return redirectTo(request, `${page}?${sentParam}=1`);

  const reason = uninstallReasons[lang].find((item) => item.value === form.get('reason'));
  if (!reason) return redirectTo(request, `${page}?error=reason`);
  const token = String(form.get('cf-turnstile-response') ?? '');
  const human = token && (await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')));
  if (!human) return redirectTo(request, `${page}?error=captcha`);

  const comment = String(form.get('comment') ?? '').slice(0, 2000).trim();
  const version = String(form.get('version') ?? '').replace(/[^0-9.]/g, '').slice(0, 20) || 'desconocida';
  const sent = await env.CONTACT_MAILER.fetch('https://contact-mailer/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'SEO & GEO Inspector',
      email: 'hola@nachomascort.com',
      subject: `Desinstalación de la extensión: ${uninstallReasons.es.find((item) => item.value === reason.value)!.label}`,
      message: [`Motivo: ${reason.label}`, `Versión: ${version}`, `Idioma: ${lang}`, '', comment || '(sin comentario)'].join('\n'),
      lang,
      page,
    }),
  }).catch(() => null);
  if (!sent?.ok) return redirectTo(request, `${page}?error=send`);
  return redirectTo(request, `${page}?${sentParam}=1`);
};
