import { test, expect } from '@playwright/test';

// tasks.spec.ts — full integration smoke test covering settings, patients, and tasks.
// Runs against the local dev server at localhost:5173.
// Authenticates once per test and exercises the complete task lifecycle.
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Authenticate with the seeded admin account
  await page.locator('input[name="email"]').fill('admin@careconnect.com');
  await page.locator('input[name="password"]').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // ── Settings ────────────────────────────────────────────────────────────
  // Toggle left-handed mode on, save, then toggle it back off and save again
  await page.getByRole('button', { name: /settings/i }).first().click();
  await page.getByRole('switch', { name: /left-handed/i }).click();
  await page.getByRole('button', { name: /save changes/i }).click();
  await expect(page.getByText(/settings saved/i)).toBeVisible();

  await page.getByRole('switch', { name: /left-handed/i }).click();
  await page.getByRole('button', { name: /save changes/i }).click();
  await expect(page.getByText(/settings saved/i)).toBeVisible();

  // ── Patients ─────────────────────────────────────────────────────────────
  // Open the Add Patient modal, fill all fields, then cancel without saving
  await page.getByRole('button', { name: /patients/i }).first().click();
  await page.getByText('Add Patient').click();
  await expect(page.getByRole('heading', { name: 'Add New Patient' })).toBeVisible();
  await page.locator('input[id="firstName"]').fill('TEST');
  await page.locator('input[id="lastName"]').fill('PATIENT');
  await page.locator('input[id="dateOfBirth"]').fill('2026-03-18');
  await page.locator('select[id="gender"]').selectOption('Prefer not to say');
  await page.locator('input[id="phone"]').fill('5551234567');
  await page.locator('input[id="email"]').fill('some@email.com');
  await page.getByRole('button', { name: /cancel/i }).click();

  // Select an existing seeded patient and verify their diagnosis is visible
  await page.getByText('John Davis').first().click();
  await expect(page.getByText(/hypertension/i)).toBeVisible();

  // ── Tasks ─────────────────────────────────────────────────────────────────
  // Navigate to tasks and confirm the result count is visible
  await page.getByRole('button', { name: /tasks/i }).first().click();
  await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();

  // Open the Create Task modal, fill fields, then cancel without saving
  await page.getByRole('button', { name: /new task/i }).click();
  await expect(page.getByRole('heading', { name: 'Create New Task' })).toBeVisible();
  await page.locator('input[id="taskTitle"]').fill('TEST TASK');
  await page.locator('select[id="priority"]').selectOption('High');
  await page.locator('select[id="category"]').selectOption('Treatment');
  await page.getByRole('button', { name: /cancel/i }).click();

  // Search by patient name — expects exactly one matching task
  await page.locator('input[placeholder*="Search"]').fill('John');
  await expect(page.getByText(/showing 1 task/i)).toBeVisible();
  await page.getByRole('button', { name: /clear search/i }).click();

  // Filter by Pending tab then reset to All Tasks
  await page.getByRole('button', { name: /pending/i }).first().click();
  await expect(page.getByText(/showing \d+ tasks/i)).toBeVisible();
  await page.getByRole('button', { name: /all tasks/i }).first().click();

  // Exercise the full task lifecycle: pending → in-progress → completed
  await page.getByRole('button', { name: /start task/i }).first().click();
  await page.getByRole('button', { name: /in progress/i }).first().click();
  await page.getByRole('button', { name: /complete/i }).first().click();

  // ── Return to Dashboard ──────────────────────────────────────────────────
  await page.getByRole('button', { name: /dashboard/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
