import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings2, 
  Music, 
  Radio, 
  Layers, 
  BookOpen, 
  ArrowLeft, 
  Compass, 
  Activity, 
  Sliders, 
  ChevronRight, 
  ChevronDown,
  Flame, 
  Wind, 
  Plus, 
  Minus,
  HelpCircle,
  Clock,
  Target,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  TanpuraEngine, 
  NOTE_NAMES, 
  FirstStringTuning, 
  OctaveStyle, 
  TanpuraToneStyle,
  StringPluckEvent, 
  calculateSaFrequency 
} from '../utils/tanpuraSynth';
import { AppView } from '../types';

interface TanpuraDroneViewProps {
  onViewChange?: (view: AppView) => void;
  onBackToHomepage?: () => void;
}

// Raga preset recommendations
interface RagaTanpuraPreset {
  name: string;
  firstString: FirstStringTuning;
  recommendedSa: string;
  octave: OctaveStyle;
  mood: string;
  viewKey?: AppView;
  reason: string;
}

const RAGA_PRESETS: RagaTanpuraPreset[] = [
  { name: 'Raga Yaman', firstString: 'Pa', recommendedSa: 'E', octave: 'low', mood: 'Peaceful & Devotional', viewKey: 'raga_yaman', reason: 'Pa is essential resting swara (Vadi/Samvadi Ga-Ni)' },
  { name: 'Raga Bhoopali', firstString: 'Pa', recommendedSa: 'C', octave: 'low', mood: 'Calm & Bright', viewKey: 'raga_bhoopali', reason: 'Pancham anchors the Audav pentatonic scale' },
  { name: 'Raga Bhimpalasi', firstString: 'Pa', recommendedSa: 'D', octave: 'low', mood: 'Sweet & Longing', viewKey: 'raga_bhimpalasi', reason: 'Pa is Vadi swara for afternoon sadhana' },
  { name: 'Raga Malkauns', firstString: 'Ma', recommendedSa: 'D#', octave: 'low', mood: 'Profound & Meditative', viewKey: 'raga_malkauns', reason: 'Pa is omitted (varjit); tuned to Shuddha Ma' },
  { name: 'Raga Bageshree', firstString: 'Ma', recommendedSa: 'D', octave: 'low', mood: 'Romantic & Deep', viewKey: 'raga_bageshree', reason: 'Madhyam (Ma) is the Vadi swara' },
  { name: 'Raga Marwa', firstString: 'Ni', recommendedSa: 'D', octave: 'low', mood: 'Twilight Sunset', viewKey: 'raga_marwa', reason: 'Pa is omitted; Shuddha Ni resolves to Komal Re' },
  { name: 'Raga Bhairav', firstString: 'Pa', recommendedSa: 'C', octave: 'low', mood: 'Morning Awakening', viewKey: 'raga_bhairav', reason: 'Pa anchors Komal Re and Komal Dha' },
  { name: 'Raga Desh', firstString: 'Pa', recommendedSa: 'C#', octave: 'low', mood: 'Monsoon Rain', viewKey: 'raga_desh', reason: 'Pa-Sa provides foundational stability' },
  { name: 'Raga Kafi', firstString: 'Pa', recommendedSa: 'D', octave: 'low', mood: 'Folk & Playful', viewKey: 'raga_kafi', reason: 'Pa anchors Komal Ga and Komal Ni' },
  { name: 'Raga Todi', firstString: 'Pa', recommendedSa: 'E', octave: 'low', mood: 'Solitude & Pathos', viewKey: 'raga_todi', reason: 'Pa anchors Tivra Ma and Komal Dha' }
];

// Bansuri Flute Size Mapping for Sa
const BANSURI_FLUTE_KEYS = [
  { note: 'C', bansuri: 'C Medium / C Bass', type: 'Common for Beginners' },
  { note: 'C#', bansuri: 'C# Medium / Bass', type: 'Vocal / Carnatic' },
  { note: 'D', bansuri: 'D Medium / D Bass', type: 'Light Classical & Folk' },
  { note: 'D#', bansuri: 'D# Medium / Bass', type: 'Warm Ghazals' },
  { note: 'E', bansuri: 'E Bass (30 inch)', type: 'Master Concert Standard' },
  { note: 'F', bansuri: 'F Bass', type: 'Deep Mellow Classical' },
  { note: 'F#', bansuri: 'F# Medium / Bass', type: 'Sweet Tone / Fusion' },
  { note: 'G', bansuri: 'G Base / G Medium', type: 'Universal Beginner Standard' },
  { note: 'G#', bansuri: 'G# Base / Medium', type: 'Rich Melodic Resonance' },
  { note: 'A', bansuri: 'A Base / A Medium', type: 'Bright / Bhajan' },
  { note: 'A#', bansuri: 'A# Base', type: 'Vocal Match' },
  { note: 'B', bansuri: 'B Base', type: 'High Solo' }
];

