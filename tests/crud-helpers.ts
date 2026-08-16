import { test, expect } from '../fixtures';
import type { CrudPage } from '../pages/CrudPage';

export type RowData = Record<string, string | number>;

export interface CreateViaUiOptions<T> {
  entityLabel: string;
  data: T;
  createdName: string;
  rowData: RowData;
  toast: string;
  track: (id: string) => void;
}

export async function createViaUi<T>(page: CrudPage<T>, options: CreateViaUiOptions<T>) {
  await test.step(`navigate to the ${options.entityLabel} page`, async () => {
    await page.goto();
    await page.openEntityPage();
  });

  await test.step('fill and submit the create form', async () => {
    await page.openCreateForm();
    await page.fillForm(options.data);
  });

  const created = await page.submitAndWaitForApi('POST');
  options.track(created.id);

  await test.step('verify success toast and row data', async () => {
    await page.expectSuccessToast(options.toast);
    await page.expectRow(options.createdName, options.rowData);
  });
}

export interface EditViaUiOptions<T> {
  entityLabel: string;
  originalName: string;
  originalRowData: RowData;
  updated: T;
  updatedName: string;
  updatedRowData: RowData;
  toast: string;
}

export async function editViaUi<T>(page: CrudPage<T>, options: EditViaUiOptions<T>) {
  await test.step(`navigate to the ${options.entityLabel} page`, async () => {
    await page.goto();
    await page.openEntityPage();
  });

  await test.step('verify the pre-existing row', async () => {
    await page.expectRow(options.originalName, options.originalRowData);
  });

  await test.step('edit and submit', async () => {
    await page.openEditForm(options.originalName);
    await page.fillForm(options.updated);
    await page.submitButton.click();
  });

  await test.step('verify success toast and updated row', async () => {
    await page.expectSuccessToast(options.toast);
    await page.expectRow(options.updatedName, options.updatedRowData);
  });
}

export interface DeleteViaUiOptions {
  entityLabel: string;
  name: string;
  rowData: RowData;
  toast: string;
}

export async function deleteViaUi<T>(page: CrudPage<T>, options: DeleteViaUiOptions) {
  await test.step(`navigate to the ${options.entityLabel} page`, async () => {
    await page.goto();
    await page.openEntityPage();
  });

  await test.step('verify the pre-existing row', async () => {
    await page.expectRow(options.name, options.rowData);
  });

  await test.step('delete via UI', async () => {
    await page.deleteEntity(options.name);
    await page.expectSuccessToast(options.toast);
  });

  await test.step('verify the row is gone', async () => {
    await expect(page.dataTable).not.toContainText(options.name);
  });
}
