import { test, expect } from '../../src/fixtures/api.fixtures';
import { UserSchema, UserListSchema } from '../../src/api/schemas/user.schema';
import { KNOWN_IDS } from '../../src/data/testData';

test.describe('GET /users', () => {
  test('returns a list of users matching the contract, including nested address/company', async ({
    jsonPlaceholderClient,
  }) => {
    const response = await jsonPlaceholderClient.getUsers();

    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = UserListSchema.safeParse(body);
    expect(result.success, result.success ? '' : result.error.message).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});

test.describe('GET /users/:id', () => {
  test('returns a single user matching the contract', async ({ jsonPlaceholderClient }) => {
    const response = await jsonPlaceholderClient.getUserById(KNOWN_IDS.existingUserId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = UserSchema.safeParse(body);
    expect(result.success, result.success ? '' : result.error.message).toBe(true);
    expect(body.id).toBe(KNOWN_IDS.existingUserId);
    expect(body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('returns 404 for a non-existent user', async ({ jsonPlaceholderClient }) => {
    const response = await jsonPlaceholderClient.getUserById(KNOWN_IDS.nonExistentId);

    expect(response.status()).toBe(404);
  });
});