// Comprehensive FAQ Data for In-Depth Content
const FAQ_ITEMS = [
  {
    q: 'Why is practicing with a Tanpura drone essential for Bansuri players?',
    a: 'Unlike fretted or keyed instruments (like harmonium or piano) which use Equal Temperament, the Indian bamboo flute is a completely pure acoustic instrument played in Just Intonation (Gandhar and Pancham Bhava). The Tanpura produces an uninterrupted harmonic ocean of 16+ overtones. When you practice long notes (Swar Sadhana) against the Tanpura, your ear learns to recognize microtonal purity (Sur) and eliminate frequency beating between your breath and the drone.'
  },
  {
    q: 'Should I choose Pa, Ma, or Ni for the first string tuning mode?',
    a: 'As a rule of thumb: (1) Use Pa (Pancham) for ~85% of Hindustani and Carnatic ragas that contain a natural Pancham swara (Yaman, Bhoopali, Bhimpalasi, Bilawal, Desh, Kafi, Bhairav, Todi). (2) Use Ma (Shuddha Madhyam) when Pancham is omitted (varjit) or when Madhyam is the Vadi swara (Malkauns, Bageshree, Chandrakauns, Megh). (3) Use Ni (Shuddha Nishad) for ragas that omit Pa and have a strong Nishad that leans toward Komal Re (Marwa, Puriya, Sohini).'
  },
  {
    q: 'What is the difference between Male (Octave 3) and Female (Octave 4) Tanpura registers?',
    a: 'Male Tanpura (Octave 3, C3–B3, ~130 Hz) has a deeper Kharaj string and fuller lower body resonance, making it ideal for deep bass flutes such as E Bass (30 inch), F Bass, and C Medium bansuris. Female Tanpura (Octave 4, C4–B4, ~260 Hz) provides a higher tonic pitch and is well suited for medium and small high-pitch flutes like G Medium or A Base flutes.'
  },
  {
    q: 'Should I tune my Tanpura to 440 Hz or 432 Hz for flute practice?',
    a: '440 Hz is the worldwide concert pitch standard (A4 = 440 Hz) used by modern bansuri makers and stage performers. 432 Hz is a historical acoustic tuning favored for deep meditation, sound healing, and solitary riyaz. This tool supports 432 Hz, 440 Hz, and 444 Hz with real-time fine cents calibration.'
  },
  {
    q: 'How do I identify and eliminate "pitch beating" during Swar Sadhana?',
    a: 'When your flute note is slightly sharp or flat relative to the Tanpura string, you will hear a rapid "wah-wah-wah" acoustic interference wave (frequency beating). As your blowing angle and breath pressure adjust to the exact pitch, the beating slows down and completely vanishes into a pure, crystal-clear stationary sound. That stillness is true Sur.'
  },
  {
    q: 'Why does my flute sound sharp or flat at different times of the day?',
    a: 'Bamboo is an organic material sensitive to ambient room temperature and air moisture. In colder rooms, the speed of sound inside the bamboo tube slows down, causing the flute to sound slightly flat (~10–20 cents). As you blow warm air into the flute for 5 minutes, the bamboo warms up and pitch rises to the standard concert pitch.'
  }
];

