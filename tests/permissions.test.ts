import { test } from '../fixtures';
import { buildPermission } from '../helpers/testData';
import { createPermissionViaApi, permissionsApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Permissions CRUD', () => {
  test('creates a new permission', async ({ permissionsPage, trackForCleanup }) => {
    const permission = buildPermission();

    await createViaUi(permissionsPage, {
      entityLabel: 'permissions',
      data: permission,
      createdName: permission.name,
      rowData: {
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      },
      toast: 'Permission created successfully',
      track: (id) => trackForCleanup(permissionsApiPath, id),
    });
  });

  test('edits an existing permission', async ({ permissionsPage, trackForCleanup, request }) => {
    const original = buildPermission();
    const created = await createPermissionViaApi(request, {
      name: original.name,
      resource: original.resource,
      action: original.action,
      description: original.description,
    });
    trackForCleanup(permissionsApiPath, created.id);

    const updated = buildPermission({
      name: `Edit ${original.name}`,
      action: 'manage',
      description: `Updated ${original.description}`,
    });

    await editViaUi(permissionsPage, {
      entityLabel: 'permissions',
      originalName: original.name,
      originalRowData: {
        resource: original.resource,
        action: original.action,
        description: original.description,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        resource: updated.resource,
        action: updated.action,
        description: updated.description,
      },
      toast: 'Permission updated successfully',
    });
  });

  test('deletes an existing permission', async ({ permissionsPage, request }) => {
    // No cleanup for the permission on purpose — deleting the permission via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const permission = buildPermission();
    await createPermissionViaApi(request, {
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description,
    });

    await deleteViaUi(permissionsPage, {
      entityLabel: 'permissions',
      name: permission.name,
      rowData: {
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      },
      toast: 'Permission deleted successfully',
    });
  });
});
