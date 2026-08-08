import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  CheckCircle2, 
  Radio, 
  Sliders,
  Wind,
  HelpCircle,
  Activity
} from 'lucide-react';
import { AppView } from '../types';

interface LearnTunerViewProps {
  onViewChange?: (view: AppView) => void;
}

// Bansuri Flute Scales Data
interface FluteScaleInfo {
  name: string;
  key: string; // Western Note
  freq: number; // Fundamental Frequency in Hz
  octave: number;
  type: 'Bass' | 'Medium' | 'High';
  swara: string;
  description: string;
}

const BANSURI_SCALES: FluteScaleInfo[] = [
  { name: 'E Bass', key: 'E', freq: 164.81, octave: 3, type: 'Bass', swara: 'Sa', description: 'Deep resonant tone, popular for Hindustani classical solos' },
  { name: 'F Bass', key: 'F', freq: 174.61, octave: 3, type: 'Bass', swara: 'Sa', description: 'Rich low pitch, widely used by professional artists' },
  { name: 'F# Bass', key: 'F#', freq: 185.00, octave: 3, type: 'Bass', swara: 'Sa', description: 'Deep warm sound, comfortable finger spacing' },
  { name: 'G Bass', key: 'G', freq: 196.00, octave: 3, type: 'Bass', swara: 'Sa', description: 'Verstile bass scale, great for classical and meditative music' },
  { name: 'A Medium', key: 'A', freq: 220.00, octave: 3, type: 'Medium', swara: 'Sa', description: 'Standard 440Hz reference scale, highly recommended for beginners' },
  { name: 'B Medium', key: 'B', freq: 246.94, octave: 3, type: 'Medium', swara: 'Sa', description: 'Balanced medium scale with effortless finger reach' },
  { name: 'C Natural', key: 'C', freq: 261.63, octave: 4, type: 'Medium', swara: 'Sa', description: 'Universal middle scale, perfect for kids, beginners & vocal accompaniment' },
  { name: 'C# Medium', key: 'C#', freq: 277.18, octave: 4, type: 'Medium', swara: 'Sa', description: 'Warm medium pitch, popular in light classical & film music' },
  { name: 'D Medium', key: 'D', freq: 293.66, octave: 4, type: 'Medium', swara: 'Sa', description: 'Bright crisp sound, easy for fast passages and alankaras' },
  { name: 'E Medium', key: 'E', freq: 329.63, octave: 4, type: 'Medium', swara: 'Sa', description: 'Clear high-medium pitch, great for folk and devotional tunes' },
  { name: 'G Medium', key: 'G', freq: 392.00, octave: 4, type: 'Medium', swara: 'Sa', description: 'High medium scale, crisp blowing response' },
];

