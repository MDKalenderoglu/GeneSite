import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createWritingIdGenerator } from './lib/content-identity';
import { writingSchema } from './lib/writing-schema';

const generateWritingId = createWritingIdGenerator();
const writingsBase =
  process.env.GENESITE_TEST_WRITINGS_BASE ?? './src/content/writings';

const writings = defineCollection({
  loader: glob({
    pattern: '**/*.(md|mdx)',
    base: writingsBase,
    generateId: generateWritingId,
  }),
  schema: z.lazy(() => writingSchema),
});

export const collections = { writings };
