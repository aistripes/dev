import { z } from 'zod';

export const GuideSchema = z.object({
  meta: z.object({
    content_type: z.literal('guide'),
    niche: z.string(),
    generated_at: z.iso.datetime(),
    schema_version: z.string(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string().max(160),
    keywords: z.array(z.string()),
    slug: z.string(),
  }),
  content: z.object({
    intro: z.string(),
    estimated_time: z.string(),
    prerequisites: z.array(z.string()),
    steps: z
      .array(
        z.object({
          number: z.number().int().positive(),
          title: z.string(),
          explanation: z.string(),
          code: z
            .object({
              language: z.string(),
              content: z.string(),
              filename: z.string().optional(),
            })
            .optional(),
          pitfalls: z.array(z.string()).optional(),
        })
      )
      .min(5)
      .max(10),
    conclusion: z.string(),
  }),
});

export type Guide = z.infer<typeof GuideSchema>;
