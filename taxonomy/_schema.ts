import { z } from 'zod';

export const NicheDefinitionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  category: z.enum(['frameworks', 'ai-patterns', 'infrastructure', 'verticals', 'seo-content']),
  context: z.object({
    audience: z.string().min(20),
    pain_points: z.array(z.string()).min(4),
    monetization: z.array(z.string()).min(2),
    tools_and_stack: z.array(z.string()).min(3),
    content_that_works: z.array(z.string()).min(2),
    subtopics: z.array(z.string()).min(3),
    adjacent_niches: z.array(z.string()).min(2),
  }),
});

export type NicheDefinition = z.infer<typeof NicheDefinitionSchema>;
