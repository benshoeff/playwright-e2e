import { Page, Locator, expect } from '@playwright/test';
import { CrudPage } from './CrudPage';
import { TicketFormData } from '../helpers/testData';
import { ticketsApiPath } from '../helpers/api';

export class TicketsPage extends CrudPage<TicketFormData> {
  readonly subjectInput: Locator;
  readonly customerIdSelect: Locator;
  readonly assigneeIdSelect: Locator;
  readonly prioritySelect: Locator;
  readonly statusSelect: Locator;

  constructor(page: Page) {
    super(page, {
      apiPath: ticketsApiPath,
      entityName: 'Ticket',
      addButtonTestId: 'add-tickets-button',
      sidebarTestId: 'tickets-sidebar-item',
      dataTableTestId: 'tickets-data-table',
      pageTitle: 'Tickets',
      pageDescription: 'Manage support tickets',
    });

    this.subjectInput = page.getByTestId('subject-input');
    this.customerIdSelect = page.getByTestId('customerId-select');
    this.assigneeIdSelect = page.getByTestId('assigneeId-select');
    this.prioritySelect = page.getByTestId('priority-select');
    this.statusSelect = page.getByTestId('status-select');
  }

  async fillForm(data: TicketFormData) {
    await this.subjectInput.fill(data.subject);
    await this.textareaInput.fill(data.description);
    await this.customerIdSelect.selectOption({ label: data.customerLabel });
    if (data.assigneeLabel) {
      await this.assigneeIdSelect.selectOption({ label: data.assigneeLabel });
    }
    await this.prioritySelect.selectOption({ label: data.priority });
    await this.statusSelect.selectOption({ label: data.status });
  }

  async expectRow(subject: string, data: { customerLabel: string; priority: string; status: string; assigneeLabel?: string }) {
    const row = this.row(subject);
    await expect(row.getByTestId('data-subject')).toHaveText(new RegExp(`^${subject}$`, 'i'));
    await expect(row.getByTestId('data-priority')).toHaveText(new RegExp(`^${data.priority}$`, 'i'));
    await expect(row.getByTestId('data-status')).toHaveText(new RegExp(`^${data.status.replace('_', ' ')}$`, 'i'));
    await expect(row.getByTestId('data-customerId')).toHaveText(new RegExp(`^${data.customerLabel}$`, 'i'));
    if (data.assigneeLabel) {
      await expect(row.getByTestId('data-assigneeId')).toHaveText(new RegExp(`^${data.assigneeLabel}$`, 'i'));
    }
  }
}
