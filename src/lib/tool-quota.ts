/**
 * Cuotas de las herramientas (Durable Object ToolQuota del Worker workers/tool-guard):
 * límite diario y llamadas simultáneas por IP, y un límite diario global. Sin el binding no se hace
 * ninguna petición: si la cuota no se puede comprobar, la herramienta falla cerrada.
 */
import { json } from './safe-fetch';

interface QuotaStub {
  acquire(cost: number, scope: 'ip' | 'site' | 'global'): Promise<{ ok: true; lease: string; remaining: number } | { ok: false; reason: string }>;
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
  /** Peticiones hechas a cada web de destino reservada (si falta una, se da por gastado lo reservado) */
  sites: Map<string, number>;
}

/**
 * Reserva `cost` peticiones externas antes de ejecutar `run` y, cuando termina de enviarse la respuesta, libera el hueco y devuelve
 * lo que no se gastó. Errores: 429 busy (otra llamada en curso), 429 daily-quota, 429 target-quota, 429 global-quota.
 */
export const withQuota = async (
  context: { request: Request; env: QuotaEnv; waitUntil: (promise: Promise<unknown>) => void },
  cost: number,
  run: (meter: QuotaMeter) => Promise<Response>,
  /** Webs de destino (siteOf) con lo que se reserva para cada una */
  sites: Map<string, number> = new Map()
) => {
  const { request, env, waitUntil } = context;
  if (!env.TOOL_QUOTA) return json({ error: 'unavailable' }, 503);
  const namespace = env.TOOL_QUOTA;
  const ip = quotaKey(request.headers.get('CF-Connecting-IP') ?? 'unknown');
  const leases: { stub: QuotaStub; lease: string; reserved: number; site?: string }[] = [];
  const releaseAll = (refundOf: (entry: (typeof leases)[number]) => number) =>
    Promise.all(leases.map((entry) => entry.stub.release(entry.lease, refundOf(entry))));

  const take = async (name: string, scope: 'ip' | 'site' | 'global', reserved: number, site?: string) => {
    const stub = namespace.get(namespace.idFromName(name));
    const result = await stub.acquire(reserved, scope);
    if (result.ok) leases.push({ stub, lease: result.lease, reserved, site });
    return result;
  };

  const ipLease = await take(`ip:${ip}`, 'ip', cost);
  if (!ipLease.ok) return json({ error: ipLease.reason === 'busy' ? 'busy' : 'daily-quota' }, 429);
  for (const [site, reserved] of sites) {
    if (!(await take(`site:${site}`, 'site', reserved, site)).ok) {
      await releaseAll((entry) => entry.reserved);
      return json({ error: 'target-quota' }, 429);
    }
  }
  if (!(await take('global', 'global', cost)).ok) {
    await releaseAll((entry) => entry.reserved);
    return json({ error: 'global-quota' }, 429);
  }

  const meter: QuotaMeter = { used: cost, sites: new Map() };
  let released = false;
  const release = async () => {
    if (released) return;
    released = true;
    const used = Math.max(0, Math.round(meter.used));
    await releaseAll((entry) =>
      Math.max(0, entry.reserved - (entry.site ? Math.round(meter.sites.get(entry.site) ?? entry.reserved) : used))
    );
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
