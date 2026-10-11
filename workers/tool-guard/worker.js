/**
 * Cuotas de las herramientas que hacen peticiones a otras webs. Una instancia del Durable Object por IP
 * ("ip:<ip>"), otra por web de destino ("site:<dominio>") y otra global ("global"). La unidad es una petición
 * a una web externa.
 * Cada instancia procesa sus llamadas de una en una, así que los contadores no tienen carreras.
 */
import { DurableObject } from 'cloudflare:workers';

const LIMITS = {
  // Da para una auditoría pequeña al día (100 URLs con sus redirecciones); 5.000 / 250 = 20 IPs con Turnstile para agotar el global
  ip: { daily: 250, concurrent: 2 },
  // Por web de destino, sumando todas las IPs: nadie puede concentrar el tráfico de las herramientas en una víctima
  site: { daily: 500, concurrent: Infinity },
  // Tope total: si alguien lo explota, todo se para hasta medianoche UTC y llega un aviso por email
  global: { daily: 5000, concurrent: Infinity },
};
// Avisos por email del límite global (una vez al día cada uno)
const ALERT_SHARES = [0.8, 1];
// Si una llamada muere sin liberar su hueco, se da por terminada pasado este tiempo (más que la llamada más lenta)
const LEASE_TTL_MS = 120_000;

const today = () => new Date().toISOString().slice(0, 10);

export class ToolQuota extends DurableObject {
  async state() {
    const stored = (await this.ctx.storage.get('state')) ?? { day: today(), used: 0, leases: {}, alerted: [] };
    if (stored.day !== today()) Object.assign(stored, { day: today(), used: 0, alerted: [] });
    stored.alerted ??= [];
    const now = Date.now();
    stored.leases = Object.fromEntries(Object.entries(stored.leases).filter(([, started]) => now - started < LEASE_TTL_MS));
    return stored;
  }

  /** Reserva `cost` peticiones. Devuelve { ok, lease } o { ok: false, reason: 'busy' | 'quota' } */
  async acquire(cost, scope) {
    const limits = LIMITS[scope];
    if (!limits || !Number.isInteger(cost) || cost < 0) return { ok: false, reason: 'invalid' };
    const state = await this.state();
    if (Object.keys(state.leases).length >= limits.concurrent) return { ok: false, reason: 'busy' };
    if (state.used + cost > limits.daily) {
      if (scope === 'global') await this.alert(state, 1);
      return { ok: false, reason: 'quota' };
    }
    const lease = crypto.randomUUID();
    state.used += cost;
    state.leases[lease] = Date.now();
    if (scope === 'global' && state.used >= limits.daily * ALERT_SHARES[0]) await this.alert(state, ALERT_SHARES[0]);
    await this.ctx.storage.put('state', state);
    return { ok: true, lease, remaining: limits.daily - state.used };
  }

  /** Email al dueño la primera vez del día que el uso global llega a `share` del límite */
  async alert(state, share) {
    if (state.alerted.includes(share) || !this.env.CONTACT_MAILER) return;
    state.alerted.push(share);
    await this.ctx.storage.put('state', state);
    const limit = LIMITS.global.daily;
    const reached = share >= 1;
    const message = [
      reached
        ? `Las herramientas gratis han llegado al límite global de ${limit} peticiones externas del ${state.day} (UTC) y están paradas hasta medianoche UTC.`
        : `Las herramientas gratis llevan ${state.used} de ${limit} peticiones externas hoy (${state.day}, UTC): un ${Math.round((state.used / limit) * 100)} % del límite global.`,
      '',
      'Si no esperabas este uso, puede ser un abuso. Qué mirar:',
      '- Cloudflare > Workers & Pages > nachomascort > Functions: picos en /api/bot-check, /api/url-status, /api/sitemap-fetch, /api/robots-txt, /api/autocomplete.',
      '- Cloudflare > Security > Events: IPs que chocan con la regla de rate limit de /api/*.',
      '- Para cortarlo ya: activa la regla del WAF que bloquea esas rutas.',
    ].join('\n');
    this.ctx.waitUntil(
      this.env.CONTACT_MAILER.fetch('https://contact-mailer/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Herramientas nachomascort.com',
          email: 'hola@nachomascort.com',
          subject: reached ? 'Herramientas paradas: límite global diario alcanzado' : `Herramientas al ${Math.round(share * 100)} % del límite global diario`,
          message,
          lang: 'es',
          page: '/herramientas/',
        }),
      }).catch(() => {})
    );
  }

  /** Libera el hueco y devuelve lo reservado que no se llegó a gastar */
  async release(lease, refund) {
    const state = await this.state();
    delete state.leases[lease];
    if (Number.isInteger(refund) && refund > 0) state.used = Math.max(0, state.used - refund);
    await this.ctx.storage.put('state', state);
  }
}

export default {
  fetch: () => new Response('Not found', { status: 404 }),
};
