import { FaqItem } from '../components/FluteFaqView';

export const ADVANCED_TECHNIQUES_FAQS: FaqItem[] = [
  {
    id: 'adv-what-is-meend',
    category: 'Advanced Techniques',
    question: 'What is Meend (glide/slide) and how is it executed on the bansuri?',
    answer: `Meend is the seamless, continuous microtonal portamento (slide) between two notes. It is widely regarded as the soulful essence of Indian classical music:

- Execution: Gradually roll or slide your finger pad across the bamboo hole while maintaining a steady air stream and subtle inward/outward flute rotation.
- Physical Motion: Instead of lifting fingers abruptly, unseal the hole fractionally and continuously to touch every microtone between the starting and target swara.
- Expressive Value: Meend connects notes in a vocal-like legato, evoking deep emotion (Rasa) in classical raagas like Raag Yaman, Bageshree, and Darbari.`,
    relatedLink: { text: 'Explore Raaga Ornamentation Guides', view: 'learn_raagas' },
    tags: ['meend', 'portamento', 'glide', 'ornamentation', 'legato']
  },
  {
    id: 'adv-what-is-gamak',
    category: 'Advanced Techniques',
    question: 'What is Gamak (heavy oscillation) and how is it developed?',
    answer: `Gamak is a rapid, heavy, rhythmic oscillation of pitch originating deep from the diaphragm:

- Diaphragmatic Impulse: Unlike subtle lip vibrato, Gamak is driven by rapid controlled pulses of air from the abdominal muscles.
- Pitch Excursion: The pitch oscillates forcefully between a target note and its adjacent lower or upper swara.
- Development: Practice slow abdominal air pulses on long notes before gradually increasing pulse frequency over a steady metronome click.`,
    relatedLink: { text: 'Read Breathing & Diaphragm Control', view: 'learn_basics' },
    tags: ['gamak', 'oscillation', 'diaphragm', 'ornamentation', 'riaz']
  },
  {
    id: 'adv-khatka-and-murki',
    category: 'Advanced Techniques',
    question: 'What are Khatka and Murki, and how do they differ in classical ornamentation?',
    answer: `Khatka and Murki are rapid, sharp embellishments used to decorate specific swaras:

- Khatka: A rapid cluster of 3 or 4 notes executed as a swift flick (e.g., landing on Pa by quickly touching Dha-Pa-Ma-Pa). It adds crisp rhythmic spark to a phrase.
- Murki: A delicate, vocal-like short turn involving a rapid upper and lower neighbor note (e.g., Sa-Ni-Sa or Pa-Ma-Pa). Murki is lighter, smoother, and shorter than a Khatka.
- Execution: Requires extremely relaxed, spring-like finger agility without disturbing the main air stream.`,
    relatedLink: { text: 'Practice Agility Exercises with Alankar Engine', view: 'alankar_generator' },
    tags: ['khatka', 'murki', 'grace notes', 'finger agility', 'ornamentation']
  },
  {
    id: 'adv-kan-swar-grace-notes',
    category: 'Advanced Techniques',
    question: 'What is Kan Swar (grace note) and how does it embellish phrases?',
    answer: `Kan Swar (touch note or shadow note) is a fleeting grace note that subtly touches a target swara from above or below:

- Function: Instead of approaching a note directly, you lightly touch an adjacent note for a fraction of a second before resolving.
- Execution: A swift, feather-light flick of a single finger pad without adding extra air pressure.
- Role in Raagas: Defines the authentic grammar and personality of specific raagas (e.g., touching Komal Dha when landing on Pa in Raag Puriya Dhanashree).`,
    relatedLink: { text: 'Explore Classical Raaga Guides', view: 'learn_raagas' },
    tags: ['kan swar', 'grace note', 'touch note', 'raag grammar']
  },
  {
    id: 'adv-krintan-and-andolan',
    category: 'Advanced Techniques',
    question: 'What are Krintan (plucking) and Andolan (slow oscillation) techniques?',
    answer: `Krintan and Andolan are specialized classical ornaments:

- Krintan (Finger Plucking): Rapidly striking and releasing a finger pad off the bamboo tube to produce a sharp, plucked hammer-on/pull-off articulation without re-blowing.
- Andolan (Slow Oscillation): A deliberate, slow, microtonal swinging of pitch around a specific swara (e.g., oscillating Komal Ga in Raag Darbari). It is achieved through subtle flute rotation and lip pressure adjustments.`,
    relatedLink: { text: 'Explore Advanced Ornamentation Blueprint', view: 'learn_raagas' },
    tags: ['krintan', 'andolan', 'microtonal oscillation', 'plucking']
  },
  {
    id: 'adv-microtonal-shrutis',
    category: 'Advanced Techniques',
    question: 'What are Shrutis (microtones) and how are they expressed on the keyless bansuri?',
    answer: `The ancient Indian music system divides the octave into 22 distinct microtonal intervals called Shrutis:

- Why Bansuri Excels: Because the bamboo flute has no fixed frets or mechanical keys, an experienced flutist can adjust pitch continuously to land on precise microtonal Shrutis.
- Execution: Achieved through exact half-hole finger placements, subtle inward/outward tube rotation, and minor blowing angle adjustments.
- Raaga Precision: Distinguishes between subtle variants of notes (e.g., the slightly lower Komal Ga in Raag Darbari vs the slightly higher Komal Ga in Raag Kafi).`,
    relatedLink: { text: 'Read Music Theory & Tuning Guide', view: 'learn_basics' },
    tags: ['shrutis', 'microtones', '22 shrutis', 'intonation', 'raag precision']
  },
  {
    id: 'adv-circular-breathing',
    category: 'Advanced Techniques',
    question: 'What is circular breathing, and is it necessary for Indian classical flute?',
    answer: `Circular breathing allows a wind player to maintain an uninterrupted continuous stream of sound while simultaneously inhaling through the nose:

- Mechanism: Air stored in the cheeks is squeezed out into the flute using cheek muscles while taking a quick inhalation through the nostrils.
- Is it Essential?: No. While impressive during long continuous Jhala passages, most classical masters emphasize expressive phrase breath pauses rather than endless continuous sound. Focus on deep diaphragmatic breath control before attempting circular breathing.`,
    relatedLink: { text: 'Read Breathing & Health Guide', view: 'learn_basics' },
    tags: ['circular breathing', 'continuous sound', 'breath technique']
  },
  {
    id: 'adv-double-and-triple-tonguing',
    category: 'Advanced Techniques',
    question: 'How do double and triple tonguing work on the flute for fast staccato?',
    answer: `Double and triple tonguing allow flutists to play rapid staccato passages beyond the speed limit of single tonguing:

- Double Tonguing: Alternates front tongue placement ("ta") with back throat placement ("ka") to produce rapid "ta-ka ta-ka" patterns.
- Triple Tonguing: Uses "ta-ka-ta" or "ta-ta-ka" patterns for rapid triplet figures.
- Application: Used during fast rhythmic variations (Drut Lay) and lively folk melodies.`,
    relatedLink: { text: 'Practice Speed Exercises with Alankar Engine', view: 'alankar_generator' },
    tags: ['double tonguing', 'triple tonguing', 'staccato', 'speed']
  },
  {
    id: 'adv-alap-jor-jhala',
    category: 'Advanced Techniques',
    question: 'How are advanced techniques applied across Alap, Jor, and Jhala sections?',
    answer: `A classical performance unfolds across three main structural movements:

1. Alap: Unmetered, slow, contemplative exploration of the raag using deep Meend, Andolan, and long sustained notes.
2. Jor: Introducing a steady pulse (without percussion) with rhythmic breath pulses and gentle stroke articulations.
3. Jhala: Fast, climax performance characterized by rapid staccato strokes, fast Taans, and energetic rhythmic play against the Tabla.`,
    relatedLink: { text: 'Explore Indian Classical Raagas', view: 'learn_raagas' },
    tags: ['alap', 'jor', 'jhala', 'raag performance', 'structure']
  },
  {
    id: 'adv-fast-taans-execution',
    category: 'Advanced Techniques',
    question: 'How do I build finger speed and clarity for executing rapid Taans?',
    answer: `Building rapid, clean Taans requires disciplined metronome progression:

- Slow Precision: Master the Taan pattern slowly at 60 BPM with 100% clean note boundaries.
- Keep Fingers Close: Never lift fingers higher than 1 cm off the bamboo tube.
- Relaxed Wrists: Eliminate all forearm and shoulder tension—speed is a byproduct of relaxation, not muscle force.
- Incremental BPM Increases: Raise metronome tempo by 4 BPM only when the current tempo is effortless.`,
    relatedLink: { text: 'Generate Speed Drills in Alankar Generator', view: 'alankar_generator' },
    tags: ['taan', 'speed building', 'finger agility', 'metronome']
  },
  {
    id: 'adv-vibrato-vs-gamak',
    category: 'Advanced Techniques',
    question: 'What is the difference between Western vibrato and Indian classical Gamak/Andolan?',
    answer: `While both involve pitch modulation, their musical purpose differs fundamentally:

- Western Vibrato: A fast, continuous pitch oscillation added to enrich sustained notes aesthetically.
- Indian Gamak & Andolan: Structural, raag-defining microtonal movements. Gamak is a forceful, rhythmic diaphragmatic pulse, while Andolan is a slow, deliberate microtonal swing on specific swaras. Vibrato is rarely used as a continuous effect in Indian classical bansuri.`,
    relatedLink: { text: 'Explore Indian Classical Music Theory', view: 'learn_basics' },
    tags: ['vibrato', 'gamak', 'andolan', 'western vs indian']
  },
  {
    id: 'adv-developing-a-personal-sound',
    category: 'Advanced Techniques',
    question: 'How does an advanced flutist cultivate a distinct personal sound and style?',
    answer: `Developing a personal tone and artistic signature involves:

- Acoustic Intimacy: Understanding how your unique lip embouchure, blowing angle, and breath resonance interact with your preferred bamboo flutes.
- Phrasing & Spacing: How you use silence, breath pauses, and subtle Meends between notes.
- Master Influence & Synthesis: Listening deeply to legendary gurus (like Pt. Hariprasad Chaurasia, Pt. Pannalal Ghosh, and Pt. V.G. Jog) and synthesizing their techniques into your own emotional expression.`,
    relatedLink: { text: 'Read Founder Story & Flute Journey', view: 'founder' },
    tags: ['personal tone', 'artistic signature', 'phrasing', 'maestros']
  }
];
