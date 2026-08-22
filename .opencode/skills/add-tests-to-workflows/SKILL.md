---
name: add-tests-to-workflows
description: Adds a new Playwright test suite to CI in this repo. Use when a new tests/*.test.ts file (e.g. posts, categories, products) needs a per-suite GitHub Actions workflow YML AND inclusion in the daily run file (.github/workflows/daily-tests.yml).
---

# Add a New Test Suite to CI

When a new test file `tests/<suite>.test.ts` is added, wire it into CI in two places: a per-suite workflow YML and the daily run file.

## 0. Test data conventions for the new suite

When writing (or reviewing) the new `tests/<suite>.test.ts`, follow the repo's
random-data conventions — see AGENTS.md for full details:

- Build entities with the `build*()` factories from `helpers/testData.ts`
  (unique names/emails per call; never hardcode names).
- **Randomize enum-like fields** (status, priority, ...) with `randomPick` or a
  field-specific helper instead of hardcoding one value, so runs cover all
  branches over time.
- In edit flows, force the randomized field to differ from the original value
  (e.g. `randomUserStatus(original.status)`) so the edit is guaranteed to
  change something.
- Validate enum-like display values exactly — anchored case-insensitive regex
  with `toHaveText` in the page object's `expectRow`, never `toContainText`
  (`'active'` is a substring of `'inactive'`).
- Assert persisted fields on the parsed POST response returned by
  `createViaUi`, and track created resources with `trackForCleanup`.

## 1. Create the per-suite workflow

Create `.github/workflows/<suite>-tests.yml` following the existing pattern (see `.github/workflows/users-tests.yml` for reference). Replace `<suite>` with the test file's basename (e.g. `posts` → `posts-tests.yml`, running `tests/posts.test.ts`).

Template:

```yaml
name: <Suite> Tests

on:
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:

jobs:
  <suite>-e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run <Suite> tests
        run: npx playwright test --project=production tests/<suite>.test.ts

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: <suite>-playwright-report
          path: playwright-report/
          retention-days: 14
```

Notes:
- `<Suite>` in `name:` and the run step is the human-readable suite name (e.g. `Posts`).
- Keep the artifact `name` unique per suite (`<suite>-playwright-report`).
- Match the existing files' indentation and step ordering exactly.

## 2. Add the test file to the daily run

In `.github/workflows/daily-tests.yml`, the "Run Playwright tests against production" step explicitly lists every test file. Append the new file to that command (keep the same line, existing order):

```yaml
run: npx playwright test --project=production tests/users.test.ts tests/permissions.test.ts tests/roles.test.ts tests/categories.test.ts tests/posts.test.ts tests/products.test.ts
```

## 3. Verify

- Confirm the new YML is valid YAML and structurally identical to `.github/workflows/users-tests.yml`.
- Confirm the new suite name appears in the daily run command.
- Report to the user which files were changed/created.
