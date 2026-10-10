import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const langSchema = z.enum(['es', 'en']);

const faqSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  })
);

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    lang: langSchema,
    translationKey: z.string(),
    slug: z.string(),
    order: z.number(),
    proof: z.string(),
    faq: faqSchema,
    deliverables: z.array(z.object({ title: z.string(), detail: z.string() })).min(4).max(6),
    /** Página de servicio: para quién es, punto de vista, proceso, prueba y formatos */
    page: z
      .object({
        heroProof: z.string(),
        fit: z.object({
          yes: z.array(z.string()).min(3).max(5),
          no: z.array(z.string()).min(2).max(4),
        }),
        pov: z.object({ title: z.string(), paragraphs: z.array(z.string()).min(2).max(4) }),
        process: z
          .array(z.object({ when: z.string(), title: z.string(), detail: z.string() }))
          .min(3)
          .max(6),
        /** Casos enlazados como prueba; si está vacío, la página muestra docencia y charlas */
        proofCases: z.array(z.object({ caseKey: z.string(), summary: z.string() })).max(3).default([]),
        formats: z.array(z.object({ name: z.string(), detail: z.string() })).min(1).max(2),
        pricing: z.string(),
        availability: z.string().optional(),
        /** "Qué miro": lo que reviso en este servicio y otros suelen pasar por alto */
        checks: z.array(z.object({ title: z.string(), detail: z.string() })).min(4).max(6).optional(),
        /** Un ejemplo real del trabajo (entregable, diagnóstico o dato propio), con enlace opcional */
        example: z
          .object({
            title: z.string(),
            intro: z.string(),
            items: z.array(z.string()).max(6).default([]),
            note: z.string().optional(),
            link: z.object({ text: z.string(), href: z.string() }).optional(),
          })
          .optional(),
        /** Paso (índice desde 0) a partir del cual el proceso se repite: se marca como flujo constante */
        processLoopFrom: z.number().int().min(1).optional(),
        /** Enseña el rango de implicación (de consultoría guiada a trabajar dentro del equipo) */
        engagement: z.boolean().default(true),
        /** Lecturas relacionadas: posts, casos, skills o guías propios */
        related: z.array(z.object({ title: z.string(), href: z.string(), note: z.string() })).max(4).default([]),
      }),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      lang: langSchema,
      translationKey: z.string(),
      slug: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      /** 'seohacks': post recuperado del antiguo blog seohacks.es (2015–2017) */
      category: z.enum(['seohacks']).optional(),
      /** Indexable pero fuera de los listados del blog, la home, el RSS y los relacionados; solo se llega por enlace */
      unlisted: z.boolean().default(false),
      /** Portada 1200x630 (scripts/blog-covers.mjs): solo para compartir (og:image) y como image del JSON-LD */
      cover: image().optional(),
      /** Fuentes del post: se pintan en "Referencias" y van como `citation` en el JSON-LD */
      citations: z
        .array(
          z.object({
            title: z.string(),
            url: z.string().url(),
            author: z.string().optional(),
            publisher: z.string().optional(),
            date: z.string().optional(),
          })
        )
        .default([]),
    }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: langSchema,
    translationKey: z.string(),
    slug: z.string(),
    order: z.number(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
});

export const collections = { services, blog, caseStudies };
