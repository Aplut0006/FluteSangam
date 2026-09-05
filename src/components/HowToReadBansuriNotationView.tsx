import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Volume2, Play, Square, Sparkles, 
  HelpCircle, ChevronDown, ChevronUp, ArrowRight, 
  CheckCircle2, Compass, Share2, Lightbulb, RotateCcw, 
  Target, Radio, AlertTriangle, Check, Copy, ArrowLeft,
  FileText, Award, Info, Printer, Calendar, Clock, Layers,
  ExternalLink, Mic, Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface HowToReadBansuriNotationViewProps {
  onViewChange?: (view: AppView) => void;
}

// Frequencies for audio synthesis (Key of C as root Sa = 261.63 Hz)
const SWARA_FREQS: Record<string, number> = {
  // Mandra Saptak (Lower Octave)
  'P̣': 196.00,  // G3
  'ḍ': 207.65,  // G#3
  'Ḍ': 220.00,  // A3
  'ṇ': 233.08,  // A#3
  'Ṇ': 246.94,  // B3

  // Madhya Saptak (Middle Octave)
  'S': 261.63,   // C4
  'r': 277.18,   // C#4 (Komal Re)
  'R': 293.66,   // D4  (Shuddha Re)
  'g': 311.13,   // D#4 (Komal Ga)
  'G': 329.63,   // E4  (Shuddha Ga)
  'M': 349.23,   // F4  (Shuddha Ma)
  'M^': 369.99,  // F#4 (Tivra Ma)
  'P': 392.00,   // G4  (Pancham)
  'd': 415.30,   // G#4 (Komal Dha)
  'D': 440.00,   // A4  (Shuddha Dha)
  'n': 466.16,   // A#4 (Komal Ni)
  'N': 493.88,   // B4  (Shuddha Ni)

  // Taar Saptak (Upper Octave)
  "S'": 523.25,  // C5
  "r'": 554.37,  // C#5
  "R'": 587.33,  // D5
  "g'": 622.25,  // D#5
  "G'": 659.25,  // E5
  "M'": 698.46,  // F5
  "M^'": 739.99, // F#5
  "P'": 783.99,  // G5
  "D'": 880.00,  // A5
  "N'": 987.77,  // B5
};

