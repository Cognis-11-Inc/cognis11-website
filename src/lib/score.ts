/** Original procedural composition. One plan is used by live playback and offline
 * rendering so long-form timing and the actual signal can be reviewed together. */
export const sonicTheme = {
  rootHz: 111,
  binauralDifferenceHz: 11,
  bpm: 66,
  defaultVolume: 0.32,
  masterGainScale: 0.85,
  visualOffsetMs: 0,
  bars: 96,
  beatsPerBar: 4,
  reverbSeconds: 7.2,
} as const;

export const beatSeconds = 60 / sonicTheme.bpm;
export const cycleSeconds = sonicTheme.bars * sonicTheme.beatsPerBar * beatSeconds;
const chords = [
  [1, 1.189207, 1.498307], [1, 1.33484, 1.781797],
  [.890899, 1.189207, 1.498307], [.890899, 1.122462, 1.681793],
  [.749154, 1.189207, 1.498307], [.749154, 1, 1.33484],
  [1, 1.189207, 1.781797], [1, 1.33484, 1.498307],
  [.890899, 1.122462, 1.498307], [.749154, 1.189207, 1.33484],
  [1, 1.189207, 1.498307], [1, 1.189207, 2],
];

export type ScoreEvent = { kind: 'harmony' | 'bass' | 'snare' | 'shimmer'; beat: number; variant: number };
export const scorePlan: ScoreEvent[] = [];
for (let bar = 0; bar < sonicTheme.bars; bar++) {
  const variant = Math.floor(bar / 8);
  if (bar % 8 === 0) scorePlan.push({ kind: 'harmony', beat: bar * 4, variant });
  if ([2, 11, 23, 37, 54, 70, 85, 94].includes(bar)) {
    scorePlan.push({ kind: 'bass', beat: bar * 4, variant });
    if ([23, 54, 85].includes(bar)) scorePlan.push({ kind: 'bass', beat: bar * 4 + 2.5, variant: variant + 12 });
  }
  if ([3, 7, 15, 19, 27, 35, 43, 51, 59, 67, 75, 83, 87, 95].includes(bar)) {
    scorePlan.push({ kind: 'snare', beat: bar * 4 + 2, variant });
  }
  if ([14, 22, 30, 46, 62, 78, 86, 93].includes(bar)) {
    scorePlan.push({ kind: 'shimmer', beat: bar * 4 + 1.5, variant });
  }
}
scorePlan.sort((a, b) => a.beat - b.beat);

export type Soundscape = {
  context: BaseAudioContext;
  pads: OscillatorNode[];
  dry: GainNode;
  room: DelayNode;
  effects: GainNode;
  bass: GainNode;
  percussion: GainNode;
  noise: AudioBuffer;
};

function random(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 2147483648 - 1;
  };
}

export function createSoundscape(context: BaseAudioContext, master: AudioNode, epoch: number): Soundscape {
  const dry = context.createGain();
  dry.gain.value = .82;
  dry.connect(master);

  // A diffused, dark stereo tail, with space between a gesture and its reflection.
  const room = context.createDelay(.3);
  room.delayTime.value = .038;
  const highpass = context.createBiquadFilter();
  highpass.type = 'highpass'; highpass.frequency.value = 180;
  const diffusion = context.createBiquadFilter();
  diffusion.type = 'allpass'; diffusion.frequency.value = 730; diffusion.Q.value = .55;
  const convolver = context.createConvolver();
  const impulse = context.createBuffer(2, Math.ceil(context.sampleRate * sonicTheme.reverbSeconds), context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const samples = impulse.getChannelData(channel);
    const noise = random(110111 + channel * 7919);
    let smooth = 0;
    for (let i = 0; i < samples.length; i++) {
      const time = i / context.sampleRate;
      smooth = smooth * .68 + noise() * .32;
      const envelope = (1 - Math.exp(-time / .055)) * Math.exp(-time / 1.75) * Math.pow(1 - i / samples.length, 1.4);
      samples[i] = smooth * envelope;
    }
    for (const [seconds, level] of [[.017, .24], [.041, .18], [.079, .13], [.127, .09], [.193, .05]]) {
      const start = Math.round((seconds + channel * .0067) * context.sampleRate);
      for (let i = 0; i < 48 && start + i < samples.length; i++) samples[start + i] += Math.sin(i / 48 * Math.PI) * level;
    }
  }
  convolver.buffer = impulse;
  const damping = context.createBiquadFilter();
  damping.type = 'lowpass'; damping.frequency.value = 3300; damping.Q.value = .45;
  const wet = context.createGain(); wet.gain.value = .48;
  room.connect(highpass).connect(diffusion).connect(convolver).connect(damping).connect(wet).connect(master);

  const music = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 720; filter.Q.value = .4;
  const pulse = context.createGain(); const swell = context.createGain();
  music.connect(filter).connect(pulse).connect(swell).connect(dry);
  const padSend = context.createGain(); padSend.gain.value = .5;
  swell.connect(padSend).connect(room);

  const modulate = (param: AudioParam, centre: number, depth: number, frequency: number) => {
    param.value = centre;
    const lfo = context.createOscillator(); const amount = context.createGain();
    amount.gain.value = depth; lfo.frequency.value = frequency;
    lfo.connect(amount).connect(param); lfo.start(epoch);
  };
  modulate(pulse.gain, .85, .09, sonicTheme.bpm / 60);
  modulate(swell.gain, .78, .17, sonicTheme.bpm / 60 / 8);
  modulate(filter.frequency, 720, 230, sonicTheme.bpm / 60 / 32);

  const voice = (frequency: number, level: number, pan: number, type: OscillatorType = 'sine') => {
    const oscillator = context.createOscillator(); const gain = context.createGain(); const position = context.createStereoPanner();
    oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.value = level; position.pan.value = pan;
    oscillator.connect(gain).connect(position).connect(music); oscillator.start(epoch);
    return oscillator;
  };
  voice(sonicTheme.rootHz, .015, 0, 'triangle');
  const pads = chords[0].map((ratio, index) => voice(sonicTheme.rootHz * 2 * ratio, .026, (index - 1) * .3));
  const carrier = sonicTheme.rootHz * 4;
  voice(carrier - sonicTheme.binauralDifferenceHz / 2, .012, -1);
  voice(carrier + sonicTheme.binauralDifferenceHz / 2, .012, 1);

  const bus = (send: number) => {
    const input = context.createGain(); input.connect(dry);
    const amount = context.createGain(); amount.gain.value = send;
    input.connect(amount).connect(room); return input;
  };
  const effects = bus(.7); const bass = bus(.035); const percussion = bus(.85);
  const noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const next = random(111066); const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = next();
  return { context, pads, dry, room, effects, bass, percussion, noise };
}

