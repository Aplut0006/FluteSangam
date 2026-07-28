import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Sparkles, RefreshCw, Play, Pause, Copy, Download, Bookmark, 
  Share2, RotateCcw, Zap, Sliders, Check, Layers, Shuffle, 
  ArrowUpRight, ArrowDownRight, BookmarkCheck, Trash2, Wind, Binary, Cpu, ChevronDown
} from 'lucide-react';
import * as Tone from 'tone';
import { UserProfile } from '../types';

export interface AlankarPattern {
  id: string;
  number: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  patternType: string;
  scale: string;
  tempo: number;
  estimatedTimeMinutes: number;
  aroha: string[];
  avroha: string[];
  notesGuide?: string;
  description?: string;
  formula?: string;
  mathSeed?: number;
}

const SCALE_OPTIONS = [
  "C Middle", "C# Middle", "D Middle", "D# Middle", 
  "E Middle", "F Middle", "F# Middle", "G Base", 
  "G# Base", "A Base", "A# Base", "B Base", "C Base"
];

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const PATTERN_TYPE_OPTIONS = [
  "All Patterns",
  "Linear (Straight Aroha/Avroha)",
  "Skip Note (Reverse/Jump)",
  "Triplet / Chautal (3-Note)",
  "Quadruplet (4-Note Groups)",
  "Double Swara (Repeat)",
  "Zigzag / Vakra Loop",
  "Gamak & Ornamented",
  "Complex Combinations"
];

// Swara sequence definition across two octaves for procedural calculation
const SWARAS_ASCENDING = [
  "Sa", "Re", "Ga", "Ma", "Pa", "Dha", "Ni", "Sa'", "Re'", "Ga'", "Ma'", "Pa'"
];

const SWARAS_DESCENDING = [
  "Sa'", "Ni", "Dha", "Pa", "Ma", "Ga", "Re", "Sa", "Ni.", "Dha.", "Pa."
];

// Helper to safely get swara at index
function getAscendingSwara(idx: number): string {
  if (idx < 0) return "Sa.";
  if (idx >= SWARAS_ASCENDING.length) return SWARAS_ASCENDING[SWARAS_ASCENDING.length - 1];
  return SWARAS_ASCENDING[idx];
}

function getDescendingSwara(idx: number): string {
  if (idx < 0) return "Sa'";
  if (idx >= SWARAS_DESCENDING.length) return SWARAS_DESCENDING[SWARAS_DESCENDING.length - 1];
  return SWARAS_DESCENDING[idx];
}

/**
 * MATH-BASED PROCEDURAL ALANKAR GENERATOR ENGINE
 * Generates unique, mathematically valid Alankar patterns.
 */
function getAlankarSignature(item: { aroha: string[]; avroha: string[] }): string {
  return `${item.aroha.join('\n')}::${item.avroha.join('\n')}`;
}

