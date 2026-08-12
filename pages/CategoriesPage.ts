import { Page, Locator, expect } from '@playwright/test';
import { CategoryFormData } from '../helpers/testData';

export class CategoriesPage {
  readonly page: Page;

  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly categoriesSidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addCategoryButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly categoriesDataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.categoriesSidebarItem = page.getByTestId('categories-sidebar-item');
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addCategoryButton = page.getByTestId('add-categories-button');
    this.nameInput = page.getByTestId('name-input');
    this.descriptionInput = page.getByTestId('textarea-input');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.categoriesDataTable = page.getByTestId('categories-data-table');
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }

  row(categoryName: string): Locator {
    return this.page.locator('tr').filter({ hasText: categoryName });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }

  async openCategoriesPage() {
    await this.categoriesSidebarItem.click();
    await expect(this.pageTitle).toHaveText('Categories');
    await expect(this.pageDescription).toHaveText('Organize items into categories');
  }

  async openCreateForm() {
    await this.addCategoryButton.click();
    await expect(this.page.locator('h2').last()).toHaveText('Create Category');
  }

  async openEditForm(categoryName: string) {
    await this.row(categoryName).getByTestId('edit-button').click();
  }

  async fillForm(data: CategoryFormData) {
    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);
  }

  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/categories') && resp.request().method() === method
      ),
      this.submitButton.click(),
    ]);
    return response.json();
  }

  async expectSuccessToast(message: string) {
    await expect(this.successToast).toBeVisible();
    await expect(this.successToast).toHaveText(message);
    await this.toastCloseButton.click();
    await expect(this.successToast).not.toBeVisible();
  }

  async expectRow(categoryName: string, data: { description: string }) {
    const row = this.row(categoryName);
    await expect(row.getByTestId('data-name')).toContainText(categoryName);
    await expect(row.getByTestId('data-description')).toContainText(data.description);
  }

  async deleteCategory(categoryName: string) {
    const row = this.row(categoryName);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText('Delete Category');
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }
}
