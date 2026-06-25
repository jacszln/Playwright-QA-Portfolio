import { test, expect } from '../../src/fixtures/api.fixtures';
import {
  PostSchema,
  PostListSchema,
  CreatedPostSchema,
  NewPostSchema,
  type NewPost,
} from '../../src/api/schemas/post.schema';
import { KNOWN_IDS, buildNewPost } from '../../src/data/testData';

test.describe('GET /posts', () => {
  test('returns a list of posts matching the contract', async ({ jsonPlaceholderClient }) => {
    const response = await jsonPlaceholderClient.getPosts();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    const result = PostListSchema.safeParse(body);
    expect(result.success, formatZodError(result)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('filters posts by userId', async ({ jsonPlaceholderClient }) => {
    const response = await jsonPlaceholderClient.getPosts({ userId: KNOWN_IDS.existingUserId });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(PostListSchema.safeParse(body).success).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const post of body) {
      expect(post.userId).toBe(KNOWN_IDS.existingUserId);
    }
  });
});

test.describe('GET /posts/:id', () => {
  test('returns a single post matching the contract', async ({ jsonPlaceholderClient }) => {
    const response = await jsonPlaceholderClient.getPostById(KNOWN_IDS.existingPostId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = PostSchema.safeParse(body);
    expect(result.success, formatZodError(result)).toBe(true);
    expect(body.id).toBe(KNOWN_IDS.existingPostId);
  });

  test('returns 404 for a non-existent post', async ({ jsonPlaceholderClient }) => {
    const response = await jsonPlaceholderClient.getPostById(KNOWN_IDS.nonExistentId);

    expect(response.status()).toBe(404);
  });
});

test.describe('POST /posts', () => {
  test('creates a post and echoes the payload back with a generated id', async ({
    jsonPlaceholderClient,
  }) => {
    const payload = buildNewPost();
    const response = await jsonPlaceholderClient.createPost(payload);

    expect(response.status()).toBe(201);
    const body = await response.json();
    const result = CreatedPostSchema.safeParse(body);
    expect(result.success, formatZodError(result)).toBe(true);
    expect(body).toMatchObject(payload);
  });

  test('still echoes back a payload that is missing a required field', async ({
    jsonPlaceholderClient,
  }) => {
    // JSONPlaceholder is a fake API and never validates the request body server-side,
    // so this documents that consumers cannot rely on it to enforce the contract.
    // Client-side schema validation (NewPostSchema) is what actually catches this.
    const incompletePayload = { title: 'Missing body and userId' };
    const malformedResult = NewPostSchema.safeParse(incompletePayload);
    expect(malformedResult.success).toBe(false);

    const response = await jsonPlaceholderClient.createPost(
      incompletePayload as unknown as NewPost,
    );
    expect(response.status()).toBe(201);
  });
});

function formatZodError(result: { success: boolean; error?: { message: string } }): string {
  return result.success ? '' : `Schema validation failed: ${result.error?.message}`;
}
