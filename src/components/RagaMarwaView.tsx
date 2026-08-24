import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Sunset, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Radio, Award, Sparkles, ShieldAlert, Lightbulb, RotateCcw, ArrowLeft, Sun,
  User, RefreshCw
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';

interface RagaMarwaViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaMarwaView({ onViewChange }: RagaMarwaViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [activeScale, setActiveScale] = useState<'aaroh' | 'avaroh' | 'general' | 'piece' | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for C Scale (C4 = 261.63 Hz) for Raag Marwa (S, r, G, M^, D, N, S')
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,     // Sa (C4)
    'r': 277.18,     // Komal Re (Db4)
    'G': 329.63,     // Shuddha Ga (E4)
    'M^': 369.99,    // Tivra Ma (F#4)
    'M': 369.99,     // Alias for Tivra Ma
    'D': 440.00,     // Shuddha Dha (A4)
    'N': 493.88,     // Shuddha Ni (B4)
    "S'": 523.25,    // Upper Sa (C5)
    "r'": 554.37,    // Upper Komal Re (Db5)
    "G'": 659.25,    // Upper Shuddha Ga (E5)
    "M^'": 739.99,   // Upper Tivra Ma (F#5)
    "D'": 880.00,    // Upper Shuddha Dha (A5)
    "N.": 246.94,    // Lower Shuddha Ni (B3)
    "D.": 220.00,    // Lower Shuddha Dha (A3)
    "M^.": 184.99,   // Lower Tivra Ma (F#3)
    "G.": 164.81,    // Lower Shuddha Ga (E3)
    "r.": 138.59,    // Lower Komal Re (Db3)
    "S.": 130.81,    // Lower Sa (C3)
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

  const playSwaraTone = (swaraName: string, duration = 0.9, scale: 'aaroh' | 'avaroh' | 'general' | 'piece' = 'general') => {
    try {
      const ctx = getAudioContext();
      const cleanName = swaraName.trim();
      const freq = SWARA_FREQS[cleanName] || 261.63;
      
      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(cleanName);
      setActiveScale(scale);
      setTimeout(() => {
        setActiveSwara(null);
        setActiveScale(null);
      }, duration * 1000);
    } catch (e) {
      console.warn("Audio playback not supported or blocked", e);
    }
  };

  // Play sequence of swaras for Aaroh / Avaroh / Pakad
  const playSequence = (swaraTokens: string[], scale: 'aaroh' | 'avaroh' | 'general') => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    const ctx = getAudioContext();
    let startTime = ctx.currentTime + 0.1;
    const noteDuration = 0.7;

    swaraTokens.forEach((token) => {
      const cleanToken = token.trim();
      if (!cleanToken || cleanToken === '|' || cleanToken === '—') {
        startTime += 0.3;
        return;
      }
      const freq = SWARA_FREQS[cleanToken] || 261.63;

      playBambooFluteTone(ctx, freq, startTime, noteDuration, 0.28);

      setTimeout(() => {
        setActiveSwara(cleanToken);
        setActiveScale(scale);
      }, (startTime - ctx.currentTime) * 1000);

      startTime += noteDuration;
    });

    setTimeout(() => {
      setActiveSwara(null);
      setActiveScale(null);
      setIsPlayingSequence(false);
    }, (startTime - ctx.currentTime) * 1000 + 100);
  };

  // Play Original Composition
  const playComposition = () => {
    if (isPlayingComposition) {
      setIsPlayingComposition(false);
      return;
    }

    setIsPlayingComposition(true);
    const pieceNotes = [
      // Aalap
      'S', 'r', 'G', 'r', 'S',
      'r', 'G', 'M^', 'G', 'r', 'S',
      // Main Phrase
      'r', 'G', 'M^', 'D', 'N', 'D', 'M^', 'G',
      'r', 'G', 'M^', 'D', 'M^', 'G', 'r', 'S',
      // Development
      'G', 'M^', 'D', 'N', "S'", 'N', 'D', 'M^',
      'G', 'M^', 'D', 'M^', 'G', 'r', 'S',
      // Ending
      'r', 'G', 'M^', 'D', 'N', 'D', 'M^', 'G',
      'r', 'G', 'M^', 'G', 'r', 'S'
    ];

    const ctx = getAudioContext();
    let startTime = ctx.currentTime + 0.1;
    const noteDuration = 0.65;

    pieceNotes.forEach((token, index) => {
      const cleanToken = token.trim();
      const freq = SWARA_FREQS[cleanToken] || 261.63;

      playBambooFluteTone(ctx, freq, startTime, noteDuration, 0.26);

      setTimeout(() => {
        setActiveSwara(cleanToken);
        setActiveScale('piece');
      }, (startTime - ctx.currentTime) * 1000);

      // Add a small breather after phrase sections
      if (index === 4 || index === 10 || index === 18 || index === 26 || index === 34 || index === 42) {
        startTime += noteDuration + 0.3;
      } else {
        startTime += noteDuration;
      }
    });

    setTimeout(() => {
      setActiveSwara(null);
      setActiveScale(null);
      setIsPlayingComposition(false);
    }, (startTime - ctx.currentTime) * 1000 + 100);
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

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyNotation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const faqs = [
    {
      q: "Why is Pa omitted completely in Raag Marwa?",
      a: "Omitting Pa creates an open, tense, and floating tonal atmosphere that is signature to Raag Marwa. Removing the grounded anchor of Pa forces the raga's personality to revolve around the distinctive relationship between Komal Re (r) and Tivra Ma (M^)."
    },
    {
      q: "Why is Komal Re so critical in Marwa?",
      a: "Komal Re is the Vadi (king) note of Marwa. Its precise pitch placement, delicate sustained presence, and movement toward Sa or Ga give Marwa its serious, contemplative, and slightly restless emotional weight."
    },
    {
      q: "How does Raag Marwa differ from Raag Puriya and Raag Shri?",
      a: "While Marwa, Puriya, and Shri share similar note pools (Komal Re & Tivra Ma), Marwa emphasizes Komal Re and Dha with Vadi Re / Samvadi Dha. Puriya emphasizes Ga and Ni with Vadi Ga / Samvadi Ni. Shri includes Pa and uses aggressive glides to Komal Re."
    },
    {
      q: "What flute key is recommended for practicing Raag Marwa?",
      a: "An E Bass or C Medium Bansuri is ideal for Raag Marwa. The deeper, resonant bass notes beautifully complement Marwa's contemplative, late-afternoon mood."
    },
    {
      q: "How do I ensure Tivra Ma sounds correct on the Bansuri?",
      a: "Tivra Ma (M^) is played by half-opening or partially un-covering the hole that corresponds to Ma. Practice holding Tivra Ma against a Tanpura tuned to Sa-Pa or Sa-Ma to build rock-solid intonation."
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50/40 text-gray-800 pb-20 font-sans">
      {/* Top Banner Navigation */}
      <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-neutral-900 text-amber-100 py-3 px-4 border-b border-amber-800/40 sticky top-0 z-30 shadow-md backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onViewChange ? onViewChange('learn_raagas') : window.history.back()}
            className="flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-white transition group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Raagas</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="hidden sm:inline">Advanced Raga Masterclass:</span>
            <span className="text-white">Raag Marwa</span>
          </div>

          <button
            onClick={() => onViewChange && onViewChange('learn_dashboard')}
            className="text-xs text-amber-200/80 hover:text-amber-100 flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Learn Portal</span>
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/90 via-orange-50 to-rose-50/70 text-bamboo-950 py-10 sm:py-12 px-4 sm:px-6 shadow-sm border-b border-amber-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <span className="bg-rose-100 text-rose-900 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-rose-700" />
              Advanced Level
            </span>
            <span className="bg-amber-200/90 text-amber-900 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Sunset className="w-3.5 h-3.5 text-amber-700" />
              Late Afternoon / Sunset (4 PM – 7 PM)
            </span>
            <span className="bg-purple-100 text-purple-900 border border-purple-200 px-3 py-1 rounded-full shadow-2xs">
              Shadav - Shadav (6 Notes, Pa Omitted)
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-bamboo-950">
              Raag Marwa — Notes, Aaroh, Avaroh, Pakad & Practice
            </h1>
            <p className="text-stone-700 text-sm sm:text-base max-w-3xl leading-relaxed">
              Explore the serious, contemplative, and restlessly meditative atmosphere of Raag Marwa. Master its trademark combination of Komal Re and Tivra Ma, controlled pauses, and an exclusive FluteSangam Original Learning Piece.
            </p>

            {/* Article Date & Author Metadata Bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-amber-900/90 pt-2">
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1 rounded-lg shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Published: <strong className="text-bamboo-950 font-semibold">August 9, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1 rounded-lg shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-rose-700" />
                <span>Updated: <strong className="text-bamboo-950 font-semibold">August 9, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1 rounded-lg shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Reading Time: <strong className="text-bamboo-950 font-semibold">12 min read</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-800/40">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-[11px] font-medium text-amber-300/80 uppercase tracking-wider">Vadi (King Note)</div>
              <div className="text-lg font-bold text-rose-300 font-display flex items-center gap-1 mt-0.5">
                <span>Komal Re (r)</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-[11px] font-medium text-amber-300/80 uppercase tracking-wider">Samvadi (Queen)</div>
              <div className="text-lg font-bold text-amber-200 font-display mt-0.5">
                Shuddha Dha (D)
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-[11px] font-medium text-amber-300/80 uppercase tracking-wider">Omitted Swara</div>
              <div className="text-lg font-bold text-rose-400 font-display mt-0.5">
                Pancham (Pa)
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-[11px] font-medium text-amber-300/80 uppercase tracking-wider">Primary Mood</div>
              <div className="text-lg font-bold text-amber-100 font-display mt-0.5">
                Serious, Introspective
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* 1. Introduction Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-800 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Introduction to Raag Marwa</h2>
              <p className="text-xs text-gray-500">Overview, Emotional Weight & Flute Significance</p>
            </div>
          </div>

          <div className="prose prose-amber max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-3">
            <p>
              <strong>Raag Marwa</strong> is a distinctive Hindustani classical raga known for its serious, contemplative, and slightly tense emotional character. It is especially recognized for the combination of <strong>Komal Re</strong> and <strong>Tivra Ma</strong>, while <strong>Pa is omitted</strong> entirely.
            </p>
            <p>
              For flute players, Marwa is an advanced raga because its character depends heavily on precise swara placement, controlled pauses, and careful phrase development. Simply playing its notes as a scale does not capture the personality of the raga.
            </p>
            <p>
              Marwa is traditionally associated with the <strong>late afternoon and approaching sunset</strong> (around 4 PM to 7 PM), making it an excellent raga for developing expressive and nuanced flute playing.
            </p>
          </div>
        </section>

        {/* 2. Swaras & Notation Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Notes & Swara Structure</h2>
                <p className="text-xs text-gray-500">6 Swaras — Shadav-Shadav Jati (Pa is omitted)</p>
              </div>
            </div>
            <div className="text-xs font-semibold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full border border-amber-200">
              Swara Notation: S r G M^ D N S'
            </div>
          </div>

          {/* Interactive Swara Key Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { note: 'Sa', code: 'S', type: 'Shuddha', desc: 'Root Base Tone', status: 'Active' },
              { note: 'Re', code: 'r', type: 'Komal', desc: 'Vadi (King Note)', status: 'Flat (Komal)' },
              { note: 'Ga', code: 'G', type: 'Shuddha', desc: 'Natural Third', status: 'Active' },
              { note: 'Ma', code: 'M^', type: 'Tivra', desc: 'Sharp Fourth', status: 'Sharp (Tivra)' },
              { note: 'Dha', code: 'D', type: 'Shuddha', desc: 'Samvadi (Queen)', status: 'Active' },
              { note: 'Ni', code: 'N', type: 'Shuddha', desc: 'Natural Seventh', status: 'Active' },
            ].map((swara) => (
              <button
                key={swara.code}
                onClick={() => playSwaraTone(swara.code, 1.0, 'general')}
                className={`p-3.5 rounded-2xl border text-left transition transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
                  activeSwara === swara.code 
                    ? 'bg-rose-900 text-white border-rose-700 shadow-md scale-105' 
                    : swara.type === 'Komal' 
                    ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/80 text-rose-950'
                    : swara.type === 'Tivra'
                    ? 'bg-amber-50 border-amber-300 hover:bg-amber-100/80 text-amber-950'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold opacity-80 uppercase tracking-wider">
                    <span>{swara.note}</span>
                    <span>{swara.type}</span>
                  </div>
                  <div className="text-2xl font-black font-display my-1">{swara.code}</div>
                </div>
                <div className="text-[10px] opacity-75 font-medium flex items-center justify-between">
                  <span>{swara.desc}</span>
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Key Tonal Characteristic:</span>
            </p>
            <p className="leading-relaxed">
              The absence of Pa and the deliberate juxtaposition of Komal Re (r) and Tivra Ma (M^) give Raag Marwa its unmistakable tension, depth, and restless contemplative beauty.
            </p>
          </div>
        </section>

        {/* 3. Aaroh, Avaroh & Pakad Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aaroh Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-100 px-3 py-1 rounded-full">
                  Ascending Movement
                </span>
                <button
                  onClick={() => playSequence(['S', 'r', 'G', 'M^', 'D', 'N', "S'"], 'aaroh')}
                  disabled={isPlayingSequence}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Aaroh</span>
                </button>
              </div>

              <h3 className="text-xl font-bold font-display text-gray-900">Aaroh (Ascent)</h3>
              
              <div className="bg-neutral-900 text-amber-200 p-4 rounded-2xl font-mono text-lg font-bold tracking-widest text-center shadow-inner">
                S r G M^ D N S'
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Swara Sequence:</strong> Sa – Komal Re – Shuddha Ga – Tivra Ma – Shuddha Dha – Shuddha Ni – Upper Sa
              </p>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <strong>Practice Tip:</strong> Practice the Aaroh slowly. Pay particular attention to the movement around Komal Re and Tivra Ma.
            </p>
          </div>

          {/* Avaroh Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
                  Descending Movement
                </span>
                <button
                  onClick={() => playSequence(["S'", 'N', 'D', 'M^', 'G', 'r', 'S'], 'avaroh')}
                  disabled={isPlayingSequence}
                  className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Avaroh</span>
                </button>
              </div>

              <h3 className="text-xl font-bold font-display text-gray-900">Avaroh (Descent)</h3>

              <div className="bg-neutral-900 text-amber-200 p-4 rounded-2xl font-mono text-lg font-bold tracking-widest text-center shadow-inner">
                S' N D M^ G r S
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Swara Sequence:</strong> Upper Sa – Shuddha Ni – Shuddha Dha – Tivra Ma – Shuddha Ga – Komal Re – Sa
              </p>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <strong>Practice Tip:</strong> The Avaroh should be practiced with the same attention to phrase shape rather than as a simple descending scale.
            </p>
          </div>
        </div>

        {/* 4. Pakad Phrases Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Pakad (Characteristic Catch Phrases)</h2>
              <p className="text-xs text-gray-500">The core melodic identity of Raag Marwa</p>
            </div>
            <button
              onClick={() => handleCopyNotation("r G M^ D | N D M^ G | r S", "pakad")}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pakad' ? 'Copied!' : 'Copy Notation'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-900 text-white rounded-2xl p-5 space-y-3 shadow-sm border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Primary Pakad Phrase</span>
                <button
                  onClick={() => playSequence(['r', 'G', 'M^', 'D', 'N', 'D', 'M^', 'G', 'r', 'S'], 'general')}
                  disabled={isPlayingSequence}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-lg transition flex items-center gap-1"
                >
                  <Play className="w-3 h-3" /> Play
                </button>
              </div>
              <p className="font-mono text-lg font-bold text-amber-200 tracking-wider">
                r G M^ D | N D M^ G | r S
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Graceful movement from Komal Re through Tivra Ma to Dha, returning through Tivra Ma and Komal Re to Sa.
              </p>
            </div>

            <div className="bg-stone-900 text-white rounded-2xl p-5 space-y-3 shadow-sm border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Secondary Pakad Phrase</span>
                <button
                  onClick={() => playSequence(['G', 'r', 'S', 'r', 'G', 'M^', 'D', 'N', 'D', 'M^', 'G', 'r'], 'general')}
                  disabled={isPlayingSequence}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-lg transition flex items-center gap-1"
                >
                  <Play className="w-3 h-3" /> Play
                </button>
              </div>
              <p className="font-mono text-lg font-bold text-amber-200 tracking-wider">
                G r S | r G M^ D | N D M^ G r
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Practice these slowly and listen carefully to the relationship between Re, Ga, and Tivra Ma.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Time of Performance, Vadi & Samvadi */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl w-fit">
              <Sunset className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-gray-900">Time of Performance</h3>
            <p className="text-sm font-semibold text-rose-800">Late Afternoon / Sunset (4 PM – 7 PM)</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Raag Marwa is traditionally associated with the late afternoon, particularly around the period approaching sunset. Its unusual combination of swaras creates a distinctive atmosphere that works especially well during this time.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-3">
            <div className="p-2.5 bg-rose-100 text-rose-800 rounded-2xl w-fit">
              <CrownIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-gray-900">Vadi & Samvadi</h3>
            <div className="space-y-1 text-sm font-semibold">
              <p className="text-rose-800">Vadi (Principal): Komal Re (r)</p>
              <p className="text-amber-800">Samvadi (Second): Shuddha Dha (D)</p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Komal Re is particularly important to the identity of Marwa, while Dha also has an important role in its melodic development.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-3">
            <div className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-gray-900">Emotional Rasa</h3>
            <p className="text-sm font-semibold text-purple-900">Contemplative, Restless & Deep</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Marwa creates a serious, introspective, and somewhat restless quality that evokes deep reflection during dusk.
            </p>
          </div>
        </section>

        {/* 6. Characteristics of Raag Marwa */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Characteristics of Raag Marwa</h2>
              <p className="text-xs text-gray-500">5 Essential Grammatical Rules for Flute Players</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                num: "1",
                title: "Komal Re",
                desc: "Komal Re is one of the most important swaras in Marwa. Its treatment requires careful intonation and stable breath pressure."
              },
              {
                num: "2",
                title: "Tivra Ma",
                desc: "Tivra Ma provides a distinctive brightness and tension within the raga, juxtaposed sharply against Komal Re."
              },
              {
                num: "3",
                title: "Pa Is Omitted",
                desc: "The absence of Pa creates an open and unusual tonal space. Flutists must avoid accidentally introducing Pa while improvising."
              },
              {
                num: "4",
                title: "Serious and Contemplative Character",
                desc: "Marwa has a serious, introspective, and somewhat restless quality that shines through controlled, expressive playing."
              },
              {
                num: "5",
                title: "Importance of Phrase Movement",
                desc: "Marwa should be understood through its characteristic melodic movements rather than simply through its Aaroh and Avaroh scale."
              }
            ].map((char) => (
              <div key={char.num} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-2 flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-amber-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {char.num}
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm font-display">{char.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{char.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Step-by-Step Practice Routines */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-800 rounded-2xl">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Step-by-Step Practice Exercises</h2>
                <p className="text-xs text-gray-500">6 Guided Daily Practice Routines for Bansuri</p>
              </div>
            </div>

            {/* Practice Timer Interactive Tool */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-700" />
              <div className="text-xs">
                <div className="font-bold text-amber-900">Practice Timer</div>
                <div className="font-mono font-bold text-amber-700">{formatTimer(timerSeconds)}</div>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(45 * 60); }}
                className="p-1 text-amber-700 hover:text-amber-900 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                step: "Practice 1",
                title: "Basic Notes",
                notation: "Ascent: S – r – G – M^ – D – N – S'\nDescent: S' – N – D – M^ – G – r – S",
                advice: "Start slowly. Listen carefully to the pitch of Komal Re and Tivra Ma.",
                sequence: ['S', 'r', 'G', 'M^', 'D', 'N', "S'"]
              },
              {
                step: "Practice 2",
                title: "Komal Re Control",
                notation: "Phrase A: S – r – S\nPhrase B: r – G – r – S",
                advice: "Try to make Komal Re stable, steady, and expressive.",
                sequence: ['S', 'r', 'S', 'r', 'G', 'r', 'S']
              },
              {
                step: "Practice 3",
                title: "Tivra Ma",
                notation: "Phrase A: G – M^ – G\nPhrase B: r – G – M^ – G – r",
                advice: "Make sure Tivra Ma is clearly distinguished from Shuddha Ma.",
                sequence: ['G', 'M^', 'G', 'r', 'G', 'M^', 'G', 'r']
              },
              {
                step: "Practice 4",
                title: "Pa Awareness (Avoiding Pa)",
                notation: "Movement 1: G – M^ – D\nMovement 2: D – M^ – G",
                advice: "Because Pa is omitted from Marwa, practice jumping directly between M^ and D.",
                sequence: ['G', 'M^', 'D', 'D', 'M^', 'G']
              },
              {
                step: "Practice 5",
                title: "Pakad Routine",
                notation: "r G M^ D | N D M^ G | r S",
                advice: "Repeat slowly before creating your own melodic variations.",
                sequence: ['r', 'G', 'M^', 'D', 'N', 'D', 'M^', 'G', 'r', 'S']
              },
              {
                step: "Practice 6",
                title: "Aalap Phrases",
                notation: "1: S — r G — r S\n2: r G M^ — G r\n3: G M^ D — N D M^\n4: M^ G r — S",
                advice: "Leave enough space between phrases to allow the character of the raga to develop.",
                sequence: ['S', 'r', 'G', 'r', 'S', 'r', 'G', 'M^', 'G', 'r']
              }
            ].map((p, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {p.step}
                    </span>
                    <button
                      onClick={() => playSequence(p.sequence, 'general')}
                      disabled={isPlayingSequence}
                      className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play Audio</span>
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm font-display">{p.title}</h3>
                  <div className="bg-stone-900 text-amber-200 p-3 rounded-xl font-mono text-xs whitespace-pre-line leading-relaxed">
                    {p.notation}
                  </div>
                </div>
                <p className="text-xs text-gray-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/80">
                  {p.advice}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Common Mistakes & Flute Solutions */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-800 rounded-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Common Mistakes & Solutions</h2>
              <p className="text-xs text-gray-500">Pitfalls to Avoid When Playing Raag Marwa</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                mistake: "Playing Pa accidentally",
                cause: "Pa is omitted from Marwa and accidentally introducing it can change the raga's character.",
                solution: "Practice passages that move directly between G, M^, and D until your fingers naturally skip Pa."
              },
              {
                mistake: "Treating Komal Re like Shuddha Re",
                cause: "The pitch and treatment of Komal Re are crucial to Marwa's emotional weight.",
                solution: "Practice Re against Sa and Ga slowly with a Tanpura drone."
              },
              {
                mistake: "Playing the Raga like a scale",
                cause: "Correct notes alone do not make the performance sound like Marwa.",
                solution: "Learn characteristic phrases (Pakad) and develop them gradually with steady breath."
              },
              {
                mistake: "Rushing the Aalap",
                cause: "Marwa benefits from space and controlled development.",
                solution: "Use longer notes and deliberate pauses between phrases."
              },
              {
                mistake: "Confusing Tivra Ma with Shuddha Ma",
                cause: "Players familiar with other ragas may accidentally use natural Ma.",
                solution: "Practice the transition G → M^ → D until Tivra Ma becomes comfortable."
              }
            ].map((m, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 md:w-1/2">
                  <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Mistake: {m.mistake}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{m.cause}</p>
                </div>
                <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl md:w-1/2 text-xs text-amber-950 space-y-0.5">
                  <span className="font-bold flex items-center gap-1 text-amber-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    FluteSangam Fix:
                  </span>
                  <p className="leading-relaxed">{m.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. FluteSangam Original Learning Piece Section */}
        <section className="bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-stone-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Exclusive Practice Notation
                </span>
                <span className="text-xs text-amber-400 font-bold">Original Composition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-amber-100">
                FluteSangam Original Learning Piece
              </h2>
              <p className="text-xs text-stone-400">
                Created specifically as a practice composition for Raag Marwa (not a traditional bandish).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={playComposition}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isPlayingComposition ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlayingComposition ? 'Pause Demo' : 'Play Complete Piece'}</span>
              </button>

              <button
                onClick={() => handleCopyNotation(`Aalap:\nS r G — | r S — — |\nr G M^ — | G r S — ||\n\nMain Phrase:\nr G M^ D | N D M^ G |\nr G M^ D | M^ G r S ||\n\nDevelopment:\nG M^ D N | S' N D M^ |\nG M^ D | M^ G r S ||\n\nEnding:\nr G M^ D | N D M^ G |\nr G M^ G r | S — — — ||`, "piece")}
                className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold rounded-xl transition border border-stone-700 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'piece' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSection === 'piece' ? 'Copied' : 'Copy Sheet'}</span>
              </button>
            </div>
          </div>

          {/* Composition Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aalap */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>1. Aalap</span>
                <span className="text-[10px] text-stone-400 font-normal">Play slowly, allow notes to breathe</span>
              </div>
              <div className="font-mono text-base font-bold text-amber-200 space-y-1.5 tracking-widest bg-stone-900 p-3 rounded-xl border border-stone-800">
                <p>S r G — | r S — — |</p>
                <p>r G M^ — | G r S — ||</p>
              </div>
            </div>

            {/* Main Phrase */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>2. Main Phrase</span>
                <span className="text-[10px] text-stone-400 font-normal">Focus on Komal Re & Tivra Ma</span>
              </div>
              <div className="font-mono text-base font-bold text-amber-200 space-y-1.5 tracking-widest bg-stone-900 p-3 rounded-xl border border-stone-800">
                <p>r G M^ D | N D M^ G |</p>
                <p>r G M^ D | M^ G r S ||</p>
              </div>
            </div>

            {/* Development */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>3. Development</span>
                <span className="text-[10px] text-stone-400 font-normal">Upper register control without rushing</span>
              </div>
              <div className="font-mono text-base font-bold text-amber-200 space-y-1.5 tracking-widest bg-stone-900 p-3 rounded-xl border border-stone-800">
                <p>G M^ D N | S' N D M^ |</p>
                <p>G M^ D | M^ G r S ||</p>
              </div>
            </div>

            {/* Ending */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>4. Ending</span>
                <span className="text-[10px] text-stone-400 font-normal">Resolve gently to Sa</span>
              </div>
              <div className="font-mono text-base font-bold text-amber-200 space-y-1.5 tracking-widest bg-stone-900 p-3 rounded-xl border border-stone-800">
                <p>r G M^ D | N D M^ G |</p>
                <p>r G M^ G r | S — — — ||</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/80 p-4 rounded-2xl text-xs text-stone-300 space-y-2">
            <p className="font-bold text-amber-300">How to Practice the Piece:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-300 leading-relaxed">
              <li>Start with the Aalap and practice each phrase slowly.</li>
              <li>Once comfortable, add the Main Phrase section.</li>
              <li>Then practice the Development section, paying particular attention to Tivra Ma and omitting Pa.</li>
              <li>Finally, add the Ending and practice the complete piece without rushing.</li>
            </ul>
          </div>

          <p className="text-[11px] text-stone-500 italic text-center">
            FluteSangam Original Learning Piece: This composition has been newly created for FluteSangam as an original practice piece for Raag Marwa. It is not presented as a traditional composition.
          </p>
        </section>

        {/* 10. Why Learn Raag Marwa & Benefits */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Why Learn Raag Marwa?</h2>
              <p className="text-xs text-gray-500">Key Technical Skills Unlocked for Advanced Flutists</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Learning Marwa helps an advanced flute player develop crucial technique and expressive depth:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Komal Re Accuracy",
              "Tivra Ma Control",
              "Better Intonation",
              "Phrase Awareness",
              "Breath Control",
              "Aalap Development",
              "Controlled Pauses",
              "Expressive Playing",
              "Understanding Raga Identity"
            ].map((skill, i) => (
              <div key={i} className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-center space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                <span className="text-xs font-bold text-amber-950 block">{skill}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600 leading-relaxed pt-2">
            It is particularly valuable for players who are ready to move beyond straightforward melodic patterns and develop more sophisticated control over their flute.
          </p>
        </section>

        {/* 11. Conclusion & FluteSangam Pro Tip */}
        <section className="bg-gradient-to-r from-amber-900 via-rose-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-amber-100">Conclusion & FluteSangam Pro Tip</h2>
          </div>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Raag Marwa is a challenging but rewarding raga. Its identity comes from the unusual combination of Komal Re, Tivra Ma, the omission of Pa, and its distinctive phrase movement. Practice it slowly with a Tanpura drone and give special attention to Re, Tivra Ma, and the spaces between phrases.
          </p>

          <div className="bg-black/30 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              FluteSangam Tip:
            </p>
            <p>
              In Marwa, silence and space can be just as important as the notes themselves. Let the phrases breathe instead of trying to fill every moment with sound.
            </p>
          </div>
        </section>

        {/* 12. FAQ Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-500">Frequently Asked Questions for Raag Marwa</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-stone-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-4 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === index ? <ChevronUp className="w-4 h-4 text-amber-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {activeFaq === index && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 border-t border-stone-200 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 13. Author & Masterclass Section */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
}

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-8-4 8-6-7z" />
      <path d="M4 20h16" />
    </svg>
  );
}
