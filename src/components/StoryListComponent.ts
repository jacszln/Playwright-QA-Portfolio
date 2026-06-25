import type { Locator, Page } from '@playwright/test';

/**
 * Encapsulates the `tr.athing` / `tr.subtext` row pair that Hacker News reuses
 * across every listing page (front page, /newest, /show, /ask, /front).
 * Numeric fields (points, comments) return `null` when absent (e.g. job
 * posts carry no score, and a 0-comment story shows "discuss" instead of a
 * count). Callers decide whether `null` is acceptable for their assertion.
 */
export class StoryListComponent {
  constructor(private readonly page: Page) {}

  get rows(): Locator {
    return this.page.locator('tr.athing');
  }

  get moreLink(): Locator {
    return this.page.locator('a.morelink');
  }

  async count(): Promise<number> {
    return this.rows.count();
  }

  storyRow(index: number): Locator {
    return this.rows.nth(index);
  }

  private subtextRow(index: number): Locator {
    return this.storyRow(index).locator('xpath=following-sibling::tr[1]');
  }

  async getRank(index: number): Promise<number> {
    const text = await this.storyRow(index).locator('span.rank').innerText();
    return Number(text.replace('.', ''));
  }

  async getStoryId(index: number): Promise<string> {
    return (await this.storyRow(index).getAttribute('id')) ?? '';
  }

  titleLink(index: number): Locator {
    return this.storyRow(index).locator('span.titleline > a').first();
  }

  async getTitle(index: number): Promise<string> {
    return this.titleLink(index).innerText();
  }

  async getDomain(index: number): Promise<string | null> {
    const site = this.storyRow(index).locator('span.sitestr');
    if ((await site.count()) === 0) return null;
    return site.innerText();
  }

  async getPoints(index: number): Promise<number | null> {
    const score = this.subtextRow(index).locator('span.score');
    if ((await score.count()) === 0) return null;
    const text = await score.innerText();
    return Number(text.replace(/\D/g, ''));
  }

  async getAuthor(index: number): Promise<string | null> {
    const author = this.subtextRow(index).locator('a.hnuser');
    if ((await author.count()) === 0) return null;
    return author.innerText();
  }

  async getAgeText(index: number): Promise<string | null> {
    const age = this.subtextRow(index).locator('span.age');
    if ((await age.count()) === 0) return null;
    return age.innerText();
  }

  /** Returns 0 for "discuss" (no comments yet), or null if the link is absent entirely. */
  async getCommentsCount(index: number): Promise<number | null> {
    const link = this.subtextRow(index)
      .locator('a', { hasText: /comment|discuss/i })
      .last();
    if ((await link.count()) === 0) return null;
    const text = await link.innerText();
    if (/discuss/i.test(text)) return 0;
    return Number(text.replace(/\D/g, ''));
  }

  async getRanksInOrder(): Promise<number[]> {
    const total = await this.count();
    const ranks: number[] = [];
    for (let i = 0; i < total; i += 1) {
      ranks.push(await this.getRank(i));
    }
    return ranks;
  }

  async clickMore(): Promise<void> {
    await this.moreLink.click();
  }
}
