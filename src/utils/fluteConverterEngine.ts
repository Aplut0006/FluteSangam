// Flute Note & Key Converter - Centralized Musical Engine & Configuration
// Architecture designed to be strictly mathematically accurate, easily extensible, and testable.

export interface FluteKeyConfig {
  key: string;
  name: string;
  semitone: number; // 0 = C, 1 = C#, 2 = D, etc.
  frequencySaMadhya: number; // Hz for middle octave Sa
  category: 'primary' | 'chromatic';
  description: string;
}

// Initial supported primary keys (C, D, E, F, G, A) + full 12 chromatic scale keys
export const ALL_FLUTE_KEYS: FluteKeyConfig[] = [
  { key: 'C', name: 'C Natural', semitone: 0, frequencySaMadhya: 261.63, category: 'primary', description: 'Standard beginner bansuri & middle reference' },
  { key: 'C#', name: 'C# / Db', semitone: 1, frequencySaMadhya: 277.18, category: 'chromatic', description: 'Popular Hindustani vocal & bansuri scale' },
  { key: 'D', name: 'D Natural', semitone: 2, frequencySaMadhya: 293.66, category: 'primary', description: 'Bright, sweet, highly melodic medium bansuri' },
  { key: 'D#', name: 'D# / Eb', semitone: 3, frequencySaMadhya: 311.13, category: 'chromatic', description: 'Rich melodic range' },
  { key: 'E', name: 'E Natural (Bass/Medium)', semitone: 4, frequencySaMadhya: 329.63, category: 'primary', description: 'Warm classical concert & deep bass standard' },
  { key: 'F', name: 'F Natural', semitone: 5, frequencySaMadhya: 349.23, category: 'primary', description: 'Crisp, resonant bansuri key' },
  { key: 'F#', name: 'F# / Gb', semitone: 6, frequencySaMadhya: 369.99, category: 'chromatic', description: 'Classic high concert bansuri scale' },
  { key: 'G', name: 'G Natural (Base/Medium)', semitone: 7, frequencySaMadhya: 392.00, category: 'primary', description: 'Deep classical meditation & versatile medium key' },
  { key: 'G#', name: 'G# / Ab', semitone: 8, frequencySaMadhya: 415.30, category: 'chromatic', description: 'Expressive classical scale' },
  { key: 'A', name: 'A Natural', semitone: 9, frequencySaMadhya: 440.00, category: 'primary', description: 'Standard international concert pitch reference (440Hz)' },
  { key: 'A#', name: 'A# / Bb', semitone: 10, frequencySaMadhya: 466.16, category: 'chromatic', description: 'Rich devotional tone' },
  { key: 'B', name: 'B Natural', semitone: 11, frequencySaMadhya: 493.88, category: 'chromatic', description: 'Crisp bright tone' },
];

export const PRIMARY_FLUTE_KEYS = ALL_FLUTE_KEYS.filter(k => k.category === 'primary');

export type SwaraType = 'achala' | 'shuddha' | 'komal' | 'tivra';
export type Octave = 'mandra' | 'madhya' | 'taar';

export interface SwaraDefinition {
  canonicalName: string;      // e.g. "Sa", "Re", "Komal Ga", "Tivra Ma"
  shortSymbol: string;        // e.g. "S", "R", "g", "M'", "P", "d", "N"
  displayName: string;        // e.g. "Sa", "Re", "Ga̲ (Komal)", "Ma' (Tivra)"
  devanagari: string;         // e.g. "सा", "रे", "ग़", "म॑"
  semitoneOffset: number;     // 0 to 11
  type: SwaraType;
  westernIntervalName: string; // e.g. "Root / Tonic", "Major 2nd", "Minor 3rd"
  aliases: string[];          // Alternative user inputs
}

