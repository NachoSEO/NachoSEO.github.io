/** Textos de la tabla de URLs que comparten el comprobador de redirecciones y el auditor de sitemap */
import type { Lang } from '../i18n/ui';
import type { TraceTableLabels } from '../lib/trace-table';

export const traceLabels: Record<Lang, TraceTableLabels> = {
  es: {
    url: 'URL',
    status: 'Estado',
    chain: 'Saltos',
    issues: 'Avisos',
    noIssues: 'Sin avisos',
    issueText: {
      error: 'No responde.',
      'client-error': 'Termina en un error 4xx.',
      'server-error': 'Termina en un error 5xx.',
      chain: 'Cadena de redirecciones: enlaza directamente al destino final.',
      temporary: 'Redirección temporal (302/303/307): si el cambio es definitivo, usa 301 o 308.',
      loop: 'Bucle de redirecciones.',
      'meta-refresh': 'Redirige con meta refresh: Google lo sigue, pero recomienda redirigir desde el servidor.',
      noindex: 'Lleva noindex.',
      canonical: 'Su canonical apunta a otra URL.',
      downgrade: 'Una redirección pasa de https a http.',
    },
    errorText: {
      timeout: 'Sin respuesta',
      network: 'Error de red',
      loop: 'Bucle',
      'too-many-redirects': 'Demasiadas',
      'invalid-url': 'URL no válida',
      'blocked-url': 'No pública',
    },
  },
  en: {
    url: 'URL',
    status: 'Status',
    chain: 'Hops',
    issues: 'Issues',
    noIssues: 'No issues',
    issueText: {
      error: 'No response.',
      'client-error': 'Ends in a 4xx error.',
      'server-error': 'Ends in a 5xx error.',
      chain: 'Redirect chain: link straight to the final URL.',
      temporary: 'Temporary redirect (302/303/307): if the move is permanent, use 301 or 308.',
      loop: 'Redirect loop.',
      'meta-refresh': 'Redirects with meta refresh: Google follows it, but recommends server-side redirects.',
      noindex: 'Carries noindex.',
      canonical: 'Its canonical points to another URL.',
      downgrade: 'A redirect goes from https to http.',
    },
    errorText: {
      timeout: 'No response',
      network: 'Network error',
      loop: 'Loop',
      'too-many-redirects': 'Too many',
      'invalid-url': 'Invalid URL',
      'blocked-url': 'Not public',
    },
  },
};
