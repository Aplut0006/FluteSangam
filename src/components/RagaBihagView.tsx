import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Sun, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Award, Sparkles, ShieldAlert, Lightbulb, RotateCcw
} from 'lucide-react';
import { AppView } from '../types';
import { playTakMetronomeClick } from '../lib/audioUtils';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';

interface RagaBihagViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBihagView({ onViewChange }: RagaBihagViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<any>(null);

  // Frequency mapping for C Scale / C4 Base Swaras for Raag Bihag
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,     // Sa (C4)
    'R': 293.66,     // Shuddha Re (D4)
    'G': 329.63,     // Shuddha Ga (E4)
    'M': 349.23,     // Shuddha Ma (F4)
    'M#': 369.99,    // Tivra Ma (F#4)
    'm': 369.99,     // Tivra Ma shorthand
    'P': 392.00,     // Pa (G4)
    'D': 440.00,     // Shuddha Dha (A4)
    'N': 493.88,     // Shuddha Ni (B4)
    "S'": 523.25,    // Upper Sa (C5)
    "R'": 587.33,    // Upper Re (D5)
    "N.": 246.94,    // Lower Ni (B3)
    "D.": 220.00,    // Lower Dha (A3)
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
      
      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(swaraName);
      setTimeout(() => setActiveSwara(null), duration * 1000);
    } catch (e) {
      console.warn("Audio playback not supported or blocked", e);
    }
  };

  // Play sequence of swaras
  const playSequence = (swaraTokens: string[]) => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    const ctx = getAudioContext();
    let startTime = ctx.currentTime + 0.1;
    const noteDuration = 0.55;

    swaraTokens.forEach((token, idx) => {
      const cleanToken = token.trim();
      const freq = SWARA_FREQS[cleanToken] || 261.63;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration - 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);

      setTimeout(() => {
        setActiveSwara(cleanToken);
      }, (startTime - ctx.currentTime) * 1000);

      startTime += noteDuration;
    });

    setTimeout(() => {
      setActiveSwara(null);
      setIsPlayingSequence(false);
    }, (startTime - ctx.currentTime) * 1000 + 200);
  };

  // Metronome handler for Teentaal (16 beats)
  useEffect(() => {
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      metronomeIntervalRef.current = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev % 16) + 1;
          try {
            const ctx = getAudioContext();
            playTakMetronomeClick(ctx, next === 1);
          } catch(e) {}
          return next;
        });
      }, intervalMs);
    } else {
      clearInterval(metronomeIntervalRef.current);
      setCurrentBeat(0);
    }
    return () => clearInterval(metronomeIntervalRef.current);
  }, [isMetronomeActive, bpm]);

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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10" itemScope itemType="https://schema.org/Article">
      {/* Schema.org Microdata JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Raag Bihag: Complete Guide, Notes, Aaroh, Avaroh & Practice",
          "description": "Comprehensive guide to Raag Bihag for bansuri flute players, covering swaras, Aaroh, Avaroh, Pakad, Tivra Ma usage, alankars, and original learning piece Sandhya Madhurya.",
          "author": {
            "@type": "Person",
            "name": "Aplut",
            "url": "https://flutesangam.com/founder"
          },
          "publisher": {
            "@type": "Organization",
            "name": "FluteSangam",
            "url": "https://flutesangam.com"
          },
          "datePublished": "2026-08-07",
          "dateModified": "2026-08-07",
          "mainEntityOfPage": "https://flutesangam.com/learn/raga-bihag"
        })}
      </script>

      {/* Hero Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-bamboo-950 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-amber-500/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                <div className="w-full h-full bg-slate-900/90 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                  <Music className="w-8 h-8 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div>
                <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Bilawal Thaat Raga Masterclass
                </span>
                <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white" itemProp="headline">
                  Raag Bihag
                </h1>
              </div>
            </div>

            {/* Microdata Signals & Timestamps */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-amber-100/90 bg-amber-950/60 border border-amber-500/30 backdrop-blur-md rounded-2xl px-4 py-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200/80">Published:</span>
                <time itemProp="datePublished" dateTime="2026-08-07T00:00:00Z" className="font-semibold text-white">
                  Aug 7, 2026
                </time>
              </div>
              <span className="text-amber-500/60">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200/80">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-08-07T00:00:00Z" className="font-semibold text-white">
                  Aug 7, 2026
                </time>
              </div>
            </div>
          </div>

          <p className="text-amber-100/90 text-base sm:text-lg max-w-3xl leading-relaxed font-light">
            A graceful and melodious raga of Hindustani Classical Music. Belonging to the <strong className="text-amber-300 font-semibold">Bilawal Thaat</strong>, Raag Bihag is performed in the late evening and night, featuring a bright, romantic character with elegant movements around Ga, Ma, Pa, and Ni.
          </p>

          {/* Key Facts Quick Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-xs text-amber-300/80 uppercase tracking-wider block font-medium">Thaat</span>
              <span className="text-lg font-bold text-white">Bilawal</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-xs text-amber-300/80 uppercase tracking-wider block font-medium">Time</span>
              <span className="text-lg font-bold text-white">Late Evening / Night</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-xs text-amber-300/80 uppercase tracking-wider block font-medium">Vadi / Samvadi</span>
              <span className="text-lg font-bold text-amber-400">Ga (G) / Ni (N)</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-xs text-amber-300/80 uppercase tracking-wider block font-medium">Jati</span>
              <span className="text-lg font-bold text-emerald-400">Audav – Sampurna</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Introduction Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Introduction to Raag Bihag
          </h2>
        </div>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          Raag Bihag is a graceful and melodious raga of Hindustani Classical Music. It belongs to the <strong>Bilawal Thaat</strong> and is traditionally associated with the late evening and night. Its character is bright, romantic, elegant, and expressive.
        </p>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          Bihag is especially interesting for flute players because it introduces a more nuanced treatment of Madhyam, including the use of <strong>Tivra Ma (M#)</strong> alongside <strong>Shuddha Ma (M)</strong> in commonly taught forms. The raga also encourages graceful movements around Ga, Ma, Pa, and Ni, making it an excellent exercise in phrasing and meend.
        </p>

        <div className="bg-amber-50 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 rounded-2xl p-4 sm:p-5 text-sm text-slate-700 dark:text-slate-300 space-y-2">
          <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Next Step for Intermediate Bansuri Players
          </h3>
          <p>
            For an intermediate bansuri player, Raag Bihag is a natural step beyond simpler ragas. Rather than simply playing its notes in sequence, the student learns to create the raga's identity through characteristic phrases, note emphasis, and controlled movement.
          </p>
        </div>
      </div>

      {/* Basic Information Quick Reference Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Basic Information
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white w-1/3">Raga Name</td>
                <td className="py-3 px-4 font-semibold text-amber-700 dark:text-amber-400">Bihag</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Thaat</td>
                <td className="py-3 px-4 font-medium">Bilawal</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Jati</td>
                <td className="py-3 px-4 font-medium">Audav – Sampurna (5 notes ascending, 7 descending)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Time</td>
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-600" /> Late evening / night
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Vadi (King Note)</td>
                <td className="py-3 px-4 font-bold text-amber-700 dark:text-amber-400">Ga (G)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Samvadi (Queen Note)</td>
                <td className="py-3 px-4 font-bold text-amber-700 dark:text-amber-400">Ni (N)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Nature</td>
                <td className="py-3 px-4 font-medium">Romantic, graceful, bright</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Rasa</td>
                <td className="py-3 px-4 font-medium">Shringar (Romantic), Shanta (Peaceful)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Difficulty</td>
                <td className="py-3 px-4">
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-1 rounded-full text-xs border border-amber-200 dark:border-amber-700">
                    Intermediate
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Swaras Used & Dual Madhyam Interactive Explorer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Swaras Used in Raag Bihag
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Click any swara badge below to hear its pitch synthesis on C4 Bansuri tone.
            </p>
          </div>
        </div>

        {/* Swara Badges Row */}
        <div className="flex flex-wrap gap-2.5">
          {[
            { name: 'S', full: 'Sa', freq: '261.63 Hz', type: 'Primary' },
            { name: 'R', full: 'Shuddha Re', freq: '293.66 Hz', type: 'Restrained' },
            { name: 'G', full: 'Shuddha Ga (Vadi)', freq: '329.63 Hz', type: 'Vadi Note' },
            { name: 'M', full: 'Shuddha Ma', freq: '349.23 Hz', type: 'Primary' },
            { name: 'M#', full: 'Tivra Ma', freq: '369.99 Hz', type: 'Distinctive Accent' },
            { name: 'P', full: 'Pa', freq: '392.00 Hz', type: 'Primary' },
            { name: 'D', full: 'Shuddha Dha', freq: '440.00 Hz', type: 'Restrained' },
            { name: 'N', full: 'Shuddha Ni (Samvadi)', freq: '493.88 Hz', type: 'Samvadi Note' },
            { name: "S'", full: 'Upper Sa', freq: '523.25 Hz', type: 'Octave' },
          ].map((sw, i) => (
            <button
              key={i}
              onClick={() => playSwaraTone(sw.name)}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer min-w-[85px] ${
                activeSwara === sw.name
                  ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105'
                  : sw.name === 'G' || sw.name === 'N'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                  : sw.name === 'M#'
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700 hover:bg-orange-100'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <span className="text-lg font-black font-mono">{sw.name}</span>
              <span className="text-[10px] font-medium opacity-90 mt-0.5">{sw.full}</span>
              <span className="text-[9px] opacity-75 mt-1 font-mono">{sw.type}</span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> Restrained Use of Re &amp; Dha
            </h3>
            <p>
              In many traditional treatments, Re and Dha are used sparingly, while Ga, Ma, Pa, and Ni receive greater prominence.
            </p>
          </div>

          <div className="bg-amber-50/70 dark:bg-slate-800/50 p-4 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-1.5">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Dual Madhyam Usage (M &amp; M#)
            </h3>
            <p>
              The use of both Shuddha Ma and Tivra Ma is one of the key features that gives Bihag its distinctive, romantic color.
            </p>
          </div>
        </div>
      </div>

      {/* Aaroh, Avaroh, Pakad & Chalan Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          Aaroh, Avaroh, Pakad &amp; Chalan
        </h2>

        {/* Aaroh & Avaroh */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Aaroh */}
          <div className="bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">Ascending Scale</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aaroh</h3>
              </div>
              <button
                onClick={() => playSequence(['S', 'G', 'M', 'P', 'N', "S'"])}
                disabled={isPlayingSequence}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> Play Aaroh
              </button>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-950 dark:text-amber-200 tracking-wider">
              S G M P N S'
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Audav ascent skipping Re and Dha. Tivra Ma may appear in characteristic phrases rather than being treated as a straightforward part of the scale.
            </p>
          </div>

          {/* Avaroh */}
          <div className="bg-orange-50/60 dark:bg-slate-800/60 border border-orange-200/80 dark:border-slate-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400 block">Descending Scale</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Avaroh</h3>
              </div>
              <button
                onClick={() => playSequence(["S'", 'N', 'D', 'P', 'M', 'G', 'M', 'G', 'R', 'S'])}
                disabled={isPlayingSequence}
                className="bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> Play Avaroh
              </button>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-orange-950 dark:text-orange-200 tracking-wider">
              S' N D P M G M G R S
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sampurna descent using all seven swaras with characteristic meend around Ma and Ga.
            </p>
          </div>
        </div>

        {/* Pakad */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Pakad (Catch Phrase)
            </h3>
            <button
              onClick={() => copyToClipboard('G M P | N D P | M G M G | R S', 'pakad')}
              className="text-xs text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'pakad' ? 'Copied!' : 'Copy Pakad'}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Primary Catchphrase:</span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                G M P — N D P — M G M G — R S
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400">Tivra Ma Phrase Variant:</span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                G M# P — M G — G R S
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Practice the phrases slowly and focus on their melodic shape rather than simply playing each note separately.
          </p>
        </div>

        {/* Chalan */}
        <div className="bg-amber-50/40 dark:bg-slate-800/40 rounded-2xl p-5 border border-amber-200/60 dark:border-slate-700 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Chalan (Melodic Progression)
          </h3>

          <div className="font-mono text-sm sm:text-base text-amber-950 dark:text-amber-200 space-y-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200/80 dark:border-slate-800">
            <p>S G M P — N S' — S' N D P — M G M G — R S</p>
            <p className="text-amber-800 dark:text-amber-300 font-semibold">Continue with:</p>
            <p>G M# P — M G — G R S</p>
            <p>G M P — N D P — M G R S</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The movement between Ga and Ma is particularly important when developing the character of Bihag.
          </p>
        </div>
      </div>

      {/* Important Characteristics & Mood Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Characteristics */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Important Characteristics
          </h2>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {[
              'Bihag belongs to the Bilawal Thaat.',
              'Both Shuddha Ma and Tivra Ma may be used.',
              'Ga (Vadi) and Ni (Samvadi) establish the raga identity.',
              'Re and Dha are generally used with restraint.',
              'The raga has a graceful and romantic character.',
              'Phrases around G–M–P and G–M#–P create its characteristic color.',
              'Meend and smooth note connections are highly effective on bansuri.',
              'The raga should not be treated as a simple major-scale exercise.'
            ].map((char, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mood and Emotion */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            Mood and Emotion (Rasa)
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Raag Bihag has a bright yet refined emotional character, evoking deep romance and serene elegance during late evening hours.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {['Love', 'Romance', 'Beauty', 'Joy', 'Grace', 'Serenity', 'Tenderness'].map((mood, idx) => (
              <span
                key={idx}
                className="bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl"
              >
                {mood}
              </span>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4 text-xs text-slate-600 dark:text-slate-400">
            Its elegant character makes it particularly attractive for evening flute practice and melodic improvisation.
          </div>
        </div>
      </div>

      {/* Why Learn Raag Bihag */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/10 border border-amber-300/60 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Why Learn Raag Bihag?
        </h2>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          Bihag is an excellent intermediate raga for developing key bansuri skills:
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            'Control over Shuddha and Tivra Ma',
            'Smooth meend techniques',
            'Graceful melodic phrasing',
            'Precise note transitions',
            'Upper-register control',
            'Expressive flute playing',
            'Raga-specific movements',
            'Confidence in improvisation'
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Metronome & Practice Routine */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Practice Routine &amp; Interactive Metronome
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use the built-in 45-minute practice timer and 16-beat Teentaal metronome for structured learning.
            </p>
          </div>

          {/* Timer Widget */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-amber-200 dark:border-slate-700 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Practice Timer</span>
              <span className="text-xl font-mono font-black text-amber-800 dark:text-amber-300">{formatTimer(timerSeconds)}</span>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2 rounded-xl text-white font-bold transition cursor-pointer ${
                isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setIsTimerRunning(false); setTimerSeconds(45 * 60); }}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metronome Tool */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer ${
                  isMetronomeActive ? 'bg-amber-600 hover:bg-amber-700 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isMetronomeActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isMetronomeActive ? 'Stop Metronome' : 'Start 16-Beat Metronome'}</span>
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                {bpm} BPM (Teentaal)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Tempo:</span>
              <input
                type="range"
                min="40"
                max="120"
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                className="w-32 accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* 16 Beats Indicator */}
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 pt-1">
            {Array.from({ length: 16 }).map((_, idx) => {
              const beatNum = idx + 1;
              const isCurrent = currentBeat === beatNum;
              const isSam = beatNum === 1;
              const isTali = beatNum === 5 || beatNum === 13;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-bold font-mono transition-all ${
                    isCurrent
                      ? 'bg-amber-600 text-white scale-110 shadow-md'
                      : isSam
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-300'
                      : isTali
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{beatNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Long Notes & Basic Drills */}
        <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-600" /> 1. Long Notes Warmup
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Sustained tones: <strong>S — G — M — P — N — S'</strong>
            </p>
            <p className="text-slate-600 dark:text-slate-400 pt-1">
              Separately practice the characteristic Madhyam notes: <strong>M — M#</strong>. Play both carefully and listen to the pitch difference.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Repeat className="w-4 h-4 text-amber-600" /> 2. Aaroh–Avaroh Practice
            </h3>
            <p className="font-mono text-amber-900 dark:text-amber-300 font-bold">
              S G M P N S' | S' N D P M G R S
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Repeat slowly 10–15 times. Introduce characteristic phrases once comfortable.
            </p>
          </div>
        </div>
      </div>

      {/* FluteSangam Original Alankars */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          FluteSangam Original Alankars for Raag Bihag
        </h2>

        {/* Alankar 1 */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Alankar 1: Step Jumps</h3>
            <button
              onClick={() => copyToClipboard("Ascending: S G | G M | M P | P N | N S'\nDescending: S' N | N D | D P | P M | M G | G R | R S", 'alankar1')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'alankar1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'alankar1' ? 'Copied!' : 'Copy Alankar 1'}
            </button>
          </div>
          <div className="font-mono text-sm text-amber-950 dark:text-amber-200 space-y-1">
            <p><strong>Ascending:</strong> S G | G M | M P | P N | N S'</p>
            <p><strong>Descending:</strong> S' N | N D | D P | P M | M G | G R | R S</p>
          </div>
        </div>

        {/* Alankar 2 */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Alankar 2: Triplet Sequences</h3>
            <button
              onClick={() => copyToClipboard("Ascending: S G M | G M P | M P N | P N S'\nDescending: S' N D | N D P | D P M | P M G | M G R | G R S", 'alankar2')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'alankar2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'alankar2' ? 'Copied!' : 'Copy Alankar 2'}
            </button>
          </div>
          <div className="font-mono text-sm text-amber-950 dark:text-amber-200 space-y-1">
            <p><strong>Ascending:</strong> S G M | G M P | M P N | P N S'</p>
            <p><strong>Descending:</strong> S' N D | N D P | D P M | P M G | M G R | G R S</p>
          </div>
        </div>

        {/* Alankar 3 */}
        <div className="bg-amber-50/60 dark:bg-slate-800/60 rounded-2xl p-5 border border-amber-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-base">
              Alankar 3: Madhyam Movement (Shuddha &amp; Tivra Ma)
            </h3>
            <button
              onClick={() => copyToClipboard("G M P M | M G M G | G M# P M | M G R S", 'alankar3')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'alankar3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'alankar3' ? 'Copied!' : 'Copy Alankar 3'}
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            This exercise introduces the characteristic movement around Madhyam. Make sure Tivra Ma is clearly distinguished from Shuddha Ma.
          </p>
          <div className="font-mono text-sm font-bold text-amber-950 dark:text-amber-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-slate-800">
            G M P M | M G M G | G M# P M | M G R S
          </div>
        </div>
      </div>

      {/* Common Mistakes & Performance Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Common Mistakes */}
        <div className="bg-rose-50/40 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold font-display text-rose-900 dark:text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Common Mistakes to Avoid
          </h2>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {[
              'Treating Bihag as a simple major-scale raga.',
              'Playing Tivra Ma randomly without understanding its melodic context.',
              'Giving excessive prominence to Re or Dha.',
              'Playing too quickly before mastering characteristic phrases.',
              'Making the two forms of Ma sound indistinguishable.',
              'Using excessive ornamentation instead of clean note transitions.'
            ].map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-600 font-bold shrink-0">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips for Better Performance */}
        <div className="bg-emerald-50/40 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold font-display text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            Tips for Better Performance
          </h2>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {[
              'Practice with a tanpura drone.',
              'Spend extra time distinguishing Shuddha Ma and Tivra Ma.',
              'Practice Ga–Ma–Pa movements slowly.',
              'Use gentle meend between suitable notes.',
              'Keep Re and Dha controlled rather than overemphasized.',
              'Practice upper Sa without forcing the breath.',
              'Focus on the graceful character of the raga.',
              'Increase speed only after the phrases sound natural.'
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FluteSangam Original Learning Piece Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            FluteSangam Original Educational Piece
          </span>
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            "Sandhya Madhurya" (Evening Sweetness)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Raag: Bihag | Taal: Teentaal (16 Beats) | Laya: Madhya Laya | Difficulty: Intermediate
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This learning piece has been created specifically for FluteSangam to help students explore the characteristic melodic movement of Raag Bihag. It is an original educational exercise, not a traditional bandish or classical composition.
        </p>

        {/* Aalap */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Aalap (Free Rhythm)</h3>
            <button
              onClick={() => copyToClipboard("S G M | M P N | S'\nS' N D | P M | G M G | R S\nG M# P | M G | G M P | N D P | M G R S", 'aalap')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'aalap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'aalap' ? 'Copied!' : 'Copy Aalap'}
            </button>
          </div>
          <p className="text-xs text-slate-500">Play freely without taal and keep phrases relaxed.</p>
          <div className="font-mono text-sm text-amber-950 dark:text-amber-200 space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p>S G M | M P N | S'</p>
            <p>S' N D | P M | G M G | R S</p>
            <p className="pt-1 text-xs text-slate-500">Continue with:</p>
            <p>G M# P | M G | G M P | N D P | M G R S</p>
          </div>
        </div>

        {/* Mukhda */}
        <div className="bg-amber-50/60 dark:bg-slate-800/60 p-5 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-base">Mukhda (Main Theme)</h3>
            <button
              onClick={() => copyToClipboard("| S G M P | N S' N D |\n| P M G M | G R S - |", 'mukhda')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'mukhda' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'mukhda' ? 'Copied!' : 'Copy Mukhda'}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-amber-950 dark:text-amber-200 space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200 dark:border-slate-800">
            <p>| S  G  M  P | N  S' N  D |</p>
            <p>| P  M  G  M | G  R  S  - |</p>
          </div>
        </div>

        {/* Antara */}
        <div className="bg-orange-50/60 dark:bg-slate-800/60 p-5 rounded-2xl border border-orange-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-orange-900 dark:text-orange-300 text-base">Antara (Upper Register &amp; Tivra Ma)</h3>
            <button
              onClick={() => copyToClipboard("| G M# P M | G M P N |\n| S' N D P | M G R S |", 'antara')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'antara' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'antara' ? 'Copied!' : 'Copy Antara'}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-orange-950 dark:text-orange-200 space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-orange-200 dark:border-slate-800">
            <p>| G  M# P  M | G  M  P  N |</p>
            <p>| S' N  D  P | M  G  R  S |</p>
          </div>
        </div>

        {/* Vistar Practice */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Vistar Practice</h3>
            <button
              onClick={() => copyToClipboard("| G M P N | S' N D P |\n| M G M G | R S G M |\n| G M# P M | G R S G |\n| M P N D | P M G - |", 'vistar')}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'vistar' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'vistar' ? 'Copied!' : 'Copy Vistar'}
            </button>
          </div>
          <div className="font-mono text-sm text-amber-950 dark:text-amber-200 space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p>| G  M  P  N | S' N  D  P |</p>
            <p>| M  G  M  G | R  S  G  M |</p>
            <p>| G  M# P  M | G  R  S  G |</p>
            <p>| M  P  N  D | P  M  G  - |</p>
          </div>
        </div>

        {/* Concluding Phrase */}
        <div className="bg-amber-100/50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-300 dark:border-amber-700 space-y-2">
          <h3 className="font-bold text-amber-900 dark:text-amber-300 text-base">Concluding Phrase (Tihaai)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Repeat three times:</p>
          <div className="font-mono text-sm font-bold text-amber-950 dark:text-amber-200">
            G M P — M G — R S (3x)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">Finish clearly on: <strong>S</strong></p>
        </div>

        {/* How to Practice Steps */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">How to Practice the Learning Piece</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li>Begin with long-note practice.</li>
            <li>Practice Aaroh and Avaroh slowly.</li>
            <li>Repeat the Pakad several times.</li>
            <li>Practice the Aalap without rhythm.</li>
            <li>Learn the Mukhda.</li>
            <li>Add the Antara once the Mukhda is comfortable.</li>
            <li>Practice the Vistar separately.</li>
            <li>Combine all sections.</li>
            <li>Pay special attention to the two forms of Ma.</li>
            <li>Finish with the Concluding Phrase.</li>
            <li>Start around 50 BPM.</li>
            <li>Gradually increase toward 70–80 BPM while maintaining clarity and expression.</li>
          </ol>
        </div>
      </div>

      {/* Suggested Daily Practice Schedule Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Suggested Daily Practice Schedule (45 Minutes)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
              <tr>
                <th className="py-2.5 px-4 rounded-l-xl">Exercise</th>
                <th className="py-2.5 px-4 rounded-r-xl">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr><td className="py-2.5 px-4 font-medium">Long Notes</td><td className="py-2.5 px-4 font-mono">5 minutes</td></tr>
              <tr><td className="py-2.5 px-4 font-medium">Aaroh–Avaroh</td><td className="py-2.5 px-4 font-mono">5 minutes</td></tr>
              <tr><td className="py-2.5 px-4 font-medium">Pakad</td><td className="py-2.5 px-4 font-mono">5 minutes</td></tr>
              <tr><td className="py-2.5 px-4 font-medium">Shuddha/Tivra Ma Practice</td><td className="py-2.5 px-4 font-mono">5 minutes</td></tr>
              <tr><td className="py-2.5 px-4 font-medium">Alankars</td><td className="py-2.5 px-4 font-mono">10 minutes</td></tr>
              <tr><td className="py-2.5 px-4 font-medium">Aalap</td><td className="py-2.5 px-4 font-mono">5 minutes</td></tr>
              <tr><td className="py-2.5 px-4 font-medium">Original Learning Piece ("Sandhya Madhurya")</td><td className="py-2.5 px-4 font-mono">10 minutes</td></tr>
              <tr className="bg-amber-50/60 dark:bg-amber-950/30 font-bold text-amber-950 dark:text-amber-200">
                <td className="py-3 px-4">Total Daily Practice Time</td>
                <td className="py-3 px-4 font-mono">45 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Is Raag Bihag suitable for intermediate flute players?",
              a: "Yes. Bihag is a good intermediate raga because its basic structure is approachable while its characteristic phrases and use of two forms of Ma require greater control."
            },
            {
              q: "Which forms of Ma are used in Bihag?",
              a: "Both Shuddha Ma (M) and Tivra Ma (M#) are used in commonly taught versions of the raga."
            },
            {
              q: "Which notes are most important?",
              a: "Ga and Ni are traditionally given prominence, with Ga considered the Vadi and Ni the Samvadi."
            },
            {
              q: "Is Re used prominently in Bihag?",
              a: "Re is generally used with restraint and appears in characteristic descending movements rather than being heavily emphasized."
            },
            {
              q: "When is Raag Bihag traditionally performed?",
              a: "Bihag is traditionally associated with the late evening and night."
            },
            {
              q: "Is Bihag difficult to play on the flute?",
              a: "The basic notes are manageable, but controlling the two forms of Ma and reproducing the characteristic phrases requires practice."
            },
            {
              q: "Which flute should I use for Raag Bihag?",
              a: "Any properly tuned bansuri can be used. Choose a flute that allows you to comfortably control the middle and upper registers."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <span>{item.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Ragas Navigation */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-lg font-extrabold font-display text-slate-900 dark:text-white">
          Explore Related Ragas
        </h2>

        <div className="flex flex-wrap gap-2.5">
          {[
            { name: 'Raag Khamaj', view: 'raga_khamaj' },
            { name: 'Raag Yaman', view: 'raga_yaman' },
            { name: 'Raag Bilawal', view: 'raga_bilawal' },
            { name: 'Raag Desh', view: 'raga_desh' },
            { name: 'Raag Hamsadhwani', view: 'raga_hamsadhwani' },
          ].map((r, i) => (
            <button
              key={i}
              onClick={() => onViewChange?.(r.view as AppView)}
              className="bg-white dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer group"
            >
              <span>{r.name}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Copyright Disclaimer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-1 py-2">
        <p className="font-bold">© FluteSangam Original Content</p>
        <p className="max-w-2xl mx-auto leading-relaxed text-[11px]">
          This article, including explanations, practice routines, alankars, and the "Sandhya Madhurya" learning piece, has been created specifically for FluteSangam as original educational content.
        </p>
      </div>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </div>
  );
}
