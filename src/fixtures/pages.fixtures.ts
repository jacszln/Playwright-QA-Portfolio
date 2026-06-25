import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NewestPage } from '../pages/NewestPage';
import { ItemPage } from '../pages/ItemPage';
import { AlgoliaSearchPage } from '../pages/AlgoliaSearchPage';

type PageFixtures = {
  homePage: HomePage;
  newestPage: NewestPage;
  itemPage: ItemPage;
  algoliaSearchPage: AlgoliaSearchPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  newestPage: async ({ page }, use) => {
    await use(new NewestPage(page));
  },
  itemPage: async ({ page }, use) => {
    await use(new ItemPage(page));
  },
  algoliaSearchPage: async ({ page }, use) => {
    await use(new AlgoliaSearchPage(page));
  },
});

export { expect };
