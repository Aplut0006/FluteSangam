import { FaqItem } from '../components/FluteFaqView';

export const MUSIC_THEORY_FAQS: FaqItem[] = [
  {
    id: 'theory-sargam-vs-western-solfege',
    category: 'Music Theory & Tuning',
    question: 'What is Sargam (Sa Re Ga Ma) and how does it map to Western Solfege (Do Re Mi)?',
    answer: `Sargam is the traditional Indian solfège naming system used to identify the seven natural notes (Shuddha Swaras) of the octave.

Indian Sargam & Solfege Mapping:
• Full Swara Names: Shadja (Sa), Rishabh (Re), Gandhar (Ga), Madhyam (Ma), Pancham (Pa), Dhaivat (Dha), Nishad (Ni).
• Direct Western Solfege Mapping:
  - Sa = Do (Tonic Root Pitch)
  - Re = Re (Major 2nd)
  - Ga = Mi (Major 3rd)
  - Ma = Fa (Perfect 4th)
  - Pa = Sol (Perfect 5th)
  - Dha = La (Major 6th)
  - Ni = Ti (Major 7th)
• Fundamental Difference: Western Fixed Do locks 'Do' to C natural. In Indian classical music, Sa is a moveable tonic—meaning any physical flute pitch (e.g., C, C#, D, E, G) can be designated as root Sa.`,
    relatedLink: { text: 'Read Indian Music Theory Fundamentals', view: 'learn_basics' },
    tags: ['sargam', 'solfege', 'sa re ga ma', 'do re mi', 'movable sa']
  },
  {
    id: 'theory-shuddha-komal-teevra-swaras',
    category: 'Music Theory & Tuning',
    question: 'What are Shuddha, Komal, and Teevra swaras, and how many total notes exist in an octave?',
    answer: `An octave in Indian classical music contains 12 chromatic swara positions, divided into natural notes (Shuddha) and modified notes (Vikrit).

Classification of the 12 Swaras:
1. Immovable Anchor Notes (Achala Swaras): Sa (Tonic 1st) and Pa (Perfect 5th) are immovable anchors that can never be flat or sharp.
2. Natural Notes (Shuddha Swaras): The 7 natural pitch positions (Sa, Shuddha Re, Shuddha Ga, Shuddha Ma, Pa, Shuddha Dha, Shuddha Ni).
3. Flat Notes (Komal Swaras): Re, Ga, Dha, and Ni can be lowered by a semitone (Komal Re, Komal Ga, Komal Dha, Komal Ni).
4. Sharp Note (Teevra Swara): Ma can be raised by a semitone (Teevra Ma).
• Total Octave Count: 2 Achala + 5 Shuddha + 4 Komal + 1 Teevra = 12 Swaras.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['shuddha', 'komal', 'teevra', 'vikrit swaras', '12 swaras']
  },
  {
    id: 'theory-a440hz-vs-a432hz-tuning',
    category: 'Music Theory & Tuning',
    question: 'What is A=440Hz vs A=432Hz pitch tuning, and which is standard for Indian bansuri?',
    answer: `Pitch standards govern master tuning calibration across instruments, studio equipment, and performance venues.

Understanding Pitch Standards:
• A=440Hz Standard Pitch: The universally accepted concert pitch standard worldwide. Professional master bansuris are tuned to A=440Hz at 25°C room temperature so they align seamlessly with digital Tanpuras, studio recordings, keyboards, and acoustic accompaniment.
• A=432Hz Alternative Tuning: A slightly lower tuning frequency favored by some sound healing practitioners and meditative solo flutists.
• Practical Recommendation: FluteSangam strongly recommends purchasing A=440Hz standard concert flutes to ensure full compatibility with accompaniment apps, digital Tanpura drones, and studio sessions.`,
    relatedLink: { text: 'Use Built-in Live Flute Tuner', view: 'learn_tuner' },
    tags: ['440hz', '432hz', 'concert pitch', 'tuning standard']
  },
  {
    id: 'theory-just-intonation-vs-equal-temperament',
    category: 'Music Theory & Tuning',
    question: 'What is Just Intonation (pure harmonics) vs Equal Temperament, and why does it matter for bansuri?',
    answer: `Understanding tuning systems reveals why the bamboo flute produces such a sweet, deeply resonant sound when played alongside a Tanpura.

Comparing Tuning Systems:
• Equal Temperament (Western Pianos/Keyboards): Divides the octave into 12 mathematically equal semitones. Highly versatile for chord modulations, but harmonic fifths and thirds carry slight acoustic dissonance.
• Just Intonation (Pure Acoustic Harmonics): Bansuris are tuned according to pure mathematical acoustic intervals against a continuous Tanpura drone. Notes like Shuddha Ga or Pa lock into shimmering, vibration-free acoustic resonance with the drone overtones.`,
    relatedLink: { text: 'Read Acoustics & Intonation Guide', view: 'learn_basics' },
    tags: ['just intonation', 'equal temperament', 'harmonics', 'tanpura resonance']
  },
  {
    id: 'theory-taal-rhythm-cycles-and-tabla',
    category: 'Music Theory & Tuning',
    question: 'What is a Taal cycle (e.g., Teental, Dadra, Keherwa) and how does rhythmic alignment work?',
    answer: `Taal is the cyclical rhythmic framework of Indian music, providing structural time loops within which melodies and improvisations unfold.

Common Classical & Folk Taal Cycles:
• TeenTaal (16 Beats / Matras): Divided 4+4+4+4. The primary classical rhythm cycle featuring Sam on Beat 1 and Khali on Beat 9.
• Dadra Taal (6 Beats): Divided 3+3. Widely used in light classical bhajans, ghazals, and folk melodies.
• Keherwa Taal (8 Beats): Divided 4+4. Popular in semi-classical, devotional, and popular songs.
• Jhaptal (10 Beats): Divided 2+3+2+3. Used in classical compositions.`,
    relatedLink: { text: 'Explore Rhythm & Alankar Practice', view: 'alankar_generator' },
    tags: ['taal', 'teental', 'dadra', 'keherwa', 'rhythm cycles']
  },
  {
    id: 'theory-the-22-shrutis-explained',
    category: 'Music Theory & Tuning',
    question: 'What are the 22 Shrutis (microtonal intervals) in ancient Indian music theory?',
    answer: `Shruti refers to the smallest microtonal pitch intervals distinguishable by the trained human ear in Indian classical music theory.

Understanding the 22 Shrutis:
• Ancient Musicological Texts: Works like Bharat Muni's Natya Shastra divide the 12 semitones of an octave into 22 distinct microtonal Shrutis.
• Keyless Bansuri Expression: Because the bamboo flute features bare finger holes and no metal keys, a master flutist adjusts blowing angle, lip aperture, and half-hole finger coverage to express microtonal variations (such as the lower Komal Ga in Raag Darbari Kanada versus the slightly higher Komal Ga in Raag Kafi).`,
    relatedLink: { text: 'Read Microtones & Shrutis Blueprint', view: 'learn_raagas' },
    tags: ['22 shrutis', 'microtones', 'natya shastra', 'intonation']
  },
  {
    id: 'theory-octaves-mandra-madhya-taar',
    category: 'Music Theory & Tuning',
    question: 'What are Saptaks (Mandra, Madhya, and Taar octaves) in Hindustani music?',
    answer: `Hindustani classical music spans three primary octave registers (Saptaks) across vocal and instrumental performances.

The Three Primary Saptaks:
1. Mandra Saptak (Lower Octave): Deep, warm, low-register notes. Notated with a dot below the swara letter (e.g., ṇi, ḏha, pa).
2. Madhya Saptak (Middle Octave): Standard mid-range register where most compositions reside. Notated without dots (e.g., Sa, Re, Ga).
3. Taar Saptak (Higher Octave): Bright, high-register notes. Notated with a dot above the swara letter (e.g., Ṡa, Ṙe, Ġa).`,
    relatedLink: { text: 'View Fingering Chart Across All Octaves', view: 'learn_fingering_chart' },
    tags: ['saptak', 'mandra saptak', 'madhya saptak', 'taar saptak', 'notation']
  },
  {
    id: 'theory-tanpura-drone-tuning-pa-sa-vs-ma-sa',
    category: 'Music Theory & Tuning',
    question: 'How is a Tanpura drone tuned (Pa-Sa vs Ma-Sa vs Ni-Sa) for different Raagas?',
    answer: `The 4 strings of a Tanpura drone are tuned according to the key structural notes of the Raag being performed.

Tanpura Drone String Configurations:
• Pa-Sa Tuning (First String Pa): Used for most Raagas that contain a natural Pancham (Pa), such as Raag Yaman, Raag Bhupali, or Raag Bihag.
• Ma-Sa Tuning (First String Shuddha Ma): Used for Raagas that omit or deemphasize Pa, such as Raag Malkauns, Raag Lalit, or Raag Bageshree.
• Ni-Sa Tuning (First String Shuddha/Komal Ni): Used for Raagas that strongly emphasize Ni, such as Raag Puriya or Raag Marwa.`,
    relatedLink: { text: 'Practice with Live Tanpura Engine', view: 'learn_tuner' },
    tags: ['tanpura tuning', 'pa-sa', 'ma-sa', 'drone harmonics']
  },
  {
    id: 'theory-transposition-and-scale-selection',
    category: 'Music Theory & Tuning',
    question: 'How does pitch transposition work on a fixed-pitch instrument like the bansuri?',
    answer: `Understanding transposition on keyless flutes allows you to accompany singers and play alongside instruments in any key.

Transposition Mechanics:
• Moveable Sa Concept: When playing solo, you can designate your flute's natural 3-hole root as "Sa" and play any Raag or song natively.
• Accompaniment Alignment: When accompanying a vocalist whose tonic pitch is D Natural, you must select a D Natural flute if you want 3-hole Sa to match their tonic, or transpose your fingering accordingly.`,
    relatedLink: { text: 'Read Scale & Key Selection Guide', view: 'learn_choose_flute' },
    tags: ['transposition', 'scale selection', 'moveable sa', 'accompaniment']
  },
  {
    id: 'theory-reading-indian-music-notation',
    category: 'Music Theory & Tuning',
    question: 'How do I read Indian classical music notation (Bhatkhande notation system)?',
    answer: `Reading Bhatkhande notation is straightforward once you familiarize yourself with standard diacritical symbols.

Bhatkhande Symbol Key:
• Swara Symbols: S, R, G, M, P, D, N denote notes.
• Komal & Teevra Markings: Flat notes are underlined (e.g., <u>R</u>, <u>G</u>); Teevra Ma features a vertical line above (M').
• Octave Dots: Dots below indicate Mandra Saptak; dots above indicate Taar Saptak.
• Rhythm Ties: Notes grouped under a tie arc split time evenly within a beat.`,
    relatedLink: { text: 'Explore Notation Requests & Guides', view: 'notation_requests' },
    tags: ['bhatkhande notation', 'reading notation', 'swara symbols']
  },
  {
    id: 'theory-harmony-vs-melody-in-indian-music',
    category: 'Music Theory & Tuning',
    question: 'Why does Indian music focus on rich linear melody (Raag) rather than harmonic chords?',
    answer: `Philosophical and acoustic differences distinguish Western harmonic traditions from Indian linear melodic traditions.

Melodic Linearity vs. Harmonic Density:
• Western Harmony: Focuses on polyphony, chord progressions, and counterpoint where multiple distinct pitches sound simultaneously.
• Indian Melodic Linearity: Focuses on the infinite microtonal refinement of a single melodic line (Raag) resonating over a continuous stationary drone (Tanpura). This enables unmatched microtonal expression, Meend glides, and deep emotional Rasa on a single note.`,
    relatedLink: { text: 'Read Founders Story & Music Aesthetics', view: 'founder' },
    tags: ['melody vs harmony', 'linear melody', 'microtonal depth']
  },
  {
    id: 'theory-sam-khali-tali-in-taal',
    category: 'Music Theory & Tuning',
    question: 'What are Sam, Tali, Khali, and Avartan in Indian Taal rhythm theory?',
    answer: `Rhythmic landmarks govern how Indian classical compositions and improvisations resolve precisely in time.

Rhythm Landmarks Overview:
• Avartan: One complete revolution/cycle of a Taal from beat 1 back to beat 1.
• Sam (Beat 1): The most important, emphasized first beat of the Taal cycle (marked 'X'). Compositions resolve triumphantly on Sam.
• Tali (Clap Beats): Section accent beats marked with hand claps.
• Khali (Wave Beat): An open, unaccented beat marked with a hand wave ('0'), indicating the midpoint of the cycle.`,
    relatedLink: { text: 'Explore Rhythm & Taal Tutorials', view: 'learn_basics' },
    tags: ['sam', 'khali', 'tali', 'avartan', 'rhythm theory']
  },
  {
    id: 'theory-understanding-taal-and-matras',
    category: 'Music Theory & Notation',
    question: 'How do I count Matras (beats) in TeenTaal, EkTaal, and Keherwa?',
    answer: `Counting beats (Matras) systematically builds internal timing and tempo control during classical flute playing.

Counting Key Rhythm Cycles:
• Keherwa Taal (8 Matras): Divided 4+4. Popular in folk, light classical, and Bollywood songs.
• TeenTaal (16 Matras): Divided 4+4+4+4. The standard rhythm cycle for Hindustani classical compositions. Sam on Beat 1, Khali on Beat 9.
• EkTaal (12 Matras): Divided 2+2+2+2+2+2. Used in fast Drut compositions and classical khayals.`,
    relatedLink: { text: 'Practice Rhythm Drills in Alankar Generator', view: 'alankar_generator' },
    tags: ['teentaal', 'keherwa', 'ektaal', 'matras', 'taal counting']
  },
  {
    id: 'theory-reading-bhatkhande-notation',
    category: 'Music Theory & Notation',
    question: 'How do I read Bhatkhande Sargam notation symbols (dots, underlines, curves)?',
    answer: `Quick reference guide to reading Bhatkhande notation symbols in song sheets:

Notation Key Reference:
• Standard Swaras (S, R, G, M, P, D, N): Middle octave Shuddha notes.
• Dot Above (Ṡ, Ṙ): Higher octave (Taar Saptak) notes.
• Dot Below (Ṣ, Ṛ): Lower octave (Mandra Saptak) notes.
• Underlined Note (<u>R</u>, <u>G</u>, <u>D</u>, <u>N</u>): Komal (flat) swaras played half-hole.
• Vertical Line Above (M'): Teevra Ma (sharp 4th).
• Slur Curve (S~G): Meend (continuous vocalic glide).`,
    relatedLink: { text: 'Browse Free Song Sargam Notations', view: 'notation_requests' },
    tags: ['bhatkhande notation', 'sargam symbols', 'music notation', 'dots and underlines']
  },
  {
    id: 'theory-transposing-keys',
    category: 'Music Theory & Notation',
    question: 'How do I transpose a song from C Natural to G Natural or E Bass scale?',
    answer: `Because Indian music uses relative Sargam notation (Sa Re Ga Ma), song transposition across different flute keys is seamless and automatic.

Transposition Made Simple:
1. Relative Fingering System: A song written in Sargam (e.g., 'Sa Re Ga Pa') remains identical in finger placement regardless of which flute key you hold!
2. Automatic Key Shift: Playing 'Sa Re Ga Pa' on a C Medium flute sounds in C key; playing the exact same fingering on an E Bass flute automatically sounds in E Bass key.
3. Accompaniment Alignment: When playing with a backing track in G key, pick up your G Natural flute and play the standard Sargam fingering natively.`,
    relatedLink: { text: 'Read Scale Selection & Transposition Blueprint', view: 'learn_choose_flute' },
    tags: ['transposition', 'flute keys', 'relative sa', 'accompaniment']
  }
];
