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

/**
 * Clave de cuota de una IP. En IPv6 cualquiera controla un /64 entero (millones de direcciones), así que
 * se cuenta el /64 como una sola IP; si no, bastaría con rotar direcciones para saltarse el límite
 */
export const quotaKey = (ip: string) => {
  if (!ip.includes(':')) return ip;
  const [head, tail = ''] = ip.toLowerCase().split('::');
  const headGroups = head ? head.split(':') : [];
  const tailGroups = tail ? tail.split(':') : [];
  const groups = ip.includes('::') ? [...headGroups, ...Array(Math.max(0, 8 - headGroups.length - tailGroups.length)).fill('0'), ...tailGroups] : headGroups;
  return `${groups.slice(0, 4).map((group) => group.replace(/^0+(?=.)/, '') || '0').join(':')}::/64`;
};

/** Lo que la Function apunta mientras trabaja: cuántas peticiones externas ha hecho de verdad */
export interface QuotaMeter {
  used: number;
}

/**
 * Reserva `cost` peticiones externas antes de ejecutar `run` y, cuando termina de enviarse la respuesta, libera el hueco y devuelve
 * lo que no se gastó. Errores: 429 busy (otra llamada en curso), 429 daily-quota, 429 global-quota.
 */
export const withQuota = async (
  context: { request: Request; env: QuotaEnv; waitUntil: (promise: Promise<unknown>) => void },
  cost: number,
  run: (meter: QuotaMeter) => Promise<Response>
) => {
  const { request, env, waitUntil } = context;
  if (!env.TOOL_QUOTA) return json({ error: 'unavailable' }, 503);
  const namespace = env.TOOL_QUOTA;
  const ip = quotaKey(request.headers.get('CF-Connecting-IP') ?? 'unknown');
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
  let released = false;
  const release = async () => {
    if (released) return;
    released = true;
    const refund = Math.max(0, cost - Math.max(0, Math.round(meter.used)));
    await Promise.all([perIp.release(ipLease.lease, refund), global.release(globalLease.lease, refund)]);
  };

  let response: Response;
  try {
    response = await run(meter);
  } catch (error) {
    await release();
    throw error;
  }
  if (!response.body) {
    await release();
    return response;
  }
  // El hueco se libera cuando termina de enviarse el cuerpo, no al devolver la respuesta: un sitemap de 20 MB
  // en streaming sigue ocupando su llamada hasta el final (o hasta que el cliente corta)
  const reader = response.body.getReader();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          // Con la respuesta ya enviada, Workers solo termina lo que se registra con waitUntil
          waitUntil(release());
        } else controller.enqueue(value);
      } catch (error) {
        controller.error(error);
        waitUntil(release());
      }
    },
    async cancel(reason) {
      await reader.cancel(reason).catch(() => {});
      waitUntil(release());
    },
  });
  return new Response(body, response);
};
