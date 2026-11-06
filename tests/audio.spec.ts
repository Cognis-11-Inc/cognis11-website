import { test, expect } from '@playwright/test';
import { sonicTheme } from '../src/lib/sound';

type AudioProbe = {
  contexts: AudioContext[];
  oscillators: OscillatorNode[];
  panners: StereoPannerNode[];
  limiter?: DynamicsCompressorNode;
  analyser?: AnalyserNode;
};
type ProbeWindow = Window & { __audioProbe: AudioProbe };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const probe: AudioProbe = { contexts: [], oscillators: [], panners: [] };
    Object.defineProperty(window, '__audioProbe', { value: probe });
    Object.defineProperty(window, 'AudioContext', {
      value: new Proxy(Native, {
        construct(target, args) {
          const context = Reflect.construct(target, args) as AudioContext;
          probe.contexts.push(context);
          const oscillator = context.createOscillator.bind(context);
          context.createOscillator = () => { const node = oscillator(); probe.oscillators.push(node); return node; };
          const pan = context.createStereoPanner.bind(context);
          context.createStereoPanner = () => { const node = pan(); probe.panners.push(node); return node; };
          const limiter = context.createDynamicsCompressor.bind(context);
          context.createDynamicsCompressor = () => { const node = limiter(); probe.limiter = node; return node; };
          return context;
        },
      }),
    });
  });
});

test('sound waits for consent, generates a stereo signal, and can be silenced', async ({ page }) => {
  await page.goto('./research/');
  const toggle = page.locator('.sound-toggle');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => (window as unknown as ProbeWindow).__audioProbe.contexts.length)).toBe(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  const graph = await page.evaluate(() => {
    const probe = (window as unknown as ProbeWindow).__audioProbe;
    return { count: probe.contexts.length, state: probe.contexts[0].state, frequencies: probe.oscillators.map((node) => node.frequency.value), pans: probe.panners.map((node) => node.pan.value) };
  });
  expect(graph.count).toBe(1);
  expect(graph.state).toBe('running');
  expect(graph.frequencies).toContain(sonicTheme.rootHz * 4 - sonicTheme.binauralDifferenceHz / 2);
  expect(graph.frequencies).toContain(sonicTheme.rootHz * 4 + sonicTheme.binauralDifferenceHz / 2);
  // AudioParam stores its value as a float32, so compare musical timing with
  // a tolerance rather than JS float64 identity.
  expect(graph.frequencies.some((frequency) => Math.abs(frequency - sonicTheme.bpm / 60) < 0.000001)).toBe(true);
  expect(graph.pans).toEqual(expect.arrayContaining([-1, 1]));

  const amplitude = () => page.evaluate(() => {
    const probe = (window as unknown as ProbeWindow).__audioProbe;
    if (!probe.analyser) {
      probe.analyser = probe.contexts[0].createAnalyser();
      probe.analyser.fftSize = 2048;
      probe.limiter!.connect(probe.analyser);
    }
    const samples = new Float32Array(probe.analyser.fftSize);
    probe.analyser.getFloatTimeDomainData(samples);
    return Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
  });
  await expect.poll(amplitude).toBeGreaterThan(0.00001);
  expect(await amplitude()).toBeLessThan(0.2);
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle).toHaveAccessibleName('Unmute sound');
  await expect.poll(() => page.evaluate(() => (window as unknown as ProbeWindow).__audioProbe.contexts[0].state)).toBe('suspended');
  // One button controls the whole mix, including interaction cues.
  await toggle.press('Enter');
  await expect(toggle).toHaveAccessibleName('Mute sound');
  await expect.poll(() => page.evaluate(() => (window as unknown as ProbeWindow).__audioProbe.contexts[0].state)).toBe('running');
  expect(await page.evaluate(() => (window as unknown as ProbeWindow).__audioProbe.contexts.length)).toBe(1);
});

test('music persists through navigation and visual motion follows the audio preference', async ({ page }) => {
  await page.goto('./research/');
  const toggle = page.locator('.sound-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  for (const name of ['About', 'Contact', 'Home']) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => (window as unknown as ProbeWindow).__audioProbe.contexts.length)).toBe(1);
  }
  // Home may show its first-session intro after arriving from an inner page.
  const intro = page.getByRole('dialog');
  if (await intro.isVisible()) await page.getByRole('button', { name: 'Skip introduction' }).click();
  await expect(intro).not.toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-sound-active', 'true');
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--music-breath'))).not.toBe('');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--music-breath'))).toBe('');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.instrument > summary').click();
  await expect(page.getByRole('heading', { name: 'A gesture changes the encounter.' })).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('the introduction can enter with sound through a direct gesture', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Enter with sound' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Mute sound', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => (window as unknown as ProbeWindow).__audioProbe.contexts[0].state)).toBe('running');
});
