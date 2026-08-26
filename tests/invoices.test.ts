import { test, expect } from '../fixtures';
import { buildCustomer, buildInvoice, randomInvoiceStatus } from '../helpers/testData';
import { createCustomerViaApi, createInvoiceViaApi, customersApiPath, invoicesApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Invoices CRUD', () => {
  test('creates a new invoice', async ({ invoicesPage, trackForCleanup, request }) => {
    const customer = buildCustomer();
    const createdCustomer = await createCustomerViaApi(request, {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status,
    });
    trackForCleanup(customersApiPath, createdCustomer.id);

    const invoice = buildInvoice({ customerLabel: customer.name });

    const created = await createViaUi(invoicesPage, {
      entityLabel: 'invoices',
      data: invoice,
      createdName: invoice.invoiceNumber,
      rowData: {
        status: invoice.status,
      },
      toast: 'Invoice created successfully',
      track: (id) => trackForCleanup(invoicesApiPath, id),
    });

    await test.step('verify the chosen status was persisted', async () => {
      expect(created.status).toBe(invoice.status);
    });
  });

  test('edits an existing invoice', async ({ invoicesPage, trackForCleanup, request }) => {
    const customer = buildCustomer();
    const createdCustomer = await createCustomerViaApi(request, {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status,
    });
    trackForCleanup(customersApiPath, createdCustomer.id);

    const original = buildInvoice({ customerLabel: customer.name });
    const created = await createInvoiceViaApi(request, {
      invoiceNumber: original.invoiceNumber,
      customerId: createdCustomer.id,
      issueDate: original.issueDate,
      dueDate: original.dueDate,
      totalAmount: original.totalAmount,
      status: original.status,
    });
    trackForCleanup(invoicesApiPath, created.id);

    const updatedCustomer = buildCustomer();
    const createdUpdatedCustomer = await createCustomerViaApi(request, {
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      city: updatedCustomer.city,
      status: updatedCustomer.status,
    });
    trackForCleanup(customersApiPath, createdUpdatedCustomer.id);

    const updated = buildInvoice({
      invoiceNumber: `Edit ${original.invoiceNumber}`,
      customerLabel: updatedCustomer.name,
      totalAmount: 999.99,
      status: randomInvoiceStatus(original.status),
    });

    const apiResult = await editViaUi(invoicesPage, {
      entityLabel: 'invoices',
      originalName: original.invoiceNumber,
      originalRowData: {
        status: original.status,
      },
      updated,
      updatedName: updated.invoiceNumber,
      updatedRowData: {
        status: updated.status,
      },
      toast: 'Invoice updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.status).toBe(updated.status);
    });
  });

  test('deletes an existing invoice', async ({ invoicesPage, trackForCleanup, request }) => {
    const customer = buildCustomer();
    const createdCustomer = await createCustomerViaApi(request, {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status,
    });
    trackForCleanup(customersApiPath, createdCustomer.id);

    const invoice = buildInvoice({ customerLabel: customer.name });
    const created = await createInvoiceViaApi(request, {
      invoiceNumber: invoice.invoiceNumber,
      customerId: createdCustomer.id,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
    });
    trackForCleanup(invoicesApiPath, created.id);

    await deleteViaUi(invoicesPage, {
      entityLabel: 'invoices',
      name: invoice.invoiceNumber,
      rowData: {
        status: invoice.status,
      },
      toast: 'Invoice deleted successfully',
    });
  });
});