export const SWARA_DEFINITIONS: SwaraDefinition[] = [
  {
    canonicalName: 'Sa',
    shortSymbol: 'S',
    displayName: 'Sa',
    devanagari: 'सा',
    semitoneOffset: 0,
    type: 'achala',
    westernIntervalName: 'Root / Tonic (Unison)',
    aliases: ['sa', 's', 'saa', 'shadja']
  },
  {
    canonicalName: 'Komal Re',
    shortSymbol: 'r',
    displayName: 'Komal Re (r)',
    devanagari: 'रे॒',
    semitoneOffset: 1,
    type: 'komal',
    westernIntervalName: 'Minor 2nd (b2)',
    aliases: ['komal re', 'komal r', 'r', 're_', 're(komal)', 're-', 're̲', 'komal_re', 're(k)', 'rek']
  },
  {
    canonicalName: 'Re',
    shortSymbol: 'R',
    displayName: 'Shuddha Re',
    devanagari: 'रे',
    semitoneOffset: 2,
    type: 'shuddha',
    westernIntervalName: 'Major 2nd (M2)',
    aliases: ['re', 'r', 'rishabh', 'shuddha re', 'shuddha r', 'ree']
  },
  {
    canonicalName: 'Komal Ga',
    shortSymbol: 'g',
    displayName: 'Komal Ga (g)',
    devanagari: 'ग॒',
    semitoneOffset: 3,
    type: 'komal',
    westernIntervalName: 'Minor 3rd (b3)',
    aliases: ['komal ga', 'komal g', 'g', 'ga_', 'ga(komal)', 'ga-', 'ga̲', 'komal_ga', 'ga(k)', 'gak']
  },
  {
    canonicalName: 'Ga',
    shortSymbol: 'G',
    displayName: 'Shuddha Ga',
    devanagari: 'ग',
    semitoneOffset: 4,
    type: 'shuddha',
    westernIntervalName: 'Major 3rd (M3)',
    aliases: ['ga', 'g', 'gandhar', 'shuddha ga', 'shuddha g', 'gaa']
  },
  {
    canonicalName: 'Ma',
    shortSymbol: 'm',
    displayName: 'Shuddha Ma',
    devanagari: 'म',
    semitoneOffset: 5,
    type: 'shuddha',
    westernIntervalName: 'Perfect 4th (P4)',
    aliases: ['ma', 'm', 'madhyam', 'shuddha ma', 'shuddha m', 'maa']
  },
  {
    canonicalName: 'Tivra Ma',
    shortSymbol: 'M\'',
    displayName: 'Tivra Ma (M\')',
    devanagari: 'म॑',
    semitoneOffset: 6,
    type: 'tivra',
    westernIntervalName: 'Augmented 4th / Tritone (#4)',
    aliases: ['tivra ma', 'teevra ma', 'tivra m', 'm\'', 'm#', 'ma\'', 'ma#', 'ma(tivra)', 'tivra_ma', 'ma(t)', 'mat']
  },
  {
    canonicalName: 'Pa',
    shortSymbol: 'P',
    displayName: 'Pa',
    devanagari: 'प',
    semitoneOffset: 7,
    type: 'achala',
    westernIntervalName: 'Perfect 5th (P5)',
    aliases: ['pa', 'p', 'pancham', 'paa']
  },
  {
    canonicalName: 'Komal Dha',
    shortSymbol: 'd',
    displayName: 'Komal Dha (d)',
    devanagari: 'ध॒',
    semitoneOffset: 8,
    type: 'komal',
    westernIntervalName: 'Minor 6th (b6)',
    aliases: ['komal dha', 'komal d', 'd', 'dha_', 'dha(komal)', 'dha-', 'dha̲', 'komal_dha', 'dha(k)', 'dhak']
  },
  {
    canonicalName: 'Dha',
    shortSymbol: 'D',
    displayName: 'Shuddha Dha',
    devanagari: 'ध',
    semitoneOffset: 9,
    type: 'shuddha',
    westernIntervalName: 'Major 6th (M6)',
    aliases: ['dha', 'd', 'dhaivat', 'shuddha dha', 'shuddha d', 'dhaa']
  },
  {
    canonicalName: 'Komal Ni',
    shortSymbol: 'n',
    displayName: 'Komal Ni (n)',
    devanagari: 'नि॒',
    semitoneOffset: 10,
    type: 'komal',
    westernIntervalName: 'Minor 7th (b7)',
    aliases: ['komal ni', 'komal n', 'n', 'ni_', 'ni(komal)', 'ni-', 'ni̲', 'komal_ni', 'ni(k)', 'nik']
  },
  {
    canonicalName: 'Ni',
    shortSymbol: 'N',
    displayName: 'Shuddha Ni',
    devanagari: 'नि',
    semitoneOffset: 11,
    type: 'shuddha',
    westernIntervalName: 'Major 7th (M7)',
    aliases: ['ni', 'n', 'nishad', 'shuddha ni', 'shuddha n', 'nee']
  }
];

