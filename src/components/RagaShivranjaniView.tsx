import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, Square,
  Volume2, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, AlertCircle,
  Compass, Zap, Share2, Printer, Sliders, Award, Sparkles, ShieldAlert, 
  Lightbulb, ArrowLeft, RefreshCw, RotateCcw, Feather, Heart, Radio,
  Target, Layers, HelpCircle, ArrowRight
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface RagaShivranjaniViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale (Middle C = 261.63 Hz)
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'P(lower)': 196.00,
  'P.': 196.00,
  'D(lower)': 220.00,
  'D.': 220.00,

  // Middle Octave (Madhya Saptak)
  'S': 261.63,
  'Sa': 261.63,
  'R': 293.66,       // Shuddha Re
  'Re': 293.66,
  'g': 311.13,       // Komal Ga (Eb)
  'ga': 311.13,
  'G': 329.63,       // Shuddha Ga (E) - for comparison
  'Ga': 329.63,
  'P': 392.00,       // Shuddha Pa
  'Pa': 392.00,
  'D': 440.00,       // Shuddha Dha
  'Dha': 440.00,

  // High Octave (Taar Saptak)
  "S'": 523.25,
  "Sa'": 523.25,
  "R'": 587.33,
  "Re'": 587.33,
  "g'": 622.25,      // High Komal Ga
  "ga'": 622.25,
  "P'": 783.99,
  "Pa'": 783.99,
  "D'": 880.00,
  "Dha'": 880.00,
};

