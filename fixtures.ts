import { test as base, expect } from '@playwright/test';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { PostsPage } from './pages/PostsPage';
import { TasksPage } from './pages/TasksPage';
import { OrdersPage } from './pages/OrdersPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { deleteViaApi } from './helpers/api';

type Fixtures = {
  usersPage: UsersPage;
  rolesPage: RolesPage;
  permissionsPage: PermissionsPage;
  categoriesPage: CategoriesPage;
  customersPage: CustomersPage;
  productsPage: ProductsPage;
  postsPage: PostsPage;
  tasksPage: TasksPage;
  ordersPage: OrdersPage;
  departmentsPage: DepartmentsPage;
  employeesPage: EmployeesPage;
  reviewsPage: ReviewsPage;
  projectsPage: ProjectsPage;

  // Call this with an entity path and id whenever a test creates a resource
  // (via UI or API). Every entry collected here gets deleted automatically
  // after the test, regardless of whether the test passed or failed.
  // Example: trackForCleanup(usersApiPath, created.id)
  trackForCleanup: (path: string, id: string) => void;
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

  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
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

  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  departmentsPage: async ({ page }, use) => {
    await use(new DepartmentsPage(page));
  },

  employeesPage: async ({ page }, use) => {
    await use(new EmployeesPage(page));
  },

  reviewsPage: async ({ page }, use) => {
    await use(new ReviewsPage(page));
  },

  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page));
  },

  trackForCleanup: async ({ request }, use) => {
    const toDelete: { path: string; id: string }[] = [];

    await use((path: string, id: string) => {
      toDelete.push({ path, id });
    });

    for (const { path, id } of toDelete) {
      await deleteViaApi(request, path, id).catch(() => {
        // Best-effort cleanup — don't fail the test run over a cleanup issue.
      });
    }
  },
});

export { expect };
