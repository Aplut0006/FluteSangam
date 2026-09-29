import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, ArrowUpRight, ArrowDownRight, Lightbulb, Calendar, Clock, CheckCircle2, 
  ArrowRight, Copy, Check, Play, Pause, Sparkles, Filter, Zap, Target, Gauge
} from 'lucide-react';
import Metronome from './Metronome';
import AboutAuthorSection from './AboutAuthorSection';
import { AppView } from '../types';

interface LearnAlankarasViewProps {
  initialLevel?: AlankarLevel;
  viewMode?: 'hub' | 'level';
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

export default function LearnAlankarasView({ initialLevel, viewMode, onViewChange }: LearnAlankarasViewProps = {}) {
  const detectLevelAndMode = (): { level: AlankarLevel; isHub: boolean } => {
    if (viewMode === 'hub') return { level: 'Beginner', isHub: true };
    if (viewMode === 'level' && initialLevel) return { level: initialLevel, isHub: false };
    
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/learn/alankaras/beginner')) return { level: 'Beginner', isHub: false };
      if (path.includes('/learn/alankaras/intermediate')) return { level: 'Intermediate', isHub: false };
      if (path.includes('/learn/alankaras/advanced')) return { level: 'Advanced', isHub: false };
      if (path === '/learn/alankaras' || path === '/learn/alankaras/') return { level: 'Beginner', isHub: true };
    }
    return { level: initialLevel || 'Beginner', isHub: !initialLevel };
  };

  const detected = detectLevelAndMode();
  const [selectedLevel, setSelectedLevel] = useState<AlankarLevel>(detected.level);
  const [isHubView, setIsHubView] = useState<boolean>(detected.isHub);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [playingAlankarId, setPlayingAlankarId] = useState<number | null>(null);
  const [playingType, setPlayingType] = useState<'aroha' | 'avroha' | null>(null);
  const [alankarSpeeds, setAlankarSpeeds] = useState<Record<number, number>>({}); // Speed per alankar ID (1x, 2x, 3x, 4x)

  useEffect(() => {
    const current = detectLevelAndMode();
    setSelectedLevel(current.level);
    setIsHubView(current.isHub);
  }, [initialLevel, viewMode]);

