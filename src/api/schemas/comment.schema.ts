import { z } from 'zod';

/** Contract for a single JSONPlaceholder /comments resource. */
export const CommentSchema = z.object({
  id: z.number().int().positive(),
  postId: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
});

export const CommentListSchema = z.array(CommentSchema);

export type Comment = z.infer<typeof CommentSchema>;
