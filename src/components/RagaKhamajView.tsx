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

interface RagaKhamajViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaKhamajView({ onViewChange }: RagaKhamajViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(65);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for G Base / C Scale Swaras (Hz)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,   // Sa
    'R': 293.66,   // Shuddha Re
    'G': 329.63,   // Shuddha Ga
    'M': 349.23,   // Shuddha Ma
    'P': 392.00,   // Pa
    'D': 440.00,   // Shuddha Dha
    'n': 466.16,   // Komal Ni
    'N': 493.88,   // Shuddha Ni
    'S\'': 523.25,  // Upper Sa
    'R\'': 587.33,  // Upper Re
    'N.': 246.94,  // Lower Shuddha Ni
    'n.': 233.08,  // Lower Komal Ni
    'D.': 220.00,  // Lower Shuddha Dha
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
      
      // Warm flute timbre using triangle wave + lowpass filter
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

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Teentaal Composition Playback Loop for "Madhur Milan"
  const compositionNotes = [
    // Mukhda (16 beats)
    'S', 'G', 'M', 'P', 'D', 'N', 'S\'', 'S\'',
    'S\'', 'n', 'D', 'P', 'M', 'G', 'R', 'S',
    // Antara (16 beats)
    'G', 'M', 'P', 'D', 'N', 'S\'', 'n', 'D',
    'P', 'M', 'G', 'R', 'S', 'S', 'S', 'S'
  ];

  useEffect(() => {
    let interval: any = null;
    if (isPlayingComposition) {
      const beatDurationMs = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentBeat(prevBeat => {
          const nextBeat = (prevBeat + 1) % 16;
          const noteToPlay = compositionNotes[nextBeat % compositionNotes.length];
          playSwaraTone(noteToPlay, 0.4);
          try {
            const ctx = getAudioContext();
            playTakMetronomeClick(ctx, nextBeat === 0);
          } catch (e) {}
          return nextBeat;
        });
      }, beatDurationMs);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingComposition, bpm]);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 text-amber-950 font-sans" itemScope itemType="https://schema.org/Article">
      {/* Article Header & SEO Title */}
      <header className="mb-10 text-center sm:text-left border-b border-amber-200/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-4">
          <Music className="w-3.5 h-3.5 text-amber-700" />
          <span>Hindustani Classical Flute Masterclass</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-bamboo-950 tracking-tight leading-tight mb-4" itemProp="headline">
          Raag Khamaj: Complete Guide, Notes, Aaroh, Avaroh &amp; Practice
        </h1>

        <p className="text-base sm:text-lg text-amber-900/90 leading-relaxed max-w-3xl mb-6 font-normal" itemProp="description">
          Master the graceful, romantic, and playful Raag Khamaj on Indian Bamboo Flute (Bansuri). Explore step-by-step swara grammar, the contrast between Shuddha and Komal Nishad, Pakad, Chalan, original Alankars, and the practice piece <em>"Madhur Milan"</em> in Teentaal.
        </p>

        {/* Article Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-amber-900/95 text-amber-100 p-4 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Published: <strong className="text-amber-100" itemProp="datePublished" content="2026-08-07">August 7, 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Updated: <strong className="text-amber-100" itemProp="dateModified" content="2026-08-07">August 7, 2026</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>12 min read</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Verified Flute Sangam Lesson</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(window.location.href, 'share')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-bold transition cursor-pointer"
              title="Share Lesson"
            >
              {copiedSection === 'share' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'share' ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-bold transition cursor-pointer hidden sm:inline-flex"
              title="Print Lesson Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Practice Timer Toolbar */}
        <div className="mt-4 bg-amber-50/90 border border-amber-200/80 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200/80 rounded-xl text-amber-900">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Recommended Session</div>
              <div className="text-sm font-black text-bamboo-950">45-Minute Daily Practice Routine</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-lg font-black font-mono text-amber-950 bg-white px-3.5 py-1 rounded-xl border border-amber-300/80 shadow-inner">
              {formatTimer(timerSeconds)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isTimerRunning 
                  ? 'bg-amber-800 text-amber-100 hover:bg-amber-900' 
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isTimerRunning ? 'Pause Timer' : 'Start Session'}</span>
            </button>
            <button
              onClick={() => { setIsTimerRunning(false); setTimerSeconds(45 * 60); }}
              className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="space-y-12">
        {/* Section 1: Introduction */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-amber-900 mb-2">
            <div className="p-2.5 bg-amber-100 rounded-2xl">
              <BookOpen className="w-6 h-6 text-amber-800" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-bamboo-950 tracking-tight">Introduction</h2>
          </div>

          <p className="text-amber-900/90 leading-relaxed text-base sm:text-lg">
            <strong>Raag Khamaj</strong> is a graceful and expressive raga in Hindustani Classical Music. It belongs to the <strong>Khamaj Thaat</strong> and is known for its romantic, devotional, and playful character. The raga is particularly well suited to melodic instruments such as the <strong>bansuri</strong> because its phrases can be shaped beautifully through <em>meend</em>, gentle ornamentation, and controlled breath.
          </p>

          <p className="text-amber-900/90 leading-relaxed text-base sm:text-lg">
            Khamaj is also an important raga for students moving from beginner-level ragas toward more expressive intermediate ragas. It introduces the characteristic use of <strong>Komal Nishad (n)</strong> while retaining <strong>Shuddha Nishad (N)</strong> in ascending movement in the commonly taught form.
          </p>

          <p className="text-amber-900/90 leading-relaxed text-base sm:text-lg">
            For a flute player, learning Khamaj helps develop the ability to distinguish between similar swaras and to understand how a raga's identity comes from its phrases and note treatment, rather than simply from its scale.
          </p>
        </section>

        {/* Section 2: Basic Information Grid */}
        <section className="bg-gradient-to-br from-amber-900 to-amber-950 text-amber-50 p-6 sm:p-8 rounded-3xl shadow-md border border-amber-800/80">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-800/80 rounded-xl">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">Basic Information</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Raga Name</div>
              <div className="text-lg font-black text-amber-100">Khamaj</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Thaat</div>
              <div className="text-lg font-black text-amber-100">Khamaj</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Jati</div>
              <div className="text-lg font-black text-amber-100">Shadav – Sampurna</div>
              <div className="text-[11px] text-amber-300/70 mt-0.5">6 notes up, 7 down</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Time</div>
              <div className="text-lg font-black text-amber-100">2nd Quarter Night</div>
              <div className="text-[11px] text-amber-300/70 mt-0.5">9 PM – 12 AM</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Vadi Swara</div>
              <div className="text-lg font-black text-amber-100">Ga (Gandhar)</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Samvadi Swara</div>
              <div className="text-lg font-black text-amber-100">Ni (Nishad)</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Nature / Rasa</div>
              <div className="text-lg font-black text-amber-100">Shringar &amp; Bhakti</div>
              <div className="text-[11px] text-amber-300/70 mt-0.5">Romantic, Devotional</div>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/60 p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-1">Difficulty</div>
              <div className="text-lg font-black text-amber-100">Intermediate</div>
            </div>
          </div>
        </section>

        {/* Section 3: Swaras Used & Interactive Soundboard */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Swaras Used</h2>
                <p className="text-xs text-amber-800 font-medium">Click any swara button to hear its pitch on G Base Bansuri</p>
              </div>
            </div>
          </div>

          <p className="text-amber-900/90 leading-relaxed text-base">
            Raag Khamaj uses all seven swaras: <strong>Sa (S), Re (R), Ga (G), Ma (M), Pa (P), Dha (D), Komal Ni (n)</strong>, and <strong>Shuddha Ni (N)</strong>.
          </p>

          <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-sm text-amber-950 space-y-2">
            <p className="font-semibold text-amber-950">
              💡 <strong>Key Distinction:</strong> Shuddha Ni (N) is commonly used in ascending phrases (Aaroh), while Komal Ni (n) is characteristic of the descent (Avaroh).
            </p>
            <p className="text-xs text-amber-900/90">
              This distinction is one of the important features that students should learn carefully when practicing flute.
            </p>
          </div>

          {/* Interactive Swara Keyboard */}
          <div className="bg-amber-950 text-amber-100 p-6 rounded-2xl shadow-inner space-y-4">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider text-center sm:text-left">
              Interactive Flute Swara Soundboard (Click to Play Note)
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {[
                { name: 'Sa', code: 'S', desc: 'Shuddha' },
                { name: 'Re', code: 'R', desc: 'Shuddha' },
                { name: 'Ga', code: 'G', desc: 'Shuddha (Vadi)' },
                { name: 'Ma', code: 'M', desc: 'Shuddha' },
                { name: 'Pa', code: 'P', desc: 'Shuddha' },
                { name: 'Dha', code: 'D', desc: 'Shuddha' },
                { name: 'Ni', code: 'n', desc: 'Komal (n)' },
                { name: 'Ni', code: 'N', desc: 'Shuddha (N)' },
              ].map((swara) => (
                <button
                  key={swara.code + swara.name}
                  onClick={() => playSwaraTone(swara.code, 0.9)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    activeSwara === swara.code
                      ? 'bg-amber-400 text-amber-950 border-amber-300 scale-105 shadow-md font-black'
                      : 'bg-amber-900/80 hover:bg-amber-800 border-amber-800 text-amber-100'
                  }`}
                >
                  <span className="text-lg font-black">{swara.code}</span>
                  <span className="text-[10px] text-amber-300/80 font-medium">{swara.name}</span>
                  <span className="text-[9px] text-amber-200/60">{swara.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Aaroh, Avaroh, Pakad & Chalan */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Aaroh, Avaroh &amp; Pakad</h2>
              <p className="text-xs text-amber-800">The essential melodic framework of Raag Khamaj</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aaroh Card */}
            <div className="bg-amber-50/90 border border-amber-200/90 p-5 rounded-2xl relative space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">Aaroh (Ascending)</span>
                <button
                  onClick={() => handleCopy("S G M P D N S'", 'aaroh')}
                  className="text-amber-800 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-200/60 transition cursor-pointer"
                  title="Copy Aaroh"
                >
                  {copiedSection === 'aaroh' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-black text-bamboo-950 font-mono tracking-wide pt-1">
                S G M P D N S'
              </div>
              <p className="text-xs text-amber-900/80">
                Uses Shuddha Nishad (N) in ascending movement. Sa to Ga leap is common.
              </p>
            </div>

            {/* Avaroh Card */}
            <div className="bg-amber-50/90 border border-amber-200/90 p-5 rounded-2xl relative space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">Avaroh (Descending)</span>
                <button
                  onClick={() => handleCopy("S' n D P M G R S", 'avaroh')}
                  className="text-amber-800 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-200/60 transition cursor-pointer"
                  title="Copy Avaroh"
                >
                  {copiedSection === 'avaroh' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-black text-bamboo-950 font-mono tracking-wide pt-1">
                S' n D P M G R S
              </div>
              <p className="text-xs text-amber-900/80">
                Features Komal Nishad (n) in full descending movement.
              </p>
            </div>
          </div>

          {/* Pakad Section */}
          <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 border border-amber-300/80 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-black text-bamboo-950">Pakad (Catch Phrase)</h3>
              </div>
              <button
                onClick={() => handleCopy("G M P D M G | R S | n D P | M G R S", 'pakad')}
                className="text-xs font-bold text-amber-900 hover:text-bamboo-950 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs"
              >
                {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy Phrase'}</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/80 font-mono text-base sm:text-lg font-bold text-amber-950 space-y-2">
              <p className="text-amber-900">G M P D M G</p>
              <p className="text-amber-900">R S</p>
              <p className="text-amber-900">n D P</p>
              <p className="text-amber-900">M G R S</p>
            </div>

            <div className="bg-amber-200/50 p-3.5 rounded-xl border border-amber-300/60 text-xs text-amber-950 space-y-1">
              <p className="font-bold">Another Useful Phrase:</p>
              <p className="font-mono font-bold text-sm text-bamboo-950">G M P  |  D N D P  |  M G  |  R S</p>
              <p className="text-[11px] text-amber-900/90 pt-1">
                <em>Note:</em> Practice these phrases slowly rather than treating them simply as scale exercises.
              </p>
            </div>
          </div>

          {/* Chalan Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-bamboo-950 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-700" />
              <span>Chalan (Key Melodic Progression)</span>
            </h3>

            <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl space-y-3 font-mono text-sm sm:text-base font-bold text-amber-950">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] uppercase font-sans text-amber-700 block mb-1">Ascending &amp; Upper Expansion</span>
                  S G M P <br />
                  D N S'
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] uppercase font-sans text-amber-700 block mb-1">Descending &amp; Return</span>
                  S' n D P <br />
                  M G R S
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] uppercase font-sans text-amber-700 block mb-1">Mid-Register Swara Glide</span>
                  G M P <br />
                  D N D P
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] uppercase font-sans text-amber-700 block mb-1">Resolution</span>
                  M G <br />
                  R S
                </div>
              </div>

              <div className="bg-amber-100/70 p-3 rounded-xl text-xs font-sans text-amber-900 mt-2">
                <strong>Expressive Movement Practice:</strong><br />
                <span className="font-mono text-sm font-bold text-bamboo-950">G M P D  |  N D P  |  M G  |  R S  |  n D P  |  M G R S</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Important Characteristics */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Important Characteristics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { title: "Parent Thaat", text: "Khamaj belongs to the Khamaj Thaat, which is the foundational scale for romantic and light-classical genres." },
              { title: "Dual Nishad Grammar", text: "Both forms of Nishad have an important role in its commonly taught grammar: Shuddha Ni in ascent, Komal Ni in descent." },
              { title: "Shuddha Ni in Ascent", text: "Shuddha Ni (N) is commonly heard in ascending movement when moving towards upper Sa (S')." },
              { title: "Komal Ni in Descent", text: "Komal Ni (n) is characteristic of descending movement, giving Khamaj its signature sweet, romantic color." },
              { title: "Emphasis on Ga and Ni", text: "Ga (Gandhar) and Ni (Nishad) are traditionally given maximum importance (Vadi and Samvadi)." },
              { title: "Melodic Ornamentation", text: "Graceful melodic phrases are far more important than simply running through the scale mechanically." },
              { title: "Meend & Expressive Glides", text: "Meend and gentle ornamentation (Kanam) add considerable beauty to bansuri renditions." },
              { title: "Distinct Identity", text: "The raga sounds very different from a plain major-scale exercise when its characteristic phrases are properly developed." },
            ].map((item, idx) => (
              <div key={idx} className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl space-y-1">
                <div className="font-bold text-bamboo-950 text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{item.title}</span>
                </div>
                <p className="text-amber-900/90 text-xs sm:text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Mood, Emotion & Why Learn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood & Emotion */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Mood &amp; Emotion</h2>
            </div>

            <p className="text-sm text-amber-900/90 leading-relaxed">
              Raag Khamaj has a warm, expressive, and captivating character. It conveys feelings of:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                'Love & Sringara',
                'Romance',
                'Devotion (Bhakti)',
                'Joy & Celebration',
                'Playfulness',
                'Tenderness & Grace'
              ].map((mood, idx) => (
                <div key={idx} className="bg-amber-50 border border-amber-200/70 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{mood}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-amber-900/80 pt-2 leading-relaxed">
              Its flexible emotional character is one reason Khamaj has remained immensely popular in both classical concerts and semi-classical forms like Thumri, Dadra, and Ghazal.
            </p>
          </section>

          {/* Why Learn Raag Khamaj? */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Why Learn Raag Khamaj?</h2>
            </div>

            <p className="text-sm text-amber-900/90 leading-relaxed">
              Khamaj is an excellent next step after learning basic ragas like Bhoopali, Durga, or Yaman. It helps a flute player:
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
              {[
                "Understand the distinct usage of both Shuddha and Komal Nishad.",
                "Improve pitch accuracy and finger precision on the bansuri.",
                "Develop smooth meend (slurs) between Ga, Ma, Pa, and Dha.",
                "Practice expressive phrasing and emotional storytelling.",
                "Learn to distinguish true raga grammar from simple Western scales.",
                "Prepare your breath control and embouchure for complex classical compositions."
              ].map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Section 7: Practice Routine & Original Alankars */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Practice Routine &amp; Alankars</h2>
              <p className="text-xs text-amber-800">Sequential exercises designed for flute blowing and finger dexterity</p>
            </div>
          </div>

          {/* Long Notes Practice */}
          <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-bamboo-950 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-700" />
              <span>1. Long Notes Practice (Swara Sadhana)</span>
            </h3>
            <p className="text-xs text-amber-900">
              Practice the main swaras individually: hold each note for <strong>8–10 seconds</strong> with steady air.
            </p>
            <div className="bg-white p-3 rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-950 text-base tracking-widest">
              S — G — M — P — D — N — S'
            </div>
            <p className="text-xs text-amber-900">
              Then practice the characteristic Komal Ni:
            </p>
            <div className="bg-white p-3 rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-950 text-base tracking-widest">
              n (Komal Nishad)
            </div>
            <p className="text-[11px] text-amber-800 italic">
              Listen carefully to the pitch before moving to the next note.
            </p>
          </div>

          {/* Aaroh-Avaroh Practice */}
          <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl space-y-2">
            <h3 className="text-base font-bold text-bamboo-950">2. Aaroh–Avaroh Scale Practice</h3>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 font-mono font-bold text-amber-950 text-sm space-y-1">
              <div>Aaroh: S G M P D N S'</div>
              <div>Avaroh: S' n D P M G R S</div>
            </div>
            <p className="text-xs text-amber-900">
              Repeat slowly <strong>10–15 times</strong>. Once the notes are comfortable, practice the movement smoothly without stopping between swaras.
            </p>
          </div>

          {/* FluteSangam Original Alankars */}
          <div className="space-y-6 pt-2">
            <div className="border-b border-amber-200 pb-2">
              <h3 className="text-xl font-black text-bamboo-950">FluteSangam Original Alankars</h3>
              <p className="text-xs text-amber-800">Tailored finger exercises formatted for Raag Khamaj swara rules</p>
            </div>

            {/* Alankar 1 */}
            <div className="bg-amber-900 text-amber-100 p-5 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-800/90 px-2.5 py-1 rounded-lg">FluteSangam Original Alankar 1</span>
                <button
                  onClick={() => handleCopy("Ascending:\nS G | G M | M P | P D | D N | N S'\n\nDescending:\nS' n | n D | D P | P M | M G | G R | R S", 'alankar1')}
                  className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-800 transition cursor-pointer"
                  title="Copy Alankar 1"
                >
                  {copiedSection === 'alankar1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="font-mono text-sm space-y-2 pt-1">
                <div>
                  <span className="text-xs text-amber-300 font-sans block mb-0.5">Ascending:</span>
                  <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 font-bold tracking-wider">
                    S G | G M | M P | P D | D N | N S'
                  </div>
                </div>
                <div>
                  <span className="text-xs text-amber-300 font-sans block mb-0.5">Descending:</span>
                  <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 font-bold tracking-wider">
                    S' n | n D | D P | P M | M G | G R | R S
                  </div>
                </div>
              </div>
            </div>

            {/* Alankar 2 */}
            <div className="bg-amber-900 text-amber-100 p-5 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-800/90 px-2.5 py-1 rounded-lg">FluteSangam Original Alankar 2</span>
                <button
                  onClick={() => handleCopy("Ascending:\nS G M | G M P | M P D | P D N | D N S'\n\nDescending:\nS' n D | n D P | D P M | P M G | M G R | G R S", 'alankar2')}
                  className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-800 transition cursor-pointer"
                  title="Copy Alankar 2"
                >
                  {copiedSection === 'alankar2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="font-mono text-sm space-y-2 pt-1">
                <div>
                  <span className="text-xs text-amber-300 font-sans block mb-0.5">Ascending:</span>
                  <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 font-bold tracking-wider">
                    S G M | G M P | M P D | P D N | D N S'
                  </div>
                </div>
                <div>
                  <span className="text-xs text-amber-300 font-sans block mb-0.5">Descending:</span>
                  <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 font-bold tracking-wider">
                    S' n D | n D P | D P M | P M G | M G R | G R S
                  </div>
                </div>
              </div>
            </div>

            {/* Alankar 3 */}
            <div className="bg-amber-900 text-amber-100 p-5 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-800/90 px-2.5 py-1 rounded-lg">FluteSangam Original Alankar 3</span>
                <button
                  onClick={() => handleCopy("Ascending:\nS G M G | G M P M | M P D P | P D N D | D N S' N\n\nDescending:\nS' n D n | n D P D | D P M P | P M G M | M G R G | R S", 'alankar3')}
                  className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-800 transition cursor-pointer"
                  title="Copy Alankar 3"
                >
                  {copiedSection === 'alankar3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="font-mono text-sm space-y-2 pt-1">
                <div>
                  <span className="text-xs text-amber-300 font-sans block mb-0.5">Ascending:</span>
                  <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 font-bold tracking-wider">
                    S G M G | G M P M | M P D P | P D N D | D N S' N
                  </div>
                </div>
                <div>
                  <span className="text-xs text-amber-300 font-sans block mb-0.5">Descending:</span>
                  <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 font-bold tracking-wider">
                    S' n D n | n D P D | D P M P | P M G M | M G R G | R S
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Common Mistakes & Performance Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Common Mistakes */}
          <section className="bg-rose-50/90 border border-rose-200 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-200/80 text-rose-900 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-rose-950 tracking-tight">Common Mistakes</h2>
            </div>

            <p className="text-xs text-rose-900">Avoid these beginner pitfalls when practicing Raag Khamaj on flute:</p>

            <ul className="space-y-3 text-xs sm:text-sm text-rose-950">
              {[
                "Playing only Shuddha Ni throughout the raga.",
                "Playing only Komal Ni throughout the raga.",
                "Treating Khamaj as a simple Western major scale without raga grammar.",
                "Playing too quickly without understanding the characteristic phrases.",
                "Using excessive ornamentation before developing accurate swara placement.",
                "Ignoring the importance of descending phrases where Komal Ni shines."
              ].map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white/80 p-3 rounded-xl border border-rose-200/80">
                  <span className="text-rose-600 font-bold shrink-0">❌</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tips for Better Performance */}
          <section className="bg-emerald-50/90 border border-emerald-200 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-200/80 text-emerald-900 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950 tracking-tight">Tips for Performance</h2>
            </div>

            <p className="text-xs text-emerald-900">Pro guidance for elevating your Khamaj bansuri practice:</p>

            <ul className="space-y-3 text-xs sm:text-sm text-emerald-950">
              {[
                "Practice with a tanpura drone tuned to Sa-Pa.",
                "Pay particular attention to the pitch difference between Shuddha Ni (N) and Komal Ni (n).",
                "Practice the descent (Avaroh) slowly to get the Komal Ni placement precise.",
                "Develop a smooth transition between Ga, Ma, and Pa.",
                "Use gentle meend (slurs) rather than forcing every note with heavy articulation.",
                "Listen to your pitch carefully using a tuner app or tanpura.",
                "Increase speed only after the phrases sound completely natural and expressive."
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white/80 p-3 rounded-xl border border-emerald-200/80">
                  <span className="text-emerald-600 font-bold shrink-0">✔</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Section 9: FluteSangam Original Learning Piece "Madhur Milan" */}
        <section className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-amber-950 text-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-800 space-y-8">
          <div className="border-b border-amber-800/80 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 text-amber-300 text-xs font-bold border border-amber-700/60 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>FluteSangam Original Learning Piece</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-amber-100 tracking-tight">
              Composition: <em>"Madhur Milan"</em>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-amber-900/50 p-2.5 rounded-xl border border-amber-800/60">
                <span className="text-amber-400 font-medium block">Taal</span>
                <strong className="text-amber-100 text-sm">Teentaal (16 Beats)</strong>
              </div>
              <div className="bg-amber-900/50 p-2.5 rounded-xl border border-amber-800/60">
                <span className="text-amber-400 font-medium block">Laya</span>
                <strong className="text-amber-100 text-sm">Madhya Laya</strong>
              </div>
              <div className="bg-amber-900/50 p-2.5 rounded-xl border border-amber-800/60">
                <span className="text-amber-400 font-medium block">Raag</span>
                <strong className="text-amber-100 text-sm">Khamaj</strong>
              </div>
              <div className="bg-amber-900/50 p-2.5 rounded-xl border border-amber-800/60">
                <span className="text-amber-400 font-medium block">Difficulty</span>
                <strong className="text-amber-100 text-sm">Intermediate</strong>
              </div>
            </div>

            <p className="text-xs text-amber-300/80 pt-2 leading-relaxed">
              This learning piece has been created specifically for FluteSangam to help students practice the characteristic movement of Khamaj. It is an original educational exercise, not a traditional bandish or classical composition.
            </p>
          </div>

          {/* Interactive Composition Audio Loop Player */}
          <div className="bg-amber-900/60 border border-amber-700/80 p-5 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  <span>Teentaal Metronome &amp; Composition Beat Audio Guide</span>
                </h3>
                <p className="text-xs text-amber-300/80">Interactive 16-beat loop with real-time swara audio synthesizer</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingComposition(!isPlayingComposition)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                    isPlayingComposition
                      ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isPlayingComposition ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingComposition ? 'Pause Composition' : 'Play Composition'}</span>
                </button>
              </div>
            </div>

            {/* Tempo Slider */}
            <div className="flex items-center gap-4 bg-amber-950/80 p-3 rounded-xl border border-amber-800/80 text-xs">
              <span className="text-amber-300 font-bold shrink-0">Tempo (BPM): {bpm}</span>
              <input
                type="range"
                min="40"
                max="100"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-amber-400 text-[10px] shrink-0 font-mono">Teentaal 16-Beats</span>
            </div>

            {/* 16 Beats Visual Indicator Grid */}
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 pt-1">
              {Array.from({ length: 16 }).map((_, beatIdx) => (
                <div
                  key={beatIdx}
                  className={`p-2 rounded-lg text-center transition-all ${
                    currentBeat === beatIdx && isPlayingComposition
                      ? 'bg-amber-400 text-amber-950 font-black scale-110 shadow-lg'
                      : beatIdx === 0
                      ? 'bg-amber-800 text-amber-200 font-bold border border-amber-500'
                      : beatIdx === 4 || beatIdx === 12
                      ? 'bg-amber-900/90 text-amber-300 border border-amber-700'
                      : beatIdx === 8
                      ? 'bg-amber-950 text-amber-400 border border-rose-500/50'
                      : 'bg-amber-950/60 text-amber-300/60 border border-amber-900'
                  }`}
                >
                  <div className="text-[10px] font-mono">{beatIdx + 1}</div>
                  <div className="text-[8px] uppercase">
                    {beatIdx === 0 ? 'X (Sam)' : beatIdx === 4 ? '2' : beatIdx === 8 ? '0 (Khali)' : beatIdx === 12 ? '3' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Composition Parts */}
          <div className="space-y-6">
            {/* Aalap */}
            <div className="bg-amber-900/40 border border-amber-800/80 p-5 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-amber-200">1. Aalap (Unmetered Intro)</h3>
              <p className="text-xs text-amber-300/80">Play freely without taal and keep the phrases slow and connected:</p>
              <div className="bg-amber-950/90 p-4 rounded-xl border border-amber-800 font-mono text-sm text-amber-100 space-y-2">
                <div>S G M  |  M P D  |  N S'  |  S' n D  |  P M  |  G R S</div>
                <div>G M P  |  D N S'  |  n D P  |  M G R S</div>
              </div>
              <p className="text-xs text-amber-300/90 italic">
                Focus on the contrast between Shuddha Ni (N) in the ascent and Komal Ni (n) in the descent.
              </p>
            </div>

            {/* Mukhda */}
            <div className="bg-amber-900/40 border border-amber-800/80 p-5 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-amber-200">2. Mukhda (Main Theme - Teentaal)</h3>
              <div className="bg-amber-950/90 p-4 rounded-xl border border-amber-800 font-mono text-sm sm:text-base text-amber-100 space-y-2">
                <div>| S  G  M  P | D  N  S'  - |</div>
                <div>| S' n  D  P | M  G  R  S  |</div>
              </div>
              <p className="text-xs text-amber-300/90">
                This is the main melodic idea of the learning piece.
              </p>
            </div>

            {/* Antara */}
            <div className="bg-amber-900/40 border border-amber-800/80 p-5 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-amber-200">3. Antara (Upper Octave Section)</h3>
              <div className="bg-amber-950/90 p-4 rounded-xl border border-amber-800 font-mono text-sm sm:text-base text-amber-100 space-y-2">
                <div>| G  M  P  D | N  S' n  D |</div>
                <div>| P  M  G  R | S  -  -  - |</div>
              </div>
              <p className="text-xs text-amber-300/90">
                The Antara moves toward the upper Sa before returning toward the lower register.
              </p>
            </div>

            {/* Vistar Practice */}
            <div className="bg-amber-900/40 border border-amber-800/80 p-5 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-amber-200">4. Vistar Practice</h3>
              <div className="bg-amber-950/90 p-4 rounded-xl border border-amber-800 font-mono text-sm sm:text-base text-amber-100 space-y-2">
                <div>| G  M  P  D | N  D  P  M |</div>
                <div>| G  R  S  G | M  P  D  N |</div>
                <div className="pt-2">| S' n  D  P | M  G  R  S |</div>
                <div>| G  M  P  M | G  R  S  - |</div>
              </div>
              <p className="text-xs text-amber-300/90">
                Practice these phrases slowly and maintain the characteristic Khamaj feeling rather than simply playing the notes mechanically.
              </p>
            </div>

            {/* Concluding Phrase */}
            <div className="bg-amber-900/40 border border-amber-800/80 p-5 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-amber-200">5. Concluding Phrase (Tihaai / Ending)</h3>
              <p className="text-xs text-amber-300/80">Repeat three times:</p>
              <div className="bg-amber-950/90 p-4 rounded-xl border border-amber-800 font-mono text-sm sm:text-base text-amber-100 space-y-1">
                <div>G M P | M G R | S</div>
                <div>G M P | M G R | S</div>
                <div>G M P | M G R | S</div>
              </div>
              <p className="text-xs text-amber-300/90 font-bold">
                Finish clearly on: <span className="font-mono text-base text-amber-100">S</span>
              </p>
            </div>

            {/* How to Practice Step-by-Step */}
            <div className="bg-amber-900/30 p-5 rounded-2xl border border-amber-800/60 space-y-3">
              <h3 className="text-base font-bold text-amber-200">How to Practice the Learning Piece</h3>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-200 list-decimal list-inside">
                <li>Practice the long notes first.</li>
                <li>Practice Aaroh and Avaroh slowly.</li>
                <li>Repeat the Pakad several times.</li>
                <li>Practice the Aalap without rhythm.</li>
                <li>Learn the Mukhda.</li>
                <li>Add the Antara after Mukhda is comfortable.</li>
                <li>Practice the Vistar separately.</li>
                <li>Join all parts together.</li>
                <li>Finish with the Concluding Phrase.</li>
                <li>Start around 50 BPM and move to 70–80 BPM.</li>
                <li className="col-span-1 sm:col-span-2 text-amber-300 font-semibold">Do not increase tempo if the difference between N and n is becoming unclear.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 10: Suggested Daily Practice Routine */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Suggested Daily Practice (45 Minutes)</h2>
              <p className="text-xs text-amber-800">Structured timetable for mastering Raag Khamaj</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-amber-900 text-amber-100 border-b border-amber-800">
                  <th className="p-3.5 rounded-tl-xl font-bold">Exercise</th>
                  <th className="p-3.5 font-bold">Recommended Time</th>
                  <th className="p-3.5 rounded-tr-xl font-bold">Focus Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-amber-950">
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">Long Notes (Swara Sadhana)</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">5 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">Tone clarity, breath stability, and holding S, G, M, P, D, N, S', n</td>
                </tr>
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">Aaroh–Avaroh</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">5 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">Shuddha Ni ascending and Komal Ni descending transitions</td>
                </tr>
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">Pakad Practice</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">5 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">G M P D M G phrase and n D P resolution</td>
                </tr>
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">FluteSangam Original Alankars</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">10 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">Finger speed, agility, and dual-Nishad fluency</td>
                </tr>
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">Aalap Exploration</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">5 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">Unmetered melodic expression and meend glides</td>
                </tr>
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">Original Learning Piece ("Madhur Milan")</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">10 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">Mukhda, Antara, and Vistar in Teentaal rhythm</td>
                </tr>
                <tr className="hover:bg-amber-50/80 transition">
                  <td className="p-3.5 font-semibold">Free Improvisation</td>
                  <td className="p-3.5 font-mono font-bold text-amber-900">5 minutes</td>
                  <td className="p-3.5 text-xs text-amber-900/80">Creative expression adhering to Khamaj grammar</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-100/80 p-4 rounded-2xl border border-amber-300/80 text-xs font-bold text-amber-950 flex items-center justify-between">
            <span>Total Practice Time:</span>
            <span className="font-mono text-base text-amber-900 font-black">45 Minutes / Session</span>
          </div>
        </section>

        {/* Section 11: Frequently Asked Questions */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-bamboo-950 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-xs text-amber-800">Common questions about Raag Khamaj on flute</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is Raag Khamaj suitable for intermediate flute players?",
                a: "Yes. Khamaj is a very rewarding intermediate raga because it introduces more nuanced swara treatment (both Shuddha and Komal Nishad) while remaining melodically accessible and deeply expressive."
              },
              {
                q: "Which Nishad is used in Raag Khamaj?",
                a: "Both forms are used in the commonly taught form of the raga. Shuddha Ni (N) is commonly used in ascending movement (Aaroh), while Komal Ni (n) is characteristic of descending movement (Avaroh)."
              },
              {
                q: "Which notes are important in Khamaj?",
                a: "Ga (Gandhar) and Ni (Nishad) are traditionally important, with Ga commonly treated as the Vadi (primary note) and Ni as the Samvadi (secondary note)."
              },
              {
                q: "Is Khamaj difficult to play on the flute?",
                a: "The basic notes are not particularly difficult. The primary challenge is learning the correct treatment of Nishad (knowing when to play Shuddha vs Komal) and developing the characteristic romantic phrases of the raga."
              },
              {
                q: "Which flute should I use for Raag Khamaj?",
                a: "Khamaj can be practiced on any properly tuned bansuri. A G Base flute (or E Bass / C Medium) is a comfortable choice for adult players, depending on your comfortable playing range."
              },
              {
                q: "When is Raag Khamaj traditionally performed?",
                a: "It is traditionally associated with the second quarter of the night (9 PM to 12 AM), creating a peaceful, romantic, and devotional atmosphere."
              },
            ].map((faq, index) => (
              <div 
                key={index}
                className="border border-amber-200/80 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left font-bold text-bamboo-950 flex items-center justify-between gap-4 bg-amber-50/50 hover:bg-amber-100/50 transition cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {activeFaq === index ? <ChevronUp className="w-5 h-5 text-amber-700 shrink-0" /> : <ChevronDown className="w-5 h-5 text-amber-700 shrink-0" />}
                </button>
                {activeFaq === index && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-amber-900/90 leading-relaxed border-t border-amber-200/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 12: Related Ragas */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-bamboo-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <span>Explore Related Ragas</span>
          </h2>
          <p className="text-xs text-amber-800">Continue your classical bansuri journey with complementary ragas:</p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'Raag Yaman', view: 'raga_yaman' as AppView },
              { name: 'Raag Desh', view: 'raga_desh' as AppView },
              { name: 'Raag Kafi', view: 'raga_kafi' as AppView },
              { name: 'Raag Bhimpalasi', view: 'raga_bhimpalasi' as AppView },
              { name: 'Raag Bageshree', view: 'raga_bageshree' as AppView },
            ].map((raga, idx) => (
              <button
                key={idx}
                onClick={() => onViewChange?.(raga.view)}
                className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-bamboo-950 text-xs font-bold transition flex items-center justify-between gap-1.5 cursor-pointer text-left"
              >
                <span>{raga.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Section 13: Copyright & Content Notice */}
        <footer className="bg-amber-100/60 border border-amber-200 p-5 rounded-2xl text-xs text-amber-900/90 space-y-2">
          <p className="font-bold text-bamboo-950">© FluteSangam Original Content</p>
          <p>
            This article, including the explanations, practice routines, alankars, and <em>"Madhur Milan"</em> learning piece, has been created specifically for FluteSangam as original educational content.
          </p>
          <p className="text-[11px] text-amber-800/80">
            The learning piece is an original practice exercise created to help students explore the note set and characteristic movements discussed on this page. It is not presented as a traditional bandish, gat, or composition from any particular gharana or composer.
          </p>
        </footer>

        {/* Section 14: About Author Section */}
        <AboutAuthorSection onViewChange={onViewChange} />
      </div>
    </article>
  );
}
