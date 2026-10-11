/**
 * Cuotas de las herramientas (Durable Object ToolQuota del Worker workers/tool-guard):
 * límite diario y llamadas simultáneas por IP, y un límite diario global. Sin el binding no se hace
 * ninguna petición: si la cuota no se puede comprobar, la herramienta falla cerrada.
 */
import { json } from './safe-fetch';

interface QuotaStub {
  acquire(cost: number, scope: 'ip' | 'global'): Promise<{ ok: true; lease: string; remaining: number } | { ok: false; reason: string }>;
  release(lease: string, refund: number): Promise<void>;
}

interface QuotaNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): QuotaStub;
}

export interface QuotaEnv {
  TOOL_QUOTA?: QuotaNamespace;
}

/** Lo que la Function apunta mientras trabaja: cuántas peticiones externas ha hecho de verdad */
export interface QuotaMeter {
  used: number;
}

/**
 * Reserva `cost` peticiones externas antes de ejecutar `run` y, al terminar, libera el hueco y devuelve
 * lo que no se gastó. Errores: 429 busy (otra llamada en curso), 429 daily-quota, 429 global-quota.
 */
export const withQuota = async (request: Request, env: QuotaEnv, cost: number, run: (meter: QuotaMeter) => Promise<Response>) => {
  if (!env.TOOL_QUOTA) return json({ error: 'unavailable' }, 503);
  const namespace = env.TOOL_QUOTA;
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const perIp = namespace.get(namespace.idFromName(`ip:${ip}`));
  const global = namespace.get(namespace.idFromName('global'));

  const ipLease = await perIp.acquire(cost, 'ip');
  if (!ipLease.ok) return json({ error: ipLease.reason === 'busy' ? 'busy' : 'daily-quota' }, 429);
  const globalLease = await global.acquire(cost, 'global');
  if (!globalLease.ok) {
    await perIp.release(ipLease.lease, cost);
    return json({ error: 'global-quota' }, 429);
  }

  const meter: QuotaMeter = { used: cost };
  try {
    return await run(meter);
  } finally {
    const refund = Math.max(0, cost - Math.max(0, Math.round(meter.used)));
    await Promise.all([perIp.release(ipLease.lease, refund), global.release(globalLease.lease, refund)]);
  }
};
