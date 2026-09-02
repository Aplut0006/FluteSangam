import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Sun, Calendar, CheckCircle2, Play, Pause, Square,
  Volume2, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, AlertCircle,
  Compass, Zap, Share2, Sliders, Award, Sparkles, ShieldAlert, 
  Lightbulb, ArrowLeft, RefreshCw, RotateCcw, Feather, Heart, Radio,
  HelpCircle, ArrowRight, Printer
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface RagaJaunpuriViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale (Middle C = 261.63 Hz)
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'P(lower)': 196.00,
  'P.': 196.00,
  'd(lower)': 207.65,
  'd.': 207.65,
  'n(lower)': 233.08,
  'n.': 233.08,

  // Middle Octave (Madhya Saptak)
  'S': 261.63,
  'Sa': 261.63,
  'R': 293.66,       // Shuddha Re
  'Re': 293.66,
  'g': 311.13,       // Komal Ga (Eb)
  'ga': 311.13,
  'G': 329.63,       // Shuddha Ga (E) - for comparison
  'Ga': 329.63,
  'M': 349.23,       // Shuddha Ma (F)
  'Ma': 349.23,
  'P': 392.00,       // Shuddha Pa (G)
  'Pa': 392.00,
  'd': 415.30,       // Komal Dha (Ab)
  'dha': 415.30,
  'D': 440.00,       // Shuddha Dha (A) - for comparison
  'Dha': 440.00,
  'n': 466.16,       // Komal Ni (Bb)
  'ni': 466.16,
  'N': 493.88,       // Shuddha Ni (B) - for comparison
  'Ni': 493.88,

  // High Octave (Taar Saptak)
  "S'": 523.25,
  "Sa'": 523.25,
  "R'": 587.33,
  "Re'": 587.33,
  "g'": 622.25,      // High Komal Ga
  "ga'": 622.25,
  "M'": 698.46,
  "Ma'": 698.46,
  "P'": 783.99,
  "Pa'": 783.99,
  "d'": 830.61,      // High Komal Dha
  "dha'": 830.61,
  "n'": 932.33,      // High Komal Ni
  "ni'": 932.33,
};

