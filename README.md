# Playwright QA Portfolio

A full-stack test automation suite built with **Playwright + TypeScript**, demonstrating both **API contract testing** and **UI end-to-end testing** in a single, professionally structured project.

| Surface | Target                                                  | What it proves                                                                                   |
| ------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **API** | [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Schema/contract validation, status codes, filtering, error paths using `zod`                     |
| **E2E** | [Hacker News](https://news.ycombinator.com)             | Page Object Model, cross-browser UI testing, dynamic content assertions, cross-origin navigation |

No accounts, no API keys, no test data setup. Clone it and run it.

```bash
npm install
npx playwright test
npx playwright show-report
```

---

## Why this project exists

Most "Playwright portfolio" repos pick one lane: either a thin API smoke test or a UI click-through. This one is structured the way a senior QA engineer would organize a real test framework that has to support _both_ surfaces long-term: shared config and conventions, but cleanly separated concerns per layer.

## Architecture

```
src/
├── api/
│   ├── clients/          # Thin HTTP wrappers around APIRequestContext (one per resource)
│   └── schemas/          # zod schemas = the contract. Tests assert against these, not ad-hoc checks.
├── pages/                # Page Object Model, one class per HN page/route
├── components/           # Reusable UI fragments shared across pages (e.g. the story list table)
├── fixtures/             # Playwright fixtures that inject clients/pages into tests (DI, not imports)
├── data/                 # Centralized test data builders & known fixed IDs
└── config/               # Environment configuration with safe public defaults

tests/
├── api/                  # Contract tests, one spec file per resource
└── e2e/                  # UI tests, one spec file per user-facing concern
```

### Design decisions, and why

**Page Object Model with a shared base class, not one class per page in isolation.**
Hacker News reuses the exact same `tr.athing` story table markup on the front page, `/newest`, `/show`, `/ask` and `/front`. Rather than duplicating locators four times, [`HackerNewsListingPage`](src/pages/HackerNewsListingPage.ts) owns everything those pages have in common (nav links, the story table, search), and [`HomePage`](src/pages/HomePage.ts) / [`NewestPage`](src/pages/NewestPage.ts) only pin down the route. The story table itself is further extracted into a [`StoryListComponent`](src/components/StoryListComponent.ts), because a _component_ (a repeating row pattern within a page) is a different concern from a _page_ (a route with its own URL and layout). Collapsing the two would force ugly indexing logic into the page class instead.

**Fixtures inject dependencies; tests never construct clients or page objects themselves.**
[`api.fixtures.ts`](src/fixtures/api.fixtures.ts) and [`pages.fixtures.ts`](src/fixtures/pages.fixtures.ts) extend Playwright's `test` with `jsonPlaceholderClient`, `homePage`, `itemPage`, etc. A spec file asks for the fixture it needs as a parameter and gets a ready-to-use instance; it never imports `JsonPlaceholderClient` or writes `new HomePage(page)` directly. This keeps test files reading like specifications instead of setup code, and it's the same pattern you'd reach for in a production framework with many spec files sharing the same dependencies.

**Schemas are the contract, not inline `expect()` chains.**
Every JSONPlaceholder resource (`Post`, `User`, `Comment`) has a [`zod`](https://zod.dev) schema in `src/api/schemas/`. Tests call `Schema.safeParse(body)` and assert on `.success`, so the contract is defined once, reused across every test that touches that resource, and fails with a precise diff when the API's shape changes, instead of dozens of scattered `expect(body.id).toBeDefined()` lines that would need to be hunted down individually.

**Page objects expose raw data, not assertions.**
`StoryListComponent.getPoints(index)` returns `number | null`; it never asserts. The _test_ decides what a missing value means in context (a job posting legitimately has no score). Pushing assertions into page objects is a common shortcut that quietly turns POMs into half a test suite, so this project keeps that boundary deliberately clean.

**Environment configuration with zero required setup.**
[`src/config/env.ts`](src/config/env.ts) reads from `process.env`, but **every value has a working public-internet default** baked in. `.env.example` documents the override points (useful if you ever wanted to point this at a staging mirror), but copying it is optional. `npm install && npx playwright test` works with no `.env` file at all, which was a hard requirement for this repo.

**One Playwright config, multiple projects.**
[`playwright.config.ts`](playwright.config.ts) defines an `api` project (no browser, hits JSONPlaceholder directly) and three `e2e-*` projects (Chromium/Firefox/WebKit, hitting Hacker News). `npx playwright test` with no flags runs all four; `npm run test:api` or `npm run test:e2e:chromium` scope it down. One config, one report, one mental model, instead of two disconnected test setups bolted together.

**Concurrency is capped on purpose.**
Hacker News is a real, unmocked, rate-limited production site that actively throttles aggressive concurrent traffic with a "Sorry, we're not able to serve your requests this quickly" response. `workers` is capped (not left unbounded) and a single local retry is enabled specifically to absorb that transient throttling, the same way you'd handle any flaky third-party dependency in a real suite. It's a deliberate trade-off, not an oversight: mocking Hacker News would make the E2E suite meaningless as a demonstration of real dynamic-content handling.

## Test coverage

**API, JSONPlaceholder** ([tests/api/](tests/api/))

- `posts.spec.ts`: list + schema validation, filter by `userId`, get-by-id, 404 on a non-existent id, create (`POST`) with payload echo validation, and a documented case showing the fake API never enforces its own contract server-side (client-side `zod` validation is what actually catches a malformed payload)
- `users.spec.ts`: list + schema validation (including nested `address`/`company` objects), get-by-id, 404 on a non-existent id
- `comments.spec.ts`: comments scoped correctly to a `postId`, empty-array behavior for a non-existent post

**E2E, Hacker News** ([tests/e2e/](tests/e2e/))

- `navigation.spec.ts`: top nav exposes the full documented link set; `new` routes to `/newest`; the logo returns to the front page from elsewhere in the site
- `listing.spec.ts`: front page renders a non-empty, sequentially-ranked story list; every story has a title and a link; points/comment counts are sane when present; the "More" pagination link continues the rank sequence onto the next page
- `item.spec.ts`: a story's `/item` page shows the same title as its front-page entry; points and comment/discuss affordances render in a well-formed shape
- `search.spec.ts`: the footer search form correctly crosses over from `news.ycombinator.com` to the separate `hn.algolia.com` origin and returns results; a nonsense query renders a "no results" state instead of stale results

All assertions target **structural invariants** (non-empty, well-formed, internally consistent, correctly scoped) rather than exact live values. Both target sites serve real, constantly-changing content, so asserting "today's top story is X" would be a self-inflicted flaky test.

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

Playwright's built-in HTML reporter opens with:

- A **pass/fail summary** per project (`api`, `e2e-chromium`, `e2e-firefox`, `e2e-webkit`).
- Each test expandable into its **step-by-step trace** (every `expect`, navigation, and click).
- For any failure: an automatic **screenshot**, a **video** of the run, and a full **Playwright Trace Viewer** recording (network, console, DOM snapshots at every step), configured via `trace: 'retain-on-failure'` in `playwright.config.ts` so passing runs stay lightweight and failures are fully debuggable without re-running anything.

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs lint, type checking, and the full test suite (all projects, all browsers) on every push and pull request to `main`, and publishes the HTML report as a downloadable workflow artifact.

## Stack

|                      |                                 |
| -------------------- | ------------------------------- |
| Test runner          | `@playwright/test`              |
| Language             | TypeScript (strict mode)        |
| Schema validation    | `zod`                           |
| Linting / formatting | ESLint (flat config) + Prettier |
| CI                   | GitHub Actions                  |

## Project requirements this repo satisfies

- ✅ `npm install && npx playwright test` runs the full suite with zero extra steps, accounts, or credentials.
- ✅ Page Object Model with explicit separation between pages, reusable components, and shared base classes.
- ✅ Fixture-based dependency injection for both API clients and page objects.
- ✅ Centralized, overridable environment configuration with safe defaults.
- ✅ Reusable, parameterized test data builders (`buildNewPost`, `KNOWN_IDS`, `SEARCH_TERMS`).
- ✅ Automatic, professional HTML report with traces/screenshots/video on failure.
