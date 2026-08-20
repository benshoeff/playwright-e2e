import { APIRequestContext } from '@playwright/test';
import {
  CreateCategoryApiPayload,
  CreateCustomerApiPayload,
  CreateDepartmentApiPayload,
  CreateOrderApiPayload,
  CreatePermissionApiPayload,
  CreatePostApiPayload,
  CreateProductApiPayload,
  CreateRoleApiPayload,
  CreateTaskApiPayload,
  CreateUserApiPayload,
} from './testData';

// Relies on `baseURL` from playwright.config.ts, so no hardcoded host here.
// Shared here so the api helpers, page objects, cleanup fixture and tests all
// reference the same path.

export const usersApiPath = '/api/users';
export const rolesApiPath = '/api/roles';
export const permissionsApiPath = '/api/permissions';
export const categoriesApiPath = '/api/categories';
export const customersApiPath = '/api/customers';
export const productsApiPath = '/api/products';
export const postsApiPath = '/api/posts';
export const tasksApiPath = '/api/tasks';
export const departmentsApiPath = '/api/departments';
export const ordersApiPath = '/api/orders';

async function createViaApi(request: APIRequestContext, path: string, data: unknown) {
  const response = await request.post(path, { data });
  if (!response.ok()) {
    throw new Error(`Failed to create via API (${path}): ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteViaApi(request: APIRequestContext, path: string, id: string) {
  const response = await request.delete(`${path}?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete via API (${path}): ${response.status()} ${await response.text()}`);
  }
}

export function createUserViaApi(request: APIRequestContext, data: CreateUserApiPayload) {
  return createViaApi(request, usersApiPath, data);
}

export function deleteUserViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, usersApiPath, id);
}

export function createRoleViaApi(request: APIRequestContext, data: CreateRoleApiPayload) {
  return createViaApi(request, rolesApiPath, data);
}

export function deleteRoleViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, rolesApiPath, id);
}

export function createPermissionViaApi(request: APIRequestContext, data: CreatePermissionApiPayload) {
  return createViaApi(request, permissionsApiPath, data);
}

export function deletePermissionViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, permissionsApiPath, id);
}

export function createCategoryViaApi(request: APIRequestContext, data: CreateCategoryApiPayload) {
  return createViaApi(request, categoriesApiPath, data);
}

export function deleteCategoryViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, categoriesApiPath, id);
}

export function createCustomerViaApi(request: APIRequestContext, data: CreateCustomerApiPayload) {
  return createViaApi(request, customersApiPath, data);
}

export function deleteCustomerViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, customersApiPath, id);
}

export function createProductViaApi(request: APIRequestContext, data: CreateProductApiPayload) {
  return createViaApi(request, productsApiPath, data);
}

export function deleteProductViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, productsApiPath, id);
}

export function createPostViaApi(request: APIRequestContext, data: CreatePostApiPayload) {
  return createViaApi(request, postsApiPath, data);
}

export function deletePostViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, postsApiPath, id);
}

export function createTaskViaApi(request: APIRequestContext, data: CreateTaskApiPayload) {
  return createViaApi(request, tasksApiPath, data);
}

export function deleteTaskViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, tasksApiPath, id);
}

export function createDepartmentViaApi(request: APIRequestContext, data: CreateDepartmentApiPayload) {
  return createViaApi(request, departmentsApiPath, data);
}

export function deleteDepartmentViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, departmentsApiPath, id);
}

export function createOrderViaApi(request: APIRequestContext, data: CreateOrderApiPayload) {
  return createViaApi(request, ordersApiPath, data);
}

export function deleteOrderViaApi(request: APIRequestContext, id: string) {
  return deleteViaApi(request, ordersApiPath, id);
}
