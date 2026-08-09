import { FaqItem } from '../components/FluteFaqView';

export const SCALES_AND_ALANKARS_FAQS: FaqItem[] = [
  {
    id: 'scale-what-is-a-musical-scale-and-sargam',
    category: 'Scales & Alankars',
    question: 'What is a musical scale and how does Sargam work on the bansuri?',
    answer: `In Indian classical music, a scale is a structured sequence of swaras (notes) arranged in ascending order (Aaroh) and descending order (Avaroh). Unlike Western music which relies on fixed pitch letter names (C, D, E), Indian music uses the movable solfege system known as Sargam.

Understanding Sargam & Flute Mechanics:
• The Seven Shuddha Swaras: The natural notes are Sa (Shadja), Re (Rishabh), Ga (Gandhar), Ma (Madhyam), Pa (Pancham), Dha (Dhaivat), and Ni (Nishad).
• Root Note (Sa) Determination: On an Indian bamboo bansuri, root Sa is produced when the top 3 finger holes are completely covered. Covering all 6 finger holes produces Mandra Pa (lower 5th).
• Just Intonation vs. Equal Temperament: Bansuri scales are tuned according to pure natural acoustic intervals (Just Intonation) against a continuous Tanpura drone, resulting in rich, warm harmonic resonance.`,
    relatedLink: { text: 'Read Music Theory Fundamentals', view: 'learn_basics' },
    tags: ['sargam', 'musical scale', 'shuddha swaras', 'sa re ga ma']
  },
  {
    id: 'alankar-what-are-alankars-and-why-essential',
    category: 'Scales & Alankars',
    question: 'What are Alankars and why are they essential for daily practice?',
    answer: `Alankar (literally meaning "musical ornament" or "decoration") refers to structured, permutated exercise patterns of swaras practiced sequentially in ascending (Aaroh) and descending (Avaroh) order.

Why Daily Alankar Practice is Mandatory:
• Neuromuscular Reprogramming: Alankars train your brain and finger muscles to execute every possible note pair combination smoothly, rapidly, and without hesitation.
• Classic Examples:
  - 2-Note Sequential: SaRe, ReGa, GaMa, MaPa, PaDha, DhaNi, NiSa...
  - 3-Note Triplet: SaReGa, ReGaMa, GaMaPa, MaPaDha...
  - Interval Skipping: SaGa, ReMa, GaPa, MaDha, PaNi...
• Core Benefits: Regular Alankar practice builds finger independence, optimizes diaphragmatic breath distribution, refines pitch alignment against the Tanpura, and establishes solid rhythmic speed (Laya).`,
    relatedLink: { text: 'Practice with Interactive Alankar Generator', view: 'alankar_generator' },
    tags: ['alankars', 'swara patterns', 'permutations', 'daily exercises']
  },
  {
    id: 'alankar-how-to-practice-with-metronome',
    category: 'Scales & Alankars',
    question: 'How do I practice Alankars with a metronome to build rhythmic speed (Laya)?',
    answer: `Building unshakeable internal rhythm (Laya) and fast, clean finger movement requires systematic, structured metronome training during daily Sadhana.

Step-by-Step Metronome Practice Method:
1. Slow Baseline Tempo (60 BPM): Begin at 60 BPM playing 1 note per beat (Vilambit Lay / Single Speed). Ensure every note is centered in pitch, full-bodied, and crystal clear.
2. Double Speed / Dugun (60 BPM): Keep the metronome clicking at 60 BPM, but play 2 notes evenly per beat (Dugun / Double Speed).
3. Quadruple Speed / Chaugun (60 BPM): Play 4 notes evenly per beat (Chaugun / Fast Speed) over the same 60 BPM click.
4. Systematic BPM Progression: Increase metronome tempo by +4 BPM only when you can execute the current Alankar pattern three consecutive times without a single mistake or finger slip.`,
    relatedLink: { text: 'Use Alankar Engine Metronome', view: 'alankar_generator' },
    tags: ['metronome', 'laya', 'dugun', 'chaugun', 'speed training']
  },
  {
    id: 'scale-multi-octave-scale-practice',
    category: 'Scales & Alankars',
    question: 'How do I practice scales across Mandra, Madhya, and Taar Saptaks?',
    answer: `Practicing scales across three full octaves expands your dynamic range, tones your lip embouchure, and builds complete control over the bamboo flute.

Octave Scale Adjustments:
• Lower Octave (Mandra Saptak): Relax your jaw and lips, widen your aperture slightly, and blow a slow, warm, gentle air stream to produce low Pa, Dha, Ni, and Sa cleanly.
• Middle Octave (Madhya Saptak): Maintain standard lip aperture and moderate air velocity for clear mid-register tones.
• Higher Octave (Taar Saptak): Slightly narrow your central lip opening, support air pressure with your lower abdominal muscles, and direct a faster air jet across the blow hole splitting lip to reach high Sa, Re, Ga, and Ma cleanly.`,
    relatedLink: { text: 'View Fingering Chart for All Octaves', view: 'learn_fingering_chart' },
    tags: ['multi octave', 'mandra saptak', 'taar saptak', 'scale practice']
  },
  {
    id: 'alankar-creating-custom-alankar-patterns',
    category: 'Scales & Alankars',
    question: 'Can I create my own custom Alankar patterns, and how?',
    answer: `Yes! Designing custom Alankar patterns sparks musical creativity, prevents practice monotony, and isolates difficult finger transitions that require targeted practice.

How to Design Custom Alankar Drills:
• Mathematical Formula Method: Select a specific numeric permutation formula (such as 1-3-2-4 or Sa-Ga-Re-Ma) and apply that exact pattern to every step of the scale ascending and descending.
• Targeted Weak-Finger Drills: If transitioning between Ga and Pa feels awkward or sluggish, design a targeted Alankar looping Ga-Pa-Ma-Pa across the entire octave.
• Use FluteSangam Alankar Engine: Utilize our interactive Alankar Generator tool to create, play, and practice custom swara patterns instantly with customizable metronome tempos.`,
    relatedLink: { text: 'Open Custom Alankar Generator', view: 'alankar_generator' },
    tags: ['custom alankars', 'permutations', 'creativity', 'alankar generator']
  },
  {
    id: 'scale-difference-between-scale-and-raag',
    category: 'Scales & Alankars',
    question: 'What is the difference between a musical scale (Thaat) and a Raag?',
    answer: `Understanding the leap from a static scale structure to a living classical Raag is crucial for every Indian classical music student.

Scale (Thaat) vs. Raag Comparison:
• Musical Scale / Thaat: A static structural parent framework consisting of 7 swaras arranged strictly in pitch order (e.g., Kalyan Thaat or Bhairav Thaat). A Thaat has no emotional mood, no ascending/descending rules, and cannot be performed as music on its own.
• Classical Raag: A living, expressive musical entity defined by specific ascending and descending notes (Aaroh and Avaroh), dominant emphasis notes (Vadi and Samvadi), key catchphrases (Pakad), microtonal ornaments (Meend and Andolan), specific emotional rasas, and designated times of day for performance.`,
    relatedLink: { text: 'Explore Classical Raagas Guide', view: 'learn_raagas' },
    tags: ['scale vs raag', 'thaat', 'vadi samvadi', 'music theory']
  },
  {
    id: 'alankar-building-finger-agility-and-coordination',
    category: 'Scales & Alankars',
    question: 'How do Alankars improve finger agility, speed, and muscle memory?',
    answer: `Practicing Alankars systematically rewires motor pathways in your central nervous system, establishing lightning-fast finger synchronization and coordination.

How Alankars Build Agility:
• Eliminating Finger Hesitation: By repeating permutated patterns hundreds of times, your brain stops consciously calculating finger movements and triggers fluid motor sequences automatically.
• Sealing Integrity under Speed: Practicing fast Alankars forces finger pads to land squarely over hole centers without leaving microscopic air gaps.
• Isolated Finger Independence: Alankars strengthen weaker fingers (such as the ring fingers) that naturally struggle to lift and seal independently during complex runs.`,
    relatedLink: { text: 'Read Daily Practice Blueprint', view: 'learn_daily_practice' },
    tags: ['finger agility', 'muscle memory', 'coordination', 'alankars']
  },
  {
    id: 'alankar-transitioning-from-alankars-to-songs',
    category: 'Scales & Alankars',
    question: 'How do I bridge the gap between practicing Alankars and playing actual songs?',
    answer: `Songs, devotional melodies, and classical Bandishes are fundamentally constructed from interconnected fragments of Alankars and scale runs.

Bridging the Gap Effectively:
• Pattern Recognition in Melodies: When analyzing song notations, notice how melodic phrases are comprised of standard 3-note or 4-note Alankar patterns (such as Pa-Dha-Ni-Sa or Sa-Ga-Re-Ma).
• Isolate Difficult Song Phrases: Extract a challenging 4-note phrase from a favorite song or bhajan and practice it continuously like an Alankar 20 times over a Tanpura drone until it flows effortlessly.
• Apply Expression: Once finger movements are automated through Alankars, focus your mind on applying gentle breath dynamics and vocalic Meend glides to songs.`,
    relatedLink: { text: 'Browse Song Notations & Lessons', view: 'notation_requests' },
    tags: ['transition to songs', 'song notation', 'applied alankars']
  },
  {
    id: 'scale-most-common-scale-practice-mistakes',
    category: 'Scales & Alankars',
    question: 'What are the most common mistakes students make during scale practice?',
    answer: `Avoiding common scale practice mistakes saves months of frustration and ensures clean, melodic technique development.

Common Scale Practice Pitfalls:
1. Rushing Tempos: Playing faster than your fingers can seal holes cleanly, causing sloppy, squeaky, airy notes.
2. Practicing Without Tanpura: Practicing scales without a Tanpura drone leads to unperceived pitch drifting and poor intonation habits.
3. Lifting Fingers Too High: Raising fingers 3 to 4 cm off the bamboo tube slows down finger speed and ruins ergonomic posture.
4. Neglecting Descending Runs (Avaroh): Most students practice ascending scales (Aaroh) diligently but stumble when descending. Always dedicate equal practice time to Avaroh.`,
    relatedLink: { text: 'Read Common Pitfalls & Solutions', view: 'learn_common_mistakes' },
    tags: ['scale mistakes', 'avaroh', 'rushing', 'tanpura']
  },
  {
    id: 'alankar-dugun-and-chaugun-rhythmic-variations',
    category: 'Scales & Alankars',
    question: 'What are Dugun, Tigun, and Chaugun variations in Alankar practice?',
    answer: `In Indian classical music, rhythmic subdivisions (Layakari) are practiced systematically within Alankars to build internal timing and tempo control.

Understanding Rhythmic Subdivisions:
• Ekgun (Single Speed): 1 note played per metronome beat (1x baseline tempo).
• Dugun (Double Speed): 2 notes played evenly within the span of 1 beat (2x speed).
• Tigun (Triple Speed): 3 notes played evenly per metronome beat (3x speed / Triplet phrasing).
• Chaugun (Quadruple Speed): 4 notes played evenly per metronome beat (4x speed).
• Core Benefit: Practicing Layakari variations trains your brain to subdivide rhythmic time accurately without speeding up or slowing down the underlying pulse.`,
    relatedLink: { text: 'Practice Layakari in Alankar Engine', view: 'alankar_generator' },
    tags: ['layakari', 'dugun', 'tigun', 'chaugun', 'rhythm']
  },
  {
    id: 'scale-practicing-komal-and-teevra-swara-scales',
    category: 'Scales & Alankars',
    question: 'How do I practice scales containing Komal (flat) and Teevra (sharp) notes?',
    answer: `Beyond the all-Shuddha natural scale (Bilaval Thaat), practicing modified swara scales builds advanced finger versatility and microtonal accuracy.

Practicing Modified Swara Scales:
• Kalyan Thaat Scale: Replaces natural Shuddha Ma with Teevra Ma (sharp 4th, where all holes are open except half on the top hole).
• Bhairav Thaat Scale: Introduces Komal Re (flat 2nd) and Komal Dha (flat 6th) using half-hole finger coverage.
• Practice Strategy: Master half-hole finger positions over a Tanpura drone slowly, using a chromatic tuner to verify that flat notes sound in exact microtonal tune.`,
    relatedLink: { text: 'Explore Thaat Systems & Scales', view: 'learn_raagas' },
    tags: ['komal swaras', 'teevra ma', 'thaat scales', 'half hole practice']
  },
  {
    id: 'alankar-daily-scale-practice-duration',
    category: 'Scales & Alankars',
    question: 'How long should I spend on scales and Alankars each day?',
    answer: `The ideal amount of time dedicated to scale and Alankar practice depends on your current skill level and daily goals.

Recommended Scale Practice Durations:
• Beginner Level: 10 to 15 minutes daily focusing on 3 basic Alankars in Ekgun and Dugun speeds over a Tanpura drone.
• Intermediate Level: 20 to 30 minutes daily covering multi-octave scales, metronome speed building, and half-hole Komal swara drills.
• Advanced Level: 30 to 45 minutes incorporating complex Layakari variations across different Thaat scales and fast Taan patterns.`,
    relatedLink: { text: 'View Practice Structure Guide', view: 'learn_daily_practice' },
    tags: ['practice duration', 'scale routine', 'alankar time']
  },
  {
    id: 'scale-why-practice-alankars',
    category: 'Scales & Alankars',
    question: 'Why are Alankars (scale patterns) mandatory, and how do they build Raga mastery?',
    answer: `Alankars (structured permutations of notes such as SaReGa, ReGaMa or SaGa, ReMa, GaPa) are mandatory because they serve as the foundational building blocks of Indian classical music.

How Alankars Build Raag Mastery:
1. Automated Muscle Memory: They train your fingers to execute every possible note pair combination effortlessly.
2. Pitch & Intonation Precision: Repeating patterns over a Tanpura drone trains your ear to recognize exact intervals automatically.
3. Improvisation Fuel: When playing or improvising in a Raag, your mind pulls from these internalized Alankar building blocks instinctively.`,
    relatedLink: { text: 'Explore FluteSangam Alankar Generator', view: 'alankar_generator' },
    tags: ['alankars', 'scale patterns', 'muscle memory', 'raga preparation']
  },
  {
    id: 'scale-taar-and-mandra-saptak-alankars',
    category: 'Scales & Alankars',
    question: 'How do I practice Alankars across Mandra Saptak (lower octave) and Taar Saptak (higher octave)?',
    answer: `Expanding Alankars into lower and higher octaves requires precise breath air velocity adjustments and embouchure control.

Multi-Octave Alankar Adjustments:
• Mandra Saptak (Lower Octave): Keep air warm and slow. Relax lips and ensure 100% airtight finger hole coverage.
• Madhya Saptak (Middle Octave): Standard air speed and aperture size.
• Taar Saptak (Higher Octave): Narrow lip opening slightly and support air pressure from the lower abdomen. Do not force air; focus on air speed rather than air volume. Practice descending from Taar Sa back to Mandra Sa smoothly.`,
    relatedLink: { text: 'View Multi-Octave Scale Guide', view: 'learn_scales_octaves' },
    tags: ['multi octave', 'mandra saptak', 'taar saptak', 'octave alankars']
  },
  {
    id: 'scale-metronome-speed-building',
    category: 'Scales & Alankars',
    question: 'How do I systematically increase my metronome speed without sacrificing tone clarity?',
    answer: `Building fast finger speed on the bamboo flute requires a systematic approach so tone purity and rhythm remain uncompromised.

Systematic Speed Building Method:
1. Rule of 3 Clean Repetitions: Play an Alankar 3 times consecutively at your starting tempo (e.g. 60 BPM). If all 3 repetitions are 100% clean, increase tempo by +4 BPM.
2. Prioritize Tone Clarity: If notes become blurred, squeaky, or uneven, immediately decrease tempo by -8 BPM and focus on finger synchronization.
3. Utilize Subdivisions (Dugun & Chaugun): Keep the metronome at 60 BPM, but play 2 notes per beat (Dugun) then 4 notes per beat (Chaugun) to build internal rhythmic subdivision.`,
    relatedLink: { text: 'Use Alankar Practice Generator', view: 'alankar_generator' },
    tags: ['metronome', 'speed building', 'dugun', 'chaugun', 'tempo control']
  }
];
