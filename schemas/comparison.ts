import { z } from 'zod';

export const ComparisonSchema = z.object({
  meta: z.object({
    content_type: z.literal('comparison'),
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
    options: z
      .array(
        z.object({
          name: z.string(),
          tagline: z.string(),
          url: z.url().optional(),
          best_for: z.string(),
        })
      )
      .min(2)
      .max(6),
    criteria: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          values: z.record(z.string(), z.string()),
          winner: z.string().optional(),
        })
      )
      .min(8)
      .max(15),
    verdict: z.object({
      summary: z.string(),
      use_cases: z.array(
        z.object({
          scenario: z.string(),
          recommendation: z.string(),
          reason: z.string(),
        })
      ),
    }),
  }),
});

export type Comparison = z.infer<typeof ComparisonSchema>;
