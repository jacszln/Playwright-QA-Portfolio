import type { NewPost } from '../api/schemas/post.schema';

/** Known-good fixed IDs that exist on JSONPlaceholder's seeded dataset. */
export const KNOWN_IDS = {
  existingPostId: 1,
  existingUserId: 1,
  nonExistentId: 999_999,
} as const;

/** Builder for POST /posts payloads. Override only what a test cares about. */
export function buildNewPost(overrides: Partial<NewPost> = {}): NewPost {
  return {
    title: 'Senior QA Engineer - Playwright Portfolio',
    body: 'This post was created by an automated contract test against JSONPlaceholder.',
    userId: 1,
    ...overrides,
  };
}

/** Search terms exercised against Hacker News / Algolia search. */
export const SEARCH_TERMS = {
  withResults: 'playwright',
  withNoResults: 'zzzznoresultsxyzqwerty123456',
} as const;
