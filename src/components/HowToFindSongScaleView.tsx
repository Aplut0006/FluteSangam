import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Volume2, Play, Square, Activity, Sparkles, 
  HelpCircle, Sliders, ChevronDown, ChevronUp, Layers, ArrowRight, 
  CheckCircle2, Compass, Zap, Share2, Lightbulb, RotateCcw, 
  Target, Radio, AlertTriangle, Check, Copy, ArrowLeft, ArrowDown,
  FileText, Waves, Mic, Disc, Award, Info, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';

interface HowToFindSongScaleViewProps {
  onViewChange?: (view: AppView) => void;
}

// Frequency lookup for key test notes & scales (Hz)
const NOTE_FREQS: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'Eb': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'Ab': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'Bb': 466.16,
  'B': 493.88,
  "C'": 523.25,
  "D'": 587.33,
  "E'": 659.25,
  "F'": 698.46,
  "F#'": 739.99,
  "G'": 783.99,
  "A'": 880.00,
  "B'": 987.77,
};

// Swara mapping table definitions
const SWARA_MAPPING_DATA = [
  { western: 'C', full: 'Shadja', abbr: 'S', type: 'Shuddha (Natural / Fixed)', desc: 'Tonal Reference (Sa / Home Pitch)' },
  { western: 'C# / Db', full: 'Komal Rishabh', abbr: 'r', type: 'Komal (Flat)', desc: 'Flat 2nd degree' },
  { western: 'D', full: 'Shuddha Rishabh', abbr: 'R', type: 'Shuddha (Natural)', desc: 'Major 2nd degree' },
  { western: 'D# / Eb', full: 'Komal Gandhar', abbr: 'g', type: 'Komal (Flat)', desc: 'Minor 3rd degree (Crucial for Minor Keys)' },
  { western: 'E', full: 'Shuddha Gandhar', abbr: 'G', type: 'Shuddha (Natural)', desc: 'Major 3rd degree (Crucial for Major Keys)' },
  { western: 'F', full: 'Shuddha Madhyam', abbr: 'm', type: 'Shuddha (Natural)', desc: 'Perfect 4th degree' },
  { western: 'F# / Gb', full: 'Tivra Madhyam', abbr: 'M', type: 'Tivra (Sharp)', desc: 'Augmented 4th / Sharp 4th' },
  { western: 'G', full: 'Pancham', abbr: 'P', type: 'Shuddha (Natural / Fixed)', desc: 'Perfect 5th degree (Achala Swara)' },
  { western: 'G# / Ab', full: 'Komal Dhaivat', abbr: 'd', type: 'Komal (Flat)', desc: 'Minor 6th degree' },
  { western: 'A', full: 'Shuddha Dhaivat', abbr: 'D', type: 'Shuddha (Natural)', desc: 'Major 6th degree' },
  { western: 'A# / Bb', full: 'Komal Nishad', abbr: 'n', type: 'Komal (Flat)', desc: 'Minor 7th degree' },
  { western: 'B', full: 'Shuddha Nishad', abbr: 'N', type: 'Shuddha (Natural)', desc: 'Major 7th / Leading tone' },
];

