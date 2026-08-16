import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { TaskFormData } from '../helpers/testData';
import { tasksApiPath } from '../helpers/api';

export class TasksPage extends CrudPage<TaskFormData> {
  readonly titleInput: Locator;
  readonly statusSelect: Locator;
  readonly prioritySelect: Locator;
  readonly assigneeIdSelect: Locator;
  readonly dueDateInput: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: tasksApiPath,
      entityName: 'Task',
      addButtonTestId: 'add-tasks-button',
      sidebarTestId: 'tasks-sidebar-item',
      dataTableTestId: 'tasks-data-table',
      pageTitle: 'Tasks',
      pageDescription: 'Track project tasks and assignments',
    });

    this.titleInput = page.getByTestId('title-input');
    this.statusSelect = page.getByTestId('status-select');
    this.prioritySelect = page.getByTestId('priority-select');
    this.assigneeIdSelect = page.getByTestId('assigneeId-select');
    this.dueDateInput = page.getByTestId('dueDate-input');
  }

  async fillForm(data: TaskFormData) {
    await this.titleInput.fill(data.title);
    await this.textareaInput.fill(data.description);
    await this.statusSelect.selectOption({ label: data.status });
    await this.prioritySelect.selectOption({ label: data.priority });
    await this.assigneeIdSelect.selectOption({ label: data.assigneeLabel });
    await this.dueDateInput.fill(data.dueDate);
  }

  async expectRow(taskTitle: string, data: { priority: string; status: string; assigneeLabel: string }) {
    const row = this.row(taskTitle);
    await expect(row.getByTestId('data-title')).toContainText(taskTitle);
    await expect(row.getByTestId('data-priority')).toContainText(data.priority);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
    await expect(row.getByTestId('data-assigneeId')).toContainText(data.assigneeLabel);
  }
}
