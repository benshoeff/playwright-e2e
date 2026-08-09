export type UserStatus = 'active' | 'inactive';

export interface UserFormData {
  name: string;
  email: string;
  roleLabel: string;
  status: UserStatus;
}

export interface CreateUserApiPayload {
  name: string;
  email: string;
  roleId: string;
  status: UserStatus;
}

export interface RoleFormData {
  name: string;
  description: string;
}

export interface CreateRoleApiPayload {
  name: string;
  description: string;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface PermissionFormData {
  name: string;
  resource: string;
  action: PermissionAction;
  description: string;
}

export interface CreatePermissionApiPayload {
  name: string;
  resource: string;
  action: PermissionAction;
  description: string;
}

// Maps the label shown in the UI <select> to the value the API expects.
// Extend this if more roles are added to the app.
const ROLE_LABEL_TO_ID: Record<string, string> = {
  Admin: 'r1',
  Viewer: 'r2',
};

export function roleLabelToId(label: string): string {
  const id = ROLE_LABEL_TO_ID[label];
  if (!id) throw new Error(`Unknown role label: "${label}". Add it to ROLE_LABEL_TO_ID.`);
  return id;
}

let counter = 0;

// Called fresh inside each test -> no shared/global state between tests,
// no risk of collisions if tests run in parallel.
export function buildUser(overrides: Partial<UserFormData> = {}): UserFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    name: `User ${uniqueId}`,
    email: `user+${uniqueId}@example.com`,
    roleLabel: 'Admin',
    status: 'active',
    ...overrides,
  };
}

export function buildRole(overrides: Partial<RoleFormData> = {}): RoleFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    name: `Role ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}

export function buildPermission(overrides: Partial<PermissionFormData> = {}): PermissionFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    name: `Permission ${uniqueId}`,
    resource: 'reports',
    action: 'read',
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}