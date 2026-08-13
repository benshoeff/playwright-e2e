import { Page, Locator, expect } from '@playwright/test';
import { ProductFormData } from '../helpers/testData';

export class ProductsPage {
  readonly page: Page;

  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly productsSidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addProductButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly priceInput: Locator;
  readonly categoryIdSelect: Locator;
  readonly statusSelect: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly productsDataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.productsSidebarItem = page.getByTestId('products-sidebar-item');
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addProductButton = page.getByTestId('add-products-button');
    this.nameInput = page.getByTestId('name-input');
    this.descriptionInput = page.getByTestId('textarea-input');
    this.priceInput = page.getByTestId('price-input');
    this.categoryIdSelect = page.getByTestId('categoryId-select');
    this.statusSelect = page.getByTestId('status-select');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.productsDataTable = page.getByTestId('products-data-table');
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }

  row(productName: string): Locator {
    return this.page.locator('tr').filter({ hasText: productName });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }

  async openProductsPage() {
    await this.productsSidebarItem.click();
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.pageDescription).toHaveText('Manage product catalog');
  }

  async openCreateForm() {
    await this.addProductButton.click();
    await expect(this.page.locator('h2').last()).toHaveText('Create Product');
  }

  async openEditForm(productName: string) {
    await this.row(productName).getByTestId('edit-button').click();
  }

  async fillForm(data: ProductFormData) {
    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);
    await this.priceInput.fill(String(data.price));
    await this.categoryIdSelect.selectOption({ label: data.categoryLabel });
    await this.statusSelect.selectOption({ label: data.status });
  }

  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/products') && resp.request().method() === method
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

  async expectRow(productName: string, data: { price: number; categoryLabel: string; status: string }) {
    const row = this.row(productName);
    await expect(row.getByTestId('data-name')).toContainText(productName);
    await expect(row.getByTestId('data-price')).toContainText(`$${data.price.toFixed(2)}`);
    await expect(row.getByTestId('data-categoryId')).toContainText(data.categoryLabel);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
  }

  async deleteProduct(productName: string) {
    const row = this.row(productName);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText('Delete Product');
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }
}