function generateProceduralAlankar(
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  patternTypeFilter: string,
  scale: string,
  bpm: number,
  number: number = 1,
  excludeSignatures?: Set<string>
): AlankarPattern {
  for (let attempt = 0; attempt < 250; attempt++) {
    const seed = Math.floor(Math.random() * 900000) + 100000;
    
    // Decide pattern category if "All Patterns" selected
    let targetPatternType = patternTypeFilter;
    if (targetPatternType === 'All Patterns') {
      const categories = [
        "Linear (Straight Aroha/Avroha)",
        "Skip Note (Reverse/Jump)",
        "Triplet / Chautal (3-Note)",
        "Quadruplet (4-Note Groups)",
        "Double Swara (Repeat)",
        "Zigzag / Vakra Loop",
        "Gamak & Ornamented",
        "Complex Combinations"
      ];
      if (difficulty === 'Beginner') {
        const beginnerChoices = [categories[0], categories[1], categories[2], categories[4]];
        targetPatternType = beginnerChoices[Math.floor(Math.random() * beginnerChoices.length)];
      } else if (difficulty === 'Intermediate') {
        const interChoices = [categories[1], categories[2], categories[3], categories[4], categories[5]];
        targetPatternType = interChoices[Math.floor(Math.random() * interChoices.length)];
      } else {
        const advChoices = [categories[3], categories[5], categories[6], categories[7]];
        targetPatternType = advChoices[Math.floor(Math.random() * advChoices.length)];
      }
    }

    let offsets: number[] = [0];
    let repeatCount = 1;
    let repeatPattern: number[] | undefined = undefined;
    let ornamentType: 'none' | 'grace' | 'meend' | 'krintan' | 'kampit' = 'none';
    let isPyramid = false;
    let stride = 1;
    let customTitle = "";
    let desc = "";

    const isLinear = targetPatternType.includes('Linear');
    const isSkip = targetPatternType.includes('Skip');
    const isTriplet = targetPatternType.includes('Triplet');
    const isQuadruplet = targetPatternType.includes('Quadruplet');
    const isDouble = targetPatternType.includes('Double');
    const isZigzag = targetPatternType.includes('Zigzag');
    const isGamak = targetPatternType.includes('Gamak');
    const isComplex = targetPatternType.includes('Complex');

    if (isDouble) {
      repeatCount = difficulty === 'Beginner' ? 2 : difficulty === 'Intermediate' ? (Math.random() > 0.4 ? 2 : 3) : (Math.random() > 0.5 ? 3 : 4);
      const len = difficulty === 'Beginner' ? (Math.random() > 0.5 ? 1 : 2) : difficulty === 'Intermediate' ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 3) + 3;
      
      // Dynamic offset vectors for repeat patterns
      const offsetPool = [
        Array.from({ length: len }, (_, i) => i),
        Array.from({ length: len }, (_, i) => i * 2),
        [0, 2, 1, 3].slice(0, len),
        [0, 1, 3, 2].slice(0, len),
        [0, 3, 1, 4, 2].slice(0, len),
        [0, 2, 4, 1, 3].slice(0, len),
        [0, 1, 2, 0].slice(0, len),
        [0, 3, 2, 1, 4].slice(0, len)
      ];
      offsets = offsetPool[Math.floor(Math.random() * offsetPool.length)];

      if (Math.random() > 0.5 && len > 1) {
        // Alternating repeat count pattern (e.g., [2, 1, 2] or [3, 2, 3])
        const r1 = repeatCount;
        const r2 = Math.max(1, repeatCount - 1);
        repeatPattern = Array.from({ length: len }, (_, i) => (i % 2 === 0 ? r1 : r2));
      }

      customTitle = `Jod Repeat Vector (${repeatPattern ? repeatPattern.join('x-') + 'x' : repeatCount + 'x'} Swara)`;
      desc = `Procedurally calculated note repetition for finger articulation and throat control.`;
    } else if (isLinear) {
      const lenOptions = difficulty === 'Beginner' ? [2, 3, 4] : difficulty === 'Intermediate' ? [4, 5, 6] : [5, 6, 7, 8];
      const len = lenOptions[Math.floor(Math.random() * lenOptions.length)];
      stride = (difficulty === 'Advanced') ? (Math.random() > 0.5 ? 2 : Math.random() > 0.7 ? 3 : 1) : (difficulty === 'Intermediate' && Math.random() > 0.6) ? 2 : 1;
      
      const motionType = Math.random();
      if (motionType < 0.6) {
        offsets = Array.from({ length: len }, (_, i) => i);
      } else if (motionType < 0.8) {
        // Loop return e.g. [0, 1, 2, 1]
        const half = Math.ceil(len / 2);
        const firstHalf = Array.from({ length: half }, (_, i) => i);
        const secondHalf = Array.from({ length: len - half }, (_, i) => Math.max(0, half - 2 - i));
        offsets = [...firstHalf, ...secondHalf];
      } else {
        // Staggered step sequence
        offsets = [0];
        for (let i = 1; i < len; i++) {
          offsets.push(offsets[i - 1] + (i % 2 === 1 ? 2 : 1));
        }
      }

      customTitle = `Procedural ${len}-Swara Step Sequence (Stride ${stride})`;
      desc = `Mathematical straight step sequence of ${len} consecutive notes for even tone production.`;
    } else if (isTriplet) {
      // Dynamic 3-note offsets [0, x, y]
      const xChoices = [-2, -1, 1, 2, 3, 4, 5];
      const yChoices = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
      const x = xChoices[Math.floor(Math.random() * xChoices.length)];
      const y = yChoices[Math.floor(Math.random() * yChoices.length)];
      
      if (Math.random() > 0.7) {
        offsets = [0, x, y, Math.random() > 0.5 ? x : 0];
      } else {
        offsets = [0, x, y];
      }
      stride = (difficulty === 'Advanced' && Math.random() > 0.5) ? 2 : 1;
      customTitle = `Procedural Triplet Vector [${offsets.join(', ')}]`;
      desc = `3-beat rhythmic grouping generated mathematically to sharpen 3/4 rhythm tracking.`;
    } else if (isQuadruplet) {
      // Dynamic 4-note offsets [0, x, y, z]
      const xChoices = [-2, -1, 1, 2, 3, 4, 5];
      const yChoices = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
      const zChoices = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
      const x = xChoices[Math.floor(Math.random() * xChoices.length)];
      const y = yChoices[Math.floor(Math.random() * yChoices.length)];
      const z = zChoices[Math.floor(Math.random() * zChoices.length)];

      if (Math.random() > 0.8) {
        offsets = [0, x, y, z, Math.random() > 0.5 ? y : 0];
      } else {
        offsets = [0, x, y, z];
      }

      stride = (difficulty === 'Advanced' && Math.random() > 0.5) ? (Math.random() > 0.5 ? 2 : 3) : 1;
      customTitle = `Procedural Quadruplet Vector [${offsets.join(', ')}]`;
      desc = `4-note structural permutation calculated for rapid dexterity across scale transitions.`;
    } else if (isSkip) {
      const leapStep = difficulty === 'Beginner' ? Math.floor(Math.random() * 2) + 2 : difficulty === 'Intermediate' ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 3) + 3;
      const skipStructureType = Math.floor(Math.random() * 8);

      switch (skipStructureType) {
        case 0: offsets = [0, leapStep]; break;
        case 1: offsets = [0, leapStep, 1]; break;
        case 2: offsets = [0, leapStep, 1, leapStep + 1]; break;
        case 3: offsets = [0, leapStep + 1, 1, leapStep]; break;
        case 4: offsets = [0, leapStep, 2, leapStep + 1]; break;
        case 5: offsets = [0, leapStep, 1, Math.max(0, leapStep - 1)]; break;
        case 6: offsets = [0, leapStep, 1, leapStep, 2]; break;
        case 7: offsets = [0, leapStep + 2, 1, leapStep + 1]; break;
        default: offsets = [0, leapStep, 1, leapStep + 1]; break;
      }
      stride = (difficulty === 'Advanced' && Math.random() > 0.5) ? 2 : 1;
      customTitle = `Procedural Leap Vector (Gap ${leapStep})`;
      desc = `Math-calculated interval jump exercise to build independent finger lifting and sealing.`;
    } else if (isZigzag) {
      const len = 3 + Math.floor(Math.random() * 4);
      offsets = [0];
      let currentVal = 0;
      let dir = Math.random() > 0.5 ? 1 : -1;
      for (let i = 1; i < len; i++) {
        const stepSize = Math.floor(Math.random() * 3) + 1;
        currentVal += dir * stepSize;
        if (currentVal < -2) currentVal = 1;
        offsets.push(currentVal);
        dir = -dir;
      }
      stride = (difficulty === 'Advanced' && Math.random() > 0.5) ? 2 : 1;
      customTitle = `Procedural Vakra Loop [${offsets.join(', ')}]`;
      desc = `Directional zigzag loop formula calculated to train non-linear classical phrasing.`;
    } else if (isGamak) {
      const len = 2 + Math.floor(Math.random() * 3);
      offsets = [0];
      for (let i = 1; i < len; i++) {
        offsets.push(offsets[i - 1] + (Math.floor(Math.random() * 3) + 1));
      }
      const ornaments: ('grace' | 'meend' | 'krintan' | 'kampit')[] = ['grace', 'meend', 'krintan', 'kampit'];
      ornamentType = ornaments[Math.floor(Math.random() * ornaments.length)];
      const names = { grace: 'Sparsh Grace', meend: 'Meend Glide', krintan: 'Krintan Touch', kampit: 'Kampit Oscillation' };
      customTitle = `Procedural ${names[ornamentType]} Ornamentation`;
      desc = `Embellished sargam computed with expressive classical riyaz embellishments.`;
    } else if (isComplex) {
      if (Math.random() > 0.7) {
        isPyramid = true;
        const pyMax = 7;
        customTitle = `Procedural Pyramid Expansion Formula (L1..L${pyMax})`;
        desc = `Progressive recursive expansion formula building breath endurance and octave agility.`;
      } else {
        const len = 5 + Math.floor(Math.random() * 3);
        offsets = [0];
        for (let i = 1; i < len; i++) {
          const delta = Math.floor(Math.random() * 5) - 2;
          offsets.push(Math.max(-2, offsets[i - 1] + delta));
        }
        stride = (difficulty === 'Advanced' && Math.random() > 0.5) ? 2 : 1;
        customTitle = `Procedural Combination [${offsets.join(', ')}]`;
        desc = `Advanced multi-swara permutation vector synthesized for high-tempo mastery.`;
      }
    }

    // Construct Aroha & Avroha mathematically
    const arohaLines: string[] = [];
    const avrohaLines: string[] = [];

    if (isPyramid) {
      const pyMax = 7;
      for (let level = 1; level <= pyMax; level++) {
        const aSub: string[] = [];
        const vSub: string[] = [];
        for (let j = 0; j < level; j++) {
          aSub.push(getAscendingSwara(j));
          vSub.push(getDescendingSwara(j));
        }
        for (let j = level - 2; j >= 0; j--) {
          aSub.push(getAscendingSwara(j));
          vSub.push(getDescendingSwara(j));
        }
        arohaLines.push(aSub.join(' '));
        avrohaLines.push(vSub.join(' '));
      }
    } else {
      const maxSteps = 7;
      for (let step = 0; step < maxSteps; step++) {
        const baseAsc = step * stride;
        const baseDesc = step * stride;

        const aPhrase: string[] = [];
        const vPhrase: string[] = [];

        for (let oIdx = 0; oIdx < offsets.length; oIdx++) {
          const off = offsets[oIdx];
          const ascSwara = getAscendingSwara(baseAsc + off);
          const descSwara = getDescendingSwara(baseDesc + off);

          const curRepeat = (repeatPattern && repeatPattern.length > 0)
            ? repeatPattern[oIdx % repeatPattern.length]
            : repeatCount;

          if (curRepeat > 1) {
            for (let r = 0; r < curRepeat; r++) {
              aPhrase.push(ascSwara);
              vPhrase.push(descSwara);
            }
          } else if (ornamentType === 'grace') {
            const prevAsc = getAscendingSwara(Math.max(0, baseAsc + off - 1));
            const prevDesc = getDescendingSwara(Math.max(0, baseDesc + off - 1));
            aPhrase.push(`(${prevAsc})${ascSwara}`);
            vPhrase.push(`(${prevDesc})${descSwara}`);
          } else if (ornamentType === 'meend' && oIdx < offsets.length - 1) {
            aPhrase.push(`${ascSwara}~`);
            vPhrase.push(`${descSwara}~`);
          } else if (ornamentType === 'krintan') {
            const nextAsc = getAscendingSwara(baseAsc + off + 1);
            const nextDesc = getDescendingSwara(baseDesc + off + 1);
            aPhrase.push(`${ascSwara}(${nextAsc})${ascSwara}`);
            vPhrase.push(`${descSwara}(${nextDesc})${descSwara}`);
          } else if (ornamentType === 'kampit') {
            aPhrase.push(`${ascSwara}~${ascSwara}`);
            vPhrase.push(`${descSwara}~${descSwara}`);
          } else {
            aPhrase.push(ascSwara);
            vPhrase.push(descSwara);
          }
        }

        arohaLines.push(aPhrase.join(' '));
        avrohaLines.push(vPhrase.join(' '));
      }
    }

    const candidateSig = `${arohaLines.join('\n')}::${avrohaLines.join('\n')}`;

    // Deduplication check
    if (excludeSignatures && excludeSignatures.has(candidateSig)) {
      continue; // Try again
    }

    if (excludeSignatures) {
      excludeSignatures.add(candidateSig);
    }

    const totalNotes = (arohaLines.length + avrohaLines.length) * (offsets.length * (repeatCount || 1));
    const estMins = Math.max(3, Math.round((totalNotes * 12) / bpm));

    return {
      id: `procedural-${seed}-${Date.now()}-${number}-${Math.random().toString(36).substring(2, 6)}`,
      number,
      title: customTitle || `Procedural Pattern #${seed.toString().slice(-4)}`,
      difficulty,
      patternType: targetPatternType,
      scale,
      tempo: bpm,
      estimatedTimeMinutes: estMins,
      aroha: arohaLines,
      avroha: avrohaLines,
      mathSeed: seed
    };
  }

  // Dynamic procedural fallback guaranteed to be scale-accurate & unique
  const seed = Math.floor(Math.random() * 900000) + 100000;
  const fallbackLen = Math.floor(Math.random() * 4) + 2;
  const fallbackOffsets = Array.from({ length: fallbackLen }, (_, i) => i * (Math.random() > 0.5 ? 1 : 2) + Math.floor(Math.random() * 2));
  const fallbackAroha: string[] = [];
  const fallbackAvroha: string[] = [];
  for (let s = 0; s < 7; s++) {
    const aLine = fallbackOffsets.map(o => getAscendingSwara(s + o)).join(' ');
    const vLine = fallbackOffsets.map(o => getDescendingSwara(s + o)).join(' ');
    fallbackAroha.push(aLine);
    fallbackAvroha.push(vLine);
  }
  const fallbackSig = `${fallbackAroha.join('\n')}::${fallbackAvroha.join('\n')}`;
  if (excludeSignatures) excludeSignatures.add(fallbackSig);

  return {
    id: `procedural-${seed}-${Date.now()}-${number}-${Math.random().toString(36).substring(2, 6)}`,
    number,
    title: `Procedural ${difficulty} Vector #${seed.toString().slice(-4)}`,
    difficulty,
    patternType: patternTypeFilter,
    scale,
    tempo: bpm,
    estimatedTimeMinutes: 5,
    aroha: fallbackAroha,
    avroha: fallbackAvroha,
    mathSeed: seed
  };
}