export default function HowToReadBansuriNotationView({ onViewChange }: HowToReadBansuriNotationViewProps) {
  // Web Audio Context & Active Session
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeTimeoutsRef = useRef<number[]>([]);

  // Interactive Audio States
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [playingSeqId, setPlayingSeqId] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Metronome for Section 8 ("Swar Jyoti" Practice Melody)
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [currentBeat, setCurrentBeat] = useState(0); // 0, 1, 2, 3 for 4 beats per bar

  // Lazy AudioContext
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

  const getSessionDestination = (ctx: AudioContext) => {
    if (masterGainRef.current) {
      try {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
        masterGainRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      masterGainRef.current = null;
    }

    const sessionGain = ctx.createGain();
    sessionGain.gain.setValueAtTime(1, ctx.currentTime);
    sessionGain.connect(ctx.destination);
    masterGainRef.current = sessionGain;
    return sessionGain;
  };

  const stopAllAudio = () => {
    activeTimeoutsRef.current.forEach(id => clearTimeout(id));
    activeTimeoutsRef.current = [];

    if (masterGainRef.current && audioCtxRef.current) {
      try {
        masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        masterGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        masterGainRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      masterGainRef.current = null;
    }

    setActiveNote(null);
    setPlayingSeqId(null);
  };

  // Metronome Hook for 4-beat bar cycle
  useEffect(() => {
    let beatInterval: NodeJS.Timeout | null = null;
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      beatInterval = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev + 1) % 4;
          try {
            const ctx = getAudioContext();
            playTakMetronomeClick(ctx, next === 0);
          } catch (e) {
            // ignore
          }
          return next;
        });
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => {
      if (beatInterval) clearInterval(beatInterval);
    };
  }, [isMetronomeActive, bpm]);

  useEffect(() => {
    return () => {
      stopAllAudio();
      setIsMetronomeActive(false);
    };
  }, []);

  // Single Swara playback
  const playSwaraTone = (note: string, durationSec = 1.2) => {
    const cleanNote = note.trim();
    const freq = SWARA_FREQS[cleanNote];
    if (!freq) return;

    try {
      const ctx = getAudioContext();
      stopAllAudio();
      const sessionDest = getSessionDestination(ctx);
      setActiveNote(cleanNote);
      playBambooFluteTone(ctx, freq, ctx.currentTime, durationSec, 0.35, sessionDest);

      const tId = window.setTimeout(() => {
        setActiveNote(null);
      }, durationSec * 1000);
      activeTimeoutsRef.current.push(tId);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  // Sequence playback
  const playSequence = (seqId: string, notes: (string | null)[], noteDuration = 0.6) => {
    if (playingSeqId === seqId) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const ctx = getAudioContext();
    const sessionDest = getSessionDestination(ctx);
    setPlayingSeqId(seqId);

    notes.forEach((note, index) => {
      const startTimeOffset = index * noteDuration;
      
      // Visual indicator timeout
      const tVis = window.setTimeout(() => {
        setActiveNote(note);
      }, startTimeOffset * 1000);
      activeTimeoutsRef.current.push(tVis);

      // Sound trigger
      if (note && SWARA_FREQS[note]) {
        const tAudio = window.setTimeout(() => {
          if (masterGainRef.current) {
            playBambooFluteTone(
              ctx, 
              SWARA_FREQS[note], 
              ctx.currentTime, 
              noteDuration * 0.92, 
              0.32, 
              sessionDest
            );
          }
        }, startTimeOffset * 1000);
        activeTimeoutsRef.current.push(tAudio);
      }
    });

    const totalDuration = notes.length * noteDuration;
    const tEnd = window.setTimeout(() => {
      setActiveNote(null);
      setPlayingSeqId(null);
    }, totalDuration * 1000);
    activeTimeoutsRef.current.push(tEnd);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Raga example sequences
  const RAGA_EXAMPLES = [
    {
      name: 'Raag Bhoopali',
      notesStr: "S R G P D S'",
      notesArray: ['S', 'R', 'G', 'P', 'D', "S'"],
      desc: 'All Shuddha swaras, omitting Ma and Ni (Audav-Audav pentatonic).'
    },
    {
      name: 'Raag Kafi',
      notesStr: "S R g M P D n S'",
      notesArray: ['S', 'R', 'g', 'M', 'P', 'D', 'n', "S'"],
      desc: 'Features Komal Ga (g) and Komal Ni (n).'
    },
    {
      name: 'Raag Yaman',
      notesStr: "Ṇ R G M^ D N S'",
      notesArray: ['Ṇ', 'R', 'G', 'M^', 'D', 'N', "S'"],
      desc: 'Features Tivra Ma (M^) and Mandra Nishad (Ṇ) opening.'
    }
  ];

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">
      
      {/* 1. Breadcrumb & Progress Header */}
      <div className="border-b border-bamboo-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm">
          <nav className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => onViewChange?.('community')} 
              className="hover:text-amber-800 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>Home</span>
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_dashboard')} 
              className="hover:text-amber-800 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>Learn</span>
            </button>
            <span>/</span>
            <span className="text-amber-800 dark:text-amber-400 font-semibold truncate">
              How to Read Bansuri Notation
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Guide</span>
            </button>
            <button
              onClick={() => copyToClipboard(window.location.href, 'share-page')}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="Share Link"
            >
              {copiedSection === 'share-page' ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'share-page' ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        
        {/* 2. Hero Header Section */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
              <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Beginner Guide</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Reading time: 8–10 minutes</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive Audio Included</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            How to Read Bansuri Notation: A Beginner’s Guide
          </h1>

          {/* Blockquote Lead */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-amber-600 dark:border-amber-500 text-slate-700 dark:text-amber-100/90 text-sm sm:text-base leading-relaxed italic">
            &ldquo;Learn how to understand Sargam symbols, Komal and Tivra swaras, octaves, rhythm, rests and basic flute ornaments.&rdquo;
          </div>

          {/* Publishing Info */}
          <div className="flex flex-wrap items-center gap-4 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <img 
                src="/flutesangam_without_tagline_compressed.png" 
                alt="FluteSangam" 
                className="w-9 h-9 rounded-full border border-amber-300 dark:border-amber-700" 
              />
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Published: <strong className="text-slate-900 dark:text-white">Sep 2026</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Updated: <strong className="text-slate-900 dark:text-white">Sep 5, 2026</strong>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Introduction */}
        <section className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <span>Introduction</span>
          </h2>
          <p>
            Written notation can make flute learning much easier. It helps you remember a melody, practise a raga correctly and share music with other players. However, notation can initially look confusing when it contains capital and lowercase letters, octave marks, dashes and other symbols.
          </p>
          <p>
            This FluteSangam guide explains a simple notation system suitable for online bansuri lessons. By the end, you will be able to read a basic Sargam line and understand what each symbol asks you to play.
          </p>

          {/* Important Callout Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-xs flex gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-800 dark:text-amber-100/90 space-y-1">
              <p className="font-bold text-amber-900 dark:text-amber-300">
                Important Standard Note
              </p>
              <p>
                Indian music notation is not written identically by every teacher or website. Always check the notation key provided with a lesson. This page explains the standard recommended for <strong>FluteSangam</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Section 1: The Seven Basic Swaras */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">1</span>
              <span>The Seven Basic Swaras</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Indian music uses seven basic swara names (Sapta Swara). Click any note below to hear its resonant tone on the bamboo flute:
            </p>
          </div>

          {/* Interactive Swara Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50 dark:bg-slate-800/80 text-amber-950 dark:text-amber-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 font-bold text-center w-20">Symbol</th>
                  <th className="py-3 px-4 font-bold">Full Name</th>
                  <th className="py-3 px-4 font-bold">Spoken As</th>
                  <th className="py-3 px-4 font-bold text-center">Audio Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { sym: 'S', full: 'Shadja', spoken: 'Sa', desc: 'Tonic Root (Achala)' },
                  { sym: 'R', full: 'Rishabh', spoken: 'Re', desc: 'Second note' },
                  { sym: 'G', full: 'Gandhar', spoken: 'Ga', desc: 'Third note' },
                  { sym: 'M', full: 'Madhyam', spoken: 'Ma', desc: 'Fourth note' },
                  { sym: 'P', full: 'Pancham', spoken: 'Pa', desc: 'Fifth note (Achala)' },
                  { sym: 'D', full: 'Dhaivat', spoken: 'Dha', desc: 'Sixth note' },
                  { sym: 'N', full: 'Nishad', spoken: 'Ni', desc: 'Seventh note' },
                ].map((row) => (
                  <tr 
                    key={row.sym} 
                    className={`hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                      activeNote === row.sym ? 'bg-amber-100/70 dark:bg-amber-950/60 font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-800 dark:text-amber-400 text-base">
                      {row.sym}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {row.full}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                      {row.spoken} <span className="text-[11px] text-slate-400">({row.desc})</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => playSwaraTone(row.sym)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer ${
                          activeNote === row.sym
                            ? 'bg-amber-600 text-white animate-pulse'
                            : 'bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-slate-700 border border-amber-200 dark:border-slate-700'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Play {row.spoken}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ascending and Descending Sequence Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Basic Ascending &amp; Descending Scales
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playSequence('shuddha-aaroh', ['S', 'R', 'G', 'M', 'P', 'D', 'N', "S'"], 0.5)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                    playingSeqId === 'shuddha-aaroh' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {playingSeqId === 'shuddha-aaroh' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>Ascent (Aaroh)</span>
                </button>
                <button
                  onClick={() => playSequence('shuddha-avaroh', ["S'", 'N', 'D', 'P', 'M', 'G', 'R', 'S'], 0.5)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                    playingSeqId === 'shuddha-avaroh' ? 'bg-rose-600 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {playingSeqId === 'shuddha-avaroh' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>Descent (Avaroh)</span>
                </button>
              </div>
            </div>

            <div className="font-mono text-base sm:text-lg bg-black/40 p-3 rounded-xl border border-white/10 space-y-1 tracking-wider text-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-slate-400 w-16">Ascent:</span>
                <code>S R G M P D N S'</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-slate-400 w-16">Descent:</span>
                <code>S' N D P M G R S</code>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Sa</strong> is the tonal centre or &ldquo;home&rdquo; note. A phrase often feels complete and restful when it returns to Sa.
            </p>
          </div>

          {/* Sub-section: Sa is not always C */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base sm:text-lg font-display font-bold text-amber-900 dark:text-amber-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-600" />
              <span>Sa is Not Always C (The Movable Tonic)</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In Indian music, <strong>Sa is movable</strong>. You can establish it at a pitch that suits the singer, instrument or composition. Therefore, <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 rounded text-amber-900 dark:text-amber-300 font-mono font-bold">S</code> means Sa—it does not automatically mean the Western note C.
            </p>
            <div className="p-3 bg-amber-50/60 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-amber-100 dark:border-slate-700 space-y-1">
              <p>
                • If your flute tonic Sa is set to <strong>C</strong>, the Shuddha swaras correspond to <strong>C, D, E, F, G, A and B</strong>.
              </p>
              <p>
                • When your flute is an <strong>E Bass</strong>, your Sa is <strong>E</strong>, and the swaras shift to E, F#, G#, A, B, C#, D#.
              </p>
              <p className="text-amber-800 dark:text-amber-300 font-medium pt-1">
                The Western notes change with the instrument, but the <em>Sargam relationships remain identical</em>.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Section 2: Shuddha, Komal and Tivra Swaras */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">2</span>
              <span>Shuddha, Komal and Tivra Swaras</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Indian classical music distinguishes between natural, flattened, and sharpened notes:
            </p>
          </div>

          {/* Explanation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">
                • Shuddha (Natural)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The natural, unaltered form of a swara (written in uppercase: <code>R, G, M, D, N</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">
                • Komal (Flat / Lowered)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A lowered form of Re, Ga, Dha or Ni by a semitone (written in lowercase: <code>r, g, d, n</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">
                • Tivra (Sharp / Raised)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The raised form of Madhyam by a semitone (written as <code className="font-bold text-amber-700 dark:text-amber-400">M^</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">
                • Sa and Pa (Achala / Fixed)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Fixed tonic and fifth degree. They never have Komal or Tivra variants.
              </p>
            </div>
          </div>

          {/* FluteSangam Notation Chart Table */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>FluteSangam Standard Notation Chart</span>
              <span className="text-xs font-normal text-slate-500">12 Chromatic Swaras</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-amber-200 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-4 font-bold text-center w-24">Symbol</th>
                    <th className="py-2.5 px-4 font-bold">Meaning</th>
                    <th className="py-2.5 px-4 font-bold text-center w-24">Symbol</th>
                    <th className="py-2.5 px-4 font-bold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-center font-bold text-amber-700 dark:text-amber-400">S</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Sa (Root)</td>
                    <td className="py-2 px-4 text-center font-bold text-amber-700 dark:text-amber-400">P</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Pa (Fifth)</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                    <td className="py-2 px-4 text-center font-bold text-rose-700 dark:text-rose-400">r</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Komal Re (Flat 2nd)</td>
                    <td className="py-2 px-4 text-center font-bold text-slate-900 dark:text-white">R</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Shuddha Re (Natural 2nd)</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-center font-bold text-rose-700 dark:text-rose-400">g</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Komal Ga (Flat 3rd)</td>
                    <td className="py-2 px-4 text-center font-bold text-slate-900 dark:text-white">G</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Shuddha Ga (Natural 3rd)</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                    <td className="py-2 px-4 text-center font-bold text-slate-900 dark:text-white">M</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Shuddha Ma (Natural 4th)</td>
                    <td className="py-2 px-4 text-center font-bold text-indigo-700 dark:text-indigo-400">M^</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Tivra Ma (Sharp 4th)</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-center font-bold text-rose-700 dark:text-rose-400">d</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Komal Dha (Flat 6th)</td>
                    <td className="py-2 px-4 text-center font-bold text-slate-900 dark:text-white">D</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Shuddha Dha (Natural 6th)</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                    <td className="py-2 px-4 text-center font-bold text-rose-700 dark:text-rose-400">n</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Komal Ni (Flat 7th)</td>
                    <td className="py-2 px-4 text-center font-bold text-slate-900 dark:text-white">N</td>
                    <td className="py-2 px-4 font-sans text-slate-800 dark:text-slate-200">Shuddha Ni (Natural 7th)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Lowercase <code className="text-rose-600 font-bold">r</code>, <code className="text-rose-600 font-bold">g</code>, <code className="text-rose-600 font-bold">d</code> and <code className="text-rose-600 font-bold">n</code> represent Komal swaras. The raised mark in <code className="text-indigo-600 font-bold">M^</code> distinguishes Tivra Ma from Shuddha Ma.
            </p>
          </div>

          {/* Raga Scale Examples with Audio Preview */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Real Raga Scale Examples:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {RAGA_EXAMPLES.map((raag, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-amber-900 dark:text-amber-300">{raag.name}</span>
                      <button
                        onClick={() => copyToClipboard(raag.notesStr, `raag-${idx}`)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                        title="Copy notation"
                      >
                        {copiedSection === `raag-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-bold bg-amber-50/70 dark:bg-slate-800/80 p-2 rounded-lg text-slate-900 dark:text-amber-100 border border-amber-100 dark:border-slate-700">
                      {raag.notesStr}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      {raag.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => playSequence(`raag-preview-${idx}`, raag.notesArray, 0.55)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      playingSeqId === `raag-preview-${idx}`
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    {playingSeqId === `raag-preview-${idx}` ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{playingSeqId === `raag-preview-${idx}` ? 'Stop' : 'Listen Scale'}</span>
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 italic">
              These sequences provide a starting point, but a raga is more than a scale. Its identity also comes from characteristic phrases, important swaras, ornamentation and melodic movement.
            </p>
          </div>
        </section>

        {/* 6. Section 3: Understanding Octave Marks */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">3</span>
              <span>Understanding Octave Marks (Saptaks)</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A bansuri melody commonly moves through three distinct registers:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-amber-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 font-bold">Register (Saptak)</th>
                  <th className="py-3 px-4 font-bold">Meaning</th>
                  <th className="py-3 px-4 font-bold text-center w-28">Symbol Example</th>
                  <th className="py-3 px-4 font-bold text-center">Audio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    Mandra Saptak
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    Lower octave (deep, chest resonance)
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-base text-amber-700 dark:text-amber-400">
                    Ṇ (dot below)
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => playSwaraTone('Ṇ')}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-amber-100"
                    >
                      Play Ṇ
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-amber-50/30 dark:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    Madhya Saptak
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    Middle octave (natural, primary speaking range)
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-base text-amber-700 dark:text-amber-400">
                    N (no mark)
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => playSwaraTone('N')}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-amber-100"
                    >
                      Play N
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    Taar Saptak
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    Upper octave (bright, high whistle air velocity)
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-base text-amber-700 dark:text-amber-400">
                    N' (apostrophe)
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => playSwaraTone("N'")}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-amber-100"
                    >
                      Play N'
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3-Octave Passage Visual Demonstration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Full 3-Octave Progression Demonstration
              </span>
              <button
                onClick={() => playSequence('octave-demo', ['P̣', 'Ḍ', 'Ṇ', 'S', 'R', 'G', 'M', 'P', 'D', 'N', "S'"], 0.45)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  playingSeqId === 'octave-demo'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-600 text-white hover:bg-amber-500'
                }`}
              >
                {playingSeqId === 'octave-demo' ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{playingSeqId === 'octave-demo' ? 'Stop Octave Run' : 'Play 3-Octave Sequence'}</span>
              </button>
            </div>

            <div className="font-mono text-center sm:text-left text-sm sm:text-base bg-sand-100/70 dark:bg-slate-800 p-3 rounded-xl border border-bamboo-200/60 dark:border-slate-700 tracking-wider text-slate-900 dark:text-amber-200 font-bold">
              P̣ Ḍ Ṇ S | R G M P | D N S'
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 bg-amber-50/50 dark:bg-slate-800/40 rounded-xl border border-amber-100 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white block mb-1">Notice: Capital Letters ≠ Upper Octave</strong>
                Capital letters do not indicate the upper octave. For example, <code>G</code> is middle Shuddha Ga, <code>G'</code> is upper Shuddha Ga, and <code>g'</code> is upper Komal Ga.
              </div>
              <div className="p-3 bg-amber-50/50 dark:bg-slate-800/40 rounded-xl border border-amber-100 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white block mb-1">Flute Blowing Technique Tip</strong>
                Upper notes generally need a faster, more focused air stream—not uncontrolled force. Keep the lips, jaw and shoulders relaxed.
              </div>
            </div>
          </div>
        </section>

        {/* 7. Section 4: Reading Timing, Bars and Held Notes */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">4</span>
              <span>Reading Timing, Bars and Held Notes</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Unless stated otherwise, treat each written note as <strong>one count (beat)</strong>.
            </p>
          </div>

          {/* Timing Symbols Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-amber-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-4 font-bold text-center w-24">Symbol</th>
                  <th className="py-2.5 px-4 font-bold">Meaning &amp; Musical Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 text-center font-bold text-base text-amber-700 dark:text-amber-400">|</td>
                  <td className="py-2.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                    Divides a phrase or beat group (like a bar line in Western music).
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                  <td className="py-2.5 px-4 text-center font-bold text-base text-amber-700 dark:text-amber-400">||</td>
                  <td className="py-2.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                    Marks a larger ending or completed cycle (Avartan).
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 text-center font-bold text-base text-amber-700 dark:text-amber-400">—</td>
                  <td className="py-2.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                    Dash: Holds the previous note for one extra count.
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                  <td className="py-2.5 px-4 text-center font-bold text-base text-rose-600 dark:text-rose-400">0</td>
                  <td className="py-2.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                    Zero / Rest: One count of silence (pause blowing).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Counting Breakdown Examples */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Interactive Count Demonstrations:
            </h3>

            {/* Example 1 */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                Standard Four-Beat Bar:
              </span>
              <div className="font-mono text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-slate-500 dark:text-slate-400">Count: 1  2  3  4 | 1  2  3  4</div>
                <div className="font-bold text-slate-900 dark:text-white">Notes: S  R  G  M | P  D  N  S'</div>
              </div>
            </div>

            {/* Example 2 with Held Note and Rest */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 space-y-3">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                Example with Dash (Held) and Zero (Rest):
              </span>

              <div className="font-mono text-xs sm:text-sm bg-white dark:bg-slate-800 p-3 rounded-lg border border-amber-200 dark:border-slate-700 space-y-1 font-bold text-slate-900 dark:text-amber-200">
                <code>S R G — | M P 0 D ||</code>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                • <strong>Ga (G)</strong> begins on count 3 and continues through count 4 (held by the dash).<br />
                • In the second group, count 3 is <strong>silent (0)</strong> before Dha enters on count 4.
              </p>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              💡 <strong>Breath Planning:</strong> A bar line does not always mean you must breathe. It organises the notation. Take a breath where the musical phrase naturally pauses and before your air becomes exhausted.
            </div>
          </div>
        </section>

        {/* 8. Section 5: Basic Ornament Symbols */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">5</span>
              <span>Basic Ornament Symbols (Alankars &amp; Gamaks)</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ornaments give bansuri playing its flowing, vocal quality. Written symbols indicate the intended movement, but listening is still necessary to understand its exact shape.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-amber-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-4 font-bold">Technique</th>
                  <th className="py-2.5 px-4 font-bold text-center w-28">Example</th>
                  <th className="py-2.5 px-4 font-bold">Meaning &amp; Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Kan Swar (Grace Note)</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-700 dark:text-amber-400">(R)G</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">Touch Re briefly and lightly before landing on Ga.</td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Meend (Glide / Slur)</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-700 dark:text-amber-400">R~G</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">Glide smoothly from Re to Ga by rolling the finger.</td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Andolan (Oscillation)</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-700 dark:text-amber-400">g≈</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">Apply a slow, controlled microtonal wave / oscillation.</td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Murki (Fast Cluster)</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-700 dark:text-amber-400">&#123;G R G&#125;</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">Play the small group of notes quickly and lightly.</td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Repeat</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-700 dark:text-amber-400">x2</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">Repeat the enclosed musical phrase twice.</td>
                </tr>
                <tr className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Breath Mark</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-700 dark:text-amber-400">[breath]</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">Take a relaxed, planned breath without breaking tempo.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comparison Exercise Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              The Two-Stage Practice Rule:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-sans text-slate-500 font-bold block mb-1">Step 1: Practise Plainly</span>
                <code className="text-sm font-bold text-slate-900 dark:text-amber-200">R G M G R S</code>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-sans text-slate-500 font-bold block mb-1">Step 2: Add The Ornament</span>
                <code className="text-sm font-bold text-amber-800 dark:text-amber-300">R~G M G R S</code>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              Do not use ornaments to hide unclear fingering. Accurate swaras and stable rhythm should always come first.
            </p>
          </div>
        </section>

        {/* 9. Section 6: How to Read Any Notation Line */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">6</span>
              <span>How to Read Any Notation Line (The 6-Step Order)</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              When you encounter a new sheet of bansuri notation, follow this reliable sequence:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { num: '1', title: 'Establish Sa', desc: 'Use a drone or tuner to establish your tonic pitch firmly in your ear.' },
              { num: '2', title: 'Identify Swara', desc: 'Spot whether it is Sa, Re, Ga, Ma, Pa, Dha or Ni.' },
              { num: '3', title: 'Check Its Form', desc: 'Determine whether it is Shuddha (natural), Komal (flat), or Tivra (sharp).' },
              { num: '4', title: 'Check Octave', desc: 'Notice dots below for Mandra, apostrophes for Taar, or middle register.' },
              { num: '5', title: 'Count Rhythm', desc: 'Observe beat subdivisions, dashes (sustained counts), rests (0), and bar lines.' },
              { num: '6', title: 'Add Expression', desc: 'Add graceful Kan Swars and meends only after playing the plain phrase correctly.' },
            ].map((step) => (
              <div key={step.num} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 font-bold text-xs flex items-center justify-center">
                    {step.num}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{step.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Example Decoding Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900 to-slate-900 text-white space-y-4 shadow-lg border border-amber-800/40">
            <div className="border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Case Study: Example Line Decoding
              </span>
              <h3 className="font-mono text-base sm:text-lg font-bold text-amber-200 mt-1">
                Ṇ S R g | M~P g R | S — — — ||
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-amber-100/80">
              <div className="p-2.5 bg-black/30 rounded-lg border border-white/5">
                • <strong className="text-white font-mono">Ṇ</strong> is lower Shuddha Ni (Mandra octave with dot below).
              </div>
              <div className="p-2.5 bg-black/30 rounded-lg border border-white/5">
                • <strong className="text-white font-mono">S</strong> and <strong className="text-white font-mono">R</strong> are middle Sa and Shuddha Re.
              </div>
              <div className="p-2.5 bg-black/30 rounded-lg border border-white/5">
                • <strong className="text-white font-mono">g</strong> is Komal Ga (lowercase, flat 3rd).
              </div>
              <div className="p-2.5 bg-black/30 rounded-lg border border-white/5">
                • <strong className="text-white font-mono">M~P</strong> is a smooth meend glide from Shuddha Ma to Pa.
              </div>
              <div className="p-2.5 bg-black/30 rounded-lg border border-white/5 sm:col-span-2">
                • The final <strong className="text-white font-mono">S — — — ||</strong> is Shadja sustained for four full counts, followed by double bar line closure.
              </div>
            </div>

            <p className="text-xs text-amber-200/90 italic">
              Breaking a line into layers is much easier than trying to play everything all at once.
            </p>
          </div>
        </section>

        {/* 10. Section 7: Progressive Reading Exercises */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">7</span>
              <span>Progressive Reading Exercises</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Set a metronome between <strong>55 and 65 BPM</strong>. Speak each exercise aloud in rhythmic Sargam syllables before playing it on your flute:
            </p>
          </div>

          <div className="space-y-4">
            {/* Exercise 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Exercise 1: Shuddha Swaras
                  </span>
                  <p className="text-xs text-slate-500">Focus on equal note length and a steady, centred tone.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard("S R G M | P D N S' ||\nS' N D P | M G R S ||", 'ex1')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Copy notation"
                  >
                    {copiedSection === 'ex1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="font-mono text-sm sm:text-base bg-sand-100/70 dark:bg-slate-800 p-3.5 rounded-xl border border-bamboo-200/60 dark:border-slate-700 space-y-1 font-bold text-slate-900 dark:text-amber-200 tracking-wider">
                <div>S R G M | P D N S' ||</div>
                <div>S' N D P | M G R S ||</div>
              </div>
            </div>

            {/* Exercise 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Exercise 2: Altered Swaras (Chromatic Recognition)
                  </span>
                  <p className="text-xs text-slate-500">Say &ldquo;Komal&rdquo; or &ldquo;Tivra&rdquo; aloud whenever you encounter an altered swara.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard("S r R g | G M M^ P ||\nP d D n | N S' N S ||", 'ex2')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Copy notation"
                  >
                    {copiedSection === 'ex2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="font-mono text-sm sm:text-base bg-sand-100/70 dark:bg-slate-800 p-3.5 rounded-xl border border-bamboo-200/60 dark:border-slate-700 space-y-1 font-bold text-slate-900 dark:text-amber-200 tracking-wider">
                <div>S r R g | G M M^ P ||</div>
                <div>P d D n | N S' N S ||</div>
              </div>
            </div>

            {/* Exercise 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Exercise 3: Duration and Rest
                  </span>
                  <p className="text-xs text-slate-500">Count every beat. Do not shorten held notes or rush through the rest.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard("S — R G | M — 0 P ||\nD N S' — | N D P — ||", 'ex3')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Copy notation"
                  >
                    {copiedSection === 'ex3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="font-mono text-sm sm:text-base bg-sand-100/70 dark:bg-slate-800 p-3.5 rounded-xl border border-bamboo-200/60 dark:border-slate-700 space-y-1 font-bold text-slate-900 dark:text-amber-200 tracking-wider">
                <div>S — R G | M — 0 P ||</div>
                <div>D N S' — | N D P — ||</div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Section 8: FluteSangam Original Practice Melody: “Swar Jyoti” */}
        <section className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950 via-bamboo-950 to-slate-900 text-white shadow-xl border border-amber-800/40 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>FluteSangam Original Educational Piece</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  8. Practice Melody: &ldquo;Swar Jyoti&rdquo;
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/80 mt-1">
                  This short exercise uses Shuddha swaras, four-count bars, upper Sa, one Kan Swar and one meend.
                </p>
              </div>

              {/* Metronome Control Panel */}
              <div className="bg-black/30 rounded-2xl p-3 sm:p-3.5 border border-white/15 backdrop-blur-xs flex flex-col gap-2.5 shrink-0 sm:min-w-[260px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className={`w-3.5 h-3.5 ${isMetronomeActive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                    4-Beat Metronome
                  </span>
                  {/* Beat Indicator (4 Beats in Bar) */}
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((b) => (
                      <span
                        key={b}
                        className={`w-4 h-4 rounded-md text-[10px] font-bold flex items-center justify-center transition-all ${
                          isMetronomeActive && currentBeat === b
                            ? b === 0
                              ? 'bg-amber-400 text-slate-950 scale-110 shadow-sm font-extrabold'
                              : 'bg-emerald-400 text-slate-950 scale-110 font-bold'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {b + 1}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Tempo Adjust */}
                  <div className="flex items-center bg-white/10 rounded-xl px-2 py-1 border border-white/10 gap-1 text-xs">
                    <button
                      onClick={() => setBpm(prev => Math.max(40, prev - 5))}
                      className="px-1.5 py-0.5 text-amber-200 hover:text-white font-bold cursor-pointer rounded hover:bg-white/10 transition"
                      title="Decrease Tempo (-5 BPM)"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white min-w-[50px] text-center">
                      {bpm} <span className="text-[10px] text-amber-300/80 font-sans">BPM</span>
                    </span>
                    <button
                      onClick={() => setBpm(prev => Math.min(140, prev + 5))}
                      className="px-1.5 py-0.5 text-amber-200 hover:text-white font-bold cursor-pointer rounded hover:bg-white/10 transition"
                      title="Increase Tempo (+5 BPM)"
                    >
                      +
                    </button>
                  </div>

                  {/* Play / Stop Metronome Button */}
                  <button
                    onClick={() => {
                      if (isMetronomeActive) {
                        setIsMetronomeActive(false);
                      } else {
                        stopAllAudio();
                        try {
                          const ctx = getAudioContext();
                          playTakMetronomeClick(ctx, true);
                        } catch (e) {
                          // ignore
                        }
                        setIsMetronomeActive(true);
                      }
                    }}
                    className={`flex-1 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95 ${
                      isMetronomeActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40'
                    }`}
                  >
                    {isMetronomeActive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Metronome</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Metronome</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Melody Specs */}
            <div className="flex flex-wrap gap-4 text-xs text-amber-200">
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <strong>Practise tempo:</strong> {bpm} BPM (Adjustable)
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <strong>Count:</strong> Four beats per bar (4/4 time)
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <strong>Scale:</strong> Bilawal Thaat (All Shuddha Swaras)
              </span>
            </div>

            {/* Notation Sheet Box */}
            <div className="bg-black/40 rounded-2xl p-4 sm:p-6 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-300 border-b border-white/10 pb-2">
                <span className="font-bold tracking-wider uppercase">Complete Notation Sheet</span>
                <button
                  onClick={() => copyToClipboard(
                    "S R G M | G R S — ||\nR G M P | M G R — ||\nG M P D | P M G R ||\nS R G M | P — S' — ||\nS' N D P | M G R S ||\n(R)G M P D | P M~G R S ||", 
                    'swar-jyoti-all'
                  )}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'swar-jyoti-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'swar-jyoti-all' ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>

              <div className="font-mono text-base sm:text-lg leading-relaxed sm:leading-loose text-amber-100 tracking-wider space-y-1">
                <div>S R G M | G R S — ||</div>
                <div>R G M P | M G R — ||</div>
                <div>G M P D | P M G R ||</div>
                <div>S R G M | P — S' — ||</div>
                <div>S' N D P | M G R S ||</div>
                <div>(R)G M P D | P M~G R S ||</div>
              </div>
            </div>

            {/* How to Practise It (5 Steps) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                How to Practise It Step-by-Step:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-amber-400 font-bold block mb-1">1. Recite &amp; Clap</span>
                  Recite the swaras aloud while clapping four beats per bar steadily.
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-amber-400 font-bold block mb-1">2. Silent Finger Run</span>
                  Move fingers silently on the bansuri holes without blowing into the flute.
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-amber-400 font-bold block mb-1">3. Play Slowly</span>
                  Play slowly with relaxed air stream, omitting ornaments on the first pass.
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-amber-400 font-bold block mb-1">4. Add Ornaments</span>
                  Add the Kan Swar <code className="text-amber-300">(R)G</code> and meend <code className="text-amber-300">M~G</code> separately.
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 sm:col-span-2 lg:col-span-2">
                  <span className="text-amber-400 font-bold block mb-1">5. Record &amp; Review</span>
                  Record yourself playing along with a 60 BPM metronome and verify whether your held beats remain rock-steady.
                </div>
              </div>
            </div>

            {/* Pedagogical Disclaimer / Attribution */}
            <div className="text-xs text-amber-200/70 border-t border-white/10 pt-4">
              &ldquo;Swar Jyoti&rdquo; was created specifically for FluteSangam as an educational exercise. It is not presented as a traditional bandish, gat or gharana composition.
            </div>
          </div>
        </section>

        {/* 12. Section 9: Common Mistakes */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white text-sm font-bold">9</span>
              <span>Common Mistakes Beginners Make</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Be mindful of these frequent misunderstandings when reading bansuri notation:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                mistake: 'Assuming Sa is always C',
                fix: 'Establish your flute tonic before converting Sargam into Western note names.'
              },
              {
                mistake: 'Ignoring the notation key',
                fix: 'Symbols may differ between teachers and websites; check the legend first.'
              },
              {
                mistake: 'Confusing notation with fingering',
                fix: 'Notation names a musical swara; an interactive fingering chart shows hole coverage.'
              },
              {
                mistake: 'Breathing at every bar line',
                fix: 'A musical phrase often continues across a bar line; breathe at natural phrase pauses.'
              },
              {
                mistake: 'Playing too fast too soon',
                fix: 'Increase your tempo only after playing three consecutive accurate repetitions.'
              },
              {
                mistake: 'Expecting notation to show everything',
                fix: 'Tone warmth, microtonal nuances, and bhava (emotion) always require attentive listening.'
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{item.mistake}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-6">
                  <strong>Correction:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 13. Quick-Reference Cheat Sheet Chart */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>Quick-Reference Chart</span>
            </h2>
            <button
              onClick={() => copyToClipboard(
`S = Sa
r = Komal Re       R = Shuddha Re
g = Komal Ga       G = Shuddha Ga
M = Shuddha Ma     M^ = Tivra Ma
P = Pa
d = Komal Dha      D = Shuddha Dha
n = Komal Ni       N = Shuddha Ni

Ṇ  = Lower Ni     N = Middle Ni     N' = Upper Ni
—  = Hold the previous swara for one extra count
0  = One count of silence
|  = Phrase or beat-group divider
|| = Larger ending`, 
                'quick-ref'
              )}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedSection === 'quick-ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'quick-ref' ? 'Copied Chart' : 'Copy Chart'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-amber-200 p-5 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 shadow-inner overflow-x-auto">
            <pre className="whitespace-pre">
{`S = Sa
r = Komal Re       R = Shuddha Re
g = Komal Ga       G = Shuddha Ga
M = Shuddha Ma     M^ = Tivra Ma
P = Pa
d = Komal Dha      D = Shuddha Dha
n = Komal Ni       N = Shuddha Ni

Ṇ  = Lower Ni     N = Middle Ni     N' = Upper Ni
—  = Hold the previous swara for one extra count
0  = One count of silence
|  = Phrase or beat-group divider
|| = Larger ending`}
            </pre>
          </div>

          <p className="text-xs text-slate-500">
            Keep this chart handy while using FluteSangam’s raga lessons, alankar exercises and song notations.
          </p>
        </section>

        {/* 14. Frequently Asked Questions Accordion */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {[
              {
                q: 'Is bansuri notation the same as Western staff notation?',
                a: 'No. Sargam notation uses Sa, Re, Ga, Ma, Pa, Dha and Ni relative to a movable Sa. Western notation places pitches on a five-line staff and normally provides more detailed duration markings.'
              },
              {
                q: 'Can I use the same notation with different flute scales?',
                a: 'Yes. Sargam describes relative note relationships. Establish Sa correctly for the selected flute and musical key before playing.'
              },
              {
                q: 'How can I identify an upper-octave swara?',
                a: "FluteSangam places an apostrophe after it, such as S' or R'. A dot above may be used in other formatted notation systems."
              },
              {
                q: 'What does a dash after a note mean?',
                a: 'In this system, a dash (—) holds the preceding note for one additional count. Check the legend when reading notation from another source.'
              },
              {
                q: 'Can notation alone teach me a raga?',
                a: 'No. Notation can show swaras and important phrases, but a raga also depends on note treatment, emphasis, movement and expression. Combine notation with listening and practice.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-sm sm:text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 15. Final Thoughts */}
        <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Final Thoughts: The Five Questions</span>
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            To read bansuri notation confidently, ask five questions:
          </p>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
            &ldquo;Which swara is written? Is it Shuddha, Komal or Tivra? Which octave? How long should it last? How should it connect to the next note?&rdquo;
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Begin with short phrases. Speak the swaras, clap the rhythm, move the fingers and then play. With regular practice, you will stop seeing separate symbols and begin hearing the musical phrase in your mind.
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
            Notation gives your practice structure. Listening, breath and expression turn it into music.
          </p>
        </section>

        {/* 16. Suggested Internal Links */}
        <section className="space-y-4 pt-4">
          <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <span>Suggested Internal Links &amp; Next Steps</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Interactive Fingering Chart',
                desc: 'See hole coverage for every note across 3 octaves.',
                view: 'learn_fingering_chart' as AppView,
                path: '/learn/fingering-chart'
              },
              {
                title: 'Note and Key Converter',
                desc: 'Translate Swaras ⇄ Western notes for any flute scale.',
                view: 'note_key_converter' as AppView,
                path: '/tools/flute-note-key-converter'
              },
              {
                title: 'Online Flute Tuner',
                desc: 'Check your flute tuning and exact pitch frequencies.',
                view: 'learn_tuner' as AppView,
                path: '/tuner'
              },
              {
                title: 'Flute Scales & Octaves Guide',
                desc: 'Master Mandra, Madhya and Taar Saptaks in depth.',
                view: 'learn_scales_octaves' as AppView,
                path: '/learn/flute-scales-octaves'
              },
              {
                title: 'Beginner Alankar Exercises',
                desc: 'Practise 20 fundamental daily paltas with notation.',
                view: 'learn_alankaras' as AppView,
                path: '/learn/alankaras/beginner'
              },
              {
                title: 'Daily Flute Practice Guide',
                desc: 'Structured 30–60 minute daily Swar Sadhana routines.',
                view: 'learn_daily_practice' as AppView,
                path: '/learn/daily-practice-guide'
              },
              {
                title: 'Raag Yaman Guide',
                desc: 'Master Tivra Ma (M^) and evening classical phrases.',
                view: 'raga_yaman' as AppView,
                path: '/learn/raga-yaman'
              },
              {
                title: 'Raag Kafi Guide',
                desc: 'Master Komal Ga (g) and Komal Ni (n) movements.',
                view: 'raga_kafi' as AppView,
                path: '/learn/raga-kafi'
              },
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onViewChange) {
                    onViewChange(link.view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-md transition text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                    {link.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {link.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* 17. About Author Card */}
        <div className="pt-6">
          <AboutAuthorSection onViewChange={onViewChange} />
        </div>

      </article>
    </div>
  );
}
