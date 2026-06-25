import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * A single story/comments thread (`/item?id=...`). Live points and comment
 * counts can change between page loads, so this page object exposes them
 * for sanity checks (non-negative, well-formed) rather than for equality
 * assertions against a previously-read value.
 */
export class ItemPage extends BasePage {
  get storyTitle(): Locator {
    return this.page.locator('span.titleline > a').first();
  }

  get points(): Locator {
    return this.page.locator('span.score');
  }

  get commentCount(): Locator {
    return this.page.locator('td.subtext a', { hasText: /comment|discuss/i }).last();
  }

  async getStoryTitleText(): Promise<string> {
    return this.storyTitle.innerText();
  }
}
