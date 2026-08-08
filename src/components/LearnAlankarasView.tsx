import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Music, ArrowUpRight, ArrowDownRight, Lightbulb, Calendar, Clock, CheckCircle2, 
  ArrowRight, Copy, Check, Play, Pause, Sparkles, Filter, Zap, Target, Gauge
} from 'lucide-react';
import Metronome from './Metronome';
import AboutAuthorSection from './AboutAuthorSection';
import { AppView } from '../types';

interface LearnAlankarasViewProps {
  onViewChange?: (view: AppView) => void;
}

export type AlankarLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export const ALANKAR_LEVEL_SLUGS: Record<AlankarLevel, string> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced'
};

export interface AlankarItem {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  desc: string;
  focus: string;
  arohaTitle?: string;
  aroha: string[];
  avrohaTitle?: string;
  avroha: string[];
  tips?: string;
}

export default function LearnAlankarasView({ onViewChange }: LearnAlankarasViewProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const getLevelFromPath = (pathname: string): AlankarLevel => {
    if (pathname.includes('/learn/alankaras/intermediate')) return 'Intermediate';
    if (pathname.includes('/learn/alankaras/advanced')) return 'Advanced';
    return 'Beginner';
  };

  const [selectedLevel, setSelectedLevel] = useState<AlankarLevel>(() => getLevelFromPath(location.pathname));
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [playingAlankarId, setPlayingAlankarId] = useState<number | null>(null);
  const [playingType, setPlayingType] = useState<'aroha' | 'avroha' | null>(null);
  const [alankarSpeeds, setAlankarSpeeds] = useState<Record<number, number>>({}); // Speed per alankar ID (1x, 2x, 3x, 4x)

  // Sync selectedLevel with URL path when URL changes
  useEffect(() => {
    const lvlFromUrl = getLevelFromPath(location.pathname);
    if (lvlFromUrl !== selectedLevel) {
      setSelectedLevel(lvlFromUrl);
    }
  }, [location.pathname]);

  const handleLevelChange = (lvl: AlankarLevel) => {
    if (playingAlankarId !== null) {
      stopAudio();
    }
    setSelectedLevel(lvl);
    const targetPath = `/learn/alankaras/${ALANKAR_LEVEL_SLUGS[lvl]}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<any>(null);

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

  const SWARA_FREQS: Record<string, number> = {
    'Sa': 261.63, 'Re': 293.66, 'Ga': 329.63, 'Ma': 349.23, 'Ma#': 369.99, 'Pa': 392.00, 'Dha': 440.00, 'Ni': 493.88,
    'Sā': 523.25, 'Rā': 587.33, 'Gā': 659.25, 'Mā': 698.46,
    'N.': 246.94, 'D.': 220.00, 'P.': 196.00
  };

  // Realistic Bamboo Flute (Bansuri) Synthesizer
  const playBambooFluteNote = (
    ctx: AudioContext,
    startFreq: number,
    endFreq: number,
    startTime: number,
    duration: number,
    hasMeend: boolean = false
  ) => {
    // 1. Primary Fundamental Oscillator (Sine) + Harmonic Overtones (Triangle / Sine)
    const osc1 = ctx.createOscillator(); // Fundamental
    const osc2 = ctx.createOscillator(); // 2nd harmonic (warm octave)
    const osc3 = ctx.createOscillator(); // 3rd harmonic (subtle overtone)

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc3.type = 'sine';

    if (hasMeend) {
      // Smooth pitch slide for meend (~ portamento)
      osc1.frequency.setValueAtTime(startFreq, startTime);
      osc1.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration * 0.85);

      osc2.frequency.setValueAtTime(startFreq * 2, startTime);
      osc2.frequency.exponentialRampToValueAtTime(endFreq * 2, startTime + duration * 0.85);

      osc3.frequency.setValueAtTime(startFreq * 3, startTime);
      osc3.frequency.exponentialRampToValueAtTime(endFreq * 3, startTime + duration * 0.85);
    } else {
      osc1.frequency.setValueAtTime(startFreq, startTime);
      osc2.frequency.setValueAtTime(startFreq * 2, startTime);
      osc3.frequency.setValueAtTime(startFreq * 3, startTime);
    }

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();

    gain1.gain.setValueAtTime(0.24, startTime);
    gain2.gain.setValueAtTime(0.06, startTime);
    gain3.gain.setValueAtTime(0.02, startTime);

    // 2. Breath Vibrato / Pitch Tremolo LFO (~5.2 Hz scaled for speed)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.2 * (duration < 0.25 ? 1.2 : 1.0), startTime);

    const vibratoRampTime = Math.min(0.12, duration * 0.4);
    lfoGain.gain.setValueAtTime(0.001, startTime);
    lfoGain.gain.linearRampToValueAtTime(startFreq * 0.012, startTime + vibratoRampTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    // 3. Air Chiff / Breath blowing noise (Emulates blowing air into bansuri embouchure)
    const noiseDuration = Math.min(0.12, duration * 0.5);
    const noiseLen = Math.floor(ctx.sampleRate * noiseDuration);
    const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      outputData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2200, startTime);
    noiseFilter.Q.setValueAtTime(2.2, startTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.04, startTime + Math.min(0.015, duration * 0.1));
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + noiseDuration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    // 4. Acoustic Body Resonance Filter (Warm Bamboo Lowpass)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(1900, startTime);
    bodyFilter.Q.setValueAtTime(1.1, startTime);

    // 5. Master Note Envelope scaled by duration
    const attackTime = Math.min(0.04, duration * 0.25);
    const releaseTime = Math.min(0.07, duration * 0.35);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, startTime);
    // Smooth breath onset
    masterGain.gain.exponentialRampToValueAtTime(0.28, startTime + attackTime);
    // Sustain
    masterGain.gain.setValueAtTime(0.25, Math.max(startTime + attackTime, startTime + duration - releaseTime));
    // Natural release
    masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Connect graph
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(bodyFilter);
    gain2.connect(bodyFilter);
    gain3.connect(bodyFilter);
    noiseGain.connect(bodyFilter);

    bodyFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Play
    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    lfo.start(startTime);
    noiseSource.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    osc3.stop(startTime + duration);
    lfo.stop(startTime + duration);
    noiseSource.stop(startTime + noiseDuration);
  };

  const stopAudio = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        // ignore close error
      }
      audioCtxRef.current = null;
    }
    setPlayingAlankarId(null);
    setPlayingType(null);
  };

  const playSwaraSequence = (lines: string[], alankarId: number, type: 'aroha' | 'avroha') => {
    // If audio is already playing or audio context exists, immediately stop it
    stopAudio();

    const fullText = lines.join(' ');
    // Match swaras and swara pairs like Sa~Ga
    const tokenRegex = /(Sā|Rā|Gā|Mā|Sa|Re|Ga|Ma#|Ma|Pa|Dha|Ni|N\.|D\.|P\.)(?:~(Sā|Rā|Gā|Mā|Sa|Re|Ga|Ma#|Ma|Pa|Dha|Ni|N\.|D\.|P\.))?/g;
    const tokens = fullText.match(tokenRegex);

    if (!tokens || tokens.length === 0) return;

    setPlayingAlankarId(alankarId);
    setPlayingType(type);

    const ctx = getAudioContext();
    let startTime = ctx.currentTime + 0.05;
    const baseDuration = 0.42;
    const speed = alankarSpeeds[alankarId] || 1;
    const noteDuration = baseDuration / speed;

    tokens.forEach((token) => {
      let startSwara = token;
      let endSwara = token;
      let hasMeend = false;

      if (token.includes('~')) {
        const parts = token.split('~');
        startSwara = parts[0];
        endSwara = parts[1];
        hasMeend = true;
      }

      const startFreq = SWARA_FREQS[startSwara] || 261.63;
      const endFreq = SWARA_FREQS[endSwara] || startFreq;

      playBambooFluteNote(ctx, startFreq, endFreq, startTime, noteDuration, hasMeend);

      startTime += noteDuration;
    });

    const totalTimeMs = Math.max(0, (startTime - ctx.currentTime) * 1000);
    timeoutRef.current = setTimeout(() => {
      setPlayingAlankarId(null);
      setPlayingType(null);
    }, totalTimeMs);
  };

  const allAlankars: AlankarItem[] = [
    // ---------------- BEGINNER ALANKARS (1 - 14) ----------------
    {
      id: 1,
      level: 'Beginner',
      title: "1. The Straight Scale (Saral Alankar)",
      focus: "Tone Clarity & Sustained Breath",
      desc: "This is the absolute foundation of bansuri practice. It focuses on producing a pure, resonant tone on each individual note and matching your breath velocity across the octave.",
      aroha: ["Sa | Re | Ga | Ma | Pa | Dha | Ni | Sā"],
      avroha: ["Sā | Ni | Dha | Pa | Ma | Ga | Re | Sa"],
      tips: "Practice with a tanpura drone. Hold each note for 4 full beats without wavering pitch."
    },
    {
      id: 2,
      level: 'Beginner',
      title: "2. The Double Swara Pattern (Jod Alankar)",
      focus: "Micro-Tonguing & Finger Stability",
      desc: "Teaches clean note separation using gentle throat or tongue air cuts. Essential for preventing air slurs between identical notes.",
      aroha: ["Sa-Sa | Re-Re | Ga-Ga | Ma-Ma | Pa-Pa | Dha-Dha | Ni-Ni | Sā-Sā"],
      avroha: ["Sā-Sā | Ni-Ni | Dha-Dha | Pa-Pa | Ma-Ma | Ga-Ga | Re-Re | Sa-Sa"],
      tips: "Ensure both notes in a pair sound identical in volume and pitch."
    },
    {
      id: 3,
      level: 'Beginner',
      title: "3. The Triplet Pattern (Teen Swara)",
      focus: "Rhythmic Triplet Movement",
      desc: "Introduces 3-beat rhythmic grouping. Builds finger coordination across sequential 3-note phrases.",
      aroha: [
        "Sa-Re-Ga", "Re-Ga-Ma", "Ga-Ma-Pa",
        "Ma-Pa-Dha", "Pa-Dha-Ni", "Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha", "Ni-Dha-Pa", "Dha-Pa-Ma",
        "Pa-Ma-Ga", "Ma-Ga-Re", "Ga-Re-Sa"
      ],
      tips: "Accent the first note of each triplet slightly to lock into rhythm."
    },
    {
      id: 4,
      level: 'Beginner',
      title: "4. The Quadruplet Pattern (Chaar Swara)",
      focus: "Extended Breath & Even Pace",
      desc: "A four-note sequence that expands your breath capacity and helps you track longer phrases while maintaining an even finger speed.",
      aroha: [
        "Sa-Re-Ga-Ma", "Re-Ga-Ma-Pa", "Ga-Ma-Pa-Dha",
        "Ma-Pa-Dha-Ni", "Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa", "Ni-Dha-Pa-Ma", "Dha-Pa-Ma-Ga",
        "Pa-Ma-Ga-Re", "Ma-Ga-Re-Sa"
      ],
      tips: "Keep your finger lifts low to the flute body for maximum speed efficiency."
    },
    {
      id: 5,
      level: 'Beginner',
      title: "5. The Skip Pattern (Alternating Single Skip)",
      focus: "Independent Finger Muscle Memory",
      desc: "By skipping one note in each pair, you train individual fingers to lift and land independently rather than moving in a continuous line.",
      aroha: [
        "Sa-Ga", "Re-Ma", "Ga-Pa",
        "Ma-Dha", "Pa-Ni", "Dha-Sā"
      ],
      avroha: [
        "Sā-Dha", "Ni-Pa", "Dha-Ma",
        "Pa-Ga", "Ma-Re", "Ga-Sa"
      ],
      tips: "Watch out for air leaks when lifting middle or ring fingers independently."
    },
    {
      id: 6,
      level: 'Beginner',
      title: "6. The Reverse Pair Pattern (Ulta Jod Alankar)",
      focus: "Reverse Step Coordination & Throat Cut",
      desc: "Pairs notes descending backward step-by-step. Develops reverse finger memory and keeps air pressure uniform when reversing direction.",
      aroha: [
        "Re-Sa", "Ga-Re", "Ma-Ga",
        "Pa-Ma", "Dha-Pa", "Ni-Dha", "Sā-Ni"
      ],
      avroha: [
        "Ni-Sā", "Dha-Ni", "Pa-Dha",
        "Ma-Pa", "Ga-Ma", "Re-Ga", "Sa-Re"
      ],
      tips: "Execute gentle throat articulation between the two reverse notes."
    },
    {
      id: 7,
      level: 'Beginner',
      title: "7. The Zig-Zag Triplet (Vakra Teen Swara)",
      focus: "Non-Linear Direction Changes",
      desc: "Takes two steps forward and one step back (Sa-Re-Sa). Breaks linear habits and develops sharp finger response.",
      aroha: [
        "Sa-Re-Sa", "Re-Ga-Re", "Ga-Ma-Ga",
        "Ma-Pa-Ma", "Pa-Dha-Pa", "Dha-Ni-Dha", "Ni-Sā-Ni"
      ],
      avroha: [
        "Sā-Ni-Sā", "Ni-Dha-Ni", "Dha-Pa-Dha",
        "Pa-Ma-Pa", "Ma-Ga-Ma", "Ga-Re-Ga", "Re-Sa-Re"
      ],
      tips: "Maintain exact equal length for all three swaras."
    },
    {
      id: 8,
      level: 'Beginner',
      title: "8. The Pendulum / Echo Pattern (Pyramid Alankar)",
      focus: "Anchor Note & Progressive Stamina",
      desc: "Phrases grow progressively longer while constantly returning to the anchor note Sa (or upper Sā). Excellent for breath control testing.",
      arohaTitle: "Aroha (Ascending Pyramid returning to Sa)",
      aroha: [
        "Sa",
        "Sa-Re-Sa",
        "Sa-Re-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Dha-Pa-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Dha-Pa-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa"
      ],
      avrohaTitle: "Avroha (Descending Pyramid returning to upper Sā)",
      avroha: [
        "Sā",
        "Sā-Ni-Sā",
        "Sā-Ni-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Ga-Ma-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Ga-Ma-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā"
      ],
      tips: "Take a quick, deep diaphragmatic breath before starting longer tiers."
    },
    {
      id: 9,
      level: 'Beginner',
      title: "9. The Hook / Return Pattern (Vakra Chaar Swara)",
      focus: "Classical Composition Phrase Building",
      desc: "Moves up three notes but hooks back to the second note before advancing. Mimics fundamental Hindustani composition phrases.",
      aroha: [
        "Sa-Re-Ga-Re", "Re-Ga-Ma-Ga", "Ga-Ma-Pa-Ma",
        "Ma-Pa-Dha-Pa", "Pa-Dha-Ni-Dha", "Dha-Ni-Sā-Ni"
      ],
      avroha: [
        "Sā-Ni-Dha-Ni", "Ni-Dha-Pa-Dha", "Dha-Pa-Ma-Pa",
        "Pa-Ma-Ga-Ma", "Ma-Ga-Re-Ga", "Ga-Re-Sa-Re"
      ],
      tips: "Keep the return note clear and unhurried."
    },
    {
      id: 10,
      level: 'Beginner',
      title: "10. The Staggered Skip (Variable Skip Pattern)",
      focus: "Finger Stretch & Reverse Fill",
      desc: "Skips two notes up to the fourth note, then fills in backwards. A great stretch for your finger pads.",
      aroha: [
        "Sa-Ma-Ga-Re", "Re-Pa-Ma-Ga", "Ga-Dha-Pa-Ma",
        "Ma-Ni-Dha-Pa", "Pa-Sā-Ni-Dha"
      ],
      avroha: [
        "Sā-Pa-Dha-Ni", "Ni-Ma-Pa-Dha", "Dha-Ga-Ma-Pa",
        "Pa-Re-Ga-Ma", "Ma-Sa-Re-Ga"
      ],
      tips: "Ensure flat finger pad placement when landing the wide leap."
    },
    {
      id: 11,
      level: 'Beginner',
      title: "11. Four-Note Reverse Step (Vakra Saral Alankar)",
      focus: "Symmetrical Breath Division & Finger Control",
      desc: "Moves three steps up and steps back one note. Excellent for establishing comfortable 4-beat bar counting.",
      aroha: [
        "Sa-Re-Ga-Re", "Re-Ga-Ma-Ga", "Ga-Ma-Pa-Ma",
        "Ma-Pa-Dha-Pa", "Pa-Dha-Ni-Dha", "Dha-Ni-Sā-Ni"
      ],
      avroha: [
        "Sā-Ni-Dha-Ni", "Ni-Dha-Pa-Dha", "Dha-Pa-Ma-Pa",
        "Pa-Ma-Ga-Ma", "Ma-Ga-Re-Ga", "Ga-Re-Sa-Re"
      ],
      tips: "Maintain an even volume on both ascending and step-back notes."
    },
    {
      id: 12,
      level: 'Beginner',
      title: "12. Triplet Repeat Pattern (Teen Jod Alankar)",
      focus: "Tongue & Throat Speed Building",
      desc: "Repeats each note three times consecutively. Trains rapid micro-tonguing cuts and pitch stability.",
      aroha: [
        "Sa-Sa-Sa", "Re-Re-Re", "Ga-Ga-Ga", "Ma-Ma-Ma",
        "Pa-Pa-Pa", "Dha-Dha-Dha", "Ni-Ni-Ni", "Sā-Sā-Sā"
      ],
      avroha: [
        "Sā-Sā-Sā", "Ni-Ni-Ni", "Dha-Dha-Dha", "Pa-Pa-Pa",
        "Ma-Ma-Ma", "Ga-Ga-Ga", "Re-Re-Re", "Sa-Sa-Sa"
      ],
      tips: "Keep air pressure steady; do not let the flute pitch drop on repeated notes."
    },
    {
      id: 13,
      level: 'Beginner',
      title: "13. Octave Anchor Jump (Mandra-Madhya Chhalaang)",
      focus: "Register Shift Embouchure Control",
      desc: "Alternates between base Sa and ascending notes to build instant embouchure adjustment for octave jumps.",
      aroha: [
        "Sa-Re | Sa-Ga | Sa-Ma | Sa-Pa | Sa-Dha | Sa-Ni | Sa-Sā"
      ],
      avroha: [
        "Sā-Ni | Sā-Dha | Sā-Pa | Sā-Ma | Sā-Ga | Sā-Re | Sā-Sa"
      ],
      tips: "Keep lips relaxed; tighten blow stream subtly for higher intervals."
    },
    {
      id: 14,
      level: 'Beginner',
      title: "14. The Long Jump (Swaron Ki Chhalaang)",
      focus: "Octave Embouchure & Air Pressure Control",
      desc: "Jumps directly across octave intervals or fifths. Tests lip pressure and air speed adjustment on Bansuri.",
      arohaTitle: "Octave & Interval Jump Pairs",
      aroha: [
        "Sa - Sā | Sā - Sa",
        "Sa - Pa | Pa - Sa",
        "Re - Dha | Dha - Re",
        "Ga - Ni | Ni - Ga",
        "Ma - Sā | Sā - Ma"
      ],
      avroha: [
        "Sā - Sa | Sa - Sā",
        "Pa - Sa | Sa - Pa",
        "Dha - Re | Re - Dha",
        "Ni - Ga | Ga - Ni",
        "Sā - Ma | Ma - Sā"
      ],
      tips: "Do not blow harder; focus air stream tighter using your lip embouchure for higher notes."
    },

    // ---------------- INTERMEDIATE ALANKARS (15 - 28) ----------------
    {
      id: 15,
      level: 'Intermediate',
      title: "15. Five-Note Sequence (Panch Swara Alankar)",
      focus: "Extended Phrasing & Rhythmic Drive",
      desc: "A 5-note grouping that spans half an octave in a single breath phrase. Builds seamless continuity across middle notes.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa", "Re-Ga-Ma-Pa-Dha",
        "Ga-Ma-Pa-Dha-Ni", "Ma-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma", "Ni-Dha-Pa-Ma-Ga",
        "Dha-Pa-Ma-Ga-Re", "Pa-Ma-Ga-Re-Sa"
      ],
      tips: "Practice in 5/4 rhythm or set metronome to accent beat 1 of every 5 notes."
    },
    {
      id: 16,
      level: 'Intermediate',
      title: "16. Double Skip Turnaround (Chhalang Vakra Alankar)",
      focus: "Agile Raga Taan Preparation",
      desc: "Skips one note forward, steps one note back, and resolves forward. Widely used in classical drut compositions and fast taan passages.",
      aroha: [
        "Sa-Ga-Re-Ga", "Re-Ma-Ga-Ma", "Ga-Pa-Ma-Pa",
        "Ma-Dha-Pa-Dha", "Pa-Ni-Dha-Ni", "Dha-Sā-Ni-Sā"
      ],
      avroha: [
        "Sā-Dha-Ni-Dha", "Ni-Pa-Dha-Pa", "Dha-Ma-Pa-Ma",
        "Pa-Ga-Ma-Ga", "Ma-Re-Ga-Re", "Ga-Sa-Re-Sa"
      ],
      tips: "Keep air pressure steady through the direction change."
    },
    {
      id: 17,
      level: 'Intermediate',
      title: "17. Reverse Triplet Pattern (Ulta Teen Swara)",
      focus: "Reverse Muscle Memory & Speed",
      desc: "Moves 3-note phrases in reverse direction. Trains your brain and fingers to execute descending micro-passages effortlessly.",
      aroha: [
        "Ga-Re-Sa", "Ma-Ga-Re", "Pa-Ma-Ga",
        "Dha-Pa-Ma", "Ni-Dha-Pa", "Sā-Ni-Dha"
      ],
      avroha: [
        "Dha-Ni-Sā", "Pa-Dha-Ni", "Ma-Pa-Dha",
        "Ga-Ma-Pa", "Re-Ga-Ma", "Sa-Re-Ga"
      ],
      tips: "Pay close attention to smooth finger lifting during reverse progression."
    },
    {
      id: 18,
      level: 'Intermediate',
      title: "18. Triple Swara Repeating Pattern (Trigun Swara)",
      focus: "Rapid Micro-Tonguing & Pitch Precision",
      desc: "Each note is repeated three times in rapid succession. Develops crisp throat cuts and refined embouchure stability.",
      aroha: [
        "Sa-Sa-Sa | Re-Re-Re | Ga-Ga-Ga | Ma-Ma-Ma",
        "Pa-Pa-Pa | Dha-Dha-Dha | Ni-Ni-Ni | Sā-Sā-Sā"
      ],
      avroha: [
        "Sā-Sā-Sā | Ni-Ni-Ni | Dha-Dha-Dha | Pa-Pa-Pa",
        "Ma-Ma-Ma | Ga-Ga-Ga | Re-Re-Re | Sa-Sa-Sa"
      ],
      tips: "Use light, subtle air cuts with the back of the palate rather than blowing heavy puffs."
    },
    {
      id: 19,
      level: 'Intermediate',
      title: "19. Cross-Step Quadruplet (Vakra Chaar Swara - Complex)",
      focus: "Complex Finger Agility for Drut Laya",
      desc: "Moves two notes forward, steps one note back, and leaps two forward. Excellent for building finger agility for fast Bandish compositions.",
      aroha: [
        "Sa-Re-Ga-Re-Ga-Ma", "Re-Ga-Ma-Ga-Ma-Pa",
        "Ga-Ma-Pa-Ma-Pa-Dha", "Ma-Pa-Dha-Pa-Dha-Ni", "Pa-Dha-Ni-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Ni-Dha-Pa", "Ni-Dha-Pa-Dha-Pa-Ma",
        "Dha-Pa-Ma-Pa-Ma-Ga", "Pa-Ma-Ga-Ma-Ga-Re", "Ma-Ga-Re-Ga-Re-Sa"
      ],
      tips: "Play with a light touch; avoid pressing hard on the flute holes."
    },
    {
      id: 20,
      level: 'Intermediate',
      title: "20. Double Leap and Fill (Dupli-Chhalang Alankar)",
      focus: "Interval Leap Recovery",
      desc: "Leaps three notes ahead (Sa to Ma), steps back note by note to Sa, then moves to the next base note.",
      aroha: [
        "Sa-Ma-Ga-Re-Sa", "Re-Pa-Ma-Ga-Re",
        "Ga-Dha-Pa-Ma-Ga", "Ma-Ni-Dha-Pa-Ma", "Pa-Sā-Ni-Dha-Pa"
      ],
      avroha: [
        "Sā-Pa-Dha-Ni-Sā", "Ni-Ma-Pa-Dha-Ni",
        "Dha-Ga-Ma-Pa-Dha", "Pa-Re-Ga-Ma-Pa", "Ma-Sa-Re-Ga-Ma"
      ],
      tips: "Focus on making the initial leap crisp and clean before descending smoothly."
    },
    {
      id: 21,
      level: 'Intermediate',
      title: "21. Symmetrical Octave Wave (Tarr-Mandra Sanchar)",
      focus: "Octave Register Jump & Pitch Accuracy",
      desc: "Alternates between lower octave, middle octave, and upper octave notes to build seamless register shifts without harsh blowing.",
      aroha: [
        "Sa - Pa - Sā", "Re - Dha - Rā",
        "Ga - Ni - Gā", "Ma - Sā - Mā"
      ],
      avroha: [
        "Sā - Pa - Sa", "Ni - Ma - N.",
        "Dha - Ga - D.", "Pa - Re - P."
      ],
      tips: "Maintain an oval lip aperture; tighten slightly for upper notes without pushing extra wind."
    },
    {
      id: 22,
      level: 'Intermediate',
      title: "22. Four-Note Double Hook (Khatka Preparation Pattern)",
      focus: "Finger Technique for Classical Khatka",
      desc: "A rapid four-note oscillation (Sa-Re-Sa-Ga) that lays the exact finger technique foundation for classical Khatka and Murki ornaments.",
      aroha: [
        "Sa-Re-Sa-Ga", "Re-Ga-Re-Ma", "Ga-Ma-Ga-Pa",
        "Ma-Pa-Ma-Dha", "Pa-Dha-Pa-Ni", "Dha-Ni-Dha-Sā"
      ],
      avroha: [
        "Sā-Ni-Sā-Dha", "Ni-Dha-Ni-Pa", "Dha-Pa-Dha-Ma",
        "Pa-Ma-Pa-Ga", "Ma-Ga-Ma-Re", "Ga-Re-Ga-Sa"
      ],
      tips: "The middle two notes should feel like a quick rebound flick."
    },
    {
      id: 23,
      level: 'Intermediate',
      title: "23. Pyramid Skip Pattern (Swar Vistar Alankar)",
      focus: "Interval Expansion & Pitch Tuning",
      desc: "An expanding interval pattern starting from a single note jump and expanding up to a fifth, returning to base Sa each time.",
      aroha: [
        "Sa-Re-Sa", "Sa-Ga-Sa", "Sa-Ma-Sa",
        "Sa-Pa-Sa", "Sa-Dha-Sa", "Sa-Ni-Sa", "Sa-Sā-Sa"
      ],
      avroha: [
        "Sā-Ni-Sā", "Sā-Dha-Sā", "Sā-Pa-Sā",
        "Sā-Ma-Sā", "Sā-Ga-Sā", "Sā-Re-Sā", "Sā-Sa-Sā"
      ],
      tips: "Listen carefully to ensure every leap is perfectly in tune relative to Sa."
    },
    {
      id: 24,
      level: 'Intermediate',
      title: "24. Meend & Glide Preparation Alankar (Swar Sparsh)",
      focus: "Smooth Meend (Portamento) Slide",
      desc: "Connects pairs of notes using continuous air velocity and smooth finger slide (Meend) rather than staccato tonguing.",
      aroha: [
        "Sa~Ga", "Re~Ma", "Ga~Pa",
        "Ma~Dha", "Pa~Ni", "Dha~Sā"
      ],
      avroha: [
        "Sā~Dha", "Ni~Pa", "Dha~Ma",
        "Pa~Ga", "Ma~Re", "Ga~Sa"
      ],
      tips: "Slowly roll or slide your fingers off the tone holes to create a continuous liquid glide."
    },
    {
      id: 25,
      level: 'Intermediate',
      title: "25. Two-Note Skip Pattern (Do Swara Chhalang)",
      focus: "Wide Finger Stretch & Precision Landing",
      desc: "Skips two notes ahead (Sa to Ma, Re to Pa). Forces complete finger independence across non-adjacent holes.",
      aroha: [
        "Sa-Ma", "Re-Pa", "Ga-Dha",
        "Ma-Ni", "Pa-Sā"
      ],
      avroha: [
        "Sā-Pa", "Ni-Ma", "Dha-Ga",
        "Pa-Re", "Ma-Sa"
      ],
      tips: "Keep ring finger relaxed to avoid accidental half-hole air leakage."
    },
    {
      id: 26,
      level: 'Intermediate',
      title: "26. Six-Note Step-Back Pattern (Chhat Swara Palta)",
      focus: "6-Beat Rhythm Subdivision & Flow",
      desc: "Moves five notes forward and steps back one note. Excellent for practicing Dadra (6 beats) or Rupak (7 beats) rhythm structures.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Ga", "Re-Ga-Ma-Pa-Dha-Ma",
        "Ga-Ma-Pa-Dha-Ni-Pa", "Ma-Pa-Dha-Ni-Sā-Dha"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Dha", "Ni-Dha-Pa-Ma-Ga-Pa",
        "Dha-Pa-Ma-Ga-Re-Ma", "Pa-Ma-Ga-Re-Sa-Ga"
      ],
      tips: "Ensure smooth breath flow across the 6-swara phrase."
    },
    {
      id: 27,
      level: 'Intermediate',
      title: "27. Teevra Ma Swara Drill (Kalyan Thaat Drill)",
      focus: "Sharp Fourth (Teevra Ma#) Finger Precision",
      desc: "Replaces Shuddha Ma with Teevra Ma# (sharp 4th) across sequential phrases. Essential for mastering Kalyan and Yaman raga fingerings.",
      aroha: [
        "Sa-Re-Ga-Ma#-Pa", "Re-Ga-Ma#-Pa-Dha",
        "Ga-Ma#-Pa-Dha-Ni", "Ma#-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma#", "Ni-Dha-Pa-Ma#-Ga",
        "Dha-Pa-Ma#-Ga-Re", "Pa-Ma#-Ga-Re-Sa"
      ],
      tips: "Half-open the top hole cleanly for accurate Teevra Ma pitch."
    },
    {
      id: 28,
      level: 'Intermediate',
      title: "28. Lower Saptak Anchor (Mandra Saptak Drill)",
      focus: "Lower Octave Resonant Tone",
      desc: "Explores the lower octave notes (P., D., N.) to develop rich, deep, warm lower-register resonance on Bansuri.",
      aroha: [
        "P.-D.-N.-Sa", "D.-N.-Sa-Re",
        "N.-Sa-Re-Ga", "Sa-Re-Ga-Ma"
      ],
      avroha: [
        "Ma-Ga-Re-Sa", "Ga-Re-Sa-N.",
        "Re-Sa-N.-D.", "Sa-N.-D.-P."
      ],
      tips: "Relax your jaw and aim warm, slow breath downward into the embouchure hole."
    },

    // ---------------- ADVANCED ALANKARS (29 - 42) ----------------
    {
      id: 29,
      level: 'Advanced',
      title: "29. Complex Vakra Six-Note Pattern (Chhanda Alankar)",
      focus: "Mental Alertness & Rapid Direction Shifts",
      desc: "A complex 6-note non-linear phrase (Sa-Re-Ga-Ma-Re-Sa) that demands high mental alertness and rapid direction changes.",
      aroha: [
        "Sa-Re-Ga-Ma-Re-Sa", "Re-Ga-Ma-Pa-Ga-Re",
        "Ga-Ma-Pa-Dha-Ma-Ga", "Ma-Pa-Dha-Ni-Pa-Ma", "Pa-Dha-Ni-Sā-Dha-Pa"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ni-Sā", "Ni-Dha-Pa-Ma-Dha-Ni",
        "Dha-Pa-Ma-Ga-Pa-Dha", "Pa-Ma-Ga-Re-Ma-Pa", "Ma-Ga-Re-Sa-Ga-Ma"
      ],
      tips: "Practice at half speed with a metronome until finger movements are completely automatic."
    },
    {
      id: 30,
      level: 'Advanced',
      title: "30. Gamak & Heavy Oscillation Drill (Gamak Pradarsan)",
      focus: "Diaphragm Pressure Pulses & Gamak",
      desc: "Employs rapid diaphragm pressure pulses on paired notes to create authentic classical Gamak ornaments.",
      aroha: [
        "Sa-Re-Sa-Re-Ga-Ma", "Re-Ga-Re-Ga-Ma-Pa",
        "Ga-Ma-Ga-Ma-Pa-Dha", "Ma-Pa-Ma-Pa-Dha-Ni", "Pa-Dha-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Sā-Ni-Dha-Pa", "Ni-Dha-Ni-Dha-Pa-Ma",
        "Dha-Pa-Dha-Pa-Ma-Ga", "Pa-Ma-Pa-Ma-Ga-Re", "Ma-Ga-Ma-Ga-Re-Sa"
      ],
      tips: "Generate the pulsation from your lower abdomen (diaphragm), not your lips."
    },
    {
      id: 31,
      level: 'Advanced',
      title: "31. Eight-Note Complex Sprint (Drut Taan Alankar)",
      focus: "High-Speed Taan & Jhala Finger Speed",
      desc: "An 8-note double phrase per breath designed to build lightning-fast finger movement for fast-tempo Jhala and Taan performance.",
      aroha: [
        "Sa-Re-Ga-Ma-Ga-Ma-Pa-Dha",
        "Re-Ga-Ma-Pa-Ma-Pa-Dha-Ni",
        "Ga-Ma-Pa-Dha-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Dha-Pa-Ma-Ga",
        "Ni-Dha-Pa-Ma-Pa-Ma-Ga-Re",
        "Dha-Pa-Ma-Ga-Ma-Ga-Re-Sa"
      ],
      tips: "Gradually build speed from 80 BPM to 160 BPM in 8th-note subdivisions."
    },
    {
      id: 32,
      level: 'Advanced',
      title: "32. Multi-Octave Leap & Return (Chhalaang Vakra)",
      focus: "Cross-Saptak Flexibility & Control",
      desc: "Leaps across octaves and immediately executes a descending 3-note phrase before leaping to the next octave note.",
      aroha: [
        "Sa-Sā-Ni-Dha", "Re-Rā-Sā-Ni",
        "Ga-Gā-Rā-Sā", "Ma-Mā-Gā-Rā"
      ],
      avroha: [
        "Sā-Sa-Re-Ga", "Ni-N.-Sa-Re",
        "Dha-D.-N.-Sa", "Pa-P.-D.-N."
      ],
      tips: "Ensure smooth transition between Mandra (lower), Madhya (middle), and Tarr (upper) octaves."
    },
    {
      id: 33,
      level: 'Advanced',
      title: "33. Murki & Micro-Ornament Pattern (Sookshma Swar)",
      focus: "Thumri & Light Classical Murki Flick",
      desc: "A 5-note rapid burst pattern (Sa-Re-Sa-Ni.-Sa) used directly in Thumri, Ghazal, and light-classical murki ornaments.",
      aroha: [
        "Sa-Re-Sa-N.-Sa", "Re-Ga-Re-Sa-Re", "Ga-Ma-Ga-Re-Ga",
        "Ma-Pa-Ma-Ga-Ma", "Pa-Dha-Pa-Ma-Pa", "Dha-Ni-Dha-Pa-Dha", "Ni-Sā-Ni-Dha-Ni"
      ],
      avroha: [
        "Sā-Rā-Sā-Ni-Sā", "Ni-Sā-Ni-Dha-Ni", "Dha-Ni-Dha-Pa-Dha",
        "Pa-Dha-Pa-Ma-Pa", "Ma-Pa-Ma-Ga-Ma", "Ga-Ma-Ga-Re-Ga", "Re-Ga-Re-Sa-Re"
      ],
      tips: "The inner notes (Re-Sa-Ni.) should be flicked gracefully without losing pitch accuracy."
    },
    {
      id: 34,
      level: 'Advanced',
      title: "34. Khatka Quad-Burst Pattern (Teevra Khatka)",
      focus: "Split-Second Four-Note Ornament Flick",
      desc: "Four notes played in a split-second flick: upper note - target note - lower note - target note. Pure master-level finger training.",
      aroha: [
        "Re-Sa-N.-Sa", "Ga-Re-Sa-Re", "Ma-Ga-Re-Ga",
        "Pa-Ma-Ga-Ma", "Dha-Pa-Ma-Pa", "Ni-Dha-Pa-Dha", "Sā-Ni-Dha-Ni"
      ],
      avroha: [
        "Rā-Sā-Ni-Sā", "Sā-Ni-Dha-Ni", "Ni-Dha-Pa-Dha",
        "Dha-Pa-Ma-Pa", "Pa-Ma-Ga-Ma", "Ma-Ga-Re-Ga", "Ga-Re-Sa-Re"
      ],
      tips: "Keep the wrist and hands relaxed; flick fingers lightly off the holes."
    },
    {
      id: 35,
      level: 'Advanced',
      title: "35. Seven-Swara Triplet Wave (Saptak Tarang)",
      focus: "7/8 Asymmetric Rhythmic Grouping",
      desc: "A 7-note ascending phrase in 7/8 or 3+4 beat division that challenges rhythm keeping and finger coordination.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Dha-Ni", "Re-Ga-Ma-Pa-Dha-Ni-Sā",
        "Ga-Ma-Pa-Dha-Ni-Sā-Rā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Ga-Re", "Ni-Dha-Pa-Ma-Ga-Re-Sa",
        "Dha-Pa-Ma-Ga-Re-Sa-N."
      ],
      tips: "Count as 1-2-3, 1-2-3-4 or practice with Rupak Taal (7 beats)."
    },
    {
      id: 36,
      level: 'Advanced',
      title: "36. Vakra Jhala Sprint (Jhala Pattern)",
      focus: "Sitar-Style High Drone Alternation",
      desc: "Mimics the rapid rhythm of sitar/sarod Jhala playing, alternating between high Sa (drone) and changing melody notes.",
      aroha: [
        "Sa-Sā-Re-Sā", "Ga-Sā-Ma-Sā",
        "Pa-Sā-Dha-Sā", "Ni-Sā-Sā-Sā"
      ],
      avroha: [
        "Sā-Sa-Ni-Sa", "Dha-Sa-Pa-Sa",
        "Ma-Sa-Ga-Sa", "Re-Sa-Sa-Sa"
      ],
      tips: "Use crisp embouchure control to switch between Madhya Sa and Tarr Sā instantly."
    },
    {
      id: 37,
      level: 'Advanced',
      title: "37. Chhalang Meend Combine (Glided Jumps)",
      focus: "Vilambit Expressive Glides with Skip",
      desc: "Combines 3-note skips with glided meend descent. Essential for expressive Vilambit and Drut khayal bansuri improvisations.",
      aroha: [
        "Sa-Pa~Ma-Ga", "Re-Dha~Pa-Ma",
        "Ga-Ni~Dha-Pa", "Ma-Sā~Ni-Dha"
      ],
      arohaTitle: "Aroha (Jump & Meend Slide)",
      avroha: [
        "Sā-Ma~Pa-Dha", "Ni-Ga~Ma-Pa",
        "Dha-Re~Ga-Ma", "Pa-Sa~Re-Ga"
      ],
      avrohaTitle: "Avroha (Jump & Reverse Meend)",
      tips: "Ensure the ~ symbol represents a continuous smooth pitch bend without re-blowing."
    },
    {
      id: 38,
      level: 'Advanced',
      title: "38. Master Jhala & Taan Sprint (Maha Palta)",
      focus: "Ultimate 12-Note Complete Taan Mastery",
      desc: "The ultimate 12-note comprehensive Palta testing full octave breath control, ultra-fast fingering, and rhythmic precision.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Ma-Ga-Re-Ga-Ma-Pa-Dha",
        "Re-Ga-Ma-Pa-Dha-Pa-Ma-Ga-Ma-Pa-Dha-Ni",
        "Ga-Ma-Pa-Dha-Ni-Dha-Pa-Ma-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Pa-Dha-Ni-Dha-Pa-Ma-Ga",
        "Ni-Dha-Pa-Ma-Ga-Ma-Pa-Dha-Pa-Ma-Ga-Re",
        "Dha-Pa-Ma-Ga-Re-Ga-Ma-Pa-Ma-Ga-Re-Sa"
      ],
      tips: "Mastering this 12-note Palta unlocks total confidence in fast classical taan improvisations."
    },
    {
      id: 39,
      level: 'Advanced',
      title: "39. 16-Swara Rapid Drut Taan Sprint (Maha Taan Sprint)",
      focus: "Full Octave Continuous Rapid Taan",
      desc: "Covers a full octave ascent and descent in a single continuous 16-note rapid phrase. Tests ultimate finger synchronization and stamina.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā"
      ],
      tips: "Keep air stream completely fluid and unbroken through all 16 notes."
    },
    {
      id: 40,
      level: 'Advanced',
      title: "40. Vakra Saptak Spiral (Vakra Sparsh Palta)",
      focus: "Non-Linear Spiral Movement for Fast Drut Bandish",
      desc: "A spiraling skip-and-return pattern (Sa-Ga-Re-Ma) that creates complex rhythmic syncopations for fast classical compositions.",
      aroha: [
        "Sa-Ga-Re-Ma", "Re-Ma-Ga-Pa", "Ga-Pa-Ma-Dha",
        "Ma-Dha-Pa-Ni", "Pa-Ni-Dha-Sā"
      ],
      avroha: [
        "Sā-Dha-Ni-Pa", "Ni-Pa-Dha-Ma", "Dha-Ma-Pa-Ga",
        "Pa-Ga-Ma-Re", "Ma-Re-Ga-Sa"
      ],
      tips: "Flick fingers lightly without applying extra pressure to tone holes."
    },
    {
      id: 41,
      level: 'Advanced',
      title: "41. Kan-Swara Touch Glide (Sparsh Swara Alankar)",
      focus: "Micro-Grace Note (Kan Swara) Precision",
      desc: "Glides between swaras with subtle grace-note touches (Kan Swaras). Imparts true classical soul and emotional depth to bansuri playing.",
      aroha: [
        "Sa~Re-Ga~Ma", "Re~Ga-Ma~Pa", "Ga~Ma-Pa~Dha",
        "Ma~Pa-Dha~Ni", "Pa~Dha-Ni~Sā"
      ],
      avroha: [
        "Sā~Ni-Dha~Pa", "Ni~Dha-Pa~Ma", "Dha~Pa-Ma~Ga",
        "Pa~Ma-Ga~Re", "Ma~Ga-Re~Sa"
      ],
      tips: "The upper grace note touch should be as light as a whisper."
    },
    {
      id: 42,
      level: 'Advanced',
      title: "42. Ultra Vakra Double Hook Palta (Anahata Palta)",
      focus: "Master-Class Rhythmic Finger Independence",
      desc: "A 12-note master-level double-hook pattern that challenges spatial finger awareness and advanced rhythmic phrasing.",
      aroha: [
        "Sa-Re-Ga-Sa-Re-Ma-Ga-Re-Ma-Ga-Pa-Ma",
        "Re-Ga-Ma-Re-Ga-Pa-Ma-Ga-Pa-Ma-Dha-Pa",
        "Ga-Ma-Pa-Ga-Ma-Dha-Pa-Ma-Dha-Pa-Ni-Dha"
      ],
      avroha: [
        "Sā-Ni-Dha-Sā-Ni-Pa-Dha-Ni-Pa-Dha-Ma-Pa",
        "Ni-Dha-Pa-Ni-Dha-Ma-Pa-Dha-Ma-Pa-Ga-Ma",
        "Dha-Pa-Ma-Dha-Pa-Ga-Ma-Pa-Ga-Ma-Re-Ga"
      ],
      tips: "Practice slowly with a metronome at 60 BPM before accelerating."
    }
  ];

  // Filter logic: Filter purely by difficulty level
  const filteredAlankars = allAlankars.filter(item => item.level === selectedLevel);

  const levelCounts = {
    Beginner: allAlankars.filter(a => a.level === 'Beginner').length,
    Intermediate: allAlankars.filter(a => a.level === 'Intermediate').length,
    Advanced: allAlankars.filter(a => a.level === 'Advanced').length,
  };

  const copyNotes = (id: number, item: AlankarItem) => {
    const textToCopy = `${item.title}\nLevel: ${item.level}\nFocus: ${item.focus}\nDescription: ${item.desc}\n\nAROHA:\n${item.aroha.join('\n')}\n\nAVROHA:\n${item.avroha.join('\n')}\n\nTips: ${item.tips || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Json-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Bansuri Alankaras Practice Guide: Beginner, Intermediate & Advanced Paltas",
          "description": "Comprehensive collection of 42 Bansuri Alankars (Paltas) categorized into Beginner, Intermediate, and Advanced levels with Swara notes, audio playback, metronome practice, and instructional tips.",
          "learningResourceType": "Practice Guide",
          "educationalLevel": ["Beginner", "Intermediate", "Advanced"],
          "publisher": {
            "@type": "Organization",
            "name": "FluteSangam"
          }
        })}
      </script>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 text-white shrink-0">
                <Music className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-1">
                  Complete Paltas &amp; Swara Exercises
                </span>
                <h1 className="text-3xl md:text-4xl font-black font-display text-bamboo-950 tracking-tight" itemProp="headline">
                  Alankars Practice Vault
                </h1>
              </div>
            </div>

            {/* Timestamps & Freshness */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 bg-amber-50/90 border border-amber-200/80 rounded-2xl px-3.5 py-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-500">Published:</span>
                <time itemProp="datePublished" dateTime="2026-07-26T00:00:00Z" className="font-semibold text-gray-900">
                  Jul 26, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-500">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-08-07T00:00:00Z" className="font-semibold text-gray-900">
                  Aug 7, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">
                <CheckCircle2 className="w-3 h-3 text-amber-700" /> 42 Paltas Included
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-gray-700 font-medium border-l-4 border-amber-400 pl-4 sm:pl-6 py-1 italic">
            In Indian classical music, <strong>Alankars (Paltas)</strong> are melodic patterns that train your fingers, breath velocity, micro-tonguing, and ear. Master all 42 structured exercises across <strong>Beginner</strong>, <strong>Intermediate</strong>, and <strong>Advanced</strong> difficulty tiers to unlock effortless flute playing!
          </p>

          {/* Quick Swara Reference Bar */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Basic Swaras Reference (Shuddha Swaras):
            </span>
            <div className="flex flex-wrap gap-2 text-sm sm:text-base font-mono font-bold text-amber-950">
              {['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', 'Sā'].map((sw, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-xl shadow-xs border border-amber-200">
                  {sw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Level Filter Bar (No Search & No 'All' Filter) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-bamboo-200 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-bamboo-950">Select Difficulty Level:</h2>
        </div>

        {/* Level Filter Tabs (Beginner, Intermediate, Advanced) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          {(['Beginner', 'Intermediate', 'Advanced'] as AlankarLevel[]).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`py-3.5 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? lvl === 'Beginner'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                      : lvl === 'Intermediate'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-600/30'
                      : 'bg-purple-700 text-white shadow-md shadow-purple-700/20 ring-2 ring-purple-700/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{lvl}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-white/25 text-white font-extrabold' : 'bg-slate-200 text-slate-700'
                }`}>
                  {levelCounts[lvl]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Metronome Widget */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-950">
          <Zap className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-extrabold text-base text-amber-950 m-0">Practice Metronome</h3>
            <p className="text-xs text-amber-800 m-0">Use this metronome for steady tempo practice.</p>
          </div>
        </div>
        <div className="max-w-md">
          <Metronome />
        </div>
      </div>

      {/* Alankar Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1 font-medium">
          <span>Displaying <strong>{filteredAlankars.length}</strong> {selectedLevel} Alankars</span>
          <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
            Real Bamboo Flute Audio
          </span>
        </div>

        {filteredAlankars.map((item) => {
          const itemSpeed = alankarSpeeds[item.id] || 1;
          return (
          <div 
            key={item.id} 
            className="bg-white border border-bamboo-200 rounded-3xl overflow-hidden shadow-xs hover:border-amber-400 transition-all space-y-0"
          >
            {/* Header Card */}
            <div className="bg-bamboo-50/80 px-5 sm:px-6 py-4 border-b border-bamboo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    item.level === 'Beginner'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : item.level === 'Intermediate'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-purple-50 text-purple-900 border-purple-300'
                  }`}>
                    {item.level} Level
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Target className="w-3 h-3 text-amber-600" /> Focus: {item.focus}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-bamboo-950 m-0">
                  {item.title}
                </h3>
              </div>

              {/* Actions: Speed Dropdown & Copy */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Speed Dropdown inside each Alankar card */}
                <div className="flex items-center gap-1.5 bg-white border border-amber-300/80 rounded-xl px-2.5 py-1.5 shadow-2xs">
                  <Gauge className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-amber-950 hidden sm:inline">Speed:</span>
                  <select
                    value={itemSpeed}
                    onChange={(e) => {
                      const newSpeed = Number(e.target.value);
                      setAlankarSpeeds(prev => ({ ...prev, [item.id]: newSpeed }));
                      if (playingAlankarId === item.id) {
                        stopAudio();
                      }
                    }}
                    className="bg-transparent text-xs font-extrabold text-amber-900 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1x Speed</option>
                    <option value={2}>2x Speed</option>
                    <option value={3}>3x Speed</option>
                    <option value={4}>4x Speed</option>
                  </select>
                </div>

                <button
                  onClick={() => copyNotes(item.id, item)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Copy notes"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-5 sm:p-6 space-y-5">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed m-0">
                {item.desc}
              </p>

              {/* Aroha Section */}
              {item.aroha && item.aroha.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                      <ArrowUpRight className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item.arohaTitle || 'Aroha (Ascending)'}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (playingAlankarId === item.id && playingType === 'aroha') {
                          stopAudio();
                        } else {
                          playSwaraSequence(item.aroha, item.id, 'aroha');
                        }
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        playingAlankarId === item.id && playingType === 'aroha'
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300/80'
                      }`}
                    >
                      {playingAlankarId === item.id && playingType === 'aroha' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-800 fill-amber-800" />}
                      <span>
                        {playingAlankarId === item.id && playingType === 'aroha' 
                          ? 'Stop Flute' 
                          : 'Play Aroha'}
                      </span>
                    </button>
                  </div>

                  <div className="font-mono text-xs sm:text-sm font-semibold text-amber-950 bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-200/80 overflow-x-auto whitespace-nowrap flex flex-col gap-1.5 leading-relaxed">
                    {item.aroha.map((line, i) => (
                      <div key={i} className="tracking-wide">{line}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avroha Section */}
              {item.avroha && item.avroha.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                      <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item.avrohaTitle || 'Avroha (Descending)'}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (playingAlankarId === item.id && playingType === 'avroha') {
                          stopAudio();
                        } else {
                          playSwaraSequence(item.avroha, item.id, 'avroha');
                        }
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        playingAlankarId === item.id && playingType === 'avroha'
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300/80'
                      }`}
                    >
                      {playingAlankarId === item.id && playingType === 'avroha' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-800 fill-emerald-800" />}
                      <span>
                        {playingAlankarId === item.id && playingType === 'avroha' 
                          ? 'Stop Flute' 
                          : 'Play Avroha'}
                      </span>
                    </button>
                  </div>

                  <div className="font-mono text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-50/70 p-3 sm:p-4 rounded-2xl border border-emerald-200/80 overflow-x-auto whitespace-nowrap flex flex-col gap-1.5 leading-relaxed">
                    {item.avroha.map((line, i) => (
                      <div key={i} className="tracking-wide">{line}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Tip */}
              {item.tips && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Teacher's Tip:</strong> {item.tips}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>

      {/* General Bansuri Alankar Practice Instructions */}
      <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-bamboo-900 m-0">How to Master Alankars on the Bansuri</h2>
        </div>
        
        <ul className="space-y-6 m-0 p-0 list-none">
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
            <div>
              <strong className="text-gray-900 block text-lg mb-1">Start Slow with Tanpura Drone:</strong>
              <span className="text-gray-600">Always practice with a Tanpura drone tuned to your flute scale (e.g. C# or E). Set metronome to 60 BPM and ensure every note is clean and centered in pitch before speeding up.</span>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
            <div>
              <strong className="text-gray-900 block text-lg mb-1">One Breath per Phrase:</strong>
              <span className="text-gray-600">Aim to play an entire phrase in a single steady diaphragmatic breath. Take quick, relaxed, silent breaths in between phrases.</span>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
            <div>
              <strong className="text-gray-900 block text-lg mb-1">Gradual Speed Progression:</strong>
              <span className="text-gray-600">Practice each alankar in three speeds (Laya): Vilambit (Slow), Madhya (Medium), and Drut (Fast). Never sacrifice note clarity or pitch accuracy for speed.</span>
            </div>
          </li>
        </ul>
      </section>

      {/* Next Lesson Banner */}
      <section className="bg-gradient-to-r from-bamboo-900 via-amber-950 to-orange-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Next Lesson in Sequence</span>
          <h3 className="text-xl sm:text-2xl font-black font-display">Daily Flute Practice Guide</h3>
          <p className="text-xs sm:text-sm text-bamboo-200 max-w-xl">
            Build a complete 30–90 minute daily routine for breath control, tone quality, finger agility, rhythm, and musical expression.
          </p>
        </div>
        <button
          onClick={() => onViewChange?.('learn_daily_practice')}
          className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
        >
          <span>Go to Daily Practice Guide</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </div>
  );
}
