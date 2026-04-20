import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string(),
    start: z.string(),      // e.g. "Apr 2025"
    end: z.string(),        // e.g. "Oct 2025" or "Present"
    order: z.number(),      // lower = more recent / shown first
    summary: z.string(),    // one-line impact
    bullets: z.array(z.string()).min(1)
  })
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kind: z.enum(['research', 'product', 'thesis', 'open-source']),
    year: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    order: z.number()
  })
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    authors: z.string(),
    year: z.number(),
    title: z.string(),
    venue: z.string(),
    kind: z.enum(['paper', 'poster', 'book']),
    order: z.number()
  })
});

export const collections = { work, projects, publications };
