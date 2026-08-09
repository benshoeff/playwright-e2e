import { test as base, expect } from '@playwright/test';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { deleteUserViaApi, deleteRoleViaApi, deletePermissionViaApi } from './helpers/api';

type Fixtures = {
  usersPage: UsersPage;
  rolesPage: RolesPage;
  permissionsPage: PermissionsPage;

  // Call this with an id whenever a test creates a user (via UI or API).
  // Every id collected here gets deleted automatically after the test,
  // regardless of whether the test passed or failed.
  trackUserForCleanup: (id: string) => void;

  // Same pattern, for roles.
  trackRoleForCleanup: (id: string) => void;

  // Same pattern, for permissions.
  trackPermissionForCleanup: (id: string) => void;
};

export const test = base.extend<Fixtures>({
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },

  rolesPage: async ({ page }, use) => {
    await use(new RolesPage(page));
  },

  permissionsPage: async ({ page }, use) => {
    await use(new PermissionsPage(page));
  },

  trackUserForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deleteUserViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },

  trackRoleForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deleteRoleViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },

  trackPermissionForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deletePermissionViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },
});

export { expect };