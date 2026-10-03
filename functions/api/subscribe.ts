/**
 * Alta en la lista de Kit desde los formularios del blog (Cloudflare Pages Function).
 * El formulario hace POST nativo aquí y redirige a la página de gracias, así que
 * funciona sin JavaScript y sin abrir la CSP a terceros.
 *
 * Variables de entorno (Cloudflare Pages → Settings → Variables):
 *   KIT_API_KEY                     API key v4 de Kit
 *   KIT_FORM_ID_ES, KIT_FORM_ID_EN  Un formulario por idioma: cada uno manda su incentive email
 *
 * Tags: idioma-es / idioma-en para segmentar envíos, y lm-<lead magnet> para saber de dónde
 * viene cada suscriptor. Se crean solos en Kit la primera vez (POST /tags es idempotente).
 */
interface Env {
  KIT_API_KEY: string;
  KIT_FORM_ID_ES: string;
  KIT_FORM_ID_EN: string;
}

const KIT_API = 'https://api.kit.com/v4';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lead magnets válidos (valor del campo oculto `magnet` del formulario)
const LEAD_MAGNETS = new Set(['google-quality-audit']);

const redirectTo = (request: Request, path: string) => Response.redirect(new URL(path, request.url).href, 303);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // Solo altas desde la propia web: otra página no puede apuntar a alguien sin que lo sepa
  const origin = request.headers.get('Origin');
  if (origin && origin !== 'null' && new URL(origin).host !== new URL(request.url).host) return redirectTo(request, '/gracias/error/');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectTo(request, '/gracias/error/');
  }
  const lang = form.get('lang') === 'en' ? 'en' : 'es';
  const thanksPath = lang === 'en' ? '/en/thanks/' : '/gracias/';
  const errorPath = `${thanksPath}error/`;

  // Honeypot: los bots rellenan el campo oculto; les respondemos como si nada
  if (form.get('website')) return redirectTo(request, thanksPath);

  const emailAddress = String(form.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(emailAddress) || emailAddress.length > 254) return redirectTo(request, errorPath);

  const referrer = String(form.get('source') ?? request.headers.get('referer') ?? '').slice(0, 500);
  const headers = { 'Content-Type': 'application/json', 'X-Kit-Api-Key': env.KIT_API_KEY };
  const formId = lang === 'en' ? env.KIT_FORM_ID_EN : env.KIT_FORM_ID_ES;
  const magnet = String(form.get('magnet') ?? '');
  const tagNames = [`idioma-${lang}`, ...(LEAD_MAGNETS.has(magnet) ? [`lm-${magnet}`] : [])];

  const tagSubscriber = async (tagName: string) => {
    const tagResponse = await fetch(`${KIT_API}/tags`, { method: 'POST', headers, body: JSON.stringify({ name: tagName }) });
    if (!tagResponse.ok) throw new Error(`Kit create tag ${tagResponse.status}`);
    const { tag } = (await tagResponse.json()) as { tag: { id: number } };
    const tagged = await fetch(`${KIT_API}/tags/${tag.id}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: emailAddress }),
    });
    if (!tagged.ok) throw new Error(`Kit tag subscriber ${tagged.status}`);
  };

  try {
    // Se crea como inactive para que Kit mande el email de confirmación con la skill (double opt-in)
    const created = await fetch(`${KIT_API}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: emailAddress, state: 'inactive' }),
    });
    if (!created.ok) throw new Error(`Kit subscribers ${created.status}`);

    // El alta en el formulario dispara el incentive email en su idioma; los tags van después
    const added = await fetch(`${KIT_API}/forms/${formId}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: emailAddress, referrer }),
    });
    if (!added.ok) throw new Error(`Kit forms ${added.status}`);

    await Promise.all(tagNames.map(tagSubscriber));
  } catch (error) {
    console.error(error);
    return redirectTo(request, errorPath);
  }

  return redirectTo(request, thanksPath);
};
