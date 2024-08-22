import { test, expect } from '@playwright/test';

test('test deselection', async ({ page }) => {
  await page.goto('https://localhost:4200/');
  await page.getByText('value').click();
  const selection = page.getByText('testo: value 1', { exact: true });
  await selection.click();
  await selection.waitFor({state: 'hidden'});
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
