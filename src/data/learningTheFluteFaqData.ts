import { FaqItem } from '../components/FluteFaqView';

export const LEARNING_THE_FLUTE_FAQS: FaqItem[] = [
  {
    id: 'learn-hold-flute-correctly',
    category: 'Learning the Flute',
    question: 'How should I hold the flute and position my hands correctly?',
    answer: `Key principles for holding the bansuri correctly:
1. Flat Finger Pad Grip: Use the soft pads of your fingers (Pannalal Ghosh grip) rather than narrow fingertips. Soft pads seal round holes effortlessly without tension.
2. Relaxed Angle: Hold the flute extending to your side at a relaxed 30-45 degree downward angle.
3. Light Thumb Support: Rest the flute gently on your thumbs without squeezing the bamboo.
4. Relaxed Wrists & Shoulders: Keep wrists gently curved and shoulders dropped.`,
    relatedLink: { text: 'Read Posture & Holding Techniques Guide', view: 'learn_basics' },
    tags: ['holding flute', 'finger placement', 'pannalal ghosh grip', 'posture']
  },
  {
    id: 'learn-correct-sitting-posture',
    category: 'Learning the Flute',
    question: 'What is the correct posture (sitting vs standing) for playing?',
    answer: `Your posture directly impacts breathing capacity and tone resonance:
- Sukhasana (Floor Seating): Sit cross-legged on a floor cushion with pelvis elevated to ground your lower body and align your spine naturally.
- Chair Seating: Sit on the front half of the seat with feet flat on the floor and knees at 90 degrees.
- Standing Posture: Stand with feet shoulder-width apart, providing maximum freedom for diaphragmatic expansion.
- Head Position: Keep your chin parallel to the floor—never tilt your head downwards.`,
    relatedLink: { text: 'Read Bansuri Basics & Posture', view: 'learn_basics' },
    tags: ['posture', 'sitting vs standing', 'spine alignment', 'breath capacity']
  },
  {
    id: 'learn-correct-embouchure',
    category: 'Learning the Flute',
    question: 'What is the correct embouchure (lip posture) for a bamboo flute?',
    answer: `Forming a clean embouchure:
1. Rest the blow hole edge against the soft dip of your lower lip (covering ~25-30% of the hole).
2. Purse your lips gently to form a small oval aperture in the center.
3. Direct a narrow jet stream of air downwards at a 45-degree angle against the outer blowing edge.
4. Keep facial muscles, jaw, and neck completely relaxed.`,
    relatedLink: { text: 'View Embouchure Blueprint', view: 'learn_basics' },
    tags: ['embouchure', 'lip placement', 'blowing angle', 'tone production']
  },
  {
    id: 'learn-first-clear-note',
    category: 'Learning the Flute',
    question: 'How can I produce my first clear note without airy hiss?',
    answer: `Eliminating breathy hiss:
- Narrow Lip Aperture: Reduce the size of your lip opening so air doesn't spill past the hole edges.
- Adjust Blowing Angle: Subtle inward/outward adjustments of the flute tube align the air stream with the splitting edge.
- Relax Face & Jaw: Tightening lips too hard chokes air flow; gentle, focused air produces a rich tone.`,
    relatedLink: { text: 'Read Tone Clarity Blueprint', view: 'learn_basics' },
    tags: ['first note', 'airy sound', 'tone clarity', 'embouchure']
  },
  {
    id: 'learn-why-notes-squeak',
    category: 'Learning the Flute',
    question: 'Why do my notes squeak or break, and how do I fix finger hole leaks?',
    answer: `Notes squeak when air leaks under finger pads or when blowing force is too aggressive:
- Use Flat Finger Pads: Ensure you are using the soft, flat pads of your fingers, not tips.
- Test Sequential Sealing: Cover holes one by one from top to bottom (Sa, Re, Ga, Ma, Pa, Dha, Ni) to isolate which finger has an air gap.
- Gentle Air Pressure: Avoid sudden bursts of air on lower notes.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['squeaking', 'air leaks', 'finger sealing', 'troubleshooting']
  },
  {
    id: 'learn-improve-breath-control',
    category: 'Learning the Flute',
    question: 'How do I improve my breath control and play longer phrases?',
    answer: `Improving breath endurance:
- Diaphragmatic Breathing: Expand your lower abdomen as you inhale; engage abdominal muscles gently as you blow.
- Practice Kharaj Long Blows: Sustaining single notes for 15+ seconds daily trains respiratory efficiency.
- Air Economy: Do not expel all your air on the first note of a phrase—maintain an even, controlled air column.`,
    relatedLink: { text: 'Read Breathing & Health Guide', view: 'learn_basics' },
    tags: ['breath control', 'diaphragm', 'long blows', 'phrasing']
  },
  {
    id: 'learn-blow-harder-for-high-notes',
    category: 'Learning the Flute',
    question: 'Should I blow harder to play high notes (Taar Saptak)?',
    answer: `No! Blowing harder creates harsh, screeching sounds and loses pitch control.
- Narrow Lip Aperture: Slightly narrow the central opening of your lips to create a faster, finer air stream.
- Diaphragmatic Push: Support high notes with a gentle upward push from your lower abdomen.
- Air Angle: Direct the air stream slightly higher across the blowing edge.`,
    relatedLink: { text: 'View Multi-Octave Fingering Guide', view: 'learn_fingering_chart' },
    tags: ['taar saptak', 'high notes', 'air velocity', 'octaves']
  },
  {
    id: 'learn-position-fingers',
    category: 'Learning the Flute',
    question: 'How should I position finger pads over the bamboo holes?',
    answer: `Finger pad placement guidelines:
- Flat Contact: Rest the soft, second-phalange pad over hole centers.
- Natural Curve: Keep fingers gently curved like holding an apple.
- Pinky Position: Let pinky fingers hover naturally near the tube without stiffening or curling under.`,
    relatedLink: { text: 'View Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['finger pads', 'hole coverage', 'ergonomics']
  },
  {
    id: 'learn-smoother-finger-movements',
    category: 'Learning the Flute',
    question: 'How can I make my finger movements smoother and faster?',
    answer: `Developing fluid finger agility:
- Keep Fingers Close: Never lift fingers higher than 1-2 cm off the bamboo tube.
- Eliminate Pressing Force: Sealing holes requires zero downward pressure—just light skin contact.
- Metronome Practice: Practice slow Alankar drills at 60 BPM before gradually increasing speed.`,
    relatedLink: { text: 'Practice with Interactive Alankar Engine', view: 'alankar_generator' },
    tags: ['finger agility', 'smooth transitions', 'metronome']
  },
  {
    id: 'learn-avoid-lifting-fingers-high',
    category: 'Learning the Flute',
    question: 'How do I avoid lifting my fingers too high off the flute?',
    answer: `High fingers slow down playing speed and disrupt hand posture:
- Mirror Drills: Practice slow scales in front of a mirror, consciously keeping fingers hovering close to hole centers.
- Light Touch: Remind yourself that lifting fingers away from holes requires unnecessary muscle movement.`,
    relatedLink: { text: 'Read Common Beginner Pitfalls', view: 'learn_common_mistakes' },
    tags: ['finger height', 'hand posture', 'speed building']
  },
  {
    id: 'learn-structure-daily-session',
    category: 'Learning the Flute',
    question: 'How should I structure my daily flute practice sessions?',
    answer: `A balanced 30-to-45 minute daily practice structure:
1. Warm-Up & Long Blows (25%): Kharaj long notes with Tanpura for tone and pitch alignment.
2. Technical Alankars (25%): Sargam scale patterns with a metronome for finger speed.
3. Song & Repertoire (35%): Learning compositions, bhajans, or classical bandishes.
4. Free Expression (15%): Creative improvisation over a drone.`,
    relatedLink: { text: 'View Practice Routine Chart', view: 'learn_daily_practice' },
    tags: ['practice routine', 'structure', 'warmup', 'alankar']
  },
  {
    id: 'learn-when-to-start-raagas',
    category: 'Learning the Flute',
    question: 'When should I transition from scale exercises to learning raagas?',
    answer: `You can begin learning simple raagas (like Raag Bhupali or Raag Yaman) as soon as you can play the middle octave Sargam scale cleanly and hold long notes for 10+ seconds. Raag practice enriches your musical intuition.`,
    relatedLink: { text: 'Explore Beginner Raag Guides', view: 'learn_raagas' },
    tags: ['raagas', 'transition to raags', 'raag bhupali', 'raag yaman']
  },
  {
    id: 'learn-overcome-learning-plateau',
    category: 'Learning the Flute',
    question: 'How can I overcome a learning plateau when progress feels slow?',
    answer: `Overcoming a plateau:
1. Slow Down 50%: Revisit basic long blows to identify subtle posture tension or air leaks.
2. Switch Key or Material: Try practicing on a different scale or exploring new songs to re-engage your brain.
3. Isolate Tricky Passages: Loop difficult 3-note transitions slowly 20 times rather than playing through an entire piece.`,
    relatedLink: { text: 'Read Practice Pitfalls & Solutions', view: 'learn_common_mistakes' },
    tags: ['plateau', 'mindset', 'motivation', 'problem solving']
  },
  {
    id: 'learn-record-practice-sessions',
    category: 'Learning the Flute',
    question: 'Should I record my practice sessions to track improvement?',
    answer: `Yes! Recording audio or video on your smartphone provides objective feedback on tone clarity, pitch alignment, and finger posture. Listening to recordings from 1 to 3 months ago provides undeniable proof of your progress.`,
    relatedLink: { text: 'Share Recitals on Community Feed', view: 'community' },
    tags: ['recording', 'feedback', 'progress tracking']
  },
  {
    id: 'learn-after-mastering-basics',
    category: 'Learning the Flute',
    question: 'What should I learn next after mastering basic Sargam scales?',
    answer: `After mastering basic Sargam:
1. Multi-Octave Practice: Extend scales into Mandra (lower) and Taar (higher) Saptaks.
2. Classical Ornamentation: Learn Meend (slides), Kan Swaras (grace notes), and Khatka.
3. Classical Raagas & Taal: Learn Bandishes set to Teental or Dadra Taal cycles.`,
    relatedLink: { text: 'Explore All Raaga Tutorials', view: 'learn_raagas' },
    tags: ['next steps', 'intermediate', 'meend', 'bandish']
  }
];
