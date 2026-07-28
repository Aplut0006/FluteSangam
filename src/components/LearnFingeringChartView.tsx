import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Info, Music, ChevronRight, BookOpen, CheckCircle2, ArrowLeft, Radio, Wind, CircleDot } from 'lucide-react';
import { AppView } from '../types';

interface LearnFingeringChartViewProps {
  onViewChange?: (view: AppView) => void;
}

// Flute Key Base Frequencies (Hz) for Middle Octave Sa (3 top holes covered = Sa in Hindustani convention)
const FLUTE_SCALES = [
  { key: 'C', name: 'C Natural', freq: 261.63, tag: 'Medium' },
  { key: 'C#', name: 'C# / Db', freq: 277.18, tag: 'Medium' },
  { key: 'D', name: 'D Natural', freq: 293.66, tag: 'Medium' },
  { key: 'D#', name: 'D# / Eb', freq: 311.13, tag: 'Medium' },
  { key: 'E', name: 'E Bass', freq: 329.63, tag: 'Popular Bass' },
  { key: 'F', name: 'F Natural', freq: 349.23, tag: 'Medium/Bass' },
  { key: 'F#', name: 'F# / Gb', freq: 369.99, tag: 'Medium' },
  { key: 'G', name: 'G Medium', freq: 392.00, tag: 'Popular Medium' },
  { key: 'G#', name: 'G# / Ab', freq: 415.30, tag: 'Treble' },
  { key: 'A', name: 'A Treble', freq: 440.00, tag: 'Treble' },
  { key: 'A#', name: 'A# / Bb', freq: 466.16, tag: 'Treble' },
  { key: 'B', name: 'B Natural', freq: 493.88, tag: 'Treble' },
];

export interface SwaraDefinition {
  id: string;
  swara: string;         // 'Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'
  variant: 'shuddha' | 'komal' | 'teevra';
  fullName: string;
  westernInterval: string;
  semitonesFromSa: number;
  holes: number[];      // Array of 6 values: 1 = closed (●), 0 = open (○), 0.5 = half closed (◐)
  description: string;
  leftHandGuide: string;
  rightHandGuide: string;
  tip: string;
}

