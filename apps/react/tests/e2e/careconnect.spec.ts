import { test, expect } from '@playwright/test';

test.describe('CareConnect E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('caregiver@careconnect.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('E2E-01: Login and dashboard renders', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Active Tasks')).toBeVisible();
    await expect(page.getByText('Urgent Tasks')).toBeVisible();
    await expect(page.getByText('Appointments')).toBeVisible();
    await expect(page.getByText('Patients')).toBeVisible();
  });

  test('E2E-02: Navigate all pages', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).first().click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByText('Task Management')).toBeVisible();

    await page.getByRole('button', { name: 'Schedule' }).first().click();
    await expect(page).toHaveURL('/schedule');
    await expect(page.getByText('Calendar')).toBeVisible();

    await page.getByRole('button', { name: 'Patients' }).first().click();
    await expect(page).toHaveURL('/patients');
    await expect(page.getByText('Patient Care')).toBeVisible();

    await page.getByRole('button', { name: 'Settings' }).first().click();
    await expect(page).toHaveURL('/settings');
    await expect(page.getByText('Settings & Preferences')).toBeVisible();

    await page.getByRole('button', { name: 'Dashboard' }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('E2E-03: Task search and filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).first().click();
    await expect(page.getByText('Showing 4 tasks')).toBeVisible();

    await page.getByPlaceholder('Search tasks...').fill('John');
    await expect(page.getByText('Showing 1 task')).toBeVisible();

    await page.getByText('Clear search').click();
    await expect(page.getByText('Showing 4 tasks')).toBeVisible();

    await page.getByRole('button', { name: 'Pending' }).first().click();
    await expect(page.getByText('Showing 3 tasks')).toBeVisible();
  });

  test('E2E-04: Patient selection', async ({ page }) => {
    await page.getByRole('button', { name: 'Patients' }).first().click();
    await expect(page.getByText('John Davis')).toBeVisible();
    await expect(page.getByText('Mary Wilson')).toBeVisible();

    await page.getByRole('button', { name: /John Davis/i }).click();
    await expect(page.getByText('Room 204A')).toBeVisible();
    await expect(page.getByText('Hypertension')).toBeVisible();
  });

  test('E2E-05: Settings - left-handed mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).first().click();
    await page.getByRole('switch', { name: 'Left-Handed Mode' }).click();
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Settings saved')).toBeVisible();
  });

  test('E2E-06: Login validation sad paths', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).first().click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();

    await page.getByLabel('Email').fill('notanemail');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

});
