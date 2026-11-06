import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { manuscriptPath, manuscriptFile, researcher } from '../src/lib/publications';

test('the homepage leads to public work and a developed research reading path', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'HOUND', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Digital Bee Hive', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Möbius Automata', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Phalanx', exact: true })).toBeVisible();
  await expect(page.locator('.lab-consulting-entry')).toContainText('CAD $100/hour');
  await page.getByRole('link', { name: 'Explore HOUND', exact: true }).click();
  await expect(page).toHaveURL(/research\/#hound$/);
  await expect(page.getByRole('heading', { name: 'HOUND', exact: true })).toBeInViewport();
  await page.getByRole('navigation', { name: 'Research sections' }).getByRole('link', { name: 'Research directions', exact: true }).click();
  await page.locator('#continuity .direction-inquiry > summary').press('Enter');
  await expect(page.locator('#continuity')).toContainText('what is carried forward, what is transformed');
  await expect(page.locator('#continuity .direction-inquiry')).toContainText('What has actually persisted between two encounters?');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('the published v8.1 manuscript is readable locally with author identity and provenance', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('link', { name: 'Read v8.1', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${manuscriptPath}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Proto-Pineal v8.1.');
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(page.getByRole('link', { name: 'Original Zenodo record' })).toHaveAttribute('href', researcher.zenodoUrl);
  await expect(page.getByRole('link', { name: `ORCID ${researcher.orcid}` })).toHaveAttribute('href', researcher.orcidUrl);
  const pdf = await request.get(`./${manuscriptFile}`);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await expect(page.locator('.manuscript-viewer')).toHaveAttribute('src', new RegExp(`${manuscriptFile}$`));
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About', exact: true }).click();
  for (const title of ['Four categories of claim.', 'Built to run on its own.', 'Proof, not promises.']) await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: `ORCID · ${researcher.orcid}` })).toHaveAttribute('href', researcher.orcidUrl);
});

test('practical answers and prepared inquiry emails work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}consulting/`);
    const question = page.locator('#consulting-questions summary').filter({ hasText: 'What counts toward the three-hour weekly limit?' });
    await question.press('Enter');
    await expect(page.locator('#consulting-questions details[open]')).toContainText('total consulting work for that client');
    await question.press('Enter');
    await expect(page.locator('#consulting-questions details[open]')).toHaveCount(0);
    await page.goto(`${baseURL}contact/`);
    const links = await page.locator('.inquiry-route-grid a').evaluateAll((elements) => elements.map((element) => (element as HTMLAnchorElement).href));
    expect(links).toHaveLength(3);
    const subjects = new Set<string>();
    for (const href of links) {
      const target = new URL(href);
      expect(target.protocol).toBe('mailto:');
      expect(target.pathname).toBe('founder@cognis11.xyz');
      subjects.add(target.searchParams.get('subject')!);
      expect(target.searchParams.get('body')).toContain('\n\n');
    }
    expect(subjects.size).toBe(3);
    const evaluation = new URL(links[0]);
    expect(evaluation.searchParams.get('body')).toContain('What I have already tried:');
    await page.locator('#contact-questions summary').filter({ hasText: 'Does an initial inquiry begin a paid engagement?' }).press('Enter');
    await expect(page.locator('#contact-questions details[open]')).toContainText('first consulting evaluation is free');
  } finally { await context.close(); }
});
