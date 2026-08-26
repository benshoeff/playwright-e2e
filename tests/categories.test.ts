import { test, expect } from '../fixtures';
import { buildCategory } from '../helpers/testData';
import { createCategoryViaApi, categoriesApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Categories CRUD', () => {
  test('creates a new category', async ({ categoriesPage, trackForCleanup }) => {
    const category = buildCategory();

    const created = await createViaUi(categoriesPage, {
      entityLabel: 'categories',
      data: category,
      createdName: category.name,
      rowData: {
        description: category.description,
      },
      toast: 'Category created successfully',
      track: (id) => trackForCleanup(categoriesApiPath, id),
    });

    await test.step('verify the chosen name was persisted', async () => {
      expect(created.name).toBe(category.name);
    });
  });

  test('edits an existing category', async ({ categoriesPage, trackForCleanup, request }) => {
    const original = buildCategory();
    const created = await createCategoryViaApi(request, {
      name: original.name,
      description: original.description,
    });
    trackForCleanup(categoriesApiPath, created.id);

    const updated = buildCategory({
      name: `Edit ${original.name}`,
      description: `Updated ${original.description}`,
    });

    const apiResult = await editViaUi(categoriesPage, {
      entityLabel: 'categories',
      originalName: original.name,
      originalRowData: {
        description: original.description,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        description: updated.description,
      },
      toast: 'Category updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.name).toBe(updated.name);
    });
  });

  test('deletes an existing category', async ({ categoriesPage, request }) => {
    // No cleanup for the category on purpose — deleting the category via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const category = buildCategory();
    await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });

    await deleteViaUi(categoriesPage, {
      entityLabel: 'categories',
      name: category.name,
      rowData: {
        description: category.description,
      },
      toast: 'Category deleted successfully',
    });
  });
});
