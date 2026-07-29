export type ChatCategoryType =
  | 'Beginner'
  | 'Choosing a Flute'
  | 'Blowing & Sound'
  | 'Finger Technique'
  | 'Notes & Scales'
  | 'Alankars'
  | 'Raagas'
  | 'Techniques'
  | 'Practice'
  | 'Songs'
  | 'Maintenance'
  | 'Tuning'
  | 'Music Theory'
  | 'Performance'
  | 'Common Problems'
  | 'Community'
  | 'General FAQ';

export interface ChatbotQA {
  id: string;
  question: string;
  answer: string;
  category: ChatCategoryType;
  keywords: string[];
  relatedIds: string[];
}

export interface ChatCategory {
  id: ChatCategoryType;
  name: string;
  icon: string;
}

export const CHATBOT_CATEGORIES: ChatCategory[] = [
  { id: 'Beginner', name: '🪈 Beginner', icon: 'Sparkles' },
  { id: 'Choosing a Flute', name: '🎵 Choosing Flute', icon: 'ShoppingBag' },
  { id: 'Blowing & Sound', name: '🌬️ Blowing & Sound', icon: 'Wind' },
  { id: 'Finger Technique', name: '✋ Finger Technique', icon: 'Hand' },
  { id: 'Notes & Scales', name: '🎼 Notes & Scales', icon: 'Music' },
  { id: 'Alankars', name: '🎶 Alankars', icon: 'BookOpen' },
  { id: 'Raagas', name: '🎼 Raagas', icon: 'Music' },
  { id: 'Techniques', name: '🎹 Techniques', icon: 'Zap' },
  { id: 'Practice', name: '🎵 Practice', icon: 'Target' },
  { id: 'Songs', name: '🎼 Songs', icon: 'Volume2' },
  { id: 'Maintenance', name: '🎵 Maintenance', icon: 'ShieldCheck' },
  { id: 'Tuning', name: '🎯 Tuning', icon: 'Sliders' },
  { id: 'Music Theory', name: '🎼 Theory', icon: 'BookOpen' },
  { id: 'Performance', name: '🎤 Performance', icon: 'Award' },
  { id: 'Common Problems', name: '❓ Problems', icon: 'AlertCircle' },
  { id: 'Community', name: '🌐 Community', icon: 'Users' },
  { id: 'General FAQ', name: '💡 FAQ Specials', icon: 'HelpCircle' }
];

