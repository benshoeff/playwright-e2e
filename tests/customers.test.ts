import { test, expect } from '../fixtures';
import { buildCustomer, randomCustomerStatus } from '../helpers/testData';
import { createCustomerViaApi, customersApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Customers CRUD', () => {
  test('creates a new customer', async ({ customersPage, trackForCleanup }) => {
    const customer = buildCustomer();

    const created = await createViaUi(customersPage, {
      entityLabel: 'customers',
      data: customer,
      createdName: customer.name,
      rowData: {
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        status: customer.status,
      },
      toast: 'Customer created successfully',
      track: (id) => trackForCleanup(customersApiPath, id),
    });

    await test.step('verify the chosen status was persisted', async () => {
      expect(created.status).toBe(customer.status);
    });
  });

  test('edits an existing customer', async ({ customersPage, trackForCleanup, request }) => {
    const original = buildCustomer();
    const created = await createCustomerViaApi(request, {
      name: original.name,
      email: original.email,
      phone: original.phone,
      city: original.city,
      status: original.status,
    });
    trackForCleanup(customersApiPath, created.id);

    const updated = buildCustomer({
      name: `Edit ${original.name}`,
      city: 'Jerusalem',
      status: randomCustomerStatus(original.status),
    });

    const apiResult = await editViaUi(customersPage, {
      entityLabel: 'customers',
      originalName: original.name,
      originalRowData: {
        email: original.email,
        phone: original.phone,
        city: original.city,
        status: original.status,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        email: updated.email,
        phone: updated.phone,
        city: updated.city,
        status: updated.status,
      },
      toast: 'Customer updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.name).toBe(updated.name);
      expect(apiResult.email).toBe(updated.email);
      expect(apiResult.status).toBe(updated.status);
    });
  });

  test('deletes an existing customer', async ({ customersPage, request }) => {
    // No cleanup for the customer on purpose — deleting the customer via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const customer = buildCustomer();
    await createCustomerViaApi(request, {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status,
    });

    await deleteViaUi(customersPage, {
      entityLabel: 'customers',
      name: customer.name,
      rowData: {
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        status: customer.status,
      },
      toast: 'Customer deleted successfully',
    });
  });
});
