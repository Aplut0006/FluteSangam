import { FaqItem } from '../components/FluteFaqView';

export const DAILY_PRACTICE_FAQS: FaqItem[] = [
  {
    id: 'prac-why-daily-practice-important',
    category: 'Daily Practice',
    question: 'Why is daily flute practice important?',
    answer: `Daily practice (Sadhana) is the cornerstone of mastering the Indian bamboo flute (bansuri). Unlike keyed instruments, playing the bansuri depends entirely on micro-muscle memory in your lips (embouchure), subtle diaphragm breath control, and precise finger pad placements. Daily practice trains these physical muscles to respond automatically without conscious effort or strain.

When you practice daily, even for 20 to 30 minutes, your brain reinforces the neural pathways associated with pitch recognition and finger agility. Skipping several days causes lip muscles to lose stamina and pitch perception to drift, forcing you to spend valuable practice time re-establishing basic tone purity.`,
    relatedLink: { text: 'Explore Flute Practice Blueprint', view: 'learn_daily_practice' },
    tags: ['daily practice', 'sadhana', 'embouchure', 'muscle memory']
  },
  {
    id: 'prac-ideal-daily-practice-routine',
    category: 'Daily Practice',
    question: 'What is the ideal daily flute practice routine?',
    answer: `An ideal daily flute practice routine is structured systematically into distinct phases to maximize musical development while keeping your mind engaged:

1. Warm-Up & Long Notes (25% of time): Begin with Kharaj Riyaz (lower octave long notes) and mid-octave sustained notes accompanied by a Tanpura drone. This stabilizes your breath and centers your pitch.
2. Technique & Alankars (25% of time): Practice Sargam patterns, scale speed drills, and finger agility exercises with a metronome in slow, medium, and fast tempos.
3. Repertoire & Raag Study (35% of time): Dedicate time to learning new compositions, classical Bandishes, or analyzing specific Raagas, focusing on accurate Swara placement and Meend (slides).
4. Creative Expression (15% of time): Conclude with free improvisation, playing favorite songs, or spontaneous exploration over a drone.`,
    relatedLink: { text: 'View Practice Structure Chart', view: 'learn_daily_practice' },
    tags: ['ideal routine', 'structure', 'warmup', 'alankar', 'improvisation']
  },
  {
    id: 'prac-kharaj-riyaz-importance',
    category: 'Daily Practice',
    question: 'What is Kharaj Riyaz and why is it essential for daily practice?',
    answer: `Kharaj Riyaz refers to the practice of sustaining long notes in the lower octave (Mandra Saptak), particularly Mandra Pa, Dha, Ni, and root Sa. It is widely considered by classical masters to be the single most important exercise for bansuri players.

Benefits of Kharaj Riyaz:
- Deepens Breath Capacity: Holding lower notes requires controlled, steady air flow from the diaphragm without forcing air pressure.
- Enriches Tone Quality: It develops the warm, resonant, "woody" acoustic timbre that defines authentic bansuri sound across all octaves.
- Calms the Mind: The low frequencies create a deeply meditative state, warming up your respiratory system safely before fast playing.`,
    relatedLink: { text: 'Read Daily Practice Blueprint', view: 'learn_daily_practice' },
    tags: ['kharaj riyaz', 'lower octave', 'tone quality', 'breath control']
  },
  {
    id: 'prac-practicing-with-tanpura',
    category: 'Daily Practice',
    question: 'Why should I always practice with a Tanpura drone?',
    answer: `Practicing alongside a Tanpura drone is non-negotiable for Indian classical flute players. The Tanpura provides a continuous harmonic reference point tuned to Pa-Sa or Ma-Sa at A=440Hz, training your ear to align every swara in microtonal harmony (Sur).

Benefits of Tanpura Practice:
- Intonation Accuracy: Unlike fixed-pitch instruments like pianos, bansuri pitches vary slightly with breath angle and blowing force. Tanpura helps you hear subtle pitch deviations immediately.
- Harmonic Sensitivity: You learn to feel the resonance and tension of different notes (e.g., Komal Re or Teevra Ma) against the root drone.
- Meditative Focus: The continuous harmonic harmonics mask ambient room noise and establish a tranquil musical atmosphere.`,
    relatedLink: { text: 'Use Live Tanpura & Flute Tuner', view: 'learn_tuner' },
    tags: ['tanpura', 'sur', 'intonation', 'drone', 'tuning']
  },
  {
    id: 'prac-practicing-with-metronome',
    category: 'Daily Practice',
    question: 'How do I effectively use a metronome during daily practice?',
    answer: `A metronome is the ultimate tool for building internal rhythm (Laya) and unshakeable finger speed.

How to use a metronome effectively:
1. Start Exceptionally Slow: Set the metronome to 50–60 BPM. Execute Alankars with absolute precision on every click before attempting faster tempos.
2. Incremental Speed Building: Increase tempo by only 4–6 BPM at a time once an exercise is 100% clean and relaxed.
3. Subdivisions: Practice playing 1 note per beat, 2 notes per beat (Dugun), and 4 notes per beat (Chaugun) over a steady click to build rhythmic subdivision control.`,
    relatedLink: { text: 'Practice with Interactive Alankar Generator', view: 'alankar_generator' },
    tags: ['metronome', 'rhythm', 'laya', 'tempo', 'speed building']
  },
  {
    id: 'prac-multi-octave-practice',
    category: 'Daily Practice',
    question: 'How do I balance practice between Mandra, Madhya, and Taar Saptaks?',
    answer: `A well-rounded practice session covers all three main octaves:
- Lower Octave (Mandra Saptak): Requires relaxed lips, wider aperture, and warm, gentle air. Dedicate your warm-up here.
- Middle Octave (Madhya Saptak): Requires focused lip aperture and moderate air speed. Dedicate the bulk of your scale drills and song practice here.
- Higher Octave (Taar Saptak): Requires narrowed lip aperture, firm abdominal support, and faster air velocity. Practice in short 10-minute bursts to avoid lip fatigue or ear strain.`,
    relatedLink: { text: 'View Fingering Chart for All Octaves', view: 'learn_fingering_chart' },
    tags: ['octaves', 'mandra saptak', 'madhya saptak', 'taar saptak']
  },
  {
    id: 'prac-overcoming-plateaus',
    category: 'Daily Practice',
    question: 'How do I overcome a practice plateau when progress feels stuck?',
    answer: `Experiencing a plateau is a natural phase in skill acquisition. When progress feels stagnant:
1. Slow Down 50%: Revisit basic long blows and slow Alankars to identify subtle posture tension or air leakage.
2. Change the Routine: If you always practice the same scale or song, switch to a new scale key or explore a different raag to re-engage your brain.
3. Isolate Problem Passages: Loop difficult 3-note or 4-note transitions slowly 20 times rather than playing through an entire piece from start to finish.
4. Take a Rest Day: A 24-hour break allows your nervous system to rest and rebuild muscle memory.`,
    relatedLink: { text: 'Read Common Flute Pitfalls & Solutions', view: 'learn_common_mistakes' },
    tags: ['plateau', 'motivation', 'mindset', 'practice tips']
  },
  {
    id: 'prac-recording-self-practice',
    category: 'Daily Practice',
    question: 'Why should I record my practice sessions, and how do I analyze them?',
    answer: `Recording your practice sessions on your smartphone provides objective feedback that you cannot hear while actively playing.

How to analyze your recordings:
- Check Pitch Alignment: Listen alongside a Tanpura to spot notes that sound sharp or flat.
- Listen for Tone Clarity: Identify breathy or airy notes, especially during fast finger transitions.
- Check Rhythm & Timing: Listen for rushes or hesitations when moving between finger holes.
- Measure Monthly Growth: Keep a monthly audio diary—listening to a clip from 3 months ago offers undeniable proof of your improvement and boosts confidence.`,
    relatedLink: { text: 'Share Recitals on Community Feed', view: 'community' },
    tags: ['recording', 'self evaluation', 'feedback', 'growth']
  },
  {
    id: 'prac-preventing-fatigue',
    category: 'Daily Practice',
    question: 'How do I prevent physical fatigue and tension during long practice sessions?',
    answer: `Physical tension in shoulders, wrists, and face drains energy and causes early fatigue.

Prevention strategies:
- Take 5-Minute Micro-Breaks: Rest every 25 minutes. Set the flute down, stretch your neck, and shake out your hands and shoulders.
- Maintain Relaxed Posture: Keep your spine straight but flexible, shoulders dropped, and finger pads resting lightly over holes without squeezing the bamboo.
- Hydrate Frequently: Sip water to keep your mouth and lips moist for optimal embouchure control.`,
    relatedLink: { text: 'Read Posture & Health Guidelines', view: 'learn_basics' },
    tags: ['fatigue', 'posture', 'relaxation', 'health']
  },
  {
    id: 'prac-balancing-drills-and-songs',
    category: 'Daily Practice',
    question: 'How should I balance technical scale exercises with playing songs?',
    answer: `A 50/50 split is ideal for most learners:
- 50% Technical Drills: Long blows, Tanpura tuning, and Alankar scale patterns build the muscle memory, finger agility, and tone required to play cleanly.
- 50% Songs & Compositions: Applying those technical skills to melodies, bhajans, or classical bandishes keeps practice inspiring and musically fulfilling.

Never skip technical warm-ups entirely to play songs, as ungrounded song practice leads to sloppy finger technique and inconsistent pitch.`,
    relatedLink: { text: 'Explore Beginner Song Notations', view: 'notation_requests' },
    tags: ['practice balance', 'exercises vs songs', 'repertoire']
  },
  {
    id: 'prac-tracking-progress',
    category: 'Daily Practice',
    question: 'How can I effectively track my daily practice progress and milestones?',
    answer: `Tracking practice builds consistency and provides clear goals:
- Practice Logbook: Maintain a simple notebook recording date, duration, metronome BPM achieved for Alankars, and notes on tone quality.
- Milestone Checklist: Set concrete 30-day goals (e.g., "Sustain Sa for 15 seconds without wobbling" or "Play 5 Alankars smoothly at 80 BPM").
- Record Milestone Videos: Record yourself playing a benchmark exercise at the end of every month.`,
    relatedLink: { text: 'Open FluteSangam Learning Dashboard', view: 'learn_dashboard' },
    tags: ['tracking progress', 'milestones', 'practice log', 'goals']
  },
  {
    id: 'prac-mindful-practice',
    category: 'Daily Practice',
    question: 'What is mindful practice (Sadhana) versus distracted practice?',
    answer: `Sadhana implies deep, fully conscious engagement with every breath and sound:
- Distracted Practice: Repeating scale patterns mindlessly while watching TV or thinking about daily chores. This reinforces mistakes and bad posture habits.
- Mindful Practice: Focusing 100% of your attention on the sound resonance in your ears, the sensation of air leaving your lips, the feel of bamboo beneath your finger pads, and the harmonic blend with the Tanpura. 15 minutes of mindful practice yields far greater mastery than an hour of distracted playing.`,
    relatedLink: { text: 'Read Founder Story & Sadhana Mindset', view: 'founder' },
    tags: ['sadhana', 'mindful practice', 'focus', 'mindset']
  }
];
