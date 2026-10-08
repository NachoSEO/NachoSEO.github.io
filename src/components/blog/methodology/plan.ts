/**
 * Ejemplo del post de metodología: un theme con dos iniciativas y sus tareas, repartidas por equipo y semana.
 * Basado en el caso de Softonic (idiomas a ccTLDs tras un core update), simplificado e ilustrativo.
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
  title: 'Recuperar el tráfico perdido en el core update',
  okr: 'Volver al tráfico previo al core update en el dominio principal',
};

export const initiatives = [
  { title: 'Separar los idiomas en ccTLDs', metric: 'Tráfico orgánico por ccTLD' },
  { title: 'Revisar la calidad de las traducciones', metric: 'Páginas indexadas por idioma' },
];

export const tasks: Task[] = [
  { id: 'map', title: 'Mapa de redirecciones por idioma', team: 'seo', initiative: 0, planned: 1, start: 1, end: 1 },
  { id: 'switch', title: 'Selector de idioma y aviso de país', team: 'design', initiative: 0, planned: 1, start: 1, end: 1 },
  { id: 'audit-1', title: 'Auditar las traducciones de las fichas', team: 'content', initiative: 1, planned: 1, start: 1, end: 1 },
  { id: 'tracking', title: 'Medición por ccTLD', team: 'data', initiative: 0, planned: 2, start: 2, end: 2 },
  { id: 'audit-2', title: 'Auditar las traducciones de las categorías', team: 'content', initiative: 1, planned: 2, start: 2, end: 2 },
  { id: 'domains', title: 'Montar los ccTLDs', team: 'tech', initiative: 0, planned: 3, start: 3, end: 4 },
  { id: 'redirects', title: 'Redirecciones a los ccTLDs', team: 'tech', initiative: 0, planned: 4, start: 5, end: 5 },
  { id: 'hreflang', title: 'Hreflang entre los ccTLDs', team: 'seo', initiative: 0, planned: 4, start: 5, end: 5, hold: [4], blockedBy: 'Montar los ccTLDs' },
  { id: 'rewrite-1', title: 'Reescribir la plantilla de fichas', team: 'content', initiative: 1, planned: 5, start: 5, end: 5 },
  { id: 'rewrite-2', title: 'Reescribir la plantilla de categorías', team: 'content', initiative: 1, planned: 6, start: 6, end: 6 },
  { id: 'indexing', title: 'Revisar la indexación de los ccTLDs', team: 'seo', initiative: 0, planned: 6, start: 6, end: 6 },
];

export const weeks = 6;

/** Estado de una tarea en una semana dada */
export function statusAt(task: Task, week: number): Status {
  if (week > task.end) return 'done';
  if (task.hold?.includes(week)) return 'hold';
  if (week >= task.start) return 'doing';
  return 'todo';
}
