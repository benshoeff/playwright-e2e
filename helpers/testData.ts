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

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface CreateCategoryApiPayload {
  name: string;
  description: string;
}

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryLabel: string;
  status: ProductStatus;
}

export interface CreateProductApiPayload {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  status: ProductStatus;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface PostFormData {
  title: string;
  content: string;
  authorLabel: string;
  categoryLabel: string;
  status: PostStatus;
}

export interface CreatePostApiPayload {
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  status: PostStatus;
}

let counter = 0;

// roleLabel is required so tests never silently fall back to a hardcoded role.
export type BuildUserOverrides = Partial<Omit<UserFormData, 'roleLabel'>> & { roleLabel: string };

// Called fresh inside each test -> no shared/global state between tests,
// no risk of collisions if tests run in parallel.
export function buildUser(overrides: BuildUserOverrides): UserFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    name: `User ${uniqueId}`,
    email: `user+${uniqueId}@example.com`,
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

export function buildCategory(overrides: Partial<CategoryFormData> = {}): CategoryFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    name: `Category ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}

// categoryLabel is required so tests never silently fall back to a hardcoded category.
export type BuildProductOverrides = Partial<Omit<ProductFormData, 'categoryLabel'>> & { categoryLabel: string };

export function buildProduct(overrides: BuildProductOverrides): ProductFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    name: `Product ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    price: 99.99,
    status: 'active',
    ...overrides,
  };
}

// authorLabel and categoryLabel are required so tests never silently
// fall back to a hardcoded author or category.
export type BuildPostOverrides = Partial<Omit<PostFormData, 'authorLabel' | 'categoryLabel'>> & {
  authorLabel: string;
  categoryLabel: string;
};

export function buildPost(overrides: BuildPostOverrides): PostFormData {
  counter += 1;
  const uniqueId = `${Date.now()}_${counter}`;

  return {
    title: `Post ${uniqueId}`,
    content: `Content for ${uniqueId}`,
    status: 'draft',
    ...overrides,
  };
}