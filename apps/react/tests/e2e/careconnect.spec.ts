import { test, expect } from '@playwright/test';

test.describe('CareConnect E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('input[name="email"]').fill('caregiver@careconnect.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('E2E-01: Login and dashboard renders', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/active tasks/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /urgent tasks/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /today/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /recent activity/i })).toBeVisible();
  });

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

  test('E2E-03: Task search and filter', async ({ page }) => {
    await page.getByRole('button', { name: /tasks/i }).first().click();
    await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();

    await page.locator('input[placeholder*="Search"]').fill('John');
    await expect(page.getByText(/showing 1 task/i)).toBeVisible();

    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();

    await page.getByRole('button', { name: /pending/i }).first().click();
    await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();
  });

  test('E2E-04: Patient selection', async ({ page }) => {
    await page.getByRole('button', { name: /patients/i }).first().click();
    await expect(page.getByText(/john davis/i)).toBeVisible();
    await expect(page.getByText(/mary wilson/i)).toBeVisible();

    await page.getByText(/john davis/i).first().click();
    await expect(page.getByText(/room 204a/i).nth(1)).toBeVisible();
    await expect(page.getByText(/hypertension/i)).toBeVisible();
  });

  test('E2E-05: Settings - left-handed mode', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).first().click();
    await page.getByRole('switch', { name: /left-handed/i }).click();
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/settings saved/i)).toBeVisible();
  });

  test('E2E-06: Login validation sad paths', async ({ page }) => {
    await page.getByRole('button', { name: /logout/i }).first().click();
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();

    await page.locator('input[name="email"]').fill('notanemail');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

});
