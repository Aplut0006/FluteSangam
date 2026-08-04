import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaBageshreeViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBageshreeView({ onViewChange }: RagaBageshreeViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,   // Sa
    'R': 293.66,   // Re
    'g': 311.13,   // Komal Ga
    'G': 329.63,   // Shuddha Ga
    'M': 349.23,   // Ma
    'P': 392.00,   // Pa
    'D': 440.00,   // Dha
    'n': 466.16,   // Komal Ni
    'N': 493.88,   // Shuddha Ni
    'S\'': 523.25,  // Upper Sa
    'R\'': 587.33,  // Upper Re
    'g\'': 622.25,  // Upper Komal Ga
    'D.': 220.00,  // Lower Dha
    'n.': 233.08,  // Lower Komal Ni
  };

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

  const playSwaraTone = (swaraName: string, duration = 0.8) => {
    try {
      const ctx = getAudioContext();
      const freq = SWARA_FREQS[swaraName] || 261.63;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Warm flute timbre using triangle wave + gentle lowpass filter
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1300, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      setActiveSwara(swaraName);
      setTimeout(() => setActiveSwara(null), duration * 1000);
    } catch (e) {
      console.warn("Audio playback not supported or blocked", e);
    }
  };

  // Practice Timer hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  // Metronome for Nisha Dhwani composition
  useEffect(() => {
    let beatInterval: any = null;
    if (isPlayingComposition) {
      const intervalMs = (60 / bpm) * 1000;
      beatInterval = setInterval(() => {
        setCurrentBeat(prev => (prev % 16) + 1);
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(beatInterval);
  }, [isPlayingComposition, bpm]);

  const compositionSectionA = `Section A (Teentaal - 16 Beats)
| S  g  M  D | n  D  M  g |
| R  S  -  - | S  g  M  - |

| M  D  n  S' | n  D  M  g |
| R  S  -  - | -  -  -  - |`;

  const compositionSectionB = `Section B
| S' n  D  M | P  M  g  R |
| S  g  M  D | n  S' -  - |

| n  D  M  P | M  g  R  S |
| g  M  D  M | g  R  S  - |`;

  const compositionEnding = `Ending Phrase (Repeat 3 Times)
g M D | M g R | S

Finish on Sam: S`;

  const faqs = [
    {
      q: "Is Raag Bageshree suitable for beginners?",
      a: "Raag Bageshree is generally recommended after learning foundational ragas because it relies heavily on expressive phrasing and controlled note transitions."
    },
    {
      q: "Which notes are Komal?",
      a: "Komal Gandhar (g) and Komal Nishad (n)."
    },
    {
      q: "Which note is the most important?",
      a: "Ma (Madhyam) is the Vadi and serves as the primary point of repose."
    },
    {
      q: "Which flute is suitable for practicing Raag Bageshree?",
      a: "Any properly tuned bansuri can be used. Many adult learners prefer a G Base bansuri for its warm and expressive tone."
    },
    {
      q: "What is the best time to perform Raag Bageshree?",
      a: "Traditionally, it is performed during the late evening or around midnight, depending on the performance tradition."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-8 px-1 sm:px-0" itemScope itemType="https://schema.org/LearningResource">
      {/* Top Header Card */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-gray-500 overflow-x-auto no-scrollbar py-0.5">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-indigo-700 transition cursor-pointer shrink-0"
            >
              Learn
            </button>
            <span className="shrink-0">/</span>
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-indigo-700 transition cursor-pointer shrink-0"
            >
              Classical Ragas
            </button>
            <span className="shrink-0">/</span>
            <span className="text-indigo-900 font-bold shrink-0">Raag Bageshree</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-4 sm:pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200">
                <Moon className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span>Intermediate • Late Night • Kafi Thaat</span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-display text-bamboo-950 tracking-tight leading-tight" itemProp="headline">
                Raag Bageshree: Complete Guide, Notes, Aaroh, Avaroh &amp; Practice
              </h1>
            </div>

            {/* Practice Timer Widget - Optimized for Mobile Header */}
            <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-row sm:flex-col items-center justify-between sm:justify-center shrink-0 w-full sm:w-auto sm:min-w-[180px] shadow-sm">
              <div className="text-left sm:text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block">Daily Practice Timer</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300">{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3.5 py-2 sm:px-3 sm:py-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-bamboo-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer touch-manipulation min-h-[40px] sm:min-h-[32px] shrink-0"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
                <span>{isTimerRunning ? 'Pause' : 'Start 45m'}</span>
              </button>
            </div>
          </div>

          {/* Published & Verified Signals */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Published: </span>
              <time itemProp="datePublished" dateTime="2026-08-04" className="font-bold text-gray-800">
                Aug 4, 2026
              </time>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Verified Guide</span>
            </div>
            <span>•</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              FluteSangam Verified
            </span>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Introduction</span>
        </h2>

        <div className="prose prose-bamboo max-w-none text-xs sm:text-base text-gray-700 leading-relaxed space-y-3 font-sans">
          <p>
            Raag Bageshree is one of the most expressive and emotionally rich ragas in Hindustani Classical Music. It belongs to the Kafi Thaat and is admired for its calm, romantic, and introspective character. The raga is frequently performed in vocal concerts, bansuri recitals, sitar performances, and light classical music.
          </p>
          <p>
            Raag Bageshree emphasizes emotional expression over speed. For flute players, it is an excellent raga for developing smooth breath control, meend (glides), and musical phrasing. Students generally begin learning Bageshree after becoming comfortable with ragas such as Bhoopali, Yaman, Bilawal, and Kafi.
          </p>
        </div>
      </section>

      {/* Basic Information Table Grid */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Basic Information</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Raga Name', value: 'Bageshree' },
            { label: 'Thaat', value: 'Kafi' },
            { label: 'Jati', value: 'Audav – Sampurna' },
            { label: 'Time', value: 'Late Night (9 PM – 12 AM)' },
            { label: 'Vadi', value: 'Ma (Madhyam)' },
            { label: 'Samvadi', value: 'Sa (Shadja)' },
            { label: 'Nature', value: 'Romantic, peaceful' },
            { label: 'Rasa', value: 'Shringar, Karuna, Bhakti' },
            { label: 'Difficulty', value: 'Intermediate' },
          ].map((item, idx) => (
            <div key={idx} className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-2.5 sm:p-3.5 space-y-0.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-700 block">{item.label}</span>
              <span className="text-xs sm:text-sm font-bold text-bamboo-950 block leading-tight">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Swaras Used Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Music className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Swaras Used in Raag Bageshree</span>
        </h2>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-800 font-sans">
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100">
              <span className="w-7 h-7 bg-indigo-100 text-indigo-900 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">S</span>
              <span><strong>Sa (S)</strong> — Primary Tonic / Home note</span>
            </li>
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100">
              <span className="w-7 h-7 bg-indigo-100 text-indigo-900 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">R</span>
              <span><strong>Re (R)</strong> — Used mainly in descent &amp; phrases</span>
            </li>
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100">
              <span className="w-7 h-7 bg-amber-200 text-amber-950 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">g</span>
              <span><strong>Komal Ga (g)</strong> — Soft flat third interval</span>
            </li>
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100">
              <span className="w-7 h-7 bg-indigo-900 text-amber-300 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">M</span>
              <span><strong>Ma (M)</strong> — Vadi Swara (King Note / Main Repose)</span>
            </li>
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100">
              <span className="w-7 h-7 bg-gray-100 text-gray-700 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">P</span>
              <span><strong>Pa (P)</strong> — Used sparingly in traditional phrases</span>
            </li>
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100">
              <span className="w-7 h-7 bg-indigo-100 text-indigo-900 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">D</span>
              <span><strong>Dha (D)</strong> — Shuddha Dhaivata</span>
            </li>
            <li className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100 sm:col-span-2 md:col-span-1">
              <span className="w-7 h-7 bg-amber-200 text-amber-950 font-mono font-bold rounded-lg flex items-center justify-center shrink-0">n</span>
              <span><strong>Komal Ni (n)</strong> — Soft flat seventh interval</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Aaroh, Avaroh, Pakad & Chalan with Interactive Audio Player */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-3">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
            <span>Aaroh, Avaroh, Pakad &amp; Chalan</span>
          </h2>
          <span className="text-[11px] sm:text-xs text-gray-500 italic">Tap swara buttons for flute audio tone</span>
        </div>

        {/* Aaroh Card */}
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-indigo-900 uppercase tracking-wider">Aaroh (Ascending Scale)</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">Audav (5 Notes)</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
            {['S', 'g', 'M', 'D', 'n', "S'"].map((swara, idx) => (
              <button
                key={idx}
                onClick={() => playSwaraTone(swara)}
                className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl font-mono text-sm sm:text-base font-bold transition flex items-center gap-1 cursor-pointer touch-manipulation min-h-[44px] active:scale-95 ${
                  activeSwara === swara
                    ? 'bg-amber-500 text-bamboo-950 scale-105 shadow-md'
                    : 'bg-white text-indigo-950 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <span>{swara}</span>
                <Volume2 className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-indigo-900/80 pt-1">Notice: Re and Pa are omitted in ascent.</p>
        </div>

        {/* Avaroh Card */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-900 uppercase tracking-wider">Avaroh (Descending Scale)</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Sampurna (7 Notes)</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
            {["S'", 'n', 'D', 'M', 'P', 'M', 'g', 'R', 'S'].map((swara, idx) => (
              <button
                key={idx}
                onClick={() => playSwaraTone(swara)}
                className={`px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl font-mono text-xs sm:text-base font-bold transition flex items-center gap-1 cursor-pointer touch-manipulation min-h-[44px] active:scale-95 ${
                  activeSwara === swara
                    ? 'bg-amber-500 text-bamboo-950 scale-105 shadow-md'
                    : 'bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>{swara}</span>
                <Volume2 className="w-3 h-3 opacity-60 shrink-0" />
              </button>
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-900/80 pt-1">Notice: All 7 swaras are used in descent.</p>
        </div>

        {/* Pakad Card */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider">Pakad (Signature Catchphrase)</span>
            <button
              onClick={() => copyToClipboard("g M D | n D M | g R S", "pakad")}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Pakad</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
            <p className="text-indigo-950">g M D &nbsp;|&nbsp; n D M &nbsp;|&nbsp; g R S</p>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Alternative Variation:</span>
              <p className="text-indigo-900">S g M &nbsp;|&nbsp; D n D &nbsp;|&nbsp; M g R S</p>
            </div>
          </div>
        </div>

        {/* Chalan Card */}
        <div className="bg-bamboo-50/60 border border-bamboo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-bamboo-950 uppercase tracking-wider">Chalan (Melodic Progression)</span>
            <button
              onClick={() => copyToClipboard("S g M | D n S' | n D M | P M | g R | S\ng M D | n D M | g R S", "chalan")}
              className="text-xs text-bamboo-800 hover:text-bamboo-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-bamboo-100/60"
            >
              {copiedSection === 'chalan' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Chalan</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-bamboo-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-2 leading-relaxed overflow-x-auto scrollbar-thin">
            <p className="text-indigo-950">S g M &nbsp;|&nbsp; D n S' &nbsp;|&nbsp; n D M &nbsp;|&nbsp; P M &nbsp;|&nbsp; g R &nbsp;|&nbsp; S</p>
            <p className="text-indigo-900">g M D &nbsp;|&nbsp; n D M &nbsp;|&nbsp; g R S</p>
          </div>
        </div>
      </section>

      {/* Important Characteristics */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Important Characteristics</span>
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-800 font-sans">
          {[
            'Komal Ga (g) and Komal Ni (n) define the emotional identity of the raga.',
            'Ma (Madhyam) is the Vadi swara and serves as the most important resting note.',
            'Pa (Pancham) is generally used with restraint and subtle placement.',
            'Smooth meend (glides) between notes enhances the aesthetic beauty.',
            'The emotional character and depth are far more important than speed.'
          ].map((text, idx) => (
            <li key={idx} className="bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mood and Emotion & Why Learn */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Mood and Emotion */}
        <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-purple-950 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600 shrink-0" />
            <span>Mood and Emotion (Rasa)</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Raag Bageshree beautifully expresses:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-sans">
            {['Love (Shringar)', 'Devotion (Bhakti)', 'Peace (Shanti)', 'Longing & Yearning', 'Compassion (Karuna)', 'Emotional Depth'].map((mood, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                <span>{mood}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-purple-900 italic pt-2 border-t border-purple-100">
            Its soft and reflective mood makes it ideal for late-night performances.
          </p>
        </div>

        {/* Why Learn Raag Bageshree? */}
        <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-blue-950 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Why Learn Raag Bageshree?</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-sans">
            {[
              'Develops highly expressive bansuri flute playing.',
              'Improves smooth meend (glides) and note connection.',
              'Strengthens steady breath control and air-pressure management.',
              'Introduces deeper emotional phrasing in Kafi Thaat.',
              'Builds confidence in slow, meditative, melodic improvisation.'
            ].map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Beginner Practice Routine */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Repeat className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Beginner Practice Routine</span>
        </h2>

        {/* Long Notes & Aaroh-Avaroh Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">1. Long Notes Practice</h3>
            <p className="text-xs text-gray-600">Hold each note for 8–10 seconds while maintaining a steady tone:</p>
            <p className="font-mono text-sm sm:text-base font-bold text-bamboo-950 bg-white p-2.5 rounded-xl border border-amber-200">
              S &nbsp; g &nbsp; M &nbsp; D &nbsp; n &nbsp; S'
            </p>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-2xl p-4 space-y-2">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">2. Aaroh–Avaroh Repetition</h3>
            <p className="text-xs text-gray-600">Practice slowly 10–15 times with tanpura drone:</p>
            <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 bg-white p-2.5 rounded-xl border border-indigo-200 space-y-1">
              <p>Ascending: S g M D n S'</p>
              <p>Descending: S' n D M P M g R S</p>
            </div>
          </div>
        </div>

        {/* FluteSangam Original Alankars */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base sm:text-lg font-bold text-bamboo-950 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <span>FluteSangam Original Alankars for Bageshree</span>
          </h3>

          {/* Alankar 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">FluteSangam Original Alankar 1</span>
              <span className="text-[11px] font-bold text-gray-500">2-Note Movement</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 overflow-x-auto scrollbar-thin">
              <p><span className="text-gray-500 font-sans font-normal">Ascending:</span> S g &nbsp;|&nbsp; g M &nbsp;|&nbsp; M D &nbsp;|&nbsp; D n &nbsp;|&nbsp; n S'</p>
              <p><span className="text-gray-500 font-sans font-normal">Descending:</span> S' n &nbsp;|&nbsp; n D &nbsp;|&nbsp; D M &nbsp;|&nbsp; M g &nbsp;|&nbsp; g R &nbsp;|&nbsp; R S</p>
            </div>
          </div>

          {/* Alankar 2 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">FluteSangam Original Alankar 2</span>
              <span className="text-[11px] font-bold text-gray-500">3-Note Triplet Pattern</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 overflow-x-auto scrollbar-thin">
              <p><span className="text-gray-500 font-sans font-normal">Ascending:</span> S g M &nbsp;|&nbsp; g M D &nbsp;|&nbsp; M D n &nbsp;|&nbsp; D n S'</p>
              <p><span className="text-gray-500 font-sans font-normal">Descending:</span> S' n D &nbsp;|&nbsp; n D M &nbsp;|&nbsp; D M g &nbsp;|&nbsp; M g R &nbsp;|&nbsp; g R S</p>
            </div>
          </div>

          {/* Alankar 3 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">FluteSangam Original Alankar 3</span>
              <span className="text-[11px] font-bold text-gray-500">4-Note Winding Pattern</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 overflow-x-auto scrollbar-thin">
              <p><span className="text-gray-500 font-sans font-normal">Ascending:</span> S g M g &nbsp;|&nbsp; g M D M &nbsp;|&nbsp; M D n D &nbsp;|&nbsp; D n S' n</p>
              <p><span className="text-gray-500 font-sans font-normal">Descending:</span> S' n D n &nbsp;|&nbsp; n D M D &nbsp;|&nbsp; D M g M &nbsp;|&nbsp; g R S</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes & Tips */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Common Mistakes */}
        <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-rose-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Common Mistakes to Avoid</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing the raga too fast.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Ignoring Komal Ga and Komal Ni.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Giving too much emphasis to Pa.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing every note with equal weight instead of emphasizing Ma.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Missing smooth transitions between notes.</span>
            </li>
          </ul>
        </div>

        {/* Performance Tips */}
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-emerald-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Tips for Better Performance</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-sans">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Practice with a tanpura drone.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Focus on smooth airflow.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Spend extra time sustaining Ma.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Develop gentle meend between important notes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Prioritize expression over speed.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FluteSangam Original Practice Piece: Nisha Dhwani */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6" id="practice-composition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full mb-1.5 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Original Practice Piece</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-display text-bamboo-950 leading-tight">
              Nisha Dhwani (Melody of the Night)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Raag: Bageshree • Taal: Teentaal (16 Beats) • Tempo: Madhya Laya
            </p>
          </div>

          {/* Interactive Metronome Control */}
          <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center shrink-0 w-full sm:w-auto sm:min-w-[220px]">
            <div className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Teentaal Metronome Guide</span>
            </div>

            <div className="flex items-center gap-4 my-1.5 sm:my-2">
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-9 h-9 bg-white border border-indigo-200 rounded-lg text-sm font-bold active:scale-95 hover:bg-indigo-100 flex items-center justify-center cursor-pointer touch-manipulation shadow-xs"
              >
                -
              </button>
              <span className="font-mono text-base sm:text-lg font-bold text-bamboo-950 min-w-[70px] text-center">{bpm} BPM</span>
              <button
                onClick={() => setBpm(Math.min(140, bpm + 5))}
                className="w-9 h-9 bg-white border border-indigo-200 rounded-lg text-sm font-bold active:scale-95 hover:bg-indigo-100 flex items-center justify-center cursor-pointer touch-manipulation shadow-xs"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[44px] active:scale-95 ${
                isPlayingComposition ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-indigo-700 text-white hover:bg-indigo-800'
              }`}
            >
              {isPlayingComposition ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0" />}
              <span>{isPlayingComposition ? `Beat ${currentBeat} / 16` : 'Start Metronome'}</span>
            </button>
          </div>
        </div>

        {/* Composition Notation Display */}
        <div className="space-y-4 sm:space-y-6">
          {/* Section A */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
                Section A
              </h3>
              <button
                onClick={() => copyToClipboard(compositionSectionA, 'section_a')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'section_a' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Section A</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S  g  M  D | n  D  M  g |</p>
              <p>| R  S  -  - | S  g  M  - |</p>
              <br />
              <p>| M  D  n  S' | n  D  M  g |</p>
              <p>| R  S  -  - | -  -  -  - |</p>
            </div>
          </div>

          {/* Section B */}
          <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-indigo-900 uppercase tracking-wider">
                Section B
              </h3>
              <button
                onClick={() => copyToClipboard(compositionSectionB, 'section_b')}
                className="text-xs text-indigo-800 hover:text-indigo-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-indigo-100/60"
              >
                {copiedSection === 'section_b' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Section B</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-indigo-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S' n  D  M | P  M  g  R |</p>
              <p>| S  g  M  D | n  S' -  - |</p>
              <br />
              <p>| n  D  M  P | M  g  R  S |</p>
              <p>| g  M  D  M | g  R  S  - |</p>
            </div>
          </div>

          {/* Ending Phrase */}
          <div className="bg-bamboo-50/60 border border-bamboo-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider">
                Ending Phrase (Tihai - Repeat 3 Times)
              </h3>
              <button
                onClick={() => copyToClipboard(compositionEnding, 'ending')}
                className="text-xs text-bamboo-800 hover:text-bamboo-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-bamboo-100/60"
              >
                {copiedSection === 'ending' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Ending</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-bamboo-200/80 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] sm:text-xs font-sans text-gray-500 font-semibold uppercase">Repeat 3 times:</p>
              <p className="text-indigo-900">g M D &nbsp;|&nbsp; M g R &nbsp;|&nbsp; S</p>
              <p className="text-[11px] sm:text-xs font-sans text-gray-500 font-semibold uppercase pt-2">Finish on Sam:</p>
              <p className="text-emerald-800 text-lg sm:text-xl font-bold">S</p>
            </div>
          </div>
        </div>

        {/* How to Practice Steps */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>How to Practice "Nisha Dhwani"</span>
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
            {[
              'Practice long notes.',
              'Repeat the Aaroh and Avaroh.',
              'Practice the Pakad slowly.',
              'Play each Alankar five times.',
              'Learn Section A.',
              'Practice Section B separately.',
              'Join both sections.',
              'End with the concluding phrase.',
              'Begin around 50 BPM and increase gradually.'
            ].map((step, idx) => (
              <li key={idx} className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200/60 flex items-start gap-2">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-900 font-bold rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Daily Routine Schedule */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Suggested Daily Practice Routine</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { exercise: 'Long Notes', time: '5 minutes' },
            { exercise: 'Aaroh–Avaroh', time: '5 minutes' },
            { exercise: 'Pakad', time: '5 minutes' },
            { exercise: 'Alankars', time: '10 minutes' },
            { exercise: 'Practice Piece (Nisha Dhwani)', time: '10 minutes' },
            { exercise: 'Free Improvisation', time: '10 minutes' }
          ].map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-bamboo-950">{item.exercise}</span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
        <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs mt-2">
          <span className="text-xs sm:text-sm font-bold">Total Practice Time:</span>
          <span className="text-base sm:text-lg font-mono font-bold text-amber-300">45 minutes</span>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden transition">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-3.5 sm:p-4 bg-gray-50/80 hover:bg-gray-100 transition font-bold text-xs sm:text-sm text-bamboo-950 flex items-center justify-between gap-3 cursor-pointer touch-manipulation min-h-[44px]"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-3.5 sm:p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Ragas */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-700 shrink-0" />
          <span>Related Ragas</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            { name: 'Raag Kafi', view: 'raga_kafi' as AppView },
            { name: 'Raag Yaman', view: 'raga_yaman' as AppView },
            { name: 'Raag Desh', view: 'raga_desh' as AppView },
            { name: 'Raag Durga', view: 'raga_durga' as AppView },
            { name: 'Raag Bilawal', view: 'raga_bilawal' as AppView },
          ].map((raga, idx) => (
            <button
              key={idx}
              onClick={() => onViewChange?.(raga.view)}
              className="p-2.5 sm:p-3 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl sm:rounded-2xl text-center font-bold text-xs text-indigo-900 transition flex items-center justify-center gap-1 cursor-pointer touch-manipulation min-h-[44px]"
            >
              <span>{raga.name}</span>
              <ArrowRight className="w-3 h-3 text-indigo-600 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />

      {/* Copyright & Educational Notice */}
      <footer className="text-center text-xs text-gray-500 space-y-2 pt-4 border-t border-gray-200">
        <p className="font-bold text-gray-700">© FluteSangam Original Content</p>
        <p className="max-w-2xl mx-auto leading-relaxed text-[11px] sm:text-xs">
          This article, including the explanations, practice routines, alankars, FAQs, and the "Nisha Dhwani" practice piece, has been created exclusively for FluteSangam as original educational content. The practice piece is intended to help learners become familiar with the note set and basic melodic movements associated with Raag Bageshree. It is an original educational exercise and is not presented as a traditional bandish or a classical composition.
        </p>
      </footer>
    </div>
  );
}
