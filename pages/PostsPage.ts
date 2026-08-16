import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { PostFormData } from '../helpers/testData';
import { postsApiPath } from '../helpers/api';

export class PostsPage extends CrudPage<PostFormData> {
  readonly titleInput: Locator;
  readonly authorIdSelect: Locator;
  readonly categoryIdSelect: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: postsApiPath,
      entityName: 'Post',
      addButtonTestId: 'add-posts-button',
      sidebarTestId: 'posts-sidebar-item',
      dataTableTestId: 'posts-data-table',
      pageTitle: 'Posts',
      pageDescription: 'Manage blog posts and articles',
    });

    this.titleInput = page.getByTestId('title-input');
    this.authorIdSelect = page.getByTestId('authorId-select');
    this.categoryIdSelect = page.getByTestId('categoryId-select');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: PostFormData) {
    await this.titleInput.fill(data.title);
    await this.textareaInput.fill(data.content);
    await this.authorIdSelect.selectOption({ label: data.authorLabel });
    await this.categoryIdSelect.selectOption({ label: data.categoryLabel });
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(postTitle: string, data: { authorLabel: string; status: string }) {
    const row = this.row(postTitle);
    await expect(row.getByTestId('data-title')).toContainText(postTitle);
    await expect(row.getByTestId('data-authorId')).toContainText(data.authorLabel);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
  }
}
