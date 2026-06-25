import { z } from 'zod';

/** Contract for a single JSONPlaceholder /posts resource. */
export const PostSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const PostListSchema = z.array(PostSchema);

export type Post = z.infer<typeof PostSchema>;

/** Payload accepted by POST /posts. The API echoes it back with a generated id. */
export const NewPostSchema = PostSchema.omit({ id: true });

export type NewPost = z.infer<typeof NewPostSchema>;

/** JSONPlaceholder always mocks creation with id 101, regardless of payload. */
export const CreatedPostSchema = PostSchema;
