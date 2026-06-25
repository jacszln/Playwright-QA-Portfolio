import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StoryListComponent } from '../components/StoryListComponent';

/**
 * Base class for every Hacker News page that renders the classic
 * `tr.athing` story table: front page, /newest, /show, /ask, /front (past).
 * Subclasses only need to pin down the path; nav links and the story list
 * are shared because the underlying markup is identical across all of them.
 */
export class HackerNewsListingPage extends BasePage {
  readonly storyList: StoryListComponent;

  constructor(
    page: Page,
    private readonly path: string = '/',
  ) {
    super(page);
    this.storyList = new StoryListComponent(page);
  }

  override async open(): Promise<void> {
    await super.open(this.path);
  }

  get logoLink(): Locator {
    return this.page.locator('span.pagetop b.hnname a[href="news"]');
  }

  get newLink(): Locator {
    return this.page.locator('span.pagetop a[href="newest"]');
  }

  get pastLink(): Locator {
    return this.page.locator('span.pagetop a[href="front"]');
  }

  get commentsLink(): Locator {
    return this.page.locator('span.pagetop a[href="newcomments"]');
  }

  get askLink(): Locator {
    return this.page.locator('span.pagetop a[href="ask"]');
  }

  get showLink(): Locator {
    return this.page.locator('span.pagetop a[href="show"]');
  }

  get jobsLink(): Locator {
    return this.page.locator('span.pagetop a[href="jobs"]');
  }

  get submitLink(): Locator {
    return this.page.locator('span.pagetop a[href="submit"]');
  }

  get footerSearchInput(): Locator {
    return this.page.locator('form[action="//hn.algolia.com/"] input[name="q"]');
  }

  async searchFor(term: string): Promise<void> {
    await this.footerSearchInput.fill(term);
    await this.footerSearchInput.press('Enter');
  }
}
