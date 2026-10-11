/**
 * Abre una sesión de herramientas tras pasar Turnstile (Cloudflare Pages Function): POST /api/tool-session
 * Cuerpo: { token: respuesta de Turnstile }. Devuelve { session, expires } para la cabecera X-Tool-Session.
 */
import { isForeignOrigin, verifyTurnstile } from '../../src/lib/form-guard';
import { json, LOOP_HEADER } from '../../src/lib/safe-fetch';
import { issueSession, type ToolEnv } from '../../src/lib/tool-session';

export const onRequestPost = async ({ request, env }: { request: Request; env: ToolEnv }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  if (!env.TURNSTILE_SECRET_KEY) return json({ error: 'missing-env' }, 503);
  let token = '';
  try {
    const payload = (await request.json()) as { token?: unknown };
    token = typeof payload.token === 'string' ? payload.token.slice(0, 4096) : '';
  } catch {
    return json({ error: 'invalid-body' }, 400);
  }
  if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')))) {
    return json({ error: 'challenge-failed' }, 403);
  }
  return json(await issueSession(env.TURNSTILE_SECRET_KEY, request));
};
