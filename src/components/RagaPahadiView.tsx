import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Sun, Calendar, CheckCircle2, Play, Pause, Square,
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Compass, Zap, Share2, 
  Sliders, Award, Sparkles, ShieldAlert, Lightbulb, ArrowLeft,
  RefreshCw, RotateCcw, Feather, Heart
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface RagaPahadiViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale (Approx Hz)
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'M(lower)': 174.61,
  'm(lower)': 174.61,
  'P(lower)': 196.00,
  'D(lower)': 220.00,
  'N(lower)': 246.94,

  // Middle Octave (Madhya Saptak)
  'S': 261.63,
  'Sa': 261.63,
  'R': 293.66,       // Shuddha Re
  'Re': 293.66,
  'G': 329.63,       // Shuddha Ga
  'Ga': 329.63,
  'm': 349.23,       // Shuddha Ma
  'M': 349.23,
  'Ma': 349.23,
  'P': 392.00,       // Shuddha Pa
  'Pa': 392.00,
  'D': 440.00,       // Shuddha Dha
  'Dha': 440.00,
  'N': 493.88,       // Shuddha Ni
  'Ni': 493.88,

  // High Octave (Taar Saptak)
  "S'": 523.25,
  "Sa'": 523.25,
  "R'": 587.33,
  "G'": 659.25,
  "M'": 698.46,
  "P'": 783.99,
  "D'": 880.00,
  "N'": 987.77,
};

