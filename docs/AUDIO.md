# Sound as part of the encounter

The Operator requested subtle dark ambient synth, a binaural layer, related effects, and rhythm synchronized with the moving image. The final visitor control is a single Enable / Mute / Unmute button.

## Composition and implementation

`src/lib/score.ts` owns the composition, synthesis, and space. `src/lib/sound.ts` schedules it against the audio clock. `AudioControls.astro` owns visitor interaction and session preference. `BaseLayout.astro` persists it across client navigation. The same composition/synthesis functions run in the offline renderer and signal tests.

| Parameter | Current composition |
| --- | --- |
| Tonal root | 111 Hz; sparse bass phrases begin at 55.5 Hz and follow the harmony |
| Tempo | 66 BPM |
| Form | 96 bars, about 5 minutes 49 seconds before repeating; 12 voicings, eight bars each |
| Bass | Eleven events per form; soft attack, long decay, quiet second harmonic, very small room send |
| Snare | Fourteen sparse events; filtered noise, tuned body, softened attack, larger reverb send |
| Stereo carriers | Left 438.5 Hz, right 449.5 Hz; 11 Hz difference |
| Tone | Filtered sine/triangle voices, low-depth pulse, slow filter movement |
| Space | 38 ms predelay, highpass, allpass diffusion, early reflections, deterministic 7.2-second stereo impulse, lowpass damping |
| Level | Fixed quiet starting mix; one master gain controls music and effects |
| Cues | Notes from the same root/harmony; softer attack, longer decay; discovery cue shares the room |
| Visual response | Eight-beat breath and a low-depth bass envelope, sampled from the audible transport |

The raised mix uses `defaultVolume: 0.32` with the preserved `masterGainScale: 0.85` adjustment. Both live playback and offline rendering now share those parameters. The previous committed values were `0.24 × 0.45`; the combined gain change is about 8 dB before dynamics, including the separately applied volume adjustment. The preview measured peak 0.0993 and RMS 0.00980, below clipping. No perceived-loudness or hardware-level claim is made.

No audio dependency, recording, asset download, or external request is needed. One AudioContext is created lazily inside the visitor's enabling gesture. The master fades in; mute fades out before suspending the context. Repeated enabling reuses the graph. Hidden tabs suspend playback. Session storage is optional; unavailable storage does not block sound.

The first cue tone responds immediately; subsequent notes join the eighth-note grid. Pad changes and percussion are scheduled ahead on the audio clock. A stalled scheduler skips missed percussion rather than dumping it into the present. Visual phase uses `getOutputTimestamp()` with a latency fallback. `visualOffsetMs` permits physical-device calibration. The light responds to a scheduled bass event at audible output time, rather than when it is queued.

Reduced motion removes the visual breath and pointer movement. It does not automatically choose an audio preference. A full page reload offers activation again; no autoplay bypass is attempted. Stereo headphones reveal the separate carriers. Frequencies are compositional choices, without a claim that the site changes brain states.

## Verification and listening

The browser tests observe the native Web Audio API: no context before activation, actual carriers/panning/tempo, nonzero signal, keyboard mute/resume, one context across navigation, intro activation, and reduced motion. OfflineAudioContext renders measure the 55.5 Hz bass component, stereo output, headroom, and a decaying snare tail several seconds after the hit. Composition checks verify the long form and sparse events.

For a full listening artifact, using existing development dependencies:

```sh
CHROMIUM_PATH=/usr/bin/chromium npm run audio:render
```

This renders the same composition and room to `release/cognis11-ambient-v3-preview.wav`: 24 kHz, 16-bit stereo, about 5 minutes 56 seconds including the tail. It reports peak/RMS and SHA-256. It launches and closes its own headless browser, with no preview server or network. The WAV is an ignored local artifact, excluded from website uploads; the website continues to synthesize audio locally. An older open tab can retain an earlier audio context across client navigation; fully reload to hear a newly deployed mix.

These tests establish signal generation and controls in Chromium. They do not certify a subjective mix, perceived loudness on every device, headphone separation on a listener's hardware, or exact audiovisual latency on a physical display. The Operator's listening review remains the next creative decision. The root, harmony, binaural difference, tempo, default level, and timing offset can be adjusted centrally without introducing new visitor controls.
