import { test, expect } from '../fixtures';
import { buildCategory } from '../helpers/testData';
import { createCategoryViaApi } from '../helpers/api';

test.describe('Categories CRUD', () => {
  test('creates a new category', async ({ categoriesPage, trackCategoryForCleanup }) => {
    const category = buildCategory();

    await test.step('navigate to the categories page', async () => {
      await categoriesPage.goto();
      await categoriesPage.openCategoriesPage();
    });

    await test.step('fill and submit the create form', async () => {
      await categoriesPage.openCreateForm();
      await categoriesPage.fillForm(category);
    });

    const created = await categoriesPage.submitAndWaitForApi('POST');
    trackCategoryForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await categoriesPage.expectSuccessToast('Category created successfully');
      await categoriesPage.expectRow(category.name, {
        description: category.description,
      });
    });
  });

  test('edits an existing category', async ({ categoriesPage, trackCategoryForCleanup, request }) => {
    const original = buildCategory();
    const created = await createCategoryViaApi(request, {
      name: original.name,
      description: original.description,
    });
    trackCategoryForCleanup(created.id);

    const updated = buildCategory({
      name: `Edit ${original.name}`,
      description: `Updated ${original.description}`,
    });

    await test.step('navigate to the categories page', async () => {
      await categoriesPage.goto();
      await categoriesPage.openCategoriesPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await categoriesPage.expectRow(original.name, {
        description: original.description,
      });
    });

    await test.step('edit and submit', async () => {
      await categoriesPage.openEditForm(original.name);
      await categoriesPage.fillForm(updated);
      await categoriesPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await categoriesPage.expectSuccessToast('Category updated successfully');
      await categoriesPage.expectRow(updated.name, {
        description: updated.description,
      });
    });
  });

  test('deletes an existing category', async ({ categoriesPage, request }) => {
    // No trackCategoryForCleanup here on purpose — deleting the category via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const category = buildCategory();
    await createCategoryViaApi(request, {
      name: category.name,
      description: category.description,
    });

    await test.step('navigate to the categories page', async () => {
      await categoriesPage.goto();
      await categoriesPage.openCategoriesPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await categoriesPage.expectRow(category.name, {
        description: category.description,
      });
    });

    await test.step('delete via UI', async () => {
      await categoriesPage.deleteCategory(category.name);
      await categoriesPage.expectSuccessToast('Category deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(categoriesPage.categoriesDataTable).not.toContainText(category.name);
    });
  });
});
