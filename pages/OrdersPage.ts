import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { OrderFormData } from '../helpers/testData';
import { ordersApiPath } from '../helpers/api';

export class OrdersPage extends CrudPage<OrderFormData> {
  readonly customerNameInput: Locator;
  readonly emailInput: Locator;
  readonly itemsInput: Locator;
  readonly totalAmountInput: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: ordersApiPath,
      entityName: 'Order',
      addButtonTestId: 'add-orders-button',
      sidebarTestId: 'orders-sidebar-item',
      dataTableTestId: 'orders-data-table',
      pageTitle: 'Orders',
      pageDescription: 'Manage customer orders',
    });

    this.customerNameInput = page.getByTestId('customerName-input');
    this.emailInput = page.getByTestId('email-input');
    this.itemsInput = page.getByTestId('items-input');
    this.totalAmountInput = page.getByTestId('totalAmount-input');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: OrderFormData) {
    await this.customerNameInput.fill(data.customerName);
    await this.emailInput.fill(data.email);
    await this.itemsInput.fill(data.items);
    await this.totalAmountInput.fill(String(data.totalAmount));
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(customerName: string, data: { email: string; status: string }) {
    const row = this.row(customerName);
    await expect(row.getByTestId('data-customerName')).toContainText(customerName);
    await expect(row.getByTestId('data-email')).toContainText(data.email);
    await expect(row.getByTestId('data-status')).toHaveText(new RegExp(`^\\s*${data.status}\\s*$`, 'i'));
  }
}
