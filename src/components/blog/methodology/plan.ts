/**
 * Ejemplo del post de metodología: un theme con dos iniciativas y sus tareas, repartidas por equipo y semana.
 * El mismo ecommerce de los puntos 2 y 3 del post: las fichas no se indexan porque los filtros se llevan el rastreo.
 * Simplificado e ilustrativo.
 * Cada tarea tiene la semana planificada y la real, así el explorador puede enseñar retrasos y bloqueos.
 */
export type Team = 'seo' | 'tech' | 'design' | 'data' | 'content';
export type Status = 'todo' | 'doing' | 'hold' | 'done';

export const teams: Record<Team, { label: string; color: string }> = {
  seo: { label: 'SEO', color: '#c8073f' },
  tech: { label: 'Tecnología', color: '#14333f' },
  design: { label: 'Diseño', color: '#1f7a8c' },
  data: { label: 'Datos', color: '#9a6b05' },
  content: { label: 'Contenido', color: '#6b5ca5' },
};

export const statuses: { id: Status; label: string }[] = [
  { id: 'todo', label: 'Por hacer' },
  { id: 'doing', label: 'En curso' },
  { id: 'hold', label: 'En espera' },
  { id: 'done', label: 'Hecho' },
];

export interface Task {
  id: string;
  title: string;
  team: Team;
  initiative: 0 | 1;
  /** Semana planificada (una tarea cabe en una semana) */
  planned: number;
  /** Semanas en las que de verdad se trabajó */
  start: number;
  end: number;
  /** Semanas en las que estuvo bloqueada por otra tarea */
  hold?: number[];
  blockedBy?: string;
}

export const theme = {
  title: 'Que Google indexe y posicione las fichas de producto',
  /** Resultados clave en absoluto, del punto de partida al objetivo */
  keyResults: [
    'Fichas indexadas: de 19.700 a 38.400',
    'Margen bruto orgánico de las fichas: de 36.400 € a 53.400 € al mes',
  ],
};

export const initiatives = [
  { title: 'Liberar el rastreo de los filtros', metric: 'Visitas de Googlebot a fichas frente a filtros (logs)' },
  { title: 'Reforzar el enlazado a las fichas', metric: 'Fichas indexadas (Search Console)' },
];

export const tasks: Task[] = [
  { id: 'filters-map', title: 'Mapa de filtros con y sin demanda', team: 'seo', initiative: 0, planned: 1, start: 1, end: 1 },
  { id: 'logs-panel', title: 'Panel de logs por page type', team: 'data', initiative: 0, planned: 1, start: 1, end: 1 },
  { id: 'related-design', title: 'Diseño del bloque de productos relacionados', team: 'design', initiative: 1, planned: 1, start: 1, end: 1 },
  { id: 'links-audit', title: 'Auditar el enlazado interno a fichas', team: 'seo', initiative: 1, planned: 2, start: 2, end: 2 },
  { id: 'blog-links', title: 'Enlazar los posts del blog a categorías y fichas', team: 'content', initiative: 1, planned: 2, start: 2, end: 2 },
  { id: 'noindex', title: 'Noindex en los filtros sin demanda', team: 'tech', initiative: 0, planned: 3, start: 3, end: 4 },
  { id: 'robots', title: 'Bloquear en robots.txt las combinaciones de filtros', team: 'tech', initiative: 0, planned: 4, start: 5, end: 5 },
  { id: 'logs-check', title: 'Revisar en los logs el rastreo de fichas', team: 'seo', initiative: 0, planned: 4, start: 5, end: 5, hold: [4], blockedBy: 'Noindex en los filtros' },
  { id: 'related-dev', title: 'Programar el bloque de relacionados', team: 'tech', initiative: 1, planned: 5, start: 6, end: 6 },
  { id: 'sitemap', title: 'Sitemap solo con fichas indexables', team: 'seo', initiative: 1, planned: 6, start: 6, end: 6 },
  { id: 'indexing-report', title: 'Indexación de fichas por categoría', team: 'data', initiative: 1, planned: 6, start: 6, end: 6 },
];

export const weeks = 6;

/** Estado de una tarea en una semana dada */
export function statusAt(task: Task, week: number): Status {
  if (week > task.end) return 'done';
  if (task.hold?.includes(week)) return 'hold';
  if (week >= task.start) return 'doing';
  return 'todo';
}
