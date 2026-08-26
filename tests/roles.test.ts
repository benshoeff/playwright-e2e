import { test, expect } from '../fixtures';
import { buildRole } from '../helpers/testData';
import { createRoleViaApi, rolesApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Roles CRUD', () => {
  test('creates a new role', async ({ rolesPage, trackForCleanup }) => {
    const role = buildRole();

    const created = await createViaUi(rolesPage, {
      entityLabel: 'roles',
      data: role,
      createdName: role.name,
      rowData: {
        description: role.description,
      },
      toast: 'Role created successfully',
      track: (id) => trackForCleanup(rolesApiPath, id),
    });

    await test.step('verify the chosen name was persisted', async () => {
      expect(created.name).toBe(role.name);
    });
  });

  test('edits an existing role', async ({ rolesPage, trackForCleanup, request }) => {
    const original = buildRole();
    const created = await createRoleViaApi(request, {
      name: original.name,
      description: original.description,
    });
    trackForCleanup(rolesApiPath, created.id);

    const updated = buildRole({
      name: `Edit ${original.name}`,
      description: `Updated ${original.description}`,
    });

    const apiResult = await editViaUi(rolesPage, {
      entityLabel: 'roles',
      originalName: original.name,
      originalRowData: {
        description: original.description,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        description: updated.description,
      },
      toast: 'Role updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.name).toBe(updated.name);
    });
  });

  test('deletes an existing role', async ({ rolesPage, request }) => {
    // No cleanup for the role on purpose — deleting the role via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    await createRoleViaApi(request, {
      name: role.name,
      description: role.description,
    });

    await deleteViaUi(rolesPage, {
      entityLabel: 'roles',
      name: role.name,
      rowData: {
        description: role.description,
      },
      toast: 'Role deleted successfully',
    });
  });
});
