import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb
} from 'lucide-react';
import { AppView } from '../types';
import { playTakMetronomeClick } from '../lib/audioUtils';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaKafiViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaKafiView({ onViewChange }: RagaKafiViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(40 * 60);

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

  // Metronome for Komal Sur Lahari composition
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
| S  R  g  M | P  D  n  D |
| P  M  g  R | S  -  -  - |

| R  g  M  P | D  n  S' n |
| D  P  M  g | R  S  -  - |`;

  const compositionSectionB = `Section B
| S' n  D  P | M  g  R  S |
| R  g  M  P | D  n  S' - |

| n  D  P  M | g  R  S  R |
| g  M  P  M | g  R  S  - |`;

  const compositionEnding = `Ending Phrase (Repeat 3 Times)
g M P | M g R | S

Finish on:
S`;

  const faqs = [
    {
      q: "Is Raag Kafi suitable for beginners?",
      a: "Raag Kafi is generally recommended after learning ragas such as Bhoopali, Durga, Bilawal, and Yaman because it introduces Komal Ga (g) and Komal Ni (n)."
    },
    {
      q: "Which notes are Komal in Raag Kafi?",
      a: "Komal Gandhar (g) and Komal Nishad (n) are the two altered flat notes used in Raag Kafi."
    },
    {
      q: "Which note is most important in Raag Kafi?",
      a: "Pancham (Pa) is traditionally considered the Vadi (King note), while Shadja (Sa) is the Samvadi (Queen note)."
    },
    {
      q: "Which flute should I use to practice Raag Kafi?",
      a: "Raag Kafi can be practiced on any properly tuned bansuri. Many adult learners prefer a G Base bansuri for its comfortable pitch, rich resonance, and expressive tone."
    },
    {
      q: "What is the best time to perform Raag Kafi?",
      a: "Traditionally, it is performed during the second quarter of the night (approximately 9 PM – 12 AM)."
    }
  ];

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Raag Kafi: Complete Guide, Notes, Aaroh, Avaroh & Practice',
    'description': 'Master Raag Kafi on Indian Bamboo Flute (Bansuri). Complete guide with Swara playback, Pakad, Chalan, original Alankars, and the practice piece "Komal Sur Lahari".',
    'datePublished': '2026-08-03T00:00:00Z',
    'dateModified': '2026-08-03T00:00:00Z',
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
    'mainEntityOfPage': 'https://flutesangam.com/learn/raga-kafi'
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
      <section className="bg-gradient-to-br from-indigo-950 via-bamboo-900 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl border border-indigo-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[11px] sm:text-xs text-amber-200/80 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-amber-300 transition cursor-pointer touch-manipulation"
            >
              Learn
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-amber-300 transition cursor-pointer touch-manipulation"
            >
              Raagas
            </button>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[140px] sm:max-w-none">Raag Kafi</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-5 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-500/20 text-amber-300 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3 border border-amber-400/30">
                <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>2nd Quarter of Night (9 PM – 12 AM)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-2 sm:mb-3 leading-tight">
                Raag Kafi Guide
              </h1>
              <p className="text-xs sm:text-base text-indigo-100 max-w-2xl leading-relaxed font-sans">
                Master Komal Ga (g) and Komal Ni (n), smooth meends, original Alankars, and the educational practice piece <span className="text-amber-300 font-semibold">"Komal Sur Lahari"</span> on Bansuri.
              </p>
            </div>

            {/* Quick Practice Timer Card */}
            <div className="bg-indigo-900/90 border border-indigo-700/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center shrink-0 w-full md:w-auto md:min-w-[200px] shadow-inner">
              <div className="text-xs text-indigo-200 font-medium mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Suggested Routine</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 my-1">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex gap-2 mt-2 w-full">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex-1 py-2 sm:py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[40px] touch-manipulation ${
                    isTimerRunning ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(40 * 60);
                  }}
                  className="py-2 sm:py-1.5 px-3 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 rounded-xl text-xs font-medium transition cursor-pointer min-h-[40px] touch-manipulation"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-200/90 pt-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 bg-indigo-900/60 px-2.5 sm:px-3 py-1 rounded-lg border border-indigo-800">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Published: Aug 3, 2026</span>
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-900/60 px-2.5 sm:px-3 py-1 rounded-lg border border-indigo-800">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Updated: Aug 3, 2026</span>
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-900/60 px-2.5 sm:px-3 py-1 rounded-lg border border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Original Educational Content</span>
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button 
                onClick={() => copyToClipboard(window.location.href, 'page_url')}
                className="hover:text-amber-300 transition flex items-center gap-1 text-[11px] sm:text-xs bg-indigo-900/80 px-3 py-1.5 rounded-lg border border-indigo-700 cursor-pointer min-h-[36px] touch-manipulation"
              >
                {copiedSection === 'page_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
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
        <div className="prose prose-bamboo max-w-none text-gray-700 space-y-3 sm:space-y-4 leading-relaxed font-sans text-xs sm:text-base">
          <p>
            <strong>Raag Kafi</strong> is one of the most expressive and widely performed ragas in Hindustani Classical Music. It belongs to the Kafi Thaat and is known for its gentle, folk-inspired melodies and emotional depth. The raga is frequently heard in classical performances, bhajans, folk music, and semi-classical forms such as thumri and dadra.
          </p>
          <p>
            Unlike Bilawal, Raag Kafi introduces the use of <strong>Komal Gandhar (g)</strong> and <strong>Komal Nishad (n)</strong>, giving the raga its distinctive, soft, and expressive character. For bansuri players, Kafi is an excellent step toward learning ragas that use altered notes while improving meend, expression, and breath control.
          </p>
        </div>
      </section>

      {/* Key Technical Matrix (Table) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700 shrink-0" />
            <span>Basic Information</span>
          </h2>
          <span className="text-[11px] sm:text-xs text-indigo-900 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Hindustani Classical Framework
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Raga Name</span>
            <span className="text-sm sm:text-base font-bold text-bamboo-950">Kafi</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Thaat</span>
            <span className="text-sm sm:text-base font-bold text-bamboo-950">Kafi</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Jati</span>
            <span className="text-xs sm:text-base font-bold text-bamboo-950">Sampurna – Sampurna</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</span>
            <span className="text-xs sm:text-sm font-bold text-bamboo-950">2nd Quarter of Night (9 PM – 12 AM)</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Vadi (King Note)</span>
            <span className="text-xs sm:text-base font-bold text-amber-800">Pa (Pancham)</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Samvadi (Queen Note)</span>
            <span className="text-xs sm:text-base font-bold text-amber-800">Sa (Shadja)</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Nature</span>
            <span className="text-xs sm:text-sm font-bold text-bamboo-950">Romantic, Devotional, Folk-like</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Rasa</span>
            <span className="text-xs sm:text-sm font-bold text-bamboo-950">Shringar, Bhakti, Karuna</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between col-span-1 sm:col-span-2">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">Difficulty Level</span>
            <span className="text-xs font-bold text-indigo-900 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full">
              Intermediate
            </span>
          </div>
        </div>

        {/* Swaras Used Interactive Buttons */}
        <div className="pt-3 sm:pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-bamboo-900 uppercase tracking-wider">
              Swaras Used (Click to Hear Swara Tone)
            </h3>
            <span className="text-[10px] sm:text-xs text-gray-500">G Base Scale Frequencies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Sa (S)', key: 'S' },
              { name: 'Re (R)', key: 'R' },
              { name: 'Komal Ga (g)', key: 'g' },
              { name: 'Ma (M)', key: 'M' },
              { name: 'Pa (P)', key: 'P' },
              { name: 'Dha (D)', key: 'D' },
              { name: 'Komal Ni (n)', key: 'n' },
              { name: 'Sa\' (S\')', key: 'S\'' }
            ].map((swara) => (
              <button
                key={swara.key}
                onClick={() => playSwaraTone(swara.key)}
                className={`py-2 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] touch-manipulation shrink-0 ${
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

          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-indigo-950 leading-relaxed mt-3 sm:mt-4">
            <p className="font-semibold text-indigo-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Characteristic Note Usage</span>
            </p>
            <p className="text-gray-700">
              In Raag Kafi, <strong>Komal Gandhar (g)</strong> and <strong>Komal Nishad (n)</strong> are essential. All other notes are Shuddha. Pay special attention to smooth transitions between Re and Komal Ga, as well as Komal Ni and Dha.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Aaroh */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">Aaroh (Ascending)</span>
              <button 
                onClick={() => playSwaraTone('S')} 
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
              >
                <Play className="w-3 h-3" /> Play Root
              </button>
            </div>
            <p className="text-lg sm:text-2xl font-bold font-mono text-bamboo-950 tracking-wider overflow-x-auto scrollbar-thin py-1">
              S R g M P D n S'
            </p>
            <p className="text-xs text-gray-600">Full 7-note ascending scale with Komal Ga (g) and Komal Ni (n).</p>
          </div>

          {/* Avaroh */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">Avaroh (Descending)</span>
              <button 
                onClick={() => playSwaraTone('S\'')} 
                className="text-xs text-amber-700 hover:underline flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
              >
                <Play className="w-3 h-3" /> Play Upper Sa
              </button>
            </div>
            <p className="text-lg sm:text-2xl font-bold font-mono text-bamboo-950 tracking-wider overflow-x-auto scrollbar-thin py-1">
              S' n D P M g R S
            </p>
            <p className="text-xs text-gray-600">Full 7-note descending scale back to root Sa.</p>
          </div>
        </div>

        {/* Pakad */}
        <div className="bg-bamboo-50/80 border border-bamboo-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-bamboo-900 uppercase tracking-wider">Pakad (Signature Phrase)</span>
            <button
              onClick={() => copyToClipboard('S R g M | P D | n D P | M g R | S', 'pakad')}
              className="text-xs text-bamboo-700 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-bamboo-200 space-y-1 font-mono text-sm sm:text-base font-bold text-bamboo-950 overflow-x-auto scrollbar-thin">
            <p>S R g M &nbsp;|&nbsp; P D &nbsp;|&nbsp; n D P &nbsp;|&nbsp; M g R &nbsp;|&nbsp; S</p>
          </div>

          <div className="pt-2 border-t border-bamboo-200/60">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-600 block mb-1">Alternative Pakad Phrase:</span>
            <p className="font-mono text-xs sm:text-sm font-bold text-bamboo-800 overflow-x-auto scrollbar-thin">
              R g M &nbsp;|&nbsp; P M &nbsp;|&nbsp; g R &nbsp;|&nbsp; S
            </p>
          </div>
        </div>

        {/* Chalan */}
        <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-indigo-900 uppercase tracking-wider">Chalan (Melodic Progression)</span>
            <button
              onClick={() => copyToClipboard('S R g M | P D n S\' | n D P | M g R | S \n\n R g M P | D n D P | M g R S', 'chalan')}
              className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
            >
              {copiedSection === 'chalan' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'chalan' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs sm:text-sm font-bold text-bamboo-950">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-100 space-y-1 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] font-sans text-indigo-700 font-semibold mb-1">Movement 1</p>
              <p>S R g M &nbsp;|&nbsp; P D n S' &nbsp;|&nbsp; n D P &nbsp;|&nbsp; M g R &nbsp;|&nbsp; S</p>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-100 space-y-1 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] font-sans text-indigo-700 font-semibold mb-1">Movement 2</p>
              <p>R g M P &nbsp;|&nbsp; D n D P &nbsp;|&nbsp; M g R S</p>
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
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Komal Ga (g)</strong> and <strong>Komal Nishad (n)</strong> define the raga's identity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Pa</strong> is the primary resting note (Vadi).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Smooth meend between Re–Komal Ga and Komal Ni–Dha enhances expression.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Avoid treating the raga as a simple natural minor scale.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>The emotional quality comes from characteristic phrases rather than the scale alone.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Mood, Emotion & Why Learn */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood & Emotion */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-4">
          <h2 className="text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>Mood and Emotion</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Raag Kafi expresses a gentle, folk-inspired spectrum of emotions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {['Devotion', 'Romance', 'Compassion', 'Simplicity', 'Folk tradition', 'Serenity'].map((mood, idx) => (
              <div key={idx} className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 text-center">
                <span className="text-xs sm:text-sm font-bold text-rose-900">{mood}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed pt-2">
            Its sweet, accessible nature makes it immensely popular in semi-classical thumris, dadras, and folk melodies.
          </p>
        </div>

        {/* Why Learn Raag Kafi */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-4">
          <h2 className="text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <span>Why Learn Raag Kafi?</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {[
              'Introduces Komal swaras (flat notes: g and n) on the bansuri.',
              'Develops expressive playing and delicate micro-tonal control.',
              'Improves meend technique and smooth note transitions.',
              'Strengthens breath control and long note stability.',
              'Prepares students for advanced ragas using altered notes (e.g. Bhimpalasi, Bageshree).'
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
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Repeat className="w-6 h-6 text-indigo-700" />
              <span>Beginner Practice Routine</span>
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Step-by-step technical exercises to build muscle memory and Komal note accuracy.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard('S R g M P D n S\' \n S\' n D P M g R S', 'aaroh_avroh')}
            className="text-xs bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-900 border border-bamboo-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            {copiedSection === 'aaroh_avroh' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Scale Routine</span>
          </button>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {/* Long Notes */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
              1. Long Notes Practice (Hold each 8–10 sec)
            </h3>
            <p className="font-mono text-base sm:text-lg font-bold text-bamboo-950 tracking-widest">
              S &nbsp;&nbsp; R &nbsp;&nbsp; g &nbsp;&nbsp; M &nbsp;&nbsp; P &nbsp;&nbsp; D &nbsp;&nbsp; n &nbsp;&nbsp; S'
            </p>
            <p className="text-xs text-gray-600">Focus on clean intonation for Komal Ga (g) and Komal Ni (n).</p>
          </div>

          {/* Aaroh-Avaroh */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">
              2. Aaroh–Avaroh Practice
            </h3>
            <div className="font-mono text-base font-bold text-bamboo-950 space-y-1">
              <p>S R g M P D n S'</p>
              <p>S' n D P M g R S</p>
            </div>
            <p className="text-xs text-gray-600">Repeat slowly 10 times with a steady tanpura drone.</p>
          </div>

          {/* FluteSangam Original Alankars */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-bamboo-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>FluteSangam Original Alankars for Raag Kafi</span>
            </h3>

            {/* Alankar 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">FluteSangam Original Alankar 1</span>
                <button
                  onClick={() => copyToClipboard('S R | R g | g M | M P | P D | D n | n S\' \n S\' n | n D | D P | P M | M g | g R | R S', 'alankar1')}
                  className="text-xs text-gray-500 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'alankar1' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 bg-gray-50 p-3 rounded-xl">
                <p><span className="text-indigo-700">Ascending:</span> S R | R g | g M | M P | P D | D n | n S'</p>
                <p><span className="text-amber-700">Descending:</span> S' n | n D | D P | P M | M g | g R | R S</p>
              </div>
            </div>

            {/* Alankar 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">FluteSangam Original Alankar 2</span>
                <button
                  onClick={() => copyToClipboard('S R g | R g M | g M P | M P D | P D n | D n S\' \n S\' n D | n D P | D P M | P M g | M g R | g R S', 'alankar2')}
                  className="text-xs text-gray-500 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'alankar2' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 bg-gray-50 p-3 rounded-xl">
                <p><span className="text-indigo-700">Ascending:</span> S R g | R g M | g M P | M P D | P D n | D n S'</p>
                <p><span className="text-amber-700">Descending:</span> S' n D | n D P | D P M | P M g | M g R | g R S</p>
              </div>
            </div>

            {/* Alankar 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">FluteSangam Original Alankar 3</span>
                <button
                  onClick={() => copyToClipboard('S R g R | R g M g | g M P M | M P D P | P D n D | D n S\' n \n S\' n D n | n D P D | D P M P | P M g M | g R S', 'alankar3')}
                  className="text-xs text-gray-500 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'alankar3' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-1 bg-gray-50 p-3 rounded-xl">
                <p><span className="text-indigo-700">Ascending:</span> S R g R | R g M g | g M P M | M P D P | P D n D | D n S' n</p>
                <p><span className="text-amber-700">Descending:</span> S' n D n | n D P D | D P M P | P M g M | g R S</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes & Tips */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Mistakes */}
        <div className="bg-rose-50/50 border border-rose-200/80 rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-bold font-display text-rose-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Common Mistakes to Avoid</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-800 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing Shuddha Ga (G) instead of Komal Ga (g).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing Shuddha Ni (N) instead of Komal Ni (n).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Ignoring smooth meend and glides.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing too fast before securing Komal note pitch accuracy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Losing the soft, expressive, and devotional mood of the raga.</span>
            </li>
          </ul>
        </div>

        {/* Performance Tips */}
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-bold font-display text-emerald-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Tips for Better Performance</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-800 font-sans">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Practice slowly with a tanpura drone in G or C.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Listen carefully to the Komal notes for pitch precision.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Keep your tone warm, controlled, and relaxed.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Rest naturally on <strong>Pa</strong> (Vadi note).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Focus on musical expression and sweet phrasing before speed.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FluteSangam Original Practice Piece: Komal Sur Lahari */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6" id="practice-composition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Original Educational Practice Piece</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-display text-bamboo-950">
              Komal Sur Lahari
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Raag: <strong>Kafi</strong> &nbsp;|&nbsp; Taal: <strong>Teentaal (16 Beats)</strong> &nbsp;|&nbsp; Tempo: <strong>Madhya Laya</strong>
            </p>
          </div>

          {/* Interactive Metronome Control */}
          <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col items-center shrink-0 w-full md:w-auto md:min-w-[220px]">
            <div className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Teentaal Metronome Guide</span>
            </div>

            <div className="flex items-center gap-4 my-2">
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-9 h-9 sm:w-8 sm:h-8 bg-white border border-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-100 flex items-center justify-center cursor-pointer touch-manipulation shadow-3xs"
              >
                -
              </button>
              <span className="font-mono text-base sm:text-lg font-bold text-bamboo-950">{bpm} BPM</span>
              <button
                onClick={() => setBpm(Math.min(140, bpm + 5))}
                className="w-9 h-9 sm:w-8 sm:h-8 bg-white border border-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-100 flex items-center justify-center cursor-pointer touch-manipulation shadow-3xs"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className={`w-full py-2 sm:py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] touch-manipulation ${
                isPlayingComposition ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-indigo-700 text-white hover:bg-indigo-800'
              }`}
            >
              {isPlayingComposition ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
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
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
              >
                {copiedSection === 'section_a' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Section A</span>
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S &nbsp;R &nbsp;g &nbsp;M | P &nbsp;D &nbsp;n &nbsp;D |</p>
              <p>| P &nbsp;M &nbsp;g &nbsp;R | S &nbsp;- &nbsp;- &nbsp;- |</p>
              <br />
              <p>| R &nbsp;g &nbsp;M &nbsp;P | D &nbsp;n &nbsp;S' n |</p>
              <p>| D &nbsp;P &nbsp;M &nbsp;g | R &nbsp;S &nbsp;- &nbsp;- |</p>
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
                className="text-xs text-indigo-800 hover:text-indigo-950 flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
              >
                {copiedSection === 'section_b' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Section B</span>
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S' n &nbsp;D &nbsp;P | M &nbsp;g &nbsp;R &nbsp;S |</p>
              <p>| R &nbsp;g &nbsp;M &nbsp;P | D &nbsp;n &nbsp;S' - |</p>
              <br />
              <p>| n &nbsp;D &nbsp;P &nbsp;M | g &nbsp;R &nbsp;S &nbsp;R |</p>
              <p>| g &nbsp;M &nbsp;P &nbsp;M | g &nbsp;R &nbsp;S &nbsp;- |</p>
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
                className="text-xs text-bamboo-800 hover:text-bamboo-950 flex items-center gap-1 cursor-pointer min-h-[36px] touch-manipulation"
              >
                {copiedSection === 'ending' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Ending</span>
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-bamboo-200/80 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
              <p className="text-[11px] font-sans text-gray-500 font-semibold uppercase">Repeat 3 times:</p>
              <p className="text-indigo-900">g M P &nbsp;|&nbsp; M g R &nbsp;|&nbsp; S</p>
              <p className="text-[11px] font-sans text-gray-500 font-semibold uppercase pt-1.5">Finish on Sam:</p>
              <p className="text-emerald-800 text-lg sm:text-xl font-bold">S</p>
            </div>
          </div>
        </div>

        {/* How to Practice Steps */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>How to Practice "Komal Sur Lahari"</span>
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
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
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
            { exercise: 'Practice Piece (Komal Sur Lahari)', time: '10 minutes' },
            { exercise: 'Free Improvisation', time: '5 minutes' }
          ].map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-bamboo-950">{item.exercise}</span>
              <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
        <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs mt-2">
          <span className="text-xs sm:text-sm font-bold">Total Practice Time:</span>
          <span className="text-base sm:text-lg font-mono font-bold text-amber-300">40 minutes</span>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-700" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 font-bold text-sm sm:text-base text-bamboo-950 bg-gray-50/60 hover:bg-amber-50/50 flex items-center justify-between gap-3 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Ragas Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Compass className="w-6 h-6 text-indigo-700" />
          <span>Related Ragas</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Raag Brindavani Sarang', view: 'raga_brindavani_sarang', description: 'Serene pentatonic midday raga from Kafi Thaat omitting Ga and Dha.', difficulty: 'Beginner' },
            { name: 'Raag Bhimpalasi', view: 'raga_bhimpalasi', description: 'Peaceful afternoon raga from Kafi Thaat emphasizing Komal Ga and Komal Ni.', difficulty: 'Intermediate' },
            { name: 'Raag Desh', view: 'raga_desh', description: 'Monsoon evening scale with graceful glides and memorable descending phrases.', difficulty: 'Intermediate' },
            { name: 'Raag Bageshree', view: 'raga_bageshree', description: 'Deeply romantic night melody using Komal Ga and Komal Ni with winding movements.', difficulty: 'Intermediate' },
            { name: 'Raag Bhoopali', view: 'raga_bhoopali', description: 'Peaceful pentatonic scale skipping Ma and Ni; rich in meditative calmness.', difficulty: 'Beginner' },
            { name: 'Raag Yaman', view: 'raga_yaman', description: 'Evening scale introducing Teevra Ma; foundation of classical improvisation.', difficulty: 'Beginner' },
          ].map((raga, idx) => (
            <div 
              key={idx} 
              onClick={() => onViewChange?.(raga.view as AppView)}
              className="bg-gray-50/80 hover:bg-amber-50/80 border border-gray-200 hover:border-amber-300 rounded-2xl p-4 transition space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-bamboo-950 group-hover:text-amber-800 transition">
                  {raga.name}
                </span>
                <span className="text-[10px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-md">
                  {raga.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{raga.description}</p>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Copyright Disclaimer Note */}
      <section className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-center space-y-1 text-xs text-gray-500 font-sans">
        <p className="font-semibold text-gray-700">© FluteSangam Original Content</p>
        <p className="max-w-3xl mx-auto leading-relaxed">
          This article, practice routines, alankars, FAQs, and the "Komal Sur Lahari" practice piece have been created exclusively for FluteSangam as original educational material. The practice piece is intended to reinforce the note set and characteristic movements introduced on this page. It is an original educational exercise and is not presented as a traditional bandish or classical composition.
        </p>
      </section>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </motion.div>
  );
}
