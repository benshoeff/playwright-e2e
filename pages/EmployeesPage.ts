import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { EmployeeFormData } from '../helpers/testData';
import { employeesApiPath } from '../helpers/api';

export class EmployeesPage extends CrudPage<EmployeeFormData> {
  readonly emailInput: Locator;
  readonly departmentSelect: Locator;
  readonly positionInput: Locator;
  readonly salaryInput: Locator;
  readonly hireDateInput: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: employeesApiPath,
      entityName: 'Employee',
      addButtonTestId: 'add-employees-button',
      sidebarTestId: 'employees-sidebar-item',
      dataTableTestId: 'employees-data-table',
      pageTitle: 'Employees',
      pageDescription: 'Manage employees and departments',
    });

    this.emailInput = page.getByTestId('email-input');
    this.departmentSelect = page.getByTestId('departmentId-select');
    this.positionInput = page.getByTestId('position-input');
    this.salaryInput = page.getByTestId('salary-input');
    this.hireDateInput = page.getByTestId('hireDate-input');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: EmployeeFormData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.departmentSelect.selectOption({ label: data.departmentLabel });
    await this.positionInput.fill(data.position);
    await this.salaryInput.fill(String(data.salary));
    await this.hireDateInput.fill(data.hireDate);
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(
    name: string,
    data: {
      email: string;
      departmentLabel: string;
      position: string;
      salary: number;
      status: string;
    }
  ) {
    const row = this.row(name);
    await expect(row.getByTestId('data-name')).toContainText(name);
    await expect(row.getByTestId('data-email')).toContainText(data.email);
    await expect(row.getByTestId('data-departmentId')).toContainText(data.departmentLabel);
    await expect(row.getByTestId('data-position')).toContainText(data.position);
    // The app renders salary as `$${Number(val).toLocaleString()}`.
    await expect(row.getByTestId('data-salary')).toHaveText(`$${Number(data.salary).toLocaleString('en-US')}`);
    // Exact match with underscores turned into spaces ('on_leave' renders as
    // 'on leave'), so a wrong status can never pass via substring luck.
    const statusLabel = data.status.replace(/_/g, ' ');
    await expect(row.getByTestId('data-status')).toHaveText(new RegExp(`^\\s*${statusLabel}\\s*$`, 'i'));
  }
}
