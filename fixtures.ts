import { test as base, expect } from '@playwright/test';
import { UsersPage } from './pages/UsersPage';
import { deleteUserViaApi } from './helpers/api';
 
type Fixtures = {
  usersPage: UsersPage;
  // Call this with an id whenever a test creates a user (via UI or API).
  // Every id collected here gets deleted automatically after the test,
  // regardless of whether the test passed or failed.
  trackUserForCleanup: (id: string) => void;
};
 
export const test = base.extend<Fixtures>({
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
 
  trackUserForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];
 
    await use((id: string) => {
      createdIds.push(id);
    });
 
    // Teardown: runs after the test body, success or failure.
    for (const id of createdIds) {
      await deleteUserViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },
});
 
export { expect };