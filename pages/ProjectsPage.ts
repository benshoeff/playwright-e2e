import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { ProjectFormData } from '../helpers/testData';
import { projectsApiPath } from '../helpers/api';

export class ProjectsPage extends CrudPage<ProjectFormData> {
  readonly ownerIdSelect: Locator;
  readonly statusSelect: Locator;
  readonly prioritySelect: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: projectsApiPath,
      entityName: 'Project',
      addButtonTestId: 'add-projects-button',
      sidebarTestId: 'projects-sidebar-item',
      dataTableTestId: 'projects-data-table',
      pageTitle: 'Projects',
      pageDescription: 'Track project timelines and ownership',
    });

    this.ownerIdSelect = page.getByTestId('ownerId-select');
    this.statusSelect = page.getByTestId('status-select');
    this.prioritySelect = page.getByTestId('priority-select');
    this.startDateInput = page.getByTestId('startDate-input');
    this.endDateInput = page.getByTestId('endDate-input');
  }

  async fillForm(data: ProjectFormData) {
    await this.nameInput.fill(data.name);
    await this.textareaInput.fill(data.description);
    await this.ownerIdSelect.selectOption({ label: data.ownerLabel });
    await this.statusSelect.selectOption({ label: data.status });
    await this.prioritySelect.selectOption({ label: data.priority });
    await this.startDateInput.fill(data.startDate);
    await this.endDateInput.fill(data.endDate);
  }

  async expectRow(
    projectName: string,
    data: { ownerLabel: string; status: string; priority: string }
  ) {
    const row = this.row(projectName);
    await expect(row.getByTestId('data-name')).toContainText(projectName);
    await expect(row.getByTestId('data-ownerId')).toContainText(data.ownerLabel);
    // The UI replaces underscores with spaces (e.g. "in_progress" → "in progress").
    await expect(row.getByTestId('data-status')).toContainText(data.status.replace(/_/g, ' '));
    await expect(row.getByTestId('data-priority')).toContainText(data.priority);
  }
}
