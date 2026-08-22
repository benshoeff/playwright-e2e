import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { PermissionFormData } from '../helpers/testData';
import { permissionsApiPath } from '../helpers/api';

export class PermissionsPage extends CrudPage<PermissionFormData> {
  readonly resourceInput: Locator;
  readonly actionSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: permissionsApiPath,
      entityName: 'Permission',
      addButtonTestId: 'add-permissions-button',
      sidebarTestId: 'permissions-sidebar-item',
      dataTableTestId: 'permissions-data-table',
      pageTitle: 'Permissions',
      pageDescription: 'Manage access permissions',
    });

    this.resourceInput = page.getByTestId('resource-input');
    this.actionSelect = page.getByTestId('action-select');
  }

  async fillForm(data: PermissionFormData) {
    await this.nameInput.fill(data.name);
    await this.resourceInput.fill(data.resource);
    await this.actionSelect.selectOption({ label: data.action });
    await this.textareaInput.fill(data.description);
  }

  async expectRow(permissionName: string, data: { resource: string; action: string; description: string }) {
    const row = this.row(permissionName);
    await expect(row.getByTestId('data-name')).toContainText(permissionName);
    await expect(row.getByTestId('data-resource')).toContainText(data.resource);
    // Exact match: action is enum-like, so a plain toContainText could pass
    // even when the row shows the wrong action (same reason as UsersPage).
    await expect(row.getByTestId('data-action')).toHaveText(new RegExp(`^\\s*${data.action}\\s*$`, 'i'));
    await expect(row.getByTestId('data-description')).toContainText(data.description);
  }
}
