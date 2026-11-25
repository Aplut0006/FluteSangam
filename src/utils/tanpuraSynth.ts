// Studio-Recorded Acoustic 4-String Tanpura Engine
// Uses real recorded acoustic Tanpura string samples (fs_string_sa.wav, fs_string_pa.wav, fs_string_ni.wav, fs_string_kharaj.wav)
// with mobile-safe AudioContext unlocking (iOS Safari, iOS Silent-Switch playback routing, Android Chrome),
// traditional Indian Tanpura cadence ([1200, 700, 700, 1100] ms), and full polyphonic ring-out.

export type FirstStringTuning = 'Pa' | 'Ma' | 'Ni' | 'Sa';
export type OctaveStyle = 'low' | 'medium'; // 'low' = Standard Concert Drone (C3-B3), 'medium' = Higher Register
export type TanpuraToneStyle = 'miraj' | 'tanjore' | 'meditative';

export interface TanpuraConfig {
  rootSa: string; // 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  octave: OctaveStyle;
  firstString: FirstStringTuning;
  tempoBpm: number; // 40 - 80 BPM (60 BPM = 1.0x reference cadence)
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

// Reference frequency of the recorded C#3 Tanpura samples (A4 = 440 Hz)
const SAMPLE_BASE_CS3_HZ = 138.5913;

const SAMPLE_FILES = {
  sa: '/audio/tanpura/fs_string_sa.wav?v=2',
  pa: '/audio/tanpura/fs_string_pa.wav?v=2',
  ni: '/audio/tanpura/fs_string_ni.wav?v=2',
  kharaj: '/audio/tanpura/fs_string_kharaj.wav?v=2'
} as const;

type SampleKey = keyof typeof SAMPLE_FILES;

// Minimal valid 44-byte + 2-sample silent WAV data URI used to unlock iOS Media/Playback channel
// so Web Audio can be heard on iPhones even when the physical Silent/Ringer switch is on.
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// Traditional 4-string configuration
const STRING_DEFINITIONS: Array<{
  id: string;
  role: 'first' | 'sa1' | 'sa2' | 'kharaj';
  pan: number;
  baseVolume: number;
}> = [
  { id: 'S1', role: 'first', pan: -0.06, baseVolume: 1.0 },
  { id: 'S2', role: 'sa1', pan: 0.04, baseVolume: 1.0 },
  { id: 'S3', role: 'sa2', pan: -0.03, baseVolume: 1.0 },
  { id: 'S4', role: 'kharaj', pan: 0.06, baseVolume: 0.68 }
];

export function calculateSaFrequency(
  rootSa: string,
  octave: OctaveStyle,
  fineTuneCents = 0,
  concertPitchHz = 440
): number {
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

function decodeAudioBufferSafe(ctx: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  // Always clone the ArrayBuffer so retries never fail on a detached buffer
  const copy = arrayBuffer.slice(0);
  return new Promise<AudioBuffer>((resolve, reject) => {
    try {
      const maybePromise = ctx.decodeAudioData(
        copy,
        (decoded) => resolve(decoded),
        (err) => reject(err || new Error('decodeAudioData failed'))
      );
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(resolve, reject);
      }
    } catch (err) {
      reject(err);
    }
  });
}

export class TanpuraEngine {
  private ctx: AudioContext | null = null;
  private unlockAudioEl: HTMLAudioElement | null = null;
  private isPlaying = false;
  private playSessionId = 0;
  private sequenceTimer: number | null = null;
  private fadeRestoreTimer: number | null = null;
  private currentStringIndex = 0;

  // Store raw WAV bytes fetched before user gesture (no AudioContext created on mount!)
  private rawBuffers: Partial<Record<SampleKey, ArrayBuffer>> = {};
  private rawFetchPromise: Promise<void> | null = null;

  // Decoded AudioBuffers bound to the active AudioContext
  private buffers: Partial<Record<SampleKey, AudioBuffer>> = {};
  private decodePromise: Promise<boolean> | null = null;

  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;
  private brillianceFilter: BiquadFilterNode | null = null;
  private stringPanners: Array<StereoPannerNode | GainNode | null> = [null, null, null, null];
  private activeSources = new Set<AudioScheduledSourceNode>();

