import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Radio, Award, Sparkles, ShieldAlert, Lightbulb, RotateCcw, ArrowLeft
} from 'lucide-react';
import { AppView } from '../types';
import { playTakMetronomeClick } from '../lib/audioUtils';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';

interface RagaMalkaunsViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaMalkaunsView({ onViewChange }: RagaMalkaunsViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [activeScale, setActiveScale] = useState<'aaroh' | 'avaroh' | 'general' | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(50);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for C Scale (C4 = 261.63 Hz) for Raag Malkauns (S, g, M, d, n, S')
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,     // Sa (C4)
    'g': 311.13,     // Komal Ga (Eb4)
    'M': 349.23,     // Shuddha Ma (F4)
    'd': 415.30,     // Komal Dha (Ab4)
    'n': 466.16,     // Komal Ni (Bb4)
    "S'": 523.25,    // Upper Sa (C5)
    "g'": 622.25,    // Upper Komal Ga (Eb5)
    "M'": 698.46,    // Upper Shuddha Ma (F5)
    "d'": 830.61,    // Upper Komal Dha (Ab5)
    "n.": 233.08,    // Lower Komal Ni (Bb3)
    "d.": 207.65,    // Lower Komal Dha (Ab3)
    "m.": 174.61,    // Lower Ma (F3)
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

  const playSwaraTone = (swaraName: string, duration = 0.9, scale: 'aaroh' | 'avaroh' | 'general' = 'general') => {
    try {
      const ctx = getAudioContext();
      const freq = SWARA_FREQS[swaraName] || 261.63;
      
      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(swaraName);
      setActiveScale(scale);
      setTimeout(() => {
        setActiveSwara(null);
        setActiveScale(null);
      }, duration * 1000);
    } catch (e) {
      console.warn("Audio playback not supported or blocked", e);
    }
  };

  // Play sequence of swaras for Aaroh / Avaroh
  const playSequence = (swaraTokens: string[], scale: 'aaroh' | 'avaroh') => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    const ctx = getAudioContext();
    let startTime = ctx.currentTime + 0.1;
    const noteDuration = 0.65;

    swaraTokens.forEach((token) => {
      const cleanToken = token.trim();
      const freq = SWARA_FREQS[cleanToken] || 261.63;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, startTime);

      gain.gain.setValueAtTime(0.005, startTime);
      gain.gain.exponentialRampToValueAtTime(0.26, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration - 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);

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

  // Metronome for Nisha Dhyan learning piece
  useEffect(() => {
    let beatInterval: any = null;
    if (isPlayingComposition) {
      const intervalMs = (60 / bpm) * 1000;
      beatInterval = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev % 16) + 1;
          try {
            const ctx = getAudioContext();
            playTakMetronomeClick(ctx, next === 1);
          } catch (e) {}
          return next;
        });
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(beatInterval);
  }, [isPlayingComposition, bpm]);

  const nishaDhyanAalap = `Aalap (Play freely without taal)
S
g M
M d
d n
S'

Return gradually:
S' n d
M g
g S

Continue:
S g M
d M
g S

g M d
n d M
g S`;

  const nishaDhyanComposition = `Mukhda
| S  g  M  d | n  S'  n  d |
| M  g  S  - | S  g  M  - |

Antara
| M  d  n  S' | n  d  M  g |
| S  g  M  d | M  g  S  - |

Vistar Practice
| S  g  M  d | n  d  M  g |
| S  g  M  d | n  S' n  d |

| M  g  S  g | M  d  M  g |
| S  g  M  d | M  g  S  - |

Concluding Phrase (Repeat 3 times)
g M d | M g | S`;

  const faqs = [
    {
      q: "Is Raag Malkauns suitable for intermediate flute players?",
      a: "Yes. Malkauns is an excellent intermediate raga for developing control over Komal swaras, sustained notes, meend, and slow improvisation."
    },
    {
      q: "Which notes are used in Raag Malkauns?",
      a: "Sa, Komal Ga, Ma, Komal Dha, and Komal Ni are used."
    },
    {
      q: "Which notes are omitted?",
      a: "Re and Pa are omitted."
    },
    {
      q: "How many notes does Malkauns use?",
      a: "It uses five swaras, making it an Audav–Audav raga."
    },
    {
      q: "Which notes are Komal?",
      a: "Ga, Dha, and Ni are Komal."
    },
    {
      q: "Which note is the Vadi?",
      a: "Ma is traditionally considered the Vadi, while Sa is the Samvadi."
    },
    {
      q: "What is the traditional time for Raag Malkauns?",
      a: "Malkauns is traditionally associated with the late-night period."
    },
    {
      q: "Is Malkauns difficult to play on the flute?",
      a: "The five-note structure is relatively simple, but producing its characteristic depth and expressive treatment requires careful practice."
    },
    {
      q: "Which flute should I use for Raag Malkauns?",
      a: "Any properly tuned bansuri can be used. Choose a flute that allows comfortable control of the middle and lower registers."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
      id="raga-malkauns-view"
    >
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={() => onViewChange && onViewChange('learn_raagas')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/80 hover:bg-bamboo-100 border border-bamboo-200/80 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          id="raga-malkauns-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Ragas
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-purple-800 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200">
            Intermediate Guide
          </span>
          <span className="text-xs font-medium text-indigo-800 bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
            Late Night
          </span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50 text-bamboo-950 rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-300/80 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-200/90 backdrop-blur-md rounded-2xl border border-amber-300 shrink-0 shadow-2xs">
                <Moon className="w-7 h-7 text-amber-800" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                  Hindustani Classical Raga
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-bamboo-950 mt-1">
                  Raag Malkauns
                </h1>
              </div>
            </div>

            {/* Microdata Signals & Timestamps */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-amber-950 bg-white/90 border border-amber-200 shadow-2xs rounded-2xl px-4 py-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-stone-600">Published:</span>
                <time itemProp="datePublished" dateTime="2026-08-08T00:00:00Z" className="font-semibold text-bamboo-950">
                  Aug 8, 2026
                </time>
              </div>
              <span className="text-amber-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-stone-600">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-08-08T00:00:00Z" className="font-semibold text-bamboo-950">
                  Aug 8, 2026
                </time>
              </div>
            </div>
          </div>

          <p className="text-purple-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Complete Guide, Notes, Aaroh, Avaroh & Practice Instructions
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10">

        {/* Introduction */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <BookOpen className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Introduction</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            <strong>Raag Malkauns</strong> is one of the most powerful and meditative ragas in Hindustani Classical Music. It belongs to the <strong>Bhairavi Thaat</strong> and is traditionally performed during the late-night hours.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Malkauns has a distinctive five-note structure and uses <strong>Komal Ga (g)</strong>, <strong>Komal Dha (d)</strong>, and <strong>Komal Ni (n)</strong>, while Re and Pa are omitted. This creates a deep, serious, and contemplative sound.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            For bansuri players, Malkauns is an excellent intermediate raga for developing breath control, sustained notes, meend, pitch accuracy, and expressive playing. Although it uses only five swaras, its melodic character is much more sophisticated than a simple pentatonic scale.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            The beauty of Malkauns comes from slow development, careful note treatment, and the space between phrases rather than from fast note patterns.
          </p>
        </section>

        {/* Basic Information Grid Table */}
        <section className="bg-gradient-to-br from-purple-50/60 to-indigo-50/60 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-3xs space-y-4">
          <div className="flex items-center gap-2.5 text-purple-950 font-display font-bold text-xl sm:text-2xl border-b border-purple-200/80 pb-3">
            <Sliders className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-200/60 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">Raga Name</span>
              <span className="text-base font-semibold text-gray-900">Malkauns</span>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-200/60 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">Thaat</span>
              <span className="text-base font-semibold text-gray-900">Bhairavi</span>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-200/60 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">Jati</span>
              <span className="text-base font-semibold text-gray-900">Audav – Audav (5 Notes)</span>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-200/60 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">Time</span>
              <span className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-purple-700" /> Late Night (Midnight)
              </span>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-200/60 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">Vadi / Samvadi</span>
              <span className="text-base font-semibold text-gray-900">Vadi: Ma (M) | Samvadi: Sa (S)</span>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-200/60 shadow-2xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">Nature & Rasa</span>
              <span className="text-base font-semibold text-gray-900">Serious, Meditative (Shanta, Gambhir)</span>
            </div>
          </div>
        </section>

        {/* Swaras Used Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <Music className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Swaras Used</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-700">
            Raag Malkauns uses <strong>five swaras</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-emerald-950 text-sm sm:text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Included Swaras
              </h3>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 pl-2">
                <li>• <strong>Sa (S)</strong> — Shadja</li>
                <li>• <strong>Komal Ga (g)</strong> — Flat Gandhar</li>
                <li>• <strong>Ma (M)</strong> — Shuddha Madhyam (Vadi)</li>
                <li>• <strong>Komal Dha (d)</strong> — Flat Dhaivat</li>
                <li>• <strong>Komal Ni (n)</strong> — Flat Nishad</li>
              </ul>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-rose-950 text-sm sm:text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-700" /> Omitted Notes (Varjit Swaras)
              </h3>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 pl-2">
                <li>• <strong>Re (R)</strong> — Rishabh (Omitted in both Aaroh & Avaroh)</li>
                <li>• <strong>Pa (P)</strong> — Pancham (Omitted in both Aaroh & Avaroh)</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs sm:text-sm font-medium">
            <strong>Basic Swara Set:</strong> <span className="font-mono text-base font-bold text-purple-900 ml-2">S – g – M – d – n</span>
            <p className="mt-1 text-xs text-amber-900">The three Komal swaras (g, d, n) are an essential part of the raga's deep character.</p>
          </div>
        </section>

        {/* Interactive Aaroh & Avaroh Swara Player */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
          <div className="flex items-center justify-between border-b border-bamboo-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl">
              <Volume2 className="w-6 h-6 text-purple-700 shrink-0" />
              <h2>Aaroh & Avaroh</h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">Tap swara buttons below to listen</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aaroh */}
            <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-widest block">Aaroh (Ascending)</span>
                  <p className="font-mono text-lg font-bold text-purple-950 tracking-wider">S g M d n S'</p>
                </div>
                <button
                  onClick={() => playSequence(['S', 'g', 'M', 'd', 'n', "S'"], 'aaroh')}
                  disabled={isPlayingSequence}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> Play Aaroh
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {['S', 'g', 'M', 'd', 'n', "S'"].map((swara) => (
                  <button
                    key={swara}
                    onClick={() => playSwaraTone(swara, 0.9, 'aaroh')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-3xs ${
                      activeSwara === swara && (activeScale === 'aaroh' || activeScale === 'general')
                        ? 'bg-purple-600 text-white border-purple-700 scale-105'
                        : 'bg-white text-purple-950 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {swara}
                  </button>
                ))}
              </div>
            </div>

            {/* Avaroh */}
            <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest block">Avaroh (Descending)</span>
                  <p className="font-mono text-lg font-bold text-indigo-950 tracking-wider">S' n d M g S</p>
                </div>
                <button
                  onClick={() => playSequence(["S'", 'n', 'd', 'M', 'g', 'S'], 'avaroh')}
                  disabled={isPlayingSequence}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> Play Avaroh
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {["S'", 'n', 'd', 'M', 'g', 'S'].map((swara) => (
                  <button
                    key={swara}
                    onClick={() => playSwaraTone(swara, 0.9, 'avaroh')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-3xs ${
                      activeSwara === swara && (activeScale === 'avaroh' || activeScale === 'general')
                        ? 'bg-indigo-600 text-white border-indigo-700 scale-105'
                        : 'bg-white text-indigo-950 border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {swara}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pakad & Chalan */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <Sparkles className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Pakad & Characteristic Chalan</h2>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Key Pakad Phrases</h3>
            <p className="text-xs sm:text-sm text-gray-600">A useful introductory catchphrase:</p>
            <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-2xl border border-slate-800 space-y-1">
              <p>S g M</p>
              <p>d M</p>
              <p>g S</p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-2">Another characteristic movement:</p>
            <div className="bg-slate-900 text-amber-300 font-mono text-sm sm:text-base p-4 rounded-2xl border border-slate-800 space-y-1">
              <p>g M d</p>
              <p>n d M</p>
              <p>g S</p>
            </div>
            <p className="text-xs text-gray-500 italic">Practice these phrases slowly and allow each important note to settle before moving to the next.</p>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 text-base">Chalan (Melodic Movement)</h3>
            <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200/80 font-mono text-xs sm:text-sm text-purple-950 space-y-2">
              <p>S g M</p>
              <p>M d n</p>
              <p>S'</p>
              <p>S' n d</p>
              <p>M g</p>
              <p>S</p>
              <p className="pt-2 text-purple-900 font-sans font-medium text-xs">Continue with:</p>
              <p>g M d</p>
              <p>n d M</p>
              <p>g M g</p>
              <p>S</p>
              <p className="pt-2 text-purple-900 font-sans font-medium text-xs">Another useful movement:</p>
              <p>S g M d</p>
              <p>M d n S'</p>
              <p>n d M</p>
              <p>g S</p>
            </div>
            <p className="text-xs text-gray-600">The phrases should be played with a calm and spacious approach.</p>
          </div>
        </section>

        {/* Important Characteristics */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <Lightbulb className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Important Characteristics</h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700 pt-1">
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span>Malkauns is an <strong>Audav–Audav</strong> raga.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span>Only <strong>five swaras</strong> are used.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span><strong>Re and Pa</strong> are omitted completely.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span><strong>Ga, Dha, and Ni</strong> are Komal (flat).</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span><strong>Ma</strong> is traditionally considered the Vadi.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span><strong>Sa</strong> is the Samvadi.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span>Slow development is particularly effective.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 font-bold">•</span>
              <span>Meend and gentle oscillation can enhance the raga.</span>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100 md:col-span-2">
              <span className="text-purple-700 font-bold">•</span>
              <span>The raga has a deep, serious, and meditative character. Simply playing the five-note scale does not establish the full character of Malkauns.</span>
            </li>
          </ul>
        </section>

        {/* Mood, Emotion & Why Learn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-3">
            <div className="flex items-center gap-2 text-bamboo-900 font-display font-bold text-lg border-b border-bamboo-100 pb-2">
              <Heart className="w-5 h-5 text-purple-700 shrink-0" />
              <h2>Mood & Emotion</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Raag Malkauns is known for its profound and introspective atmosphere. It can evoke:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Meditation', 'Serenity', 'Depth', 'Strength', 'Mystery', 'Devotion', 'Inner Reflection'].map((mood) => (
                <span key={mood} className="bg-purple-100/80 text-purple-900 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200">
                  {mood}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600 pt-2 leading-relaxed">
              Its late-night association and restrained melodic movement make it particularly suitable for slow and contemplative flute playing.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-3">
            <div className="flex items-center gap-2 text-bamboo-900 font-display font-bold text-lg border-b border-bamboo-100 pb-2">
              <Award className="w-5 h-5 text-purple-700 shrink-0" />
              <h2>Why Learn Raag Malkauns?</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Malkauns is an important step for an intermediate flute player because it develops skills that are difficult to gain from straightforward scale-based ragas.
            </p>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1 pl-1">
              <li>• Control over multiple Komal swaras</li>
              <li>• Accurate pitch placement</li>
              <li>• Breath stability & long-note control</li>
              <li>• Smooth meend & slow improvisation</li>
              <li>• Expressive phrasing & awareness of space/silence</li>
            </ul>
          </section>
        </div>

        {/* Practice Routine & Interactive Practice Timer */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
          <div className="flex items-center justify-between border-b border-bamboo-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl">
              <Clock className="w-6 h-6 text-purple-700 shrink-0" />
              <h2>Practice Routine</h2>
            </div>

            {/* Interactive Timer Badge */}
            <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200">
              <span className="text-xs font-bold text-purple-900 uppercase">45-Min Session:</span>
              <span className="font-mono font-extrabold text-purple-950 text-base">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-3 py-1 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                {isTimerRunning ? 'Pause' : 'Start Timer'}
              </button>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-gray-700">
            {/* Long Notes */}
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2">
              <h3 className="font-bold text-purple-950 text-sm">1. Long Notes (Kharaj & Swara Sadhana)</h3>
              <p>Begin with slow, sustained notes: <span className="font-mono font-bold text-purple-900">S — g — M — d — n — S'</span></p>
              <p className="text-gray-600">Hold each note for 8–10 seconds. Pay particular attention to the pitch of the three Komal swaras.</p>
            </div>

            {/* Komal Swara Practice */}
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2">
              <h3 className="font-bold text-purple-950 text-sm">2. Komal Swara Practice</h3>
              <p>Practice each important Komal swara separately:</p>
              <p className="font-mono font-bold text-purple-900">S — g | S — d | S — n</p>
              <p>Then connect them:</p>
              <p className="font-mono font-bold text-purple-900">S g M | M d | d n | n S'</p>
              <p className="text-gray-600">Keep the airflow steady and avoid rushing.</p>
            </div>

            {/* Aaroh-Avaroh Practice */}
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2">
              <h3 className="font-bold text-purple-950 text-sm">3. Aaroh–Avaroh Practice</h3>
              <p className="font-mono font-bold text-purple-900">S g M d n S' | S' n d M g S</p>
              <p className="text-gray-600">Repeat slowly 10–15 times. After the notes become comfortable, practice the same movement with gentle meend.</p>
            </div>

            {/* FluteSangam Original Alankars */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" /> FluteSangam Original Alankars for Raag Malkauns
              </h3>

              {/* Alankar 1 */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">FluteSangam Original Alankar 1</span>
                <p><strong className="text-xs uppercase text-gray-500">Ascending:</strong> <span className="font-mono text-purple-900 font-bold">S g | g M | M d | d n | n S'</span></p>
                <p><strong className="text-xs uppercase text-gray-500">Descending:</strong> <span className="font-mono text-purple-900 font-bold">S' n | n d | d M | M g | g S</span></p>
              </div>

              {/* Alankar 2 */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">FluteSangam Original Alankar 2</span>
                <p><strong className="text-xs uppercase text-gray-500">Ascending:</strong> <span className="font-mono text-purple-900 font-bold">S g M | g M d | M d n | d n S'</span></p>
                <p><strong className="text-xs uppercase text-gray-500">Descending:</strong> <span className="font-mono text-purple-900 font-bold">S' n d | n d M | d M g | M g S</span></p>
              </div>

              {/* Alankar 3 */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">FluteSangam Original Alankar 3 (Focuses on Ma)</span>
                <p><strong className="text-xs uppercase text-gray-500">Ascending:</strong> <span className="font-mono text-purple-900 font-bold">S g M g | g M d M | M d n d | d n S' n</span></p>
                <p><strong className="text-xs uppercase text-gray-500">Descending:</strong> <span className="font-mono text-purple-900 font-bold">S' n d n | n d M d | d M g M | M g S</span></p>
                <p className="text-xs text-gray-500 italic">Practice this very slowly and keep every Komal swara controlled.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-rose-950 font-display font-bold text-lg border-b border-rose-200 pb-2">
              <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">❌ Accidentally playing Re or Pa.</li>
              <li className="flex items-start gap-2">❌ Playing the Komal swaras too high or too low.</li>
              <li className="flex items-start gap-2">❌ Treating Malkauns as simply a five-note scale.</li>
              <li className="flex items-start gap-2">❌ Playing too fast.</li>
              <li className="flex items-start gap-2">❌ Using excessive ornamentation.</li>
              <li className="flex items-start gap-2">❌ Moving continuously without allowing important notes to breathe.</li>
              <li className="flex items-start gap-2">❌ Losing the serious and meditative character of the raga.</li>
            </ul>
          </section>

          <section className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-display font-bold text-lg border-b border-emerald-200 pb-2">
              <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0" />
              <h2>Tips for Better Performance</h2>
            </div>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5">
              <li>• Practice with a tanpura drone tuned to Sa-Ma.</li>
              <li>• Spend extra time on Komal Ga, Dha, and Ni.</li>
              <li>• Practice long notes before attempting fast phrases.</li>
              <li>• Use gentle meend between suitable swaras.</li>
              <li>• Give Ma (Vadi) sufficient prominence.</li>
              <li>• Leave small spaces between phrases during slow Aalap.</li>
              <li>• Avoid unnecessary fast passages.</li>
              <li>• Concentrate on tone quality and pitch stability.</li>
              <li>• Let the raga develop gradually.</li>
            </ul>
          </section>
        </div>

        {/* FluteSangam Original Learning Piece: Nisha Dhyan */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
          <div className="flex items-center justify-between border-b border-bamboo-100 pb-3 flex-wrap gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                <span className="text-xs font-bold text-purple-900 uppercase tracking-widest">FluteSangam Original Composition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Nisha Dhyan</h2>
            </div>

            {/* Metronome Control */}
            <div className="flex items-center gap-3 bg-purple-50 p-2.5 rounded-2xl border border-purple-200">
              <button
                onClick={() => setIsPlayingComposition(!isPlayingComposition)}
                className={`p-2 rounded-xl text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingComposition ? 'bg-rose-600 hover:bg-rose-700' : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                {isPlayingComposition ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlayingComposition ? 'Stop Taal' : 'Start Teentaal'}
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-purple-900">BPM:</span>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-20 accent-purple-700 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-purple-950">{bpm}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-xs">
            <div><span className="text-gray-500 block">Raag:</span><strong className="text-purple-950 font-semibold">Malkauns</strong></div>
            <div><span className="text-gray-500 block">Taal:</span><strong className="text-purple-950 font-semibold">Teentaal (16 Beats)</strong></div>
            <div><span className="text-gray-500 block">Laya:</span><strong className="text-purple-950 font-semibold">Madhya Laya</strong></div>
            <div><span className="text-gray-500 block">Difficulty:</span><strong className="text-purple-950 font-semibold">Intermediate</strong></div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            This learning piece has been created specifically for FluteSangam to help students explore the five-note structure and characteristic movements of Raag Malkauns. It is an original educational exercise, not a traditional bandish or classical composition.
          </p>

          {/* Aalap */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Aalap (Free Rhythm)</h3>
              <button
                onClick={() => copyToClipboard(nishaDhyanAalap, 'Aalap')}
                className="text-xs font-semibold text-purple-800 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 cursor-pointer"
              >
                {copiedSection === 'Aalap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'Aalap' ? 'Copied' : 'Copy Notation'}
              </button>
            </div>
            <pre className="bg-slate-900 text-purple-200 font-mono text-xs sm:text-sm p-4 rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
              {nishaDhyanAalap}
            </pre>
          </div>

          {/* Notation Blocks */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Mukhda, Antara & Vistar</h3>
              <button
                onClick={() => copyToClipboard(nishaDhyanComposition, 'Composition')}
                className="text-xs font-semibold text-purple-800 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 cursor-pointer"
              >
                {copiedSection === 'Composition' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'Composition' ? 'Copied' : 'Copy Notation'}
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm p-4 rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
              {nishaDhyanComposition}
            </pre>
          </div>

          {/* How to Practice */}
          <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 space-y-2 text-xs sm:text-sm text-gray-700">
            <h3 className="font-bold text-purple-950 text-base">How to Practice the Learning Piece</h3>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li>Begin with long-note practice.</li>
              <li>Practice the three Komal swaras individually.</li>
              <li>Practice Aaroh and Avaroh.</li>
              <li>Repeat the Pakad several times.</li>
              <li>Practice the Aalap without rhythm.</li>
              <li>Learn the Mukhda slowly.</li>
              <li>Add the Antara after the Mukhda becomes comfortable.</li>
              <li>Practice the Vistar separately.</li>
              <li>Combine the sections gradually.</li>
              <li>Finish with the Concluding Phrase.</li>
              <li>Start around 45–50 BPM. Gradually increase toward 70 BPM while maintaining the raga's calm character. Do not sacrifice note quality for speed.</li>
            </ol>
          </div>
        </section>

        {/* Suggested Daily Practice Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <Calendar className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Suggested Daily Practice Schedule</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-gray-700">
              <thead>
                <tr className="bg-purple-100/70 text-purple-950 font-bold border-b border-purple-200">
                  <th className="p-3.5 rounded-l-xl">Exercise Module</th>
                  <th className="p-3.5 rounded-r-xl">Recommended Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="p-3 font-medium">Long Notes (Kharaj Sadhana)</td><td className="p-3 font-mono font-semibold text-purple-900">5 minutes</td></tr>
                <tr><td className="p-3 font-medium">Komal Swara Practice</td><td className="p-3 font-mono font-semibold text-purple-900">5 minutes</td></tr>
                <tr><td className="p-3 font-medium">Aaroh–Avaroh</td><td className="p-3 font-mono font-semibold text-purple-900">5 minutes</td></tr>
                <tr><td className="p-3 font-medium">Pakad Phrases</td><td className="p-3 font-mono font-semibold text-purple-900">5 minutes</td></tr>
                <tr><td className="p-3 font-medium">FluteSangam Original Alankars</td><td className="p-3 font-mono font-semibold text-purple-900">10 minutes</td></tr>
                <tr><td className="p-3 font-medium">Aalap Exploration</td><td className="p-3 font-mono font-semibold text-purple-900">5 minutes</td></tr>
                <tr><td className="p-3 font-medium">Original Learning Piece ("Nisha Dhyan")</td><td className="p-3 font-mono font-semibold text-purple-900">10 minutes</td></tr>
                <tr className="bg-purple-50 font-bold text-purple-950">
                  <td className="p-3.5 rounded-l-xl">Total Daily Practice Time</td>
                  <td className="p-3.5 rounded-r-xl font-mono text-base">45 minutes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <HelpCircle className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-purple-100 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 bg-purple-50/40 hover:bg-purple-50 font-semibold text-xs sm:text-sm text-purple-950 flex justify-between items-center gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-purple-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-purple-700 shrink-0" />}
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 border-t border-purple-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Ragas */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-xl sm:text-2xl border-b border-bamboo-100 pb-3">
            <Compass className="w-6 h-6 text-purple-700 shrink-0" />
            <h2>Related Ragas</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
            {[
              { name: 'Raag Bhairavi', view: 'learn_raagas' },
              { name: 'Raag Bhimpalasi', view: 'raga_bhimpalasi' },
              { name: 'Raag Kafi', view: 'raga_kafi' },
              { name: 'Raag Bageshree', view: 'raga_bageshree' },
              { name: 'Raag Darbari Kanada', view: 'learn_raagas' },
            ].map((raga, idx) => (
              <button
                key={idx}
                onClick={() => onViewChange && onViewChange(raga.view as AppView)}
                className="p-3 bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/80 rounded-2xl text-center text-xs font-bold text-purple-950 transition-all cursor-pointer hover:shadow-2xs"
              >
                {raga.name}
              </button>
            ))}
          </div>
        </section>

        {/* Copyright Notice Banner */}
        <section className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 text-amber-950 space-y-2 text-xs sm:text-sm">
          <h3 className="font-bold font-display text-amber-900 text-base">© FluteSangam Original Content</h3>
          <p className="leading-relaxed">
            This article, including the explanations, practice routines, alankars, and "Nisha Dhyan" learning piece, has been created specifically for FluteSangam as original educational content.
          </p>
          <p className="leading-relaxed text-amber-900/90">
            The learning piece is an original practice exercise created to help students explore the swaras and characteristic movements discussed on this page. It is not presented as a traditional bandish, gat, or composition from any particular gharana or composer.
          </p>
        </section>

        {/* Author Section */}
        <AboutAuthorSection />

      </div>
    </motion.div>
  );
}
