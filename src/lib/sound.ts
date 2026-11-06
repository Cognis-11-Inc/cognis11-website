import { sonicTheme, beatSeconds, cycleSeconds, scorePlan, createSoundscape, scheduleScoreEvent, scheduleCue, type ScoreEvent, type Soundscape } from './score';
export { sonicTheme } from './score';
type Cue = Parameters<typeof scheduleCue>[1];

export class SiteSound {
  private context?: AudioContext;
  private master?: GainNode;
  private space?: Soundscape;
  private epoch = 0;
  private eventIndex = 0;
  private cycle = 0;
  private scheduler = 0;
  private frame = 0;
  private fadeTimer = 0;
  private lastCue = -Infinity;
  private enabled = false;
  private visualEvents: { at: number; kind: ScoreEvent['kind'] }[] = [];
  private lastImpact = -Infinity;
  private motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  constructor() { this.motion.addEventListener('change', () => this.clearVisuals()); }

  private build() {
    const context = this.context = new AudioContext({ latencyHint: 'playback' });
    this.epoch = context.currentTime + .05;
    const master = this.master = context.createGain(); master.gain.value = 0;
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -18; limiter.knee.value = 15; limiter.ratio.value = 5;
    limiter.attack.value = .015; limiter.release.value = .5;
    master.connect(limiter).connect(context.destination);
    this.space = createSoundscape(context, master, this.epoch);
  }

  private schedule = () => {
    const context = this.context;
    if (!context || !this.space || !this.enabled || context.state !== 'running') return;
    const now = context.currentTime;
    // A stalled timer never dumps missed percussion into the present.
    const currentCycle = Math.max(0, Math.floor((now - this.epoch) / cycleSeconds));
    if (this.cycle < currentCycle) { this.cycle = currentCycle; this.eventIndex = 0; }
    while (true) {
      const event = scorePlan[this.eventIndex];
      const at = this.epoch + this.cycle * cycleSeconds + event.beat * beatSeconds;
      if (at >= now + 1.5) break;
      if (at >= now - .08 || event.kind === 'harmony') {
        scheduleScoreEvent(this.space, event, Math.max(now, at));
        if (event.kind === 'bass' || event.kind === 'snare') this.visualEvents.push({ at, kind: event.kind });
      }
      this.eventIndex++;
      if (this.eventIndex === scorePlan.length) { this.eventIndex = 0; this.cycle++; }
    }
  };

  async start() {
    window.clearTimeout(this.fadeTimer);
    if (!this.context) this.build();
    await this.context!.resume();
    if (this.context!.state !== 'running') throw new Error('Audio needs a visitor gesture.');
    this.enabled = true;
    const context = this.context!;
    this.master!.gain.cancelScheduledValues(context.currentTime);
    this.master!.gain.setTargetAtTime(sonicTheme.defaultVolume * sonicTheme.masterGainScale, context.currentTime, 1.4);
    window.clearInterval(this.scheduler);
    this.schedule(); this.scheduler = window.setInterval(this.schedule, 200);
    this.draw();
  }

  stop() {
    this.enabled = false;
    window.clearInterval(this.scheduler);
    const context = this.context;
    if (context && this.master) {
      this.master.gain.cancelScheduledValues(context.currentTime);
      this.master.gain.setTargetAtTime(0, context.currentTime, .06);
      this.fadeTimer = window.setTimeout(() => { void context.suspend(); }, 350);
    }
    cancelAnimationFrame(this.frame); this.clearVisuals();
  }

  async visibility(hidden: boolean) {
    if (!this.context || !this.enabled) return;
    if (hidden) {
      cancelAnimationFrame(this.frame); await this.context.suspend();
    } else {
      await this.context.resume(); this.schedule(); this.draw();
    }
  }

  cue(kind: Cue) {
    const context = this.context;
    if (!context || !this.space || !this.enabled || context.state !== 'running') return;
    const now = context.currentTime;
    if (now - this.lastCue < .18) return;
    this.lastCue = now;
    scheduleCue(this.space, kind, now, this.epoch);
  }

  private draw = () => {
    cancelAnimationFrame(this.frame);
    const context = this.context;
    if (!context || !this.enabled || context.state !== 'running') return;
    const timestamp = context.getOutputTimestamp?.();
    const outputTime = timestamp?.performanceTime && typeof timestamp.contextTime === 'number'
      ? timestamp.contextTime + (performance.now() - timestamp.performanceTime) / 1000
      : Math.max(0, context.currentTime - context.baseLatency - (context.outputLatency || 0));
    while (this.visualEvents.length && this.visualEvents[0].at <= outputTime) {
      const event = this.visualEvents.shift()!;
      if (event.kind === 'bass') this.lastImpact = event.at;
      if (!this.motion.matches && outputTime - event.at < .25) document.dispatchEvent(new CustomEvent('cognis:score-event', { detail: { kind: event.kind } }));
    }
    if (!this.motion.matches) {
      const time = Math.max(0, outputTime - this.epoch + sonicTheme.visualOffsetMs / 1000);
      const breath = (1 + Math.sin(time * sonicTheme.bpm / 60 / 8 * Math.PI * 2)) / 2;
      document.documentElement.style.setProperty('--music-breath', breath.toFixed(4));
      document.documentElement.style.setProperty('--music-impact', Math.exp(-Math.max(0, outputTime - this.lastImpact) / 1.4).toFixed(4));
      document.documentElement.dataset.soundActive = 'true';
    }
    this.frame = requestAnimationFrame(this.draw);
  };

  private clearVisuals() {
    document.documentElement.style.removeProperty('--music-breath');
    document.documentElement.style.removeProperty('--music-impact');
    delete document.documentElement.dataset.soundActive;
  }
}