  private config: TanpuraConfig;
  private onPluckCallback?: (event: StringPluckEvent) => void;

  constructor(initialConfig: Partial<TanpuraConfig> = {}) {
    this.config = {
      rootSa: 'C',
      octave: 'low',
      firstString: 'Pa',
      tempoBpm: 60,
      jawariBrilliance: 0.85,
      toneStyle: 'miraj',
      fineTuneCents: 0,
      concertPitchHz: 440,
      masterVolume: 0.85,
      ...initialConfig
    };

    // Only pre-fetch raw WAV bytes on mount; NEVER instantiate AudioContext before a user gesture
    if (typeof window !== 'undefined') {
      this.prefetchRawSamples();
    }
  }

  public setConfig(newConfig: Partial<TanpuraConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      if (this.isPlaying) {
        this.masterGain.gain.setTargetAtTime(this.config.masterVolume * 1.05, now, 0.04);
      }
      this.updateToneFilters(now);
    }
  }

  public getConfig(): TanpuraConfig {
    return { ...this.config };
  }

  public setOnPluckCallback(cb: (event: StringPluckEvent) => void) {
    this.onPluckCallback = cb;
  }

  /**
   * Unlocks smartphone audio channels synchronously inside a user tap/click gesture.
   * Handles iOS 17+ audioSession, iOS hardware Silent-switch routing, and suspended/interrupted AudioContext.
   */
  private unlockMobileAudioSync(): AudioContext {
    // 1. iOS 17+ Safari AudioSession API: route through Media/Playback instead of Ringer/Ambient
    try {
      const nav = navigator as unknown as { audioSession?: { type: string } };
      if (nav && nav.audioSession && nav.audioSession.type !== 'playback') {
        nav.audioSession.type = 'playback';
      }
    } catch {
      // Ignore if unsupported
    }

    // 2. HTML5 <audio> silent WAV play inside gesture (switches iOS < 17 out of Ambient/Silent mute)
    try {
      if (typeof Audio !== 'undefined') {
        if (!this.unlockAudioEl) {
          const el = new Audio(SILENT_WAV_DATA_URI);
          el.setAttribute('playsinline', 'true');
          (el as unknown as { playsInline?: boolean }).playsInline = true;
          el.preload = 'auto';
          this.unlockAudioEl = el;
        }
        this.unlockAudioEl.currentTime = 0;
        const playPromise = this.unlockAudioEl.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }
    } catch {
      // Ignore if blocked
    }

    // 3. Create or resume AudioContext synchronously inside user gesture
    const ctx = this.getContext();

    // 4. Play a 1-sample silent buffer synchronously to hardware-unlock Web Audio on iOS/Android
    try {
      const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate || 44100);
      const silentSource = ctx.createBufferSource();
      silentSource.buffer = silentBuffer;
      silentSource.connect(ctx.destination);
      silentSource.start(0);
    } catch {
      // Ignore
    }

