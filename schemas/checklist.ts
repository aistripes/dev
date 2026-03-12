import { z } from 'zod';

export const ChecklistSchema = z.object({
  meta: z.object({
    content_type: z.literal('checklist'),
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
    sections: z
      .array(
        z.object({
          heading: z.string(),
          items: z
            .array(
              z.object({
                title: z.string(),
                description: z.string(),
                priority: z.enum(['critical', 'recommended', 'optional']),
              })
            )
            .min(5)
            .max(10),
        })
      )
      .min(5)
      .max(8),
  }),
});

export type Checklist = z.infer<typeof ChecklistSchema>;
