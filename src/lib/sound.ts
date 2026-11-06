/** Original procedural score. Frequencies and timing are compositional controls,
 * not medical claims or measurements of a visitor. */
export const sonicTheme = {
  rootHz: 111,
  binauralDifferenceHz: 11,
  bpm: 66,
  defaultVolume: 0.24,
  visualOffsetMs: 0,
} as const;

const harmony = [[1, 1.189207, 1.498307], [1, 1.33484, 1.781797], [1, 1.189207, 1.781797], [1, 1.189207, 1.498307]];
type Cue = 'enter' | 'contact' | 'close' | 'navigate';

export class SiteSound {
  private context?: AudioContext;
  private master?: GainNode;
  private effects?: GainNode;
  private pads: OscillatorNode[] = [];
  private epoch = 0;
  private nextPhrase = 1;
  private frame = 0;
  private fadeTimer = 0;
  private lastCue = -Infinity;
  private enabled = false;
  private readonly volume: number = sonicTheme.defaultVolume;
  private motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  constructor() {
    this.motion.addEventListener('change', () => this.clearVisuals());
  }

  private build() {
    const context = this.context = new AudioContext({ latencyHint: 'playback' });
    this.epoch = context.currentTime + 0.05;
    const master = this.master = context.createGain();
    master.gain.value = 0;
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.knee.value = 15;
    limiter.ratio.value = 5;
    limiter.attack.value = 0.015;
    limiter.release.value = 0.5;
    master.connect(limiter).connect(context.destination);

    const dry = context.createGain();
    dry.gain.value = 0.8;
    dry.connect(master);
    const room = context.createConvolver();
    const impulse = context.createBuffer(2, context.sampleRate * 3, context.sampleRate);
    let seed = 110111;
    for (let channel = 0; channel < 2; channel++) {
      const samples = impulse.getChannelData(channel);
      for (let i = 0; i < samples.length; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
        samples[i] = ((seed >>> 0) / 2147483648 - 1) * Math.pow(1 - i / samples.length, 3.5);
      }
    }
    room.buffer = impulse;
    const wet = context.createGain();
    wet.gain.value = 0.22;
    const roomFilter = context.createBiquadFilter();
    roomFilter.type = 'highpass';
    roomFilter.frequency.value = 160;
    room.connect(roomFilter).connect(wet).connect(master);

    const music = context.createGain();
    music.gain.value = 1;
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = 0.45;
    const pulse = context.createGain();
    const swell = context.createGain();
    music.connect(filter).connect(pulse).connect(swell);
    swell.connect(dry);
    swell.connect(room);

    // One transport drives the audible envelope and the visual phase.
    const modulate = (target: AudioParam, centre: number, depth: number, frequency: number) => {
      target.value = centre;
      const lfo = context.createOscillator();
      const amount = context.createGain();
      amount.gain.value = depth;
      lfo.frequency.value = frequency;
      lfo.connect(amount).connect(target);
      lfo.start(this.epoch);
    };
    modulate(pulse.gain, 0.82, 0.12, sonicTheme.bpm / 60);
    modulate(swell.gain, 0.76, 0.18, sonicTheme.bpm / 60 / 8);
    modulate(filter.frequency, 620, 190, sonicTheme.bpm / 60 / 16);

    const voice = (frequency: number, level: number, pan = 0, type: OscillatorType = 'sine') => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const position = context.createStereoPanner();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = level;
      position.pan.value = pan;
      oscillator.connect(gain).connect(position).connect(music);
      oscillator.start(this.epoch);
      return oscillator;
    };
    voice(sonicTheme.rootHz / 2, 0.045);
    voice(sonicTheme.rootHz, 0.028, 0, 'triangle');
    this.pads = harmony[0].map((ratio, index) => voice(sonicTheme.rootHz * 2 * ratio, 0.024, (index - 1) * 0.22));

    // Separate sine carriers, sent to opposite ears; a stereo presentation layer.
    const carrier = sonicTheme.rootHz * 4;
    voice(carrier - sonicTheme.binauralDifferenceHz / 2, 0.014, -1);
    voice(carrier + sonicTheme.binauralDifferenceHz / 2, 0.014, 1);

