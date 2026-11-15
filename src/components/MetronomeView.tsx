import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import * as Tone from 'tone';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  Plus,
  Minus,
  Clock,
  Radio,
  Sliders,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Target,
  Activity,
  Hand,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';

interface MetronomeViewProps {
  onViewChange?: (view: AppView) => void;
  onBackToHomepage?: () => void;
}

export type BeatState = 'accent' | 'normal' | 'mute';

interface OptionalTaalPreset {
  id: string;
  label: string;
  beats: number;
  sublabel: string;
  defaultPattern: BeatState[];
  usage: string;
}

function createDefaultBeatPattern(count: number): BeatState[] {
  return Array.from({ length: count }, (_, idx) => (idx === 0 ? 'accent' : 'normal'));
}

// Optional Western Meters & Hindustani Taal Presets (all within 1 to 12 Beats)
const OPTIONAL_TAAL_PRESETS: OptionalTaalPreset[] = [
  {
    id: '2_4',
    label: '2/4 Meter',
    beats: 2,
    sublabel: '2 Beats',
    defaultPattern: ['accent', 'normal'],
    usage: 'Simple two-beat march pulse for basic ascending and descending scale drills.'
  },
  {
    id: '3_4',
    label: '3/4 Waltz / Tisra',
    beats: 3,
    sublabel: '3 Beats',
    defaultPattern: ['accent', 'normal', 'normal'],
    usage: 'Three-beat cycle ideal for 3-note triplet Alankars (Sa Re Ga, Re Ga Ma).'
  },
  {
    id: '4_4',
    label: '4/4 Standard',
    beats: 4,
    sublabel: '4 Beats',
    defaultPattern: ['accent', 'normal', 'normal', 'normal'],
    usage: 'Standard four-beat meter for beginner Sargam and 4-note Alankars (Sa Re Ga Ma).'
  },
  {
    id: 'dadra_6',
    label: 'Dadra Taal',
    beats: 6,
    sublabel: '6 Beats (3 + 3)',
    defaultPattern: ['accent', 'normal', 'normal', 'normal', 'normal', 'normal'],
    usage: 'Light classical Thumri, Bhajans, Pahadi folk melodies, and 6-beat phrases.'
  },
  {
    id: 'rupak_7',
    label: 'Rupak Taal',
    beats: 7,
    sublabel: '7 Beats (3 + 2 + 2)',
    defaultPattern: ['accent', 'normal', 'normal', 'accent', 'normal', 'accent', 'normal'],
    usage: 'Devotional compositions, Ghazals, and 7-beat classical Bansuri Gats.'
  },
  {
    id: 'keherwa_8',
    label: 'Keherwa Taal',
    beats: 8,
    sublabel: '8 Beats (4 + 4)',
    defaultPattern: ['accent', 'normal', 'normal', 'normal', 'accent', 'normal', 'normal', 'normal'],
    usage: 'Most popular 8-beat rhythm for Bollywood flute songs, folk tunes, and Bhajans.'
  },
  {
    id: 'jhaptal_10',
    label: 'Jhaptal',
    beats: 10,
    sublabel: '10 Beats (2 + 3 + 2 + 3)',
    defaultPattern: ['accent', 'normal', 'accent', 'normal', 'normal', 'normal', 'normal', 'accent', 'normal', 'normal'],
    usage: 'Medium-tempo (Madhya Laya) classical Bansuri compositions in Raga Yaman and Bhimpalasi.'
  },
  {
    id: 'ektaal_12',
    label: 'Ektaal',
    beats: 12,
    sublabel: '12 Beats (2+2+2+2+2+2)',
    defaultPattern: ['accent', 'normal', 'normal', 'normal', 'accent', 'normal', 'normal', 'normal', 'accent', 'normal', 'accent', 'normal'],
    usage: 'Classical 12-beat cycle for slow (Vilambit) and fast (Drut) Bansuri Gats.'
  },
  {
    id: 'teental_16',
    label: 'Teental (Tritaal)',
    beats: 16,
    sublabel: '16 Beats (4 + 4 + 4 + 4)',
    defaultPattern: ['accent', 'normal', 'normal', 'normal', 'accent', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'accent', 'normal', 'normal', 'normal'],
    usage: 'Most widely used 16-beat Hindustani classical cycle (Sam on 1, Taali on 5 & 13, Khali on 9) for Drut Gats, Alankars, and Bansuri solos.'
  }
];

interface SubdivisionOption {
  value: 1 | 2 | 3 | 4;
  name: string;
  indianName: string;
  desc: string;
}

const SUBDIVISIONS: SubdivisionOption[] = [
  { value: 1, name: '1x Normal', indianName: 'Barabar (1 Tick/Beat)', desc: 'Standard single tick per beat' },
  { value: 2, name: '2x Double', indianName: 'Dugun (2 Ticks/Beat)', desc: 'Two even ticks per beat' },
  { value: 3, name: '3x Triplet', indianName: 'Tigun (3 Ticks/Beat)', desc: 'Three triplet ticks per beat' },
  { value: 4, name: '4x Quadruple', indianName: 'Chaugun (4 Ticks/Beat)', desc: 'Four rapid ticks per beat' }
];

