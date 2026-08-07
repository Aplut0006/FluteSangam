import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Sun, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, 
  Sliders, Award, Sparkles, ShieldAlert, Lightbulb, User
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaBhairavViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBhairavView({ onViewChange }: RagaBhairavViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(50);
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
    'r': 277.18,   // Komal Re
    'R': 293.66,   // Shuddha Re
    'G': 329.63,   // Shuddha Ga
    'M': 349.23,   // Shuddha Ma
    'P': 392.00,   // Pa
    'd': 415.30,   // Komal Dha
    'D': 440.00,   // Shuddha Dha
    'N': 493.88,   // Shuddha Ni
    'S\'': 523.25,  // Upper Sa
    'r\'': 554.37,  // Upper Komal Re
    'd.': 207.65,  // Lower Komal Dha
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

  // Metronome for Pratah Dhyan composition
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
S
r G M
M G r S
S r G M
P
d N S'
S' N d
P M G r S
G M P
d P
M G
r S`;

  const compositionMukhda = `Mukhda (Teentaal - 16 Beats)
| S  r  G  M | P  d  N  S' |
| S' N  d  P | M  G  r  S  |`;

  const compositionAntara = `Antara
| G  M  P  d | N  S' N  d |
| P  M  G  M | r  S  -  - |`;

  const compositionVistar = `Vistar Practice
| S  r  G  M | G  M  P  M |
| P  d  N  S' | N  d  P  M |
| G  M  r  S | S  r  G  M |
| P  d  P  M | G  r  S  - |`;

  const compositionConclusion = `Concluding Phrase
Repeat three times:
G M P
M G r
S

Finish clearly on:
S`;

  const faqs = [
    {
      q: "Is Raag Bhairav suitable for intermediate flute players?",
      a: "Yes. Bhairav is an excellent intermediate raga because its basic swara structure is accessible, while its Komal Re, Komal Dha, Andolan, and phrase treatment require greater control."
    },
    {
      q: "Which notes are Komal in Raag Bhairav?",
      a: "Re (r) and Dha (d) are Komal."
    },
    {
      q: "Which notes are Shuddha?",
      a: "Sa, Ga, Ma, Pa, and Ni are Shuddha."
    },
    {
      q: "Which notes are important in Bhairav?",
      a: "The raga places significant emphasis on Komal Re and Komal Dha, with their characteristic Andolan. Dha is traditionally considered the Vadi and Re the Samvadi."
    },
    {
      q: "What is the traditional time for Raag Bhairav?",
      a: "Raag Bhairav is traditionally associated with the early morning, around sunrise."
    },
    {
      q: "Is Bhairav difficult to play on the flute?",
      a: "The basic swaras are manageable, but producing convincing Komal Re and Komal Dha with appropriate Andolan requires practice."
    },
    {
      q: "Which flute should I use for Raag Bhairav?",
      a: "Any properly tuned bansuri can be used. Choose a flute on which you can comfortably maintain stable pitch and control the lower and middle registers."
    }
  ];

  // Schema.org Structured Data JSON-LD
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonld-raga-bhairav';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://flutesangam.com/learn/raga-bhairav"
      },
      "headline": "Raag Bhairav: Complete Guide, Notes, Aaroh, Avaroh & Practice",
      "description": "Master Raag Bhairav on Indian bamboo flute (Bansuri) with step-by-step swara guides, Aaroh-Avaroh, Pakad, Chalan, practice routine, alankars, and the original composition Pratah Dhyan.",
      "image": "https://flutesangam.com/og-image.jpg",
      "author": {
        "@type": "Organization",
        "name": "FluteSangam Educational Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FluteSangam",
        "logo": {
          "@type": "ImageObject",
          "url": "https://flutesangam.com/logo.png"
        }
      },
      "datePublished": "2026-08-07",
      "dateModified": "2026-08-07"
    });
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('jsonld-raga-bhairav');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 font-sans text-gray-800">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
        <button 
          onClick={() => onViewChange?.('community')} 
          className="hover:text-amber-800 transition font-medium cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button 
          onClick={() => onViewChange?.('learn_raagas')} 
          className="hover:text-amber-800 transition font-medium cursor-pointer"
        >
          Raga Guides
        </button>
        <span>/</span>
        <span className="text-amber-900 font-bold">Raag Bhairav</span>
      </nav>

      {/* Hero Header Banner */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-bamboo-950 to-orange-950 text-white p-6 sm:p-10 border border-amber-800/50 shadow-xl">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Sun className="w-96 h-96 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" /> Early Morning Raga
            </span>
            <span className="bg-orange-500/20 text-orange-200 border border-orange-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Bhairav Thaat
            </span>
            <span className="bg-amber-400 text-bamboo-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              Intermediate
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Raag Bhairav: Complete Guide, Notes, Aaroh, Avaroh &amp; Practice
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Discover the profound morning sanctuary of <strong>Raag Bhairav</strong>. Master Komal Re (r) and Komal Dha (d) with gentle Andolan, smooth meend, step-by-step alankars, and the original educational piece <em className="text-amber-300 font-serif">"Pratah Dhyan"</em>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-200/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> Time: Early Morning (Sunrise)
            </span>
            <span className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-400" /> Vadi: Dha | Samvadi: Re
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-400" /> Mood: Serious, Peaceful, Devotional
            </span>
          </div>

          {/* Published and Updated Dates */}
          <div className="pt-3 border-t border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200/90 font-medium">
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Published: <strong className="text-white" itemProp="datePublished" content="2026-08-07">August 7, 2026</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Updated: <strong className="text-white" itemProp="dateModified" content="2026-08-07">August 7, 2026</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>15 min read</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified FluteSangam Lesson</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Interactive Swara Tone Bar */}
      <section className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-bamboo-950 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600" /> Interactive Swara Tone Preview (G Base Flute Pitch)
            </h2>
            <p className="text-xs text-gray-600">Click any swara button to hear its pitch and intonation for Raag Bhairav.</p>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md shrink-0">
            Komal Re (r) &amp; Komal Dha (d)
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: 'Sa (S)', key: 'S' },
            { label: 'Komal Re (r)', key: 'r', highlight: true },
            { label: 'Shuddha Ga (G)', key: 'G' },
            { label: 'Shuddha Ma (M)', key: 'M' },
            { label: 'Pa (P)', key: 'P' },
            { label: 'Komal Dha (d)', key: 'd', highlight: true },
            { label: 'Shuddha Ni (N)', key: 'N' },
            { label: 'Upper Sa (S\')', key: 'S\'' },
          ].map((sw) => (
            <button
              key={sw.key}
              onClick={() => playSwaraTone(sw.key)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                activeSwara === sw.key 
                  ? 'bg-amber-600 text-white scale-105' 
                  : sw.highlight
                  ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 hover:bg-amber-200'
                  : 'bg-amber-50/80 border border-amber-200 text-bamboo-900 hover:bg-amber-100'
              }`}
            >
              <Volume2 className="w-3 h-3 text-amber-700" />
              <span>{sw.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-600" /> Introduction to Raag Bhairav
        </h2>
        
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <strong>Raag Bhairav</strong> is one of the most important and recognizable ragas in Hindustani Classical Music. It belongs to the <strong>Bhairav Thaat</strong> and is traditionally associated with the peaceful and contemplative atmosphere of the early morning.
        </p>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          The identity of Bhairav comes particularly from its treatment of <strong>Komal Re (r)</strong> and <strong>Komal Dha (d)</strong>. These notes are not simply played as ordinary flat notes; their expressive treatment, including gentle <em>Andolan</em> (microtonal oscillation), is an important part of the raga's character.
        </p>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          For bansuri players, Bhairav is an excellent intermediate raga because it develops pitch control, breath stability, Andolan, meend, and expressive note treatment. Although its basic swara structure is straightforward, playing it convincingly requires attention to the movement and weight given to individual notes.
        </p>
      </section>

      {/* Basic Information Table */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-600" /> Basic Information
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-amber-200 shadow-2xs bg-white">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-100/80 text-amber-950 font-bold border-b border-amber-200">
              <tr>
                <th className="p-3.5 sm:p-4 w-1/3">Property</th>
                <th className="p-3.5 sm:p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-gray-800">
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Raga Name</td>
                <td className="p-3.5 sm:p-4 font-semibold text-amber-900">Bhairav</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Thaat</td>
                <td className="p-3.5 sm:p-4">Bhairav</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Jati</td>
                <td className="p-3.5 sm:p-4">Sampurna – Sampurna (7 notes ascending &amp; 7 notes descending)</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Time</td>
                <td className="p-3.5 sm:p-4 font-semibold text-amber-800">Early Morning (Prahar 1 - Sunrise)</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Vadi Swara (Primary)</td>
                <td className="p-3.5 sm:p-4"><span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">Dha (Komal Dha)</span></td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Samvadi Swara (Secondary)</td>
                <td className="p-3.5 sm:p-4"><span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">Re (Komal Re)</span></td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Nature</td>
                <td className="p-3.5 sm:p-4">Serious, peaceful, devotional</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Rasa (Emotion)</td>
                <td className="p-3.5 sm:p-4">Shanta, Bhakti</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-bold text-bamboo-950">Difficulty</td>
                <td className="p-3.5 sm:p-4"><span className="bg-amber-200 text-bamboo-950 font-bold px-2.5 py-0.5 rounded-full text-xs">Intermediate</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Swaras Used Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Music className="w-5 h-5 text-amber-600" /> Swaras Used
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          Raag Bhairav uses all seven swaras:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono font-bold">
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="text-gray-500 block text-[10px] uppercase font-sans">Shuddha</span>
            <span className="text-base text-bamboo-950">Sa (S)</span>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl border-2 border-amber-400 text-center shadow-2xs">
            <span className="text-amber-800 block text-[10px] uppercase font-sans font-black">Characteristic</span>
            <span className="text-base text-amber-950">Komal Re (r)</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="text-gray-500 block text-[10px] uppercase font-sans">Shuddha</span>
            <span className="text-base text-bamboo-950">Ga (G)</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="text-gray-500 block text-[10px] uppercase font-sans">Shuddha</span>
            <span className="text-base text-bamboo-950">Ma (M)</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="text-gray-500 block text-[10px] uppercase font-sans">Shuddha</span>
            <span className="text-base text-bamboo-950">Pa (P)</span>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl border-2 border-amber-400 text-center shadow-2xs">
            <span className="text-amber-800 block text-[10px] uppercase font-sans font-black">Characteristic</span>
            <span className="text-base text-amber-950">Komal Dha (d)</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="text-gray-500 block text-[10px] uppercase font-sans">Shuddha</span>
            <span className="text-base text-bamboo-950">Ni (N)</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="text-gray-500 block text-[10px] uppercase font-sans">Shuddha</span>
            <span className="text-base text-bamboo-950">Upper Sa (S')</span>
          </div>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
          <p className="font-bold text-amber-900">The two characteristic Komal swaras are:</p>
          <ul className="list-disc list-inside space-y-1 pt-1 font-mono">
            <li><strong>Komal Re (r)</strong></li>
            <li><strong>Komal Dha (d)</strong></li>
          </ul>
          <p className="pt-2 text-gray-700 font-sans">
            These notes require particularly careful intonation and expressive treatment with gentle <em>Andolan</em> (oscillations).
          </p>
        </div>
      </section>

      {/* Aaroh, Avaroh, Pakad & Chalan Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-600" /> Aaroh, Avaroh, Pakad &amp; Chalan
        </h2>

        {/* Scale Display Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Aaroh Card */}
          <div className="bg-amber-900 text-amber-100 rounded-2xl p-5 border border-amber-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-sans">Aaroh (Ascending)</span>
              <button 
                onClick={() => copyToClipboard('S r G M P d N S\'', 'Aaroh')}
                className="text-amber-300 hover:text-white transition cursor-pointer p-1 rounded-md"
                title="Copy Aaroh"
              >
                {copiedSection === 'Aaroh' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold tracking-wider text-amber-200">
              S r G M P d N S'
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed font-sans">
              Ascending scale using Komal Re (r) and Komal Dha (d).
            </p>
          </div>

          {/* Avaroh Card */}
          <div className="bg-amber-950 text-amber-100 rounded-2xl p-5 border border-amber-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-sans">Avaroh (Descending)</span>
              <button 
                onClick={() => copyToClipboard('S\' N d P M G r S', 'Avaroh')}
                className="text-amber-300 hover:text-white transition cursor-pointer p-1 rounded-md"
                title="Copy Avaroh"
              >
                {copiedSection === 'Avaroh' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold tracking-wider text-amber-200">
              S' N d P M G r S
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed font-sans">
              Descending scale returning cleanly through Komal Dha (d) and Komal Re (r) to Sa.
            </p>
          </div>

        </div>

        {/* Pakad Box */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Pakad (Key Identifying Phrases)
            </h3>
            <button 
              onClick={() => copyToClipboard(`S r G M\nG M r S\nd N S'\nN d P\nM G r S`, 'Pakad')}
              className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedSection === 'Pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'Pakad' ? 'Copied' : 'Copy Pakad'}</span>
            </button>
          </div>

          <p className="text-xs text-gray-600">A useful introductory phrase establishing the soul of Raag Bhairav:</p>
          
          <div className="bg-white p-4 rounded-xl border border-amber-200/80 font-mono text-sm sm:text-base font-bold text-bamboo-950 space-y-1 shadow-2xs">
            <div>S r G M</div>
            <div>G M r S</div>
            <div>d N S'</div>
            <div>N d P</div>
            <div>M G r S</div>
          </div>

          <p className="text-xs text-gray-600 pt-2">Another key phrase for daily practice:</p>
          <div className="bg-white p-4 rounded-xl border border-amber-200/80 font-mono text-sm font-bold text-bamboo-950 space-y-1 shadow-2xs">
            <div>G M P</div>
            <div>d P</div>
            <div>M G</div>
            <div>r S</div>
          </div>

          <p className="text-xs text-amber-900 italic font-sans pt-1">
            💡 The characteristic movement should be practiced slowly rather than treated simply as a fast scale.
          </p>
        </div>

        {/* Chalan Box */}
        <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-3">
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <Repeat className="w-4 h-4 text-amber-600" /> Chalan (Melodic Movement Pattern)
          </h3>

          <div className="bg-white p-4 rounded-xl border border-amber-200 font-mono text-xs sm:text-sm text-bamboo-950 leading-relaxed space-y-2 shadow-2xs">
            <div>S r G M</div>
            <div>G M P</div>
            <div>d N S'</div>
            <div>S' N d P</div>
            <div>M G</div>
            <div>r S</div>
            <div className="pt-2 text-amber-900 border-t border-amber-100">Continue with:</div>
            <div>G M r S</div>
            <div>S r G M</div>
            <div>P d N d</div>
            <div>P M G r S</div>
          </div>

          <p className="text-xs text-gray-700">
            The Komal Re and Komal Dha should receive careful attention and gentle oscillation while practicing these phrases.
          </p>
        </div>
      </section>

      {/* Important Characteristics */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" /> Important Characteristics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
          {[
            "Bhairav belongs to the Bhairav Thaat.",
            "Both Re and Dha are Komal (r and d).",
            "Ga, Ma, Pa and Ni are Shuddha.",
            "Komal Re and Komal Dha are central to the identity of the raga.",
            "Both Komal Re and Komal Dha are traditionally treated with Andolan.",
            "The raga has a serious, calm, and devotional character.",
            "Slow and controlled playing is particularly effective.",
            "The treatment of the Komal swaras is more important than simply reproducing the scale.",
            "Smooth meend can add depth to bansuri performance."
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mood and Emotion Section */}
      <section className="bg-gradient-to-br from-amber-900 to-bamboo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-300 flex items-center gap-2">
          <Heart className="w-5 h-5 text-amber-400" /> Mood and Emotion
        </h2>

        <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
          Raag Bhairav has a profound and contemplative character. It can evoke:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs font-bold text-amber-950">
          {['Peace', 'Devotion', 'Serenity', 'Spiritual reflection', 'Gravity', 'Inner stillness'].map((m, idx) => (
            <div key={idx} className="bg-amber-100/90 p-3 rounded-xl text-center border border-amber-300/40 shadow-2xs">
              {m}
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-amber-200/80 pt-2 leading-relaxed">
          Its association with the early morning makes it especially suitable for quiet practice and meditative playing.
        </p>
      </section>

      {/* Why Learn Raag Bhairav */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" /> Why Learn Raag Bhairav?
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          Raag Bhairav is an important milestone for an intermediate flute player. Learning it helps develop:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          {[
            'Accurate Komal Re and Komal Dha pitch placement.',
            'Controlled microtonal Andolan oscillations.',
            'Smooth meend glides between swaras.',
            'Breath stability across registers.',
            'Sustained-note control in early morning practice.',
            'Expressive phrasing and micro-dynamics.',
            'Understanding of raga-specific note treatment.',
            'Preparation for more demanding ragas (such as Bhairavi or Ahir Bhairav).'
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2.5 bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-bamboo-950 font-medium">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Routine & Alankars Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Repeat className="w-5 h-5 text-amber-600" /> Practice Routine &amp; Alankars
            </h2>
            <p className="text-xs text-gray-600">Daily exercises to internalize Komal Re and Komal Dha control.</p>
          </div>

          {/* Interactive Practice Timer */}
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center gap-3 shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Routine Timer</div>
              <div className="text-base font-mono font-bold text-bamboo-950">{formatTimer(timerSeconds)}</div>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="bg-amber-700 hover:bg-amber-800 text-white p-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Long Notes */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60 space-y-2">
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-600" /> 1. Long Notes Practice
          </h3>
          <p className="text-xs text-gray-700">Begin with slow, sustained notes holding each swara for 8–10 seconds:</p>
          <div className="font-mono text-sm font-bold text-amber-900 bg-white p-3 rounded-xl border border-amber-200 tracking-widest flex flex-wrap gap-3 justify-between">
            <span>S</span> <span>r</span> <span>G</span> <span>M</span> <span>P</span> <span>d</span> <span>N</span> <span>S'</span>
          </div>
          <p className="text-[11px] text-amber-900 italic">Pay particular attention to the pitch and expression of Komal Re (r) and Komal Dha (d).</p>
        </div>

        {/* Aaroh-Avaroh Repetition */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60 space-y-2">
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">2. Aaroh–Avaroh Scale Practice</h3>
          <p className="text-xs text-gray-700">Repeat slowly 10–15 times:</p>
          <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
            <div>Aaroh: S r G M P d N S'</div>
            <div>Avaroh: S' N d P M G r S</div>
          </div>
          <p className="text-[11px] text-amber-900 italic">Do not increase the speed until the Komal Re and Komal Dha sound completely stable.</p>
        </div>

        {/* FluteSangam Original Alankars */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-bamboo-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> FluteSangam Original Alankars for Raag Bhairav
          </h3>

          {/* Alankar 1 */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span>FluteSangam Original Alankar 1 (2-Note Phrases)</span>
              <button 
                onClick={() => copyToClipboard(`S r | r G | G M | M P | P d | d N | N S'\nS' N | N d | d P | P M | M G | G r | r S`, 'Alankar 1')}
                className="text-amber-700 hover:text-amber-950 cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-amber-200/80 leading-relaxed text-bamboo-950">
              <div><strong>Ascending:</strong> S r | r G | G M | M P | P d | d N | N S'</div>
              <div><strong>Descending:</strong> S' N | N d | d P | P M | M G | G r | r S</div>
            </div>
          </div>

          {/* Alankar 2 */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span>FluteSangam Original Alankar 2 (3-Note Phrases)</span>
              <button 
                onClick={() => copyToClipboard(`S r G | r G M | G M P | M P d | P d N | d N S'\nS' N d | N d P | d P M | P M G | M G r | G r S`, 'Alankar 2')}
                className="text-amber-700 hover:text-amber-950 cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-amber-200/80 leading-relaxed text-bamboo-950">
              <div><strong>Ascending:</strong> S r G | r G M | G M P | M P d | P d N | d N S'</div>
              <div><strong>Descending:</strong> S' N d | N d P | d P M | P M G | M G r | G r S</div>
            </div>
          </div>

          {/* Alankar 3 */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span>FluteSangam Original Alankar 3 (4-Note Returning Patterns)</span>
              <button 
                onClick={() => copyToClipboard(`S r G r | r G M G | G M P M | M P d P | P d N d | d N S' N\nS' N d N | N d P d | d P M P | P M G M | M G r G | G r S`, 'Alankar 3')}
                className="text-amber-700 hover:text-amber-950 cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-amber-200/80 leading-relaxed text-bamboo-950">
              <div><strong>Ascending:</strong> S r G r | r G M G | G M P M | M P d P | P d N d | d N S' N</div>
              <div><strong>Descending:</strong> S' N d N | N d P d | d P M P | P M G M | M G r G | G r S</div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes & Tips for Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Common Mistakes */}
        <section className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200/80 space-y-4">
          <h2 className="text-lg font-bold font-display text-rose-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" /> Common Mistakes
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-800">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing Komal Re and Komal Dha like ordinary flat notes without their characteristic treatment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Using excessive or exaggerated Andolan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Making the raga unnecessarily fast.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Treating Bhairav as simply a seven-note scale.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Playing Re and Dha with inconsistent pitch.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>Ignoring the peaceful and serious character of the raga.</span>
            </li>
          </ul>
        </section>

        {/* Tips for Better Performance */}
        <section className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 space-y-4">
          <h2 className="text-lg font-bold font-display text-amber-950 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" /> Tips for Better Performance
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-800">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Practice Bhairav slowly with full mindfulness.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Use a tanpura drone (in C/G pitch) whenever possible.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Spend extra time settling into Komal Re and Komal Dha.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Practice gentle Andolan rather than exaggerated oscillations.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Keep your airflow steady and warm across octave changes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Allow important notes to settle before moving on.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Listen carefully to the relationship between Sa–Re and Pa–Dha.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Focus on emotional expression rather than speed.</span>
            </li>
          </ul>
        </section>

      </div>

      {/* FluteSangam Original Learning Piece: Pratah Dhyan */}
      <section className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-amber-800/80">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-900/60 px-3 py-1 rounded-full border border-amber-700/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> FluteSangam Original Composition
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Original Practice Composition: <em className="text-amber-300 font-serif">"Pratah Dhyan"</em>
            </h2>
            <p className="text-xs text-amber-200/80 mt-1">
              An educational piece created specifically for FluteSangam students to master Raag Bhairav.
            </p>
          </div>

          {/* Composition Metronome Control */}
          <div className="bg-bamboo-900/80 p-4 rounded-2xl border border-amber-700/60 flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 p-3 rounded-xl font-bold transition cursor-pointer shadow-md"
            >
              {isPlayingComposition ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <div>
              <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Teentaal Metronome</div>
              <div className="text-xs text-amber-100 font-mono">
                {bpm} BPM {isPlayingComposition && <span className="text-amber-400 font-bold ml-1">• Beat {currentBeat}/16</span>}
              </div>
            </div>
            <input 
              type="range" 
              min="40" 
              max="90" 
              value={bpm} 
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 accent-amber-400 cursor-pointer"
              title="Adjust BPM"
            />
          </div>
        </div>

        {/* Composition Details Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
            <span className="text-amber-400 block text-[10px] uppercase font-bold">Raag</span>
            <span className="font-bold text-white text-sm">Bhairav</span>
          </div>
          <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
            <span className="text-amber-400 block text-[10px] uppercase font-bold">Taal</span>
            <span className="font-bold text-white text-sm">Teentaal (16 Beats)</span>
          </div>
          <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
            <span className="text-amber-400 block text-[10px] uppercase font-bold">Laya</span>
            <span className="font-bold text-white text-sm">Madhya Laya</span>
          </div>
          <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
            <span className="text-amber-400 block text-[10px] uppercase font-bold">Difficulty</span>
            <span className="font-bold text-amber-300 text-sm">Intermediate</span>
          </div>
        </div>

        {/* Note on Educational Nature */}
        <p className="text-xs text-amber-100/90 leading-relaxed italic bg-amber-900/30 p-3.5 rounded-xl border border-amber-800/50">
          This learning piece has been created specifically for FluteSangam to help students practice the characteristic swaras and movements of Raag Bhairav. It is an original educational exercise, not a traditional bandish or classical composition.
        </p>

        {/* Aalap */}
        <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-sans">Aalap (Free Rhythm)</h3>
            <button 
              onClick={() => copyToClipboard(compositionAalap, 'Aalap')}
              className="text-xs text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Aalap
            </button>
          </div>
          <p className="text-xs text-amber-100/80 font-sans">Play freely without taal and keep the phrases slow and spacious.</p>
          <pre className="font-mono text-xs sm:text-sm text-amber-100 bg-black/40 p-4 rounded-xl border border-amber-800/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{compositionAalap}
          </pre>
        </div>

        {/* Mukhda */}
        <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-sans">Mukhda (Teentaal - 16 Beats)</h3>
            <button 
              onClick={() => copyToClipboard(compositionMukhda, 'Mukhda')}
              className="text-xs text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Mukhda
            </button>
          </div>
          <p className="text-xs text-amber-100/80 font-sans">Establishes the principal melodic idea of the learning piece.</p>
          <pre className="font-mono text-xs sm:text-sm text-amber-200 font-bold bg-black/40 p-4 rounded-xl border border-amber-800/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{compositionMukhda}
          </pre>
        </div>

        {/* Antara */}
        <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-sans">Antara</h3>
            <button 
              onClick={() => copyToClipboard(compositionAntara, 'Antara')}
              className="text-xs text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Antara
            </button>
          </div>
          <p className="text-xs text-amber-100/80 font-sans">Explores the upper register before returning toward Sa.</p>
          <pre className="font-mono text-xs sm:text-sm text-amber-200 font-bold bg-black/40 p-4 rounded-xl border border-amber-800/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{compositionAntara}
          </pre>
        </div>

        {/* Vistar Practice */}
        <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-sans">Vistar Practice</h3>
            <button 
              onClick={() => copyToClipboard(compositionVistar, 'Vistar')}
              className="text-xs text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Vistar
            </button>
          </div>
          <p className="text-xs text-amber-100/80 font-sans">Play the phrases slowly and allow the characteristic notes to retain their Bhairav character.</p>
          <pre className="font-mono text-xs sm:text-sm text-amber-200 font-bold bg-black/40 p-4 rounded-xl border border-amber-800/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{compositionVistar}
          </pre>
        </div>

        {/* Concluding Phrase */}
        <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-sans">Concluding Phrase</h3>
            <button 
              onClick={() => copyToClipboard(compositionConclusion, 'Conclusion')}
              className="text-xs text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Conclusion
            </button>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-amber-200 font-bold bg-black/40 p-4 rounded-xl border border-amber-800/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{compositionConclusion}
          </pre>
        </div>

        {/* How to Practice the Learning Piece */}
        <div className="bg-amber-900/40 rounded-2xl p-5 border border-amber-800/80 space-y-3">
          <h3 className="text-base font-bold text-amber-300 font-display">How to Practice the Learning Piece</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-amber-100/90 font-sans">
            <li>Begin with long-note practice.</li>
            <li>Practice Aaroh and Avaroh slowly.</li>
            <li>Repeat the Pakad several times.</li>
            <li>Practice the Aalap without rhythm.</li>
            <li>Learn the Mukhda.</li>
            <li>Add the Antara once the Mukhda is comfortable.</li>
            <li>Practice the Vistar separately.</li>
            <li>Combine the different parts.</li>
            <li>Finish with the Concluding Phrase.</li>
            <li>Start around 45–50 BPM.</li>
            <li>Increase the tempo gradually only when the Komal Re and Komal Dha remain controlled.</li>
            <li>Practice Andolan separately before incorporating it into the learning piece.</li>
          </ol>
        </div>

      </section>

      {/* Suggested Daily Practice Schedule */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" /> Suggested Daily Practice Schedule (45 Minutes)
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-amber-200 shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-100 text-amber-950 font-bold">
              <tr>
                <th className="p-3.5">Exercise</th>
                <th className="p-3.5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-gray-800">
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Long Notes</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">5 minutes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Aaroh–Avaroh</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">5 minutes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Pakad</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">5 minutes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Komal Re &amp; Dha Practice</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">5 minutes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Alankars</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">10 minutes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Aalap</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">5 minutes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Original Learning Piece ("Pratah Dhyan")</td>
                <td className="p-3.5 font-mono text-amber-900 font-bold">10 minutes</td>
              </tr>
              <tr className="bg-amber-50 font-bold text-bamboo-950">
                <td className="p-3.5">Total Practice Time</td>
                <td className="p-3.5 font-mono text-amber-900 text-base">45 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" /> Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-amber-200/80 rounded-2xl overflow-hidden transition">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 bg-amber-50/60 hover:bg-amber-100/60 transition flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-bamboo-950 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-amber-700 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-amber-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Ragas Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
        <h2 className="text-xl font-bold font-display text-bamboo-950">Related Ragas to Explore</h2>
        <p className="text-xs sm:text-sm text-gray-600">Discover other morning, devotional, and classical ragas on FluteSangam:</p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200">
            Raag Bhairavi
          </span>
          <span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200">
            Raag Ahir Bhairav
          </span>
          <span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200">
            Raag Kalingda
          </span>
          <button
            onClick={() => onViewChange?.('raga_yaman')}
            className="bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>Raag Yaman</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewChange?.('raga_khamaj')}
            className="bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>Raag Khamaj</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Copyright Note */}
      <section className="bg-amber-950 text-amber-200/90 rounded-2xl p-5 border border-amber-800/80 text-xs leading-relaxed space-y-2">
        <h3 className="font-bold text-amber-300 font-display text-sm">© FluteSangam Original Content</h3>
        <p>
          This article, including the explanations, practice routines, alankars, and "Pratah Dhyan" learning piece, has been created specifically for FluteSangam as original educational content.
        </p>
        <p className="text-amber-300/80 text-[11px]">
          The learning piece is an original practice exercise created to help students explore the swaras and characteristic movements discussed on this page. It is not presented as a traditional bandish, gat, or composition from any particular gharana or composer.
        </p>
      </section>

      {/* About Author Component */}
      <AboutAuthorSection />

    </div>
  );
}
