import { Page, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { RoleFormData } from '../helpers/testData';
import { rolesApiPath } from '../helpers/api';

export class RolesPage extends CrudPage<RoleFormData> {
  constructor(page: Page) {
    super(page, {
      apiPath: rolesApiPath,
      entityName: 'Role',
      addButtonTestId: 'add-roles-button',
      sidebarTestId: 'roles-sidebar-item',
      dataTableTestId: 'roles-data-table',
      pageTitle: 'Roles',
      pageDescription: 'Define user roles and access levels',
    });
  }

  async fillForm(data: RoleFormData) {
    await this.nameInput.fill(data.name);
    await this.textareaInput.fill(data.description);
  }

  async expectRow(roleName: string, data: { description: string }) {
    const row = this.row(roleName);
    await expect(row.getByTestId('data-name')).toContainText(roleName);
    await expect(row.getByTestId('data-description')).toContainText(data.description);
  }
}