export const CHATBOT_QA_DATABASE: ChatbotQA[] = [
  // ==========================================
  // 🪈 1. BEGINNER QUESTIONS
  // ==========================================
  {
    id: 'beg_what_is_bansuri',
    question: 'What is the Indian bamboo flute (Bansuri)?',
    category: 'Beginner',
    answer: 'The Bansuri is a traditional side-blown (transverse) wind instrument crafted from seasoned bamboo. Deeply rooted in Indian classical music, it has 6 or 7 finger holes and produces a warm, organic, and soulful acoustic tone without mechanical keys.',
    keywords: ['what is', 'bansuri', 'bamboo flute', 'indian flute', 'transverse', 'introduction'],
    relatedIds: ['beg_difficult_to_learn', 'ch_best_for_beginners']
  },
  {
    id: 'beg_difficult_to_learn',
    question: 'Is the Bansuri difficult to learn?',
    category: 'Beginner',
    answer: 'Producing your very first sound requires patience (usually 1–3 days to form an embouchure), but once you master clean blowing, playing basic notes and melodies is very rewarding! Consistent daily 20-minute practice makes learning smooth and enjoyable.',
    keywords: ['difficult', 'hard', 'easy', 'learn', 'tough', 'patience'],
    relatedIds: ['beg_how_long', 'bl_no_sound']
  },
  {
    id: 'beg_learn_at_home',
    question: 'Can I learn Bansuri at home?',
    category: 'Beginner',
    answer: 'Yes! You can completely learn Bansuri at home using structured apps like **FluteSangam**, guided video modules, interactive fingering charts, built-in tuners, and tanpura drones.',
    keywords: ['home', 'self learn', 'online', 'at home', 'alone', 'flutesangam'],
    relatedIds: ['beg_without_teacher', 'beg_learn_youtube']
  },
  {
    id: 'beg_best_age',
    question: 'What is the best age to start learning Bansuri?',
    category: 'Beginner',
    answer: 'Any age from 7 to 85+ is great! Children can start with small flutes (like F or G Medium), while adults can begin directly on C Natural or G Natural flutes.',
    keywords: ['age', 'best age', 'kids', 'children', 'young', 'old', 'start'],
    relatedIds: ['beg_too_old', 'ch_children_adult_flutes']
  },
  {
    id: 'beg_too_old',
    question: 'Am I too old to learn the flute?',
    category: 'Beginner',
    answer: 'Never! Music has no age limit. Many adults begin learning Bansuri in their 40s, 50s, 60s, or after retirement. Playing flute improves lung capacity, mindfulness, and finger agility.',
    keywords: ['too old', 'age limit', 'adult beginner', 'senior', 'elderly', 'retirement'],
    relatedIds: ['beg_best_age', 'beg_difficult_to_learn']
  },
  {
    id: 'beg_how_long',
    question: 'How long does it take to learn Bansuri?',
    category: 'Beginner',
    answer: '• **Clean Sound:** 1 to 3 days\n• **Basic 7 Notes (Sargam):** 1 to 2 weeks\n• **Simple Songs & Alankars:** 1 to 3 months\n• **Classical Ragas & Smooth Meend:** 1 to 2 years of regular practice.',
    keywords: ['how long', 'duration', 'time', 'days', 'months', 'years', 'timeline'],
    relatedIds: ['beg_difficult_to_learn', 'prac_daily_routine']
  },
  {
    id: 'beg_without_teacher',
    question: 'Can I learn without a teacher?',
    category: 'Beginner',
    answer: 'Yes, basic notes, songs, and finger drills can be self-taught using online tools, tuners, and community feedback on FluteSangam. Eventually, periodically consulting a Guru will help refine subtle classical techniques like Meend and Gamak.',
    keywords: ['without teacher', 'guru', 'self taught', 'alone', 'no guide'],
    relatedIds: ['beg_learn_at_home', 'beg_learn_youtube']
  },
  {
    id: 'beg_hours_daily',
    question: 'How many hours should I practice daily?',
    category: 'Beginner',
    answer: 'For beginners, **20 to 30 minutes daily** of focused practice (10 mins long blowing + 10 mins Alankars + 10 mins simple songs) is ideal. Consistency beats long weekend sessions!',
    keywords: ['hours', 'daily', 'time', 'practice time', 'minutes', 'duration'],
    relatedIds: ['prac_daily_routine', 'prac_how_long_beginners']
  },
  {
    id: 'beg_what_to_learn_first',
    question: 'What should I learn first?',
    category: 'Beginner',
    answer: '1. **Sound Production:** Blowing a steady, clear tone on Sa.\n2. **Holding & Finger Placement:** Covering all 6 holes completely.\n3. **Basic Sargam:** Sa Re Ga Ma Pa Dha Ni Sa.\n4. **Simple Alankars:** 3 to 4 note patterns with metronome.',
    keywords: ['what to learn first', 'starting point', 'first step', 'basics', 'roadmap'],
    relatedIds: ['bl_clear_tone', 'al_what_is', 'ns_play_sa']
  },
  {
    id: 'beg_music_theory_needed',
    question: 'Is music theory necessary?',
    category: 'Beginner',
    answer: 'You do not need complex Western theory! Basic Indian concepts—like 7 Swaras (Sa Re Ga Ma...), Octaves (Saptak), and simple rhythm (Taal)—are easy to grasp as you play.',
    keywords: ['theory', 'necessary', 'read music', 'sargam', 'notation', 'must learn'],
    relatedIds: ['th_seven_notes', 'th_saptak', 'th_taal']
  },
  {
    id: 'beg_mistakes_beginners_make',
    question: 'What mistakes do beginners make?',
    category: 'Beginner',
    answer: 'Common beginner mistakes:\n1. Blowing too hard.\n2. Using fingertips instead of flat finger pads.\n3. Skipping long note blowing (Swar Sadhana).\n4. Practicing without a Tanpura or Tuner.',
    keywords: ['mistakes', 'errors', 'wrong habit', 'avoid', 'beginner mistakes'],
    relatedIds: ['bl_sound_airy', 'fing_cover_holes', 'faq_top10_mistakes']
  },
  {
    id: 'beg_stay_motivated',
    question: 'How can I stay motivated to practice?',
    category: 'Beginner',
    answer: '• Set small weekly goals (e.g., learn 1 simple song or 2 Alankars).\n• Record your audio weekly to hear your progress.\n• Share your clips in the **FluteSangam Community** for encouragement!',
    keywords: ['motivation', 'motivated', 'stay inspired', 'bored', 'routine'],
    relatedIds: ['comm_share_recordings', 'prac_track_progress']
  },
  {
    id: 'beg_learn_youtube',
    question: 'Can I learn by watching YouTube videos?',
    category: 'Beginner',
    answer: 'YouTube videos are great for visual demonstration, but combine them with an active feedback tool like FluteSangam to verify if your blowing pitch is in tune.',
    keywords: ['youtube', 'videos', 'online tutorials', 'watch videos'],
    relatedIds: ['beg_learn_at_home', 'beg_without_teacher']
  },
  {
    id: 'beg_know_improving',
    question: 'How do I know if I am improving?',
    category: 'Beginner',
    answer: 'Signs of progress:\n1. Your sound becomes less airy and more resonant.\n2. You can hold Sa steady for 15+ seconds.\n3. Finger transitions become smooth without squeaks.\n4. You hit green on the tuner effortlessly.',
    keywords: ['improving', 'progress', 'signs', 'growth', 'tracking'],
    relatedIds: ['prac_track_progress', 'tune_check_tuned']
  },

  // ==========================================
  // 🎵 2. CHOOSING A FLUTE
  // ==========================================
  {
    id: 'ch_best_for_beginners',
    question: 'Which flute is best for beginners?',
    category: 'Choosing a Flute',
    answer: 'For adult beginners, a **C Natural Medium (C Middle)** or **G Natural Bass (G Base)** is best. C Middle is compact and easy on fingers, while G Base offers a deep classical tone.',
    keywords: ['best flute', 'which flute', 'beginner flute', 'first flute', 'recommendation'],
    relatedIds: ['ch_which_scale', 'ch_g_vs_c_natural']
  },
  {
    id: 'ch_which_scale',
    question: 'Which flute scale should I buy?',
    category: 'Choosing a Flute',
    answer: '• **C Natural Medium:** Best for comfortable finger reach and crisp tone.\n• **A Natural Medium:** Slightly longer, very popular for light songs.\n• **G Natural Bass:** Standard for Indian classical music.',
    keywords: ['scale', 'key', 'c natural', 'g natural', 'a natural', 'which scale'],
    relatedIds: ['ch_best_for_beginners', 'ch_flute_size']
  },
  {
    id: 'ch_g_vs_c_natural',
    question: 'Should I buy a G Natural or C Natural flute?',
    category: 'Choosing a Flute',
    answer: '• **C Natural (Middle):** ~19 inches. Easier grip, requires less finger stretch. Great for total beginners.\n• **G Natural (Bass):** ~26 inches. Deep soothing tone, requires moderate finger stretch. Standard for classical classical ragas.',
    keywords: ['g natural', 'c natural', 'difference', 'g base', 'c middle', 'comparison'],
    relatedIds: ['ch_best_for_beginners', 'ch_flute_size']
  },
  {
    id: 'ch_flute_size',
    question: 'How do I choose the correct flute size?',
    category: 'Choosing a Flute',
    answer: 'Measure your palm and finger stretch. If your fingers are small, start with **C Medium** or **E Medium**. If average/large, you can start directly with **A Medium** or **G Bass**.',
    keywords: ['flute size', 'length', 'hand size', 'finger reach', 'small hands'],
    relatedIds: ['ch_g_vs_c_natural', 'faq_small_hands']
  },
  {
    id: 'ch_easier_to_play',
    question: 'Which flute is easier to play?',
    category: 'Choosing a Flute',
    answer: 'Medium sized flutes (like **C Natural Medium** or **D Natural Medium**) are the easiest because the hole spacing is small and blowing air demand is low.',
    keywords: ['easier', 'easiest flute', 'less effort', 'small hole'],
    relatedIds: ['ch_best_for_beginners', 'ch_which_scale']
  },
  {
    id: 'ch_bamboo_vs_pvc',
    question: 'Bamboo or PVC flute?',
    category: 'Choosing a Flute',
    answer: '• **Bamboo:** Traditional, organic, rich classical warmth. Needs care against weather cracks.\n• **PVC Fiber:** 100% durable, washable, weather-proof, perfectly tuned. Great for practice and travel!',
    keywords: ['bamboo', 'pvc', 'plastic', 'fiber', 'material', 'durable'],
    relatedIds: ['maint_clean', 'maint_cracking']
  },
  {
    id: 'ch_maker_recommended',
    question: 'Which flute maker is recommended?',
    category: 'Choosing a Flute',
    answer: 'Reputable Indian makers include Punam Flutes (Subhash Thakur), Sarfuddin Flutes, Anubodh, and DP Flutes. Look for well-tuned seasoned Assam bamboo with tight nylon binding threads.',
    keywords: ['maker', 'brand', 'punam', 'sarfuddin', 'anubodh', 'buy online', 'authentic'],
    relatedIds: ['ch_how_much_spend', 'ch_online_vs_local']
  },
  {
    id: 'ch_how_much_spend',
    question: 'How much should I spend on my first flute?',
    category: 'Choosing a Flute',
    answer: 'A reliable, well-tuned beginner bamboo or PVC flute costs around **₹800 to ₹2,500 ($15–$35 USD)**. Avoid unbranded ₹200 souvenir flutes as they are often out of tune.',
    keywords: ['cost', 'price', 'spend', 'how much', 'budget', 'cheap vs good'],
    relatedIds: ['ch_maker_recommended', 'ch_best_for_beginners']
  },
  {
    id: 'ch_children_adult_flutes',
    question: 'Can children use adult flutes?',
    category: 'Choosing a Flute',
    answer: 'Children under 10 usually struggle with long bass flutes like G Natural. Start children on **E Medium, F Medium, or C Medium** for comfortable finger reach.',
    keywords: ['children', 'kids', 'adult flute', 'small fingers', 'child size'],
    relatedIds: ['beg_best_age', 'faq_small_hands']
  },
  {
    id: 'ch_online_vs_local',
    question: 'Should I buy online or from a local shop?',
    category: 'Choosing a Flute',
    answer: 'Buying online directly from verified flute masters/makers guarantees accurate tuning. Local craft shops often sell decorative souvenirs that are not tuned to concert pitch (A440).',
    keywords: ['online', 'local shop', 'where to buy', 'amazon', 'store'],
    relatedIds: ['ch_maker_recommended', 'tune_a440']
  },
  {
    id: 'ch_side_blown_vs_recorder',
    question: 'What is the difference between side-blown and recorder flutes?',
    category: 'Choosing a Flute',
    answer: '• **Side-Blown (Bansuri):** Played sideways across an open embouchure hole. Offers complete pitch bending (Meend) and expressive dynamic control.\n• **Recorder / Fipple Flute:** Whistle mouthpiece blown straight ahead. Easy sound production but limited classical expressiveness.',
    keywords: ['side blown', 'recorder', 'fipple', 'difference', 'whistle flute', 'transverse'],
    relatedIds: ['beg_what_is_bansuri', 'tech_meend']
  },

  // ==========================================
  // 🌬️ 3. BLOWING & SOUND
  // ==========================================
  {
    id: 'bl_no_sound',
    question: 'Why is no sound coming from my flute?',
    category: 'Blowing & Sound',
    answer: 'If no sound comes out:\n1. Your lip aperture might be too wide or not focused.\n2. You may be blowing straight inside the hole instead of across the outer edge.\n3. Place the inner edge of the blow hole right on your lower lip line.',
    keywords: ['no sound', 'silent', 'not blowing', 'how to blow', 'no tone'],
    relatedIds: ['bl_sound_airy', 'bl_lip_position']
  },
  {
    id: 'bl_sound_airy',
    question: 'Why is my sound airy?',
    category: 'Blowing & Sound',
    answer: 'Airy sound means air is leaking past the edge. Solution: Form a small oval "pucker" with your lips, cover 1/4th of the blowing hole with your lower lip, and direct a thin jet of air across the edge.',
    keywords: ['airy sound', 'hissing', 'noise', 'breathy', 'unclear sound'],
    relatedIds: ['bl_clear_tone', 'bl_lip_position']
  },
  {
    id: 'bl_clear_tone',
    question: 'How do I get a clear tone?',
    category: 'Blowing & Sound',
    answer: 'Practice **Swar Sadhana** (sustaining Sa for 15+ seconds into a tuner) daily. Relax your jaw, keep your lip opening small, and keep air pressure gentle and steady.',
    keywords: ['clear tone', 'sweet sound', 'tone quality', 'resonance', 'clarity'],
    relatedIds: ['bl_sound_airy', 'prac_breathing_exercises']
  },
  {
    id: 'bl_lip_position',
    question: 'How should I position my lips?',
    category: 'Blowing & Sound',
    answer: 'Place the embouchure hole flat against your chin skin right below your lower lip. Cover about 20–25% of the hole with your lower lip, leaving the rest open for air split.',
    keywords: ['lips', 'lip position', 'embouchure', 'placement', 'chin'],
    relatedIds: ['bl_no_sound', 'bl_sound_airy']
  },
  {
    id: 'bl_how_much_air',
    question: 'How much air should I blow?',
    category: 'Blowing & Sound',
    answer: 'Blow with gentle, focused air pressure—similar to blowing gently on hot tea or a candle flame without blowing it out. Over-blowing causes harsh squeaks!',
    keywords: ['how much air', 'air pressure', 'blowing force', 'too hard'],
    relatedIds: ['bl_clear_tone', 'prob_flute_squeak']
  },
  {
    id: 'bl_sound_breaks',
    question: 'Why does the sound break?',
    category: 'Blowing & Sound',
    answer: 'Sound breaking happens when your finger holes are not sealed 100% flat or when your blowing air stream fluctuates in angle or pressure.',
    keywords: ['sound breaks', 'wavering', 'crackling', 'interrupted sound'],
    relatedIds: ['fing_cover_holes', 'bl_clear_tone']
  },
  {
    id: 'bl_breath_control',
    question: 'How do I improve breath control?',
    category: 'Blowing & Sound',
    answer: 'Use diaphragmatic deep belly breathing (Pranayama). Inhale expanding your stomach, and exhale slowly while keeping abdominal muscles gently engaged.',
    keywords: ['breath control', 'stamina', 'breathing', 'lung capacity', 'pranayama'],
    relatedIds: ['bl_play_long_notes', 'prac_breathing_exercises']
  },
  {
    id: 'bl_play_long_notes',
    question: 'How can I play long notes?',
    category: 'Blowing & Sound',
    answer: 'Start with 10-second holds on Sa, then gradually extend to 15, 20, and 25 seconds over 2 weeks of daily Swar Sadhana. Focus on air efficiency over lung size.',
    keywords: ['long notes', 'sustain', 'holding notes', 'breath stamina'],
    relatedIds: ['bl_breath_control', 'prac_breathing_exercises']
  },
  {
    id: 'bl_higher_octave_weak',
    question: 'Why is my higher octave weak?',
    category: 'Blowing & Sound',
    answer: 'Higher octaves require **faster air speed**, not louder volume! Narrow your lip hole slightly and roll the flute subtly outwards away from your chin.',
    keywords: ['higher octave weak', 'taar saptak', 'high notes soft', 'upper range'],
    relatedIds: ['ns_shift_octaves', 'prob_high_notes']
  },
  {
    id: 'bl_increase_volume',
    question: 'How do I increase volume without losing tone?',
    category: 'Blowing & Sound',
    answer: 'Support the air column from your diaphragm while maintaining a firm lip structure so the pitch does not go sharp when playing louder.',
    keywords: ['volume', 'loudness', 'increase volume', 'projection'],
    relatedIds: ['bl_clear_tone', 'bl_breath_control']
  },

  // ==========================================
  // ✋ 4. FINGER TECHNIQUE
  // ==========================================
  {
    id: 'fing_how_to_hold',
    question: 'How should I hold the flute?',
    category: 'Finger Technique',
    answer: 'Hold the flute horizontally with relaxed wrists and lowered shoulders. Let the flute rest naturally on your thumb and lower chin without tightly squeezing.',
    keywords: ['hold flute', 'posture', 'grip', 'hands position', 'holding'],
    relatedIds: ['fing_cover_holes', 'fing_fingers_hurting']
  },
  {
    id: 'fing_cover_holes',
    question: 'How do I cover the holes properly?',
    category: 'Finger Technique',
    answer: 'Use the **flat soft pads** of your fingers (middle finger joint), NOT fingertips! Press gently to form a complete seal without air gaps.',
    keywords: ['cover holes', 'finger pads', 'fingertips', 'leakage', 'flat fingers'],
    relatedIds: ['fing_avoid_leaks', 'ns_pa_not_correct']
  },
  {
    id: 'fing_fingers_hurting',
    question: 'Why are my fingers hurting?',
    category: 'Finger Technique',
    answer: 'Pain indicates muscle tension or pressing the holes too hard. Take a 5-minute break, shake your hands, and focus on pressing with minimal necessary pressure.',
    keywords: ['pain', 'hurting', 'cramps', 'strain', 'hand fatigue'],
    relatedIds: ['fing_how_to_hold', 'prac_avoid_fatigue']
  },
  {
    id: 'fing_fingers_slow',
    question: 'Why are my fingers slow?',
    category: 'Finger Technique',
    answer: 'Slow fingers are usually caused by lifting fingers too high above the holes or holding tension in wrists. Keep fingers within 0.5 cm of the holes!',
    keywords: ['slow fingers', 'sluggish', 'finger speed', 'heavy fingers'],
    relatedIds: ['fing_increase_speed', 'al_increase_speed']
  },
  {
    id: 'fing_increase_speed',
    question: 'How can I increase finger speed?',
    category: 'Finger Technique',
    answer: 'Practice **Alankars and Paltas** slowly with a Metronome at 60 BPM first. Gradually increase tempo by 5 BPM once accuracy is 100%.',
    keywords: ['increase speed', 'fast fingers', 'paltas', 'speed drill', 'metronome'],
    relatedIds: ['fing_fingers_slow', 'al_increase_speed']
  },
  {
    id: 'fing_avoid_leaks',
    question: 'How do I avoid accidental hole leaks?',
    category: 'Finger Technique',
    answer: 'Check ring marks on your finger pads after playing! If a ring mark is off-center or missing an edge, adjust your hand position to center your pads.',
    keywords: ['leaks', 'hole leaks', 'air gap', 'ring marks', 'seal'],
    relatedIds: ['fing_cover_holes', 'ns_pa_not_correct']
  },
  {
    id: 'fing_strengthen_fingers',
    question: 'How do I strengthen my fingers?',
    category: 'Finger Technique',
    answer: 'Practice lifting individual fingers independently while holding all other holes down (e.g. lifting ring finger alone repeatedly).',
    keywords: ['strengthen', 'finger strength', 'ring finger', 'independence'],
    relatedIds: ['fing_coordination_exercises', 'fing_increase_speed']
  },
  {
    id: 'fing_which_move_first',
    question: 'Which fingers should move first?',
    category: 'Finger Technique',
    answer: 'In ascending Sargam (Sa to Sa\'), lift fingers one by one from bottom to top. In descending Sargam, cover holes top to bottom.',
    keywords: ['which fingers move', 'order of fingers', 'sargam movement'],
    relatedIds: ['ns_play_sa', 'al_what_is']
  },
  {
    id: 'fing_faster_passages',
    question: 'How do I play faster passages?',
    category: 'Finger Technique',
    answer: 'Break down fast song phrases into 3-note chunks. Repeat each chunk 10 times slowly, then combine them seamlessly.',
    keywords: ['faster passages', 'fast songs', 'taan', 'speed phrases'],
    relatedIds: ['fing_increase_speed', 'sng_memorize']
  },
  {
    id: 'fing_coordination_exercises',
    question: 'What exercises improve finger coordination?',
    category: 'Finger Technique',
    answer: 'Practice alternating jump patterns like `S G R M G P M D P N D S\'` (1-3, 2-4 Alankars) to build multi-finger synchrony.',
    keywords: ['coordination', 'exercises', 'jump patterns', 'finger drills'],
    relatedIds: ['al_which_start', 'fing_increase_speed']
  },

  // ==========================================
  // 🎼 5. NOTES & SCALES
  // ==========================================
  {
    id: 'ns_play_sa',
    question: 'How do I play Sa?',
    category: 'Notes & Scales',
    answer: 'Cover the **top 3 holes** completely with your top hand and leave the lower 3 holes open. Blow gently into the embouchure.',
    keywords: ['play sa', 'shadja', 'first note', 'how to play sa', '3 holes'],
    relatedIds: ['ns_play_re', 'ns_play_ga']
  },
  {
    id: 'ns_play_re',
    question: 'How do I play Re?',
    category: 'Notes & Scales',
    answer: 'Cover the **top 2 holes** completely and keep all other 4 holes open. Maintain the same air pressure as Sa.',
    keywords: ['play re', 'rishabh', 're note', '2 holes'],
    relatedIds: ['ns_play_sa', 'ns_play_ga']
  },
  {
    id: 'ns_play_ga',
    question: 'How do I play Ga?',
    category: 'Notes & Scales',
    answer: 'Cover only the **top 1 hole** and keep the bottom 5 holes open. Gently steady your breath.',
    keywords: ['play ga', 'gandhar', 'ga note', '1 hole'],
    relatedIds: ['ns_play_re', 'ns_tivra_ma']
  },
  {
    id: 'ns_pa_not_correct',
    question: 'Why is Pa not coming correctly?',
    category: 'Notes & Scales',
    answer: 'Pa requires covering all **top 3 holes + bottom 3 holes** (all 6 holes closed) on many traditional bansuri styles, or all top 3 holes covered while lower holes seal flatly. Check for micro-gaps on lower holes!',
    keywords: ['pa not coming', 'pancham', 'pa note', '6 holes closed'],
    relatedIds: ['fing_cover_holes', 'fing_avoid_leaks']
  },
  {
    id: 'ns_tivra_ma',
    question: 'How do I play Tivra Ma?',
    category: 'Notes & Scales',
    answer: 'Cover top 3 holes + half-cover or fully open the 4th hole depending on your flute tuning scale.',
    keywords: ['tivra ma', 'sharp ma', 'madhyam', 'half hole ma'],
    relatedIds: ['ns_play_ga', 'th_komal_tivra']
  },
  {
    id: 'ns_komal_ni',
    question: 'How do I play Komal Ni?',
    category: 'Notes & Scales',
    answer: 'Leave all top holes open and half-cover the very top hole, or roll the flute slightly inward while playing Ni.',
    keywords: ['komal ni', 'flat ni', 'half hole ni', 'nishad'],
    relatedIds: ['th_komal_tivra', 'tech_meend']
  },
  {
    id: 'ns_shift_octaves',
    question: 'How do I shift octaves?',
    category: 'Notes & Scales',
    answer: 'To shift from Middle Octave (Madhya) to Higher Octave (Taar), keep fingerings identical but increase air stream speed and tighten your lip aperture slightly.',
    keywords: ['shift octaves', 'higher octave', 'octave jump', 'madhya to taar'],
    relatedIds: ['bl_higher_octave_weak', 'ns_upper_octave']
  },
  {
    id: 'ns_middle_octave',
    question: 'What is the middle octave?',
    category: 'Notes & Scales',
    answer: 'The **Madhya Saptak** (Middle Octave) is the default, comfortable vocal and instrumental range where most melodies sit.',
    keywords: ['middle octave', 'madhya saptak', 'normal octave'],
    relatedIds: ['ns_lower_octave', 'ns_upper_octave']
  },
  {
    id: 'ns_lower_octave',
    question: 'What is the lower octave?',
    category: 'Notes & Scales',
    answer: 'The **Mandra Saptak** (Lower Octave) features deep, resonant notes played with warm, gentle, relaxed breath pressure.',
    keywords: ['lower octave', 'mandra saptak', 'deep notes', 'low sa'],
    relatedIds: ['ns_middle_octave', 'ns_upper_octave']
  },
  {
    id: 'ns_upper_octave',
    question: 'What is the upper octave?',
    category: 'Notes & Scales',
    answer: 'The **Taar Saptak** (Upper Octave) contains bright high-pitched notes produced using focused fast air streams.',
    keywords: ['upper octave', 'taar saptak', 'high octave', 'high notes'],
    relatedIds: ['ns_shift_octaves', 'bl_higher_octave_weak']
  },
  {
    id: 'ns_play_12_notes',
    question: 'How do I play all 12 notes?',
    category: 'Notes & Scales',
    answer: 'The 12 notes consist of 7 Shuddha (natural) + 4 Komal (flat) + 1 Tivra (sharp). Flat/sharp notes are achieved using half-hole coverage and subtle inward flute rolling.',
    keywords: ['12 notes', 'all notes', 'chromatic scale', 'half holes'],
    relatedIds: ['th_komal_tivra', 'ns_tivra_ma']
  },

  // ==========================================
  // 🎶 6. ALANKARS
  // ==========================================
  {
    id: 'al_what_is',
    question: 'What is an Alankar?',
    category: 'Alankars',
    answer: 'An **Alankar** (literally "ornament") is a structured pattern exercise of notes (e.g. SRGM, RGMP, GMPD...) designed to build technique, timing, and ear training.',
    keywords: ['what is alankar', 'pattern', 'sargam exercise', 'palta'],
    relatedIds: ['al_why_practice', 'al_which_start']
  },
  {
    id: 'al_why_practice',
    question: 'Why should beginners practice Alankars?',
    category: 'Alankars',
    answer: 'Alankars develop muscle memory, finger agility, rhythm control, and pitch accuracy far faster than learning songs alone.',
    keywords: ['why practice alankars', 'benefits', 'importance', 'muscle memory'],
    relatedIds: ['al_what_is', 'al_improve_movement']
  },
  {
    id: 'al_which_start',
    question: 'Which Alankars should beginners start with?',
    category: 'Alankars',
    answer: 'Start with:\n1. `S R G M | R G M P | G M P D ...` (3-note continuous)\n2. `S R G M P | R G M P D ...` (4-note step)\n3. Double notes: `SS RR GG MM PP DD NN S\'S\'`.',
    keywords: ['which alankars', 'beginner alankars', 'first alankars', 'simple patterns'],
    relatedIds: ['al_what_is', 'al_how_many_daily']
  },
  {
    id: 'al_how_many_daily',
    question: 'How many Alankars should I practice daily?',
    category: 'Alankars',
    answer: 'Practicing **3 to 5 Alankars thoroughly** (slowly with metronome) is better than rushing through 20 carelessly.',
    keywords: ['how many alankars', 'daily alankars', 'quantity'],
    relatedIds: ['al_practice_metronome', 'prac_daily_routine']
  },
  {
    id: 'al_practice_metronome',
    question: 'Should I practice with a metronome?',
    category: 'Alankars',
    answer: 'Yes! Always practice Alankars with a Metronome or Tanpura at 60–70 BPM to build infallible rhythm (Taal) and steady tempo.',
    keywords: ['metronome', 'tempo', 'rhythm', 'bpm', 'beat'],
    relatedIds: ['al_increase_speed', 'th_taal']
  },
  {
    id: 'al_increase_speed',
    question: 'How can I increase Alankar speed?',
    category: 'Alankars',
    answer: 'Start slow (60 BPM). Once you play clean 10 times in a row, raise tempo by 5 BPM intervals (65, 70, 75...). Speed comes from accuracy!',
    keywords: ['increase speed', 'speed up alankars', 'fast palta'],
    relatedIds: ['fing_increase_speed', 'al_practice_metronome']
  },
  {
    id: 'al_memorize',
    question: 'Should I memorize Alankars?',
    category: 'Alankars',
    answer: 'Yes, memorizing patterns lets your mind focus entirely on tone quality, finger lightness, and breath steadiness.',
    keywords: ['memorize alankars', 'by heart', 'remember patterns'],
    relatedIds: ['al_why_practice', 'al_improve_movement']
  },
  {
    id: 'al_advanced',
    question: 'What are advanced Alankars?',
    category: 'Alankars',
    answer: 'Advanced Alankars involve complex leaps (`S G R M G P`), octave jumps, Komal note variations, and speed changes (Dugun & Chaugun).',
    keywords: ['advanced alankars', 'complex patterns', 'dugun', 'chaugun'],
    relatedIds: ['al_increase_speed', 'th_laya']
  },
  {
    id: 'al_improve_movement',
    question: 'How do Alankars improve finger movement?',
    category: 'Alankars',
    answer: 'They train your brain and finger tendons to execute rapid directional transitions without hesitation or misplacements.',
    keywords: ['finger movement', 'coordination', 'tendon agility'],
    relatedIds: ['fing_coordination_exercises', 'al_why_practice']
  },

  // ==========================================
  // 🎼 7. RAAGAS
  // ==========================================
  {
    id: 'rg_what_is',
    question: 'What is a Raag?',
    category: 'Raagas',
    answer: 'A **Raag (Raga)** is a melodic framework in Indian classical music with specific rules (Aaroh, Avaroh, Pakad) designed to evoke a distinct emotion (Rasa).',
    keywords: ['what is a raag', 'raga', 'melodic framework', 'classical music'],
    relatedIds: ['rg_beginner_first', 'rg_yaman']
  },
  {
    id: 'rg_beginner_first',
    question: 'Which Raag should beginners learn first?',
    category: 'Raagas',
    answer: '• **Raag Bhupali:** 5 notes (S R G P D S\'), very melodious and easy to grasp.\n• **Raag Yaman:** Uses Teevra Ma, foundational classical raag.',
    keywords: ['first raag', 'beginner raag', 'bhupali', 'yaman', 'easiest raga'],
    relatedIds: ['rg_bhupali', 'rg_yaman']
  },
  {
    id: 'rg_yaman',
    question: 'What is Raag Yaman?',
    category: 'Raagas',
    answer: 'Raag Yaman is an evening Raag belonging to Kalyan Thaat. It uses Teevra Ma (sharp Ma) and all other Shuddha notes: `N\' R G M\' D N S\'`.',
    keywords: ['raag yaman', 'yaman', 'kalyan', 'teevra ma raag'],
    relatedIds: ['rg_beginner_first', 'rg_bhupali']
  },
  {
    id: 'rg_bhupali',
    question: 'What is Raag Bhupali?',
    category: 'Raagas',
    answer: 'Raag Bhupali (Bhoop) is a pentatonic evening Raag using 5 notes: Sa, Re, Ga, Pa, Dha (omitting Ma and Ni). Extremely peaceful and joyful!',
    keywords: ['raag bhupali', 'bhoop', 'pentatonic', '5 notes raag'],
    relatedIds: ['rg_beginner_first', 'faq_peaceful_raag']
  },
  {
    id: 'rg_durga',
    question: 'What is Raag Durga?',
    category: 'Raagas',
    answer: 'Raag Durga is a morning pentatonic Raag using Sa, Re, Ma, Pa, Dha (omitting Ga and Ni). Bright, energetic, and majestic!',
    keywords: ['durga', 'raag durga', 'morning raag'],
    relatedIds: ['rg_bhupali', 'rg_beginner_first']
  },
  {
    id: 'rg_aaroh',
    question: 'What is Aaroh?',
    category: 'Raagas',
    answer: '**Aaroh (Aroh)** is the ascending sequence of notes in a Raag from lower to higher pitch.',
    keywords: ['aaroh', 'aroh', 'ascending', 'notes progression'],
    relatedIds: ['rg_avaroh', 'rg_pakad']
  },
  {
    id: 'rg_avaroh',
    question: 'What is Avaroh?',
    category: 'Raagas',
    answer: '**Avaroh (Avroh)** is the descending sequence of notes in a Raag from higher to lower pitch.',
    keywords: ['avaroh', 'avroh', 'descending', 'notes down'],
    relatedIds: ['rg_aaroh', 'rg_pakad']
  },
  {
    id: 'rg_pakad',
    question: 'What is Pakad?',
    category: 'Raagas',
    answer: '**Pakad** is the key signature phrase or musical motif that instantly identifies a specific Raag.',
    keywords: ['pakad', 'catch phrase', 'signature phrase', 'identity'],
    relatedIds: ['rg_what_is', 'rg_vadi']
  },
  {
    id: 'rg_vadi',
    question: 'What is Vadi?',
    category: 'Raagas',
    answer: '**Vadi** is the primary, most dominant note ("King note") emphasized most frequently in a Raag.',
    keywords: ['vadi', 'king note', 'dominant note'],
    relatedIds: ['rg_samvadi', 'rg_pakad']
  },
  {
    id: 'rg_samvadi',
    question: 'What is Samvadi?',
    category: 'Raagas',
    answer: '**Samvadi** is the second most important note ("Queen note") supporting the Vadi in a Raag.',
    keywords: ['samvadi', 'queen note', 'second note'],
    relatedIds: ['rg_vadi', 'rg_pakad']
  },
  {
    id: 'rg_songs_without_raagas',
    question: 'Can I play songs without learning Raagas?',
    category: 'Raagas',
    answer: 'Yes! You can play hundreds of popular Bollywood, folk, and devotional songs just by knowing basic note fingerings.',
    keywords: ['songs without raagas', 'play songs', 'bollywood', 'no classical'],
    relatedIds: ['sng_easiest_beginners', 'sng_bollywood']
  },
  {
    id: 'rg_how_many_learn',
    question: 'How many Raagas should I learn?',
    category: 'Raagas',
    answer: 'Mastering **3 to 5 core Raagas** (like Yaman, Bhupali, Bairagi, and Kafi) thoroughly is plenty to build deep classical mastery.',
    keywords: ['how many raagas', 'number of ragas'],
    relatedIds: ['rg_beginner_first', 'rg_yaman']
  },

  // ==========================================
  // 🎹 8. TECHNIQUES
  // ==========================================
  {
    id: 'tech_meend',
    question: 'What is Meend?',
    category: 'Techniques',
    answer: '**Meend** is a continuous, smooth glide from one note to another without breaking sound or air stream—the soul of Bansuri music!',
    keywords: ['meend', 'glide', 'slur', 'smooth transition', 'slide'],
    relatedIds: ['tech_practice_meend', 'tech_gamak']
  },
  {
    id: 'tech_practice_meend',
    question: 'How do I practice Meend?',
    category: 'Techniques',
    answer: 'Slowly roll or slide your finger off a hole rather than lifting it vertically. Practice gliding slowly between Pa and Ga.',
    keywords: ['practice meend', 'how to meend', 'finger slide'],
    relatedIds: ['tech_meend', 'tech_play_smoothly']
  },
  {
    id: 'tech_gamak',
    question: 'What is Gamak?',
    category: 'Techniques',
    answer: '**Gamak** is a rapid, heavy oscillation or pulse of a note created using swift air pulses from the diaphragm.',
    keywords: ['gamak', 'oscillation', 'air pulse', 'heavy vibration'],
    relatedIds: ['tech_meend', 'tech_khatka']
  },
  {
    id: 'tech_murki',
    question: 'What is Murki?',
    category: 'Techniques',
    answer: '**Murki** is a swift 3-note trill or grace embellishment used extensively in light classical and romantic melodies.',
    keywords: ['murki', 'trill', 'grace note', 'fast ornament'],
    relatedIds: ['tech_khatka', 'tech_kan_swar']
  },
  {
    id: 'tech_khatka',
    question: 'What is Khatka?',
    category: 'Techniques',
    answer: '**Khatka** is a sudden, crisp flick of the fingers touching neighboring notes before returning to the main target note.',
    keywords: ['khatka', 'flick', 'grace note', 'crisp touch'],
    relatedIds: ['tech_murki', 'tech_kan_swar']
  },
  {
    id: 'tech_kan_swar',
    question: 'What is Kan Swar?',
    category: 'Techniques',
    answer: '**Kan Swar** (Grace Note) is a subtle touch of a secondary note just before sounding the main note.',
    keywords: ['kan swar', 'grace note', 'touch note'],
    relatedIds: ['tech_khatka', 'tech_murki']
  },
  {
    id: 'tech_grace_notes',
    question: 'What are grace notes?',
    category: 'Techniques',
    answer: 'Grace notes are quick extra notes (Kan Swaras) played around a main melody note to make it sound emotional and expressive.',
    keywords: ['grace notes', 'ornamentation', 'kan swara'],
    relatedIds: ['tech_kan_swar', 'tech_improve_expression']
  },
  {
    id: 'tech_improve_expression',
    question: 'How do I improve expression?',
    category: 'Techniques',
    answer: 'Incorporate subtle Meend glides, gentle breath dynamics (crescendo/decrescendo), and soft grace notes instead of flat robotic note changes.',
    keywords: ['expression', 'feel', 'emotion', 'soulful', 'dynamics'],
    relatedIds: ['tech_meend', 'tech_grace_notes']
  },
  {
    id: 'tech_vibrato',
    question: 'What is vibrato on Bansuri?',
    category: 'Techniques',
    answer: 'Vibrato is a gentle, natural wavering of pitch produced by soft diaphragmatic breath pulses or subtle hand vibrations.',
    keywords: ['vibrato', 'pitch wavering', 'breath pulse'],
    relatedIds: ['tech_gamak', 'bl_clear_tone']
  },
  {
    id: 'tech_play_smoothly',
    question: 'How do I play smoothly?',
    category: 'Techniques',
    answer: 'Keep your breath continuous while moving fingers softly. Never interrupt air flow between legato notes unless tonguing.',
    keywords: ['play smoothly', 'legato', 'smooth notes', 'flow'],
    relatedIds: ['tech_meend', 'bl_clear_tone']
  },

  // ==========================================
  // 🎵 9. PRACTICE
  // ==========================================
  {
    id: 'prac_daily_routine',
    question: 'What is the best daily practice routine?',
    category: 'Practice',
    answer: '30-Minute Routine:\n1. **10 Mins:** Swar Sadhana (Long Sa blowing into tuner).\n2. **10 Mins:** Alankar drills with Metronome.\n3. **10 Mins:** Song / Raga practice.',
    keywords: ['daily routine', 'practice routine', 'schedule', 'plan'],
    relatedIds: ['beg_hours_daily', 'prac_warm_up']
  },
  {
    id: 'prac_morning_evening',
    question: 'Morning or evening practice?',
    category: 'Practice',
    answer: 'Early morning (Brahma Muhurta) is ideal for quiet focus and Swar Sadhana, but any time you can practice consistently works great!',
    keywords: ['morning', 'evening', 'best time to practice', 'time of day'],
    relatedIds: ['prac_daily_routine', 'prac_avoid_fatigue']
  },
  {
    id: 'prac_warm_up',
    question: 'Should I warm up before playing?',
    category: 'Practice',
    answer: 'Yes! Always start with 3 to 5 deep breaths and 5 minutes of long blowing on lower notes (Sa and Pa) to warm up your lips and flute.',
    keywords: ['warm up', 'stretching', 'before playing', 'pre-practice'],
    relatedIds: ['prac_daily_routine', 'bl_play_long_notes']
  },
  {
    id: 'prac_how_long_beginners',
    question: 'How long should beginners practice?',
    category: 'Practice',
    answer: '20 to 30 minutes daily is perfect. Short daily sessions build muscle memory better than 2 hours once a week.',
    keywords: ['how long practice', 'duration', 'beginner time'],
    relatedIds: ['beg_hours_daily', 'prac_daily_routine']
  },
  {
    id: 'prac_avoid_fatigue',
    question: 'How can I avoid fatigue?',
    category: 'Practice',
    answer: 'Take 2-minute breaks every 15 minutes. Relax your neck, drop your shoulders, and shake out tension from your hands.',
    keywords: ['fatigue', 'tired', 'strained', 'avoid fatigue', 'breaks'],
    relatedIds: ['fing_fingers_hurting', 'prob_lips_tired']
  },
  {
    id: 'prac_breathing_exercises',
    question: 'What exercises improve breathing?',
    category: 'Practice',
    answer: 'Practice **Anulom Vilom** (alternate nostril breathing) and long note holds into the tuner to double breath capacity within weeks.',
    keywords: ['breathing exercises', 'pranayama', 'lung capacity', 'deep breath'],
    relatedIds: ['bl_breath_control', 'bl_play_long_notes']
  },
  {
    id: 'prac_practice_slowly',
    question: 'Should I practice slowly?',
    category: 'Practice',
    answer: 'Yes! "Slow is smooth, smooth is fast." Practicing slowly builds perfect neural muscle memory.',
    keywords: ['practice slowly', 'slow practice', 'slow tempo'],
    relatedIds: ['al_practice_metronome', 'fing_increase_speed']
  },
  {
    id: 'prac_track_progress',
    question: 'How do I track my progress?',
    category: 'Practice',
    answer: 'Record a 30-second audio clip every Sunday on your phone or in the FluteSangam app. Compare week 1 with week 4 to hear amazing growth!',
    keywords: ['track progress', 'recording', 'monitor improvement'],
    relatedIds: ['beg_know_improving', 'comm_share_recordings']
  },
  {
    id: 'prac_tanpura',
    question: 'How do I practice with a Tanpura?',
    category: 'Practice',
    answer: 'Set your Tanpura app drone to your flute scale (e.g., C or G). Match your Sa pitch perfectly with the drone sound until beats disappear.',
    keywords: ['tanpura', 'drone', 'practice with tanpura', 'pitch tuning'],
    relatedIds: ['tune_check_tuned', 'bl_clear_tone']
  },
  {
    id: 'prac_tabla',
    question: 'How do I practice with Tabla?',
    category: 'Practice',
    answer: 'Start practicing Alankars with a slow 16-beat **Teental** or 8-beat **Keharwa** electronic tabla loop to develop rhythmic pulse.',
    keywords: ['tabla', 'rhythm', 'teental', 'keharwa', 'taal loop'],
    relatedIds: ['th_taal', 'al_practice_metronome']
  },

  // ==========================================
  // 🎼 10. SONGS
  // ==========================================
  {
    id: 'sng_easiest_beginners',
    question: 'Which songs are easiest for beginners?',
    category: 'Songs',
    answer: '• **Devotional:** Achyutam Keshvam, Gayatri Mantra, Raghupati Raghav\n• **Folk/Simple:** Twinkle Twinkle, Happy Birthday, Vande Mataram.',
    keywords: ['easiest songs', 'beginner songs', 'simple songs', 'achyutam keshvam'],
    relatedIds: ['sng_bollywood', 'sng_devotional']
  },
  {
    id: 'sng_learn_by_ear',
    question: 'How do I learn songs by ear?',
    category: 'Songs',
    answer: '1. Hum the melody line.\n2. Find the starting note on your flute.\n3. Trial-and-error note by note along the scale.',
    keywords: ['learn by ear', 'by ear', 'playing by ear', 'transcribe'],
    relatedIds: ['sng_easiest_beginners', 'sng_memorize']
  },
  {
    id: 'sng_bollywood',
    question: 'Can I play Bollywood songs?',
    category: 'Songs',
    answer: 'Yes! Romantic songs like *Kesariya*, *Tum Hi Ho*, and classic tunes like *Yeh Shaam Mastani* sound magical on Bansuri.',
    keywords: ['bollywood songs', 'hindi songs', 'movie songs', 'tum hi ho'],
    relatedIds: ['faq_bollywood_beginners', 'sng_easiest_beginners']
  },
  {
    id: 'sng_devotional',
    question: 'Can I play devotional songs?',
    category: 'Songs',
    answer: 'Devotional tunes (Bhajans, Kirtans, Krishna Dhun) are perfectly suited for Bansuri as they use soothing, simple note patterns.',
    keywords: ['devotional', 'bhajan', 'kirtan', 'krishna dhun', 'spiritual'],
    relatedIds: ['sng_easiest_beginners', 'sng_memorize']
  },
  {
    id: 'sng_memorize',
    question: 'How do I memorize songs?',
    category: 'Songs',
    answer: 'Learn the song in 2-line sections (Sthayi and Antara). Repeat each section 5 times until memorized before moving forward.',
    keywords: ['memorize songs', 'remember melodies', 'by heart'],
    relatedIds: ['sng_learn_by_ear', 'prac_daily_routine']
  },
  {
    id: 'sng_everyday',
    question: 'Should I practice songs every day?',
    category: 'Songs',
    answer: 'Spend 60% of time on core technique (long notes & Alankars) and 40% on songs for maximum skill growth.',
    keywords: ['practice songs everyday', 'balance', 'technique vs songs'],
    relatedIds: ['prac_daily_routine', 'sng_easiest_beginners']
  },

  // ==========================================
  // 🎵 11. MAINTENANCE
  // ==========================================
  {
    id: 'maint_clean',
    question: 'How do I clean my flute?',
    category: 'Maintenance',
    answer: 'Wipe inner moisture after playing using a soft cotton cloth wrapped on a wooden stick. Wipe outer bamboo with a micro-fiber cloth.',
    keywords: ['clean flute', 'cleaning', 'moisture', 'cotton cloth'],
    relatedIds: ['maint_wash', 'maint_store']
  },
  {
    id: 'maint_wash',
    question: 'Can I wash my bamboo flute?',
    category: 'Maintenance',
    answer: 'NO! Never wash bamboo flutes with water—water will swell fibers and split the bamboo. PVC flutes, however, CAN be washed safely.',
    keywords: ['wash flute', 'water', 'wet bamboo', 'pvc wash'],
    relatedIds: ['ch_bamboo_vs_pvc', 'maint_cracking']
  },
  {
    id: 'maint_cracking',
    question: 'Why is my flute cracking?',
    category: 'Maintenance',
    answer: 'Bamboo cracks due to extreme temperature shifts, dry winter air, or direct heat. Keep away from AC vents and heaters!',
    keywords: ['cracking', 'crack', 'bamboo split', 'dry air'],
    relatedIds: ['maint_store', 'maint_oil']
  },
  {
    id: 'maint_store',
    question: 'How should I store my flute?',
    category: 'Maintenance',
    answer: 'Store your flute inside a padded velvet/hard carrying case or fabric sleeve in a dry, temperate room.',
    keywords: ['store flute', 'flute case', 'bag', 'storage'],
    relatedIds: ['maint_clean', 'maint_cracking']
  },
  {
    id: 'maint_sunlight',
    question: 'Can I leave my flute in sunlight?',
    category: 'Maintenance',
    answer: 'No! Direct sunlight cooks the bamboo fibers, causing sudden internal stress and cracking.',
    keywords: ['sunlight', 'sun', 'heat', 'car dashboard'],
    relatedIds: ['maint_cracking', 'maint_store']
  },
  {
    id: 'maint_oil',
    question: 'How often should I oil my flute?',
    category: 'Maintenance',
    answer: 'Apply a few drops of mustard oil or sweet almond oil on an inner swab once every 3 to 6 months to protect bamboo fibers.',
    keywords: ['oil flute', 'oiling frequency', 'mustard oil', 'almond oil'],
    relatedIds: ['maint_clean', 'maint_cracking']
  },
  {
    id: 'maint_lifespan',
    question: 'How long does a bamboo flute last?',
    category: 'Maintenance',
    answer: 'A seasoned Assam bamboo flute stored and cared for properly can last 20 to 50+ years easily!',
    keywords: ['how long last', 'lifespan', 'durable', 'durability'],
    relatedIds: ['maint_store', 'maint_oil']
  },

  // ==========================================
  // 🎯 12. TUNING
  // ==========================================
  {
    id: 'tune_what_is',
    question: 'What is flute tuning?',
    category: 'Tuning',
    answer: 'Flute tuning ensures each hole produces precise audio frequencies matching standard musical pitch (e.g. A=440Hz).',
    keywords: ['what is tuning', 'pitch accuracy', 'frequency'],
    relatedIds: ['tune_check_tuned', 'tune_a440']
  },
  {
    id: 'tune_check_tuned',
    question: 'How do I check if my flute is tuned?',
    category: 'Tuning',
    answer: 'Blow Sa into the **FluteSangam Tuner app**. The needle indicator will point green in the center when perfectly in tune.',
    keywords: ['check tuned', 'tuner app', 'is tuned', 'green needle'],
    relatedIds: ['tune_what_is', 'tune_out_of_tune']
  },
  {
    id: 'tune_out_of_tune',
    question: 'Why does my flute sound out of tune?',
    category: 'Tuning',
    answer: 'Blowing angle or air pressure fluctuations can temporarily shift pitch flat or sharp. Adjust your lip angle subtly to center pitch.',
    keywords: ['out of tune', 'sounding flat', 'sounding sharp', 'wavering pitch'],
    relatedIds: ['tune_check_tuned', 'tune_temperature']
  },
  {
    id: 'tune_concert_pitch',
    question: 'What is concert pitch?',
    category: 'Tuning',
    answer: 'Concert pitch is the universal reference frequency (A440) used worldwide to ensure flutes align with keyboards, guitars, and tanpuras.',
    keywords: ['concert pitch', 'reference frequency', 'a440'],
    relatedIds: ['tune_a440', 'tune_what_is']
  },
  {
    id: 'tune_a440',
    question: 'What is A440?',
    category: 'Tuning',
    answer: 'A440 means the musical note A above middle C vibrates at exactly 440 Hertz—the standard tuning benchmark for concert instruments.',
    keywords: ['a440', '440 hz', 'standard pitch'],
    relatedIds: ['tune_concert_pitch', 'tune_check_tuned']
  },
  {
    id: 'tune_temperature',
    question: 'Can temperature affect tuning?',
    category: 'Tuning',
    answer: 'Yes! Cold air makes the flute pitch flat, while warm air makes it sharp. Blow warm breath through your flute for 2 minutes before tuning.',
    keywords: ['temperature tuning', 'weather tuning', 'cold flat', 'warm sharp'],
    relatedIds: ['tune_out_of_tune', 'maint_cracking']
  },

  // ==========================================
  // 🎼 13. MUSIC THEORY
  // ==========================================
  {
    id: 'th_shruti',
    question: 'What is Shruti?',
    category: 'Music Theory',
    answer: '**Shruti** refers to microtonal pitch intervals (22 Shrutis in an octave) that give Indian classical music its rich emotional depth.',
    keywords: ['shruti', 'microtones', '22 shrutis', 'pitch intervals'],
    relatedIds: ['th_seven_notes', 'th_saptak']
  },
  {
    id: 'th_saptak',
    question: 'What is Saptak?',
    category: 'Music Theory',
    answer: '**Saptak** is an octave set of 7 natural notes (Sa Re Ga Ma Pa Dha Ni). Three main Saptaks exist: Mandra, Madhya, and Taar.',
    keywords: ['saptak', 'octave', 'three octaves'],
    relatedIds: ['ns_middle_octave', 'th_seven_notes']
  },
  {
    id: 'th_seven_notes',
    question: 'What are the seven notes?',
    category: 'Music Theory',
    answer: 'Sa (Shadja), Re (Rishabh), Ga (Gandhar), Ma (Madhyam), Pa (Pancham), Dha (Dhaivat), Ni (Nishad).',
    keywords: ['seven notes', 'sa re ga ma', 'swaras names'],
    relatedIds: ['th_saptak', 'th_komal_tivra']
  },
  {
    id: 'th_komal_tivra',
    question: 'What are Komal and Tivra notes?',
    category: 'Music Theory',
    answer: '• **Komal (Flat):** Re, Ga, Dha, Ni lowered by half-step.\n• **Tivra (Sharp):** Ma raised by half-step.\nTotal = 12 notes per octave.',
    keywords: ['komal', 'tivra', 'flat notes', 'sharp notes', '12 swaras'],
    relatedIds: ['ns_play_12_notes', 'th_seven_notes']
  },
  {
    id: 'th_laya',
    question: 'What is Laya?',
    category: 'Music Theory',
    answer: '**Laya** is the speed/tempo of rhythm: Vilambit (Slow), Madhya (Medium), and Drut (Fast).',
    keywords: ['laya', 'tempo', 'vilambit', 'madhya', 'drut'],
    relatedIds: ['th_tempo', 'th_taal']
  },
  {
    id: 'th_taal',
    question: 'What is Taal?',
    category: 'Music Theory',
    answer: '**Taal** is a repeating rhythmic cycle composed of beats (Matras), such as Teental (16 beats) or Dadra (6 beats).',
    keywords: ['taal', 'rhythm cycle', 'matra', 'teental', 'dadra'],
    relatedIds: ['th_beat', 'th_rhythm']
  },
  {
    id: 'th_rhythm',
    question: 'What is Rhythm?',
    category: 'Music Theory',
    answer: 'Rhythm is the systematic arrangement of musical sounds and silences in time.',
    keywords: ['rhythm', 'rhythmic pulse', 'timing'],
    relatedIds: ['th_taal', 'th_tempo']
  },
  {
    id: 'th_tempo',
    question: 'What is Tempo?',
    category: 'Music Theory',
    answer: 'Tempo measures speed of beat in Beats Per Minute (BPM).',
    keywords: ['tempo', 'bpm', 'speed'],
    relatedIds: ['th_laya', 'al_practice_metronome']
  },
  {
    id: 'th_beat',
    question: 'What is Beat?',
    category: 'Music Theory',
    answer: 'A Beat (Matra) is the basic unit of time measurement in music.',
    keywords: ['beat', 'matra', 'unit of time'],
    relatedIds: ['th_taal', 'th_tempo']
  },

  // ==========================================
  // 🎤 14. PERFORMANCE
  // ==========================================
  {
    id: 'perf_stage_fear',
    question: 'How do I overcome stage fear?',
    category: 'Performance',
    answer: '1. Perform small 1-minute clips for friends or family first.\n2. Take 3 deep diaphragmatic breaths before stepping on stage.\n3. Focus on listening to the Tanpura drone rather than looking at crowd faces.',
    keywords: ['stage fear', 'nervous', 'anxiety', 'performing'],
    relatedIds: ['perf_first_prep', 'perf_mistakes_stage']
  },
  {
    id: 'perf_first_prep',
    question: 'How do I prepare for my first performance?',
    category: 'Performance',
    answer: 'Select 1 short piece you have practiced 50+ times cleanly. Check flute tuning with a tuner 5 minutes before going on stage.',
    keywords: ['first performance', 'prepare concert', 'recital'],
    relatedIds: ['perf_stage_fear', 'perf_memorize']
  },
  {
    id: 'perf_mistakes_stage',
    question: 'What if I make mistakes while performing?',
    category: 'Performance',
    answer: 'Never stop or frown! Keep breathing calmly and continue smoothly on the next beat. Most audience members won\'t even notice!',
    keywords: ['mistakes on stage', 'wrong note concert', 'keep going'],
    relatedIds: ['perf_stage_fear', 'perf_first_prep']
  },
  {
    id: 'perf_memorize',
    question: 'Should I memorize everything?',
    category: 'Performance',
    answer: 'Memorizing allows your eyes to stay relaxed and your expression to shine naturally without staring at paper sheets.',
    keywords: ['memorize everything', 'sheet music', 'performance memory'],
    relatedIds: ['sng_memorize', 'perf_first_prep']
  },
  {
    id: 'perf_pro_prep',
    question: 'How do professionals practice before concerts?',
    category: 'Performance',
    answer: 'Pros warm up with 20 minutes of slow Swar Sadhana into a Tanpura, followed by slow Meend exercises to calibrate fingers to stage acoustics.',
    keywords: ['professionals practice', 'concert prep', 'pro warm up'],
    relatedIds: ['prac_warm_up', 'tech_meend']
  },

  // ==========================================
  // ❓ 15. COMMON PROBLEMS
  // ==========================================
  {
    id: 'prob_high_notes',
    question: 'Why can\'t I play high notes?',
    category: 'Common Problems',
    answer: 'High notes need **faster air speed** and slightly tighter lip aperture, NOT louder blowing pressure.',
    keywords: ['cant play high notes', 'taar saptak issue', 'squeaking high'],
    relatedIds: ['bl_higher_octave_weak', 'ns_shift_octaves']
  },
  {
    id: 'prob_fingers_slip',
    question: 'Why do my fingers slip?',
    category: 'Common Problems',
    answer: 'Sweat or slick bamboo can cause slipping. Wipe your bamboo and fingertips dry with a cloth before practice.',
    keywords: ['fingers slip', 'slippery flute', 'sweaty hands'],
    relatedIds: ['fing_cover_holes', 'maint_clean']
  },
  {
    id: 'prob_out_of_breath',
    question: 'Why am I running out of breath?',
    category: 'Common Problems',
    answer: 'You may be blowing too hard or using shallow chest breathing. Breathe deep into your belly and refine lip focus.',
    keywords: ['running out of breath', 'breathless', 'stamina problem'],
    relatedIds: ['bl_breath_control', 'prac_breathing_exercises']
  },
  {
    id: 'prob_lips_tired',
    question: 'Why do my lips get tired?',
    category: 'Common Problems',
    answer: 'Lip fatigue happens when pressing lips tightly against the embouchure hole. Keep facial muscles relaxed.',
    keywords: ['lips tired', 'embouchure fatigue', 'sore lips'],
    relatedIds: ['bl_lip_position', 'prac_avoid_fatigue']
  },
  {
    id: 'prob_flute_squeak',
    question: 'Why does my flute squeak?',
    category: 'Common Problems',
    answer: 'Squeaks occur when a finger hole is partially open by accident, causing sudden harmonic jumping.',
    keywords: ['squeak', 'squeaking', 'harsh sound', 'accidental high note'],
    relatedIds: ['fing_cover_holes', 'fing_avoid_leaks']
  },
  {
    id: 'prob_weak_notes',
    question: 'Why do some notes sound weak?',
    category: 'Common Problems',
    answer: 'Check if that specific hole has a minor leak or if your air stream shifts angle when moving to lower holes.',
    keywords: ['weak notes', 'soft note', 'uneven volume'],
    relatedIds: ['fing_avoid_leaks', 'bl_clear_tone']
  },
  {
    id: 'prob_lose_tuning',
    question: 'Why do I lose tuning while playing?',
    category: 'Common Problems',
    answer: 'As your breath warms the cold bamboo, pitch rises slightly sharp. Adjust lip angle outwards or inwards to compensate.',
    keywords: ['lose tuning', 'pitch drift', 'flute warming up'],
    relatedIds: ['tune_temperature', 'tune_out_of_tune']
  },
  {
    id: 'prob_consistency',
    question: 'How do I improve consistency?',
    category: 'Common Problems',
    answer: 'Practicing daily at the same time for 20 minutes builds strong neural muscle memory.',
    keywords: ['consistency', 'inconsistent sound', 'steady progress'],
    relatedIds: ['prac_daily_routine', 'beg_stay_motivated']
  },

  // ==========================================
  // 🌐 16. COMMUNITY
  // ==========================================
  {
    id: 'comm_share_recordings',
    question: 'How do I share my recordings?',
    category: 'Community',
    answer: 'Tap **Community / FluteSangam Feed** in the app menu, click "Create Post", upload your audio/video clip, and get feedback!',
    keywords: ['share recordings', 'upload clip', 'community post', 'audio clip'],
    relatedIds: ['comm_ask_questions', 'comm_feedback']
  },
  {
    id: 'comm_ask_questions',
    question: 'Can I ask questions in the community?',
    category: 'Community',
    answer: 'Yes! Post any question about flute scales, notations, or troubleshooting in the **Notation Requests & Q&A** tab.',
    keywords: ['ask questions', 'forum', 'help community', 'notation requests'],
    relatedIds: ['comm_share_recordings', 'comm_partners']
  },
  {
    id: 'comm_feedback',
    question: 'How do I give feedback to other learners?',
    category: 'Community',
    answer: 'Listen to fellow flutists\' clips in the feed and drop encouraging comments or constructive tips on tone and fingerings.',
    keywords: ['give feedback', 'comments', 'encourage', 'peer review'],
    relatedIds: ['comm_share_recordings', 'comm_ask_questions']
  },
  {
    id: 'comm_partners',
    question: 'How do I find practice partners?',
    category: 'Community',
    answer: 'Connect with members playing the same flute scale in the FluteSangam Community chat to exchange practice clips daily!',
    keywords: ['practice partners', 'study buddy', 'flute friends', 'collaborate'],
    relatedIds: ['comm_share_recordings', 'comm_challenges']
  },
  {
    id: 'comm_challenges',
    question: 'How do I participate in challenges?',
    category: 'Community',
    answer: 'Check the Community tab for monthly **Alankar & Raga Challenges**, record your submission, and earn badges on your profile!',
    keywords: ['challenges', 'monthly contest', 'badges', 'alankar challenge'],
    relatedIds: ['comm_share_recordings', 'beg_stay_motivated']
  },

  // ==========================================
  // 💡 17. GENERAL FAQ / SPECIALS
  // ==========================================
  {
    id: 'faq_famous_masters_time',
    question: 'How long did it take famous flute players to master the Bansuri?',
    category: 'General FAQ',
    answer: 'Legendary masters like Pt. Hariprasad Chaurasia and Pt. Pannalal Ghosh practiced 8–12 hours daily for 10+ years under Gurus. However, playing soulfully for personal enjoyment takes only a few months of 20-minute daily practice!',
    keywords: ['famous players', 'hariprasad chaurasia', 'masters', 'time to master'],
    relatedIds: ['beg_how_long', 'beg_hours_daily']
  },
  {
    id: 'faq_bollywood_beginners',
    question: 'Which Bollywood songs are great for beginners?',
    category: 'General FAQ',
    answer: '1. *Achyutam Keshvam* (Super easy)\n2. *Zara Zara* (Soft romantic)\n3. *Pee Loon* (Soulful)\n4. *Pehla Nasha* (Melodic)\n5. *Tere Mere Milan Ki Yeh Raina* (Classic).',
    keywords: ['bollywood songs beginners', 'great songs', 'romantic flute songs'],
    relatedIds: ['sng_bollywood', 'sng_easiest_beginners']
  },
  {
    id: 'faq_top10_mistakes',
    question: 'What are the top 10 mistakes every beginner makes?',
    category: 'General FAQ',
    answer: '1. Blowing too hard\n2. Using fingertips instead of pads\n3. Skipping Swar Sadhana\n4. Practicing without Tanpura\n5. Pressing holes with stiff force\n6. Lifting fingers too high\n7. Ignoring posture\n8. Buying un-tuned cheap flutes\n9. Rushing speed before accuracy\n10. Giving up after 3 days!',
    keywords: ['top 10 mistakes', 'beginner mistakes', 'avoid errors'],
    relatedIds: ['beg_mistakes_beginners_make', 'bl_sound_airy']
  },
  {
    id: 'faq_without_singing',
    question: 'Can I learn Bansuri if I don\'t know singing?',
    category: 'General FAQ',
    answer: 'Yes absolutely! While vocal training helps relative ear pitch, playing Bansuri directly trains your musical ear naturally through finger memory.',
    keywords: ['without singing', 'cant sing', 'vocal skills', 'no singing background'],
    relatedIds: ['beg_difficult_to_learn', 'beg_music_theory_needed']
  },
  {
    id: 'faq_peaceful_raag',
    question: 'Which Raag sounds peaceful?',
    category: 'General FAQ',
    answer: '• **Raag Bhupali:** Soothing, meditative, and calm.\n• **Raag Yaman:** Serene evening peace.\n• **Raag Bairagi:** Deeply meditative morning Raag.',
    keywords: ['peaceful raag', 'calm raga', 'meditation music', 'relaxing raag'],
    relatedIds: ['rg_bhupali', 'rg_yaman']
  },
  {
    id: 'faq_small_hands',
    question: 'Which flute should I buy if I have small hands?',
    category: 'General FAQ',
    answer: 'Buy a **C Natural Medium, D Natural Medium, or E Natural Medium** flute. Their hole spacing is compact and comfortable for small hands.',
    keywords: ['small hands', 'short fingers', 'compact flute'],
    relatedIds: ['ch_flute_size', 'ch_children_adult_flutes']
  },
  {
    id: 'faq_western_songs',
    question: 'Can I play Western songs on an Indian Bansuri?',
    category: 'General FAQ',
    answer: 'Yes! Songs like *Titanic theme*, *Ed Sheeran - Perfect*, *Hallelujah*, and *Let It Go* sound hauntingly beautiful on Bansuri using half-hole techniques.',
    keywords: ['western songs', 'pop songs', 'titanic', 'perfect', 'hallelujah'],
    relatedIds: ['sng_easiest_beginners', 'ns_play_12_notes']
  },
  {
    id: 'faq_how_many_flutes_pros',
    question: 'How many flutes do professional players usually own?',
    category: 'General FAQ',
    answer: 'Professionals usually carry a set of 12 to 24 flutes covering all major chromatic scales (C, C#, D, D#, E, F, F#, G, G#, A, A#, B in Bass and Medium) to match any singer or band key!',
    keywords: ['how many flutes', 'professional set', 'flute set', '24 flutes'],
    relatedIds: ['ch_which_scale', 'tune_concert_pitch']
  },
  {
    id: 'faq_daily_habit',
    question: 'How do I build a consistent daily practice habit?',
    category: 'General FAQ',
    answer: 'Attach flute practice to an existing daily anchor routine—for example, right after morning tea or right after returning from work. Keep your flute on a stand so it\'s visible!',
    keywords: ['daily habit', 'consistency', 'routine building', 'anchor habit'],
    relatedIds: ['beg_stay_motivated', 'prac_daily_routine']
  },
  {
    id: 'faq_after_basic_notes',
    question: 'What should I learn after mastering the basic notes?',
    category: 'General FAQ',
    answer: '1. Practice 10 core Alankars in speed.\n2. Learn **Meend** (smooth glides).\n3. Learn your first pentatonic Raag (**Raag Bhupali**).\n4. Start playing simple songs by ear.',
    keywords: ['after basic notes', 'next steps', 'learning path', 'what after sargam'],
    relatedIds: ['beg_what_to_learn_first', 'tech_meend', 'rg_bhupali']
  }
];