export const RagaShivranjaniView: React.FC<RagaShivranjaniViewProps> = ({ onViewChange }) => {
  // Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);

  // Active swara highlight
  const [activeSwara, setActiveSwara] = useState<string | null>(null);

  // UI Modals & Tool states
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [bpm, setBpm] = useState(60);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(55 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio Context & Active Session Master Gain
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeTimeoutsRef = useRef<number[]>([]);

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
    // 1. Clear all queued UI state update timers
    activeTimeoutsRef.current.forEach(id => clearTimeout(id));
    activeTimeoutsRef.current = [];

    // 2. Instantly kill all audio routed through the master gain session
    if (masterGainRef.current) {
      try {
        const ctx = audioCtxRef.current;
        if (ctx) {
          masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
          masterGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
        }
        masterGainRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      masterGainRef.current = null;
    }

    // 3. Reset all playing state flags
    setActiveSwara(null);
    setIsPlayingAaroh(false);
    setIsPlayingAvaroh(false);
    setIsPlayingPakad(false);
    setPlayingExercise(null);
    setPlayingAalap(null);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const playSwara = (swaraName: string, duration = 0.85) => {
    try {
      stopAllAudio();
      const ctx = getAudioContext();
      const sessionDest = getSessionDestination(ctx);
      const cleanName = swaraName.replace(/[\(\)]/g, '');
      const freq = SWARA_FREQS[swaraName] || SWARA_FREQS[cleanName] || 261.63;

      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.32, sessionDest);

      setActiveSwara(cleanName);
      const tId = window.setTimeout(() => setActiveSwara(null), duration * 1000);
      activeTimeoutsRef.current.push(tId);
    } catch (e) {
      console.error('Audio playback error', e);
    }
  };

  const playSequence = (
    notes: string[],
    onStart: () => void,
    onEnd: () => void,
    noteDuration = 0.9
  ) => {
    try {
      stopAllAudio();
      const ctx = getAudioContext();
      const sessionDest = getSessionDestination(ctx);
      onStart();

      let startTime = ctx.currentTime + 0.05;

      notes.forEach((note) => {
        const cleanNote = note.trim();
        const freq = SWARA_FREQS[cleanNote] || 261.63;

        playBambooFluteTone(ctx, freq, startTime, noteDuration, 0.30, sessionDest);

        const swaraTimeout = window.setTimeout(() => {
          setActiveSwara(cleanNote);
        }, Math.max(0, (startTime - ctx.currentTime) * 1000));
        activeTimeoutsRef.current.push(swaraTimeout);

        startTime += noteDuration + 0.15;
      });

      const endTimeout = window.setTimeout(() => {
        setActiveSwara(null);
        onEnd();
        activeTimeoutsRef.current = [];
      }, Math.max(0, (startTime - ctx.currentTime) * 1000 + 100));
      activeTimeoutsRef.current.push(endTimeout);
    } catch (e) {
      console.error('Sequence playback error', e);
      onEnd();
    }
  };

  // Preset Playback Sequences
  const handlePlayAaroh = () => {
    if (isPlayingAaroh) {
      stopAllAudio();
      return;
    }
    playSequence(
      ['S', 'R', 'g', 'P', 'D', "S'"],
      () => setIsPlayingAaroh(true),
      () => setIsPlayingAaroh(false),
      0.95
    );
  };

  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) {
      stopAllAudio();
      return;
    }
    playSequence(
      ["S'", 'D', 'P', 'g', 'R', 'S'],
      () => setIsPlayingAvaroh(true),
      () => setIsPlayingAvaroh(false),
      0.95
    );
  };

  const handlePlayPakad = () => {
    if (isPlayingPakad) {
      stopAllAudio();
      return;
    }
    // S R g R S | g P D P | g R S
    playSequence(
      ['S', 'R', 'g', 'R', 'S', 'g', 'P', 'D', 'P', 'g', 'R', 'S'],
      () => setIsPlayingPakad(true),
      () => setIsPlayingPakad(false),
      0.85
    );
  };

  const handlePlayExercise = (id: number, notes: string[]) => {
    if (playingExercise === id) {
      stopAllAudio();
      return;
    }
    playSequence(
      notes,
      () => setPlayingExercise(id),
      () => setPlayingExercise(null),
      0.75
    );
  };

  const handlePlayAalap = (id: number, notes: string[]) => {
    if (playingAalap === id) {
      stopAllAudio();
      return;
    }
    playSequence(
      notes,
      () => setPlayingAalap(id),
      () => setPlayingAalap(null),
      1.1
    );
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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Metronome Hook
  useEffect(() => {
    let beatInterval: any = null;
    if (isMetronomeActive) {
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
  }, [isMetronomeActive, bpm]);

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const basicInfo = [
    { label: 'Thaat', value: 'Unique Pentatonic (Kafi / Free)', icon: <Compass className="w-4 h-4 text-amber-700" /> },
    { label: 'Jati', value: 'Audav – Audav (5 notes in Ascent & Descent)', icon: <Sliders className="w-4 h-4 text-amber-700" /> },
    { label: 'Time of Day', value: 'Any Time / Calm & Expressive Practice', icon: <Moon className="w-4 h-4 text-indigo-600" /> },
    { label: 'Key Swaras', value: 'S R g P D (Komal Ga • Ma & Ni Omitted)', icon: <Music className="w-4 h-4 text-rose-700" /> },
    { label: 'Characteristic Movement', value: 'Re → Komal Ga & Pa → Dha (Return: g R S)', icon: <Sparkles className="w-4 h-4 text-amber-700" /> },
    { label: 'Sentiment (Rasa)', value: 'Karuna (Pathos), Shringara (Romantic), Devotional', icon: <Heart className="w-4 h-4 text-rose-600" /> },
    { label: 'Difficulty Level', value: 'Beginner to Intermediate Transition', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  const faqs = [
    {
      q: 'Why is Raag Shivranjani so popular for flute learners?',
      a: 'Shivranjani uses only five notes (Sa, Shuddha Re, Komal Ga, Pa, Shuddha Dha). The absence of Ma and Ni keeps the fingering straightforward, allowing players to focus intensely on tone production, breath control, accurate Komal Ga microtonality, and deeply touching meends.'
    },
    {
      q: 'Which notes are strictly omitted in Raag Shivranjani?',
      a: 'Madhyam (Ma) and Nishad (Ni) are strictly omitted in both Aaroh and Avaroh. Inadvertently blowing Ma or Ni ruins the raga’s open, longing pentatonic character.'
    },
    {
      q: 'What is the biggest difference between Bhoopali and Shivranjani?',
      a: 'Both are Audav-Audav pentatonic ragas using S R P D. However, Bhoopali uses Shuddha Gandhar (G), giving it a serene and bright morning/peaceful color, whereas Shivranjani uses Komal Gandhar (g), creating a profoundly soulful, poignant, and melancholic mood.'
    },
    {
      q: 'How should I tune and play Komal Ga on a 6-hole bansuri?',
      a: 'On a standard 6-hole bansuri, Shuddha Ga is played with the first 3 holes closed. To produce Komal Ga, half-close the 3rd hole (or tilt the flute inwards slightly while reducing blowing pressure). Listen closely to the pitch against a steady Tanpura drone.'
    },
    {
      q: 'What is the recommended performance time for Shivranjani?',
      a: 'Unlike strict classical morning or night ragas, Shivranjani is universally practiced and performed at any time. It thrives in calm, quiet settings where the emotional depth and breath spaces can resonate freely.'
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Article / LearningResource JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Raag Shivranjani — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam",
          "headline": "Raag Shivranjani — Complete Guide on Bansuri: Notes, Aaroh, Avaroh, Pakad, Aalap & Learning Piece",
          "description": "Learn Raag Shivranjani with detailed notes, Aaroh, Avaroh, Pakad, characteristics, Aalap practice, flute tips, and an original FluteSangam learning piece.",
          "learningResourceType": "Lesson",
          "educationalLevel": "Beginner to Intermediate",
          "author": {
            "@type": "Organization",
            "name": "FluteSangam",
            "url": "https://flutesangam.com"
          },
          "datePublished": "2026-08-21T00:00:00Z",
          "dateModified": "2026-08-21T23:00:00Z",
          "inLanguage": "en",
          "keywords": ["Raag Shivranjani", "Shivranjani", "Learn Bansuri", "Komal Ga", "Flute Raga", "Hindustani Classical", "FluteSangam"]
        })}
      </script>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-rose-950 via-bamboo-950 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl border border-rose-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-amber-500/10 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none"></div>

        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-amber-200/80 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-white transition cursor-pointer"
            >
              Learn Hub
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-white transition cursor-pointer"
            >
              Ragas
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold truncate max-w-[150px] sm:max-w-none">Raag Shivranjani</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                Hindustani Classical • Audav-Audav • Soulful Pentatonic
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-rose-50 leading-tight" itemProp="headline">
                Raag Shivranjani
              </h1>
              <p className="text-amber-100/90 text-sm sm:text-lg font-medium leading-relaxed">
                Notes, Aaroh, Avaroh, Pakad, Practice Exercises &amp; FluteSangam Original Learning Piece.
              </p>
            </div>

            {/* Timestamps & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-rose-950/80 border border-rose-900/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Published: <strong className="text-white">Aug 21, 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Updated: <strong className="text-white">Aug 21, 2026</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-rose-900/50 hover:bg-rose-800/60 text-amber-100 border border-rose-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                  title="Print or Save Lesson PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
                <button
                  onClick={() => copyToClipboard(window.location.href, 'link')}
                  className="bg-rose-900/50 hover:bg-rose-800/60 text-amber-100 border border-rose-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                  title="Share link"
                >
                  {copiedSection === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'link' ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {basicInfo.map((info, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex items-start gap-3 hover:border-amber-300 transition"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 shrink-0 mt-0.5">
              {info.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                {info.label}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-bamboo-950 mt-0.5 block">
                {info.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 1: INTRODUCTION */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Introduction to Raag Shivranjani</span>
        </h2>
        <div className="text-stone-700 text-sm sm:text-base leading-relaxed space-y-3.5">
          <p>
            <strong>Raag Shivranjani</strong> is a simple, soulful, and highly expressive pentatonic raga. Its limited number of swaras makes it approachable for flute players, while its characteristic use of <strong>Komal Ga (flat 3rd)</strong> gives it a distinctive emotional color.
          </p>
          <p>
            For a flute player, Shivranjani is particularly useful for learning how a small number of notes can create a strong melodic atmosphere. Instead of relying on complicated note combinations, the player learns to focus on <em>intonation, phrasing, breath, meend (glides), and emotional expression</em>.
          </p>
          <p>
            Shivranjani is commonly heard in light-classical music, devotional music, film melodies, and instrumental performances. It can be a good choice for players who have completed basic pentatonic ragas (such as Bhoopali or Durga) and want to begin exploring more expressive raga playing.
          </p>
          <p>
            This guide presents Shivranjani as a practical flute-learning framework. Different musical traditions and performances can interpret the raga somewhat differently, so the characteristic phrases and melodic treatment are more important than treating it as only a fixed scale.
          </p>
        </div>

        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs sm:text-sm text-rose-950 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">FluteSangam Philosophy:</strong>
            Fewer notes mean more musical responsibility. With only five swaras, your tone quality, breath pacing, and delicate pitch inflections take center stage.
          </div>
        </div>
      </section>

      {/* SECTION 2: NOTES & INTERACTIVE SWARA BOARD */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
              <span>Notes of Raag Shivranjani</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Click any swara below to hear its authentic synthesized bamboo flute tone.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] sm:text-xs font-bold bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-200">
              Pentatonic (5 Swaras)
            </span>
            {(activeSwara || isPlayingAaroh || isPlayingAvaroh || isPlayingPakad || playingExercise !== null || playingAalap !== null) && (
              <button
                onClick={stopAllAudio}
                className="px-3.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer animate-pulse"
              >
                <Square className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>Stop Audio</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-stone-700 text-xs sm:text-sm leading-relaxed space-y-2">
          <p>The basic swaras used in the commonly taught Hindustani form of Shivranjani are:</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 font-mono text-xs">
            <li className="p-2.5 bg-stone-50 rounded-xl border border-stone-200"><strong>Sa (S)</strong> — Shuddha</li>
            <li className="p-2.5 bg-stone-50 rounded-xl border border-stone-200"><strong>Re (R)</strong> — Shuddha</li>
            <li className="p-2.5 bg-rose-50 rounded-xl border border-rose-300 text-rose-900 font-bold"><strong>Ga (g)</strong> — Komal</li>
            <li className="p-2.5 bg-stone-50 rounded-xl border border-stone-200"><strong>Pa (P)</strong> — Shuddha</li>
            <li className="p-2.5 bg-stone-50 rounded-xl border border-stone-200"><strong>Dha (D)</strong> — Shuddha</li>
          </ul>
          <p className="text-xs text-stone-600 pt-2">
            The raga is <strong>pentatonic (Audav)</strong>, meaning five swaras form its basic framework.
            Basic note sequence: <strong className="font-mono text-rose-900">S R g P D</strong>. <em>Madhyam (Ma)</em> and <em>Nishad (Ni)</em> are omitted from the basic framework.
          </p>
        </div>

        {/* Interactive Swara Pad */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-amber-50/70 to-rose-50/70 rounded-2xl border border-rose-200/80 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Interactive Swara Keyboard (Middle Octave)</span>
            <span className="text-[11px] text-stone-500">Tap to sound note</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {[
              { label: 'Sa', symbol: 'S', western: 'C4', sub: 'Shuddha' },
              { label: 'Re', symbol: 'R', western: 'D4', sub: 'Shuddha' },
              { label: 'ga', symbol: 'g', western: 'Eb4', sub: 'Komal Ga', highlight: true },
              { label: 'Pa', symbol: 'P', western: 'G4', sub: 'Pancham' },
              { label: 'Dha', symbol: 'D', western: 'A4', sub: 'Shuddha' },
              { label: "Sa'", symbol: "S'", western: 'C5', sub: 'Taar Sa' },
            ].map((sw) => {
              const isPlaying = activeSwara === sw.symbol;
              return (
                <button
                  key={sw.symbol}
                  onClick={() => playSwara(sw.symbol)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-1.5 cursor-pointer touch-manipulation active:scale-95 ${
                    isPlaying 
                      ? 'bg-rose-700 text-white border-rose-800 shadow-md scale-105 ring-2 ring-rose-400' 
                      : sw.highlight
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-300'
                        : 'bg-white hover:bg-amber-100/60 text-stone-900 border-stone-200'
                  }`}
                >
                  <span className="text-base sm:text-xl font-bold font-mono">{sw.symbol}</span>
                  <span className="text-[11px] font-semibold opacity-90">{sw.label}</span>
                  <span className="text-[10px] opacity-70">{sw.western}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${
                    sw.highlight ? 'bg-rose-200 text-rose-900' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {sw.sub}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-600 bg-white/80 p-3 rounded-xl border border-stone-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Komal Ga vs Shuddha Ga:</strong> Compare <code>S R G</code> (Bhoopali — bright, calm) with <code>S R g</code> (Shivranjani — poignant, tender). That single half-step difference transforms the entire mood!
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: AAROH, AVAROH & PAKAD */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Aaroh, Avaroh &amp; Pakad</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Aaroh Card */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Aaroh (Ascent)</span>
              <button
                onClick={handlePlayAaroh}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isPlayingAaroh 
                    ? 'bg-rose-700 text-white shadow-xs' 
                    : 'bg-white border border-stone-300 text-stone-800 hover:bg-amber-50'
                }`}
              >
                {isPlayingAaroh ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAaroh ? 'Stop Aaroh' : 'Listen Aaroh'}</span>
              </button>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200 font-mono text-base sm:text-lg font-bold text-rose-900">
              S R g P D S'
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sa – Re – Komal Ga – Pa – Dha – Sa'
            </p>
            <div className="text-xs text-stone-600 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
              <strong>Practice slowly:</strong> <code>S — R g | P — D S'</code>. Do not rush the transition from Re to Komal Ga. The pitch of Komal Ga should be carefully controlled.
            </div>
          </div>

          {/* Avaroh Card */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Avaroh (Descent)</span>
              <button
                onClick={handlePlayAvaroh}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isPlayingAvaroh 
                    ? 'bg-rose-700 text-white shadow-xs' 
                    : 'bg-white border border-stone-300 text-stone-800 hover:bg-amber-50'
                }`}
              >
                {isPlayingAvaroh ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAvaroh ? 'Stop Avaroh' : 'Listen Avaroh'}</span>
              </button>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200 font-mono text-base sm:text-lg font-bold text-rose-900">
              S' D P g R S
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sa' – Dha – Pa – Komal Ga – Re – Sa
            </p>
            <div className="text-xs text-stone-600 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
              <strong>Practice:</strong> <code>S' — D P | g R S</code>. The descending movement through <code>P g R S</code> is particularly useful for developing the raga's melodic character.
            </div>
          </div>
        </div>

        {/* Pakad Section */}
        <div className="p-5 bg-gradient-to-br from-rose-50/80 to-amber-50/80 rounded-2xl border border-rose-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-900">Pakad (Characteristic Catchphrase)</span>
              <h3 className="text-sm font-semibold text-stone-700">The Soul Signature of Raag Shivranjani</h3>
            </div>
            <button
              onClick={handlePlayPakad}
              className={`self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isPlayingPakad 
                  ? 'bg-rose-700 text-white shadow-xs' 
                  : 'bg-white border border-rose-300 text-rose-950 hover:bg-rose-100'
              }`}
            >
              {isPlayingPakad ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingPakad ? 'Stop Pakad' : 'Listen Full Pakad'}</span>
            </button>
          </div>

          <div className="p-4 bg-white rounded-xl border border-rose-200 font-mono text-sm sm:text-base font-bold text-rose-900 flex flex-wrap items-center justify-between gap-2">
            <span>S R g R S | g P D P | g R S</span>
            <button
              onClick={() => copyToClipboard('S R g R S | g P D P | g R S', 'pakad')}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-sans font-semibold cursor-pointer"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-xs text-stone-600 space-y-2">
            <p><strong>Another useful phrase:</strong> <code className="font-mono font-bold text-rose-900">R g P | g R S</code></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Step 1:</strong>
                <code>S R g R S</code>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Step 2:</strong>
                <code>g P D P</code>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Step 3:</strong>
                <code>g R S</code>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              Connect them slowly: <code>S R g R S | g P D P | g R S</code>. The Komal Ga should remain clearly audible throughout.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THEORETICAL FRAMEWORK */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Theory &amp; Classical Framework</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-sm text-bamboo-950 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-600" /> Time of Performance
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Shivranjani does not have one universally enforced performance-time convention in the way some major Hindustani classical ragas do. It is widely used in light-classical, devotional, film, and instrumental music, where it can appear in different musical contexts.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              For flute practice, you can practice Shivranjani at any time that allows you to concentrate. A calm practice environment can be particularly helpful because the raga benefits from a relaxed and expressive approach.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-sm text-bamboo-950 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-700" /> Thaat &amp; Classification
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Shivranjani does not fit perfectly into the traditional ten-Thaat framework because it is a pentatonic raga with its own characteristic melodic treatment.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              For practical learning, the important point is the swara set: <strong>S R g P D</strong> with Komal Ga. Do not try to understand the raga only through its Thaat. Its identity is better understood through its phrases and melodic movement.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-sm text-bamboo-950 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" /> Jati (Audav-Audav)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Shivranjani is generally classified as <strong>Audav-Audav</strong> in its commonly taught form. This means that five swaras are used in both the ascending (Aaroh) and descending (Avaroh) frameworks.
            </p>
            <p className="text-xs text-stone-600 font-mono">
              Aaroh: S R g P D S' <br />
              Avaroh: S' D P g R S
            </p>
            <p className="text-[11px] text-stone-500">The absence of Ma and Ni gives the raga its open pentatonic character.</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-sm text-bamboo-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" /> Vadi &amp; Samvadi Dynamics
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Traditional sources can differ in their descriptions of the Vadi and Samvadi of Shivranjani. For practical flute learning, greater attention should be given to the characteristic interaction between:
            </p>
            <ul className="text-xs text-stone-600 list-disc pl-4 space-y-1">
              <li><strong>Re → Komal Ga</strong></li>
              <li><strong>Pa → Dha</strong></li>
              <li>Return toward <strong>g R S</strong></li>
            </ul>
            <p className="text-[11px] text-stone-500">
              Rather than focusing only on theoretical labels, listen to where phrases naturally settle and how the swaras are emphasized.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: CHARACTERISTICS OF RAAG SHIVRANJANI */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Characteristics of Raag Shivranjani</span>
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-sm text-bamboo-950">1. Pentatonic Structure</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Shivranjani uses only five basic swaras: <code className="font-mono text-rose-900 font-bold">S R g P D</code>. This makes its basic framework relatively easy to memorize. However, the simplicity of the scale does not mean the raga should be played mechanically.
            </p>
          </div>

          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1.5">
            <h3 className="font-bold text-sm text-rose-950">2. Komal Ga Is Important</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              The most recognizable color of Shivranjani comes from its Komal Ga. Compare <code>S R G</code> with <code>S R g</code>. The second movement has the characteristic darker and more expressive quality associated with Shivranjani. For flute players, accurate Komal Ga is therefore essential.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-sm text-bamboo-950">3. Ma and Ni Are Omitted</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The basic Shivranjani framework does not use <strong>Ma</strong> or <strong>Ni</strong>. This creates wide acoustic intervals between the swaras and gives the raga its open melodic character.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-sm text-bamboo-950">4. Strong Emotional Potential</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Although the raga has only five swaras, it can express a surprisingly wide range of emotions — longing, melancholy, devotion, and romance. The flute's sustained breath tone and ability to perform gentle meends make it particularly effective for Shivranjani.
            </p>
          </div>

          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
            <h3 className="font-bold text-sm text-amber-950">5. Simple Notes, Deeper Expression</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Shivranjani is a good example of why raga music is not simply about the number of notes used. A player can use the same five swaras repeatedly but produce very different results depending on:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-semibold text-amber-900">
              <span className="p-1.5 bg-white rounded-lg border border-amber-200 text-center">Note Duration</span>
              <span className="p-1.5 bg-white rounded-lg border border-amber-200 text-center">Breath &amp; Pressure</span>
              <span className="p-1.5 bg-white rounded-lg border border-amber-200 text-center">Smooth Meend (Glides)</span>
              <span className="p-1.5 bg-white rounded-lg border border-amber-200 text-center">Phrasing &amp; Pauses</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRACTICAL FLUTE EXERCISES (1-6) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
              <span>Progressive Practice Exercises</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Follow these 6 structured steps to build tone stability and accurate Komal Ga intonation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 1,
              title: 'Practice 1 — Basic Aaroh',
              notes: ['S', 'R', 'g', 'P', 'D', "S'"],
              desc: 'Start very slowly. Focus particularly on the R → g transition.',
              notation: 'S R g P D S\''
            },
            {
              id: 2,
              title: 'Practice 2 — Basic Avaroh',
              notes: ["S'", 'D', 'P', 'g', 'R', 'S'],
              desc: 'Keep the descent smooth. Pay close attention to P → g → R → S.',
              notation: 'S\' D P g R S'
            },
            {
              id: 3,
              title: 'Practice 3 — Komal Ga Control',
              notes: ['R', 'g', 'R', 'S', 'R', 'g', 'R', 'S'],
              desc: 'Play R g R, then S R g R S. Repeat slowly to stabilize pitch.',
              notation: 'R g R | S R g R S'
            },
            {
              id: 4,
              title: 'Practice 4 — Pa-Dha Movement',
              notes: ['P', 'D', 'P', 'P', 'D', "S'", "S'", 'D', 'P'],
              desc: 'Play P D P, then P D S\', then descend S\' D P. Keep upper Sa relaxed.',
              notation: 'P D P | P D S\' | S\' D P'
            },
            {
              id: 5,
              title: 'Practice 5 — Complete Framework',
              notes: ['S', 'R', 'g', 'P', 'D', "S'", "S'", 'D', 'P', 'g', 'R', 'S'],
              desc: 'Ascend and descend continuously with Tanpura drone for tone memory.',
              notation: 'S R g P D S\' | S\' D P g R S'
            },
            {
              id: 6,
              title: 'Practice 6 — Phrase Development',
              notes: ['S', 'R', 'g', 'R', 'S', 'R', 'g', 'P', 'g', 'R', 'g', 'P', 'D', 'P', 'g', 'R', 'S'],
              desc: 'Connect two or three phrases seamlessly without stopping.',
              notation: 'S R g R S | R g P g R | g P D P | g R S'
            },
          ].map((ex) => {
            const isPlaying = playingExercise === ex.id;
            return (
              <div key={ex.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-bamboo-950">{ex.title}</span>
                    <button
                      onClick={() => handlePlayExercise(ex.id, ex.notes)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                        isPlaying 
                          ? 'bg-rose-700 text-white' 
                          : 'bg-white border border-stone-300 text-stone-800 hover:bg-rose-50'
                      }`}
                    >
                      {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{isPlaying ? 'Stop' : 'Play'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 font-mono text-xs sm:text-sm font-bold text-rose-900">
                    {ex.notation}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{ex.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: AALAP PRACTICE */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
            <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
            <span>Aalap Practice (Expressive Unmetered Phrases)</span>
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Shivranjani is particularly suitable for developing a slow, expressive Aalap. Start with the lower and middle register rather than immediately jumping to the upper Sa. Leave generous pauses between phrases.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 1,
              title: 'Aalap 1 — Grounding the Sa-Re-ga Foundation',
              notes: ['S', 'R', 'g', 'R', 'S', 'S', 'R', 'g', 'R', 'S'],
              notation: 'S — R g | R — S — | S R g — | R S — — ||'
            },
            {
              id: 2,
              title: 'Aalap 2 — Reaching Out to Pancham (Pa)',
              notes: ['S', 'R', 'g', 'P', 'g', 'R', 'S', 'R', 'g', 'P', 'g', 'R', 'S'],
              notation: 'S R g P | g R S — | R g P — | g R S — ||'
            },
            {
              id: 3,
              title: 'Aalap 3 — Exploring the Upper Middle Register (Dha)',
              notes: ['g', 'P', 'D', 'P', 'g', 'R', 'S', 'R', 'g', 'P', 'g', 'R', 'S'],
              notation: 'g P D — | P g R — | S R g P | g R S — ||'
            },
            {
              id: 4,
              title: 'Aalap 4 — Touching Taar Sa and Gentle Return',
              notes: ['R', 'g', 'P', 'D', "S'", 'D', 'P', 'g', 'P', 'g', 'R', 'S'],
              notation: 'R g P D | S\' — D P | g P g R | S — — — ||'
            },
            {
              id: 5,
              title: 'Aalap 5 — Complete Saptak Expansion',
              notes: ['S', 'R', 'g', 'P', 'D', "S'", 'D', 'P', 'g', 'P', 'D', 'P', 'g', 'R', 'S'],
              notation: 'S R g P | D S\' D P | g P D P | g R S — ||'
            },
          ].map((aal) => {
            const isPlaying = playingAalap === aal.id;
            return (
              <div key={aal.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-300 transition">
                <div className="space-y-1">
                  <span className="font-bold text-xs sm:text-sm text-bamboo-950">{aal.title}</span>
                  <div className="font-mono text-xs sm:text-sm font-bold text-rose-900">
                    {aal.notation}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(aal.notation, `aalap_${aal.id}`)}
                    className="p-2 rounded-xl bg-white border border-stone-300 text-stone-600 hover:text-stone-900 transition cursor-pointer text-xs flex items-center gap-1"
                    title="Copy notation"
                  >
                    {copiedSection === `aalap_${aal.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handlePlayAalap(aal.id, aal.notes)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isPlaying 
                        ? 'bg-rose-700 text-white' 
                        : 'bg-white border border-rose-300 text-rose-950 hover:bg-rose-100'
                    }`}
                  >
                    {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: MEEND (GLIDES) PRACTICE */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Meend (Graceful Glides) Practice</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Meend can add significant emotional expression to Shivranjani. Practice gentle continuous glides without breaking your air stream:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs sm:text-sm font-bold text-center">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-rose-950">R ~ g</div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-rose-950">g ~ P</div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-rose-950">P ~ D</div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-rose-950">D ~ P</div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 text-rose-950">P ~ g ~ R (Key)</div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-rose-950">R ~ S</div>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700 space-y-1.5">
          <strong className="text-amber-950 block font-bold">💡 Flute Technique Tip for Meend:</strong>
          <p>
            The movement <code>P ~ g ~ R</code> is particularly useful for developing a smooth descending phrase. Keep the meend controlled — slowly roll your finger off the tone holes instead of snapping fingers. Do not slide between every pair of notes; preserve clarity!
          </p>
        </div>
      </section>

      {/* SECTION 9: COMMON MISTAKES */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Common Mistakes &amp; How to Avoid Them</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              title: '1. Playing Shuddha Ga by Habit',
              desc: 'This is the most critical mistake. Playing pure natural G instead of Komal g turns it into Bhoopali.',
              fix: 'Tip: Spend extra warm-up time tuning R → g against a Tanpura.'
            },
            {
              title: '2. Accidentally Blowing Ma or Ni',
              desc: 'Because these notes are in major scales, muscle memory can accidentally slip them in.',
              fix: 'Tip: Practice slowly and consciously keep 4th/6th hole fingers stationary.'
            },
            {
              title: '3. Treating It Like a Speed Scale',
              desc: 'Simply running up and down S R g P D S\' quickly will sound mechanical and cold.',
              fix: 'Tip: Learn phrases, sustain long notes, and develop Aalap phrasing.'
            },
            {
              title: '4. Playing Too Fast Too Early',
              desc: 'Fast tempo conceals pitch instability on Komal Ga.',
              fix: 'Tip: Practice slowly at 50–60 BPM until the pitch is rock solid.'
            },
            {
              title: '5. Overusing Meend on Every Note',
              desc: 'Too much continuous sliding makes the notes sound muddy and indistinct.',
              fix: 'Tip: Use meend selectively to connect meaningful phrase highlights.'
            },
            {
              title: '6. Ignoring Pauses & Silence',
              desc: 'Filling every beat without breath pauses ruins the raga\'s contemplative depth.',
              fix: 'Tip: Let the melody breathe and allow the drone resonance to fill spaces.'
            },
          ].map((m, idx) => (
            <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">{m.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{m.desc}</p>
              <p className="text-[11px] font-semibold text-rose-800 bg-rose-50/80 p-2 rounded-lg border border-rose-200 mt-1">{m.fix}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FLUTESANGAM ORIGINAL LEARNING PIECE */}
      <section className="bg-gradient-to-br from-rose-950 via-bamboo-950 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-rose-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
              100% Original Practice Composition
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-rose-50 mt-1">
              FluteSangam Original Learning Piece (Shivranjani)
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5">
              Newly created specifically for this guide to practice phrase phrasing, Komal Ga, and smooth resolution.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsMetronomeActive(!isMetronomeActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isMetronomeActive 
                  ? 'bg-amber-500 text-bamboo-950' 
                  : 'bg-rose-900/60 text-amber-200 border border-rose-700 hover:bg-rose-800/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isMetronomeActive ? `Metronome (${bpm} BPM)` : 'Turn On Metronome'}</span>
            </button>
          </div>
        </div>

        {/* Metronome & Beat Display if active */}
        {isMetronomeActive && (
          <div className="p-4 bg-rose-900/40 rounded-2xl border border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-200 font-semibold">BPM Speed:</span>
              <input
                type="range"
                min="40"
                max="100"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-32 accent-amber-400 cursor-pointer"
              />
              <span className="text-xs font-bold font-mono text-white">{bpm} BPM</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((b) => (
                <div
                  key={b}
                  className={`w-4 h-4 rounded-md text-[9px] font-bold flex items-center justify-center transition-all ${
                    currentBeat === b 
                      ? 'bg-amber-400 text-bamboo-950 scale-125 font-bold shadow-xs' 
                      : b === 1
                        ? 'bg-rose-700/80 text-rose-200'
                        : 'bg-rose-950/80 text-rose-400'
                  }`}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The 5 Composition Sections */}
        <div className="space-y-4">
          {[
            {
              key: 'piece_aalap',
              title: '1. Aalap (Introduction)',
              notation: 'S R g R | S — — — |\nR g P — | g R S — ||',
              instruction: 'Play gently and allow each phrase to settle comfortably before moving forward.'
            },
            {
              key: 'piece_main',
              title: '2. Main Phrase (Sthayi Theme)',
              notation: 'S R g P | D P g R |\nS R g P | g R S — ||',
              instruction: 'Focus intensely on the crisp, emotive intonation of Komal Ga (g).'
            },
            {
              key: 'piece_dev',
              title: '3. Development (Antara Movement to Upper Sa)',
              notation: 'R g P D | S\' D P g |\nR g P g | R S — — ||\nThen:\nS R g P | D S\' D P |\ng P D P | g R S — ||',
              instruction: 'Transition smoothly into the upper octave without over-blowing or blowing sharp.'
            },
            {
              key: 'piece_var',
              title: '4. Variation (Lyrical Flow)',
              notation: 'S R g P | D P g R |\nR g P D | S\' D P — |\ng P D P | g R S R |\ng R S — — — ||',
              instruction: 'Play this only after the Main Phrase and Development feel effortless.'
            },
            {
              key: 'piece_end',
              title: '5. Ending (Tihai / Resolution to Sa)',
              notation: 'R g P | g R S — |\nS R g R | S — — — ||',
              instruction: 'Resolve gently to Sa and let the tone fade into silence.'
            },
          ].map((sec) => (
            <div key={sec.key} className="p-4 sm:p-5 bg-rose-950/70 rounded-2xl border border-rose-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-sm sm:text-base text-rose-100">{sec.title}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(sec.notation, sec.key)}
                    className="px-2.5 py-1 rounded-xl bg-rose-900/60 border border-rose-700 text-amber-200 text-xs font-semibold hover:bg-rose-800 transition cursor-pointer flex items-center gap-1"
                  >
                    {copiedSection === sec.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === sec.key ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-black/40 rounded-xl border border-rose-900 font-mono text-xs sm:text-sm text-amber-200 whitespace-pre-wrap leading-relaxed">
                {sec.notation}
              </pre>
              <p className="text-xs text-rose-200/80 italic">{sec.instruction}</p>
            </div>
          ))}
        </div>

        {/* How to practice steps */}
        <div className="p-4 sm:p-5 bg-black/30 rounded-2xl border border-rose-900 space-y-3">
          <h3 className="font-bold text-sm text-amber-300">How to Practice the FluteSangam Original Learning Piece</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-rose-100/90">
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-900">
              <strong className="text-amber-300 block">Step 1 — Learn the Aalap:</strong>
              Play the Aalap slowly using long, relaxed breaths.
            </div>
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-900">
              <strong className="text-amber-300 block">Step 2 — Learn the Main Phrase:</strong>
              Repeat <code>S R g P | D P g R</code> until the phrase feels natural.
            </div>
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-900">
              <strong className="text-amber-300 block">Step 3 — Focus on Komal Ga:</strong>
              Practice <code>R g R</code> before playing the full composition.
            </div>
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-900">
              <strong className="text-amber-300 block">Step 4 — Add the Development:</strong>
              Introduce the upper Sa gradually.
            </div>
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-900">
              <strong className="text-amber-300 block">Step 5 — Add the Variation:</strong>
              Play the variation at a comfortable tempo.
            </div>
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-900">
              <strong className="text-amber-300 block">Step 6 — Finish With the Ending:</strong>
              Allow the final Sa to settle naturally.
            </div>
          </div>
          <p className="text-[11px] text-amber-200/70 pt-1">
            Complete sequential structure: <strong>Aalap → Main Phrase → Development → Variation → Ending</strong>
          </p>
        </div>
      </section>

      {/* SECTION 11: PRACTICE TIPS & WHY/WHO SHOULD LEARN */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Flute Practice Tips for Raag Shivranjani</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">Practice With a Tanpura</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              A Tanpura drone gives you a stable tonal reference and helps you tune Komal Ga accurately without drifting sharp.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">Spend Extra Time on Komal Ga</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The movement <code>R → g</code> should become completely comfortable before you attempt fast phrases or taans.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">Use Long Notes (Kharaj/Sadhana)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Try sustaining <code>S → R → g → P → D</code> for 5–8 seconds each. Listen carefully to pitch stability and embouchure.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">Middle Register First</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Develop a stable tone in the middle octave (Madhya Saptak) before expanding into upper register (Taar Saptak) notes.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 sm:col-span-2">
            <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">Create Your Own Phrases</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Once you understand the basic language, try creating short phrases such as <code>S R g P | g R S</code> or <code>R g P D | P g R</code>. This is an excellent way to develop improvisational confidence.
            </p>
          </div>
        </div>

        {/* Why and Who Should Learn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2">
            <h3 className="font-bold text-sm text-rose-950">Why Learn Raag Shivranjani?</h3>
            <ul className="text-xs text-stone-700 space-y-1 list-disc pl-4">
              <li>Komal Ga control &amp; microtonal intonation</li>
              <li>Accurate pitch stabilization with Tanpura</li>
              <li>Breath control &amp; sustained dynamic volume</li>
              <li>Graceful meend &amp; phrase development</li>
              <li>Aalap technique &amp; emotional melodic expression</li>
              <li>Upper-register control &amp; improvisational confidence</li>
              <li>Understanding of soulful pentatonic raga structures</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
            <h3 className="font-bold text-sm text-amber-950">Who Should Learn Raag Shivranjani?</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Shivranjani is suitable for flute players who are comfortable with:
            </p>
            <ul className="text-xs text-stone-700 space-y-1 list-disc pl-4">
              <li>Basic flute fingering &amp; hole coverage</li>
              <li>Sa Re Ga Ma concepts &amp; notation reading</li>
              <li>Long-note practice &amp; steady blowing</li>
              <li>Simple Aalap &amp; basic meends</li>
            </ul>
            <p className="text-[11px] text-stone-600 pt-1">
              It can be introduced at the beginner-to-intermediate transition because the note structure is simple while the expressive possibilities are immense.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 12: 55-MINUTE DAILY PRACTICE ROUTINE WITH TIMER */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
              <span>Raag Shivranjani Practice Routine (55 Min)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">A focused, time-tested framework to master tone and expression.</p>
          </div>

          {/* Interactive Countdown Timer */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <div className="font-mono text-sm font-bold text-bamboo-950 px-3 py-1 bg-white rounded-xl shadow-2xs">
              {formatTimer(timerSeconds)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                isTimerRunning 
                  ? 'bg-rose-700 text-white' 
                  : 'bg-bamboo-700 text-white hover:bg-bamboo-800'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(55 * 60);
              }}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-200 transition cursor-pointer"
              title="Reset timer to 55 min"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm">
          {[
            { time: '5 Minutes', title: 'Long Notes (Sadhana)', desc: 'Sustain Sa, Re, Komal Ga, Pa, and Dha for several breaths each.' },
            { time: '10 Minutes', title: 'Aaroh & Avaroh', desc: 'Practice S R g P D S\' and S\' D P g R S smoothly with Tanpura.' },
            { time: '10 Minutes', title: 'Komal Ga Focus', desc: 'Practice R g R and S R g R S until the half-hole/tilt pitch is stable.' },
            { time: '10 Minutes', title: 'Pakad Mastery', desc: 'Practice S R g R S | g P D P | g R S with natural accents.' },
            { time: '10 Minutes', title: 'Aalap Phrasing', desc: 'Create slow, expressive lines leaving generous breathing pauses.' },
            { time: '10 Minutes', title: 'FluteSangam Original Learning Piece', desc: 'Practice the composition section by section with metronome.' },
            { time: '5 Minutes', title: 'Free Playing & Improvisation', desc: 'Put notation aside and create your own soulful melodies using S R g P D.' },
          ].map((step, idx) => (
            <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 hover:border-amber-300 transition">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-rose-900 bg-rose-100 px-2.5 py-1 rounded-lg shrink-0">
                  {step.time}
                </span>
                <strong className="text-stone-800 text-xs sm:text-sm">{step.title}</strong>
              </div>
              <span className="text-xs text-stone-600">{step.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 13: FINAL THOUGHTS */}
      <section className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-rose-200 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Final Thoughts</span>
        </h2>
        <div className="text-stone-700 text-xs sm:text-sm leading-relaxed space-y-3">
          <p>
            Raag Shivranjani demonstrates how five carefully chosen swaras can create a deeply expressive musical world.
          </p>
          <p>
            For a flute player, the main focus should not be speed or complicated patterns. Instead, concentrate on:
          </p>
          <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs font-bold text-rose-950 text-center flex flex-wrap items-center justify-center gap-2">
            <span>Accurate Komal Ga</span>
            <span>→</span>
            <span>Clean Phrasing</span>
            <span>→</span>
            <span>Controlled Breath</span>
            <span>→</span>
            <span>Meend</span>
            <span>→</span>
            <span>Expression</span>
          </div>
          <p>
            Begin with <code>S R g P D S'</code> and <code>S' D P g R S</code>. Then gradually move toward Pakad, Aalap, and improvisation. Once the basic phrases become comfortable, close the notation and try to create your own short melodies. This is where the raga starts becoming a musical language rather than just a collection of notes.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-300 text-xs sm:text-sm text-rose-950 flex items-start gap-3 shadow-2xs">
          <Award className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">FluteSangam Golden Tip:</strong>
            In Shivranjani, fewer notes mean more responsibility. When the swara choices are limited, your pitch, breath, pauses, and phrasing become the music.
          </div>
        </div>
      </section>

      {/* SECTION 14: FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
            <span>Raag Shivranjani FAQ</span>
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-bamboo-950 bg-stone-50 hover:bg-stone-100 flex items-center justify-between gap-3 cursor-pointer transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 15: RELATED RAGAS & LEARNING GUIDES */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs border border-stone-200 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-950 font-display flex items-center gap-2.5">
          <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700 shrink-0" />
          <span>Explore Related Ragas &amp; Flute Guides</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { name: 'Raag Bhoopali', view: 'raga_bhoopali' as AppView, desc: 'Pure Shuddha pentatonic (S R G P D) — compare G with Komal g.', level: 'Beginner' },
            { name: 'Raag Durga', view: 'raga_durga' as AppView, desc: 'Pentatonic omitting Ga and Ni (S R M P D) for crisp agility.', level: 'Beginner' },
            { name: 'Raag Pahadi', view: 'raga_pahadi' as AppView, desc: 'Soulful folk raga with Mandra saptak reaches and lyrical glides.', level: 'Intermediate' },
            { name: 'Raag Kafi', view: 'raga_kafi' as AppView, desc: 'Foundation of Komal Ga & Komal Ni in Hindustani music.', level: 'Intermediate' },
            { name: 'Raag Bhimpalasi', view: 'raga_bhimpalasi' as AppView, desc: 'Afternoon raga balancing deep devotion with Komal Ga and Ni.', level: 'Intermediate' },
            { name: 'Live Flute Tuner', view: 'learn_tuner' as AppView, desc: 'Mic-based real-time 440Hz pitch detector to tune Komal Ga.', level: 'Practice Tool' },
          ].map((r, idx) => (
            <button
              key={idx}
              onClick={() => onViewChange?.(r.view)}
              className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-xs transition text-left bg-white group flex flex-col justify-between cursor-pointer space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
                  <span>{r.level}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="font-bold text-sm text-bamboo-950 group-hover:text-rose-900 transition">{r.name}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 16: ABOUT AUTHOR SECTION */}
      <AboutAuthorSection />

    </div>
  );
};

export default RagaShivranjaniView;
