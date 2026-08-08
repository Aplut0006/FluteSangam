import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Sun, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb, Printer, AlertCircle
} from 'lucide-react';
import { AppView } from '../types';
import { playTakMetronomeClick } from '../lib/audioUtils';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaBrindavaniSarangViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBrindavaniSarangView({ onViewChange }: RagaBrindavaniSarangViewProps) {
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
    'R': 293.66,   // Re (Shuddha Re)
    'M': 349.23,   // Ma (Shuddha Ma)
    'P': 392.00,   // Pa
    'N': 493.88,   // Shuddha Ni
    'n': 466.16,   // Komal Ni
    'S\'': 523.25,  // Upper Sa
    'R\'': 587.33,  // Upper Re
    'N.': 246.94,  // Lower Shuddha Ni
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

  // Metronome for Vrindavan Prabhat composition
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

  const compositionAalap = `Aalap (Free Rhythm)
S R M | P N | S' | N P | M R | S`;

  const compositionMukhda = `Mukhda (Teentaal - 16 Beats)
| S  R  M  P | N  P  M  R |
| S  -  -  - | S  R  M  - |`;

  const compositionAntara = `Antara
| M  P  N  S' | N  P  M  R |
| S  -  -  - | -  -  -  - |`;

  const compositionVistar = `Vistar Practice
| S' N  P  M | R  S  R  M |
| P  N  S' - | N  P  M  - |

| P  M  R  S | R  M  P  N |
| P  M  R  S | -  -  -  - |`;

  const compositionConclusion = `Concluding Phrase (Repeat 3 times)
R M P | M R | S
Finish on: S`;

  const basicInfo = [
    { label: 'Raga Name', value: 'Brindavani Sarang', icon: <Music className="w-4 h-4 text-amber-600" /> },
    { label: 'Thaat', value: 'Kafi', icon: <Compass className="w-4 h-4 text-amber-600" /> },
    { label: 'Jati', value: 'Audav – Audav (Pentatonic)', icon: <Sliders className="w-4 h-4 text-amber-600" /> },
    { label: 'Time of Day', value: 'Midday (12 PM – 3 PM)', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { label: 'Vadi (King Note)', value: 'Re (R)', icon: <Sparkles className="w-4 h-4 text-amber-700" /> },
    { label: 'Samvadi (Queen Note)', value: 'Pa (P)', icon: <Sparkles className="w-4 h-4 text-amber-700" /> },
    { label: 'Nature & Sentiment', value: 'Peaceful, Devotional, Bright', icon: <Heart className="w-4 h-4 text-emerald-600" /> },
    { label: 'Rasa', value: 'Bhakti (Devotion) & Shanta (Peace)', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Difficulty', value: 'Beginner to Intermediate', icon: <Award className="w-4 h-4 text-blue-600" /> },
  ];

  const swarasList = [
    { name: 'S', full: 'Shuddha Sa', status: 'Included', freq: '261.63 Hz' },
    { name: 'R', full: 'Shuddha Re (Vadi)', status: 'Included', freq: '293.66 Hz' },
    { name: 'G', full: 'Gandhar', status: 'Omitted (Varjit)', freq: '-' },
    { name: 'M', full: 'Shuddha Ma', status: 'Included', freq: '349.23 Hz' },
    { name: 'P', full: 'Pancham (Samvadi)', status: 'Included', freq: '392.00 Hz' },
    { name: 'D', full: 'Dhaivat', status: 'Omitted (Varjit)', freq: '-' },
    { name: 'N', full: 'Shuddha Ni', status: 'Included', freq: '493.88 Hz' },
    { name: "S'", full: 'Taar Sa', status: 'Included', freq: '523.25 Hz' },
  ];

  const dailySchedule = [
    { ex: 'Long Notes (S, R, M, P, N, S\')', time: '5 minutes', desc: 'Hold each note for 8–10 seconds with a steady, stable tone' },
    { ex: 'Aaroh–Avaroh Practice', time: '5 minutes', desc: 'Repeat S R M P N S\' / S\' N P M R S slowly 10–15 times' },
    { ex: 'Pakad Practice', time: '5 minutes', desc: 'R M P, N P, M R, S — internalize key characteristic phrases' },
    { ex: 'FluteSangam Original Alankars', time: '10 minutes', desc: 'Practice Alankars 1, 2, and 3 with clean finger placement' },
    { ex: 'Original Learning Piece "Vrindavan Prabhat"', time: '10 minutes', desc: 'Aalap, Mukhda, Antara, Vistar & Concluding phrase with metronome' },
    { ex: 'Free Improvisation & Phrasing', time: '10 minutes', desc: 'Combine phrases naturally in Madhya Laya while resting on Re & Pa' },
  ];

  const faqs = [
    {
      q: 'Is Raag Brindavani Sarang suitable for beginners?',
      a: 'Yes. Its pentatonic structure (5 notes in ascent and descent) and straightforward melodic movement make it an excellent raga for students who have already learned fundamental ragas like Bhoopali or Durga.'
    },
    {
      q: 'Which notes are omitted in Raag Brindavani Sarang?',
      a: 'Gandhar (Ga) and Dhaivat (Dha) are completely omitted in both Aaroh and Avaroh.'
    },
    {
      q: 'Which note is most important in Raag Brindavani Sarang?',
      a: 'Re (Rishabh) is the Vadi (king note), making it the most prominent note where melodic phrases often resolve. Pancham (Pa) is the Samvadi (queen note).'
    },
    {
      q: 'Which flute should I use for practicing Brindavani Sarang?',
      a: 'Raag Brindavani Sarang can be practiced on any properly tuned bansuri. A G Base or C Medium bansuri is a very comfortable choice for adult beginners.'
    },
    {
      q: 'What is the best time to perform Raag Brindavani Sarang?',
      a: 'Traditionally, Raag Brindavani Sarang is performed during the midday period, approximately 12 PM – 3 PM (Second Prahar of the day).'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" itemScope itemType="https://schema.org/LearningResource">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-bamboo-900 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-amber-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-semibold text-amber-200">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Midday Raga (12 PM – 3 PM) • Kafi Thaat</span>
            </div>

            {/* Freshness Badge */}
            <div className="flex items-center gap-2 text-xs text-amber-200/80 bg-black/20 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Verified Lesson</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white" itemProp="headline">
              Raag Brindavani Sarang
            </h1>
            <p className="text-base sm:text-lg text-amber-100/90 max-w-3xl leading-relaxed font-sans" itemProp="description">
              Complete guide to Raag Brindavani Sarang on Bansuri: Notes, Aaroh, Avaroh, Pakad, Chalan, 45-minute daily practice routine, original alankars, and the practice composition <strong className="text-white">"Vrindavan Prabhat"</strong>.
            </p>
          </div>

          {/* Published and Updated Dates */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] sm:text-xs text-amber-200/90 font-medium pt-2 border-t border-amber-800/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Published: <strong className="text-amber-100" itemProp="datePublished" content="2026-08-06">August 6, 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Updated: <strong className="text-amber-100" itemProp="dateModified" content="2026-08-06">August 6, 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>12 min read</span>
            </div>
          </div>

          {/* Practice Timer Toolbar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-amber-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-800/50 rounded-xl border border-amber-700/50">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Recommended Session</div>
                <div className="text-xl font-mono font-bold text-white">{formatTimer(timerSeconds)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                  isTimerRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isTimerRunning ? 'Pause Timer' : 'Start 45-Min Routine'}</span>
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(45 * 60); }}
                className="px-3 py-2 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 text-xs font-semibold rounded-xl border border-amber-700/50 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction & Overview */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-bamboo-100 pb-4">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-bamboo-900 font-display">Introduction & Musical Context</h2>
            <p className="text-xs text-gray-500">Understanding the serene character of Brindavani Sarang</p>
          </div>
        </div>

        <div className="prose prose-bamboo max-w-none text-gray-700 space-y-4 leading-relaxed">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium border-l-4 border-amber-500 pl-4 py-1 italic bg-amber-50/50 rounded-r-xl">
            Raag Brindavani Sarang is one of the most serene and melodious ragas in Hindustani Classical Music. Belonging to the Kafi Thaat, it is admired for its bright, devotional, and peaceful character. The raga is closely associated with the spiritual atmosphere of Vrindavan and is frequently performed in devotional music, bansuri recitals, and classical concerts.
          </p>
          <p>
            Unlike many complex ragas, Brindavani Sarang creates its distinct musical identity with a focused pentatonic selection of notes and graceful melodic phrases. The complete absence of Gandhar (Ga) and Dhaivat (Dha) endows the raga with an open, spacious sound, while the sweet interplay between Madhyam (Ma) and Nishad (Ni) creates a soothing, peaceful atmosphere.
          </p>
          <p>
            For bansuri players, Raag Brindavani Sarang serves as an exceptional raga for developing steady breath control, note stability, and expressive phrasing. It is typically introduced after students have built foundational confidence with ragas such as Bhoopali, Durga, Bilawal, and Yaman.
          </p>
        </div>

        {/* Basic Information Grid */}
        <div className="mt-6 pt-6 border-t border-bamboo-100">
          <h3 className="text-lg font-bold text-bamboo-900 mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-600" />
            <span>Basic Information & Key Attributes</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {basicInfo.map((info, idx) => (
              <div key={idx} className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100/80 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  {info.icon}
                  <span className="text-xs font-semibold text-gray-500">{info.label}</span>
                </div>
                <div className="text-sm font-bold text-bamboo-950 font-display">{info.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swara Notes & Audio Synthesizer */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bamboo-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-700">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-bamboo-900 font-display">Swaras & Note Structure</h2>
              <p className="text-xs text-gray-500">Tap any swara below to hear warm flute-like tones</p>
            </div>
          </div>
          <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-medium">
            Ga (G) & Dha (D) are strictly Omitted (Varjit)
          </div>
        </div>

        {/* Interactive Swara Keypad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {swarasList.map((swara) => {
            const isOmitted = swara.status.includes('Omitted');
            const isActive = activeSwara === swara.name;

            return (
              <button
                key={swara.name}
                disabled={isOmitted}
                onClick={() => playSwaraTone(swara.name, 1.0)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] relative ${
                  isOmitted
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                    : isActive
                    ? 'bg-amber-600 text-white border-amber-700 shadow-lg scale-105 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50 text-bamboo-900 border-bamboo-200 shadow-3xs'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  {swara.status}
                </span>
                <span className="text-2xl font-black font-display my-1">{swara.name}</span>
                <span className="text-[11px] font-medium leading-tight">{swara.full}</span>
                {!isOmitted && (
                  <span className="text-[9px] mt-1 opacity-70 font-mono">{swara.freq}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Aaroh, Avaroh, Pakad & Chalan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Aaroh Card */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Aaroh (Ascending)</span>
              <button
                onClick={() => copyToClipboard('S R M P N S\'', 'aaroh')}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'aaroh' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'aaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-bamboo-950 tracking-wider">
              S  R  M  P  N  S'
            </div>
            <p className="text-xs text-gray-600">Ascends cleanly through 5 notes, skipping Ga and Dha completely.</p>
          </div>

          {/* Avaroh Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl border border-indigo-200/80 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-800">Avaroh (Descending)</span>
              <button
                onClick={() => copyToClipboard('S\' N P M R S', 'avaroh')}
                className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'avaroh' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'avaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-bamboo-950 tracking-wider">
              S'  N  P  M  R  S
            </div>
            <p className="text-xs text-gray-600">Descends directly back to base Sa with smooth, sustained flow.</p>
          </div>

          {/* Pakad Card */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200/80 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Pakad (Catch Phrase / Signature)</span>
              <button
                onClick={() => copyToClipboard('R M P | N P | M R | S', 'pakad')}
                className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-bamboo-950 tracking-wider">
              R M P  —  N P  —  M R  —  S
            </div>
            <div className="pt-2 border-t border-emerald-200/60 text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span><strong>Alternative Phrase:</strong> <code className="bg-emerald-100/80 px-2 py-0.5 rounded font-mono">S R M  —  P N  —  P M  —  R S</code></span>
              <span className="text-emerald-800 font-medium">Re (R) is sustained as Vadi note</span>
            </div>
          </div>

          {/* Chalan Movement Card */}
          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-900">Chalan (Characteristic Melodic Movement)</span>
              <button
                onClick={() => copyToClipboard('S R M \nP N S\' \nN P \nM R \nS \n\nR M P \nN P \nM R S', 'chalan')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'chalan' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'chalan' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-mono font-bold text-bamboo-900 bg-white p-4 rounded-xl border border-amber-200">
              <div className="space-y-1">
                <p>S R M</p>
                <p>P N S'</p>
                <p>N P</p>
                <p>M R</p>
                <p>S</p>
              </div>
              <div className="space-y-1">
                <p>R M P</p>
                <p>N P</p>
                <p>M R S</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Characteristics & Mood Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Characteristics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-bamboo-900 font-display">Important Characteristics</h2>
          </div>

          <ul className="space-y-2.5 text-sm text-gray-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Five-Note Audav-Audav Structure:</strong> Pure pentatonic raga in both ascent and descent.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Ga & Dha Omitted:</strong> Absence of Ga and Dha provides a distinct open soundscape.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Re is Vadi:</strong> Rishabh (Re) receives maximum emphasis and long sustaining rests.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pa is Samvadi:</strong> Pancham (Pa) acts as the balancing second anchor.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bright & Flowing:</strong> Straightforward note structure allowing expressive phrasing on bansuri.</span>
            </li>
          </ul>
        </div>

        {/* Mood & Benefits */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-bamboo-900 font-display">Mood & Why Learn It?</h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {['Devotion (Bhakti)', 'Peace (Shanta)', 'Joy', 'Serenity', 'Spirituality', 'Calmness'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed pt-2">
              <strong>Why Learn Raag Brindavani Sarang on Bansuri?</strong>
            </p>
            <ul className="space-y-1.5 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span>Easy 5-note pentatonic scale suitable for early practice.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span>Improves breath stability and sustained blowing quality.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span>Develops clean finger transitions between R, M, P, and N.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span>Builds confidence before tackling more complex ragas.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FluteSangam Original Alankars Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-bamboo-100 pb-4">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-bamboo-900 font-display">FluteSangam Original Alankars</h2>
            <p className="text-xs text-gray-500">Custom finger agility drills in Raag Brindavani Sarang</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Alankar 1 */}
          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">Original Alankar 1</span>
              <button
                onClick={() => copyToClipboard('Ascending: S R | R M | M P | P N | N S\' \nDescending: S\' N | N P | P M | M R | R S', 'alankar1')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'alankar1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono font-semibold text-bamboo-950 bg-white p-3 rounded-xl border border-amber-200">
              <p className="text-amber-700">Ascending:</p>
              <p>S R | R M | M P | P N | N S'</p>
              <p className="text-amber-700 pt-1">Descending:</p>
              <p>S' N | N P | P M | M R | R S</p>
            </div>
          </div>

          {/* Alankar 2 */}
          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase">Original Alankar 2</span>
              <button
                onClick={() => copyToClipboard('Ascending: S R M | R M P | M P N | P N S\' \nDescending: S\' N P | N P M | P M R | M R S', 'alankar2')}
                className="text-xs text-indigo-800 hover:text-indigo-950 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'alankar2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono font-semibold text-bamboo-950 bg-white p-3 rounded-xl border border-indigo-200">
              <p className="text-indigo-700">Ascending:</p>
              <p>S R M | R M P | M P N | P N S'</p>
              <p className="text-indigo-700 pt-1">Descending:</p>
              <p>S' N P | N P M | P M R | M R S</p>
            </div>
          </div>

          {/* Alankar 3 */}
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase">Original Alankar 3</span>
              <button
                onClick={() => copyToClipboard('Ascending: S R M R | R M P M | M P N P | P N S\' N \nDescending: S\' N P N | N P M P | P M R M | R S', 'alankar3')}
                className="text-xs text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'alankar3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono font-semibold text-bamboo-950 bg-white p-3 rounded-xl border border-emerald-200">
              <p className="text-emerald-700">Ascending:</p>
              <p>S R M R | R M P M | M P N P | P N S' N</p>
              <p className="text-emerald-700 pt-1">Descending:</p>
              <p>S' N P N | N P M P | P M R M | R S</p>
            </div>
          </div>
        </div>
      </section>

      {/* FluteSangam Original Learning Piece: "Vrindavan Prabhat" */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bamboo-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-bamboo-900 font-display">Vrindavan Prabhat</h2>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full">
                  Original Composition
                </span>
              </div>
              <p className="text-xs text-gray-500">Educational Practice Composition in Teentaal (16 Beats)</p>
            </div>
          </div>

          {/* Composition Controls */}
          <div className="flex items-center gap-3 bg-amber-50 p-2 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingComposition(!isPlayingComposition)}
                className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors shadow-sm"
              >
                {isPlayingComposition ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase">Teentaal Metronome</div>
                <div className="text-xs font-bold text-bamboo-950">{bpm} BPM</div>
              </div>
            </div>

            <input
              type="range"
              min="40"
              max="120"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 accent-amber-600"
            />
          </div>
        </div>

        {/* Metronome Beat Tracker */}
        {isPlayingComposition && (
          <div className="bg-amber-900/90 text-white p-4 rounded-2xl space-y-2 border border-amber-800">
            <div className="flex justify-between items-center text-xs font-semibold text-amber-200">
              <span>Teentaal Beat Tracker (16 Beats)</span>
              <span>Sam on Beat 1</span>
            </div>
            <div className="grid grid-cols-16 gap-1 sm:gap-1.5">
              {Array.from({ length: 16 }, (_, i) => i + 1).map((beat) => (
                <div
                  key={beat}
                  className={`py-1.5 text-center font-mono font-bold text-xs rounded-lg transition-all ${
                    currentBeat === beat
                      ? 'bg-amber-400 text-bamboo-950 scale-110 shadow-md ring-2 ring-white'
                      : beat === 1
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-amber-950/60 text-amber-300/80'
                  }`}
                >
                  {beat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Composition Notation Display */}
        <div className="space-y-4">
          {/* Aalap */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-900 uppercase">1. Aalap (Unmetered Free Flow)</span>
              <button
                onClick={() => copyToClipboard(compositionAalap, 'aalap')}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'aalap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="font-mono text-sm sm:text-base font-bold text-bamboo-950 whitespace-pre-wrap leading-relaxed">
              {compositionAalap}
            </pre>
          </div>

          {/* Mukhda */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-bamboo-900 uppercase">2. Mukhda (Teentaal - 16 Beats)</span>
              <button
                onClick={() => copyToClipboard(compositionMukhda, 'mukhda')}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'mukhda' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="font-mono text-sm sm:text-base font-bold text-bamboo-950 whitespace-pre-wrap leading-relaxed">
              {compositionMukhda}
            </pre>
          </div>

          {/* Antara */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-bamboo-900 uppercase">3. Antara (Upper Octave Exploration)</span>
              <button
                onClick={() => copyToClipboard(compositionAntara, 'antara')}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'antara' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="font-mono text-sm sm:text-base font-bold text-bamboo-950 whitespace-pre-wrap leading-relaxed">
              {compositionAntara}
            </pre>
          </div>

          {/* Vistar */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-bamboo-900 uppercase">4. Vistar Practice</span>
              <button
                onClick={() => copyToClipboard(compositionVistar, 'vistar')}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'vistar' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="font-mono text-sm sm:text-base font-bold text-bamboo-950 whitespace-pre-wrap leading-relaxed">
              {compositionVistar}
            </pre>
          </div>

          {/* Concluding Phrase */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-900 uppercase">5. Concluding Phrase</span>
              <button
                onClick={() => copyToClipboard(compositionConclusion, 'conclusion')}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
              >
                {copiedSection === 'conclusion' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="font-mono text-sm font-bold text-bamboo-950 whitespace-pre-wrap">
              {compositionConclusion}
            </pre>
          </div>
        </div>
      </section>

      {/* Suggested Daily Practice Routine & Common Mistakes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Routine */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-bamboo-900 font-display">45-Minute Daily Routine</h2>
          </div>

          <div className="space-y-3">
            {dailySchedule.map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded shrink-0 mt-0.5">
                  {item.time}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-bamboo-900">{item.ex}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes & Performance Tips */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
            <div className="p-2 bg-red-50 rounded-xl text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-bamboo-900 font-display">Mistakes & Performance Tips</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-200/80 space-y-2">
              <h4 className="text-xs font-bold text-red-900 uppercase">Common Mistakes to Avoid:</h4>
              <ul className="space-y-1 text-xs text-red-800">
                <li>❌ Accidentally playing Ga or Dha.</li>
                <li>❌ Playing too fast before mastering key phrases.</li>
                <li>❌ Weak breath support during long note holds.</li>
                <li>❌ Not emphasizing Re (Vadi) properly.</li>
                <li>❌ Playing with uneven tone quality across registers.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase">Tips for Better Performance:</h4>
              <ul className="space-y-1 text-xs text-emerald-800">
                <li>✓ Practice consistently with a tanpura drone on Sa.</li>
                <li>✓ Sustain Re and Pa clearly with stable blowing.</li>
                <li>✓ Maintain smooth airflow across note changes.</li>
                <li>✓ Focus on clean note transitions before increasing speed.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-bamboo-100 pb-4">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-bamboo-900 font-display">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-500">Common queries about Raag Brindavani Sarang</p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-bamboo-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left bg-amber-50/30 hover:bg-amber-50 transition-colors flex items-center justify-between font-bold text-sm text-bamboo-950"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-700" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-bamboo-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Ragas & Navigation */}
      <section className="bg-gradient-to-br from-bamboo-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-display text-white">Explore Related Ragas</h3>
            <p className="text-xs text-amber-200/80">Continue your Hindustani Classical flute journey</p>
          </div>
          <button
            onClick={() => onViewChange && onViewChange('learn_raagas')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>All Ragas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Raag Bhoopali', view: 'raga_bhoopali' as AppView, level: 'Beginner' },
            { name: 'Raag Durga', view: 'raga_durga' as AppView, level: 'Beginner' },
            { name: 'Raag Hamsadhwani', view: 'raga_hamsadhwani' as AppView, level: 'Beginner' },
            { name: 'Raag Bilawal', view: 'raga_bilawal' as AppView, level: 'Beginner' },
          ].map((raga, idx) => (
            <button
              key={idx}
              onClick={() => onViewChange && onViewChange(raga.view)}
              className="p-3.5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-left transition-all group"
            >
              <div className="text-[10px] text-amber-300 font-bold uppercase">{raga.level}</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors mt-0.5">{raga.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Copyright Notice */}
      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-[11px] text-gray-600 leading-relaxed text-center">
        <p>
          <strong>© FluteSangam Original Content:</strong> This article, including the explanations, practice routines, original alankars, and the <em>"Vrindavan Prabhat"</em> learning piece, has been created exclusively for FluteSangam as original educational content.
        </p>
      </div>

      {/* Author Section */}
      <AboutAuthorSection />
    </div>
  );
}
