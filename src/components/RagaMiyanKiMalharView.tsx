import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Award, 
  Music, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  CloudRain, 
  AlertTriangle,
  Calendar,
  User,
  Heart
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface RagaMiyanKiMalharViewProps {
  onViewChange?: (view: AppView) => void;
}

// Frequency map for Miyan Ki Malhar notes
const SWARA_FREQS: Record<string, number> = {
  'S': 261.63,
  'Sa': 261.63,
  'R': 293.66,
  'Re': 293.66,
  'g': 311.13,
  'ga': 311.13,
  'Ga(komal)': 311.13,
  'M': 349.23,
  'Ma': 349.23,
  'M^': 369.99,
  'Ma(tivra)': 369.99,
  'P': 392.00,
  'Pa': 392.00,
  'D': 440.00,
  'Dha': 440.00,
  'N': 493.88,
  'Ni': 493.88,
  "S'": 523.25,
  "Sa'": 523.25,
  "R'": 587.33,
  "Re'": 587.33,
  'N_': 246.94,
  'N(lower)': 246.94,
  'D_': 220.00,
  'D(lower)': 220.00,
  'P_': 196.00,
  'P(lower)': 196.00
};

export default function RagaMiyanKiMalharView({ onViewChange }: RagaMiyanKiMalharViewProps) {
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [copiedNotation, setCopiedNotation] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);

  // Metronome states
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(70);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(16);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Practice Timer (45-50 mins)
  const [timerSeconds, setTimerSeconds] = useState(2700); // 45 mins default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Audio Context & Timeouts References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const getAudioContext = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Stop All Playing Audio Instantly and Reset State Flags
  const stopAllAudio = () => {
    // Clear all scheduled timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // Close and reset audio context to immediately stop node audio
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        // ignore
      }
      audioCtxRef.current = null;
    }

    // Reset playback flags
    setIsPlayingAaroh(false);
    setIsPlayingAvaroh(false);
    setIsPlayingPakad(false);
    setPlayingExercise(null);
    setPlayingAalap(null);
    setActiveSwara(null);
  };

  // Stop active audio nodes/timeouts without resetting state flags (used when starting a new phrase)
  const stopAudioNodesOnly = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setActiveSwara(null);
  };

  // Play Single Note with toggle stop support
  const playSwara = (swaraName: string, duration = 1.2) => {
    const cleanName = swaraName.trim();
    if (activeSwara === cleanName) {
      stopAllAudio();
      return;
    }
    try {
      stopAllAudio();
      const ctx = getAudioContext();
      const freq = SWARA_FREQS[cleanName] || 261.63;

      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(cleanName);
      const timer = setTimeout(() => setActiveSwara(null), duration * 1000);
      timeoutsRef.current.push(timer);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  // Play Sequence helper
  const playPhraseSequence = (
    phrase: string[], 
    tempoMs = 650, 
    onComplete?: () => void
  ) => {
    stopAudioNodesOnly();
    const ctx = getAudioContext();
    let delay = 0;

    phrase.forEach((token) => {
      const startTime = ctx.currentTime + (delay / 1000);
      const noteDuration = (tempoMs / 1000) * 0.92;

      const cleanToken = token.trim();
      if (cleanToken && cleanToken !== '|' && cleanToken !== '—' && cleanToken !== '||' && cleanToken !== '~') {
        const freq = SWARA_FREQS[cleanToken] || 261.63;
        playBambooFluteTone(ctx, freq, startTime, noteDuration, 0.28);

        const highlightTimer = setTimeout(() => {
          setActiveSwara(cleanToken);
        }, delay);
        timeoutsRef.current.push(highlightTimer);
      }

      delay += tempoMs;
    });

    const completionTimer = setTimeout(() => {
      setActiveSwara(null);
      if (onComplete) onComplete();
    }, delay + 200);
    timeoutsRef.current.push(completionTimer);
  };

  // Toggle Play / Stop Handlers
  const handleToggleAaroh = () => {
    if (isPlayingAaroh) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    setIsPlayingAaroh(true);
    const aarohNotes = ['S', 'R', 'M', 'R', 'P', 'M', 'P', 'N', "S'"];
    playPhraseSequence(aarohNotes, 620, () => setIsPlayingAaroh(false));
  };

  const handleToggleAvaroh = () => {
    if (isPlayingAvaroh) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    setIsPlayingAvaroh(true);
    const avarohNotes = ["S'", 'N', 'D', 'P', 'M', 'P', 'g', 'M', 'R', 'S'];
    playPhraseSequence(avarohNotes, 620, () => setIsPlayingAvaroh(false));
  };

  const handleTogglePakad = () => {
    if (isPlayingPakad) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    setIsPlayingPakad(true);
    const pakadNotes = ['R', 'M', 'R', 'P', 'M', 'P', 'g', 'M', 'R', 'S'];
    playPhraseSequence(pakadNotes, 650, () => setIsPlayingPakad(false));
  };

  const handleToggleExercise = (id: number, notes: string[]) => {
    if (playingExercise === id) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    setPlayingExercise(id);
    playPhraseSequence(notes, 580, () => setPlayingExercise(null));
  };

  const handleToggleAalap = (id: number, notes: string[]) => {
    if (playingAalap === id) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    setPlayingAalap(id);
    playPhraseSequence(notes, 680, () => setPlayingAalap(null));
  };

  // Interactive Metronome Loop
  useEffect(() => {
    let interval: any = null;
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = prev >= beatsPerMeasure ? 1 : prev + 1;
          const ctx = getAudioContext();
          playTakMetronomeClick(ctx, next === 1);
          return next;
        });
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMetronomeActive, bpm, beatsPerMeasure]);

  const toggleMetronome = () => {
    if (!isMetronomeActive) {
      const ctx = getAudioContext();
      setCurrentBeat(1);
      playTakMetronomeClick(ctx, true);
      setIsMetronomeActive(true);
    } else {
      setIsMetronomeActive(false);
      setCurrentBeat(0);
    }
  };

  // Practice Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fullNotationText = `FLUTESANGAM ORIGINAL LEARNING PIECE — RAAG MIYAN KI MALHAR

