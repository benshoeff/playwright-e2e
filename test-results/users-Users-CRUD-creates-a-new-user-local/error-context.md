# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: users.test.ts >> Users CRUD >> creates a new user
- Location: tests/users.test.ts:6:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('add-user-button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]: Q
        - generic [ref=e7]:
          - heading "QA Sandbox" [level=1] [ref=e8]
          - paragraph [ref=e9]: Testing Platform
      - navigation [ref=e10]:
        - link [ref=e11] [cursor=pointer]:
          - /url: /
        - link [ref=e15] [cursor=pointer]:
          - /url: /users
        - link [ref=e19] [cursor=pointer]:
          - /url: /roles
        - link [ref=e23] [cursor=pointer]:
          - /url: /permissions
        - link [ref=e27] [cursor=pointer]:
          - /url: /products
        - link [ref=e31] [cursor=pointer]:
          - /url: /categories
        - link [ref=e35] [cursor=pointer]:
          - /url: /posts
        - link [ref=e39] [cursor=pointer]:
          - /url: /tasks
        - link [ref=e43] [cursor=pointer]:
          - /url: /orders
      - generic [ref=e47]: Use this app for API testing
    - main [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - generic [ref=e55]:
            - heading "Users" [level=1] [ref=e56]
            - paragraph [ref=e57]: Manage system users
          - button "Add Users" [ref=e58] [cursor=pointer]
        - table [ref=e63]:
          - rowgroup [ref=e64]:
            - row [ref=e65]:
              - columnheader "Name" [ref=e66]
              - columnheader "Email" [ref=e67]
              - columnheader "Role" [ref=e68]
              - columnheader "Status" [ref=e69]
              - columnheader "Actions" [ref=e70]
          - rowgroup [ref=e71]:
            - row [ref=e72]:
              - cell "Alice Cohen" [ref=e73]
              - cell "alice@example.com" [ref=e74]
              - cell "Admin" [ref=e75]
              - cell "active" [ref=e77]
              - cell [ref=e79]:
                - generic [ref=e80]:
                  - button "Edit" [ref=e81] [cursor=pointer]
                  - button "Delete" [ref=e84] [cursor=pointer]
            - row [ref=e87]:
              - cell "Bob Levy" [ref=e88]
              - cell "bob@example.com" [ref=e89]
              - cell "Editor" [ref=e90]
              - cell "active" [ref=e92]
              - cell [ref=e94]:
                - generic [ref=e95]:
                  - button "Edit" [ref=e96] [cursor=pointer]
                  - button "Delete" [ref=e99] [cursor=pointer]
            - row [ref=e102]:
              - cell "Carol Mizrahi" [ref=e103]
              - cell "carol@example.com" [ref=e104]
              - cell "Viewer" [ref=e105]
              - cell "inactive" [ref=e107]
              - cell [ref=e109]:
                - generic [ref=e110]:
                  - button "Edit" [ref=e111] [cursor=pointer]
                  - button "Delete" [ref=e114] [cursor=pointer]
            - row [ref=e117]:
              - cell "David Katz" [ref=e118]
              - cell "david@example.com" [ref=e119]
              - cell "Editor" [ref=e120]
              - cell "active" [ref=e122]
              - cell [ref=e124]:
                - generic [ref=e125]:
                  - button "Edit" [ref=e126] [cursor=pointer]
                  - button "Delete" [ref=e129] [cursor=pointer]
            - row [ref=e132]:
              - cell "12" [ref=e133]
              - cell "122222@gmail.com" [ref=e134]
              - cell "Editor" [ref=e135]
              - cell "active" [ref=e137]
              - cell [ref=e139]:
                - generic [ref=e140]:
                  - button "Edit" [ref=e141] [cursor=pointer]
                  - button "Delete" [ref=e144] [cursor=pointer]
  - alert [ref=e147]: QA Sandbox
```

# Test source

```ts
  1   | import { Page, Locator, expect } from '@playwright/test';
  2   | import { UserFormData } from '../helpers/testData';
  3   |  
  4   | export class UsersPage {
  5   |   readonly page: Page;
  6   |  
  7   |   readonly appName: Locator;
  8   |   readonly appDescription: Locator;
  9   |   readonly usersSidebarItem: Locator;
  10  |   readonly pageTitle: Locator;
  11  |   readonly pageDescription: Locator;
  12  |   readonly addUserButton: Locator;
  13  |   readonly nameInput: Locator;
  14  |   readonly emailInput: Locator;
  15  |   readonly roleSelect: Locator;
  16  |   readonly statusSelect: Locator;
  17  |   readonly submitButton: Locator;
  18  |   readonly successToast: Locator;
  19  |   readonly toastCloseButton: Locator;
  20  |   readonly usersDataTable: Locator;
  21  |   readonly modalIcon: Locator;
  22  |   readonly modalTitle: Locator;
  23  |   readonly modalDescription: Locator;
  24  |   readonly modalCancelButton: Locator;
  25  |   readonly modalDeleteButton: Locator;
  26  |  
  27  |   constructor(page: Page) {
  28  |     this.page = page;
  29  |     this.appName = page.getByTestId('app-name');
  30  |     this.appDescription = page.getByTestId('app-description');
  31  |     this.usersSidebarItem = page.getByTestId('users-sidebar-item');
  32  |     this.pageTitle = page.getByTestId('page-title');
  33  |     this.pageDescription = page.getByTestId('page-description');
  34  |     this.addUserButton = page.getByTestId('add-user-button');
  35  |     this.nameInput = page.getByTestId('name-input');
  36  |     this.emailInput = page.getByTestId('email-input');
  37  |     this.roleSelect = page.getByTestId('roleId-select');
  38  |     this.statusSelect = page.getByTestId('status-select');
  39  |     this.submitButton = page.getByTestId('submit-button');
  40  |     this.successToast = page.getByTestId('success-toast');
  41  |     this.toastCloseButton = page.getByTestId('toast-close-button');
  42  |     this.usersDataTable = page.getByTestId('users-data-table');
  43  |     this.modalIcon = page.getByTestId('modal-icon');
  44  |     this.modalTitle = page.getByTestId('modal-title');
  45  |     this.modalDescription = page.getByTestId('modal-description');
  46  |     this.modalCancelButton = page.getByTestId('modal-cancel-button');
  47  |     this.modalDeleteButton = page.getByTestId('modal-delete-button');
  48  |   }
  49  |  
  50  |   row(userName: string): Locator {
  51  |     return this.page.locator('tr').filter({ hasText: userName });
  52  |   }
  53  |  
  54  |   async goto() {
  55  |     await this.page.goto('/');
  56  |     await expect(this.appName).toHaveText('QA Sandbox');
  57  |     await expect(this.appDescription).toHaveText('Testing Platform');
  58  |   }
  59  |  
  60  |   async openUsersPage() {
  61  |     await this.usersSidebarItem.click();
  62  |     await expect(this.pageTitle).toHaveText('Users');
  63  |     await expect(this.pageDescription).toHaveText('Manage system users');
  64  |   }
  65  |  
  66  |   async openCreateForm() {
> 67  |     await this.addUserButton.click();
      |                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  68  |     await expect(this.page.locator('h2').last()).toHaveText('Create User');
  69  |   }
  70  |  
  71  |   async openEditForm(userName: string) {
  72  |     await this.row(userName).getByTestId('edit-button').click();
  73  |   }
  74  |  
  75  |   async fillForm(data: UserFormData) {
  76  |     await this.nameInput.fill(data.name);
  77  |     await this.emailInput.fill(data.email);
  78  |     await this.roleSelect.selectOption({ label: data.roleLabel });
  79  |     await this.statusSelect.selectOption({ label: data.status });
  80  |   }
  81  |  
  82  |   // Clicks submit and captures the API response in one place,
  83  |   // instead of repeating the Promise.all/waitForResponse pattern per test.
  84  |   async submitAndWaitForApi(method: 'POST' | 'PUT' | 'PATCH') {
  85  |     const [response] = await Promise.all([
  86  |       this.page.waitForResponse(
  87  |         (resp) => resp.url().includes('/api/users') && resp.request().method() === method
  88  |       ),
  89  |       this.submitButton.click(),
  90  |     ]);
  91  |     return response.json();
  92  |   }
  93  |  
  94  |   async expectSuccessToast(message: string) {
  95  |     await expect(this.successToast).toBeVisible();
  96  |     await expect(this.successToast).toHaveText(message);
  97  |     await this.toastCloseButton.click();
  98  |     await expect(this.successToast).not.toBeVisible();
  99  |   }
  100 |  
  101 |   async expectRow(userName: string, data: { email: string; roleLabel: string; status: string }) {
  102 |     const row = this.row(userName);
  103 |     await expect(row.getByTestId('data-name')).toContainText(userName);
  104 |     await expect(row.getByTestId('data-email')).toContainText(data.email);
  105 |     await expect(row.getByTestId('data-roleId')).toContainText(data.roleLabel);
  106 |     await expect(row.getByTestId('data-status')).toContainText(data.status);
  107 |   }
  108 |  
  109 |   async deleteUser(userName: string) {
  110 |     const row = this.row(userName);
  111 |     await row.getByTestId('delete-button').click();
  112 |     await expect(this.modalIcon).toBeVisible();
  113 |     await expect(this.modalTitle).toHaveText('Delete User');
  114 |     await expect(this.modalDescription).toContainText('Are you sure you want to delete');
  115 |     await expect(this.modalCancelButton).toBeVisible();
  116 |     await this.modalDeleteButton.click();
  117 |   }
  118 | }
  119 |  
```