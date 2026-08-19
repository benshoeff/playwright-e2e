import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { DepartmentFormData } from '../helpers/testData';
import { departmentsApiPath } from '../helpers/api';

export class DepartmentsPage extends CrudPage<DepartmentFormData> {
  readonly managerSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: departmentsApiPath,
      entityName: 'Department',
      addButtonTestId: 'add-departments-button',
      sidebarTestId: 'departments-sidebar-item',
      dataTableTestId: 'departments-data-table',
      pageTitle: 'Departments',
      pageDescription: 'Organize employees into departments',
    });

    this.managerSelect = page.getByTestId('managerId-select');
  }

  async fillForm(data: DepartmentFormData) {
    await this.nameInput.fill(data.name);
    await this.textareaInput.fill(data.description);
    if (data.managerLabel) {
      await this.managerSelect.selectOption({ label: data.managerLabel });
    }
  }

  async expectRow(name: string, data: { description: string; managerLabel?: string }) {
    const row = this.row(name);
    await expect(row.getByTestId('data-name')).toContainText(name);
    await expect(row.getByTestId('data-description')).toContainText(data.description);
    if (data.managerLabel) {
      await expect(row.getByTestId('data-managerId')).toContainText(data.managerLabel);
    }
  }
}
