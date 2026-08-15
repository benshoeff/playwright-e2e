import { APIRequestContext } from '@playwright/test';
import {
  CreateCategoryApiPayload,
  CreatePermissionApiPayload,
  CreatePostApiPayload,
  CreateProductApiPayload,
  CreateRoleApiPayload,
  CreateTaskApiPayload,
  CreateUserApiPayload,
} from './testData';

// Relies on `baseURL` from playwright.config.ts, so no hardcoded host here.

export async function createUserViaApi(request: APIRequestContext, data: CreateUserApiPayload) {
  const response = await request.post('/api/users', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create user via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteUserViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/users?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete user via API: ${response.status()} ${await response.text()}`);
  }
}

export async function createRoleViaApi(request: APIRequestContext, data: CreateRoleApiPayload) {
  const response = await request.post('/api/roles', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create role via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteRoleViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/roles?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete role via API: ${response.status()} ${await response.text()}`);
  }
}

export async function createPermissionViaApi(request: APIRequestContext, data: CreatePermissionApiPayload) {
  const response = await request.post('/api/permissions', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create permission via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deletePermissionViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/permissions?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete permission via API: ${response.status()} ${await response.text()}`);
  }
}

export async function createCategoryViaApi(request: APIRequestContext, data: CreateCategoryApiPayload) {
  const response = await request.post('/api/categories', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create category via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteCategoryViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/categories?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete category via API: ${response.status()} ${await response.text()}`);
  }
}

export async function createProductViaApi(request: APIRequestContext, data: CreateProductApiPayload) {
  const response = await request.post('/api/products', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create product via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteProductViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/products?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete product via API: ${response.status()} ${await response.text()}`);
  }
}

export async function createPostViaApi(request: APIRequestContext, data: CreatePostApiPayload) {
  const response = await request.post('/api/posts', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create post via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deletePostViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/posts?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete post via API: ${response.status()} ${await response.text()}`);
  }
}

export async function createTaskViaApi(request: APIRequestContext, data: CreateTaskApiPayload) {
  const response = await request.post('/api/tasks', { data });
  if (!response.ok()) {
    throw new Error(`Failed to create task via API: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteTaskViaApi(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/tasks?id=${id}`);
  if (!response.ok()) {
    throw new Error(`Failed to delete task via API: ${response.status()} ${await response.text()}`);
  }
}