const FAQ_ITEMS = [
  {
    q: 'Why is practicing Bansuri with a metronome essential for beginners?',
    a: 'When playing the bamboo flute, beginners naturally slow down on difficult finger transitions (such as moving from Ma to Pa, or jumping between octaves) and speed up on easy descending runs. Practicing with a steady metronome tick exposes these micro-hesitations immediately, training your fingers and breath to move with smooth, even timing.'
  },
  {
    q: 'What BPM and Beat count should a beginner choose first?',
    a: 'Start with 4 Beats at 60 to 80 BPM. For Long Notes (Swar Sadhana), set the metronome to 60 BPM (1 tick = 1 second) and hold each note for 4, 8, or 12 beats on a single calm breath. For basic Sa Re Ga Ma Alankars, start around 75–85 BPM playing one note per tick.'
  },
  {
    q: 'How do the Beats from 1 to 12 work?',
    a: 'The metronome counts repeatedly from Beat 1 up to your selected Beat number (between 1 and 12). Beat 1 plays a higher-pitched accent tick so you can always hear the start of each cycle without having to look at the screen while holding your flute.'
  },
  {
    q: 'When should I use the optional Taal Cycles and Alankar Speed Subdivisions?',
    a: 'Once you are comfortable playing basic Sargam and Alankars at 1 note per beat, you can open the Optional Rhythm & Speed Settings to practice Dugun (2 notes per beat) or Chaugun (4 notes per beat), or match your beat cycle to classical Taals like Dadra (6 beats), Rupak (7 beats), Keherwa (8 beats), Jhaptal (10 beats), Ektaal (12 beats), or Teental (16 beats).'
  },
  {
    q: 'Why does my rhythm drift whenever I take a breath on the flute?',
    a: 'Breath-pause drift happens when a flutist pauses the beat to inhale and arrives late on the next note. When practicing with the metronome, take a quick breath at the very end of the last beat in a phrase so that your next note lands squarely on Beat 1.'
  }
];

function getTempoLabel(bpm: number): string {
  if (bpm < 60) return 'Slow Practice (Vilambit)';
  if (bpm < 90) return 'Calm Beginner Tempo';
  if (bpm < 130) return 'Medium Tempo (Madhya)';
  if (bpm < 170) return 'Fast Practice (Drut)';
  return 'High Speed Sprint (Ati-Drut)';
}

