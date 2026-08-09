import { APIRequestContext } from '@playwright/test';
import { CreateRoleApiPayload, CreateUserApiPayload } from './testData';

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