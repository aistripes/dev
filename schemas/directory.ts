import { z } from 'zod';

export const DirectorySchema = z.object({
  meta: z.object({
    content_type: z.literal('directory'),
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
    filter_dimensions: z.array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
      })
    ),
    entries: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          url: z.url(),
          category: z.string(),
          pricing_model: z.enum(['free', 'freemium', 'paid', 'open-source', 'enterprise']),
          pros: z.array(z.string()).min(2).max(5),
          cons: z.array(z.string()).min(1).max(4),
          tags: z.array(z.string()),
        })
      )
      .min(10)
      .max(50),
  }),
});

export type Directory = z.infer<typeof DirectorySchema>;
