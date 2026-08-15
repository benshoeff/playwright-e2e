import { Page, Locator, expect } from '@playwright/test';
import { TaskFormData } from '../helpers/testData';

export class TasksPage {
  readonly page: Page;

  readonly appName: Locator;
  readonly appDescription: Locator;
  readonly tasksSidebarItem: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly addTaskButton: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusSelect: Locator;
  readonly prioritySelect: Locator;
  readonly assigneeIdSelect: Locator;
  readonly dueDateInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly toastCloseButton: Locator;
  readonly tasksDataTable: Locator;
  readonly modalIcon: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appName = page.getByTestId('app-name');
    this.appDescription = page.getByTestId('app-description');
    this.tasksSidebarItem = page.getByTestId('tasks-sidebar-item');
    this.pageTitle = page.getByTestId('page-title');
    this.pageDescription = page.getByTestId('page-description');
    this.addTaskButton = page.getByTestId('add-tasks-button');
    this.titleInput = page.getByTestId('title-input');
    this.descriptionInput = page.getByTestId('textarea-input');
    this.statusSelect = page.getByTestId('status-select');
    this.prioritySelect = page.getByTestId('priority-select');
    this.assigneeIdSelect = page.getByTestId('assigneeId-select');
    this.dueDateInput = page.getByTestId('dueDate-input');
    this.submitButton = page.getByTestId('submit-button');
    this.successToast = page.getByTestId('success-toast');
    this.toastCloseButton = page.getByTestId('toast-close-button');
    this.tasksDataTable = page.getByTestId('tasks-data-table');
    this.modalIcon = page.getByTestId('modal-icon');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalDescription = page.getByTestId('modal-description');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalDeleteButton = page.getByTestId('modal-delete-button');
  }

  row(taskTitle: string): Locator {
    return this.page.locator('tr').filter({ hasText: taskTitle });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.appName).toHaveText('QA Sandbox');
    await expect(this.appDescription).toHaveText('Testing Platform');
  }

  async openTasksPage() {
    await this.tasksSidebarItem.click();
    await expect(this.pageTitle).toHaveText('Tasks');
    await expect(this.pageDescription).toHaveText('Track project tasks and assignments');
  }

  async openCreateForm() {
    await this.addTaskButton.click();
    await expect(this.page.locator('h2').last()).toHaveText('Create Task');
  }

  async openEditForm(taskTitle: string) {
    await this.row(taskTitle).getByTestId('edit-button').click();
  }

  async fillForm(data: TaskFormData) {
    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);
    await this.statusSelect.selectOption({ label: data.status });
    await this.prioritySelect.selectOption({ label: data.priority });
    await this.assigneeIdSelect.selectOption({ label: data.assigneeLabel });
    await this.dueDateInput.fill(data.dueDate);
  }

  // Clicks submit and captures the API response in one place,
  // instead of repeating the Promise.all/waitForResponse pattern per test.
  async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/tasks') && resp.request().method() === method
      ),
      this.submitButton.click(),
    ]);
    return response.json();
  }

  async expectSuccessToast(message: string) {
    await expect(this.successToast).toBeVisible();
    await expect(this.successToast).toHaveText(message);
    await this.toastCloseButton.click();
    await expect(this.successToast).not.toBeVisible();
  }

  async expectRow(taskTitle: string, data: { priority: string; status: string; assigneeLabel: string }) {
    const row = this.row(taskTitle);
    await expect(row.getByTestId('data-title')).toContainText(taskTitle);
    await expect(row.getByTestId('data-priority')).toContainText(data.priority);
    await expect(row.getByTestId('data-status')).toContainText(data.status);
    await expect(row.getByTestId('data-assigneeId')).toContainText(data.assigneeLabel);
  }

  async deleteTask(taskTitle: string) {
    const row = this.row(taskTitle);
    await row.getByTestId('delete-button').click();
    await expect(this.modalIcon).toBeVisible();
    await expect(this.modalTitle).toHaveText('Delete Task');
    await expect(this.modalDescription).toContainText('Are you sure you want to delete');
    await expect(this.modalCancelButton).toBeVisible();
    await this.modalDeleteButton.click();
  }
}
