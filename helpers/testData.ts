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

export type CustomerStatus = 'active' | 'inactive';

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
}

export interface CreateCustomerApiPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
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

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeLabel: string;
  dueDate: string;
}

export interface CreateTaskApiPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
}

export interface DepartmentFormData {
  name: string;
  description: string;
  managerLabel?: string;
}

export interface CreateDepartmentApiPayload {
  name: string;
  description: string;
  managerId?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderFormData {
  customerName: string;
  email: string;
  items: string;
  totalAmount: number;
  status: OrderStatus;
}

export interface CreateOrderApiPayload {
  customerName: string;
  email: string;
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: OrderStatus;
}

let counter = 0;

// Called fresh inside each test -> no shared/global state between tests,
// no risk of collisions if tests run in parallel.
function nextUniqueId(): string {
  counter += 1;
  return `${Date.now()}_${counter}`;
}

export function buildOrder(overrides: Partial<OrderFormData> = {}): OrderFormData {
  const uniqueId = nextUniqueId();

  return {
    customerName: `Customer ${uniqueId}`,
    email: `order+${uniqueId}@example.com`,
    items: JSON.stringify([{ productId: `pr${uniqueId}`, quantity: 1, price: 99.99 }]),
    totalAmount: 99.99,
    status: 'pending',
    ...overrides,
  };
}

// roleLabel is required so tests never silently fall back to a hardcoded role.
export type BuildUserOverrides = Partial<Omit<UserFormData, 'roleLabel'>> & { roleLabel: string };

// Called fresh inside each test -> no shared/global state between tests,
// no risk of collisions if tests run in parallel.
export function buildUser(overrides: BuildUserOverrides): UserFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `User ${uniqueId}`,
    email: `user+${uniqueId}@example.com`,
    status: 'active',
    ...overrides,
  };
}

export function buildRole(overrides: Partial<RoleFormData> = {}): RoleFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Role ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}

export function buildPermission(overrides: Partial<PermissionFormData> = {}): PermissionFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Permission ${uniqueId}`,
    resource: 'reports',
    action: 'read',
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}

export function buildCategory(overrides: Partial<CategoryFormData> = {}): CategoryFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Category ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}

export function buildCustomer(overrides: Partial<CustomerFormData> = {}): CustomerFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Customer ${uniqueId}`,
    email: `customer+${uniqueId}@example.com`,
    phone: '+972-50-000-0000',
    city: 'Tel Aviv',
    status: 'active',
    ...overrides,
  };
}

// categoryLabel is required so tests never silently fall back to a hardcoded category.
export type BuildProductOverrides = Partial<Omit<ProductFormData, 'categoryLabel'>> & { categoryLabel: string };

export function buildProduct(overrides: BuildProductOverrides): ProductFormData {
  const uniqueId = nextUniqueId();

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
  const uniqueId = nextUniqueId();

  return {
    title: `Post ${uniqueId}`,
    content: `Content for ${uniqueId}`,
    status: 'draft',
    ...overrides,
  };
}

export function buildDepartment(overrides: Partial<DepartmentFormData> = {}): DepartmentFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Department ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    ...overrides,
  };
}

// assigneeLabel is required so tests never silently fall back to a hardcoded assignee.
export type BuildTaskOverrides = Partial<Omit<TaskFormData, 'assigneeLabel'>> & { assigneeLabel: string };

export function buildTask(overrides: BuildTaskOverrides): TaskFormData {
  const uniqueId = nextUniqueId();

  return {
    title: `Task ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    status: 'todo',
    priority: 'low',
    dueDate: '2025-06-01',
    ...overrides,
  };
}