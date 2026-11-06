/** Render the same score as the website to a local stereo WAV for listening.
 * Uses existing development tools; no server, microphone, or audio service. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { chromium } from '@playwright/test';

const javascript = ts.transpileModule(await readFile(new URL('../src/lib/score.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
try {
  const page = await browser.newPage();
  console.log('Rendering the full 96-bar composition with native OfflineAudioContext…');
  const result = await page.evaluate(async (source) => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const score = await import(url); URL.revokeObjectURL(url);
    const sampleRate = 24000;
    const duration = score.cycleSeconds + score.sonicTheme.reverbSeconds;
    const context = new OfflineAudioContext(2, Math.ceil(duration * sampleRate), sampleRate);
    const master = context.createGain(); master.gain.value = 0;
    master.gain.setTargetAtTime(score.sonicTheme.defaultVolume * .45, 0, 1.4);
    master.gain.setTargetAtTime(0, score.cycleSeconds - 1, 1.4);
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -18; limiter.knee.value = 15; limiter.ratio.value = 5; limiter.attack.value = .015; limiter.release.value = .5;
    master.connect(limiter).connect(context.destination);
    const space = score.createSoundscape(context, master, 0);
    for (const event of score.scorePlan) score.scheduleScoreEvent(space, event, event.beat * score.beatSeconds);
    const audio = await context.startRendering();
    const data = new ArrayBuffer(44 + audio.length * 4); const view = new DataView(data);
    const text = (offset, value) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
    text(0, 'RIFF'); view.setUint32(4, data.byteLength - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 4, true); view.setUint16(32, 4, true); view.setUint16(34, 16, true);
    text(36, 'data'); view.setUint32(40, data.byteLength - 44, true);
    let peak = 0; let energy = 0;
    const channels = [audio.getChannelData(0), audio.getChannelData(1)];
    for (let i = 0; i < audio.length; i++) for (let channel = 0; channel < 2; channel++) {
      const sample = channels[channel][i]; peak = Math.max(peak, Math.abs(sample)); energy += sample * sample;
      view.setInt16(44 + (i * 2 + channel) * 2, Math.round(Math.max(-1, Math.min(1, sample)) * 32767), true);
    }
    const bytes = new Uint8Array(data); const chunks = [];
    for (let i = 0; i < bytes.length; i += 16384) chunks.push(String.fromCharCode(...bytes.subarray(i, i + 16384)));
    return { wav: btoa(chunks.join('')), duration, peak, rms: Math.sqrt(energy / audio.length / 2), sampleRate, bars: score.sonicTheme.bars };
  }, javascript);
  const output = new URL('../release/cognis11-ambient-v2-preview.wav', import.meta.url);
  const wav = Buffer.from(result.wav, 'base64');
  if (wav.toString('ascii', 0, 4) !== 'RIFF' || result.peak >= 1) throw new Error('Audio preview validation failed.');
  await mkdir(new URL('../release/', import.meta.url), { recursive: true });
  await writeFile(output, wav);
  console.log(JSON.stringify({ file: fileURLToPath(output), bytes: wav.length, durationSeconds: result.duration, sampleRate: result.sampleRate, channels: 2, peak: result.peak, rms: result.rms, sha256: createHash('sha256').update(wav).digest('hex') }, null, 2));
  console.log('Local listening artifact only; not included in the website upload.');
} finally { await browser.close(); }
