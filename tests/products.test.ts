import { test } from '../fixtures';
import { buildCategory, buildProduct } from '../helpers/testData';
import {
  createCategoryViaApi,
  createProductViaApi,
  categoriesApiPath,
  productsApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Products CRUD', () => {
  test('creates a new product', async ({ productsPage, trackForCleanup, request }) => {
    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });
    trackForCleanup(categoriesApiPath, createdCategory.id);

    const product = buildProduct({ categoryLabel: category.name });

    await createViaUi(productsPage, {
      entityLabel: 'products',
      data: product,
      createdName: product.name,
      rowData: {
        price: product.price,
        categoryLabel: product.categoryLabel,
        status: product.status,
      },
      toast: 'Product created successfully',
      track: (id) => trackForCleanup(productsApiPath, id),
    });
  });

  test('edits an existing product', async ({ productsPage, trackForCleanup, request }) => {
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

    const original = buildProduct({ categoryLabel: originalCategory.name });
    const created = await createProductViaApi(request, {
      name: original.name,
      description: original.description,
      price: original.price,
      categoryId: originalCategoryCreated.id,
      status: original.status,
    });
    trackForCleanup(productsApiPath, created.id);

    const updated = buildProduct({
      name: `Edit ${original.name}`,
      price: 199.99,
      categoryLabel: updatedCategory.name,
      status: 'discontinued',
    });

    await editViaUi(productsPage, {
      entityLabel: 'products',
      originalName: original.name,
      originalRowData: {
        price: original.price,
        categoryLabel: original.categoryLabel,
        status: original.status,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        price: updated.price,
        categoryLabel: updated.categoryLabel,
        status: updated.status,
      },
      toast: 'Product updated successfully',
    });
  });

  test('deletes an existing product', async ({ productsPage, trackForCleanup, request }) => {
    // No cleanup for the product on purpose — deleting the product via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });
    trackForCleanup(categoriesApiPath, createdCategory.id);

    const product = buildProduct({ categoryLabel: category.name });
    await createProductViaApi(request, {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: createdCategory.id,
      status: product.status,
    });

    await deleteViaUi(productsPage, {
      entityLabel: 'products',
      name: product.name,
      rowData: {
        price: product.price,
        categoryLabel: product.categoryLabel,
        status: product.status,
      },
      toast: 'Product deleted successfully',
    });
  });
});