// Hindustani 6-hole Bansuri Swara Fingering Data
const SWARA_LIST: SwaraDefinition[] = [
  {
    id: 'sa',
    swara: 'Sa',
    variant: 'shuddha',
    fullName: 'Shadja (Sa)',
    westernInterval: 'Tonic / Root',
    semitonesFromSa: 0,
    holes: [1, 1, 1, 0, 0, 0], // Top 3 closed, bottom 3 open
    description: 'Cover the top 3 holes completely with your Left Hand. Leave the bottom 3 holes open.',
    leftHandGuide: 'Index, Middle & Ring fingers completely covering top 3 holes.',
    rightHandGuide: 'All 3 bottom holes open. Right pinky rests on flute for stability.',
    tip: 'Sa is the root tonic of Hindustani music. Keep your breath steady and warm.'
  },
  {
    id: 're-shuddha',
    swara: 'Re',
    variant: 'shuddha',
    fullName: 'Shuddha Rishabh (Re)',
    westernInterval: 'Major 2nd',
    semitonesFromSa: 2,
    holes: [1, 1, 0, 0, 0, 0], // Top 2 closed, bottom 4 open
    description: 'Cover the top 2 holes with your Left Hand (Index & Middle). Lift your Left Ring finger.',
    leftHandGuide: 'Index & Middle fingers closed. Ring finger lifted off 3rd hole.',
    rightHandGuide: 'All 3 bottom holes open.',
    tip: 'Lift your ring finger smoothly without disturbing the flute stability.'
  },
  {
    id: 're-komal',
    swara: 're',
    variant: 'komal',
    fullName: 'Komal Rishabh (komal re)',
    westernInterval: 'Minor 2nd',
    semitonesFromSa: 1,
    holes: [1, 1, 0.5, 0, 0, 0], // Top 2 closed, 3rd hole half closed
    description: 'Cover top 2 holes, and cover HALF of the 3rd hole with your Left Ring finger.',
    leftHandGuide: 'Index & Middle closed. Ring finger covers exactly 50% of 3rd hole.',
    rightHandGuide: 'All 3 bottom holes open.',
    tip: 'Komal re requires precise half-hole sliding (Meend) or half-covering technique.'
  },
  {
    id: 'ga-shuddha',
    swara: 'Ga',
    variant: 'shuddha',
    fullName: 'Shuddha Gandhar (Ga)',
    westernInterval: 'Major 3rd',
    semitonesFromSa: 4,
    holes: [1, 0, 0, 0, 0, 0], // Top 1 closed, bottom 5 open
    description: 'Cover only the 1st top hole with your Left Index finger. All other 5 holes open.',
    leftHandGuide: 'Only Index finger closed. Middle and Ring fingers lifted.',
    rightHandGuide: 'All 3 bottom holes open.',
    tip: 'Ensure your left index finger pad rests softly over the top hole without pressing hard.'
  },
  {
    id: 'ga-komal',
    swara: 'ga',
    variant: 'komal',
    fullName: 'Komal Gandhar (komal ga)',
    westernInterval: 'Minor 3rd',
    semitonesFromSa: 3,
    holes: [1, 0.5, 0, 0, 0, 0], // 1st closed, 2nd half closed
    description: 'Cover 1st top hole completely, and cover HALF of the 2nd hole with Left Middle finger.',
    leftHandGuide: 'Index closed. Middle finger covers 50% of 2nd hole.',
    rightHandGuide: 'All 3 bottom holes open.',
    tip: 'Commonly used in Raaga Kafi, Bhimpalasi, and Darbari.'
  },
  {
    id: 'ma-shuddha',
    swara: 'Ma',
    variant: 'shuddha',
    fullName: 'Shuddha Madhyam (Ma)',
    westernInterval: 'Perfect 4th',
    semitonesFromSa: 5,
    holes: [0.5, 0, 0, 0, 0, 0], // 1st hole half closed, rest open
    description: 'Cover HALF of the 1st top hole with your Left Index finger. All other holes open.',
    leftHandGuide: 'Index finger covers 50% of the 1st hole.',
    rightHandGuide: 'All 3 bottom holes open.',
    tip: 'Shuddha Ma is a very peaceful, central note. Practice finding the exact half-cover spot.'
  },
  {
    id: 'ma-teevra',
    swara: "Ma'",
    variant: 'teevra',
    fullName: "Teevra Madhyam (Ma')",
    westernInterval: 'Augmented 4th / Tritone',
    semitonesFromSa: 6,
    holes: [0, 0, 0, 0, 0, 0], // All 6 holes OPEN
    description: 'Leave ALL 6 finger holes completely OPEN.',
    leftHandGuide: 'All left hand fingers lifted slightly above holes.',
    rightHandGuide: 'All right hand fingers lifted. Balance flute between chin and thumbs.',
    tip: 'Teevra Ma is the signature bright note of Raaga Yaman and Puriya Dhanashree.'
  },
  {
    id: 'pa',
    swara: 'Pa',
    variant: 'shuddha',
    fullName: 'Pancham (Pa)',
    westernInterval: 'Perfect 5th',
    semitonesFromSa: 7, // 7 semitones above Sa in Madhya Saptak
    holes: [1, 1, 1, 1, 1, 1], // All 6 holes CLOSED
    description: 'Cover ALL 6 finger holes completely with both Left and Right hands. Blow with steady air pressure.',
    leftHandGuide: 'All 3 top holes completely closed.',
    rightHandGuide: 'All 3 bottom holes completely closed.',
    tip: 'Requires zero air leakage across all 6 holes. Keep finger pads flat and relaxed.'
  },
  {
    id: 'dha-shuddha',
    swara: 'Dha',
    variant: 'shuddha',
    fullName: 'Shuddha Dhaivat (Dha)',
    westernInterval: 'Major 6th',
    semitonesFromSa: 9, // 9 semitones above Sa in Madhya Saptak
    holes: [1, 1, 1, 1, 1, 0], // 5 holes closed, 6th open
    description: 'Cover top 5 holes completely. Leave the 6th (bottom-most) hole open.',
    leftHandGuide: 'All 3 top holes completely closed.',
    rightHandGuide: 'Index and Middle closed. Ring finger lifted off 6th hole.',
    tip: 'Keep your right ring finger relaxed and close to the flute body.'
  },
  {
    id: 'dha-komal',
    swara: 'dha',
    variant: 'komal',
    fullName: 'Komal Dhaivat (komal dha)',
    westernInterval: 'Minor 6th',
    semitonesFromSa: 8, // 8 semitones above Sa
    holes: [1, 1, 1, 1, 1, 0.5], // 5 closed, 6th half closed
    description: 'Cover top 5 holes, and cover HALF of the 6th hole with Right Ring finger.',
    leftHandGuide: 'All 3 top holes closed.',
    rightHandGuide: 'Index & Middle closed. Ring finger covers 50% of 6th hole.',
    tip: 'Used in Raaga Bhairav and Todi.'
  },
  {
    id: 'ni-shuddha',
    swara: 'Ni',
    variant: 'shuddha',
    fullName: 'Shuddha Nishad (Ni)',
    westernInterval: 'Major 7th',
    semitonesFromSa: 11, // 11 semitones above Sa
    holes: [1, 1, 1, 1, 0, 0], // 4 holes closed, bottom 2 open
    description: 'Cover top 4 holes (3 top + 1st bottom hole). Leave bottom 2 holes open.',
    leftHandGuide: 'All 3 top holes completely closed.',
    rightHandGuide: 'Index finger closed on 4th hole. Middle & Ring fingers open.',
    tip: 'Ni leads smoothly back up to Sa.'
  },
  {
    id: 'ni-komal',
    swara: 'ni',
    variant: 'komal',
    fullName: 'Komal Nishad (komal ni)',
    westernInterval: 'Minor 7th',
    semitonesFromSa: 10, // 10 semitones above Sa
    holes: [1, 1, 1, 1, 0.5, 0], // 4 closed, 5th half closed
    description: 'Cover top 4 holes, and cover HALF of the 5th hole with Right Middle finger.',
    leftHandGuide: 'All 3 top holes closed.',
    rightHandGuide: 'Index closed. Middle covers 50% of 5th hole. Ring open.',
    tip: 'Komal Ni is prominent in Raaga Kafi and Khamaj.'
  }
];

