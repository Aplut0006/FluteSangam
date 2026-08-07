import { FaqItem } from '../components/FluteFaqView';

export const HEALTH_AND_BREATHING_FAQS: FaqItem[] = [
  {
    id: 'health-diaphragmatic-breathing-explained',
    category: 'Health & Breathing',
    question: 'What is diaphragmatic breathing and how does it power the flute?',
    answer: `Diaphragmatic breathing (belly breathing) is the foundation of powerful, effortless air support for wind instruments:

- How it Works: As you inhale, expand your lower abdomen outwards, allowing your diaphragm muscle to drop downwards and fill the lower lungs completely. As you exhale while blowing into the flute, gently engage your abdominal muscles inward to maintain a steady air column.
- Difference from Shallow Chest Breathing: Shallow chest breathing expands only the upper ribs, causing rapid fatigue, tight neck muscles, and weak, unsteady air pressure.
- Benefits: Provides steady, controlled air flow, doubles sustained note duration, and keeps your upper chest and shoulders completely relaxed.`,
    relatedLink: { text: 'Read Bansuri Fundamentals & Breathing', view: 'learn_basics' },
    tags: ['diaphragmatic breathing', 'belly breathing', 'air support', 'stamina']
  },
  {
    id: 'health-correct-sitting-and-standing-posture',
    category: 'Health & Breathing',
    question: 'What is the correct posture for sitting and standing while playing the bansuri?',
    answer: `Proper posture aligns your vocal tract, spine, and respiratory system for optimal airflow:

- Sukhasana (Cross-Legged Seating): Sit on a firm cushion with hips slightly elevated above knees. Keep your spine erect but relaxed.
- Chair Seating: Sit on the front edge of the seat with both feet flat on the floor and knees at a 90-degree angle.
- Standing Posture: Stand with feet shoulder-width apart, knees un-locked, and weight evenly distributed.
- Head Position: Keep your chin parallel to the floor—never tilt your head downwards toward the flute, as this constricts your airway and muffles tone.`,
    relatedLink: { text: 'View Posture Guidelines', view: 'learn_basics' },
    tags: ['posture', 'sitting', 'standing', 'sukhasana', 'spine alignment']
  },
  {
    id: 'health-preventing-lip-fatigue-and-soreness',
    category: 'Health & Breathing',
    question: 'Why do my lips feel sore or fatigued, and how do I build embouchure stamina safely?',
    answer: `Lip fatigue is common for beginners as facial muscles adapt to new blowing demands:

- Why it Happens: The orbicularis oris muscles around your lips are working in new ways to maintain a narrow oval aperture.
- Building Stamina Safely: Practice in 20-minute blocks rather than long continuous marathons. Stop immediately if lips feel shaky or numb.
- Avoid Squeezing Lips: Never press the flute tube hard against your lower lip. Use minimal contact pressure—sound comes from air focus, not physical pressure.`,
    relatedLink: { text: 'Read Embouchure Basics', view: 'learn_basics' },
    tags: ['lip fatigue', 'embouchure stamina', 'facial muscles', 'sore lips']
  },
  {
    id: 'health-preventing-wrist-and-finger-pain',
    category: 'Health & Breathing',
    question: 'How do I prevent wrist soreness, finger joint stiffness, and RSI while practicing?',
    answer: `Hand and wrist discomfort stems from holding tension or unnatural joint angles:

- Flat Finger Pad Grip: Avoid curling fingers tightly into claws or pressing fingertips hard into wood. Use flat, relaxed finger pads.
- Curved Wrists: Keep wrists gently curved in a natural extension of your forearms—do not bend wrists at sharp 90-degree angles.
- Prevent RSI: Rest for 5 minutes every 25 minutes. Lower your hands and gently shake out your fingers, wrists, and forearms to release muscle tension.`,
    relatedLink: { text: 'Read Common Beginner Pitfalls', view: 'learn_common_mistakes' },
    tags: ['wrist pain', 'finger stiffness', 'rsi', 'hand ergonomics', 'relaxation']
  },
  {
    id: 'health-building-lung-capacity',
    category: 'Health & Breathing',
    question: 'Can I increase my lung capacity through breathing exercises and lifestyle habits?',
    answer: `While anatomical lung size is fixed, you can significantly increase usable lung volume and breathing efficiency:

- Pranayama Exercises: Practice Anulom Vilom (alternate nostril breathing) and Kapalabhati to strengthen respiratory muscles and improve oxygen transfer.
- Aerobic Exercise: Regular swimming, brisk walking, or cycling builds cardiovascular endurance and lung efficiency.
- Daily Long Blows: Sustaining long Kharaj notes daily conditions your lungs to expel air with maximum efficiency and minimum waste.`,
    relatedLink: { text: 'Explore Daily Sadhana Blueprint', view: 'learn_daily_practice' },
    tags: ['lung capacity', 'pranayama', 'breathing exercises', 'endurance']
  },
  {
    id: 'health-stopping-dizziness-and-lightheadedness',
    category: 'Health & Breathing',
    question: 'Why do I feel dizzy or lightheaded when playing, and how do I prevent it?',
    answer: `Dizziness occurs when hyperventilation lowers carbon dioxide levels in your bloodstream:

- Why it Happens: Beginners often expel air too rapidly or force breath without full diaphragmatic support.
- How to Fix it Immediately: Stop playing, sit down comfortably, and take slow, normal nasal breaths until your head clears.
- Long-Term Solution: Focus on blowing a thin, focused air stream rather than dumping large volumes of air into the flute.`,
    relatedLink: { text: 'Read Beginners Troubleshooting', view: 'learn_basics' },
    tags: ['dizziness', 'lightheadedness', 'hyperventilation', 'air focus']
  },
  {
    id: 'health-preventing-neck-and-shoulder-tension',
    category: 'Health & Breathing',
    question: 'Why do my neck and shoulders hurt during practice, and how do I fix my alignment?',
    answer: `Neck and shoulder tension is caused by hunching, raising shoulders toward ears, or turning the head awkwardly:

- Drop Your Shoulders: Periodically check that your shoulders are dropped and relaxed, away from your ears.
- Bring Flute to Lips: Bring the flute up to meet your lips—never lower your chin down to meet the flute.
- Mirror Check: Practice in front of a mirror to spot shoulder elevation or neck tilting early.`,
    relatedLink: { text: 'View Posture & Alignment Blueprint', view: 'learn_basics' },
    tags: ['neck pain', 'shoulder tension', 'posture check', 'mirror alignment']
  },
  {
    id: 'health-practice-warmup-and-cooldown',
    category: 'Health & Breathing',
    question: 'What is an effective physical warm-up and cool-down routine for flute players?',
    answer: `Warming up and cooling down protects muscles and joints:

- Pre-Practice Warm-Up (3 mins): Gently roll your shoulders backwards, stretch your neck side to side, flex and extend your wrists, and take 5 deep diaphragmatic breaths.
- Post-Practice Cool-Down (2 mins): Drop your arms, gently shake out your hands, stretch your finger flexors, and massage your cheeks and jaw lightly.`,
    relatedLink: { text: 'Read Daily Practice Routine', view: 'learn_daily_practice' },
    tags: ['warmup', 'cooldown', 'stretching', 'injury prevention']
  },
  {
    id: 'health-hydration-and-lip-care',
    category: 'Health & Breathing',
    question: 'How does body hydration affect flute playing and lip embouchure performance?',
    answer: `Hydration directly impacts lip flexibility and air seal:

- Dehydrated Lips: Dry or chapped lips create a rough surface, causing air leakage and erratic pitch.
- Sip Water During Practice: Keep a water bottle handy and sip water throughout practice sessions.
- Lip Balm Use: Apply non-greasy, natural lip balm well before practice sessions so lips remain soft and smooth without slipping on the bamboo blow hole.`,
    relatedLink: { text: 'Explore Flute Care & Health Tips', view: 'learn_basics' },
    tags: ['hydration', 'lip care', 'chapped lips', 'embouchure']
  },
  {
    id: 'health-playing-with-colds-and-allergies',
    category: 'Health & Breathing',
    question: 'Should I practice the flute when I have a common cold, sore throat, or nasal congestion?',
    answer: `Practicing while sick requires careful self-awareness:

- Sore Throat or Fever: Rest completely—do not force your respiratory system when inflamed.
- Mild Nasal Congestion: Light long-note practice is acceptable and can actually open nasal passages gently, but avoid intense, high-octane sessions.
- Clean Your Flute: Always swab and sanitize your flute blow hole thoroughly after practicing while recovering from a cold to prevent re-infection.`,
    relatedLink: { text: 'Read Flute Hygiene Guidelines', view: 'learn_basics' },
    tags: ['common cold', 'sore throat', 'health', 'hygiene']
  },
  {
    id: 'health-managing-performance-anxiety',
    category: 'Health & Breathing',
    question: 'How do I manage performance anxiety, rapid breathing, and shaky hands before playing?',
    answer: `Performance anxiety triggers "fight or flight" physiological responses that affect air control:

- Box Breathing Technique: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 4 times before stepping on stage.
- Focus on the Drone: Center your mind on the soothing frequency of the Tanpura drone rather than worrying about mistakes.
- Ground Your Feet: Feel the physical contact of your feet on the floor to release nervous upper-body energy.`,
    relatedLink: { text: 'Join Supportive Community Feed', view: 'community' },
    tags: ['performance anxiety', 'stage fright', 'shaky hands', 'box breathing']
  },
  {
    id: 'health-ideal-practice-break-schedule',
    category: 'Health & Breathing',
    question: 'How often should I take breaks during long practice sessions to protect my body?',
    answer: `Taking structured breaks maintains mental sharpness and prevents repetitive strain:

- The 25/5 Rule (Pomodoro): Practice for 25 minutes, then take a mandatory 5-minute break away from the instrument.
- During the Break: Stand up, walk around, stretch your hands, sip water, and rest your eyes and ears.
- Long Sessions: If practicing for more than 90 minutes total, split practice into distinct morning and evening sessions.`,
    relatedLink: { text: 'View Recommended Practice Schedules', view: 'learn_daily_practice' },
    tags: ['practice breaks', 'pomodoro', 'rest', 'stamina']
  }
];
