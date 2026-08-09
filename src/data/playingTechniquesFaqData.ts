import { FaqItem } from '../components/FluteFaqView';

export const PLAYING_TECHNIQUES_FAQS: FaqItem[] = [
  {
    id: 'tech-how-to-form-embouchure',
    category: 'Playing Techniques',
    question: 'How do I form a correct lip embouchure for the bamboo flute?',
    answer: `Forming a refined lip embouchure is the single most critical foundation for producing a sweet, resonant, whistle-free tone on the bamboo bansuri. Unlike keyed flutes with plastic lip plates, a bamboo flute requires positioning your lips directly against the natural bamboo blow hole.

Step-by-Step Embouchure Blueprint:
1. Contact Placement: Rest the lower rim of the blow hole against the soft chin crease directly under your lower lip. Your lower lip should cover approximately 25% to 30% of the blow hole opening.
2. Gentle Central Aperture: Purse your upper and lower lips softly together, as if whispering "p-p-p" or gently blowing out a small candle flame. Form a small, narrow horizontal oval opening directly in the center.
3. Air Jet Direction: Direct a focused stream of air downward at roughly a 45-degree angle directly against the sharp outer blowing edge (the splitting edge) of the bamboo hole.
4. Facial Relaxation: Keep your cheek muscles, jaw, and throat completely relaxed. Avoid stretching your lips into a tight, unnatural smile, which pinches the air stream and produces harsh squeaks.`,
    relatedLink: { text: 'Read Bansuri Fundamentals', view: 'learn_basics' },
    tags: ['embouchure', 'lip placement', 'tone production', 'blowing technique']
  },
  {
    id: 'tech-how-to-seal-finger-holes',
    category: 'Playing Techniques',
    question: 'How do I seal finger holes completely to prevent air leaks and squeaks?',
    answer: `Air leaks under finger pads cause notes to squeak, break into higher unwanted harmonics, or fail to sound entirely. On a keyless bamboo flute, achieving a 100% airtight seal over all bare tone holes requires adopting proper finger ergonomics.

Key Sealing Techniques:
• Flat Finger Pad Contact (Pannalal Ghosh Grip): Use the soft, fleshy pads of your finger's second joint (phalange) rather than narrow fingertips or fingernails. Soft skin acts as a natural gasket, conforming to the circular bamboo hole perimeter effortlessly.
• Gentle Natural Curvature: Keep your fingers gently curved like holding a tennis ball or soft apple. Avoid locking joint knuckles straight or curling fingers into tight claw shapes.
• Zero Squeezing Force: Resting finger pads over holes requires minimal downward force. Pressing hard causes finger stiffness, hand fatigue, and actually distorts skin shape away from hole perimeters.
• Sequential Hole Isolation: Test holes one by one from top to bottom (Sa, Re, Ga, Ma, Pa, Dha, Ni) to isolate exactly which finger is leaving an air gap.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['finger sealing', 'hole coverage', 'pannalal ghosh grip', 'squeaks']
  },
  {
    id: 'tech-blowing-angle-and-air-stream',
    category: 'Playing Techniques',
    question: 'How does blowing angle and air stream direction affect tone purity?',
    answer: `The precise angle and velocity at which your blown air stream strikes the outer splitting edge of the blow hole dictates note purity, harmonic richness, and pitch intonation.

Acoustic Principles of Air Stream Angle:
• Downward Air Angle: Directing air slightly downward into the blow hole cavity creates a deep, warm, full-bodied fundamental note rich in wooden acoustic harmonics.
• Flute Tube Rotation: Rotating the flute tube subtly inward toward your lower lip flattens the pitch and sweetens tone purity; rotating the tube outward sharpens pitch and brightens sound projection.
• Air Velocity vs Air Volume: To increase volume or transition cleanly into higher octaves, accelerate air stream velocity by narrowing lip aperture, rather than dumping a large volume of turbulent air into the tube.
• Centering the Air Jet: Ensure your lip aperture is aligned symmetrically over the center of the blow hole to prevent air spilling past the edges.`,
    relatedLink: { text: 'Explore Tone Production Guide', view: 'learn_basics' },
    tags: ['blowing angle', 'air stream', 'tone purity', 'flute rotation']
  },
  {
    id: 'tech-controlling-volume-and-dynamics',
    category: 'Playing Techniques',
    question: 'How do I control volume and dynamics without going out of tune?',
    answer: `Controlling dynamics (playing loud or soft) on a keyless bamboo flute requires active pitch compensation, because air speed changes naturally alter note pitch.

Dynamic Control & Pitch Compensation Techniques:
• Playing Louder (Forte): Pushing faster air through the flute increases sound volume but naturally drives pitch sharp. To compensate and stay perfectly in tune, subtly roll the flute tube inward toward your chin or lower your head angle slightly by a millimeter.
• Playing Softer (Piano / Whisper Notes): Decreasing air pressure reduces volume but causes pitch to drop flat. To compensate, subtly roll the flute tube outward away from your chin or raise your chin slightly.
• Unbroken Diaphragmatic Core Support: Never collapse your breath support when playing soft, quiet notes. Maintain steady, active diaphragmatic air support behind a narrowed lip opening to keep whisper notes vibrant and in tune.`,
    relatedLink: { text: 'Read Advanced Tone & Dynamics', view: 'learn_basics' },
    tags: ['volume control', 'dynamics', 'intonation', 'pitch compensation']
  },
  {
    id: 'tech-switching-octaves',
    category: 'Playing Techniques',
    question: 'How do I smoothly switch between Madhya (middle) and Taar (high) octaves?',
    answer: `Switching octaves on the bamboo flute does NOT require blowing twice as hard or forcing air into the instrument. Forcing air produces harsh, screeching, out-of-tune notes that ruin musical expression.

Refined Octave Transition Method:
1. Lip Aperture Adjustment: Narrow the central opening of your lips slightly when moving from middle octave (Madhya Saptak) into high octave (Taar Saptak). A narrower opening automatically accelerates air velocity cleanly.
2. Abdominal Core Support: Support higher notes with a gentle upward push from your lower abdominal muscles, maintaining steady air column pressure.
3. Elevate Air Angle: Move your lower jaw forward by a millimeter to direct the fine air stream slightly higher across the splitting lip of the blow hole, cleanly triggering the higher harmonic frequency.
4. Seamless Octave Slurs: Practice slurring back and forth between middle Sa and high Taar Sa continuously without stopping breath.`,
    relatedLink: { text: 'View Multi-Octave Fingering Guide', view: 'learn_fingering_chart' },
    tags: ['octave switching', 'taar saptak', 'lip aperture', 'air velocity']
  },
  {
    id: 'tech-half-hole-technique',
    category: 'Playing Techniques',
    question: 'How do I execute half-hole (Komal Swara) positions accurately?',
    answer: `Executing flat notes (Komal Swaras like Komal Re, Komal Ga, Komal Dha, and Komal Ni) requires uncovering a fractional portion (typically 50%) of a finger hole with microtonal accuracy.

Mastering the Half-Hole Technique:
• Sliding Method (Peeling Touch): Instead of lifting your finger pad straight up in the air, gently slide your finger pad backward along the bamboo tube. Sliding maintains physical contact with the flute and grants exceptionally smooth, controlled pitch adjustment.
• Listening to Tanpura Drones: Komal swaras vary slightly across different classical Raagas (microtonal Shrutis). Always practice half-hole notes alongside a Tanpura drone or digital tuner to train muscle memory for exact pitch placement.
• Combining Tube Rotation: You can combine a partial 50% hole closure with a subtle inward rotation of the flute tube to land perfectly on warm, expressive Komal swaras.`,
    relatedLink: { text: 'Learn Komal Swaras in Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['half hole', 'komal swaras', 'finger sliding', 'microtones']
  },
  {
    id: 'tech-tonguing-and-articulation',
    category: 'Playing Techniques',
    question: 'How and when should I use tonguing (articulation) on the bansuri?',
    answer: `In Hindustani bamboo flute playing, note articulation is achieved through a combination of breath strokes, finger taps, and delicate tongue touches, depending on the musical genre.

Articulation Styles and Applications:
• Soft Tongue Articulation ("Ta" or "Da"): Touch the tip of your tongue lightly behind your upper front teeth (whispering "tu" or "da") to articulate fast, rhythmic note patterns sharply during fast classical Taans, Jhala, or rhythmic folk compositions.
• Abdominal Breath Strokes (Blow Staccato): For classical Raag Aalap and slow Bandishes, articulate notes using gentle abdominal air pulses (diaphragm strokes) to preserve the wooden, vocalic, fluid character of bansuri music.
• Finger Tapping (Sparsh Swara): Briefly tapping an upper finger hole acts as an acoustic separator between identical repeated notes (e.g., Sa-Sa-Sa) without needing any tongue contact.`,
    relatedLink: { text: 'Explore Rhythmic Alankar Patterns', view: 'alankar_generator' },
    tags: ['tonguing', 'articulation', 'rhythm', 'taan', 'jhala']
  },
  {
    id: 'tech-pitch-bending-and-shaking',
    category: 'Playing Techniques',
    question: 'How do I perform subtle pitch bending by rotating the flute tube?',
    answer: `Pitch bending (Andolan and subtle microtonal shading) is an essential expressive technique in Indian classical Raag development, allowing flutists to glide between pitches and create deep emotional resonance.

How Tube Rotation Pitch Bending Works:
• Inward Tube Rotation: Rotating the flute tube inward toward your chin gradually covers more of the blow hole area, flattening the pitch smoothly down by a semitone or microtonal interval (Shruti).
• Outward Tube Rotation: Rotating the flute tube outward uncovers the blow hole, returning the note pitch back up to its natural position.
• Classical Raag Applications: Tube rotation pitch bending is used to create the gentle, hypnotic oscillation (Andolan) on Komal Ga in Raag Darbari Kanada, or the delicate pitch sway on Komal Dha in Raag Bhairav.`,
    relatedLink: { text: 'Explore Raaga Ornamentation Guides', view: 'learn_raagas' },
    tags: ['pitch bending', 'andolan', 'flute rotation', 'microtones']
  },
  {
    id: 'tech-preventing-airy-sound',
    category: 'Playing Techniques',
    question: 'Why does my flute sound breathy or airy, and how can I achieve a clear tone?',
    answer: `An airy or breathy sound occurs when a portion of your blown air stream spills around the edges of the blow hole without splitting cleanly over the blowing edge, or when microscopic air gaps exist under your finger pads.

Step-by-Step Fixes for Tone Purity:
1. Narrow Lip Aperture: Reduce the size of your central lip opening so air escapes in a fine, concentrated jet rather than a broad, diffuse cloud.
2. Centering the Air Jet: Verify in a mirror that the blow hole is centered on your lower lip and that your air stream hits the splitting edge at a 45-degree angle.
3. Check Finger Hole Seals: Verify that all finger holes are completely covered by soft, flat finger pads without hairline gaps.
4. Practice Daily Kharaj Long Blows: Holding single notes (Sa, Pa) for 15+ seconds daily trains your lip muscles to maintain focus and eliminates breathiness permanently.`,
    relatedLink: { text: 'Read Common Beginner Flute Fixes', view: 'learn_common_mistakes' },
    tags: ['airy sound', 'tone clarity', 'embouchure', 'troubleshooting']
  },
  {
    id: 'tech-hand-and-finger-relaxation',
    category: 'Playing Techniques',
    question: 'How do I keep my hands and fingers completely relaxed during fast passages?',
    answer: `Muscle tension in your hands, wrists, or shoulders slows down finger speed, causes joint fatigue, and leads to sloppy note transitions during fast Alankars and Taans.

Proactive Relaxation Strategies:
• Low Finger Hover: Never lift your fingers higher than 1 to 1.5 cm above the bamboo holes when opened. Raising fingers high in the air creates unnecessary muscle strain and timing delays.
• Zero Squeezing Pressure: Remind yourself that sealing bamboo tone holes requires minimal downward force—just soft skin contact over the hole perimeters.
• Regular Wrist Rest Breaks: During practice sessions, drop your hands every 15 minutes, shake out your wrists, roll your shoulders, and unclench your jaw to release built-up muscle tension before continuing.`,
    relatedLink: { text: 'Practice Speed Exercises with Alankar Engine', view: 'alankar_generator' },
    tags: ['relaxation', 'hand position', 'finger speed', 'tension']
  },
  {
    id: 'tech-breath-distribution',
    category: 'Playing Techniques',
    question: 'How do I manage air distribution so I don\'t run out of breath mid-phrase?',
    answer: `Running out of breath in the middle of a musical phrase usually stems from inefficient air conservation at the lips rather than small physical lung capacity.

Air Distribution & Phrasing Principles:
• Steady Air Economy: Avoid expelling a large, wasteful burst of air on the first note of a phrase. Maintain a narrow, controlled lip aperture to conserve air throughout the entire line.
• Planned Breath Pauses: Plan natural breath pauses at musical phrase endings, structural line breaks, or unaccented beats (Khali) in the rhythm cycle (Taal).
• Deep Diaphragmatic Inhalations: Inhale deeply into your lower belly before starting long passages, keeping your neck and shoulders completely relaxed to maximize oxygen intake.`,
    relatedLink: { text: 'Read Breathing & Health Guide', view: 'learn_basics' },
    tags: ['breath management', 'phrasing', 'air economy', 'diaphragm']
  },
  {
    id: 'tech-producing-clear-lower-notes',
    category: 'Playing Techniques',
    question: 'Why are lower notes (Mandra Saptak) difficult to play cleanly, and how do I fix them?',
    answer: `Lower notes in the Mandra Saptak (such as lower Pa, Dha, Ni, and Sa) require specific physical adjustments because lower frequencies demand slow, steady air velocity and absolute airtight hole coverage.

Keys to Master Deep Mandra Notes:
• Warm, Gentle Air Velocity: Direct a slow, warm, calm air stream into the blow hole. Over-blowing low notes forces the bamboo into higher octave squeaks.
• Slightly Relaxed Lip Aperture: Widen your lip aperture slightly and relax your jaw muscles to allow low acoustic resonant frequencies to develop inside the bamboo tube.
• 100% Airtight Hole Sealing: Mandra notes are extremely sensitive to air leaks. Ensure all finger pads cover their respective holes completely with zero gaps.`,
    relatedLink: { text: 'Read Mandra Saptak Practice Blueprint', view: 'learn_daily_practice' },
    tags: ['lower notes', 'mandra saptak', 'air velocity', 'finger seal']
  },
  {
    id: 'tech-half-hole-komal-swaras',
    category: 'Playing Techniques',
    question: 'How do I accurately play Komal Swaras (flat notes) using half-hole coverage?',
    answer: `Playing Komal Swaras (like Komal Re, Komal Ga, Komal Dha, Komal Ni) requires uncovering half of the tone hole while maintaining tone sweetness and pitch stability.

Mastering Half-Hole Komal Swaras:
1. Smooth Sliding Technique: Gently slide your finger pad backward along the bamboo tube until exactly 50% of the hole is open. Sliding maintains finger contact and ensures smooth tone transitions.
2. Pitch Checking with Tanpura: Komal swaras require precise pitch placement. Use a live Tanpura drone or FluteSangam tuner to train your muscle memory for exact half-hole positioning.
3. Air Angle Support: Slightly adjust air speed and roll the flute tube inward by a millimeter for extra pitch warmth on Komal notes.`,
    relatedLink: { text: 'View Interactive Fingering Chart for Komal Swaras', view: 'learn_fingering_chart' },
    tags: ['komal swaras', 'half hole', 'sliding finger', 'flat notes']
  },
  {
    id: 'tech-meend-smooth-glides',
    category: 'Playing Techniques',
    question: 'What is the secret to executing smooth, unbroken Meend (glides) between distant notes?',
    answer: `Meend (continuous vocalic glides between notes) is considered the true soul of Hindustani classical flute music, transforming isolated notes into a fluid, emotional singing voice.

Secrets to Executing Flawless Meend:
• Unbroken Continuous Air Column: Never stop blowing or decrease air pressure while moving your fingers between notes. The air column inside the bamboo must remain completely continuous.
• Peeling Finger Movement: Slowly unroll or peel your finger pads off the holes gradually (like unrolling adhesive tape) rather than lifting fingers abruptly.
• Combined Flute Tube Rotation: Combine slow finger peeling with rolling the flute tube inward or outward slightly to smoothly bridge pitch gaps (such as gliding from Pa down to Ga or Ma to Sa).`,
    relatedLink: { text: 'Read Advanced Meend & Ornamentation Guide', view: 'learn_daily_practice' },
    tags: ['meend', 'glides', 'unbroken air', 'ornamentation', 'bansuri meend']
  },
  {
    id: 'tech-tonguing-and-articulation',
    category: 'Playing Techniques',
    question: 'Should I tongue notes (single/double tonguing) on bansuri, or use breath staccato?',
    answer: `In Hindustani bansuri playing, note articulation uses a rich blend of breath strokes, finger taps, and light tongue touches depending on musical style and tempo.

Choosing Articulation Methods:
• Abdominal Breath Strokes (Blow Staccato): For classical Raag Aalap and slow compositions, articulate notes using gentle abdominal air pulses (diaphragm strokes) to preserve the fluid, wooden vocal quality of bansuri music.
• Light Tongue Taps ("Ta" or "Da"): Used in fast rhythm patterns (Jhala, Drut Gat) and lively folk/fusion pieces. Touch the tip of your tongue lightly to the roof of your mouth behind your front teeth.
• Finger Tapping (Sparsh Swara): Tapping an upper finger hole briefly acts as an acoustic separator between identical repeated notes (e.g., Sa-Sa-Sa) without needing any tongue contact.`,
    relatedLink: { text: 'Practice Alankar Articulation Drills', view: 'alankar_generator' },
    tags: ['tonguing', 'articulation', 'staccato', 'finger taps', 'sparsh swara']
  }
];