// Helper to synthesize authentic acoustic Indian bamboo bansuri flute voice
function playFluteTone(freq: number, durationSec: number = 2.0) {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Master Output Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);

    // Warm Room Acoustic Reverb (Delay + Lowpass feedback for organic bamboo resonance)
    const roomDelay = ctx.createDelay();
    roomDelay.delayTime.setValueAtTime(0.08, now); // 80ms room reflection
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(1200, now); // Warm room absorption
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.20, now);
    
    roomDelay.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(roomDelay);

    masterGain.connect(ctx.destination);
    masterGain.connect(roomDelay);
    roomDelay.connect(ctx.destination);

    // 1. ACOUSTIC BANSURI HARMONIC TIMBRE (Pure Fundamental + Warm Bamboo Overtones)
    const harmonics = [
      { ratio: 1.0, gain: 0.72, type: 'sine' },       // Dominant pure fundamental
      { ratio: 2.0, gain: 0.18, type: 'sine' },       // 2nd Harmonic (octave warm bamboo body)
      { ratio: 3.0, gain: 0.05, type: 'triangle' },   // 3rd Harmonic (hollow pipe warmth)
      { ratio: 4.0, gain: 0.02, type: 'sine' },       // Subtle brilliance
    ];

    // Micro-Meend Attack: Start ~12 cents lower and smoothly glide to pitch over 60ms
    const startFreq = freq * Math.pow(2, -12 / 1200);

    const mainGainNode = ctx.createGain();
    
    // Natural human breath envelope (soft attack -> steady sustain -> gentle decay)
    mainGainNode.gain.setValueAtTime(0, now);
    mainGainNode.gain.linearRampToValueAtTime(0.70, now + 0.10); // Smooth breath onset
    mainGainNode.gain.setValueAtTime(0.70, now + durationSec - 0.35);
    mainGainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    // Expressive Vibrato & Breath Tremolo (starts after 0.20s at 5.2Hz)
    const vibratoLfo = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibratoLfo.frequency.setValueAtTime(5.2, now); // 5.2 Hz natural bansuri vibrato
    vibratoGain.gain.setValueAtTime(0, now);
    vibratoGain.gain.setValueAtTime(0, now + 0.20);
    vibratoGain.gain.linearRampToValueAtTime(freq * 0.010, now + 0.5); // 1.0% pitch modulation depth
    vibratoLfo.start(now);
    vibratoLfo.stop(now + durationSec);

    // Subtle breath volume tremolo synced with vibrato
    const tremoloGain = ctx.createGain();
    const tremoloLfo = ctx.createOscillator();
    tremoloLfo.frequency.setValueAtTime(5.2, now);
    const tremoloDepth = ctx.createGain();
    tremoloDepth.gain.setValueAtTime(0, now);
    tremoloDepth.gain.setValueAtTime(0, now + 0.20);
    tremoloDepth.gain.linearRampToValueAtTime(0.04, now + 0.5);
    tremoloLfo.connect(tremoloDepth);
    tremoloDepth.connect(mainGainNode.gain);
    tremoloLfo.start(now);
    tremoloLfo.stop(now + durationSec);

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      osc.type = h.type as OscillatorType;
      
      const targetFreq = freq * h.ratio;
      const initialFreq = startFreq * h.ratio;
      
      osc.frequency.setValueAtTime(initialFreq, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.06); // Micro-meend glide

      vibratoLfo.connect(osc.frequency);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(h.gain, now);

      osc.connect(hGain);
      hGain.connect(mainGainNode);

      osc.start(now);
      osc.stop(now + durationSec);
    });

    // 2. REAL BREEZY CHIFF & AIR FLOW NOISE
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Filter breath noise through narrow bandpass focused near embouchure resonance
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(freq * 2.2, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    // Chiff attack (soft puff at 0-0.08s) + faint steady air stream
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.015, now + 0.10);
    noiseGain.gain.linearRampToValueAtTime(0.010, now + durationSec - 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(mainGainNode);

    noiseSource.start(now);
    noiseSource.stop(now + durationSec);

    // 3. BAMBOO TUBE BODY ACOUSTIC RESONANCE FILTER
    const bodyResonance = ctx.createBiquadFilter();
    bodyResonance.type = 'lowpass';
    bodyResonance.frequency.setValueAtTime(freq * 3.2, now);
    bodyResonance.Q.setValueAtTime(1.5, now);

    mainGainNode.connect(bodyResonance);
    bodyResonance.connect(masterGain);

  } catch (e) {
    console.error("Flute sound synthesis error:", e);
  }
}