// Western 12 Chromatic Pitch Names
export interface WesternPitchClass {
  semitone: number; // 0 = C
  primaryName: string;
  enharmonicName?: string;
  aliases: string[];
}

export const WESTERN_PITCH_CLASSES: WesternPitchClass[] = [
  { semitone: 0, primaryName: 'C', enharmonicName: 'B#', aliases: ['c', 'b#'] },
  { semitone: 1, primaryName: 'C#', enharmonicName: 'Db', aliases: ['c#', 'db', 'csharp', 'dflat'] },
  { semitone: 2, primaryName: 'D', aliases: ['d'] },
  { semitone: 3, primaryName: 'D#', enharmonicName: 'Eb', aliases: ['d#', 'eb', 'dsharp', 'eflat'] },
  { semitone: 4, primaryName: 'E', enharmonicName: 'Fb', aliases: ['e', 'fb'] },
  { semitone: 5, primaryName: 'F', enharmonicName: 'E#', aliases: ['f', 'e#'] },
  { semitone: 6, primaryName: 'F#', enharmonicName: 'Gb', aliases: ['f#', 'gb', 'fsharp', 'gflat'] },
  { semitone: 7, primaryName: 'G', aliases: ['g'] },
  { semitone: 8, primaryName: 'G#', enharmonicName: 'Ab', aliases: ['g#', 'ab', 'gsharp', 'aflat'] },
  { semitone: 9, primaryName: 'A', aliases: ['a'] },
  { semitone: 10, primaryName: 'A#', enharmonicName: 'Bb', aliases: ['a#', 'bb', 'asharp', 'bflat'] },
  { semitone: 11, primaryName: 'B', enharmonicName: 'Cb', aliases: ['b', 'cb'] },
];

export interface ParsedSwaraToken {
  raw: string;
  definition: SwaraDefinition;
  octave: Octave;
  octaveLabel: string; // e.g. "Sa (Madhya)", "Sa' (Taar)", ".Sa (Mandra)"
  formatted: string;   // e.g. "Sa", "Sa'", ".Sa", "g", "M'"
  originalNotation?: 'swara' | 'western';
  originalWesternName?: string;
}

export interface ParsedWesternToken {
  raw: string;
  pitchClass: WesternPitchClass;
  octaveNumber?: number; // e.g. 4 for C4
  formatted: string;     // e.g. "C", "C#", "Eb4"
}

export interface ConversionItem {
  inputLabel: string;
  outputLabel: string;
  detailLabel?: string;
  semitoneOffset?: number;
  frequency?: number;
  // Future-proof hook for bansuri fingering diagram
  fingeringDiagramSlot?: {
    holesClosed: number; // e.g., 3 for Sa on classical 6-hole bansuri
    totalHoles: number;
    halfHoles?: number[];
  };
}

export interface ConversionResult {
  items: ConversionItem[];
  summaryInput: string;
  summaryOutput: string;
  invalidTokens: string[];
  notesCount: number;
}

// ----------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------

export const getFluteKeyConfig = (keyName: string): FluteKeyConfig => {
  const normalized = keyName.trim().toUpperCase();
  const found = ALL_FLUTE_KEYS.find(k => k.key.toUpperCase() === normalized || k.name.toUpperCase().startsWith(normalized));
  return found || ALL_FLUTE_KEYS[0]; // Default C
};

