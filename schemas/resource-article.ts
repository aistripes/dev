import { z } from 'zod';

export const ResourceArticleSchema = z.object({
  meta: z.object({
    content_type: z.literal('resource-article'),
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
    sections: z.array(
      z.object({
        heading: z.string(),
        items: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
              difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
              potential: z.enum(['high', 'medium', 'standard']).optional(),
            })
          )
          .min(10)
          .max(25),
      })
    ).min(3).max(5),
    pro_tips: z.array(z.string()).length(5),
  }),
});

export type ResourceArticle = z.infer<typeof ResourceArticleSchema>;
