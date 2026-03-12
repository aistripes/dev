import { z } from 'zod';

export const ToolPageSchema = z.object({
  meta: z.object({
    content_type: z.literal('tool-page'),
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
    headline: z.string(),
    description: z.string(),
    tool_type: z.enum(['generator', 'calculator', 'checker', 'formatter', 'analyzer']),
    inputs: z.array(
      z.object({
        name: z.string(),
        label: z.string(),
        type: z.enum(['text', 'textarea', 'select', 'number', 'checkbox', 'url']),
        placeholder: z.string().optional(),
        options: z.array(z.string()).optional(),
        required: z.boolean().default(false),
      })
    ),
    examples: z.array(
      z.object({
        label: z.string(),
        input: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
      })
    ),
    how_it_works: z.string(),
    related_tools: z.array(z.string()).optional(),
  }),
});

export type ToolPage = z.infer<typeof ToolPageSchema>;
