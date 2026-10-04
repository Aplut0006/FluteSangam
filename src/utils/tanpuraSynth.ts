// High-Fidelity Physical Model of 4-String Indian Tanpura
// Simulates continuous circular plucking where each string is plucked in sequence,
// rings out for 14-18 seconds, and layers in the air without gaps, pauses, or cuts.

export type FirstStringTuning = 'Pa' | 'Ma' | 'Ni' | 'Sa';
export type OctaveStyle = 'low' | 'medium'; // 'low' = Male/Deep Bass (C3-B3), 'medium' = Female/Standard Flute (C4-B4)
export type TanpuraToneStyle = 'miraj' | 'tanjore' | 'meditative';

export interface TanpuraConfig {
  rootSa: string; // 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  octave: OctaveStyle;
  firstString: FirstStringTuning;
  tempoBpm: number; // 40 - 75 BPM (pluck interval: ~0.8s to ~1.5s)
  jawariBrilliance: number; // 0.0 - 1.0
  toneStyle: TanpuraToneStyle; // 'miraj' | 'tanjore' | 'meditative'
  fineTuneCents: number; // -50 to +50 cents
  concertPitchHz: number; // 432, 440, 444 Hz
  masterVolume: number; // 0.0 - 1.0
}

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const SEMITONE_OFFSETS: Record<string, number> = {
  'C': -9, 'C#': -8, 'Db': -8, 'D': -7, 'D#': -6, 'Eb': -6,
  'E': -5, 'F': -4, 'F#': -3, 'Gb': -3, 'G': -2, 'G#': -1,
  'Ab': -1, 'A': 0, 'A#': 1, 'Bb': 1, 'B': 2
};

export function calculateSaFrequency(rootSa: string, octave: OctaveStyle, fineTuneCents = 0, concertPitchHz = 440): number {
  const semitonesFromA4 = SEMITONE_OFFSETS[rootSa] ?? -9;
  const standardFreqC4 = concertPitchHz * Math.pow(2, semitonesFromA4 / 12);
  const octaveMultiplier = octave === 'low' ? 0.5 : 1.0;
  const centsMultiplier = Math.pow(2, fineTuneCents / 1200);
  return standardFreqC4 * octaveMultiplier * centsMultiplier;
}

export interface StringPluckEvent {
  stringIndex: number; // 0: First String (Pa/Ma/Ni/Sa), 1: Jodi 1, 2: Jodi 2, 3: Kharaj
  stringName: string;
  frequency: number;
  time: number;
}

