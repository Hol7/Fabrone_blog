import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { rubriques } from './site';

const typo = (s: string) => s.replace(/'/g, '’'); // apostrophes typographiques, comme dans le corps du texte

const posts = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().transform(typo),
    description: z.string().transform(typo),
    date: z.coerce.date(),
    language: z.enum(['fr', 'en']).default('fr'),
    translationKey: z.string().nullish(),
    order: z.number().int().nonnegative().default(0),
    category: z.enum(Object.keys(rubriques) as [string, ...string[]]),
    cover: z.string().nullish(),
    coverAlt: z.string().nullish(),
    credit: z.string().nullish(),
    audio: z.string().nullish(),
    video: z.string().nullish(),
    videoFile: z.string().nullish(),
    chartTitle: z.string().nullish(),
    chart: z.array(z.object({ label: z.string(), value: z.number().nonnegative() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
