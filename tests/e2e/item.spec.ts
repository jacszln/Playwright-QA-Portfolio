import { test, expect } from '../../src/fixtures/pages.fixtures';

test.describe('Story item page', () => {
  test('shows the same title as the front page entry it was opened from', async ({
    homePage,
    itemPage,
  }) => {
    await homePage.open();

    const expectedTitle = await homePage.storyList.getTitle(0);
    const storyId = await homePage.storyList.getStoryId(0);
    expect(storyId).not.toBe('');

    await itemPage.open(`item?id=${storyId}`);

    await expect(itemPage.storyTitle).toBeVisible();
    expect(await itemPage.getStoryTitleText()).toBe(expectedTitle);
  });

  test('renders well-formed points and comment/discuss affordances', async ({
    homePage,
    itemPage,
  }) => {
    await homePage.open();
    const storyId = await homePage.storyList.getStoryId(0);

    await itemPage.open(`item?id=${storyId}`);

    await expect(itemPage.points).toHaveText(/\d+\s+points?/i);
    await expect(itemPage.commentCount).toHaveText(/comment|discuss/i);
  });
});
