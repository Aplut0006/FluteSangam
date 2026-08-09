import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, Printer, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb
} from 'lucide-react';
import { AppView } from '../types';
import { playTakMetronomeClick } from '../lib/audioUtils';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaDeshViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaDeshView({ onViewChange }: RagaDeshViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [practiceStep, setPracticeStep] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(40 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,   // Sa
    'R': 293.66,   // Re
    'G': 329.63,   // Ga
    'M': 349.23,   // Ma (Shuddha)
    'P': 392.00,   // Pa
    'D': 440.00,   // Dha
    'N': 493.88,   // Ni (Shuddha)
    'n': 466.16,   // Komal Ni
    'S\'': 523.25,  // Upper Sa
    'R\'': 587.33,  // Upper Re
    'N_': 246.94,  // Lower Ni
    'P_': 196.00,  // Lower Pa
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

  // Metronome for Sandhya Vihar composition
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

  const compositionSectionA = `Section A (Teentaal - 16 Beats)
| S  R  M  P | N  S' N  P |
| M  G  R  S | -  -  -  - |

| R  M  P  N | S' N  D  P |
| M  G  R  S | -  -  -  - |`;

  const compositionSectionB = `Section B
| S' N  D  P | M  G  R  S |
| R  M  P  N | S' -  -  - |

| N  D  P  M | G  R  S  R |
| M  P  M  G | R  S  -  - |`;

  const compositionEnding = `Ending Phrase (Repeat 3 Times)
M P N | P M G | R S

Finish on:
S`;

  const faqs = [
    {
      q: "Is Raag Desh suitable for beginners?",
      a: "Raag Desh is generally recommended after learning simpler ragas like Bhoopali, Durga, and Bilawal because it relies more on characteristic phrases than on scale practice alone."
    },
    {
      q: "Which notes are most important?",
      a: "Re (Rishabh) and Pa (Pancham) play an important role as Vadi and Samvadi notes in establishing the raga's character."
    },
    {
      q: "Which flute should I use?",
      a: "Raag Desh can be practiced on any properly tuned bansuri. A G Base bansuri is commonly used by adult learners."
    },
    {
      q: "What is the best time to perform Raag Desh?",
      a: "Traditionally, it is performed during the second quarter of the night (approximately 9 PM–12 AM)."
    }
  ];

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Raag Desh: Complete Guide, Notes, Aaroh, Avaroh & Practice',
    'description': 'Master Raag Desh on Indian Bamboo Flute (Bansuri). Complete guide with Swara playback, Pakad, Chalan, original Alankars, and the practice piece "Sandhya Vihar".',
    'datePublished': '2026-08-02T00:00:00Z',
    'dateModified': '2026-08-02T00:00:00Z',
    'author': {
      '@type': 'Person',
      'name': 'Aplut',
      'jobTitle': 'Founder of FluteSangam'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'FluteSangam',
      'alternateName': 'Flute Sangam',
      'url': 'https://flutesangam.com'
    },
    'mainEntityOfPage': 'https://flutesangam.com/learn/raga-desh'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 space-y-6 sm:space-y-10"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50 text-bamboo-950 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-sm border border-amber-300/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-amber-900 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-amber-700 transition cursor-pointer touch-manipulation min-h-[32px] flex items-center"
            >
              Learn
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-amber-700 transition cursor-pointer touch-manipulation min-h-[32px] flex items-center"
            >
              Raagas
            </button>
            <span>/</span>
            <span className="text-amber-950 font-bold truncate max-w-[120px] sm:max-w-none">Raag Desh</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-200/90 text-amber-950 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border border-amber-300 shadow-2xs">
                <Moon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Second Quarter of Night (9 PM – 12 AM)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-bamboo-950 leading-tight">
                Raag Desh Guide
              </h1>
              <p className="text-xs sm:text-base text-stone-700 max-w-2xl leading-relaxed font-sans">
                Master the expressive movements, characteristic descending phrases, original Alankars, and practice composition <span className="text-amber-900 font-semibold">"Sandhya Vihar"</span> on Bansuri.
              </p>
            </div>

            {/* Quick Practice Timer Card */}
            <div className="bg-indigo-900/80 border border-indigo-700/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center shrink-0 w-full sm:w-auto sm:min-w-[200px] shadow-inner">
              <div className="text-[11px] sm:text-xs text-indigo-200 font-medium mb-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Suggested Routine</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 my-1">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex gap-2 mt-1.5 w-full">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer touch-manipulation min-h-[36px] ${
                    isTimerRunning ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(40 * 60);
                  }}
                  className="py-1.5 px-3 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 rounded-xl text-xs font-medium transition cursor-pointer touch-manipulation min-h-[36px]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-indigo-200/90 pt-1 border-t border-indigo-800/60">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-800">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Published: Aug 2, 2026</span>
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-800">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Updated: Aug 2, 2026</span>
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Original Educational Content</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => copyToClipboard(window.location.href, 'page_url')}
                className="hover:text-amber-300 transition flex items-center gap-1 text-xs bg-indigo-900/80 px-3 py-1 rounded-lg border border-indigo-700 cursor-pointer touch-manipulation min-h-[32px]"
              >
                {copiedSection === 'page_url' ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Share2 className="w-3.5 h-3.5 shrink-0" />}
                <span>{copiedSection === 'page_url' ? 'Copied Link!' : 'Share Guide'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Introduction</span>
        </h2>
        <div className="prose prose-bamboo max-w-none text-gray-700 space-y-3 leading-relaxed font-sans text-xs sm:text-sm">
          <p>
            <strong>Raag Desh</strong> is one of the most expressive and melodious ragas in Hindustani Classical Music. It is admired for its graceful movements, emotional depth, and memorable phrases. The raga is frequently heard in classical concerts, devotional music, patriotic songs, and light classical performances.
          </p>
          <p>
            For bansuri players, Raag Desh helps develop expressive phrasing, breath control, and smooth note transitions. It is generally learned after students become comfortable with foundational ragas such as Bhoopali, Durga, Yaman, and Bilawal.
          </p>
        </div>
      </section>

      {/* Key Technical Matrix (Table) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
            <span>Basic Information</span>
          </h2>
          <span className="text-[11px] sm:text-xs text-indigo-900 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Hindustani Classical Framework
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Raga Name</span>
            <span className="text-xs sm:text-base font-bold text-bamboo-950">Desh</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Thaat</span>
            <span className="text-xs sm:text-base font-bold text-bamboo-950">Khamaj</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Jati</span>
            <span className="text-xs sm:text-base font-bold text-bamboo-950">Audav – Sampurna</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</span>
            <span className="text-xs sm:text-sm font-bold text-bamboo-950">2nd Quarter of Night (9 PM – 12 AM)</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Vadi (King Note)</span>
            <span className="text-xs sm:text-base font-bold text-amber-800">Re (Rishabh)</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Samvadi (Queen Note)</span>
            <span className="text-xs sm:text-base font-bold text-amber-800">Pa (Pancham)</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Nature</span>
            <span className="text-xs sm:text-sm font-bold text-bamboo-950">Romantic, Devotional, Graceful</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Rasa</span>
            <span className="text-xs sm:text-sm font-bold text-bamboo-950">Shringar, Bhakti, Shanta</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Difficulty Level</span>
            <span className="text-xs font-bold text-indigo-900 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full">
              Intermediate
            </span>
          </div>
        </div>

        {/* Swaras Used Interactive Buttons */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-bamboo-900 uppercase tracking-wider">
              Swaras Used (Click to Hear Swara Tone)
            </h3>
            <span className="text-[10px] sm:text-xs text-gray-500">G Base Scale Frequencies</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {[
              { name: 'Sa (S)', key: 'S' },
              { name: 'Re (R)', key: 'R' },
              { name: 'Ga (G)', key: 'G' },
              { name: 'Ma (M)', key: 'M' },
              { name: 'Pa (P)', key: 'P' },
              { name: 'Dha (D)', key: 'D' },
              { name: 'Ni (N)', key: 'N' },
              { name: 'Sa\' (S\')', key: 'S\'' }
            ].map((swara) => (
              <button
                key={swara.key}
                onClick={() => playSwaraTone(swara.key)}
                className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-1 cursor-pointer touch-manipulation min-h-[44px] ${
                  activeSwara === swara.key
                    ? 'bg-amber-500 text-bamboo-950 border-amber-600 scale-105 shadow-md'
                    : 'bg-white text-bamboo-900 border-bamboo-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{swara.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 text-xs sm:text-sm text-indigo-950 leading-relaxed mt-4">
            <p className="font-semibold text-indigo-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Characteristic Note Usage</span>
            </p>
            <p className="text-gray-700">
              Raag Desh is traditionally associated with Shuddha Ni in the ascent and Komal Ni in characteristic descending phrases in many Hindustani traditions. Students should learn these details from a qualified teacher as they progress.
            </p>
          </div>
        </div>
      </section>

      {/* Aaroh, Avaroh, Pakad, Chalan */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Music className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
          <span>Aaroh, Avaroh, Pakad &amp; Chalan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {/* Aaroh */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">Aaroh (Ascending)</span>
              <button 
                onClick={() => playSwaraTone('S')} 
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
              >
                <Play className="w-3 h-3 shrink-0" /> Play Root
              </button>
            </div>
            <p className="text-lg sm:text-2xl font-bold font-mono text-bamboo-950 tracking-wider overflow-x-auto scrollbar-thin py-1">
              S R M P N S'
            </p>
            <p className="text-xs text-gray-600">Concise, graceful ascent omitting Ga and Dha.</p>
          </div>

          {/* Avaroh */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">Avaroh (Descending)</span>
              <button 
                onClick={() => playSwaraTone('S\'')} 
                className="text-xs text-amber-700 hover:underline flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
              >
                <Play className="w-3 h-3 shrink-0" /> Play Upper Sa
              </button>
            </div>
            <p className="text-lg sm:text-2xl font-bold font-mono text-bamboo-950 tracking-wider overflow-x-auto scrollbar-thin py-1">
              S' N D P M G R S
            </p>
            <p className="text-xs text-gray-600">Full 7-note descent defining the raga's identity.</p>
          </div>
        </div>

        {/* Pakad */}
        <div className="bg-bamboo-50/80 border border-bamboo-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-bamboo-900 uppercase tracking-wider">Pakad (Signature Phrase)</span>
            <button
              onClick={() => copyToClipboard('R M P | N S\' | N D P | M G R | S', 'pakad')}
              className="text-xs text-bamboo-700 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-bamboo-200 space-y-1.5 font-mono text-xs sm:text-base font-bold text-bamboo-950 overflow-x-auto scrollbar-thin">
            <p>R M P</p>
            <p>N S'</p>
            <p>N D P</p>
            <p>M G R</p>
            <p>S</p>
          </div>

          <div className="pt-2 border-t border-bamboo-200/60">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 block mb-1">Alternative Pakad Phrase:</span>
            <p className="font-mono text-xs sm:text-sm font-bold text-bamboo-800 overflow-x-auto scrollbar-thin">
              S R M P | M G R | S
            </p>
          </div>
        </div>

        {/* Chalan */}
        <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Chalan (Melodic Progression)</span>
            <button
              onClick={() => copyToClipboard('S R M | P N S\' | N D P | M G R | S \n\n R M P | N S\' | D P | M G R S', 'chalan')}
              className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
            >
              {copiedSection === 'chalan' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>{copiedSection === 'chalan' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs sm:text-sm font-bold text-bamboo-950">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-100 space-y-1 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] sm:text-xs font-sans text-indigo-700 font-semibold mb-1">Movement 1</p>
              <p>S R M</p>
              <p>P N S'</p>
              <p>N D P</p>
              <p>M G R</p>
              <p>S</p>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-100 space-y-1 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] sm:text-xs font-sans text-indigo-700 font-semibold mb-1">Movement 2</p>
              <p>R M P</p>
              <p>N S'</p>
              <p>D P</p>
              <p>M G R S</p>
            </div>
          </div>
        </div>

        {/* Important Characteristics */}
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-bamboo-950 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            <span>Important Characteristics</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>The ascent is concise and graceful.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Descending phrases define the raga's identity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span><strong>Re</strong> and <strong>Pa</strong> are important resting notes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Smooth movement is preferred over abrupt jumps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Characteristic descending phrases are more important than scale practice alone.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Mood, Emotion & Why Learn */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Mood & Emotion */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Mood and Emotion</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Raag Desh expresses a versatile spectrum of deep emotions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Devotion', 'Love', 'Patriotism', 'Peace', 'Joy', 'Nostalgia'].map((mood, idx) => (
              <div key={idx} className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 text-center">
                <span className="text-xs font-bold text-rose-900">{mood}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed pt-1">
            Its emotional beauty makes it immensely popular in both classical and semi-classical music.
          </p>
        </div>

        {/* Why Learn Raag Desh */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Why Learn Raag Desh?</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
            {[
              'Develops expressive playing and delicate phrasing.',
              'Improves phrase recognition across ascending and descending patterns.',
              'Strengthens breath control and long note sustainability.',
              'Introduces characteristic descending movements in Hindustani music.',
              'Expands musical expression far beyond simple scale practice.'
            ].map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Beginner Practice Routine & Alankars */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 sm:pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Repeat className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
              <span>Beginner Practice Routine</span>
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Step-by-step technical exercises to build muscle memory and breath control.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard('S R M P N S\' \n S\' N D P M G R S', 'aaroh_avroh')}
            className="text-xs bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-900 border border-bamboo-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto touch-manipulation min-h-[36px]"
          >
            {copiedSection === 'aaroh_avroh' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
            <span>Copy Scale Routine</span>
          </button>
        </div>

        {/* Exercises */}
        <div className="space-y-4 sm:space-y-6">
          {/* Long Notes */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
              1. Long Notes Practice
            </h3>
            <p className="font-mono text-sm sm:text-lg font-bold text-bamboo-950 tracking-widest overflow-x-auto scrollbar-thin py-1">
              S &nbsp;&nbsp; R &nbsp;&nbsp; M &nbsp;&nbsp; P &nbsp;&nbsp; N &nbsp;&nbsp; S'
            </p>
            <p className="text-xs text-gray-600">Hold each note steadily for 8–10 seconds with a clean, stable tone.</p>
          </div>

          {/* Aaroh-Avaroh */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-emerald-900 uppercase tracking-wider">
              2. Aaroh–Avaroh Practice
            </h3>
            <div className="font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-1 overflow-x-auto scrollbar-thin">
              <p>S R M P N S'</p>
              <p>S' N D P M G R S</p>
            </div>
            <p className="text-xs text-gray-600">Repeat slowly 10 times with a steady tanpura drone.</p>
          </div>

          {/* FluteSangam Original Alankars */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-bamboo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
              <span>FluteSangam Original Alankars for Raag Desh</span>
            </h3>

            {/* Alankar 1 */}
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">FluteSangam Original Alankar 1</span>
                <button
                  onClick={() => copyToClipboard('S R | R M | M P | P N | N S\' \n S\' N | N D | D P | P M | M G | G R | R S', 'alankar1')}
                  className="text-xs text-gray-500 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
                >
                  {copiedSection === 'alankar1' ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 shrink-0" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 bg-gray-50 p-2.5 sm:p-3 rounded-xl overflow-x-auto scrollbar-thin">
                <p><span className="text-indigo-700">Ascending:</span> S R | R M | M P | P N | N S'</p>
                <p><span className="text-amber-700">Descending:</span> S' N | N D | D P | P M | M G | G R | R S</p>
              </div>
            </div>

            {/* Alankar 2 */}
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">FluteSangam Original Alankar 2</span>
                <button
                  onClick={() => copyToClipboard('S R M | R M P | M P N | P N S\' \n S\' N D | N D P | D P M | P M G | M G R | G R S', 'alankar2')}
                  className="text-xs text-gray-500 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
                >
                  {copiedSection === 'alankar2' ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 shrink-0" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 bg-gray-50 p-2.5 sm:p-3 rounded-xl overflow-x-auto scrollbar-thin">
                <p><span className="text-indigo-700">Ascending:</span> S R M | R M P | M P N | P N S'</p>
                <p><span className="text-amber-700">Descending:</span> S' N D | N D P | D P M | P M G | M G R | G R S</p>
              </div>
            </div>

            {/* Alankar 3 */}
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">FluteSangam Original Alankar 3</span>
                <button
                  onClick={() => copyToClipboard('S R M R | R M P M | M P N P | P N S\' N \n S\' N D N | N D P D | D P M P | P M G M | G R S', 'alankar3')}
                  className="text-xs text-gray-500 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
                >
                  {copiedSection === 'alankar3' ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 shrink-0" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 bg-gray-50 p-2.5 sm:p-3 rounded-xl overflow-x-auto scrollbar-thin">
                <p><span className="text-indigo-700">Ascending:</span> S R M R | R M P M | M P N P | P N S' N</p>
                <p><span className="text-amber-700">Descending:</span> S' N D N | N D P D | D P M P | P M G M | G R S</p>
              </div>
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
              <span>Playing the raga like a simple major scale.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Ignoring important descending phrases.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing too fast before mastering note stability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Weak breath support during long note transitions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Forgetting to pause naturally on <strong>Re</strong> and <strong>Pa</strong>.</span>
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
              <span>Practice slowly with a tanpura drone in G or C.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Listen carefully to the characteristic descending phrases.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Keep your tone warm, stable, and even across registers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Focus on musical expression rather than speed alone.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Develop smooth, gentle breath transitions between swaras.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FluteSangam Original Practice Piece: Sandhya Vihar */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6" id="practice-composition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Original Practice Piece</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-display text-bamboo-950">
              Sandhya Vihar (Evening Journey)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Raag: <strong>Desh</strong> &nbsp;|&nbsp; Taal: <strong>Teentaal (16 Beats)</strong> &nbsp;|&nbsp; Tempo: <strong>Madhya Laya</strong>
            </p>
          </div>

          {/* Interactive Metronome Control */}
          <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col items-center shrink-0 w-full sm:w-auto sm:min-w-[220px]">
            <div className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Teentaal Metronome Guide</span>
            </div>

            <div className="flex items-center gap-3 my-1.5 sm:my-2">
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-8 h-8 bg-white border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center justify-center cursor-pointer touch-manipulation"
              >
                -
              </button>
              <span className="font-mono text-base sm:text-lg font-bold text-bamboo-950">{bpm} BPM</span>
              <button
                onClick={() => setBpm(Math.min(140, bpm + 5))}
                className="w-8 h-8 bg-white border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center justify-center cursor-pointer touch-manipulation"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[36px] ${
                isPlayingComposition ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-indigo-700 text-white hover:bg-indigo-800'
              }`}
            >
              {isPlayingComposition ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
              <span>{isPlayingComposition ? `Beat ${currentBeat} / 16` : 'Start Metronome'}</span>
            </button>
          </div>
        </div>

        {/* Composition Notation Display */}
        <div className="space-y-4 sm:space-y-6">
          {/* Section A */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
                Section A (Teentaal)
              </h3>
              <button
                onClick={() => copyToClipboard(compositionSectionA, 'section_a')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
              >
                {copiedSection === 'section_a' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Section A</span>
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S  R  M  P | N  S' N  P |</p>
              <p>| M  G  R  S | -  -  -  - |</p>
              <br />
              <p>| R  M  P  N | S' N  D  P |</p>
              <p>| M  G  R  S | -  -  -  - |</p>
            </div>
          </div>

          {/* Section B */}
          <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-indigo-900 uppercase tracking-wider">
                Section B
              </h3>
              <button
                onClick={() => copyToClipboard(compositionSectionB, 'section_b')}
                className="text-xs text-indigo-800 hover:text-indigo-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
              >
                {copiedSection === 'section_b' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Section B</span>
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S' N  D  P | M  G  R  S |</p>
              <p>| R  M  P  N | S' -  -  - |</p>
              <br />
              <p>| N  D  P  M | G  R  S  R |</p>
              <p>| M  P  M  G | R  S  -  - |</p>
            </div>
          </div>

          {/* Ending Phrase */}
          <div className="bg-bamboo-50/60 border border-bamboo-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider">
                Ending Phrase (Tihai - Repeat 3 Times)
              </h3>
              <button
                onClick={() => copyToClipboard(compositionEnding, 'ending')}
                className="text-xs text-bamboo-800 hover:text-bamboo-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[32px]"
              >
                {copiedSection === 'ending' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Ending</span>
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-bamboo-200/80 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] sm:text-xs font-sans text-gray-500 font-semibold uppercase">Repeat 3 times:</p>
              <p className="text-indigo-900">M P N &nbsp;|&nbsp; P M G &nbsp;|&nbsp; R S</p>
              <p className="text-[11px] sm:text-xs font-sans text-gray-500 font-semibold uppercase pt-2">Finish on Sam:</p>
              <p className="text-emerald-800 text-lg sm:text-xl font-bold">S</p>
            </div>
          </div>
        </div>

        {/* How to Practice Steps */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>How to Practice "Sandhya Vihar"</span>
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700">
            {[
              'Practice the Aaroh and Avaroh until smooth.',
              'Repeat the Pakad signature phrase 5 times.',
              'Learn Section A slowly line by line.',
              'Practice Section B separately with attention to upper register.',
              'Join both Section A and Section B seamlessly.',
              'Finish with the 3-time repeating ending phrase (Tihai).',
              'Begin at 50 BPM and gradually increase to 80 BPM.'
            ].map((step, idx) => (
              <li key={idx} className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200/60 flex items-start gap-2">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-900 font-bold rounded-full flex items-center justify-center shrink-0 text-xs">
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
            { exercise: 'Practice Piece (Sandhya Vihar)', time: '10 minutes' },
            { exercise: 'Free Improvisation', time: '5 minutes' }
          ].map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-bamboo-950">{item.exercise}</span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
        <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs mt-2">
          <span className="text-xs sm:text-sm font-bold">Total Practice Time:</span>
          <span className="text-base sm:text-lg font-mono font-bold text-amber-300">40 minutes</span>
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
            { name: 'Raag Bilawal', view: 'raga_bilawal' as AppView },
            { name: 'Raag Yaman', view: 'raga_yaman' as AppView },
            { name: 'Raag Khamaj', view: 'learn_raagas' as AppView },
            { name: 'Raag Bhoopali', view: 'raga_bhoopali' as AppView },
            { name: 'Raag Durga', view: 'raga_durga' as AppView },
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

      {/* Author & Creator Section */}
      <AboutAuthorSection onViewChange={onViewChange} />

      {/* Copyright & Educational Notice */}
      <footer className="text-center text-xs text-gray-500 space-y-2 pt-4 border-t border-gray-200">
        <p className="font-bold text-gray-700">© FluteSangam Original Content</p>
        <p className="max-w-2xl mx-auto leading-relaxed text-[11px] sm:text-xs">
          This article, practice routines, alankars, FAQs, and the "Sandhya Vihar" practice piece have been created exclusively for FluteSangam as original educational material. The practice piece is intended to reinforce the note set and characteristic movements introduced on this page. It is an original educational exercise and is not presented as a traditional bandish or classical composition.
        </p>
      </footer>
    </motion.div>
  );
}
