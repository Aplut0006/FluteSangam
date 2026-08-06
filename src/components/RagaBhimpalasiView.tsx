import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Sun, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaBhimpalasiViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBhimpalasiView({ onViewChange }: RagaBhimpalasiViewProps) {
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

  // Metronome for Madhur Vela composition
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

  const compositionAalap = `Aalap (Free Rhythm)
S g M | M P | n S'
S' n D | P M | g R S`;

  const compositionMukhda = `Mukhda (Teentaal - 16 Beats)
| n  S  g  M | P  M  g  R |
| S  -  -  - | S  g  M  - |`;

  const compositionAntara = `Antara
| M  P  n  S' | n  D  P  M |
| g  R  S  - | -  -  -  - |`;

  const compositionVistar = `Vistar Practice
| S' n  D  P | M  g  R  S |
| S  g  M  P | n  S' -  - |

| n  D  P  M | g  R  S  g |
| M  P  M  g | R  S  -  - |`;

  const compositionEnding = `Concluding Phrase (Repeat 3 Times)
g M P | M g R | S

Finish on Sam: S`;

  const faqs = [
    {
      q: "Is Raag Bhimpalasi suitable for beginners?",
      a: "Raag Bhimpalasi is best learned after foundational ragas because it introduces expressive phrasing and the use of Komal Ga and Komal Ni."
    },
    {
      q: "Which notes are Komal?",
      a: "Komal Gandhar (g) and Komal Nishad (n)."
    },
    {
      q: "Which note is most important?",
      a: "Ma (Madhyam) is the Vadi, while Sa is the Samvadi."
    },
    {
      q: "Which flute should I use?",
      a: "Raag Bhimpalasi can be practiced on any properly tuned bansuri. A G Base bansuri is a popular choice for many adult learners."
    },
    {
      q: "What is the best time to perform Raag Bhimpalasi?",
      a: "Traditionally, it is performed during the afternoon, approximately 1 PM–4 PM."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-8 px-2 sm:px-0" itemScope itemType="https://schema.org/LearningResource">
      {/* Top Header Card */}
      <section className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-amber-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl relative overflow-hidden border border-amber-800/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 sm:space-y-5">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-amber-200/80 font-medium">
            <button onClick={() => onViewChange?.('learn_dashboard')} className="hover:text-amber-100 transition cursor-pointer">Learning Hub</button>
            <span>/</span>
            <button onClick={() => onViewChange?.('learn_raagas')} className="hover:text-amber-100 transition cursor-pointer">Raagas Guide</button>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[140px] sm:max-w-none">Raag Bhimpalasi</span>
          </nav>

          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
              <Sun className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300 shrink-0" />
              <span>Afternoon Raga • Kafi Thaat</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-amber-100 leading-snug sm:leading-tight" itemProp="name">
              Raag Bhimpalasi: Complete Guide, Notes, Aaroh, Avaroh &amp; Practice
            </h1>
            <p className="text-xs sm:text-base text-amber-200/90 max-w-2xl font-sans leading-relaxed">
              Master Raag Bhimpalasi on Indian Bamboo Flute (Bansuri). Complete guide with Swara audio playback, Pakad, Chalan, original Alankars, and the practice piece "Madhur Vela".
            </p>
          </div>

          {/* Published and Updated Dates */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] sm:text-xs text-amber-200/90 font-medium pt-2 border-t border-amber-800/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Published: <strong className="text-amber-100">August 5, 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Updated: <strong className="text-amber-100">August 5, 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>12 min read</span>
            </div>
          </div>

          {/* Quick Info Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="bg-black/30 rounded-xl p-2 sm:p-2.5 border border-amber-500/20">
              <span className="text-amber-300/80 text-[10px] sm:text-[11px] block uppercase font-bold">Thaat</span>
              <span className="font-bold text-white text-xs sm:text-sm">Kafi</span>
            </div>
            <div className="bg-black/30 rounded-xl p-2 sm:p-2.5 border border-amber-500/20">
              <span className="text-amber-300/80 text-[10px] sm:text-[11px] block uppercase font-bold">Jati</span>
              <span className="font-bold text-white text-xs sm:text-sm">Audav – Sampurna</span>
            </div>
            <div className="bg-black/30 rounded-xl p-2 sm:p-2.5 border border-amber-500/20">
              <span className="text-amber-300/80 text-[10px] sm:text-[11px] block uppercase font-bold">Vadi / Samvadi</span>
              <span className="font-bold text-white text-xs sm:text-sm">Ma (M) / Sa (S)</span>
            </div>
            <div className="bg-black/30 rounded-xl p-2 sm:p-2.5 border border-amber-500/20">
              <span className="text-amber-300/80 text-[10px] sm:text-[11px] block uppercase font-bold">Time</span>
              <span className="font-bold text-white text-xs sm:text-sm">Afternoon (1–4 PM)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <BookOpen className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Introduction to Raag Bhimpalasi
          </h2>
        </div>

        <div className="prose prose-amber max-w-none text-xs sm:text-base text-gray-700 leading-relaxed space-y-3 font-sans">
          <p>
            <strong>Raag Bhimpalasi</strong> is one of the most graceful and emotionally expressive ragas in Hindustani Classical Music. Belonging to the <strong>Kafi Thaat</strong>, it is admired for its peaceful, devotional, and introspective nature. The raga is frequently performed in vocal concerts, bansuri recitals, sitar performances, and other instrumental traditions.
          </p>
          <p>
            Raag Bhimpalasi derives much of its beauty from the expressive use of <strong>Komal Gandhar (g)</strong> and <strong>Komal Nishad (n)</strong>. Rather than relying on fast passages, the raga emphasizes smooth melodic movement, sustained notes, and subtle ornamentation.
          </p>
          <p>
            For bansuri players, Raag Bhimpalasi is an excellent choice for developing breath control, meend (glides), tone quality, and expressive phrasing. It is generally learned after students become comfortable with foundational ragas such as Bhoopali, Durga, Bilawal, Yaman, and Kafi.
          </p>
        </div>
      </section>

      {/* Basic Information Table */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Sliders className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Basic Information: Raag Bhimpalasi
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-amber-50/80 border-b border-amber-200/80 text-bamboo-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <th className="p-3 sm:p-4 rounded-tl-xl">Property</th>
                <th className="p-3 sm:p-4 rounded-tr-xl">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700 font-sans">
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Raga Name</td>
                <td className="p-3 sm:p-4">Bhimpalasi</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Thaat</td>
                <td className="p-3 sm:p-4">Kafi</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Jati</td>
                <td className="p-3 sm:p-4">Audav – Sampurna (5 notes ascending, 7 notes descending)</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Time of Performance</td>
                <td className="p-3 sm:p-4">Afternoon (approximately 1 PM – 4 PM)</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Vadi (Primary Note)</td>
                <td className="p-3 sm:p-4 font-semibold text-amber-900">Ma (Madhyam)</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Samvadi (Secondary Note)</td>
                <td className="p-3 sm:p-4 font-semibold text-amber-900">Sa (Shadja)</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Nature &amp; Temperament</td>
                <td className="p-3 sm:p-4">Peaceful, devotional, introspective</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Rasa (Emotional Flavor)</td>
                <td className="p-3 sm:p-4">Karuna (Pathos/Compassion), Bhakti (Devotion), Shringar (Romantic/Graceful)</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-bold text-bamboo-950">Difficulty Level</td>
                <td className="p-3 sm:p-4"><span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-200">Intermediate</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Swaras Used & Interactive Audio Player */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-amber-700 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
              Swaras Used &amp; Interactive Tone Player
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-sans">Click swara buttons below to listen to flute tone</span>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
          Raag Bhimpalasi uses <strong>Komal Gandhar (g)</strong> and <strong>Komal Nishad (n)</strong>. In ascent (Aaroh), Re and Dha are omitted (Audav Jati), while all seven notes are used in descent (Sampurna Jati).
        </p>

        {/* Swaras List Grid with Sound Trigger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
          {[
            { name: 'Sa (S)', key: 'S', type: 'Shuddha (Root)', komal: false },
            { name: 'Re (R)', key: 'R', type: 'Shuddha (Descent)', komal: false },
            { name: 'Ga (g)', key: 'g', type: 'Komal (Flat)', komal: true },
            { name: 'Ma (M)', key: 'M', type: 'Vadi (Most Prominent)', komal: false, vadi: true },
            { name: 'Pa (P)', key: 'P', type: 'Shuddha (Fifth)', komal: false },
            { name: 'Dha (D)', key: 'D', type: 'Shuddha (Descent)', komal: false },
            { name: 'Ni (n)', key: 'n', type: 'Komal (Flat)', komal: true },
          ].map((swara) => (
            <button
              key={swara.key}
              onClick={() => playSwaraTone(swara.key)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between cursor-pointer touch-manipulation min-h-[85px] ${
                activeSwara === swara.key
                  ? 'bg-amber-600 text-white border-amber-700 scale-95 shadow-md'
                  : swara.vadi
                  ? 'bg-amber-100/80 border-amber-300 text-amber-950 hover:bg-amber-200/80'
                  : swara.komal
                  ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                  : 'bg-white border-gray-200 text-bamboo-950 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-bold font-sans uppercase tracking-wider">{swara.name}</span>
              <span className="text-xl sm:text-2xl font-black font-mono my-1">{swara.key}</span>
              <span className="text-[10px] font-semibold opacity-80">{swara.type}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Aaroh, Avaroh, Pakad & Chalan Card */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Music className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Aaroh, Avaroh, Pakad &amp; Chalan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aaroh Card */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider">Aaroh (Ascending)</span>
              <button
                onClick={() => copyToClipboard("n. S g M P n S'", "aaroh")}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'aaroh' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Aaroh</span>
              </button>
            </div>
            <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-sm sm:text-lg font-bold text-bamboo-950 overflow-x-auto scrollbar-thin">
              n. S g M P n S'
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900/80 font-sans">
              Omits Re and Dha in ascent (Audav Jati). Begins from lower Komal Ni (n.).
            </p>
          </div>

          {/* Avaroh Card */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider">Avaroh (Descending)</span>
              <button
                onClick={() => copyToClipboard("S' n D P M g R S", "avaroh")}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'avaroh' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Avaroh</span>
              </button>
            </div>
            <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-sm sm:text-lg font-bold text-bamboo-950 overflow-x-auto scrollbar-thin">
              S' n D P M g R S
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900/80 font-sans">
              Includes all 7 notes in descent (Sampurna Jati).
            </p>
          </div>
        </div>

        {/* Pakad Card */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider">Pakad (Signature Catchphrase)</span>
            <button
              onClick={() => copyToClipboard("n. S g M | P M | g R S", "pakad")}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Pakad</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
            <p className="text-amber-950">n. S g M &nbsp;|&nbsp; P M &nbsp;|&nbsp; g R S</p>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Alternative Variation:</span>
              <p className="text-amber-900">S g M &nbsp;|&nbsp; P n &nbsp;|&nbsp; D P &nbsp;|&nbsp; M g R S</p>
            </div>
          </div>
        </div>

        {/* Chalan Card */}
        <div className="bg-bamboo-50/60 border border-bamboo-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-bamboo-950 uppercase tracking-wider">Chalan (Melodic Progression)</span>
            <button
              onClick={() => copyToClipboard("n. S g M | P n S' | n D P | M g | R S\nS g M | P M | g R S", "chalan")}
              className="text-xs text-bamboo-800 hover:text-bamboo-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-bamboo-100/60"
            >
              {copiedSection === 'chalan' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Chalan</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-bamboo-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-2 leading-relaxed overflow-x-auto scrollbar-thin">
            <p className="text-amber-950">n. S g M &nbsp;|&nbsp; P n S' &nbsp;|&nbsp; n D P &nbsp;|&nbsp; M g &nbsp;|&nbsp; R S</p>
            <p className="text-amber-900">S g M &nbsp;|&nbsp; P M &nbsp;|&nbsp; g R S</p>
          </div>
        </div>
      </section>

      {/* Important Characteristics */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Important Characteristics of Raag Bhimpalasi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700 font-sans">
          {[
            { title: 'Komal Swaras Used', desc: 'Uses Komal Gandhar (g) and Komal Nishad (n). All other swaras are Shuddha.' },
            { title: 'Vadi Note (Ma)', desc: 'Madhyam (Ma) is the Vadi swara and serves as the primary focal point of repose.' },
            { title: 'Samvadi Note (Sa)', desc: 'Shadja (Sa) is the Samvadi swara, anchoring phrases back to the root.' },
            { title: 'Role of Re & Dha', desc: 'Re and Dha are omitted in ascent (Aaroh) and mainly heard in descending phrases.' },
            { title: 'Asymmetric Jati', desc: 'Ascent is concise (Audav - 5 notes), while descent fully develops the raga (Sampurna - 7 notes).' },
            { title: 'Expressive Meend', desc: 'Smooth meend between Komal Ga and Ma enhances the emotional beauty.' },
            { title: 'Slow & Meditative', desc: 'Slow, expressive playing with sustained notes is far more effective than fast passages.' },
            { title: 'Afternoon Rasa', desc: 'Perfectly suited for peaceful afternoon practice (1 PM – 4 PM).' },
          ].map((item, idx) => (
            <div key={idx} className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-amber-950 text-xs sm:text-sm block">{item.title}</span>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mood and Emotion Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Heart className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Mood &amp; Emotional Expression
          </h2>
        </div>

        <div className="prose prose-amber max-w-none text-xs sm:text-base text-gray-700 leading-relaxed space-y-3 font-sans">
          <p>
            Raag Bhimpalasi beautifully expresses a rich spectrum of serene emotions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2">
            {[
              { title: 'Devotion (Bhakti)', icon: Heart },
              { title: 'Peace (Shanti)', icon: Compass },
              { title: 'Compassion (Karuna)', icon: Sparkles },
              { title: 'Love (Shringar)', icon: Heart },
              { title: 'Longing (Viraha)', icon: Moon },
              { title: 'Reflection (Chintan)', icon: Sun },
            ].map((emo, idx) => {
              const IconComp = emo.icon;
              return (
                <div key={idx} className="bg-amber-100/60 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
                  <IconComp className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{emo.title}</span>
                </div>
              );
            })}
          </div>
          <p>
            Its calm, meditative nature makes it one of the most admired and popular afternoon ragas across Hindustani music.
          </p>
        </div>
      </section>

      {/* Why Learn Raag Bhimpalasi */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Zap className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Why Learn Raag Bhimpalasi?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-sans">
          {[
            'Develops expressive bansuri playing & tone quality.',
            'Improves meend (glides) and breath control.',
            'Strengthens note accuracy across octaves.',
            'Builds confidence in using Komal swaras (g, n).',
            'Encourages smooth melodic phrasing and sustained notes.',
            'Prepares students for more advanced ragas.'
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-bamboo-50/50 p-3 rounded-xl border border-bamboo-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-bamboo-950 font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FluteSangam Original Alankars */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Repeat className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            FluteSangam Original Alankars for Raag Bhimpalasi
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
          Practice these original Alankar patterns customized specifically for the swara set of Raag Bhimpalasi. They reinforce finger agility and pitch clarity for Komal Ga and Komal Ni.
        </p>

        {/* Alankar 1 */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">FluteSangam Original Alankar 1 (Pairs)</span>
            <button
              onClick={() => copyToClipboard("Ascending: S g | g M | M P | P n | n S'\nDescending: S' n | n D | D P | P M | M g | g R | R S", "alankar1")}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
            >
              {copiedSection === 'alankar1' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Alankar 1</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
            <div>
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Ascending:</span>
              <p className="text-amber-950">S g &nbsp;|&nbsp; g M &nbsp;|&nbsp; M P &nbsp;|&nbsp; P n &nbsp;|&nbsp; n S'</p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Descending:</span>
              <p className="text-amber-900">S' n &nbsp;|&nbsp; n D &nbsp;|&nbsp; D P &nbsp;|&nbsp; P M &nbsp;|&nbsp; M g &nbsp;|&nbsp; g R &nbsp;|&nbsp; R S</p>
            </div>
          </div>
        </div>

        {/* Alankar 2 */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">FluteSangam Original Alankar 2 (Triplets)</span>
            <button
              onClick={() => copyToClipboard("Ascending: S g M | g M P | M P n | P n S'\nDescending: S' n D | n D P | D P M | P M g | M g R | g R S", "alankar2")}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
            >
              {copiedSection === 'alankar2' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Alankar 2</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
            <div>
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Ascending:</span>
              <p className="text-amber-950">S g M &nbsp;|&nbsp; g M P &nbsp;|&nbsp; M P n &nbsp;|&nbsp; P n S'</p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Descending:</span>
              <p className="text-amber-900">S' n D &nbsp;|&nbsp; n D P &nbsp;|&nbsp; D P M &nbsp;|&nbsp; P M g &nbsp;|&nbsp; M g R &nbsp;|&nbsp; g R S</p>
            </div>
          </div>
        </div>

        {/* Alankar 3 */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">FluteSangam Original Alankar 3 (Quadruplets - Four Notes)</span>
            <button
              onClick={() => copyToClipboard("Ascending: S g M g | g M P M | M P n P | P n S' n\nDescending: S' n D n | n D P D | D P M P | P M g M | g R S", "alankar3")}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
            >
              {copiedSection === 'alankar3' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>Copy Alankar 3</span>
            </button>
          </div>
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-amber-200 font-mono text-xs sm:text-sm font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin">
            <div>
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Ascending:</span>
              <p className="text-amber-950">S g M g &nbsp;|&nbsp; g M P M &nbsp;|&nbsp; M P n P &nbsp;|&nbsp; P n S' n</p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-sans text-gray-500 block mb-0.5">Descending:</span>
              <p className="text-amber-900">S' n D n &nbsp;|&nbsp; n D P D &nbsp;|&nbsp; D P M P &nbsp;|&nbsp; P M g M &nbsp;|&nbsp; g R S</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes & Performance Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Common Mistakes */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-red-100 space-y-3">
          <div className="flex items-center gap-2 border-b border-red-100 pb-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold font-display text-bamboo-950">
              Common Mistakes to Avoid
            </h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-sans">
            <li className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
              <span className="text-red-600 font-bold">❌</span>
              <span>Playing Shuddha Ga instead of Komal Ga.</span>
            </li>
            <li className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
              <span className="text-red-600 font-bold">❌</span>
              <span>Playing Shuddha Ni instead of Komal Ni.</span>
            </li>
            <li className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
              <span className="text-red-600 font-bold">❌</span>
              <span>Playing too fast before mastering the characteristic phrases.</span>
            </li>
            <li className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
              <span className="text-red-600 font-bold">❌</span>
              <span>Giving equal importance to every note instead of emphasizing Ma.</span>
            </li>
            <li className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
              <span className="text-red-600 font-bold">❌</span>
              <span>Ignoring smooth meend between important notes.</span>
            </li>
          </ul>
        </section>

        {/* Tips for Performance */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 space-y-3">
          <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold font-display text-bamboo-950">
              Tips for Better Performance
            </h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-sans">
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 font-bold">💡</span>
              <span>Practice with a tanpura drone.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 font-bold">💡</span>
              <span>Sustain Ma with a steady, clear tone.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 font-bold">💡</span>
              <span>Focus on smooth transitions between notes.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 font-bold">💡</span>
              <span>Play slowly before increasing speed.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 font-bold">💡</span>
              <span>Listen carefully to your pitch while playing Komal Ga and Komal Ni.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-600 font-bold">💡</span>
              <span>Prioritize expression over technical speed.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* FluteSangam Original Practice Piece: Madhur Vela */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6" id="practice-composition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full mb-1.5 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Original Practice Piece</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-display text-bamboo-950 leading-tight">
              Madhur Vela (Sweet Afternoon)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Raag: Bhimpalasi • Taal: Teentaal (16 Beats) • Tempo: Madhya Laya
            </p>
          </div>

          {/* Metronome Tool */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center shrink-0 w-full sm:w-auto sm:min-w-[220px]">
            <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Teentaal Metronome Guide</span>
            </div>

            <div className="flex items-center gap-4 my-1.5 sm:my-2">
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-9 h-9 bg-white border border-amber-200 rounded-lg text-sm font-bold active:scale-95 hover:bg-amber-100 flex items-center justify-center cursor-pointer touch-manipulation shadow-xs"
              >
                -
              </button>
              <span className="font-mono text-base sm:text-lg font-bold text-bamboo-950 min-w-[70px] text-center">{bpm} BPM</span>
              <button
                onClick={() => setBpm(Math.min(140, bpm + 5))}
                className="w-9 h-9 bg-white border border-amber-200 rounded-lg text-sm font-bold active:scale-95 hover:bg-amber-100 flex items-center justify-center cursor-pointer touch-manipulation shadow-xs"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[44px] active:scale-95 ${
                isPlayingComposition ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-amber-800 text-white hover:bg-amber-900'
              }`}
            >
              {isPlayingComposition ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0" />}
              <span>{isPlayingComposition ? `Beat ${currentBeat} / 16` : 'Start Metronome'}</span>
            </button>
          </div>
        </div>

        {/* Composition Notation Display */}
        <div className="space-y-4 sm:space-y-6">
          {/* Aalap */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
                Aalap (Free Rhythm)
              </h3>
              <button
                onClick={() => copyToClipboard(compositionAalap, 'aalap')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'aalap' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Aalap</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>S  g  M  |  M  P</p>
              <p>n  S'  |  S'  n  D</p>
              <p>P  M  |  g  R  S</p>
            </div>
          </div>

          {/* Mukhda */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
                Mukhda (Teentaal - 16 Beats)
              </h3>
              <button
                onClick={() => copyToClipboard(compositionMukhda, 'mukhda')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'mukhda' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Mukhda</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| n  S  g  M | P  M  g  R |</p>
              <p>| S  -  -  - | S  g  M  - |</p>
            </div>
          </div>

          {/* Antara */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
                Antara
              </h3>
              <button
                onClick={() => copyToClipboard(compositionAntara, 'antara')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'antara' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Antara</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| M  P  n  S' | n  D  P  M |</p>
              <p>| g  R  S  - | -  -  -  - |</p>
            </div>
          </div>

          {/* Vistar Practice */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider">
                Vistar Practice
              </h3>
              <button
                onClick={() => copyToClipboard(compositionVistar, 'vistar')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer touch-manipulation min-h-[36px] active:scale-95 px-2 py-1 rounded-lg bg-amber-100/60"
              >
                {copiedSection === 'vistar' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>Copy Vistar</span>
              </button>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/60 font-mono text-xs sm:text-base font-bold text-bamboo-950 space-y-2 overflow-x-auto scrollbar-thin leading-relaxed">
              <p>| S' n  D  P | M  g  R  S |</p>
              <p>| S  g  M  P | n  S' -  - |</p>
              <br />
              <p>| n  D  P  M | g  R  S  g |</p>
              <p>| M  P  M  g | R  S  -  - |</p>
            </div>
          </div>

          {/* Concluding Phrase */}
          <div className="bg-bamboo-50/60 border border-bamboo-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider">
                Concluding Phrase (Repeat 3 Times)
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
              <p className="text-amber-900">g M P &nbsp;|&nbsp; M g R &nbsp;|&nbsp; S</p>
              <p className="text-[11px] sm:text-xs font-sans text-gray-500 font-semibold uppercase pt-2">Finish on Sam:</p>
              <p className="text-amber-950 font-black text-lg">S</p>
            </div>
          </div>
        </div>

        {/* How to Practice Steps */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>How to Practice "Madhur Vela"</span>
          </h3>

          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 font-sans">
            {[
              'Practice long notes on Sa, g, M, P, n, S\'.',
              'Repeat the Aaroh and Avaroh 10–15 times.',
              'Practice the Pakad five times until comfortable.',
              'Play each Alankar slowly with tanpura.',
              'Practice the Aalap in free rhythm without tempo.',
              'Learn the Mukhda with metronome.',
              'Continue with the Antara.',
              'Practice the Vistar section.',
              'End with the Concluding Phrase (Tihai).',
              'Start around 50 BPM and gradually increase to 80 BPM.'
            ].map((step, idx) => (
              <li key={idx} className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200/60 flex items-start gap-2">
                <span className="w-5 h-5 bg-amber-100 text-amber-900 font-bold rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Suggested Daily Practice Schedule */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
              Suggested Daily Practice Schedule
            </h2>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer touch-manipulation min-h-[36px]"
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{isTimerRunning ? `Timer: ${formatTimer(timerSeconds)}` : 'Start 45 Min Practice'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead>
              <tr className="bg-amber-50/80 border-b border-amber-200/80 text-bamboo-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <th className="p-3 sm:p-4 rounded-tl-xl">Exercise</th>
                <th className="p-3 sm:p-4 rounded-tr-xl">Recommended Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700 font-sans">
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-semibold text-bamboo-950">Long Notes (Sa, g, M, P, n, S')</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-amber-900">5 minutes</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-semibold text-bamboo-950">Aaroh–Avaroh Practice</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-amber-900">5 minutes</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-semibold text-bamboo-950">Pakad Drills</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-amber-900">5 minutes</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-semibold text-bamboo-950">FluteSangam Original Alankars</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-amber-900">10 minutes</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-semibold text-bamboo-950">Original Learning Piece ("Madhur Vela")</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-amber-900">10 minutes</td>
              </tr>
              <tr className="hover:bg-amber-50/30 transition">
                <td className="p-3 sm:p-4 font-semibold text-bamboo-950">Free Improvisation &amp; Meend Practice</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-amber-900">10 minutes</td>
              </tr>
              <tr className="bg-amber-100/50 font-bold text-bamboo-950">
                <td className="p-3 sm:p-4">Total Daily Routine</td>
                <td className="p-3 sm:p-4 font-mono text-amber-950">45 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 font-sans">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-gray-200/80 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-base text-bamboo-950 flex items-center justify-between gap-3 bg-gray-50/50 hover:bg-amber-50/50 cursor-pointer touch-manipulation min-h-[48px]"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-amber-700 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Ragas Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Compass className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
            Explore Related Ragas
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'Raag Brindavani Sarang', view: 'raga_brindavani_sarang' as AppView },
            { name: 'Raag Kafi', view: 'raga_kafi' as AppView },
            { name: 'Raag Bageshree', view: 'raga_bageshree' as AppView },
            { name: 'Raag Desh', view: 'raga_desh' as AppView },
            { name: 'Raag Yaman', view: 'raga_yaman' as AppView },
          ].map((raga, idx) => (
            <button
              key={idx}
              onClick={() => onViewChange?.(raga.view)}
              className="p-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/80 text-amber-950 font-bold text-xs sm:text-sm text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer touch-manipulation min-h-[70px] shadow-2xs hover:scale-105"
            >
              <span>{raga.name}</span>
              <span className="text-[10px] text-amber-800 font-normal flex items-center gap-0.5">
                <span>View Guide</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* About Author Section - Placed Below */}
      <AboutAuthorSection onViewChange={onViewChange} />

      {/* Footer Copyright Notice */}
      <footer className="text-center text-[11px] sm:text-xs text-gray-500 font-sans p-4 space-y-1">
        <p className="font-semibold text-bamboo-900">© FluteSangam Original Content</p>
        <p className="max-w-2xl mx-auto leading-relaxed">
          This article, practice routines, alankars, and the "Madhur Vela" learning piece have been created exclusively for FluteSangam as original educational material. The learning piece is designed to help students practice the note set and characteristic movements of Raag Bhimpalasi. It is an original educational exercise and is not presented as a traditional bandish or classical composition.
        </p>
      </footer>
    </div>
  );
}
