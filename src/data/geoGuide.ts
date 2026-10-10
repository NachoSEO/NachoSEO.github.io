/** Guía GEO (/guia-geo/): partes, capítulos y estado de cada uno. Fuente única para la página y su índice.
    Para marcar un capítulo: status 'reservado' + author cuando el autor confirma; 'publicado' + href al publicarse. */
import type { ImageMetadata } from 'astro';

/** Fotos para los chips de autor: cualquier imagen de assets/img/consultores, por slug (clara-soteras…) */
const photoModules = import.meta.glob<{ default: ImageMetadata }>('../assets/img/consultores/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
export const authorPhotos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(photoModules).map(([path, mod]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.[a-z]+$/, ''),
    mod.default,
  ]),
);

export type ChapterStatus = 'disponible' | 'reservado' | 'edicion' | 'publicado';

export type GuideChapter = {
  number: number;
  title: string;
  summary: string;
  status: ChapterStatus;
  author?: { name: string; slug?: string };
  /** Enlace al capítulo una vez publicado */
  href?: string;
};

export type GuidePart = {
  title: string;
  question: string;
  /** Subsecciones de la parte; una sola sin título si la parte no se divide */
  groups: { title?: string; chapters: GuideChapter[] }[];
};

export const statusLabels: Record<ChapterStatus, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  edicion: 'En edición',
  publicado: 'Publicado',
};

export const guideMeta = {
  path: '/guia-geo/',
  title: 'Guía GEO: qué es el SEO para IA y cómo aparecer en ChatGPT, AI Overviews y AI Mode',
  shortTitle: 'Guía GEO',
  description:
    'Qué es el GEO (SEO para IA), cómo eligen sus fuentes ChatGPT, AI Overviews y AI Mode, qué puede hacer una web dentro y fuera de ella y cómo medirlo. Guía en construcción, escrita con SEO invitados.',
  started: '2026-10-10',
  updated: '2026-10-10',
};

export const guideParts: GuidePart[] = [
  {
    title: 'Cómo funciona',
    question: 'Qué pasa entre la pregunta y la respuesta',
    groups: [
      {
        chapters: [
          {
            number: 1,
            title: 'Anatomía de una respuesta: AI Overviews, AI Mode y ChatGPT por dentro',
            summary: 'De qué índice tira cada plataforma y cuándo responde de memoria.',
            status: 'disponible',
          },
          {
            number: 2,
            title: 'Query fan-out: las búsquedas que lanza la IA',
            summary: 'Cómo una pregunta se convierte en muchas búsquedas, y en qué idioma.',
            status: 'disponible',
          },
          {
            number: 3,
            title: 'Del documento a la frase: grounding y reranking',
            summary: 'Qué fragmento de una página acaba en la respuesta y por qué.',
            status: 'disponible',
          },
          {
            number: 4,
            title: 'Las patentes de AI Mode y AI Overviews, leídas',
            summary: 'Qué dicen, qué está confirmado y qué es inferencia.',
            status: 'disponible',
          },
          {
            number: 5,
            title: 'Memoria frente a búsqueda: a quién recomienda la IA',
            summary: 'Por qué la IA nombra a unas marcas y no a otras, y qué lo cambia.',
            status: 'disponible',
          },
          {
            number: 6,
            title: 'La IA en español: España y Latinoamérica',
            summary: 'Qué cambia cuando se pregunta en español y según el país.',
            status: 'disponible',
          },
        ],
      },
    ],
  },
  {
    title: 'Qué puedes hacer',
    question: 'En tu web y, sobre todo, fuera de ella',
    groups: [
      {
        title: 'En tu web',
        chapters: [
          {
            number: 7,
            title: 'Acceso técnico y logs de bots de IA',
            summary: 'Que la IA pueda llegar, leer y entender tu web, y saber cuándo lo hace.',
            status: 'disponible',
          },
          {
            number: 8,
            title: 'GEO en webs grandes: plantillas y escala',
            summary: 'Cómo se trabaja con millones de URLs y no página a página.',
            status: 'disponible',
          },
          {
            number: 9,
            title: 'Qué contenido elige citar la IA',
            summary: 'Qué crear y cómo producirlo sin caer en contenido commodity.',
            status: 'disponible',
          },
          {
            number: 10,
            title: 'GEO en ecommerce: feeds y compras con agentes',
            summary: 'Qué necesita una tienda para que la IA recomiende sus productos.',
            status: 'disponible',
          },
        ],
      },
      {
        title: 'Fuera de tu web',
        chapters: [
          {
            number: 11,
            title: 'La entidad: que la IA sepa quién eres',
            summary: 'Knowledge Graph, Wikipedia y coherencia entre fuentes.',
            status: 'disponible',
          },
          {
            number: 12,
            title: 'Menciones y digital PR para la IA',
            summary: 'Cómo conseguir que los medios que lee la IA hablen de ti.',
            status: 'reservado',
            author: { name: 'Andreas Niessen', slug: 'andreas-niessen' },
          },
          {
            number: 13,
            title: 'Enlaces en la era de la IA',
            summary: 'Qué aporta un enlace hoy y qué link building merece la pena.',
            status: 'disponible',
          },
          {
            number: 14,
            title: 'Listas, directorios, reseñas y comunidades',
            summary: 'Las fuentes de terceros que más cita la IA, y lo que es spam.',
            status: 'disponible',
          },
        ],
      },
    ],
  },
  {
    title: 'Medir',
    question: 'Cómo saber si lo que haces funciona',
    groups: [
      {
        chapters: [
          {
            number: 15,
            title: 'Medir la visibilidad en IA sin engañarse',
            summary: 'Muestras, ruido y qué mide de verdad una herramienta.',
            status: 'reservado',
            author: { name: 'Esteve Castells', slug: 'esteve-castells' },
          },
          {
            number: 16,
            title: 'Del tráfico de IA al negocio',
            summary: 'Atribución, tráfico oscuro y el CTR con AI Overviews.',
            status: 'disponible',
          },
          {
            number: 17,
            title: 'Experimentos en GEO con grupo de control',
            summary: 'Cómo saber si un cambio funcionó y no fue casualidad.',
            status: 'reservado',
            author: { name: 'Álvaro Peña', slug: 'alvaro-pena' },
          },
        ],
      },
    ],
  },
];
