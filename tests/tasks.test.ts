import { test, expect } from '../fixtures';
import { buildRole, buildUser, buildTask, randomTaskStatus, randomTaskPriority } from '../helpers/testData';
import {
  createRoleViaApi,
  createUserViaApi,
  createTaskViaApi,
  rolesApiPath,
  usersApiPath,
  tasksApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Tasks CRUD', () => {
  test('creates a new task', async ({ tasksPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const assignee = buildUser({ roleLabel: role.name });
    const createdAssignee = await createUserViaApi(request, {
      name: assignee.name,
      email: assignee.email,
      roleId: createdRole.id,
      status: assignee.status,
    });
    trackForCleanup(usersApiPath, createdAssignee.id);

    const task = buildTask({ assigneeLabel: assignee.name });

    const created = await createViaUi(tasksPage, {
      entityLabel: 'tasks',
      data: task,
      createdName: task.title,
      rowData: {
        priority: task.priority,
        status: task.status,
        assigneeLabel: task.assigneeLabel,
      },
      toast: 'Task created successfully',
      track: (id) => trackForCleanup(tasksApiPath, id),
    });

    await test.step('verify the chosen status and priority were persisted', async () => {
      expect(created.status).toBe(task.status);
      expect(created.priority).toBe(task.priority);
    });
  });

  test('edits an existing task', async ({ tasksPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const originalAssignee = buildUser({ roleLabel: role.name });
    const originalAssigneeCreated = await createUserViaApi(request, {
      name: originalAssignee.name,
      email: originalAssignee.email,
      roleId: createdRole.id,
      status: originalAssignee.status,
    });
    trackForCleanup(usersApiPath, originalAssigneeCreated.id);

    const updatedAssignee = buildUser({ roleLabel: role.name });
    const updatedAssigneeCreated = await createUserViaApi(request, {
      name: updatedAssignee.name,
      email: updatedAssignee.email,
      roleId: createdRole.id,
      status: updatedAssignee.status,
    });
    trackForCleanup(usersApiPath, updatedAssigneeCreated.id);

    const original = buildTask({ assigneeLabel: originalAssignee.name });
    const created = await createTaskViaApi(request, {
      title: original.title,
      description: original.description,
      status: original.status,
      priority: original.priority,
      assigneeId: originalAssigneeCreated.id,
      dueDate: original.dueDate,
    });
    trackForCleanup(tasksApiPath, created.id);

    const updated = buildTask({
      title: `Edit ${original.title}`,
      description: `Updated ${original.description}`,
      status: randomTaskStatus(original.status),
      priority: randomTaskPriority(original.priority),
      assigneeLabel: updatedAssignee.name,
    });

    const apiResult = await editViaUi(tasksPage, {
      entityLabel: 'tasks',
      originalName: original.title,
      originalRowData: {
        priority: original.priority,
        status: original.status,
        assigneeLabel: original.assigneeLabel,
      },
      updated,
      updatedName: updated.title,
      updatedRowData: {
        priority: updated.priority,
        status: updated.status,
        assigneeLabel: updated.assigneeLabel,
      },
      toast: 'Task updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.status).toBe(updated.status);
      expect(apiResult.priority).toBe(updated.priority);
    });
  });

  test('deletes an existing task', async ({ tasksPage, trackForCleanup, request }) => {
    // No cleanup for the task on purpose — deleting the task via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const assignee = buildUser({ roleLabel: role.name });
    const createdAssignee = await createUserViaApi(request, {
      name: assignee.name,
      email: assignee.email,
      roleId: createdRole.id,
      status: assignee.status,
    });
    trackForCleanup(usersApiPath, createdAssignee.id);

    const task = buildTask({ assigneeLabel: assignee.name });
    await createTaskViaApi(request, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: createdAssignee.id,
      dueDate: task.dueDate,
    });

    await deleteViaUi(tasksPage, {
      entityLabel: 'tasks',
      name: task.title,
      rowData: {
        priority: task.priority,
        status: task.status,
        assigneeLabel: task.assigneeLabel,
      },
      toast: 'Task deleted successfully',
    });
  });
});
