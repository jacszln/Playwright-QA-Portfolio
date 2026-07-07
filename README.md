# Playwright QA Portfolio

[![Playwright Tests](https://github.com/jacszln/Playwright-QA-Portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/jacszln/Playwright-QA-Portfolio/actions/workflows/playwright.yml)

Test automation suite built with **Playwright + TypeScript**, covering both **API contract testing** and **UI end-to-end testing**.

| Surface | Target                                                  | Covers                                                                                |
| ------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **API** | [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Schema/contract validation, status codes, filtering, error paths (`zod`)              |
| **E2E** | [Hacker News](https://news.ycombinator.com)             | Page Object Model, cross-browser UI testing, dynamic content, cross-origin navigation |

No accounts, no API keys, no test data setup required.

```bash
npm install
npx playwright test
npx playwright show-report
```

## Structure

```
src/
├── api/
│   ├── clients/          # Thin HTTP wrappers around APIRequestContext (one per resource)
│   └── schemas/          # zod schemas for each resource
├── pages/                # Page Object Model, one class per HN page/route
├── components/           # UI fragments shared across pages (e.g. the story list table)
├── fixtures/             # Playwright fixtures that inject clients/pages into tests
├── data/                 # Test data builders & known fixed IDs
└── config/               # Environment configuration with public defaults

tests/
├── api/                  # Contract tests, one spec file per resource
└── e2e/                  # UI tests, one spec file per user-facing concern
```

A few notes on how the pieces fit together:

- Hacker News reuses the same `tr.athing` story table markup on the front page, `/newest`, `/show`, `/ask` and `/front`. `HackerNewsListingPage` holds what's shared (nav links, the story table, search); `HomePage` and `NewestPage` just set the route. The table itself lives in [`StoryListComponent`](src/components/StoryListComponent.ts) since indexing into repeated rows is a different concern from a page's own locators.
- Tests ask for fixtures like `jsonPlaceholderClient`, `homePage`, or `itemPage` as parameters instead of importing and constructing them directly. See [`api.fixtures.ts`](src/fixtures/api.fixtures.ts) and [`pages.fixtures.ts`](src/fixtures/pages.fixtures.ts).
- Each JSONPlaceholder resource (`Post`, `User`, `Comment`) has a [`zod`](https://zod.dev) schema in `src/api/schemas/`. Tests call `Schema.safeParse(body)` instead of asserting field by field.
- Page objects return raw data (`number | null`, etc.) and never assert on their own; the test decides what a missing value means (a job posting legitimately has no score, for example).
- [`src/config/env.ts`](src/config/env.ts) reads from `process.env`, but every value already has a working default pointing at the public APIs, so a `.env` file is optional.
- `playwright.config.ts` defines one `api` project and three `e2e-*` projects (Chromium/Firefox/WebKit). `npx playwright test` with no flags runs all four.
- Hacker News throttles concurrent traffic from the same client, so `workers` is capped and a local retry is enabled to absorb the occasional "Sorry, we're not able to serve your requests this quickly" response.

## Test coverage

**API, JSONPlaceholder** ([tests/api/](tests/api/))

- `posts.spec.ts`: list + schema validation, filter by `userId`, get-by-id, 404 on a non-existent id, create (`POST`) with payload echo validation, and a case showing the fake API never enforces its own contract server-side (client-side `zod` validation is what catches a malformed payload)
- `users.spec.ts`: list + schema validation (including nested `address`/`company` objects), get-by-id, 404 on a non-existent id
- `comments.spec.ts`: comments scoped correctly to a `postId`, empty-array behavior for a non-existent post

**E2E, Hacker News** ([tests/e2e/](tests/e2e/))

- `navigation.spec.ts`: top nav exposes the full documented link set; `new` routes to `/newest`; the logo returns to the front page from elsewhere in the site
- `listing.spec.ts`: front page renders a non-empty, sequentially-ranked story list; every story has a title and a link; points/comment counts are sane when present; the "More" pagination link continues the rank sequence onto the next page
- `item.spec.ts`: a story's `/item` page shows the same title as its front-page entry; points and comment/discuss affordances render in a well-formed shape
- `search.spec.ts`: the footer search form crosses over from `news.ycombinator.com` to the separate `hn.algolia.com` origin and returns results; a nonsense query renders a "no results" state instead of stale results

Assertions target structural invariants (non-empty, well-formed, correctly scoped) rather than exact live values, since both target sites serve real, constantly-changing content.

## Running the suite

```bash
npx playwright test                    # everything: api + all 3 browsers
npm run test:api                       # API contract tests only
npm run test:e2e                       # E2E across Chromium, Firefox, WebKit
npm run test:e2e:chromium              # E2E, single browser (fastest feedback loop)
npm run test:headed                    # E2E with a visible browser window
npm run test:debug                     # Playwright Inspector, step through a test
```

Quality gates, run the same way locally and in CI:

```bash
npm run typecheck                      # tsc --noEmit
npm run lint                           # ESLint (flat config, typescript-eslint)
npm run format:check                   # Prettier
```

## Reading the report

```bash
npm run report
```

The HTML reporter shows a pass/fail summary per project (`api`, `e2e-chromium`, `e2e-firefox`, `e2e-webkit`), each test expandable into its step-by-step trace. On failure it also attaches a screenshot, a video of the run, and a full Playwright Trace Viewer recording (network, console, DOM snapshots), via `trace: 'retain-on-failure'` in `playwright.config.ts`.

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs lint, type checking, and the full test suite on every push and pull request to `main`, and publishes the HTML report as a downloadable workflow artifact.

## Stack

|                      |                                 |
| -------------------- | ------------------------------- |
| Test runner          | `@playwright/test`              |
| Language             | TypeScript (strict mode)        |
| Schema validation    | `zod`                           |
| Linting / formatting | ESLint (flat config) + Prettier |
| CI                   | GitHub Actions                  |
