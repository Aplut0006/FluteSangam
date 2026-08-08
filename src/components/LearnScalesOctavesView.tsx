import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, Volume2, Play, Square, Activity, Sparkles, Clock, 
  Calendar, CheckCircle2, HelpCircle, Gauge, Music, Sliders, 
  ChevronDown, ChevronUp, Layers, ArrowRight, ListOrdered, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface LearnScalesOctavesViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara frequency definitions (Hz) based on middle C (Sa = 261.63 Hz)
const SWARA_FREQS: Record<string, { freq: number; octave: 'Mandra' | 'Madhya' | 'Taar'; name: string; full: string }> = {
  // Mandra Saptak (Lower Octave - 4 notes on 6-hole Bansuri)
  'Mạ': { freq: 174.61, octave: 'Mandra', name: 'Mạ', full: 'Mandra Ma' },
  'Pạ': { freq: 196.00, octave: 'Mandra', name: 'Pạ', full: 'Mandra Pa' },
  'Dhạ': { freq: 220.00, octave: 'Mandra', name: 'Dhạ', full: 'Mandra Dha' },
  'Nị': { freq: 246.94, octave: 'Mandra', name: 'Nị', full: 'Mandra Ni' },
  // Aliases for Mandra
  'M.': { freq: 174.61, octave: 'Mandra', name: 'Mạ', full: 'Mandra Ma' },
  'P.': { freq: 196.00, octave: 'Mandra', name: 'Pạ', full: 'Mandra Pa' },
  'D.': { freq: 220.00, octave: 'Mandra', name: 'Dhạ', full: 'Mandra Dha' },
  'N.': { freq: 246.94, octave: 'Mandra', name: 'Nị', full: 'Mandra Ni' },

  // Madhya Saptak (Middle Octave - 7 notes on 6-hole Bansuri)
  'Sa': { freq: 261.63, octave: 'Madhya', name: 'Sa', full: 'Madhya Sa' },
  'Re': { freq: 293.66, octave: 'Madhya', name: 'Re', full: 'Madhya Re' },
  'Ga': { freq: 329.63, octave: 'Madhya', name: 'Ga', full: 'Madhya Ga' },
  'Ma': { freq: 349.23, octave: 'Madhya', name: 'Ma', full: 'Madhya Ma' },
  'Pa': { freq: 392.00, octave: 'Madhya', name: 'Pa', full: 'Madhya Pa' },
  'Dha': { freq: 440.00, octave: 'Madhya', name: 'Dha', full: 'Madhya Dha' },
  'Ni': { freq: 493.88, octave: 'Madhya', name: 'Ni', full: 'Madhya Ni' },

  // Taar Saptak (Upper Octave - 5 notes on 6-hole Bansuri)
  "Sa'": { freq: 523.25, octave: 'Taar', name: "Sa'", full: 'Taar Sa' },
  "Re'": { freq: 587.33, octave: 'Taar', name: "Re'", full: 'Taar Re' },
  "Ga'": { freq: 659.25, octave: 'Taar', name: "Ga'", full: 'Taar Ga' },
  "Ma'": { freq: 698.46, octave: 'Taar', name: "Ma'", full: 'Taar Ma' },
  "Pa'": { freq: 783.99, octave: 'Taar', name: "Pa'", full: 'Taar Pa' },
  // Aliases for Taar
  'Sā': { freq: 523.25, octave: 'Taar', name: "Sa'", full: 'Taar Sa' },
  'Rā': { freq: 587.33, octave: 'Taar', name: "Re'", full: 'Taar Re' },
  'Gā': { freq: 659.25, octave: 'Taar', name: "Ga'", full: 'Taar Ga' },
  'Mā': { freq: 698.46, octave: 'Taar', name: "Ma'", full: 'Taar Ma' },
  'Pā': { freq: 783.99, octave: 'Taar', name: "Pa'", full: 'Taar Pa' },
};

