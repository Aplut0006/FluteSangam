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

interface RagaMultaniViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'S(lower)': 130.81,
  'r(lower)': 138.59,
  'g(lower)': 155.56,
  'M^(lower)': 184.99,
  'P(lower)': 196.00,
  'd(lower)': 207.65,
  'N(lower)': 246.94,

  // Middle Octave (Madhya Saptak)
  'S': 261.63,
  'Sa': 261.63,
  'r': 277.18,       // Komal Re
  'Re(komal)': 277.18,
  'g': 311.13,       // Komal Ga
  'Ga(komal)': 311.13,
  'M^': 369.99,      // Tivra Ma
  'Ma(tivra)': 369.99,
  'P': 392.00,       // Shuddha Pa
  'Pa': 392.00,
  'd': 415.30,       // Komal Dha
  'Dha(komal)': 415.30,
  'N': 493.88,       // Shuddha Ni
  'Ni': 493.88,

  // High Octave (Taar Saptak)
  "S'": 523.25,
  "Sa'": 523.25,
  "r'": 554.37,      // Komal Re
  "g'": 622.25,      // Komal Ga
  "M^'": 739.99,     // Tivra Ma
  "P'": 783.99,
  "d'": 830.61,      // Komal Dha
  "N'": 987.77,
};

