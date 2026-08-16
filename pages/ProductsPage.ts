import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { ProductFormData } from '../helpers/testData';
import { productsApiPath } from '../helpers/api';

export class ProductsPage extends CrudPage<ProductFormData> {
  readonly priceInput: Locator;
  readonly categoryIdSelect: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: productsApiPath,
      entityName: 'Product',
      addButtonTestId: 'add-products-button',
      sidebarTestId: 'products-sidebar-item',
      dataTableTestId: 'products-data-table',
      pageTitle: 'Products',
      pageDescription: 'Manage product catalog',
    });

    this.priceInput = page.getByTestId('price-input');
    this.categoryIdSelect = page.getByTestId('categoryId-select');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: ProductFormData) {
    await this.nameInput.fill(data.name);
    await this.textareaInput.fill(data.description);
    await this.priceInput.fill(String(data.price));
    await this.categoryIdSelect.selectOption({ label: data.categoryLabel });
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(productName: string, data: { price: number; categoryLabel: string; status: string }) {
    const row = this.row(productName);
    await expect(row.getByTestId('data-name')).toContainText(productName);
    await expect(row.getByTestId('data-price')).toContainText(`$${data.price.toFixed(2)}`);
    await expect(row.getByTestId('data-categoryId')).toContainText(data.categoryLabel);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
  }
}
