import { test, expect } from '../fixtures';
import {
  buildCategory,
  buildProduct,
  buildReview,
  randomReviewRating,
  randomReviewStatus,
} from '../helpers/testData';
import {
  createCategoryViaApi,
  createProductViaApi,
  createReviewViaApi,
  categoriesApiPath,
  productsApiPath,
  reviewsApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Reviews CRUD', () => {
  test('creates a new review', async ({ reviewsPage, trackForCleanup, request }) => {
    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });
    trackForCleanup(categoriesApiPath, createdCategory.id);

    const product = buildProduct({ categoryLabel: category.name });
    const createdProduct = await createProductViaApi(request, {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: createdCategory.id,
      status: product.status,
    });
    trackForCleanup(productsApiPath, createdProduct.id);

    const review = buildReview({ productLabel: product.name });

    const created = await createViaUi(reviewsPage, {
      entityLabel: 'reviews',
      data: review,
      createdName: review.author,
      rowData: {
        productLabel: review.productLabel,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
      },
      toast: 'Review created successfully',
      track: (id) => trackForCleanup(reviewsApiPath, id),
    });

    await test.step('verify the chosen rating and status were persisted', async () => {
      expect(created.rating).toBe(review.rating);
      expect(created.productId).toBe(createdProduct.id);
      expect(created.status).toBe(review.status);
    });
  });

  test('edits an existing review', async ({ reviewsPage, trackForCleanup, request }) => {
    const originalCategory = buildCategory();
    const originalCategoryCreated = await createCategoryViaApi(request, {
      name: originalCategory.name,
      description: originalCategory.description,
    });
    trackForCleanup(categoriesApiPath, originalCategoryCreated.id);

    const updatedCategory = buildCategory();
    const updatedCategoryCreated = await createCategoryViaApi(request, {
      name: updatedCategory.name,
      description: updatedCategory.description,
    });
    trackForCleanup(categoriesApiPath, updatedCategoryCreated.id);

    const originalProduct = buildProduct({ categoryLabel: originalCategory.name });
    const originalProductCreated = await createProductViaApi(request, {
      name: originalProduct.name,
      description: originalProduct.description,
      price: originalProduct.price,
      categoryId: originalCategoryCreated.id,
      status: originalProduct.status,
    });
    trackForCleanup(productsApiPath, originalProductCreated.id);

    const updatedProduct = buildProduct({ categoryLabel: updatedCategory.name });
    const updatedProductCreated = await createProductViaApi(request, {
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      categoryId: updatedCategoryCreated.id,
      status: updatedProduct.status,
    });
    trackForCleanup(productsApiPath, updatedProductCreated.id);

    const original = buildReview({ productLabel: originalProduct.name });
    const created = await createReviewViaApi(request, {
      productId: originalProductCreated.id,
      author: original.author,
      rating: original.rating,
      comment: original.comment,
      status: original.status,
    });
    trackForCleanup(reviewsApiPath, created.id);

    const updated = buildReview({
      productLabel: updatedProduct.name,
      author: `Edit ${original.author}`,
      rating: randomReviewRating(original.rating),
      comment: `Updated ${original.comment}`,
      status: randomReviewStatus(original.status),
    });

    const apiResult = await editViaUi(reviewsPage, {
      entityLabel: 'reviews',
      originalName: original.author,
      originalRowData: {
        productLabel: original.productLabel,
        rating: original.rating,
        comment: original.comment,
        status: original.status,
      },
      updated,
      updatedName: updated.author,
      updatedRowData: {
        productLabel: updated.productLabel,
        rating: updated.rating,
        comment: updated.comment,
        status: updated.status,
      },
      toast: 'Review updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.author).toBe(updated.author);
      expect(apiResult.productId).toBe(updatedProductCreated.id);
      expect(apiResult.rating).toBe(updated.rating);
      expect(apiResult.status).toBe(updated.status);
    });
  });

  test('deletes an existing review', async ({ reviewsPage, trackForCleanup, request }) => {
    // No cleanup for the review on purpose — deleting the review via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });
    trackForCleanup(categoriesApiPath, createdCategory.id);

    const product = buildProduct({ categoryLabel: category.name });
    const createdProduct = await createProductViaApi(request, {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: createdCategory.id,
      status: product.status,
    });
    trackForCleanup(productsApiPath, createdProduct.id);

    const review = buildReview({ productLabel: product.name });
    await createReviewViaApi(request, {
      productId: createdProduct.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
    });

    await deleteViaUi(reviewsPage, {
      entityLabel: 'reviews',
      name: review.author,
      rowData: {
        productLabel: review.productLabel,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
      },
      toast: 'Review deleted successfully',
    });
  });
});
