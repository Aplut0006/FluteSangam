import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Sun, Calendar, CheckCircle2, Play, Pause, Square,
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Compass, Zap, Share2, 
  Sliders, Award, Sparkles, ShieldAlert, Lightbulb, ArrowLeft,
  RefreshCw, RotateCcw, Feather, Heart, HelpCircle
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface RagaTilangViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale (Hz)
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'S(lower)': 130.81,
  'G(lower)': 164.81,
  'M(lower)': 174.61,
  'P(lower)': 196.00,
  'n(lower)': 233.08,  // Komal Ni
  'N(lower)': 246.94,  // Shuddha Ni

  // Middle Octave (Madhya Saptak)
  'S': 261.63,
  'Sa': 261.63,
  'G': 329.63,       // Shuddha Ga
  'Ga': 329.63,
  'M': 349.23,       // Shuddha Ma
  'Ma': 349.23,
  'P': 392.00,       // Shuddha Pa
  'Pa': 392.00,
  'n': 466.16,       // Komal Ni
  'Ni(komal)': 466.16,
  'N': 493.88,       // Shuddha Ni
  'Ni': 493.88,

  // High Octave (Taar Saptak)
  "S'": 523.25,
  "Sa'": 523.25,
  "G'": 659.25,      // Shuddha Ga
  "M'": 698.46,      // Shuddha Ma
  "P'": 783.99,      // Pa
  "n'": 932.33,      // Komal Ni
  "N'": 987.77,      // Shuddha Ni
};

