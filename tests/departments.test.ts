import { test, expect } from '../fixtures';
import { buildDepartment, buildUser, buildRole } from '../helpers/testData';
import {
  createDepartmentViaApi,
  createRoleViaApi,
  createUserViaApi,
  departmentsApiPath,
  rolesApiPath,
  usersApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Departments CRUD', () => {
  test('creates a new department', async ({ departmentsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const manager = buildUser({ roleLabel: role.name });
    const createdManager = await createUserViaApi(request, {
      name: manager.name,
      email: manager.email,
      roleId: createdRole.id,
      status: manager.status,
    });
    trackForCleanup(usersApiPath, createdManager.id);

    const department = buildDepartment({ managerLabel: manager.name });

    const created = await createViaUi(departmentsPage, {
      entityLabel: 'departments',
      data: department,
      createdName: department.name,
      rowData: {
        description: department.description,
        ...(department.managerLabel ? { managerLabel: department.managerLabel } : {}),
      },
      toast: 'Department created successfully',
      track: (id) => trackForCleanup(departmentsApiPath, id),
    });

    await test.step('verify the chosen name was persisted', async () => {
      expect(created.name).toBe(department.name);
    });
  });

  test('edits an existing department', async ({ departmentsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const originalManager = buildUser({ roleLabel: role.name });
    const createdOriginalManager = await createUserViaApi(request, {
      name: originalManager.name,
      email: originalManager.email,
      roleId: createdRole.id,
      status: originalManager.status,
    });
    trackForCleanup(usersApiPath, createdOriginalManager.id);

    const updatedManager = buildUser({ roleLabel: role.name });
    const createdUpdatedManager = await createUserViaApi(request, {
      name: updatedManager.name,
      email: updatedManager.email,
      roleId: createdRole.id,
      status: updatedManager.status,
    });
    trackForCleanup(usersApiPath, createdUpdatedManager.id);

    const original = buildDepartment({ managerLabel: originalManager.name });
    const created = await createDepartmentViaApi(request, {
      name: original.name,
      description: original.description,
      managerId: createdOriginalManager.id,
    });
    trackForCleanup(departmentsApiPath, created.id);

    const updated = buildDepartment({
      name: `Edit ${original.name}`,
      description: `Updated ${original.description}`,
      managerLabel: updatedManager.name,
    });

    const apiResult = await editViaUi(departmentsPage, {
      entityLabel: 'departments',
      originalName: original.name,
      originalRowData: {
        description: original.description,
        ...(original.managerLabel ? { managerLabel: original.managerLabel } : {}),
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        description: updated.description,
        ...(updated.managerLabel ? { managerLabel: updated.managerLabel } : {}),
      },
      toast: 'Department updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.name).toBe(updated.name);
    });
  });

  test('deletes an existing department', async ({ departmentsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const manager = buildUser({ roleLabel: role.name });
    const createdManager = await createUserViaApi(request, {
      name: manager.name,
      email: manager.email,
      roleId: createdRole.id,
      status: manager.status,
    });
    trackForCleanup(usersApiPath, createdManager.id);

    const department = buildDepartment({ managerLabel: manager.name });
    await createDepartmentViaApi(request, {
      name: department.name,
      description: department.description,
      managerId: createdManager.id,
    });

    await deleteViaUi(departmentsPage, {
      entityLabel: 'departments',
      name: department.name,
      rowData: {
        description: department.description,
        ...(department.managerLabel ? { managerLabel: department.managerLabel } : {}),
      },
      toast: 'Department deleted successfully',
    });
  });
});
