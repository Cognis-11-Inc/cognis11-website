import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('introduction finishes, opens the homepage, and stays dismissed for the session', async ({ page }) => {
  await page.goto('./');
  const intro = page.getByRole('dialog');
  await expect(intro).toBeVisible();
  await expect(page.getByRole('button', { name: 'Skip introduction' })).toBeFocused();
  const violations = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(violations.violations).toEqual([]);
  await expect(intro).not.toBeVisible({ timeout: 6000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass('intro-open');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions worth pursuing.');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }).click();
  await expect(intro).not.toBeVisible();
  await page.reload();
  await expect(intro).not.toBeVisible();
});

test('skip button works with the keyboard and releases modal focus', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Skip introduction' }).press('Enter');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Explore our research' })).toBeFocused();
});

test('Escape skips the introduction', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('reduced motion bypasses the introduction and disables animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.locator('.hero-figure').evaluate((node) => getComputedStyle(node).animationName)).toBe('none');
  expect(await page.locator('html').evaluate((node) => getComputedStyle(node).scrollBehavior)).toBe('auto');
});

test('changing to reduced motion during the introduction closes it immediately', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('html')).not.toHaveClass('intro-open');
});

test('unavailable session storage leaves the homepage usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() { throw new DOMException('Unavailable for this test', 'SecurityError'); },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('link', { name: 'Explore our research' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions worth pursuing.');
  expect(errors).toEqual([]);
});

test('introduction runs offline after the document and styles arrive', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.getByRole('dialog')).toBeVisible();
  await context.setOffline(true);
  await expect(page.locator('.boot-lines li').last()).toHaveClass('is-visible', { timeout: 5000 });
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 6000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('a new browser session receives its own introduction', async ({ browser, baseURL }) => {
  const first = await browser.newContext();
  const firstPage = await first.newPage();
  await firstPage.goto(baseURL!);
  await firstPage.getByRole('button', { name: 'Skip introduction' }).click();
  await expect(firstPage.getByRole('dialog')).not.toBeVisible();
  await first.close();
  const next = await browser.newContext();
  const nextPage = await next.newPage();
  await nextPage.goto(baseURL!);
  await expect(nextPage.getByRole('dialog')).toBeVisible();
  await next.close();
});

test('all routes are accessible, responsive, self-contained, and internally linked', async ({ page, baseURL }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  const external: string[] = [];
  const failures: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });

  for (const path of ['', 'research/', 'consulting/', 'about/', 'contact/']) {
    const response = await page.goto(`./${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="page"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://cognis11.xyz${new URL(baseURL!).pathname}${path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(audit.violations, `Accessibility violations on /${path}`).toEqual([]);

    // Validate each real navigation target and fragment in the emitted static site.
    const hrefs = await page.locator('a').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    for (const href of new Set(hrefs)) {
      const target = new URL(href);
      if (target.protocol === 'mailto:') {
        expect(target.pathname).toBe('founder@cognis11.xyz');
        continue;
      }
      if (target.origin !== new URL(baseURL!).origin) {
        // Public source links are verified during editorial review, not fetched
        // by this local browser suite. They must not load as page dependencies.
        expect(target.origin).toBe('https://github.com');
        expect(target.pathname).toMatch(/^\/Cognis-11-Inc\//);
        continue;
      }
      expect(target.origin).toBe(new URL(baseURL!).origin);
      const linkResponse = await page.request.get(href);
      expect(linkResponse.ok(), `Broken local link: ${href}`).toBe(true);
      if (target.hash) {
        const html = await linkResponse.text();
        expect(html).toContain(`id="${target.hash.slice(1)}"`);
      }
    }
    if (!path) await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
    if (['research/', 'about/', 'contact/'].includes(path)) {
      await page.screenshot({ path: testInfo.outputPath(`${path.replace('/', '')}.png`), fullPage: true });
    }
  }

  for (const width of [320, 375, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow at ${width}px`).toBe(true);
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(failures).toEqual([]);
});

test('the homepage and navigation work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('.instrument > summary').click();
  await expect(page.getByRole('heading', { name: 'A gesture changes the encounter.' })).toBeVisible();
  await page.locator('.instrument > summary').press('Enter');
  await expect(page.locator('#encounter-revelation')).not.toBeVisible();
  await page.getByText('What remains when the moment is gone?', { exact: true }).click();
  await expect(page.locator('.research-question[open]')).toContainText('What does it mean for a synthetic system to maintain continuity over time?');
  await page.getByRole('link', { name: 'Explore our research' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions worth pursuing.');
  await context.close();
});

test('the instrument responds to contact and remains accessible when open', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const control = page.locator('.instrument > summary');
  await expect(page.locator('#encounter-revelation')).not.toBeVisible();
  if (testInfo.project.name === 'mobile') {
    await control.tap();
  } else {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.instrument-stage').hover({ position: { x: 90, y: 120 } });
    await expect(page.locator('.instrument-stage')).toHaveAttribute('style', /--contact-x/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.instrument-stage')).not.toHaveAttribute('style');
    await control.press('Enter');
  }
  await expect(page.locator('.instrument')).toHaveAttribute('open', '');
  await expect(page.getByRole('heading', { name: 'A gesture changes the encounter.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore continuity' })).toBeVisible();
  expect(await page.locator('.signal-trace').evaluate((node) => getComputedStyle(node).animationName)).toBe('none');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('homepage-contact.png'), fullPage: true });
  await control.press('Enter');
  await expect(page.locator('#encounter-revelation')).not.toBeVisible();
  await expect(control).toBeFocused();
});

test('research questions reveal their direction and a working next step', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const question = page.getByText('What remains when the moment is gone?', { exact: true });
  await question.click();
  await expect(page.locator('.research-question[open]')).toHaveCount(1);
  const openQuestion = page.locator('.research-question[open]');
  await expect(openQuestion).toContainText('Continuity');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  await openQuestion.getByRole('link', { name: 'Follow this question' }).click();
  await expect(page).toHaveURL(/research\/#continuity$/);
  await expect(page.getByRole('heading', { name: 'Continuity', exact: true })).toBeInViewport();
});

test('skip to content is the first keyboard stop and moves focus to main', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('static SEO and hosting artifacts are emitted', async ({ request }) => {
  const sitemap = await request.get('./sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  const robots = await request.get('./robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap: https://cognis11.xyz');
  expect((await request.get('./favicon.svg')).ok()).toBe(true);
  expect((await request.get('./.nojekyll')).ok()).toBe(true);
  const notFound = await request.get('./404.html');
  expect(notFound.ok()).toBe(true);
  expect(await notFound.text()).toContain('name="robots" content="noindex"');
});
