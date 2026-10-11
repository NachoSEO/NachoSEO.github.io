/**
 * Cliente de la sesión de herramientas: resuelve Turnstile una vez, guarda la sesión en memoria mientras no caduque
 * y la manda en cada llamada. Turnstile va en modo interaction-only: solo se ve si Cloudflare pide comprobarlo.
 */
import { SESSION_HEADER } from './tool-session';

// Clave pública del widget (no es secreta). En localhost, la de pruebas de Cloudflare, que siempre pasa
const SITE_KEY = '0x4AAAAAAFNFf1h16Ha20rP9';
const TEST_SITE_KEY = '1x00000000000000000000AA';
const RENEW_MARGIN_SECONDS = 30;

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
}

let session: { value: string; expires: number } | null = null;
let challengeSlot: HTMLElement | null = null;
let pending: Promise<string> | null = null;
let scriptLoad: Promise<TurnstileApi> | null = null;

const loadTurnstile = () =>
  (scriptLoad ??= new Promise<TurnstileApi>((resolve, reject) => {
    const ready = () => resolve((window as unknown as { turnstile: TurnstileApi }).turnstile);
    if ((window as unknown as { turnstile?: TurnstileApi }).turnstile) return ready();
    const script = Object.assign(document.createElement('script'), {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      async: true,
    });
    script.addEventListener('load', ready);
    script.addEventListener('error', () => {
      scriptLoad = null;
      reject(new Error('turnstile-load'));
    });
    document.head.append(script);
  }));

/** Dónde aparece Turnstile si tiene que pedir interacción (la tarjeta de la herramienta) */
export const setChallengeSlot = (slot: HTMLElement) => {
  challengeSlot = slot;
};

const solveChallenge = async () => {
  const turnstile = await loadTurnstile();
  const container = document.createElement('div');
  (challengeSlot ?? document.body).append(container);
  try {
    return await new Promise<string>((resolve, reject) => {
      const widgetId = turnstile.render(container, {
        sitekey: /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? TEST_SITE_KEY : SITE_KEY,
        appearance: 'interaction-only',
        language: document.documentElement.lang || 'auto',
        callback: (token: string) => {
          resolve(token);
          setTimeout(() => turnstile.remove(widgetId), 0);
        },
        'error-callback': () => reject(new Error('challenge-failed')),
        'expired-callback': () => reject(new Error('challenge-expired')),
      });
    });
  } finally {
    container.remove();
  }
};

const openSession = async () => {
  const token = await solveChallenge();
  const response = await fetch('/api/tool-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
  if (!response.ok) throw new Error('session');
  const data = (await response.json()) as { session: string; expires: number };
  session = { value: data.session, expires: data.expires };
  return data.session;
};

const currentSession = () => {
  if (session && session.expires - RENEW_MARGIN_SECONDS > Date.now() / 1000) return Promise.resolve(session.value);
  return (pending ??= openSession().finally(() => (pending = null)));
};

const BUSY_RETRIES = 5;
const BUSY_WAIT_MS = 1500;

const LIMIT_TEXT = {
  es: {
    'daily-quota': 'Has llegado al límite diario de las herramientas. Se reinicia a medianoche (hora UTC).',
    'global-quota': 'Las herramientas han llegado a su límite de uso de hoy. Vuelve mañana.',
    'target-quota': 'Esa web ya ha recibido hoy el máximo de peticiones de estas herramientas. Prueba mañana.',
  },
  en: {
    'daily-quota': "You've reached the daily limit for the tools. It resets at midnight (UTC).",
    'global-quota': 'The tools have hit their usage limit for today. Come back tomorrow.',
    'target-quota': 'That site has already received the maximum requests from these tools today. Try again tomorrow.',
  },
};

/** Cuota diaria agotada: el mensaje ya viene en el idioma de la página para enseñarlo tal cual */
export class ToolLimitError extends Error {}

/**
 * fetch con la sesión de herramientas. Si el servidor la rechaza (caducada o cambio de IP), se pide otra una vez.
 * Con otra llamada en curso desde la misma IP (busy) espera y reintenta; con la cuota agotada lanza ToolLimitError.
 */
export const toolFetch = async (input: string, init: RequestInit = {}) => {
  const send = async () => {
    const headers = new Headers(init.headers);
    headers.set(SESSION_HEADER, await currentSession());
    return fetch(input, { ...init, headers });
  };
  let renewed = false;
  for (let attempt = 0; ; attempt++) {
    const response = await send();
    if (response.status === 401 && !renewed) {
      session = null;
      renewed = true;
      continue;
    }
    if (response.status !== 429) return response;
    const data = (await response.clone().json().catch(() => null)) as { error?: string } | null;
    if (data?.error === 'busy' && attempt < BUSY_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, BUSY_WAIT_MS));
      continue;
    }
    if (data?.error === 'daily-quota' || data?.error === 'global-quota' || data?.error === 'target-quota') {
      const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
      throw new ToolLimitError(LIMIT_TEXT[lang][data.error]);
    }
    return response;
  }
};
