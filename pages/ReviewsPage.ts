import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { ReviewFormData } from '../helpers/testData';
import { reviewsApiPath } from '../helpers/api';

export class ReviewsPage extends CrudPage<ReviewFormData> {
  readonly productIdSelect: Locator;
  readonly authorInput: Locator;
  readonly ratingInput: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: reviewsApiPath,
      entityName: 'Review',
      addButtonTestId: 'add-reviews-button',
      sidebarTestId: 'reviews-sidebar-item',
      dataTableTestId: 'reviews-data-table',
      pageTitle: 'Reviews',
      pageDescription: 'Moderate product reviews and ratings',
    });

    this.productIdSelect = page.getByTestId('productId-select');
    this.authorInput = page.getByTestId('author-input');
    this.ratingInput = page.getByTestId('rating-input');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: ReviewFormData) {
    await this.productIdSelect.selectOption({ label: data.productLabel });
    await this.authorInput.fill(data.author);
    await this.ratingInput.fill(String(data.rating));
    await this.textareaInput.fill(data.comment);
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(
    reviewAuthor: string,
    data: { productLabel: string; rating: number; comment: string; status: string }
  ) {
    const row = this.row(reviewAuthor);
    await expect(row.getByTestId('data-author')).toContainText(reviewAuthor);
    await expect(row.getByTestId('data-productId')).toContainText(data.productLabel);
    // Rating renders as five stars: filled (amber) plus unfilled (gray).
    // The whole cell always totals five stars, and the unfilled ones sit in
    // the last span — so its text pins the rating down exactly.
    const ratingCell = row.getByTestId('data-rating');
    await expect(ratingCell).toHaveText('★★★★★');
    await expect(ratingCell.locator('span').last()).toHaveText('★'.repeat(5 - data.rating));
    await expect(row.getByTestId('data-comment')).toContainText(data.comment);
    // Exact match: anchored regex so no status value can pass for another.
    await expect(row.getByTestId('data-status')).toHaveText(new RegExp(`^\\s*${data.status}\\s*$`, 'i'));
  }
}