// Search logic function
export function searchChatbotQA(userQuery: string): {
  match: ChatbotQA | null;
  score: number;
  relatedQuestions: ChatbotQA[];
} {
  const cleanInput = userQuery.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  if (!cleanInput) {
    return { match: null, score: 0, relatedQuestions: getRandomQuestions(3) };
  }

  const stopWords = new Set([
    'is', 'a', 'an', 'the', 'in', 'on', 'at', 'it', 'to', 'for', 'of', 'and', 'or', 'my', 'me', 'i', 
    'you', 'your', 'what', 'which', 'how', 'why', 'can', 'should', 'do', 'does', 'did', 'are', 'was', 'were'
  ]);

  const queryTokens = cleanInput
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.has(word));

  let bestMatch: ChatbotQA | null = null;
  let highestScore = 0;

  CHATBOT_QA_DATABASE.forEach(item => {
    let score = 0;
    const cleanQuestion = item.question.toLowerCase().replace(/[^\w\s]/g, ' ');

    // 1. Exact string match
    if (cleanQuestion.trim() === cleanInput) {
      score += 150;
    }

    // 2. Full phrase substring match
    if (cleanQuestion.includes(cleanInput) || cleanInput.includes(cleanQuestion)) {
      score += 60;
    }

    // 3. Keyword array matches
    item.keywords.forEach(keyword => {
      const cleanKeyword = keyword.toLowerCase();
      if (cleanInput.includes(cleanKeyword)) {
        score += 25;
      }
    });

    // 4. Word-by-word matches in question
    queryTokens.forEach(token => {
      if (cleanQuestion.includes(token)) {
        score += 12;
      }
      if (item.keywords.some(k => k.toLowerCase().includes(token))) {
        score += 15;
      }
      if (item.answer.toLowerCase().includes(token)) {
        score += 3;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  });

  // Threshold for acceptable match
  if (highestScore < 15) {
    return {
      match: null,
      score: highestScore,
      relatedQuestions: getRandomQuestions(3)
    };
  }

  // Find 2 to 3 related questions
  let related: ChatbotQA[] = [];
  if (bestMatch && (bestMatch as ChatbotQA).relatedIds && (bestMatch as ChatbotQA).relatedIds.length > 0) {
    related = (bestMatch as ChatbotQA).relatedIds
      .map(id => CHATBOT_QA_DATABASE.find(q => q.id === id))
      .filter((q): q is ChatbotQA => q !== undefined);
  }

  // Fill up if fewer than 2
  if (related.length < 2 && bestMatch) {
    const currentCat = (bestMatch as ChatbotQA).category;
    const sameCat = CHATBOT_QA_DATABASE.filter(
      q => q.category === currentCat && q.id !== (bestMatch as ChatbotQA).id && !related.some(r => r.id === q.id)
    );
    related = [...related, ...sameCat].slice(0, 3);
  }

  if (related.length < 2) {
    const extra = CHATBOT_QA_DATABASE.filter(q => q.id !== (bestMatch as ChatbotQA)?.id && !related.some(r => r.id === q.id));
    related = [...related, ...extra].slice(0, 3);
  }

  return {
    match: bestMatch,
    score: highestScore,
    relatedQuestions: related.slice(0, 3)
  };
}

export function getRandomQuestions(count: number = 3): ChatbotQA[] {
  const popularIds = ['ch_best_for_beginners', 'bl_sound_airy', 'beg_hours_daily', 'al_what_is', 'ch_bamboo_vs_pvc'];
  const popular = popularIds
    .map(id => CHATBOT_QA_DATABASE.find(q => q.id === id))
    .filter((q): q is ChatbotQA => q !== undefined);
  return popular.slice(0, count);
}
