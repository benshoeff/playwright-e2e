import { test, expect } from '../fixtures';
import { buildRole, buildUser, buildProject, randomProjectStatus, randomProjectPriority } from '../helpers/testData';
import {
  createRoleViaApi,
  createUserViaApi,
  createProjectViaApi,
  rolesApiPath,
  usersApiPath,
  projectsApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Projects CRUD', () => {
  test('creates a new project', async ({ projectsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const owner = buildUser({ roleLabel: role.name });
    const createdOwner = await createUserViaApi(request, {
      name: owner.name,
      email: owner.email,
      roleId: createdRole.id,
      status: owner.status,
    });
    trackForCleanup(usersApiPath, createdOwner.id);

    const project = buildProject({ ownerLabel: owner.name });

    const created = await createViaUi(projectsPage, {
      entityLabel: 'projects',
      data: project,
      createdName: project.name,
      rowData: {
        ownerLabel: project.ownerLabel,
        status: project.status,
        priority: project.priority,
      },
      toast: 'Project created successfully',
      track: (id) => trackForCleanup(projectsApiPath, id),
    });

    await test.step('verify the chosen status and priority were persisted', async () => {
      expect(created.status).toBe(project.status);
      expect(created.priority).toBe(project.priority);
    });
  });

  test('edits an existing project', async ({ projectsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const originalOwner = buildUser({ roleLabel: role.name });
    const originalOwnerCreated = await createUserViaApi(request, {
      name: originalOwner.name,
      email: originalOwner.email,
      roleId: createdRole.id,
      status: originalOwner.status,
    });
    trackForCleanup(usersApiPath, originalOwnerCreated.id);

    const updatedOwner = buildUser({ roleLabel: role.name });
    const updatedOwnerCreated = await createUserViaApi(request, {
      name: updatedOwner.name,
      email: updatedOwner.email,
      roleId: createdRole.id,
      status: updatedOwner.status,
    });
    trackForCleanup(usersApiPath, updatedOwnerCreated.id);

    const original = buildProject({ ownerLabel: originalOwner.name });
    const created = await createProjectViaApi(request, {
      name: original.name,
      description: original.description,
      ownerId: originalOwnerCreated.id,
      status: original.status,
      priority: original.priority,
      startDate: original.startDate,
      endDate: original.endDate,
    });
    trackForCleanup(projectsApiPath, created.id);

    const updated = buildProject({
      name: `Edit ${original.name}`,
      description: `Updated ${original.description}`,
      status: randomProjectStatus(original.status),
      priority: randomProjectPriority(original.priority),
      ownerLabel: updatedOwner.name,
    });

    const apiResult = await editViaUi(projectsPage, {
      entityLabel: 'projects',
      originalName: original.name,
      originalRowData: {
        ownerLabel: original.ownerLabel,
        status: original.status,
        priority: original.priority,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        ownerLabel: updated.ownerLabel,
        status: updated.status,
        priority: updated.priority,
      },
      toast: 'Project updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.status).toBe(updated.status);
      expect(apiResult.priority).toBe(updated.priority);
    });
  });

  test('deletes an existing project', async ({ projectsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const owner = buildUser({ roleLabel: role.name });
    const createdOwner = await createUserViaApi(request, {
      name: owner.name,
      email: owner.email,
      roleId: createdRole.id,
      status: owner.status,
    });
    trackForCleanup(usersApiPath, createdOwner.id);

    const project = buildProject({ ownerLabel: owner.name });
    await createProjectViaApi(request, {
      name: project.name,
      description: project.description,
      ownerId: createdOwner.id,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
    });

    await deleteViaUi(projectsPage, {
      entityLabel: 'projects',
      name: project.name,
      rowData: {
        ownerLabel: project.ownerLabel,
        status: project.status,
        priority: project.priority,
      },
      toast: 'Project deleted successfully',
    });
  });
});
