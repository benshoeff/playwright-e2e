export type ProjectStatus = 'planned' | 'in_progress' | 'on_hold' | 'completed';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface ProjectFormData {
  name: string;
  description: string;
  ownerLabel: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
}

export interface CreateProjectApiPayload {
  name: string;
  description: string;
  ownerId: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
}

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

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface EmployeeFormData {
  name: string;
  email: string;
  departmentLabel: string;
  position: string;
  salary: number;
  hireDate: string;
  status: EmployeeStatus;
}

export interface CreateEmployeeApiPayload {
  name: string;
  email: string;
  departmentId?: string;
  position?: string;
  salary?: number;
  hireDate?: string;
  status?: EmployeeStatus;
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

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewFormData {
  productLabel: string;
  author: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
}

export interface CreateReviewApiPayload {
  productId: string;
  author: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
}

let counter = 0;

// Called fresh inside each test -> no shared/global state between tests,
// no risk of collisions if tests run in parallel.
function nextUniqueId(): string {
  counter += 1;
  return `${Date.now()}_${counter}`;
}

export function randomPick<T>(options: readonly T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

const USER_STATUSES: readonly UserStatus[] = ['active', 'inactive'];

// Random by default so runs cover both branches over time.
// Pass `exclude` to force the opposite value (e.g. guarantee an edit changes the status).
export function randomUserStatus(exclude?: UserStatus): UserStatus {
  const options = exclude ? USER_STATUSES.filter((s) => s !== exclude) : USER_STATUSES;
  return randomPick(options);
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
    status: randomUserStatus(),
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

const PERMISSION_RESOURCES = ['reports', 'users', 'orders', 'invoices'];

// Random by default so runs cover different resources over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the resource).
export function randomPermissionResource(exclude?: string): string {
  const options = exclude ? PERMISSION_RESOURCES.filter((r) => r !== exclude) : PERMISSION_RESOURCES;
  return randomPick(options);
}

const PERMISSION_ACTIONS: readonly PermissionAction[] = ['create', 'read', 'update', 'delete', 'manage'];

// Random by default so runs cover all actions over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the action).
export function randomPermissionAction(exclude?: PermissionAction): PermissionAction {
  const options = exclude ? PERMISSION_ACTIONS.filter((a) => a !== exclude) : PERMISSION_ACTIONS;
  return randomPick(options);
}

export function buildPermission(overrides: Partial<PermissionFormData> = {}): PermissionFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Permission ${uniqueId}`,
    resource: randomPermissionResource(),
    action: randomPermissionAction(),
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

const EMPLOYEE_STATUSES: readonly EmployeeStatus[] = ['active', 'on_leave', 'terminated'];

// Random by default so runs cover all branches over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the status).
export function randomEmployeeStatus(exclude?: EmployeeStatus): EmployeeStatus {
  const options = exclude ? EMPLOYEE_STATUSES.filter((s) => s !== exclude) : EMPLOYEE_STATUSES;
  return randomPick(options);
}

// departmentLabel is required so tests never silently fall back to a hardcoded department.
export type BuildEmployeeOverrides = Partial<Omit<EmployeeFormData, 'departmentLabel'>> & {
  departmentLabel: string;
};

export function buildEmployee(overrides: BuildEmployeeOverrides): EmployeeFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Employee ${uniqueId}`,
    email: `employee+${uniqueId}@example.com`,
    position: `QA Engineer ${uniqueId}`,
    salary: 50000 + Math.floor(Math.random() * 100) * 1000,
    hireDate: '2024-09-01',
    status: randomEmployeeStatus(),
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

const REVIEW_STATUSES: readonly ReviewStatus[] = ['pending', 'approved', 'rejected'];

// Random by default so runs cover all branches over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the status).
export function randomReviewStatus(exclude?: ReviewStatus): ReviewStatus {
  const options = exclude ? REVIEW_STATUSES.filter((s) => s !== exclude) : REVIEW_STATUSES;
  return randomPick(options);
}

const REVIEW_RATINGS: readonly number[] = [1, 2, 3, 4, 5];

// Random by default so runs cover all ratings over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the rating).
export function randomReviewRating(exclude?: number): number {
  const options = exclude ? REVIEW_RATINGS.filter((r) => r !== exclude) : REVIEW_RATINGS;
  return randomPick(options);
}

// productLabel is required so tests never silently fall back to a hardcoded product.
export type BuildReviewOverrides = Partial<Omit<ReviewFormData, 'productLabel'>> & { productLabel: string };

export function buildReview(overrides: BuildReviewOverrides): ReviewFormData {
  const uniqueId = nextUniqueId();

  return {
    author: `Reviewer ${uniqueId}`,
    rating: randomReviewRating(),
    comment: `Comment for ${uniqueId}`,
    status: randomReviewStatus(),
    ...overrides,
  };
}

const PROJECT_STATUSES: readonly ProjectStatus[] = ['planned', 'in_progress', 'on_hold', 'completed'];

// Random by default so runs cover all branches over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the status).
export function randomProjectStatus(exclude?: ProjectStatus): ProjectStatus {
  const options = exclude ? PROJECT_STATUSES.filter((s) => s !== exclude) : PROJECT_STATUSES;
  return randomPick(options);
}

const PROJECT_PRIORITIES: readonly ProjectPriority[] = ['low', 'medium', 'high'];

// Random by default so runs cover all branches over time.
// Pass `exclude` to force a different value (e.g. guarantee an edit changes the priority).
export function randomProjectPriority(exclude?: ProjectPriority): ProjectPriority {
  const options = exclude ? PROJECT_PRIORITIES.filter((p) => p !== exclude) : PROJECT_PRIORITIES;
  return randomPick(options);
}

// ownerLabel is required so tests never silently fall back to a hardcoded owner.
export type BuildProjectOverrides = Partial<Omit<ProjectFormData, 'ownerLabel'>> & { ownerLabel: string };

export function buildProject(overrides: BuildProjectOverrides): ProjectFormData {
  const uniqueId = nextUniqueId();

  return {
    name: `Project ${uniqueId}`,
    description: `Description for ${uniqueId}`,
    status: randomProjectStatus(),
    priority: randomProjectPriority(),
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    ...overrides,
  };
}