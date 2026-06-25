import type { Page } from '@playwright/test';

/** Shared navigation behavior for every page object in the suite. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