export const RagaJaunpuriView: React.FC<RagaJaunpuriViewProps> = ({ onViewChange }) => {
  // Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingPhrase, setPlayingPhrase] = useState<number | null>(null);

  // Active swara highlight
  const [activeSwara, setActiveSwara] = useState<string | null>(null);

  // UI Modals & Tool states
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [bpm, setBpm] = useState(64);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(60 * 60); // 60 mins practice
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio Context & Active Session Master Gain
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeTimeoutsRef = useRef<number[]>([]);

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
    setPlayingExercise(null);
    setPlayingPhrase(null);
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
    onComplete?: () => void,
    noteDuration = 0.8,
    tempoFactor = 1.0
  ) => {
    stopAllAudio();
    const ctx = getAudioContext();
    const sessionDest = getSessionDestination(ctx);
    const duration = noteDuration / tempoFactor;
    const interval = duration * 1000 * 0.95;

    notes.forEach((note, index) => {
      const tId = window.setTimeout(() => {
        const cleanNote = note.trim();
        if (cleanNote && cleanNote !== '—' && cleanNote !== '|' && cleanNote !== '||' && cleanNote !== '~') {
          const freq = SWARA_FREQS[cleanNote] || 261.63;
          playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.3, sessionDest);
          setActiveSwara(cleanNote);
        } else {
          setActiveSwara(null);
        }

        if (index === notes.length - 1) {
          const endTId = window.setTimeout(() => {
            setActiveSwara(null);
            if (onComplete) onComplete();
          }, duration * 1000);
          activeTimeoutsRef.current.push(endTId);
        }
      }, index * interval);

      activeTimeoutsRef.current.push(tId);
    });
  };

  // Playback Handlers
  const handlePlayAaroh = () => {
    if (isPlayingAaroh) {
      stopAllAudio();
    } else {
      setIsPlayingAaroh(true);
      const notes = ['S', 'R', 'M', 'P', 'd', 'n', "S'"];
      playSequence(notes, () => setIsPlayingAaroh(false), 0.9);
    }
  };

  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) {
      stopAllAudio();
    } else {
      setIsPlayingAvaroh(true);
      const notes = ["S'", 'n', 'd', 'P', 'M', 'g', 'R', 'S'];
      playSequence(notes, () => setIsPlayingAvaroh(false), 0.9);
    }
  };

  const handlePlayExercise = (index: number, notes: string[]) => {
    if (playingExercise === index) {
      stopAllAudio();
    } else {
      setPlayingExercise(index);
      playSequence(notes, () => setPlayingExercise(null), 0.75);
    }
  };

  const handlePlayPhrase = (index: number, notes: string[]) => {
    if (playingPhrase === index) {
      stopAllAudio();
    } else {
      setPlayingPhrase(index);
      playSequence(notes, () => setPlayingPhrase(null), 0.8);
    }
  };

  // Practice Timer Hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Metronome Hook
  useEffect(() => {
    let beatInterval: NodeJS.Timeout | null = null;
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      beatInterval = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev + 1) % 16;
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

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const basicInfo = [
    { label: 'Thaat', value: 'Asavari Thaat', icon: <Compass className="w-4 h-4 text-amber-700" /> },
    { label: 'Jati', value: 'Shadav – Sampurna (6 in Aaroh, 7 in Avaroh)', icon: <Sliders className="w-4 h-4 text-amber-700" /> },
    { label: 'Time of Day', value: 'Late Morning (2nd Quarter: 9 AM – 12 PM)', icon: <Sun className="w-4 h-4 text-amber-600" /> },
    { label: 'Key Swaras', value: 'Komal Ga (g), Komal Dha (d), Komal Ni (n)', icon: <Music className="w-4 h-4 text-rose-700" /> },
    { label: 'Vadi / Samvadi', value: 'Vadi: Komal Dha (d) | Samvadi: Komal Ga (g)', icon: <Award className="w-4 h-4 text-amber-700" /> },
    { label: 'Characteristic Ascent', value: 'S R M P d n S\' (Ga omitted in straight Aaroh)', icon: <Sparkles className="w-4 h-4 text-amber-700" /> },
    { label: 'Sentiment (Rasa)', value: 'Serious, Introspective, Longing, Tender Melancholy', icon: <Heart className="w-4 h-4 text-rose-600" /> },
    { label: 'Difficulty Level', value: 'Intermediate (Nuanced Komal Notes & Meend)', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  const faqs = [
    {
      q: 'Why is Ga commonly omitted in the Aaroh of Raag Jaunpuri?',
      a: 'In Jaunpuri, the straightforward ascent takes the direct route S R M P d n S\'. Omission of Gandhar in the ascent gives the raga its distinctive Shadav character and prevents it from sounding like flat scalar scales. Ga enters prominently in descending phrases like M g R S.'
    },
    {
      q: 'What makes Raag Jaunpuri different from Raag Asavari?',
      a: 'While both belong to Asavari Thaat, Asavari is Audav-Sampurna (omitting both Ga and Ni in ascent: S R M P d S\') with strong Rishabh (R) treatment. Jaunpuri takes Nishad in its ascent (S R M P d n S\') and emphasizes Komal Dha and Komal Ga with fluid descending meends.'
    },
    {
      q: 'How do I produce clean Komal Ga (g), Komal Dha (d), and Komal Ni (n) on a 6-hole bansuri?',
      a: 'On a standard 6-hole bansuri tuned to Sa: Komal Ga is played by half-closing the 3rd hole (or adjusting flute angle/air temperature); Komal Dha is played by half-closing the 6th hole (or venting 5th/6th according to scale); and Komal Ni is played by opening hole 6 while partially shading hole 5. Practicing against a steady Tanpura drone is essential.'
    },
    {
      q: 'Why are descending movements (Avaroh) so emphasized in Jaunpuri?',
      a: 'The emotional soul and melodic identity of Jaunpuri reside in its descending contours, particularly S\' n d P M g R S and M g R S. Practicing the descent develops controlled breath release, smooth meend glides, and rock-solid pitch stability on Komal notes.'
    },
    {
      q: 'Can beginners start learning Raag Jaunpuri directly?',
      a: 'Jaunpuri is best learned as an intermediate raga after you have solid confidence with basic ragas like Bhoopali, Yaman, Kafi, or Bhimpalasi. Because it employs three Komal notes (g, d, n), good breath control and finger half-hole precision are prerequisite.'
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Article / LearningResource JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Raag Jaunpuri — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam",
          "headline": "Raag Jaunpuri — Complete Guide on Bansuri: Notes, Aaroh, Avaroh, Pakad, Aalap & Learning Piece",
          "description": "Learn Raag Jaunpuri with notes, Aaroh, Avaroh, Pakad, characteristics, Aalap exercises, flute practice tips, and an original FluteSangam learning piece.",
          "learningResourceType": "Lesson",
          "educationalLevel": "Intermediate",
          "author": {
            "@type": "Organization",
            "name": "FluteSangam",
            "url": "https://flutesangam.com"
          },
          "datePublished": "2026-09-02T00:00:00Z",
          "dateModified": "2026-09-02T12:00:00Z",
          "inLanguage": "en",
          "keywords": ["Raag Jaunpuri", "Jaunpuri Bansuri", "Learn Bansuri", "Asavari Thaat", "Komal Ga", "Komal Dha", "Komal Ni", "Indian Flute Notations", "FluteSangam"]
        })}
      </script>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl border border-amber-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none"></div>

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
            <span className="text-amber-400 font-bold truncate max-w-[150px] sm:max-w-none">Raag Jaunpuri</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-2 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sun className="w-3.5 h-3.5" />
                <span>Asavari Thaat • Late Morning Raga (9 AM – 12 PM)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white">
                Raag Jaunpuri
              </h1>
              <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
                A graceful, expressive, and introspective classical raga featuring Komal Ga, Komal Dha, and Komal Ni. Master nuanced Komal swaras, gliding descending phrases, and classical phrasing on Indian bamboo flute.
              </p>
            </div>

            {/* Timestamps & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-amber-950/80 border border-amber-800/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Published: <strong className="text-white">Sep 2, 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Updated: <strong className="text-white">Sep 2, 2026</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-900/50 hover:bg-amber-800/60 text-amber-100 border border-amber-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                  title="Print or Save Lesson PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
                <button
                  onClick={() => copyToClipboard(window.location.href, 'link')}
                  className="bg-amber-900/50 hover:bg-amber-800/60 text-amber-100 border border-amber-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                  title="Share link"
                >
                  {copiedSection === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'link' ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-amber-200/70 block">Jati (Ascent/Descent)</span>
              <span className="font-bold text-white text-sm">Shadav – Sampurna</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-amber-200/70 block">Vadi / Samvadi</span>
              <span className="font-bold text-white text-sm">d (Dha) / g (Ga)</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-amber-200/70 block">Komal Swaras</span>
              <span className="font-bold text-amber-300 text-sm">g, d, n</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-amber-200/70 block">Omitted in Aaroh</span>
              <span className="font-bold text-emerald-300 text-sm">Gandhar (Ga)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information & Technical DNA Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Technical DNA of Raag Jaunpuri</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Essential classical framework, swara grammar, and traditional performance rules</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {basicInfo.map((info, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {info.icon}
                <span>{info.label}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-amber-100">{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Introduction & Flute Context */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Feather className="w-5 h-5 text-amber-600" />
          <span>Introduction & Character</span>
        </h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base space-y-3 leading-relaxed">
          <p>
            <strong>Raag Jaunpuri</strong> is a graceful and expressive Hindustani classical raga known for its serious, introspective, and gently melancholic character. Its use of <strong>Komal Ga (g), Komal Dha (d), and Komal Ni (n)</strong> gives the raga a distinctive emotional depth, while its characteristic descending movements make it especially rewarding to explore on the flute.
          </p>
          <p>
            For flute players, Jaunpuri is an excellent intermediate-level raga. It introduces more nuanced treatment of Komal swaras while remaining approachable for someone who already has experience with ragas such as Bhoopali, Yaman, Kafi, Bhimpalasi, or Khamaj.
          </p>
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Skills Developed by Practicing Raag Jaunpuri:</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Komal swara accuracy</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Controlled meend</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Descending phrases</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Breath control</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aalap development</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Phrase recognition</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Emotional expression</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Improvisational confidence</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 italic">
            *Note: Although its basic note framework is not extremely complicated, Jaunpuri should not be treated simply as an ascending and descending scale. Its identity comes from how the notes are approached, emphasized, connected, and resolved.
          </p>
        </div>
      </div>

      {/* Swaras, Interactive Notations, Aaroh, Avaroh, Pakad */}
      <div className="space-y-6">
        {/* Swaras Interactive Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-600" />
                <span>Swaras Used in Raag Jaunpuri</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">Tap any swara pill to hear its exact microtone on Indian Bamboo Flute</p>
            </div>
            <div className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-3 py-1.5 rounded-lg font-mono font-bold">
              S R g M P d n S'
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 pt-2">
            {[
              { note: 'S', type: 'Shuddha Sa', tone: 'Tonic Root', half: false },
              { note: 'R', type: 'Shuddha Re', tone: 'Major 2nd', half: false },
              { note: 'g', type: 'Komal Ga', tone: 'Minor 3rd (Eb)', half: true },
              { note: 'M', type: 'Shuddha Ma', tone: 'Perfect 4th', half: false },
              { note: 'P', type: 'Shuddha Pa', tone: 'Perfect 5th', half: false },
              { note: 'd', type: 'Komal Dha', tone: 'Minor 6th (Ab)', half: true },
              { note: 'n', type: 'Komal Ni', tone: 'Minor 7th (Bb)', half: true },
            ].map((sw, i) => (
              <button
                key={i}
                onClick={() => playSwara(sw.note)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSwara === sw.note
                    ? 'bg-amber-500 text-slate-950 border-amber-600 scale-105 shadow-md'
                    : sw.half
                    ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-rose-400 text-slate-900 dark:text-white'
                    : 'bg-amber-50/40 dark:bg-slate-800 border-amber-100 dark:border-slate-700 hover:border-amber-300 text-slate-900 dark:text-white'
                }`}
              >
                <span className={`text-lg font-bold font-mono ${sw.half ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-amber-200'}`}>
                  {sw.note}
                </span>
                <span className="text-[11px] font-medium">{sw.type}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{sw.tone}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-amber-100 dark:border-slate-800">
            <strong>Flute Technique Tip:</strong> The three Komal swaras (<strong>g, d, n</strong>) give Jaunpuri much of its characteristic color. For flute players, these notes deserve additional attention because small pitch inaccuracies can noticeably affect the character of the raga.
          </p>
        </div>

        {/* Aaroh, Avaroh, Pakad Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Aaroh */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-amber-200/70 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">Aaroh (Ascent)</span>
                <span className="text-[11px] text-slate-500 font-medium">6 Swaras (Ga omitted)</span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-slate-800/70 rounded-xl border border-amber-100 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-amber-100 tracking-wider">
                S R M P d n S'
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sa – Re – Ma – Pa – Komal Dha – Komal Ni – Sa'. Do not rush Komal Dha and Komal Ni.
              </p>
            </div>
            <button
              onClick={handlePlayAaroh}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                isPlayingAaroh
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
              }`}
            >
              {isPlayingAaroh ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingAaroh ? 'Stop Aaroh' : 'Play Aaroh (Audio)'}</span>
            </button>
          </div>

          {/* Avaroh */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-amber-200/70 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">Avaroh (Descent)</span>
                <span className="text-[11px] text-slate-500 font-medium">7 Swaras (Sampurna)</span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-slate-800/70 rounded-xl border border-amber-100 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-amber-100 tracking-wider">
                S' n d P M g R S
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sa' – Komal Ni – Komal Dha – Pa – Ma – Komal Ga – Re – Sa. The phrase <strong>M g R S</strong> establishes the emotional soul.
              </p>
            </div>
            <button
              onClick={handlePlayAvaroh}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                isPlayingAvaroh
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
              }`}
            >
              {isPlayingAvaroh ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingAvaroh ? 'Stop Avaroh' : 'Play Avaroh (Audio)'}</span>
            </button>
          </div>

          {/* Pakad */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-amber-200/70 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">Pakad (Catch Phrase)</span>
                <button
                  onClick={() => copyToClipboard('M P d M P | M g R M | g R S', 'pakad')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
                  title="Copy notation"
                >
                  {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-slate-800/70 rounded-xl border border-amber-100 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-amber-100 tracking-wider">
                M P d M P | M g R M | g R S
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Key anchor: <strong>M P d M P</strong> resolving seamlessly into <strong>M g R S</strong>.
              </p>
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium bg-amber-50/70 dark:bg-slate-800/50 p-2.5 rounded-lg border border-amber-100 dark:border-slate-700">
              Signature motif identifying Raag Jaunpuri. Emphasizes descending resolution into Gandhar and Sa.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sadhana Practice Suite: Metronome & Practice Timer */}
      <div className="bg-gradient-to-r from-amber-900/90 via-bamboo-900/90 to-amber-950 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-amber-700/50 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <span>Interactive Raga Sadhana Toolset</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80">Keep steady laya and time your 60-minute daily Jaunpuri practice session</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30 text-amber-300">
              Live Tempo: {bpm} BPM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Metronome Control */}
          <div className="bg-black/30 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Rhythmic Metronome (Teentaal 16-Matra)</span>
              </span>
              <button
                onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isMetronomeActive ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                }`}
              >
                {isMetronomeActive ? 'Pause Click' : 'Start Metronome'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="40"
                max="140"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-sm font-mono font-bold w-16 text-right">{bpm} BPM</span>
            </div>

            {/* 16 Beat Visualizer */}
            <div className="grid grid-cols-16 gap-1 pt-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-xs transition-all ${
                    currentBeat === i
                      ? i === 0 ? 'bg-amber-300 scale-125 shadow-sm shadow-amber-300' : 'bg-emerald-400 scale-110'
                      : i % 4 === 0 ? 'bg-white/30' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-amber-200/60 font-mono">
              <span>Sam (1)</span>
              <span>Taali (5)</span>
              <span>Khaali (9)</span>
              <span>Taali (13)</span>
            </div>
          </div>

          {/* 60-Min Practice Timer */}
          <div className="bg-black/30 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Jaunpuri Sadhana Timer (60 Mins)</span>
              </span>
              <div className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300">
                {isTimerRunning ? 'Active' : 'Paused'}
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-amber-300 tracking-wider">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold'
                }`}
              >
                {isTimerRunning ? 'Pause Timer' : 'Start Sadhana Timer'}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(60 * 60);
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition cursor-pointer"
                title="Reset to 60 Mins"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Six Key Characteristics for Flute Learners */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Core Characteristics of Raag Jaunpuri on Flute</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">6 essential nuances flute players must master to bring out the raga’s soul</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">1</span>
              <span>Komal Ga (g) Control</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Komal Ga is particularly important in descending movements. Practice <code>M g R S</code> and <code>P M g R S</code> slowly. The Ga should clearly sound Komal rather than drifting upward toward Shuddha Ga.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">2</span>
              <span>Komal Dha (d) Control</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Komal Dha contributes strongly to the character of Jaunpuri. Practice <code>P d P</code> and <code>M P d M P</code>. Pay careful attention to pitch intonation before adding fast ornamentation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">3</span>
              <span>Komal Ni (n) in Upper Register</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Komal Ni appears prominently in descending upper-register movements. Practice <code>S' n d P</code> and <code>S' n d P M</code>. Keep your embouchure and upper-register tone relaxed and sweet.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">4</span>
              <span>Ga Omitted in Straight Aaroh</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              A beginner may naturally try <code>S R g M...</code> because Ga belongs to the scale. However, the classical ascent emphasizes <code>S R M P d n S'</code>. Respecting this omission gives Jaunpuri its crisp structure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">5</span>
              <span>Strong Descending Character</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Jaunpuri’s personality becomes especially clear through descending phrases such as <code>S' n d P M g R S</code>. Spend twice as much practice time on descending passages as ascending ones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/70 border border-amber-100 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">6</span>
              <span>Expressive Emotion Without Speed</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Jaunpuri conveys seriousness, longing, tenderness, and gentle melancholy. You do not need fast, flashy taans; accurate swaras, appropriate pauses, and controlled breath create its captivating atmosphere.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Practice Exercises (1 through 6) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Structured Step-by-Step Practice Drills</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">Practice each drill with a Tanpura drone before advancing to phrases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Practice 1 — Basic Aaroh',
              notes: 'S R M P d n S\'',
              desc: 'Start slowly. Divide as: S R M P | d n S\'. Keep Komal Dha and Komal Ni in pitch.',
              audioNotes: ['S', 'R', 'M', 'P', 'd', 'n', "S'"]
            },
            {
              title: 'Practice 2 — Basic Avaroh',
              notes: 'S\' n d P M g R S',
              desc: 'Divide as: S\' n d P | M g R S. Give extra attention to the final M g R S resolution.',
              audioNotes: ["S'", 'n', 'd', 'P', 'M', 'g', 'R', 'S']
            },
            {
              title: 'Practice 3 — Komal Ga Control',
              notes: 'M g M | M g R | g R S | P M g R S',
              desc: 'Master the half-hole on Ga. Keep pitch centered against your Tanpura drone.',
              audioNotes: ['M', 'g', 'M', 'g', 'R', 'g', 'R', 'S', 'P', 'M', 'g', 'R', 'S']
            },
            {
              title: 'Practice 4 — Komal Dha Control',
              notes: 'P d P | M P d P | M P d M P',
              desc: 'Ensure Komal Dha does not sharpen toward Shuddha Dha. Maintain steady breath pressure.',
              audioNotes: ['P', 'd', 'P', 'M', 'P', 'd', 'P', 'M', 'P', 'd', 'M', 'P']
            },
            {
              title: 'Practice 5 — Komal Ni and Dha',
              notes: 'S\' n S\' | S\' n d P | n d P M',
              desc: 'Develop effortless control over the upper-register descent into Madhya Saptak.',
              audioNotes: ["S'", 'n', "S'", "S'", 'n', 'd', 'P', 'n', 'd', 'P', 'M']
            },
            {
              title: 'Practice 6 — Three Komal Swaras (g, d, n)',
              notes: 'S\' n d P M g R S',
              desc: 'Combines all three signature Komal swaras in one balanced, unhurried breath.',
              audioNotes: ["S'", 'n', 'd', 'P', 'M', 'g', 'R', 'S']
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{item.title}</span>
                  <button
                    onClick={() => copyToClipboard(item.notes, `drill-${idx}`)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                    title="Copy notation"
                  >
                    {copiedSection === `drill-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-100 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-amber-200/50 dark:border-slate-800">
                  {item.notes}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>

              <button
                onClick={() => handlePlayExercise(idx, item.audioNotes)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  playingExercise === idx
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                {playingExercise === idx ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{playingExercise === idx ? 'Stop Audio' : 'Play Drill Audio'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Phrase Practice Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Characteristic Phrase Practice</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Move beyond scales and develop authentic melodic vocabulary</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              name: 'Phrase 1 (Fundamental Return)',
              notation: 'S R M P | M g R S',
              desc: 'Straight ascent to Pa resolving softly into Gandhar and Sa.',
              audio: ['S', 'R', 'M', 'P', 'M', 'g', 'R', 'S']
            },
            {
              name: 'Phrase 2 (Dha Touch & Resolution)',
              notation: 'R M P d | M P M g | R S',
              desc: 'Expressive touch on Komal Dha moving back through Ga.',
              audio: ['R', 'M', 'P', 'd', 'M', 'P', 'M', 'g', 'R', 'S']
            },
            {
              name: 'Phrase 3 (Upper Ascent & Curve)',
              notation: 'M P d n | S\' n d P',
              desc: 'Reaches High Sa and floats gently down across Ni and Dha.',
              audio: ['M', 'P', 'd', 'n', "S'", 'n', 'd', 'P']
            },
            {
              name: 'Phrase 4 (Direct Descent)',
              notation: 'n d P M | g R S',
              desc: 'The purest statement of Asavari Thaat descent on bansuri.',
              audio: ['n', 'd', 'P', 'M', 'g', 'R', 'S']
            },
            {
              name: 'Phrase 5 (Signature Pakad)',
              notation: 'M P d M P | M g R M | g R S',
              desc: 'The complete traditional identifier of Raag Jaunpuri.',
              audio: ['M', 'P', 'd', 'M', 'P', 'M', 'g', 'R', 'M', 'g', 'R', 'S']
            },
          ].map((phrase, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 flex flex-col justify-between space-y-2.5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{phrase.name}</span>
                <div className="font-mono text-xs font-bold text-slate-800 dark:text-amber-100 bg-white dark:bg-slate-900 p-2 rounded border border-amber-200/40 dark:border-slate-800">
                  {phrase.notation}
                </div>
                <p className="text-[11px] text-slate-500">{phrase.desc}</p>
              </div>
              <button
                onClick={() => handlePlayPhrase(idx, phrase.audio)}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  playingPhrase === idx
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                {playingPhrase === idx ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{playingPhrase === idx ? 'Stop' : 'Play Phrase'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aalap Practice Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-600" />
            <span>Slow Aalap Development for Bansuri</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Unmetered, contemplative movements from Mandra to Taar Saptak</p>
        </div>

        <div className="space-y-3.5">
          {[
            {
              title: 'Aalap 1 — Middle Register Opening (Keep Simple)',
              notation: 'S — R — | M — R S | R M — | g R S — ||',
              desc: 'Gently introduce the tonal space. Focus on warm tone and soft breath entry.',
              audio: ['S', 'R', 'M', 'R', 'S', 'R', 'M', 'g', 'R', 'S']
            },
            {
              title: 'Aalap 2 — Descent Through Komal Ga',
              notation: 'S R M — | P M g R | S — R M | g R S — ||',
              desc: 'Highlight the gentle descent through Komal Ga with microtonal purity.',
              audio: ['S', 'R', 'M', 'P', 'M', 'g', 'R', 'S', 'R', 'M', 'g', 'R', 'S']
            },
            {
              title: 'Aalap 3 — Touching Komal Dha (Do Not Rush)',
              notation: 'R M P — | d M P — | M g R M | g R S — ||',
              desc: 'Approach Komal Dha without haste. Hold Pa before allowing Dha to resolve.',
              audio: ['R', 'M', 'P', 'd', 'M', 'P', 'M', 'g', 'R', 'M', 'g', 'R', 'S']
            },
            {
              title: 'Aalap 4 — Upper Register Ascent to High Sa',
              notation: 'M P d n | S\' — n d | P M g R | S — — — ||',
              desc: 'Keep the upper Sa clean, relaxed, and resonant without pushing excess air.',
              audio: ['M', 'P', 'd', 'n', "S'", 'n', 'd', 'P', 'M', 'g', 'R', 'S']
            },
            {
              title: 'Aalap 5 — Full Octave Span of Jaunpuri',
              notation: 'S R M P | d n S\' — | S\' n d P | M g R S ||',
              desc: 'Combines the wide octave range while preserving the serene, meditative structure.',
              audio: ['S', 'R', 'M', 'P', 'd', 'n', "S'", "S'", 'n', 'd', 'P', 'M', 'g', 'R', 'S']
            },
          ].map((aalap, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-50/40 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{aalap.title}</span>
                  <button
                    onClick={() => copyToClipboard(aalap.notation, `aalap-${idx}`)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
                    title="Copy notation"
                  >
                    {copiedSection === `aalap-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-100">
                  {aalap.notation}
                </div>
                <p className="text-[11px] text-slate-500">{aalap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meend & Breath Control Technique Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meend Practice */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Feather className="w-5 h-5 text-amber-600" />
            <span>Meend (Glide) Practice in Jaunpuri</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              Meend brings significant expression to Jaunpuri when applied judiciously. Do not create a continuous slide on every note—use meend where it naturally unites the musical concept.
            </p>
            <div className="p-3 bg-amber-50/70 dark:bg-slate-800 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-amber-200 space-y-1">
              <div>M ~ g &nbsp;&nbsp;&nbsp;&nbsp; g ~ R</div>
              <div>P ~ d &nbsp;&nbsp;&nbsp;&nbsp; S' ~ n</div>
              <div>n ~ d ~ P</div>
              <div className="text-amber-800 dark:text-amber-300 pt-1">Grand Meend: P ~ M ~ g ~ R</div>
            </div>
            <p className="text-xs text-slate-500">
              <strong>Tip:</strong> Slide your finger pads smoothly across the tone holes rather than lifting abruptly.
            </p>
          </div>
        </div>

        {/* Breath Control Practice */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span>Breath Control & Long Passages</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              Jaunpuri works beautifully with sustained descending phrases. Try playing <code>S' n d P M g R S</code> in one relaxed, comfortable breath.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Take a relaxed, deep diaphragmatic breath.</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Keep the airstream perfectly even and focused.</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Maintain stable pitch—never let Komal notes drop sharp.</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Musical tone is far more valuable than holding maximum duration.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common Mistakes to Avoid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-rose-200/70 dark:border-slate-800 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>7 Common Pitfalls in Raag Jaunpuri & How to Fix Them</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Crucial technical details to prevent scalar and intonation errors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 1. Using Shuddha Ga
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Jaunpuri strictly uses Komal Ga (g). Accidentally playing Shuddha Ga completely alters the raga’s contemplative color. Practice <code>M g R S</code> against a drone.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 2. Using Shuddha Dha
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Dha must be Komal in standard Jaunpuri. Avoid opening the full 6th hole; practice <code>P d P</code> to solidify muscle memory.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 3. Using Shuddha Ni
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Standard Jaunpuri uses Komal Ni (n). Practice <code>S' n d P</code> slowly to lock the minor 7th pitch.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 4. Using Ga Mechanically in Aaroh
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Because Ga exists in the scale, beginners often play <code>S R g M P...</code>. Always anchor the authentic Shadav ascent: <code>S R M P d n S'</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 5. Playing Only Aaroh & Avaroh
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Scales give you the grammar, but Pakad and Aalap give you the raga. Spend substantial time on characteristic phrases like <code>M P d M P</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 6. Playing Too Fast Too Soon
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Fast playing blurs Komal Ga, Dha, and Ni placement. Follow the golden sequence: <em>Pitch → Tone → Phrase → Expression → Speed</em>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1 md:col-span-2">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 7. Excessive / Inaccurate Meend
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Meend enhances Jaunpuri, but overusing it on every note blurs structural clarity. Maintain crisp note articulation balanced with expressive micro-glides.
            </p>
          </div>
        </div>
      </div>

      {/* FluteSangam Original Learning Piece Section */}
      <div id="flutesangam-piece" className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-amber-800/40 space-y-6">
        <div className="border-b border-white/10 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>FluteSangam Original Learning Piece</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Raag Jaunpuri Original Educational Composition
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 mt-1">
            Newly composed for FluteSangam as an educational exercise for Raag Jaunpuri. Not presented as a traditional bandish.
          </p>
        </div>

        {/* Notations Breakdown by Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              section: '1. Aalap Opening',
              notes: 'S — R M | g R S — | R M P — | M g R S ||',
              instruction: 'Begin gently. Focus on tone resonance and diaphragmatic stability rather than speed.',
            },
            {
              section: '2. Main Phrase (Sthayi Motif)',
              notes: 'S R M P | d M P — | M g R M | g R S — ||',
              instruction: 'Repeat slowly until Komal Dha and Komal Ga placement feels completely natural.',
            },
            {
              section: '3. Melodic Development',
              notes: 'R M P d | n d P M | g R M g | R S — — |\nM P d n | S\' n d P | M g R M | g R S — ||',
              instruction: 'Seamlessly moves toward Taar Saptak before descending smoothly into Sa.',
            },
            {
              section: '4. Upper-Register Variation',
              notes: 'P d n S\' | n d P M | P d M P | M g R S |\nR M P d | M P M g | R S — — ||',
              instruction: 'Keep High Sa relaxed and sweet without overblowing.',
            },
            {
              section: '5. Expressive Variation',
              notes: 'S R M — | P d M P | M g R — | S R M — |\nP d n d | P M g R | g R S — — — ||',
              instruction: 'Play more slowly with deliberate micro-pauses between phrases.',
            },
            {
              section: '6. Concluding Ending',
              notes: 'M P d M | P M g R | M g R — | S — — — ||',
              instruction: 'Finish softly and serenely on Shadja (Sa) with a dying breath fade.',
            },
          ].map((part, idx) => (
            <div key={idx} className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">{part.section}</span>
                  <button
                    onClick={() => copyToClipboard(part.notes, `piece-${idx}`)}
                    className="text-white/60 hover:text-white p-1 cursor-pointer"
                    title="Copy notation"
                  >
                    {copiedSection === `piece-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-amber-100 bg-white/5 p-2 rounded border border-white/10 whitespace-pre-line">
                  {part.notes}
                </div>
                <p className="text-[11px] text-amber-200/70">{part.instruction}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 6-Step Practice Sequence Guide */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2 text-xs">
          <h3 className="font-bold text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>How to Practice the FluteSangam Original Learning Piece:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-amber-100/80">
            <div><strong>Step 1:</strong> Learn Aalap (<code>S — R M | g R S</code>) until Ga is stable.</div>
            <div><strong>Step 2:</strong> Add Main Phrase (<code>S R M P | d M P</code>) for Komal Dha.</div>
            <div><strong>Step 3:</strong> Add Komal Ni (<code>M P d n | S' n d P</code>).</div>
            <div><strong>Step 4:</strong> Connect Lower & Upper registers in Development.</div>
            <div><strong>Step 5:</strong> Master Variations after the basic piece is effortless.</div>
            <div><strong>Step 6:</strong> Play Complete Piece: Aalap → Main → Dev → Vars → Ending.</div>
          </div>
        </div>
      </div>

      {/* Flute Practice Tips & 60-Minute Practice Routine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Tips */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Flute Practice Tips for Raag Jaunpuri</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Use a Tanpura Drone:</strong> Because Jaunpuri contains three Komal swaras, a stable tonic reference prevents pitch drifting.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Master Komal Ga Separately:</strong> Repeatedly play <code>M g R S</code> to lock the microtone before attempting fast taans.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Practice Descent More:</strong> Spend twice as much time on <code>S' n d P M g R S</code> than on the ascending framework.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Don't Force Taar Saptak:</strong> Upper <code>d n S'</code> should remain soft and controlled without becoming sharp or airy.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Record Yourself:</strong> Listen to recordings to spot breath noise, rushed intervals, or microtonal pitch drift.</span>
            </li>
          </ul>
        </div>

        {/* 60-Minute Routine */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Recommended 60-Minute Sadhana Routine</span>
          </h2>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">5 Mins — Long Swara Sustained Breath</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">S, R, g, M, P, d, n</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">10 Mins — Komal Swara Isolation</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">M g R • P d P • S' n d P</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">5 Mins — Aaroh & Avaroh Alignment</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">Ascent & Descent Drills</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">10 Mins — Pakad & Characteristic Phrases</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">M P d M P | M g R S</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">10 Mins — Unmetered Slow Aalap</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">Mandra & Taar Saptak</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">10 Mins — Original Learning Piece</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">Sthayi & Variations</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">10 Mins — Free Improvisation & Expression</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">Creative Expression</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span>Frequently Asked Questions — Raag Jaunpuri on Flute</span>
        </h2>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-amber-100 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-3 bg-amber-50/30 dark:bg-slate-800/40 hover:bg-amber-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-amber-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Ragas for Flute Learners */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-amber-200/70 dark:border-slate-800 space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <span>Explore Related Ragas for Flute Learners</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Expand your classical repertoire with related scales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Raag Bhimpalasi', view: 'raga_bhimpalasi' as AppView, desc: 'Kafi Thaat afternoon raga with soulful Komal Ga and Ni.', level: 'Intermediate' },
            { name: 'Raag Kafi', view: 'raga_kafi' as AppView, desc: 'Komal Ga & Komal Ni parent scale; joyful folk melodies.', level: 'Intermediate' },
            { name: 'Raag Bageshree', view: 'raga_bageshree' as AppView, desc: 'Midnight beauty using Komal Ga and Ni with deep emotion.', level: 'Intermediate' },
            { name: 'Raag Bhoopali', view: 'raga_bhoopali' as AppView, desc: 'Pure Shuddha pentatonic (S R G P D) for tonal grounding.', level: 'Beginner' },
          ].map((raga, i) => (
            <button
              key={i}
              onClick={() => onViewChange?.(raga.view)}
              className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700 text-left hover:border-amber-400 dark:hover:border-amber-500 transition group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {raga.name}
                  </span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                    {raga.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{raga.desc}</p>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-2 group-hover:translate-x-1 transition-transform">
                <span>View Raga Guide</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* About Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </div>
  );
};

export default RagaJaunpuriView;