  const handleLevelChange = (lvl: AlankarLevel) => {
    if (playingAlankarId !== null) {
      stopAudio();
    }
    setSelectedLevel(lvl);
    setIsHubView(false);

    if (typeof window !== 'undefined') {
      const targetUrl = `/learn/alankaras/${ALANKAR_LEVEL_SLUGS[lvl]}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
    }
  };

  const handleSwitchToHub = () => {
    if (playingAlankarId !== null) {
      stopAudio();
    }
    setIsHubView(true);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/learn/alankaras') {
        window.history.pushState(null, '', '/learn/alankaras');
      }
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
    'Sa': 261.63, 'Re': 293.66, 're': 277.18, 'Ga': 329.63, 'ga': 311.13, 'Ma': 349.23, 'Ma#': 369.99, 'Pa': 392.00, 'Dha': 440.00, 'dha': 415.30, 'Ni': 493.88, 'ni': 466.16,
    'Sā': 523.25, 'Rā': 587.33, 'Gā': 659.25, 'Mā': 698.46,
    'N.': 246.94, 'n.': 233.08, 'D.': 220.00, 'd.': 207.65, 'P.': 196.00
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
    const tokenRegex = /(Sā|Rā|Gā|Mā|Sa|Re|re|Ga|ga|Ma#|Ma|Pa|Dha|dha|Ni|ni|N\.|n\.|D\.|d\.|P\.)(?:~(Sā|Rā|Gā|Mā|Sa|Re|re|Ga|ga|Ma#|Ma|Pa|Dha|dha|Ni|ni|N\.|n\.|D\.|d\.|P\.))?/gi;
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
    // ---------------- BEGINNER ALANKARS (1 - 20) ----------------
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
    {
      id: 15,
      level: 'Beginner',
      title: "15. Five-Note Ascending Sweep (Panch Swara Saral)",
      focus: "Extended Breath Phrasing",
      desc: "A continuous 5-note phrase that expands breath endurance and builds smooth finger transitions across half an octave.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa", "Re-Ga-Ma-Pa-Dha",
        "Ga-Ma-Pa-Dha-Ni", "Ma-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma", "Ni-Dha-Pa-Ma-Ga",
        "Dha-Pa-Ma-Ga-Re", "Pa-Ma-Ga-Re-Sa"
      ],
      tips: "Distribute your breath evenly across all 5 notes without fading on the last note."
    },
    {
      id: 16,
      level: 'Beginner',
      title: "16. Two-Step Return Pattern (Do Kadam Wapsi)",
      focus: "Backward Recovery Finger Control",
      desc: "Steps forward 3 notes then moves backward 2 steps before advancing. Teaches finger recoil speed.",
      aroha: [
        "Sa-Re-Ga-Re-Sa", "Re-Ga-Ma-Ga-Re",
        "Ga-Ma-Pa-Ma-Ga", "Ma-Pa-Dha-Pa-Ma",
        "Pa-Dha-Ni-Dha-Pa", "Dha-Ni-Sā-Ni-Dha"
      ],
      avroha: [
        "Sā-Ni-Dha-Ni-Sā", "Ni-Dha-Pa-Dha-Ni",
        "Dha-Pa-Ma-Pa-Dha", "Pa-Ma-Ga-Ma-Pa",
        "Ma-Ga-Re-Ga-Ma", "Ga-Re-Sa-Re-Ga"
      ],
      tips: "Ensure the two backward notes have crisp, equal duration."
    },
    {
      id: 17,
      level: 'Beginner',
      title: "17. Quadruplet Repeat Pattern (Chaar Jod Alankar)",
      focus: "4-Beat Air Cut Staccato Drill",
      desc: "Repeats every swara four times consecutively. Builds solid 4-beat bar counting and precise micro-tonguing.",
      aroha: [
        "Sa-Sa-Sa-Sa", "Re-Re-Re-Re", "Ga-Ga-Ga-Ga", "Ma-Ma-Ma-Ma",
        "Pa-Pa-Pa-Pa", "Dha-Dha-Dha-Dha", "Ni-Ni-Ni-Ni", "Sā-Sā-Sā-Sā"
      ],
      avroha: [
        "Sā-Sā-Sā-Sā", "Ni-Ni-Ni-Ni", "Dha-Dha-Dha-Dha", "Pa-Pa-Pa-Pa",
        "Ma-Ma-Ma-Ma", "Ga-Ga-Ga-Ga", "Re-Re-Re-Re", "Sa-Sa-Sa-Sa"
      ],
      tips: "Use light throat taps rather than stopping airflow completely with your chest."
    },
    {
      id: 18,
      level: 'Beginner',
      title: "18. Triplet Sandalwood Step (Trikon Alankar)",
      focus: "3-Note Interlocking Steps",
      desc: "Interlocks 3-note groups by moving up two and back one in a triangle pattern. Excellent for finger agility.",
      aroha: [
        "Sa-Re-Ga-Re-Ga-Ma", "Re-Ga-Ma-Ga-Ma-Pa",
        "Ga-Ma-Pa-Ma-Pa-Dha", "Ma-Pa-Dha-Pa-Dha-Ni", "Pa-Dha-Ni-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Ni-Dha-Pa", "Ni-Dha-Pa-Dha-Pa-Ma",
        "Dha-Pa-Ma-Pa-Ma-Ga", "Pa-Ma-Ga-Ma-Ga-Re", "Ma-Ga-Re-Ga-Re-Sa"
      ],
      tips: "Keep your wrists loose and fingers curved softly over tone holes."
    },
    {
      id: 19,
      level: 'Beginner',
      title: "19. Double Skip Beginner Jump (Do Swara Chhalaang)",
      focus: "Fourth-Interval Finger Landing",
      desc: "Jumps two notes ahead to a perfect fourth interval (Sa-Ma, Re-Pa). Builds muscle memory for wide jumps.",
      aroha: [
        "Sa-Ma", "Re-Pa", "Ga-Dha",
        "Ma-Ni", "Pa-Sā"
      ],
      avroha: [
        "Sā-Pa", "Ni-Ma", "Dha-Ga",
        "Pa-Re", "Ma-Sa"
      ],
      tips: "Ensure flat finger pads seal the target tone holes instantly upon landing."
    },
    {
      id: 20,
      level: 'Beginner',
      title: "20. Lower Saptak Anchor (Mandra Sa Sanchar)",
      focus: "Deep Lower Register Grounding",
      desc: "Explores Mandra Saptak (lower octave) notes while anchoring on base Sa. Builds rich, warm low-register resonance.",
      aroha: [
        "Sa-N.-Sa", "Sa-D.-Sa", "Sa-P.-Sa",
        "Sa-Re-Sa", "Sa-Ga-Sa", "Sa-Ma-Sa", "Sa-Pa-Sa"
      ],
      avroha: [
        "Sā-Ni-Sā", "Sā-Dha-Sā", "Sā-Pa-Sā",
        "Sā-Ma-Sā", "Sā-Ga-Sā", "Sā-Re-Sā", "Sā-Sa-Sā"
      ],
      tips: "Angle your air stream slightly lower into the embouchure hole for Mandra notes."
    },

    // ---------------- INTERMEDIATE ALANKARS (21 - 40) ----------------
    {
      id: 21,
      level: 'Intermediate',
      title: "21. Five-Note Sequence (Panch Swara Alankar)",
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
      id: 22,
      level: 'Intermediate',
      title: "22. Double Skip Turnaround (Chhalang Vakra Alankar)",
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
      id: 23,
      level: 'Intermediate',
      title: "23. Reverse Triplet Pattern (Ulta Teen Swara)",
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
      id: 24,
      level: 'Intermediate',
      title: "24. Triple Swara Repeating Pattern (Trigun Swara)",
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
      id: 25,
      level: 'Intermediate',
      title: "25. Cross-Step Quadruplet (Vakra Chaar Swara - Complex)",
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
      id: 26,
      level: 'Intermediate',
      title: "26. Double Leap and Fill (Dupli-Chhalang Alankar)",
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
      id: 27,
      level: 'Intermediate',
      title: "27. Symmetrical Octave Wave (Tarr-Mandra Sanchar)",
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
      id: 28,
      level: 'Intermediate',
      title: "28. Four-Note Double Hook (Khatka Preparation Pattern)",
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
      id: 29,
      level: 'Intermediate',
      title: "29. Pyramid Skip Pattern (Swar Vistar Alankar)",
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
      id: 30,
      level: 'Intermediate',
      title: "30. Meend & Glide Preparation Alankar (Swar Sparsh)",
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
      id: 31,
      level: 'Intermediate',
      title: "31. Two-Note Skip Pattern (Do Swara Chhalang)",
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
      id: 32,
      level: 'Intermediate',
      title: "32. Six-Note Step-Back Pattern (Chhat Swara Palta)",
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
      id: 33,
      level: 'Intermediate',
      title: "33. Teevra Ma Swara Drill (Kalyan Thaat Drill)",
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
      id: 34,
      level: 'Intermediate',
      title: "34. Lower Saptak Anchor (Mandra Saptak Drill)",
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
    {
      id: 35,
      level: 'Intermediate',
      title: "35. Komal Swara Expressive Drill (Komal Swara Palta)",
      focus: "Flat Note (Komal re, ga, dha, ni) Half-Hole Precision",
      desc: "Incorporates Komal Re, Ga, Dha, and Ni flat notes to master delicate half-hole finger positions essential for Bhairavi and Todi ragas.",
      aroha: [
        "Sa-re-ga-Ma", "re-ga-Ma-Pa",
        "ga-Ma-Pa-dha", "Ma-Pa-dha-ni", "Pa-dha-ni-Sā"
      ],
      avroha: [
        "Sā-ni-dha-Pa", "ni-dha-Pa-Ma",
        "dha-Pa-Ma-ga", "Pa-Ma-ga-re", "Ma-ga-re-Sa"
      ],
      tips: "Uncover exactly 50% of the hole for precise komal swara intonation."
    },
    {
      id: 36,
      level: 'Intermediate',
      title: "36. Six-Note Cross-Leap (Chhat Swara Vakra Chhalaang)",
      focus: "Symmetrical Hook & Recoil",
      desc: "Moves five notes up, steps back to the fourth, and advances. Highly effective for building finger speed and mental tracking.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Ma", "Re-Ga-Ma-Pa-Dha-Pa",
        "Ga-Ma-Pa-Dha-Ni-Dha", "Ma-Pa-Dha-Ni-Sā-Ni"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Pa", "Ni-Dha-Pa-Ma-Ga-Ma",
        "Dha-Pa-Ma-Ga-Re-Ga", "Pa-Ma-Ga-Re-Sa-Re"
      ],
      tips: "Keep the direction-reversal note clean and well-articulated."
    },
    {
      id: 37,
      level: 'Intermediate',
      title: "37. Staccato Air-Cut Triple-Step (Bansuri Chhand Alankar)",
      focus: "Precision Micro-Tonguing Rhythms",
      desc: "Combines 3-note ascending steps with a return step. Teaches rhythmic precision and subtle breath pulses.",
      aroha: [
        "Sa-Re-Ga-Sa", "Re-Ga-Ma-Re", "Ga-Ma-Pa-Ga",
        "Ma-Pa-Dha-Ma", "Pa-Dha-Ni-Pa", "Dha-Ni-Sā-Dha"
      ],
      avroha: [
        "Sā-Ni-Dha-Sā", "Ni-Dha-Pa-Ni", "Dha-Pa-Ma-Dha",
        "Pa-Ma-Ga-Pa", "Ma-Ga-Re-Ma", "Ga-Re-Sa-Ga"
      ],
      tips: "Execute crisp staccato cuts using light throat taps."
    },
    {
      id: 38,
      level: 'Intermediate',
      title: "38. Asymmetric 5-Beat Teentaal Fill (Panchak Palta)",
      focus: "5-in-4 Cross-Rhythm Subdivision",
      desc: "Subdivides 5 swaras against standard 4-beat bar beats. Develops advanced rhythmic independence (Layakari).",
      aroha: [
        "Sa-Re-Ga-Ma-Pa", "Re-Ga-Ma-Pa-Dha",
        "Ga-Ma-Pa-Dha-Ni", "Ma-Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma", "Ni-Dha-Pa-Ma-Ga",
        "Dha-Pa-Ma-Ga-Re", "Pa-Ma-Ga-Re-Sa"
      ],
      tips: "Set metronome to 4/4 and notice how the accent shifts across beat boundaries."
    },
    {
      id: 39,
      level: 'Intermediate',
      title: "39. Double Reverse Hook (Dohra Vakra Palta)",
      focus: "Symmetrical Reverse Oscillation",
      desc: "Moves 4 notes up and steps 2 notes back in a smooth pendulum wave. Strengthens reverse finger memory.",
      aroha: [
        "Sa-Re-Ga-Ma-Ga-Re", "Re-Ga-Ma-Pa-Ma-Ga",
        "Ga-Ma-Pa-Dha-Pa-Ma", "Ma-Pa-Dha-Ni-Dha-Pa", "Pa-Dha-Ni-Sā-Ni-Dha"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Dha-Ni", "Ni-Dha-Pa-Ma-Pa-Dha",
        "Dha-Pa-Ma-Ga-Ma-Pa", "Pa-Ma-Ga-Re-Ga-Ma", "Ma-Ga-Re-Sa-Re-Ga"
      ],
      tips: "Maintain steady air velocity through the 2-note reverse movement."
    },
    {
      id: 40,
      level: 'Intermediate',
      title: "40. Deep Saptak & Tarr Shift (Trisaptak Sanchar)",
      focus: "Multi-Octave Rapid Shift",
      desc: "Shifts from Mandra (lower octave) to Tarr (upper octave) across consecutive phrases, developing embouchure flexibility.",
      aroha: [
        "N.-Sa-Re-Ga", "Sā-Ni-Dha-Pa",
        "D.-N.-Sa-Re", "Rā-Sā-Ni-Dha"
      ],
      avroha: [
        "Rā-Sā-Ni-Dha", "D.-N.-Sa-Re",
        "Sā-Ni-Dha-Pa", "N.-Sa-Re-Ga"
      ],
      tips: "Focus on lip aperture adjustment rather than pushing extra air pressure."
    },

    // ---------------- ADVANCED ALANKARS (41 - 60) ----------------
    {
      id: 41,
      level: 'Advanced',
      title: "41. Complex Vakra Six-Note Pattern (Chhanda Alankar)",
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
      id: 42,
      level: 'Advanced',
      title: "42. Gamak & Heavy Oscillation Drill (Gamak Pradarsan)",
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
      id: 43,
      level: 'Advanced',
      title: "43. Eight-Note Complex Sprint (Drut Taan Alankar)",
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
      id: 44,
      level: 'Advanced',
      title: "44. Multi-Octave Leap & Return (Chhalaang Vakra)",
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
      id: 45,
      level: 'Advanced',
      title: "45. Murki & Micro-Ornament Pattern (Sookshma Swar)",
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
      id: 46,
      level: 'Advanced',
      title: "46. Khatka Quad-Burst Pattern (Teevra Khatka)",
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
      id: 47,
      level: 'Advanced',
      title: "47. Seven-Swara Triplet Wave (Saptak Tarang)",
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
      id: 48,
      level: 'Advanced',
      title: "48. Vakra Jhala Sprint (Jhala Pattern)",
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
      id: 49,
      level: 'Advanced',
      title: "49. Chhalang Meend Combine (Glided Jumps)",
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
      id: 50,
      level: 'Advanced',
      title: "50. Master Jhala & Taan Sprint (Maha Palta)",
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
      id: 51,
      level: 'Advanced',
      title: "51. 16-Swara Rapid Drut Taan Sprint (Maha Taan Sprint)",
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
      id: 52,
      level: 'Advanced',
      title: "52. Vakra Saptak Spiral (Vakra Sparsh Palta)",
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
      id: 53,
      level: 'Advanced',
      title: "53. Kan-Swara Touch Glide (Sparsh Swara Alankar)",
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
      id: 54,
      level: 'Advanced',
      title: "54. Ultra Vakra Double Hook Palta (Anahata Palta)",
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
    },
    {
      id: 55,
      level: 'Advanced',
      title: "55. Kampit & Vibrato Micro-Bend Drill (Kampit Swara Palta)",
      focus: "Kampit Alankar & Diaphragm Pitch Bend",
      desc: "Features delicate pitch oscillations (~Kampit Swara) before escalating into rapid 4-note ascending resolution. Essential for classical ornamentation.",
      aroha: [
        "Sa~Re~Sa-Re-Ga-Ma", "Re~Ga~Re-Ga-Ma-Pa",
        "Ga~Ma~Ga-Ma-Pa-Dha", "Ma~Pa~Ma-Pa-Dha-Ni", "Pa~Dha~Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā~Ni~Sā-Ni-Dha-Pa", "Ni~Dha~Ni-Dha-Pa-Ma",
        "Dha~Pa~Dha-Pa-Ma-Ga", "Pa~Ma~Pa-Ma-Ga-Re", "Ma~Ga~Ma-Ga-Re-Sa"
      ],
      tips: "Gently pulse diaphragmatic air pressure to create natural, warm pitch waves."
    },
    {
      id: 56,
      level: 'Advanced',
      title: "56. 10-Beat Jhaptal Vakra Sprint (Jhaptal Palta)",
      focus: "10-Beat (2+3+2+3) Jhaptal Rhythm Subdivision",
      desc: "A 10-swara non-linear phrase specifically structured to fit Jhaptal (10 beats) rhythm patterns in classical bansuri concert performances.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Ma-Ga-Re-Sa-Re",
        "Re-Ga-Ma-Pa-Dha-Pa-Ma-Ga-Re-Ga",
        "Ga-Ma-Pa-Dha-Ni-Dha-Pa-Ma-Ga-Ma"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Pa-Dha-Ni-Sā-Ni",
        "Ni-Dha-Pa-Ma-Ga-Ma-Pa-Dha-Ni-Dha",
        "Dha-Pa-Ma-Ga-Re-Ga-Ma-Pa-Dha-Pa"
      ],
      tips: "Accent beats 1, 3, 6, and 8 to lock into the 2+3+2+3 Jhaptal structure."
    },
    {
      id: 57,
      level: 'Advanced',
      title: "57. 12-Beat Ektaal Fast Taan Wave (Ektaal Taan Sanchar)",
      focus: "12-Beat Ektaal High-Speed Taan",
      desc: "Extends 12 swaras in a single continuous wave across full octave boundaries, designed for fast Ektaal Drut Bandish improvisations.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Ni-Dha-Pa-Ma",
        "Re-Ga-Ma-Pa-Dha-Ni-Sā-Rā-Sā-Ni-Dha-Pa",
        "Ga-Ma-Pa-Dha-Ni-Sā-Rā-Gā-Rā-Sā-Ni-Dha"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-Re-Ga-Ma-Pa",
        "Ni-Dha-Pa-Ma-Ga-Re-Sa-N.-Sa-Re-Ga-Ma",
        "Dha-Pa-Ma-Ga-Re-Sa-N.-D.-N.-Sa-Re-Ga"
      ],
      tips: "Keep fingertips relaxed and close to tone holes for instant 12th-note speed."
    },
    {
      id: 58,
      level: 'Advanced',
      title: "58. Double Khatka-Murki Combination (Khatka-Murki Sanchar)",
      focus: "Compound Fast Classical Ornamentation",
      desc: "Combines a 5-note Murki flick with a 4-note Khatka turnaround in a single breath phrase. Found in thumri and drut khayal bansuri solos.",
      aroha: [
        "Sa-Re-Sa-N.-Sa-Re-Ga-Re-Sa-Re",
        "Re-Ga-Re-Sa-Re-Ga-Ma-Ga-Re-Ga",
        "Ga-Ma-Ga-Re-Ga-Ma-Pa-Ma-Ga-Ma",
        "Ma-Pa-Ma-Ga-Ma-Pa-Dha-Pa-Ma-Pa",
        "Pa-Dha-Pa-Ma-Pa-Dha-Ni-Dha-Pa-Dha"
      ],
      avroha: [
        "Sā-Rā-Sā-Ni-Sā-Sā-Ni-Dha-Ni-Sā",
        "Ni-Sā-Ni-Dha-Ni-Ni-Dha-Pa-Dha-Ni",
        "Dha-Ni-Dha-Pa-Dha-Dha-Pa-Ma-Pa-Dha",
        "Pa-Dha-Pa-Ma-Pa-Pa-Ma-Ga-Ma-Pa",
        "Ma-Pa-Ma-Ga-Ma-Ma-Ga-Re-Ga-Ma"
      ],
      tips: "Ensure the ornament flick is ultra-fast while the target note remains steady."
    },
    {
      id: 59,
      level: 'Advanced',
      title: "59. Master Trisaptak Ultra Sprint (Maha Trisaptak Chhalaang)",
      focus: "Extreme 3-Octave Leap Synchronization",
      desc: "Leaps instantaneously across all three saptaks (Mandra, Madhya, Tarr) in alternating octave leaps. The ultimate test of embouchure precision.",
      aroha: [
        "P.-Sa-P.-Sā", "D.-Re-D.-Rā",
        "N.-Ga-N.-Gā", "Sa-Ma-Sā-Mā"
      ],
      avroha: [
        "Sā-P.-Sā-Sa", "Rā-D.-Rā-Re",
        "Gā-N.-Gā-Ga", "Mā-Sa-Mā-Ma"
      ],
      tips: "Aperture adjustment must happen at the exact millisecond of finger placement."
    },
    {
      id: 60,
      level: 'Advanced',
      title: "60. Infinite Spiral Vakra Palta (Ananta Vakra Sanchar)",
      focus: "Complete Octave Non-Linear Master Taan",
      desc: "The grand master 18-swara non-linear spiral Palta spanning the full compass of Hindustani classical flute mastery.",
      aroha: [
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-N.-Sa",
        "Re-Ga-Ma-Pa-Dha-Ni-Sā-Rā-Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-Re",
        "Ga-Ma-Pa-Dha-Ni-Sā-Rā-Gā-Rā-Sā-Ni-Dha-Pa-Ma-Ga-Re-Ga"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Rā-Sā",
        "Ni-Dha-Pa-Ma-Ga-Re-Sa-N.-Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Ni",
        "Dha-Pa-Ma-Ga-Re-Sa-N.-D.-N.-Sa-Re-Ga-Ma-Pa-Dha-Ni-Dha"
      ],
      tips: "Mastering this 60th Palta represents peak finger independence, breath control, and classical bansuri command."
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
    <div className="w-full max-w-6xl mx-auto space-y-8 font-sans" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Json-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": isHubView 
            ? "Bansuri Alankar Practice Guide: Master 60 Sargam Paltas"
            : `Bansuri ${selectedLevel} Alankaras Practice Guide (20 ${selectedLevel} Paltas)`,
          "description": isHubView
            ? "Master Indian bamboo flute with our complete guide to 60 Bansuri Alankars (Paltas). Discover practice methodology, octave navigation, and structured exercises across all levels."
            : selectedLevel === 'Beginner'
            ? "Master 20 beginner bansuri alankars (sargam paltas) on Indian bamboo flute. Practice fundamental Sa Re Ga Ma notes, double swaras, 3 & 4 note patterns, metronome timing, and finger agility."
            : selectedLevel === 'Intermediate'
            ? "Master 20 intermediate bansuri alankars (sargam paltas) on Indian bamboo flute. Practice vakra cross-steps, double-skips, komal swaras, half-hole fingerings, speed variations, and rhythmic laya drills."
            : "Master 20 advanced bansuri alankars (master paltas) on Indian bamboo flute. Practice fast drut taan sprints, khatka-murki ornaments, gamak oscillations, 3-octave leaps, and jhala speed drills.",
          "learningResourceType": "Practice Guide",
          "educationalLevel": isHubView ? ["Beginner", "Intermediate", "Advanced"] : [selectedLevel],
          "publisher": {
            "@type": "Organization",
            "name": "FluteSangam"
          }
        })}
      </script>

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs font-semibold text-bamboo-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link 
          to="/" 
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              onViewChange?.('home');
            }
          }}
          className="hover:text-amber-700 transition shrink-0"
        >
          Home
        </Link>
        <ArrowRight className="w-3 h-3 text-bamboo-400 shrink-0" />
        <Link 
          to="/learn/alankaras" 
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !isHubView) {
              e.preventDefault();
              handleSwitchToHub();
            }
          }}
          className={`hover:text-amber-700 transition shrink-0 ${isHubView ? 'text-amber-900 font-bold' : ''}`}
        >
          Alankars Vault
        </Link>
        {!isHubView && (
          <>
            <ArrowRight className="w-3 h-3 text-bamboo-400 shrink-0" />
            <span className="text-amber-900 font-bold truncate">
              {selectedLevel} Exercises (20 Paltas)
            </span>
          </>
        )}
      </nav>

      {isHubView ? (
        /* ========================================================================= */
        /* HUB VIEW: Comprehensive Guide & Level Selector (Canonical: /learn/alankaras) */
        /* ========================================================================= */
        <div className="space-y-8">
          {/* Main Hero Banner */}
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
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-bamboo-950 tracking-tight" itemProp="headline">
                      Bansuri Alankar Practice Guide: Master 60 Sargam Paltas
                    </h1>
                  </div>
                </div>

                {/* Freshness & Badge */}
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
                    <time itemProp="dateModified" dateTime="2026-09-29T00:00:00Z" className="font-semibold text-gray-900">
                      Sep 29, 2026
                    </time>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">
                    <CheckCircle2 className="w-3 h-3 text-amber-700" /> 60 Paltas Across 3 Levels
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-gray-700 font-medium border-l-4 border-amber-400 pl-4 sm:pl-6 py-1 italic">
                In Indian classical music, <strong>Alankars (melodic ornaments or Paltas)</strong> are structured swara permutations that develop muscle memory, breath support, pitch centering, and finger speed. Our 60-palta curriculum is structured across three difficulty tiers to guide your flute journey from foundational scales to virtuoso taans.
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

          {/* LEVEL SELECTOR CARDS (3 Tiers Summary) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-bamboo-950">Select Your Practice Tier:</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Click any tier to open its 20 exercises</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Beginner Card */}
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-200">
                      Tier 1: Beginner
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                      20 Exercises
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    Fundamental Sargam Paltas
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sa Re Ga Ma step progressions, double-note repetitions (SaSa ReRe), 3-note and 4-note consecutive intervals. Ideal for developing clean tone and finger sealing.
                  </p>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] font-mono text-emerald-950 space-y-1">
                    <span className="font-sans font-bold text-emerald-900 block text-[10px] uppercase tracking-wider">Sample Notation (Palta 2):</span>
                    <div>Sa-Sa Re-Re Ga-Ga Ma-Ma Pa-Pa Dha-Dha Ni-Ni Sā-Sā</div>
                  </div>
                </div>

                <Link
                  to="/learn/alankaras/beginner"
                  onClick={() => handleLevelChange('Beginner')}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Open 20 Beginner Exercises</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Intermediate Card */}
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border border-amber-200">
                      Tier 2: Intermediate
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg">
                      20 Exercises
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                    Vakra &amp; Cross-Step Paltas
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Note-skipping patterns (Sa-Ga, Re-Ma), zigzag vakra steps, half-hole intonation drills, and rhythmic syncopation across Teentaal cycles.
                  </p>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px] font-mono text-amber-950 space-y-1">
                    <span className="font-sans font-bold text-amber-900 block text-[10px] uppercase tracking-wider">Sample Notation (Palta 21):</span>
                    <div>Sa-Re-Ga-Sa | Re-Ga-Ma-Re | Ga-Ma-Pa-Ga</div>
                  </div>
                </div>

                <Link
                  to="/learn/alankaras/intermediate"
                  onClick={() => handleLevelChange('Intermediate')}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Open 20 Intermediate Exercises</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Advanced Card */}
              <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-xs hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-100 text-purple-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border border-purple-200">
                      Tier 3: Advanced
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg">
                      20 Exercises
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition">
                    Master Virtuoso &amp; Drut Taans
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Complex 16-note spiral taans, rapid Gamak throat oscillations, 3-octave leaps (Mandra to Taar Saptak), and lightning Jhala speed drills.
                  </p>

                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] font-mono text-purple-950 space-y-1">
                    <span className="font-sans font-bold text-purple-900 block text-[10px] uppercase tracking-wider">Sample Notation (Palta 41):</span>
                    <div>Sa-Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa | Re-Rā-Sā-Ni-Dha</div>
                  </div>
                </div>

                <Link
                  to="/learn/alankaras/advanced"
                  onClick={() => handleLevelChange('Advanced')}
                  className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Open 20 Advanced Exercises</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* THE 4 PILLARS OF ALANKAR SADHANA */}
          <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-bamboo-900 m-0">The 4 Pillars of Alankar Sadhana</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm text-gray-700">
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                <strong className="text-amber-950 font-bold block text-sm">1. Intonation &amp; Breath Steadying</strong>
                <p className="leading-relaxed text-gray-600">
                  Practicing straight notes in slow tempo (Vilambit laya) trains diaphragmatic stability, preventing pitch flattening when transitioning between low (Mandra) and middle (Madhya) octaves.
                </p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                <strong className="text-amber-950 font-bold block text-sm">2. Finger Muscle Memory</strong>
                <p className="leading-relaxed text-gray-600">
                  Repetitive swara permutations program finger pads to seal holes instinctively, removing awkward delays when playing fast Bandishes or Raga Taans.
                </p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                <strong className="text-amber-950 font-bold block text-sm">3. Vakra &amp; Cross-Finger Agility</strong>
                <p className="leading-relaxed text-gray-600">
                  Non-linear skipping patterns (e.g. Sa-Ga, Re-Ma, Ga-Pa) develop independent tendon control in the ring and pinky fingers, essential for expressive Indian classical flute.
                </p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                <strong className="text-amber-950 font-bold block text-sm">4. Multi-Speed Mastery (Laya Triad)</strong>
                <p className="leading-relaxed text-gray-600">
                  Always practice in three distinct speeds: <em>Ekgun</em> (1 note per beat at 60 BPM), <em>Dugun</em> (2 notes per beat at 120 BPM), and <em>Chaugun</em> (4 notes per beat at 240 BPM).
                </p>
              </div>
            </div>
          </section>

          {/* SANSKRIT VARNA CLASSIFICATION & THEORY */}
          <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-bamboo-900 m-0">The 4 Classical Varna Classifications (Ancient Shastric Origins)</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              In ancient Indian music treatises including Bharata Muni's <em>Natya Shastra</em> and Sarangadeva's <em>Sangita Ratnakara</em>, musical movement is categorized into four primary <strong>Varnas</strong> (melodic motions). Every Alankar is built upon these four core movements:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-bamboo-900 text-sm">1. Sthayi Varna</span>
                  <span className="text-[10px] uppercase font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Static Hold</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Repetition of the same note without pitch shift (e.g. <em>Sa-Sa-Sa, Re-Re-Re</em>). Essential on flute for establishing embouchure centering and breath steadiness.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-sm">2. Arohi Varna</span>
                  <span className="text-[10px] uppercase font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">Ascending Motion</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Continuous upward movement from lower to higher frequencies (e.g. <em>Sa Re Ga Ma Pa Dha Ni Sā</em>). Trains progressive finger lifting and micro-air acceleration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-sm">3. Avarohi Varna</span>
                  <span className="text-[10px] uppercase font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">Descending Motion</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Continuous downward movement from higher to lower frequencies (e.g. <em>Sā Ni Dha Pa Ma Ga Re Sa</em>). Trains precision hole closing and lower octave air relaxation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 text-sm">4. Sanchari Varna</span>
                  <span className="text-[10px] uppercase font-mono font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">Mixed / Spiral Motion</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Complex permutations blending ascending, descending, and jumping contours (e.g. <em>Sa-Ga-Re-Ma, Sa-Re-Ga-Sa</em>). Forms the basis of all intermediate and advanced Taans.
                </p>
              </div>
            </div>
          </section>

          {/* HOW TO ADAPT ALANKARS ACROSS THE 10 THAATS */}
          <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-bamboo-900 m-0">Adapting Alankars Across the 10 Hindustani Thaats</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Once you master the standard Shuddha Swara Alankars in <strong>Bilawal Thaat</strong> (all natural notes), transfer the exact same finger formulas to other Thaats by introducing Komal (flat) and Tivra (sharp) notes. This prepares you directly for Classical Ragas:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-bamboo-50 border-b border-bamboo-200 text-bamboo-950 font-bold">
                    <th className="py-2.5 px-3">Thaat Name</th>
                    <th className="py-2.5 px-3">Swara Structure</th>
                    <th className="py-2.5 px-3">Bansuri Half-Hole Technique</th>
                    <th className="py-2.5 px-3">Representative Ragas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-bamboo-900">Bilawal Thaat</td>
                    <td className="py-2.5 px-3 font-mono">Sa Re Ga Ma Pa Dha Ni</td>
                    <td className="py-2.5 px-3">All natural full finger seals</td>
                    <td className="py-2.5 px-3">Alhaiya Bilawal, Deskar</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-2.5 px-3 font-bold text-amber-950">Kalyan Thaat</td>
                    <td className="py-2.5 px-3 font-mono text-amber-900">Sa Re Ga <strong>Ma#</strong> Pa Dha Ni</td>
                    <td className="py-2.5 px-3">Open hole 4 half for Tivra Ma</td>
                    <td className="py-2.5 px-3">Raga Yaman, Shuddha Kalyan</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-bamboo-900">Khamaj Thaat</td>
                    <td className="py-2.5 px-3 font-mono">Sa Re Ga Ma Pa Dha <strong>ni</strong></td>
                    <td className="py-2.5 px-3">Half seal hole 1 for Komal Ni</td>
                    <td className="py-2.5 px-3">Raga Khamaj, Desh, Tilang</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-2.5 px-3 font-bold text-amber-950">Kafi Thaat</td>
                    <td className="py-2.5 px-3 font-mono text-amber-900">Sa Re <strong>ga</strong> Ma Pa Dha <strong>ni</strong></td>
                    <td className="py-2.5 px-3">Half seal hole 3 (ga) &amp; hole 1 (ni)</td>
                    <td className="py-2.5 px-3">Raga Kafi, Bageshree, Bhimpalasi</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-bamboo-900">Bhairav Thaat</td>
                    <td className="py-2.5 px-3 font-mono">Sa <strong>re</strong> Ga Ma Pa <strong>dha</strong> Ni</td>
                    <td className="py-2.5 px-3">Half seal hole 2 (dha) &amp; hole 5 (re)</td>
                    <td className="py-2.5 px-3">Raga Bhairav, Ahir Bhairav</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-2.5 px-3 font-bold text-amber-950">Bhairavi Thaat</td>
                    <td className="py-2.5 px-3 font-mono text-amber-900">Sa <strong>re ga</strong> Ma Pa <strong>dha ni</strong></td>
                    <td className="py-2.5 px-3">All 4 Komal half-hole adjustments</td>
                    <td className="py-2.5 px-3">Raga Bhairavi, Malkauns</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* LAYA SPEED REFERENCE & PRACTICE CALCULATOR */}
          <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-bamboo-900 m-0">Laya (Tempo) Progression Reference Table</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              In Bansuri riyaz, speed is a byproduct of relaxed accuracy, never muscle tension. Use this metric to measure your Palta speed benchmarks:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Vilambit (Slow)</span>
                <span className="text-lg font-black text-bamboo-950 block">40–60 BPM</span>
                <span className="text-[11px] text-gray-600 block">1 Swara / Beat (Tone &amp; Breath)</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">Madhya (Medium)</span>
                <span className="text-lg font-black text-amber-950 block">80–120 BPM</span>
                <span className="text-[11px] text-amber-900 block">2 Swaras / Beat (Dugun Laya)</span>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-orange-700 block">Drut (Fast)</span>
                <span className="text-lg font-black text-orange-950 block">140–200 BPM</span>
                <span className="text-[11px] text-orange-900 block">4 Swaras / Beat (Chaugun Laya)</span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-700 block">Ati-Drut (Virtuoso)</span>
                <span className="text-lg font-black text-purple-950 block">240+ BPM</span>
                <span className="text-[11px] text-purple-900 block">8 Swaras / Beat (Athgun Sprints)</span>
              </div>
            </div>
          </section>

          {/* Daily Practice Protocol */}
          <section className="bg-gradient-to-br from-amber-50 to-sand-100 border border-amber-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-amber-950">Recommended Daily 30-Minute Alankar Routine</h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                <div>
                  <strong>Minutes 0–10 (Long-Note Kharaj Riyaz):</strong> Hold low Sa, Ni, Dha, Pa notes for 15–20 seconds each with Tanpura drone at 60 BPM.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                <div>
                  <strong>Minutes 10–20 (Tier Exercises in 3 Layas):</strong> Pick 3–4 Alankars from your current tier. Play 5 cycles each in Vilambit, Dugun, and Chaugun.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                <div>
                  <strong>Minutes 20–30 (Speed Sprints &amp; Musical Application):</strong> Increase metronome to 140+ BPM for finger sprint drills, then conclude by improvising melodic phrases.
                </div>
              </div>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS ON ALANKARS */}
          <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-bamboo-900 m-0">Frequently Asked Questions: Bansuri Alankars</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sand-50/60 border border-sand-200/80 space-y-1.5">
                <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Q: How many alankars should I practice each day?</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Quality and steadiness surpass quantity. It is far more effective to practice <strong>3 to 5 Alankars thoroughly in 3 speeds (Vilambit, Madhya, Drut)</strong> with a Tanpura drone for 20 minutes than rushing through 20 patterns without intonation precision.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sand-50/60 border border-sand-200/80 space-y-1.5">
                <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Q: What is the difference between an Alankar and a Taan?</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  An <strong>Alankar (Palta)</strong> is a rigid, mathematical, symmetrical swara exercise practiced across the full octave to build technical dexterity. A <strong>Taan</strong> is a musical phrase played at fast speed during a classical Raga performance, strictly adhering to the Raga's specific melodic rules (Vadi, Samvadi, Varjit swaras, and Pakad).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sand-50/60 border border-sand-200/80 space-y-1.5">
                <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Q: Should I tongue every note or use continuous breath during Alankars?</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Both are practiced: <em>Legato / Meend Alankars</em> use a single continuous breath with finger articulative pulses, while <em>Staccato / Taan Alankars</em> use gentle throat and micro-tongue pulses (soft 'Da' or 'Ta-Ka') to give rhythmic punch to fast taans.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sand-50/60 border border-sand-200/80 space-y-1.5">
                <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Q: Why do my fingers stumble more in Avaroha (descending) than Aroha (ascending)?</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Ascending involves lifting fingers (releasing tension), whereas descending requires sealing holes simultaneously without air leaks. To fix this, practice Avaroha separately at half the metronome speed (e.g. 50 BPM) focusing on flattening the finger pads directly over the center of the tone holes.
                </p>
              </div>
            </div>
          </section>

          {/* Next Lesson Banner */}
          <section className="bg-gradient-to-r from-bamboo-900 via-amber-950 to-orange-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Next Step in Learning Path</span>
              <h3 className="text-xl sm:text-2xl font-black font-display">Daily Flute Practice Routine</h3>
              <p className="text-xs sm:text-sm text-bamboo-200 max-w-xl">
                Build a complete daily routine covering breath control, tone quality, finger agility, rhythm, and classical expression.
              </p>
            </div>
            <Link
              to="/learn/daily-practice-guide"
              onClick={() => onViewChange?.('learn_daily_practice')}
              className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <span>Go to Practice Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* Author Section */}
          <AboutAuthorSection onViewChange={onViewChange} />
        </div>
      ) : (
        /* ========================================================================= */
        /* LEVEL DETAIL VIEW: 20 Full Exercises for Beginner / Intermediate / Advanced */
        /* ========================================================================= */
        <div className="space-y-8">
          {/* Main Header Banner */}
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white shrink-0 ${
                    selectedLevel === 'Beginner'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                      : selectedLevel === 'Intermediate'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20'
                      : 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-purple-500/20'
                  }`}>
                    <Music className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-1">
                      {selectedLevel} Tier Practice Vault
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-bamboo-950 tracking-tight" itemProp="headline">
                      {selectedLevel === 'Beginner' && 'Beginner Bansuri Alankars (20 Fundamental Paltas)'}
                      {selectedLevel === 'Intermediate' && 'Intermediate Bansuri Alankars (20 Vakra & Cross-Step Paltas)'}
                      {selectedLevel === 'Advanced' && 'Advanced Bansuri Alankars (20 Master Virtuoso Paltas)'}
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
                    <CheckCircle2 className="w-3 h-3 text-amber-700" /> 20 Full Exercises Included
                  </span>
                </div>
              </div>

              {/* Distinctive Educational Intro Text Per Level */}
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 font-medium border-l-4 border-amber-400 pl-4 sm:pl-6 py-1 italic">
                {selectedLevel === 'Beginner' && (
                  <>
                    These 20 foundational beginner Alankars build stable finger sealing, clean blowhole embouchure contact, and steady diaphragmatic breath velocity. Master every palta at 60 BPM before increasing tempo.
                  </>
                )}
                {selectedLevel === 'Intermediate' && (
                  <>
                    These 20 intermediate Alankars introduce vakra (crooked) stepping, interval skips, half-hole fingerings for Komal/Tivra swaras, and rhythm changes across Teentaal cycles.
                  </>
                )}
                {selectedLevel === 'Advanced' && (
                  <>
                    These 20 master Alankars train high-speed drut taan sprints, Gamak throat oscillations, 3-octave leaps between Mandra and Taar Saptaks, and concert-grade classical embellishments (Khatka/Murki).
                  </>
                )}
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

          {/* Difficulty Level Switcher Tabs */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-bamboo-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-bamboo-950">Practice Level Selector:</h2>
              </div>
              <Link
                to="/learn/alankaras"
                onClick={handleSwitchToHub}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>View Full Overview Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Level Filter Tabs (Beginner, Intermediate, Advanced) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {(['Beginner', 'Intermediate', 'Advanced'] as AlankarLevel[]).map((lvl) => {
                const isSelected = selectedLevel === lvl;
                const targetPath = `/learn/alankaras/${ALANKAR_LEVEL_SLUGS[lvl]}`;
                return (
                  <Link
                    key={lvl}
                    to={targetPath}
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
                  </Link>
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
                <p className="text-xs text-amber-800 m-0">Set your target tempo (Vilambit: 60 BPM, Madhya: 120 BPM, Drut: 180+ BPM).</p>
              </div>
            </div>
            <div className="max-w-md">
              <Metronome />
            </div>
          </div>

          {/* ALL 20 ALANKAR CARDS FOR THE CURRENT LEVEL */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1 font-medium">
              <span>Displaying <strong>{filteredAlankars.length}</strong> {selectedLevel} Alankars</span>
              <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                Real Bamboo Flute Audio
              </span>
            </div>

            {filteredAlankars.map((item, index) => {
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
                      <div className="flex items-center gap-1.5 bg-white border border-amber-300/80 rounded-xl px-2.5 py-1.5 shadow-2xs">
                        <Gauge className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <label htmlFor={`alankar-speed-select-${item.id}`} className="text-xs font-bold text-amber-950 hidden sm:inline">Speed:</label>
                        <select
                          id={`alankar-speed-select-${item.id}`}
                          value={itemSpeed}
                          onChange={(e) => {
                            const newSpeed = Number(e.target.value);
                            setAlankarSpeeds(prev => ({ ...prev, [item.id]: newSpeed }));
                            if (playingAlankarId === item.id) {
                              stopAudio();
                            }
                          }}
                          className="bg-transparent text-xs font-extrabold text-amber-950 focus:outline-none cursor-pointer min-h-[44px] py-2"
                          aria-label={`Playback speed for ${item.title}`}
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

          {/* Next Level Progression Banner */}
          <section className="bg-gradient-to-r from-bamboo-900 via-amber-950 to-orange-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Next Step in Curriculum</span>
              <h3 className="text-xl sm:text-2xl font-black font-display">
                {selectedLevel === 'Beginner' && 'Advance to Intermediate Alankars'}
                {selectedLevel === 'Intermediate' && 'Advance to Master Virtuoso Alankars'}
                {selectedLevel === 'Advanced' && 'Apply Alankar Mastery to Classical Ragas'}
              </h3>
              <p className="text-xs sm:text-sm text-bamboo-200 max-w-xl">
                {selectedLevel === 'Beginner' && 'Ready for vakra cross-stepping and note skipping? Master 20 intermediate paltas.'}
                {selectedLevel === 'Intermediate' && 'Mastered note skips? Unlock concert-grade drut taans and gamak throat oscillations.'}
                {selectedLevel === 'Advanced' && 'Explore all 23 Classical Hindustani Ragas with Aaroh, Avroh, Pakad, and Bandishes.'}
              </p>
            </div>
            {selectedLevel === 'Beginner' && (
              <Link
                to="/learn/alankaras/intermediate"
                onClick={() => handleLevelChange('Intermediate')}
                className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                <span>Go to Intermediate Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {selectedLevel === 'Intermediate' && (
              <Link
                to="/learn/alankaras/advanced"
                onClick={() => handleLevelChange('Advanced')}
                className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                <span>Go to Advanced Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {selectedLevel === 'Advanced' && (
              <Link
                to="/learn/raagas"
                onClick={() => onViewChange?.('learn_raagas')}
                className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                <span>Explore Classical Ragas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </section>

          {/* Author Section */}
          <AboutAuthorSection onViewChange={onViewChange} />
        </div>
      )}
    </div>
  );
}
