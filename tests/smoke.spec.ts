import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test('renders hero with name, identity, and lede', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Building quiet systems');
    await expect(page.locator('.hero-lede')).toContainText('co-founding Qliqless.ai');
    await expect(page.locator('.hero-roles')).toContainText('Co-Founder');
    await expect(page.locator('.hero-roles')).toContainText('ML Engineer');
    await expect(page.locator('.hero-roles')).toContainText('Researcher');
  });

  test('renders all primary sections', async ({ page }) => {
    await page.goto('/');
    for (const id of ['about', 'trajectory', 'projects', 'publications', 'notes', 'teaching', 'personal', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('trajectory shows all four roles', async ({ page }) => {
    await page.goto('/');
    const summaries = page.locator('#trajectory .row summary .role');
    await expect(summaries).toHaveCount(4);
    await expect(summaries.nth(0)).toContainText('Co-Founder');
    await expect(summaries.nth(3)).toContainText('Data Specialist');
  });

  test('numbers strip shows the four quantities', async ({ page }) => {
    await page.goto('/');
    const cells = page.locator('.strip dl .cell');
    await expect(cells).toHaveCount(4);
  });

  test('contact exposes email', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute('href', /mailto:/);
  });

  test('notes index route renders without crashing', async ({ page }) => {
    await page.goto('/notes/');
    await expect(page.locator('h1')).toContainText('Writing');
  });
});