// Indian Swara Notes relative to Sa
const INDIAN_SWARAS = [
  { name: 'Sa', westernOffset: 0, fullName: 'Shaddja' },
  { name: 're', westernOffset: 1, fullName: 'Komal Rishabh' },
  { name: 'Re', westernOffset: 2, fullName: 'Shuddha Rishabh' },
  { name: 'ga', westernOffset: 3, fullName: 'Komal Gandhar' },
  { name: 'Ga', westernOffset: 4, fullName: 'Shuddha Gandhar' },
  { name: 'Ma', westernOffset: 5, fullName: 'Shuddha Madhyam' },
  { name: 'MA', westernOffset: 6, fullName: 'Teevra Madhyam' },
  { name: 'Pa', westernOffset: 7, fullName: 'Pancham' },
  { name: 'dha', westernOffset: 8, fullName: 'Komal Dhaivat' },
  { name: 'Dha', westernOffset: 9, fullName: 'Shuddha Dhaivat' },
  { name: 'ni', westernOffset: 10, fullName: 'Komal Nishad' },
  { name: 'Ni', westernOffset: 11, fullName: 'Shuddha Nishad' },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function LearnTunerView({ onViewChange }: LearnTunerViewProps) {
  // Audio State
  const [isListening, setIsListening] = useState(false);
  const [audioPermissionError, setAudioPermissionError] = useState<string | null>(null);
  
  // Pitch Detection State
  const [frequency, setFrequency] = useState<number | null>(null);
  const [noteName, setNoteName] = useState<string>('--');
  const [octave, setOctave] = useState<number | null>(null);
  const [cents, setCents] = useState<number>(0);
  const [smoothedCents, setSmoothedCents] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [detectedSwara, setDetectedSwara] = useState<string>('--');

  // Selected Flute Target
  const [selectedScaleKey, setSelectedScaleKey] = useState<string>('A'); // Default A440
  const [selectedOctave, setSelectedOctave] = useState<number>(4);
  const [isAutoDetect, setIsAutoDetect] = useState<boolean>(true);

  // Audio Reference Tone Generator
  const [isPlayingReference, setIsPlayingReference] = useState<boolean>(false);
  const [referenceFreq, setReferenceFreq] = useState<number>(440); // Standard A = 440 Hz
  
  // Audio API & Dynamic State Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const refOscillatorRef = useRef<OscillatorNode | null>(null);
  const refGainRef = useRef<GainNode | null>(null);

  const isListeningRef = useRef<boolean>(false);
  const selectedScaleKeyRef = useRef<string>(selectedScaleKey);

  useEffect(() => {
    selectedScaleKeyRef.current = selectedScaleKey;
  }, [selectedScaleKey]);

  // Pitch calculation helper
  const getNoteFromFreq = useCallback((freq: number) => {
    // A4 = 440 Hz standard
    const semitonesFromA4 = Math.round(12 * Math.log2(freq / 440));
    const noteIndex = (semitonesFromA4 + 57) % 12; // 0 = C
    const name = NOTE_NAMES[noteIndex];
    const oct = Math.floor((semitonesFromA4 + 57) / 12);
    const exactNoteFreq = 440 * Math.pow(2, semitonesFromA4 / 12);
    const centsOffset = Math.round(1200 * Math.log2(freq / exactNoteFreq));

    return { name, octave: oct, cents: centsOffset, exactFreq: exactNoteFreq, semitonesFromA4 };
  }, []);

  // Determine Swara based on selected or detected scale
  const getSwaraForNote = useCallback((currentNoteName: string, baseKey: string) => {
    const noteIdx = NOTE_NAMES.indexOf(currentNoteName);
    const baseIdx = NOTE_NAMES.indexOf(baseKey);
    if (noteIdx === -1 || baseIdx === -1) return '--';
    const semitoneDiff = (noteIdx - baseIdx + 12) % 12;
    const matchedSwara = INDIAN_SWARAS.find(s => s.westernOffset === semitoneDiff);
    return matchedSwara ? matchedSwara.name : '--';
  }, []);

  // Robust Auto-correlation Pitch Detection Algorithm
  const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    const SIZE = buffer.length;
    let sumSq = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      sumSq += val * val;
    }
    const rms = Math.sqrt(sumSq / SIZE);

    // RMS Noise Floor Gate (0.005 is responsive to voice/humming/flute)
    if (rms < 0.005) {
      return { freq: -1, clarity: 0 };
    }

    // Normalized Autocorrelation
    const c = new Float32Array(SIZE);
    for (let i = 0; i < SIZE / 2; i++) {
      let sum = 0;
      for (let j = 0; j < SIZE - i; j++) {
        sum += buffer[j] * buffer[j + i];
      }
      c[i] = sum;
    }

    // Find first local minimum (first valley)
    let d = 0;
    while (d < SIZE / 2 - 1 && c[d] > c[d + 1]) {
      d++;
    }

    // Find highest peak after first valley
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < SIZE / 2; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }

    if (maxIndex <= 0 || c[0] <= 0) {
      return { freq: -1, clarity: 0 };
    }

    // Parabolic interpolation around peak
    let T0 = maxIndex;
    const x1 = c[T0 - 1] || 0;
    const x2 = c[T0];
    const x3 = c[T0 + 1] || 0;

    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a !== 0) {
      T0 = T0 - b / (2 * a);
    }

    const pitchFreq = sampleRate / T0;
    const signalClarity = maxValue / c[0];

    return { freq: pitchFreq, clarity: signalClarity };
  };

  // Start Mic Listening
  const startListening = async () => {
    setAudioPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        }
      });
      
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      source.connect(analyser);

      isListeningRef.current = true;
      setIsListening(true);

      const buffer = new Float32Array(analyser.fftSize);

      const processAudio = () => {
        if (!analyserRef.current || !isListeningRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);

        const { freq, clarity: c } = autoCorrelate(buffer, audioCtx.sampleRate);

        // Responsive Pitch range (80 Hz to 2800 Hz) covering vocal humming, singing, and all Bansuri scales
        if (freq > 80 && freq < 2800 && c > 0.5) {
          const roundedFreq = Math.round(freq * 10) / 10;
          setFrequency(roundedFreq);
          setClarity(Math.round(c * 100));

          const noteData = getNoteFromFreq(freq);
          setNoteName(noteData.name);
          setOctave(noteData.octave);
          setCents(noteData.cents);

          // Exponential smoothing for the needle
          setSmoothedCents(prev => prev + (noteData.cents - prev) * 0.25);

          const swara = getSwaraForNote(noteData.name, selectedScaleKeyRef.current);
          setDetectedSwara(swara);
        } else {
          // Fade smoothed cents back to center when silent
          setSmoothedCents(prev => prev * 0.82);
        }

        if (isListeningRef.current) {
          animFrameRef.current = requestAnimationFrame(processAudio);
        }
      };

      animFrameRef.current = requestAnimationFrame(processAudio);
    } catch (err) {
      console.error('Microphone error:', err);
      setAudioPermissionError('Microphone access was denied or not available. Please allow audio permission in your browser to use the tuner.');
      isListeningRef.current = false;
      setIsListening(false);
    }
  };

  // Stop Mic Listening
  const stopListening = () => {
    isListeningRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    setIsListening(false);
    setFrequency(null);
    setNoteName('--');
    setCents(0);
    setSmoothedCents(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (refOscillatorRef.current) {
        refOscillatorRef.current.stop();
      }
    };
  }, []);

  // Toggle Reference Audio Tone
  const toggleReferenceTone = (targetFreq: number) => {
    if (isPlayingReference) {
      if (refOscillatorRef.current) {
        refGainRef.current?.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime || 0, 0.05);
        setTimeout(() => {
          refOscillatorRef.current?.stop();
          refOscillatorRef.current = null;
          setIsPlayingReference(false);
        }, 100);
      } else {
        setIsPlayingReference(false);
      }
    } else {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine'; // Smooth pure tone for flute tuning
      osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      refOscillatorRef.current = osc;
      refGainRef.current = gain;
      setReferenceFreq(targetFreq);
      setIsPlayingReference(true);
    }
  };

  // Calculate Needle Rotation Angle (-90 deg to +90 deg for -50 to +50 cents)
  const clampedCents = Math.max(-50, Math.min(50, smoothedCents));
  const needleRotation = (clampedCents / 50) * 85; // Max 85 degrees left or right

  // Tuning status evaluation
  const isInTune = frequency !== null && Math.abs(cents) <= 5;
  const isSlightlyOff = frequency !== null && Math.abs(cents) > 5 && Math.abs(cents) <= 15;
  const isOffKey = frequency !== null && Math.abs(cents) > 15;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8"
      id="learn-flute-tuner-container"
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-bamboo-200/80 pb-5">
        <div>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-semibold text-bamboo-700 mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => onViewChange?.('community')}>Home</span>
            <span>/</span>
            <span className="text-amber-700 font-bold">Bansuri Flute Tuner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950 flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-amber-600 animate-pulse" />
            Bansuri Precision Tuner
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
            Standalone real-time audio pitch detection with <strong>A = 440 Hz</strong> reference &amp; Indian Swara mapping for all Bansuri keys.
          </p>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {onViewChange && (
            <button
              onClick={() => onViewChange('community')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-bamboo-200 rounded-xl text-xs font-bold text-bamboo-900 hover:bg-bamboo-50 transition cursor-pointer shadow-3xs"
            >
              Back to Feed
            </button>
          )}
        </div>
      </div>

      {/* Main Tuner Card - Speedometer Design */}
      <div className="bg-gradient-to-b from-white via-bamboo-50/30 to-amber-50/20 border border-bamboo-200/80 rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl relative overflow-hidden">
        
        {/* Subtle Decorative Ambient Background Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl transition-all duration-500 pointer-events-none -z-0 ${
          isInTune ? 'bg-emerald-400/25' : isListening ? 'bg-amber-400/15' : 'bg-gray-200/20'
        }`} />

        {/* Top Control Bar: Microphone Toggle & Scale Selector */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 mb-6 sm:mb-8 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-bamboo-100 shadow-3xs">
          
          {/* Mic Button with fixed min width to prevent header shift */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer select-none active:scale-95 w-full md:w-64 shrink-0 ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 ring-4 ring-red-100' 
                : 'bg-gradient-to-r from-bamboo-800 to-amber-700 text-white hover:from-bamboo-900 hover:to-amber-800 ring-4 ring-bamboo-100'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">Stop Tuner</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="whitespace-nowrap">Start Listening (Enable Mic)</span>
              </>
            )}
          </button>

          {/* Scale Key Selector Dropdown - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2.5 justify-between md:justify-end w-full md:w-auto">
            <label htmlFor="tuner-scale-select" className="text-xs font-bold text-bamboo-950 flex items-center gap-1 shrink-0 cursor-pointer">
              <Sliders className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Bansuri Scale Key:</span>
            </label>
            <select
              id="tuner-scale-select"
              value={selectedScaleKey}
              onChange={(e) => setSelectedScaleKey(e.target.value)}
              className="bg-bamboo-50 border border-bamboo-300 text-bamboo-950 text-xs font-bold rounded-xl px-3 py-2.5 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer w-full sm:w-auto min-w-0 max-w-full"
              aria-label="Bansuri Scale Key"
            >
              {NOTE_NAMES.map(note => (
                <option key={note} value={note}>
                  Sa = {note} {note === 'A' ? '(440 Hz Std)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Permission Error Alert */}
        {audioPermissionError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-medium mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Microphone Access Required</p>
              <p>{audioPermissionError}</p>
            </div>
          </div>
        )}

        {/* SPEEDOMETER GAUGE DISPLAY */}
        <div className="relative z-10 flex flex-col items-center justify-center py-4">
          
          {/* Main Semi-Circle Gauge Container */}
          <div className="relative w-72 h-44 sm:w-96 sm:h-56 flex items-end justify-center overflow-visible my-2">
            
            {/* SVG Speedometer Gauge Arc */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120">
              <defs>
                {/* Gauge Background Gradient */}
                <linearGradient id="gaugeBg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f87171" /> {/* Flat Red */}
                  <stop offset="30%" stopColor="#fbbf24" /> {/* Flat Yellow */}
                  <stop offset="45%" stopColor="#10b981" /> {/* In Tune Green */}
                  <stop offset="55%" stopColor="#10b981" /> {/* In Tune Green */}
                  <stop offset="70%" stopColor="#fbbf24" /> {/* Sharp Yellow */}
                  <stop offset="100%" stopColor="#f87171" /> {/* Sharp Red */}
                </linearGradient>

                {/* In Tune Glow */}
                <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Outer Arc */}
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Colored Speedometer Gradient Arc */}
              <path
                d="M 22 110 A 78 78 0 0 1 178 110"
                fill="none"
                stroke="url(#gaugeBg)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity={isListening ? 0.95 : 0.4}
              />

              {/* Center In-Tune Highlight Band (±5 cents zone) */}
              <path
                d="M 93 32 A 78 78 0 0 1 107 32"
                fill="none"
                stroke="#059669"
                strokeWidth="14"
                strokeLinecap="round"
                filter={isInTune ? "url(#greenGlow)" : undefined}
              />

              {/* Tick Marks & Labels */}
              {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((val) => {
                const angleRad = ((val / 50) * 85 - 90) * (Math.PI / 180);
                const x1 = 100 + 68 * Math.cos(angleRad);
                const y1 = 110 + 68 * Math.sin(angleRad);
                const x2 = 100 + (val === 0 ? 82 : 74) * Math.cos(angleRad);
                const y2 = 110 + (val === 0 ? 82 : 74) * Math.sin(angleRad);
                const isCenter = val === 0;

                return (
                  <g key={val}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isCenter ? '#047857' : '#94a3b8'}
                      strokeWidth={isCenter ? 2.5 : 1.2}
                    />
                  </g>
                );
              })}

              {/* Labels -50, 0, +50 */}
              <text x="18" y="122" fontSize="7" fontWeight="bold" fill="#ef4444" textAnchor="middle">-50♭</text>
              <text x="100" y="22" fontSize="8" fontWeight="bold" fill="#047857" textAnchor="middle">0 (IN TUNE)</text>
              <text x="182" y="122" fontSize="7" fontWeight="bold" fill="#ef4444" textAnchor="middle">+50♯</text>
            </svg>

            {/* SPEEDOMETER NEEDLE */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none flex items-end justify-center"
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.08s ease-out'
              }}
            >
              <div className={`w-1.5 h-32 sm:h-40 rounded-t-full transition-colors ${
                isInTune 
                  ? 'bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.8)]' 
                  : isSlightlyOff 
                  ? 'bg-amber-500' 
                  : isListening 
                  ? 'bg-rose-500' 
                  : 'bg-gray-400'
              }`} />
              {/* Needle Base Pivot Cap */}
              <div className={`absolute bottom-[-6px] w-6 h-6 rounded-full border-2 border-white shadow-md ${
                isInTune ? 'bg-emerald-600' : 'bg-amber-700'
              }`} />
            </div>
          </div>

          {/* DIGITAL TUNER READOUT CARD */}
          <div className="mt-4 flex flex-col items-center text-center space-y-3 w-full">
            
            {/* Note & Octave Display with fixed height and width to prevent shaking */}
            <div className="flex items-baseline justify-center h-16 w-44 mx-auto relative">
              <span className={`text-5xl sm:text-6xl font-display font-extrabold tracking-tight transition-colors tabular-nums min-w-[3.5rem] text-center ${
                isInTune 
                  ? 'text-emerald-600' 
                  : isSlightlyOff 
                  ? 'text-amber-700' 
                  : isListening && frequency 
                  ? 'text-bamboo-950' 
                  : 'text-gray-400'
              }`}>
                {noteName}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-500 font-mono w-6 text-left pl-1">
                {octave !== null ? octave : ''}
              </span>
            </div>

            {/* In-Tune Status Badge Container - Fixed Height to prevent vertical jitter */}
            <div className="h-9 flex items-center justify-center my-0.5">
              <AnimatePresence mode="wait">
                {isInTune ? (
                  <motion.div 
                    key="in-tune"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-2xs whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce shrink-0" />
                    <span>PERFECTLY IN TUNE! (±{Math.abs(cents)} cents)</span>
                  </motion.div>
                ) : isListening && frequency ? (
                  <motion.div 
                    key="off-tune"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full border whitespace-nowrap ${
                      cents < 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {cents < 0 ? `FLAT (${cents} cents)` : `SHARP (+${cents} cents)`}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="text-xs font-medium text-gray-500 bg-gray-100/90 border border-gray-200 px-4 py-1.5 rounded-full whitespace-nowrap"
                  >
                    {isListening ? 'Listening for flute sound...' : 'Press "Start Listening" above'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Real-Time Hz & Indian Swara Readout Boxes with fixed dimensions */}
            <div className="grid grid-cols-2 gap-3 pt-2 w-full max-w-xs mx-auto">
              
              {/* Hz Box */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-bamboo-100 shadow-3xs flex flex-col items-center justify-center min-h-[4.25rem]">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Frequency</span>
                <span className="text-base sm:text-lg font-mono font-bold text-bamboo-900 tabular-nums">
                  {frequency ? `${frequency} Hz` : '-- Hz'}
                </span>
              </div>

              {/* Swara Box */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-bamboo-100 shadow-3xs flex flex-col items-center justify-center min-h-[4.25rem]">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Indian Swara</span>
                <span className="text-base sm:text-lg font-bold text-amber-800 font-display">
                  {detectedSwara !== '--' ? `${detectedSwara}` : '--'}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* REFERENCE TONE GENERATOR (A = 440 Hz & BANSURI SCALES) */}
      <div className="bg-white border border-bamboo-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-bamboo-900 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-600" />
              Reference Pitch Tone Generator
            </h2>
            <p className="text-xs text-gray-500">
              Listen to the pure A = 440 Hz standard pitch or your Bansuri key reference tone to train your ear.
            </p>
          </div>

          <button
            onClick={() => toggleReferenceTone(440)}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer ${
              isPlayingReference && referenceFreq === 440
                ? 'bg-amber-600 text-white shadow-amber-200 ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isPlayingReference && referenceFreq === 440 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>Play Standard A = 440 Hz</span>
          </button>
        </div>

        {/* Quick Flute Key Reference Buttons */}
        <div>
          <span className="text-xs font-bold text-gray-700 block mb-2">
            Play Fundamental Scale Reference Tone (Sa Pitch):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {BANSURI_SCALES.map((scale) => {
              const isActive = isPlayingReference && referenceFreq === scale.freq;
              return (
                <button
                  key={scale.name}
                  onClick={() => toggleReferenceTone(scale.freq)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer select-none ${
                    isActive 
                      ? 'bg-bamboo-800 text-white border-bamboo-900 shadow-xs' 
                      : 'bg-gray-50/80 hover:bg-bamboo-50 border-gray-200 text-gray-800'
                  }`}
                >
                  <span className="text-xs font-bold block">{scale.name}</span>
                  <span className={`text-[10px] font-mono block ${isActive ? 'text-amber-300' : 'text-gray-500'}`}>
                    {scale.freq} Hz
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BANSURI SCALES FREQUENCY REFERENCE TABLE */}
      <div className="bg-white border border-bamboo-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold font-display text-bamboo-900">
            Indian Bansuri Scales &amp; Frequencies
          </h2>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          In Indian classical music, the key/scale of a Bansuri is determined by the pitch produced when 3 finger holes from the blowing hole are closed (or the fundamental <strong>Sa</strong> pitch). Below is the standard frequency chart calibrated to <strong>A = 440 Hz</strong>:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-bamboo-100 bg-bamboo-50/50 text-bamboo-900">
                <th className="py-2.5 px-3 font-bold">Scale Name</th>
                <th className="py-2.5 px-3 font-bold">Western Key</th>
                <th className="py-2.5 px-3 font-bold">Fundamental (Sa) Hz</th>
                <th className="py-2.5 px-3 font-bold">Category</th>
                <th className="py-2.5 px-3 font-bold hidden sm:table-cell">Recommended For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {BANSURI_SCALES.map((s) => (
                <tr key={s.name} className="hover:bg-amber-50/40 transition">
                  <td className="py-2.5 px-3 font-bold text-bamboo-950 flex items-center gap-1.5">
                    {s.name}
                    {s.key === 'A' && (
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        A440
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-gray-800">{s.key}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-800">{s.freq} Hz</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      s.type === 'Bass' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 hidden sm:table-cell">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLUTE TUNING TIPS & BLOWING GUIDE */}
      <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-amber-700 shrink-0" />
          <h3 className="text-lg font-display font-bold text-amber-950">
            💡 Essential Tips for Tuning Your Flute
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-700 leading-relaxed">
          <div className="bg-white p-4 rounded-2xl border border-amber-200/60 space-y-1.5">
            <span className="font-bold text-bamboo-900 block text-sm">1. Embouchure &amp; Angle Adjustments</span>
            <p>
              If your pitch is <strong>Sharp (Too High)</strong>, roll the flute slightly inward towards your mouth or blow softer.
            </p>
            <p>
              If your pitch is <strong>Flat (Too Low)</strong>, roll the flute slightly outward or increase your air pressure.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/60 space-y-1.5">
            <span className="font-bold text-bamboo-900 block text-sm">2. Temperature &amp; Warmup</span>
            <p>
              Bamboo is a natural organic material. Cold flutes play slightly flat. Blow warm air through your Bansuri for 2–3 minutes before checking the tuner.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {onViewChange && (
          <button
            onClick={() => onViewChange('learn_choose_flute')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border border-bamboo-200 rounded-xl text-xs font-bold text-bamboo-900 hover:bg-bamboo-50 transition cursor-pointer shadow-3xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: Choose the Right Flute</span>
          </button>
        )}

        {onViewChange && (
          <button
            onClick={() => onViewChange('learn_basics')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-bamboo-800 to-amber-800 text-white rounded-xl text-xs font-bold hover:from-bamboo-900 hover:to-amber-900 transition cursor-pointer shadow-md"
          >
            <span>Next Lesson: The Basics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </motion.div>
  );
}