    return ctx;
  }

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      // Reset decoded buffers & audio graph if context had to be recreated
      this.buffers = {};
      this.masterGain = null;
      this.compressor = null;
      this.warmthFilter = null;
      this.brillianceFilter = null;
      this.stringPanners = [null, null, null, null];
    }

    // Handle BOTH 'suspended' and Safari-specific 'interrupted' states
    if (this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private ensureAudioGraph() {
    const ctx = this.getContext();
    if (this.masterGain && this.masterGain.context === ctx) {
      return;
    }

    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.config.masterVolume * 1.05;

    // Gentle wooden Toomba body warmth filter
    this.warmthFilter = ctx.createBiquadFilter();
    this.warmthFilter.type = 'lowshelf';
    this.warmthFilter.frequency.value = 240;

    // High-shelf Jawari brilliance filter
    this.brillianceFilter = ctx.createBiquadFilter();
    this.brillianceFilter.type = 'highshelf';
    this.brillianceFilter.frequency.value = 1800;

    this.updateToneFilters(ctx.currentTime);

    this.warmthFilter.connect(this.brillianceFilter);
    this.brillianceFilter.connect(this.masterGain);

    // Gentle limiter/compressor keeps audio clear on small smartphone speakers without clipping
    if (typeof ctx.createDynamicsCompressor === 'function') {
      this.compressor = ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -10;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 3;
      this.compressor.attack.value = 0.005;
      this.compressor.release.value = 0.15;
      this.masterGain.connect(this.compressor);
      this.compressor.connect(ctx.destination);
    } else {
      this.masterGain.connect(ctx.destination);
    }

    // Initialize stereo panners for the 4 strings
    for (let i = 0; i < 4; i++) {
      const def = STRING_DEFINITIONS[i];
      if (typeof ctx.createStereoPanner === 'function') {
        try {
          const panner = ctx.createStereoPanner();
          panner.pan.value = def.pan;
          panner.connect(this.warmthFilter);
          this.stringPanners[i] = panner;
          continue;
        } catch {
          // Fallback to GainNode below
        }
      }
      const gain = ctx.createGain();
      gain.connect(this.warmthFilter);
      this.stringPanners[i] = gain;
    }
  }

  private updateToneFilters(now: number) {
    if (!this.warmthFilter || !this.brillianceFilter) return;

    const jawari = Math.max(0, Math.min(1, this.config.jawariBrilliance));
    const style = this.config.toneStyle;

    const warmthDb = style === 'meditative' ? 2.5 : style === 'tanjore' ? 1.8 : 0.8;
    const styleBrillianceOffset = style === 'meditative' ? -4.0 : style === 'tanjore' ? -1.2 : 0.0;
    const brillianceDb = (jawari - 0.85) * 6.0 + styleBrillianceOffset;

    this.warmthFilter.gain.setTargetAtTime(warmthDb, now, 0.08);
    this.brillianceFilter.gain.setTargetAtTime(brillianceDb, now, 0.08);
  }

  private get samplesLoaded(): boolean {
    return !!(this.buffers.sa && this.buffers.pa && this.buffers.ni && this.buffers.kharaj);
  }

  private prefetchRawSamples(): Promise<void> {
    const keys: SampleKey[] = ['sa', 'pa', 'ni', 'kharaj'];
    const allRawLoaded = keys.every((k) => !!this.rawBuffers[k]);
    if (allRawLoaded) {
      return Promise.resolve();
    }
    if (this.rawFetchPromise) {
      return this.rawFetchPromise;
    }

    this.rawFetchPromise = Promise.all(
      keys.map(async (key) => {
        if (this.rawBuffers[key]) return;
        try {
          const response = await fetch(SAMPLE_FILES[key]);
          if (!response.ok) return;
          this.rawBuffers[key] = await response.arrayBuffer();
        } catch {
          // Will retry on start() if network was briefly unavailable
        }
      })
    ).then(() => {
      this.rawFetchPromise = null;
    });

    return this.rawFetchPromise;
  }

  private async ensureSamplesDecoded(ctx: AudioContext): Promise<boolean> {
    if (this.samplesLoaded) {
      return true;
    }
    if (this.decodePromise) {
      return this.decodePromise;
    }

    const keys: SampleKey[] = ['sa', 'pa', 'ni', 'kharaj'];
    this.decodePromise = (async () => {
      await this.prefetchRawSamples();

      await Promise.all(
        keys.map(async (key) => {
          if (this.buffers[key]) return;
          try {
            // Retry fetch if initial prefetch missed this sample
            if (!this.rawBuffers[key]) {
              const res = await fetch(SAMPLE_FILES[key]);
              if (res.ok) {
                this.rawBuffers[key] = await res.arrayBuffer();
              }
            }
            const raw = this.rawBuffers[key];
            if (!raw) return;
            const decoded = await decodeAudioBufferSafe(ctx, raw);
            this.buffers[key] = decoded;
          } catch {
            // Fallback synth will handle any undecodable sample gracefully
          }
        })
      );

      this.decodePromise = null;
      return this.samplesLoaded;
    })();

    return this.decodePromise;
  }

  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Returns the sample key and playbackRate for a given string index (0..3)
   */
  private getStringSampleAndRate(stringIndex: number): {
    sampleKey: SampleKey;
    playbackRate: number;
    stringLabel: string;
    displayFreq: number;
  } {
    const baseSaFreq = calculateSaFrequency(
      this.config.rootSa,
      this.config.octave,
      this.config.fineTuneCents,
      this.config.concertPitchHz
    );

    // Ratio relative to the recorded C#3 (138.59 Hz) Tanpura sample set
    let rate = baseSaFreq / SAMPLE_BASE_CS3_HZ;
    let sampleKey: SampleKey = 'sa';
    let stringLabel = "Sa'";
    let displayFreq = baseSaFreq;

    if (stringIndex === 0) {
      // First String: Pa / Ma / Ni / Sa
      if (this.config.firstString === 'Pa') {
        sampleKey = 'pa';
        stringLabel = 'Pa';
        displayFreq = baseSaFreq * 0.75;
      } else if (this.config.firstString === 'Ma') {
        // Uses the Jodi Sa sample pitched down 7 semitones to Mandra Ma (4/3 above Kharaj Sa)
        sampleKey = 'sa';
        rate *= Math.pow(2, -7 / 12);
        stringLabel = 'Ma';
        displayFreq = baseSaFreq * (2 / 3);
      } else if (this.config.firstString === 'Ni') {
        sampleKey = 'ni';
        stringLabel = 'Ni';
        displayFreq = baseSaFreq * (15 / 16);
      } else {
        sampleKey = 'sa';
        stringLabel = 'Sa';
        displayFreq = baseSaFreq;
      }
    } else if (stringIndex === 1) {
      sampleKey = 'sa';
      stringLabel = "Sa' (1)";
      displayFreq = baseSaFreq;
    } else if (stringIndex === 2) {
      sampleKey = 'sa';
      stringLabel = "Sa' (2)";
      displayFreq = baseSaFreq;
    } else {
      sampleKey = 'kharaj';
      stringLabel = 'Sa (Kharaj)';
      displayFreq = baseSaFreq * 0.5;
    }

    // Subtle ±1.8 cents organic humanization between plucks
    rate *= Math.pow(2, this.randomBetween(-1.8, 1.8) / 1200);

    return {
      sampleKey,
      playbackRate: rate,
      stringLabel,
      displayFreq
    };
  }

  /**
   * Computes the exact inter-string gap (in ms) for string `stringIndex`
   * using the authentic [1200, 700, 700, 1100] ms Tanpura cadence scaled by pitch and tempo.
   */
  private getStepDelayMs(stringIndex: number): number {
    const noteIndex = Math.max(0, NOTE_NAMES.indexOf(this.config.rootSa as typeof NOTE_NAMES[number]));
    const pitchScale = noteIndex / 19;

    // Base cadence: S1 (Pa/Ma/Ni) = 1200ms, S2 (Jodi 1) = 700ms, S3 (Jodi 2) = 700ms, S4 (Kharaj) = 1100ms
    const baseGaps = [
      Math.round(1200 - 200 * pitchScale),
      Math.round(700 - 100 * pitchScale),
      Math.round(700 - 100 * pitchScale),
      Math.round(1100 - 200 * pitchScale)
    ];

    const octaveSpeed = this.config.octave === 'medium' ? 1.28 : 1.0;
    const tempoSpeed = Math.max(0.65, Math.min(1.5, this.config.tempoBpm / 60)) * octaveSpeed;
    const jitter = this.randomBetween(-12, 12);

    return Math.max(120, baseGaps[stringIndex] / tempoSpeed + jitter);
  }

  /**
   * Resilient synthesized tanpura fallback if a WAV sample cannot be loaded/decoded (e.g. offline)
   */
  private playSynthesizedFallback(
    ctx: AudioContext,
    targetNode: AudioNode,
    freq: number,
    baseVolume: number,
    now: number
  ) {
    const duration = 3.8;
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(baseVolume * 0.22, now + 0.08);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(2600, freq * 8), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(320, freq * 2.2), now + duration);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(targetNode);

    this.activeSources.add(osc1);
    this.activeSources.add(osc2);

    osc1.onended = () => {
      this.activeSources.delete(osc1);
      this.activeSources.delete(osc2);
      try {
        osc1.disconnect();
        osc2.disconnect();
        filter.disconnect();
        voiceGain.disconnect();
      } catch {
        // Ignore cleanup errors
      }
    };

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  private pluckString(stringIndex: number) {
    if (!this.isPlaying) return;
    this.ensureAudioGraph();
    const ctx = this.getContext();
    const targetNode = this.stringPanners[stringIndex];
    if (!targetNode) return;

    const { sampleKey, playbackRate, stringLabel, displayFreq } = this.getStringSampleAndRate(stringIndex);
    const buffer = this.buffers[sampleKey];
    const now = ctx.currentTime;
    const def = STRING_DEFINITIONS[stringIndex];

    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.setValueAtTime(playbackRate, now);

      const voiceGain = ctx.createGain();
      const peakGain = def.baseVolume * this.randomBetween(0.93, 1.0);
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.linearRampToValueAtTime(peakGain, now + 0.012);

      source.connect(voiceGain);
      voiceGain.connect(targetNode);

      this.activeSources.add(source);
      source.onended = () => {
        this.activeSources.delete(source);
        try {
          source.disconnect();
          voiceGain.disconnect();
        } catch {
          // Ignore cleanup errors
        }
      };

      // Let every string pluck ring out its full natural acoustic tail without cutting off previous cycles
      source.start(now);
    } else {
      // Never stay silent if a sample failed to fetch/decode on mobile network
      this.playSynthesizedFallback(ctx, targetNode, displayFreq, def.baseVolume, now);
    }

    if (this.onPluckCallback) {
      this.onPluckCallback({
        stringIndex,
        stringName: stringLabel,
        frequency: Math.round(displayFreq * 10) / 10,
        time: now
      });
    }
  }

  private scheduleNext = () => {
    if (!this.isPlaying) return;

    const idx = this.currentStringIndex;
    this.pluckString(idx);
    this.currentStringIndex = (this.currentStringIndex + 1) % 4;

    const delayMs = this.getStepDelayMs(idx);
    this.sequenceTimer = window.setTimeout(this.scheduleNext, delayMs);
  };

  public start() {
    if (this.isPlaying) return;

    // Synchronously unlock mobile audio & iOS Silent-switch channel inside the user tap gesture
    const ctx = this.unlockMobileAudioSync();
    this.ensureAudioGraph();

    if (this.sequenceTimer !== null) {
      window.clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    if (this.fadeRestoreTimer !== null) {
      window.clearTimeout(this.fadeRestoreTimer);
      this.fadeRestoreTimer = null;
      // Stop any lingering fading-out sources from an immediate prior stop()
      this.activeSources.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch {
          // Ignore
        }
      });
      this.activeSources.clear();
    }

    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.config.masterVolume * 1.05, ctx.currentTime);
    }

    this.isPlaying = true;
    this.currentStringIndex = 0;
    const currentSession = ++this.playSessionId;

    const resumePromise = ctx.state !== 'running' ? ctx.resume().catch(() => {}) : Promise.resolve();

    if (this.samplesLoaded && ctx.state === 'running') {
      this.scheduleNext();
    } else {
      Promise.all([resumePromise, this.ensureSamplesDecoded(ctx)]).then(() => {
        if (this.isPlaying && this.playSessionId === currentSession) {
          this.scheduleNext();
        }
      });
    }
  }

  public stop() {
    this.isPlaying = false;
    this.playSessionId++;

    if (this.sequenceTimer !== null) {
      window.clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      try {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
      } catch {
        // Ignore
      }

      if (this.fadeRestoreTimer !== null) {
        window.clearTimeout(this.fadeRestoreTimer);
      }
      this.fadeRestoreTimer = window.setTimeout(() => {
        this.activeSources.forEach((src) => {
          try {
            src.stop();
            src.disconnect();
          } catch {
            // Ignore
          }
        });
        this.activeSources.clear();
        if (this.masterGain && !this.isPlaying && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.config.masterVolume * 1.05, this.ctx.currentTime);
        }
        this.fadeRestoreTimer = null;
      }, 240);
    }
  }

  public resumeIfPlaying() {
    if (this.isPlaying && this.ctx && this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public destroy() {
    this.stop();
    if (this.fadeRestoreTimer !== null) {
      window.clearTimeout(this.fadeRestoreTimer);
      this.fadeRestoreTimer = null;
    }
    this.activeSources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Ignore
      }
    });
    this.activeSources.clear();
    this.stringPanners = [null, null, null, null];
    this.masterGain = null;
    this.compressor = null;
    this.warmthFilter = null;
    this.brillianceFilter = null;
    this.unlockAudioEl = null;
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // Ignore
      }
    }
    this.ctx = null;
  }
}