export const RagaPahadiView: React.FC<RagaPahadiViewProps> = ({ onViewChange }) => {
  // Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);
  const [isPlayingPiece, setIsPlayingPiece] = useState(false);

  // Active swara highlight
  const [activeSwara, setActiveSwara] = useState<string | null>(null);

  // UI Modals & Tool states
  const [copiedNotation, setCopiedNotation] = useState(false);
  const [bpm, setBpm] = useState(64);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio Context & Active Timeouts
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeTimeoutsRef = useRef<number[]>([]);

  const stopAllAudio = () => {
    // Clear all pending timeouts
    activeTimeoutsRef.current.forEach(id => clearTimeout(id));
    activeTimeoutsRef.current = [];

    // Suspend audio context to immediately stop any active sound
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }

    // Reset playing state flags
    setActiveSwara(null);
    setIsPlayingAaroh(false);
    setIsPlayingAvaroh(false);
    setIsPlayingPakad(false);
    setPlayingExercise(null);
    setPlayingAalap(null);
    setIsPlayingPiece(false);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

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

  const playSwara = (swaraName: string, duration = 0.8) => {
    try {
      stopAllAudio();
      const ctx = getAudioContext();
      const cleanName = swaraName.replace(/[\(\)]/g, '');
      const freq = SWARA_FREQS[swaraName] || SWARA_FREQS[cleanName] || 261.63;

      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(cleanName);
      const tId = window.setTimeout(() => setActiveSwara(null), duration * 1000);
      activeTimeoutsRef.current.push(tId);
    } catch (e) {
      console.error('Audio playback error', e);
    }
  };

  const playSequence = (
    notes: string[],
    setPlayingState: (playing: boolean) => void,
    noteDuration = 0.9
  ) => {
    try {
      stopAllAudio();
      const ctx = getAudioContext();
      setPlayingState(true);

      let startTime = ctx.currentTime + 0.05;

      notes.forEach((note) => {
        const cleanNote = note.trim();
        const freq = SWARA_FREQS[cleanNote] || 261.63;

        playBambooFluteTone(ctx, freq, startTime, noteDuration, 0.26);

        const swaraTimeout = window.setTimeout(() => {
          setActiveSwara(cleanNote);
        }, Math.max(0, (startTime - ctx.currentTime) * 1000));
        activeTimeoutsRef.current.push(swaraTimeout);

        startTime += noteDuration + 0.15;
      });

      const endTimeout = window.setTimeout(() => {
        setActiveSwara(null);
        setPlayingState(false);
        activeTimeoutsRef.current = [];
      }, Math.max(0, (startTime - ctx.currentTime) * 1000 + 100));
      activeTimeoutsRef.current.push(endTimeout);
    } catch (e) {
      console.error('Sequence playback error', e);
      setPlayingState(false);
    }
  };

  // Preset Playback Sequences
  const handlePlayAaroh = () => {
    if (isPlayingAaroh) {
      stopAllAudio();
      return;
    }
    playSequence(['S', 'R', 'G', 'P', 'D', "S'"], setIsPlayingAaroh, 0.95);
  };

  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) {
      stopAllAudio();
      return;
    }
    playSequence(["S'", 'N', 'D', 'P', 'G', 'R', 'S'], setIsPlayingAvaroh, 0.95);
  };

  const handlePlayPakad = () => {
    if (isPlayingPakad) {
      stopAllAudio();
      return;
    }
    playSequence([
      'S', 'R', 'G', 'P', 'G', 'R', 'S',
      'P', 'D', "S'", 'N', 'D', 'P', 'G', 'R', 'S'
    ], setIsPlayingPakad, 0.85);
  };

  // Practice Exercises Playback
  const EXERCISES_NOTES = [
    ['S', 'R', 'G', 'P', 'P', 'G', 'R', 'S'], // Ex 1
    ['P', 'D', "S'", "S'", 'N', 'D', 'P', 'P', 'D', "S'", 'N', 'D', 'P'], // Ex 2
    ['S', 'R', 'G', 'P', 'D', "S'", "S'", 'N', 'D', 'P', 'G', 'R', 'S'], // Ex 3
    ['G', 'P', 'G', 'R', 'G', 'P', 'D', 'P', 'G', 'P', 'D', 'P', 'G', 'R'], // Ex 4
    ["S'", 'N', 'D', 'P', 'G', 'R', 'S', "S'", 'N', 'D', 'P', 'G', 'P', 'G', 'R', 'S'], // Ex 5
    ['S', 'R', 'G', 'P', 'G', 'R', 'S', 'P', 'D', "S'", 'N', 'D', 'P', 'G', 'R', 'S'], // Ex 6
  ];

  const handlePlayExercise = (index: number) => {
    if (playingExercise === index) {
      stopAllAudio();
      return;
    }
    setPlayingExercise(index);
    playSequence(EXERCISES_NOTES[index], (val) => {
      if (!val) setPlayingExercise(null);
    }, 0.85);
  };

  // Aalap Phrases Playback
  const AALAP_NOTES = [
    ['S', 'R', 'G', 'P', 'G', 'R', 'S'],
    ['S', 'R', 'G', 'P', 'G', 'R', 'S', 'R', 'G', 'P', 'D', 'P', 'G', 'R', 'S'],
    ['G', 'P', 'D', "S'", "S'", 'N', 'D', 'P', 'G', 'R', 'S', 'R', 'G', 'P'],
    ['S', 'R', 'G', 'P', 'D', 'P', 'G', 'R', 'S', 'R', 'G', 'P', 'G', 'R', 'S'],
    ['P', 'D', "S'", 'N', 'D', 'P', 'G', 'R', 'S', 'R', 'G', 'P', 'G', 'R', 'S']
  ];

  const handlePlayAalap = (index: number) => {
    if (playingAalap === index) {
      stopAllAudio();
      return;
    }
    setPlayingAalap(index);
    playSequence(AALAP_NOTES[index], (val) => {
      if (!val) setPlayingAalap(null);
    }, 0.9);
  };

  // Original Learning Piece Playback
  const handlePlayPiece = () => {
    if (isPlayingPiece) {
      stopAllAudio();
      return;
    }
    setIsPlayingPiece(true);
    const pieceNotes = [
      // Aalap
      'S', 'R', 'G', 'P', 'G', 'R', 'S',
      'R', 'G', 'P', 'G', 'R', 'S',
      // Main Phrase
      'S', 'R', 'G', 'P', 'D', 'P', 'G', 'R',
      'S', 'R', 'G', 'P', 'G', 'R', 'S',
      // Development
      'G', 'P', 'D', "S'", "S'", 'N', 'D', 'P',
      'G', 'P', 'D', 'P', 'G', 'R', 'S',
      // Variation
      'S', 'R', 'G', 'P', 'D', "S'", 'N', 'D',
      'P', 'G', 'P', 'D', 'P', 'G', 'R', 'S',
      'R', 'G', 'P', 'D', "S'", 'N', 'D', 'P',
      'G', 'R', 'S',
      // Ending
      'S', 'R', 'G', 'P', 'G', 'R', 'S',
      'R', 'G', 'P', 'G', 'R', 'S'
    ];

    playSequence(pieceNotes, setIsPlayingPiece, 0.75);
  };

  // Copy Notation Handler
  const handleCopyNotation = () => {
    const notationText = `RAAG PAHADI — FLUTESANGAM ORIGINAL LEARNING PIECE
Notation Scale: C Natural Bansuri

Aalap:
S R G P | G R S — |
R G P — | G R S — ||

Main Phrase:
S R G P | D P G R |
S R G P | G R S — ||

Development:
G P D S' | S' N D P |
G P D P | G R S — ||

Variation:
S R G P | D S' N D |
P G P D | P G R S |
R G P D | S' N D P |
G R S — — — ||

Ending:
S R G P | G R S — |
R G P G | R S — — ||

© FluteSangam Original Learning Composition for Raag Pahadi`;

    navigator.clipboard.writeText(notationText);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2500);
  };

  // Metronome Timer
  useEffect(() => {
    let interval: any;
    if (isMetronomeActive) {
      interval = setInterval(() => {
        try {
          const ctx = getAudioContext();
          playTakMetronomeClick(ctx, currentBeat === 0);
        } catch (e) {
          console.error('Metronome error', e);
        }
        setCurrentBeat((prev) => (prev + 1) % 4);
      }, (60 / bpm) * 1000);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(interval);
  }, [isMetronomeActive, bpm, currentBeat]);

  // Practice Timer Countdown
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Swaras interactive grid items
  const swarasList = [
    { name: 'Sa', code: 'S', pitch: '261 Hz', desc: 'Root Note (Shadja)' },
    { name: 'Re', code: 'R', pitch: '293 Hz', desc: 'Shuddha Rishabh' },
    { name: 'Ga', code: 'G', pitch: '329 Hz', desc: 'Shuddha Gandhar' },
    { name: 'Ma', code: 'm', pitch: '349 Hz', desc: 'Shuddha Madhyam (Melodic Context)' },
    { name: 'Pa', code: 'P', pitch: '392 Hz', desc: 'Pancham' },
    { name: 'Dha', code: 'D', pitch: '440 Hz', desc: 'Shuddha Dhaivat' },
    { name: 'Ni', code: 'N', pitch: '493 Hz', desc: 'Shuddha Nishad' },
    { name: 'Sa\'', code: "S'", pitch: '523 Hz', desc: 'Taar Saptak Sa' },
  ];

  const faqs = [
    {
      q: 'Is Raag Pahadi suitable for beginner bansuri players?',
      a: 'Yes! Pahadi is very accessible because it uses natural Shuddha swaras and song-like melodic phrases. It is an ideal raga for moving from basic finger exercises to expressive musical playing.'
    },
    {
      q: 'Why is Raag Pahadi called a "phrase-oriented" raga?',
      a: 'Unlike rigid classical ragas that follow strict ascending/descending scales, Pahadi derives its identity from characteristic regional folk phrases (such as S R G P and Ga-Pa leaps). It allows flexible swara usage.'
    },
    {
      q: 'What scale/flute key should I use to practice Raag Pahadi?',
      a: 'You can practice on any Bansuri (such as E Bass, G Medium, or C Natural). Our interactive audio player uses C Natural pitch (Sa = 261.63 Hz) for clear representation.'
    },
    {
      q: 'How do I achieve the sweet Pahadi folk sound on the flute?',
      a: 'Focus on smooth note transitions, gentle meend (slides between Re-Ga and Ga-Pa), relaxed blowing, and singing the phrases mentally before playing.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 font-sans">
      {/* Top Navigation Header */}
      <div className="bg-emerald-950 text-emerald-100 border-b border-emerald-900/60 sticky top-0 z-30 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => onViewChange?.('learn_raagas')}
            className="flex items-center gap-2 text-emerald-300 hover:text-white transition font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Raagas</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-emerald-300/80">
            <span>Learn Raagas</span>
            <span>/</span>
            <span className="text-white font-semibold">Raag Pahadi</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-800/60 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700/80 text-emerald-200 text-xs font-semibold mb-3">
                <Feather className="w-3.5 h-3.5 text-emerald-300" />
                <span>Himalayan Folk & Lyrical Raga</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white">
                Raag Pahadi
              </h1>
              <p className="text-emerald-200/90 text-sm sm:text-base mt-2 max-w-2xl font-sans leading-relaxed">
                A lyrical, folk-inspired Himalayan raga known for its sweet melodic phrases, open Ga-Pa leaps, and expressive vocal quality on the Bansuri.
              </p>

              {/* Published and Updated Dates */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-emerald-200/90 pt-3">
                <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-700/60 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Published: <strong className="text-emerald-100 font-semibold" itemProp="datePublished">August 13, 2026</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-700/60 px-3 py-1 rounded-lg">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-300" />
                  <span>Updated: <strong className="text-emerald-100 font-semibold" itemProp="dateModified">August 13, 2026</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-700/60 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Reading Time: <strong className="text-emerald-100 font-semibold">15 min read</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleCopyNotation}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/60 text-white text-xs sm:text-sm font-semibold transition shadow-sm"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNotation ? 'Notation Copied!' : 'Copy Notation'}</span>
              </button>
            </div>
          </div>

          {/* Quick Raga Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-8">
            <div className="bg-emerald-900/40 border border-emerald-800/70 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-300/80 block uppercase tracking-wider">Thaat</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Folk / Regional</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800/70 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-300/80 block uppercase tracking-wider">Jati</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Phrase-Oriented</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800/70 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-300/80 block uppercase tracking-wider">Vadi Swara</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Sa (Flexible)</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800/70 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-300/80 block uppercase tracking-wider">Samvadi Swara</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Pa (Flexible)</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800/70 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-300/80 block uppercase tracking-wider">Time</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Anytime / Evening</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800/70 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-300/80 block uppercase tracking-wider">Mood</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Lyrical & Sweet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Comprehensive Guide */}
          <div className="lg:col-span-2 space-y-10">

            {/* Introduction Section */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <BookOpen className="w-6 h-6 text-emerald-800" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Introduction to Raag Pahadi</h2>
              </div>

              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                Raag Pahadi is a beautiful and highly melodic raga associated with the musical traditions of the Himalayan regions. Unlike many strictly defined Hindustani classical ragas, Pahadi is often heard in light-classical, folk, devotional, and film music and can have considerable melodic flexibility.
              </p>

              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                For a flute player, Pahadi is particularly enjoyable because its phrases can sound natural and song-like while still providing excellent practice for swara control, meend, breath management, and melodic expression.
              </p>

              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                Pahadi is often approached as a light and accessible raga, making it suitable for players who have already become comfortable with basic swaras and a few simple ragas.
              </p>

              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2">
                <h3 className="font-bold text-emerald-950 text-sm sm:text-base">It is especially useful for developing:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Natural melodic phrasing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Meend (slides)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Breath control & Note transitions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Folk-style expression & Aalap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Listening & Improvisation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Creating your own melodies</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  <strong>Important:</strong> Pahadi does not always behave like a rigid scale-based raga. Different traditions and performances may use additional swaras and different melodic movements. The framework below is intended as a practical learning guide for flute players rather than a claim that every performance of Pahadi follows one fixed scale.
                </p>
              </div>
            </section>

            {/* Notes Section & Interactive Swara Audio Explorer */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-emerald-800" />
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Notes & Interactive Swara Audio Explorer</h2>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Click to Listen
                </span>
              </div>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                A commonly used framework for learning Pahadi centers around: <strong>Sa, Re, Ga, Pa, Dha, Ni</strong>, with <strong>Ma</strong> also appearing in melodic contexts. Both ascending and descending movements can be treated flexibly depending on the musical phrase.
              </p>

              {/* Swara Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {swarasList.map((swara) => (
                  <button
                    key={swara.code}
                    onClick={() => playSwara(swara.code)}
                    className={`p-3.5 rounded-xl border text-left transition transform active:scale-95 flex flex-col justify-between ${
                      activeSwara === swara.code
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                        : 'bg-stone-50 hover:bg-emerald-50/80 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-lg">{swara.name}</span>
                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          activeSwara === swara.code ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {swara.code}
                        </span>
                      </div>
                      <span className="text-[11px] block opacity-80 mt-1">{swara.desc}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-70 mt-2 block">{swara.pitch}</span>
                  </button>
                ))}
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2 text-xs sm:text-sm text-stone-700">
                <p><strong>Basic Practice Framework:</strong> Ascending <code>S R G P D S'</code> and Descending <code>S' N D P G R S</code></p>
                <p className="text-stone-600 italic">Here: S = Sa, R = Shuddha Re, G = Shuddha Ga, P = Pa, D = Shuddha Dha, N = Shuddha Ni. The exact swara selection should not be treated as a rigid seven-note scale. Pahadi's identity comes strongly from its characteristic melodic phrases.</p>
              </div>
            </section>

            {/* Aaroh, Avaroh & Pakad Section */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <Music className="w-6 h-6 text-emerald-800" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Aaroh, Avaroh & Pakad</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aaroh */}
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-emerald-950 font-display">Aaroh (Ascent)</h3>
                    <button
                      onClick={handlePlayAaroh}
                      className={`p-2 rounded-xl transition ${
                        isPlayingAaroh ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                      }`}
                      title={isPlayingAaroh ? "Stop Aaroh" : "Play Aaroh"}
                    >
                      {isPlayingAaroh ? <Square className="w-4 h-4 fill-rose-900 text-rose-900" /> : <Play className="w-4 h-4 fill-emerald-900" />}
                    </button>
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-900 bg-white p-3 rounded-xl text-center border border-emerald-200/80">
                    S R G P D S'
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    <strong>Sa – Re – Ga – Pa – Dha – Sa</strong>. Practice slowly: <code>S R G — | P D S' —</code>. The leap from Ga to Pa gives the phrase a recognizable open quality.
                  </p>
                </div>

                {/* Avaroh */}
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-emerald-950 font-display">Avaroh (Descent)</h3>
                    <button
                      onClick={handlePlayAvaroh}
                      className={`p-2 rounded-xl transition ${
                        isPlayingAvaroh ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                      }`}
                      title={isPlayingAvaroh ? "Stop Avaroh" : "Play Avaroh"}
                    >
                      {isPlayingAvaroh ? <Square className="w-4 h-4 fill-rose-900 text-rose-900" /> : <Play className="w-4 h-4 fill-emerald-900" />}
                    </button>
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-900 bg-white p-3 rounded-xl text-center border border-emerald-200/80">
                    S' N D P G R S
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    <strong>Sa – Ni – Dha – Pa – Ga – Re – Sa</strong>. Practice: <code>S' N D P | G R S</code>. Make the descent singing and expressive.
                  </p>
                </div>
              </div>

              {/* Pakad */}
              <div className="bg-emerald-50/60 border border-emerald-200/90 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-emerald-950 font-display">Pakad (Catch Phrases)</h3>
                  <button
                    onClick={handlePlayPakad}
                    className={`p-2 rounded-xl transition ${
                      isPlayingPakad ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                    }`}
                    title={isPlayingPakad ? "Stop Pakad" : "Play Pakad"}
                  >
                    {isPlayingPakad ? <Square className="w-4 h-4 fill-rose-900 text-rose-900" /> : <Play className="w-4 h-4 fill-emerald-900" />}
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-emerald-900 bg-white p-3 rounded-xl text-center border border-emerald-200/80 space-y-1">
                  <div>Phrase 1: S R G P | G R S</div>
                  <div>Phrase 2: P D S' | N D P | G R S</div>
                  <div>Phrase 3: G P D P | G R S</div>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  Start with <code>S R G P | G R S</code>, then <code>P D S' | N D P</code>, and finally <code>G P D P | G R S</code>. Try to make the phrases sound connected and musical.
                </p>
              </div>
            </section>

            {/* Classical Attributes & Characteristics */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <Sparkles className="w-6 h-6 text-emerald-800" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Raga Characteristics & Theoretical Framework</h2>
              </div>

              {/* Thaat, Jati, Vadi/Samvadi Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1.5">
                  <h3 className="font-bold text-stone-900 text-sm">Time of Performance</h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Pahadi does not have a strict performance-time restriction. Widely used in folk, light-classical, devotional, and popular music, it can comfortably be practiced at any time of day.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1.5">
                  <h3 className="font-bold text-stone-900 text-sm">Thaat & Jati Classification</h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Pahadi does not fit neatly into a single rigid Thaat. It is best understood as a phrase-oriented melodic framework influenced by Himalayan regional traditions.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1.5">
                  <h3 className="font-bold text-stone-900 text-sm">Vadi & Samvadi</h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    There is no single universally applied Vadi-Samvadi pair. Attention should be given to the relationships between Sa, Re, Ga, Pa, Dha, and Ni.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1.5">
                  <h3 className="font-bold text-stone-900 text-sm">Key Melodic Identity</h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Open Ga-Pa leaps, sweet descending phrasing, and song-like lyrical flow give Pahadi its immediate, recognizable charm.
                  </p>
                </div>
              </div>

              {/* 5 Characteristics */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-stone-900 font-display">5 Key Characteristics of Raag Pahadi</h3>

                <div className="space-y-3">
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-950 text-sm mb-1">1. Folk-Like Character</h4>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      One of the most recognizable qualities of Pahadi is its natural, folk-inspired melodic character. Its phrases can sound immediately familiar, lyrical, and enjoyable for flute players.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-950 text-sm mb-1">2. Simple Melodic Movements</h4>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      Introductory Pahadi phrases use accessible movements like <code>S R G P</code> and <code>P G R S</code>, making them ideal for developing basic phrase control.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-950 text-sm mb-1">3. Expressive Descents</h4>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      Descending phrases <code>S' N D P G R S</code> should be played with a singing, vocal quality rather than played mechanically.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-950 text-sm mb-1">4. Flexible Swara Usage</h4>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      Pahadi is more flexible than strict classical ragas. Different contexts may introduce additional notes or alternative movements. Listening and phrase recognition are essential.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-950 text-sm mb-1">5. Strong Connection With Melody</h4>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      Pahadi helps flute players make their flute sound like it is singing a melody, bridging the gap between technical exercises and genuine musical expression.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Step-by-Step Practice Exercises */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <Sliders className="w-6 h-6 text-emerald-800" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Step-by-Step Practice Exercises</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    idx: 0,
                    title: 'Practice 1 — Basic Movement',
                    notes: 'S R G P | P G R S',
                    desc: 'Repeat slowly. Focus on keeping every note clean and clear.'
                  },
                  {
                    idx: 1,
                    title: 'Practice 2 — Upper Register',
                    notes: "P D S' | S' N D P | P D S' | N D P",
                    desc: 'Avoid forcing upper Sa. Maintain a relaxed embouchure.'
                  },
                  {
                    idx: 2,
                    title: 'Practice 3 — Complete Basic Framework',
                    notes: "S R G P D S' | S' N D P G R S",
                    desc: 'Play slowly with a Tanpura drone for pitch alignment.'
                  },
                  {
                    idx: 3,
                    title: 'Practice 4 — Ga-Pa Movement',
                    notes: 'G P G R | G P D P | G P D P G R',
                    desc: 'Develops control over the characteristic open Ga-Pa movement.'
                  },
                  {
                    idx: 4,
                    title: 'Practice 5 — Descending Phrases',
                    notes: "S' N D P | G R S | S' N D P | G P G R S",
                    desc: 'Focus on vocal expression rather than mechanical execution.'
                  },
                  {
                    idx: 5,
                    title: 'Practice 6 — Pakad Integration',
                    notes: "S R G P | G R S | P D S' | N D P | G R S",
                    desc: 'Connect the phrases into a continuous, flowing melody.'
                  }
                ].map((ex) => (
                  <div key={ex.idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-emerald-950 text-sm sm:text-base font-display">{ex.title}</h3>
                        <button
                          onClick={() => handlePlayExercise(ex.idx)}
                          className={`p-1.5 rounded-lg transition text-xs font-semibold flex items-center gap-1 ${
                            playingExercise === ex.idx
                              ? 'bg-rose-100 text-rose-950 hover:bg-rose-200'
                              : 'bg-emerald-200/80 hover:bg-emerald-300 text-emerald-950'
                          }`}
                        >
                          {playingExercise === ex.idx ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-rose-950" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-emerald-950" />
                              Play
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-200 my-2">
                        {ex.notes}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600">{ex.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Aalap & Meend Practice Section */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <Feather className="w-6 h-6 text-emerald-800" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Aalap & Meend Practice</h2>
              </div>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                Pahadi is well suited to a simple, melodic Aalap. Avoid playing too many notes at once. Allow each phrase to breathe and experiment with pauses.
              </p>

              {/* Aalap Phrases */}
              <div className="space-y-3">
                {[
                  { title: 'Aalap 1', notes: 'S — R G | P — G R | S — — — ||' },
                  { title: 'Aalap 2', notes: 'S R G P | G R S — | R G P D | P G R S ||' },
                  { title: 'Aalap 3', notes: "G P D S' | S' N D P | G R S — | R G P — ||" },
                  { title: 'Aalap 4', notes: 'S R G P | D P G R | S R G P | G R S — ||' },
                  { title: 'Aalap 5', notes: "P D S' N | D P G R | S R G P | G R S — ||" },
                ].map((aalap, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-950 text-xs sm:text-sm">{aalap.title}</span>
                      <div className="font-mono text-xs sm:text-sm font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                        {aalap.notes}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayAalap(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-center shrink-0 ${
                        playingAalap === idx
                          ? 'bg-rose-100 text-rose-950 hover:bg-rose-200'
                          : 'bg-emerald-200/80 hover:bg-emerald-300 text-emerald-950'
                      }`}
                    >
                      {playingAalap === idx ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-rose-950" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-emerald-950" />
                          Listen
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Meend Practice Sub-block */}
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3 pt-4">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Meend (Graceful Slide) Practice</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Pahadi sounds especially beautiful when played with gentle meend. Practice sliding smoothly between:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs sm:text-sm text-center font-bold text-emerald-900">
                  <div className="bg-white p-2 rounded-lg border border-emerald-200">R ~ G</div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-200">G ~ P</div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-200">P ~ D</div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-200">D ~ S'</div>
                </div>
                <div className="text-xs text-stone-600 pt-1">
                  <strong>Descending Meend:</strong> <code>S' ~ D ~ P</code> and <code>P ~ G ~ R ~ S</code>. Keep the slides controlled and use meend only where it enhances the phrase.
                </div>
              </div>
            </section>

            {/* Common Mistakes Section */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <ShieldAlert className="w-6 h-6 text-rose-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Common Mistakes to Avoid</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                  <h3 className="font-bold text-rose-950 text-sm">1. Treating Pahadi as a Fixed Scale</h3>
                  <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                    Assuming that Pahadi can be fully represented by one rigid scale. <strong>Tip:</strong> Learn phrases and listen to different interpretations.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                  <h3 className="font-bold text-rose-950 text-sm">2. Playing Every Note With Equal Importance</h3>
                  <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                    Pahadi works through melodic movement rather than equal emphasis on every swara. <strong>Tip:</strong> Shape your phrases like a singer.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                  <h3 className="font-bold text-rose-950 text-sm">3. Rushing</h3>
                  <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                    Fast playing can remove the natural character of Pahadi. <strong>Tip:</strong> Start slowly and leave space between phrases.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                  <h3 className="font-bold text-rose-950 text-sm">4. Overusing Ornamentation</h3>
                  <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                    Too much meend or unnecessary decoration can make a simple phrase sound unclear. <strong>Tip:</strong> Use ornamentation sparingly.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                  <h3 className="font-bold text-rose-950 text-sm">5. Ignoring the Folk Character</h3>
                  <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                    Trying to make every phrase sound extremely formal can remove the natural charm of Pahadi. <strong>Tip:</strong> Allow the melody to remain simple, relaxed, and lyrical.
                  </p>
                </div>
              </div>
            </section>

            {/* FluteSangam Original Learning Piece */}
            <section className="bg-gradient-to-br from-emerald-900 to-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Practice Composition</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">FluteSangam Original Learning Piece</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNotation}
                    className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {copiedNotation ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handlePlayPiece}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md ${
                      isPlayingPiece
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 hover:from-emerald-300 hover:to-teal-300'
                    }`}
                  >
                    {isPlayingPiece ? (
                      <>
                        <Square className="w-4 h-4 fill-white" />
                        <span>Stop Piece</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-emerald-950" />
                        <span>Play Piece</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-emerald-200/90 italic bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80">
                This composition has been newly created for FluteSangam as an original practice piece for Raag Pahadi. It is not presented as a traditional composition or bandish.
              </p>

              {/* Notation Sections */}
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-stone-950/70 p-4 rounded-xl border border-emerald-800/50 space-y-1">
                  <span className="text-emerald-400 text-xs font-sans font-bold uppercase block">Aalap</span>
                  <div className="text-emerald-100 font-bold">S R G P | G R S — |</div>
                  <div className="text-emerald-100 font-bold">R G P — | G R S — ||</div>
                  <p className="text-xs text-emerald-300/70 font-sans mt-1">Play this gently with long breaths.</p>
                </div>

                <div className="bg-stone-950/70 p-4 rounded-xl border border-emerald-800/50 space-y-1">
                  <span className="text-emerald-400 text-xs font-sans font-bold uppercase block">Main Phrase</span>
                  <div className="text-emerald-100 font-bold">S R G P | D P G R |</div>
                  <div className="text-emerald-100 font-bold">S R G P | G R S — ||</div>
                  <p className="text-xs text-emerald-300/70 font-sans mt-1">Focus on smooth transitions.</p>
                </div>

                <div className="bg-stone-950/70 p-4 rounded-xl border border-emerald-800/50 space-y-1">
                  <span className="text-emerald-400 text-xs font-sans font-bold uppercase block">Development</span>
                  <div className="text-emerald-100 font-bold">G P D S' | S' N D P |</div>
                  <div className="text-emerald-100 font-bold">G P D P | G R S — ||</div>
                  <p className="text-xs text-emerald-300/70 font-sans mt-1">Keep the upper register relaxed.</p>
                </div>

                <div className="bg-stone-950/70 p-4 rounded-xl border border-emerald-800/50 space-y-1">
                  <span className="text-emerald-400 text-xs font-sans font-bold uppercase block">Variation</span>
                  <div className="text-emerald-100 font-bold">S R G P | D S' N D |</div>
                  <div className="text-emerald-100 font-bold">P G P D | P G R S |</div>
                  <div className="text-emerald-100 font-bold">R G P D | S' N D P |</div>
                  <div className="text-emerald-100 font-bold">G R S — — — ||</div>
                  <p className="text-xs text-emerald-300/70 font-sans mt-1">Practice this only after the Main Phrase is comfortable.</p>
                </div>

                <div className="bg-stone-950/70 p-4 rounded-xl border border-emerald-800/50 space-y-1">
                  <span className="text-emerald-400 text-xs font-sans font-bold uppercase block">Ending</span>
                  <div className="text-emerald-100 font-bold">S R G P | G R S — |</div>
                  <div className="text-emerald-100 font-bold">R G P G | R S — — ||</div>
                  <p className="text-xs text-emerald-300/70 font-sans mt-1">Resolve naturally to Sa.</p>
                </div>
              </div>

              {/* How to Practice Steps */}
              <div className="bg-emerald-950/80 p-5 rounded-xl border border-emerald-800 space-y-2 text-xs sm:text-sm text-emerald-100">
                <h3 className="font-bold text-white text-base">How to Practice the Original Learning Piece</h3>
                <ul className="space-y-1.5 list-disc list-inside text-emerald-200">
                  <li><strong>Step 1 — Learn the Aalap:</strong> Play the Aalap slowly with long breaths.</li>
                  <li><strong>Step 2 — Practice the Main Phrase:</strong> Repeat until it feels natural.</li>
                  <li><strong>Step 3 — Add the Development:</strong> Introduce upper-register section gradually.</li>
                  <li><strong>Step 4 — Practice the Variation:</strong> Work on the variation phrase by phrase.</li>
                  <li><strong>Step 5 — Connect Everything:</strong> Play Aalap → Main Phrase → Development → Variation → Ending as one continuous melody.</li>
                </ul>
              </div>
            </section>

            {/* Practice Routine & Tips */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <Clock className="w-6 h-6 text-emerald-800" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Raag Pahadi Practice Routine & Tips</h2>
              </div>

              {/* Tips Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-emerald-950 block text-sm mb-0.5">Use a Tanpura</strong>
                  <span className="text-stone-600">Practice against a Tanpura drone to develop pitch stability.</span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-emerald-950 block text-sm mb-0.5">Practice Slowly</strong>
                  <span className="text-stone-600">A slow, expressive phrase is much more effective than a fast sequence.</span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-emerald-950 block text-sm mb-0.5">Think Like a Singer</strong>
                  <span className="text-stone-600">Hum the phrase mentally before playing it on the flute.</span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-emerald-950 block text-sm mb-0.5">Practice Short Phrases</strong>
                  <span className="text-stone-600">Focus on small ideas like S R G P and P G R S.</span>
                </div>
              </div>

              {/* Recommended Daily Routine */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-stone-900 text-base">Recommended 60-Minute Practice Schedule</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">5 Mins — Long Notes</span>
                    <span className="text-stone-600">Hold Sa, Re, Ga, Pa, Dha with Tanpura.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">10 Mins — Basic Swaras</span>
                    <span className="text-stone-600">Aaroh & Avaroh slow practice.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">10 Mins — Short Phrases</span>
                    <span className="text-stone-600">S R G P, P G R S, G P D P.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">10 Mins — Pakad</span>
                    <span className="text-stone-600">Characteristic Pahadi phrases.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">10 Mins — Aalap</span>
                    <span className="text-stone-600">Create gentle, breathing phrases.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">15 Mins — Original Piece & Free Playing</span>
                    <span className="text-stone-600">Practice composition & improvise.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Why & Who Should Learn Section */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-800" />
                    <span>Why Learn Raag Pahadi?</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 list-disc list-inside">
                    <li>Natural melodic phrasing</li>
                    <li>Controlled meend (slides)</li>
                    <li>Breath control & Swara transitions</li>
                    <li>Upper-register confidence</li>
                    <li>Aalap development</li>
                    <li>Improvisation & Folk musicality</li>
                    <li>Creating original melodies</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-800" />
                    <span>Who Should Learn Raag Pahadi?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    Pahadi is ideal for players who understand basic flute fingering, Sa Re Ga Ma concepts, basic breath control, simple Aalap, and basic meend. It bridges the gap between technical exercises and vocal musicality.
                  </p>
                </div>
              </div>
            </section>

            {/* Final Thoughts & FluteSangam Tip */}
            <section className="bg-emerald-900 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-display">Final Thoughts</h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                Raag Pahadi is a wonderful raga for flute players who want to develop a more natural, lyrical, and expressive playing style. Its flexible character makes it different from strictly structured ragas. Rather than trying to memorize one fixed scale, spend time listening to Pahadi melodies and learning how its phrases move.
              </p>

              <div className="bg-emerald-950/80 border border-emerald-700/80 p-4 rounded-xl flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-amber-300 shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  <strong>FluteSangam Tip:</strong> Don't think of Pahadi as a list of notes. Think of it as a melody that you are learning to sing through the flute.
                </p>
              </div>
            </section>

            {/* FAQ Accordion */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-stone-900 text-sm flex items-center justify-between bg-stone-50 hover:bg-stone-100 transition"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="w-4 h-4 text-stone-600" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-stone-700 border-t border-stone-200 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* About Author Section */}
            <AboutAuthorSection />

          </div>

          {/* Right Column: Practice Tools & Interactive Metronome */}
          <div className="space-y-6">
            
            {/* Metronome Tool */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-bold text-stone-900 text-base">Interactive Metronome</h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {bpm} BPM
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="40"
                    max="160"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                </div>

                {/* Beat Visualizer */}
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((b) => (
                    <div
                      key={b}
                      className={`h-3 rounded-full transition ${
                        isMetronomeActive && currentBeat === b
                          ? b === 0 ? 'bg-amber-500 shadow-md' : 'bg-emerald-600 shadow-md'
                          : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                    isMetronomeActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
                  }`}
                >
                  {isMetronomeActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Stop Metronome</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Metronome ({bpm} BPM)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Practice Timer Sub-widget */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-800" />
                    Practice Timer
                  </span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{formatTime(timerSeconds)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
                  >
                    {isTimerRunning ? 'Pause Timer' : 'Start 20m Timer'}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(20 * 60);
                    }}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
                <span className="font-bold text-stone-900 block mb-1">Explore Other Raagas</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Raag Bhoopali', view: 'raga_bhoopali' },
                    { name: 'Raag Yaman', view: 'raga_yaman' },
                    { name: 'Raag Todi', view: 'raga_todi' },
                    { name: 'Raag Multani', view: 'raga_multani' },
                    { name: 'Raag Desh', view: 'raga_desh' },
                    { name: 'Raag Kafi', view: 'raga_kafi' },
                  ].map((r) => (
                    <button
                      key={r.view}
                      onClick={() => onViewChange?.(r.view as AppView)}
                      className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 transition font-medium text-[11px]"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RagaPahadiView;
