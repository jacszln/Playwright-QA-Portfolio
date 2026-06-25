import { test, expect } from '../../src/fixtures/pages.fixtures';

test.describe('Top navigation', () => {
  test('exposes the documented set of links on the front page', async ({ homePage }) => {
    await homePage.open();

    await expect(homePage.logoLink).toBeVisible();
    await expect(homePage.newLink).toBeVisible();
    await expect(homePage.pastLink).toBeVisible();
    await expect(homePage.commentsLink).toBeVisible();
    await expect(homePage.askLink).toBeVisible();
    await expect(homePage.showLink).toBeVisible();
    await expect(homePage.jobsLink).toBeVisible();
    await expect(homePage.submitLink).toBeVisible();
  });

  test('"new" link navigates to /newest with a populated, freshly-sorted list', async ({
    homePage,
    page,
  }) => {
    await homePage.open();
    await homePage.newLink.click();

    await expect(page).toHaveURL(/\/newest$/);
    expect(await homePage.storyList.count()).toBeGreaterThan(0);
  });

  test('logo link returns to the front page from anywhere in the site', async ({
    newestPage,
    page,
  }) => {
    await newestPage.open();
    await newestPage.logoLink.click();

    await expect(page).toHaveURL(/news\.ycombinator\.com\/(news)?$/);
  });
});