/**
 * Parses an input string into recognized Swara tokens with octave markers.
 * Handles:
 * - Taar Saptak: "Sa'", "S'", "Sa^", "Sa+", "S2"
 * - Mandra Saptak: ".Sa", "Sa.", ".S", "S_", "S1"
 * - Madhya Saptak: "Sa", "Re", "Ga", "Ma", "Pa", "Dha", "Ni", etc.
 * - Komal / Tivra forms: "Komal Re", "r", "re̲", "Tivra Ma", "M'", "m#", etc.
 */
export const parseSwaraString = (input: string): { tokens: ParsedSwaraToken[]; invalidTokens: string[] } => {
  if (!input || !input.trim()) {
    return { tokens: [], invalidTokens: [] };
  }

  // Tokenize by spaces, commas, hyphens, arrows, or delimiters
  const rawParts = input
    .replace(/[,\->→–\n\r\t|]+/g, ' ')
    .split(' ')
    .map(s => s.trim())
    .filter(Boolean);

  const tokens: ParsedSwaraToken[] = [];
  const invalidTokens: string[] = [];

  for (const part of rawParts) {
    let clean = part;
    let octave: Octave = 'madhya';

    // Check octave decorators
    if (clean.endsWith("'") || clean.endsWith("^") || clean.endsWith("+") || clean.includes("high") || clean.includes("taar")) {
      octave = 'taar';
      clean = clean.replace(/['^+]|high|taar/gi, '');
    } else if (clean.startsWith(".") || clean.endsWith(".") || clean.startsWith("_") || clean.endsWith("_") || clean.includes("low") || clean.includes("mandra")) {
      octave = 'mandra';
      clean = clean.replace(/[._]|low|mandra/gi, '');
    }

    clean = clean.trim();
    if (!clean) continue;

    // Match with swara definition aliases
    const lowerClean = clean.toLowerCase();
    const def = SWARA_DEFINITIONS.find(d => 
      d.canonicalName.toLowerCase() === lowerClean ||
      d.shortSymbol.toLowerCase() === lowerClean ||
      d.aliases.includes(lowerClean) ||
      d.devanagari === clean
    );

    if (def) {
      let formatted = def.canonicalName;
      if (octave === 'taar') {
        formatted = `${def.canonicalName}'`;
      } else if (octave === 'mandra') {
        formatted = `.${def.canonicalName}`;
      }

      tokens.push({
        raw: part,
        definition: def,
        octave,
        octaveLabel: `${def.canonicalName} (${octave.charAt(0).toUpperCase() + octave.slice(1)})`,
        formatted
      });
    } else {
      invalidTokens.push(part);
    }
  }

  return { tokens, invalidTokens };
};

/**
 * Flexible parser that recognizes both Indian Swaras and Western Notes.
 * When a Western note is encountered, it maps it to the corresponding Swara
 * on the source flute's key.
 */
export const parseFlexibleMusicString = (
  input: string,
  sourceKeyName: string
): { tokens: ParsedSwaraToken[]; invalidTokens: string[]; detectedNotation: 'swaras' | 'western' } => {
  if (!input || !input.trim()) {
    return { tokens: [], invalidTokens: [], detectedNotation: 'swaras' };
  }

  const sourceKey = getFluteKeyConfig(sourceKeyName);
  const rawParts = input
    .replace(/[,\->→–\n\r\t|]+/g, ' ')
    .split(' ')
    .map(s => s.trim())
    .filter(Boolean);

  const tokens: ParsedSwaraToken[] = [];
  const invalidTokens: string[] = [];
  let westernCount = 0;
  let swaraCount = 0;

  for (const part of rawParts) {
    let clean = part;
    let octave: Octave = 'madhya';

    // Check octave decorators
    if (clean.endsWith("'") || clean.endsWith("^") || clean.endsWith("+") || clean.includes("high") || clean.includes("taar")) {
      octave = 'taar';
      clean = clean.replace(/['^+]|high|taar/gi, '');
    } else if (clean.startsWith(".") || clean.endsWith(".") || clean.startsWith("_") || clean.endsWith("_") || clean.includes("low") || clean.includes("mandra")) {
      octave = 'mandra';
      clean = clean.replace(/[._]|low|mandra/gi, '');
    }

    clean = clean.trim();
    if (!clean) continue;

    // 1. Check Indian Swara first
    const lowerClean = clean.toLowerCase();
    const swaraDef = SWARA_DEFINITIONS.find(d => 
      d.canonicalName.toLowerCase() === lowerClean ||
      d.shortSymbol.toLowerCase() === lowerClean ||
      d.aliases.includes(lowerClean) ||
      d.devanagari === clean
    );

    if (swaraDef) {
      let formatted = swaraDef.canonicalName;
      if (octave === 'taar') {
        formatted = `${swaraDef.canonicalName}'`;
      } else if (octave === 'mandra') {
        formatted = `.${swaraDef.canonicalName}`;
      }

      tokens.push({
        raw: part,
        definition: swaraDef,
        octave,
        octaveLabel: `${swaraDef.canonicalName} (${octave.charAt(0).toUpperCase() + octave.slice(1)})`,
        formatted,
        originalNotation: 'swara'
      });
      swaraCount++;
      continue;
    }

    // 2. Check Western Note (e.g. C, D#, Eb, F#4)
    let westernClean = part.trim();
    let octaveNumber: number | undefined;
    const octaveMatch = westernClean.match(/^([a-zA-Z#b]+)(\d+)$/);
    if (octaveMatch) {
      westernClean = octaveMatch[1];
      octaveNumber = parseInt(octaveMatch[2], 10);
      if (octaveNumber >= 5) octave = 'taar';
      else if (octaveNumber <= 3) octave = 'mandra';
    }

    const lowerWesternClean = westernClean.toLowerCase();
    const westernPitch = WESTERN_PITCH_CLASSES.find(p =>
      p.primaryName.toLowerCase() === lowerWesternClean ||
      p.enharmonicName?.toLowerCase() === lowerWesternClean ||
      p.aliases.includes(lowerWesternClean)
    );

    if (westernPitch) {
      const deltaSemitone = (westernPitch.semitone - sourceKey.semitone + 12) % 12;
      const mappedSwaraDef = SWARA_DEFINITIONS.find(d => d.semitoneOffset === deltaSemitone) || SWARA_DEFINITIONS[0];

      let formatted = mappedSwaraDef.canonicalName;
      if (octave === 'taar') {
        formatted = `${mappedSwaraDef.canonicalName}'`;
      } else if (octave === 'mandra') {
        formatted = `.${mappedSwaraDef.canonicalName}`;
      }

      tokens.push({
        raw: part,
        definition: mappedSwaraDef,
        octave,
        octaveLabel: `${mappedSwaraDef.canonicalName} [${part}] (${octave.charAt(0).toUpperCase() + octave.slice(1)})`,
        formatted,
        originalNotation: 'western',
        originalWesternName: westernPitch.primaryName
      });
      westernCount++;
      continue;
    }

    invalidTokens.push(part);
  }

  const detectedNotation: 'swaras' | 'western' = westernCount > swaraCount ? 'western' : 'swaras';

  return { tokens, invalidTokens, detectedNotation };
};

/**
 * Parses an input string into recognized Western note tokens.
 * Handles:
 * - "C D E F G A B"
 * - Accidentals: "C#", "Db", "F#", "Bb", etc.
 * - Octave numbers: "C4", "D4", "E4", "G5"
 */
export const parseWesternString = (input: string): { tokens: ParsedWesternToken[]; invalidTokens: string[] } => {
  if (!input || !input.trim()) {
    return { tokens: [], invalidTokens: [] };
  }

  const rawParts = input
    .replace(/[,\->→–\n\r\t|]+/g, ' ')
    .split(' ')
    .map(s => s.trim())
    .filter(Boolean);

  const tokens: ParsedWesternToken[] = [];
  const invalidTokens: string[] = [];

  for (const part of rawParts) {
    let clean = part.trim();
    let octaveNumber: number | undefined;

    // Check trailing octave number (e.g. C4 -> note C, octave 4)
    const octaveMatch = clean.match(/^([a-zA-Z#b]+)(\d+)$/);
    if (octaveMatch) {
      clean = octaveMatch[1];
      octaveNumber = parseInt(octaveMatch[2], 10);
    }

    const lowerClean = clean.toLowerCase();
    const pitch = WESTERN_PITCH_CLASSES.find(p => 
      p.primaryName.toLowerCase() === lowerClean ||
      p.enharmonicName?.toLowerCase() === lowerClean ||
      p.aliases.includes(lowerClean)
    );

    if (pitch) {
      let formatted = pitch.primaryName;
      // Preserve flat if user typed flat
      if (lowerClean.includes('b') && pitch.enharmonicName && pitch.enharmonicName.includes('b')) {
        formatted = pitch.enharmonicName;
      }
      if (octaveNumber !== undefined) {
        formatted += octaveNumber;
      }

      tokens.push({
        raw: part,
        pitchClass: pitch,
        octaveNumber,
        formatted
      });
    } else {
      invalidTokens.push(part);
    }
  }

  return { tokens, invalidTokens };
};

/**
 * Calculates accurate frequency in Hz for a given pitch class and octave offset
 */
export const calculatePitchFrequency = (tonicSemitone: number, swaraOffset: number, octave: Octave = 'madhya'): number => {
  // A4 = 440Hz, semitone 9 in standard octave 4
  const totalSemitoneFromC0 = (4 * 12) + tonicSemitone + swaraOffset;
  let octaveMultiplier = 1;
  if (octave === 'mandra') octaveMultiplier = 0.5;
  if (octave === 'taar') octaveMultiplier = 2.0;

  // C4 = 261.63 Hz
  const midiNote = 60 + tonicSemitone + swaraOffset + (octave === 'taar' ? 12 : octave === 'mandra' ? -12 : 0);
  return 440 * Math.pow(2, (midiNote - 69) / 12);
};

/**
 * Core Converter: Swaras -> Western Notes
 */
export const convertSwarasToWestern = (
  swarasInput: string,
  fluteKeyName: string
): ConversionResult => {
  const fluteKey = getFluteKeyConfig(fluteKeyName);
  const { tokens, invalidTokens } = parseSwaraString(swarasInput);

  const items: ConversionItem[] = tokens.map(token => {
    const pitchIndex = (fluteKey.semitone + token.definition.semitoneOffset) % 12;
    const westernPitch = WESTERN_PITCH_CLASSES[pitchIndex];

    let noteName = westernPitch.primaryName;
    if (token.octave === 'taar') {
      noteName += ' (High)';
    } else if (token.octave === 'mandra') {
      noteName += ' (Low)';
    }

    const freq = calculatePitchFrequency(fluteKey.semitone, token.definition.semitoneOffset, token.octave);

    return {
      inputLabel: token.formatted,
      outputLabel: noteName,
      detailLabel: `${token.definition.displayName} • ${token.definition.westernIntervalName}`,
      semitoneOffset: token.definition.semitoneOffset,
      frequency: freq,
      fingeringDiagramSlot: {
        holesClosed: getEstimatedBansuriHoles(token.definition.semitoneOffset),
        totalHoles: 6
      }
    };
  });

  const summaryInput = items.map(i => i.inputLabel).join(' ');
  const summaryOutput = items.map(i => i.outputLabel.replace(' (High)', '\'').replace(' (Low)', '.')).join(' ');

  return {
    items,
    summaryInput,
    summaryOutput,
    invalidTokens,
    notesCount: items.length
  };
};

/**
 * Core Converter: Western Notes -> Swaras
 */
export const convertWesternToSwaras = (
  westernInput: string,
  fluteKeyName: string
): ConversionResult => {
  const fluteKey = getFluteKeyConfig(fluteKeyName);
  const { tokens, invalidTokens } = parseWesternString(westernInput);

  const items: ConversionItem[] = tokens.map(token => {
    // Delta relative to flute tonic
    const deltaSemitone = (token.pitchClass.semitone - fluteKey.semitone + 12) % 12;
    const swaraDef = SWARA_DEFINITIONS.find(d => d.semitoneOffset === deltaSemitone) || SWARA_DEFINITIONS[0];

    let outputLabel = swaraDef.canonicalName;
    if (token.octaveNumber && token.octaveNumber >= 5) {
      outputLabel += '\'';
    } else if (token.octaveNumber && token.octaveNumber <= 3) {
      outputLabel = `.${outputLabel}`;
    }

    const freq = calculatePitchFrequency(fluteKey.semitone, deltaSemitone, token.octaveNumber && token.octaveNumber >= 5 ? 'taar' : token.octaveNumber && token.octaveNumber <= 3 ? 'mandra' : 'madhya');

    return {
      inputLabel: token.formatted,
      outputLabel,
      detailLabel: `${token.pitchClass.primaryName} relative to ${fluteKey.name} Tonic (Sa) • ${swaraDef.westernIntervalName}`,
      semitoneOffset: deltaSemitone,
      frequency: freq,
      fingeringDiagramSlot: {
        holesClosed: getEstimatedBansuriHoles(deltaSemitone),
        totalHoles: 6
      }
    };
  });

  const summaryInput = items.map(i => i.inputLabel).join(' ');
  const summaryOutput = items.map(i => i.outputLabel).join(' ');

  return {
    items,
    summaryInput,
    summaryOutput,
    invalidTokens,
    notesCount: items.length
  };
};

/**
 * Core Converter: Change Flute Key
 * Calculates both:
 * 1. Resulting Western Sound when keeping the same Swaras (Relative Fingering)
 * 2. Swaras needed on Target Flute to match the exact original concert pitch (Pitch Preservation)
 */
export const convertChangeFluteKey = (
  inputSwaras: string,
  sourceKeyName: string,
  targetKeyName: string,
  outputNotation: 'swaras' | 'western' = 'swaras'
): {
  relativeFingeringResult: ConversionResult;
  constantPitchResult: ConversionResult;
  sourceKey: FluteKeyConfig;
  targetKey: FluteKeyConfig;
  semitoneShift: number;
  detectedNotation: 'swaras' | 'western';
} => {
  const sourceKey = getFluteKeyConfig(sourceKeyName);
  const targetKey = getFluteKeyConfig(targetKeyName);
  const semitoneShift = (targetKey.semitone - sourceKey.semitone + 12) % 12;

  const { tokens, invalidTokens, detectedNotation } = parseFlexibleMusicString(inputSwaras, sourceKeyName);

  // 1. Same relative fingering: Swara on Target Flute
  const relItems: ConversionItem[] = tokens.map(token => {
    const targetPitchIndex = (targetKey.semitone + token.definition.semitoneOffset) % 12;
    const targetWesternPitch = WESTERN_PITCH_CLASSES[targetPitchIndex];

    const sourcePitchIndex = (sourceKey.semitone + token.definition.semitoneOffset) % 12;
    const sourceWesternPitch = WESTERN_PITCH_CLASSES[sourcePitchIndex];

    const freq = calculatePitchFrequency(targetKey.semitone, token.definition.semitoneOffset, token.octave);

    const isWesternOut = outputNotation === 'western';

    const inputLabel = isWesternOut
      ? (token.originalWesternName || sourceWesternPitch.primaryName)
      : token.formatted;

    // When output is Western notation: show Western pitch class (e.g. "G")
    // When output is Swaras:
    // Transpose the swaras from Source Flute to Target Flute (e.g., Playing 'Sa' relative to C flute produces 'C'. On a G flute, 'C' is played with 'Ma').
    const shiftedSemitoneOffset = (token.definition.semitoneOffset + (sourceKey.semitone - targetKey.semitone) + 24) % 12;
    const targetSwaraDef = SWARA_DEFINITIONS.find(d => d.semitoneOffset === shiftedSemitoneOffset) || token.definition;

    const outputLabel = isWesternOut
      ? targetWesternPitch.primaryName
      : targetSwaraDef.canonicalName;

    const detailLabel = isWesternOut
      ? `Playing ${token.formatted} fingering on ${targetKey.key} flute produces ${targetWesternPitch.primaryName} (was ${sourceWesternPitch.primaryName} on ${sourceKey.key} flute)`
      : `From ${sourceKey.key} to ${targetKey.key} flute: ${token.formatted} corresponds to ${targetSwaraDef.displayName} (${targetWesternPitch.primaryName})`;

    return {
      inputLabel,
      outputLabel,
      detailLabel,
      semitoneOffset: token.definition.semitoneOffset,
      frequency: freq,
      fingeringDiagramSlot: {
        holesClosed: getEstimatedBansuriHoles(isWesternOut ? token.definition.semitoneOffset : targetSwaraDef.semitoneOffset),
        totalHoles: 6
      }
    };
  });

  // 2. Pitch preservation: If you want the note to sound like original source note, what swara on Target Flute?
  const pitchPreserveItems: ConversionItem[] = tokens.map(token => {
    const sourceConcertPitchIndex = (sourceKey.semitone + token.definition.semitoneOffset) % 12;
    const targetSwaraDelta = (sourceConcertPitchIndex - targetKey.semitone + 12) % 12;
    const targetSwaraDef = SWARA_DEFINITIONS.find(d => d.semitoneOffset === targetSwaraDelta) || SWARA_DEFINITIONS[0];

    const sourceWesternPitch = WESTERN_PITCH_CLASSES[sourceConcertPitchIndex];
    const freq = calculatePitchFrequency(sourceKey.semitone, token.definition.semitoneOffset, token.octave);

    const isWesternOut = outputNotation === 'western';

    const inputLabel = isWesternOut
      ? (token.originalWesternName || sourceWesternPitch.primaryName)
      : token.formatted;

    const outputLabel = isWesternOut
      ? `${sourceWesternPitch.primaryName} [Play: ${targetSwaraDef.canonicalName}]`
      : targetSwaraDef.canonicalName;

    const detailLabel = isWesternOut
      ? `To produce ${sourceWesternPitch.primaryName} on ${targetKey.key} Flute, play fingering: ${targetSwaraDef.displayName}`
      : `To produce ${sourceWesternPitch.primaryName} on ${targetKey.key} Flute, play ${targetSwaraDef.displayName}`;

    return {
      inputLabel,
      outputLabel,
      detailLabel,
      semitoneOffset: targetSwaraDelta,
      frequency: freq,
      fingeringDiagramSlot: {
        holesClosed: getEstimatedBansuriHoles(targetSwaraDelta),
        totalHoles: 6
      }
    };
  });

  return {
    relativeFingeringResult: {
      items: relItems,
      summaryInput: relItems.map(i => i.inputLabel).join(' '),
      summaryOutput: relItems.map(i => i.outputLabel).join(' '),
      invalidTokens,
      notesCount: relItems.length
    },
    constantPitchResult: {
      items: pitchPreserveItems,
      summaryInput: pitchPreserveItems.map(i => i.inputLabel).join(' '),
      summaryOutput: pitchPreserveItems.map(i => i.outputLabel).join(' '),
      invalidTokens,
      notesCount: pitchPreserveItems.length
    },
    sourceKey,
    targetKey,
    semitoneShift,
    detectedNotation
  };
};

/**
 * Standard bansuri finger holes helper for architectural slot
 * Classical 6-hole North Indian bansuri:
 * Sa = 3 upper holes closed
 * Re = 2 upper holes closed
 * Ga = 1 upper hole closed
 * Ma = all open (or half open)
 * Pa = all 6 holes closed
 * Dha = 5 holes closed
 * Ni = 4 holes closed
 */
function getEstimatedBansuriHoles(semitoneOffset: number): number {
  switch (semitoneOffset) {
    case 0: return 3;  // Sa
    case 1: return 2;  // Komal Re (half)
    case 2: return 2;  // Shuddha Re
    case 3: return 1;  // Komal Ga (half)
    case 4: return 1;  // Shuddha Ga
    case 5: return 0;  // Shuddha Ma (all open)
    case 6: return 0;  // Tivra Ma (half hole 1 closed)
    case 7: return 6;  // Pa
    case 8: return 5;  // Komal Dha
    case 9: return 5;  // Shuddha Dha
    case 10: return 4; // Komal Ni
    case 11: return 4; // Shuddha Ni
    default: return 3;
  }
}
