import { test as base, expect } from '@playwright/test';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductsPage } from './pages/ProductsPage';
import { PostsPage } from './pages/PostsPage';
import { TasksPage } from './pages/TasksPage';
import {
  deleteUserViaApi,
  deleteRoleViaApi,
  deletePermissionViaApi,
  deleteCategoryViaApi,
  deleteProductViaApi,
  deletePostViaApi,
  deleteTaskViaApi,
} from './helpers/api';

type Fixtures = {
  usersPage: UsersPage;
  rolesPage: RolesPage;
  permissionsPage: PermissionsPage;
  categoriesPage: CategoriesPage;
  productsPage: ProductsPage;
  postsPage: PostsPage;
  tasksPage: TasksPage;

  // Call this with an id whenever a test creates a user (via UI or API).
  // Every id collected here gets deleted automatically after the test,
  // regardless of whether the test passed or failed.
  trackUserForCleanup: (id: string) => void;

  // Same pattern, for roles.
  trackRoleForCleanup: (id: string) => void;

  // Same pattern, for permissions.
  trackPermissionForCleanup: (id: string) => void;

  // Same pattern, for categories.
  trackCategoryForCleanup: (id: string) => void;

  // Same pattern, for products.
  trackProductForCleanup: (id: string) => void;

  // Same pattern, for posts.
  trackPostForCleanup: (id: string) => void;

  // Same pattern, for tasks.
  trackTaskForCleanup: (id: string) => void;
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

  categoriesPage: async ({ page }, use) => {
    await use(new CategoriesPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  postsPage: async ({ page }, use) => {
    await use(new PostsPage(page));
  },

  tasksPage: async ({ page }, use) => {
    await use(new TasksPage(page));
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

  trackCategoryForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deleteCategoryViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },

  trackProductForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deleteProductViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },

  trackPostForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deletePostViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },

  trackTaskForCleanup: async ({ request }, use) => {
    const createdIds: string[] = [];

    await use((id: string) => {
      createdIds.push(id);
    });

    for (const id of createdIds) {
      await deleteTaskViaApi(request, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },
});

export { expect };