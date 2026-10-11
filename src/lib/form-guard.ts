/**
 * Comprobaciones comunes de las Pages Functions de formularios (contacto, presupuesto, altas).
 * Vive en src/lib y no en functions/ para que Cloudflare no lo convierta en una ruta.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const redirectTo = (request: Request, path: string) => Response.redirect(new URL(path, request.url).href, 303);

/** Origin de otro dominio o malformado. Sin Origin (o "null") se deja pasar: lo frenan Turnstile y el honeypot */
export const isForeignOrigin = (request: Request) => {
  const origin = request.headers.get('Origin');
  if (!origin || origin === 'null') return false;
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
};

export const verifyTurnstile = async (secret: string, token: string, ip: string | null) => {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = (await response.json().catch(() => ({}))) as { success?: boolean };
  return result.success === true;
};
