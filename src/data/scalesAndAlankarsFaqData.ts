import { FaqItem } from '../components/FluteFaqView';

export const SCALES_AND_ALANKARS_FAQS: FaqItem[] = [
  {
    id: 'scale-what-is-a-musical-scale-and-sargam',
    category: 'Scales & Alankars',
    question: 'What is a musical scale and how does Sargam work on the bansuri?',
    answer: `In Indian classical music, a scale is a structured sequence of notes arranged in ascending (Aaroh) and descending (Avaroh) order:

- Sargam Notes: The seven natural notes (Shuddha Swaras) are Sa, Re, Ga, Ma, Pa, Dha, and Ni.
- Root Note (Sa): On a bansuri, Sa is produced when the top 3 finger holes are covered. Covering all 6 holes produces Mandra Pa.
- Equal Temperament vs Just Intonation: Indian scales are tuned to pure harmonic intervals (Just Intonation) against the Tanpura drone.`,
    relatedLink: { text: 'Read Music Theory Fundamentals', view: 'learn_basics' },
    tags: ['sargam', 'musical scale', 'shuddha swaras', 'sa re ga ma']
  },
  {
    id: 'alankar-what-are-alankars-and-why-essential',
    category: 'Scales & Alankars',
    question: 'What are Alankars and why are they essential for daily practice?',
    answer: `Alankar (literally "ornament") refers to structured, permutated exercise patterns of swaras practiced in ascending and descending sequences:

- Why They Are Essential: Alankars train your brain and finger muscles to execute every possible note combination instantly and accurately without hesitation.
- Examples:
  - Simple 2-note Alankar: SaRe, ReGa, GaMa, MaPa...
  - 3-note Alankar: SaReGa, ReGaMa, GaMaPa...
  - Skipping Alankar: SaGa, ReMa, GaPa, MaDha...
- Benefits: Builds finger independence, breath distribution, pitch alignment with the Tanpura, and rhythmic speed.`,
    relatedLink: { text: 'Practice with Interactive Alankar Generator', view: 'alankar_generator' },
    tags: ['alankars', 'swara patterns', 'permutations', 'daily exercises']
  },
  {
    id: 'alankar-how-to-practice-with-metronome',
    category: 'Scales & Alankars',
    question: 'How do I practice Alankars with a metronome to build rhythmic speed (Laya)?',
    answer: `Building unshakeable rhythm requires systematic metronome practice:

1. Slow Baseline (60 BPM): Play 1 note per beat (Vilambit Lay). Ensure every note is centered in pitch and crystal clear.
2. Double Speed / Dugun (60 BPM): Play 2 notes per beat while keeping the metronome click at 60 BPM.
3. Quadruple Speed / Chaugun (60 BPM): Play 4 notes per beat over the same click.
4. Incremental Tempo Increase: Increase metronome tempo by 4 BPM only when you can play the pattern 3 times consecutively without a single mistake.`,
    relatedLink: { text: 'Use Alankar Engine Metronome', view: 'alankar_generator' },
    tags: ['metronome', 'laya', 'dugun', 'chaugun', 'speed training']
  },
  {
    id: 'scale-multi-octave-scale-practice',
    category: 'Scales & Alankars',
    question: 'How do I practice scales across Mandra, Madhya, and Taar Saptaks?',
    answer: `Mastering multi-octave scales expands your expressive register:

- Lower Octave (Mandra Saptak): Relax your lips and blow a warm, gentle, slow air stream to sound low Pa, Dha, Ni, and Sa.
- Middle Octave (Madhya Saptak): Maintain standard lip aperture and air pressure for smooth mid-range notes.
- High Octave (Taar Saptak): Narrow your lip opening slightly, push gently from your abdomen, and direct a faster air stream into the blow hole to reach high Sa, Re, Ga, and Ma cleanly.`,
    relatedLink: { text: 'View Fingering Chart for All Octaves', view: 'learn_fingering_chart' },
    tags: ['multi octave', 'mandra saptak', 'taar saptak', 'scale practice']
  },
  {
    id: 'alankar-creating-custom-alankar-patterns',
    category: 'Scales & Alankars',
    question: 'Can I create my own custom Alankar patterns, and how?',
    answer: `Yes! Creating custom Alankars boosts musical creativity and isolates difficult finger jumps:

- Mathematical Permutations: Choose a formula (e.g., 1-3-2-4 or Sa-Ga-Re-Ma) and apply that exact pattern to every step of the scale ascending and descending.
- Target Weak Fingers: If moving between Ga and Pa feels awkward, design an Alankar that specifically loops Ga-Pa-Ma-Pa across the entire octave.
- Use FluteSangam Alankar Engine: Use our interactive Alankar Generator to create, play, and practice custom swara patterns instantly.`,
    relatedLink: { text: 'Open Custom Alankar Generator', view: 'alankar_generator' },
    tags: ['custom alankars', 'permutations', 'creativity', 'alankar generator']
  },
  {
    id: 'scale-difference-between-scale-and-raag',
    category: 'Scales & Alankars',
    question: 'What is the difference between a musical scale (Thaat) and a Raag?',
    answer: `Understanding the leap from scale structure to classical raag aesthetics:

- Scale / Thaat: A static parent framework of 7 notes arranged purely in pitch order (e.g., Kalyan Thaat). It has no emotional character or rules.
- Raag: A living musical entity with specific ascending/descending rules (Aaroh/Avaroh), dominant notes (Vadi/Samvadi), characteristic melodic phrases (Pakad), microtonal ornaments (Meend/Andolan), and associated times of day.`,
    relatedLink: { text: 'Explore Classical Raagas Guide', view: 'learn_raagas' },
    tags: ['scale vs raag', 'thaat', 'vadi samvadi', 'music theory']
  },
  {
    id: 'alankar-building-finger-agility-and-coordination',
    category: 'Scales & Alankars',
    question: 'How do Alankars improve finger agility, speed, and muscle memory?',
    answer: `Alankars rewire motor pathways in your central nervous system:

- Eliminating Finger Hesitation: By repeating patterns hundreds of times, your brain stops thinking about individual finger movements and triggers fluid motor sequences automatically.
- Sealing Integrity: Practicing fast Alankars forces finger pads to land squarely over hole centers without air leaks.
- Finger Independence: Strengthens weaker fingers (like the ring finger) that naturally struggle to lift independently.`,
    relatedLink: { text: 'Read Daily Practice Blueprint', view: 'learn_daily_practice' },
    tags: ['finger agility', 'muscle memory', 'coordination', 'alankars']
  },
  {
    id: 'alankar-transitioning-from-alankars-to-songs',
    category: 'Scales & Alankars',
    question: 'How do I bridge the gap between practicing Alankars and playing actual songs?',
    answer: `Songs are constructed from fragments of Alankars and scale runs:

- Identify Patterns in Melodies: When learning a song notation, notice how phrase segments are simply 3-note or 4-note Alankar patterns (e.g., Pa-Dha-Ni-Sa).
- Isolate Song Phrases as Exercises: Take a tricky 4-note phrase from a favorite song or bhajan and loop it like an Alankar 20 times over a Tanpura drone until it flows effortlessly.`,
    relatedLink: { text: 'Browse Song Notations & Lessons', view: 'notation_requests' },
    tags: ['transition to songs', 'song notation', 'applied alankars']
  },
  {
    id: 'scale-most-common-scale-practice-mistakes',
    category: 'Scales & Alankars',
    question: 'What are the most common mistakes students make during scale practice?',
    answer: `Avoid these common scale practice errors:

1. Rushing Tempo: Playing faster than your fingers can seal holes cleanly, creating sloppy, airy, out-of-tune notes.
2. Practicing Without a Drone: Practicing without a Tanpura drone leads to pitch drifting without realizing it.
3. Lifting Fingers Too High: Raising fingers 3–4 cm off the bamboo tube slows down speed and breaks smooth hand posture.
4. Ignoring Descending Runs (Avaroh): Most students practice ascending (Aaroh) diligently but stumble when descending. Always give equal attention to Avaroh.`,
    relatedLink: { text: 'Read Common Pitfalls & Solutions', view: 'learn_common_mistakes' },
    tags: ['scale mistakes', 'avaroh', 'rushing', 'tanpura']
  },
  {
    id: 'alankar-dugun-and-chaugun-rhythmic-variations',
    category: 'Scales & Alankars',
    question: 'What are Dugun, Tigun, and Chaugun variations in Alankar practice?',
    answer: `In Indian classical music, rhythm subdivisions (Layakari) are practiced systematically:

- Ekgun (Single Speed): 1 note per beat beat (1x).
- Dugun (Double Speed): 2 notes played in the span of 1 beat (2x).
- Tigun (Triple Speed): 3 notes played evenly per beat (3x).
- Chaugun (Quadruple Speed): 4 notes played evenly per beat (4x).
- Practice Benefit: Teaches your brain to subdivide time accurately without speeding up the underlying metronome tempo.`,
    relatedLink: { text: 'Practice Layakari in Alankar Engine', view: 'alankar_generator' },
    tags: ['layakari', 'dugun', 'tigun', 'chaugun', 'rhythm']
  },
  {
    id: 'scale-practicing-komal-and-teevra-swara-scales',
    category: 'Scales & Alankars',
    question: 'How do I practice scales containing Komal (flat) and Teevra (sharp) notes?',
    answer: `Beyond the all-Shuddha natural scale (Bilaval Thaat), practicing modified swara scales builds advanced flexibility:

- Kalyan Thaat Scale: Replaces Shuddha Ma with Teevra Ma (all holes open except half on top).
- Bhairav Thaat Scale: Introduces Komal Re (half hole) and Komal Dha (half hole).
- Practice Strategy: Master half-hole finger placements over a Tanpura drone slowly, using a tuner to verify that flat notes sound in microtonal tune.`,
    relatedLink: { text: 'Explore Thaat Systems & Scales', view: 'learn_raagas' },
    tags: ['komal swaras', 'teevra ma', 'thaat scales', 'half hole practice']
  },
  {
    id: 'alankar-daily-scale-practice-duration',
    category: 'Scales & Alankars',
    question: 'How long should I spend on scales and Alankars each day?',
    answer: `Recommended scale practice duration based on skill level:

- Beginners: 10 to 15 minutes daily focusing on 3 basic Alankars (Ekgun and Dugun) over a Tanpura drone.
- Intermediate Students: 20 to 30 minutes daily covering multi-octave scales, speed building with a metronome, and Komal swara drills.
- Advanced Flutists: 30 to 45 minutes incorporating complex Layakari variations across different Thaat scales.`,
    relatedLink: { text: 'View Practice Structure Guide', view: 'learn_daily_practice' },
    tags: ['practice duration', 'scale routine', 'alankar time']
  }
];
