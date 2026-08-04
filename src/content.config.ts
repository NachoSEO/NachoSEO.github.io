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
    metrics: z
      .array(z.object({ value: z.string(), label: z.string(), delta: z.string().optional() }))
      .min(3)
      .max(4),
    problem: z.object({ intro: z.array(z.string()).min(1), pains: z.array(z.string()).min(3).max(5) }),
    approach: z.object({
      intro: z.array(z.string()).min(1),
      steps: z.array(z.object({ title: z.string(), detail: z.string() })).min(3).max(5),
    }),
    timeline: z
      .array(
        z.object({ period: z.string(), title: z.string(), bullets: z.array(z.string()).min(2).max(4) })
      )
      .min(3)
      .max(4),
    deliverables: z.array(z.object({ title: z.string(), detail: z.string() })).min(4).max(6),
    transformation: z
      .object({ before: z.array(z.string()), after: z.array(z.string()) })
      .optional(),
    packages: z
      .array(
        z.object({
          name: z.string(),
          forWho: z.string(),
          includes: z.array(z.string()),
          note: z.string().optional(),
          featured: z.boolean().default(false),
        })
      )
      .min(2)
      .max(3),
    comparison: z
      .object({
        options: z.array(z.object({ name: z.string(), me: z.boolean().default(false) })),
        rows: z.array(z.object({ criterion: z.string(), cells: z.array(z.string()) })),
      })
      .optional(),
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
      cover: image().optional(),
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
