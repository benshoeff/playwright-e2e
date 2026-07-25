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