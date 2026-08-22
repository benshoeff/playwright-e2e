import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { UserFormData } from '../helpers/testData';
import { usersApiPath } from '../helpers/api';

export class UsersPage extends CrudPage<UserFormData> {
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: usersApiPath,
      entityName: 'User',
      addButtonTestId: 'add-users-button',
      sidebarTestId: 'users-sidebar-item',
      dataTableTestId: 'users-data-table',
      pageTitle: 'Users',
      pageDescription: 'Manage system users',
    });

    this.emailInput = page.getByTestId('email-input');
    this.roleSelect = page.getByTestId('roleId-select');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: UserFormData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.roleSelect.selectOption({ label: data.roleLabel });
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(userName: string, data: { email: string; roleLabel: string; status: string }) {
    const row = this.row(userName);
    await expect(row.getByTestId('data-name')).toContainText(userName);
    await expect(row.getByTestId('data-email')).toContainText(data.email);
    await expect(row.getByTestId('data-roleId')).toContainText(data.roleLabel);
    // Exact match: 'active' is a substring of 'inactive', so a plain
    // toContainText would pass even when the row shows the wrong status.
    await expect(row.getByTestId('data-status')).toHaveText(new RegExp(`^\\s*${data.status}\\s*$`, 'i'));
  }
}
