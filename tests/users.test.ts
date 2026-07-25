import { test, expect } from '../fixtures';
import { buildUser, roleLabelToId } from '../helpers/testData';
import { createUserViaApi } from '../helpers/api';

test.describe('Users CRUD', () => {
  test('creates a new user', async ({ usersPage, trackUserForCleanup }) => {
    const user = buildUser();

    await test.step('navigate to the users page', async () => {
      await usersPage.goto();
      await usersPage.openUsersPage();
    });

    await test.step('fill and submit the create form', async () => {
      await usersPage.openCreateForm();
      await usersPage.fillForm(user);
    });

    const created = await usersPage.submitAndWaitForApi('POST');
    trackUserForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await usersPage.expectSuccessToast('User created successfully');
      await usersPage.expectRow(user.name, {
        email: user.email,
        roleLabel: user.roleLabel,
        status: user.status,
      });
    });
  });

  test('edits an existing user', async ({ usersPage, trackUserForCleanup, request }) => {
    const original = buildUser();
    const created = await createUserViaApi(request, {
      name: original.name,
      email: original.email,
      roleId: roleLabelToId(original.roleLabel),
      status: original.status,
    });
    trackUserForCleanup(created.id);

    const updated = buildUser({
      name: `Edit ${original.name}`,
      roleLabel: 'Viewer',
      status: 'inactive',
    });

    await test.step('navigate to the users page', async () => {
      await usersPage.goto();
      await usersPage.openUsersPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await usersPage.expectRow(original.name, {
        email: original.email,
        roleLabel: original.roleLabel,
        status: original.status,
      });
    });

    await test.step('edit and submit', async () => {
      await usersPage.openEditForm(original.name);
      await usersPage.fillForm(updated);
      await usersPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await usersPage.expectSuccessToast('User updated successfully');
      await usersPage.expectRow(updated.name, {
        email: updated.email,
        roleLabel: updated.roleLabel,
        status: updated.status,
      });
    });
  });

  test('deletes an existing user', async ({ usersPage, request }) => {
    // No trackUserForCleanup here on purpose — deleting the user via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const user = buildUser();
    await createUserViaApi(request, {
      name: user.name,
      email: user.email,
      roleId: roleLabelToId(user.roleLabel),
      status: user.status,
    });

    await test.step('navigate to the users page', async () => {
      await usersPage.goto();
      await usersPage.openUsersPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await usersPage.expectRow(user.name, {
        email: user.email,
        roleLabel: user.roleLabel,
        status: user.status,
      });
    });

    await test.step('delete via UI', async () => {
      await usersPage.deleteUser(user.name);
      await usersPage.expectSuccessToast('User deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(usersPage.usersDataTable).not.toContainText(user.name);
    });
  });
});