import 'dotenv/config';

/**
 * Centralized environment configuration. Every value has a public-internet
 * default so the suite runs with zero setup; `.env` only overrides them.
 */
const processEnv = (globalThis as any).process?.env ?? {};

export const env = {
  jsonPlaceholderBaseUrl:
    processEnv.JSONPLACEHOLDER_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  hackerNewsBaseUrl: processEnv.HACKERNEWS_BASE_URL ?? 'https://news.ycombinator.com',
  hackerNewsSearchBaseUrl: processEnv.HACKERNEWS_SEARCH_BASE_URL ?? 'https://hn.algolia.com',
  apiTimeoutMs: Number(processEnv.API_TIMEOUT_MS ?? 15_000),
  isCi: Boolean(processEnv.CI),
} as const;
