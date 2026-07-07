import 'dotenv/config';

/**
 * Centralized environment configuration. Every value has a public-internet
 * default so the suite runs with zero setup; `.env` only overrides them.
 */
export const env = {
  jsonPlaceholderBaseUrl:
    process.env.JSONPLACEHOLDER_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  hackerNewsBaseUrl: process.env.HACKERNEWS_BASE_URL ?? 'https://news.ycombinator.com',
  hackerNewsSearchBaseUrl: process.env.HACKERNEWS_SEARCH_BASE_URL ?? 'https://hn.algolia.com',
  apiTimeoutMs: Number(process.env.API_TIMEOUT_MS ?? 15_000),
  isCi: Boolean(process.env.CI),
} as const;
