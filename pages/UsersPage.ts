import { Page, Locator, expect } from '@playwright/test';
import { UserFormData } from '../helpers/testData';
 
export class UsersPage {
  readonly page: Page;
 
  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly usersSidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addUserButton: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly statusSelect: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly usersDataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;
 
  constructor(page: Page) {
    this.page = page;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.usersSidebarItem = page.getByTestId('users-sidebar-item');
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addUserButton = page.getByTestId('add-user-button');
    this.nameInput = page.getByTestId('name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleSelect = page.getByTestId('roleId-select');
    this.statusSelect = page.getByTestId('status-select');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.usersDataTable = page.getByTestId('users-data-table');
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }
 
  row(userName: string): Locator {
    return this.page.locator('tr').filter({ hasText: userName });
  }
 
  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }
 
  async openUsersPage() {
    await this.usersSidebarItem.click();
    await expect(this.pageTitle).toHaveText('Users');
    await expect(this.pageDescription).toHaveText('Manage system users');
  }
 
  async openCreateForm() {
    await this.addUserButton.click();
    await expect(this.page.locator('h2').last()).toHaveText('Create User');
  }
 
  async openEditForm(userName: string) {
    await this.row(userName).getByTestId('edit-button').click();
  }
 
  async fillForm(data: UserFormData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.roleSelect.selectOption({ label: data.roleLabel });
    await this.statusSelect.selectOption({ label: data.status });
  }
 
  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/users') && resp.request().method() === method
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
 
  async expectRow(userName: string, data: { email: string; roleLabel: string; status: string }) {
    const row = this.row(userName);
    await expect(row.getByTestId('data-name')).toContainText(userName);
    await expect(row.getByTestId('data-email')).toContainText(data.email);
    await expect(row.getByTestId('data-roleId')).toContainText(data.roleLabel);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
  }
 
  async deleteUser(userName: string) {
    const row = this.row(userName);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText('Delete User');
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }
}
 