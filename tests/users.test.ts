import { test } from '../fixtures';
import { buildUser, buildRole } from '../helpers/testData';
import { createUserViaApi, createRoleViaApi, usersApiPath, rolesApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Users CRUD', () => {
  test('creates a new user', async ({ usersPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const user = buildUser({ roleLabel: role.name });

    await createViaUi(usersPage, {
      entityLabel: 'users',
      data: user,
      createdName: user.name,
      rowData: {
        email: user.email,
        roleLabel: user.roleLabel,
        status: user.status,
      },
      toast: 'User created successfully',
      track: (id) => trackForCleanup(usersApiPath, id),
    });
  });

  test('edits an existing user', async ({ usersPage, trackForCleanup, request }) => {
    const originalRole = buildRole();
    const originalRoleCreated = await createRoleViaApi(request, originalRole);
    trackForCleanup(rolesApiPath, originalRoleCreated.id);

    const updatedRole = buildRole();
    const updatedRoleCreated = await createRoleViaApi(request, updatedRole);
    trackForCleanup(rolesApiPath, updatedRoleCreated.id);

    const original = buildUser({ roleLabel: originalRole.name });
    const created = await createUserViaApi(request, {
      name: original.name,
      email: original.email,
      roleId: originalRoleCreated.id,
      status: original.status,
    });
    trackForCleanup(usersApiPath, created.id);

    const updated = buildUser({
      name: `Edit ${original.name}`,
      roleLabel: updatedRole.name,
      status: 'inactive',
    });

    await editViaUi(usersPage, {
      entityLabel: 'users',
      originalName: original.name,
      originalRowData: {
        email: original.email,
        roleLabel: original.roleLabel,
        status: original.status,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        email: updated.email,
        roleLabel: updated.roleLabel,
        status: updated.status,
      },
      toast: 'User updated successfully',
    });
  });

  test('deletes an existing user', async ({ usersPage, trackForCleanup, request }) => {
    // No cleanup for the user on purpose — deleting the user via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const user = buildUser({ roleLabel: role.name });
    await createUserViaApi(request, {
      name: user.name,
      email: user.email,
      roleId: createdRole.id,
      status: user.status,
    });

    await deleteViaUi(usersPage, {
      entityLabel: 'users',
      name: user.name,
      rowData: {
        email: user.email,
        roleLabel: user.roleLabel,
        status: user.status,
      },
      toast: 'User deleted successfully',
    });
  });
});
