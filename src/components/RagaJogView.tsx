import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, ChevronDown, ChevronUp, 
  Compass, Zap, Share2, 
  Sliders, Award, Sparkles, ShieldAlert, Lightbulb, ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { playBambooFluteTone } from '../utils/fluteSynth';

interface RagaJogViewProps {
  onViewChange?: (view: AppView) => void;
}

// Swara Frequencies for C Natural Scale
const SWARA_FREQS: Record<string, number> = {
  // Lower Octave (Mandra Saptak)
  'S(lower)': 130.81,
  'R(lower)': 146.83,
  'G(lower)': 164.81,
  'g(lower)': 155.56,
  'm(lower)': 174.61,
  'P(lower)': 196.00,
  'n(lower)': 233.08,
  'N(lower)': 246.94,

  // Middle Octave (Madhya Saptak)
  'S': 261.63,
  'Sa': 261.63,
  'R': 293.66,
  'Re': 293.66,
  'G': 329.63,      // Shuddha Ga
  'Ga': 329.63,
  'g': 311.13,      // Komal Ga
  'g(komal)': 311.13,
  'Ga(komal)': 311.13,
  'm': 349.23,      // Shuddha Ma
  'Ma': 349.23,
  'P': 392.00,      // Shuddha Pa
  'Pa': 392.00,
  'n': 466.16,      // Komal Ni
  'Ni(komal)': 466.16,
  'N': 493.88,      // Shuddha Ni
  'Ni': 493.88,

  // High Octave (Taar Saptak)
  "S'": 523.25,
  "Sa'": 523.25,
  "R'": 587.33,
  "Re'": 587.33,
  "G'": 659.25,
  "Ga'": 659.25,
  "g'": 622.25,
  "m'": 698.46,
  "P'": 783.99,
  "n'": 932.33,
};