export const RagaMultaniView: React.FC<RagaMultaniViewProps> = ({ onViewChange }) => {
  // Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);
  const [isPlayingPiece, setIsPlayingPiece] = useState(false);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [copiedNotation, setCopiedNotation] = useState(false);
  
  // Metronome states
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(70);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(16);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  // Practice Timer (45 mins)
  const [timerSeconds, setTimerSeconds] = useState(2700);
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
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play Single Note
  const playSwara = (swaraName: string, duration = 1.2) => {
    try {
      const ctx = getAudioContext();
      const cleanName = swaraName.trim();
      const freq = SWARA_FREQS[cleanName] || 261.63;

      playBambooFluteTone(ctx, freq, ctx.currentTime, duration, 0.28);

      setActiveSwara(cleanName);
      const tId = window.setTimeout(() => setActiveSwara(null), duration * 1000);
      activeTimeoutsRef.current.push(tId);
    } catch (e) {
      console.error('Audio playback error', e);
    }
  };

  // Play Sequence Helper
  const playSequence = (
    notes: string[], 
    setPlayingState: (val: boolean) => void, 
    noteDuration = 0.95
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
    playSequence(['N(lower)', 'S', 'g', 'M^', 'P', 'N', "S'"], setIsPlayingAaroh, 1.0);
  };

  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) {
      stopAllAudio();
      return;
    }
    playSequence(["S'", 'N', 'd', 'P', 'M^', 'g', 'r', 'S'], setIsPlayingAvaroh, 1.0);
  };

  const handlePlayPakad = () => {
    if (isPlayingPakad) {
      stopAllAudio();
      return;
    }
    playSequence([
      'N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S',
      'N(lower)', 'd(lower)', 'P(lower)', 'M^(lower)', 'g', 'r', 'S'
    ], setIsPlayingPakad, 0.9);
  };

  // Exercises Playback
  const EXERCISES_NOTES = [
    ['S', 'g', 'M^', 'P', 'N', "S'", "S'", 'N', 'd', 'P', 'M^', 'g', 'r', 'S'], // Practice 1
    ['N(lower)', 'S', 'N(lower)', 'S', 'g', 'N(lower)', 'S', 'g', 'M^'], // Practice 2
    ['S', 'g', 'S', 'g', 'M^', 'g', 'M^', 'g', 'r', 'g', 'r', 'S'], // Practice 3
    ['g', 'M^', 'P', 'P', 'M^', 'g', 'g', 'M^', 'g', 'r'], // Practice 4
    ['N', 'd', 'P', "S'", 'N', 'd', 'P', 'N', 'd', 'P', 'M^', 'g'], // Practice 5
    ['N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S', 'N(lower)', 'd(lower)', 'P(lower)', 'M^(lower)', 'g', 'r', 'S'] // Practice 6
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

  // Aalap Playback
  const AALAP_NOTES = [
    ['N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S', 'N(lower)', 'S', 'g', 'M^'],
    ['N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S', 'N(lower)', 'd(lower)', 'P(lower)', 'M^(lower)', 'g', 'r', 'S'],
    ['N(lower)', 'S', 'g', 'M^', 'P', 'M^', 'g', 'r', 'S', 'N(lower)', 'S', 'g', 'M^', 'g'],
    ["S'", 'N', 'd', 'P', 'M^', 'g', 'r', 'S', 'N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S'],
    ['N(lower)', 'S', 'g', 'M^', 'P', 'N', "S'", "S'", 'N', 'd', 'P', 'M^', 'g', 'r', 'S']
  ];

  const handlePlayAalap = (index: number) => {
    if (playingAalap === index) {
      stopAllAudio();
      return;
    }
    setPlayingAalap(index);
    playSequence(AALAP_NOTES[index], (val) => {
      if (!val) setPlayingAalap(null);
    }, 1.0);
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
      'N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S',
      'N(lower)', 'S', 'g', 'M^', 'g', 'r',
      // Main Phrase
      'N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S',
      'N(lower)', 'd(lower)', 'P(lower)', 'M^(lower)', 'g', 'r', 'S',
      // Development
      'N(lower)', 'S', 'g', 'M^', 'P', 'N', "S'",
      "S'", 'N', 'd', 'P', 'M^', 'g', 'r', 'S',
      'N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S',
      // Ending
      'N(lower)', 'S', 'g', 'M^', 'g', 'r', 'S',
      'N(lower)', 'd(lower)', 'P(lower)', 'M^(lower)', 'g', 'r', 'S'
    ];
    playSequence(pieceNotes, setIsPlayingPiece, 0.85);
  };

  // Copy Notation
  const handleCopyNotation = () => {
    const notationText = `FluteSangam Original Learning Piece — Raag Multani

Aalap:
N — S g | M^ g r S |
N — S — | g M^ g r ||

Main Phrase:
N S g M^ | g r S — |
N d P M^ | g r S — ||

Development:
N S g M^ | P N S' — |
S' N d P | M^ g r S |
N S g M^ | g r S — ||

Variation:
N S g M^ | g M^ P — |
N d P M^ | g r S — |
S g M^ P | N S' N d |
P M^ g r | S — — — ||

Ending:
N S g M^ | g r S — |
N d P M^ | g r S — ||`;

    navigator.clipboard.writeText(notationText);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2500);
  };

  // Metronome Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      interval = setInterval(() => {
        try {
          const ctx = getAudioContext();
          setCurrentBeat(prev => {
            const nextBeat = (prev % beatsPerMeasure) + 1;
            playTakMetronomeClick(ctx, nextBeat === 1);
            return nextBeat;
          });
        } catch (err) {
          console.error('Metronome error', err);
        }
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMetronomeActive, bpm, beatsPerMeasure]);

  // Practice Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-amber-50/50 pb-20">
      {/* Header / Breadcrumb */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-amber-50 py-8 px-4 sm:px-6 shadow-md border-b border-amber-700/50">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200/90 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-white transition flex items-center gap-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Raagas Guide
            </button>
            <span>/</span>
            <span className="text-amber-100 font-semibold">Raag Multani</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/80 border border-amber-600/50 text-amber-200 text-xs font-semibold mb-3">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Todi Thaat Family • Afternoon Raga</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-amber-100 tracking-tight">
                Raag Multani
              </h1>
              <p className="text-amber-200/90 text-sm sm:text-base mt-2 max-w-2xl font-sans leading-relaxed">
                A deeply expressive Hindustani classical raga known for its introspective, serious, and meditative character.
              </p>

              {/* Published and Updated Dates */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-amber-200/90 pt-3">
                <div className="flex items-center gap-1.5 bg-amber-950/50 border border-amber-700/60 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>Published: <strong className="text-amber-100 font-semibold" itemProp="datePublished">August 12, 2026</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-950/50 border border-amber-700/60 px-3 py-1 rounded-lg">
                  <RefreshCw className="w-3.5 h-3.5 text-orange-300" />
                  <span>Updated: <strong className="text-amber-100 font-semibold" itemProp="dateModified">August 12, 2026</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-950/50 border border-amber-700/60 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Reading Time: <strong className="text-amber-100 font-semibold">15 min read</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleCopyNotation}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800/90 hover:bg-amber-700 text-amber-100 text-xs sm:text-sm font-semibold transition border border-amber-600/60 shadow-sm"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNotation ? 'Notation Copied!' : 'Copy Notation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10">

        {/* Quick Reference Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center">
            <div className="text-xs text-amber-700 font-medium mb-1">Thaat</div>
            <div className="text-base font-bold text-amber-950 font-display">Todi</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center">
            <div className="text-xs text-amber-700 font-medium mb-1">Jati</div>
            <div className="text-base font-bold text-amber-950 font-display">Audav-Sampurna</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center">
            <div className="text-xs text-amber-700 font-medium mb-1">Vadi</div>
            <div className="text-base font-bold text-amber-950 font-display">Pa</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center">
            <div className="text-xs text-amber-700 font-medium mb-1">Samvadi</div>
            <div className="text-base font-bold text-amber-950 font-display">Sa</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center">
            <div className="text-xs text-amber-700 font-medium mb-1">Time</div>
            <div className="text-base font-bold text-amber-950 font-display">3 PM - 6 PM</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center">
            <div className="text-xs text-amber-700 font-medium mb-1">Level</div>
            <div className="text-base font-bold text-amber-950 font-display">Advanced</div>
          </div>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <h2>Introduction</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base">
            <strong className="text-amber-950 font-semibold">Raag Multani</strong> is a deeply expressive Hindustani classical raga known for its introspective, serious, and meditative character. It belongs to the <strong className="text-amber-950">Todi family of ragas</strong> and is traditionally associated with the <strong className="text-amber-950">afternoon period</strong> (3 PM to 6 PM).
          </p>
          <p className="text-gray-700 leading-relaxed text-base">
            Multani has a distinctive sound created by the combination of <strong className="text-amber-950">Komal Re, Komal Ga, Tivra Ma, and Komal Dha</strong>, along with characteristic movements that are quite different from simply playing a seven-note scale.
          </p>
          
          <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-200/70 space-y-2 mt-4">
            <h3 className="font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700" />
              Why Multani is Essential for Bansuri Flute Players
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              For flute players, Multani is especially valuable for developing:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs sm:text-sm text-amber-900 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Precise swara control</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Komal-note intonation</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Tivra Ma control</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Smooth Meend</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Breath management</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Slow Aalap phrasing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Phrase development</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Upper-register control</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Expressive playing</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 italic bg-amber-100/50 p-3 rounded-lg border border-amber-200/50">
            <strong>Note for learners:</strong> Multani is generally better suited to <strong>intermediate-to-advanced and advanced players</strong> because its identity depends heavily on swara treatment and characteristic phrases.
          </p>
        </section>

        {/* Interactive Swara Explorer */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl">
              <Music className="w-6 h-6 text-amber-600" />
              <h2>Notes (Swaras)</h2>
            </div>
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Click swara to listen
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { label: 'Sa', swara: 'S', note: 'Shuddha Sa', freq: '261.6 Hz', type: 'Shuddha' },
              { label: 're', swara: 'r', note: 'Komal Re', freq: '277.2 Hz', type: 'Komal' },
              { label: 'ga', swara: 'g', note: 'Komal Ga', freq: '311.1 Hz', type: 'Komal' },
              { label: 'Ma^', swara: 'M^', note: 'Tivra Ma', freq: '370.0 Hz', type: 'Tivra' },
              { label: 'Pa', swara: 'P', note: 'Shuddha Pa', freq: '392.0 Hz', type: 'Shuddha' },
              { label: 'dha', swara: 'd', note: 'Komal Dha', freq: '415.3 Hz', type: 'Komal' },
              { label: 'Ni', swara: 'N', note: 'Shuddha Ni', freq: '493.9 Hz', type: 'Shuddha' },
            ].map((s) => (
              <button
                key={s.swara}
                onClick={() => playSwara(s.swara)}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  activeSwara === s.swara
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105'
                    : 'bg-amber-50/50 hover:bg-amber-100/80 text-amber-950 border-amber-200/80 hover:border-amber-300'
                }`}
              >
                <div className="text-lg font-bold font-display">{s.label}</div>
                <div className="text-xs font-semibold opacity-90 mt-0.5">{s.note}</div>
                <div className="text-[10px] opacity-75 mt-1">{s.freq}</div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-sm text-gray-700 space-y-2">
            <div className="font-bold text-amber-950">Swara Notation Framework:</div>
            <div className="font-mono text-base font-bold text-amber-900 tracking-wider">
              S r g M^ P d N S'
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              One of the most crucial structural features of Multani is that <strong>Re and Dha are generally treated carefully rather than simply being emphasized as ordinary scale notes</strong>.
            </p>
          </div>
        </section>

        {/* Aaroh, Avaroh & Pakad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aaroh */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="text-lg font-bold text-amber-950 font-display">Aaroh (Ascent)</h3>
                <button
                  onClick={handlePlayAaroh}
                  className={`p-2 rounded-xl transition ${
                    isPlayingAaroh ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  }`}
                  title={isPlayingAaroh ? "Stop Aaroh" : "Play Aaroh"}
                >
                  {isPlayingAaroh ? <Square className="w-4 h-4 fill-rose-900 text-rose-900" /> : <Play className="w-4 h-4 fill-amber-900" />}
                </button>
              </div>
              <div className="font-mono text-base font-bold text-amber-900 bg-amber-50/80 p-3 rounded-xl text-center border border-amber-200/80">
                N S g M^ P N S'
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                This movement gives a better introduction to the character of Multani than simply running all seven swaras upward.
              </p>
              <div className="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 font-mono text-amber-900">
                <div>N — S — g — M^ —</div>
                <div>P — N — S'</div>
              </div>
            </div>
            <p className="text-[11px] text-amber-800 italic">
              Pay special attention to the movement from Ni to Sa and the treatment of Komal Ga and Tivra Ma.
            </p>
          </div>

          {/* Avaroh */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="text-lg font-bold text-amber-950 font-display">Avaroh (Descent)</h3>
                <button
                  onClick={handlePlayAvaroh}
                  className={`p-2 rounded-xl transition ${
                    isPlayingAvaroh ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  }`}
                  title={isPlayingAvaroh ? "Stop Avaroh" : "Play Avaroh"}
                >
                  {isPlayingAvaroh ? <Square className="w-4 h-4 fill-rose-900 text-rose-900" /> : <Play className="w-4 h-4 fill-amber-900" />}
                </button>
              </div>
              <div className="font-mono text-base font-bold text-amber-900 bg-amber-50/80 p-3 rounded-xl text-center border border-amber-200/80">
                S' N d P M^ g r S
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sa – Ni – Komal Dha – Pa – Tivra Ma – Komal Ga – Komal Re – Sa
              </p>
              <div className="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 font-mono text-amber-900">
                <div>S' — N d — P —</div>
                <div>M^ g — r S</div>
              </div>
            </div>
            <p className="text-[11px] text-amber-800 italic">
              The descending movement is extremely important for understanding Multani's personality.
            </p>
          </div>

          {/* Pakad */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="text-lg font-bold text-amber-950 font-display">Pakad (Catch Phrase)</h3>
                <button
                  onClick={handlePlayPakad}
                  className={`p-2 rounded-xl transition ${
                    isPlayingPakad ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  }`}
                  title={isPlayingPakad ? "Stop Pakad" : "Play Pakad"}
                >
                  {isPlayingPakad ? <Square className="w-4 h-4 fill-rose-900 text-rose-900" /> : <Play className="w-4 h-4 fill-amber-900" />}
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-amber-900 bg-amber-50/80 p-3 rounded-xl text-center border border-amber-200/80 space-y-1">
                <div>N S g M^ g r S</div>
                <div className="text-amber-700 text-xs">and</div>
                <div>N d P M^ g r S</div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect both phrases smoothly:
              </p>
              <div className="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 font-mono text-amber-900 text-center font-bold">
                N S g M^ g r S | N d P M^ g r S
              </div>
            </div>
            <p className="text-[11px] text-amber-800 italic">
              Do not try to play these phrases quickly. Their character comes from note treatment.
            </p>
          </div>
        </div>

        {/* Structural Attributes: Time, Thaat, Jati, Vadi/Samvadi */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-lg font-display border-b border-amber-100 pb-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <h3>Time of Performance & Thaat</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-amber-950">Time of Performance:</strong> Traditionally associated with the <strong>afternoon period</strong>, generally around <strong>3 PM to 6 PM</strong>. Its serious and contemplative character is traditionally connected with this time of day.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-amber-950">Thaat:</strong> Associated with <strong>Todi Thaat</strong> due to the presence of Komal Re, Komal Ga, Tivra Ma, and Komal Dha. However, Multani should not be understood merely as a scale—its specific phrases and melodic movement give it its unique soul.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-lg font-display border-b border-amber-100 pb-2">
              <Sliders className="w-5 h-5 text-amber-600" />
              <h3>Jati, Vadi & Samvadi</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-amber-950">Jati:</strong> Described as <strong>Audav-Sampurna</strong> in practical treatment. The Aaroh uses a restricted selection of swaras (5 notes), while the Avaroh makes fuller use of all 7 notes.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-amber-950">Vadi & Samvadi:</strong> Vadi is <strong>Pa</strong> and Samvadi is <strong>Sa</strong>. Pa has an important structural role, while Sa provides the fundamental tonal center. Become comfortable with phrases that approach and leave Pa naturally.
            </p>
          </div>
        </section>

        {/* Characteristics of Raag Multani */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <Feather className="w-6 h-6 text-amber-600" />
            <h2>Key Characteristics of Raag Multani</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <div className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs flex items-center justify-center font-bold">1</span>
                Komal Re
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Komal Re requires careful intonation. In Multani, it is generally not treated like an ordinary prominent scale note. Practice its relationship with Ga and Sa: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">g r S</code> and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">M^ g r S</code>.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <div className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs flex items-center justify-center font-bold">2</span>
                Komal Ga
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Komal Ga is one of the most recognizable colors of Multani. Practice <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">S g M^</code> and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">M^ g r S</code> slowly. The exact pitch and movement of Ga strongly influence the raga's character.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <div className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs flex items-center justify-center font-bold">3</span>
                Tivra Ma
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Tivra Ma gives Multani a distinctive brightness within its otherwise serious tonal landscape. Practice <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">g M^ P</code> and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">P M^ g</code> with careful pitch control.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <div className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs flex items-center justify-center font-bold">4</span>
                Komal Dha
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Komal Dha becomes particularly useful in descending movements. Practice <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">N d P</code> and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">S' N d P</code> without rushing.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <div className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs flex items-center justify-center font-bold">5</span>
                Ni-Sa Movement
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                The movement from Ni toward Sa is an important part of the raga's melodic approach. Practice <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">N S g</code> slowly, then <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">N S g M^</code> to establish Multani's atmosphere.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <div className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs flex items-center justify-center font-bold">6</span>
                Descending Movement
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Multani's descending phrases are particularly important. Practice <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">S' N d P M^ g r S</code>, focusing on musicality rather than mechanical scale playing.
              </p>
            </div>
          </div>
        </section>

        {/* Practice Exercises */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <h2>Step-by-Step Practice Exercises</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Practice 1 — Basic Swaras',
                notes: 'S — g — M^ — P — N — S\' | S\' — N — d — P — M^ — g — r — S',
                desc: 'Start slow with a steady breath. Focus on clean tone and stable intonation.',
                idx: 0
              },
              {
                title: 'Practice 2 — Ni to Sa',
                notes: 'N S | N S g | N S g M^',
                desc: 'Keep the transition smooth and controlled without jerking the air stream.',
                idx: 1
              },
              {
                title: 'Practice 3 — Komal Ga Control',
                notes: 'S g S | g M^ g | M^ g r | g r S',
                desc: 'Listen carefully to the exact pitch of Komal Ga.',
                idx: 2
              },
              {
                title: 'Practice 4 — Tivra Ma',
                notes: 'g M^ P | P M^ g | g M^ g r',
                desc: 'Make sure Tivra Ma is clearly distinguished from Shuddha Ma.',
                idx: 3
              },
              {
                title: 'Practice 5 — Komal Dha',
                notes: 'N d P | S\' N d P | N d P M^ g',
                desc: 'Avoid forcing the upper register notes.',
                idx: 4
              },
              {
                title: 'Practice 6 — Pakad Mastery',
                notes: 'N S g M^ g r S | N d P M^ g r S',
                desc: 'Connect both phrases cleanly once comfortable.',
                idx: 5
              }
            ].map((ex) => (
              <div key={ex.idx} className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-950 text-sm sm:text-base font-display">{ex.title}</h3>
                    <button
                      onClick={() => handlePlayExercise(ex.idx)}
                      className={`p-1.5 rounded-lg transition text-xs font-semibold flex items-center gap-1 ${
                        playingExercise === ex.idx
                          ? 'bg-rose-100 text-rose-950 hover:bg-rose-200'
                          : 'bg-amber-200/80 hover:bg-amber-300 text-amber-950'
                      }`}
                    >
                      {playingExercise === ex.idx ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-rose-950" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-amber-950" />
                          Play
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-900 bg-white p-2.5 rounded-lg border border-amber-200 my-2">
                    {ex.notes}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Aalap Practice */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <Volume2 className="w-6 h-6 text-amber-600" />
            <h2>Aalap Practice</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Multani benefits greatly from a <strong>slow and spacious Aalap</strong>. Do not try to demonstrate the entire raga immediately. Begin with a few important phrases and gradually expand the range.
          </p>

          <div className="space-y-3">
            {[
              { id: 1, text: 'N — S g — | M^ g r S | N — S — | g M^ — — ||' },
              { id: 2, text: 'N S g M^ | g r S — | N d P — | M^ g r S ||' },
              { id: 3, text: 'N S g M^ | P — M^ g | r S — N | S g M^ g ||' },
              { id: 4, text: 'S\' N d P | M^ g r S | N S g M^ | g r S — ||' },
              { id: 5, text: 'N S g M^ | P N S\' — | S\' N d P | M^ g r S ||' }
            ].map((aalap, idx) => (
              <div key={aalap.id} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-800 mb-1">Aalap {aalap.id}</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-amber-950">{aalap.text}</div>
                </div>
                <button
                  onClick={() => handlePlayAalap(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-center shrink-0 ${
                    playingAalap === idx
                      ? 'bg-rose-100 text-rose-950 hover:bg-rose-200'
                      : 'bg-amber-200/80 hover:bg-amber-300 text-amber-950'
                  }`}
                >
                  {playingAalap === idx ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-rose-950" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-amber-950" />
                      Listen
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-800 bg-amber-100/50 p-3 rounded-lg border border-amber-200/50">
            Play these phrases with plenty of space. The objective is to develop Multani's atmosphere and phrase language, not simply to cover the notes.
          </p>
        </section>

        {/* Meend Practice */}
        <section className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-2">
            <Zap className="w-6 h-6 text-amber-600" />
            <h2>Meend Practice (Microtonal Slides)</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Meend is particularly useful when learning Multani on the flute. Practice controlled movements such as:
          </p>
          <div className="flex flex-wrap gap-2 text-sm font-mono font-bold text-amber-900">
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200">N ~ S</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200">S ~ g</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200">g ~ M^</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200">N ~ d ~ P</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200">M^ ~ g ~ r ~ S</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Start with very slow movements. The goal is to maintain a stable pitch throughout the movement rather than making the slide unnecessarily dramatic.
          </p>
        </section>

        {/* Common Mistakes & How to Avoid Them */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h2>Common Mistakes & Flute Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                mistake: 'Playing Multani Like a Scale',
                desc: 'Knowing the notes does not mean the raga will automatically sound like Multani.',
                tip: 'Spend more time with Pakad and characteristic phrases than with repetitive scale exercises.'
              },
              {
                mistake: 'Giving Re Too Much Importance',
                desc: 'Komal Re should not simply be treated like a normal strong scale note.',
                tip: 'Learn its relationship with Ga and Sa through slow phrases like g r S.'
              },
              {
                mistake: 'Playing Shuddha Ma',
                desc: 'Multani uses Tivra Ma, not Shuddha Ma in its core framework.',
                tip: 'Practice g M^ P until the correct Tivra Ma pitch becomes natural.'
              },
              {
                mistake: 'Using Tivra Ma Randomly',
                desc: 'Tivra Ma should not be inserted into every phrase carelessly.',
                tip: 'Learn its placement through characteristic movements.'
              },
              {
                mistake: 'Rushing the Aalap',
                desc: 'Multani\'s character benefits from a slow, deliberate approach.',
                tip: 'Begin with only a few swaras and gradually expand.'
              },
              {
                mistake: 'Overusing Meend',
                desc: 'Too much sliding can make the melody unclear.',
                tip: 'Use meend to enhance phrases rather than replacing normal note articulation.'
              },
              {
                mistake: 'Ignoring Ni',
                desc: 'Ni plays an important role in the approach toward Sa.',
                tip: 'Practice N S g regularly to build natural phrasing.'
              }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-rose-50/40 rounded-xl border border-rose-200/60 space-y-2">
                <div className="font-bold text-rose-950 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  {item.mistake}
                </div>
                <p className="text-xs text-gray-700">{item.desc}</p>
                <div className="text-xs font-semibold text-amber-900 bg-amber-100/70 p-2 rounded-lg border border-amber-200/60 flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Tip:</strong> {item.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FluteSangam Original Learning Piece */}
        <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-950 text-amber-50 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-700/60 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700/60 text-amber-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>100% Original Composition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-100">
                FluteSangam Original Learning Piece
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNotation}
                className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-semibold transition border border-amber-600/50 flex items-center gap-1.5"
              >
                {copiedNotation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotation ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePlayPiece}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md ${
                  isPlayingPiece
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 hover:from-amber-300 hover:to-orange-300'
                }`}
              >
                {isPlayingPiece ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Piece</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-amber-950" />
                    <span>Play Piece</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            The following learning piece is <strong>100% original FluteSangam content</strong>, created specifically for this page as a practice composition for Raag Multani. It is <strong>not a traditional bandish</strong> and should not be presented as one.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-mono">
            {/* Aalap */}
            <div className="p-4 bg-amber-950/60 rounded-xl border border-amber-700/50 space-y-1.5">
              <div className="text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">1. Aalap</div>
              <div className="text-amber-100 font-bold">N — S g | M^ g r S |</div>
              <div className="text-amber-100 font-bold">N — S — | g M^ g r ||</div>
              <p className="text-[11px] font-sans text-amber-300/80 pt-1">Play gently and allow the phrases to breathe.</p>
            </div>

            {/* Main Phrase */}
            <div className="p-4 bg-amber-950/60 rounded-xl border border-amber-700/50 space-y-1.5">
              <div className="text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">2. Main Phrase</div>
              <div className="text-amber-100 font-bold">N S g M^ | g r S — |</div>
              <div className="text-amber-100 font-bold">N d P M^ | g r S — ||</div>
              <p className="text-[11px] font-sans text-amber-300/80 pt-1">Focus on the movement of Komal Ga and Tivra Ma.</p>
            </div>

            {/* Development */}
            <div className="p-4 bg-amber-950/60 rounded-xl border border-amber-700/50 space-y-1.5">
              <div className="text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">3. Development</div>
              <div className="text-amber-100 font-bold">N S g M^ | P N S' — |</div>
              <div className="text-amber-100 font-bold">S' N d P | M^ g r S |</div>
              <div className="text-amber-100 font-bold">N S g M^ | g r S — ||</div>
              <p className="text-[11px] font-sans text-amber-300/80 pt-1">Keep the upper Sa relaxed.</p>
            </div>

            {/* Variation */}
            <div className="p-4 bg-amber-950/60 rounded-xl border border-amber-700/50 space-y-1.5">
              <div className="text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">4. Variation</div>
              <div className="text-amber-100 font-bold">N S g M^ | g M^ P — |</div>
              <div className="text-amber-100 font-bold">N d P M^ | g r S — |</div>
              <div className="text-amber-100 font-bold">S g M^ P | N S' N d |</div>
              <div className="text-amber-100 font-bold">P M^ g r | S — — — ||</div>
            </div>
          </div>

          {/* Ending */}
          <div className="p-4 bg-amber-950/80 rounded-xl border border-amber-700/70 font-mono space-y-1.5">
            <div className="text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">5. Ending</div>
            <div className="text-amber-100 font-bold text-sm sm:text-base">N S g M^ | g r S — | N d P M^ | g r S — ||</div>
            <p className="text-xs font-sans text-amber-300/90 pt-1">Finish calmly on Sa.</p>
          </div>

          <p className="text-xs text-amber-300/80 italic border-t border-amber-800/80 pt-3">
            <strong>FluteSangam Original Learning Piece:</strong> This composition has been newly created for FluteSangam as an original practice piece for Raag Multani. It is not presented as a traditional composition or bandish.
          </p>
        </section>

        {/* How to Practice the Original Piece */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <Compass className="w-6 h-6 text-amber-600" />
            <h2>How to Practice the FluteSangam Original Piece</h2>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-amber-950">Step 1 — Learn the Aalap:</strong> Practice the opening phrases slowly to establish the atmosphere.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-amber-950">Step 2 — Learn the Main Phrase:</strong> Practice <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900 font-bold">N S g M^ g r S</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900 font-bold">N d P M^ g r S</code> until natural.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-amber-950">Step 3 — Add the Development:</strong> Introduce the upper-register phrase gradually.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
              <div>
                <strong className="text-amber-950">Step 4 — Practice the Variation:</strong> Work on the variation without immediately increasing the tempo.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
              <div>
                <strong className="text-amber-950">Step 5 — Connect the Complete Piece:</strong> Play <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900 font-bold">Aalap → Main Phrase → Development → Variation → Ending</code> as one continuous practice piece.
              </div>
            </div>
          </div>
        </section>

        {/* Flute Practice Tips */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <h2>Flute Practice Tips for Raag Multani</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1.5">
              <h3 className="font-bold text-amber-950 text-base">1. Practice With a Tanpura</h3>
              <p className="text-gray-700 leading-relaxed">
                A Tanpura drone helps you hear subtle pitch differences, particularly when practicing Komal Re, Komal Ga, and Komal Dha.
              </p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1.5">
              <h3 className="font-bold text-amber-950 text-base">2. Spend Extra Time on Komal Ga</h3>
              <p className="text-gray-700 leading-relaxed">
                Komal Ga has a major role in Multani's character. Practice <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">S g M^</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">M^ g r S</code> slowly.
              </p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1.5">
              <h3 className="font-bold text-amber-950 text-base">3. Practice Ni-Sa Carefully</h3>
              <p className="text-gray-700 leading-relaxed">
                Practice <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">N S</code> then <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">N S g</code> until the movement becomes comfortable.
              </p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1.5">
              <h3 className="font-bold text-amber-950 text-base">4. Develop the Middle Register First</h3>
              <p className="text-gray-700 leading-relaxed">
                Before attempting elaborate upper-register phrases, establish a stable tone in the middle register.
              </p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1.5">
              <h3 className="font-bold text-amber-950 text-base">5. Don't Chase Speed</h3>
              <p className="text-gray-700 leading-relaxed">
                Multani rewards accuracy and expression more than fast playing. First develop: <strong>pitch → tone → phrase → expression → speed</strong>.
              </p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1.5">
              <h3 className="font-bold text-amber-950 text-base">6. Record Your Practice</h3>
              <p className="text-gray-700 leading-relaxed">
                Recording yourself can help identify unstable pitch, weak breath support, unclear Komal notes, or rushed phrases.
              </p>
            </div>
          </div>
        </section>

        {/* Why Learn & Who Should Learn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-bold text-amber-950 font-display border-b border-amber-100 pb-2">
              Why Learn Raag Multani?
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Learning Multani can help an experienced flute player develop:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-amber-900 font-semibold">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Komal swara accuracy</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Tivra Ma control</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Microtonal Meend</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Breath management</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Aalap development</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Raga improvisation</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-bold text-amber-950 font-display border-b border-amber-100 pb-2">
              Who Should Learn Raag Multani?
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Multani is best approached by players who already have:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-amber-900 font-semibold">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Comfortable fingering</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Stable tone production</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Good breath control</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Experience with Komal notes</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Familiarity with Tivra Ma</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Basic Aalap experience</li>
            </ul>
          </div>
        </div>

        {/* Practice Routine */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl sm:text-2xl border-b border-amber-100 pb-3">
            <Clock className="w-6 h-6 text-amber-600" />
            <h2>Raag Multani Daily Practice Routine</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="font-bold text-amber-800">5 Mins — Long Notes</div>
              <p className="text-gray-600 text-xs mt-1">Practice Sa, Ga, Ma^, Pa, Ni with a Tanpura drone.</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="font-bold text-amber-800">10 Mins — Swara Practice</div>
              <p className="text-gray-600 text-xs mt-1">Work through the basic Aaroh and Avaroh slowly.</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="font-bold text-amber-800">10 Mins — Key Movements</div>
              <p className="text-gray-600 text-xs mt-1">Practice N S g, g M^ P, N d P, M^ g r S.</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="font-bold text-amber-800">10 Mins — Pakad</div>
              <p className="text-gray-600 text-xs mt-1">Practice characteristic phrases repeatedly.</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="font-bold text-amber-800">10 Mins — Aalap</div>
              <p className="text-gray-600 text-xs mt-1">Create slow phrases using important movements.</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="font-bold text-amber-800">10 Mins — Original Piece</div>
              <p className="text-gray-600 text-xs mt-1">Practice the FluteSangam piece section by section.</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 col-span-1 sm:col-span-2">
              <div className="font-bold text-amber-800">5 Mins — Free Improvisation</div>
              <p className="text-gray-600 text-xs mt-1">Close notation and attempt original Multani phrases.</p>
            </div>
          </div>
        </section>

        {/* Final Thoughts & FluteSangam Tip */}
        <section className="bg-amber-100/60 rounded-2xl p-6 sm:p-8 border border-amber-300/80 space-y-4">
          <div className="flex items-center gap-2 text-amber-950 font-display font-bold text-xl">
            <Heart className="w-5 h-5 text-amber-700" />
            <h2>Final Thoughts</h2>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            Raag Multani is a beautiful and demanding raga that rewards patience, careful listening, and precise swara control. Its combination of Komal Re, Komal Ga, Tivra Ma, and Komal Dha, together with its distinctive melodic movements, gives it a serious and introspective character.
          </p>
          <div className="p-4 bg-amber-800 text-amber-100 rounded-xl font-medium text-xs sm:text-sm flex items-start gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span><strong>FluteSangam Tip:</strong> In Multani, let the phrases unfold slowly. Accurate pitch and thoughtful movement are more important than playing many notes.</span>
          </div>
        </section>

        {/* Practice Tools: Metronome & Practice Timer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metronome */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold font-display text-lg">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3>Integrated Metronome</h3>
              </div>
              <button
                onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                  isMetronomeActive ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                {isMetronomeActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isMetronomeActive ? 'Stop' : 'Start'}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500 font-medium">Tempo (BPM)</div>
                <div className="text-2xl font-bold text-amber-950 font-display">{bpm} BPM</div>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-1/2 accent-amber-600"
              />
            </div>

            {isMetronomeActive && (
              <div className="flex gap-1 justify-center pt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      currentBeat === i + 1 ? 'bg-amber-600 scale-y-125' : 'bg-amber-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Practice Timer */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold font-display text-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h3>Practice Timer (45 Min)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 ${
                    isTimerRunning ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => { setIsTimerRunning(false); setTimerSeconds(2700); }}
                  className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-bold text-amber-950 font-mono tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Recommended Multani session length</div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-xl border-b border-amber-100 pb-3">
            <Compass className="w-5 h-5 text-amber-600" />
            <h2>Frequently Asked Questions on Raag Multani</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What makes Raag Multani different from Raag Todi?',
                a: 'While both belong to the Todi Thaat and share similar swaras, Multani is an afternoon raga with an Audav-Sampurna jati (skipping Re and Dha in ascent), whereas Todi is a morning raga with different characteristic phrases and note emphases.'
              },
              {
                q: 'What flute key is best for practicing Raag Multani?',
                a: 'A medium or low key bansuri (such as E Bass, C Middle, or G Base) works wonderfully for Multani\'s meditative, deep tone quality.'
              },
              {
                q: 'How do I achieve clean Komal Re and Komal Ga on bansuri?',
                a: 'Focus on precise half-hole technique and stable embouchure. Practice long notes with a Tanpura drone to calibrate your intonation.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-amber-200/70 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-amber-950 text-sm flex items-center justify-between bg-amber-50/40 hover:bg-amber-50/80 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-700" /> : <ChevronDown className="w-4 h-4 text-amber-700" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-amber-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* About Author */}
        <AboutAuthorSection />

      </div>
    </div>
  );
};

export default RagaMultaniView;