[AALAP]
S R M R | S — — — |
R M R P | M R S — ||

[MAIN PHRASE]
R M R P | M P g M |
R S R M | R P M R ||

[DEVELOPMENT]
R M R P | M P N S' |
N D P M | P g M R |
S R M R | P M P g |
M R S — ||

[VARIATION]
S R M R | P M P N |
S' N D P | M P g M |
R M R P | M P g M |
R S — — ||

[ENDING]
R M R P | M P g M |
R M R S | S — — — ||`;

  const copyNotationText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2500);
  };

  // FAQ list
  const faqs = [
    {
      q: 'What is the key difference between Miyan Ki Malhar and Megh Malhar?',
      a: 'Raag Miyan Ki Malhar prominently features Komal Ga (in phrases like P g M R) and Shuddha Ni, whereas Raag Megh Malhar is a pentatonic (Odav) raga that omits Ga and Dha altogether, focusing heavily on R M R P and Komal Ni.'
    },
    {
      q: 'How do I blow Komal Ga accurately on bansuri in Miyan Ki Malhar?',
      a: 'On an Indian bamboo flute, Komal Ga is achieved by half-covering the third hole (or tilting the embouchure slightly inward for a softer, warmer pitch). Practice the phrase P g M R with a Tanpura drone until the Eb pitch is centered and resonant.'
    },
    {
      q: 'Is Tivra Ma mandatory in Raag Miyan Ki Malhar?',
      a: 'Shuddha Ma is the primary pivot of the raga. Tivra Ma appears in specific characteristic contextual movements (like M^ P or graceful ornaments) depending on the gharana, but Shuddha Ma carries the core Malhar identity.'
    },
    {
      q: 'Can beginners start learning Raag Miyan Ki Malhar?',
      a: 'Because Miyan Ki Malhar relies heavily on precise Komal Ga placement, micro-tonal meends, and subtle Re-Ma-Pa interplay, it is best suited for intermediate to advanced flute players who already have strong tone stability and finger control.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 font-sans">
      
      {/* Top Header Navigation */}
      <div className="bg-white/90 border-b border-stone-200 sticky top-0 z-40 backdrop-blur-md px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onViewChange && onViewChange('learn_raagas')}
            className="flex items-center gap-2 text-amber-800 hover:text-amber-900 font-semibold transition text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Ragas</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full border border-sky-200 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-700" /> Advanced Monsoon Raga
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* HERO BANNER - Clean Light Theme with Indigo/Sky Monsoon Accents */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 text-white p-6 md:p-10 border border-sky-700/40 shadow-xl mb-8">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-sky-500/20 text-sky-200 text-xs font-bold rounded-full border border-sky-400/30 uppercase tracking-wider">
                Hindustani Classical Flute Guide
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                Monsoon Season / Late Night
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
              Raag Miyan Ki Malhar
            </h1>
            <p className="text-sky-100/90 text-sm md:text-base max-w-3xl font-normal leading-relaxed mb-6">
              Notes, Aaroh, Avaroh, Pakad, Practice Routine & FluteSangam Original Learning Piece. Master the majestic monsoon melody on Indian bamboo flute.
            </p>

            {/* PUBLISHED & UPDATED DATES HEADER */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200/90 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 w-fit mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span><strong>Published:</strong> August 10, 2026</span>
              </div>
              <span className="text-sky-400/60">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-300" />
                <span><strong>Last Updated:</strong> August 10, 2026</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-sky-700/40">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-sky-200 text-xs block font-medium">Thaat</span>
                <span className="text-white text-sm md:text-base font-bold">Kafi</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-sky-200 text-xs block font-medium">Vadi / Samvadi</span>
                <span className="text-white text-sm md:text-base font-bold">Sa / Pa</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-sky-200 text-xs block font-medium">Key Feature</span>
                <span className="text-white text-sm md:text-base font-bold">Re-Ma & Komal Ga</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-sky-200 text-xs block font-medium">Time / Season</span>
                <span className="text-white text-sm md:text-base font-bold">Monsoon / Late Night</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. INTRODUCTION SECTION */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-700" />
            Introduction
          </h2>
          <div className="space-y-4 text-stone-700 text-sm md:text-base leading-relaxed">
            <p>
              <strong>Raag Miyan Ki Malhar</strong> is one of the most celebrated ragas of the Malhar family in Hindustani classical music. It is strongly associated with the monsoon season and is known for its powerful yet deeply expressive melodic character.
            </p>
            <p>
              Miyan Ki Malhar combines graceful movement with dramatic phrases and is particularly beautiful on the flute. Its characteristic use of Komal Ga, the interaction of Shuddha Ma and Tivra Ma, and distinctive movements involving Re, Ma, and Pa give it a sound that is very different from simpler ragas.
            </p>
            <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/80 my-4">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">For a flute player, Miyan Ki Malhar is an excellent raga for developing:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm font-semibold text-amber-950">
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Meend Technique</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Swara Control</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Breath Management</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Graceful Movement</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Aalap Development</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Upper Register</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Expressive Phrasing</span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center shadow-xs">Improvisation</span>
              </div>
            </div>
            <p>
              Miyan Ki Malhar is generally considered an advanced-level raga. It is better approached after developing a comfortable understanding of simpler ragas and basic classical flute techniques.
            </p>
            <p className="text-xs text-stone-600 italic bg-stone-100 p-3 rounded-xl border border-stone-200">
              Note: Miyan Ki Malhar belongs to the Malhar family, and different musical traditions may describe some of its swara movements slightly differently. The framework below is intended as a practical learning reference for flute players.
            </p>
          </div>
        </div>

        {/* 2. SWARA NOTES & INTERACTIVE AUDIO PADS */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
            <Music className="w-6 h-6 text-amber-700" />
            Notes & Interactive Swara Audio
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-6">
            Miyan Ki Malhar uses a characteristic combination of swaras rather than functioning like a simple straight scale. Click any note below to listen to its bansuri flute tone:
          </p>

          {/* Swara Audio Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            {[
              { code: 'S', label: 'Sa', freq: '261 Hz', desc: 'Shuddha' },
              { code: 'R', label: 'Re', freq: '294 Hz', desc: 'Shuddha' },
              { code: 'g', label: 'Komal Ga', freq: '311 Hz', desc: 'Komal (eb)' },
              { code: 'M', label: 'Ma', freq: '349 Hz', desc: 'Shuddha' },
              { code: 'P', label: 'Pa', freq: '392 Hz', desc: 'Shuddha' },
              { code: 'D', label: 'Dha', freq: '440 Hz', desc: 'Shuddha' },
              { code: 'N', label: 'Ni', freq: '494 Hz', desc: 'Shuddha' },
              { code: "S'", label: "Sa'", freq: '523 Hz', desc: 'Taar Saptak' },
            ].map((sw) => {
              const isActive = activeSwara === sw.code;
              return (
                <button
                  key={sw.code}
                  onClick={() => playSwara(sw.code)}
                  className={`p-3 rounded-2xl border transition text-left cursor-pointer flex flex-col justify-between ${
                    isActive 
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105' 
                      : 'bg-stone-50 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono opacity-80">{sw.freq}</span>
                    <Volume2 className={`w-3.5 h-3.5 ${isActive ? 'text-white animate-pulse' : 'text-amber-700'}`} />
                  </div>
                  <div>
                    <span className="text-base font-extrabold block">{sw.label}</span>
                    <span className="text-[10px] opacity-75">{sw.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-3 text-xs md:text-sm text-stone-700">
            <h3 className="font-bold text-amber-950 text-base">Swara Notation Framework</h3>
            <p>
              A practical notation for studying its basic framework is: <code className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-mono font-bold">S R M R P M P N S'</code> with characteristic phrases involving Komal Ga and the special treatment of Ma.
            </p>
            <p>
              A descending framework commonly practiced is: <code className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-mono font-bold">S' N D P M P g M R S</code>
            </p>
            <p className="text-stone-700 font-medium pt-2 border-t border-stone-200">
              Here: <span className="font-mono text-amber-800 font-bold">g = Komal Ga</span>, <span className="font-mono text-sky-800 font-bold">M = Shuddha Ma</span>, and <span className="font-mono text-purple-800 font-bold">M^ = Tivra Ma</span> when used in characteristic phrases. The exact treatment of the swaras is more important than treating these lines as a rigid scale.
            </p>
          </div>
        </div>

        {/* 3. AAROH, AVAROH & PAKAD SECTION WITH TOGGLE/STOP BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Aaroh Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-amber-900">Aaroh (Ascent)</h3>
                <button
                  onClick={handleToggleAaroh}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                    isPlayingAaroh 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  {isPlayingAaroh ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlayingAaroh ? 'Stop' : 'Play'}</span>
                </button>
              </div>
              <p className="font-mono font-bold text-amber-950 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/70 text-center text-sm md:text-base mb-3">
                S R M R P | M P N S'
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sa – Re – Ma – Re – Pa – Ma – Pa – Ni – Sa. The movement is intentionally not a simple seven-note scale. The repeated movement around Re and Ma is important for establishing the character of Miyan Ki Malhar.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-amber-900 font-medium">
              <strong>Slow Practice:</strong> <span className="font-mono text-amber-800">S — R M R — P —</span> then <span className="font-mono text-amber-800">M P N — S'</span>
            </div>
          </div>

          {/* Avaroh Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-amber-900">Avaroh (Descent)</h3>
                <button
                  onClick={handleToggleAvaroh}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                    isPlayingAvaroh 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  {isPlayingAvaroh ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlayingAvaroh ? 'Stop' : 'Play'}</span>
                </button>
              </div>
              <p className="font-mono font-bold text-amber-950 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/70 text-center text-sm md:text-base mb-3">
                S' N D P M P g M R S
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sa – Ni – Dha – Pa – Ma – Pa – Komal Ga – Ma – Re – Sa. The movement <span className="font-mono text-amber-800 font-bold">P g M R S</span> is particularly useful for developing the characteristic color of the raga.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-amber-900 font-medium">
              <strong>Slow Practice:</strong> <span className="font-mono text-amber-800">P — g M — R S</span> (Focus on Komal Ga)
            </div>
          </div>

          {/* Pakad Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-amber-900">Pakad (Catch)</h3>
                <button
                  onClick={handleTogglePakad}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                    isPlayingPakad 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  {isPlayingPakad ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlayingPakad ? 'Stop' : 'Play'}</span>
                </button>
              </div>
              <p className="font-mono font-bold text-amber-950 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/70 text-center text-sm md:text-base mb-3">
                R M R P | M P g M R S
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Introductory phrase: <span className="font-mono text-amber-900">R M R P | M P g M R S</span>. Another characteristic movement: <span className="font-mono text-amber-900">N S R M R | P M P g M R</span>. Practice with a smooth melodic flow.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-amber-900 font-medium">
              <strong>Pakad Practice:</strong> Combine R M R P with M P g M R S
            </div>
          </div>

        </div>

        {/* 4. PERFORMANCE TIME & VADI SAMVADI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              Time of Performance
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed mb-3">
              Miyan Ki Malhar is traditionally associated with the <strong>monsoon season</strong> and is generally performed during the <strong>night or late-evening period</strong>.
            </p>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              The raga's association with rain, clouds, and the monsoon gives it a distinctive emotional atmosphere. For practice, you do not need to wait for the monsoon or a particular time of day — regular practice is key.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700" />
              Vadi & Samvadi Insights
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed mb-3">
              Traditional descriptions can differ regarding Vadi-Samvadi treatment (commonly <strong>Sa / Pa</strong>).
            </p>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              For practical flute learning, concentrate on the raga's characteristic movements involving <strong>Re, Ma, Pa, Komal Ga, and Ni</strong> in phrases such as <code className="bg-stone-100 text-amber-900 px-2 py-0.5 rounded font-mono">R M R P</code> and <code className="bg-stone-100 text-amber-900 px-2 py-0.5 rounded font-mono">P g M R S</code>.
            </p>
          </div>
        </div>

        {/* 5. CHARACTERISTICS OF RAAG MIYAN KI MALHAR */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-700" />
            Characteristics of Raag Miyan Ki Malhar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-700">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-amber-950 text-base mb-1">1. Strong Malhar Character</h3>
              <p className="leading-relaxed text-xs md:text-sm text-stone-600">
                Belongs to the Malhar family with a distinctive monsoon-associated character. Its phrases evoke movement, energy, and a rain-swept atmosphere.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-amber-950 text-base mb-1">2. Komal Ga Treatment</h3>
              <p className="leading-relaxed text-xs md:text-sm text-stone-600">
                Komal Ga is a vital part of the raga's melodic color. The phrase <span className="font-mono text-amber-800 font-bold">P g M R</span> develops familiarity with its unique placement.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-amber-950 text-base mb-1">3. Interaction of Ma</h3>
              <p className="leading-relaxed text-xs md:text-sm text-stone-600">
                Shuddha Ma is prominent throughout, while Tivra Ma may appear in characteristic melodic contexts, adding subtle depth to phrases.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-amber-950 text-base mb-1">4. Re-Ma Movement</h3>
              <p className="leading-relaxed text-xs md:text-sm text-stone-600">
                The movement <span className="font-mono text-amber-800 font-bold">R M R</span> is fundamental. Practice <span className="font-mono text-amber-800">S R M R</span> and <span className="font-mono text-amber-800">R M R P</span> with a smooth, controlled tone.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-amber-950 text-base mb-1">5. Pa as Melodic Stability</h3>
              <p className="leading-relaxed text-xs md:text-sm text-stone-600">
                Pa provides an important point of stability in many phrases. Practice <span className="font-mono text-amber-800">R M R P</span> and <span className="font-mono text-amber-800">M P g M</span> to master movements around Pa.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-amber-950 text-base mb-1">6. Expressive Character</h3>
              <p className="leading-relaxed text-xs md:text-sm text-stone-600">
                Can sound Majestic, Expressive, Romantic, Energetic, or Contemplative. Emotional effect comes largely from phrase development.
              </p>
            </div>
          </div>
        </div>

        {/* 6. STEP-BY-STEP PRACTICE EXERCISES WITH AUDIO & STOP */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-700" />
            Flute Practice Exercises (Interactive Audio)
          </h2>

          <div className="space-y-4">
            {[
              { id: 1, title: 'Practice 1 — Basic Framework', phrase: ['S', 'R', 'M', 'R', 'P', 'M', 'P', 'N', "S'", "S'", 'N', 'D', 'P', 'M', 'P', 'g', 'M', 'R', 'S'], display: 'S R M R P M P N S\' → S\' N D P M P g M R S', desc: 'Play slowly. Don\'t try to increase speed until swaras feel comfortable.' },
              { id: 2, title: 'Practice 2 — Re-Ma Movement', phrase: ['S', 'R', 'M', 'R', 'S', 'R', 'M', 'R', 'P', 'S', 'R', 'M', 'R', 'P', 'M'], display: 'S R M R S → R M R P → S R M R P M', desc: 'Focus on making the Re-Ma movement smooth and continuous.' },
              { id: 3, title: 'Practice 3 — Komal Ga Placement', phrase: ['P', 'g', 'M', 'R', 'M', 'P', 'g', 'M', 'R', 'S'], display: 'P g M R → M P g M R S', desc: 'The Komal Ga should be accurately placed without flattening Sa.' },
              { id: 4, title: 'Practice 4 — Pa Movement', phrase: ['R', 'M', 'R', 'P', 'M', 'P', 'g', 'M', 'R', 'M', 'R', 'P', 'M', 'P'], display: 'R M R P → M P g M → R M R P M P', desc: 'Try to make these phrases sound connected rather than like separate notes.' },
              { id: 5, title: 'Practice 5 — Meend Phrasing', phrase: ['R', 'M', 'M', 'R', 'P', 'g', 'M', 'M', 'R', 'S'], display: 'R ~ M | M ~ R | P ~ g ~ M | M ~ R ~ S', desc: 'Practice gentle slides between notes to support the musical phrase.' },
              { id: 6, title: 'Practice 6 — Complete Pakad Combination', phrase: ['R', 'M', 'R', 'P', 'M', 'P', 'g', 'M', 'R', 'S', 'N_', 'S', 'R', 'M', 'R', 'P', 'M', 'P', 'g', 'M', 'R'], display: 'R M R P | M P g M R S → N S R M R | P M P g M R', desc: 'Develops familiarity with characteristic phrase movement.' },
            ].map((ex) => (
              <div key={ex.id} className="bg-stone-50 p-4 md:p-5 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-amber-950 text-sm md:text-base mb-1">{ex.title}</h3>
                  <p className="font-mono text-amber-900 font-bold text-xs md:text-sm bg-white px-3 py-1.5 rounded-xl border border-amber-200/70 inline-block mb-1.5 shadow-2xs">
                    {ex.display}
                  </p>
                  <p className="text-xs text-stone-600">{ex.desc}</p>
                </div>
                <button
                  onClick={() => handleToggleExercise(ex.id, ex.phrase)}
                  className={`px-4 py-2.5 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs self-start sm:self-center shrink-0 ${
                    playingExercise === ex.id 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  {playingExercise === ex.id ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{playingExercise === ex.id ? 'Stop Exercise' : 'Play Exercise'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 7. AALAP PRACTICE SECTION */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
            <Music className="w-6 h-6 text-amber-700" />
            Aalap Practice
          </h2>
          <p className="text-stone-600 text-sm mb-6">
            Develop Miyan Ki Malhar gradually through Aalap. Start in the middle register and create a gradual musical conversation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, title: 'Aalap 1 — Sa-Re-Ma Opening', phrase: ['S', 'R', 'M', 'R', 'S', 'R', 'M', 'R', 'P', 'M', 'R', 'S'], notation: 'S — R M R | S — — — |\nR M R P | M R S — ||' },
              { id: 2, title: 'Aalap 2 — Re-Ma-Pa & Komal Ga', phrase: ['S', 'R', 'M', 'R', 'P', 'M', 'P', 'g', 'M', 'R', 'S', 'R'], notation: 'S R M R | P — M P |\ng M R S | R — — — ||' },
              { id: 3, title: 'Aalap 3 — Mid-Register Expansion', phrase: ['R', 'M', 'R', 'P', 'M', 'P', 'g', 'M', 'R', 'S', 'R', 'M', 'R', 'P'], notation: 'R M R P | M P g M |\nR S — R | M R P — ||' },
              { id: 4, title: 'Aalap 4 — Upper Register Reach', phrase: ['M', 'P', 'N', "S'", 'N', 'D', 'P', 'M', 'P', 'g', 'M', 'R', 'S'], notation: 'M P N S\' | N D P M |\nP g M R | S — — — ||' },
            ].map((al) => (
              <div key={al.id} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-amber-950 text-sm mb-2">{al.title}</h3>
                  <p className="font-mono text-amber-900 font-bold text-xs bg-white p-3 rounded-xl border border-amber-200/70 mb-3 whitespace-pre-wrap shadow-2xs">
                    {al.notation}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleAalap(al.id, al.phrase)}
                  className={`px-4 py-2 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs self-start ${
                    playingAalap === al.id 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  {playingAalap === al.id ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{playingAalap === al.id ? 'Stop Phrase' : 'Play Aalap Phrase'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 8. COMMON MISTAKES */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            Common Mistakes & How to Avoid Them
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-stone-700">
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
              <h3 className="font-bold text-amber-950 text-sm mb-1">1. Treating it Like a Straight Scale</h3>
              <p className="text-stone-600">Playing notes in linear sequence misses the Malhar character. <span className="text-amber-900 font-semibold">Tip: Spend more time on characteristic phrases like R M R P.</span></p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
              <h3 className="font-bold text-amber-950 text-sm mb-1">2. Using Komal Ga Incorrectly</h3>
              <p className="text-stone-600">Komal Ga has a specific role. <span className="text-amber-900 font-semibold">Tip: Practice P g M R repeatedly until pitch placement is clear.</span></p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
              <h3 className="font-bold text-amber-950 text-sm mb-1">3. Ignoring Re-Ma Movement</h3>
              <p className="text-stone-600">The movement around Re and Ma is fundamental. <span className="text-amber-900 font-semibold">Tip: Regularly practice S R M R and R M R P.</span></p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
              <h3 className="font-bold text-amber-950 text-sm mb-1">4. Using Tivra Ma Everywhere</h3>
              <p className="text-stone-600">Tivra Ma is contextual. <span className="text-amber-900 font-semibold">Tip: Learn its specific context through listening rather than inserting randomly.</span></p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
              <h3 className="font-bold text-amber-950 text-sm mb-1">5. Playing Too Many Fast Notes</h3>
              <p className="text-stone-600">Malhar benefits from space and expression. <span className="text-amber-900 font-semibold">Tip: Focus on tone and sustained notes over fast speed.</span></p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
              <h3 className="font-bold text-amber-950 text-sm mb-1">6. Rushing Meends</h3>
              <p className="text-stone-600">Fast sliding makes phrases unclear. <span className="text-amber-900 font-semibold">Tip: Start with slow, controlled meend movements.</span></p>
            </div>
          </div>
        </div>

        {/* 9. FLUTESANGAM ORIGINAL LEARNING PIECE + METRONOME */}
        <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 md:p-8 border border-amber-700/60 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-amber-700/50">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">FluteSangam Original Composition</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Raag Miyan Ki Malhar Learning Piece
              </h2>
              <p className="text-amber-200/90 text-xs md:text-sm mt-1">
                An original practice composition created specifically for learning Raag Miyan Ki Malhar on flute.
              </p>
            </div>

            {/* Interactive Controls & Metronome */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Metronome Toggle Button */}
              <button
                onClick={toggleMetronome}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-md ${
                  isMetronomeActive 
                    ? 'bg-amber-400 text-amber-950 animate-pulse' 
                    : 'bg-amber-500 hover:bg-amber-400 text-amber-950'
                }`}
              >
                {isMetronomeActive ? <Square className="w-3.5 h-3.5 fill-amber-950" /> : <Play className="w-3.5 h-3.5 fill-amber-950" />}
                <span>{isMetronomeActive ? 'Stop Metronome' : 'Start Metronome'}</span>
              </button>

              {/* Tempo Control */}
              <div className="flex items-center gap-2 bg-black/40 border border-amber-500/30 px-3.5 py-2 rounded-2xl text-xs font-mono">
                <span className="text-amber-300 font-bold">{bpm} BPM</span>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-amber-400 cursor-pointer"
                  aria-label="Metronome Tempo BPM"
                />
              </div>

              {/* Beats Selector */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-amber-500/30 px-3 py-1.5 rounded-2xl text-xs">
                <span className="text-amber-200/80 font-sans text-[11px] font-medium">Beats:</span>
                <select
                  value={beatsPerMeasure}
                  onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold font-mono focus:outline-none cursor-pointer"
                  aria-label="Metronome Beats per measure"
                >
                  <option value={16} className="bg-stone-900 text-white">16 Beats (Teentaal)</option>
                  <option value={8} className="bg-stone-900 text-white">8 Beats (Keherwa)</option>
                  <option value={6} className="bg-stone-900 text-white">6 Beats (Dadra)</option>
                  <option value={4} className="bg-stone-900 text-white">4 Beats (4/4)</option>
                </select>
              </div>

              {/* Beat Counter */}
              {isMetronomeActive && (
                <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 px-3 py-2 rounded-2xl font-mono text-xs font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Beat {currentBeat} / {beatsPerMeasure}</span>
                </div>
              )}

              {/* Copy Notation */}
              <button
                onClick={() => copyNotationText(fullNotationText)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition cursor-pointer"
                title="Copy notation"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Notation Display Cards */}
          <div className="space-y-4 font-mono text-xs md:text-sm">
            
            {/* Aalap */}
            <div className="bg-black/30 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-amber-300 font-bold block mb-1 font-sans text-xs">1. Aalap</span>
              <p className="text-amber-100 font-bold tracking-wider">
                S R M R | S — — — |<br />
                R M R P | M R S — ||
              </p>
              <span className="text-[11px] text-amber-200/70 font-sans block mt-1">Play gently with relaxed breath.</span>
            </div>

            {/* Main Phrase */}
            <div className="bg-black/30 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-amber-300 font-bold block mb-1 font-sans text-xs">2. Main Phrase</span>
              <p className="text-amber-100 font-bold tracking-wider">
                R M R P | M P g M |<br />
                R S R M | R P M R ||
              </p>
              <span className="text-[11px] text-amber-200/70 font-sans block mt-1">Focus on the movement between Re, Ma, and Pa.</span>
            </div>

            {/* Development */}
            <div className="bg-black/30 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-amber-300 font-bold block mb-1 font-sans text-xs">3. Development</span>
              <p className="text-amber-100 font-bold tracking-wider">
                R M R P | M P N S' |<br />
                N D P M | P g M R |<br />
                S R M R | P M P g |<br />
                M R S — ||
              </p>
              <span className="text-[11px] text-amber-200/70 font-sans block mt-1">Keep upper register controlled.</span>
            </div>

            {/* Variation */}
            <div className="bg-black/30 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-amber-300 font-bold block mb-1 font-sans text-xs">4. Variation</span>
              <p className="text-amber-100 font-bold tracking-wider">
                S R M R | P M P N |<br />
                S' N D P | M P g M |<br />
                R M R P | M P g M |<br />
                R S — — ||
              </p>
              <span className="text-[11px] text-amber-200/70 font-sans block mt-1">Practice only after the Main Phrase feels comfortable.</span>
            </div>

            {/* Ending */}
            <div className="bg-black/30 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-amber-300 font-bold block mb-1 font-sans text-xs">5. Ending</span>
              <p className="text-amber-100 font-bold tracking-wider">
                R M R P | M P g M |<br />
                R M R S | S — — — ||
              </p>
              <span className="text-[11px] text-amber-200/70 font-sans block mt-1">Resolve gently to Sa.</span>
            </div>

          </div>

          <p className="text-[11px] text-amber-300/80 italic mt-4 pt-3 border-t border-amber-700/50">
            FluteSangam Original Learning Piece: This composition has been newly created for FluteSangam as an original practice piece for Raag Miyan Ki Malhar. It is not presented as a traditional composition or bandish.
          </p>
        </div>

        {/* 10. HOW TO PRACTICE THE ORIGINAL PIECE */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            How to Practice the FluteSangam Original Piece
          </h2>

          <div className="space-y-3 text-xs md:text-sm text-stone-700">
            <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="bg-amber-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</span>
              <div>
                <strong className="text-amber-950">Step 1 — Practice the Aalap:</strong> Start with the Aalap and focus on tone and breath.
              </div>
            </div>
            <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="bg-amber-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</span>
              <div>
                <strong className="text-amber-950">Step 2 — Add the Main Phrase:</strong> Practice <span className="font-mono text-amber-900 font-bold">R M R P | M P g M R S</span> until the movement becomes comfortable.
              </div>
            </div>
            <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="bg-amber-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</span>
              <div>
                <strong className="text-amber-950">Step 3 — Add the Development:</strong> Introduce upper-register phrases gradually.
              </div>
            </div>
            <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="bg-amber-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">4</span>
              <div>
                <strong className="text-amber-950">Step 4 — Practice the Variation:</strong> Once comfortable with the basic composition, add the Variation.
              </div>
            </div>
            <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="bg-amber-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">5</span>
              <div>
                <strong className="text-amber-950">Step 5 — Complete the Piece:</strong> Connect: <span className="font-mono text-amber-900 font-bold">Aalap → Main Phrase → Development → Variation → Ending</span> as one continuous musical piece.
              </div>
            </div>
          </div>
        </div>

        {/* 11. FLUTE PRACTICE TIPS FOR RAAG MIYAN KI MALHAR */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-700" />
            Flute Practice Tips for Raag Miyan Ki Malhar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-stone-700">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <strong className="text-amber-950 block text-base mb-1">Practice with a Tanpura</strong>
              <p className="text-stone-600">A Tanpura drone helps you identify pitch problems and develop a stronger relationship with Sa and the other swaras.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <strong className="text-amber-950 block text-base mb-1">Pay Attention to Komal Ga</strong>
              <p className="text-stone-600">Spend additional time practicing the movement <code className="font-mono text-amber-900 font-bold">P g M R</code> because accurate Komal Ga is important for the raga's character.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <strong className="text-amber-950 block text-base mb-1">Keep the Re-Ma Movement Smooth</strong>
              <p className="text-stone-600">Practice <code className="font-mono text-amber-900 font-bold">S R M R</code> until it becomes natural under your fingers.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <strong className="text-amber-950 block text-base mb-1">Use Meend Carefully</strong>
              <p className="text-stone-600">Miyan Ki Malhar can sound beautiful with expressive meend, but excessive sliding can make phrases unclear.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <strong className="text-amber-950 block text-base mb-1">Develop the Aalap Slowly</strong>
              <p className="text-stone-600">Don't rush toward fast playing. First learn how to establish the raga using a small number of characteristic phrases.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <strong className="text-amber-950 block text-base mb-1">Listen to the Raga</strong>
              <p className="text-stone-600">Listening is an important part of raga learning. Try to recognize characteristic movements before attempting to improvise extensively.</p>
            </div>
          </div>
        </div>

        {/* 12. WHY & WHO SHOULD LEARN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-amber-900 mb-3">Why Learn Raag Miyan Ki Malhar?</h2>
            <ul className="space-y-2 text-xs md:text-sm text-stone-700">
              <li className="flex items-center gap-2">✓ Komal Ga control & microtonal accuracy</li>
              <li className="flex items-center gap-2">✓ Meend technique on Indian bamboo flute</li>
              <li className="flex items-center gap-2">✓ Re-Ma-Pa movement mastery</li>
              <li className="flex items-center gap-2">✓ Breath management & upper register stability</li>
              <li className="flex items-center gap-2">✓ Aalap development & expressive classical phrasing</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-amber-900 mb-3">Who Should Learn?</h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              Miyan Ki Malhar is best suited to players who already have comfortable flute fingering, stable tone production, basic breath control, experience with Komal swaras, and familiarity with Aalap and intermediate ragas.
            </p>
          </div>
        </div>

        {/* 13. INTERACTIVE PRACTICE ROUTINE TIMER */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-700" />
                45-Min Miyan Ki Malhar Practice Timer
              </h2>
              <p className="text-stone-600 text-xs md:text-sm">Structured daily practice breakdown for bansuri players.</p>
            </div>

            <div className="flex items-center gap-3 bg-stone-100 p-3 rounded-2xl border border-stone-200">
              <span className="font-mono text-2xl font-extrabold text-amber-950">{formatTime(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 font-bold text-xs rounded-xl transition cursor-pointer text-white ${
                  isTimerRunning ? 'bg-amber-800 hover:bg-amber-900' : 'bg-amber-700 hover:bg-amber-800'
                }`}
              >
                {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(2700); }}
                className="p-2 text-stone-600 hover:text-stone-900 transition cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-amber-900 block font-bold">5 Mins — Long Notes</strong>
              <span className="text-stone-600">Sustained Sa, Re, Ma, Pa tone practice.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-amber-900 block font-bold">10 Mins — Swara Practice</strong>
              <span className="text-stone-600">Slow Aaroh & Avaroh repetition.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-amber-900 block font-bold">10 Mins — Re-Ma & Komal Ga</strong>
              <span className="text-stone-600">S R M R, R M R P, P g M R phrases.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-amber-900 block font-bold">10 Mins — Pakad Practice</strong>
              <span className="text-stone-600">Master characteristic catch phrases.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-amber-900 block font-bold">10 Mins — Aalap & Original Piece</strong>
              <span className="text-stone-600">Practice FluteSangam composition section by section.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-amber-900 block font-bold">5 Mins — Free Practice</strong>
              <span className="text-stone-600">Improvisation and self-expression.</span>
            </div>
          </div>
        </div>

        {/* 14. FREQUENTLY ASKED QUESTIONS */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-700" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden transition">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-stone-50 hover:bg-stone-100/80 transition flex items-center justify-between gap-4 cursor-pointer font-bold text-stone-900 text-sm md:text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-amber-800 shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-stone-700 text-xs md:text-sm leading-relaxed border-t border-stone-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 15. ABOUT AUTHOR SECTION */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
}
