import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Sun, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Compass, Zap, Share2, 
  Sliders, Award, Sparkles, ShieldAlert, Lightbulb, ArrowLeft,
  RefreshCw, RotateCcw
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';
import { playTakMetronomeClick } from '../lib/audioUtils';

interface RagaTodiViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'S(lower)': 130.81,
  'r(lower)': 138.59,
  'g(lower)': 155.56,
  'M(lower)': 184.99,
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
  'M': 369.99,       // Tivra Ma
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
  "M'": 739.99,      // Tivra Ma
  "P'": 783.99,
  "d'": 830.61,      // Komal Dha
  "N'": 987.77,
};

export const RagaTodiView: React.FC<RagaTodiViewProps> = ({ onViewChange }) => {
  // Playback states
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [copiedNotation, setCopiedNotation] = useState(false);
  
  // Metronome states
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(75);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(16);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  // Practice Timer (45-50 mins)
  const [timerSeconds, setTimerSeconds] = useState(2700); // 45 min
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

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
      setTimeout(() => setActiveSwara(null), duration * 1000);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  // Play Sequence helper
  const playPhraseSequence = (
    phrase: string[], 
    tempoMs = 650, 
    onComplete?: () => void
  ) => {
    const ctx = getAudioContext();
    let delay = 0;

    phrase.forEach((token) => {
      const startTime = ctx.currentTime + (delay / 1000);
      const noteDuration = (tempoMs / 1000) * 0.92;

      const cleanToken = token.trim();
      if (cleanToken && cleanToken !== '|' && cleanToken !== '—' && cleanToken !== '||' && cleanToken !== '~') {
        const freq = SWARA_FREQS[cleanToken] || 261.63;
        playBambooFluteTone(ctx, freq, startTime, noteDuration, 0.28);

        setTimeout(() => {
          setActiveSwara(cleanToken);
        }, delay);
      }

      delay += tempoMs;
    });

    setTimeout(() => {
      setActiveSwara(null);
      if (onComplete) onComplete();
    }, delay + 200);
  };

  // Aaroh: S r g M P d N S'
  const handlePlayAaroh = () => {
    if (isPlayingAaroh) return;
    setIsPlayingAaroh(true);
    const aarohNotes = ['S', 'r', 'g', 'M', 'P', 'd', 'N', "S'"];
    playPhraseSequence(aarohNotes, 700, () => setIsPlayingAaroh(false));
  };

  // Avaroh: S' N d P M g r S
  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) return;
    setIsPlayingAvaroh(true);
    const avarohNotes = ["S'", 'N', 'd', 'P', 'M', 'g', 'r', 'S'];
    playPhraseSequence(avarohNotes, 700, () => setIsPlayingAvaroh(false));
  };

  // Pakad: g r g r S | r g M g r S
  const handlePlayPakad = () => {
    if (isPlayingPakad) return;
    setIsPlayingPakad(true);
    const pakadNotes = ['g', 'r', 'g', 'r', 'S', 'r', 'g', 'M', 'g', 'r', 'S'];
    playPhraseSequence(pakadNotes, 650, () => setIsPlayingPakad(false));
  };

  // Aalap Phrases Playback
  const handlePlayAalap = (index: number) => {
    if (playingAalap !== null) return;
    setPlayingAalap(index);

    const aalapPhrases = [
      // Aalap 1: S — r g — | r S — — | r g M — | g r S —
      ['S', 'r', 'g', 'r', 'S', 'r', 'g', 'M', 'g', 'r', 'S'],
      // Aalap 2: S r g M | g r S — | r g M d | M g r S
      ['S', 'r', 'g', 'M', 'g', 'r', 'S', 'r', 'g', 'M', 'd', 'M', 'g', 'r', 'S'],
      // Aalap 3: g M d — | P M g r | g M d N | S' — N d
      ['g', 'M', 'd', 'P', 'M', 'g', 'r', 'g', 'M', 'd', 'N', "S'", 'N', 'd'],
      // Aalap 4: S' N d P | M g r S | r g M g | r S — —
      ["S'", 'N', 'd', 'P', 'M', 'g', 'r', 'S', 'r', 'g', 'M', 'g', 'r', 'S']
    ];

    const notes = aalapPhrases[index - 1] || [];
    playPhraseSequence(notes, 650, () => setPlayingAalap(null));
  };

  // Interactive Metronome Loop
  useEffect(() => {
    let interval: any = null;
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = prev >= beatsPerMeasure ? 1 : prev + 1;
          const ctx = getAudioContext();
          playTakMetronomeClick(ctx, next === 1);
          return next;
        });
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMetronomeActive, bpm, beatsPerMeasure]);

  const toggleMetronome = () => {
    if (!isMetronomeActive) {
      const ctx = getAudioContext();
      setCurrentBeat(1);
      playTakMetronomeClick(ctx, true);
      setIsMetronomeActive(true);
    } else {
      setIsMetronomeActive(false);
      setCurrentBeat(0);
    }
  };

  // Practice Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
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

  // Copy Notation Block
  const copyNotationText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2000);
  };

  const fullNotationText = `Raag Todi — FluteSangam Original Learning Piece

Aalap:
S r g — | r S — — |
r g M — | g r S — ||

Main Phrase:
g M d P | M g r S |
r g M d | P M g r ||

Development:
g M d N | S' N d P |
M g r S | r g M g ||

Variation:
r g M d | P M g r |
g M d P | M g r S |
r g M g | r S — — ||

Ending:
g M d P | M g r S |
r g M g | r S — — ||`;

  // Swara Pill Component
  const SwaraPill = ({ name, type, note }: { name: string; type: string; note: string }) => {
    const isActive = activeSwara === name;
    return (
      <button
        onClick={() => playSwara(name)}
        className={`p-3 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer touch-manipulation flex flex-col items-center justify-between ${
          isActive 
            ? 'bg-amber-500 text-bamboo-950 border-amber-600 scale-105 shadow-md' 
            : 'bg-white hover:bg-amber-50 border-amber-200/80 shadow-2xs hover:border-amber-300'
        }`}
      >
        <span className={`text-xl sm:text-2xl font-black font-mono ${isActive ? 'text-bamboo-950' : 'text-bamboo-900'}`}>
          {name}
        </span>
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 ${
          isActive ? 'text-bamboo-950' : 'text-amber-800'
        }`}>
          {type}
        </span>
        <span className={`text-[10px] font-sans mt-0.5 ${isActive ? 'text-bamboo-900' : 'text-stone-500'}`}>
          {note}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#fff4e6] to-[#fdebd0] text-bamboo-950 pb-20 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <button
          onClick={() => onViewChange?.('learn_raagas')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-700 transition bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-amber-200/80 shadow-2xs cursor-pointer touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 text-amber-700" />
          Back to Raagas
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        
        {/* HERO HEADER - Light & Warm Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50 text-bamboo-950 p-6 sm:p-10 shadow-sm border border-amber-300/80 mb-8">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              <span className="bg-rose-100 text-rose-900 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Award className="w-3.5 h-3.5 text-rose-700" />
                Advanced Level
              </span>
              <span className="bg-amber-200/90 text-amber-950 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                Late Morning (9 AM – 12 PM)
              </span>
              <span className="bg-purple-100 text-purple-900 border border-purple-200 px-3 py-1 rounded-full shadow-2xs">
                Komal r, g, d & Tivra M
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-bamboo-950 tracking-tight leading-tight font-display">
              Raag Todi <span className="text-amber-800 text-2xl sm:text-4xl font-normal block sm:inline mt-1 sm:mt-0">— Notes, Aaroh, Avaroh, Pakad & Practice</span>
            </h1>

            <p className="text-stone-700 text-base sm:text-lg max-w-3xl leading-relaxed">
              Explore the profound, serious, and deeply contemplative atmosphere of Raag Todi (Miyan Ki Todi). Master its trademark combination of Komal Re, Komal Ga, Tivra Ma, and Komal Dha, slow Aalap phrasing, and an original FluteSangam Learning Piece.
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-amber-900/90 pt-2">
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Published: <strong className="text-bamboo-950 font-semibold">August 10, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-rose-700" />
                <span>Updated: <strong className="text-bamboo-950 font-semibold">August 10, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Reading Time: <strong className="text-bamboo-950 font-semibold">15 min read</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                1. Introduction to Raag Todi
              </h2>
              <p className="text-xs text-stone-500">Overview, mood, and classical significance</p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
            <p>
              <strong>Raag Todi</strong>, commonly referring to <em>Miyan Ki Todi</em>, is a profound and highly expressive Hindustani classical raga. It is known for its serious, introspective, and contemplative character and is particularly distinguished by the combination of <strong>Komal Re</strong>, <strong>Komal Ga</strong>, <strong>Tivra Ma</strong>, and <strong>Komal Dha</strong>.
            </p>
            <p>
              For flute players, Todi is an excellent raga for developing fine pitch control, meend, breath management, slow Aalap, and expressive phrasing. It is not a raga that can be understood simply by playing its Aaroh and Avaroh. Its personality emerges from the treatment and relationship of its swaras.
            </p>
            <p className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-amber-950 font-medium">
              <strong className="text-amber-900">Advanced Raga Note:</strong> Todi is generally considered an advanced-level raga and is best approached after developing good control over basic swaras and several simpler ragas.
            </p>
          </div>
        </section>

        {/* SECTION 2: NOTES & SWARA NOTATION */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  2. Swaras & Scale Structure
                </h2>
                <p className="text-xs text-stone-500">Click any note to hear the realistic Bansuri tone</p>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-700">
            Raag Todi uses all seven swaras. The combination of <strong>Komal Re</strong>, <strong>Komal Ga</strong>, <strong>Tivra Ma</strong>, and <strong>Komal Dha</strong> gives Todi its characteristic sound.
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
            <SwaraPill name="S" type="Shuddha" note="Sa" />
            <SwaraPill name="r" type="Komal" note="Re" />
            <SwaraPill name="g" type="Komal" note="Ga" />
            <SwaraPill name="M" type="Tivra" note="Ma" />
            <SwaraPill name="P" type="Shuddha" note="Pa" />
            <SwaraPill name="d" type="Komal" note="Dha" />
            <SwaraPill name="N" type="Shuddha" note="Ni" />
            <SwaraPill name="S'" type="Taar" note="Sa'" />
          </div>

          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm space-y-2">
            <h4 className="font-bold text-bamboo-950 uppercase tracking-wider text-[11px]">Swara Notation Summary</h4>
            <p className="font-mono text-amber-900 font-bold">S r g M P d N S'</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-600 pt-1">
              <li><strong>S</strong> = Sa</li>
              <li><strong>r</strong> = Komal Re</li>
              <li><strong>g</strong> = Komal Ga</li>
              <li><strong>M</strong> = Tivra Ma</li>
              <li><strong>P</strong> = Shuddha Pa</li>
              <li><strong>d</strong> = Komal Dha</li>
              <li><strong>N</strong> = Shuddha Ni</li>
              <li><strong>S'</strong> = Taar Sa</li>
            </ul>
          </div>
        </section>

        {/* SECTION 3: AAROH & AVAROH */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                3. Aaroh & Avaroh
              </h2>
              <p className="text-xs text-stone-500">Ascending and descending scale patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Aaroh Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-5 sm:p-6 rounded-2xl border border-amber-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                    Ascending (Aaroh)
                  </span>
                  <h3 className="text-lg font-bold text-bamboo-950 mt-2">S r g M P d N S'</h3>
                </div>
                <button
                  onClick={handlePlayAaroh}
                  disabled={isPlayingAaroh}
                  className="p-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white rounded-2xl shadow-xs transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  {isPlayingAaroh ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlayingAaroh ? 'Playing...' : 'Play Aaroh'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600">
                Sa – Komal Re – Komal Ga – Tivra Ma – Pa – Komal Dha – Shuddha Ni – Sa'
              </p>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 text-xs text-stone-700">
                <strong>Slow Practice:</strong> <span className="font-mono text-amber-900 font-bold">S — r — g — M — P — d — N — S'</span>
                <p className="mt-1 text-stone-500">Pay particular attention to the pitch of the Komal swaras.</p>
              </div>
            </div>

            {/* Avaroh Card */}
            <div className="bg-gradient-to-br from-rose-50 to-amber-50/60 p-5 sm:p-6 rounded-2xl border border-rose-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-1 rounded-md">
                    Descending (Avaroh)
                  </span>
                  <h3 className="text-lg font-bold text-bamboo-950 mt-2">S' N d P M g r S</h3>
                </div>
                <button
                  onClick={handlePlayAvaroh}
                  disabled={isPlayingAvaroh}
                  className="p-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-2xl shadow-xs transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  {isPlayingAvaroh ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlayingAvaroh ? 'Playing...' : 'Play Avaroh'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600">
                Sa' – Shuddha Ni – Komal Dha – Pa – Tivra Ma – Komal Ga – Komal Re – Sa
              </p>

              <div className="bg-white/80 p-3 rounded-xl border border-rose-200/60 text-xs text-stone-700">
                <strong>Slow Practice:</strong> <span className="font-mono text-rose-900 font-bold">S' — N d — P — M g r — S</span>
                <p className="mt-1 text-stone-500">The descending movement is especially useful for developing the characteristic color of Todi. Keep the movement relaxed and controlled.</p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: PAKAD */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  4. Pakad (Characteristic Catch Phrases)
                </h2>
                <p className="text-xs text-stone-500">Core signature phrases that identify Raag Todi</p>
              </div>
            </div>

            <button
              onClick={handlePlayPakad}
              disabled={isPlayingPakad}
              className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-300 text-white rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              {isPlayingPakad ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlayingPakad ? 'Playing Pakad...' : 'Listen to Pakad'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200/80 font-mono text-base sm:text-lg font-extrabold text-amber-950 text-center tracking-wider">
              g r g r S | r g M g r S
            </div>

            <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-700 space-y-3">
              <p>
                <strong>Secondary Characteristic Phrase:</strong> <span className="font-mono font-bold text-amber-900">g M d P | M g r S</span>
              </p>
              <p>
                These phrases should be practiced slowly and with attention to the movement between the swaras.
              </p>
              <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-600 text-xs">
                <strong>Pakad Practice Steps:</strong>
                <ol className="list-decimal list-inside space-y-1 mt-1 font-mono text-bamboo-900">
                  <li>Start with: <strong>g r g r S</strong></li>
                  <li>Then add: <strong>r g M g r S</strong></li>
                  <li>Finally combine: <strong>g r g r S | r g M g r S</strong></li>
                </ol>
                <p className="mt-2 text-stone-500 font-sans italic">Goal: Make the phrase sound musical rather than mechanical.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: TIME OF PERFORMANCE, VADI & SAMVADI */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Time of Performance */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-bamboo-950">Time of Performance</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Raag Todi is traditionally associated with the <strong>late morning period</strong>, generally around <strong>9 AM to 12 PM</strong>.
            </p>
            <p className="text-xs text-stone-600">
              Its serious and contemplative character is traditionally connected with this time of day. For personal practice, however, you can practice Todi at any convenient time. Consistent and attentive practice is more important than restricting your practice to a particular hour.
            </p>
          </div>

          {/* Vadi & Samvadi */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-bamboo-950">Vadi & Samvadi</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">Vadi (King)</span>
                <p className="text-xl font-black font-mono text-bamboo-950 mt-0.5">Dha (d)</p>
                <span className="text-[10px] text-stone-500">Komal Dha</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200/80">
                <span className="text-[10px] font-bold uppercase text-rose-800 tracking-wider">Samvadi (Queen)</span>
                <p className="text-xl font-black font-mono text-bamboo-950 mt-0.5">Ga (g)</p>
                <span className="text-[10px] text-stone-500">Komal Ga</span>
              </div>
            </div>
            <p className="text-xs text-stone-600">
              Dha and Ga have an important role in establishing the character of Todi. For a flute player, it is equally important to understand the characteristic treatment of Re, Ga, Ma, and Dha rather than relying only on the Vadi-Samvadi classification.
            </p>
          </div>

        </section>

        {/* SECTION 6: CHARACTERISTICS OF RAAG TODI */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                5. Key Characteristics of Raag Todi
              </h2>
              <p className="text-xs text-stone-500">6 essential nuances every Bansuri player must master</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Komal Re */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <h3 className="font-bold text-bamboo-950 text-sm">Komal Re</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Komal Re is one of the important colors of Todi. It should be practiced carefully because inaccurate pitch can quickly change the character of the raga.
              </p>
            </div>

            {/* 2. Komal Ga */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <h3 className="font-bold text-bamboo-950 text-sm">Komal Ga</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Komal Ga plays a major role in Todi's expressive character. Practice <span className="font-mono font-bold text-amber-900">r — g — M</span> slowly and listen carefully to the relationship between the notes.
              </p>
            </div>

            {/* 3. Tivra Ma */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <h3 className="font-bold text-bamboo-950 text-sm">Tivra Ma</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tivra Ma provides a distinctive contrast against surrounding komal swaras. Practice <span className="font-mono font-bold text-amber-900">g M P</span> and <span className="font-mono font-bold text-amber-900">M g r</span> with careful intonation.
              </p>
            </div>

            {/* 4. Komal Dha */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
                <h3 className="font-bold text-bamboo-950 text-sm">Komal Dha</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Komal Dha is another important characteristic swara. Practice <span className="font-mono font-bold text-amber-900">M d P</span> slowly before incorporating it into longer phrases.
              </p>
            </div>

            {/* 5. Expressive Movement */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center shrink-0">5</span>
                <h3 className="font-bold text-bamboo-950 text-sm">Expressive Movement</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Todi benefits greatly from controlled meend and subtle swara movement. Avoid playing every note with exactly the same attack and intensity.
              </p>
            </div>

            {/* 6. Slow Development */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center shrink-0">6</span>
                <h3 className="font-bold text-bamboo-950 text-sm">Slow Development</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Todi is particularly effective when developed through a slow Aalap. Instead of immediately playing fast patterns, allow the raga to develop gradually through carefully chosen phrases.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 7: PRACTICE EXERCISES & AALAP */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                6. Practice Drills & Aalap Development
              </h2>
              <p className="text-xs text-stone-500">6 targeted practice routines + 4 step-by-step Aalap exercises</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            
            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1.5">
              <h4 className="font-bold text-bamboo-950 flex items-center justify-between">
                <span>Practice 1 — Basic Swaras</span>
              </h4>
              <p className="font-mono text-amber-900 font-bold">S r g M P d N S' | S' N d P M g r S</p>
              <p className="text-stone-500 text-xs">Play each note slowly and listen carefully to the pitch.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1.5">
              <h4 className="font-bold text-bamboo-950 flex items-center justify-between">
                <span>Practice 2 — Komal Swara Control</span>
              </h4>
              <p className="font-mono text-amber-900 font-bold">S r S | r g r | M d P | g r S</p>
              <p className="text-stone-500 text-xs">Helps strengthen control over the important Komal swaras.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1.5">
              <h4 className="font-bold text-bamboo-950 flex items-center justify-between">
                <span>Practice 3 — Tivra Ma</span>
              </h4>
              <p className="font-mono text-amber-900 font-bold">g M g | g M P | P M g</p>
              <p className="text-stone-500 text-xs">Make sure Tivra Ma is clearly established.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1.5">
              <h4 className="font-bold text-bamboo-950 flex items-center justify-between">
                <span>Practice 4 — Meend</span>
              </h4>
              <p className="font-mono text-amber-900 font-bold">S ~ r | r ~ g | g ~ M | M ~ d ~ P</p>
              <p className="text-stone-500 text-xs">Keep the movement smooth without sliding unnecessarily between every note.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1.5 md:col-span-2">
              <h4 className="font-bold text-bamboo-950 flex items-center justify-between">
                <span>Practice 5 — Pakad Progression</span>
              </h4>
              <p className="font-mono text-amber-900 font-bold">g r g r S  ➔  r g M g r S  ➔  g M d P | M g r S</p>
              <p className="text-stone-500 text-xs">Repeat these slowly before attempting faster variations.</p>
            </div>

          </div>

          {/* Aalap Section */}
          <div className="pt-4 border-t border-amber-100 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-bamboo-950">Aalap Practice Phrases</h3>
                <p className="text-xs text-stone-500">A slow Aalap is one of the best ways to understand Todi</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Aalap 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Aalap 1</span>
                  <button
                    onClick={() => handlePlayAalap(1)}
                    disabled={playingAalap !== null}
                    className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    {playingAalap === 1 ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{playingAalap === 1 ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>
                <p className="font-mono text-sm font-bold text-bamboo-950">S — r g — | r S — — | r g M — | g r S — ||</p>
              </div>

              {/* Aalap 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Aalap 2</span>
                  <button
                    onClick={() => handlePlayAalap(2)}
                    disabled={playingAalap !== null}
                    className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    {playingAalap === 2 ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{playingAalap === 2 ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>
                <p className="font-mono text-sm font-bold text-bamboo-950">S r g M | g r S — | r g M d | M g r S ||</p>
              </div>

              {/* Aalap 3 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Aalap 3</span>
                  <button
                    onClick={() => handlePlayAalap(3)}
                    disabled={playingAalap !== null}
                    className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    {playingAalap === 3 ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{playingAalap === 3 ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>
                <p className="font-mono text-sm font-bold text-bamboo-950">g M d — | P M g r | g M d N | S' — N d ||</p>
              </div>

              {/* Aalap 4 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Aalap 4</span>
                  <button
                    onClick={() => handlePlayAalap(4)}
                    disabled={playingAalap !== null}
                    className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    {playingAalap === 4 ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{playingAalap === 4 ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>
                <p className="font-mono text-sm font-bold text-bamboo-950">S' N d P | M g r S | r g M g | r S — — ||</p>
              </div>

            </div>
            <p className="text-xs text-stone-500 italic">Play these phrases slowly and leave enough space between them. The purpose is to develop Todi's character, not simply to play many notes.</p>
          </div>
        </section>

        {/* SECTION 8: COMMON MISTAKES */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="p-2.5 bg-rose-100 rounded-2xl text-rose-900">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                7. Common Mistakes & How to Avoid Them
              </h2>
              <p className="text-xs text-stone-500">Pitfalls to watch out for when learning Raag Todi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-1.5">
              <h4 className="font-bold text-rose-950 text-sm">1. Playing Todi Like a Scale</h4>
              <p className="text-xs text-stone-600">Knowing the correct notes does not automatically make the performance sound like Todi.</p>
              <p className="text-xs font-semibold text-rose-900 bg-white p-2 rounded-lg border border-rose-200/50">
                💡 <strong>Tip:</strong> Spend more time practicing characteristic phrases than repeatedly running the scale.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-1.5">
              <h4 className="font-bold text-rose-950 text-sm">2. Incorrect Komal Swaras</h4>
              <p className="text-xs text-stone-600">Komal Re, Ga, and Dha require careful pitch control on bansuri.</p>
              <p className="text-xs font-semibold text-rose-900 bg-white p-2 rounded-lg border border-rose-200/50">
                💡 <strong>Tip:</strong> Practice slowly with a Tanpura drone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-1.5">
              <h4 className="font-bold text-rose-950 text-sm">3. Incorrect Tivra Ma</h4>
              <p className="text-xs text-stone-600">Tivra Ma is an important part of Todi's identity.</p>
              <p className="text-xs font-semibold text-rose-900 bg-white p-2 rounded-lg border border-rose-200/50">
                💡 <strong>Tip:</strong> Practice the transition: <span className="font-mono">g → M → P</span> until the pitch becomes comfortable.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-1.5">
              <h4 className="font-bold text-rose-950 text-sm">4. Playing Too Fast</h4>
              <p className="text-xs text-stone-600">Fast playing can hide inaccurate pitch and destroy the contemplative mood.</p>
              <p className="text-xs font-semibold text-rose-900 bg-white p-2 rounded-lg border border-rose-200/50">
                💡 <strong>Tip:</strong> Build accuracy and tone first, then gradually increase speed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-1.5">
              <h4 className="font-bold text-rose-950 text-sm">5. Overusing Meend</h4>
              <p className="text-xs text-stone-600">Todi benefits from expressive movement, but excessive sliding can make phrases unclear.</p>
              <p className="text-xs font-semibold text-rose-900 bg-white p-2 rounded-lg border border-rose-200/50">
                💡 <strong>Tip:</strong> Use meend where it naturally supports the phrase.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-1.5">
              <h4 className="font-bold text-rose-950 text-sm">6. Ignoring Pa</h4>
              <p className="text-xs text-stone-600">Although Todi contains Pa, it should not be treated as an ordinary resting point in every phrase.</p>
              <p className="text-xs font-semibold text-rose-900 bg-white p-2 rounded-lg border border-rose-200/50">
                💡 <strong>Tip:</strong> Learn characteristic phrases rather than giving every swara equal importance.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 9: FLUTESANGAM ORIGINAL LEARNING PIECE */}
        <section className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-700/50 mb-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-700/60 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                Exclusive Composition
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-display text-white mt-2">
                FluteSangam Original Learning Piece — Raag Todi
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
                100% original educational material created specifically for bansuri learners
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Metronome Toggle Button */}
              <button
                onClick={toggleMetronome}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-md ${
                  isMetronomeActive 
                    ? 'bg-amber-400 text-amber-950 animate-pulse' 
                    : 'bg-amber-500 hover:bg-amber-400 text-amber-950'
                }`}
              >
                {isMetronomeActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-950" />}
                <span>{isMetronomeActive ? 'Stop Metronome' : 'Start Metronome'}</span>
              </button>

              {/* Tempo Control */}
              <div className="flex items-center gap-2 bg-black/40 border border-amber-500/30 px-3.5 py-2 rounded-2xl text-xs font-mono">
                <span className="text-amber-300 font-bold">{bpm} BPM</span>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-amber-400 cursor-pointer"
                  aria-label="Metronome Tempo BPM"
                />
              </div>

              {/* Beats Selector */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-amber-500/30 px-3 py-1.5 rounded-2xl text-xs">
                <span className="text-amber-200/80 font-sans text-[11px] font-medium">Beats:</span>
                <select
                  value={beatsPerMeasure}
                  onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold font-mono focus:outline-none cursor-pointer"
                  aria-label="Metronome Beats per measure"
                >
                  <option value={16} className="bg-stone-900 text-white">16 Beats (Teentaal)</option>
                  <option value={8} className="bg-stone-900 text-white">8 Beats (Keherwa)</option>
                  <option value={6} className="bg-stone-900 text-white">6 Beats (Dadra)</option>
                  <option value={4} className="bg-stone-900 text-white">4 Beats (4/4)</option>
                </select>
              </div>

              {/* Beat Counter */}
              {isMetronomeActive && (
                <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 px-3 py-2 rounded-2xl font-mono text-xs font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Beat {currentBeat} / {beatsPerMeasure}</span>
                </div>
              )}

              {/* Copy Notation */}
              <button
                onClick={() => copyNotationText(fullNotationText)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition cursor-pointer"
                title="Copy notation"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono leading-relaxed">
            
            {/* Aalap */}
            <div className="bg-black/30 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider block mb-1">Aalap</span>
              <p className="text-amber-100">S r g — | r S — — |</p>
              <p className="text-amber-100">r g M — | g r S — ||</p>
              <p className="text-[11px] font-sans text-amber-200/60 mt-2">Play this slowly with a relaxed breath.</p>
            </div>

            {/* Main Phrase */}
            <div className="bg-black/30 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider block mb-1">Main Phrase</span>
              <p className="text-amber-100">g M d P | M g r S |</p>
              <p className="text-amber-100">r g M d | P M g r ||</p>
              <p className="text-[11px] font-sans text-amber-200/60 mt-2">Focus on the pitch of the Komal swaras and the Tivra Ma.</p>
            </div>

            {/* Development */}
            <div className="bg-black/30 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider block mb-1">Development</span>
              <p className="text-amber-100">g M d N | S' N d P |</p>
              <p className="text-amber-100">M g r S | r g M g ||</p>
              <p className="text-[11px] font-sans text-amber-200/60 mt-2">Keep the upper Sa controlled and avoid forcing the breath.</p>
            </div>

            {/* Variation & Ending */}
            <div className="bg-black/30 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider block mb-1">Variation & Ending</span>
              <p className="text-amber-100">r g M d | P M g r | g M d P | M g r S |</p>
              <p className="text-amber-100">g M d P | M g r S | r g M g | r S — — ||</p>
              <p className="text-[11px] font-sans text-amber-200/60 mt-2">Practice variation after main phrase feels comfortable. Finish gently on Sa.</p>
            </div>

          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs text-amber-200/90 leading-relaxed font-sans">
            <strong>Original Content Guarantee:</strong> This composition has been newly created for FluteSangam as an original practice piece for Raag Todi. It is not presented as a traditional composition or bandish, ensuring full educational transparency.
          </div>

          {/* How to Practice Steps */}
          <div className="pt-4 border-t border-amber-700/60 space-y-3 font-sans">
            <h3 className="text-base font-bold text-white">How to Practice the FluteSangam Original Learning Piece</h3>
            <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs text-amber-100">
              <li className="bg-black/20 p-3 rounded-xl border border-amber-500/20">
                <strong>Step 1:</strong> Learn the Aalap slowly until the phrases feel natural.
              </li>
              <li className="bg-black/20 p-3 rounded-xl border border-amber-500/20">
                <strong>Step 2:</strong> Add Main Phrase (<span className="font-mono text-amber-300">g M d P | M g r S</span>).
              </li>
              <li className="bg-black/20 p-3 rounded-xl border border-amber-500/20">
                <strong>Step 3:</strong> Add Development introducing upper-register movement.
              </li>
              <li className="bg-black/20 p-3 rounded-xl border border-amber-500/20">
                <strong>Step 4:</strong> Practice Variation without increasing tempo too much.
              </li>
              <li className="bg-black/20 p-3 rounded-xl border border-amber-500/20">
                <strong>Step 5:</strong> Connect Aalap ➔ Main ➔ Dev ➔ Variation ➔ Ending continuously.
              </li>
            </ol>
          </div>
        </section>

        {/* SECTION 10: FLUTE PRACTICE TIPS & WHY LEARN TODI */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Flute Practice Tips */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-900">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-bamboo-950">Flute Practice Tips for Raag Todi</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span><strong>Practice with Tanpura:</strong> A Tanpura drone makes it easier to identify pitch problems with Komal Re, Komal Ga, and Komal Dha.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span><strong>Start in Comfortable Register:</strong> Build confidence in middle register before exploring lower and upper-register phrases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span><strong>Hold Important Swaras:</strong> Don't rush through important notes; give your ear time to recognize their pitch.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span><strong>Use Meend Carefully:</strong> Practice slow, controlled meend rather than making every phrase ornamented.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span><strong>Record Your Practice:</strong> Listening to recordings reveals pitch and phrasing issues not obvious while playing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span><strong>Listen to Todi Regularly:</strong> Listening helps develop an internal sense of the raga's soul.</span>
              </li>
            </ul>
          </div>

          {/* Why Learn Raag Todi? */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-900">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-bamboo-950">Why Learn Raag Todi?</h3>
            </div>
            <p className="text-xs text-stone-600">
              Learning Todi helps an advanced flute player develop 10 essential musical dimensions:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-bamboo-950">
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Komal swara accuracy</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Tivra Ma control</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Fine intonation</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Meend technique</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Breath management</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Aalap development</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Phrase construction</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Expressive playing</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Listening skills</div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">✓ Raga improvisation</div>
            </div>
          </div>

        </section>

        {/* SECTION 11: PRACTICE ROUTINE & TIMER */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                  8. Recommended 45–50 Minute Practice Routine
                </h2>
                <p className="text-xs text-stone-500">Structured daily practice schedule for Raag Todi</p>
              </div>
            </div>

            {/* Timer Box */}
            <div className="bg-amber-50 border border-amber-300 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Session Timer</span>
                <span className="text-xl font-black font-mono text-bamboo-950">{formatTimer(timerSeconds)}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => { setIsTimerRunning(false); setTimerSeconds(2700); }}
                  className="p-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1">
              <span className="text-xs font-bold text-amber-800">5 Minutes</span>
              <h4 className="font-bold text-bamboo-950">Long Notes</h4>
              <p className="text-stone-600 text-xs">Practice sustained Sa, Re, Ga, Ma, Pa, Dha, and Ni with attention to pitch.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1">
              <span className="text-xs font-bold text-amber-800">10 Minutes</span>
              <h4 className="font-bold text-bamboo-950">Swara Practice</h4>
              <p className="text-stone-600 text-xs">Practice the Aaroh and Avaroh slowly with a Tanpura drone.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1">
              <span className="text-xs font-bold text-amber-800">10 Minutes</span>
              <h4 className="font-bold text-bamboo-950">Pakad Drills</h4>
              <p className="text-stone-600 text-xs">Repeat characteristic phrases with expressive breath control.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1">
              <span className="text-xs font-bold text-amber-800">10 Minutes</span>
              <h4 className="font-bold text-bamboo-950">Aalap Phrase Development</h4>
              <p className="text-stone-600 text-xs">Create your own slow phrases using the raga's important swaras.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1">
              <span className="text-xs font-bold text-amber-800">10 Minutes</span>
              <h4 className="font-bold text-bamboo-950">Original Learning Piece</h4>
              <p className="text-stone-600 text-xs">Practice the FluteSangam piece section by section.</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-1">
              <span className="text-xs font-bold text-amber-800">5 Minutes</span>
              <h4 className="font-bold text-bamboo-950">Free Improvisation</h4>
              <p className="text-stone-600 text-xs">Close the notation and try creating your own short Todi phrases.</p>
            </div>
          </div>
        </section>

        {/* SECTION 12: FINAL THOUGHTS & FLUTESANGAM PRO TIP */}
        <section className="bg-gradient-to-br from-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-700/60 mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-300 shrink-0" />
            <h3 className="text-xl font-bold font-display text-amber-100">Final Thoughts & FluteSangam Pro Tip</h3>
          </div>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
            Raag Todi is a challenging but rewarding raga for an advanced flute player. Its distinctive combination of Komal Re, Komal Ga, Tivra Ma, and Komal Dha creates a deeply expressive musical landscape. Move beyond simply memorizing the Aaroh and Avaroh—develop your understanding through Pakad, Aalap, careful listening, accurate pitch, and controlled phrasing.
          </p>
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 text-xs sm:text-sm text-white font-medium">
            <strong className="text-amber-300">FluteSangam Tip:</strong> In Todi, accuracy and expression go together. Take your time with each swara, allow the phrases to breathe, and let the raga develop gradually.
          </div>
        </section>

        {/* ABOUT AUTHOR SECTION */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
};

export default RagaTodiView;
