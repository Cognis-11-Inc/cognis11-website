import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { scorePlan, cycleSeconds, sonicTheme } from '../src/lib/score';

test('the composition develops for more than five minutes with sparse bass and percussion', () => {
  expect(cycleSeconds).toBeGreaterThan(300);
  expect(cycleSeconds).toBeLessThan(600);
  const bass = scorePlan.filter((event) => event.kind === 'bass');
  expect(bass.length).toBeGreaterThan(4);
  expect(bass.length).toBeLessThan(sonicTheme.bars / 4);
  expect(bass[0].beat).toBeLessThan(16);
  expect(bass.at(-1)!.beat).toBeGreaterThan(sonicTheme.bars * 3);
  expect(new Set(scorePlan.filter((event) => event.kind === 'harmony').map((event) => event.variant)).size).toBeGreaterThan(8);
  expect(scorePlan.some((event) => event.kind === 'snare')).toBe(true);
});

test('native offline rendering contains low bass, stereo space, and a decaying snare tail', async ({ page }) => {
  const source = ts.transpileModule(readFileSync(new URL('../src/lib/score.ts', import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  await page.goto('./research/');
  const result = await page.evaluate(async (javascript) => {
    const url = URL.createObjectURL(new Blob([javascript], { type: 'text/javascript' }));
    const score = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    const render = async (seconds: number, withSnare: boolean, withPlan: boolean) => {
      const context = new OfflineAudioContext(2, Math.ceil(seconds * 22050), 22050);
      const master = context.createGain(); master.gain.value = score.sonicTheme.defaultVolume * .45;
      master.connect(context.destination);
      const space = score.createSoundscape(context, master, 0);
      if (withPlan) for (const event of score.scorePlan) if (event.beat * score.beatSeconds < seconds) score.scheduleScoreEvent(space, event, event.beat * score.beatSeconds);
      if (withSnare) score.scheduleScoreEvent(space, { kind: 'snare', beat: 0, variant: 0 }, 1);
      return context.startRendering();
    };
    const mix = await render(18, false, true);
    const left = mix.getChannelData(0); const right = mix.getChannelData(1);
    const energyAt = (start: number, frequency: number) => {
      const length = 22050; let real = 0; let imaginary = 0;
      for (let i = 0; i < length; i++) {
        const sample = left[Math.floor(start * 22050) + i] * (.5 - .5 * Math.cos(i / length * Math.PI * 2));
        real += sample * Math.cos(i / 22050 * frequency * Math.PI * 2);
        imaginary += sample * Math.sin(i / 22050 * frequency * Math.PI * 2);
      }
      return Math.hypot(real, imaginary) / length;
    };
    let peak = 0; let stereo = 0;
    for (let i = 0; i < left.length; i++) { peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i])); stereo += (left[i] - right[i]) ** 2; }
    const beforeBass = energyAt(3, 55.5); const bass = energyAt(7.7, 55.5);
    const dry = await render(9, false, false); const snare = await render(9, true, false);
    const difference = (start: number) => {
      const a = dry.getChannelData(0); const b = snare.getChannelData(0); let energy = 0;
      for (let i = Math.floor(start * 22050); i < Math.floor((start + .5) * 22050); i++) energy += (a[i] - b[i]) ** 2;
      return Math.sqrt(energy / (22050 * .5));
    };
    return { peak, stereo: Math.sqrt(stereo / left.length), beforeBass, bass, earlyTail: difference(2), lateTail: difference(5), reverbSeconds: score.sonicTheme.reverbSeconds };
  }, source);
  expect(result.peak).toBeGreaterThan(.005);
  expect(result.peak).toBeLessThan(.25);
  expect(result.stereo).toBeGreaterThan(.00001);
  expect(result.bass).toBeGreaterThan(Math.max(result.beforeBass * 5, .0001));
  expect(result.earlyTail).toBeGreaterThan(.000001);
  expect(result.lateTail).toBeGreaterThan(.00000001);
  expect(result.lateTail).toBeLessThan(result.earlyTail);
  expect(result.reverbSeconds).toBeGreaterThan(5);
});
