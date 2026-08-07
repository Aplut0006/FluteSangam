import { FaqItem } from '../components/FluteFaqView';

export const RAAGAS_FAQS: FaqItem[] = [
  {
    id: 'raag-what-is-a-raag-definition',
    category: 'Raagas',
    question: 'What is a Raag in Indian Classical Music, and how does it differ from a song?',
    answer: `A Raag is a melodic framework in Indian classical music governed by strict grammatical rules, microtonal nuances, and emotional character:

- Raag vs Song: A song is a fixed composition with specific lyrics and melodies. A Raag is a living, flexible melodic blueprint within which infinite original improvisations can be created.
- Core Requirements: Every Raag must contain at least 5 notes, establish a dominant note (Vadi) and secondary note (Samvadi), use characteristic key phrases (Pakad), and evoke a distinct emotional aesthetic (Rasa).`,
    relatedLink: { text: 'Explore All Raagas Guides', view: 'learn_raagas' },
    tags: ['raag definition', 'raag vs song', 'indian classical', 'improvisation']
  },
  {
    id: 'raag-essential-elements-vadi-samvadi-pakad',
    category: 'Raagas',
    question: 'What are Vadi, Samvadi, Aaroh, Avaroh, and Pakad in Raag grammar?',
    answer: `Key structural concepts in classical Raag analysis:

- Aaroh: The mandatory ascending note sequence of the Raag.
- Avaroh: The mandatory descending note sequence of the Raag.
- Vadi Swara: The most dominant "king" note of the Raag, emphasized repeatedly during performance.
- Samvadi Swara: The secondary "queen" note, typically positioned a 4th or 5th interval away from the Vadi.
- Pakad: The signature catch phrase that instantly identifies the Raag to a trained listener.`,
    relatedLink: { text: 'Read Raag Anatomy & Grammar Blueprint', view: 'learn_raagas' },
    tags: ['vadi', 'samvadi', 'aaroh', 'avaroh', 'pakad', 'raag grammar']
  },
  {
    id: 'raag-thaat-system-classification',
    category: 'Raagas',
    question: 'What is the Thaat system, and how are Raagas categorized into 10 parent scales?',
    answer: `In Hindustani classical music, Pandit Vishnu Narayan Bhatkhande classified hundreds of Raagas under 10 parent 7-note heptatonic scales called Thaats:

1. Kalyan: Shuddha notes + Teevra Ma.
2. Bilaval: All 7 Shuddha (natural) notes.
3. Khamaj: Shuddha notes + Komal Ni in descent.
4. Bhairav: Komal Re and Komal Dha.
5. Bhairavi: All 4 flat notes (Komal Re, Ga, Dha, Ni).
6. Kafi: Komal Ga and Komal Ni.
7. Asavari: Komal Ga, Dha, Ni.
8. Todi: Komal Re, Ga, Dha + Teevra Ma.
9. Poorvi: Komal Re, Komal Dha + Teevra Ma.
10. Marwa: Komal Re + Teevra Ma.`,
    relatedLink: { text: 'View 10 Thaats & Scale Chart', view: 'learn_raagas' },
    tags: ['thaat system', 'bhatkhande', '10 thaats', 'parent scales']
  },
  {
    id: 'raag-time-of-day-and-seasons',
    category: 'Raagas',
    question: 'Why are Raagas associated with specific times of day or seasons?',
    answer: `Indian music theory links musical frequencies to circadian human body rhythms and natural cycles:

- Time Cycles (Prahars): The 24-hour day is divided into 8 three-hour Prahars. Morning Raagas (like Bhairav or Ahir Bhairav) use Komal Re and Dha to evoke sunrise tranquility; evening Raagas (like Yaman or Puriya Dhanashree) use Teevra Ma and Shuddha notes to mirror dusk twilight.
- Seasonal Raagas: Certain Raagas transcend time cycles and are celebrated during specific seasons—such as Raag Megh and Mian Malhar during the monsoon rains, or Raag Basant during springtime.`,
    relatedLink: { text: 'Read Time Theory of Raagas', view: 'learn_raagas' },
    tags: ['time theory', 'prahars', 'seasonal raagas', 'circadian rhythm']
  },
  {
    id: 'raag-easiest-raagas-for-beginners',
    category: 'Raagas',
    question: 'Which Raagas are easiest for beginners to start learning on the bansuri?',
    answer: `Recommended starter Raagas for new bansuri students:

1. Raag Bhupali: A 5-note pentatonic Raag (Sa, Re, Ga, Pa, Dha) with all Shuddha notes and zero half-hole positions. Perfect for building pure tone and simple Meend.
2. Raag Yaman: Uses all natural notes plus Teevra Ma. Teaches fundamental Kalyan Thaat grammar and gentle slides.
3. Raag Kafi or Raag Khamaj: Introduces single Komal swara positions (Komal Ga or Komal Ni) gently.`,
    relatedLink: { text: 'Explore Beginner Raaga Tutorials', view: 'learn_raagas' },
    tags: ['beginner raagas', 'raag bhupali', 'raag yaman', 'starter raagas']
  },
  {
    id: 'raag-yaman-complete-overview',
    category: 'Raagas',
    question: 'Why is Raag Yaman universally taught as the foundation for beginners?',
    answer: `Raag Yaman (Kalyan Thaat) is considered the classic gateway to Hindustani classical music:

- Characteristics: Uses Shuddha Re, Ga, Dha, Ni with Teevra Ma. Sa and Pa are omitted in ascending motion (Aaroh: 'Ni Re Ga, Ma' Dha Ni Sa').
- Why it is Ideal: Its serene, evening atmosphere is highly forgiving and pleasing. It teaches essential concepts like omitted notes (Varjit Swaras), Teevra Ma half-hole blowing, and graceful landing on key swaras.`,
    relatedLink: { text: 'Read Raag Yaman Guide & Notation', view: 'learn_raagas' },
    tags: ['raag yaman', 'kalyan thaat', 'foundation', 'teevra ma']
  },
  {
    id: 'raag-bhupali-audav-structure',
    category: 'Raagas',
    question: 'What makes Raag Bhupali (pentatonic scale) ideal for mastering flute tone?',
    answer: `Raag Bhupali belongs to Kalyan Thaat but uses only 5 notes (Audav-Audav Jati):

- Notes Used: Sa, Re, Ga, Pa, Dha (Ma and Ni are completely omitted).
- Why Flutists Love it: Because all 5 notes are all-Shuddha full-finger hole positions, flutists can focus 100% of their attention on breath resonance, sustained long notes, and vocal-like Meend glides between Ga-Re and Pa-Dha without worrying about half-hole leaks.`,
    relatedLink: { text: 'Read Raag Bhupali Guide & Bandish', view: 'learn_raagas' },
    tags: ['raag bhupali', 'audav jati', 'pentatonic', 'meend practice']
  },
  {
    id: 'raag-bairagi-and-komal-swara-raagas',
    category: 'Raagas',
    question: 'How do I practice Raagas with Komal swaras like Raag Bhairav or Raag Kafi?',
    answer: `Mastering flat notes (Komal Swaras) in classical Raagas:

- Intonation Precision: Use a Tanpura drone and tuner app to verify exact microtonal positioning of Komal Re, Komal Ga, Komal Dha, or Komal Ni.
- Finger Sliding: Slide finger pads smoothly back across hole edges rather than lifting vertical fingers.
- Raag Bhairav: Early morning Raag featuring deep, meditative oscillations (Andolan) on Komal Re and Komal Dha.`,
    relatedLink: { text: 'Explore Komal Swara Fingering Guide', view: 'learn_fingering_chart' },
    tags: ['komal swaras', 'raag bhairav', 'raag kafi', 'andolan']
  },
  {
    id: 'raag-aalap-bandish-taan-structure',
    category: 'Raagas',
    question: 'How is a classical Raag performance structured (Aalap, Bandish, Taan)?',
    answer: `A formal classical performance unfolds in distinct phases:

1. Aalap: Slow, unmetered, contemplative introduction establishing the Raag's mood and swara relationships without percussion accompaniment.
2. Jor & Jhala: Accelerating pulse introduced into the unmetered exploration.
3. Bandish (Composition): Fixed rhythmic melody set to a specific Taal cycle (e.g., Teental 16 beats) accompanied by Tabla.
4. Taan & Swaravistar: Rapid, agile scale passages and creative improvisations expanding upon the Bandish.`,
    relatedLink: { text: 'Explore Classical Raaga Performance Structure', view: 'learn_raagas' },
    tags: ['aalap', 'bandish', 'taan', 'performance structure', 'teental']
  },
  {
    id: 'raag-rasa-and-emotional-expression',
    category: 'Raagas',
    question: 'What is Rasa theory, and how do different Raagas evoke specific emotions?',
    answer: `Rasa theory classifies the emotional essence evoked by musical frequencies:

- Key Rasas in Music:
  - Shanta (Peace / Tranquility): Raag Bhupali, Raag Yaman.
  - Karuna (Pathos / Devotion): Raag Bhairavi, Raag Ahir Bhairav.
  - Shringar (Romance / Joy): Raag Khamaj, Raag Desh.
  - Veera (Heroism / Majesty): Raag Malkauns, Raag Durga.
- Expressive Medium: The keyless bansuri's breathy, organic acoustic tone is considered one of the finest instruments for expressing subtle Rasa nuances.`,
    relatedLink: { text: 'Read Rasa Theory & Classical Aesthetics', view: 'learn_raagas' },
    tags: ['rasa theory', 'emotions', 'shanta', 'karuna', 'shringar']
  },
  {
    id: 'raag-brindavani-sarang-and-khamaj',
    category: 'Raagas',
    question: 'What are the key characteristics of popular intermediate Raagas like Khamaj and Brindavani Sarang?',
    answer: `Exploring popular intermediate Raagas on the bansuri:

- Raag Khamaj: Sweet, romantic Raag (Khamaj Thaat) using Shuddha Ni in ascent and Komal Ni in descent ('Ni Dha Pa Ma Ga Re Sa'). Famous for thumris and light classical melodies.
- Raag Brindavani Sarang: Afternoon Raag (Kafi Thaat) using 5 notes in ascent and descent (Audav-Audav Jati: Sa Re Ma Pa Ni Sa'). Features both Shuddha Ni and Komal Ni, creating a refreshing, uplifting mood.`,
    relatedLink: { text: 'Read Complete Raag Khamaj Guide', view: 'raga_khamaj' },
    tags: ['raag khamaj', 'brindavani sarang', 'intermediate raagas']
  },
  {
    id: 'raag-improvisation-and-vistaar',
    category: 'Raagas',
    question: 'How do I begin improvising (Vistaar) within the strict boundaries of a Raag?',
    answer: `Beginning Raag improvisation systematically:

1. Master the Pakad: Use the signature catch phrase as your home base anchor.
2. Swara Expansion (Vistaar): Start from root Sa and expand note by note—first explore Mandra Saptak, then move to Re, Ga, and Ma, returning to Sa after every short phrase.
3. Respect Vadi Emphases: Pause and linger gracefully on the Vadi and Samvadi notes.
4. Listen to Maestros: Transcribe short 4-bar phrases from recordings of great masters to build your classical vocabulary.`,
    relatedLink: { text: 'View Raag Improvisation Blueprint', view: 'learn_raagas' },
    tags: ['improvisation', 'vistaar', 'pakad', 'swara expansion']
  }
];
