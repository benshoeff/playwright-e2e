import { Page, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { CategoryFormData } from '../helpers/testData';
import { categoriesApiPath } from '../helpers/api';

export class CategoriesPage extends CrudPage<CategoryFormData> {
  constructor(page: Page) {
    super(page, {
      apiPath: categoriesApiPath,
      entityName: 'Category',
      addButtonTestId: 'add-categories-button',
      sidebarTestId: 'categories-sidebar-item',
      dataTableTestId: 'categories-data-table',
      pageTitle: 'Categories',
      pageDescription: 'Organize items into categories',
    });
  }

  async fillForm(data: CategoryFormData) {
    await this.nameInput.fill(data.name);
    await this.textareaInput.fill(data.description);
  }

  async expectRow(categoryName: string, data: { description: string }) {
    const row = this.row(categoryName);
    await expect(row.getByTestId('data-name')).toContainText(categoryName);
    await expect(row.getByTestId('data-description')).toContainText(data.description);
  }
}