export class TanpuraEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentStringIndex = 0;
  private nextPluckTime = 0;
  private masterGain: GainNode | null = null;
  private reverbConvolver: ConvolverNode | null = null;
  private bodyFilterLow: BiquadFilterNode | null = null;
  private bodyFilterMid: BiquadFilterNode | null = null;
  private config: TanpuraConfig;
  private onPluckCallback?: (event: StringPluckEvent) => void;

  constructor(initialConfig: Partial<TanpuraConfig> = {}) {
    this.config = {
      rootSa: 'C',
      octave: 'low',
      firstString: 'Pa',
      tempoBpm: 60, // Standard classical riyaz tempo (1.0s per pluck)
      jawariBrilliance: 0.85,
      toneStyle: 'miraj',
      fineTuneCents: 0,
      concertPitchHz: 440,
      masterVolume: 0.85,
      ...initialConfig
    };
  }

  public setConfig(newConfig: Partial<TanpuraConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.masterGain && this.ctx && newConfig.masterVolume !== undefined) {
      this.masterGain.gain.setTargetAtTime(newConfig.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getConfig(): TanpuraConfig {
    return { ...this.config };
  }

  public setOnPluckCallback(cb: (event: StringPluckEvent) => void) {
    this.onPluckCallback = cb;
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.config.masterVolume, this.ctx.currentTime);

      // Acoustic Chamber Body Filters (Mimicking the hollow dried gourd - Toomba)
      // 1. Low body resonance (135 Hz)
      this.bodyFilterLow = this.ctx.createBiquadFilter();
      this.bodyFilterLow.type = 'peaking';
      this.bodyFilterLow.frequency.value = 135;
      this.bodyFilterLow.Q.value = 2.0;
      this.bodyFilterLow.gain.value = 4.0;

      // 2. Mid wood chamber resonance (520 Hz)
      this.bodyFilterMid = this.ctx.createBiquadFilter();
      this.bodyFilterMid.type = 'peaking';
      this.bodyFilterMid.frequency.value = 520;
      this.bodyFilterMid.Q.value = 1.6;
      this.bodyFilterMid.gain.value = 3.0;

      // 3. Acoustic Wooden Chamber Reverb (Lush, continuous 3.2-second acoustic hall sustain)
      this.reverbConvolver = this.createAcousticRoomReverb(this.ctx);

      const reverbGain = this.ctx.createGain();
      reverbGain.gain.value = 0.35; // Rich acoustic resonance wash

      const dryGain = this.ctx.createGain();
      dryGain.gain.value = 0.88;

      // Routing: MasterGain -> Body Filters -> (Dry + Reverb) -> Destination
      this.masterGain.connect(this.bodyFilterLow);
      this.bodyFilterLow.connect(this.bodyFilterMid);
      
      this.bodyFilterMid.connect(dryGain);
      dryGain.connect(this.ctx.destination);

      if (this.reverbConvolver) {
        this.bodyFilterMid.connect(this.reverbConvolver);
        this.reverbConvolver.connect(reverbGain);
        reverbGain.connect(this.ctx.destination);
      }
    }
  }

  // Generates a lush acoustic wooden hall impulse response for Tanpura resonance
  private createAcousticRoomReverb(ctx: AudioContext): ConvolverNode {
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * 3.2); // 3.2 second decay
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    const decay = 1.9;
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      const env = Math.exp(-t * decay);
      left[i] = (Math.random() * 2 - 1) * env * (0.85 + 0.15 * Math.sin(t * 26));
      right[i] = (Math.random() * 2 - 1) * env * (0.85 + 0.15 * Math.cos(t * 26));
    }

    convolver.buffer = impulse;
    return convolver;
  }

  public start() {
    if (this.isPlaying) return;
    this.initAudio();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentStringIndex = 0;
    this.nextPluckTime = this.ctx.currentTime + 0.05;

    this.schedulerLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Continuous, seamless circular lookahead scheduler.
   * Plucks string 1, 2, 3, 4, 1, 2, 3, 4 in an endless unbroken chain.
   * Every single interval is EXACTLY the same (60 / tempoBpm), with NO PAUSE or break.
   */
  private schedulerLoop = () => {
    if (!this.isPlaying || !this.ctx) return;

    const scheduleAheadTime = 0.45; // Look ahead 450ms
    const interval = 60 / this.config.tempoBpm; // Exactly 1.25s at 48 BPM

    while (this.nextPluckTime < this.ctx.currentTime + scheduleAheadTime) {
      this.schedulePluck(this.currentStringIndex, this.nextPluckTime);
      
      // Step to the next string in the unbroken chain: 0 -> 1 -> 2 -> 3 -> 0 -> 1 -> 2 -> 3
      this.nextPluckTime += interval;
      this.currentStringIndex = (this.currentStringIndex + 1) % 4;
    }

    this.timerId = window.setTimeout(this.schedulerLoop, 35);
  };

  private schedulePluck(stringIndex: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    const baseSaFreq = calculateSaFrequency(
      this.config.rootSa, 
      this.config.octave, 
      this.config.fineTuneCents, 
      this.config.concertPitchHz
    );

    let stringFreq = baseSaFreq;
    let stringLabel = "Sa'";
    let panPosition = 0;
    let stringRole: 'pa' | 'jodi1' | 'jodi2' | 'kharaj' = 'jodi1';

    switch (stringIndex) {
      case 0:
        // First String: Pa / Ma / Ni / Sa
        if (this.config.firstString === 'Pa') {
          stringFreq = baseSaFreq * 0.75;
          stringLabel = 'Pa';
        } else if (this.config.firstString === 'Ma') {
          stringFreq = baseSaFreq * (2 / 3);
          stringLabel = 'Ma';
        } else if (this.config.firstString === 'Ni') {
          stringFreq = baseSaFreq * (15 / 16);
          stringLabel = 'Ni';
        } else {
          stringFreq = baseSaFreq;
          stringLabel = 'Sa';
        }
        stringRole = 'pa';
        panPosition = -0.32; // Left side
        break;

      case 1:
        // Jodi 1: Middle Sa
        stringFreq = baseSaFreq;
        stringLabel = "Sa' (1)";
        stringRole = 'jodi1';
        panPosition = -0.06;
        break;

      case 2:
        // Jodi 2: Middle Sa with delicate micro-detune (+0.38 Hz) for shimmering acoustic chorus beating
        stringFreq = baseSaFreq * 1.0028;
        stringLabel = "Sa' (2)";
        stringRole = 'jodi2';
        panPosition = 0.06;
        break;

      case 3:
        // Kharaj: Mandra Sa (Octave below baseSa) - Deep brass string
        stringFreq = baseSaFreq * 0.5;
        stringLabel = 'Sa (Kharaj)';
        stringRole = 'kharaj';
        panPosition = 0.32; // Right side
        break;
    }

    this.synthesizeAcousticTanpuraPluck(stringFreq, time, stringRole, panPosition);

    // Notify UI listener at scheduled pluck time
    const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
    window.setTimeout(() => {
      if (this.isPlaying && this.onPluckCallback) {
        this.onPluckCallback({
          stringIndex,
          stringName: stringLabel,
          frequency: Math.round(stringFreq * 10) / 10,
          time
        });
      }
    }, delayMs);
  }

  /**
   * Synthesizes an acoustic Tanpura string pluck with long (14 to 18 second) natural decay.
   * Strings NEVER cut off or stop vibrating when subsequent strings are plucked.
   * Plucking 1 -> 2 -> 3 -> 4 -> 1 causes all 4 strings to constantly overlap in the air.
   */
  private synthesizeAcousticTanpuraPluck(
    freq: number, 
    startTime: number, 
    role: 'pa' | 'jodi1' | 'jodi2' | 'kharaj', 
    pan: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Full natural ringing decay: 15.0 seconds for Jodi/First string; 18.0 seconds for Kharaj
    const duration = role === 'kharaj' ? 18.0 : 15.0;
    const jawariMultiplier = Math.max(0.25, Math.min(1.0, this.config.jawariBrilliance));

    const toneStyle = this.config.toneStyle;
    const highHarmonicDamping = toneStyle === 'meditative' ? 0.65 : toneStyle === 'tanjore' ? 0.95 : 1.18;
    const jawariSwellAmount = toneStyle === 'meditative' ? 0.55 : 1.05;

    // 1. Stereo Panner
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, startTime);
      panner.connect(this.masterGain);
    }
    const outputTarget: AudioNode = panner || this.masterGain;

    // 2. String Master Gain Envelope
    const stringGain = ctx.createGain();
    stringGain.gain.setValueAtTime(0.0001, startTime);
    // Tactile pluck attack (15ms)
    stringGain.gain.linearRampToValueAtTime(role === 'kharaj' ? 0.52 : 0.44, startTime + 0.015);
    // Jivari body bloom (reaches peak richness at 200ms)
    stringGain.gain.exponentialRampToValueAtTime(0.38, startTime + 0.20);
    // Extremely slow natural physical string decay across multiple cycles
    stringGain.gain.exponentialRampToValueAtTime(0.16, startTime + 4.0);
    stringGain.gain.exponentialRampToValueAtTime(0.05, startTime + 8.5);
    stringGain.gain.exponentialRampToValueAtTime(0.008, startTime + duration * 0.85);
    stringGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    stringGain.connect(outputTarget);

    // 3. Dynamic Jawari Resonant Formant Filter
    const jawariFilter = ctx.createBiquadFilter();
    jawariFilter.type = 'lowpass';
    jawariFilter.frequency.setValueAtTime(4200 * highHarmonicDamping, startTime);
    jawariFilter.frequency.exponentialRampToValueAtTime(1500 * highHarmonicDamping, startTime + duration * 0.7);
    jawariFilter.Q.setValueAtTime(2.0, startTime);
    jawariFilter.connect(stringGain);

    // 4. Multi-Harmonic Spectrum with Time-Varying Swells (Miraj Tanpura Overtone Structure)
    const harmonics = [
      { mult: 1, baseGain: 1.0, attackSec: 0.015, swellSec: 0.0, swellGain: 0.0, decaySec: duration },
      { mult: 2, baseGain: 0.76, attackSec: 0.02, swellSec: 0.14, swellGain: 0.18, decaySec: duration * 0.95 },
      { mult: 3, baseGain: 0.58 * jawariMultiplier, attackSec: 0.04, swellSec: 0.30, swellGain: 0.48 * jawariSwellAmount, decaySec: duration * 0.9 }, // Pancham overtone
      { mult: 4, baseGain: 0.42 * jawariMultiplier, attackSec: 0.05, swellSec: 0.35, swellGain: 0.32 * jawariSwellAmount, decaySec: duration * 0.85 },
      { mult: 5, baseGain: 0.36 * jawariMultiplier, attackSec: 0.06, swellSec: 0.48, swellGain: 0.44 * jawariSwellAmount, decaySec: duration * 0.8 }, // Sweet Gandhar bloom!
      { mult: 6, baseGain: 0.26 * jawariMultiplier, attackSec: 0.07, swellSec: 0.40, swellGain: 0.30 * jawariSwellAmount, decaySec: duration * 0.75 },
      { mult: 7, baseGain: 0.20 * jawariMultiplier, attackSec: 0.08, swellSec: 0.54, swellGain: 0.24 * jawariSwellAmount, decaySec: duration * 0.7 }, // Komal Ni
      { mult: 8, baseGain: 0.15 * jawariMultiplier, attackSec: 0.09, swellSec: 0.45, swellGain: 0.19 * jawariSwellAmount, decaySec: duration * 0.65 },
      { mult: 9, baseGain: 0.11 * jawariMultiplier, attackSec: 0.10, swellSec: 0.58, swellGain: 0.15 * jawariSwellAmount, decaySec: duration * 0.6 },
      { mult: 10, baseGain: 0.09 * jawariMultiplier, attackSec: 0.11, swellSec: 0.50, swellGain: 0.12 * jawariSwellAmount, decaySec: duration * 0.55 },
      { mult: 12, baseGain: 0.07 * jawariMultiplier, attackSec: 0.12, swellSec: 0.65, swellGain: 0.10 * jawariSwellAmount, decaySec: duration * 0.5 },
    ];

    harmonics.forEach((h, index) => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      
      const inharmonicity = 1 + 0.00010 * Math.pow(h.mult, 2);
      const targetFreq = freq * h.mult * inharmonicity;
      osc.frequency.setValueAtTime(targetFreq, startTime);

      // Micro-vibrato on upper harmonics for bridge buzz shimmer
      if (h.mult >= 3) {
        const buzzMod = ctx.createOscillator();
        const buzzGainNode = ctx.createGain();
        buzzMod.frequency.setValueAtTime(3.8 + (index * 0.5), startTime);
        buzzGainNode.gain.setValueAtTime(targetFreq * 0.0020 * jawariMultiplier, startTime);
        buzzMod.connect(buzzGainNode);
        buzzGainNode.connect(osc.frequency);
        buzzMod.start(startTime);
        buzzMod.stop(startTime + h.decaySec);
      }

      // Dynamic envelope with slow, continuous ringing tail
      hGain.gain.setValueAtTime(0.0001, startTime);
      hGain.gain.linearRampToValueAtTime(h.baseGain, startTime + h.attackSec);
      
      if (h.swellSec > 0 && h.swellGain > 0) {
        hGain.gain.linearRampToValueAtTime(h.baseGain + h.swellGain, startTime + h.swellSec);
      }
      
      hGain.gain.exponentialRampToValueAtTime(0.0001, startTime + h.decaySec);

      osc.connect(hGain);
      hGain.connect(jawariFilter);

      osc.start(startTime);
      osc.stop(startTime + h.decaySec + 0.1);
    });

    // 5. Tactile Pluck Transient
    this.synthesizePluckTransient(ctx, freq, startTime, role, jawariFilter);
  }

  private synthesizePluckTransient(
    ctx: AudioContext, 
    freq: number, 
    startTime: number, 
    role: 'pa' | 'jodi1' | 'jodi2' | 'kharaj', 
    targetNode: AudioNode
  ) {
    try {
      const bufferLength = Math.floor(ctx.sampleRate * 0.04);
      const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferLength; i++) {
        const t = i / ctx.sampleRate;
        const decay = Math.exp(-t * 200);
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(role === 'kharaj' ? 340 : freq * 2.6, startTime);
      filter.Q.setValueAtTime(2.2, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.10, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.036);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(targetNode);

      noiseSource.start(startTime);
    } catch {
      // Fallback
    }
  }

  public destroy() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // Ignore
      }
    }
    this.ctx = null;
    this.masterGain = null;
    this.reverbConvolver = null;
  }
}
