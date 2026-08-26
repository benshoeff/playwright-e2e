import { test } from '../fixtures';
import { buildCustomer, buildRole, buildUser, buildTicket, randomTicketStatus, randomTicketPriority } from '../helpers/testData';
import {
  createCustomerViaApi,
  createRoleViaApi,
  createUserViaApi,
  createTicketViaApi,
  customersApiPath,
  rolesApiPath,
  usersApiPath,
  ticketsApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Tickets CRUD', () => {
  test('creates a new ticket', async ({ ticketsPage, trackForCleanup, request }) => {
    const customer = buildCustomer();
    const createdCustomer = await createCustomerViaApi(request, customer);
    trackForCleanup(customersApiPath, createdCustomer.id);

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

    const ticket = buildTicket({ customerLabel: customer.name, assigneeLabel: assignee.name });

    await createViaUi(ticketsPage, {
      entityLabel: 'tickets',
      data: ticket,
      createdName: ticket.subject,
      rowData: {
        customerLabel: ticket.customerLabel,
        priority: ticket.priority,
        status: ticket.status,
        assigneeLabel: ticket.assigneeLabel ?? '—',
      },
      toast: 'Ticket created successfully',
      track: (id) => trackForCleanup(ticketsApiPath, id),
    });
  });

  test('edits an existing ticket', async ({ ticketsPage, trackForCleanup, request }) => {
    const customer = buildCustomer();
    const createdCustomer = await createCustomerViaApi(request, customer);
    trackForCleanup(customersApiPath, createdCustomer.id);

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

    const original = buildTicket({ customerLabel: customer.name, assigneeLabel: originalAssignee.name });
    const created = await createTicketViaApi(request, {
      subject: original.subject,
      description: original.description,
      customerId: createdCustomer.id,
      assigneeId: originalAssigneeCreated.id,
      priority: original.priority,
      status: original.status,
    });
    trackForCleanup(ticketsApiPath, created.id);

    const updated = buildTicket({
      subject: `Edit ${original.subject}`,
      description: `Updated ${original.description}`,
      customerLabel: customer.name,
      assigneeLabel: updatedAssignee.name,
      status: randomTicketStatus(original.status),
      priority: randomTicketPriority(original.priority),
    });

    await editViaUi(ticketsPage, {
      entityLabel: 'tickets',
      originalName: original.subject,
      originalRowData: {
        customerLabel: original.customerLabel,
        priority: original.priority,
        status: original.status,
        assigneeLabel: original.assigneeLabel ?? '—',
      },
      updated,
      updatedName: updated.subject,
      updatedRowData: {
        customerLabel: updated.customerLabel,
        priority: updated.priority,
        status: updated.status,
        assigneeLabel: updated.assigneeLabel ?? '—',
      },
      toast: 'Ticket updated successfully',
    });
  });

  test('deletes an existing ticket', async ({ ticketsPage, trackForCleanup, request }) => {
    const customer = buildCustomer();
    const createdCustomer = await createCustomerViaApi(request, customer);
    trackForCleanup(customersApiPath, createdCustomer.id);

    const ticket = buildTicket({ customerLabel: customer.name });
    await createTicketViaApi(request, {
      subject: ticket.subject,
      description: ticket.description,
      customerId: createdCustomer.id,
      priority: ticket.priority,
      status: ticket.status,
    });

    await deleteViaUi(ticketsPage, {
      entityLabel: 'tickets',
      name: ticket.subject,
      rowData: {
        customerLabel: ticket.customerLabel,
        priority: ticket.priority,
        status: ticket.status,
      },
      toast: 'Ticket deleted successfully',
    });
  });
});
