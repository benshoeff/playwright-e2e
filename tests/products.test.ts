import { test, expect } from '../fixtures';
import { buildCategory, buildProduct } from '../helpers/testData';
import { createCategoryViaApi, createProductViaApi } from '../helpers/api';

test.describe('Products CRUD', () => {
  test('creates a new product', async ({ productsPage, trackCategoryForCleanup, trackProductForCleanup, request }) => {
    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });
    trackCategoryForCleanup(createdCategory.id);

    const product = buildProduct({ categoryLabel: category.name });

    await test.step('navigate to the products page', async () => {
      await productsPage.goto();
      await productsPage.openProductsPage();
    });

    await test.step('fill and submit the create form', async () => {
      await productsPage.openCreateForm();
      await productsPage.fillForm(product);
    });

    const created = await productsPage.submitAndWaitForApi('POST');
    trackProductForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await productsPage.expectSuccessToast('Product created successfully');
      await productsPage.expectRow(product.name, {
        price: product.price,
        categoryLabel: product.categoryLabel,
        status: product.status,
      });
    });
  });

  test('edits an existing product', async ({ productsPage, trackCategoryForCleanup, trackProductForCleanup, request }) => {
    const originalCategory = buildCategory();
    const originalCategoryCreated = await createCategoryViaApi(request, {
      name: originalCategory.name,
      description: originalCategory.description,
    });
    trackCategoryForCleanup(originalCategoryCreated.id);

    const updatedCategory = buildCategory();
    const updatedCategoryCreated = await createCategoryViaApi(request, {
      name: updatedCategory.name,
      description: updatedCategory.description,
    });
    trackCategoryForCleanup(updatedCategoryCreated.id);

    const original = buildProduct({ categoryLabel: originalCategory.name });
    const created = await createProductViaApi(request, {
      name: original.name,
      description: original.description,
      price: original.price,
      categoryId: originalCategoryCreated.id,
      status: original.status,
    });
    trackProductForCleanup(created.id);

    const updated = buildProduct({
      name: `Edit ${original.name}`,
      price: 199.99,
      categoryLabel: updatedCategory.name,
      status: 'discontinued',
    });

    await test.step('navigate to the products page', async () => {
      await productsPage.goto();
      await productsPage.openProductsPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await productsPage.expectRow(original.name, {
        price: original.price,
        categoryLabel: original.categoryLabel,
        status: original.status,
      });
    });

    await test.step('edit and submit', async () => {
      await productsPage.openEditForm(original.name);
      await productsPage.fillForm(updated);
      await productsPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await productsPage.expectSuccessToast('Product updated successfully');
      await productsPage.expectRow(updated.name, {
        price: updated.price,
        categoryLabel: updated.categoryLabel,
        status: updated.status,
      });
    });
  });

  test('deletes an existing product', async ({ productsPage, trackCategoryForCleanup, request }) => {
    // No trackProductForCleanup here on purpose — deleting the product via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });
    trackCategoryForCleanup(createdCategory.id);

    const product = buildProduct({ categoryLabel: category.name });
    await createProductViaApi(request, {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: createdCategory.id,
      status: product.status,
    });

    await test.step('navigate to the products page', async () => {
      await productsPage.goto();
      await productsPage.openProductsPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await productsPage.expectRow(product.name, {
        price: product.price,
        categoryLabel: product.categoryLabel,
        status: product.status,
      });
    });

    await test.step('delete via UI', async () => {
      await productsPage.deleteProduct(product.name);
      await productsPage.expectSuccessToast('Product deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(productsPage.productsDataTable).not.toContainText(product.name);
    });
  });
});
