# AGENTS.md

Guidance for AI agents working in this repository.

## What this repo is

Playwright E2E tests for the "QA Sandbox" app. Page objects live in `pages/`
(one per entity, extending `CrudPage`), shared flows in `tests/crud-helpers.ts`,
test data factories in `helpers/testData.ts`, API helpers in `helpers/api.ts`,
and custom fixtures (page objects + `trackForCleanup`) in `fixtures.ts`.

## Commands

- Typecheck: `npm run typecheck`
- Run a single suite: `npx playwright test <suite>.test.ts --project=production`
- Run everything against production: `npm run test:production`
- `--project=local` requires the app running on `http://localhost:3001`.

**IMPORTANT — filtering suites:** always include `.test.ts` in the filter
(e.g. `playwright test users.test.ts`). Never filter by the bare suite name
(`playwright test users`): Playwright filters are case-insensitive substring
matches on the absolute path, and on macOS every path starts with
`/Users/<name>`, so `users` silently matches **all** suites.

## Test data conventions (helpers/testData.ts)

- Always build entities with the `build*()` factories — they generate unique
  names/emails per call, so parallel tests never collide.
- Fields that require a related entity (e.g. `roleLabel`, `categoryLabel`,
  `assigneeLabel`) are mandatory overrides on their builder type; create the
  related entity first (usually via the `create*ViaApi` helpers).
- **Randomize enum-like fields** (status, priority, ...) instead of hardcoding
  one value, so runs cover all branches over time:
  - `randomPick(options)` is the generic helper.
  - `randomUserStatus(exclude?)` picks `'active' | 'inactive'`; pass the
    original value as `exclude` in edit flows to guarantee the edit actually
    changes the field.
- Explicit overrides still win: `buildUser({ status: 'active', ... })` stays
  deterministic where a test really needs a fixed value.

## Validation conventions

- Never assert enum-like display values with `toContainText`: `'active'` is a
  substring of `'inactive'`, so the assertion passes even when the UI shows the
  wrong value. Use an anchored, case-insensitive regex with `toHaveText`
  (see `UsersPage.expectRow`).
- `createViaUi` and `editViaUi` return the parsed POST/PUT response — assert
  persisted fields on both (e.g. `expect(created.status).toBe(user.status)`,
  `expect(apiResult.status).toBe(updated.status)`).
- Track every created resource with `trackForCleanup(apiPath, id)` so the
  fixture deletes it after the test. Exception: when the delete flow itself is
  the test, do not track the deleted entity.
