import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../config/env';

/**
 * Hacker News' own "Search:" footer link routes to hn.algolia.com, a
 * separate official front end (algolia/hn-search) for full-text search.
 * This page object lives on that second origin, reached either by deep
 * link (`open`) or by following the footer search form from HomePage.
 */
export class AlgoliaSearchPage extends BasePage {
  override async open(query: string): Promise<void> {
    const url = `${env.hackerNewsSearchBaseUrl}/?q=${encodeURIComponent(query)}&type=story`;
    await this.page.goto(url);
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder('Search stories by title, url or author');
  }

  get results(): Locator {
    return this.page.locator('article.Story');
  }

  get noResultsMessage(): Locator {
    return this.page.locator('.SearchResults');
  }

  resultTitleLink(index: number): Locator {
    return this.results.nth(index).locator('.Story_title a').first();
  }

  resultMetaLinks(index: number): Locator {
    return this.results.nth(index).locator('.Story_meta a');
  }

  async getResultTitle(index: number): Promise<string> {
    return this.resultTitleLink(index).innerText();
  }

  async waitForResults(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
