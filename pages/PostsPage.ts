import { Page, Locator, expect } from '@playwright/test';
import { PostFormData } from '../helpers/testData';

export class PostsPage {
  readonly page: Page;

  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly postsSidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addPostButton: Locator;
  readonly titleInput: Locator;
  readonly contentInput: Locator;
  readonly authorIdSelect: Locator;
  readonly categoryIdSelect: Locator;
  readonly statusSelect: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly postsDataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.postsSidebarItem = page.getByTestId('posts-sidebar-item');
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addPostButton = page.getByTestId('add-posts-button');
    this.titleInput = page.getByTestId('title-input');
    this.contentInput = page.getByTestId('textarea-input');
    this.authorIdSelect = page.getByTestId('authorId-select');
    this.categoryIdSelect = page.getByTestId('categoryId-select');
    this.statusSelect = page.getByTestId('status-select');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.postsDataTable = page.getByTestId('posts-data-table');
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }

  row(postTitle: string): Locator {
    return this.page.locator('tr').filter({ hasText: postTitle });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }

  async openPostsPage() {
    await this.postsSidebarItem.click();
    await expect(this.pageTitle).toHaveText('Posts');
    await expect(this.pageDescription).toHaveText('Manage blog posts and articles');
  }

  async openCreateForm() {
    await this.addPostButton.click();
    await expect(this.page.locator('h2').last()).toHaveText('Create Post');
  }

  async openEditForm(postTitle: string) {
    await this.row(postTitle).getByTestId('edit-button').click();
  }

  async fillForm(data: PostFormData) {
    await this.titleInput.fill(data.title);
    await this.contentInput.fill(data.content);
    await this.authorIdSelect.selectOption({ label: data.authorLabel });
    await this.categoryIdSelect.selectOption({ label: data.categoryLabel });
    await this.statusSelect.selectOption({ label: data.status });
  }

  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/posts') && resp.request().method() === method
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

  async expectRow(postTitle: string, data: { authorLabel: string; status: string }) {
    const row = this.row(postTitle);
    await expect(row.getByTestId('data-title')).toContainText(postTitle);
    await expect(row.getByTestId('data-authorId')).toContainText(data.authorLabel);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
  }

  async deletePost(postTitle: string) {
    const row = this.row(postTitle);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText('Delete Post');
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }
}
