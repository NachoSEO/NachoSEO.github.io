/**
 * Alta en la lista de Kit desde los formularios del blog (Cloudflare Pages Function).
 * El formulario hace POST nativo aquí y redirige a la página de gracias, así que
 * funciona sin JavaScript y sin abrir la CSP a terceros.
 *
 * Variables de entorno (Cloudflare Pages → Settings → Variables):
 *   KIT_API_KEY  API key v4 de Kit
 *   KIT_FORM_ID  ID del formulario de Kit con el incentive email de la skill
 */
interface Env {
  KIT_API_KEY: string;
  KIT_FORM_ID: string;
}

const KIT_API = 'https://api.kit.com/v4';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const redirectTo = (request: Request, path: string) => Response.redirect(new URL(path, request.url).href, 303);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const form = await request.formData();
  const lang = form.get('lang') === 'en' ? 'en' : 'es';
  const thanksPath = lang === 'en' ? '/en/thanks/' : '/gracias/';
  const errorPath = `${thanksPath}error/`;

  // Honeypot: los bots rellenan el campo oculto; les respondemos como si nada
  if (form.get('website')) return redirectTo(request, thanksPath);

  const emailAddress = String(form.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(emailAddress) || emailAddress.length > 254) return redirectTo(request, errorPath);

  const referrer = String(form.get('source') ?? request.headers.get('referer') ?? '');
  const headers = { 'Content-Type': 'application/json', 'X-Kit-Api-Key': env.KIT_API_KEY };

  try {
    // Se crea como inactive para que Kit mande el email de confirmación con la skill (double opt-in)
    const created = await fetch(`${KIT_API}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: emailAddress, state: 'inactive', fields: { idioma: lang } }),
    });
    if (!created.ok) throw new Error(`Kit subscribers ${created.status}`);

    const added = await fetch(`${KIT_API}/forms/${env.KIT_FORM_ID}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: emailAddress, referrer }),
    });
    if (!added.ok) throw new Error(`Kit forms ${added.status}`);
  } catch (error) {
    console.error(error);
    return redirectTo(request, errorPath);
  }

  return redirectTo(request, thanksPath);
};
