import {test, expect} from '@playwright/test';
import * as mock from './mocks/mock.json';

test.beforeEach(async ({page}) => {
  await page.route('**/jvx-multiselect-test*', (route: any) => {
    console.log('data: ', JSON.stringify(mock.basic.data));
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mock.basic.data)
    });
  });

  await page.goto('https://localhost:4200/');
});

/**
 * Se dopo aver ricercato clicco su un opzione della vecchia lista,
 * la selezione verrà deselezionata e verrà proposta la nuova lista di opzioni da cui scegliere.
 */
test('clean selection after search response', async ({page}) => {
  const keyword = 'Playwright';
  await page.getByTestId('selector').click();
  await page.getByPlaceholder('search').click();
  await page.getByPlaceholder('search').fill(keyword);
  const response = page.waitForResponse('**/jvx-multiselect-test*');
  await page.getByText(keyword).click();
  await response.then(async () => {
    await expect(page.getByRole('option').filter({hasText: keyword})).toBeVisible();
  });
});