export const TanpuraDroneView: React.FC<TanpuraDroneViewProps> = ({ onViewChange, onBackToHomepage }) => {
  // Tanpura state
  const [isPlaying, setIsPlaying] = useState(false);
  const [rootSa, setRootSa] = useState<string>('C');
  const [octave, setOctave] = useState<OctaveStyle>('low');
  const [firstString, setFirstString] = useState<FirstStringTuning>('Pa');
  const [toneStyle, setToneStyle] = useState<TanpuraToneStyle>('miraj');
  const [tempoBpm, setTempoBpm] = useState<number>(60);
  const [jawariBrilliance, setJawariBrilliance] = useState<number>(0.85);
  const [fineTuneCents, setFineTuneCents] = useState<number>(0);
  const [concertPitchHz, setConcertPitchHz] = useState<number>(440);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Active string animation state
  const [activeStringIndex, setActiveStringIndex] = useState<number | null>(null);
  const [activeStringName, setActiveStringName] = useState<string>('');
  const [activeFrequency, setActiveFrequency] = useState<number>(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const engineRef = useRef<TanpuraEngine | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize Tanpura Engine
    const engine = new TanpuraEngine({
      rootSa,
      octave,
      firstString,
      toneStyle,
      tempoBpm,
      jawariBrilliance,
      fineTuneCents,
      concertPitchHz,
      masterVolume: isMuted ? 0 : masterVolume
    });

    engine.setOnPluckCallback((event: StringPluckEvent) => {
      setActiveStringIndex(event.stringIndex);
      setActiveStringName(event.stringName);
      setActiveFrequency(event.frequency);
    });

    engineRef.current = engine;

    // Keyboard Spacebar listener to toggle Tanpura
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Update engine whenever parameters change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setConfig({
        rootSa,
        octave,
        firstString,
        toneStyle,
        tempoBpm,
        jawariBrilliance,
        fineTuneCents,
        concertPitchHz,
        masterVolume: isMuted ? 0 : masterVolume
      });
    }
  }, [rootSa, octave, firstString, toneStyle, tempoBpm, jawariBrilliance, fineTuneCents, concertPitchHz, masterVolume, isMuted]);

  const togglePlayback = () => {
    if (!engineRef.current) return;
    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setActiveStringIndex(null);
    } else {
      engineRef.current.start();
      setIsPlaying(true);
    }
  };

  const applyPreset = (preset: RagaTanpuraPreset) => {
    setRootSa(preset.recommendedSa);
    setFirstString(preset.firstString);
    setOctave(preset.octave);
    if (!isPlaying) {
      if (engineRef.current) {
        engineRef.current.setConfig({
          rootSa: preset.recommendedSa,
          firstString: preset.firstString,
          octave: preset.octave
        });
        engineRef.current.start();
        setIsPlaying(true);
      }
    }
  };

  const adjustTempo = (delta: number) => {
    setTempoBpm(prev => Math.min(80, Math.max(40, prev + delta)));
  };

  const currentSaFreq = Math.round(calculateSaFrequency(rootSa, octave, fineTuneCents, concertPitchHz) * 10) / 10;

  const stringLabels = [
    { label: firstString === 'Pa' ? 'Pa' : firstString === 'Ma' ? 'Ma' : firstString === 'Ni' ? 'Ni' : 'Sa', sub: '1st String' },
    { label: "Sa'", sub: 'Jodi 1' },
    { label: "Sa'", sub: 'Jodi 2' },
    { label: 'Sa', sub: 'Kharaj' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-6xl mx-auto py-4 sm:py-10 px-3 sm:px-6 pb-52 sm:pb-52 md:pb-12"
      id="tanpura-drone-view"
    >
      {/* Top Navigation */}
      <Link
        to="/"
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) return;
          if (onBackToHomepage) {
            e.preventDefault();
            onBackToHomepage();
          } else if (onViewChange) {
            e.preventDefault();
            onViewChange('home');
          }
        }}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/90 hover:bg-bamboo-100 border border-bamboo-200 px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-full mb-4 sm:mb-6 transition-all cursor-pointer shadow-3xs active:scale-95"
        id="tanpura-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Homepage
      </Link>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl mb-5 sm:mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-amber-400/20 backdrop-blur-md rounded-lg sm:rounded-xl border border-amber-300/30">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-300/20">
              Acoustic Swara Drone
            </span>
            <span className="text-[10px] sm:text-xs text-bamboo-200 bg-black/20 px-2 py-0.5 rounded-full">
              4-String Tanpura
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-wide mb-1.5 sm:mb-2 text-white">
            Free Online Tanpura
          </h1>
          <p className="text-bamboo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Use FluteSangam&apos;s free online tanpura for flute, bansuri and vocal practice. Play a steady drone for sargam, alankars, ragas and daily riyaz.
          </p>
        </div>
      </div>

      {/* Main Interactive Tanpura Instrument Studio */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-amber-200/80 overflow-hidden mb-8">
        
        {/* Top Playback Control Deck (Mobile-Optimized) */}
        <div className="bg-gradient-to-br from-amber-50/90 via-white to-sand-50 p-4 sm:p-6 border-b border-amber-200/70">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6">
            
            {/* Big Play / Stop Button & Status */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              <button
                onClick={togglePlayback}
                aria-label={isPlaying ? 'Stop Tanpura Drone' : 'Play Tanpura Drone'}
                className={`w-16 h-16 sm:w-22 sm:h-22 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 font-display font-bold shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0 relative ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white ring-4 ring-amber-400/50 shadow-amber-600/30' 
                    : 'bg-bamboo-800 hover:bg-bamboo-900 text-amber-300 ring-4 ring-bamboo-200 shadow-bamboo-900/30 hover:scale-102'
                }`}
                id="tanpura-play-stop-btn"
              >
                {isPlaying ? (
                  <>
                    <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-white animate-pulse" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold">Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-amber-300 ml-0.5" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-amber-200">Play</span>
                  </>
                )}
                
                {isPlaying && (
                  <span className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-amber-400/30 animate-ping pointer-events-none -z-10" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                    isPlaying ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {isPlaying ? 'Resonating' : 'Standby'}
                  </span>
                  <span className="text-[11px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    {firstString}–Sa–Sa–Sa
                  </span>
                </div>
                
                <div className="text-lg sm:text-2xl font-display font-black text-bamboo-950 mt-1 truncate">
                  Sa = {rootSa} <span className="text-xs font-sans font-normal text-slate-500">({currentSaFreq} Hz)</span>
                </div>
                
                <div className="text-[11px] text-slate-600 truncate">
                  {octave === 'low' ? 'Male / Bass (Octave 3)' : 'Female / Medium (Octave 4)'}
                </div>
              </div>
            </div>

            {/* Volume Control Card */}
            <div className="bg-white/95 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/80 shadow-3xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-bamboo-900">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center gap-1.5 hover:text-amber-800 transition cursor-pointer"
                >
                  {isMuted || masterVolume === 0 ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
                  <span>{isMuted ? 'Muted' : 'Volume'}</span>
                </button>
                <span className="font-mono text-xs">{isMuted ? '0%' : `${Math.round(masterVolume * 100)}%`}</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => {
                  setMasterVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-2.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                aria-label="Master Volume"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-amber-800 font-semibold underline cursor-pointer"
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="inline-flex items-center gap-1 text-bamboo-800 font-semibold cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  {showAdvancedSettings ? 'Hide Tuning' : 'Fine Tuning'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 4-String Visualizer Deck (Mobile-Optimized) */}
        <div className="bg-gradient-to-b from-bamboo-950 via-bamboo-900 to-amber-950 p-3.5 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              String Pluck Resonance
            </div>
            {activeStringIndex !== null && (
              <span className="text-[10px] sm:text-xs font-mono bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-full animate-pulse">
                {activeStringName} • {activeFrequency} Hz
              </span>
            )}
          </div>

          {/* 4 Strings Visual Box */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-3xl mx-auto">
            {stringLabels.map((str, idx) => {
              const isActive = activeStringIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between min-h-[95px] sm:min-h-[140px] ${
                    isActive 
                      ? 'bg-amber-500/25 border-amber-400 shadow-md shadow-amber-500/20 ring-2 ring-amber-300/40' 
                      : 'bg-black/30 border-white/10'
                  }`}
                >
                  {/* String line */}
                  <div className="w-full flex justify-center py-1 sm:py-2 relative">
                    <div className={`h-8 sm:h-14 rounded-full transition-all duration-150 ${
                      isActive 
                        ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200 animate-pulse w-1 sm:w-2 shadow-glow' 
                        : 'bg-bamboo-400/40 w-0.5 sm:w-1'
                    }`} />
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-8 h-8 rounded-full bg-amber-400/20 animate-ping pointer-events-none" />
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] text-amber-300/80 font-mono block">#{idx + 1}</span>
                    <strong className={`text-xs sm:text-base font-display font-black block ${isActive ? 'text-amber-200' : 'text-white'}`}>
                      {str.label}
                    </strong>
                    <span className="text-[9px] text-bamboo-300 hidden sm:block">{str.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[10px] sm:text-xs text-bamboo-300/90 mt-2.5 font-sans">
            Overlapping circle: <strong>1 ({firstString}) → 2 (Sa&apos;) → 3 (Sa&apos;) → 4 (Kharaj)</strong>
          </p>
        </div>

        {/* Essential Parameter Controls (Mobile-First Layout) */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 bg-white">
          
          {/* 1. Root Tonic (Sa) Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-bamboo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-600" />
                1. Select Root Pitch (Sa)
              </label>
              <span className="text-[10px] text-slate-500">Your Bansuri Key</span>
            </div>

            {/* 12-Keys Grid: 4 columns on mobile for comfortable tap targets */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 sm:gap-2">
              {NOTE_NAMES.map((note) => {
                const isSelected = rootSa === note;
                return (
                  <button
                    key={note}
                    onClick={() => setRootSa(note)}
                    className={`py-2.5 sm:py-3 px-1 rounded-xl font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border active:scale-95 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-sand-50 hover:bg-amber-100/60 text-bamboo-950 border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <span>{note}</span>
                    <span className={`text-[8px] sm:text-[9px] font-mono leading-none ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                      {note === 'E' ? 'E Bass' : note === 'C' ? 'C Med' : note === 'G' ? 'G Base' : 'Scale'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. First String Tuning Mode & Octave */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* First String Selector */}
            <div className="bg-sand-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200 space-y-2">
              <label className="text-xs font-bold text-bamboo-950 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  2. First String Tuning
                </span>
                <span className="text-[9px] text-amber-900 font-bold bg-amber-200/70 px-2 py-0.5 rounded-full">
                  {firstString}–Sa
                </span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'Pa' as FirstStringTuning, title: 'Pa (Pancham)', desc: 'Standard ~85%' },
                  { key: 'Ma' as FirstStringTuning, title: 'Ma (Madhyam)', desc: 'Malkauns / Bageshree' },
                  { key: 'Ni' as FirstStringTuning, title: 'Ni (Nishad)', desc: 'Marwa / Puriya' },
                  { key: 'Sa' as FirstStringTuning, title: 'Sa (Pure Sa)', desc: 'Meditative' },
                ].map((item) => {
                  const isSelected = firstString === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setFirstString(item.key)}
                      className={`p-2 rounded-xl text-left transition-all border cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-bamboo-800 text-white border-bamboo-900 shadow-sm'
                          : 'bg-white hover:bg-amber-100/50 text-bamboo-950 border-amber-200'
                      }`}
                    >
                      <strong className="block text-xs font-display">{item.title}</strong>
                      <span className={`text-[9px] block leading-tight ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Octave Register */}
            <div className="bg-sand-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200 space-y-2">
              <label className="text-xs font-bold text-bamboo-950 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-amber-600" />
                  3. Octave Register
                </span>
                <span className="text-[9px] text-bamboo-900 font-bold bg-bamboo-200/70 px-2 py-0.5 rounded-full">
                  {octave === 'low' ? 'Octave 3' : 'Octave 4'}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setOctave('low')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer active:scale-95 ${
                    octave === 'low'
                      ? 'bg-bamboo-800 text-white border-bamboo-900 shadow-sm'
                      : 'bg-white hover:bg-amber-100/50 text-bamboo-950 border-amber-200'
                  }`}
                >
                  <strong className="block text-xs font-display">Male / Bass (Oct 3)</strong>
                  <span className={`text-[9px] block mt-0.5 ${octave === 'low' ? 'text-amber-200' : 'text-slate-500'}`}>
                    For E Bass, C Medium
                  </span>
                </button>

                <button
                  onClick={() => setOctave('medium')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer active:scale-95 ${
                    octave === 'medium'
                      ? 'bg-bamboo-800 text-white border-bamboo-900 shadow-sm'
                      : 'bg-white hover:bg-amber-100/50 text-bamboo-950 border-amber-200'
                  }`}
                >
                  <strong className="block text-xs font-display">Female / Med (Oct 4)</strong>
                  <span className={`text-[9px] block mt-0.5 ${octave === 'medium' ? 'text-amber-200' : 'text-slate-500'}`}>
                    For G Medium, A Base
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* 3. Tone Timber & Pluck Speed (Mobile Friendly) */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Tone Timber Style */}
            <div className="bg-sand-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200 space-y-2">
              <label className="text-xs font-bold text-bamboo-950 uppercase tracking-wider flex items-center justify-between">
                <span>4. Tanpura Timber (Jawari)</span>
                <span className="text-[9px] text-amber-900 font-bold bg-amber-200/70 px-2 py-0.5 rounded-full">
                  {toneStyle === 'miraj' ? 'Miraj' : toneStyle === 'tanjore' ? 'Tanjore' : 'Meditative'}
                </span>
              </label>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'miraj' as TanpuraToneStyle, title: 'Miraj', desc: 'Rich Buzz' },
                  { key: 'tanjore' as TanpuraToneStyle, title: 'Tanjore', desc: 'Crisp Wood' },
                  { key: 'meditative' as TanpuraToneStyle, title: 'Warm', desc: 'Soft Calm' }
                ].map((item) => {
                  const isSelected = toneStyle === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setToneStyle(item.key)}
                      className={`p-2 rounded-xl text-center transition-all border cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                          : 'bg-white hover:bg-amber-100/50 text-bamboo-950 border-amber-200'
                      }`}
                    >
                      <strong className="block text-xs font-display">{item.title}</strong>
                      <span className={`text-[8px] sm:text-[9px] block ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tempo & Speed with +/- buttons for mobile */}
            <div className="bg-sand-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-bamboo-950">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  5. Pluck Tempo
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200 text-amber-900 text-xs">
                  {tempoBpm} BPM
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustTempo(-4)}
                  className="w-8 h-8 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 text-bamboo-900 flex items-center justify-center font-bold text-sm shrink-0 active:scale-95"
                  aria-label="Decrease Tempo"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                
                <input
                  type="range"
                  min="40"
                  max="80"
                  step="2"
                  value={tempoBpm}
                  onChange={(e) => setTempoBpm(parseInt(e.target.value))}
                  className="flex-1 h-2.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  aria-label="Pluck Cycle Tempo"
                />

                <button
                  onClick={() => adjustTempo(4)}
                  className="w-8 h-8 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 text-bamboo-900 flex items-center justify-center font-bold text-sm shrink-0 active:scale-95"
                  aria-label="Increase Tempo"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Slow (40 BPM)</span>
                <span>Standard (60 BPM)</span>
                <span>Brisk (75 BPM)</span>
              </div>
            </div>

          </div>

          {/* 4. Advanced Fine-Tuning Drawer */}
          <AnimatePresence>
            {showAdvancedSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-amber-50/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-amber-200 space-y-4"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-bamboo-950 uppercase tracking-wider">
                  <Settings2 className="w-3.5 h-3.5 text-amber-700" />
                  Fine-Tuning &amp; Pitch Calibration
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-xs">
                  {/* Jawari Brilliance */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Jawari Buzz Brilliance</span>
                      <span className="font-mono">{Math.round(jawariBrilliance * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={jawariBrilliance}
                      onChange={(e) => setJawariBrilliance(parseFloat(e.target.value))}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                      aria-label="Jawari Brilliance"
                    />
                  </div>

                  {/* Fine Tuning Cents */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Fine Tuning</span>
                      <span className="font-mono">{fineTuneCents > 0 ? `+${fineTuneCents}` : fineTuneCents} ct</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={fineTuneCents}
                      onChange={(e) => setFineTuneCents(parseInt(e.target.value))}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                      aria-label="Fine Tuning Cents"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <button onClick={() => setFineTuneCents(0)} className="underline text-amber-800">Reset 0 ct</button>
                      <span>+/- 50 cents</span>
                    </div>
                  </div>

                  {/* Concert Pitch Reference */}
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-800">Concert Pitch</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[432, 440, 444].map((hz) => (
                        <button
                          key={hz}
                          onClick={() => setConcertPitchHz(hz)}
                          className={`py-1.5 rounded-lg font-mono font-bold text-xs transition border cursor-pointer active:scale-95 ${
                            concertPitchHz === hz 
                              ? 'bg-amber-700 text-white border-amber-800 shadow-xs' 
                              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                          }`}
                        >
                          {hz} Hz
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* 5. Quick Raga Presets Drawer (Mobile-Optimized) */}
        <div className="bg-sand-50/90 p-4 sm:p-6 border-t border-amber-200/80">
          <div className="mb-3">
            <h2 className="text-sm sm:text-base font-display font-bold text-bamboo-950">
              Instant Classical Raga Tanpura Presets
            </h2>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Tap any raga to auto-set Sa, 1st string tuning, and pitch register.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {RAGA_PRESETS.map((preset) => {
              const isMatch = rootSa === preset.recommendedSa && firstString === preset.firstString;
              return (
                <div
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between active:scale-98 ${
                    isMatch
                      ? 'bg-amber-100 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                      : 'bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <strong className="font-display font-bold text-xs sm:text-sm text-bamboo-950">{preset.name}</strong>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        preset.firstString === 'Ma' ? 'bg-purple-100 text-purple-900' : preset.firstString === 'Ni' ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {preset.firstString}–Sa
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-bamboo-800 bg-sand-100 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                      Sa = {preset.recommendedSa}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-1">
                    {preset.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* In-Depth Educational Guide: Science of Shrutis, Daily Sadhana & FAQs */}
      <div className="space-y-6 text-slate-700 leading-relaxed font-sans text-xs sm:text-sm">
        
        {/* Section 1: The Acoustic Science of Shrutis & Tanpura Resonance */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bamboo-950 font-display font-bold text-base sm:text-xl border-b border-bamboo-100 pb-2.5">
            <BookOpen className="w-5 h-5 text-amber-700 shrink-0" />
            <h2>The Acoustic Science of the Tanpura in Indian Classical Music</h2>
          </div>
          
          <p>
            In Indian classical music (Hindustani & Carnatic traditions), the <strong>Tanpura (Tambura)</strong> is not a rhythmic or melodic accompaniment—it is the supreme tonal reference of the universe (<em>Nada Brahma</em>). While western keyboard instruments rely on 12-Tone Equal Temperament (12-TET), Indian music is rooted in <strong>Just Intonation (22 Shrutis)</strong>, where intervals are based on whole integer ratios derived from the natural overtone series.
          </p>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <div className="bg-sand-50/90 p-4 rounded-xl border border-amber-200/80 space-y-2">
              <h3 className="font-display font-bold text-sm text-bamboo-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                The Curved Bridge (*Ghoraj*) &amp; *Jivari* Thread
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The secret to the Tanpura’s mesmerizing sound lies in its wide, gently curved wooden bridge (*Ghoraj*) and a fine cotton or silk thread (*Jivari* or *Jawari*) placed beneath each string. When plucked, the string’s vibration periodically grazes the curved surface, generating a dense cascade of upper harmonic partials (1st fundamental through 16th harmonic).
              </p>
            </div>

            <div className="bg-sand-50/90 p-4 rounded-xl border border-amber-200/80 space-y-2">
              <h3 className="font-display font-bold text-sm text-bamboo-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Natural Overtone Bloom (*Gandhar* &amp; *Pancham Bhava*)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As the two middle strings (*Jodi 1* and *Jodi 2*) ring in unison with microscopic detuning (~0.4 Hz), their acoustic wave collision physically generates the 5th harmonic (pure *Shuddha Gandhar* at a 5:4 frequency ratio) and the 3rd harmonic (pure *Pancham* at a 3:2 ratio), filling the room with an enchanting shimmer without any finger pressing frets.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Structured 40-Minute Daily Bansuri Sadhana Routine */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bamboo-950 font-display font-bold text-base sm:text-xl border-b border-bamboo-100 pb-2.5">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <h2>Structured 40-Minute Daily Bansuri Practice Routine (Riyaz)</h2>
          </div>
          
          <p>
            Practicing flute with a continuous Tanpura drone transforms casual blowing into disciplined Swar Sadhana. Follow this 4-step daily curriculum:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="bg-sand-50 p-4 rounded-xl border border-amber-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber-600 text-white px-2 py-0.5 rounded-full">Phase 1</span>
                  <span className="text-xs font-mono font-bold text-slate-500">10 Mins</span>
                </div>
                <h3 className="font-bold text-sm text-bamboo-950 mt-2">Kharaj Sadhana (Mandra Register)</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Descend below Madhya Sa into Mandra Saptak (.Ni, .Dha, .Pa, .Ma). Focus on warm, relaxed lower lip aperture and deep chest resonance matching the 4th string (Kharaj Sa).
                </p>
              </div>
            </div>

            <div className="bg-sand-50 p-4 rounded-xl border border-amber-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber-600 text-white px-2 py-0.5 rounded-full">Phase 2</span>
                  <span className="text-xs font-mono font-bold text-slate-500">10 Mins</span>
                </div>
                <h3 className="font-bold text-sm text-bamboo-950 mt-2">Long Note Stability (*Swar Shuddhi*)</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Sustain fundamental <strong>Sa</strong> for 15–20 seconds per breath. Listen intently until your flute note dissolves seamlessly into the Jodi strings with zero acoustic beating.
                </p>
              </div>
            </div>

            <div className="bg-sand-50 p-4 rounded-xl border border-amber-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber-600 text-white px-2 py-0.5 rounded-full">Phase 3</span>
                  <span className="text-xs font-mono font-bold text-slate-500">10 Mins</span>
                </div>
                <h3 className="font-bold text-sm text-bamboo-950 mt-2">Alankar Speed &amp; Fingering Drills</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Play ascending and descending sargam sequences (Aaroh/Avaroh) across Mandra, Madhya, and Taar saptaks. Keep finger movement minimal and light on the bamboo tone holes.
                </p>
              </div>
            </div>

            <div className="bg-sand-50 p-4 rounded-xl border border-amber-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber-600 text-white px-2 py-0.5 rounded-full">Phase 4</span>
                  <span className="text-xs font-mono font-bold text-slate-500">10 Mins</span>
                </div>
                <h3 className="font-bold text-sm text-bamboo-950 mt-2">Raga Chalan, Meend &amp; Gamak</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Explore chosen Raga phrases (Pakad and Chalan). Practice smooth glides (*Meend*) by rolling finger cushions across open holes against the Tanpura drone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: First String Tuning Rules & Acoustic Ratios */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bamboo-950 font-display font-bold text-base sm:text-xl border-b border-bamboo-100 pb-2.5">
            <Layers className="w-5 h-5 text-amber-700 shrink-0" />
            <h2>First String Tuning Guide: Pa vs Ma vs Ni vs Pure Sa</h2>
          </div>
          
          <p>
            A classical 4-string Tanpura has three constant strings: <strong>String 2 (Sa&apos;)</strong>, <strong>String 3 (Sa&apos;)</strong>, and <strong>String 4 (Kharaj Sa)</strong>. The <strong>First String</strong> is calibrated based on the melodic grammar of the Raga:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bamboo-50 border-b border-bamboo-200 text-bamboo-950">
                  <th className="p-3 font-bold">1st String Mode</th>
                  <th className="p-3 font-bold">Acoustic Ratio</th>
                  <th className="p-3 font-bold">When to Use</th>
                  <th className="p-3 font-bold">Popular Example Ragas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                <tr className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-bamboo-900">Pa (Pancham)</td>
                  <td className="p-3 font-mono">3:2 (1.5x)</td>
                  <td className="p-3">Standard tuning for any raga containing a prominent or regular Pancham swara.</td>
                  <td className="p-3 font-medium text-amber-900">Yaman, Bhoopali, Bilawal, Bhimpalasi, Desh, Kafi, Bhairav, Todi, Bihag, Jog</td>
                </tr>
                <tr className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-bamboo-900">Ma (Madhyam)</td>
                  <td className="p-3 font-mono">4:3 (1.33x)</td>
                  <td className="p-3">Used when Pancham (Pa) is omitted (varjit) or when Shuddha Madhyam is the dominant Vadi swara.</td>
                  <td className="p-3 font-medium text-amber-900">Malkauns, Bageshree, Chandrakauns, Megh, Shankara</td>
                </tr>
                <tr className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-bamboo-900">Ni (Nishad)</td>
                  <td className="p-3 font-mono">15:8 (1.875x)</td>
                  <td className="p-3">Used when Pa is omitted and Shuddha Nishad is a primary melodic pillar resolving to Komal Re.</td>
                  <td className="p-3 font-medium text-amber-900">Marwa, Puriya, Sohini, Bhatiyar, Lalit</td>
                </tr>
                <tr className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-bamboo-900">Sa (Shadja)</td>
                  <td className="p-3 font-mono">1:1 / 2:1</td>
                  <td className="p-3">Double Kharaj string for deep root meditation or fundamental Swar Sadhana.</td>
                  <td className="p-3 font-medium text-amber-900">Puriya Dhanashree (alternative), Meditative Sadhana</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Bansuri Flute Scale to Tanpura Sa Pairing */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bamboo-950 font-display font-bold text-base sm:text-xl border-b border-bamboo-100 pb-2.5">
            <Compass className="w-5 h-5 text-amber-700 shrink-0" />
            <h2>Bansuri Flute Scale to Tanpura Sa Calibration Guide</h2>
          </div>
          
          <p>
            When playing the Indian bamboo flute (Bansuri), <strong>Sa</strong> is produced when the top 3 finger holes are closed (in classical Hindustani convention). Match this Tanpura tool’s <strong>Root Pitch (Sa)</strong> directly to your flute’s tonic:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
            {BANSURI_FLUTE_KEYS.map((item) => (
              <div 
                key={item.note} 
                onClick={() => setRootSa(item.note)}
                className={`p-3 rounded-xl border transition cursor-pointer active:scale-95 ${
                  rootSa === item.note ? 'bg-amber-100 border-amber-400 shadow-3xs' : 'bg-sand-50 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs sm:text-sm font-bold text-bamboo-950">Sa = {item.note}</strong>
                  {rootSa === item.note && <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-bold">Active</span>}
                </div>
                <div className="text-xs text-amber-900 font-medium mt-0.5">{item.bansuri}</div>
                <div className="text-[10px] text-slate-500 mt-1">{item.type}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Interactive Frequently Asked Questions (FAQ) */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bamboo-950 font-display font-bold text-base sm:text-xl border-b border-bamboo-100 pb-2.5">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <h2>Frequently Asked Questions on Tanpura Practice</h2>
          </div>

          <div className="space-y-3 pt-1">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="border border-amber-200 rounded-xl overflow-hidden bg-sand-50/50"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 font-display font-bold text-xs sm:text-sm text-bamboo-950 hover:bg-amber-50/80 transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-amber-700 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-amber-100 bg-white">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Practice Tools Cross-Links */}
        <section className="bg-gradient-to-br from-amber-500/10 via-bamboo-500/5 to-transparent rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/80 space-y-3">
          <h3 className="text-sm sm:text-base font-display font-bold text-bamboo-950">
            More Free Practice Tools on FluteSangam
          </h3>
          <p className="text-xs text-slate-600">
            Combine the Tanpura drone with our interactive tuner, metronome, fingering chart, and alankar generator for a complete bansuri sadhana studio:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <Link
              to="/tuner"
              onClick={() => onViewChange?.('learn_tuner')}
              className="bg-white p-3.5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <strong className="text-xs font-bold text-bamboo-950 block group-hover:text-amber-800 transition">Online Flute Tuner</strong>
                <span className="text-[11px] text-slate-500">Live microphone frequency &amp; cents detect</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/alankar-generator"
              onClick={() => onViewChange?.('alankar_generator')}
              className="bg-white p-3.5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <strong className="text-xs font-bold text-bamboo-950 block group-hover:text-amber-800 transition">Alankar Generator</strong>
                <span className="text-[11px] text-slate-500">100+ Palta speed exercises</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/tools/flute-note-key-converter"
              onClick={() => onViewChange?.('note_key_converter')}
              className="bg-white p-3.5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <strong className="text-xs font-bold text-bamboo-950 block group-hover:text-amber-800 transition">Note &amp; Key Converter</strong>
                <span className="text-[11px] text-slate-500">Swaras ⇄ Western notes ⇄ Scales</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </section>

      </div>

      {/* Floating Bottom Quick Action Bar for Smartphones (Positioned above Mobile Bottom Nav with comfortable gap) */}
      <div 
        className="md:hidden fixed left-3 right-3 bg-bamboo-950/95 backdrop-blur-md text-white p-2.5 px-4 rounded-2xl shadow-2xl border border-amber-400/40 z-[950] flex items-center justify-between gap-3"
        style={{
          bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={togglePlayback}
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-md transition active:scale-95 shrink-0 ${
              isPlaying ? 'bg-amber-600 text-white ring-2 ring-amber-400/40' : 'bg-amber-400 text-bamboo-950'
            }`}
            aria-label={isPlaying ? 'Stop Drone' : 'Play Drone'}
          >
            {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          
          <div className="min-w-0">
            <div className="text-xs font-display font-black text-amber-300 truncate">
              Tanpura • Sa = {rootSa}
            </div>
            <div className="text-[10px] text-bamboo-200 truncate">
              {isPlaying ? 'Resonating...' : 'Paused'} • {firstString}–Sa
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95"
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TanpuraDroneView;
