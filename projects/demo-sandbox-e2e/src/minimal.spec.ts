import { expect, Locator, Page, test } from '@playwright/test';

// Minimal e2e set for the multiselect, run against the demo app (projects/demo-sandbox) and its mock backend
// (projects/mock-server). Every example of the demo is a `section` identified by its anchor.

const section = (page: Page, anchor: string): Locator => page.locator(`section#${anchor}`);
const multiselect = (page: Page, anchor: string): Locator => section(page, anchor).locator('ng-jvx-multiselect').first();
const trigger = (select: Locator): Locator => select.locator('.ng-jvx-multiselect-value-container');
const chips = (select: Locator): Locator => select.locator('ng-jvx-multiselect-chip');
const panel = (page: Page): Locator => page.locator('.cdk-overlay-container .ng-jvx-multiselect-panel');
const options = (page: Page): Locator => panel(page).locator('ng-jvx-option');

const open = async (page: Page, select: Locator): Promise<void> => {
  await trigger(select).click();
  await expect(panel(page)).toBeVisible();
};

const closeWithBackdrop = async (page: Page): Promise<void> => {
  await page.locator('.ng-jvx-panel-overlay').click({ position: { x: 5, y: 5 } });
  await expect(panel(page)).toHaveCount(0);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(section(page, 'single')).toBeVisible();
});

test('renders the demo and keeps a disabled multiselect closed', async ({ page }) => {
  const single = multiselect(page, 'single');
  await expect(single.locator('.ng-jvx-single-value')).toHaveText(['Option 1']);

  await section(page, 'single').getByLabel('disabled').check();
  await expect(single.locator('.ng-jvx-multiselect')).toHaveClass(/disabled/);

  // Real clicks cannot reach a disabled multiselect (pointer-events), so dispatch the event on the trigger.
  await trigger(single).dispatchEvent('click');

  // Nothing to wait for on success: let two frames render so a wrongly opened panel would be attached.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(panel(page)).toHaveCount(0);
});

test('opens the panel with all the options and closes it on a backdrop click', async ({ page }) => {
  await open(page, multiselect(page, 'multi'));
  await expect(options(page)).toHaveCount(12);

  await closeWithBackdrop(page);
});

test('selects several options in multi mode and shows them as chips', async ({ page }) => {
  const select = multiselect(page, 'client-search');
  await open(page, select);

  await options(page).filter({ hasText: /^Apple$/ }).click();
  await options(page).filter({ hasText: /^Lemon$/ }).click();
  await expect(panel(page)).toBeVisible(); // multi keeps the panel open
  await closeWithBackdrop(page);

  // Chips are sorted by option value: Lemon (2) before Apple (8).
  await expect(chips(select)).toHaveText(['Lemon', 'Apple']);
});

test('removes a chip and clears the whole selection', async ({ page }) => {
  const select = multiselect(page, 'multi');
  await expect(chips(select)).toHaveText(['Orange', 'Strawberry']);

  await chips(select).first().locator('.remove-button').click();
  await expect(chips(select)).toHaveText(['Strawberry']);

  await select.locator('.ng-jvx-multiselect__remove-button').click();
  await expect(chips(select)).toHaveCount(0);
});

test('filters the options with the client-side search', async ({ page }) => {
  await open(page, multiselect(page, 'client-search'));
  const search = panel(page).locator('.search-input-container input');

  await search.fill('Lem');
  await expect(options(page)).toHaveText(['Lemon']);

  await search.fill('');
  await expect(options(page)).toHaveCount(12);
});

test('server mode requests the first page to the mock backend and shows its options', async ({ page }) => {
  const select = multiselect(page, 'remote-get');
  const firstPage = page.waitForRequest(request => request.url().includes('/jvx-multiselect-test/get-test'));

  await trigger(select).click();

  const url = new URL((await firstPage).url());
  expect(url.searchParams.get('page')).toBe('1');
  expect(url.searchParams.get('size')).toBe('20');
  await expect(options(page)).toHaveCount(20);
  await expect(options(page).first()).toHaveText('value 1');
});

test('searches the examples from the sidebar and highlights the words found', async ({ page }) => {
  const sidebarLinks = page.locator('.sidebar li a');
  const search = page.getByRole('searchbox', { name: 'Search examples' });

  await search.fill('pagination');
  await expect(sidebarLinks).toHaveText(['GET, pagination, search', 'Custom API format', 'Non-paginated list']);
  const highlighted = await page.evaluate(() => CSS.highlights.get('demo-search')?.size ?? 0);
  expect(highlighted).toBeGreaterThan(0);

  await search.press('Enter');
  await expect(page).toHaveURL(/#remote-get$/);

  await search.fill('chip');
  await expect(sidebarLinks).toHaveText(['Multiple selection', 'Custom templates']);

  await search.fill('zzzzz');
  await expect(page.locator('.sidebar .no-results')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
  await expect(sidebarLinks).toHaveCount(13);
});
