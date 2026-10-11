/**
 * Cuotas de las herramientas que hacen peticiones a otras webs. Una instancia del Durable Object por IP
 * ("ip:<ip>"), otra por web de destino ("site:<dominio>") y otra global ("global"). La unidad es una petición
 * a una web externa.
 * Cada instancia procesa sus llamadas de una en una, así que los contadores no tienen carreras.
 */
import { DurableObject } from 'cloudflare:workers';

const LIMITS = {
  // Una persona auditando su web tiene de sobra; 20.000 / 600 obliga a más de 30 IPs con Turnstile para agotar el global
  ip: { daily: 600, concurrent: 2 },
  // Por web de destino, sumando todas las IPs: nadie puede concentrar el tráfico de las herramientas en una víctima
  site: { daily: 1000, concurrent: Infinity },
  global: { daily: 20000, concurrent: Infinity },
};
// Si una llamada muere sin liberar su hueco, se da por terminada pasado este tiempo (más que la llamada más lenta)
const LEASE_TTL_MS = 120_000;

const today = () => new Date().toISOString().slice(0, 10);

export class ToolQuota extends DurableObject {
  async state() {
    const stored = (await this.ctx.storage.get('state')) ?? { day: today(), used: 0, leases: {} };
    if (stored.day !== today()) Object.assign(stored, { day: today(), used: 0 });
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
    if (state.used + cost > limits.daily) return { ok: false, reason: 'quota' };
    const lease = crypto.randomUUID();
    state.used += cost;
    state.leases[lease] = Date.now();
    await this.ctx.storage.put('state', state);
    return { ok: true, lease, remaining: limits.daily - state.used };
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
