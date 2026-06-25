import type { Page } from '@playwright/test';
import { HackerNewsListingPage } from './HackerNewsListingPage';

export class HomePage extends HackerNewsListingPage {
  constructor(page: Page) {
    super(page, '/');
  }
}
