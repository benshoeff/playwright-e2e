import { APIRequestContext } from '@playwright/test';
import { CreateUserApiPayload } from './testData';

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