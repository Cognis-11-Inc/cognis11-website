# Sound as part of the encounter

The Operator requested subtle dark ambient synth, a binaural layer, related effects, and rhythm synchronized with the moving image. The final visitor control is a single Enable / Mute / Unmute button.

## Composition and implementation

`src/lib/sound.ts` owns the score and its common timing source. `AudioControls.astro` owns visitor interaction and the session preference. `BaseLayout.astro` uses Astro's built-in client router and persists the sound component across navigation.

| Parameter | Initial composition |
| --- | --- |
| Tonal root | 111 Hz, with a 55.5 Hz sine bass |
| Tempo | 66 BPM |
| Harmony | Four slow minor voicings; 16 beats per voicing |
| Stereo carriers | Left 438.5 Hz, right 449.5 Hz; 11 Hz difference |
| Tone | Filtered sine/triangle voices, low-depth pulse, slow filter movement |
| Space | Locally generated, deterministic three-second stereo impulse |
| Level | Fixed quiet starting mix; one master gain controls music and effects |
| Cues | Notes derived from the same root and harmony; soft attack and decay |
| Visual breath | Eight-beat envelope, sampled from the audible transport |

No audio dependency, recording, asset download, or external request is needed. One AudioContext is created lazily inside the visitor's enabling gesture. The master fades in; mute fades out before suspending the context. Repeated enabling reuses the graph. Hidden tabs suspend playback. Session storage is optional; unavailable storage does not block sound.

The first cue tone responds immediately to the gesture. Subsequent tones join the next eighth-note grid. The long pad changes are scheduled ahead on the audio clock. Visual phase is computed from `getOutputTimestamp()` where available, with a base/output-latency fallback. `visualOffsetMs` permits later calibration after listening on real hardware. These measures establish a shared clock, rather than assuming browser animation frames are a sample-accurate audio scheduler.

Reduced motion removes the visual breath and pointer movement. It does not automatically choose an audio preference. A full page reload offers activation again; no autoplay bypass is attempted. Stereo headphones reveal the separate carriers. Frequencies are compositional choices, without a claim that the site changes brain states.

## Verification and listening

The browser tests instrument the real native Web Audio API. They check that no context exists before activation, inspect carrier frequencies/panning and the tempo oscillator, sample a nonzero output signal, and check keyboard mute/resume and a single context across route changes. They also check activation from the intro and reduced-motion behavior.

These tests establish signal generation and controls in Chromium. They do not certify a subjective mix, perceived loudness on every device, headphone separation on a listener's hardware, or exact audiovisual latency on a physical display. The Operator's listening review remains the next creative decision. The root, harmony, binaural difference, tempo, default level, and timing offset can be adjusted centrally without introducing new visitor controls.
