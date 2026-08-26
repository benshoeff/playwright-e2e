import { test, expect } from '../fixtures';
import { buildOrder, randomOrderStatus } from '../helpers/testData';
import { createOrderViaApi, ordersApiPath } from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Orders CRUD', () => {
  test('creates a new order', async ({ ordersPage, trackForCleanup }) => {
    const order = buildOrder();

    const created = await createViaUi(ordersPage, {
      entityLabel: 'orders',
      data: order,
      createdName: order.customerName,
      rowData: {
        email: order.email,
        status: order.status,
      },
      toast: 'Order created successfully',
      track: (id) => trackForCleanup(ordersApiPath, id),
    });

    await test.step('verify the chosen status was persisted', async () => {
      expect(created.status).toBe(order.status);
    });
  });

  test('edits an existing order', async ({ ordersPage, trackForCleanup, request }) => {
    const original = buildOrder();
    const created = await createOrderViaApi(request, {
      customerName: original.customerName,
      email: original.email,
      items: JSON.parse(original.items),
      totalAmount: original.totalAmount,
      status: original.status,
    });
    trackForCleanup(ordersApiPath, created.id);

    const updated = buildOrder({
      customerName: `Edit ${original.customerName}`,
      email: original.email,
      items: original.items,
      totalAmount: 149.99,
      status: randomOrderStatus(original.status),
    });

    const apiResult = await editViaUi(ordersPage, {
      entityLabel: 'orders',
      originalName: original.customerName,
      originalRowData: {
        email: original.email,
        status: original.status,
      },
      updated,
      updatedName: updated.customerName,
      updatedRowData: {
        email: updated.email,
        status: updated.status,
      },
      toast: 'Order updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.status).toBe(updated.status);
    });
  });

  test('deletes an existing order', async ({ ordersPage, trackForCleanup, request }) => {
    const order = buildOrder();
    const created = await createOrderViaApi(request, {
      customerName: order.customerName,
      email: order.email,
      items: JSON.parse(order.items),
      totalAmount: order.totalAmount,
      status: order.status,
    });
    trackForCleanup(ordersApiPath, created.id);

    await deleteViaUi(ordersPage, {
      entityLabel: 'orders',
      name: order.customerName,
      rowData: {
        email: order.email,
        status: order.status,
      },
      toast: 'Order deleted successfully',
    });
  });
});
