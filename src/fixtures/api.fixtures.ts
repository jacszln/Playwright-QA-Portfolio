import { test as base, expect } from '@playwright/test';
import { JsonPlaceholderClient } from '../api/clients/JsonPlaceholderClient';

type ApiFixtures = {
  jsonPlaceholderClient: JsonPlaceholderClient;
};

export const test = base.extend<ApiFixtures>({
  jsonPlaceholderClient: async ({ request }, use) => {
    await use(new JsonPlaceholderClient(request));
  },
});

export { expect };