export const MetronomeView: React.FC<MetronomeViewProps> = ({ onViewChange, onBackToHomepage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState<number>(80);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [beatStates, setBeatStates] = useState<BeatState[]>(() => createDefaultBeatPattern(4));
  const [activeBeat, setActiveBeat] = useState<number>(0);

  // Optional advanced settings (collapsed by default for simplicity, unselected by default)
  const [showOptionalSettings, setShowOptionalSettings] = useState<boolean>(false);
  const [subdivision, setSubdivision] = useState<1 | 2 | 3 | 4 | null>(null);
  const [selectedTaalId, setSelectedTaalId] = useState<string | null>(null);

  // Volume & Session Timer
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Tap tempo history
  const tapTimesRef = useRef<number[]>([]);

  // Tone.js Metronome Synth (exact same tick sound as Alankar pages)
  const clickSynthRef = useRef<Tone.Synth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);
  const beatsPerMeasureRef = useRef<number>(beatsPerMeasure);
  const beatStatesRef = useRef<BeatState[]>(beatStates);
  const subdivisionRef = useRef<1 | 2 | 3 | 4>(subdivision ?? 1);
  const stepCounterRef = useRef<number>(0);

  useEffect(() => {
    beatsPerMeasureRef.current = beatsPerMeasure;
  }, [beatsPerMeasure]);

  useEffect(() => {
    beatStatesRef.current = beatStates;
  }, [beatStates]);

  useEffect(() => {
    subdivisionRef.current = subdivision ?? 1;
  }, [subdivision]);

  // Sync volume in dB to Tone.Synth
  useEffect(() => {
    if (clickSynthRef.current) {
      if (isMuted || volume <= 0.01) {
        clickSynthRef.current.volume.value = -Infinity;
      } else {
        // Map 0..1 linear volume to -24dB..0dB
        clickSynthRef.current.volume.value = 20 * Math.log10(volume);
      }
    }
  }, [volume, isMuted]);

  // Session timer increment while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const stopMetronome = useCallback(() => {
    Tone.Transport.stop();
    if (loopRef.current) {
      loopRef.current.dispose();
      loopRef.current = null;
    }
    setIsPlaying(false);
    setActiveBeat(0);
    stepCounterRef.current = 0;
  }, []);

  const buildAndStartLoop = useCallback((currentBpm: number, currentSub: 1 | 2 | 3 | 4) => {
    if (loopRef.current) {
      loopRef.current.dispose();
      loopRef.current = null;
    }

    if (!clickSynthRef.current) {
      clickSynthRef.current = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.04 }
      }).toDestination();
    }

    if (isMuted || volume <= 0.01) {
      clickSynthRef.current.volume.value = -Infinity;
    } else {
      clickSynthRef.current.volume.value = 20 * Math.log10(volume);
    }

    Tone.Transport.bpm.value = currentBpm;
    stepCounterRef.current = 0;

    const intervalNotation =
      currentSub === 1 ? '4n' : currentSub === 2 ? '8n' : currentSub === 3 ? '8t' : '16n';

    loopRef.current = new Tone.Loop((time) => {
      const totalBeats = beatsPerMeasureRef.current || 4;
      const states = beatStatesRef.current;
      const sub = subdivisionRef.current || 1;
      const step = stepCounterRef.current;
      const beatIdx = Math.floor(step / sub) % totalBeats;
      const subIdx = step % sub;
      const currentBeatState = states[beatIdx] || (beatIdx === 0 ? 'accent' : 'normal');

      if (subIdx === 0) {
        if (currentBeatState !== 'mute') {
          const isAccent = currentBeatState === 'accent';
          clickSynthRef.current?.triggerAttackRelease(isAccent ? 'C6' : 'C5', '16n', time);
        }
        Tone.Draw.schedule(() => {
          setActiveBeat(beatIdx);
        }, time);
      } else if (currentBeatState !== 'mute') {
        // Subtle softer tick for optional subdivisions
        clickSynthRef.current?.triggerAttackRelease('G4', '32n', time, 0.45);
      }

      stepCounterRef.current = (step + 1) % (totalBeats * sub);
    }, intervalNotation).start(0);

    Tone.Transport.start();
    setIsPlaying(true);
  }, [isMuted, volume]);

  const toggleMetronome = useCallback(async () => {
    await Tone.start();
    if (!isPlaying) {
      buildAndStartLoop(bpm, subdivision ?? 1);
    } else {
      stopMetronome();
    }
  }, [isPlaying, bpm, subdivision, buildAndStartLoop, stopMetronome]);

  // Update BPM smoothly while playing
  const updateBpm = (newBpm: number) => {
    const clamped = Math.min(240, Math.max(40, newBpm));
    setBpm(clamped);
    if (isPlaying) {
      Tone.Transport.bpm.value = clamped;
    }
  };

  // Toggle or unselect optional subdivision while playing
  const handleSubdivisionChange = (newSub: 1 | 2 | 3 | 4 | null) => {
    const nextSub = subdivision === newSub ? null : newSub;
    setSubdivision(nextSub);
    const effectiveSub: 1 | 2 | 3 | 4 = nextSub ?? 1;
    subdivisionRef.current = effectiveSub;
    if (isPlaying) {
      buildAndStartLoop(bpm, effectiveSub);
    }
  };

  // Update beats (1 to 12, or 16 via Teental preset) or toggle optional Taal preset
  const handleBeatsChange = (newBeats: number, presetId: string | null = null, customPattern?: BeatState[]) => {
    // If clicking an already-selected Taal preset, unselect it and restore default accents (revert >12 beat presets like Teental back to 4 beats)
    if (presetId !== null && selectedTaalId === presetId && beatsPerMeasure === newBeats) {
      const fallbackBeats = newBeats > 12 ? 4 : newBeats;
      const defaultPattern = createDefaultBeatPattern(fallbackBeats);
      setBeatsPerMeasure(fallbackBeats);
      beatsPerMeasureRef.current = fallbackBeats;
      setBeatStates(defaultPattern);
      beatStatesRef.current = defaultPattern;
      setSelectedTaalId(null);
      stepCounterRef.current = 0;
      setActiveBeat(0);
      return;
    }

    const pattern = customPattern ? [...customPattern] : createDefaultBeatPattern(newBeats);
    setBeatsPerMeasure(newBeats);
    beatsPerMeasureRef.current = newBeats;
    setBeatStates(pattern);
    beatStatesRef.current = pattern;
    setSelectedTaalId(presetId);
    stepCounterRef.current = 0;
    setActiveBeat(0);
  };

  // Stop metronome immediately and reset all selections to default
  const handleResetAll = () => {
    stopMetronome();

    const defaultBpm = 80;
    const defaultBeats = 4;
    const defaultPattern = createDefaultBeatPattern(defaultBeats);

    setBpm(defaultBpm);
    Tone.Transport.bpm.value = defaultBpm;
    setBeatsPerMeasure(defaultBeats);
    beatsPerMeasureRef.current = defaultBeats;
    setBeatStates(defaultPattern);
    beatStatesRef.current = defaultPattern;
    setSubdivision(null);
    subdivisionRef.current = 1;
    setSelectedTaalId(null);
    setIsMuted(false);
    setVolume(0.85);
    stepCounterRef.current = 0;
    setActiveBeat(0);
  };

  // Cycle individual beat between Sam/Accent -> Normal Beat -> Muted Rest
  const cycleBeatState = (index: number) => {
    setBeatStates(prev => {
      const next = [...prev];
      const current = next[index] || 'normal';
      next[index] = current === 'accent' ? 'normal' : current === 'normal' ? 'mute' : 'accent';
      beatStatesRef.current = next;
      return next;
    });
  };

  // Apply a recommended practice row preset cleanly
  const applyPracticePreset = (targetBpm: number, targetBeats: number) => {
    updateBpm(targetBpm);
    handleBeatsChange(targetBeats, null);
    setSubdivision(null);
    subdivisionRef.current = 1;
    if (isPlaying) {
      buildAndStartLoop(targetBpm, 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stop metronome automatically when user switches browser tabs or leaves page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopMetronome();
      }
    };
    const handlePageHide = () => {
      stopMetronome();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [stopMetronome]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      Tone.Transport.stop();
      if (loopRef.current) loopRef.current.dispose();
      if (clickSynthRef.current) clickSynthRef.current.dispose();
    };
  }, []);

  const handleTapTempo = () => {
    const now = performance.now();
    const recentTaps = tapTimesRef.current.filter(t => now - t < 2500);
    recentTaps.push(now);
    tapTimesRef.current = recentTaps.slice(-5);

    if (tapTimesRef.current.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgIntervalMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgIntervalMs);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        updateBpm(calculatedBpm);
      }
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-5xl mx-auto py-4 sm:py-10 px-3 sm:px-6 pb-24 sm:pb-32 md:pb-12 overflow-x-hidden"
      id="metronome-practice-view"
    >
      {/* Top Back Navigation */}
      <Link
        to="/"
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) return;
          if (onBackToHomepage) {
            e.preventDefault();
            onBackToHomepage();
          } else if (onViewChange) {
            e.preventDefault();
            onViewChange('home');
          }
        }}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/90 hover:bg-bamboo-100 border border-bamboo-200 px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-full mb-4 sm:mb-6 transition-all cursor-pointer shadow-3xs active:scale-95"
        id="metronome-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Homepage</span>
      </Link>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl border border-amber-500/20 mb-5 sm:mb-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-amber-300 font-semibold">
            <span>Flute Practice Metronome</span>
            <span aria-hidden="true">·</span>
            <span>40–240 BPM</span>
            <span aria-hidden="true">·</span>
            <span>1 to 12 Beats</span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white leading-snug">
            Online Metronome for Flute &amp; Bansuri Practice
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-bamboo-100/90 leading-relaxed">
            Set your tempo and beat count (1 to 12) and play with a clear, steady metronome tick for long notes, Sargam, Alankars, and daily riyaz.
          </p>
        </div>
      </div>

      {/* Main Simple Metronome Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 border border-bamboo-200 shadow-sm space-y-5 sm:space-y-6 mb-8 sm:mb-10">
        {/* Top Row: Status, Practice Timer & Reset All Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bamboo-100 pb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Zap className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-base sm:text-lg text-bamboo-950 leading-tight">
                Metronome &amp; Beat Counter
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {getTempoLabel(bpm)} · {beatsPerMeasure} {beatsPerMeasure === 1 ? 'Beat' : 'Beats'} per cycle
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-bamboo-50 border border-bamboo-200 rounded-xl px-2.5 sm:px-3 py-1.5 min-h-[38px]">
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="text-[11px] sm:text-xs text-gray-600 font-medium whitespace-nowrap">Time:</span>
              <span className="font-mono tabular-nums text-xs font-extrabold text-bamboo-950">
                {formatTimer(sessionSeconds)}
              </span>
              {sessionSeconds > 0 && (
                <button
                  type="button"
                  onClick={() => setSessionSeconds(0)}
                  title="Reset timer"
                  aria-label="Reset practice timer"
                  className="text-gray-400 hover:text-bamboo-900 transition cursor-pointer ml-0.5 p-0.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetAll}
              id="metronome-reset-all-btn"
              title="Stop metronome and reset all selections to default"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl bg-white hover:bg-amber-50 border border-bamboo-200 text-xs font-bold text-bamboo-900 transition cursor-pointer active:scale-95 shadow-3xs whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* 1. Large BPM Control & Slider */}
        <div className="bg-amber-50/50 rounded-2xl p-3.5 sm:p-6 border border-amber-200/80 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* BPM Readout & +/- Buttons (Responsive width fits 320px+ smartphones without overflow) */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-1.5 sm:gap-3">
              <button
                type="button"
                onClick={() => updateBpm(bpm - 5)}
                className="h-10 px-2.5 sm:px-3 min-w-[40px] rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-bamboo-900 transition cursor-pointer active:scale-95 shrink-0"
                aria-label="Decrease tempo by 5 BPM"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => updateBpm(bpm - 1)}
                className="w-9 h-10 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-bamboo-900 transition cursor-pointer active:scale-95 shrink-0"
                aria-label="Decrease tempo by 1 BPM"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center min-w-[78px] sm:min-w-[115px] px-1">
                <div className="text-3xl sm:text-5xl font-mono font-black tabular-nums text-bamboo-950 leading-none">
                  {bpm}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-amber-800 mt-1 whitespace-nowrap">
                  BPM (Tempo)
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateBpm(bpm + 1)}
                className="w-9 h-10 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-bamboo-900 transition cursor-pointer active:scale-95 shrink-0"
                aria-label="Increase tempo by 1 BPM"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => updateBpm(bpm + 5)}
                className="h-10 px-2.5 sm:px-3 min-w-[40px] rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-bamboo-900 transition cursor-pointer active:scale-95 shrink-0"
                aria-label="Increase tempo by 5 BPM"
              >
                +5
              </button>
            </div>

            {/* Start / Stop & Tap Tempo Buttons */}
            <div className="grid grid-cols-5 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={toggleMetronome}
                id="metronome-play-stop-btn"
                className={`col-span-3 sm:col-span-auto px-3 sm:px-6 py-3 min-h-[48px] rounded-xl font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer shadow-sm whitespace-nowrap ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                    : 'bg-bamboo-800 hover:bg-bamboo-900 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0" />}
                <span>{isPlaying ? 'Stop Metronome' : 'Start Metronome'}</span>
              </button>

              <button
                type="button"
                onClick={handleTapTempo}
                className="col-span-2 sm:col-span-auto px-2.5 sm:px-4 py-3 min-h-[48px] rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-bamboo-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap"
                title="Tap repeatedly to set tempo"
              >
                <Hand className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Tap Tempo</span>
              </button>
            </div>
          </div>

          {/* Tempo Slider */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-[11px] font-mono font-bold text-gray-500 shrink-0">40</span>
              <input
                id="metronome-bpm-slider"
                type="range"
                min={40}
                max={240}
                value={bpm}
                onChange={(e) => updateBpm(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-bamboo-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                aria-label="Metronome Tempo BPM"
              />
              <span className="text-[11px] font-mono font-bold text-gray-500 shrink-0">240</span>
            </div>

            {/* Quick BPM Buttons (Even 4x2 grid on smartphones) */}
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-1.5 pt-1">
              {[60, 72, 80, 90, 100, 120, 140, 160].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateBpm(val)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold border transition cursor-pointer text-center whitespace-nowrap ${
                    bpm === val
                      ? 'bg-bamboo-900 text-white border-bamboo-900'
                      : 'bg-white hover:bg-amber-100/70 text-bamboo-900 border-amber-200/80'
                  }`}
                >
                  {val} BPM
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Simple Beats Selector (1 to 12) & Interactive Beat Accent/Mute Matrix */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <h3 className="text-sm font-display font-bold text-bamboo-950">
                Beats per Cycle (1 to 12)
              </h3>
              <p className="text-xs text-gray-500">
                Choose how many beats to count in each cycle. Beat 1 plays a higher accent tick.
              </p>
            </div>
            {isPlaying && (
              <span className="inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-lg bg-amber-100 text-xs font-mono font-extrabold text-amber-800 whitespace-nowrap">
                Beat {activeBeat + 1} / {beatsPerMeasure}
              </span>
            )}
          </div>

          {/* 1 to 12 Beat Number Buttons */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleBeatsChange(num, null)}
                className={`py-2.5 min-h-[42px] rounded-xl font-mono font-extrabold text-xs sm:text-sm border transition cursor-pointer flex items-center justify-center ${
                  beatsPerMeasure === num
                    ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                    : 'bg-bamboo-50/70 hover:bg-amber-50 text-bamboo-950 border-bamboo-200/80'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Interactive Beat Accent & Mute Matrix */}
          <div className="bg-bamboo-50/40 rounded-2xl p-3.5 sm:p-4 border border-bamboo-200/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-display font-bold text-bamboo-950">
                  Interactive Beat Accent &amp; Mute Matrix
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  Tap any beat to switch between <strong>Sam / Accent</strong> (High Tick), <strong>Normal Beat</strong>, and <strong>Muted Rest</strong> (Silent).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const reset = createDefaultBeatPattern(beatsPerMeasure);
                  setBeatStates(reset);
                  beatStatesRef.current = reset;
                }}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-bamboo-200 text-[11px] font-bold text-bamboo-900 transition cursor-pointer shrink-0 whitespace-nowrap"
              >
                Reset Accents
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-0.5">
              {beatStates.map((state, idx) => {
                const isCurrent = isPlaying && activeBeat === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => cycleBeatState(idx)}
                    className={`py-2.5 px-1.5 sm:p-2.5 min-h-[54px] rounded-xl border text-center transition cursor-pointer select-none flex flex-col items-center justify-center ${
                      state === 'accent'
                        ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold'
                        : state === 'mute'
                        ? 'bg-gray-100 text-gray-400 border-gray-200'
                        : 'bg-white text-bamboo-950 border-bamboo-200'
                    } ${isCurrent ? 'ring-2 ring-amber-500 scale-[1.03] shadow-xs' : ''}`}
                  >
                    <div className="font-mono text-xs font-black tabular-nums leading-tight">
                      Beat {idx + 1}
                    </div>
                    <div className="text-[10px] font-semibold mt-0.5 leading-tight whitespace-nowrap">
                      {state === 'accent' ? 'Sam / Accent' : state === 'mute' ? 'Muted Rest' : 'Normal Beat'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Volume Control Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-2 border-t border-bamboo-100">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-bamboo-100 hover:bg-bamboo-200 text-bamboo-900 transition cursor-pointer shrink-0"
                aria-label={isMuted ? 'Unmute metronome' : 'Mute metronome'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <label htmlFor="metronome-volume-slider" className="text-xs font-bold text-bamboo-950">
                Tick Volume
              </label>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 sm:ml-1">
              {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
          <div className="w-full sm:w-64">
            <input
              id="metronome-volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setIsMuted(false);
                setVolume(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-bamboo-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        </div>

        {/* 4. Optional Collapsible Section: Western Meters, Hindustani Taals & Alankar Subdivisions */}
        <div className="pt-2 border-t border-bamboo-100">
          <button
            type="button"
            onClick={() => setShowOptionalSettings(!showOptionalSettings)}
            className="w-full flex items-center justify-between gap-2.5 py-3 px-3.5 sm:px-4 rounded-xl bg-bamboo-50/80 hover:bg-bamboo-100/80 border border-bamboo-200/80 text-left transition cursor-pointer"
          >
            <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
              <Sliders className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-bamboo-950 block leading-snug">
                  Optional Rhythm &amp; Speed Settings (Intermediate / Advanced)
                </span>
                <span className="text-[11px] text-gray-500 block leading-snug mt-0.5">
                  Western Meters, Taal Presets (Dadra, Rupak, Keherwa, Jhaptal, Ektaal, Teental) &amp; Speed Subdivisions
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-bamboo-800 shrink-0 transition-transform duration-200 ${
                showOptionalSettings ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showOptionalSettings && (
            <div className="mt-3 sm:mt-4 p-3.5 sm:p-5 rounded-2xl bg-bamboo-50/40 border border-bamboo-200/70 space-y-5 sm:space-y-6">
              {/* Optional A: Alankar Speed Subdivisions */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-display font-bold text-bamboo-950">
                      Alankar Speed Subdivisions (Optional)
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                      Subdivide each beat to practice Barabar (1x), Dugun (2x), Tigun (3x), or Chaugun (4x). Tap a selected option again to unselect it.
                    </p>
                  </div>
                  {subdivision !== null && (
                    <button
                      type="button"
                      onClick={() => handleSubdivisionChange(null)}
                      className="self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-bamboo-200 text-[11px] font-bold text-bamboo-900 transition cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      Unselect Subdivision
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {SUBDIVISIONS.map((sub) => {
                    const isSelected = subdivision === sub.value;
                    return (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => handleSubdivisionChange(sub.value)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition cursor-pointer min-w-0 ${
                          isSelected
                            ? 'bg-bamboo-900 text-white border-bamboo-950 shadow-2xs'
                            : 'bg-white hover:bg-amber-50/60 text-bamboo-950 border-bamboo-200'
                        }`}
                      >
                        <div className="font-bold text-xs leading-tight">{sub.name}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 leading-snug ${isSelected ? 'text-amber-300' : 'text-gray-500'}`}>
                          {sub.indianName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional B: Western Meters & Hindustani Taal Presets */}
              <div className="space-y-2.5 pt-3 border-t border-bamboo-200/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-display font-bold text-bamboo-950">
                      Western Meters &amp; Hindustani Taal Cycle Presets (Optional)
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                      Select any meter or Taal below (including 16-beat Teental) to automatically set its beat count and accent pattern. Tap a selected preset again to unselect it.
                    </p>
                  </div>
                  {selectedTaalId !== null && (
                    <button
                      type="button"
                      onClick={() => handleBeatsChange(beatsPerMeasure > 12 ? 4 : beatsPerMeasure, null)}
                      className="self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-bamboo-200 text-[11px] font-bold text-bamboo-900 transition cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      Unselect Preset
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {OPTIONAL_TAAL_PRESETS.map((preset, index) => {
                    const isSelected = selectedTaalId === preset.id && beatsPerMeasure === preset.beats;
                    const isLastOddMobile = index === OPTIONAL_TAAL_PRESETS.length - 1 && OPTIONAL_TAAL_PRESETS.length % 2 === 1;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleBeatsChange(preset.beats, preset.id, preset.defaultPattern)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition cursor-pointer min-w-0 ${
                          isLastOddMobile ? 'col-span-2 sm:col-span-1' : ''
                        } ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                            : 'bg-white hover:bg-amber-50/70 text-bamboo-950 border-bamboo-200'
                        }`}
                      >
                        <div className="font-bold text-xs leading-tight">{preset.label}</div>
                        <div className={`text-[10px] mt-0.5 leading-snug ${isSelected ? 'text-amber-100' : 'text-gray-500'}`}>
                          {preset.sublabel}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedTaalId && (
                  <p className="text-xs text-bamboo-900 bg-amber-50/80 border border-amber-200 rounded-xl p-3 leading-relaxed">
                    <strong>{OPTIONAL_TAAL_PRESETS.find(p => p.id === selectedTaalId)?.label}:</strong>{' '}
                    {OPTIONAL_TAAL_PRESETS.find(p => p.id === selectedTaalId)?.usage}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDUCATIONAL CONTENT FOR FLUTE & BANSURI METRONOME PRACTICE */}
      <div className="space-y-8 sm:space-y-10">
        {/* Section 1: Why Every Flutist Needs a Metronome */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-bamboo-200/80 shadow-xs space-y-5">
          <div className="space-y-2 border-b border-bamboo-100 pb-4">
            <span className="text-xs font-bold text-amber-700">
              Rhythm &amp; Laya Sadhana Guide
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-bamboo-950">
              How to Practice Flute &amp; Bansuri with a Metronome
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              In Indian classical music, a saying goes: <em>&ldquo;Shruti Mata, Laya Pita&rdquo;</em> — Pitch (Sur) is the Mother, and Rhythm (Laya) is the Father. While the Tanpura anchors your intonation, the Metronome builds steady, effortless timing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <h3 className="font-display font-bold text-bamboo-950 text-sm sm:text-base">
                01. Smooth Ma–Pa Transitions
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                On the Bansuri, moving between <strong>Ma (half-open top hole)</strong> and <strong>Pa (six holes closed)</strong> requires coordinating all fingers together. Without a metronome, players subconsciously pause before <em>Pa</em>. Practicing against a steady tick trains your fingers to move right on the beat.
              </p>
            </div>

            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <h3 className="font-display font-bold text-bamboo-950 text-sm sm:text-base">
                02. Timing Your Breath Naturally
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Flutists must take breaths every few bars. Beginners often pause the beat to inhale and arrive late on the next note. Practicing with a 4-beat or 8-beat cycle teaches you to take quick catch-breaths without losing Beat 1.
              </p>
            </div>

            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <h3 className="font-display font-bold text-bamboo-950 text-sm sm:text-base">
                03. Steady Ascending &amp; Descending Runs
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                During descending phrases (<em>Avroh: Sa&apos; Ni Dha Pa Ma Ga Re Sa</em>), closing finger holes sequentially feels easier than lifting them, causing many learners to rush downward notes. Following the metronome tick keeps every note equal in length.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Bansuri Practice BPM Reference Table */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-bamboo-200/80 shadow-xs space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700">
              Structured Tempo Progression
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-bamboo-950">
              Recommended BPM Tempo Chart for Flute Practice
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Use this tempo guide during your daily Bansuri practice. Tap any button below to load those settings into the metronome above.
            </p>
          </div>

          {/* Smartphone Card Layout (Zero horizontal scroll, all fields & Apply buttons clearly visible) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {[
              {
                title: 'Long Notes (Swar Sadhana)',
                bpmLabel: '60 BPM',
                beatsLabel: '4 or 8 Beats',
                goal: 'Hold each note steadily for 4, 8, or 12 ticks on one breath.',
                btnLabel: 'Set 60 BPM',
                targetBpm: 60,
                targetBeats: 4
              },
              {
                title: 'Beginner Sargam (Sa Re Ga Ma)',
                bpmLabel: '75 – 85 BPM',
                beatsLabel: '4 Beats',
                goal: 'Play 1 note per tick with clean finger sealing and clear tone.',
                btnLabel: 'Set 80 BPM',
                targetBpm: 80,
                targetBeats: 4
              },
              {
                title: '3-Note Alankars (Sa Re Ga, Re Ga Ma)',
                bpmLabel: '85 – 100 BPM',
                beatsLabel: '3 or 6 Beats',
                goal: 'Practice 3-note groupings smoothly across all octaves.',
                btnLabel: 'Set 90 BPM (3 Beats)',
                targetBpm: 90,
                targetBeats: 3
              },
              {
                title: '4-Note Alankars & Songs',
                bpmLabel: '100 – 120 BPM',
                beatsLabel: '4 or 8 Beats',
                goal: 'Build steady medium-tempo rhythm for melodies and paltas.',
                btnLabel: 'Set 110 BPM (8 Beats)',
                targetBpm: 110,
                targetBeats: 8
              },
              {
                title: 'Fast Finger Agility Drills',
                bpmLabel: '140 – 160 BPM',
                beatsLabel: '4 or 12 Beats',
                goal: 'Keep fingers light and relaxed close to the flute holes.',
                btnLabel: 'Set 140 BPM',
                targetBpm: 140,
                targetBeats: 4
              }
            ].map((row) => (
              <div
                key={row.title}
                className="rounded-2xl border border-bamboo-200 bg-bamboo-50/40 p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-bamboo-950 leading-snug">{row.title}</h3>
                  <span className="font-mono tabular-nums font-bold text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                    {row.bpmLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{row.goal}</p>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-bamboo-100">
                  <span className="text-[11px] font-semibold text-bamboo-800">{row.beatsLabel}</span>
                  <button
                    type="button"
                    onClick={() => applyPracticePreset(row.targetBpm, row.targetBeats)}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
                  >
                    {row.btnLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-bamboo-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-bamboo-900 text-white">
                  <th className="p-3.5 font-bold">Practice Exercise</th>
                  <th className="p-3.5 font-bold">Recommended BPM</th>
                  <th className="p-3.5 font-bold">Beats Setting</th>
                  <th className="p-3.5 font-bold">Practice Goal</th>
                  <th className="p-3.5 font-bold text-right">Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bamboo-100 font-sans">
                <tr className="hover:bg-amber-50/40">
                  <td className="p-3.5 font-bold text-bamboo-950">Long Notes (Swar Sadhana)</td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-amber-800">60 BPM</td>
                  <td className="p-3.5">4 or 8 Beats</td>
                  <td className="p-3.5 text-gray-600">Hold each note steadily for 4, 8, or 12 ticks on one breath.</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => applyPracticePreset(60, 4)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
                    >
                      Set 60 BPM
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="p-3.5 font-bold text-bamboo-950">Beginner Sargam (Sa Re Ga Ma)</td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-amber-800">75 – 85 BPM</td>
                  <td className="p-3.5">4 Beats</td>
                  <td className="p-3.5 text-gray-600">Play 1 note per tick with clean finger sealing and clear tone.</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => applyPracticePreset(80, 4)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
                    >
                      Set 80 BPM
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="p-3.5 font-bold text-bamboo-950">3-Note Alankars (Sa Re Ga, Re Ga Ma)</td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-amber-800">85 – 100 BPM</td>
                  <td className="p-3.5">3 or 6 Beats</td>
                  <td className="p-3.5 text-gray-600">Practice 3-note groupings smoothly across all octaves.</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => applyPracticePreset(90, 3)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
                    >
                      Set 90 BPM (3 Beats)
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="p-3.5 font-bold text-bamboo-950">4-Note Alankars &amp; Songs</td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-amber-800">100 – 120 BPM</td>
                  <td className="p-3.5">4 or 8 Beats</td>
                  <td className="p-3.5 text-gray-600">Build steady medium-tempo rhythm for melodies and paltas.</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => applyPracticePreset(110, 8)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
                    >
                      Set 110 BPM (8 Beats)
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="p-3.5 font-bold text-bamboo-950">Fast Finger Agility Drills</td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-amber-800">140 – 160 BPM</td>
                  <td className="p-3.5">4 or 12 Beats</td>
                  <td className="p-3.5 text-gray-600">Keep fingers light and relaxed close to the flute holes.</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => applyPracticePreset(140, 4)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
                    >
                      Set 140 BPM
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Frequently Asked Questions */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-bamboo-200/80 shadow-xs space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-700">
              Rhythm &amp; Practice Help
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-bamboo-950">
              Frequently Asked Questions on Metronome Practice
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-bamboo-200/80 rounded-2xl overflow-hidden bg-bamboo-50/30"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left font-display font-bold text-sm sm:text-base text-bamboo-950 hover:bg-bamboo-50 transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-700 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-bamboo-100 pt-3 ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Companion Practice Tools Cross-Links */}
        <section className="bg-gradient-to-br from-bamboo-900 to-bamboo-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white border border-bamboo-800 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300">
              Complete Riyaz Ecosystem
            </span>
            <h2 className="text-lg sm:text-2xl font-display font-extrabold text-white">
              Combine the Metronome with FluteSangam Practice Tools
            </h2>
            <p className="text-xs sm:text-sm text-bamboo-200">
              Pair your rhythm training with pitch calibration, acoustic drone accompaniment, and structured Alankar patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Link
              to="/tools/tanpura"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) return;
                if (onViewChange) {
                  e.preventDefault();
                  onViewChange('tanpura');
                }
              }}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-amber-300 mb-1">
                  <Radio className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Online Tanpura Drone</h3>
                <p className="text-xs text-bamboo-200 mt-1">
                  Play a steady acoustic Pa–Sa or Ma–Sa drone for pitch purity.
                </p>
              </div>
            </Link>

            <Link
              to="/alankar-generator"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) return;
                if (onViewChange) {
                  e.preventDefault();
                  onViewChange('alankar_generator');
                }
              }}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-amber-300 mb-1">
                  <Sliders className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Alankar Generator</h3>
                <p className="text-xs text-bamboo-200 mt-1">
                  Generate custom Sargam palta patterns to practice with your metronome.
                </p>
              </div>
            </Link>

            <Link
              to="/tuner"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) return;
                if (onViewChange) {
                  e.preventDefault();
                  onViewChange('learn_tuner');
                }
              }}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-amber-300 mb-1">
                  <Activity className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Online Flute Tuner</h3>
                <p className="text-xs text-bamboo-200 mt-1">
                  Check live pitch accuracy in cents across all 12 Bansuri scales.
                </p>
              </div>
            </Link>

            <Link
              to="/learn/daily-practice-guide"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) return;
                if (onViewChange) {
                  e.preventDefault();
                  onViewChange('learn_daily_practice');
                }
              }}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-amber-300 mb-1">
                  <Target className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Daily Practice Routine</h3>
                <p className="text-xs text-bamboo-200 mt-1">
                  Structured 30 &amp; 60-minute daily sadhana schedule for flutists.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default MetronomeView;
