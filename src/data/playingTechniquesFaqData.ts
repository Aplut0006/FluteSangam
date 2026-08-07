import { FaqItem } from '../components/FluteFaqView';

export const PLAYING_TECHNIQUES_FAQS: FaqItem[] = [
  {
    id: 'tech-how-to-form-embouchure',
    category: 'Playing Techniques',
    question: 'How do I form a correct lip embouchure for the bamboo flute?',
    answer: `Forming a correct embouchure is the single most important technique for tone production on the bansuri:

1. Lip Alignment: Rest the blow hole edge against the soft dip of your lower lip so the hole covers approximately 25-30% of your lip.
2. Oval Aperture: Purse your lips gently to form a tiny oval opening in the center—similar to blowing gently on hot tea.
3. Air Jet Direction: Direct a narrow jet stream of air downward at a 45-degree angle against the outer blowing edge, splitting the air column cleanly.
4. Facial Relaxation: Keep your cheeks, jaw, and neck relaxed—avoid tightening into an unnatural smile or puffing out your cheeks.`,
    relatedLink: { text: 'Read Bansuri Fundamentals', view: 'learn_basics' },
    tags: ['embouchure', 'lip placement', 'tone production', 'blowing technique']
  },
  {
    id: 'tech-how-to-seal-finger-holes',
    category: 'Playing Techniques',
    question: 'How do I seal finger holes completely to prevent air leaks and squeaks?',
    answer: `Air leaks under finger pads cause notes to break, squeak, or fail entirely:

- Use Flat Finger Pads: Follow the Pannalal Ghosh style by using the soft, flat pads of your fingers (second phalange) rather than narrow fingertips.
- Natural Finger Curvature: Curve your fingers gently like holding an apple.
- Light Touch: Rest finger pads softly over hole centers—excessive pressing causes joint stiffness and actually reduces hole coverage.
- Test Note by Note: Cover holes sequentially from top to bottom (Sa, Re, Ga, Ma, Pa, Dha, Ni) to isolate exactly which finger is leaking air.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['finger sealing', 'hole coverage', 'pannalal ghosh grip', 'squeaks']
  },
  {
    id: 'tech-blowing-angle-and-air-stream',
    category: 'Playing Techniques',
    question: 'How does blowing angle and air stream direction affect tone purity?',
    answer: `The angle at which air strikes the blow hole edge determines note clarity and pitch:

- Directing Air Downward: Directing air slightly downward into the hole produces a deep, warm, full-bodied tone.
- Inward/Outward Tube Rotation: Rotating the flute slightly inward towards your lips flattens the pitch and sweetens the sound; rotating it outward sharpens the pitch and brightens the tone.
- Air Speed vs Air Volume: To increase volume or play higher notes, increase the speed of the air stream rather than dumping a larger volume of loose air into the flute.`,
    relatedLink: { text: 'Explore Tone Production Guide', view: 'learn_basics' },
    tags: ['blowing angle', 'air stream', 'tone purity', 'flute rotation']
  },
  {
    id: 'tech-controlling-volume-and-dynamics',
    category: 'Playing Techniques',
    question: 'How do I control volume and dynamics without going out of tune?',
    answer: `Controlling dynamics (loudness and softness) on a keyless bamboo flute requires subtle pitch compensation:

- Playing Louder (Forte): Increased air speed naturally pushes pitch slightly sharp. Compensate by subtly rotating the flute tube inward or lowering your chin slightly.
- Playing Softer (Piano): Decreased air speed naturally drops pitch slightly flat. Compensate by subtly rotating the flute tube outward or raising your chin slightly.
- Breath Support: Always maintain steady diaphragmatic pressure, even when playing soft, delicate notes.`,
    relatedLink: { text: 'Read Advanced Tone & Dynamics', view: 'learn_basics' },
    tags: ['volume control', 'dynamics', 'intonation', 'pitch compensation']
  },
  {
    id: 'tech-switching-octaves',
    category: 'Playing Techniques',
    question: 'How do I smoothly switch between Madhya (middle) and Taar (high) octaves?',
    answer: `Switching octaves on the bansuri does NOT require blowing twice as hard:

1. Lip Aperture Adjustment: Slightly narrow the central opening of your lips for high notes, creating a faster, finer air stream.
2. Diaphragmatic Push: Support high notes with a gentle upward push from your lower abdomen.
3. Air Angle: Direct the air stream slightly higher across the blowing edge.
4. Avoid Forcing Air: Forcing air creates harsh, screeching sounds—focus on air velocity and lip focus instead.`,
    relatedLink: { text: 'View Multi-Octave Fingering Guide', view: 'learn_fingering_chart' },
    tags: ['octave switching', 'taar saptak', 'lip aperture', 'air velocity']
  },
  {
    id: 'tech-half-hole-technique',
    category: 'Playing Techniques',
    question: 'How do I execute half-hole (Komal Swara) positions accurately?',
    answer: `Playing Komal (flat) swaras like Komal Re, Komal Ga, Komal Dha, and Komal Ni requires uncoverings fractional portions of finger holes:

- Sliding vs Lifting: Slide your finger pad backwards along the bamboo tube rather than lifting it vertically off the hole. Sliding provides smooth, precise microtonal control.
- Micro-Adjusting Pitch: Use your ear alongside a Tanpura drone to verify the exact microtonal position (Shruti) of the flat note.
- Tube Rotation Combination: You can combine a partial hole closure with a subtle inward tube rotation to land perfectly on delicate Komal swaras.`,
    relatedLink: { text: 'Learn Komal Swaras in Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['half hole', 'komal swaras', 'finger sliding', 'microtones']
  },
  {
    id: 'tech-tonguing-and-articulation',
    category: 'Playing Techniques',
    question: 'How and when should I use tonguing (articulation) on the bansuri?',
    answer: `Tonguing provides rhythmic definition and crisp note articulation:

- Single Tonguing: Touch the tip of your tongue lightly behind your upper front teeth (whispering "tu" or "ta") to separate fast rhythmic notes sharply.
- When to Use: Essential for fast rhythm patterns (Taans, Jhala, and Drut Bandishes) and rhythmic folk compositions.
- Legato vs Articulated: Indian classical music emphasizes smooth, continuous legato breath transitions (Meend); use tonguing deliberately for rhythmic accentuation rather than on every note.`,
    relatedLink: { text: 'Explore Rhythmic Alankar Patterns', view: 'alankar_generator' },
    tags: ['tonguing', 'articulation', 'rhythm', 'taan', 'jhala']
  },
  {
    id: 'tech-pitch-bending-and-shaking',
    category: 'Playing Techniques',
    question: 'How do I perform subtle pitch bending by rotating the flute tube?',
    answer: `Pitch bending (Andolan and subtle microtonal shading) is an essential expressive technique in raag development:

- Inward Rotation: Rotating the flute tube inward toward your chin flattens the pitch continuously down by up to a semitone.
- Outward Rotation: Rotating the flute tube outward sharpens the pitch back up to its natural position.
- Application in Raagas: Used to produce the gentle, hypnotic oscillation (Andolan) on notes like Komal Ga in Raag Darbari or Komal Dha in Raag Bhairav.`,
    relatedLink: { text: 'Explore Raaga Ornamentation Guides', view: 'learn_raagas' },
    tags: ['pitch bending', 'andolan', 'flute rotation', 'microtones']
  },
  {
    id: 'tech-preventing-airy-sound',
    category: 'Playing Techniques',
    question: 'Why does my flute sound breathy or airy, and how can I achieve a clear tone?',
    answer: `An airy sound occurs when a portion of your breath misses the splitting edge of the blow hole or when air leaks under your fingers:

Fixing an Airy Tone:
1. Narrow Lip Aperture: Reduce the size of your lip opening so air doesn't spill past the hole edges.
2. Align Blow Hole: Ensure the blow hole is positioned symmetrically on your lower lip.
3. Check Finger Seals: Verify that no hairline air gaps exist under your finger pads.
4. Practice Kharaj Long Blows: Sustaining long notes daily trains lip muscles to maintain focus and eliminates breathiness.`,
    relatedLink: { text: 'Read Common Beginner Flute Fixes', view: 'learn_common_mistakes' },
    tags: ['airy sound', 'tone clarity', 'embouchure', 'troubleshooting']
  },
  {
    id: 'tech-hand-and-finger-relaxation',
    category: 'Playing Techniques',
    question: 'How do I keep my hands and fingers completely relaxed during fast passages?',
    answer: `Hand tension slows down finger speed and causes joint fatigue:

- Keep Fingers Close: Keep unused fingers hovering within 1–2 cm of the bamboo tube—do not lift fingers high into the air.
- Minimal Pressing Force: Remember that sealing bamboo holes requires zero downward force—just gentle skin contact.
- Shake Out Wrists: During long practice sessions, lower your hands every 15 minutes and gently shake out your wrists and shoulders to release accumulated tension.`,
    relatedLink: { text: 'Practice Speed Exercises with Alankar Engine', view: 'alankar_generator' },
    tags: ['relaxation', 'hand position', 'finger speed', 'tension']
  },
  {
    id: 'tech-breath-distribution',
    category: 'Playing Techniques',
    question: 'How do I manage air distribution so I don\'t run out of breath mid-phrase?',
    answer: `Running out of breath mid-phrase stems from inefficient air usage rather than small lung capacity:

- Steady Air Economy: Avoid expelling a large burst of air on initial notes—maintain an even, steady air column throughout the phrase.
- Strategic Breath Pauses: Plan natural breath pauses at musical phrase endings or structural rests in the Taal cycle.
- Deep Diaphragmatic Inhalation: Inhale deeply into your abdomen before starting long phrases, keeping your neck and shoulders relaxed.`,
    relatedLink: { text: 'Read Breathing & Health Guide', view: 'learn_basics' },
    tags: ['breath management', 'phrasing', 'air economy', 'diaphragm']
  },
  {
    id: 'tech-producing-clear-lower-notes',
    category: 'Playing Techniques',
    question: 'Why are lower notes (Mandra Saptak) difficult to play cleanly, and how do I fix them?',
    answer: `Lower notes (Mandra Pa, Dha, Ni, and Sa) require precise physical adjustments:

- Warm, Slow Air: Lower notes require slow, warm, gentle air velocity rather than fast air streams.
- Relaxed Lip Aperture: Slightly widen your lip opening and relax your facial muscles.
- Absolute Finger Sealing: Mandra notes are extremely sensitive to air leaks—ensure all 6 or 7 finger holes are sealed 100% airtight.`,
    relatedLink: { text: 'Read Mandra Saptak Practice Blueprint', view: 'learn_daily_practice' },
    tags: ['lower notes', 'mandra saptak', 'air velocity', 'finger seal']
  }
];