export default function LearnFingeringChartView({ onViewChange }: LearnFingeringChartViewProps) {
  const [selectedScale, setSelectedScale] = useState<string>('E');
  const [selectedSwaraId, setSelectedSwaraId] = useState<string>('sa');
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const [autoPlayOnSelect, setAutoPlayOnSelect] = useState<boolean>(true);

  // Find active scale object
  const currentScale = FLUTE_SCALES.find(s => s.key === selectedScale) || FLUTE_SCALES[4]; // Default E
  
  // Find active swara object
  const currentSwara = SWARA_LIST.find(s => s.id === selectedSwaraId) || SWARA_LIST[0];

  // Calculate exact frequency for current note on selected flute key
  const calculatedFrequency = currentScale.freq * Math.pow(2, currentSwara.semitonesFromSa / 12);

  // Trigger sound when swara or scale changes (if autoPlay is enabled)
  useEffect(() => {
    if (autoPlayOnSelect) {
      handlePlaySound();
    }
  }, [selectedSwaraId, selectedScale]);

  const handlePlaySound = () => {
    setIsPlayingSound(true);
    playFluteTone(calculatedFrequency, 1.6);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 1600);
  };

  // Main 7 primary Swaras for quick tabs (Sa, Re, Ga, Ma, Pa, Dha, Ni)
  const primarySwaras = [
    { label: 'Sa', id: 'sa', isShuddha: true },
    { label: 'Re', id: 're-shuddha', isShuddha: true },
    { label: 'Ga', id: 'ga-shuddha', isShuddha: true },
    { label: 'Ma', id: 'ma-shuddha', isShuddha: true },
    { label: 'Pa', id: 'pa', isShuddha: true },
    { label: 'Dha', id: 'dha-shuddha', isShuddha: true },
    { label: 'Ni', id: 'ni-shuddha', isShuddha: true },
  ];

  const komalTeevraSwaras = [
    { label: 're (Komal)', id: 're-komal' },
    { label: 'ga (Komal)', id: 'ga-komal' },
    { label: "Ma' (Teevra)", id: 'ma-teevra' },
    { label: 'dha (Komal)', id: 'dha-komal' },
    { label: 'ni (Komal)', id: 'ni-komal' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" itemScope itemType="https://schema.org/LearningResource">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs border border-bamboo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => onViewChange?.('learn_basics')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bamboo-700 hover:text-bamboo-900 bg-bamboo-50 hover:bg-bamboo-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-bamboo-200/50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to The Basics</span>
            </button>

            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              <CircleDot className="w-3.5 h-3.5 text-amber-700" />
              Interactive Chart
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold font-display text-bamboo-950 tracking-tight" itemProp="headline">
              Interactive Bansuri Fingering Chart
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium max-w-2xl leading-relaxed">
              Choose your Flute Scale and tap any note (Sa, Re, Ga, Ma, Pa, Dha, Ni) to see the exact Hindustani finger hole closures and listen to the real bamboo sound tone.
            </p>
          </div>
        </div>
      </div>

      {/* 1. STEP 1: Select Flute Scale */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-bamboo-100 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-100 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-bamboo-900">1. Select Your Flute Scale (Key)</h2>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 self-start sm:self-auto">
            Selected Scale: <strong>{currentScale.name}</strong> ({currentScale.freq.toFixed(1)} Hz Sa)
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2">
          {FLUTE_SCALES.map((sc) => {
            const isSelected = selectedScale === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => setSelectedScale(sc.key)}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center transition flex flex-col items-center justify-center cursor-pointer border ${
                  isSelected
                    ? 'bg-bamboo-800 text-white border-bamboo-900 shadow-xs ring-2 ring-amber-400'
                    : 'bg-bamboo-50/50 hover:bg-amber-50 text-gray-800 border-bamboo-100/80 hover:border-amber-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-extrabold">{sc.key}</span>
                <span className={`text-[9px] sm:text-[10px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                  {sc.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. STEP 2: Select Swara Note */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-bamboo-100 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-100 pb-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-bamboo-900">2. Choose Note (Swara)</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 font-medium select-none text-[11px] sm:text-xs">
              <input
                type="checkbox"
                checked={autoPlayOnSelect}
                onChange={(e) => setAutoPlayOnSelect(e.target.checked)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-amber-600 rounded cursor-pointer"
              />
              <span>Auto-play sound on tap</span>
            </label>
          </div>
        </div>

        {/* Primary 7 Shuddha Swaras */}
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Primary Shuddha Swaras (Pure Notes)
          </span>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {primarySwaras.map((s) => {
              const isSelected = selectedSwaraId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSwaraId(s.id)}
                  className={`py-2.5 px-0.5 sm:px-3 rounded-xl sm:rounded-2xl text-center transition flex flex-col items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-white font-extrabold border-amber-600 shadow-md ring-2 ring-amber-300 scale-102 sm:scale-105'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 font-bold border-emerald-200/80'
                  }`}
                >
                  <span className="text-sm sm:text-xl font-display font-bold leading-tight">{s.label}</span>
                  <span className={`text-[8px] sm:text-[9px] uppercase tracking-tighter mt-0.5 hidden xs:inline ${isSelected ? 'text-amber-100' : 'text-emerald-700'}`}>
                    Shuddha
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Komal & Teevra Swaras */}
        <div className="pt-1">
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Komal &amp; Teevra Swaras (Flat &amp; Sharp Notes)
          </span>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
            {komalTeevraSwaras.map((s) => {
              const isSelected = selectedSwaraId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSwaraId(s.id)}
                  className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer border text-center ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-gray-50 hover:bg-amber-50 text-gray-700 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. VISUAL BANSURI FLUTE & FINGERING DISPLAY */}
      <div className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-stone-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-xl space-y-4 sm:space-y-6 border border-amber-800/40 relative overflow-hidden">
        {/* Subtle bamboo grain background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.1),transparent)] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-800/50 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-3xl font-display font-bold text-amber-300">
                {currentSwara.fullName}
              </h3>
              <span className="text-[10px] sm:text-xs bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2.5 py-0.5 rounded-md font-semibold">
                {currentSwara.westernInterval}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1 font-medium">
              Flute Key: <strong className="text-white">{currentScale.name}</strong> • Pitch: <strong className="text-amber-300">{calculatedFrequency.toFixed(1)} Hz</strong>
            </p>
          </div>

          {/* PLAY / REPEAT SOUND BUTTON */}
          <button
            onClick={handlePlaySound}
            disabled={isPlayingSound}
            className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 ${
              isPlayingSound
                ? 'bg-amber-400 text-bamboo-950 scale-98 ring-4 ring-amber-300/50'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-bamboo-950 hover:shadow-amber-500/20'
            }`}
          >
            <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isPlayingSound ? 'animate-bounce' : ''}`} />
            <span>{isPlayingSound ? 'Playing Note...' : 'Play Flute Tone 🔊'}</span>
          </button>
        </div>

        {/* VISUAL BANSURI FLUTE GRAPHIC */}
        <div className="relative z-10 py-4 sm:py-6 bg-stone-950/90 backdrop-blur-md rounded-2xl p-3 sm:p-6 border border-amber-500/30 shadow-2xl overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-300 font-bold bg-amber-950/90 px-2.5 py-1 rounded-full border border-amber-700/60 shadow-xs">
              Handcrafted Bamboo Bansuri (6-Hole Hindustani)
            </span>
            <span className="text-[10px] text-amber-400/80 font-medium sm:hidden">
              Swipe left/right to view full flute →
            </span>
          </div>

          {/* REALISTIC SVG BANSURI FLUTE CONTAINER */}
          <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-700">
            <svg viewBox="0 0 850 160" className="w-full h-auto min-w-[580px] sm:min-w-0 drop-shadow-2xl select-none">
              <defs>
                {/* Bamboo Tube Cylinder Radial/Linear Gradients */}
                <linearGradient id="bambooBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="12%" stopColor="#f59e0b" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="85%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>

                <linearGradient id="bambooNode" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>

                {/* Silk Thread Binding (Crimson/Saffron Red) */}
                <linearGradient id="threadBinding" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="30%" stopColor="#ef4444" />
                  <stop offset="70%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>

                {/* Gold Thread Accent */}
                <linearGradient id="goldThread" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="50%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>

                {/* Burned Wood Tone Hole Inside */}
                <radialGradient id="burnedHole" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#09090b" />
                  <stop offset="70%" stopColor="#18181b" />
                  <stop offset="88%" stopColor="#451a03" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>

                {/* Finger Pad Skin Gradient */}
                <radialGradient id="fingerPad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fed7aa" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#c2410c" />
                </radialGradient>

                {/* Specular Highlight Filter */}
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* FLUTE MAIN BAMBOO CYLINDER */}
              <g filter="url(#shadow)">
                {/* Main Bamboo Body Tube */}
                <rect x="40" y="55" width="770" height="50" rx="25" ry="25" fill="url(#bambooBody)" stroke="#92400e" strokeWidth="2" />

                {/* Bamboo Longitudinal Natural Wood Grain Lines */}
                <line x1="40" y1="62" x2="810" y2="62" stroke="#fef3c7" strokeWidth="1.2" opacity="0.35" />
                <line x1="40" y1="68" x2="810" y2="68" stroke="#78350f" strokeWidth="1" opacity="0.25" />
                <line x1="40" y1="92" x2="810" y2="92" stroke="#451a03" strokeWidth="1.5" opacity="0.3" />
                <line x1="40" y1="98" x2="810" y2="98" stroke="#78350f" strokeWidth="1" opacity="0.25" />

                {/* Bamboo Cork Stopper (Left End Plug / Gatta) */}
                <rect x="35" y="53" width="16" height="54" rx="6" fill="#451a03" stroke="#27272a" strokeWidth="1.5" />
                <rect x="38" y="56" width="4" height="48" rx="2" fill="#78350f" opacity="0.6" />

                {/* NATURAL BAMBOO NODES (Joint Rings / Nadi) */}
                <rect x="90" y="52" width="10" height="56" rx="4" fill="url(#bambooNode)" stroke="#451a03" strokeWidth="1" />
                <rect x="380" y="52" width="10" height="56" rx="4" fill="url(#bambooNode)" stroke="#451a03" strokeWidth="1" />
                <rect x="760" y="52" width="10" height="56" rx="4" fill="url(#bambooNode)" stroke="#451a03" strokeWidth="1" />

                {/* TRADITIONAL SILK THREAD BINDINGS (Resham Dhaga) */}
                <rect x="60" y="54" width="18" height="52" fill="url(#threadBinding)" />
                <rect x="66" y="54" width="6" height="52" fill="url(#goldThread)" />

                <rect x="180" y="54" width="14" height="52" fill="url(#threadBinding)" />
                <rect x="184" y="54" width="4" height="52" fill="url(#goldThread)" />

                <rect x="420" y="54" width="14" height="52" fill="url(#threadBinding)" />
                <rect x="424" y="54" width="4" height="52" fill="url(#goldThread)" />

                <rect x="730" y="54" width="18" height="52" fill="url(#threadBinding)" />
                <rect x="736" y="54" width="6" height="52" fill="url(#goldThread)" />

                {/* EMBOUCHURE BLOW HOLE (Mukha Randhra) */}
                <g>
                  <ellipse cx="135" cy="80" rx="14" ry="12" fill="none" stroke="#451a03" strokeWidth="3" />
                  <ellipse cx="135" cy="80" rx="12" ry="10" fill="url(#burnedHole)" />
                  <path d="M 121 80 A 14 12 0 0 0 149 80" fill="none" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
                  {isPlayingSound && (
                    <circle cx="135" cy="80" r="16" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8">
                      <animate attributeName="r" values="10;22;10" dur="0.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0;0.9" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text x="135" y="125" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">Blow Hole</text>
                </g>

                {/* 6 FINGER TONE HOLES & FINGER PADS */}
                {currentSwara.holes.map((holeState, idx) => {
                  const holeX = idx < 3 ? 240 + idx * 60 : 480 + (idx - 3) * 70;
                  const holeNum = idx + 1;
                  const fingerName = idx === 0 ? 'L-Index' : idx === 1 ? 'L-Middle' : idx === 2 ? 'L-Ring' : idx === 3 ? 'R-Index' : idx === 4 ? 'R-Middle' : 'R-Ring';

                  return (
                    <g key={idx}>
                      <text x={holeX} y="25" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold">
                        {fingerName}
                      </text>
                      <text x={holeX} y="38" textAnchor="middle" fill="#fbbf24" fontSize="9" opacity="0.8">
                        #{holeNum}
                      </text>

                      <circle cx={holeX} cy="80" r="14" fill="#451a03" />
                      <circle cx={holeX} cy="80" r="11" fill="url(#burnedHole)" stroke="#27272a" strokeWidth="1" />

                      {/* HOLE STATE OVERLAYS */}
                      {holeState === 1 && (
                        <g>
                          <circle cx={holeX} cy="80" r="13" fill="url(#fingerPad)" stroke="#fde047" strokeWidth="2.5" />
                          <circle cx={holeX} cy="80" r="6" fill="#fef3c7" opacity="0.4" />
                          <text x={holeX} y="84" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
                            ✓
                          </text>
                        </g>
                      )}

                      {holeState === 0.5 && (
                        <g>
                          <path d={`M ${holeX} ${80 - 13} A 13 13 0 0 1 ${holeX} ${80 + 13} Z`} fill="url(#fingerPad)" stroke="#fde047" strokeWidth="2" />
                          <text x={holeX - 2} y="84" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
                            ½
                          </text>
                        </g>
                      )}

                      {holeState === 0 && (
                        <g>
                          <circle cx={holeX} cy="80" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />
                          <text x={holeX} y="83" textAnchor="middle" fill="#fbbf24" fontSize="9" opacity="0.6">
                            ○
                          </text>
                        </g>
                      )}

                      <rect 
                        x={holeX - 22} 
                        y="112" 
                        width="44" 
                        height="18" 
                        rx="5" 
                        fill={holeState === 1 ? "#065f46" : holeState === 0.5 ? "#92400e" : "#18181b"} 
                        stroke={holeState === 1 ? "#34d399" : holeState === 0.5 ? "#f59e0b" : "#52525b"}
                        strokeWidth="1"
                      />
                      <text x={holeX} y="124" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                        {holeState === 1 ? "CLOSED" : holeState === 0.5 ? "HALF" : "OPEN"}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* SMARTPHONE 6-HOLE QUICK SUMMARY GRID */}
          <div className="mt-4 pt-3 border-t border-amber-900/50">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2 text-center sm:text-left">
              Finger Position Breakdown ({currentSwara.swara})
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {currentSwara.holes.map((state, idx) => {
                const holeNum = idx + 1;
                const fingerLabel = idx === 0 ? 'L-Index' : idx === 1 ? 'L-Middle' : idx === 2 ? 'L-Ring' : idx === 3 ? 'R-Index' : idx === 4 ? 'R-Middle' : 'R-Ring';
                const handName = idx < 3 ? 'Left' : 'Right';

                return (
                  <div 
                    key={idx}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
                      state === 1
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                        : state === 0.5
                        ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                        : 'bg-stone-900/80 border-stone-700/60 text-stone-300'
                    }`}
                  >
                    <span className="text-[9px] text-amber-400/80 font-bold uppercase">{handName} #{holeNum}</span>
                    <span className="text-[11px] font-extrabold my-0.5">{fingerLabel}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${
                      state === 1 
                        ? 'bg-emerald-800/80 text-emerald-100' 
                        : state === 0.5 
                        ? 'bg-amber-800/80 text-amber-100' 
                        : 'bg-stone-800 text-stone-400'
                    }`}>
                      {state === 1 ? '● Closed' : state === 0.5 ? '◐ Half' : '○ Open'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hands Legend Guides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-3 text-xs">
            <div className="bg-amber-950/70 border border-amber-700/50 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                L
              </div>
              <div>
                <span className="font-bold text-amber-300 block text-xs">Left Hand (Top 3 Holes)</span>
                <span className="text-[11px] text-amber-100/80 leading-snug block mt-0.5">{currentSwara.leftHandGuide}</span>
              </div>
            </div>

            <div className="bg-amber-950/70 border border-amber-700/50 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                R
              </div>
              <div>
                <span className="font-bold text-amber-300 block text-xs">Right Hand (Bottom 3 Holes)</span>
                <span className="text-[11px] text-amber-100/80 leading-snug block mt-0.5">{currentSwara.rightHandGuide}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Note Explanation & Pro Tip */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 relative z-10 pt-1">
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              Fingering Description
            </h4>
            <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
              {currentSwara.description}
            </p>
          </div>

          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-amber-400" />
              Guru's Riyaz Tip
            </h4>
            <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
              {currentSwara.tip}
            </p>
          </div>
        </div>

      </div>

      {/* 4. QUICK REFERENCE SUMMARY TABLE */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-bamboo-100 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-bamboo-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-bamboo-700" />
            <h3 className="text-base sm:text-lg font-bold text-bamboo-900">Shuddha Swara Quick Reference Summary</h3>
          </div>
          <span className="text-[11px] sm:text-xs text-gray-500 font-medium">6-Hole Hindustani Convention</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-bamboo-100">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="bg-bamboo-50 text-bamboo-950 font-bold border-b border-bamboo-100">
                <th className="p-2.5 sm:p-3">Swara</th>
                <th className="p-2.5 sm:p-3">Full Name</th>
                <th className="p-2.5 sm:p-3">Interval</th>
                <th className="p-2.5 sm:p-3">Holes (Top to Bottom)</th>
                <th className="p-2.5 sm:p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {primarySwaras.map((p) => {
                const sData = SWARA_LIST.find(s => s.id === p.id);
                if (!sData) return null;
                const isCurrent = selectedSwaraId === p.id;

                return (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-amber-50/50 transition cursor-pointer ${isCurrent ? 'bg-amber-100/60 font-semibold' : ''}`}
                    onClick={() => setSelectedSwaraId(p.id)}
                  >
                    <td className="p-2.5 sm:p-3 font-extrabold text-bamboo-900 text-xs sm:text-sm">{sData.swara}</td>
                    <td className="p-2.5 sm:p-3 font-medium text-xs">{sData.fullName}</td>
                    <td className="p-2.5 sm:p-3 text-gray-500 text-[11px]">{sData.westernInterval}</td>
                    <td className="p-2.5 sm:p-3 font-mono text-xs">
                      {sData.holes.map((h, i) => (
                        <span key={i} className={`mr-1 ${h === 1 ? 'text-amber-800 font-bold' : h === 0.5 ? 'text-amber-600 font-bold' : 'text-gray-300'}`}>
                          {h === 1 ? '●' : h === 0.5 ? '◐' : '○'}
                        </span>
                      ))}
                    </td>
                    <td className="p-2.5 sm:p-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSwaraId(p.id);
                          handlePlaySound();
                        }}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] transition cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Play</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-bamboo-100">
        <button
          onClick={() => onViewChange?.('learn_basics')}
          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-bamboo-50 border border-bamboo-200 text-bamboo-900 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: The Basics of Blowing</span>
        </button>

        <button
          onClick={() => onViewChange?.('learn_alankaras')}
          className="w-full sm:w-auto px-6 py-2.5 bg-bamboo-800 hover:bg-bamboo-900 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          <span>Next: Practice Alankaras</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
