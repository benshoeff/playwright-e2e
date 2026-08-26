import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { InvoiceFormData } from '../helpers/testData';
import { invoicesApiPath } from '../helpers/api';

export class InvoicesPage extends CrudPage<InvoiceFormData> {
  readonly invoiceNumberInput: Locator;
  readonly customerIdSelect: Locator;
  readonly issueDateInput: Locator;
  readonly dueDateInput: Locator;
  readonly totalAmountInput: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: invoicesApiPath,
      entityName: 'Invoice',
      addButtonTestId: 'add-invoices-button',
      sidebarTestId: 'invoices-sidebar-item',
      dataTableTestId: 'invoices-data-table',
      pageTitle: 'Invoices',
      pageDescription: 'Manage customer invoices and payments',
    });

    this.invoiceNumberInput = page.getByTestId('invoiceNumber-input');
    this.customerIdSelect = page.getByTestId('customerId-select');
    this.issueDateInput = page.getByTestId('issueDate-input');
    this.dueDateInput = page.getByTestId('dueDate-input');
    this.totalAmountInput = page.getByTestId('totalAmount-input');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: InvoiceFormData) {
    await this.invoiceNumberInput.fill(data.invoiceNumber);
    await this.customerIdSelect.selectOption({ label: data.customerLabel });
    await this.issueDateInput.fill(data.issueDate);
    await this.dueDateInput.fill(data.dueDate);
    await this.totalAmountInput.fill(String(data.totalAmount));
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(invoiceNumber: string, data: { status: string }) {
    const row = this.row(invoiceNumber);
    await expect(row.getByTestId('data-invoiceNumber')).toContainText(invoiceNumber);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
  }
}
