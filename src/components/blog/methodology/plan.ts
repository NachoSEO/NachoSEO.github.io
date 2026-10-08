/**
 * Ejemplo del post de metodología: un theme con dos iniciativas y sus tareas, repartidas por equipo y semana.
 * Basado en el caso de Softonic (idiomas a ccTLDs tras un core update), simplificado e ilustrativo.
 * Lo usan el esquema de niveles y la vista Tablero/Gantt, así los dos cuentan lo mismo.
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
  title: string;
  team: Team;
  /** Semana del plan en la que empieza y acaba (una tarea cabe en una semana) */
  start: number;
  end: number;
  status: Status;
  note?: string;
}

export interface Initiative {
  title: string;
  metric: string;
  tasks: Task[];
}

export const theme = {
  title: 'Recuperar el tráfico perdido en el core update',
  okr: 'Volver al nivel de tráfico anterior al core update en el dominio principal',
};

export const initiatives: Initiative[] = [
  {
    title: 'Separar los idiomas en ccTLDs',
    metric: 'Tráfico orgánico por ccTLD',
    tasks: [
      { title: 'Mapa de redirecciones por idioma', team: 'seo', start: 1, end: 1, status: 'done' },
      { title: 'Selector de idioma y aviso de país', team: 'design', start: 1, end: 1, status: 'done' },
      { title: 'Medición por ccTLD en analítica y Search Console', team: 'data', start: 2, end: 2, status: 'done' },
      { title: 'Montar los ccTLDs', team: 'tech', start: 3, end: 3, status: 'doing', note: 'Va una semana tarde' },
      { title: 'Redirecciones a los ccTLDs', team: 'tech', start: 4, end: 4, status: 'doing' },
      { title: 'Hreflang entre los ccTLDs', team: 'seo', start: 4, end: 4, status: 'hold', note: 'Espera a que estén los ccTLDs' },
      { title: 'Revisar la indexación de los ccTLDs', team: 'seo', start: 6, end: 6, status: 'todo' },
    ],
  },
  {
    title: 'Revisar la calidad de las traducciones',
    metric: 'Páginas indexadas por idioma',
    tasks: [
      { title: 'Auditar las traducciones de las fichas', team: 'content', start: 1, end: 1, status: 'done' },
      { title: 'Auditar las traducciones de las categorías', team: 'content', start: 2, end: 2, status: 'done' },
      { title: 'Reescribir la plantilla de fichas', team: 'content', start: 5, end: 5, status: 'todo' },
      { title: 'Reescribir la plantilla de categorías', team: 'content', start: 6, end: 6, status: 'todo' },
    ],
  },
];

export const weeks = 6;
/** Semana en la que está "parado" el ejemplo del tablero */
export const currentWeek = 4;