export const RagaTilangView: React.FC<RagaTilangViewProps> = ({ onViewChange }) => {
  // Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);
  const [isPlayingPiece, setIsPlayingPiece] = useState(false);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [copiedNotation, setCopiedNotation] = useState(false);
  
  // Metronome states
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(65);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(16);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  // Practice Timer (45 mins)
  const [timerSeconds, setTimerSeconds] = useState(2700);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio Context & Active Timeouts
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeTimeoutsRef = useRef<number[]>([]);

  const stopAllAudio = () => {
    // Clear all pending timeouts
    activeTimeoutsRef.current.forEach(id => clearTimeout(id));
    activeTimeoutsRef.current = [];

    // Suspend audio context to immediately stop any active sound
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }

    // Reset playing state flags
    setActiveSwara(null);
    setIsPlayingAaroh(false);
    setIsPlayingAvaroh(false);
    setIsPlayingPakad(false);
    setPlayingExercise(null);
    setPlayingAalap(null);
    setIsPlayingPiece(false);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play Single Note
  const playSwara = (swaraName: string, duration = 1.0) => {
    try {
      const ctx = getAudioContext();
      const cleanName = swaraName.trim();
      const freq = SWARA_FREQS[cleanName] || 261.63;

      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(cleanName);
      const tId = window.setTimeout(() => setActiveSwara(null), duration * 1000);
      activeTimeoutsRef.current.push(tId);
    } catch (e) {
      console.error('Audio playback error', e);
    }
  };

  // Play Sequence Helper
  const playSequence = (
    notes: string[], 
    setPlayingState: (val: boolean) => void, 
    noteDuration = 0.85
  ) => {
    stopAllAudio();
    const ctx = getAudioContext();
    setPlayingState(true);

    notes.forEach((note, index) => {
      const tId = window.setTimeout(() => {
        const cleanNote = note.trim();
        if (cleanNote && SWARA_FREQS[cleanNote]) {
          const freq = SWARA_FREQS[cleanNote];
          playBambooFluteTone(ctx, freq, ctx.currentTime, noteDuration, 0.28);
          setActiveSwara(cleanNote);
        } else {
          setActiveSwara(null);
        }

        if (index === notes.length - 1) {
          const endTId = window.setTimeout(() => {
            setActiveSwara(null);
            setPlayingState(false);
          }, noteDuration * 1000);
          activeTimeoutsRef.current.push(endTId);
        }
      }, index * noteDuration * 880);

      activeTimeoutsRef.current.push(tId);
    });
  };

  // Playback Handlers
  const handlePlayAaroh = () => {
    if (isPlayingAaroh) {
      stopAllAudio();
    } else {
      const notes = ['S', 'G', 'M', 'P', 'N', "S'"];
      playSequence(notes, setIsPlayingAaroh, 0.95);
    }
  };

  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) {
      stopAllAudio();
    } else {
      const notes = ["S'", 'n', 'P', 'M', 'G', 'S'];
      playSequence(notes, setIsPlayingAvaroh, 0.95);
    }
  };

  const handlePlayPakad = () => {
    if (isPlayingPakad) {
      stopAllAudio();
    } else {
      const notes = ['G', 'M', 'P', 'N', "S'", 'n', 'P', 'M', 'G', 'S'];
      playSequence(notes, setIsPlayingPakad, 0.85);
    }
  };

  const handlePlayExercise = (index: number, notes: string[]) => {
    if (playingExercise === index) {
      stopAllAudio();
    } else {
      playSequence(notes, (val) => setPlayingExercise(val ? index : null), 0.75);
    }
  };

  const handlePlayAalap = (index: number, notes: string[]) => {
    if (playingAalap === index) {
      stopAllAudio();
    } else {
      playSequence(notes, (val) => setPlayingAalap(val ? index : null), 1.05);
    }
  };

  const handlePlayPiece = () => {
    if (isPlayingPiece) {
      stopAllAudio();
    } else {
      // Full FluteSangam Original Learning Piece
      const pieceNotes = [
        // Aalap
        'S', 'G', 'M', 'P', 'M', 'G', 'S',
        'G', 'M', 'P', 'M', 'G', 'S',
        // Main Phrase
        'S', 'G', 'M', 'P', 'N', "S'", 'n', 'P',
        'M', 'G', 'S', 'G', 'M', 'P',
        // Development
        'G', 'M', 'P', 'N', "S'", 'N', 'P', 'M',
        'G', 'M', 'P', 'n', 'P', 'M', 'G', 'S',
        'S', 'G', 'M', 'P', 'N', "S'", 'n', 'P',
        'M', 'G', 'S',
        // Variation
        'S', 'G', 'M', 'P', 'N', "S'", 'n', 'P',
        'G', 'M', 'P', 'N', "S'", 'n', 'P', 'M',
        'G', 'M', 'P', 'n', 'P', 'M', 'G', 'M',
        'G', 'S', 'M', 'G', 'S',
        // Ending
        'G', 'M', 'P', 'N', "S'", 'n', 'P', 'M',
        'G', 'M', 'G', 'S', 'S'
      ];
      playSequence(pieceNotes, setIsPlayingPiece, 0.7);
    }
  };

  // Practice Timer Hook
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

  // Metronome Hook
  useEffect(() => {
    let interval: any = null;
    if (isMetronomeActive) {
      const beatInterval = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev + 1) % beatsPerMeasure;
          try {
            const ctx = getAudioContext();
            playTakMetronomeClick(ctx, next === 0);
          } catch (e) {}
          return next;
        });
      }, beatInterval);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(interval);
  }, [isMetronomeActive, bpm, beatsPerMeasure]);

  const handleCopyNotation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Swara Pill Component with Interactive Audio
  const SwaraPill: React.FC<{ swara: string; label?: string; octave?: string; highlight?: boolean }> = ({ 
    swara, 
    label, 
    octave,
    highlight = false 
  }) => {
    const isPlaying = activeSwara === swara;
    return (
      <button
        onClick={() => playSwara(swara)}
        className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
          isPlaying
            ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105 ring-2 ring-amber-400'
            : highlight
            ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 text-amber-950 hover:border-amber-400 shadow-2xs hover:shadow-xs'
            : 'bg-white border-stone-200 text-stone-900 hover:border-amber-300 hover:bg-amber-50/50 shadow-2xs'
        }`}
        title={`Click to hear ${swara}`}
      >
        <span className="text-xl sm:text-2xl font-bold font-display">{swara}</span>
        {label && (
          <span className={`text-[10px] sm:text-xs mt-1 font-medium ${isPlaying ? 'text-amber-100' : 'text-stone-500 group-hover:text-amber-800'}`}>
            {label}
          </span>
        )}
        {octave && (
          <span className={`text-[9px] uppercase tracking-wider ${isPlaying ? 'text-amber-200' : 'text-stone-400'}`}>
            {octave}
          </span>
        )}
        <Volume2 className={`w-3.5 h-3.5 absolute top-2 right-2 transition-opacity ${isPlaying ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-60 text-amber-700'}`} />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50/50 text-slate-800 font-sans pb-24">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onViewChange ? onViewChange('learn_raagas') : window.history.back()}
            className="flex items-center gap-2 text-bamboo-800 hover:text-bamboo-950 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>Back to Raagas Collection</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold">
              Audav-Audav • Khamaj Thaat
            </span>
            <button 
              onClick={() => handleCopyNotation(`Raag Tilang — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam https://flutesangam.com/learn/raga-tilang`)}
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-300 transition-colors cursor-pointer"
            >
              {copiedNotation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-amber-700" />}
              <span>{copiedNotation ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        
        {/* HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-stone-50 p-6 sm:p-10 shadow-sm border border-amber-200/80">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              <span className="bg-amber-200/90 text-amber-950 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Hindustani Classical Raga Guide
              </span>
              <span className="bg-white/80 text-stone-700 border border-stone-200 px-3 py-1 rounded-full">
                Interactive Flute Audio
              </span>
              <span className="bg-emerald-100/90 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                Both Shuddha Ni &amp; Komal Ni
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-bamboo-950 tracking-tight leading-tight">
                Raag Tilang
              </h1>
              <p className="text-lg sm:text-xl font-medium text-amber-900/90 font-display">
                Notes, Aaroh, Avaroh, Pakad, Practice &amp; FluteSangam Original Learning Piece
              </p>
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl">
              Raag Tilang is a graceful and melodic Hindustani raga known for its simple note structure and sweet, accessible phrases. It is often heard in light-classical, devotional, semi-classical, and melodic compositions, making it particularly enjoyable for flute players.
            </p>

            {/* Published & Updated Dates Header */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-600 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-amber-200/70 w-fit">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Published: <strong className="text-bamboo-950 font-semibold" itemProp="datePublished" content="2026-08-17">August 17, 2026</strong></span>
              </div>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Last Updated: <strong className="text-bamboo-950 font-semibold" itemProp="dateModified" content="2026-08-17">August 17, 2026</strong></span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-200/60">
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Thaat</span>
                <span className="text-sm sm:text-base font-bold text-bamboo-950">Khamaj</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Jati</span>
                <span className="text-sm sm:text-base font-bold text-bamboo-950">Audav - Audav (5/5)</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Key Swaras</span>
                <span className="text-sm sm:text-base font-bold text-amber-800">S G M P N &amp; n</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Time</span>
                <span className="text-sm sm:text-base font-bold text-bamboo-950">Anytime / Light Classic</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Introduction
              </h2>
              <p className="text-xs text-stone-500">Overview, aesthetic character &amp; flute benefits</p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
            <p>
              Raag Tilang is a graceful and melodic Hindustani raga known for its simple note structure and sweet, accessible phrases. It is often heard in light-classical, devotional, semi-classical, and melodic compositions, making it particularly enjoyable for flute players.
            </p>
            <p>
              Tilang is a useful raga for players who are moving beyond basic swara exercises and want to develop phrase control, clean note transitions, and musical expression without immediately dealing with a highly complex raga structure.
            </p>
            <p>
              One of the interesting features of Tilang is its treatment of both <strong>Shuddha Ni (N)</strong> and <strong>Komal Ni (n)</strong>, with the two appearing in different melodic contexts. This gives the raga a distinctive color despite its relatively compact framework.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              For Flute Players, Tilang is Useful for Developing:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {[
                'Swara accuracy',
                'Clean fingering',
                'Ni control (N vs n)',
                'Phrase recognition',
                'Breath management',
                'Meend',
                'Aalap development',
                'Melodic improvisation',
                'Expressive playing'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-xl border border-amber-200/60 text-xs font-medium text-stone-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
            <strong>Note:</strong> Tilang has been described and performed with some variations across musical traditions. The framework below is designed as a practical learning reference for flute players, while the characteristic phrase treatment remains more important than treating the raga as a rigid scale.
          </div>
        </section>

        {/* SECTION 2: NOTES & INTERACTIVE SWARA PAD */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  Notes of Raag Tilang
                </h2>
                <p className="text-xs text-stone-500">Tap any swara below to hear its pitch on Bansuri</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full hidden sm:inline-block">
              Base Key: C Natural
            </span>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
            <p>The core swaras commonly used in Tilang are:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">S</span>
                <span><strong>Sa</strong> — Shuddha (Root / Tonic)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">G</span>
                <span><strong>Ga</strong> — Shuddha (Major 3rd)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">M</span>
                <span><strong>Ma</strong> — Shuddha (Perfect 4th)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">P</span>
                <span><strong>Pa</strong> — Shuddha (Perfect 5th)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-950 font-bold flex items-center justify-center text-xs">N</span>
                <span><strong>Ni</strong> — Shuddha in ascent (Major 7th)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="w-7 h-7 rounded-lg bg-amber-200 text-amber-950 font-bold flex items-center justify-center text-xs">n</span>
                <span><strong>Ni</strong> — Komal in characteristic descent (Minor 7th)</span>
              </li>
            </ul>
            <p className="text-sm font-medium text-stone-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
              ⚡ <strong>Varjit Swaras:</strong> <strong>Re</strong> and <strong>Dha</strong> are generally omitted from the basic framework.
            </p>
          </div>

          {/* Interactive Swara Pad */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Interactive Swara Audio Board:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <SwaraPill swara="S" label="Sa" octave="Madhya" />
              <SwaraPill swara="G" label="Shuddha Ga" octave="Madhya" />
              <SwaraPill swara="M" label="Shuddha Ma" octave="Madhya" />
              <SwaraPill swara="P" label="Pa" octave="Madhya" />
              <SwaraPill swara="N" label="Shuddha Ni" octave="Ascent" highlight={true} />
              <SwaraPill swara="n" label="Komal Ni" octave="Descent" highlight={true} />
            </div>
          </div>
        </section>

        {/* SECTION 3: AAROH, AVAROH, PAKAD & AUDIO PLAYERS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-8">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Aaroh, Avaroh &amp; Pakad
              </h2>
              <p className="text-xs text-stone-500">Core structural movements with listenable flute sequences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Aaroh Card */}
            <div className="bg-gradient-to-b from-stone-50 to-white rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Aaroh (Ascent)
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">Shuddha Ni</span>
                </div>
                <div className="text-2xl font-bold font-display text-bamboo-950 tracking-wide pt-1">
                  S G M P N S'
                </div>
                <p className="text-xs text-stone-600">
                  Sa – Ga – Ma – Pa – Shuddha Ni – Sa'
                </p>
                <div className="p-2.5 rounded-xl bg-stone-100/70 text-xs font-mono text-stone-700">
                  S — G M — | P — N — | S' —
                </div>
              </div>

              <button
                onClick={handlePlayAaroh}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isPlayingAaroh
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-bamboo-700 text-white hover:bg-bamboo-800 shadow-xs'
                }`}
              >
                {isPlayingAaroh ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAaroh ? 'Stop Aaroh' : 'Play Aaroh'}</span>
              </button>
            </div>

            {/* Avaroh Card */}
            <div className="bg-gradient-to-b from-stone-50 to-white rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Avaroh (Descent)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium font-bold">Komal Ni (n)</span>
                </div>
                <div className="text-2xl font-bold font-display text-bamboo-950 tracking-wide pt-1">
                  S' n P M G S
                </div>
                <p className="text-xs text-stone-600">
                  Sa' – Komal Ni – Pa – Ma – Ga – Sa
                </p>
                <div className="p-2.5 rounded-xl bg-stone-100/70 text-xs font-mono text-stone-700">
                  S' — n P — | M G — S
                </div>
              </div>

              <button
                onClick={handlePlayAvaroh}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isPlayingAvaroh
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-bamboo-700 text-white hover:bg-bamboo-800 shadow-xs'
                }`}
              >
                {isPlayingAvaroh ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAvaroh ? 'Stop Avaroh' : 'Play Avaroh'}</span>
              </button>
            </div>

            {/* Pakad Card */}
            <div className="bg-gradient-to-b from-stone-50 to-white rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Pakad (Catch Phrase)
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold">Signature</span>
                </div>
                <div className="text-xl font-bold font-display text-bamboo-950 tracking-wide pt-1">
                  G M P N S' | n P M G S
                </div>
                <p className="text-xs text-stone-600">
                  Alternative movement: G M P | n P M G S
                </p>
                <div className="p-2.5 rounded-xl bg-stone-100/70 text-xs font-mono text-stone-700">
                  G M P N S' | n P M G S
                </div>
              </div>

              <button
                onClick={handlePlayPakad}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isPlayingPakad
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-bamboo-700 text-white hover:bg-bamboo-800 shadow-xs'
                }`}
              >
                {isPlayingPakad ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingPakad ? 'Stop Pakad' : 'Play Pakad'}</span>
              </button>
            </div>
          </div>

          {/* Pakad Practice Guidance */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3 text-sm text-stone-700">
            <h3 className="font-bold text-amber-950 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              Pakad Practice Routine
            </h3>
            <p className="text-xs sm:text-sm">
              Start with the ascent: <strong>G M P N S'</strong>. Then practice the descent: <strong>S' n P M G S</strong>. Finally connect them together: <strong>G M P N S' | n P M G S</strong>. Pay particular attention to the contrast between <strong>N (Shuddha Ni)</strong> and <strong>n (Komal Ni)</strong>.
            </p>
          </div>
        </section>

        {/* SECTION 4: THEORETICAL FRAMEWORK */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Theoretical Framework
              </h2>
              <p className="text-xs text-stone-500">Thaat, Jati, Time, Vadi-Samvadi &amp; Performance Context</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <h3 className="text-sm font-bold text-bamboo-950 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  Time of Performance
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tilang does not have the same strongly emphasized time association as some major Hindustani classical ragas. It is commonly encountered in light-classical and semi-classical musical settings, where its sweet and accessible character works well in different contexts.
                </p>
                <p className="text-xs font-semibold text-amber-900 pt-1">
                  💡 For flute practice, you can practice Tilang at any convenient time. Consistent practice and attentive listening are more important than following a strict clock time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <h3 className="text-sm font-bold text-bamboo-950 flex items-center gap-2">
                  <Feather className="w-4 h-4 text-amber-600" />
                  Thaat Association
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tilang is commonly associated with the <strong>Khamaj Thaat</strong>. Its characteristic use of Shuddha Ni in ascent and Komal Ni in descent contributes to its connection with the melodic language associated with Khamaj.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <h3 className="text-sm font-bold text-bamboo-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  Jati (Scale Classification)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tilang is commonly described as <strong>Audav-Audav (5 notes ascending / 5 notes descending)</strong> in its basic framework. However, the use of different forms of Ni and the characteristic melodic phrases give the raga greater individuality than a simple five-note scale would suggest.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <h3 className="text-sm font-bold text-bamboo-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Vadi and Samvadi
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Traditional descriptions of Vadi-Samvadi can vary. For practical flute learning, it is more useful to focus on the prominent melodic areas around <strong>Ga, Ma, Pa, Ni</strong>, and especially the contrast between Shuddha Ni and Komal Ni. Listen for where the melody naturally rests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CHARACTERISTICS OF RAAG TILANG */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Characteristics of Raag Tilang
              </h2>
              <p className="text-xs text-stone-500">5 key stylistic elements every bansuri player should master</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs">1</span>
                <span>Compact Swara Structure</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tilang has a relatively small basic swara framework (<strong>S G M P N S'</strong>). This makes it approachable for players who are learning to construct their first raga-based phrases without overwhelming complexity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-300 text-amber-950 flex items-center justify-center text-xs">2</span>
                <span>Both Forms of Ni (N &amp; n)</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                One of the most important characteristics to understand: <strong>Shuddha Ni (N)</strong> is commonly heard in ascent (<strong>P N S'</strong>), while <strong>Komal Ni (n)</strong> appears characteristically in descent (<strong>S' n P</strong>). This contrast gives Tilang its recognizable color.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs">3</span>
                <span>Re and Dha Are Avoided</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Re and Dha are generally absent from the basic framework. This creates an open and compact melodic space. Practice the raga without accidentally inserting Re or Dha into phrases.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs">4</span>
                <span>Ga-Ma-Pa Movement</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The movement <strong>G M P</strong> is particularly useful for establishing the basic melodic character. Practice: <strong>S G M P</strong> and <strong>G M P N S'</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs">5</span>
                <span>Sweet and Lyrical Character</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tilang has a graceful and pleasant character. It works especially well for devotional melodies, semi-classical music, light compositions, flute melodies, slow Aalap, and simple improvisation.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: STRUCTURED PRACTICE EXERCISES */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  Step-by-Step Practice Drills
                </h2>
                <p className="text-xs text-stone-500">6 targeted exercises with interactive audio playback</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 1,
                title: 'Practice 1 — Basic Aaroh',
                desc: 'Start with: S G M P N S\'. Play each note slowly with clean fingering: S — G M — P — N — S\'.',
                notes: ['S', 'G', 'M', 'P', 'N', "S'"],
                display: "S — G M — P — N — S'"
              },
              {
                id: 2,
                title: 'Practice 2 — Basic Avaroh',
                desc: 'Practice descending through Komal Ni: S\' — n P — M G — S.',
                notes: ["S'", 'n', 'P', 'M', 'G', 'S'],
                display: "S' — n P — M G — S"
              },
              {
                id: 3,
                title: 'Practice 3 — Ni Contrast',
                desc: 'Connect the two forms: P N S\' followed by S\' n P. Contrast Shuddha Ni with Komal Ni.',
                notes: ['P', 'N', "S'", 'n', 'P'],
                display: "P N S' | n P"
              },
              {
                id: 4,
                title: 'Practice 4 — Ga-Ma-Pa Movement',
                desc: 'Smooth transitions: S G M P | G M P G | G M P N | N P M G.',
                notes: ['S', 'G', 'M', 'P', 'G', 'M', 'P', 'G', 'G', 'M', 'P', 'N', 'N', 'P', 'M', 'G'],
                display: "S G M P | G M P G | G M P N | N P M G"
              },
              {
                id: 5,
                title: 'Practice 5 — Upper Register',
                desc: 'Practice P N S\' then S\' N P, then introduce the descent S\' n P.',
                notes: ['P', 'N', "S'", "S'", 'N', 'P', "S'", 'n', 'P'],
                display: "P N S' | S' N P | S' n P"
              },
              {
                id: 6,
                title: 'Practice 6 — Full Pakad Drill',
                desc: 'G M P N S\' | n P M G S. Repeat several times at a comfortable tempo before speeding up.',
                notes: ['G', 'M', 'P', 'N', "S'", 'n', 'P', 'M', 'G', 'S'],
                display: "G M P N S' | n P M G S"
              }
            ].map((drill) => (
              <div key={drill.id} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">Drill {drill.id}</span>
                    <h3 className="text-sm sm:text-base font-bold text-bamboo-950">{drill.title}</h3>
                  </div>
                  <p className="text-xs text-stone-600">{drill.desc}</p>
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-xs font-mono text-stone-800 inline-block font-semibold">
                    {drill.display}
                  </div>
                </div>

                <button
                  onClick={() => handlePlayExercise(drill.id, drill.notes)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    playingExercise === drill.id
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-bamboo-700 text-white hover:bg-bamboo-800 shadow-2xs'
                  }`}
                >
                  {playingExercise === drill.id ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{playingExercise === drill.id ? 'Stop' : 'Listen Drill'}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: AALAP PRACTICE */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Aalap Practice
              </h2>
              <p className="text-xs text-stone-500">Gradual melodic expansion from middle register to upper Sa</p>
            </div>
          </div>

          <p className="text-sm text-stone-700">
            Tilang is well suited to a simple and melodic Aalap. When practicing these phrases, don't play them mechanically. Leave small spaces between ideas and allow the melody to breathe.
          </p>

          <div className="space-y-3.5">
            {[
              { id: 1, title: 'Aalap 1 — Grounding in Sa & Ga', notes: ['S', 'G', 'M', 'P', 'M', 'G', 'S'], display: "S — G M | P — M G | S — — — ||" },
              { id: 2, title: 'Aalap 2 — Ga-Ma-Pa Oscillations', notes: ['S', 'G', 'M', 'P', 'G', 'M', 'G', 'S', 'G', 'M', 'P', 'M', 'G', 'S'], display: "S G M P | G M G S | G M P — | M G S — ||" },
              { id: 3, title: 'Aalap 3 — Introducing Shuddha & Komal Ni', notes: ['G', 'M', 'P', 'N', "S'", 'N', 'n', 'P', 'M', 'G', 'S'], display: "G M P N | S' — N — | n P M G | S — — — ||" },
              { id: 4, title: 'Aalap 4 — Upper Register Expansion', notes: ['S', 'G', 'M', 'P', 'N', "S'", 'n', 'P', 'M', 'G', 'S', 'G', 'M', 'P'], display: "S G M P | N S' n P | M G S — | G M P — ||" },
              { id: 5, title: 'Aalap 5 — Full Meandering Movement', notes: ['G', 'M', 'P', 'N', "S'", 'N', 'P', 'M', 'G', 'M', 'P', 'n', 'P', 'M', 'G', 'S'], display: "G M P N | S' N P M | G M P n | P M G S ||" }
            ].map((aalap) => (
              <div key={aalap.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">Aalap {aalap.id}</span>
                    <span className="text-xs font-semibold text-stone-600">{aalap.title}</span>
                  </div>
                  <div className="font-mono text-sm text-bamboo-950 font-bold tracking-wide pt-0.5">
                    {aalap.display}
                  </div>
                </div>

                <button
                  onClick={() => handlePlayAalap(aalap.id, aalap.notes)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    playingAalap === aalap.id
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-stone-200 hover:bg-amber-200 text-stone-900 shadow-2xs'
                  }`}
                >
                  {playingAalap === aalap.id ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{playingAalap === aalap.id ? 'Stop' : 'Play Aalap'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Meend Guidance */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Meend (Graceful Glide) Practice for Bansuri
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Gentle meend can make Tilang sound more expressive on the flute. Practice slow, controlled finger-sliding:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-bold text-amber-950">
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">G ~ M</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">M ~ P</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">P ~ N</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">N ~ S'</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">S' ~ n ~ P</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">P ~ M ~ G</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">M ~ G ~ S</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center">n ~ P ~ M</div>
            </div>
            <p className="text-xs text-stone-600 italic">
              * Use controlled slides rather than exaggerated movements. The purpose of meend is to connect the musical phrase naturally.
            </p>
          </div>
        </section>

        {/* SECTION 8: COMMON MISTAKES */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Common Mistakes to Avoid
              </h2>
              <p className="text-xs text-stone-500">Pitfalls and solutions for bansuri learners</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                num: 1,
                mistake: 'Treating Tilang Like a Simple Pentatonic Scale',
                desc: 'Although its basic structure is compact, Tilang is not simply S G M P N S\' played repeatedly.',
                tip: 'Learn the characteristic use of both forms of Ni in distinct ascending vs descending phrases.'
              },
              {
                num: 2,
                mistake: 'Using Shuddha Ni in the Descent Everywhere',
                desc: 'The descent has an essential role for Komal Ni (n).',
                tip: 'Practice S\' n P separately until the pitch and finger position feel natural.'
              },
              {
                num: 3,
                mistake: 'Accidentally Playing Re or Dha',
                desc: 'Because flute players are accustomed to normal 7-note scales, Re or Dha can slip in unintentionally.',
                tip: 'Practice the raga slowly and consciously skip the 1st and 5th hole positions.'
              },
              {
                num: 4,
                mistake: 'Confusing Shuddha Ni and Komal Ni',
                desc: 'This is the most important technical issue for a beginner.',
                tip: 'Practice P N S\' followed by S\' n P. Listen carefully to the half-step difference.'
              },
              {
                num: 5,
                mistake: 'Playing Too Fast',
                desc: 'Speed can hide inaccurate Ni placement and ungrounded Ga.',
                tip: 'Follow the sequence: Pitch → phrase → expression → speed.'
              },
              {
                num: 6,
                mistake: 'Overusing Meend',
                desc: 'Too much sliding can blur the distinct sweetness of the individual swaras.',
                tip: 'Use meend only where it naturally supports and glides the melodic phrase.'
              }
            ].map((item) => (
              <div key={item.num} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-extrabold">{item.num}</span>
                  <span>{item.mistake}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 font-medium">
                  <strong>Fix:</strong> {item.tip}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: FLUTESANGAM ORIGINAL LEARNING PIECE */}
        <section className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-stone-50 rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                FluteSangam Original Composition
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-bamboo-950">
                FluteSangam Original Learning Piece
              </h2>
              <p className="text-xs text-stone-600">
                100% original practice composition designed specifically to master Raag Tilang on bansuri
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePlayPiece}
                className={`py-2.5 px-5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
                  isPlayingPiece
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-amber-700 text-white hover:bg-amber-800'
                }`}
              >
                {isPlayingPiece ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlayingPiece ? 'Stop Piece' : 'Play Full Piece'}</span>
              </button>

              <button
                onClick={() => handleCopyNotation(`FluteSangam Original Learning Piece — Raag Tilang
Aalap:
S G M P | M G S — | G M P — | M G S — ||

Main Phrase:
S G M P | N S' n P | M G S — | G M P — ||

Development:
G M P N | S' N P M | G M P n | P M G S |
S G M P | N S' n P | M G S — — — ||

Variation:
S G M P | N S' n P | G M P N | S' n P M |
G M P n | P M G M | G S M G | S — — — ||

Ending:
G M P N | S' n P M | G M G S | S — — — ||`)}
                className="p-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition cursor-pointer shadow-2xs"
                title="Copy Notation"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200 text-xs text-stone-700 leading-relaxed">
            <strong>Disclosure:</strong> The following composition is 100% original FluteSangam content, created specifically for this page as a practical learning piece for Raag Tilang. It is not a traditional bandish and should not be presented as one.
          </div>

          {/* Notation Grid */}
          <div className="space-y-4">
            {/* Aalap */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">1. Aalap (Slow &amp; Calm)</span>
                <span className="text-xs text-stone-400">Opening</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-bamboo-950 p-3 bg-stone-50 rounded-xl border border-stone-100 leading-loose">
                S G M P | M G S — |<br />
                G M P — | M G S — ||
              </div>
              <p className="text-xs text-stone-600">Play slowly and establish a calm melodic flow.</p>
            </div>

            {/* Main Phrase */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">2. Main Phrase (Ni Contrast)</span>
                <span className="text-xs text-stone-400">Core Movement</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-bamboo-950 p-3 bg-stone-50 rounded-xl border border-stone-100 leading-loose">
                S G M P | N S' n P |<br />
                M G S — | G M P — ||
              </div>
              <p className="text-xs text-stone-600">The main objective is to practice the clear contrast between N (Shuddha) and n (Komal).</p>
            </div>

            {/* Development */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">3. Development</span>
                <span className="text-xs text-stone-400">Upper Octave Extension</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-bamboo-950 p-3 bg-stone-50 rounded-xl border border-stone-100 leading-loose">
                G M P N | S' N P M |<br />
                G M P n | P M G S |<br />
                S G M P | N S' n P |<br />
                M G S — — — ||
              </div>
              <p className="text-xs text-stone-600">Keep the upper Sa relaxed and ensure clean breath support.</p>
            </div>

            {/* Variation */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">4. Variation</span>
                <span className="text-xs text-stone-400">Advanced Phrasing</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-bamboo-950 p-3 bg-stone-50 rounded-xl border border-stone-100 leading-loose">
                S G M P | N S' n P |<br />
                G M P N | S' n P M |<br />
                G M P n | P M G M |<br />
                G S M G | S — — — ||
              </div>
              <p className="text-xs text-stone-600">Practice this variation only after the Main Phrase feels comfortable.</p>
            </div>

            {/* Ending */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">5. Ending</span>
                <span className="text-xs text-stone-400">Resolution</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-bamboo-950 p-3 bg-stone-50 rounded-xl border border-stone-100 leading-loose">
                G M P N | S' n P M |<br />
                G M G S | S — — — ||
              </div>
              <p className="text-xs text-stone-600">Resolve gently and peacefully to Sa.</p>
            </div>
          </div>

          {/* 5 Step Practice Guide */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-bamboo-950 uppercase tracking-wider">
              How to Practice the FluteSangam Original Learning Piece:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-amber-900 block">Step 1</span>
                <p className="text-stone-600">Learn the Aalap slowly with relaxed breathing.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-amber-900 block">Step 2</span>
                <p className="text-stone-600">Practice Main Phrase (P N S' | n P).</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-amber-900 block">Step 3</span>
                <p className="text-stone-600">Add Development; practice upper phrases separately.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-amber-900 block">Step 4</span>
                <p className="text-stone-600">Work on Variation at a steady slow tempo.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-amber-900 block">Step 5</span>
                <p className="text-stone-600">Connect: Aalap → Main Phrase → Dev → Var → End.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: PRACTICE ROUTINE & TIMER */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  Raag Tilang Practice Routine
                </h2>
                <p className="text-xs text-stone-500">Structured 50-minute practice session &amp; interactive timer</p>
              </div>
            </div>

            {/* Timer Badge */}
            <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="font-mono text-sm font-bold text-amber-950">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="ml-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline uppercase cursor-pointer"
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { time: '5 Mins', title: 'Long Notes (Swar Sadhana)', desc: 'Practice Sa, Ga, Ma, Pa, Ni with a Tanpura drone for tonal purity.' },
              { time: '10 Mins', title: 'Aaroh & Avaroh', desc: 'Practice S G M P N S\' and S\' n P M G S slowly.' },
              { time: '10 Mins', title: 'Two Ni Contrast Exercise', desc: 'Practice P N S\' and S\' n P repeatedly to cement the pitch difference.' },
              { time: '10 Mins', title: 'Pakad Drills', desc: 'Practice G M P N S\' | n P M G S smoothly without tension.' },
              { time: '10 Mins', title: 'FluteSangam Learning Piece', desc: 'Practice the composition section by section with proper phrasing.' },
              { time: '5 Mins', title: 'Free Improvisation', desc: 'Close the notation and create your own simple melody in Tilang.' }
            ].map((slot, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs shrink-0 mt-0.5">
                  {slot.time}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-bamboo-950">{slot.title}</h3>
                  <p className="text-xs text-stone-600">{slot.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flute Practice Tips */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              Essential Flute Practice Tips for Raag Tilang:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Practice with Tanpura:</strong> Tanpura drone helps maintain pitch accuracy while practicing the two forms of Ni.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Isolate the Two Nis:</strong> Spend several minutes practicing P N S' and S' n P.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Keep Fingering Clean:</strong> Concentrate on tone quality rather than speed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Start in Middle Register:</strong> Build tone confidence before moving to upper Sa'.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 11: WHO SHOULD LEARN & FINAL THOUGHTS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                Why Learn Raag Tilang?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Learning Tilang helps develop Shuddha and Komal Ni control, clean fingering, breath control, phrase construction, meend, Aalap development, and expressive playing. Its compact structure makes it particularly useful for transitioning from basic swara drills toward actual raga-based improvisation.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-700" />
                Who Should Learn Raag Tilang?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tilang is suitable for players who understand basic Sa Re Ga Ma concepts, basic flute fingering, simple Aalap, breath control, and basic meend. It can be introduced relatively early because its basic swara framework is compact.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-100/90 via-orange-100/60 to-amber-50 border border-amber-300 text-bamboo-950 space-y-2">
            <h4 className="text-sm font-bold font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-800" />
              FluteSangam Tip for Raag Tilang
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              In Tilang, pay special attention to <strong>Ni</strong>. The contrast between <strong>Shuddha Ni (N)</strong> and <strong>Komal Ni (n)</strong> is small in appearance but fundamental to the raga's soul. Don't worry about playing fast; a slow, clean Tilang phrase with accurate swaras will teach you much more than a fast sequence of notes.
            </p>
          </div>
        </section>

        {/* SECTION 12: FAQS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-stone-500">Key insights about practicing Raag Tilang on bansuri</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What are the notes of Raag Tilang?",
                a: "Raag Tilang uses Sa, Shuddha Ga, Shuddha Ma, Pa, and Shuddha Ni in ascent (S G M P N S'), and Komal Ni in descent (S' n P M G S). Re and Dha are omitted."
              },
              {
                q: "Which Thaat does Raag Tilang belong to?",
                a: "Raag Tilang is traditionally classified under Khamaj Thaat due to its use of both Shuddha Ni (in ascent) and Komal Ni (in descent)."
              },
              {
                q: "Why are both Shuddha Ni and Komal Ni used in Raag Tilang?",
                a: "Shuddha Ni (N) is used in the ascent leading up to Taar Sa (P N S'), while Komal Ni (n) is characteristically used in the descent (S' n P). This interplay creates the distinctive sweet mood of Tilang."
              },
              {
                q: "What is the best time to practice Raag Tilang on flute?",
                a: "Tilang does not have a strict time constraint and is popular in semi-classical and light music anytime. It is wonderful for evening and night practice, but can be practiced anytime with a Tanpura."
              },
              {
                q: "Is Raag Tilang beginner-friendly for flute learners?",
                a: "Yes! Because it uses only 5 notes (Audav-Audav) and skips Re and Dha, beginners can focus on tone production, clean fingering, and mastering the difference between Shuddha and Komal Ni."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-sm text-bamboo-950 bg-stone-50 hover:bg-stone-100 flex items-center justify-between transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-700" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 13: ABOUT AUTHOR */}
        <AboutAuthorSection />

      </div>
    </div>
  );
};

export default RagaTilangView;
