import { test, expect } from '@playwright/test';

/**
 * CareConnect End-to-End Test Suite
 *
 * Covers six critical user flows across the deployed web app.
 * Each test starts from an authenticated session established in beforeEach.
 * Tests run across Chromium, Firefox, and WebKit as configured in playwright.config.ts.
 */
test.describe('CareConnect E2E Tests', () => {

  // Authenticate before every test — navigates to root, fills credentials,
  // and confirms the Dashboard heading is visible before the test body runs.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('input[name="email"]').fill('caregiver@careconnect.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  // E2E-01: Verifies the dashboard route and all four summary panel headings
  // are present after a successful login.
  test('E2E-01: Login and dashboard renders', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/active tasks/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /urgent tasks/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /today/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /recent activity/i })).toBeVisible();
  });

  // E2E-02: Walks through all five nav destinations in sequence and asserts
  // the correct URL and page heading for each, then returns to the dashboard.
  test('E2E-02: Navigate all pages', async ({ page }) => {
    await page.getByRole('button', { name: /tasks/i }).first().click();
    await expect(page).toHaveURL(/.*tasks/);
    await expect(page.getByRole('heading', { name: /task management/i })).toBeVisible();

    await page.getByRole('button', { name: /schedule/i }).first().click();
    await expect(page).toHaveURL(/.*schedule/);
    await expect(page.getByRole('heading', { name: /calendar/i })).toBeVisible();

    await page.getByRole('button', { name: /patients/i }).first().click();
    await expect(page).toHaveURL(/.*patients/);
    await expect(page.getByRole('heading', { name: /patient care/i })).toBeVisible();

    await page.getByRole('button', { name: /settings/i }).first().click();
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();

    await page.getByRole('button', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  // E2E-03: Verifies the task list search input filters results by patient name,
  // the clear button resets the filter, and the status tab filters work correctly.
  test('E2E-03: Task search and filter', async ({ page }) => {
    await page.getByRole('button', { name: /tasks/i }).first().click();
    await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();

    // Search by patient name — expects exactly one result
    await page.locator('input[placeholder*="Search"]').fill('John');
    await expect(page.getByText(/showing 1 task/i)).toBeVisible();

    // Clear search — full list should return
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();

    // Filter by Pending tab — count may vary based on seeded data
    await page.getByRole('button', { name: /pending/i }).first().click();
    await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();
  });

  // E2E-04: Selects a patient from the list and verifies their detail panel
  // shows the correct room number and diagnosis tag.
  test('E2E-04: Patient selection', async ({ page }) => {
    await page.getByRole('button', { name: /patients/i }).first().click();

    // Confirm seeded patients are visible in the list
    await expect(page.getByText(/john davis/i)).toBeVisible();
    await expect(page.getByText(/mary wilson/i)).toBeVisible();

    // Select John Davis and verify detail panel content
    await page.getByText(/john davis/i).first().click();
    await expect(page.getByText(/room 204a/i).nth(1)).toBeVisible();
    await expect(page.getByText(/hypertension/i)).toBeVisible();
  });

  // E2E-05: Toggles left-handed mode in Settings, saves, and confirms
  // the success toast message appears.
  test('E2E-05: Settings - left-handed mode', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).first().click();
    await page.getByRole('switch', { name: /left-handed/i }).click();
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/settings saved/i)).toBeVisible();
  });

  // E2E-06: Sad path validation — logs out, attempts empty submission,
  // then submits a malformed email and asserts the correct error messages appear.
  test('E2E-06: Login validation sad paths', async ({ page }) => {
    await page.getByRole('button', { name: /logout/i }).first().click();

    // Submit with empty fields — both required field errors should appear
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();

    // Submit with a malformed email — format validation error should appear
    await page.locator('input[name="email"]').fill('notanemail');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

});
