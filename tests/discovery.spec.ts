import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('deliberate exploration reveals distinct forms and a rare encounter with a cooldown', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    // Control entropy, not the production discovery code or its event handlers.
    Object.defineProperty(crypto, 'getRandomValues', { value: (values: Uint32Array) => { values.fill(0); return values; } });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  const field = page.getByRole('button', { name: 'Look again: disturb the field' });
  for (const title of ['Before the explanation.', 'The shape of an absence.', 'Against the current.', 'The eleventh door.']) {
    await field.click();
    await expect(page.locator('[data-fragment-title]')).toHaveText(title);
  }
  await expect(page.locator('.discovery-lab')).toHaveAttribute('data-visual', 'eleventh');
  await expect(page.locator('[data-fragment-count]')).toHaveText('4');
  await expect(page.locator('[data-encounter]')).toHaveAttribute('data-echo', 'eleventh');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.locator('[data-discovery]').screenshot({ path: testInfo.outputPath('eleventh-door.png') });
  await field.click();
  await expect(page.locator('[data-fragment-tier]')).not.toContainText('encounter');
  await page.getByRole('button', { name: 'Follow signal 11' }).press('Enter');
  await expect(page.locator('[data-fragment-title]')).toHaveText('A living paradox engine.');
  expect(errors).toEqual([]);
});

test('research, repeated contact, and returning each leave a discoverable fragment', async ({ page }) => {
  await page.goto('./');
  const instrument = page.locator('.instrument > summary');
  for (let i = 0; i < 3; i++) {
    await instrument.click();
    await expect(page.locator('.instrument')).toHaveAttribute('open', '');
    if (i < 2) { await instrument.click(); await expect(page.locator('.instrument')).not.toHaveAttribute('open'); }
  }
  await expect(page.locator('[data-fragment-title]')).toHaveText('Repetition is a probe.');
  for (const question of await page.locator('.research-question > summary').all()) {
    await question.click();
    await expect(question.locator('..')).toHaveAttribute('open', '');
  }
  await expect(page.locator('[data-fragment-title]')).toHaveText('A fifth question.');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Guillaume Heinerth', exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.locator('[data-fragment-title]')).toHaveText('Something remained.');
  await page.locator('.fragment-archive > summary').click();
  await expect(page.locator('[data-fragment-list]')).toContainText('A fifth question.');
  await page.reload();
  await page.locator('.fragment-archive > summary').click();
  await expect(page.locator('[data-fragment-list]')).toContainText('Repetition is a probe.');
});

test('hidden keyboard signal and reduced-motion discoveries remain usable without storage', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Unavailable', 'SecurityError'); } }));
  await page.goto('./');
  await page.keyboard.type('11');
  await expect(page.locator('[data-fragment-title]')).toHaveText('A living paradox engine.');
  expect(await page.locator('.field-orbits').evaluate((node) => getComputedStyle(node).animationName)).toBe('none');
  await page.getByRole('button', { name: 'Look again: disturb the field' }).click();
  await expect(page.locator('[data-fragment-title]')).toHaveText('Before the explanation.');
});

test('consulting publishes the confirmed offer without inventing a total client cap', async ({ page }, testInfo) => {
  await page.goto('./consulting/');
  await expect(page.getByRole('heading', { name: 'One free evaluation.' })).toBeVisible();
  await expect(page.locator('.offer-rate')).toHaveText('CAD $100');
  await expect(page.locator('.offer-terms')).toContainText('Up to 3 hours per week per client.');
  await expect(page.locator('.offer-terms')).toContainText('time spent reviewing your documentation is billable');
  await expect(page.locator('.offer-terms')).toContainText('client-requested interruptions during that work all count toward the same weekly cap');
  await expect(page.locator('.offer-terms')).toContainText('scope, schedule, and fee agreed before work begins');
  await expect(page.getByRole('heading', { name: 'Human judgment. AI-assisted work.' })).toBeVisible();
  await page.getByRole('link', { name: 'Request a free evaluation' }).click();
  await expect(page).toHaveURL(/contact\/$/);
  await expect(page.getByRole('link', { name: 'founder@cognis11.xyz' }).first()).toHaveAttribute('href', 'mailto:founder@cognis11.xyz');
  await page.goto('./consulting/');
  await page.screenshot({ path: testInfo.outputPath('consulting.png'), fullPage: true });
});
