import { test, expect } from '../../src/fixtures/pages.fixtures';
import { SEARCH_TERMS } from '../../src/data/testData';

test.describe('Search (footer -> hn.algolia.com)', () => {
  test('searching from the front page footer crosses over to the Algolia search results', async ({
    homePage,
    algoliaSearchPage,
    page,
  }) => {
    await homePage.open();
    await homePage.searchFor(SEARCH_TERMS.withResults);

    await expect(page).toHaveURL(/hn\.algolia\.com/);
    await algoliaSearchPage.waitForResults();

    const resultsCount = await algoliaSearchPage.results.count();
    expect(resultsCount).toBeGreaterThan(0);

    const firstTitle = await algoliaSearchPage.getResultTitle(0);
    expect(firstTitle.trim().length).toBeGreaterThan(0);
  });

  test('a term with no matches renders a "no results" state instead of stale results', async ({
    algoliaSearchPage,
  }) => {
    await algoliaSearchPage.open(SEARCH_TERMS.withNoResults);
    await algoliaSearchPage.waitForResults();

    expect(await algoliaSearchPage.results.count()).toBe(0);
    await expect(algoliaSearchPage.noResultsMessage).toBeVisible();
  });
});
