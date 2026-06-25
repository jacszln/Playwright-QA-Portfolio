import { test, expect } from '../../src/fixtures/api.fixtures';
import { CommentListSchema } from '../../src/api/schemas/comment.schema';
import { KNOWN_IDS } from '../../src/data/testData';

test.describe('GET /comments', () => {
  test('returns only comments belonging to the requested post', async ({
    jsonPlaceholderClient,
  }) => {
    const response = await jsonPlaceholderClient.getCommentsByPostId(KNOWN_IDS.existingPostId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = CommentListSchema.safeParse(body);
    expect(result.success, result.success ? '' : result.error.message).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    for (const comment of body) {
      expect(comment.postId).toBe(KNOWN_IDS.existingPostId);
    }
  });

  test('returns an empty list for a post that does not exist', async ({
    jsonPlaceholderClient,
  }) => {
    const response = await jsonPlaceholderClient.getCommentsByPostId(KNOWN_IDS.nonExistentId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual([]);
  });
});
