import { 
  ALL_FLUTE_KEYS, 
  SWARA_DEFINITIONS, 
  WESTERN_PITCH_CLASSES,
  convertSwarasToWestern, 
  convertWesternToSwaras, 
  parseSwaraString,
  resolveSwaraToken,
  convertChangeFluteKey 
} from '../src/utils/fluteConverterEngine';

console.log('--- RUNNING FLUTE NOTE & KEY CONVERTER REGRESSION SUITE ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  } else {
    passedTests++;
  }
}

// 1. Defect Verification: Raag Yaman on C Flute
console.log('1. Checking Raag Yaman on C Flute...');
const yamanCResult = convertSwarasToWestern("Sa Re Ga M^ Pa Dha Ni Sa'", 'C');
assert(yamanCResult.items.length === 8, 'Yaman has 8 notes');
assert(yamanCResult.items[3].outputLabel === 'F#', `Yaman Tivra Ma on C Flute must be F#, got ${yamanCResult.items[3].outputLabel}`);
assert(yamanCResult.items[7].outputLabel === 'C (High)', `Yaman high Sa must be C (High), got ${yamanCResult.items[7].outputLabel}`);

// Legacy format check: "M'" should resolve to Tivra Ma
const yamanLegacyResult = convertSwarasToWestern("Sa Re Ga M' Pa Dha Ni Sa'", 'C');
assert(yamanLegacyResult.items[3].outputLabel === 'F#', `Legacy M' must resolve to F# on C Flute, got ${yamanLegacyResult.items[3].outputLabel}`);

// 2. Defect Verification: Tivra Ma button click token on A Flute
console.log('2. Checking Tivra Ma on A Flute...');
const tivraA = convertSwarasToWestern('M^', 'A');
assert(tivraA.items[0].outputLabel === 'D#', `Tivra Ma on A Flute must be D#, got ${tivraA.items[0].outputLabel}`);

const tivraALegacy = convertSwarasToWestern("M'", 'A');
assert(tivraALegacy.items[0].outputLabel === 'D#', `Legacy M' on A Flute must be D#, got ${tivraALegacy.items[0].outputLabel}`);

// 3. Written example verification: Komal Ga on A Flute is C, NOT D#
console.log('3. Checking Komal Ga on A Flute...');
const komalGaA = convertSwarasToWestern('g', 'A');
assert(komalGaA.items[0].outputLabel === 'C', `Komal Ga on A Flute must be C, got ${komalGaA.items[0].outputLabel}`);

// 4. Test all 12 Swaras across all 12 Flute Tonic Keys (144 combinations)
console.log('4. Testing all 12 Swaras across all 12 Flute Tonic Keys...');
for (const fluteKey of ALL_FLUTE_KEYS) {
  for (const swara of SWARA_DEFINITIONS) {
    const res = convertSwarasToWestern(swara.shortSymbol, fluteKey.key);
    assert(res.items.length === 1, `Failed to convert swara ${swara.canonicalName} on ${fluteKey.key}`);
    const expectedPitchIndex = (fluteKey.semitone + swara.semitoneOffset) % 12;
    const expectedWestern = WESTERN_PITCH_CLASSES[expectedPitchIndex].primaryName;
    assert(
      res.items[0].outputLabel === expectedWestern,
      `Mismatch on ${fluteKey.key} flute for ${swara.canonicalName}: expected ${expectedWestern}, got ${res.items[0].outputLabel}`
    );
  }
}

// 5. Test reverse conversion: Western Notes to Swaras across all 12 Keys
console.log('5. Testing Western Notes to Swaras across all 12 Flute Tonic Keys...');
for (const fluteKey of ALL_FLUTE_KEYS) {
  for (const pitch of WESTERN_PITCH_CLASSES) {
    const res = convertWesternToSwaras(pitch.primaryName, fluteKey.key);
    assert(res.items.length === 1, `Failed to convert western ${pitch.primaryName} on ${fluteKey.key}`);
    const expectedDelta = (pitch.semitone - fluteKey.semitone + 12) % 12;
    const expectedSwaraDef = SWARA_DEFINITIONS.find(d => d.semitoneOffset === expectedDelta)!;
    const expectedLabel = expectedSwaraDef.canonicalName === 'Tivra Ma' 
      ? 'M^' 
      : expectedSwaraDef.type === 'komal' 
      ? expectedSwaraDef.shortSymbol 
      : expectedSwaraDef.canonicalName;
    assert(
      res.items[0].outputLabel === expectedLabel,
      `Mismatch reversing ${pitch.primaryName} on ${fluteKey.key}: expected ${expectedLabel}, got ${res.items[0].outputLabel}`
    );
  }
}

// 6. Test Octave Transitions (.Sa, Sa, Sa', .M^, M^, M^')
console.log('6. Testing Octave Transitions...');
const octavesCheck = convertSwarasToWestern('.Sa Sa Sa\' .M^ M^ M^\'', 'C');
assert(octavesCheck.items[0].outputLabel === 'C (Low)', 'Mandra Sa check');
assert(octavesCheck.items[1].outputLabel === 'C', 'Madhya Sa check');
assert(octavesCheck.items[2].outputLabel === 'C (High)', 'Taar Sa check');
assert(octavesCheck.items[3].outputLabel === 'F# (Low)', 'Mandra Tivra Ma check');
assert(octavesCheck.items[4].outputLabel === 'F#', 'Madhya Tivra Ma check');
assert(octavesCheck.items[5].outputLabel === 'F# (High)', 'Taar Tivra Ma check');

// 7. Test All Raga Presets
console.log('7. Testing All Raga Presets...');
const presets = [
  { name: 'Bilawal', input: 'Sa Re Ga Ma Pa Dha Ni Sa\'', expectedNotes: 8 },
  { name: 'Bhoopali', input: 'Sa Re Ga Pa Dha Sa\'', expectedNotes: 6 },
  { name: 'Yaman', input: 'Sa Re Ga M^ Pa Dha Ni Sa\'', expectedNotes: 8 },
  { name: 'Bhairav', input: 'Sa r Ga Ma Pa d Ni Sa\'', expectedNotes: 8 },
  { name: 'Kafi', input: 'Sa Re g Ma Pa Dha n Sa\'', expectedNotes: 8 },
  { name: 'Malkauns', input: 'Sa g Ma d n Sa\'', expectedNotes: 6 },
];

for (const p of presets) {
  const pRes = convertSwarasToWestern(p.input, 'C');
  assert(pRes.items.length === p.expectedNotes, `Preset ${p.name} note count check`);
  assert(pRes.invalidTokens.length === 0, `Preset ${p.name} should have 0 invalid tokens`);
}

// 8. Test Change Flute Key transposition
console.log('8. Testing Change Flute Key transposition...');
const transposeRes = convertChangeFluteKey('Sa Re Ga Pa Dha', 'C', 'G', 'swaras');
assert(transposeRes.relativeFingeringResult.items.length === 5, 'Relative fingering items count');
assert(transposeRes.constantPitchResult.items.length === 5, 'Constant pitch items count');

console.log(`\nALL ${passedTests}/${totalTests} REGRESSION CHECKS PASSED SUCCESSFULLY!`);
