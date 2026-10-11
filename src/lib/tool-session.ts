/**
 * Sesión de las herramientas que hacen peticiones a otras webs. El usuario pasa Turnstile una vez y recibe un token
 * firmado (HMAC) que caduca y solo vale desde su IP: así nadie puede automatizar las herramientas desde un script
 * sin resolver el reto, y un token robado no sirve desde otra máquina.
 * La clave se deriva de TURNSTILE_SECRET_KEY, de modo que no hace falta otro secreto.
 */
export const SESSION_HEADER = 'X-Tool-Session';
export const SESSION_TTL_SECONDS = 15 * 60;

export interface ToolEnv {
  TURNSTILE_SECRET_KEY?: string;
}

const encoder = new TextEncoder();

const toBase64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const signingKey = async (secret: string) =>
  crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', encoder.encode(`tool-session:${secret}`)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

const signature = async (secret: string, expires: number, ip: string) =>
  toBase64Url(await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(`${expires}|${ip}`)));

const clientIp = (request: Request) => request.headers.get('CF-Connecting-IP') ?? '';

export const issueSession = async (secret: string, request: Request) => {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return { session: `${expires}.${await signature(secret, expires, clientIp(request))}`, expires };
};

/** Comparación en tiempo constante para no filtrar la firma byte a byte */
const sameText = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
};

export const hasValidSession = async (request: Request, env: ToolEnv) => {
  const secret = env.TURNSTILE_SECRET_KEY;
  const [expiresText, provided] = (request.headers.get(SESSION_HEADER) ?? '').split('.');
  const expires = Number(expiresText);
  if (!secret || !provided || !Number.isInteger(expires) || expires < Date.now() / 1000) return false;
  return sameText(provided, await signature(secret, expires, clientIp(request)));
};