export interface AlankarGeneratorViewProps {
  currentUser?: UserProfile | null;
}

export default function AlankarGeneratorView({ currentUser }: AlankarGeneratorViewProps) {
  // Is user authenticated
  const isUserSignedIn = Boolean(currentUser?.uid);
  const userId = currentUser ? currentUser.uid : '';
  const userStorageKey = userId ? `flutesangam_saved_alankars_${userId}` : '';

  // Filters & State
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Beginner');
  const [selectedScale, setSelectedScale] = useState<string>('C Middle');
  const [selectedPatternType, setSelectedPatternType] = useState<string>('All Patterns');
  const [bpm, setBpm] = useState<number>(60);
  
  // Generated output cards list
  const [generatedAlankars, setGeneratedAlankars] = useState<AlankarPattern[]>([]);
  const [savedAlankars, setSavedAlankars] = useState<AlankarPattern[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');

  // Metronome audio state
  const [isPlayingMetronome, setIsPlayingMetronome] = useState<boolean>(false);
  const [activeBeat, setActiveBeat] = useState<number>(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const beatsPerMeasureRef = useRef<number>(4);
  const clickSynth = useRef<Tone.Synth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    beatsPerMeasureRef.current = beatsPerMeasure;
  }, [beatsPerMeasure]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load saved alankars from localStorage exclusively for authenticated user
  useEffect(() => {
    if (!isUserSignedIn || !userStorageKey) {
      setSavedAlankars([]);
      setActiveTab('generator');
      return;
    }
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        setSavedAlankars(JSON.parse(saved));
      } else {
        setSavedAlankars([]);
      }
    } catch (e) {
      console.error('Error reading saved alankars', e);
      setSavedAlankars([]);
    }
  }, [isUserSignedIn, userStorageKey]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (loopRef.current) loopRef.current.dispose();
      if (clickSynth.current) clickSynth.current.dispose();
    };
  }, []);

  // Initial generator on mount (silent, no toast)
  useEffect(() => {
    handleGenerate(1, undefined, undefined, false);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Metronome logic
  const toggleMetronome = async () => {
    await Tone.start();
    if (!isPlayingMetronome) {
      if (!clickSynth.current) {
        clickSynth.current = new Tone.Synth({
          oscillator: { type: "square" },
          envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.04 }
        }).toDestination();
      }

      Tone.Transport.bpm.value = bpm;
      let beat = 0;
      loopRef.current = new Tone.Loop((time) => {
        const totalBeats = beatsPerMeasureRef.current || 4;
        const isAccent = beat === 0;
        clickSynth.current?.triggerAttackRelease(isAccent ? "C6" : "C5", "16n", time);
        setActiveBeat(beat);
        beat = (beat + 1) % totalBeats;
      }, "4n").start(0);

      Tone.Transport.start();
      setIsPlayingMetronome(true);
    } else {
      Tone.Transport.stop();
      if (loopRef.current) {
        loopRef.current.dispose();
        loopRef.current = null;
      }
      setIsPlayingMetronome(false);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (isPlayingMetronome) {
      Tone.Transport.bpm.value = newBpm;
    }
  };

  // Generator Action: Procedural Generation
  const handleGenerate = (count: number = 1, forceDifficulty?: string, forcePattern?: string, isUserClick: boolean = true) => {
    const targetDiff = (forceDifficulty || selectedDifficulty) as any;
    const targetPattern = forcePattern || selectedPatternType;

    const batchSeenSignatures = new Set<string>();

    const categories = [
      "Linear (Straight Aroha/Avroha)",
      "Skip Note (Reverse/Jump)",
      "Triplet / Chautal (3-Note)",
      "Quadruplet (4-Note Groups)",
      "Double Swara (Repeat)",
      "Zigzag / Vakra Loop",
      "Gamak & Ornamented",
      "Complex Combinations"
    ];

    const newList: AlankarPattern[] = [];
    for (let i = 0; i < count; i++) {
      let currentPattern = targetPattern;
      if (targetPattern === 'All Patterns' && count > 1) {
        // Distribute distinct categories across the 5 generated Alankars
        currentPattern = categories[i % categories.length];
      }

      const item = generateProceduralAlankar(
        targetDiff,
        currentPattern,
        selectedScale,
        bpm,
        i + 1,
        batchSeenSignatures
      );
      newList.push(item);
    }

    setGeneratedAlankars(newList);

    if (isUserClick) {
      if (count > 1) {
        showToast(`Generated ${count} new Alankars!`);
      } else {
        showToast('Generated 1 new Alankar!');
      }
    }
  };

  // Generator Action: Random Practice Session (3 procedural levels)
  const handleRandomPracticeSession = () => {
    const batchSeenSignatures = new Set<string>();
    const b = generateProceduralAlankar('Beginner', selectedPatternType, selectedScale, Math.max(50, bpm - 10), 1, batchSeenSignatures);
    b.title = `Warmup Level: ${b.title}`;

    const i = generateProceduralAlankar('Intermediate', selectedPatternType, selectedScale, bpm, 2, batchSeenSignatures);
    i.title = `Agility Level: ${i.title}`;

    const a = generateProceduralAlankar('Advanced', selectedPatternType, selectedScale, Math.min(180, bpm + 15), 3, batchSeenSignatures);
    a.title = `Mastery Level: ${a.title}`;

    setGeneratedAlankars([b, i, a]);
    showToast('Generated 15-Minute Riyaz Session (3 Levels)!');
  };

  // Reset Filters
  const handleReset = () => {
    setSelectedDifficulty('Beginner');
    setSelectedScale('C Middle');
    setSelectedPatternType('All Patterns');
    setBpm(60);
    handleGenerate(1, 'Beginner', 'All Patterns', false);
    showToast('Reset generator parameters!');
  };

  // Save / Bookmark Alankar
  const toggleSaveAlankar = (item: AlankarPattern) => {
    if (!isUserSignedIn) {
      showToast('Please sign in to save Alankars');
      return;
    }
    const exists = savedAlankars.some(s => s.id === item.id || (s.mathSeed === item.mathSeed && s.scale === item.scale));
    let updated: AlankarPattern[];
    if (exists) {
      updated = savedAlankars.filter(s => s.id !== item.id && s.mathSeed !== item.mathSeed);
      showToast('Removed from saved collection');
    } else {
      updated = [item, ...savedAlankars];
      showToast('Saved to your Alankar collection!');
    }
    setSavedAlankars(updated);
    if (userStorageKey) {
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }
    }
  };

  // Explicit Delete single saved Alankar
  const deleteSingleSavedAlankar = (item: AlankarPattern) => {
    if (!isUserSignedIn) return;
    const updated = savedAlankars.filter(s => s.id !== item.id && s.mathSeed !== item.mathSeed);
    setSavedAlankars(updated);
    if (userStorageKey) {
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }
    }
    showToast('Deleted Alankar from saved collection');
  };

  // Clear all saved alankars for current user
  const handleClearAllSaved = () => {
    if (!isUserSignedIn) return;
    if (window.confirm("Are you sure you want to clear all your saved alankars?")) {
      setSavedAlankars([]);
      if (userStorageKey) {
        try {
          localStorage.removeItem(userStorageKey);
        } catch (e) {
          console.error('Failed to clear saved alankars', e);
        }
      }
      showToast('Cleared all saved alankars!');
    }
  };

  // Copy Sargam text
  const handleCopySargam = (item: AlankarPattern) => {
    const formattedText = `FluteSangam Procedural Alankar #${item.number}: ${item.title}
Difficulty: ${item.difficulty} | Scale: ${item.scale} | Tempo: ${item.tempo} BPM
Formula Vector: ${item.formula} | Math Seed: #${item.mathSeed}

Aroha (Ascending):
${item.aroha.join('\n')}

Avroha (Descending):
${item.avroha.length > 0 ? item.avroha.join('\n') : 'N/A'}

Estimated Practice: ${item.estimatedTimeMinutes} mins
Learn & practice on https://flutesangam.com`;

    navigator.clipboard.writeText(formattedText);
    showToast('Copied Sargam to clipboard!');
  };

  // PDF Print generator
  const handleDownloadPdf = (item: AlankarPattern) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${item.title} - FluteSangam Practice Sheet</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1c1917; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: 800; color: #78350f; }
            .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; }
            .title { font-size: 22px; font-weight: bold; margin-bottom: 8px; color: #292524; }
            .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #fffbe3; padding: 12px; border-radius: 8px; border: 1px solid #fcd34d; margin-bottom: 24px; font-size: 13px; }
            .meta-item { display: flex; flex-direction: column; }
            .meta-label { font-size: 11px; color: #78350f; font-weight: bold; text-transform: uppercase; }
            .meta-val { font-weight: bold; color: #1c1917; }
            .sargam-box { background: #fafaf9; border: 1px solid #e7e5e4; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
            .sargam-section-title { font-weight: bold; color: #b45309; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
            .sargam-code { font-family: monospace; font-size: 16px; line-height: 1.8; white-space: pre-wrap; word-break: break-word; color: #1c1917; }
            .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #78716c; border-top: 1px solid #e7e5e4; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FluteSangam</div>
            <div class="badge">${item.scale} Scale</div>
          </div>
          <div class="title">${item.title}</div>
          <p style="font-size: 13px; color: #57534e; margin-bottom: 20px;">Math Seed #${item.mathSeed} • Formula: ${item.formula}</p>
          
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Difficulty</span><span class="meta-val">${item.difficulty}</span></div>
            <div class="meta-item"><span class="meta-label">Pattern</span><span class="meta-val">${item.patternType}</span></div>
            <div class="meta-item"><span class="meta-label">Tempo</span><span class="meta-val">${item.tempo} BPM</span></div>
            <div class="meta-item"><span class="meta-label">Practice Time</span><span class="meta-val">${item.estimatedTimeMinutes} Mins</span></div>
          </div>

          <div class="sargam-box">
            <div class="sargam-section-title">Aroha (Ascending Order)</div>
            <div class="sargam-code">${item.aroha.join('\n')}</div>
          </div>

          ${item.avroha.length > 0 ? `
          <div class="sargam-box">
            <div class="sargam-section-title">Avroha (Descending Order)</div>
            <div class="sargam-code">${item.avroha.join('\n')}</div>
          </div>
          ` : ''}

          <div class="footer">
            Procedural Indian Bamboo Flute Practice Sheet • Infinite Math Engine on FluteSangam (https://flutesangam.com)
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Share
  const handleShare = (item: AlankarPattern) => {
    if (navigator.share) {
      navigator.share({
        title: `FluteSangam Procedural Alankar - ${item.title}`,
        text: `Check out this math-generated ${item.difficulty} Alankar in ${item.scale} on FluteSangam!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopySargam(item);
    }
  };

  // Generator Action: Generate Similar Alankar
  const handleGenerateSimilar = (item: AlankarPattern) => {
    // Synchronize UI filter dropdowns to match item's properties
    if (item.difficulty) setSelectedDifficulty(item.difficulty);
    if (PATTERN_TYPE_OPTIONS.includes(item.patternType)) {
      setSelectedPatternType(item.patternType);
    }

    // Register currently displayed signatures and target item signature
    const batchSeenSignatures = new Set<string>();
    generatedAlankars.forEach(g => {
      batchSeenSignatures.add(`${g.aroha.join('\n')}::${g.avroha.join('\n')}`);
    });
    batchSeenSignatures.add(`${item.aroha.join('\n')}::${item.avroha.join('\n')}`);

    const newSimilarItem = generateProceduralAlankar(
      item.difficulty,
      item.patternType,
      selectedScale,
      bpm,
      item.number,
      batchSeenSignatures
    );

    // If item is in generatedAlankars list, replace it in place; otherwise set as single output
    const cardIndex = generatedAlankars.findIndex(g => g.id === item.id || g.mathSeed === item.mathSeed);
    if (cardIndex !== -1) {
      const updatedList = [...generatedAlankars];
      updatedList[cardIndex] = newSimilarItem;
      setGeneratedAlankars(updatedList);
    } else {
      setGeneratedAlankars([newSimilarItem, ...generatedAlankars.slice(0, 4)]);
    }

    // Switch to generator tab if saved tab was active
    setActiveTab('generator');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12" itemScope itemType="https://schema.org/LearningResource">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-bamboo-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400/40 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/10 via-orange-300/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-bamboo-950 tracking-tight" itemProp="headline">
                  Alankar Generator
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  Procedural Engine
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Math-based algorithmic sargam vector synthesizer generating unique, mathematically valid Alankar patterns for Indian bamboo flute.
              </p>
            </div>

            {/* Badges / Tabs selector */}
            {isUserSignedIn && (
              <div className="flex items-center gap-2 bg-bamboo-50 p-1.5 rounded-2xl border border-bamboo-100 shrink-0 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'generator'
                      ? 'bg-bamboo-800 text-white shadow-xs'
                      : 'text-gray-600 hover:text-bamboo-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generator</span>
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-bamboo-800 text-white shadow-xs'
                      : 'text-gray-600 hover:text-bamboo-900'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Saved ({savedAlankars.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'saved' && isUserSignedIn ? (
        /* Saved Collection View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-bamboo-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-600" />
              <span>Your Saved Alankars ({savedAlankars.length})</span>
            </h2>
            {isUserSignedIn && savedAlankars.length > 0 && (
              <button
                onClick={handleClearAllSaved}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {!isUserSignedIn ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-bamboo-100 shadow-3xs space-y-3">
              <Bookmark className="w-10 h-10 text-bamboo-300 mx-auto" />
              <h3 className="font-bold text-gray-800 text-sm">Sign in to view saved Alankars</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Please sign in to bookmark Alankars and access your personal saved collection across practice sessions.
              </p>
            </div>
          ) : savedAlankars.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-bamboo-100 shadow-3xs space-y-3">
              <Bookmark className="w-10 h-10 text-bamboo-300 mx-auto" />
              <h3 className="font-bold text-gray-700 text-sm">No Saved Alankars Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Click the "Save" button on any generated Alankar card to bookmark patterns for your daily practice sessions!
              </p>
              <button
                onClick={() => setActiveTab('generator')}
                className="px-4 py-2 bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold rounded-xl transition mt-2 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Calculate New Alankars</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedAlankars.map((item, index) => (
                <AlankarCard
                  key={item.id || index}
                  item={{ ...item, number: index + 1 }}
                  isSaved={true}
                  showSaveOption={true}
                  onSave={toggleSaveAlankar}
                  onDeleteSaved={deleteSingleSavedAlankar}
                  onCopy={handleCopySargam}
                  onDownloadPdf={handleDownloadPdf}
                  onShare={handleShare}
                  onGenerateSimilar={handleGenerateSimilar}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Main Generator View */
        <div className="space-y-8">
          {/* Controls & Metronome Filter Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bamboo-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-bamboo-100 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-base text-bamboo-950 font-display">
                  Choose your Alankar Practice Setup
                </h2>
              </div>
            </div>

            {/* Filter Grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Difficulty Level */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-bamboo-50/70 p-1 rounded-xl border border-bamboo-100">
                  {DIFFICULTY_OPTIONS.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
                        selectedDifficulty === diff
                          ? 'bg-amber-600 text-white shadow-3xs'
                          : 'text-gray-700 hover:bg-bamboo-100/60'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Scale of Flute */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Scale of Flute
                </label>
                <select
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  className="w-full p-2.5 bg-bamboo-50/80 border border-bamboo-200 rounded-xl text-xs font-bold text-bamboo-950 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {SCALE_OPTIONS.map((scale) => (
                    <option key={scale} value={scale}>
                      {scale} Flute
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Pattern Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pattern Type
                </label>
                <select
                  value={selectedPatternType}
                  onChange={(e) => setSelectedPatternType(e.target.value)}
                  className="w-full p-2.5 bg-bamboo-50/80 border border-bamboo-200 rounded-xl text-xs font-bold text-bamboo-950 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {PATTERN_TYPE_OPTIONS.map((pat) => (
                    <option key={pat} value={pat}>
                      {pat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tempo Slider & Beat Controls */}
            <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-bamboo-900">
                    Metronome &amp; Beat Division
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300/80">
                    {bpm} BPM
                  </span>
                  <span className="font-mono text-xs font-extrabold text-bamboo-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300/80">
                    {beatsPerMeasure} {beatsPerMeasure === 1 ? 'Beat' : 'Beats'}
                  </span>
                  <button
                    type="button"
                    onClick={toggleMetronome}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isPlayingMetronome
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-bamboo-700 text-white hover:bg-bamboo-800'
                    }`}
                  >
                    {isPlayingMetronome ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingMetronome ? 'Pause Beats' : 'Start Metronome'}</span>
                  </button>
                </div>
              </div>

              {/* Tempo Slider */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-500">40 BPM</span>
                <input
                  type="range"
                  min="40"
                  max="240"
                  value={bpm}
                  onChange={(e) => handleBpmChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-bamboo-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <span className="text-[10px] font-bold text-gray-500">240 BPM</span>
              </div>

              {/* Beats Count Dropdown Selector */}
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="metronome-beats-select" className="text-xs font-extrabold text-bamboo-950 flex items-center gap-1.5">
                    <span>Metronome Beats (Measure):</span>
                  </label>
                  {isPlayingMetronome && (
                    <span className="text-[11px] font-black text-amber-700 animate-pulse">
                      Playing: Beat {activeBeat + 1} of {beatsPerMeasure}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      id="metronome-beats-select"
                      value={beatsPerMeasure}
                      onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
                      className="w-full bg-white text-bamboo-950 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-amber-300 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none pr-9"
                    >
                      <option value={1}>1 Beat (Single Click Pulse)</option>
                      <option value={2}>2 Beats (2/4 Dual Rhythm)</option>
                      <option value={3}>3 Beats (3/4 - Dadra / Waltz)</option>
                      <option value={4}>4 Beats (4/4 Standard - Keherwa)</option>
                      <option value={5}>5 Beats (5/4 - Jhaptal 5-beat variation)</option>
                      <option value={6}>6 Beats (6/8 - Dadra Taal)</option>
                      <option value={7}>7 Beats (7/8 - Rupak Taal)</option>
                      <option value={8}>8 Beats (8/4 - Keherwa 8-beat cycle)</option>
                      <option value={9}>9 Beats (9/8 - Matta Taal)</option>
                      <option value={10}>10 Beats (10/4 - Jhaptal)</option>
                      <option value={11}>11 Beats (11/8 - Rudra Taal)</option>
                      <option value={12}>12 Beats (12/4 - Ektaal / Chautaal)</option>
                      <option value={14}>14 Beats (14/4 - Dhamar Taal)</option>
                      <option value={16}>16 Beats (16/4 - Teentaal)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-700">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Numbered Beats Visualizer */}
              <div className="pt-2 border-t border-amber-200/60">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-2 text-center">
                  Live Beat Pulse Counter
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: beatsPerMeasure }, (_, i) => i).map((b) => {
                    const isCurrent = isPlayingMetronome && activeBeat === b;
                    const isFirstBeat = b === 0;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setActiveBeat(b)}
                        className={`min-w-8 h-8 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center border cursor-pointer ${
                          isCurrent
                            ? isFirstBeat
                              ? 'bg-amber-600 text-white border-amber-700 scale-110 ring-2 ring-amber-300 shadow-sm'
                              : 'bg-amber-500 text-white border-amber-600 scale-105 shadow-2xs'
                            : isFirstBeat
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                            : 'bg-white text-gray-700 border-amber-200/80'
                        }`}
                      >
                        <span>{b + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleGenerate(1)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl transition shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer"
              >
                <span>Generate New Alankar</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(5)}
                className="px-5 py-2.5 bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Generate 5 Alankars</span>
              </button>

              <button
                type="button"
                onClick={handleRandomPracticeSession}
                className="px-5 py-2.5 bg-bamboo-100 hover:bg-bamboo-200 text-bamboo-900 border border-bamboo-300/80 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Shuffle className="w-4 h-4 text-amber-700" />
                <span>Random Practice Session</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="ml-auto px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Generated Cards Output Display Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-600" />
                <span>Procedurally Synthesized Alankars ({generatedAlankars.length})</span>
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Flute Key: <strong className="text-bamboo-900">{selectedScale}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedAlankars.map((item, index) => {
                const isSaved = savedAlankars.some(s => s.id === item.id || s.mathSeed === item.mathSeed);
                return (
                  <AlankarCard
                    key={item.id || index}
                    item={item}
                    isSaved={isSaved}
                    showSaveOption={isUserSignedIn}
                    onSave={toggleSaveAlankar}
                    onCopy={handleCopySargam}
                    onDownloadPdf={handleDownloadPdf}
                    onShare={handleShare}
                    onGenerateSimilar={handleGenerateSimilar}
                  />
                );
              })}
            </div>
          </div>

          {/* Educational Practice Guide Section */}
          <div className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-bamboo-900 font-display flex items-center gap-2">
              <Wind className="w-5 h-5 text-amber-600" />
              <span>Pro Tips for Alankar Riyaz on Bansuri</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700">
              <div className="bg-bamboo-50/60 p-4 rounded-2xl border border-bamboo-100 space-y-1">
                <span className="font-extrabold text-amber-800 block text-xs">1. Steady Metronome Beat</span>
                <p className="text-gray-600 leading-relaxed">Always start slow at 60 BPM. Ensure tone pitch remains rock stable before increasing speed.</p>
              </div>
              <div className="bg-bamboo-50/60 p-4 rounded-2xl border border-bamboo-100 space-y-1">
                <span className="font-extrabold text-amber-800 block text-xs">2. Clean Finger Sealing</span>
                <p className="text-gray-600 leading-relaxed">Lift and drop finger pads precisely. Eliminate air leaks between rapid swara leaps.</p>
              </div>
              <div className="bg-bamboo-50/60 p-4 rounded-2xl border border-bamboo-100 space-y-1">
                <span className="font-extrabold text-amber-800 block text-xs">3. One Breath Consistency</span>
                <p className="text-gray-600 leading-relaxed">Aim to play complete 4-swara or 5-swara phrases in one smooth, uninterrupted breath.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated Reusable Alankar Output Card Component
interface AlankarCardProps {
  item: AlankarPattern;
  isSaved: boolean;
  showSaveOption?: boolean;
  onSave: (item: AlankarPattern) => void;
  onDeleteSaved?: (item: AlankarPattern) => void;
  onCopy: (item: AlankarPattern) => void;
  onDownloadPdf: (item: AlankarPattern) => void;
  onShare: (item: AlankarPattern) => void;
  onGenerateSimilar: (item: AlankarPattern) => void;
}

function AlankarCard({
  item,
  isSaved,
  showSaveOption = true,
  onSave,
  onDeleteSaved,
  onCopy,
  onDownloadPdf,
  onShare,
  onGenerateSimilar
}: AlankarCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-bamboo-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Card Top Header */}
      <div className="bg-gradient-to-r from-bamboo-800 to-bamboo-900 px-5 py-4 text-white flex items-center justify-between border-b border-bamboo-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
              Alankar #{item.number}
            </span>
            {item.mathSeed && (
              <span className="text-[9px] font-mono bg-bamboo-950/80 text-amber-200/90 px-1.5 py-0.5 rounded border border-bamboo-700">
                Seed: #{item.mathSeed}
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold font-display tracking-tight text-white m-0">
            {item.title}
          </h3>
        </div>
        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
          {item.scale}
        </span>
      </div>



      {/* Sargam Text Box */}
      <div className="p-5 flex-1 space-y-4">
        {/* Aroha Block */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Aroha (Ascending Order)</span>
          </div>
          <div className="font-mono text-xs sm:text-sm text-bamboo-950 bg-bamboo-50/70 p-3.5 rounded-xl border border-bamboo-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {item.aroha.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        {/* Avroha Block */}
        {item.avroha && item.avroha.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Avroha (Descending Order)</span>
            </div>
            <div className="font-mono text-xs sm:text-sm text-bamboo-950 bg-bamboo-50/70 p-3.5 rounded-xl border border-bamboo-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {item.avroha.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Metadata Grid */}
      <div className="px-5 py-3 bg-gray-50/80 border-t border-bamboo-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700">
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Difficulty</span>
          <span className="font-bold text-bamboo-900">{item.difficulty}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pattern</span>
          <span className="font-bold text-bamboo-900 truncate block" title={item.patternType}>{item.patternType.split(' ')[0]}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tempo</span>
          <span className="font-bold text-amber-700">{item.tempo} BPM</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Practice</span>
          <span className="font-bold text-bamboo-900">{item.estimatedTimeMinutes} Mins</span>
        </div>
      </div>

      {/* Bottom Action Bar Buttons */}
      <div className="p-3 bg-white border-t border-bamboo-100 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopyClick}
            className="px-2.5 py-1.5 bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
            title="Copy Sargam to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadPdf(item)}
            className="px-2.5 py-1.5 bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
            title="Download PDF Practice Sheet"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Download PDF</span>
          </button>

          {onDeleteSaved ? (
            <button
              type="button"
              onClick={() => onDeleteSaved(item)}
              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              title="Delete this saved Alankar"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          ) : showSaveOption ? (
            <button
              type="button"
              onClick={() => onSave(item)}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                isSaved
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800'
              }`}
              title="Save to My Alankars"
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-700 fill-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onShare(item)}
            className="px-2.5 py-1.5 bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
            title="Share this Alankar"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={() => onGenerateSimilar(item)}
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-3xs"
            title="Calculate another Alankar with similar pattern"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Similar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
