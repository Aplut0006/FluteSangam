import { FaqItem } from '../components/FluteFaqView';

export const MUSIC_THEORY_FAQS: FaqItem[] = [
  {
    id: 'theory-sargam-vs-western-solfege',
    category: 'Music Theory & Tuning',
    question: 'What is Sargam (Sa Re Ga Ma) and how does it map to Western Solfege (Do Re Mi)?',
    answer: `Sargam is the Indian solfège naming system for the 7 natural notes of the musical scale:

- Indian Sargam Names: Shadja (Sa), Rishabh (Re), Gandhar (Ga), Madhyam (Ma), Pancham (Pa), Dhaivat (Dha), Nishad (Ni).
- Direct Solfege Mapping:
  - Sa = Do (Root Tonic)
  - Re = Re
  - Ga = Mi
  - Ma = Fa
  - Pa = Sol
  - Dha = La
  - Ni = Ti
- Key Difference: Western Solfege is often fixed to C=Do, whereas in Indian music, Sa is moveable and can be set to any physical pitch (e.g., C, C#, D, E, G).`,
    relatedLink: { text: 'Read Indian Music Theory Fundamentals', view: 'learn_basics' },
    tags: ['sargam', 'solfege', 'sa re ga ma', 'do re mi', 'movable sa']
  },
  {
    id: 'theory-shuddha-komal-teevra-swaras',
    category: 'Music Theory & Tuning',
    question: 'What are Shuddha, Komal, and Teevra swaras, and how many total notes exist in an octave?',
    answer: `An octave in Indian music contains 12 chromatic swaras divided into three categories:

1. Fixed Swaras (Achala Swaras): Sa and Pa are immovable anchor notes (never flat or sharp).
2. Shuddha Swaras (Natural Notes): The 7 natural pitch positions (Sa, Shuddha Re, Shuddha Ga, Shuddha Ma, Pa, Shuddha Dha, Shuddha Ni).
3. Altered Swaras (Vikrit Swaras):
   - Komal Swaras (Flat Notes): Re, Ga, Dha, Ni can be lowered by a semitone (Komal Re, Komal Ga, Komal Dha, Komal Ni).
   - Teevra Swara (Sharp Note): Ma can be raised by a semitone (Teevra Ma).
- Total: 2 Achala + 5 Shuddha + 4 Komal + 1 Teevra = 12 Swaras per octave.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['shuddha', 'komal', 'teevra', 'vikrit swaras', '12 swaras']
  },
  {
    id: 'theory-a440hz-vs-a432hz-tuning',
    category: 'Music Theory & Tuning',
    question: 'What is A=440Hz vs A=432Hz pitch tuning, and which is standard for Indian bansuri?',
    answer: `Pitch standards govern master tuning:

- A=440Hz Standard: The worldwide concert pitch standard. Professional concert bansuris are tuned to A=440Hz at 25°C room temperature so they align seamlessly with Tanpuras, keyboards, and digital studio recordings.
- A=432Hz Alternative: A slightly lower tuning pitch favored by some meditative and healing music practitioners.
- Recommendation: Stick to A=440Hz standard flutes to ensure compatibility with electronic Tanpura apps and accompaniment software.`,
    relatedLink: { text: 'Use Built-in Live Flute Tuner', view: 'learn_tuner' },
    tags: ['440hz', '432hz', 'concert pitch', 'tuning standard']
  },
  {
    id: 'theory-just-intonation-vs-equal-temperament',
    category: 'Music Theory & Tuning',
    question: 'What is Just Intonation (pure harmonics) vs Equal Temperament, and why does it matter for bansuri?',
    answer: `Understanding tuning systems:

- Equal Temperament (Western Pianos/Keyboards): Divides the octave into 12 mathematically equal semitones. Highly versatile for chord modulations, but harmonic fifths and thirds carry slight acoustic dissonance.
- Just Intonation (Pure Harmonic Intervals): Bansuris are tuned to pure mathematical acoustic intervals against a continuous Tanpura drone. Notes like Shuddha Ga or Pa lock into shimmering, vibration-free resonance with the drone.`,
    relatedLink: { text: 'Read Acoustics & Intonation Guide', view: 'learn_basics' },
    tags: ['just intonation', 'equal temperament', 'harmonics', 'tanpura resonance']
  },
  {
    id: 'theory-taal-rhythm-cycles-and-tabla',
    category: 'Music Theory & Tuning',
    question: 'What is a Taal cycle (e.g., Teental, Dadra, Keherwa) and how does rhythmic alignment work?',
    answer: `Taal is the cyclical rhythmic framework of Indian music:

- Common Taal Cycles:
  - Teental: 16 beats divided into 4 equal sections (4+4+4+4). The most important classical rhythm cycle.
  - Dadra: 6 beats (3+3), widely used in light classical bhajans and folk melodies.
  - Keherwa: 8 beats (4+4), popular in semi-classical and popular songs.
  - Jhaptal: 10 beats (2+3+2+3), popular in classical compositions.
- Function: Gives structure to Bandishes and dictates where rhythmic improvisations resolve.`,
    relatedLink: { text: 'Explore Rhythm & Alankar Practice', view: 'alankar_generator' },
    tags: ['taal', 'teental', 'dadra', 'keherwa', 'rhythm cycles']
  },
  {
    id: 'theory-the-22-shrutis-explained',
    category: 'Music Theory & Tuning',
    question: 'What are the 22 Shrutis (microtonal intervals) in ancient Indian music theory?',
    answer: `Shruti refers to the smallest microtonal pitch intervals distinguishable by the trained human ear:

- 22 Microtones: Ancient musicological texts (like Bharat's Natya Shastra) divide the 12 semitones of an octave into 22 distinct microtonal Shrutis.
- Expression on Bansuri: Because the bamboo flute has no frets or keys, a master flutist adjusts lip angle and half-hole finger positions to express microtonal variations (e.g., the slightly lower Komal Ga in Raag Darbari versus the slightly higher Komal Ga in Raag Kafi).`,
    relatedLink: { text: 'Read Microtones & Shrutis Blueprint', view: 'learn_raagas' },
    tags: ['22 shrutis', 'microtones', 'natya shastra', 'intonation']
  },
  {
    id: 'theory-octaves-mandra-madhya-taar',
    category: 'Music Theory & Tuning',
    question: 'What are Saptaks (Mandra, Madhya, and Taar octaves) in Hindustani music?',
    answer: `Hindustani classical music spans three primary octave registers (Saptaks):

1. Mandra Saptak (Lower Octave): Deep, warm, low-register notes. Notated with a dot below the swara (e.g., ṇi, ḏha, pa).
2. Madhya Saptak (Middle Octave): Standard mid-range register. Notated without dots (e.g., Sa, Re, Ga).
3. Taar Saptak (Higher Octave): Bright, high-register notes. Notated with a dot above the swara (e.g., Ṡa, Ṙe, Ġa).`,
    relatedLink: { text: 'View Fingering Chart Across All Octaves', view: 'learn_fingering_chart' },
    tags: ['saptak', 'mandra saptak', 'madhya saptak', 'taar saptak', 'notation']
  },
  {
    id: 'theory-tanpura-drone-tuning-pa-sa-vs-ma-sa',
    category: 'Music Theory & Tuning',
    question: 'How is a Tanpura drone tuned (Pa-Sa vs Ma-Sa vs Ni-Sa) for different Raagas?',
    answer: `The 4 strings of a Tanpura drone are tuned according to the Raag's key notes:

- Standard Pa-Sa Tuning (First string Pa): Used for most Raagas that contain a natural Pancham (Pa), such as Raag Yaman, Bhupali, or Bihag.
- Ma-Sa Tuning (First string Shuddha Ma): Used for Raagas that omit or deemphasize Pa, such as Raag Malkauns or Raag Lalit.
- Ni-Sa Tuning (First string Shuddha/Komal Ni): Used for Raagas that strongly emphasize Ni, such as Raag Puriya or Marwa.`,
    relatedLink: { text: 'Practice with Live Tanpura Engine', view: 'learn_tuner' },
    tags: ['tanpura tuning', 'pa-sa', 'ma-sa', 'drone harmonics']
  },
  {
    id: 'theory-transposition-and-scale-selection',
    category: 'Music Theory & Tuning',
    question: 'How does pitch transposition work on a fixed-pitch instrument like the bansuri?',
    answer: `Understanding transposition on keyless flutes:

- Moveable Sa Concept: When playing solo, you can designate your flute's natural root as "Sa" and play any Raag or song natively.
- Playing with Accompaniment: When playing with a singer whose tonic pitch is D Natural, you must choose a D Natural flute if you want 3-hole Sa to match their D Natural tonic, or transpose your fingering accordingly.`,
    relatedLink: { text: 'Read Scale & Key Selection Guide', view: 'learn_choose_flute' },
    tags: ['transposition', 'scale selection', 'moveable sa', 'accompaniment']
  },
  {
    id: 'theory-reading-indian-music-notation',
    category: 'Music Theory & Tuning',
    question: 'How do I read Indian classical music notation (Bhatkhande notation system)?',
    answer: `Reading Bhatkhande notation:

- Swara Letters: S, R, G, M, P, D, N denote notes.
- Komal / Teevra Indicators: Flat notes are underlined (e.g., <u>R</u>, <u>G</u>); Teevra Ma has a vertical line above (M').
- Octave Indicators: Dots below indicate Mandra Saptak; dots above indicate Taar Saptak.
- Rhythm Duration: Notes grouped under a tie arc split time evenly within a beat beat.`,
    relatedLink: { text: 'Explore Notation Requests & Guides', view: 'notation_requests' },
    tags: ['bhatkhande notation', 'reading notation', 'swara symbols']
  },
  {
    id: 'theory-harmony-vs-melody-in-indian-music',
    category: 'Music Theory & Tuning',
    question: 'Why does Indian music focus on rich linear melody (Raag) rather than harmonic chords?',
    answer: `Philosophical and structural differences between Western and Indian music:

- Western Music (Vertical Harmony): Focuses on polyphony, chord progressions, and counterpoint where multiple distinct pitches sound simultaneously.
- Indian Music (Horizontal Linearity): Focuses on the infinite microtonal refinement of a single melodic line (Raag) resonating over a stationary harmonic drone (Tanpura). This allows unmatched microtonal expression, Meend glides, and emotional depth on a single note.`,
    relatedLink: { text: 'Read Founders Story & Music Aesthetics', view: 'founder' },
    tags: ['melody vs harmony', 'linear melody', 'microtonal depth']
  },
  {
    id: 'theory-sam-khali-tali-in-taal',
    category: 'Music Theory & Tuning',
    question: 'What are Sam, Tali, Khali, and Avartan in Indian Taal rhythm theory?',
    answer: `Rhythm cycle markers in classical performance:

- Avartan: One complete revolution/cycle of a Taal from beat 1 back to beat 1.
- Sam (Beat 1): The most important, emphasized first beat of the Taal cycle, marked with an 'X'. Compositions and improvisations resolve triumphantly on Sam.
- Tali (Clap Beats): Section beats marked with hand claps.
- Khali (Wave Beat): An open, unaccented beat marked with a hand wave (marked '0'), indicating the midpoint of the cycle.`,
    relatedLink: { text: 'Explore Rhythm & Taal Tutorials', view: 'learn_basics' },
    tags: ['sam', 'khali', 'tali', 'avartan', 'rhythm theory']
  }
];
