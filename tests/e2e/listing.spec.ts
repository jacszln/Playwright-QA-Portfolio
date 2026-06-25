import { test, expect } from '../../src/fixtures/pages.fixtures';

test.describe('Front page story list', () => {
  test('renders a non-empty, sequentially-ranked list of stories', async ({ homePage }) => {
    await homePage.open();

    const count = await homePage.storyList.count();
    expect(count).toBeGreaterThan(0);

    const ranks = await homePage.storyList.getRanksInOrder();
    const expected = ranks.map((_, index) => index + 1);
    expect(ranks).toEqual(expected);
  });

  test('every story exposes a non-empty title and a clickable link', async ({ homePage }) => {
    await homePage.open();

    const count = await homePage.storyList.count();
    for (let i = 0; i < count; i += 1) {
      const title = await homePage.storyList.getTitle(i);
      expect(title.trim().length).toBeGreaterThan(0);
      await expect(homePage.storyList.titleLink(i)).toHaveAttribute('href', /.+/);
    }
  });

  test('points and comment counts, when present, are non-negative numbers', async ({
    homePage,
  }) => {
    await homePage.open();

    const count = await homePage.storyList.count();
    for (let i = 0; i < count; i += 1) {
      const points = await homePage.storyList.getPoints(i);
      if (points !== null) {
        expect(points).toBeGreaterThanOrEqual(0);
      }

      const comments = await homePage.storyList.getCommentsCount(i);
      if (comments !== null) {
        expect(comments).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('"More" link continues the rank sequence onto the next page', async ({ homePage }) => {
    await homePage.open();

    const firstPageRanks = await homePage.storyList.getRanksInOrder();
    const lastRankOnFirstPage = firstPageRanks[firstPageRanks.length - 1];

    await homePage.storyList.clickMore();

    const secondPageRanks = await homePage.storyList.getRanksInOrder();
    expect(secondPageRanks[0]).toBe((lastRankOnFirstPage ?? 0) + 1);
  });
});
