/**
 * Cuotas de las herramientas que hacen peticiones a otras webs. Una instancia del Durable Object por IP
 * ("ip:<ip>") y otra global ("global"). La unidad es una petición a una web externa.
 * Cada instancia procesa sus llamadas de una en una, así que los contadores no tienen carreras.
 */
import { DurableObject } from 'cloudflare:workers';

const LIMITS = {
  ip: { daily: 1000, concurrent: 2 },
  global: { daily: 20000, concurrent: Infinity },
};
// Si una llamada muere sin liberar su hueco, se da por terminada pasado este tiempo
const LEASE_TTL_MS = 60_000;

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