export const RagaJogView: React.FC<RagaJogViewProps> = ({ onViewChange }) => {
  // State variables
  const [isPlayingAaroh, setIsPlayingAaroh] = useState(false);
  const [isPlayingAvaroh, setIsPlayingAvaroh] = useState(false);
  const [isPlayingPakad, setIsPlayingPakad] = useState(false);
  const [isPlayingPiece, setIsPlayingPiece] = useState(false);
  const [playingExercise, setPlayingExercise] = useState<number | null>(null);
  const [playingAalap, setPlayingAalap] = useState<number | null>(null);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [copiedNotation, setCopiedNotation] = useState(false);
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

  // Play Swara Sequence helper
  const playPhraseSequence = (
    phrase: string[], 
    tempoMs = 600, 
    onComplete?: () => void
  ) => {
    const ctx = getAudioContext();
    let delay = 0;

    phrase.forEach((token) => {
      const startTime = ctx.currentTime + (delay / 1000);
      const noteDuration = (tempoMs / 1000) * 0.92;

      const cleanToken = token.trim();
      if (cleanToken && cleanToken !== '|' && cleanToken !== '—' && cleanToken !== '||') {
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

  // Aaroh Sequence: S R G m P n S'
  const handlePlayAaroh = () => {
    if (isPlayingAaroh) return;
    setIsPlayingAaroh(true);
    const aarohNotes = ['S', 'R', 'G', 'm', 'P', 'n', "S'"];
    playPhraseSequence(aarohNotes, 650, () => setIsPlayingAaroh(false));
  };

  // Avaroh Sequence: S' n P m G m g S
  const handlePlayAvaroh = () => {
    if (isPlayingAvaroh) return;
    setIsPlayingAvaroh(true);
    const avarohNotes = ["S'", 'n', 'P', 'm', 'G', 'm', 'g', 'S'];
    playPhraseSequence(avarohNotes, 650, () => setIsPlayingAvaroh(false));
  };

  // Pakad Sequence: G m P n P | m G m g S
  const handlePlayPakad = () => {
    if (isPlayingPakad) return;
    setIsPlayingPakad(true);
    const pakadNotes = ['G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'g', 'S'];
    playPhraseSequence(pakadNotes, 600, () => setIsPlayingPakad(false));
  };

  // Original Learning Piece Playback
  const handlePlayPiece = () => {
    if (isPlayingPiece) return;
    setIsPlayingPiece(true);

    const fullPieceNotes = [
      // Aalap
      'S', 'R', 'G', 'm', 'G', 'm', 'G', 'm', 'g', 'S',
      // Main Phrase
      'G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'm', 'G', 'm', 'g', 'S', 'R', 'G', 'm',
      // Development
      'G', 'm', 'P', 'n', "S'", 'n', 'P', 'm', 'G', 'm', 'G', 'm', 'g', 'S', 'R', 'G',
      'm', 'P', 'n', 'P', 'm', 'G', 'm', 'g', 'S', 'R', 'G', 'm',
      // Variation
      'G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'G', 'm', 'g', 'S', 'R', 'G',
      'm', 'P', 'n', "S'", 'n', 'P', 'm', 'G', 'm', 'G', 'm', 'g', 'S',
      // Ending
      'G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'm', 'G', 'm', 'g', 'S'
    ];

    playPhraseSequence(fullPieceNotes, 520, () => setIsPlayingPiece(false));
  };

  // Practice Timer Effect
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

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyNotation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 font-sans pb-24">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/80 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onViewChange ? onViewChange('learn_raagas') : window.history.back()}
            className="flex items-center gap-2 text-amber-800 hover:text-amber-950 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>Back to Raagas Collection</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold">
              Advanced Masterclass
            </span>
            <button 
              onClick={() => handleCopyNotation(`Raag Jog — FluteSangam Complete Guide`)}
              className="flex items-center gap-1.5 bg-amber-100/90 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* HERO HEADER - Light & Warm Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50 text-bamboo-950 p-6 sm:p-10 shadow-sm border border-amber-300/80 mb-8">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              <span className="bg-amber-200/90 text-amber-900 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Moon className="w-3.5 h-3.5 text-amber-700" />
                Late Night Raag
              </span>
              <span className="bg-white/80 text-amber-900 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                Audav-Audav Jati
              </span>
              <span className="bg-rose-100 text-rose-900 border border-rose-200 px-3 py-1 rounded-full shadow-2xs">
                Shuddha & Komal Ga
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-bamboo-950 tracking-tight leading-tight font-display">
              Raag Jog <span className="text-amber-800 text-2xl sm:text-4xl font-normal block sm:inline mt-1 sm:mt-0">— Notes, Aaroh, Avaroh, Pakad & Practice</span>
            </h1>

            <p className="text-stone-700 text-base sm:text-lg max-w-3xl leading-relaxed">
              Explore the expressive, deep, and restlessly meditative atmosphere of Raag Jog. Master its trademark contrast between Shuddha Ga and Komal Ga, expressive Ma-Pa movements, and an original FluteSangam Learning Piece.
            </p>

            {/* Published and Updated Date Metadata Bar (NO Author tag) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-amber-900/90 pt-2">
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Published: <strong className="text-bamboo-950 font-semibold">August 9, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-rose-700" />
                <span>Updated: <strong className="text-bamboo-950 font-semibold">August 9, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Reading Time: <strong className="text-bamboo-950 font-semibold">14 min read</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-amber-800/60">
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-xs text-amber-200 block mb-1">Time of Day</span>
              <span className="text-sm font-bold text-amber-300 flex items-center gap-1">
                <Moon className="w-4 h-4 text-amber-300" />
                Late Night
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-xs text-amber-200 block mb-1">Vadi / Samvadi</span>
              <span className="text-sm font-bold text-white">Sa / Pa</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-xs text-amber-200 block mb-1">Dominant Mood</span>
              <span className="text-sm font-bold text-amber-200">Intimate, Contemplative</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-xs text-amber-200 block mb-1">Key Feature</span>
              <span className="text-sm font-bold text-amber-300">Shuddha & Komal Ga</span>
            </div>
          </div>
        </div>

        {/* INTRODUCTION SECTION */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Introduction to Raag Jog</h2>
          </div>

          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            <strong className="text-amber-900 font-bold">Raag Jog</strong> is an expressive Hindustani classical raga known for its distinctive use of both <strong className="text-slate-900">Shuddha Ga (G)</strong> and <strong className="text-slate-900">Komal Ga (g)</strong>. This contrast between the two forms of Ga gives Jog much of its recognizable character.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            Jog has a calm, intimate, and contemplative quality, but it can also become lively and expressive when developed through faster phrases. The raga is particularly attractive on the bamboo flute (Bansuri) because the movement between Ga, Ma, and Pa can be expressed beautifully through controlled breath and subtle meend (glides).
          </p>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            Unlike a straightforward scale, Raag Jog is identified by its characteristic phrases and the way its swaras are approached. A player who simply follows an ascending and descending note sequence may technically use the appropriate notes but still not produce the recognizable character of Jog.
          </p>

          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 mt-4">
            <h3 className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              What Flute Players Develop with Raag Jog:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-800 font-medium">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Swara accuracy</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Control over Ga & g</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Meend execution</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Breath control</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Phrase construction</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Aalap development</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Expressive dynamics</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Raga improvisation</div>
            </div>
          </div>
        </div>

        {/* NOTES & SWARA STRUCTURE WITH INTERACTIVE SOUND BOARD */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                <Music className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Notes & Swara Structure</h2>
                <p className="text-xs text-slate-500">Click any note to hear synthesized natural bamboo flute sound</p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-bold">
              Base Key: C Natural
            </span>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            Raag Jog primarily uses the following swaras: <strong className="text-amber-900">Sa</strong> (Shuddha), <strong className="text-amber-900">Re</strong> (Shuddha), <strong className="text-amber-900">Ga</strong> (Shuddha), <strong className="text-amber-900">g</strong> (Komal Ga), <strong className="text-amber-900">Ma</strong> (Shuddha), <strong className="text-amber-900">Pa</strong> (Shuddha), and <strong className="text-amber-900">n</strong> (Komal Ni in characteristic phrases). Dha is generally omitted in standard Jog.
          </p>

          {/* Swara Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 pt-2">
            {[
              { note: 'Sa', code: 'S', desc: 'Shuddha Sa' },
              { note: 'Re', code: 'R', desc: 'Shuddha Re' },
              { note: 'Shuddha Ga', code: 'G', desc: 'Natural Ga (G)' },
              { note: 'Komal Ga', code: 'g', desc: 'Flat Ga (g)' },
              { note: 'Shuddha Ma', code: 'm', desc: 'Natural Ma (m)' },
              { note: 'Shuddha Pa', code: 'P', desc: 'Natural Pa (P)' },
              { note: 'Komal Ni', code: 'n', desc: 'Flat Ni (n)' },
              { note: "Taar Sa'", code: "S'", desc: 'High Octave Sa' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => playSwara(item.code, 1.4)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeSwara === item.code
                    ? 'bg-amber-600 text-white border-amber-700 scale-105 shadow-md'
                    : 'bg-amber-50/80 hover:bg-amber-100 text-slate-800 border-amber-200 hover:border-amber-400'
                }`}
              >
                <Volume2 className={`w-4 h-4 mb-1 ${activeSwara === item.code ? 'text-white' : 'text-amber-700'}`} />
                <span className="font-extrabold text-base">{item.code}</span>
                <span className="text-[10px] opacity-80 mt-0.5 text-center">{item.note}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Important Swara Feature: The Dual-Ga Contrast
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              The signature movement <code className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold text-xs">G m G m g S</code> is essential for understanding Jog. 
              Here <strong className="text-slate-900">G = Shuddha Ga</strong> and <strong className="text-slate-900">g = Komal Ga</strong>. On flute, the transition must be smooth, clear, and perfectly pitched.
            </p>
          </div>
        </div>

        {/* AAROH & AVAROH SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Aaroh */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Aaroh (Ascent)
              </h3>
              <button
                onClick={handlePlayAaroh}
                disabled={isPlayingAaroh}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isPlayingAaroh ? <Pause className="w-3.5 h-3.5 text-emerald-700 animate-pulse" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{isPlayingAaroh ? 'Playing...' : 'Listen Aaroh'}</span>
              </button>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center font-mono text-lg text-amber-950 font-bold tracking-widest">
              S R G m P n S'
            </div>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              <strong>Swaras:</strong> Sa – Re – Shuddha Ga – Ma – Pa – Komal Ni – Taar Sa'. Practice slowly and hold each note steadily against a drone before attempting fast loops.
            </p>
          </div>

          {/* Avaroh */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Avaroh (Descent)
              </h3>
              <button
                onClick={handlePlayAvaroh}
                disabled={isPlayingAvaroh}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isPlayingAvaroh ? <Pause className="w-3.5 h-3.5 text-rose-700 animate-pulse" /> : <Play className="w-3.5 h-3.5 text-rose-700" />}
                <span>{isPlayingAvaroh ? 'Playing...' : 'Listen Avaroh'}</span>
              </button>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center font-mono text-lg text-rose-950 font-bold tracking-widest">
              S' n P m G m g S
            </div>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              <strong>Swaras:</strong> Taar Sa' – Komal Ni – Pa – Ma – Shuddha Ga – Ma – Komal Ga – Sa. Demonstrates the signature transition from Shuddha Ga to Komal Ga.
            </p>
          </div>
        </div>

        {/* PAKAD SECTION */}
        <div className="bg-gradient-to-r from-amber-100/80 via-white to-amber-100/80 border border-amber-300 rounded-2xl p-6 sm:p-8 mb-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-600" />
                Pakad (Catch Phrase)
              </h2>
              <p className="text-xs text-slate-600">The unmistakable musical identity of Raag Jog</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPakad}
                disabled={isPlayingPakad}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {isPlayingPakad ? <Pause className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingPakad ? 'Playing Pakad...' : 'Play Pakad Audio'}</span>
              </button>
              
              <button
                onClick={() => handleCopyNotation('G m P n P | m G m g S')}
                className="p-2 bg-white hover:bg-amber-100 text-slate-800 rounded-xl border border-amber-300 transition-colors cursor-pointer"
                title="Copy Pakad Notation"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-300 font-mono text-xl sm:text-2xl text-center text-amber-950 font-extrabold tracking-widest my-2 shadow-2xs">
            G m P n P | m G m g S
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 pt-2">
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <span className="text-amber-800 font-bold block mb-1">Key Phrase 1</span>
              <code>G m P n P</code> — Establishes upper anchor around Pa and Ni.
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <span className="text-amber-800 font-bold block mb-1">Key Phrase 2</span>
              <code>m G m g S</code> — Smooth descent highlighting Shuddha & Komal Ga.
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <span className="text-amber-800 font-bold block mb-1">Key Phrase 3</span>
              <code>G m G m g S</code> — Essential Ga-Gis-Ga weave.
            </div>
          </div>
        </div>

        {/* CHARACTERISTICS OF RAAG JOG */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-6 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Sliders className="w-6 h-6 text-amber-700" />
            5 Key Characteristics of Raag Jog
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                num: '01',
                title: 'Both Forms of Ga',
                desc: 'The most recognizable feature of Jog is using both Shuddha Ga (G) and Komal Ga (g). In phrases like G m G m g S, the first Ga is Shuddha and the second is Komal.',
                color: 'bg-amber-50/60 border-amber-200/80 text-amber-950'
              },
              {
                num: '02',
                title: 'Importance of Ma',
                desc: 'Ma provides a vital focal point for movement in Jog. Phrases around G – m – P and P – m – G establish the raga’s melodic structure.',
                color: 'bg-amber-50/60 border-amber-200/80 text-amber-950'
              },
              {
                num: '03',
                title: 'Characteristic Descending Movement',
                desc: 'The descending motif m G m g S must feel like a seamlessly connected musical sentence rather than two unrelated Ga notes.',
                color: 'bg-amber-50/60 border-amber-200/80 text-amber-950'
              },
              {
                num: '04',
                title: 'Expressive Character & Emotion',
                desc: 'Jog can sound calm, reflective, romantic, intimate, and deeply contemplative depending on tempo, breath dynamics, and register.',
                color: 'bg-amber-50/60 border-amber-200/80 text-amber-950'
              },
              {
                num: '05',
                title: 'Importance of Phrase-Based Learning',
                desc: 'Jog should not be learned purely through scale steps. Spend maximum time practicing Pakad phrases like G m P n P and m G m g S.',
                color: 'bg-amber-50/60 border-amber-200/80 text-amber-950'
              }
            ].map((card, i) => (
              <div key={i} className={`p-5 rounded-xl border ${card.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-200 text-amber-950 font-bold">{card.num}</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{card.title}</h3>
                <p className="text-slate-700 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STEP-BY-STEP PRACTICE EXERCISES */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Sliders className="w-6 h-6 text-amber-700" />
                7 Progressive Practice Exercises
              </h2>
              <p className="text-xs text-slate-500">Master each exercise sequentially with audio guidance</p>
            </div>

            {/* Interactive Timer Widget */}
            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-300">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="font-mono text-sm font-bold text-amber-950">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                {isTimerRunning ? 'Pause' : 'Start 45m Timer'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 1,
                title: 'Practice 1 — Basic Swara Familiarization',
                notes: ['S', 'R', 'G', 'm', 'P', 'n', "S'"],
                desc: 'Play slowly up and down. Hold each note comfortably and check your pitch against a Tanpura drone before increasing tempo.'
              },
              {
                id: 2,
                title: 'Practice 2 — Shuddha Ga Accuracy',
                notes: ['R', 'G', 'm', 'P', 'm', 'G'],
                desc: 'Focus on producing a clean, warm Shuddha Ga without letting it lean flat toward Komal Ga.'
              },
              {
                id: 3,
                title: 'Practice 3 — Komal Ga Positioning',
                notes: ['m', 'g', 'S', 'G', 'm', 'g', 'S'],
                desc: 'Train your ear and fingers to clearly distinguish the exact position of Komal Ga (g) relative to Sa.'
              },
              {
                id: 4,
                title: 'Practice 4 — Both Forms of Ga Integration',
                notes: ['G', 'm', 'G', 'm', 'g', 'S'],
                desc: 'The foundational exercise of Raag Jog. Practice seamlessly weaving from Shuddha Ga to Komal Ga.'
              },
              {
                id: 5,
                title: 'Practice 5 — Ma and Pa Movement',
                notes: ['G', 'm', 'P', 'm', 'G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'g', 'S'],
                desc: 'Keep tone even while navigating phrases between middle Ma, Pa, and lower descent.'
              },
              {
                id: 6,
                title: 'Practice 6 — Meend & Microtonal Glides',
                notes: ['G', 'm', 'G', 'm', 'g', 'S'],
                desc: 'Practice subtle breath glides: G ~ m, m ~ G, and m ~ g ~ S. Meend should serve the phrase naturally.'
              },
              {
                id: 7,
                title: 'Practice 7 — Complete Pakad Masterclass',
                notes: ['G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'g', 'S'],
                desc: 'Start very slowly. Repeat multiple times, varying rhythmic spacing slightly once confident.'
              }
            ].map((ex) => (
              <div key={ex.id} className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs font-mono font-bold">
                      {ex.id}
                    </span>
                    {ex.title}
                  </h3>
                  <button
                    onClick={() => {
                      if (playingExercise === ex.id) {
                        setPlayingExercise(null);
                      } else {
                        setPlayingExercise(ex.id);
                        playPhraseSequence(ex.notes, 580, () => setPlayingExercise(null));
                      }
                    }}
                    className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                  >
                    {playingExercise === ex.id ? <Pause className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> : <Play className="w-3.5 h-3.5 text-amber-700" />}
                    <span>{playingExercise === ex.id ? 'Playing...' : 'Play Exercise'}</span>
                  </button>
                </div>

                <div className="font-mono text-xs text-amber-950 bg-white p-2.5 rounded-lg border border-amber-300 tracking-wider font-bold">
                  {ex.notes.join('  ')}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AALAP PRACTICE SECTION */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
              <Compass className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Aalap Practice (Unmetered Exploration)</h2>
              <p className="text-xs text-slate-500">Develop the raga without depending on a fixed rhythmic composition</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: 1,
                title: 'Aalap 1 — Lower-Middle Anchor',
                notes: ['S', 'R', 'G', 'm', 'G', 'm', 'G', 'm', 'g', 'S'],
                notationStr: 'S — R — G — m — | G m — G — | m g S —'
              },
              {
                id: 2,
                title: 'Aalap 2 — Mid Octave Extension',
                notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'm', 'g', 'S'],
                notationStr: 'S R G m | P — m G | m g S —'
              },
              {
                id: 3,
                title: 'Aalap 3 — Upper Pa-Ni Touch',
                notes: ['G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'g', 'S'],
                notationStr: 'G m P — | n P m G | m g S —'
              },
              {
                id: 4,
                title: 'Aalap 4 — Full Register Sweep',
                notes: ['S', 'R', 'G', 'm', 'G', 'm', 'P', 'n', 'P', 'm', 'G', 'm', 'g', 'S'],
                notationStr: 'S R G m | G m P n | P m G m | g S — —'
              }
            ].map((aalap) => (
              <div key={aalap.id} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-950">{aalap.title}</h3>
                  <button
                    onClick={() => {
                      if (playingAalap === aalap.id) {
                        setPlayingAalap(null);
                      } else {
                        setPlayingAalap(aalap.id);
                        playPhraseSequence(aalap.notes, 700, () => setPlayingAalap(null));
                      }
                    }}
                    className="p-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                  >
                    {playingAalap === aalap.id ? <Pause className="w-3.5 h-3.5 text-amber-800 animate-pulse" /> : <Play className="w-3.5 h-3.5 text-amber-800" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-amber-950 bg-white p-2 rounded border border-amber-300 font-bold">
                  {aalap.notationStr}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMON MISTAKES & FLUTESANGAM FIXES */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-6 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            Common Pitfalls & How to Fix Them
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                mistake: 'Playing Only One Form of Ga',
                fix: 'Using only Shuddha Ga or only Komal Ga destroys Jog’s identity. Practice phrases containing both forms separately before combining.'
              },
              {
                mistake: 'Playing Komal Ga Randomly',
                fix: 'Komal Ga is not inserted randomly. Learn its characteristic placement strictly through established phrases like m G m g S.'
              },
              {
                mistake: 'Treating Aaroh/Avaroh as the Entire Raga',
                fix: 'A scale gives basic notes but lacks personality. Spend 80% of practice time on Pakad and phrase development.'
              },
              {
                mistake: 'Playing Too Many Fast Notes',
                fix: 'Jog sounds best with space and breath. Make every phrase deliberate rather than rushing note volume.'
              },
              {
                mistake: 'Rushing Meend Glides',
                fix: 'Fast sliding makes pitch muddy. Begin with very slow meend glides and ensure target notes are stable.'
              },
              {
                mistake: 'Losing Pitch While Changing Ga',
                fix: 'The half-hole or finger position shift between Shuddha and Komal Ga causes pitch drift. Practice against a Tanpura drone.'
              }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1.5">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Mistake: {item.mistake}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed pl-5 border-l-2 border-emerald-500">
                  <strong className="text-emerald-800">FluteSangam Fix:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FLUTESANGAM ORIGINAL LEARNING PIECE */}
        <div className="bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50 border border-amber-300 rounded-2xl p-6 sm:p-8 mb-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                100% Original Composition
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                FluteSangam Original Learning Piece — Raag Jog
              </h2>
              <p className="text-xs text-slate-600">Created specifically as a structured practice composition for Bansuri students</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPiece}
                disabled={isPlayingPiece}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {isPlayingPiece ? <Pause className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingPiece ? 'Playing Master Piece...' : 'Play Complete Composition'}</span>
              </button>

              <button
                onClick={() => handleCopyNotation(`
Aalap:
S — R G — | m G — — |
m G m g | S — — — ||

Main Phrase:
G m P n | P m G m |
m G m g | S R G m ||

Development:
G m P n | S' n P m |
G m G m | g S R G |
m P n P | m G m g |
S — R G | m — — — ||

Variation:
G m P — | n P m G |
m G m g | S — R G |
m P n S' | n P m G |
m G m g | S — — — ||

Ending:
G m P n | P m G m |
m G m g | S — — — ||
                `)}
                className="p-2.5 bg-white hover:bg-amber-100 text-slate-800 rounded-xl border border-amber-300 transition-colors cursor-pointer"
                title="Copy Full Notation"
              >
                {copiedNotation ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-700" />}
              </button>
            </div>
          </div>

          {/* Composition Notation Sections */}
          <div className="space-y-4 pt-2">
            {[
              {
                title: 'Section 1 — Aalap',
                lines: [
                  'S — R G — | m G — — |',
                  'm G m g | S — — — ||'
                ],
                tip: 'Play slowly with deep breath support. Allow the phrases to breathe.'
              },
              {
                title: 'Section 2 — Main Phrase',
                lines: [
                  'G m P n | P m G m |',
                  'm G m g | S R G m ||'
                ],
                tip: 'Repeat several times. Maintain a clear acoustic distinction between G and g.'
              },
              {
                title: 'Section 3 — Development',
                lines: [
                  'G m P n | S\' n P m |',
                  'G m G m | g S R G |',
                  'm P n P | m G m g |',
                  'S — R G | m — — — ||'
                ],
                tip: 'Ascend smoothly to Taar Sa\' without forcing breath pressure.'
              },
              {
                title: 'Section 4 — Variation',
                lines: [
                  'G m P — | n P m G |',
                  'm G m g | S — R G |',
                  'm P n S\' | n P m G |',
                  'm G m g | S — — — ||'
                ],
                tip: 'Practices the raga over a wider melodic compass across both octaves.'
              },
              {
                title: 'Section 5 — Ending',
                lines: [
                  'G m P n | P m G m |',
                  'm G m g | S — — — ||'
                ],
                tip: 'Finish gently on Sa with a long, peaceful breath fade.'
              }
            ].map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-amber-200 space-y-2 shadow-2xs">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">{sec.title}</h3>
                <div className="font-mono text-sm text-amber-950 bg-amber-50/80 p-3 rounded-lg border border-amber-200 space-y-1 font-bold">
                  {sec.lines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 italic">💡 {sec.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FLUTE PRACTICE TIPS & ROUTINE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Practice Tips */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Flute Practice Tips for Raag Jog
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Use a Tanpura Drone:</strong> Always keep a C Tanpura playing to monitor pitch accuracy on Shuddha and Komal Ga.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Practice Slowly:</strong> Slow practice reveals minor pitch flaws between G and g before increasing tempo.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Record Yourself:</strong> Listening back helps spot microtonal pitch drift that is hard to catch while blowing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Selective Meend:</strong> Do not slide every note automatically. Clean, stable notes are equally important.</span>
              </li>
            </ul>
          </div>

          {/* Recommended 45-Min Routine */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              45-Minute Daily Practice Schedule
            </h2>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2 bg-amber-50/60 rounded border border-amber-200 flex justify-between">
                <span><strong>5 Min</strong> — Swara Practice & Scale</span>
                <span className="text-amber-900 font-bold">S R G m P n S'</span>
              </div>
              <div className="p-2 bg-amber-50/60 rounded border border-amber-200 flex justify-between">
                <span><strong>5 Min</strong> — Ga Contrast Drill</span>
                <span className="text-amber-900 font-bold">G m G m g S</span>
              </div>
              <div className="p-2 bg-amber-50/60 rounded border border-amber-200 flex justify-between">
                <span><strong>10 Min</strong> — Pakad Mastery</span>
                <span className="text-amber-900 font-bold">G m P n P | m G m g S</span>
              </div>
              <div className="p-2 bg-amber-50/60 rounded border border-amber-200 flex justify-between">
                <span><strong>10 Min</strong> — Aalap Exploration</span>
                <span className="text-amber-900 font-bold">Unmetered phrases</span>
              </div>
              <div className="p-2 bg-amber-50/60 rounded border border-amber-200 flex justify-between">
                <span><strong>10 Min</strong> — Learning Piece</span>
                <span className="text-amber-900 font-bold">FluteSangam Original</span>
              </div>
              <div className="p-2 bg-amber-50/60 rounded border border-amber-200 flex justify-between">
                <span><strong>5 Min</strong> — Free Improvisation</span>
                <span className="text-amber-900 font-bold">Spontaneous sentences</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8 space-y-4 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Sliders className="w-6 h-6 text-amber-700" />
            Frequently Asked Questions — Raag Jog
          </h2>

          <div className="space-y-3 pt-2">
            {[
              {
                q: 'What makes Raag Jog unique compared to other late-night ragas?',
                a: 'Raag Jog’s unique identity lies in its simultaneous use of both Shuddha Ga and Komal Ga, coupled with strong anchors on Sa, Ma, and Pa, giving it a bluesy yet deeply contemplative character.'
              },
              {
                q: 'Is Raag Jog suitable for beginner bansuri players?',
                a: 'Jog is generally recommended for intermediate and advanced flute players because controlling both Shuddha and Komal Ga with clean pitch requires reliable finger placement and embouchure control.'
              },
              {
                q: 'Which flute key is best for practicing Raag Jog?',
                a: 'An E Bass or G Medium bansuri is ideal for Raag Jog as the deeper acoustic resonance highlights the intimate, nocturnal mood of the raga.'
              },
              {
                q: 'How do I avoid mixing Raag Jog with Raag Tilang or Nat Bhairav?',
                a: 'Focus heavily on the signature descending motif m G m g S and avoid using Dha or Shuddha Ni in ways that resemble other scales.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 font-bold text-sm text-slate-800 flex justify-between items-center hover:bg-amber-100/50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs text-slate-700 border-t border-amber-200 bg-white leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT AUTHOR / FOOTER SECTION */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
};

export default RagaJogView;
