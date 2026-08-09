import { test, expect } from '../fixtures';
import { buildRole } from '../helpers/testData';
import { createRoleViaApi } from '../helpers/api';

test.describe('Roles CRUD', () => {
  test('creates a new role', async ({ rolesPage, trackRoleForCleanup }) => {
    const role = buildRole();

    await test.step('navigate to the roles page', async () => {
      await rolesPage.goto();
      await rolesPage.openRolesPage();
    });

    await test.step('fill and submit the create form', async () => {
      await rolesPage.openCreateForm();
      await rolesPage.fillForm(role);
    });

    const created = await rolesPage.submitAndWaitForApi('POST');
    trackRoleForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await rolesPage.expectSuccessToast('Role created successfully');
      await rolesPage.expectRow(role.name, {
        description: role.description,
      });
    });
  });

  test('edits an existing role', async ({ rolesPage, trackRoleForCleanup, request }) => {
    const original = buildRole();
    const created = await createRoleViaApi(request, {
      name: original.name,
      description: original.description,
    });
    trackRoleForCleanup(created.id);

    const updated = buildRole({
      name: `Edit ${original.name}`,
      description: `Updated ${original.description}`,
    });

    await test.step('navigate to the roles page', async () => {
      await rolesPage.goto();
      await rolesPage.openRolesPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await rolesPage.expectRow(original.name, {
        description: original.description,
      });
    });

    await test.step('edit and submit', async () => {
      await rolesPage.openEditForm(original.name);
      await rolesPage.fillForm(updated);
      await rolesPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await rolesPage.expectSuccessToast('Role updated successfully');
      await rolesPage.expectRow(updated.name, {
        description: updated.description,
      });
    });
  });

  test('deletes an existing role', async ({ rolesPage, request }) => {
    // No trackRoleForCleanup here on purpose — deleting the role via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    await createRoleViaApi(request, {
      name: role.name,
      description: role.description,
    });

    await test.step('navigate to the roles page', async () => {
      await rolesPage.goto();
      await rolesPage.openRolesPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await rolesPage.expectRow(role.name, {
        description: role.description,
      });
    });

    await test.step('delete via UI', async () => {
      await rolesPage.deleteRole(role.name);
      await rolesPage.expectSuccessToast('Role deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(rolesPage.rolesDataTable).not.toContainText(role.name);
    });
  });
});