    this.effects = context.createGain();
    this.effects.gain.value = 1;
    this.effects.connect(dry);
    this.effects.connect(room);
    window.setInterval(() => {
      if (context.state !== 'running' || !this.enabled) return;
      const phraseLength = 60 / sonicTheme.bpm * 16;
      while (this.epoch + this.nextPhrase * phraseLength < context.currentTime + 2) {
        const at = Math.max(context.currentTime, this.epoch + this.nextPhrase * phraseLength);
        const chord = harmony[this.nextPhrase % harmony.length];
        this.pads.forEach((oscillator, index) => oscillator.frequency.setTargetAtTime(sonicTheme.rootHz * 2 * chord[index], at, 2.5));
        this.nextPhrase++;
      }
    }, 400);
  }

  async start() {
    window.clearTimeout(this.fadeTimer);
    if (!this.context) this.build();
    await this.context!.resume();
    if (this.context!.state !== 'running') throw new Error('Audio needs a visitor gesture.');
    this.enabled = true;
    this.applyVolume(1.4);
    this.draw();
  }

  stop() {
    this.enabled = false;
    const context = this.context;
    if (context && this.master) {
      this.master.gain.cancelScheduledValues(context.currentTime);
      this.master.gain.setTargetAtTime(0, context.currentTime, 0.06);
      this.fadeTimer = window.setTimeout(() => { void context.suspend(); }, 350);
    }
    cancelAnimationFrame(this.frame);
    this.clearVisuals();
  }

  private applyVolume(fade = 0.1) {
    if (this.context && this.master) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(this.enabled ? this.volume * 0.45 : 0, this.context.currentTime, fade);
    }
  }

  async visibility(hidden: boolean) {
    if (!this.context || !this.enabled) return;
    if (hidden) {
      cancelAnimationFrame(this.frame);
      await this.context.suspend();
    } else {
      await this.context.resume();
      this.draw();
    }
  }

  cue(kind: Cue) {
    const context = this.context;
    if (!context || !this.effects || !this.enabled || context.state !== 'running' || this.volume === 0) return;
    const now = context.currentTime;
    if (now - this.lastCue < 0.18) return;
    this.lastCue = now;
    const beat = 60 / sonicTheme.bpm;
    const nextEighth = this.epoch + Math.ceil((now - this.epoch) / (beat / 2)) * (beat / 2);
    const notes = kind === 'contact' ? [2, 2.378414, 2.996614] : kind === 'close' ? [1.498307, 1] : kind === 'enter' ? [1, 1.498307, 2] : [2];
    notes.forEach((ratio, index) => {
      // Immediate contact first; the following tones join the shared grid.
      const at = index === 0 ? now : nextEighth + (index - 1) * beat / 2;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = sonicTheme.rootHz * ratio;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.035 / (index + 1), at + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
      oscillator.connect(gain).connect(this.effects!);
      oscillator.start(at);
      oscillator.stop(at + 1.7);
      oscillator.addEventListener('ended', () => { oscillator.disconnect(); gain.disconnect(); }, { once: true });
    });
  }

  private draw = () => {
    cancelAnimationFrame(this.frame);
    const context = this.context;
    if (!context || !this.enabled || context.state !== 'running') return;
    if (!this.motion.matches) {
      const timestamp = context.getOutputTimestamp?.();
      const outputTime = timestamp?.performanceTime && typeof timestamp.contextTime === 'number'
        ? timestamp.contextTime + (performance.now() - timestamp.performanceTime) / 1000
        : Math.max(0, context.currentTime - context.baseLatency - (context.outputLatency || 0));
      const time = Math.max(0, outputTime - this.epoch + sonicTheme.visualOffsetMs / 1000);
      const breath = (1 + Math.sin(time * sonicTheme.bpm / 60 / 8 * Math.PI * 2)) / 2;
      document.documentElement.style.setProperty('--music-breath', breath.toFixed(4));
      document.documentElement.dataset.soundActive = 'true';
    }
    this.frame = requestAnimationFrame(this.draw);
  };

  private clearVisuals() {
    document.documentElement.style.removeProperty('--music-breath');
    delete document.documentElement.dataset.soundActive;
  }
}