function tone(space: Soundscape, bus: AudioNode, frequency: number, at: number, level: number, attack: number, duration: number, type: OscillatorType = 'sine', pan = 0) {
  const { context } = space;
  const oscillator = context.createOscillator(); const gain = context.createGain(); const position = context.createStereoPanner();
  oscillator.type = type; oscillator.frequency.value = frequency; position.pan.value = pan;
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(level, at + attack);
  gain.gain.exponentialRampToValueAtTime(.00001, at + duration);
  oscillator.connect(gain).connect(position).connect(bus);
  oscillator.start(at); oscillator.stop(at + duration + .05);
  oscillator.addEventListener('ended', () => { oscillator.disconnect(); gain.disconnect(); position.disconnect(); }, { once: true });
}

export function scheduleScoreEvent(space: Soundscape, event: ScoreEvent, at: number) {
  const chord = chords[event.variant % chords.length];
  if (event.kind === 'harmony') {
    space.pads.forEach((oscillator, index) => oscillator.frequency.setTargetAtTime(sonicTheme.rootHz * 2 * chord[index], at, 3.5));
  } else if (event.kind === 'bass') {
    const frequency = sonicTheme.rootHz / 2 * chord[0] * (event.variant >= 12 ? 1.498307 : 1);
    tone(space, space.bass, frequency, at, .25, .22, 5.4);
    // A quiet harmonic lets a low event retain its shape on smaller speakers.
    tone(space, space.bass, frequency * 2, at + .018, .055, .3, 3.8, 'triangle');
  } else if (event.kind === 'snare') {
    const { context } = space;
    const source = context.createBufferSource(); source.buffer = space.noise;
    const band = context.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = 1400 + event.variant % 3 * 120; band.Q.value = .65;
    const dark = context.createBiquadFilter(); dark.type = 'lowpass'; dark.frequency.value = 3100; dark.Q.value = .4;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(.11, at + .014);
    envelope.gain.exponentialRampToValueAtTime(.00001, at + .38);
    source.connect(band).connect(dark).connect(envelope).connect(space.percussion);
    source.start(at, event.variant % 6 * .17, .45);
    source.addEventListener('ended', () => { source.disconnect(); band.disconnect(); dark.disconnect(); envelope.disconnect(); }, { once: true });
    tone(space, space.percussion, sonicTheme.rootHz * 1.498307, at, .035, .016, .22);
    tone(space, space.percussion, sonicTheme.rootHz * 2, at + .009, .016, .018, .16);
  } else {
    [0, 2].forEach((index) => tone(space, space.effects, sonicTheme.rootHz * 2 * chord[index], at + index * beatSeconds / 4, .023, .38, 3.8, 'sine', index ? .45 : -.45));
  }
}

export function scheduleCue(space: Soundscape, kind: 'enter' | 'contact' | 'close' | 'navigate' | 'discovery', now: number, epoch: number) {
  const nextEighth = epoch + Math.ceil((now - epoch) / (beatSeconds / 2)) * (beatSeconds / 2);
  const notes = kind === 'discovery' ? [1, 1.189207, 2.996614] : kind === 'contact' ? [2, 2.378414, 2.996614] : kind === 'close' ? [1.498307, 1] : kind === 'enter' ? [1, 1.498307, 2] : [2];
  notes.forEach((ratio, index) => tone(space, space.effects, sonicTheme.rootHz * ratio, index ? nextEighth + (index - 1) * beatSeconds / 2 : now, .025 / (1 + index * .35), .14, 3.2, 'sine', (index - 1) * .15));
}