export default function LearnScalesOctavesView({ onViewChange }: LearnScalesOctavesViewProps) {
  // Web Audio Synth state
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscsRef = useRef<{ stop: () => void } | null>(null);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingSweep, setIsPlayingSweep] = useState<string | null>(null);

  // Metronome state
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(60);
  const metronomeIntervalRef = useRef<number | null>(null);

  // FAQ open toggles
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Initialize Audio Context on demand
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Stop current active note
  const stopTone = () => {
    if (activeOscsRef.current) {
      activeOscsRef.current.stop();
      activeOscsRef.current = null;
    }
    setActiveSwara(null);
  };

  // Play realistic Bansuri flute tone for a single Swara
  const playSwaraTone = (swaraKey: string, durationMs = 1300) => {
    const swaraData = SWARA_FREQS[swaraKey];
    if (!swaraData) return;

    stopTone();
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const durSec = durationMs / 1000;

    // Master Gain for smooth envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.32, now + 0.07); // Natural soft breath attack
    masterGain.gain.setValueAtTime(0.30, now + durSec - 0.2);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);

    // Fundamental Pure Sine Wave
    const fundOsc = ctx.createOscillator();
    fundOsc.type = 'sine';
    fundOsc.frequency.setValueAtTime(swaraData.freq, now);

    // 2nd Harmonic (Triangle) for rich bamboo wood body resonance
    const harmOsc2 = ctx.createOscillator();
    harmOsc2.type = 'triangle';
    harmOsc2.frequency.setValueAtTime(swaraData.freq * 2, now);
    const harmGain2 = ctx.createGain();
    harmGain2.gain.setValueAtTime(swaraData.octave === 'Taar' ? 0.05 : 0.09, now);

    // 3rd Harmonic (Sine) subtle overtone
    const harmOsc3 = ctx.createOscillator();
    harmOsc3.type = 'sine';
    harmOsc3.frequency.setValueAtTime(swaraData.freq * 3, now);
    const harmGain3 = ctx.createGain();
    harmGain3.gain.setValueAtTime(0.025, now);

    // Sub-harmonic body resonance for Mandra notes
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(swaraData.freq * 0.5, now);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(swaraData.octave === 'Mandra' ? 0.14 : 0.015, now);

    // Organic Air Chiff Noise (embouchure breath puff at note onset)
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(swaraData.freq * 1.3, now);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.045, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    // Natural Vibrato LFO (5.2 Hz gentle pitch oscillation with 80ms delay)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.2, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0, now);
    lfoGain.gain.linearRampToValueAtTime(1.4, now + 0.2); // Vibrato blooms smoothly after onset
    lfo.connect(lfoGain);
    lfoGain.connect(fundOsc.frequency);

    // Connect node graph
    fundOsc.connect(masterGain);
    harmOsc2.connect(harmGain2);
    harmGain2.connect(masterGain);
    harmOsc3.connect(harmGain3);
    harmGain3.connect(masterGain);
    subOsc.connect(subGain);
    subGain.connect(masterGain);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    masterGain.connect(ctx.destination);

    // Start all audio sources
    fundOsc.start(now);
    harmOsc2.start(now);
    harmOsc3.start(now);
    subOsc.start(now);
    lfo.start(now);
    noiseSource.start(now);

    const stopHandler = () => {
      try {
        fundOsc.stop();
        harmOsc2.stop();
        harmOsc3.stop();
        subOsc.stop();
        lfo.stop();
        noiseSource.stop();
        masterGain.disconnect();
      } catch (e) {
        // Already stopped
      }
    };

    activeOscsRef.current = { stop: stopHandler };
    setActiveSwara(swaraKey);

    setTimeout(() => {
      if (activeSwara === swaraKey) {
        setActiveSwara(null);
      }
    }, durationMs);
  };

  // Play continuous scale sweep for a register
  const playScaleSweep = (register: 'Mandra' | 'Madhya' | 'Taar') => {
    if (isPlayingSweep) {
      stopTone();
      setIsPlayingSweep(null);
      return;
    }

    let sequence: string[] = [];
    if (register === 'Mandra') sequence = ['Mạ', 'Pạ', 'Dhạ', 'Nị'];
    if (register === 'Madhya') sequence = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'];
    if (register === 'Taar') sequence = ["Sa'", "Re'", "Ga'", "Ma'", "Pa'"];

    setIsPlayingSweep(register);

    sequence.forEach((swara, idx) => {
      setTimeout(() => {
        playSwaraTone(swara, 750);
        if (idx === sequence.length - 1) {
          setTimeout(() => {
            setIsPlayingSweep(null);
          }, 850);
        }
      }, idx * 800);
    });
  };

  // Metronome Ticker
  useEffect(() => {
    if (isMetronomePlaying) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      metronomeIntervalRef.current = window.setInterval(() => {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }, intervalMs);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    }
    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [isMetronomePlaying, metronomeBpm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTone();
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, []);

  const faqs = [
    {
      q: "What is an octave on the flute?",
      a: "An octave is the musical interval between one note and the next occurrence of the same note at twice or half its frequency (e.g. Sa at 261.6 Hz and higher Sa' at 523.2 Hz). Indian bamboo flute players commonly navigate three main registers: Mandra Saptak (Lower Octave), Madhya Saptak (Middle Octave), and Taar Saptak (Upper Octave)."
    },
    {
      q: "How many swaras are commonly used in each octave on a standard 6-hole Bansuri?",
      a: "On a standard 6-hole Indian bamboo flute, Mandra Saptak uses 4 lower swaras (Mạ Pạ Dhạ Nị), Madhya Saptak uses 7 middle swaras (Sa Re Ga Ma Pa Dha Ni), and Taar Saptak uses 5 upper swaras (Sa' Re' Ga' Ma' Pa')."
    },
    {
      q: "Should beginners practice all three octaves immediately?",
      a: "Not immediately. It is strongly recommended to build a stable, resonant middle octave (Madhya Saptak) first. Once your embouchure and finger placement are consistent, gradually expand downward into Mandra Saptak and upward into Taar Saptak."
    },
    {
      q: "How can I increase my flute range cleanly without screeching?",
      a: "Focus on embouchure aperture refinement and air velocity rather than blowing hard. For lower octave notes, use a gentle, warm, downward stream. For upper octave notes, narrow your lip aperture into a focused, compact oval and direct a faster, precise air stream against the embouchure hole edge."
    },
    {
      q: "Should I practice scales fast from day one?",
      a: "No. Speed often masks inaccurate finger landings and uneven breath distribution. Always begin scale practice slowly at 40–50 BPM. Prioritize clean tone, steady pitch, and relaxed fingers before increasing the metronome speed."
    },
    {
      q: "Should I use a metronome during scale practice?",
      a: "Yes! A metronome builds internal rhythmic stability (Laya), prevents rushing on easy notes, and teaches you to maintain equal duration across every swara in a scale."
    },
    {
      q: "Is scale practice enough to learn a full Raga?",
      a: "No. Scale practice develops technical finger fluency and intonation, but a Raga involves specific characteristic phrases (Pakad), key resting notes (Vadi/Samvadi), ornamentation (Meend/Gamak), and expressive melodic movement beyond linear scales."
    },
    {
      q: "Why do my upper octave notes sound harsh or thin?",
      a: "Upper octave notes become harsh when you force extra air pressure from your lungs without adjusting your lip aperture. Tighten your lips slightly to make a smaller air stream, angle the air slightly higher, and maintain relaxed throat muscles."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" itemScope itemType="https://schema.org/LearningResource">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-bamboo-100 rounded-2xl flex items-center justify-center shadow-inner">
                <Music className="w-7 h-7 text-amber-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
                  Learn Flute Guide
                </span>
                <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight mt-1" itemProp="headline">
                  Flute Scales & Octaves: A Complete Guide
                </h1>
              </div>
            </div>

            {/* Timestamps & Freshness Signal */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-3.5 py-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-500">Published:</span>
                <time itemProp="datePublished" dateTime="2026-08-07T00:00:00Z" className="font-semibold text-gray-900">
                  Aug 7, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-500">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-08-07T00:00:00Z" className="font-semibold text-gray-900">
                  Aug 7, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">
                <CheckCircle2 className="w-3 h-3 text-amber-700" /> Complete Guide
              </span>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-gray-700 font-medium border-l-4 border-amber-400 pl-5 py-1 italic bg-amber-50/30 rounded-r-xl">
            Understanding scales and octaves is an important part of developing control, pitch accuracy, finger coordination, and musical range on the flute. Whether you are learning your first Sargam patterns or working on faster Raga phrases, practicing scales across different octaves helps connect individual notes into a smooth, controlled musical line.
          </p>

          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            For a bansuri player, octave practice is particularly useful because the same swara can feel and respond differently as you move from the lower register to the middle and upper registers. This guide explains what scales and octaves mean, how they work on the flute, how to practice them, and how to use them in actual musical playing.
          </p>
        </div>
      </div>

      {/* ================= INTERACTIVE OCTAVES & VOICE SYNTHESIZER ================= */}
      <section className="bg-gradient-to-br from-amber-900 via-bamboo-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-700/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-800/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <Volume2 className="w-4 h-4" />
                <span>Interactive Audio Tool</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-amber-100 mt-1">
                Octave & Swara Voice Note Synthesizer
              </h2>
            </div>

            {/* Metronome Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  isMetronomePlaying
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/10 text-emerald-200 hover:bg-white/20 border border-white/10'
                }`}
              >
                <Gauge className={`w-4 h-4 ${isMetronomePlaying ? 'animate-spin' : ''}`} />
                <span>{isMetronomePlaying ? `${metronomeBpm} BPM` : 'Metronome'}</span>
              </button>
            </div>
          </div>

          {/* Metronome BPM Controller */}
          {isMetronomePlaying && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-black/30 p-4 rounded-2xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-emerald-200">
                <span className="font-bold">Set Tempo:</span>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={metronomeBpm}
                  onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                  className="w-40 accent-emerald-400 cursor-pointer"
                />
                <span className="font-mono bg-emerald-950 text-emerald-300 font-bold px-2 py-1 rounded border border-emerald-500/40">{metronomeBpm} BPM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recommended: Start at 40–60 BPM for scale clarity</span>
              </div>
            </motion.div>
          )}

          <p className="text-sm text-amber-200/90 leading-relaxed">
            Click any swara note below or launch a <strong>Register Scale Sweep</strong> to hear how the real bamboo flute tone responds across Mandra, Madhya, and Taar octaves.
          </p>

          {/* 3 Register Voice Note Audio Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Mandra Saptak Card (4 Notes) */}
            <div className="bg-black/40 border border-amber-600/30 rounded-2xl p-5 space-y-4 hover:border-amber-500/60 transition">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                    4 Notes
                  </span>
                  <h3 className="text-lg font-bold text-amber-100 mt-1">Mandra Saptak</h3>
                  <p className="text-xs text-amber-300/70">Lower Octave (Deep & Resonant)</p>
                </div>
                <button
                  onClick={() => playScaleSweep('Mandra')}
                  className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-bamboo-950 flex items-center justify-center font-bold transition shadow-md"
                  title="Play Mandra Sweep"
                >
                  {isPlayingSweep === 'Mandra' ? <Square className="w-5 h-5 fill-bamboo-950" /> : <Play className="w-5 h-5 fill-bamboo-950 ml-0.5" />}
                </button>
              </div>

              <div className="text-xs space-y-1.5 text-amber-200/80 bg-amber-950/40 p-3 rounded-xl border border-amber-800/30">
                <div><strong>4 Swaras:</strong> Mạ Pạ Dhạ Nị</div>
                <div><strong>Air Stream:</strong> Soft, warm & relaxed</div>
                <div><strong>Notation:</strong> Subscript dot below note</div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-amber-300/80 block">Touch Swara Note:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Mạ', 'Pạ', 'Dhạ', 'Nị'].map((swara) => (
                    <button
                      key={swara}
                      onClick={() => playSwaraTone(swara)}
                      className={`py-2 px-1 rounded-xl font-mono text-sm font-bold border transition ${
                        activeSwara === swara || activeSwara === SWARA_FREQS[swara]?.name
                          ? 'bg-amber-400 text-bamboo-950 border-amber-300 scale-105 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/15 text-amber-100'
                      }`}
                    >
                      {swara}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Madhya Saptak Card (7 Notes) */}
            <div className="bg-black/40 border border-emerald-500/40 rounded-2xl p-5 space-y-4 hover:border-emerald-400/60 transition relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                    7 Notes
                  </span>
                  <h3 className="text-lg font-bold text-emerald-100 mt-1">Madhya Saptak</h3>
                  <p className="text-xs text-emerald-300/70">Middle Octave (Core Singing Tone)</p>
                </div>
                <button
                  onClick={() => playScaleSweep('Madhya')}
                  className="w-10 h-10 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-bamboo-950 flex items-center justify-center font-bold transition shadow-md"
                  title="Play Madhya Sweep"
                >
                  {isPlayingSweep === 'Madhya' ? <Square className="w-5 h-5 fill-bamboo-950" /> : <Play className="w-5 h-5 fill-bamboo-950 ml-0.5" />}
                </button>
              </div>

              <div className="text-xs space-y-1.5 text-emerald-200/80 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/30">
                <div><strong>7 Swaras:</strong> Sa Re Ga Ma Pa Dha Ni</div>
                <div><strong>Air Stream:</strong> Balanced & steady breeze</div>
                <div><strong>Notation:</strong> Standard notes without dots</div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-emerald-300/80 block">Touch Swara Note:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'].map((swara) => (
                    <button
                      key={swara}
                      onClick={() => playSwaraTone(swara)}
                      className={`py-2 px-1 rounded-xl font-mono text-xs font-bold border transition ${
                        activeSwara === swara
                          ? 'bg-emerald-400 text-bamboo-950 border-emerald-300 scale-105 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/15 text-emerald-100'
                      }`}
                    >
                      {swara}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Taar Saptak Card (5 Notes) */}
            <div className="bg-black/40 border border-rose-500/30 rounded-2xl p-5 space-y-4 hover:border-rose-400/60 transition">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/50">
                    5 Notes
                  </span>
                  <h3 className="text-lg font-bold text-rose-100 mt-1">Taar Saptak</h3>
                  <p className="text-xs text-rose-300/70">Upper Octave (Soaring & Brilliant)</p>
                </div>
                <button
                  onClick={() => playScaleSweep('Taar')}
                  className="w-10 h-10 rounded-xl bg-rose-400 hover:bg-rose-300 text-bamboo-950 flex items-center justify-center font-bold transition shadow-md"
                  title="Play Taar Sweep"
                >
                  {isPlayingSweep === 'Taar' ? <Square className="w-5 h-5 fill-bamboo-950" /> : <Play className="w-5 h-5 fill-bamboo-950 ml-0.5" />}
                </button>
              </div>

              <div className="text-xs space-y-1.5 text-rose-200/80 bg-rose-950/40 p-3 rounded-xl border border-rose-800/30">
                <div><strong>5 Swaras:</strong> Sa' Re' Ga' Ma' Pa'</div>
                <div><strong>Air Stream:</strong> Focused micro-jet</div>
                <div><strong>Notation:</strong> Apostrophe/dot above note</div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-rose-300/80 block">Touch Swara Note:</span>
                <div className="grid grid-cols-5 gap-1">
                  {["Sa'", "Re'", "Ga'", "Ma'", "Pa'"].map((swara) => (
                    <button
                      key={swara}
                      onClick={() => playSwaraTone(swara)}
                      className={`py-2 px-1 rounded-xl font-mono text-xs font-bold border transition ${
                        activeSwara === swara
                          ? 'bg-rose-400 text-bamboo-950 border-rose-300 scale-105 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/15 text-rose-100'
                      }`}
                    >
                      {swara}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Practical Bansuri Range Note Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs sm:text-sm leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Note:</strong> The practical range of a bansuri can vary depending on the flute's size, tuning, construction, fingering technique, and the player's experience. The range above represents commonly used notes for a 6-hole Indian bamboo flute and is intended as a practical learning reference.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FREQUENCY & REGISTER COMPARISON CHART ================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
          <Activity className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-bamboo-900 m-0">
            Acoustic Spectrum & Octave Comparison Chart
          </h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          The chart below illustrates how frequency doubles with each octave increment, alongside the physical technique adjustments required on the bansuri for its 16 commonly played swaras.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-amber-50/80 text-bamboo-950 border-b border-amber-200">
                <th className="p-3 font-bold">Octave Register</th>
                <th className="p-3 font-bold">Standard Notes (6-Hole Bansuri)</th>
                <th className="p-3 font-bold">Notation Style</th>
                <th className="p-3 font-bold">Frequency Range (Middle C Sa = 261.6Hz)</th>
                <th className="p-3 font-bold">Air Pressure & Speed</th>
                <th className="p-3 font-bold">Tonal Characteristic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 font-bold text-amber-900">Mandra Saptak (Lower)</td>
                <td className="p-3 font-mono font-bold text-amber-900">4 Notes: Mạ Pạ Dhạ Nị</td>
                <td className="p-3 font-mono font-bold text-amber-800">Mạ Pạ Dhạ Nị (Dot below)</td>
                <td className="p-3 font-mono text-gray-600">174.6 Hz – 246.9 Hz</td>
                <td className="p-3">Soft, steady, low-velocity breath</td>
                <td className="p-3 text-xs bg-amber-50/50 font-semibold rounded">Deep, woody, warm, resonant bass</td>
              </tr>
              <tr className="hover:bg-emerald-50/30 transition">
                <td className="p-3 font-bold text-emerald-900">Madhya Saptak (Middle)</td>
                <td className="p-3 font-mono font-bold text-emerald-900">7 Notes: Sa Re Ga Ma Pa Dha Ni</td>
                <td className="p-3 font-mono font-bold text-emerald-800">Sa Re Ga Ma Pa Dha Ni</td>
                <td className="p-3 font-mono text-gray-600">261.6 Hz – 493.9 Hz</td>
                <td className="p-3">Medium balanced airflow</td>
                <td className="p-3 text-xs bg-emerald-50/50 font-semibold rounded">Clear, sweet, singing, core melody voice</td>
              </tr>
              <tr className="hover:bg-rose-50/30 transition">
                <td className="p-3 font-bold text-rose-900">Taar Saptak (Upper)</td>
                <td className="p-3 font-mono font-bold text-rose-900">5 Notes: Sa' Re' Ga' Ma' Pa'</td>
                <td className="p-3 font-mono font-bold text-rose-800">Sa' Re' Ga' Ma' Pa' (Apostrophe/dot above)</td>
                <td className="p-3 font-mono text-gray-600">523.2 Hz – 783.9 Hz</td>
                <td className="p-3">High-speed, focused air jet</td>
                <td className="p-3 text-xs bg-rose-50/50 font-semibold rounded">Bright, penetrating, soaring, brilliant</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Practical Bansuri Range Note Box */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs sm:text-sm leading-relaxed">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Note:</strong> The practical range of a bansuri can vary depending on the flute's size, tuning, construction, fingering technique, and the player's experience. The range above represents commonly used notes for a 6-hole Indian bamboo flute and is intended as a practical learning reference.
          </p>
        </div>
      </section>

      {/* ================= CORE EXPLANATORY SECTIONS ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-10">
        
        {/* Section 1: What Is a Flute Scale? */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Music className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">What Is a Flute Scale?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            A scale is an ordered sequence of musical notes arranged from a starting note to its higher or lower equivalent. In Indian classical music, a common way of describing the basic seven swaras is:
          </p>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 text-center font-mono font-bold text-amber-900 text-lg">
            Sa Re Ga Ma Pa Dha Ni Sa'
          </div>

          <p className="text-gray-700 leading-relaxed">
            The final Sa' is the next higher occurrence of Sa. When you play:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-bamboo-50/60 p-4 rounded-2xl border border-bamboo-100">
              <h4 className="font-bold text-bamboo-900 mb-1 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                Ascending Movement (Aroh)
              </h4>
              <p className="text-xs text-gray-600 font-mono">Sa → Re → Ga → Ma → Pa → Dha → Ni → Sa'</p>
              <p className="text-xs text-gray-500 mt-2">you are moving upward through the scale.</p>
            </div>

            <div className="bg-bamboo-50/60 p-4 rounded-2xl border border-bamboo-100">
              <h4 className="font-bold text-bamboo-900 mb-1 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-rose-600 rotate-180" />
                Descending Movement (Avroh)
              </h4>
              <p className="text-xs text-gray-600 font-mono">Sa' → Ni → Dha → Pa → Ma → Ga → Re → Sa</p>
              <p className="text-xs text-gray-500 mt-2">creates a descending movement playing the same notes in reverse.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            These are commonly referred to as Aroh and Avroh in the context of Raga practice, although a simple scale exercise and a Raga's Aroh/Avroh are not always identical in musical treatment.
          </p>
        </section>

        {/* Section 2: What Is an Octave? */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Layers className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">What Is an Octave?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            An octave is the distance between one note and the next occurrence of that same note at twice or half its frequency. For example:
          </p>

          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-900 text-sm">
            Sa → Re → Ga → Ma → Pa → Dha → Ni → Sa'
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            starts and ends on Sa, but the second Sa' is higher. The two Sa notes belong to different registers. For flute practice, you will commonly work with:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-1">Lower Octave (Mandra Saptak)</h3>
              <p className="text-xs text-amber-800">Contains 4 notes: Mạ Pạ Dhạ Nị below middle Sa. Requires controlled, steady airflow.</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-1">Middle Octave (Madhya Saptak)</h3>
              <p className="text-xs text-emerald-800">Contains 7 notes: Sa Re Ga Ma Pa Dha Ni. The most comfortable working range.</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
              <h3 className="font-bold text-rose-900 mb-1">Upper Octave (Taar Saptak)</h3>
              <p className="text-xs text-rose-800">Contains 5 notes: Sa' Re' Ga' Ma' Pa' above middle Ni. Requires refined air speed and lip focus.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            The exact range available and the ease of producing particular notes depend on the flute, its tuning, the player's technique, and the musical context.
          </p>
        </section>

        {/* Section 3: Understanding the Three Registers */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Sliders className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Understanding the Three Registers</h2>
          </div>

          {/* Register 1: Mandra */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
            <h3 className="text-lg font-bold text-amber-900">1. Lower Octave — Mandra Saptak (4 Notes: Mạ Pạ Dhạ Nị)</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The lower register contains notes below the middle register. These notes generally require controlled, steady airflow and appropriate embouchure adjustment. For a beginner, lower-octave notes can initially feel less stable than middle-register notes.
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-gray-700 space-y-2">
              <div className="font-bold text-amber-900">Practice goals & focus:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Producing a clear tone</li>
                <li>Maintaining steady airflow</li>
                <li>Avoiding excessive blowing</li>
                <li>Keeping the pitch stable</li>
                <li>Moving smoothly between notes</li>
              </ul>
              <p className="text-amber-800 font-semibold italic pt-1">
                Don't try to force the lower notes by simply blowing harder. Controlled airflow is generally more useful than excessive pressure.
              </p>
            </div>
          </div>

          {/* Register 2: Madhya */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
            <h3 className="text-lg font-bold text-emerald-900">2. Middle Octave — Madhya Saptak (7 Notes: Sa Re Ga Ma Pa Dha Ni)</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The middle register is usually the most comfortable working range for many flute exercises. This is where you can develop finger coordination, Sargam accuracy, Alankar patterns, Raga phrases, basic melodies, rhythm and speed.
            </p>
            <p className="text-xs text-emerald-900 font-medium bg-emerald-100/60 p-3 rounded-xl border border-emerald-200">
              A large portion of your initial practice can be built around the middle register before gradually extending into the lower and upper registers.
            </p>
          </div>

          {/* Register 3: Taar */}
          <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
            <h3 className="text-lg font-bold text-rose-900">3. Upper Octave — Taar Saptak (5 Notes: Sa' Re' Ga' Ma' Pa')</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The upper register contains notes above the middle register. Producing these notes cleanly requires more refined control of air direction, air speed, embouchure, finger coordination, and breath management.
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-xs text-gray-700 space-y-2">
              <p className="text-rose-900 font-bold">Important Tip:</p>
              <p>
                A common beginner mistake is to assume that higher notes simply require blowing harder. Instead, work on controlling the air stream and adjusting your embouchure gradually. A strong upper register should sound controlled rather than forced.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Why Should Flute Players Practice Scales? */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Why Should Flute Players Practice Scales?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Scale practice can appear repetitive, but it develops several fundamental skills:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-bamboo-100 bg-white shadow-xs space-y-1">
              <h4 className="font-bold text-bamboo-900 text-sm">1. Finger Coordination</h4>
              <p className="text-xs text-gray-600">Moving through consecutive notes trains your fingers to move accurately and efficiently.</p>
            </div>

            <div className="p-4 rounded-2xl border border-bamboo-100 bg-white shadow-xs space-y-1">
              <h4 className="font-bold text-bamboo-900 text-sm">2. Pitch Awareness</h4>
              <p className="text-xs text-gray-600">Regular scale practice helps you recognize whether your notes are sitting at the intended pitch.</p>
            </div>

            <div className="p-4 rounded-2xl border border-bamboo-100 bg-white shadow-xs space-y-1">
              <h4 className="font-bold text-bamboo-900 text-sm">3. Breath Control</h4>
              <p className="text-xs text-gray-600">Long ascending and descending passages require you to manage your breath rather than taking random breaths.</p>
            </div>

            <div className="p-4 rounded-2xl border border-bamboo-100 bg-white shadow-xs space-y-1">
              <h4 className="font-bold text-bamboo-900 text-sm">4. Register Transitions</h4>
              <p className="text-xs text-gray-600">Moving from middle to upper or lower notes teaches you how to change registers without breaking the musical line.</p>
            </div>

            <div className="p-4 rounded-2xl border border-bamboo-100 bg-white shadow-xs space-y-1">
              <h4 className="font-bold text-bamboo-900 text-sm">5. Speed</h4>
              <p className="text-xs text-gray-600">Once the notes are comfortable at a slow tempo, scales can gradually be practiced faster.</p>
            </div>

            <div className="p-4 rounded-2xl border border-bamboo-100 bg-white shadow-xs space-y-1">
              <h4 className="font-bold text-bamboo-900 text-sm">6. Musical Fluency</h4>
              <p className="text-xs text-gray-600">Scales become building blocks for melodies, improvisation, Sargam, Alankars and Raga phrases.</p>
            </div>
          </div>
        </section>

        {/* Section 5: Basic Sargam Scale Practice & Octave Transitions */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <ListOrdered className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Basic Sargam Scale Practice & Octave Transitions</h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Start with a comfortable middle-register Sa. Practice slowly:
          </p>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center font-mono font-bold text-bamboo-900 text-sm sm:text-base">
            Sa Re Ga Ma Pa Dha Ni Sa'<br />
            <span className="text-amber-800">Sa' Ni Dha Pa Ma Ga Re Sa</span>
          </div>

          <p className="text-xs text-gray-600">
            Don't immediately focus on speed. Your first goal should be: Every note should sound clean, stable and intentional. Once the notes are consistent, gradually increase the tempo.
          </p>

          <div className="p-5 rounded-2xl bg-bamboo-50/80 border border-bamboo-200 space-y-3">
            <h3 className="font-bold text-bamboo-900 text-base">How to Practice Octave Transitions</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              One of the most useful exercises is to practice the same swara across registers. For example:
            </p>
            <div className="bg-white p-3 rounded-xl border border-bamboo-200 font-mono text-xs font-bold text-amber-900 flex flex-wrap gap-2 justify-center">
              <span>Mạ → Ma → Ma'</span>
              <span className="text-gray-300">|</span>
              <span>Pạ → Pa → Pa'</span>
              <span className="text-gray-300">|</span>
              <span>Dhạ → Dha</span>
              <span className="text-gray-300">|</span>
              <span>Nị → Ni</span>
            </div>
            <p className="text-xs text-gray-600 italic">
              The goal isn't simply to reach the higher note. You want the transition to sound smooth, controlled, in tune, and free from unnecessary breath noise.
            </p>
          </div>
        </section>

        {/* Section 6: Scale Exercises for Beginners */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <ListOrdered className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Scale Exercises for Beginners</h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-900">Exercise 1 — Straight Scale</h3>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">Straight</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 font-mono text-sm font-bold text-bamboo-900 text-center">
                Sa Re Ga Ma | Pa Dha Ni Sa'<br />
                <span className="text-amber-700">Sa' Ni Dha Pa | Ma Ga Re Sa</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-emerald-900">Exercise 2 — Two-Note Movement</h3>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">Finger Pair</span>
              </div>
              <p className="text-xs text-gray-600">This helps develop finger transitions.</p>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 font-mono text-sm font-bold text-bamboo-900 text-center">
                Sa Re | Re Ga | Ga Ma | Ma Pa | Pa Dha | Dha Ni | Ni Sa'<br />
                <span className="text-emerald-700">Sa' Ni | Ni Dha | Dha Pa | Pa Ma | Ma Ga | Ga Re | Re Sa</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-rose-900">Exercise 3 — Three-Note Patterns</h3>
                <span className="text-xs bg-rose-100 text-rose-900 font-bold px-2.5 py-0.5 rounded-full">Triplets</span>
              </div>
              <p className="text-xs text-gray-600">This type of movement prepares your fingers for more complex musical phrases.</p>
              <div className="bg-white p-3 rounded-xl border border-rose-200 font-mono text-sm font-bold text-bamboo-900 text-center">
                Sa Re Ga | Re Ga Ma | Ga Ma Pa | Ma Pa Dha | Pa Dha Ni | Dha Ni Sa'<br />
                <span className="text-rose-700">Sa' Ni Dha | Ni Dha Pa | Dha Pa Ma | Pa Ma Ga | Ma Ga Re | Ga Re Sa</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Practice Tools: Metronome & Raga Context */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Gauge className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Practice Tools: Metronome & Ragas</h2>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <h3 className="font-bold text-amber-900">Scale Practice With a Metronome</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Once you can play the scale comfortably, introduce a metronome at 40 BPM (playing one note per beat). Once stable, progress: <strong>50 BPM → 60 BPM → 70 BPM → 80 BPM</strong>. Increase speed only when you can maintain accuracy, tone, rhythm, and relaxed technique.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900 text-base">Scales vs Raga Practice</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Scales are useful, but Indian classical flute playing goes beyond simply running up and down a scale. A Raga uses a collection of swaras while emphasizing certain movements, phrases, and resting points.
            </p>
            <div className="bg-white p-3 rounded-xl border border-stone-200 font-mono text-xs text-amber-900 text-center font-bold">
              Aroh → Avroh → Pakad → Characteristic Phrases → Raga Improvisation
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <h3 className="font-bold text-amber-900">Shuddha, Komal and Tivra Swaras</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              The seven basic swaras are Sa Re Ga Ma Pa Dha Ni. Some swaras can have altered forms: Komal Re, Komal Ga, Tivra Ma, Komal Dha, Komal Ni. Sa and Pa do not take Komal/Tivra alterations in Hindustani theory.
            </p>
          </div>
        </section>

        {/* Section 8: Common Problems During Scale Practice */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Common Problems During Scale Practice</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">Blowing too hard</h4>
              <p className="text-xs text-gray-700">
                Trying to force high notes creates an unstable or harsh sound.<br />
                <strong>Solution:</strong> Work on controlled airflow and embouchure adjustment.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">Playing too fast</h4>
              <p className="text-xs text-gray-700">
                Speed can hide inaccurate finger movements.<br />
                <strong>Solution:</strong> Slow down and make every transition clean.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">Ignoring pitch</h4>
              <p className="text-xs text-gray-700">
                A technically fast scale is not useful if several notes are out of tune.<br />
                <strong>Solution:</strong> Practice with a steady metronome or pitch reference.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">Breaking the phrase unnecessarily</h4>
              <p className="text-xs text-gray-700">
                Stopping after every few notes makes the scale sound disconnected.<br />
                <strong>Solution:</strong> Gradually develop longer breath-controlled phrases.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9: A Simple Daily Scale Routine */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Clock className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">A Simple Daily Scale Routine</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-900">Beginner</h3>
                <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">15 Mins</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
                <li>5 minutes: Long notes</li>
                <li>5 minutes: Middle-octave Sa Re Ga Ma practice</li>
                <li>5 minutes: Ascending and descending scale</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-emerald-900">Intermediate</h3>
                <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">20–30 Mins</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
                <li>5 minutes: Long notes</li>
                <li>10 minutes: Scale and Alankar patterns</li>
                <li>5 minutes: Lower-to-middle register transitions</li>
                <li>5 minutes: Middle-to-upper register transitions</li>
                <li>5 minutes: Scale practice with metronome</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-rose-900">Advanced</h3>
                <span className="text-xs bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">30+ Mins</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
                <li>5 minutes: Tone and long-note work</li>
                <li>10 minutes: Multi-octave scales</li>
                <li>10 minutes: High-speed patterns</li>
                <li>10 minutes: Raga-based scale exercises</li>
                <li>5+ minutes: Improvisation using practiced material</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 10: Practice Progression Roadmap */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <Sliders className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Flute Scales & Octaves: Practice Progression</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { stage: "Stage 1", text: "Learn the basic notes" },
              { stage: "Stage 2", text: "Practice ascending and descending scales" },
              { stage: "Stage 3", text: "Develop middle-octave stability" },
              { stage: "Stage 4", text: "Introduce lower-octave notes" },
              { stage: "Stage 5", text: "Develop upper-octave control" },
              { stage: "Stage 6", text: "Connect two registers smoothly" },
              { stage: "Stage 7", text: "Practice multi-octave patterns" },
              { stage: "Stage 8", text: "Apply scales to Alankars and Ragas" },
              { stage: "Stage 9", text: "Use scale patterns naturally during improvisation" }
            ].map((step, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-bamboo-50/80 border border-bamboo-200/60 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-bamboo-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">{step.stage}</span>
                  <span className="text-xs font-semibold text-gray-800">{step.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 11: FAQs Accordion */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-2">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-bamboo-900 m-0">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-bamboo-200 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-bamboo-950 flex items-center justify-between gap-3 hover:bg-amber-50/50 transition"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-bamboo-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Author & Verified Guide Section */}
      <AboutAuthorSection />

      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "name": "Flute Scales & Octaves: A Complete Guide for Flute Players",
            "description": "Comprehensive guide on flute scales and octaves (Mandra, Madhya, Taar Saptak). Features interactive audio swara voice player, frequency charts, daily scale routines, and step-by-step exercises.",
            "learningResourceType": "Guide",
            "educationalLevel": ["Beginner", "Intermediate", "Advanced"],
            "publisher": {
              "@type": "Organization",
              "name": "FluteSangam"
            }
          })
        }}
      />
    </div>
  );
}
