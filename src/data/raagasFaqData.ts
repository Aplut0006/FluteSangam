import { FaqItem } from '../components/FluteFaqView';

export const RAAGAS_FAQS: FaqItem[] = [
  {
    id: 'raag-what-is-a-raag-definition',
    category: 'Raagas',
    question: 'What is a Raag in Indian Classical Music, and how does it differ from a song?',
    answer: `A Raag is a complex, living melodic framework in Indian classical music governed by strict grammatical rules, microtonal nuances (Shrutis), and emotional aesthetic character (Rasa).

Raag vs. Song Comparison:
• Fixed Composition vs. Flexible Framework: A song is a fixed composition with static lyrics, locked melodies, and predetermined arrangements. A Raag is a living, flexible melodic framework within which an artist creates infinite original improvisations while adhering to the Raag's structural rules.
• Core Anatomical Requirements: Every classical Raag must contain at least 5 swaras, establish a primary dominant note (Vadi) and secondary note (Samvadi), define mandatory ascending and descending pathways (Aaroh/Avaroh), incorporate signature catchphrases (Pakad), and evoke a distinct emotional mood (Rasa).`,
    relatedLink: { text: 'Explore All Raagas Guides', view: 'learn_raagas' },
    tags: ['raag definition', 'raag vs song', 'indian classical', 'improvisation']
  },
  {
    id: 'raag-essential-elements-vadi-samvadi-pakad',
    category: 'Raagas',
    question: 'What are Vadi, Samvadi, Aaroh, Avaroh, and Pakad in Raag grammar?',
    answer: `Understanding the anatomical grammar of a Raag is essential for every classical student and flutist navigating Hindustani music.

Key Structural Components of Raag Grammar:
• Aaroh & Avaroh: Aaroh is the mandatory ascending note pathway of the Raag; Avaroh is the mandatory descending pathway. Certain notes may be omitted (Varjit) in ascent but present in descent.
• Vadi Swara (King Note): The primary, most heavily emphasized note in the Raag. Lingering on Vadi establishes the Raag's emotional center.
• Samvadi Swara (Queen Note): The secondary prominent note, usually positioned a 4th or 5th harmonic interval away from Vadi, providing structural balance.
• Pakad (Catchphrase): The signature 3 to 6 note catchphrase that instantly identifies the Raag to a trained listener.`,
    relatedLink: { text: 'Read Raag Anatomy & Grammar Blueprint', view: 'learn_raagas' },
    tags: ['vadi', 'samvadi', 'aaroh', 'avaroh', 'pakad', 'raag grammar']
  },
  {
    id: 'raag-thaat-system-classification',
    category: 'Raagas',
    question: 'What is the Thaat system, and how are Raagas categorized into 10 parent scales?',
    answer: `In Hindustani classical music, musicologist Pandit Vishnu Narayan Bhatkhande categorized hundreds of classical Raagas under 10 parent 7-note heptatonic scales called Thaats.

The 10 Parent Thaats Overview:
1. Kalyan: All Shuddha (natural) notes + Teevra Ma (sharp 4th).
2. Bilaval: All 7 Shuddha (natural) notes.
3. Khamaj: Shuddha notes + Komal Ni (flat 7th) in descent.
4. Bhairav: Introduces Komal Re (flat 2nd) and Komal Dha (flat 6th).
5. Bhairavi: All 4 flat notes (Komal Re, Komal Ga, Komal Dha, Komal Ni).
6. Kafi: Features Komal Ga and Komal Ni.
7. Asavari: Features Komal Ga, Komal Dha, and Komal Ni.
8. Todi: Features Komal Re, Komal Ga, Komal Dha + Teevra Ma.
9. Poorvi: Features Komal Re, Komal Dha + Teevra Ma.
10. Marwa: Features Komal Re + Teevra Ma.`,
    relatedLink: { text: 'View 10 Thaats & Scale Chart', view: 'learn_raagas' },
    tags: ['thaat system', 'bhatkhande', '10 thaats', 'parent scales']
  },
  {
    id: 'raag-time-of-day-and-seasons',
    category: 'Raagas',
    question: 'Why are Raagas associated with specific times of day or seasons?',
    answer: `Hindustani classical music links specific acoustic frequencies and swara combinations to human circadian rhythms, emotional states, and natural atmospheric cycles throughout the day.

Time Cycles & Seasonal Associations:
• The 8 Prahars: The 24-hour day is divided into 8 three-hour time blocks (Prahars). Early morning Raagas (such as Raag Bhairav or Ahir Bhairav) utilize Komal Re and Komal Dha to evoke sunrise tranquility and spiritual awakening. Evening Raagas (such as Raag Yaman or Puriya Dhanashree) utilize Teevra Ma and Shuddha notes to mirror dusk twilight.
• Seasonal Raagas: Certain Raagas transcend daily time cycles and are celebrated during specific seasons—such as Raag Megh and Mian Malhar during monsoon rains, or Raag Basant during springtime.`,
    relatedLink: { text: 'Read Time Theory of Raagas', view: 'learn_raagas' },
    tags: ['time theory', 'prahars', 'seasonal raagas', 'circadian rhythm']
  },
  {
    id: 'raag-easiest-raagas-for-beginners',
    category: 'Raagas',
    question: 'Which Raagas are easiest for beginners to start learning on the bansuri?',
    answer: `For beginners transitioning from basic scale exercises to classical Raag performance, choosing accessible starter Raagas builds confidence and establishes solid classical technique.

Recommended Starter Raagas:
1. Raag Bhupali (Bhopali): A 5-note pentatonic evening Raag (Sa, Re, Ga, Pa, Dha) using all Shuddha notes and zero half-hole positions. Ideal for building pure tone, breath control, and vocalic Meend glides between Ga-Re and Pa-Dha.
2. Raag Yaman: Uses all natural notes plus Teevra Ma (sharp 4th). Teaches essential Kalyan Thaat grammar, half-hole blowing, and serene evening expression.
3. Raag Kafi or Raag Khamaj: Excellent for introducing single Komal (flat) swara positions in a sweet, highly melodious context.`,
    relatedLink: { text: 'Explore Beginner Raaga Tutorials', view: 'learn_raagas' },
    tags: ['beginner raagas', 'raag bhupali', 'raag yaman', 'starter raagas']
  },
  {
    id: 'raag-yaman-complete-overview',
    category: 'Raagas',
    question: 'Why is Raag Yaman universally taught as the foundation for beginners?',
    answer: `Raag Yaman (belonging to Kalyan Thaat) is universally considered the ultimate foundational gateway to Hindustani classical music across vocal and instrumental traditions.

Why Raag Yaman is the Ideal Foundation:
• Musical Anatomy: Features Shuddha Re, Ga, Dha, Ni alongside Teevra Ma (sharp 4th). Sa and Pa are omitted in ascending motion (Aaroh: 'Ni Re Ga, Ma' Dha Ni Sa').
• Pedagogical Value: Its serene, deeply soothing evening atmosphere is forgiving and emotionally satisfying. Playing Yaman teaches foundational concepts like omitted notes (Varjit Swaras), Teevra Ma half-hole execution, graceful Meends, and landing squarely on structural swaras.`,
    relatedLink: { text: 'Read Raag Yaman Guide & Notation', view: 'learn_raagas' },
    tags: ['raag yaman', 'kalyan thaat', 'foundation', 'teevra ma']
  },
  {
    id: 'raag-bhupali-audav-structure',
    category: 'Raagas',
    question: 'What makes Raag Bhupali (pentatonic scale) ideal for mastering flute tone?',
    answer: `Raag Bhupali (also known as Bhopali) belongs to Kalyan Thaat but uses a pentatonic 5-note structure (Audav-Audav Jati) in both ascending and descending lines.

Why Flutists Excel in Raag Bhupali:
• Notes Utilized: Sa, Re, Ga, Pa, Dha (Ma and Ni are completely omitted).
• Pure Tone Focus: Because all 5 notes correspond to full-finger hole positions requiring no half-hole coverage, flutists can dedicate 100% of their attention to breath resonance, sustained Kharaj notes, and vocalic Meend glides between Ga-Re and Pa-Dha without worrying about air leaks.`,
    relatedLink: { text: 'Read Raag Bhupali Guide & Bandish', view: 'learn_raagas' },
    tags: ['raag bhupali', 'audav jati', 'pentatonic', 'meend practice']
  },
  {
    id: 'raag-bairagi-and-komal-swara-raagas',
    category: 'Raagas',
    question: 'How do I practice Raagas with Komal swaras like Raag Bhairav or Raag Kafi?',
    answer: `Mastering flat notes (Komal Swaras) in classical Raagas requires developing precise half-hole finger control and active listening against a live Tanpura drone.

Komal Swara Practice Techniques:
• Precise Half-Hole Placement: Use a digital tuner and live Tanpura to calibrate exact microtonal positioning of Komal Re, Komal Ga, Komal Dha, or Komal Ni.
• Smooth Finger Sliding: Slide finger pads smoothly backward along the bamboo tube rather than lifting fingers vertically.
• Raag Bhairav Application: Raag Bhairav is a majestic early morning Raag featuring deep, meditative microtonal oscillations (Andolan) on Komal Re and Komal Dha.`,
    relatedLink: { text: 'Explore Komal Swara Fingering Guide', view: 'learn_fingering_chart' },
    tags: ['komal swaras', 'raag bhairav', 'raag kafi', 'andolan']
  },
  {
    id: 'raag-aalap-bandish-taan-structure',
    category: 'Raagas',
    question: 'How is a classical Raag performance structured (Aalap, Bandish, Taan)?',
    answer: `A formal Indian classical performance unfolds systematically across distinct, traditional structural movements:

Structural Progression Overview:
1. Aalap: A slow, unmetered, deeply contemplative movement introducing the Raag's mood and swara relationships without percussion.
2. Jor & Jhala: Accelerating rhythmic pulse introduced into the unmetered exploration without Tabla.
3. Bandish (Fixed Composition): Fixed rhythmic melody set to a specific Taal cycle (such as Teental 16 beats) accompanied by Tabla.
4. Taan & Swaravistar: Rapid, agile scale passages and creative improvisations expanding upon the Bandish composition.`,
    relatedLink: { text: 'Explore Classical Raaga Performance Structure', view: 'learn_raagas' },
    tags: ['aalap', 'bandish', 'taan', 'performance structure', 'teental']
  },
  {
    id: 'raag-rasa-and-emotional-expression',
    category: 'Raagas',
    question: 'What is Rasa theory, and how do different Raagas evoke specific emotions?',
    answer: `Rasa theory is the ancient Indian aesthetic framework classifying the fundamental emotional essences evoked by specific musical frequencies and swara relationships.

Primary Rasas in Music:
• Shanta (Peace & Serenity): Evoked by Raag Bhupali, Raag Yaman, and Raag Malkauns.
• Karuna (Pathos & Devotion): Evoked by Raag Bhairavi, Raag Ahir Bhairav, and Raag Todi.
• Shringar (Romance & Joy): Evoked by Raag Khamaj, Raag Desh, and Raag Kafi.
• Keyless Bansuri Advantage: The organic, breathy acoustic timbre of the bamboo bansuri is considered one of the finest instruments in the world for conveying subtle Rasa nuances.`,
    relatedLink: { text: 'Read Rasa Theory & Classical Aesthetics', view: 'learn_raagas' },
    tags: ['rasa theory', 'emotions', 'shanta', 'karuna', 'shringar']
  },
  {
    id: 'raag-brindavani-sarang-and-khamaj',
    category: 'Raagas',
    question: 'What are the key characteristics of popular intermediate Raagas like Khamaj and Brindavani Sarang?',
    answer: `Exploring popular intermediate Raagas on the bamboo flute expands your repertoire and introduces expressive microtonal variations.

Intermediate Raagas Characteristics:
• Raag Khamaj: A sweet, romantic Raag (belonging to Khamaj Thaat) using Shuddha Ni in ascent and Komal Ni in descent ('Ni Dha Pa Ma Ga Re Sa'). Highly famous for Thumris and light classical melodies.
• Raag Brindavani Sarang: An uplifting afternoon Raag (belonging to Kafi Thaat) using 5 notes in ascent and descent (Audav-Audav Jati). Features both Shuddha Ni and Komal Ni, creating a refreshing, sunny mood.`,
    relatedLink: { text: 'Read Complete Raag Khamaj Guide', view: 'raga_khamaj' },
    tags: ['raag khamaj', 'brindavani sarang', 'intermediate raagas']
  },
  {
    id: 'raag-improvisation-and-vistaar',
    category: 'Raagas',
    question: 'How do I begin improvising (Vistaar) within the strict boundaries of a Raag?',
    answer: `Beginning Raag improvisation (Swara Vistaar) systematically allows you to build original phrases while remaining strictly inside the Raag's grammatical rules.

Systematic Improvisation Steps:
1. Anchor to the Pakad: Use the signature catchphrase of the Raag as your home base anchor point.
2. Note-by-Note Swara Expansion (Vistaar): Begin from root Sa and expand note by note—first explore Mandra Saptak, then move to Re, Ga, and Ma, returning to Sa after every short phrase.
3. Respect Vadi Emphases: Pause and linger gracefully on the Vadi and Samvadi notes.
4. Listen & Transcribe: Listen to recordings of great masters and transcribe short 4-bar phrases to build your vocabulary.`,
    relatedLink: { text: 'View Raag Improvisation Blueprint', view: 'learn_raagas' },
    tags: ['improvisation', 'vistaar', 'pakad', 'swara expansion']
  },
  {
    id: 'raag-difference-raga-vs-scale',
    category: 'Raagas',
    question: 'What is the fundamental difference between a Raag and a Western scale or mode?',
    answer: `A Western scale or mode is simply a collection of notes arranged by pitch order. In contrast, a Raag is a complete living melodic framework defined by:

Key Distinguishing Pillars:
1. Specific Ascending & Descending Pathways (Aaroh & Avaroh): Notes may be omitted or taken in specific curved pathways.
2. Important Swaras (Vadi & Samvadi): Specific notes act as the primary and secondary structural pillars.
3. Signature Catchphrase (Pakad): Unmistakable note movements that instantly identify the Raag.
4. Time & Emotion (Prahar & Rasa): Raagas are traditionally associated with specific times of day or seasons to evoke deep emotional resonances.`,
    relatedLink: { text: 'Explore All Raaga Guides & Audio Demos', view: 'learn_raagas' },
    tags: ['raga vs scale', 'aaroh avaroh', 'vadi samvadi', 'raaga fundamentals']
  },
  {
    id: 'raag-vadi-samvadi-importance',
    category: 'Raagas',
    question: 'What are Vadi and Samvadi notes, and why are they vital in Raag development?',
    answer: `In Hindustani classical music theory, Vadi and Samvadi notes form the primary structural pillars of every Raag.

Understanding Vadi & Samvadi:
• Vadi Swara (King Note): The most dominant, heavily emphasized, and frequently visited note in a Raag. Lingering on Vadi establishes the Raag's emotional center.
• Samvadi Swara (Queen Note): The second most prominent note, usually positioned a 4th or 5th harmonic interval away from Vadi, providing structural balance.
• Examples: In Raag Yaman, Teevra Ma is Vadi and Ni is Samvadi; in Raag Bhupali, Ga is Vadi and Dha is Samvadi.`,
    relatedLink: { text: 'Read Raag Yaman & Bhupali Notations', view: 'raga_bhoopali' },
    tags: ['vadi', 'samvadi', 'king note', 'raag theory', 'swara emphasis']
  },
  {
    id: 'raag-pakad-and-bandish',
    category: 'Raagas',
    question: 'How do I use a Raag\'s Pakad (catch phrase) to compose or improvise a Bandish?',
    answer: `Mastering a Raag's Pakad unlocks fluent classical improvisation and original composition.

How Pakad Functions in Music:
1. Internalize the Pakad: The Pakad is a short 3 to 6 note sequence (e.g. 'GR, SR, S' in Raag Bhupali) that uniquely characterizes the Raag.
2. Weave Phrases Around Pakad: When playing Aalap or improvising Taans, treat the Pakad as an anchor point that you return to periodically.
3. Bandish Framing: In a Bandish (fixed composition), the Sthayi (first section) and Antara (second section) both incorporate Pakad motifs to establish the Raag's identity clearly.`,
    relatedLink: { text: 'Explore Raag Jog & Marwa Detailed Guides', view: 'raga_jog' },
    tags: ['pakad', 'bandish', 'sthayi antara', 'composition', 'improvisation']
  }
];
