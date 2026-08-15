import { test, expect } from '../fixtures';
import { buildRole, buildUser, buildTask } from '../helpers/testData';
import { createRoleViaApi, createUserViaApi, createTaskViaApi } from '../helpers/api';

test.describe('Tasks CRUD', () => {
  test('creates a new task', async ({ tasksPage, trackRoleForCleanup, trackUserForCleanup, trackTaskForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackRoleForCleanup(createdRole.id);

    const assignee = buildUser({ roleLabel: role.name });
    const createdAssignee = await createUserViaApi(request, {
      name: assignee.name,
      email: assignee.email,
      roleId: createdRole.id,
      status: assignee.status,
    });
    trackUserForCleanup(createdAssignee.id);

    const task = buildTask({ assigneeLabel: assignee.name });

    await test.step('navigate to the tasks page', async () => {
      await tasksPage.goto();
      await tasksPage.openTasksPage();
    });

    await test.step('fill and submit the create form', async () => {
      await tasksPage.openCreateForm();
      await tasksPage.fillForm(task);
    });

    const created = await tasksPage.submitAndWaitForApi('POST');
    trackTaskForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await tasksPage.expectSuccessToast('Task created successfully');
      await tasksPage.expectRow(task.title, {
        priority: task.priority,
        status: task.status,
        assigneeLabel: task.assigneeLabel,
      });
    });
  });

  test('edits an existing task', async ({ tasksPage, trackRoleForCleanup, trackUserForCleanup, trackTaskForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackRoleForCleanup(createdRole.id);

    const originalAssignee = buildUser({ roleLabel: role.name });
    const originalAssigneeCreated = await createUserViaApi(request, {
      name: originalAssignee.name,
      email: originalAssignee.email,
      roleId: createdRole.id,
      status: originalAssignee.status,
    });
    trackUserForCleanup(originalAssigneeCreated.id);

    const updatedAssignee = buildUser({ roleLabel: role.name });
    const updatedAssigneeCreated = await createUserViaApi(request, {
      name: updatedAssignee.name,
      email: updatedAssignee.email,
      roleId: createdRole.id,
      status: updatedAssignee.status,
    });
    trackUserForCleanup(updatedAssigneeCreated.id);

    const original = buildTask({ assigneeLabel: originalAssignee.name });
    const created = await createTaskViaApi(request, {
      title: original.title,
      description: original.description,
      status: original.status,
      priority: original.priority,
      assigneeId: originalAssigneeCreated.id,
      dueDate: original.dueDate,
    });
    trackTaskForCleanup(created.id);

    const updated = buildTask({
      title: `Edit ${original.title}`,
      description: `Updated ${original.description}`,
      status: 'done',
      priority: 'high',
      assigneeLabel: updatedAssignee.name,
    });

    await test.step('navigate to the tasks page', async () => {
      await tasksPage.goto();
      await tasksPage.openTasksPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await tasksPage.expectRow(original.title, {
        priority: original.priority,
        status: original.status,
        assigneeLabel: original.assigneeLabel,
      });
    });

    await test.step('edit and submit', async () => {
      await tasksPage.openEditForm(original.title);
      await tasksPage.fillForm(updated);
      await tasksPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await tasksPage.expectSuccessToast('Task updated successfully');
      await tasksPage.expectRow(updated.title, {
        priority: updated.priority,
        status: updated.status,
        assigneeLabel: updated.assigneeLabel,
      });
    });
  });

  test('deletes an existing task', async ({ tasksPage, trackRoleForCleanup, trackUserForCleanup, request }) => {
    // No trackTaskForCleanup here on purpose — deleting the task via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackRoleForCleanup(createdRole.id);

    const assignee = buildUser({ roleLabel: role.name });
    const createdAssignee = await createUserViaApi(request, {
      name: assignee.name,
      email: assignee.email,
      roleId: createdRole.id,
      status: assignee.status,
    });
    trackUserForCleanup(createdAssignee.id);

    const task = buildTask({ assigneeLabel: assignee.name });
    await createTaskViaApi(request, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: createdAssignee.id,
      dueDate: task.dueDate,
    });

    await test.step('navigate to the tasks page', async () => {
      await tasksPage.goto();
      await tasksPage.openTasksPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await tasksPage.expectRow(task.title, {
        priority: task.priority,
        status: task.status,
        assigneeLabel: task.assigneeLabel,
      });
    });

    await test.step('delete via UI', async () => {
      await tasksPage.deleteTask(task.title);
      await tasksPage.expectSuccessToast('Task deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(tasksPage.tasksDataTable).not.toContainText(task.title);
    });
  });
});
