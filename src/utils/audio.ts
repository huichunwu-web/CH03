/**
 * Web Audio API synthesizer for interactive learning feedback.
 * Zero external audio assets needed - 100% reliable, low-latency, and clear.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check saved mute preference
    const saved = localStorage.getItem('chef_audio_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem('chef_audio_muted', String(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Crisp celebratory chime (Major chord arpeggio) when user answers correctly
   */
  public playCorrect(): void {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.5Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Gentle, non-punitive descending minor tone for incorrect responses
   */
  public playWrong(): void {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.exponentialRampToValueAtTime(174.61, now + 0.3); // F3

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Crisp UI interaction click
   */
  public playClick(): void {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Paper / Flashcard flip sound
   */
  public playFlip(): void {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Filtered noise swoosh
      const bufferSize = this.ctx.sampleRate * 0.06;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Exam finish fanfare
   */
  public playFanfare(): void {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
        { freq: 523.25, time: 0.14, dur: 0.12 }, // C5
        { freq: 523.25, time: 0.28, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.42, dur: 0.35 }, // E5
        { freq: 783.99, time: 0.8, dur: 0.2 },  // G5
        { freq: 1046.5, time: 1.05, dur: 0.55 }, // C6
      ];

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0, now + n.time);
        gain.gain.linearRampToValueAtTime(0.2, now + n.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch {
      // Audio playback failsafe
    }
  }
}

export const soundManager = new SoundManager();
