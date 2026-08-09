import { test, expect } from '../fixtures';
import { buildPermission } from '../helpers/testData';
import { createPermissionViaApi } from '../helpers/api';

test.describe('Permissions CRUD', () => {
  test('creates a new permission', async ({ permissionsPage, trackPermissionForCleanup }) => {
    const permission = buildPermission();

    await test.step('navigate to the permissions page', async () => {
      await permissionsPage.goto();
      await permissionsPage.openPermissionsPage();
    });

    await test.step('fill and submit the create form', async () => {
      await permissionsPage.openCreateForm();
      await permissionsPage.fillForm(permission);
    });

    const created = await permissionsPage.submitAndWaitForApi('POST');
    trackPermissionForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await permissionsPage.expectSuccessToast('Permission created successfully');
      await permissionsPage.expectRow(permission.name, {
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      });
    });
  });

  test('edits an existing permission', async ({ permissionsPage, trackPermissionForCleanup, request }) => {
    const original = buildPermission();
    const created = await createPermissionViaApi(request, {
      name: original.name,
      resource: original.resource,
      action: original.action,
      description: original.description,
    });
    trackPermissionForCleanup(created.id);

    const updated = buildPermission({
      name: `Edit ${original.name}`,
      action: 'manage',
      description: `Updated ${original.description}`,
    });

    await test.step('navigate to the permissions page', async () => {
      await permissionsPage.goto();
      await permissionsPage.openPermissionsPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await permissionsPage.expectRow(original.name, {
        resource: original.resource,
        action: original.action,
        description: original.description,
      });
    });

    await test.step('edit and submit', async () => {
      await permissionsPage.openEditForm(original.name);
      await permissionsPage.fillForm(updated);
      await permissionsPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await permissionsPage.expectSuccessToast('Permission updated successfully');
      await permissionsPage.expectRow(updated.name, {
        resource: updated.resource,
        action: updated.action,
        description: updated.description,
      });
    });
  });

  test('deletes an existing permission', async ({ permissionsPage, request }) => {
    // No trackPermissionForCleanup here on purpose — deleting the permission via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const permission = buildPermission();
    await createPermissionViaApi(request, {
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description,
    });

    await test.step('navigate to the permissions page', async () => {
      await permissionsPage.goto();
      await permissionsPage.openPermissionsPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await permissionsPage.expectRow(permission.name, {
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      });
    });

    await test.step('delete via UI', async () => {
      await permissionsPage.deletePermission(permission.name);
      await permissionsPage.expectSuccessToast('Permission deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(permissionsPage.permissionsDataTable).not.toContainText(permission.name);
    });
  });
});
