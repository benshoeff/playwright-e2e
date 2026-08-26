import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { CustomerFormData } from '../helpers/testData';
import { customersApiPath } from '../helpers/api';

export class CustomersPage extends CrudPage<CustomerFormData> {
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly cityInput: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: customersApiPath,
      entityName: 'Customer',
      addButtonTestId: 'add-customers-button',
      sidebarTestId: 'customers-sidebar-item',
      dataTableTestId: 'customers-data-table',
      pageTitle: 'Customers',
      pageDescription: 'Manage customer accounts',
    });

    this.emailInput = page.getByTestId('email-input');
    this.phoneInput = page.getByTestId('phone-input');
    this.cityInput = page.getByTestId('city-input');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: CustomerFormData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.cityInput.fill(data.city);
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(customerName: string, data: { email: string; phone: string; city: string; status: string }) {
    const row = this.row(customerName);
    await expect(row.getByTestId('data-name')).toContainText(customerName);
    await expect(row.getByTestId('data-email')).toContainText(data.email);
    await expect(row.getByTestId('data-phone')).toContainText(data.phone);
    await expect(row.getByTestId('data-city')).toContainText(data.city);
    // Exact match: 'active' is a substring of 'inactive', so a plain
    // toContainText would pass even when the row shows the wrong status.
    await expect(row.getByTestId('data-status')).toHaveText(new RegExp(`^\\s*${data.status}\\s*$`, 'i'));
  }
}
