import { z } from 'zod';

export const EditorialSchema = z.object({
  authored_by: z.string().min(1).optional(),
  reviewed_by: z.string().min(1).optional(),
  last_reviewed: z.iso.date().optional(),
  sources: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.url(),
        accessed_at: z.iso.date().optional(),
      })
    )
    .min(1)
    .optional(),
}).optional();