export const HowToFindSongScaleView: React.FC<HowToFindSongScaleViewProps> = ({ onViewChange }) => {
  // Web Audio Context & Active Audio Session Node
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeTimeoutsRef = useRef<number[]>([]);
  
  // Interactive Tester States
  const [activeSwaraTone, setActiveSwaraTone] = useState<string | null>(null);
  const [activeScaleTone, setActiveScaleTone] = useState<string | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<string | null>(null);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Initialize audio context lazily
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
    // If a master gain is already active, kill it immediately
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

    // 3. Reset UI states
    setActiveSwaraTone(null);
    setActiveScaleTone(null);
    setIsPlayingSequence(null);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Play a single note tone in the Swara pad
  const playTone = (note: string, durSec = 1.2) => {
    const freq = NOTE_FREQS[note];
    if (!freq) return;
    try {
      const ctx = getAudioContext();
      stopAllAudio();
      const sessionDest = getSessionDestination(ctx);
      setActiveSwaraTone(note);
      playBambooFluteTone(ctx, freq, ctx.currentTime, durSec, 0.35, sessionDest);
      const tId = window.setTimeout(() => {
        setActiveSwaraTone(null);
      }, durSec * 1000);
      activeTimeoutsRef.current.push(tId);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  };

  // Play Scale Demo (Major vs Minor comparison)
  const playScaleComparison = (root: string, type: 'major' | 'minor') => {
    const seqKey = `${root}_${type}`;
    if (isPlayingSequence === seqKey) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const ctx = getAudioContext();
    const sessionDest = getSessionDestination(ctx);
    setIsPlayingSequence(seqKey);

    let notes: string[] = [];
    if (root === 'D') {
      notes = type === 'major' 
        ? ['D', 'E', 'F#', 'G', 'A', 'B', "C'", "D'"]
        : ['D', 'E', 'F', 'G', 'A', 'Bb', "C'", "D'"];
    } else if (root === 'G') {
      notes = type === 'major'
        ? ['G', 'A', 'B', 'C', 'D', 'E', 'F#', "G'"]
        : ['G', 'A', 'Bb', 'C', 'D', 'Eb', "F'", "G'"];
    } else {
      notes = type === 'major'
        ? ['C', 'D', 'E', 'F', 'G', 'A', 'B', "C'"]
        : ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb', "C'"];
    }

    const noteDur = 0.55;
    notes.forEach((nt, idx) => {
      const startTime = ctx.currentTime + (idx * noteDur);
      const freq = NOTE_FREQS[nt];
      if (freq) {
        playBambooFluteTone(ctx, freq, startTime, noteDur * 0.9, 0.32, sessionDest);
      }
      const tId = window.setTimeout(() => {
        setActiveScaleTone(nt);
      }, idx * noteDur * 1000);
      activeTimeoutsRef.current.push(tId);
    });

    const endTId = window.setTimeout(() => {
      setActiveScaleTone(null);
      setIsPlayingSequence(null);
    }, notes.length * noteDur * 1000 + 100);
    activeTimeoutsRef.current.push(endTId);
  };

  const copyFormula = () => {
    const text = `How to Find Song Scale on Flute (FluteSangam Formula):\n1. Listen without playing -> Find the "Home" resolution\n2. Hum the pitch (Candidate Sa/Tonic)\n3. Match pitch on Flute\n4. Test stability against the song\n5. Test Major (Shuddha Ga) vs Minor (Komal ga)\n6. Verify melody notes & phrase endings\n7. Confirm with chords / drone\n8. Map to comfortable Flute / Bansuri!`;
    navigator.clipboard.writeText(text);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 pt-4 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">

        {/* BREADCRUMB NAVIGATION */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <button 
            onClick={() => onViewChange ? onViewChange('learn_dashboard') : window.history.back()}
            className="flex items-center gap-1 hover:text-amber-800 transition cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Learn Dashboard</span>
          </button>
          <span>/</span>
          <span className="text-amber-900 font-semibold truncate">How to Find Scale or Key of a Song</span>
        </div>

        {/* HERO SECTION WITH IMAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 text-white shadow-xl border border-amber-800/40"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Ear Training & Practical Music Mastery</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-amber-50 leading-tight mb-4">
              How to Find the Scale or Key of a Song on Flute
            </h1>

            <p className="text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-6">
              Finding the scale or key of a song is one of the most essential skills for any flute player. Once you identify the <strong>tonal center (Sa / Tonic)</strong>, you can easily discover the melody, pick the perfect flute, and play any song by ear with complete confidence.
            </p>

            {/* Published & Updated Meta */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-amber-200/80 bg-black/30 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-amber-500/20 w-fit">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold">Published:</span>
                <span>August 18, 2026</span>
              </div>
              <span className="text-amber-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold">Updated:</span>
                <span>August 18, 2026</span>
              </div>
              <span className="text-amber-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold">Level:</span>
                <span className="bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-md font-medium">All Flutists (Beginner to Advanced)</span>
              </div>
            </div>

            {/* HERO IMAGE CONTAINER */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-black/60 flex flex-col items-center">
              <div className="w-full bg-stone-950/80 flex items-center justify-center p-2 sm:p-4">
                <img 
                  src="/flute_tuner_image.jpeg" 
                  alt="How to find the scale or key of a song on flute - Tuner, bansuri and ear training guide"
                  className="w-full h-auto max-h-[520px] object-contain rounded-xl shadow-lg"
                  loading="eager"
                />
              </div>
              <div className="w-full p-3 bg-stone-900/95 text-center text-xs text-amber-200/90 border-t border-amber-900/40">
                <span>The Core Workflow: <strong>Listen → Find Sa / Tonic → Match Pitch → Test Scale → Play Melody</strong></span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* QUICK WORKFLOW HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '1', title: 'Listen', desc: 'Find where music feels settled', icon: Waves, color: 'bg-amber-100 text-amber-900 border-amber-300' },
            { step: '2', title: 'Find Sa', desc: 'Hum the home note / tonic', icon: Mic, color: 'bg-orange-100 text-orange-900 border-orange-300' },
            { step: '3', title: 'Match', desc: 'Find pitch on your flute', icon: Music, color: 'bg-amber-100 text-amber-900 border-amber-300' },
            { step: '4', title: 'Test Scale', desc: 'Check Major (G) vs Minor (g)', icon: Sliders, color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
            { step: '5', title: 'Confirm', desc: 'Verify melody & resolution', icon: CheckCircle2, color: 'bg-stone-100 text-stone-900 border-stone-300' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl border ${item.color} flex flex-col items-center text-center shadow-xs transition hover:shadow-md`}>
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                  {item.step}
                </div>
                <Icon className="w-5 h-5 mb-1 opacity-80" />
                <h4 className="font-bold text-sm mb-0.5">{item.title}</h4>
                <p className="text-[11px] opacity-75 leading-tight">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* SECTION 1: WHAT DOES THE SCALE OF A SONG MEAN? */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                What Does the "Scale of a Song" Mean?
              </h2>
              <p className="text-xs text-stone-500">Understanding Keys, Scales, Tonics, and Sa</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            When someone asks, <em>"What scale is this song in?"</em>, they are usually asking about the song's <strong>key</strong> or <strong>tonal center</strong>. While closely related, these concepts have specific roles:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <h3 className="font-bold text-sm text-amber-900 mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-700" /> A Scale
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                A collection of notes arranged in ascending or descending order around a starting note (e.g., C Major: C–D–E–F–G–A–B–C or Bilawal: S R G M P D N S').
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
              <h3 className="font-bold text-sm text-orange-900 mb-1 flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-700" /> A Key
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Describes the overall musical ecosystem and gravitational pull centered around a particular home pitch (e.g., in G major, G is the tonal anchor).
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-900 to-stone-900 text-white shadow-md">
            <div className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-1">
              For a Flute Player, The Ultimate Question Is:
            </div>
            <p className="text-lg sm:text-xl font-bold font-display text-amber-50">
              "Which note feels like HOME in this song?"
            </p>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              That home note is called the <strong>Tonic</strong> in Western music, and <strong>Sa</strong> in Indian classical music.
            </p>
          </div>

          {/* TONIC, SA & HOME NOTE CALLOUT */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>Tonic = Sa = The Musical Home:</strong> The terminology may differ across traditions, but the practical ear-training concept is identical. You are searching for the pitch around which the melody feels balanced, rested, and centered.
            </div>
          </div>
        </section>

        {/* SECTION 2: THE MOST IMPORTANT RULE - DON'T ASSUME 1ST NOTE IS SCALE */}
        <section className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950">
                The Golden Rule: Don't Assume the First Note Is the Scale
              </h2>
              <p className="text-xs text-amber-800">The #1 common mistake when trying to play songs by ear</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
            One of the most frequent errors made by beginners is hearing the very first note of a song and immediately concluding: <em>"That's the scale!"</em>
          </p>

          <div className="bg-white rounded-2xl p-4 border border-amber-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
            <p>
              A melody can begin on <strong>any note</strong> of the scale! For example, if a song is in <strong>G Major</strong>, the melody could start on:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg">G (Root / Sa)</span>
              <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-lg">B (3rd / Ga)</span>
              <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-lg">D (5th / Pa)</span>
              <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-lg">E (6th / Dha)</span>
              <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-lg">A (2nd / Re)</span>
            </div>
            <p className="text-stone-500 italic pt-1">
              Therefore, the opening note is merely a clue—never proof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs">
              <span className="font-bold block mb-0.5">❌ Don't Ask:</span>
              "What note does the song start with?"
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
              <span className="font-bold block mb-0.5">✅ Instead Ask:</span>
              "What note does the song want to come HOME to?"
            </div>
          </div>
        </section>

        {/* SECTION 3: STEP-BY-STEP 9-STEP FRAMEWORK */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-bamboo-100 text-bamboo-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                The Practical 9-Step Guide
              </h2>
              <p className="text-xs text-stone-500">Step-by-step procedure to discover any song's key on flute</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* STEP 1 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">01</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 1: Listen to the Song Without Playing</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Before picking up your bansuri or metal flute, listen through the track 2–3 times. Don't worry about individual fingerings yet. Listen for where the song feels <strong>settled, complete, relaxed, resolved</strong>, and like an organic ending.
              </p>
              <div className="pl-11 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-600">
                <span className="bg-stone-50 p-2 rounded-lg border border-stone-100">✔ End of a verse</span>
                <span className="bg-stone-50 p-2 rounded-lg border border-stone-100">✔ End of the chorus</span>
                <span className="bg-stone-50 p-2 rounded-lg border border-stone-100">✔ Sustained long notes</span>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">02</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 2: Find the Note That Feels Like "Home" (Hum It)</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Pause the recording at the end of a phrase. Ask yourself: <em>"What note would make this phrase feel completely finished?"</em> Hum it out loud: <strong>"Hmmmm..."</strong> or <strong>"Saaaa..."</strong>. The vocal quality does not matter—finding the pitch your ear gravitates to is what counts!
              </p>
            </div>

            {/* STEP 3 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">03</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 3: Find That Note on Your Flute</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Now pick up your flute and locate the note you were humming. If you suspect the home note is G, play G on your flute and match it to the recording. You can also use the{' '}
                <button
                  onClick={() => onViewChange?.('learn_tuner')}
                  className="font-bold text-amber-800 underline decoration-amber-400 decoration-2 underline-offset-2 hover:text-amber-950 transition cursor-pointer"
                >
                  FluteSangam Tuner
                </button>{' '}
                to check your pitch and verify your 440Hz frequency.
              </p>
              <div className="pl-11 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span><strong>Important Distinction:</strong> A tuner tells you what pitch you are playing; your ear must determine if that pitch functions as the tonic of the song.</span>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">04</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 4: Check Whether Your Note Truly Feels Stable</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Play your candidate note while the song plays in the background. Does it sound harmonious, grounded, and stable underneath the melody? If so, your tonic hypothesis is solid.
              </p>
            </div>

            {/* STEP 5 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">05</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 5: Determine Whether the Song Is Major or Minor</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Once the root is fixed (e.g. <strong>D</strong>), test whether the 3rd note is <strong>Major (Shuddha Ga / F#)</strong> or <strong>Minor (Komal ga / F)</strong>.
              </p>

              {/* INTERACTIVE COMPARISON DEMO */}
              <div className="pl-11">
                <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Interactive Audio Test (Root: D)</span>
                    <div className="flex items-center gap-2">
                      {isPlayingSequence && (
                        <button
                          onClick={stopAllAudio}
                          className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <Square className="w-3 h-3 fill-current" /> Stop Audio
                        </button>
                      )}
                      <span className="text-[11px] text-stone-400">
                        {isPlayingSequence 
                          ? (activeScaleTone ? `Playing: ${activeScaleTone}` : 'Playing scale...') 
                          : 'Click to listen to scale mood'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => playScaleComparison('D', 'major')}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isPlayingSequence === 'D_major'
                          ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                          : 'bg-stone-800 hover:bg-stone-700 border-amber-500/30'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                          {isPlayingSequence === 'D_major' ? (
                            <Square className="w-3.5 h-3.5 text-amber-400 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>D Major Scale</span>
                          {isPlayingSequence === 'D_major' && (
                            <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">Playing</span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-300 font-mono mt-0.5">D – E – F# – G – A – B – C# – D</div>
                        <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Bright, Happy, Uplifting (Shuddha Ga)</div>
                      </div>
                    </button>

                    <button
                      onClick={() => playScaleComparison('D', 'minor')}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isPlayingSequence === 'D_minor'
                          ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-400/40 shadow-lg'
                          : 'bg-stone-800 hover:bg-stone-700 border-blue-500/30'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-sky-300 flex items-center gap-1.5">
                          {isPlayingSequence === 'D_minor' ? (
                            <Square className="w-3.5 h-3.5 text-sky-400 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-sky-400" />
                          )}
                          <span>D Natural Minor Scale</span>
                          {isPlayingSequence === 'D_minor' && (
                            <span className="text-[10px] bg-sky-500/30 text-sky-200 px-1.5 py-0.2 rounded font-mono">Playing</span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-300 font-mono mt-0.5">D – E – F – G – A – Bb – C – D</div>
                        <div className="text-[10px] text-sky-400 font-semibold mt-0.5">Mellow, Sad, Reflective (Komal ga)</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 6 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">06</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 6: Test Several Notes From the Melody</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Take one short melodic phrase. Find 3 to 4 notes on your flute. If most notes fit comfortably into your scale, your theory is confirmed. Don't panic if you hit an accidental (passing note, meend, or chromatic ornamentation)—look at the broader pattern!
              </p>
            </div>

            {/* STEP 7 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">07</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 7: Listen Carefully to the Ending Phrase</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                The final cadence of the song or chorus almost always resolves straight into the tonic/Sa. Notice where the music comes to rest before silence.
              </p>
            </div>

            {/* STEP 8 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">08</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 8: Use the Accompanying Chords When Available</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                If chord charts exist: <strong>G – C – D – Em</strong> strongly points to G Major. <strong>C – F – G – Am</strong> points to C Major. Remember that relative minors (C Major and A Minor) share identical notes, so verify which note acts as home base!
              </p>
            </div>

            {/* STEP 9 */}
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-amber-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">09</span>
                <h3 className="font-bold text-base text-bamboo-950">Step 9: Use Sa–Re–Ga–Ma for Indian / Bansuri Music</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                Once Sa is fixed, you can navigate the whole melody using swaras (S R G M P D N). This unlocks effortless transposition on bansuri for film melodies, bhajans, ghazals, and classical bandishes. Explore our{' '}
                <button
                  onClick={() => onViewChange?.('learn_fingering_chart')}
                  className="font-bold text-amber-800 underline decoration-amber-400 decoration-2 underline-offset-2 hover:text-amber-950 transition cursor-pointer"
                >
                  Interactive Bansuri Fingering Chart
                </button>{' '}
                and{' '}
                <button
                  onClick={() => onViewChange?.('learn_scales_octaves')}
                  className="font-bold text-amber-800 underline decoration-amber-400 decoration-2 underline-offset-2 hover:text-amber-950 transition cursor-pointer"
                >
                  Flute Scales & 3 Octaves Guide
                </button>{' '}
                to master fingerings across Mandra, Madhya, and Taar Saptak.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 4: INTERACTIVE SWARA & WESTERN PITCH TESTER & MAPPING TABLE */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Western Note Names & Indian Swaras Reference
              </h2>
              <p className="text-xs text-stone-500">Bridging 12 Western Chromatic Pitches with 12 Indian Swaras (When Sa = C)</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            You don't need to choose between Western notation and Indian Swaras. A versatile flute player uses both! Below is the complete relationship chart with interactive audio preview tones for each note.
          </p>

          {/* INTERACTIVE SWARA PAD */}
          <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Interactive Note Pad (Click to listen)
              </div>
              <div className="flex items-center gap-2">
                {activeSwaraTone && (
                  <button
                    onClick={stopAllAudio}
                    className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Square className="w-3 h-3 fill-current" /> Stop
                  </button>
                )}
                <div className="text-[11px] text-stone-400">
                  {activeSwaraTone ? `Playing: ${activeSwaraTone}` : 'Click any note to hear sound'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {SWARA_MAPPING_DATA.map((item, idx) => {
                const noteKey = item.western.split(' ')[0].replace('/','');
                const isPlaying = activeSwaraTone === noteKey;
                return (
                  <button
                    key={idx}
                    onClick={() => playTone(noteKey, 1.2)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      isPlaying 
                        ? 'bg-amber-600 border-amber-400 text-white scale-105 shadow-lg shadow-amber-900/50' 
                        : 'bg-stone-800/80 border-stone-700 hover:bg-stone-700 text-stone-200'
                    }`}
                  >
                    <span className="text-sm font-black font-mono text-amber-300">{item.abbr}</span>
                    <span className="text-[11px] font-bold text-white mt-0.5">{item.western}</span>
                    <span className="text-[9px] text-stone-400 truncate max-w-[80px]">{item.full}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE OF SWARA RELATIONSHIPS */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-amber-100/70 text-amber-950 border-b border-amber-200">
                  <th className="p-3 font-bold">Western Note</th>
                  <th className="p-3 font-bold">Full Swara Name</th>
                  <th className="p-3 font-bold">Abbr</th>
                  <th className="p-3 font-bold">Swara Type</th>
                  <th className="p-3 font-bold hidden sm:table-cell">Function & Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {SWARA_MAPPING_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-bold font-mono text-amber-900">{row.western}</td>
                    <td className="p-3 text-stone-800">{row.full}</td>
                    <td className="p-3 font-mono font-bold text-amber-700">{row.abbr}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.type.includes('Komal') 
                          ? 'bg-blue-100 text-blue-800' 
                          : row.type.includes('Tivra') 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="p-3 text-stone-500 text-xs hidden sm:table-cell">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <p className="font-bold">🔑 Sa is a Relational Reference, NOT a Permanently Fixed Pitch:</p>
            <p className="text-stone-700">
              Unlike Western fixed pitches (where C is always 261.6 Hz), in Indian music <strong>Sa can be established at any pitch</strong> (G, D, E, etc.) depending on the singer or your bansuri scale. To easily convert swaras to Western notes for any scale, try our{' '}
              <button
                onClick={() => onViewChange?.('note_key_converter')}
                className="font-bold text-amber-800 underline decoration-amber-400 decoration-2 underline-offset-2 hover:text-amber-950 transition cursor-pointer"
              >
                Flute Note & Key Converter Tool
              </button>.
            </p>
          </div>
        </section>

        {/* SECTION 5: SONG KEY VS. FLUTE PITCH */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Song Key vs. Flute Pitch
              </h2>
              <p className="text-xs text-stone-500">Why you don't always need a flute matching the song's key</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            Another widespread misunderstanding is assuming: <em>"If a song is in G, I must have a G flute."</em>
          </p>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Not necessarily! The key of a recording and the flute you select to play the melody are two distinct choices. A flutist can easily transpose melodies to suit their flute's comfort zone.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold block text-stone-800 mb-0.5">1. Flute Tuning</span>
              <span className="text-stone-500">Scale of your instrument</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold block text-stone-800 mb-0.5">2. Desired Sa</span>
              <span className="text-stone-500">Upper or lower register mapping</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold block text-stone-800 mb-0.5">3. Vocal Range</span>
              <span className="text-stone-500">Highest & lowest note reach</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onViewChange?.('learn_choose_flute')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" /> How to Choose Your Flute Guide
            </button>
            <button
              onClick={() => onViewChange?.('budget_flutes')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" /> Best Budget Flutes for Beginners
            </button>
          </div>
        </section>

        {/* SECTION 6: PRACTICAL WORKED EXAMPLE */}
        <section className="bg-gradient-to-br from-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-50">
                A Practical Walkthrough Example
              </h2>
              <p className="text-xs text-amber-300/80">Real-life detective work to pinpoint a song's key</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <p>
              Imagine you hear an unknown film or devotional track and want to determine its scale:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-amber-100/90 pl-2">
              <li><strong>Listen:</strong> You notice the music feels grounded and resolved around the pitch <strong>G</strong>.</li>
              <li><strong>Hum:</strong> You hum that steady pitch.</li>
              <li><strong>Match on Flute:</strong> You blow G on your bansuri—it blends smoothly with the audio.</li>
              <li><strong>Test Scale:</strong> You play <code className="font-mono text-amber-300">G – A – B – C – D – E – F# – G</code>. Every melodic line fits effortlessly.</li>
              <li><strong>Confirm Harmony:</strong> You notice underlying guitar/tanpura chords: <strong>G, C, D, and Em</strong>.</li>
            </ol>
            <div className="p-4 bg-amber-900/40 rounded-2xl border border-amber-500/30 text-amber-200 font-bold text-sm">
              ✨ Conclusion: The song is definitively in G Major!
            </div>
            <p className="text-stone-400 text-xs italic">
              Notice: You did not rely on just one single note—you synthesized <em>Tonal center + melody + scale + harmony + resolution</em>.
            </p>
          </div>
        </section>

        {/* SECTION 7: PRO TIPS - PAUSE TRICK & DRONE TRICK */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Pro Tricks to Train Your Ear
              </h2>
              <p className="text-xs text-stone-500">Two rapid techniques for finding the scale without sheet music</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* TRICK 1 */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h3 className="font-bold text-sm text-bamboo-950 flex items-center gap-2">
                <Square className="w-4 h-4 text-amber-700" /> Trick 1: The "Sudden Pause" Technique
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Play the song. At the end of any musical phrase, <strong>hit pause abruptly</strong>. Then ask yourself: <em>"What note does my brain crave to hear next?"</em> Play that note on your flute. If it produces immediate relief and completion, you have found the tonic!
              </p>
            </div>

            {/* TRICK 2 */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <Waves className="w-4 h-4 text-amber-700" /> Trick 2: The Continuous Drone Method
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Play a continuous drone pitch on your flute or Tanpura app while the track is running. Does the melody orbit organically around it? If the track feels harmonically anchored and resonant without discordance, you've confirmed your tonic Sa!
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8: COMMON MISTAKES TO AVOID */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                8 Common Mistakes & How to Fix Them
              </h2>
              <p className="text-xs text-stone-500">Pitfalls to avoid when identifying song scales on flute</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            {[
              {
                num: '1',
                mistake: 'Assuming the 1st note is the tonic',
                fix: 'Look for the note that feels like "home" rather than the starting pitch.'
              },
              {
                num: '2',
                mistake: 'Assuming the last note is ALWAYS the tonic',
                fix: 'Some songs fade out or end on a 5th chord—cross-check with melody.'
              },
              {
                num: '3',
                mistake: 'Choosing the most frequent note',
                fix: 'Frequency ≠ stability. Check for resting resolution.'
              },
              {
                num: '4',
                mistake: 'Confusing Relative Major & Minor',
                fix: 'C Major & A Minor share notes, but A Minor resolves to A.'
              },
              {
                num: '5',
                mistake: 'Trusting automated key apps blindly',
                fix: 'Apps get tricked by bass & drums. Always verify with your ears.'
              },
              {
                num: '6',
                mistake: 'Trying to identify whole song at once',
                fix: 'Work phrase-by-phrase with short 4-note chunks.'
              },
              {
                num: '7',
                mistake: 'Panicking over one outside accidental note',
                fix: 'Ornamentations & passing notes exist in all songs; look at the main scale.'
              },
              {
                num: '8',
                mistake: 'Confusing song key with flute scale',
                fix: 'You can transpose and play any key on your favorite bansuri.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px]">{item.num}</span>
                  <span>{item.mistake}</span>
                </div>
                <div className="text-stone-600 pl-6 text-xs">
                  <strong className="text-emerald-800">Fix:</strong> {item.fix}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: QUICK REFERENCE CHEAT SHEET */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Quick Reference Cheat Sheet
              </h2>
              <p className="text-xs text-stone-500">What you hear vs. What to investigate</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-900 border-b border-stone-200 font-bold">
                  <th className="p-3">What You Hear in the Song</th>
                  <th className="p-3">What to Investigate on Flute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  { hear: 'The song feels settled on one note', test: 'Possible tonic / Sa candidate' },
                  { hear: 'The melody starts on another note', test: 'Don’t assume it is tonic; check resolution' },
                  { hear: 'Major third (Shuddha Ga) fits the melody', test: 'Possible Major / Bilawal / Kalyan tonality' },
                  { hear: 'Minor third (Komal ga) fits the melody', test: 'Possible Minor / Kafi / Asavari tonality' },
                  { hear: 'Several melody notes fit one scale', test: 'Stronger confirmation of key' },
                  { hear: 'Important phrases resolve to one note', test: 'Strong tonic clue' },
                  { hear: 'Chords repeatedly return to one harmony', test: 'Possible tonal center' },
                  { hear: 'Song suddenly feels centered elsewhere', test: 'Possible Key Change (Modulation)' },
                  { hear: 'Notes do not fit simple Major/Minor', test: 'Consider Modal, chromatic, or Raga framework' },
                  { hear: 'Key detector gives a result', test: 'Verify it with your ear and flute' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition">
                    <td className="p-3 font-medium text-stone-800">{row.hear}</td>
                    <td className="p-3 text-amber-900 font-semibold">{row.test}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 10: FLUTESANGAM SUMMARY & COPYABLE FORMULA */}
        <section className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-800/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> FluteSangam Golden Formula
              </div>
              <h2 className="text-xl sm:text-3xl font-bold font-display text-amber-50">
                The Universal Flute Scale Formula
              </h2>
            </div>

            <button
              onClick={copyFormula}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md cursor-pointer self-start sm:self-auto"
            >
              {copiedFormula ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFormula ? 'Copied Formula!' : 'Copy Summary Sheet'}</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-amber-500/20 font-mono text-xs sm:text-sm text-amber-100/90 leading-relaxed space-y-2">
            <p className="text-amber-400 font-bold">Find the home note (Sa / Tonic)</p>
            <p className="text-stone-400">↓ Match it on your flute</p>
            <p className="text-stone-400">↓ Test the scale around it (Major vs Minor)</p>
            <p className="text-stone-400">↓ Play several melody notes</p>
            <p className="text-stone-400">↓ Check phrase endings and final resolution</p>
            <p className="text-stone-400">↓ Confirm with chords or drone</p>
            <p className="text-stone-400">↓ Map to your favorite flute!</p>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-400/20 text-xs text-amber-200 leading-relaxed">
            💡 <strong>FluteSangam Tip:</strong> Don't memorize the scale of every song you want to play. <strong>Train your ear to find Sa.</strong> Once your ear becomes comfortable finding the tonal center, learning new songs on your bamboo flute becomes fast, natural, and joyful!
          </div>
        </section>

        {/* SECTION 11: FREQUENTLY ASKED QUESTIONS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-stone-500">Common questions about finding song keys on bansuri</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How do I find the scale of a song if I don't know music theory?",
                a: "Simply hum the note where the song feels finished and restful (the 'home note' or Sa). Then pick up your flute and find which finger hole produces that identical pitch. That note is your scale's tonic."
              },
              {
                q: "Do I need a C flute to play a song in C Major?",
                a: "No. You can play a song in C Major on an E flute, G flute, or any scale by playing relative swaras, or by matching absolute pitches across open/half-closed holes."
              },
              {
                q: "Why does a key detector app give me the wrong key?",
                a: "Automatic detection software analyzes total audio frequencies, which can be thrown off by heavy basslines, backing drums, vocal vibrato, or minor modulations. Always verify using your flute and ears."
              },
              {
                q: "What if a song doesn't fit a standard Major or Minor scale?",
                a: "Many Indian film, folk, and classical songs are based on Ragas (such as Bhupali, Yaman, or Bhairavi) or modal scales. Identify Sa first, then map the specific combination of Shuddha, Komal, or Tivra swaras."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-bamboo-950 bg-stone-50 hover:bg-stone-100 flex items-center justify-between transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-700" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 12: EXPLORE RELATED GUIDES & TOOLS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  Related Flute Learning Guides & Tools
                </h2>
                <p className="text-xs text-stone-500">Continue building your ear, fingering agility, and raga repertoire</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'note_key_converter' as AppView,
                title: 'Note & Key Converter',
                desc: 'Instantly convert between Indian Swaras (Sa Re Ga) and Western notes for any flute pitch.',
                icon: Music,
                badge: 'Interactive Tool',
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
              },
              {
                id: 'learn_tuner' as AppView,
                title: 'Live Flute Tuner',
                desc: 'Mic-based real-time pitch detector (440Hz) with exact Hz frequency feedback.',
                icon: Radio,
                badge: 'Live Audio Tool',
                color: 'text-amber-700 bg-amber-50 border-amber-200'
              },
              {
                id: 'learn_fingering_chart' as AppView,
                title: 'Bansuri Fingering Chart',
                desc: 'Interactive 6-hole bamboo flute fingering diagrams for all Shuddha & Komal swaras.',
                icon: Layers,
                badge: 'Visual Guide',
                color: 'text-stone-800 bg-stone-50 border-stone-200'
              },
              {
                id: 'learn_scales_octaves' as AppView,
                title: 'Flute Scales & 3 Octaves',
                desc: 'Master Mandra (lower), Madhya (middle), and Taar (upper) saptaks with smooth blowing.',
                icon: Target,
                badge: 'Technique Guide',
                color: 'text-bamboo-900 bg-bamboo-50 border-bamboo-200'
              },
              {
                id: 'learn_raagas' as AppView,
                title: 'Classical Ragas Masterclass',
                desc: 'Explore Aaroh, Avroh, Pakad, Vadi/Samvadi, and notations for 20+ classical Ragas.',
                icon: Sparkles,
                badge: 'Classical Library',
                color: 'text-amber-800 bg-amber-50 border-amber-200'
              },
              {
                id: 'learn_daily_practice' as AppView,
                title: 'Daily Practice Routine (Riyaz)',
                desc: 'Structured 30-min to 60-min daily riyaz framework for tone stability and breath control.',
                icon: BookOpen,
                badge: 'Practice Routine',
                color: 'text-indigo-800 bg-indigo-50 border-indigo-200'
              },
              {
                id: 'learn_choose_flute' as AppView,
                title: 'How to Choose Your Flute',
                desc: 'Complete guide on bamboo vs PVC, C Natural vs G Medium vs E Bass scales.',
                icon: Compass,
                badge: 'Buyer Guide',
                color: 'text-orange-800 bg-orange-50 border-orange-200'
              },
              {
                id: 'budget_flutes' as AppView,
                title: 'Best Budget Flutes',
                desc: 'Top tested and affordable bansuris for beginners under tight budgets.',
                icon: ShoppingBag,
                badge: 'Recommendations',
                color: 'text-amber-800 bg-amber-50 border-amber-200'
              },
              {
                id: 'learn_common_mistakes' as AppView,
                title: 'Common Flute Mistakes',
                desc: 'Fix air leakage, bad embouchure, tense posture, and out-of-tune blowing habits.',
                icon: AlertTriangle,
                badge: 'Fixing Habits',
                color: 'text-red-800 bg-red-50 border-red-200'
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => onViewChange?.(card.id)}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all text-left bg-white group flex flex-col justify-between cursor-pointer space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-bamboo-950 group-hover:text-amber-800 transition flex items-center gap-1">
                      <span>{card.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
                    <span>Open lesson / tool</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 13: AUTHOR BIO */}
        <AboutAuthorSection />

      </div>
    </div>
  );
};

export default HowToFindSongScaleView;
