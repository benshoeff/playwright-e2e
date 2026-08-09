import { Page, Locator, expect } from '@playwright/test';
import { PermissionFormData } from '../helpers/testData';

export class PermissionsPage {
  readonly page: Page;

  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly permissionsSidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addPermissionButton: Locator;
  readonly nameInput: Locator;
  readonly resourceInput: Locator;
  readonly actionSelect: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly permissionsDataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.permissionsSidebarItem = page.getByTestId('permissions-sidebar-item');
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addPermissionButton = page.getByTestId('add-permissions-button');
    this.nameInput = page.getByTestId('name-input');
    this.resourceInput = page.getByTestId('resource-input');
    this.actionSelect = page.getByTestId('action-select');
    this.descriptionInput = page.getByTestId('textarea-input');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.permissionsDataTable = page.getByTestId('permissions-data-table');
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }

  row(permissionName: string): Locator {
    return this.page.locator('tr').filter({ hasText: permissionName });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }

  async openPermissionsPage() {
    await this.permissionsSidebarItem.click();
    await expect(this.pageTitle).toHaveText('Permissions');
    await expect(this.pageDescription).toHaveText('Manage access permissions');
  }

  async openCreateForm() {
    await this.addPermissionButton.click();
    await expect(this.page.locator('h2').last()).toHaveText('Create Permission');
  }

  async openEditForm(permissionName: string) {
    await this.row(permissionName).getByTestId('edit-button').click();
  }

  async fillForm(data: PermissionFormData) {
    await this.nameInput.fill(data.name);
    await this.resourceInput.fill(data.resource);
    await this.actionSelect.selectOption({ label: data.action });
    await this.descriptionInput.fill(data.description);
  }

  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/permissions') && resp.request().method() === method
      ),
      this.submitButton.click(),
    ]);
    return response.json();
  }

  async expectSuccessToast(message: string) {
    await expect(this.successToast).toBeVisible();
    await expect(this.successToast).toHaveText(message);
    await this.toastCloseButton.click();
    await expect(this.successToast).not.toBeVisible();
  }

  async expectRow(permissionName: string, data: { resource: string; action: string; description: string }) {
    const row = this.row(permissionName);
    await expect(row.getByTestId('data-name')).toContainText(permissionName);
    await expect(row.getByTestId('data-resource')).toContainText(data.resource);
    await expect(row.getByTestId('data-action')).toContainText(data.action);
    await expect(row.getByTestId('data-description')).toContainText(data.description);
  }

  async deletePermission(permissionName: string) {
    const row = this.row(permissionName);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText('Delete Permission');
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }
}
