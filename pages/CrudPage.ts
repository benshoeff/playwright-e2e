import { Page, Locator, expect } from '@playwright/test';

export interface CrudPageConfig {
  apiPath: string;
  entityName: string;
  addButtonTestId: string;
  sidebarTestId: string;
  dataTableTestId: string;
  pageTitle: string;
  pageDescription: string;
}

export type ApiMethod = 'POST' | 'PUT' | 'PATCH';

export abstract class CrudPage<TFormData> {
  readonly page: Page;

  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly sidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly textareaInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly dataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;

  protected readonly config: CrudPageConfig;

  constructor(page: Page, config: CrudPageConfig) {
    this.page = page;
    this.config = config;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.sidebarItem = page.getByTestId(config.sidebarTestId);
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addButton = page.getByTestId(config.addButtonTestId);
    this.nameInput = page.getByTestId('name-input');
    this.textareaInput = page.getByTestId('textarea-input');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.dataTable = page.getByTestId(config.dataTableTestId);
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }

  row(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }

  async openEntityPage() {
    await this.sidebarItem.click();
    await expect(this.pageTitle).toHaveText(this.config.pageTitle);
    await expect(this.pageDescription).toHaveText(this.config.pageDescription);
  }

  async openCreateForm() {
    await this.addButton.click();
    await expect(this.page.locator('h2').last()).toHaveText(`Create ${this.config.entityName}`);
  }

  async openEditForm(name: string) {
    await this.row(name).getByTestId('edit-button').click();
  }

  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  // Accepts a single method or several (e.g. ['PUT', 'PATCH']) when the
  // update verb is unknown — the first matching request is captured.
  async submitAndWaitForApi(method: ApiMethod | readonly ApiMethod[]) {
    const methods = Array.isArray(method) ? method : [method];
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          resp.url().includes(this.config.apiPath) &&
          methods.includes(resp.request().method() as ApiMethod)
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

  async deleteEntity(name: string) {
    const row = this.row(name);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText(`Delete ${this.config.entityName}`);
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }

  abstract fillForm(data: TFormData): Promise<void>;

  abstract expectRow(name: string, data: Record<string, string | number>): Promise<void>;
}
