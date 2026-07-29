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
  },

  // ==========================================
  // 🎼 INDIAN CLASSICAL MUSIC BASICS
  // ==========================================
  {
    id: 'icm_hindustani_music',
    question: 'What is Hindustani Classical Music?',
    category: 'Music Theory',
    answer: '**Hindustani Classical Music** is the traditional art music system of North India, Pakistan, and Bangladesh. It centers on improvised Raag expansion, microtonal ornamentations (Meend, Gamak), and rhythmic cycles (Taal).',
    keywords: ['hindustani', 'north indian classical', 'hindustani classical music'],
    relatedIds: ['icm_carnatic_music', 'icm_hindustani_vs_carnatic', 'rg_what_is']
  },
  {
    id: 'icm_carnatic_music',
    question: 'What is Carnatic Music?',
    category: 'Music Theory',
    answer: '**Carnatic Music** is the classical music tradition of South India (Tamil Nadu, Kerala, Andhra Pradesh, Karnataka). It is strongly centered on structured compositions (Kritis), intricate rhythmic math, and devotional themes.',
    keywords: ['carnatic', 'south indian music', 'kritis', 'carnatic music'],
    relatedIds: ['icm_hindustani_music', 'icm_hindustani_vs_carnatic']
  },
  {
    id: 'icm_hindustani_vs_carnatic',
    question: 'What is the difference between Hindustani and Carnatic music?',
    category: 'Music Theory',
    answer: '• **Hindustani:** Focuses heavily on slow improvised Raag exploration (Alap, Meend) with Persian/Arabian historical influences.\n• **Carnatic:** Emphasizes structured compositions, precise Gamakas, and complex rhythmic calculations.',
    keywords: ['difference hindustani carnatic', 'carnatic vs hindustani', 'compare classical'],
    relatedIds: ['icm_hindustani_music', 'icm_carnatic_music']
  },
  {
    id: 'icm_indian_classical',
    question: 'What is Indian Classical Music?',
    category: 'Music Theory',
    answer: 'Indian Classical Music is a rich 3,000-year-old tradition built upon two fundamental pillars: **Raag** (melodic framework and emotion) and **Taal** (rhythmic cycle and time binding).',
    keywords: ['indian classical music', 'what is classical', 'sangeet'],
    relatedIds: ['icm_pillars_classical', 'rg_what_is', 'th_taal']
  },
  {
    id: 'icm_why_learn_classical',
    question: 'Why should a flute player learn classical music?',
    category: 'Music Theory',
    answer: 'Classical training develops flawless breath control, microtonal pitch accuracy (Shruti), smooth finger glides (Meend), and deep ear training, enabling you to play any musical genre effortlessly.',
    keywords: ['why learn classical', 'benefits of classical', 'classical flute'],
    relatedIds: ['icm_indian_classical', 'tech_meend', 'icm_importance_riyaz']
  },
  {
    id: 'icm_bollywood_without_classical',
    question: 'Can I play Bollywood songs without learning classical music?',
    category: 'General FAQ',
    answer: 'Yes! You can play popular Bollywood melodies by learning basic fingerings and scales. However, classical concepts like Meend and Kan Swaras will make your Bollywood playing sound much more soulful and expressively rich.',
    keywords: ['bollywood without classical', 'play hindi songs without theory', 'no classical needed'],
    relatedIds: ['sng_bollywood', 'rg_songs_without_raagas']
  },
  {
    id: 'icm_is_classical_difficult',
    question: 'Is classical music difficult to learn?',
    category: 'Music Theory',
    answer: 'Not if taken step-by-step! Beginning with simple Swaras, basic Alankars, and light pentatonic Raagas (like Raag Bhupali) makes classical music approachable, highly rewarding, and enjoyable.',
    keywords: ['is classical difficult', 'hard to learn classical', 'classical toughness'],
    relatedIds: ['beg_difficult_to_learn', 'icm_how_long_classical']
  },
  {
    id: 'icm_how_long_classical',
    question: 'How long does it take to learn classical music?',
    category: 'Music Theory',
    answer: 'Producing clean notes takes 1–3 months, playing basic Raagas takes 6–12 months, and developing deep spontaneous improvisation is a rewarding lifelong journey.',
    keywords: ['how long to learn classical', 'classical timeline', 'years to master'],
    relatedIds: ['beg_how_long', 'icm_is_classical_difficult']
  },
  {
    id: 'icm_pillars_classical',
    question: 'What are the pillars of Indian Classical Music?',
    category: 'Music Theory',
    answer: 'The two core pillars are **Raag** (the melodic framework and emotional mood) and **Taal** (the rhythmic cycle and time framework).',
    keywords: ['pillars of classical music', 'raag and taal', 'fundamentals'],
    relatedIds: ['rg_what_is', 'th_taal']
  },
  {
    id: 'icm_importance_riyaz',
    question: 'What is the importance of Riyaz?',
    category: 'Practice',
    answer: '**Riyaz** (disciplined practice) builds muscle memory, refines tone purity, stabilizes breath control, and aligns your pitch with the Tanpura drone.',
    keywords: ['importance of riyaz', 'why riyaz', 'practice importance'],
    relatedIds: ['prac_daily_routine', 'riyaz_what_is']
  },

  // ==========================================
  // 🎵 SWAR (NOTES)
  // ==========================================
  {
    id: 'sw_shuddha_swaras',
    question: 'What are Shuddha Swaras?',
    category: 'Notes & Scales',
    answer: '**Shuddha Swaras** are the 7 natural, un-altered notes of an octave: Sa, Re, Ga, Ma, Pa, Dha, Ni (equivalent to the Western natural major scale).',
    keywords: ['shuddha swaras', 'natural notes', '7 swaras'],
    relatedIds: ['th_seven_notes', 'sw_komal_swaras']
  },
  {
    id: 'sw_komal_swaras',
    question: 'What are Komal Swaras?',
    category: 'Notes & Scales',
    answer: '**Komal Swaras** are flat notes lowered by a semitone (half-step). In Indian music, Re, Ga, Dha, and Ni can become Komal (written as r, g, d, n).',
    keywords: ['komal swaras', 'flat notes', 'soft notes'],
    relatedIds: ['th_komal_tivra', 'sw_tivra_ma']
  },
  {
    id: 'sw_tivra_ma',
    question: 'What is Tivra Ma?',
    category: 'Notes & Scales',
    answer: '**Tivra Ma** is the sharp Madhyam note raised by a semitone (half-step) above Shuddha Ma (denoted as M\' or M#).',
    keywords: ['tivra ma', 'sharp ma', 'm\' swar'],
    relatedIds: ['sw_komal_swaras', 'th_komal_tivra']
  },
  {
    id: 'sw_always_shuddha',
    question: 'Which notes are always Shuddha?',
    category: 'Notes & Scales',
    answer: '**Sa** (Shadja) and **Pa** (Pancham) are **Achala Swaras** (immovable notes)—they never become Komal or Tivra and remain fixed anchor pitches.',
    keywords: ['always shuddha', 'achala swaras', 'fixed notes', 'sa and pa'],
    relatedIds: ['sw_can_become_komal', 'th_seven_notes']
  },
  {
    id: 'sw_can_become_komal',
    question: 'Which notes can become Komal?',
    category: 'Notes & Scales',
    answer: '**Re, Ga, Dha, and Ni** are **Chala Swaras** that can be lowered by a half-step to become Komal (flat).',
    keywords: ['which notes komal', 'chala swaras', 're ga dha ni'],
    relatedIds: ['sw_always_shuddha', 'sw_komal_swaras']
  },
  {
    id: 'sw_why_ma_tivra',
    question: 'Why is Ma called Tivra?',
    category: 'Notes & Scales',
    answer: 'Unlike Re, Ga, Dha, and Ni which shift downwards (Komal), Madhyam (Ma) is the only note that shifts upwards in pitch, hence termed **Tivra** (sharp/intense).',
    keywords: ['why ma tivra', 'sharp madhyam', 'tivra reason'],
    relatedIds: ['sw_tivra_ma', 'th_komal_tivra']
  },
  {
    id: 'sw_how_many_notes_icm',
    question: 'How many notes are there in Indian Classical Music?',
    category: 'Notes & Scales',
    answer: 'There are **12 swaras** in an octave: 7 Shuddha + 4 Komal (Re, Ga, Dha, Ni) + 1 Tivra (Ma).',
    keywords: ['how many notes', '12 swaras in icm', 'total notes'],
    relatedIds: ['ns_play_12_notes', 'th_komal_tivra']
  },
  {
    id: 'sw_swara_vs_note',
    question: 'What is the difference between swara and note?',
    category: 'Notes & Scales',
    answer: 'A Western \'note\' is a static fixed frequency, whereas an Indian **Swara** is a living, expressive pitch containing microtonal nuances (Shruti), grace touches, and emotional resonance.',
    keywords: ['difference swara note', 'swara vs note', 'swara definition'],
    relatedIds: ['th_shruti', 'sw_shuddha_swaras']
  },

  // ==========================================
  // 🎶 SAPTAK (OCTAVES)
  // ==========================================
  {
    id: 'sap_upper_difficult',
    question: 'Why is the upper octave difficult?',
    category: 'Notes & Scales',
    answer: 'The upper octave (**Taar Saptak**) requires faster air velocity, a tighter lip aperture, and precise diaphragm support without straining or blowing forcefully.',
    keywords: ['why upper octave hard', 'taar saptak difficult', 'high notes hard'],
    relatedIds: ['ns_upper_octave', 'sap_upper_control', 'prob_high_notes']
  },
  {
    id: 'sap_upper_control',
    question: 'How can I improve upper octave control?',
    category: 'Notes & Scales',
    answer: 'Focus your breath into a thin, high-velocity stream, tighten your embouchure hole slightly, and practice long note holds on Taar Sa into a tuner app daily.',
    keywords: ['upper octave control', 'taar saptak practice', 'high note stability'],
    relatedIds: ['sap_upper_difficult', 'ns_upper_octave']
  },

  // ==========================================
  // 🎼 RAAG BASICS
  // ==========================================
  {
    id: 'rgb_why_important',
    question: 'Why are Raagas important?',
    category: 'Raagas',
    answer: 'Raagas are the heart of Indian classical music. They provide structured melodic blueprints that evoke specific human emotions, seasons, and times of day.',
    keywords: ['why raagas important', 'importance of raga', 'raga significance'],
    relatedIds: ['rg_what_is', 'rgb_what_makes_unique']
  },
  {
    id: 'rgb_how_created',
    question: 'How is a Raag created?',
    category: 'Raagas',
    answer: 'A Raag is constructed by selecting at least 5 notes from a parent Thaat, defining ascending/descending rules (Aaroh/Avaroh), dominant notes (Vadi/Samvadi), and key signature phrases (Pakad).',
    keywords: ['how raag created', 'raga structure', 'making a raag'],
    relatedIds: ['th_what_is_thaat', 'rg_aaroh', 'rg_pakad']
  },
  {
    id: 'rgb_how_many_raagas',
    question: 'How many Raagas are there?',
    category: 'Raagas',
    answer: 'There are hundreds of traditional Raagas recorded in classical treatises, with infinite possibilities for ancient and modern derivative Raagas.',
    keywords: ['how many raagas', 'total ragas', 'number of raagas'],
    relatedIds: ['rg_how_many_learn', 'rgb_how_created']
  },
  {
    id: 'rgb_what_makes_unique',
    question: 'What makes a Raag unique?',
    category: 'Raagas',
    answer: 'A Raag\'s uniqueness comes from its specific note combinations, Vadi/Samvadi emphasis, characteristic ornamentation, time theory, and distinctive emotional mood (Rasa).',
    keywords: ['what makes raag unique', 'identity of raag', 'raga mood'],
    relatedIds: ['rg_pakad', 'rg_vadi', 'rasa_what_is']
  },
  {
    id: 'rgb_same_notes',
    question: 'Can two Raagas have the same notes?',
    category: 'Raagas',
    answer: 'Yes! For example, **Raag Bhupali** and **Raag Deshkar** use the exact same notes (S R G P D), but emphasize different notes (Vadi/Samvadi) and distinct time/phrase rules.',
    keywords: ['two raagas same notes', 'different raagas same swaras', 'bhupali vs deshkar'],
    relatedIds: ['rg_bhupali', 'rg_vadi']
  },
  {
    id: 'rgb_grammar',
    question: 'What is the grammar of a Raag?',
    category: 'Raagas',
    answer: 'The grammar consists of its Thaat (parent scale), Jati (note count), Aaroh/Avaroh (ascent/descent), Vadi/Samvadi (dominant notes), Pakad (signature phrase), and Samay (time of performance).',
    keywords: ['grammar of raag', 'raga rules', 'raag grammar'],
    relatedIds: ['rg_aaroh', 'rg_pakad', 'rg_vadi']
  },
  {
    id: 'rgb_janak_raag',
    question: 'What is a Janak Raag?',
    category: 'Raagas',
    answer: 'A **Janak Raag** (Parent Raag) contains all 7 notes in direct order and defines one of the 10 fundamental parent Thaats (e.g. Kalyan, Bilawal).',
    keywords: ['janak raag', 'parent raag', 'primary raga'],
    relatedIds: ['rgb_janya_raag', 'th_what_is_thaat']
  },
  {
    id: 'rgb_janya_raag',
    question: 'What is a Janya Raag?',
    category: 'Raagas',
    answer: 'A **Janya Raag** (Derived Raag) is born out of a parent Thaat by omitting notes, reordering progressions, or introducing specific ornamentation.',
    keywords: ['janya raag', 'derived raag', 'child raga'],
    relatedIds: ['rgb_janak_raag', 'th_what_is_thaat']
  },
  {
    id: 'rgb_raag_vs_scale',
    question: 'What is the difference between a Raag and a scale?',
    category: 'Raagas',
    answer: 'A scale is merely a static list of pitches. A **Raag** is a dynamic living framework with specific ascending/descending rules, dominant notes, emotional intent, and signature phrasing.',
    keywords: ['difference raag scale', 'raga vs scale', 'raga scale comparison'],
    relatedIds: ['rg_what_is', 'rgb_grammar']
  },

  // ==========================================
  // 🎵 AAROH & AVAROH
  // ==========================================
  {
    id: 'aa_why_different',
    question: 'Why are Aaroh and Avaroh different?',
    category: 'Raagas',
    answer: 'In many Raagas, ascending (Aaroh) and descending (Avaroh) use different note counts or pathways (e.g., skipping notes ascending, or using a zig-zag Vakra path descending) to give the Raag its unique character.',
    keywords: ['why aaroh avaroh different', 'ascent descent rules'],
    relatedIds: ['rg_aaroh', 'rg_avaroh']
  },
  {
    id: 'aa_how_to_memorize',
    question: 'How do I memorize Aaroh and Avaroh?',
    category: 'Raagas',
    answer: 'Sing or play the ascent and descent slowly with a Tanpura drone, repeating 10 times daily while focusing on the note relationships.',
    keywords: ['memorize aaroh avaroh', 'learn aroh avroh'],
    relatedIds: ['rg_aaroh', 'rg_avaroh']
  },
  {
    id: 'aa_can_skip_notes',
    question: 'Can Aaroh skip notes?',
    category: 'Raagas',
    answer: 'Yes! Many Raagas omit specific notes in ascent (e.g., Raag Yaman skips Sa and Pa in Aaroh: `N\' R G M\' D N S\'`).',
    keywords: ['can aaroh skip notes', 'omitting notes ascent'],
    relatedIds: ['rg_aaroh', 'aa_why_omit_notes']
  },
  {
    id: 'aa_why_omit_notes',
    question: 'Why do some Raagas omit notes?',
    category: 'Raagas',
    answer: 'Omitting notes (Varjit Swaras) creates unique gaps and melodic tension that define the Raag\'s distinctive mood and personality.',
    keywords: ['why omit notes', 'varjit swar', 'missing notes raag'],
    relatedIds: ['aa_can_skip_notes', 'jati_audav']
  },

  // ==========================================
  // 🎼 PAKAD
  // ==========================================
  {
    id: 'pak_why_important',
    question: 'Why is Pakad important?',
    category: 'Raagas',
    answer: 'Pakad is the \'catch phrase\' or signature musical key motif that allows listeners and musicians to instantly identify a Raag within seconds.',
    keywords: ['why pakad important', 'pakad significance', 'catch phrase raag'],
    relatedIds: ['rg_pakad', 'pak_identify_raag']
  },
  {
    id: 'pak_how_to_practice',
    question: 'How do I practice Pakad?',
    category: 'Raagas',
    answer: 'Practice the Pakad phrase repeatedly with deep expression, smooth Meend glides, and accurate Kan Swaras until it flows naturally.',
    keywords: ['how to practice pakad', 'pakad drills'],
    relatedIds: ['rg_pakad', 'tech_meend']
  },
  {
    id: 'pak_identify_raag',
    question: 'How do I identify a Raag using Pakad?',
    category: 'Raagas',
    answer: 'Listen for the characteristic note sequence—for example, `G P D P G` immediately identifies Raag Bhupali!',
    keywords: ['identify raag pakad', 'recognize raga'],
    relatedIds: ['rg_pakad', 'pak_why_important']
  },
  {
    id: 'pak_is_compulsory',
    question: 'Is Pakad compulsory?',
    category: 'Raagas',
    answer: 'Yes, playing the Pakad phrase is essential during Alap and Bandish to establish the unmistakable identity of the Raag.',
    keywords: ['is pakad compulsory', 'must play pakad'],
    relatedIds: ['rg_pakad', 'alap_what_is']
  },

  // ==========================================
  // 🎵 VADI & SAMVADI
  // ==========================================
  {
    id: 'vs_why_important',
    question: 'Why are Vadi and Samvadi important?',
    category: 'Raagas',
    answer: 'Vadi (primary note) and Samvadi (secondary note) dictate where the melody rests and resolves, shaping the Raag\'s structural hierarchy.',
    keywords: ['why vadi samvadi important', 'king queen note importance'],
    relatedIds: ['rg_vadi', 'rg_samvadi']
  },
  {
    id: 'vs_how_define_raag',
    question: 'How do Vadi and Samvadi define a Raag?',
    category: 'Raagas',
    answer: 'By resting frequently on the Vadi and Samvadi notes, a flutist emphasizes the Raag\'s emotional center and distinguishes it from other Raagas with identical notes.',
    keywords: ['how vadi samvadi define raag', 'rest notes raag'],
    relatedIds: ['rg_vadi', 'rg_samvadi', 'rgb_same_notes']
  },
  {
    id: 'vs_identify_vadi',
    question: 'How do I identify the Vadi note?',
    category: 'Raagas',
    answer: 'The Vadi note is the most frequently landed upon, sustained, and re-visited pitch throughout the performance.',
    keywords: ['identify vadi note', 'find king note'],
    relatedIds: ['rg_vadi', 'vs_why_important']
  },

  // ==========================================
  // 🎶 JATI
  // ==========================================
  {
    id: 'jati_what_is',
    question: 'What is Jati?',
    category: 'Raagas',
    answer: '**Jati** is the classification of a Raag based on the number of notes used in its Aaroh (ascent) and Avaroh (descent).',
    keywords: ['what is jati', 'jati classification', 'note count raag'],
    relatedIds: ['jati_audav', 'jati_shadav', 'jati_sampurna']
  },
  {
    id: 'jati_audav',
    question: 'What is Audav Jati?',
    category: 'Raagas',
    answer: '**Audav Jati** refers to a pentatonic structure using **5 notes** (e.g., Raag Bhupali).',
    keywords: ['audav jati', '5 notes raag', 'pentatonic raga'],
    relatedIds: ['jati_what_is', 'rg_bhupali']
  },
  {
    id: 'jati_shadav',
    question: 'What is Shadav Jati?',
    category: 'Raagas',
    answer: '**Shadav Jati** refers to a hexatonic structure using **6 notes** (e.g., Raag Puriya Dhanashree).',
    keywords: ['shadav jati', '6 notes raag', 'hexatonic raga'],
    relatedIds: ['jati_what_is', 'jati_audav']
  },
  {
    id: 'jati_sampurna',
    question: 'What is Sampurna Jati?',
    category: 'Raagas',
    answer: '**Sampurna Jati** refers to a heptatonic structure using all **7 notes** (e.g., Raag Yaman, Raag Bilawal).',
    keywords: ['sampurna jati', '7 notes raag', 'heptatonic raga'],
    relatedIds: ['jati_what_is', 'rg_yaman']
  },
  {
    id: 'jati_effect_raag',
    question: 'How does Jati affect a Raag?',
    category: 'Raagas',
    answer: 'Jati determines note density and melodic leaps, giving Audav (5-note) Raagas a spacious feel and Sampurna (7-note) Raagas a dense, flowing texture.',
    keywords: ['how jati affects raag', 'note density'],
    relatedIds: ['jati_what_is', 'jati_audav']
  },

  // ==========================================
  // 🎼 THAAT
  // ==========================================
  {
    id: 'th_what_is_thaat',
    question: 'What is a Thaat?',
    category: 'Music Theory',
    answer: 'A **Thaat** is a parent scale system in Hindustani music used to categorize Raagas based on their constituent 7 notes.',
    keywords: ['what is a thaat', 'parent scale', 'thaat system'],
    relatedIds: ['th_how_many_thaats', 'th_who_created_system']
  },
  {
    id: 'th_how_many_thaats',
    question: 'How many Thaats are there?',
    category: 'Music Theory',
    answer: 'There are **10 fundamental Thaats** in Hindustani Classical Music: Bilawal, Kalyan, Khamaj, Bhairav, Bhairavi, Asavari, Todi, Marwa, Poorvi, and Kafi.',
    keywords: ['how many thaats', '10 thaats', 'list of thaats'],
    relatedIds: ['th_what_is_thaat', 'th_who_created_system']
  },
  {
    id: 'th_who_created_system',
    question: 'Who created the Thaat system?',
    category: 'Music Theory',
    answer: 'The 10 Thaat classification system was codified by the legendary musicologist **Pandit Vishnu Narayan Bhatkhande** in the early 20th century.',
    keywords: ['who created thaat system', 'bhatkhande', 'thaat history'],
    relatedIds: ['th_what_is_thaat', 'th_how_many_thaats']
  },
  {
    id: 'th_bilawal',
    question: 'What is Bilawal Thaat?',
    category: 'Music Theory',
    answer: '**Bilawal Thaat** consists of all 7 natural (Shuddha) notes: `S R G M P D N S\'` (equivalent to the Western Major scale).',
    keywords: ['bilawal thaat', 'shuddha thaat', 'major scale thaat'],
    relatedIds: ['th_what_is_thaat', 'th_kalyan']
  },
  {
    id: 'th_kalyan',
    question: 'What is Kalyan Thaat?',
    category: 'Music Theory',
    answer: '**Kalyan Thaat** uses Tivra Ma (sharp Ma) along with all other Shuddha notes: `S R G M\' P D N S\'`.',
    keywords: ['kalyan thaat', 'tivra ma thaat'],
    relatedIds: ['rg_yaman', 'th_what_is_thaat']
  },
  {
    id: 'th_khamaj',
    question: 'What is Khamaj Thaat?',
    category: 'Music Theory',
    answer: '**Khamaj Thaat** uses Komal Ni (flat Ni) with all other notes Shuddha: `S R G M P D n S\'`.',
    keywords: ['khamaj thaat', 'komal ni thaat'],
    relatedIds: ['th_what_is_thaat', 'rg_khamaj_overview']
  },
  {
    id: 'th_bhairav',
    question: 'What is Bhairav Thaat?',
    category: 'Music Theory',
    answer: '**Bhairav Thaat** uses Komal Re and Komal Dha: `S r G M P d N S\'`.',
    keywords: ['bhairav thaat', 'komal re dha thaat'],
    relatedIds: ['th_what_is_thaat', 'rg_bhairav_overview']
  },
  {
    id: 'th_bhairavi',
    question: 'What is Bhairavi Thaat?',
    category: 'Music Theory',
    answer: '**Bhairavi Thaat** uses all 4 Komal notes (Re, Ga, Dha, Ni): `S r g M P d n S\'`.',
    keywords: ['bhairavi thaat', 'all komal thaat'],
    relatedIds: ['th_what_is_thaat', 'th_bhairav']
  },
  {
    id: 'th_asavari',
    question: 'What is Asavari Thaat?',
    category: 'Music Theory',
    answer: '**Asavari Thaat** uses Komal Ga, Komal Dha, and Komal Ni: `S R g M P d n S\'`.',
    keywords: ['asavari thaat', 'g d n komal thaat'],
    relatedIds: ['th_what_is_thaat', 'th_kafi']
  },
  {
    id: 'th_todi',
    question: 'What is Todi Thaat?',
    category: 'Music Theory',
    answer: '**Todi Thaat** uses Komal Re, Komal Ga, Tivra Ma, and Komal Dha: `S r g M\' P d N S\'`.',
    keywords: ['todi thaat', 'komal re ga dha tivra ma'],
    relatedIds: ['th_what_is_thaat', 'th_marwa']
  },
  {
    id: 'th_marwa',
    question: 'What is Marwa Thaat?',
    category: 'Music Theory',
    answer: '**Marwa Thaat** uses Komal Re and Tivra Ma: `S r G M\' P D N S\'`.',
    keywords: ['marwa thaat', 'komal re tivra ma'],
    relatedIds: ['th_what_is_thaat', 'th_poorvi']
  },
  {
    id: 'th_poorvi',
    question: 'What is Poorvi Thaat?',
    category: 'Music Theory',
    answer: '**Poorvi Thaat** uses Komal Re, Tivra Ma, and Komal Dha: `S r G M\' P d N S\'`.',
    keywords: ['poorvi thaat', 'komal re dha tivra ma'],
    relatedIds: ['th_what_is_thaat', 'th_marwa']
  },
  {
    id: 'th_kafi',
    question: 'What is Kafi Thaat?',
    category: 'Music Theory',
    answer: '**Kafi Thaat** uses Komal Ga and Komal Ni: `S R g M P D n S\'`.',
    keywords: ['kafi thaat', 'komal ga ni thaat'],
    relatedIds: ['th_what_is_thaat', 'rg_kafi_overview']
  },
  {
    id: 'th_which_raagas_belong',
    question: 'Which Raagas belong to each Thaat?',
    category: 'Music Theory',
    answer: '• **Bilawal:** Deshkar, Alhaiya Bilawal\n• **Kalyan:** Yaman, Bhupali, Shuddha Kalyan\n• **Khamaj:** Desh, Tilak Kamod\n• **Bhairav:** Ahir Bhairav, Ramkali\n• **Kafi:** Bageshree, Bhimpalasi.',
    keywords: ['which raagas belong to thaat', 'thaat classification of ragas'],
    relatedIds: ['th_what_is_thaat', 'th_how_many_thaats']
  },

  // ==========================================
  // 🎵 TIME THEORY
  // ==========================================
  {
    id: 'tt_why_specific_times',
    question: 'Why are Raagas played at specific times?',
    category: 'Music Theory',
    answer: 'Time Theory (**Samay Chakra**) aligns specific Raagas with natural circadian rhythms and psychological moods during morning, afternoon, evening, and night.',
    keywords: ['why raagas specific times', 'samay chakra', 'raga time theory'],
    relatedIds: ['tt_morning_raagas', 'tt_evening_raagas']
  },
  {
    id: 'tt_morning_raagas',
    question: 'Which Raagas are morning Raagas?',
    category: 'Music Theory',
    answer: 'Morning Raagas include **Raag Bhairav**, **Raag Ahir Bhairav**, **Raag Bairagi**, and **Raag Todi**.',
    keywords: ['morning raagas', 'morning ragas', 'dawn raag'],
    relatedIds: ['tt_evening_raagas', 'rg_bhairav_overview']
  },
  {
    id: 'tt_evening_raagas',
    question: 'Which Raagas are evening Raagas?',
    category: 'Music Theory',
    answer: 'Evening Raagas include **Raag Yaman**, **Raag Bhupali**, **Raag Purvi**, and **Raag Marwa**.',
    keywords: ['evening raagas', 'sunset ragas', 'dusk raag'],
    relatedIds: ['tt_morning_raagas', 'rg_yaman', 'rg_bhupali']
  },
  {
    id: 'tt_night_raagas',
    question: 'Which Raagas are night Raagas?',
    category: 'Music Theory',
    answer: 'Night Raagas include **Raag Malkauns**, **Raag Bageshree**, **Raag Bihag**, and **Raag Darbari**.',
    keywords: ['night raagas', 'late night ragas'],
    relatedIds: ['tt_evening_raagas', 'rg_malkauns_overview']
  },
  {
    id: 'tt_afternoon_raagas',
    question: 'Which Raagas are played in the afternoon?',
    category: 'Music Theory',
    answer: 'Afternoon Raagas include **Raag Bhimpalasi**, **Raag Sarang**, and **Raag Multani**.',
    keywords: ['afternoon raagas', 'midday ragas'],
    relatedIds: ['tt_morning_raagas', 'tt_evening_raagas']
  },
  {
    id: 'tt_timing_matter',
    question: 'Does timing really matter?',
    category: 'Music Theory',
    answer: 'Traditionally yes, as notes resonate with the ambient atmospheric mood! However, for private learning and Riyaz, you can practice any Raag anytime.',
    keywords: ['does timing matter', 'raga timing importance'],
    relatedIds: ['tt_why_specific_times', 'tt_practice_anytime']
  },
  {
    id: 'tt_practice_anytime',
    question: 'Can I practice any Raag anytime?',
    category: 'Music Theory',
    answer: 'Yes! While concert performances honor traditional time windows, personal daily Riyaz can be done whenever you have dedicated quiet time.',
    keywords: ['practice raag anytime', 'raga practice time rule'],
    relatedIds: ['tt_timing_matter', 'prac_daily_routine']
  },

  // ==========================================
  // 🌦️ SEASONAL RAAGAS
  // ==========================================
  {
    id: 'sr_raag_basant',
    question: 'What is Raag Basant?',
    category: 'Raagas',
    answer: '**Raag Basant** is an ancient spring Raag associated with joy, blooming flowers, and festive renewal.',
    keywords: ['raag basant', 'basant', 'spring raag'],
    relatedIds: ['sr_spring_raagas', 'sr_why_seasonal_important']
  },
  {
    id: 'sr_raag_malhar',
    question: 'What is Raag Malhar?',
    category: 'Raagas',
    answer: '**Raag Malhar** is the celebrated monsoon Raag family that evokes thunder, rain, and cool winds.',
    keywords: ['raag malhar', 'malhar', 'monsoon raag', 'rain raag'],
    relatedIds: ['sr_monsoon_raagas', 'sr_why_seasonal_important']
  },
  {
    id: 'sr_monsoon_raagas',
    question: 'Which Raagas are played during the monsoon?',
    category: 'Raagas',
    answer: 'Monsoon Raagas include **Megh Malhar**, **Mian Ki Malhar**, **Sur Malhar**, and **Desh**.',
    keywords: ['monsoon raagas', 'rainy season ragas', 'megh malhar'],
    relatedIds: ['sr_raag_malhar', 'sr_why_seasonal_important']
  },
  {
    id: 'sr_spring_raagas',
    question: 'Which Raagas are associated with spring?',
    category: 'Raagas',
    answer: 'Spring Raagas include **Raag Basant**, **Raag Bahar**, and **Raag Hindol**.',
    keywords: ['spring raagas', 'basant raga', 'springtime ragas'],
    relatedIds: ['sr_raag_basant', 'sr_why_seasonal_important']
  },
  {
    id: 'sr_why_seasonal_important',
    question: 'Why are seasonal Raagas important?',
    category: 'Raagas',
    answer: 'They capture the aesthetic essence and cultural joy of natural weather transitions in traditional Indian culture.',
    keywords: ['why seasonal raagas important', 'seasonal ragas meaning'],
    relatedIds: ['sr_monsoon_raagas', 'sr_spring_raagas']
  },

  // ==========================================
  // 🎶 RASA (EMOTION)
  // ==========================================
  {
    id: 'rasa_what_is',
    question: 'What is Rasa?',
    category: 'Music Theory',
    answer: '**Rasa** is the emotional aesthetic produced in a listener, comprising 9 core moods (Navarasa) such as Shanta (Peace), Bhakti (Devotion), and Shringara (Love).',
    keywords: ['what is rasa', 'navarasa', 'emotional mood'],
    relatedIds: ['rasa_devotion', 'rasa_romantic', 'rasa_meditation']
  },
  {
    id: 'rasa_devotion',
    question: 'Which Raag creates devotion?',
    category: 'Music Theory',
    answer: '**Raag Bhairav**, **Raag Ahir Bhairav**, and **Raag Yaman** evoke profound devotional energy (Bhakti Rasa).',
    keywords: ['raag creates devotion', 'bhakti rasa raag', 'devotional raga'],
    relatedIds: ['rasa_what_is', 'rg_bhairav_overview', 'rg_yaman']
  },
  {
    id: 'rasa_romantic',
    question: 'Which Raag sounds romantic?',
    category: 'Music Theory',
    answer: '**Raag Khamaj**, **Raag Kafi**, **Raag Bageshree**, and **Raag Desh** evoke romantic warmth (Shringara Rasa).',
    keywords: ['romantic raag', 'shringara rasa', 'love raga'],
    relatedIds: ['rasa_what_is', 'rg_khamaj_overview', 'rg_bageshri_overview']
  },
  {
    id: 'rasa_serious',
    question: 'Which Raag sounds serious?',
    category: 'Music Theory',
    answer: '**Raag Malkauns**, **Raag Darbari Kanada**, and **Raag Todi** evoke deep, solemn, and regal gravity.',
    keywords: ['serious raag', 'solemn raga', 'malkauns', 'darbari'],
    relatedIds: ['rasa_what_is', 'rg_malkauns_overview']
  },
  {
    id: 'rasa_joyful',
    question: 'Which Raag sounds joyful?',
    category: 'Music Theory',
    answer: '**Raag Bilawal**, **Raag Bhupali**, and **Raag Hansadhwani** radiate upliftment, cheerfulness, and joy.',
    keywords: ['joyful raag', 'happy raga', 'cheerful raag'],
    relatedIds: ['rasa_what_is', 'rg_bhupali']
  },
  {
    id: 'rasa_meditation',
    question: 'Which Raag is best for meditation?',
    category: 'Music Theory',
    answer: '**Raag Bairagi**, **Raag Bhupali**, and **Raag Shivaranjani** are deeply peaceful and ideal for meditation.',
    keywords: ['best raag meditation', 'meditative raga', 'relaxing raga'],
    relatedIds: ['rasa_what_is', 'faq_peaceful_raag', 'rg_bairagi_overview']
  },

  // ==========================================
  // 🎼 ALAP
  // ==========================================
  {
    id: 'alap_what_is',
    question: 'What is Alap?',
    category: 'Performance',
    answer: '**Alap** is the slow, unmetered, rhythm-free introduction to a Raag, systematically unveiling notes one by one over a Tanpura drone.',
    keywords: ['what is alap', 'alap expansion', 'unmetered intro'],
    relatedIds: ['alap_why_important', 'alap_how_practice', 'jj_diff_alap_jod_jhala']
  },
  {
    id: 'alap_why_important',
    question: 'Why is Alap important?',
    category: 'Performance',
    answer: 'Alap establishes the pure soul, pitch purity, and emotional atmosphere of the Raag before rhythmic cycles begin.',
    keywords: ['why alap important', 'importance of alap'],
    relatedIds: ['alap_what_is', 'alap_how_practice']
  },
  {
    id: 'alap_how_practice',
    question: 'How do I practice Alap?',
    category: 'Performance',
    answer: 'Start from Sa, expand gently down into Mandra Saptak, then ascend note by note holding each Swar with Meend and deep breath.',
    keywords: ['how to practice alap', 'alap step by step'],
    relatedIds: ['alap_what_is', 'tech_meend']
  },
  {
    id: 'alap_how_long',
    question: 'How long should an Alap be?',
    category: 'Performance',
    answer: 'For beginners, a 2 to 5 minute Alap is great; classical maestros may expand Alap for 20 to 45 minutes!',
    keywords: ['how long alap', 'alap duration'],
    relatedIds: ['alap_what_is', 'alap_can_beginners']
  },
  {
    id: 'alap_can_beginners',
    question: 'Can beginners learn Alap?',
    category: 'Performance',
    answer: 'Yes! Practicing simple 3-note Alap phrases is the best way to develop tone control and expressiveness early on.',
    keywords: ['can beginners learn alap', 'beginner alap'],
    relatedIds: ['alap_what_is', 'alap_how_practice']
  },

  // ==========================================
  // 🎵 JOD & JHALA
  // ==========================================
  {
    id: 'jj_jod_what_is',
    question: 'What is Jod?',
    category: 'Performance',
    answer: '**Jod** is the second section of Raag exploration, adding a steady rhythmic pulse without a fixed Tabla beat.',
    keywords: ['what is jod', 'jod section', 'rhythmic pulse'],
    relatedIds: ['jj_jhala_what_is', 'jj_diff_alap_jod_jhala']
  },
  {
    id: 'jj_jhala_what_is',
    question: 'What is Jhala?',
    category: 'Performance',
    answer: '**Jhala** is the fast, climax section featuring rapid rhythmic note repetitions and high energy.',
    keywords: ['what is jhala', 'jhala section', 'fast climax'],
    relatedIds: ['jj_jod_what_is', 'jj_diff_alap_jod_jhala']
  },
  {
    id: 'jj_diff_alap_jod_jhala',
    question: 'What is the difference between Alap, Jod, and Jhala?',
    category: 'Performance',
    answer: '• **Alap:** Slow, unmetered, no rhythm\n• **Jod:** Medium, steady pulse without drums\n• **Jhala:** Fast, energetic rhythmic climax.',
    keywords: ['difference alap jod jhala', 'alap vs jod vs jhala'],
    relatedIds: ['alap_what_is', 'jj_jod_what_is', 'jj_jhala_what_is']
  },
  {
    id: 'jj_when_jhala',
    question: 'When is Jhala performed?',
    category: 'Performance',
    answer: 'Jhala is performed at the peak of Alap expansion or at the conclusion of a fast Bandish (Drut).',
    keywords: ['when jhala performed', 'jhala climax timing'],
    relatedIds: ['jj_jhala_what_is', 'ban_drut']
  },

  // ==========================================
  // 🎶 BANDISH
  // ==========================================
  {
    id: 'ban_what_is',
    question: 'What is Bandish?',
    category: 'Raagas',
    answer: 'A **Bandish** is a fixed melodic composition set in a specific Raag and Taal, consisting of Sthayi (first part) and Antara (second part).',
    keywords: ['what is bandish', 'composition', 'cheez', 'gat'],
    relatedIds: ['ban_vilambit', 'ban_drut', 'ban_why_important']
  },
  {
    id: 'ban_vilambit',
    question: 'What is Vilambit Bandish?',
    category: 'Raagas',
    answer: '**Vilambit Bandish** is a slow-tempo composition that allows detailed, spacious improvisation between beats.',
    keywords: ['vilambit bandish', 'slow bandish', 'bada khayal'],
    relatedIds: ['ban_drut', 'ban_what_is']
  },
  {
    id: 'ban_drut',
    question: 'What is Drut Bandish?',
    category: 'Raagas',
    answer: '**Drut Bandish** is a fast-tempo composition featuring energetic Taans and rapid rhythmic phrasing.',
    keywords: ['drut bandish', 'fast bandish', 'chota khayal'],
    relatedIds: ['ban_vilambit', 'ban_what_is']
  },
  {
    id: 'ban_can_flute',
    question: 'Can flute players play Bandish?',
    category: 'Raagas',
    answer: 'Yes! Flutists adapt vocal compositions into instrumental Gat/Bandish formats with rich ornamentation.',
    keywords: ['flute play bandish', 'instrumental gat'],
    relatedIds: ['ban_what_is', 'ban_why_important']
  },
  {
    id: 'ban_why_important',
    question: 'Why is Bandish important?',
    category: 'Raagas',
    answer: 'It grounds improvisations within a defined rhythmic framework (Taal) and melodic structure.',
    keywords: ['why bandish important', 'importance of composition'],
    relatedIds: ['ban_what_is', 'th_taal']
  },

  // ==========================================
  // 🎼 TAAN
  // ==========================================
  {
    id: 'taan_what_is',
    question: 'What is Taan?',
    category: 'Techniques',
    answer: 'A **Taan** is a rapid passage of notes executed in fast speed (Dugun/Chaugun) during Raag expansion.',
    keywords: ['what is taan', 'fast passage', 'rapid notes'],
    relatedIds: ['taan_types', 'taan_how_practice']
  },
  {
    id: 'taan_types',
    question: 'What are the different types of Taan?',
    category: 'Techniques',
    answer: 'Main types include **Sapat Taan** (straight scale), **Vakra Taan** (zig-zag), and **Bol Taan** (rhythmic patterns).',
    keywords: ['types of taan', 'sapat taan', 'vakra taan'],
    relatedIds: ['taan_what_is', 'taan_sapat', 'taan_vakra']
  },
  {
    id: 'taan_how_practice',
    question: 'How do I practice Taans?',
    category: 'Techniques',
    answer: 'Practice Alankars slowly with a metronome, gradually increasing speed by 5 BPM while maintaining clean finger touches.',
    keywords: ['how to practice taans', 'taan speed practice'],
    relatedIds: ['taan_what_is', 'al_practice_metronome']
  },
  {
    id: 'taan_increase_speed',
    question: 'How do I increase Taan speed?',
    category: 'Techniques',
    answer: 'Speed comes from finger relaxation! Keep fingers close to the flute holes and relax your hand muscles.',
    keywords: ['increase taan speed', 'fast finger speed'],
    relatedIds: ['taan_how_practice', 'fing_increase_speed']
  },
  {
    id: 'taan_sapat',
    question: 'What is Sapat Taan?',
    category: 'Techniques',
    answer: '**Sapat Taan** is a swift, continuous scale passage moving directly up or down without direction changes.',
    keywords: ['sapat taan', 'straight taan'],
    relatedIds: ['taan_types', 'taan_vakra']
  },
  {
    id: 'taan_vakra',
    question: 'What is Vakra Taan?',
    category: 'Techniques',
    answer: '**Vakra Taan** is a complex, twisting passage that skips and changes direction midway.',
    keywords: ['vakra taan', 'zig zag taan'],
    relatedIds: ['taan_types', 'taan_sapat']
  },
  {
    id: 'taan_bol',
    question: 'What is Bol Taan?',
    category: 'Techniques',
    answer: '**Bol Taan** integrates rhythmic syllables or song lyrics into fast melodic runs.',
    keywords: ['bol taan', 'rhythmic taan'],
    relatedIds: ['taan_types', 'taan_what_is']
  },

  // ==========================================
  // 🎵 LAYA
  // ==========================================
  {
    id: 'laya_vilambit',
    question: 'What is Vilambit Laya?',
    category: 'Music Theory',
    answer: '**Vilambit Laya** is a slow, spacious tempo (typically 30–60 BPM).',
    keywords: ['vilambit laya', 'slow tempo', 'slow laya'],
    relatedIds: ['th_laya', 'laya_madhya', 'laya_drut']
  },
  {
    id: 'laya_madhya',
    question: 'What is Madhya Laya?',
    category: 'Music Theory',
    answer: '**Madhya Laya** is a comfortable medium tempo (80–120 BPM).',
    keywords: ['madhya laya', 'medium tempo'],
    relatedIds: ['th_laya', 'laya_vilambit', 'laya_drut']
  },
  {
    id: 'laya_drut',
    question: 'What is Drut Laya?',
    category: 'Music Theory',
    answer: '**Drut Laya** is a fast, energetic tempo (140+ BPM).',
    keywords: ['drut laya', 'fast tempo'],
    relatedIds: ['th_laya', 'laya_vilambit', 'laya_madhya']
  },
  {
    id: 'laya_improve',
    question: 'How do I improve Laya?',
    category: 'Music Theory',
    answer: 'Practice all exercises with a steady Metronome or Tanpura/Tabla drone daily.',
    keywords: ['improve laya', 'rhythm accuracy', 'timing practice'],
    relatedIds: ['th_laya', 'al_practice_metronome']
  },

  // ==========================================
  // 🥁 TAAL
  // ==========================================
  {
    id: 'taal_why_important',
    question: 'Why is Taal important?',
    category: 'Music Theory',
    answer: 'Taal provides the structural time framework that keeps musicians and percussionists synchronized.',
    keywords: ['why taal important', 'importance of rhythm cycle'],
    relatedIds: ['th_taal', 'taal_teentaal']
  },
  {
    id: 'taal_teentaal',
    question: 'What is Teentaal?',
    category: 'Music Theory',
    answer: '**Teentaal** is the most famous 16-beat cycle divided into 4 sections of 4 beats (`4+4+4+4`).',
    keywords: ['teentaal', '16 beats taal', 'tritala'],
    relatedIds: ['th_taal', 'taal_count_teentaal']
  },
  {
    id: 'taal_ektaal',
    question: 'What is Ektaal?',
    category: 'Music Theory',
    answer: '**Ektaal** is a 12-beat rhythmic cycle divided into 6 divisions of 2 beats (`2+2+2+2+2+2`).',
    keywords: ['ektaal', '12 beats taal'],
    relatedIds: ['th_taal', 'taal_jhaptaal']
  },
  {
    id: 'taal_jhaptaal',
    question: 'What is Jhaptaal?',
    category: 'Music Theory',
    answer: '**Jhaptaal** is a 10-beat cycle divided as `2+3+2+3` beats.',
    keywords: ['jhaptaal', '10 beats taal'],
    relatedIds: ['th_taal', 'taal_rupak']
  },
  {
    id: 'taal_rupak',
    question: 'What is Rupak Taal?',
    category: 'Music Theory',
    answer: '**Rupak Taal** is a 7-beat cycle divided as `3+2+2` beats, starting uniquely with a Khali beat.',
    keywords: ['rupak taal', '7 beats taal'],
    relatedIds: ['th_taal', 'taal_khali']
  },
  {
    id: 'taal_dadra',
    question: 'What is Dadra Taal?',
    category: 'Music Theory',
    answer: '**Dadra Taal** is a light 6-beat cycle divided as `3+3` beats, popular in folk and devotional music.',
    keywords: ['dadra taal', '6 beats taal'],
    relatedIds: ['th_taal', 'taal_keharwa']
  },
  {
    id: 'taal_keharwa',
    question: 'What is Keharwa Taal?',
    category: 'Music Theory',
    answer: '**Keharwa Taal** is an 8-beat cycle divided as `4+4` beats, widely used in Bollywood and light music.',
    keywords: ['keharwa taal', '8 beats taal'],
    relatedIds: ['th_taal', 'taal_dadra']
  },
  {
    id: 'taal_count_teentaal',
    question: 'How do I count Teentaal?',
    category: 'Music Theory',
    answer: 'Clap on beat 1 (Sam), clap on beat 5, wave hand on beat 9 (Khali), and clap on beat 13!',
    keywords: ['count teentaal', 'teentaal hand claps'],
    relatedIds: ['taal_teentaal', 'taal_sam']
  },
  {
    id: 'taal_sam',
    question: 'What is Sam?',
    category: 'Music Theory',
    answer: '**Sam** is the first and most emphasized beat of any Taal cycle (denoted by \'X\').',
    keywords: ['what is sam', 'beat 1', 'first beat'],
    relatedIds: ['th_taal', 'taal_khali']
  },
  {
    id: 'taal_khali',
    question: 'What is Khali?',
    category: 'Music Theory',
    answer: '**Khali** is an unaccented, open wave beat in a Taal cycle (denoted by \'0\').',
    keywords: ['what is khali', 'wave beat'],
    relatedIds: ['taal_sam', 'taal_tali']
  },
  {
    id: 'taal_tali',
    question: 'What is Tali?',
    category: 'Music Theory',
    answer: '**Tali** represents accented clap beats in a Taal cycle.',
    keywords: ['what is tali', 'clap beat'],
    relatedIds: ['taal_khali', 'taal_sam']
  },
  {
    id: 'taal_avartan',
    question: 'What is Avartan?',
    category: 'Music Theory',
    answer: 'An **Avartan** is one complete round/cycle of a Taal from beat 1 back to beat 1.',
    keywords: ['avartan', 'taal cycle', 'one round'],
    relatedIds: ['th_taal', 'taal_sam']
  },

  // ==========================================
  // 🎼 ORNAMENTATION
  // ==========================================
  {
    id: 'orn_zamzama',
    question: 'What is Zamzama?',
    category: 'Techniques',
    answer: '**Zamzama** is a rapid series of sharp grace touches creating a shimmering ornament effect.',
    keywords: ['zamzama', 'shimmering ornament'],
    relatedIds: ['tech_murki', 'tech_khatka']
  },
  {
    id: 'orn_andolan',
    question: 'What is Andolan?',
    category: 'Techniques',
    answer: '**Andolan** is a slow, gentle oscillation around a specific note (e.g. Komal Ga in Raag Darbari).',
    keywords: ['andolan', 'slow oscillation'],
    relatedIds: ['tech_vibrato', 'tech_meend']
  },
  {
    id: 'orn_sparsh',
    question: 'What is Sparsh?',
    category: 'Techniques',
    answer: '**Sparsh Swar** is a momentary, feather-light touch of an adjacent note.',
    keywords: ['sparsh', 'touch note', 'touch swar'],
    relatedIds: ['tech_kan_swar', 'tech_grace_notes']
  },
  {
    id: 'orn_krintan',
    question: 'What is Krintan?',
    category: 'Techniques',
    answer: '**Krintan** is a quick finger-pulling technique on Bansuri producing two notes with one breath impulse.',
    keywords: ['krintan', 'pull off', 'finger flick'],
    relatedIds: ['tech_khatka', 'tech_murki']
  },
  {
    id: 'orn_practice_bansuri',
    question: 'How do I practice ornamentation on Bansuri?',
    category: 'Techniques',
    answer: 'Master Meend glides first, then practice soft finger taps (Khatka) slowly before speeding up.',
    keywords: ['practice ornamentation', 'ornamentation drills'],
    relatedIds: ['tech_meend', 'tech_khatka', 'tech_murki']
  },

  // ==========================================
  // 🎵 RIYAZ
  // ==========================================
  {
    id: 'riyaz_what_is',
    question: 'What is Riyaz?',
    category: 'Practice',
    answer: '**Riyaz** is the disciplined daily practice routine aimed at perfecting pitch, tone, and technique.',
    keywords: ['what is riyaz', 'sadhana', 'flute practice'],
    relatedIds: ['icm_importance_riyaz', 'prac_daily_routine']
  },
  {
    id: 'riyaz_why_important',
    question: 'Why is Riyaz important?',
    category: 'Practice',
    answer: 'Regular Riyaz transforms conscious effort into effortless muscle memory and musical intuition.',
    keywords: ['why riyaz important', 'benefits of riyaz'],
    relatedIds: ['riyaz_what_is', 'prac_daily_routine']
  },
  {
    id: 'riyaz_how_start_daily',
    question: 'How should I start daily Riyaz?',
    category: 'Practice',
    answer: 'Begin with 10 minutes of long Sa blowing into a tuner app, followed by Alankar drills.',
    keywords: ['how to start riyaz', 'start daily practice'],
    relatedIds: ['prac_daily_routine', 'prac_warm_up']
  },

  // ==========================================
  // 🎼 GREAT FLUTE MASTERS
  // ==========================================
  {
    id: 'mas_pannalal_ghosh',
    question: 'Who was Pannalal Ghosh?',
    category: 'General FAQ',
    answer: '**Pt. Pannalal Ghosh** (1911–1960) was the pioneer who adapted the small folk bamboo flute into a large bass Bansuri suitable for classical concert stages.',
    keywords: ['pannalal ghosh', 'pioneer of bansuri', 'father of bansuri'],
    relatedIds: ['faq_famous_masters_time', 'mas_hariprasad_chaurasia']
  },
  {
    id: 'mas_hariprasad_chaurasia',
    question: 'Who is Pandit Hariprasad Chaurasia?',
    category: 'General FAQ',
    answer: '**Pt. Hariprasad Chaurasia** is a world-renowned Bansuri maestro celebrated for his breathtaking breath control, tonal beauty, and globalizing Indian classical music.',
    keywords: ['hariprasad chaurasia', 'pandit hariprasad', 'chaurasia'],
    relatedIds: ['mas_hpc_style', 'faq_famous_masters_time']
  },
  {
    id: 'mas_hpc_style',
    question: 'What is Pandit Hariprasad Chaurasia\'s playing style?',
    category: 'General FAQ',
    answer: 'His style is characterized by long effortless breath phrases, rich Mandra Saptak resonance, and flawless speed in Drut Taans.',
    keywords: ['chaurasia style', 'hariprasad technique'],
    relatedIds: ['mas_hariprasad_chaurasia', 'bl_breath_control']
  },
  {
    id: 'mas_beginners_recordings',
    question: 'Which recordings should beginners listen to?',
    category: 'General FAQ',
    answer: 'Listen to Pt. Hariprasad Chaurasia\'s *Raag Yaman*, *Raag Bhupali*, and the iconic album *Call of the Valley*.',
    keywords: ['best flute recordings', 'what to listen', 'recommended tracks'],
    relatedIds: ['mas_hariprasad_chaurasia', 'rg_yaman']
  },
  {
    id: 'mas_learn_from_masters',
    question: 'What can beginners learn from great flute masters?',
    category: 'General FAQ',
    answer: 'Observe their relaxed posture, steady breath management, pitch stability, and deep emotional immersion.',
    keywords: ['learn from masters', 'master observation'],
    relatedIds: ['mas_hariprasad_chaurasia', 'mas_pannalal_ghosh']
  },

  // ==========================================
  // 🎵 INSTRUMENTS
  // ==========================================
  {
    id: 'inst_tanpura',
    question: 'What is Tanpura?',
    category: 'Music Theory',
    answer: 'The **Tanpura** is a stringed drone instrument providing a continuous harmonic reference (Sa-Pa or Sa-Ma).',
    keywords: ['tanpura', 'drone instrument', 'tanpura drone'],
    relatedIds: ['prac_tanpura', 'inst_why_tanpura']
  },
  {
    id: 'inst_why_tanpura',
    question: 'Why is Tanpura important?',
    category: 'Music Theory',
    answer: 'It creates a rich acoustic resonance that trains relative pitch ear perception and stabilizes tuning.',
    keywords: ['why tanpura important', 'tanpura benefits'],
    relatedIds: ['inst_tanpura', 'prac_tanpura']
  },
  {
    id: 'inst_tabla',
    question: 'What is Tabla?',
    category: 'Music Theory',
    answer: 'The **Tabla** is a pair of hand drums (Bayan and Dayan) providing rhythmic accompaniment.',
    keywords: ['tabla', 'drums', 'rhythm instrument'],
    relatedIds: ['prac_tabla', 'th_taal']
  },
  {
    id: 'inst_harmonium',
    question: 'What is Harmonium?',
    category: 'Music Theory',
    answer: 'A reed keyboard instrument providing melodic support and vocal accompaniment.',
    keywords: ['harmonium', 'reed keyboard'],
    relatedIds: ['inst_tanpura', 'inst_tabla']
  },
  {
    id: 'inst_without_tanpura',
    question: 'Can I practice without Tanpura?',
    category: 'Music Theory',
    answer: 'It\'s best to use a Tanpura app drone on your phone so your pitch stays accurate.',
    keywords: ['practice without tanpura', 'no tanpura'],
    relatedIds: ['inst_tanpura_app', 'prac_tanpura']
  },
  {
    id: 'inst_tanpura_app',
    question: 'Which Tanpura app is best?',
    category: 'Music Theory',
    answer: 'Popular apps include iTanpura, Tanpura Droid, and the built-in Tanpura in FluteSangam!',
    keywords: ['best tanpura app', 'tanpura app android ios'],
    relatedIds: ['inst_tanpura', 'prac_tanpura']
  },

  // ==========================================
  // 🎼 PERFORMANCE
  // ==========================================
  {
    id: 'perf_present_raag',
    question: 'How do I present a Raag?',
    category: 'Performance',
    answer: 'Structure your presentation: 1. Alap (slow exploration), 2. Bandish/Gat in Taal, 3. Taans, 4. Jhala climax.',
    keywords: ['how to present a raag', 'raag presentation structure'],
    relatedIds: ['alap_what_is', 'ban_what_is', 'jj_jhala_what_is']
  },
  {
    id: 'perf_structure_alap',
    question: 'How do I structure an Alap?',
    category: 'Performance',
    answer: 'Start in lower octave (Mandra), ascend to middle octave (Madhya), reach Taar Sa, then conclude with Pakad.',
    keywords: ['structure alap', 'alap phases'],
    relatedIds: ['alap_what_is', 'alap_how_practice']
  },
  {
    id: 'perf_play_after_alap',
    question: 'What should I play after Alap?',
    category: 'Performance',
    answer: 'Transition into Jod/Jhala or start the Bandish composition with Tabla accompaniment.',
    keywords: ['what after alap', 'after alap'],
    relatedIds: ['alap_what_is', 'jj_jod_what_is', 'ban_what_is']
  },
  {
    id: 'perf_pro_transitions',
    question: 'How do professionals transition between sections?',
    category: 'Performance',
    answer: 'They use subtle rhythmic cues, Tihais (3-time repeating phrases), and tempo acceleration.',
    keywords: ['pro transitions', 'section transition raag'],
    relatedIds: ['perf_present_raag', 'perf_pro_prep']
  },

  // ==========================================
  // 🎓 EXAMS & LEARNING
  // ==========================================
  {
    id: 'ex_prepare_exams',
    question: 'How do I prepare for music exams?',
    category: 'General FAQ',
    answer: 'Master the syllabus Raagas, Aaroh/Avaroh, Pakad, Bandish notations, and Taal counting.',
    keywords: ['prepare music exams', 'classical music exam'],
    relatedIds: ['ex_gandharva_levels', 'ex_raagas_taught_first']
  },
  {
    id: 'ex_gandharva_levels',
    question: 'What are the levels in Gandharva Mahavidyalaya?',
    category: 'General FAQ',
    answer: 'Levels range from Prarambhik (Beginner), Praveshika, Madhyama, to Visharad (Bachelor equivalent).',
    keywords: ['gandharva mahavidyalaya levels', 'music exam grades'],
    relatedIds: ['ex_prepare_exams', 'ex_raagas_taught_first']
  },
  {
    id: 'ex_raagas_taught_first',
    question: 'Which Raagas are taught first?',
    category: 'General FAQ',
    answer: 'Typically **Raag Bhupali**, **Raag Yaman**, **Raag Khamaj**, and **Raag Kafi**.',
    keywords: ['raagas taught first', 'syllabus ragas'],
    relatedIds: ['rg_beginner_first', 'ex_prepare_exams']
  },
  {
    id: 'ex_memorize_raagas',
    question: 'How do I memorize Raagas?',
    category: 'General FAQ',
    answer: 'Associate each Raag with its Vadi/Samvadi notes, Pakad phrase, and a signature song.',
    keywords: ['memorize raagas', 'remember ragas'],
    relatedIds: ['ex_improve_listening', 'rg_pakad']
  },
  {
    id: 'ex_improve_listening',
    question: 'How can I improve my listening skills?',
    category: 'General FAQ',
    answer: 'Listen to classical audio tracks daily while actively tracking note movements and Taal beats.',
    keywords: ['improve listening skills', 'ear training classical'],
    relatedIds: ['ex_memorize_raagas', 'mas_beginners_recordings']
  },

  // ==========================================
  // 💡 QUICK-ACCESS RAAG QUESTIONS
  // ==========================================
  {
    id: 'rg_yaman_thaat',
    question: 'What is the parent Thaat of Raag Yaman?',
    category: 'Raagas',
    answer: 'Raag Yaman belongs to **Kalyan Thaat**.',
    keywords: ['yaman parent thaat', 'yaman thaat'],
    relatedIds: ['rg_yaman', 'th_kalyan']
  },
  {
    id: 'rg_yaman_jati',
    question: 'What is the Jati of Raag Yaman?',
    category: 'Raagas',
    answer: 'The Jati of Raag Yaman is **Sampurna - Sampurna** (7 notes in ascent and descent).',
    keywords: ['yaman jati', 'jati of raag yaman'],
    relatedIds: ['rg_yaman', 'jati_sampurna']
  },
  {
    id: 'rg_yaman_vadi_samvadi',
    question: 'What is the Vadi and Samvadi of Raag Yaman?',
    category: 'Raagas',
    answer: '• **Vadi (King Note):** Gandhar (Ga)\n• **Samvadi (Queen Note):** Nishad (Ni).',
    keywords: ['yaman vadi samvadi', 'vadi of yaman'],
    relatedIds: ['rg_yaman', 'rg_vadi', 'rg_samvadi']
  },
  {
    id: 'rg_yaman_aaroh_avaroh',
    question: 'What is the Aaroh and Avaroh of Raag Yaman?',
    category: 'Raagas',
    answer: '• **Aaroh:** `N\' R G M\' D N S\'`\n• **Avaroh:** `S\' N D P M\' G R S`.',
    keywords: ['yaman aaroh avaroh', 'yaman scale'],
    relatedIds: ['rg_yaman', 'rg_aaroh', 'rg_avaroh']
  },
  {
    id: 'rg_yaman_pakad',
    question: 'What is the Pakad of Raag Yaman?',
    category: 'Raagas',
    answer: 'Pakad of Raag Yaman: `N\' R G M\' P, M\' D N S\', S\' N D P M\' G R S`.',
    keywords: ['yaman pakad', 'pakad of raag yaman'],
    relatedIds: ['rg_yaman', 'rg_pakad']
  },
  {
    id: 'rg_yaman_time',
    question: 'What is the performance time of Raag Yaman?',
    category: 'Raagas',
    answer: 'Raag Yaman is performed in the **first prahar of the night** (Evening 6 PM – 9 PM).',
    keywords: ['yaman time', 'when play yaman'],
    relatedIds: ['rg_yaman', 'tt_evening_raagas']
  },
  {
    id: 'rg_yaman_rasa',
    question: 'What is the mood (Rasa) of Raag Yaman?',
    category: 'Raagas',
    answer: 'Raag Yaman evokes **Shanta (Peaceful)**, **Bhakti (Devotional)**, and **Shringara (Romantic)** moods.',
    keywords: ['yaman rasa', 'yaman mood'],
    relatedIds: ['rg_yaman', 'rasa_what_is']
  },
  {
    id: 'rg_yaman_songs',
    question: 'Which famous compositions or songs use Raag Yaman?',
    category: 'Raagas',
    answer: 'Famous songs in Raag Yaman include *Ehsan Tera Hoga Mujh Par*, *Jab Deep Jale Aana*, and *Chandan Sa Badan*.',
    keywords: ['yaman songs', 'bollywood songs in yaman'],
    relatedIds: ['rg_yaman', 'sng_bollywood']
  },
  {
    id: 'rg_bhupali_thaat',
    question: 'What is the parent Thaat of Raag Bhupali?',
    category: 'Raagas',
    answer: 'Raag Bhupali belongs to **Kalyan Thaat**.',
    keywords: ['bhupali parent thaat', 'bhupali thaat'],
    relatedIds: ['rg_bhupali', 'th_kalyan']
  },
  {
    id: 'rg_bhupali_jati',
    question: 'What is the Jati of Raag Bhupali?',
    category: 'Raagas',
    answer: 'The Jati of Raag Bhupali is **Audav - Audav** (5 notes: S R G P D).',
    keywords: ['bhupali jati', 'jati of bhupali'],
    relatedIds: ['rg_bhupali', 'jati_audav']
  },
  {
    id: 'rg_bhupali_vadi_samvadi',
    question: 'What is the Vadi and Samvadi of Raag Bhupali?',
    category: 'Raagas',
    answer: '• **Vadi:** Gandhar (Ga)\n• **Samvadi:** Dhaivat (Dha).',
    keywords: ['bhupali vadi samvadi', 'vadi of bhupali'],
    relatedIds: ['rg_bhupali', 'rg_vadi']
  },
  {
    id: 'rg_bhupali_aaroh_avaroh',
    question: 'What is the Aaroh and Avaroh of Raag Bhupali?',
    category: 'Raagas',
    answer: '• **Aaroh:** `S R G P D S\'`\n• **Avaroh:** `S\' D P G R S`.',
    keywords: ['bhupali aaroh avaroh', 'bhupali notes'],
    relatedIds: ['rg_bhupali', 'rg_aaroh']
  },
  {
    id: 'rg_bhupali_pakad',
    question: 'What is the Pakad of Raag Bhupali?',
    category: 'Raagas',
    answer: 'Pakad of Raag Bhupali: `G P D P G, R G S`.',
    keywords: ['bhupali pakad', 'pakad of bhupali'],
    relatedIds: ['rg_bhupali', 'rg_pakad']
  },
  {
    id: 'rg_bhupali_time',
    question: 'What is the performance time of Raag Bhupali?',
    category: 'Raagas',
    answer: 'Raag Bhupali is performed in the **first prahar of the night** (Evening).',
    keywords: ['bhupali time', 'when play bhupali'],
    relatedIds: ['rg_bhupali', 'tt_evening_raagas']
  },
  {
    id: 'rg_bhupali_rasa',
    question: 'What is the mood (Rasa) of Raag Bhupali?',
    category: 'Raagas',
    answer: 'Raag Bhupali radiates **Bhakti (Devotional)** and **Shanta (Serene)** mood.',
    keywords: ['bhupali rasa', 'bhupali mood'],
    relatedIds: ['rg_bhupali', 'rasa_what_is']
  },
  {
    id: 'rg_bhupali_songs',
    question: 'Which famous compositions or songs use Raag Bhupali?',
    category: 'Raagas',
    answer: 'Famous tunes include *Jyoti Kalash Jhalke*, *Pankh Hote To Udd Aati*, and *Dekha Ek Khwab*.',
    keywords: ['bhupali songs', 'bollywood songs in bhupali'],
    relatedIds: ['rg_bhupali', 'sng_bollywood']
  },
  {
    id: 'rg_kafi_overview',
    question: 'What is Raag Kafi?',
    category: 'Raagas',
    answer: '**Raag Kafi** belongs to Kafi Thaat using Komal Ga and Komal Ni. It is a joyful, romantic Raag played at midnight or late evening.',
    keywords: ['raag kafi', 'kafi raag', 'komal ga ni raag'],
    relatedIds: ['th_kafi', 'rg_beginner_first']
  },
  {
    id: 'rg_bhairav_overview',
    question: 'What is Raag Bhairav?',
    category: 'Raagas',
    answer: '**Raag Bhairav** is a grand morning Raag using Komal Re and Komal Dha, evoking deep devotion and majesty.',
    keywords: ['raag bhairav', 'bhairav raag', 'morning bhairav'],
    relatedIds: ['th_bhairav', 'tt_morning_raagas']
  },
  {
    id: 'rg_khamaj_overview',
    question: 'What is Raag Khamaj?',
    category: 'Raagas',
    answer: '**Raag Khamaj** uses Komal Ni in descent, creating a playful, romantic mood popular in Thumri and light classical songs.',
    keywords: ['raag khamaj', 'khamaj raag'],
    relatedIds: ['th_khamaj', 'rasa_romantic']
  },
  {
    id: 'rg_bairagi_overview',
    question: 'What is Raag Bairagi?',
    category: 'Raagas',
    answer: '**Raag Bairagi** is a deeply meditative morning pentatonic Raag using Sa, Komal Re, Ma, Pa, Komal Ni.',
    keywords: ['raag bairagi', 'bairagi raag', 'meditative morning raag'],
    relatedIds: ['rasa_meditation', 'tt_morning_raagas']
  },
  {
    id: 'rg_malkauns_overview',
    question: 'What is Raag Malkauns?',
    category: 'Raagas',
    answer: '**Raag Malkauns** is a meditative, serious late-night pentatonic Raag using Komal Ga, Komal Dha, and Komal Ni.',
    keywords: ['raag malkauns', 'malkauns raag', 'late night raag'],
    relatedIds: ['rasa_serious', 'tt_night_raagas']
  },
  {
    id: 'rg_bageshri_overview',
    question: 'What is Raag Bageshri?',
    category: 'Raagas',
    answer: '**Raag Bageshri** is a romantic late-night Raag depicting deep emotional beauty and longing.',
    keywords: ['raag bageshri', 'bageshree raag'],
    relatedIds: ['rasa_romantic', 'tt_night_raagas']
  },

  // ==========================================
  // 📜 RAAG CATEGORY & THAAT-WISE LISTS
  // ==========================================
  {
    id: 'rg_list_beginner',
    question: 'Which Raagas are recommended for beginners?',
    category: 'Raagas',
    answer: 'The top 10 beginner-friendly Raagas are:\n1. **Raag Bhupali** (5 natural notes, easiest)\n2. **Raag Yaman** (Kalyan Thaat, Tivra Ma)\n3. **Raag Durga** (Audav Jati, joyful & crisp)\n4. **Raag Desh** (Khamaj Thaat, melodic)\n5. **Raag Kafi** (Komal Ga & Ni)\n6. **Raag Bilawal** (All Shuddha notes)\n7. **Raag Khamaj** (Komal Ni in descent)\n8. **Raag Bihag** (Evening Raag with Shuddha & Tivra Ma)\n9. **Raag Tilak Kamod** (Light classical & expressive)\n10. **Raag Hamsadhwani** (Pentatonic, vibrant devotional).',
    keywords: ['beginner raagas', 'easiest raagas', 'first raagas to learn', 'beginner raga list'],
    relatedIds: ['rg_beginner_first', 'rg_bhupali', 'rg_yaman']
  },
  {
    id: 'rg_list_morning',
    question: 'Which are the morning Raagas?',
    category: 'Raagas',
    answer: 'Morning Raagas (4 AM – 12 PM) include:\n• **Bhairav** & **Ahir Bhairav** (Devotional dawn)\n• **Ramkali** & **Lalit** (Pre-dawn/early sunrise)\n• **Bibhas** & **Jaunpuri** (Morning serenity)\n• **Todi** & **Gujari Todi** (Grand morning classical)\n• **Asavari** & **Bhairavi** (Morning peace & universal beauty).',
    keywords: ['morning raagas list', 'morning ragas', 'dawn ragas', 'bhairav', 'todi'],
    relatedIds: ['tt_morning_raagas', 'rg_bhairav_overview']
  },
  {
    id: 'rg_list_afternoon',
    question: 'Which are the afternoon Raagas?',
    category: 'Raagas',
    answer: 'Afternoon Raagas (12 PM – 4 PM) include:\n• **Multani** (Deep afternoon gravity)\n• **Patdeep** & **Bhimpalasi** (Lyrical midday beauty)\n• **Madhuvanti** (Expressive afternoon)\n• **Shuddha Sarang**, **Brindavani Sarang**, & **Gaud Sarang** (Classic Sarang family).',
    keywords: ['afternoon raagas list', 'midday ragas', 'bhimpalasi', 'sarang', 'multani'],
    relatedIds: ['tt_afternoon_raagas', 'rg_bhimpalasi_overview']
  },
  {
    id: 'rg_list_evening',
    question: 'Which are the evening Raagas?',
    category: 'Raagas',
    answer: 'Evening Raagas (4 PM – 9 PM) include:\n• **Yaman** & **Puriya** (Dusk serenity)\n• **Marwa** & **Puriya Dhanashree** (Twilight transition)\n• **Shree**, **Kedar**, **Kamod** (Grand evening classics)\n• **Bihag**, **Hameer**, & **Chhayanat** (Nightfall majesty).',
    keywords: ['evening raagas list', 'dusk ragas', 'yaman', 'kedar', 'marwa'],
    relatedIds: ['tt_evening_raagas', 'rg_yaman']
  },
  {
    id: 'rg_list_night',
    question: 'Which are the night Raagas?',
    category: 'Raagas',
    answer: 'Late Night Raagas (9 PM – 4 AM) include:\n• **Darbari Kanada** (Regal, deep late night)\n• **Malkauns** & **Chandrakauns** (Meditative pentatonic)\n• **Bageshri**, **Adana**, & **Rageshree** (Soulful late night)\n• **Jog**, **Kirwani**, **Shankara**, & **Sohini** (Expressive night classics).',
    keywords: ['night raagas list', 'late night ragas', 'malkauns', 'darbari', 'bageshri'],
    relatedIds: ['tt_night_raagas', 'rg_malkauns_overview']
  },
  {
    id: 'rg_list_devotional',
    question: 'Which Raagas are devotional (Bhakti Rasa)?',
    category: 'Raagas',
    answer: 'Devotional Raagas ideal for bhajans, stotrams, and temple flute music:\n• **Bhairavi** (Universal devotional conclusion)\n• **Yaman** & **Durga** (Purity and strength)\n• **Kedar** & **Ahir Bhairav** (Shiva and Krishna devotion)\n• **Desh**, **Jog**, & **Malkauns** (Soulful meditative depth).',
    keywords: ['devotional raagas', 'bhakti rasa ragas', 'bhajan raagas', 'temple flute ragas'],
    relatedIds: ['rasa_devotion', 'rg_bhairavi_overview']
  },
  {
    id: 'rg_list_romantic',
    question: 'Which Raagas evoke romance (Shringara Rasa)?',
    category: 'Raagas',
    answer: 'Romantic and expressive Raagas widely used in Ghazals and love songs:\n• **Bageshri** & **Yaman** (Deep love and yearning)\n• **Khamaj** & **Tilak Kamod** (Playful romantic charm)\n• **Kedar**, **Bihag**, & **Pilu** (Lyrical warmth and sweet melodies).',
    keywords: ['romantic raagas', 'shringara rasa ragas', 'love ragas', 'ghazal ragas'],
    relatedIds: ['rasa_romantic', 'rg_bageshri_overview']
  },
  {
    id: 'rg_list_monsoon',
    question: 'Which are the monsoon (rain) Raagas?',
    category: 'Raagas',
    answer: 'The Malhar family of monsoon Raagas evokes rain, thunder, and wind:\n• **Miyan Ki Malhar** (Regal monsoon classic)\n• **Megh** & **Megh Malhar** (Thunderous atmosphere)\n• **Gaud Malhar**, **Sur Malhar**, **Ramdasi Malhar**, & **Nat Malhar** (Joyous rainfall themes).',
    keywords: ['monsoon raagas', 'rain ragas', 'malhar raagas', 'miyan ki malhar', 'megh'],
    relatedIds: ['sr_monsoon_raagas', 'sr_raag_malhar']
  },
  {
    id: 'rg_list_spring',
    question: 'Which are the spring Raagas?',
    category: 'Raagas',
    answer: 'Spring Raagas celebrate blooming nature and renewal:\n• **Basant** (Traditional spring classic)\n• **Basant Bahar** (Vibrant floral beauty)\n• **Hindol** (Joyous swinging rhythm)\n• **Bahar** (Effervescent spring melody).',
    keywords: ['spring raagas', 'basant', 'bahar', 'hindol', 'seasonal spring ragas'],
    relatedIds: ['sr_spring_raagas', 'sr_raag_basant']
  },
  {
    id: 'rg_list_popular_concert',
    question: 'Which are the most popular concert Raagas?',
    category: 'Raagas',
    answer: 'The staple masterworks performed in classical concerts worldwide:\n• **Yaman**, **Darbari Kanada**, **Malkauns**, **Bhairavi**\n• **Kedar**, **Bageshri**, **Hameer**, **Marwa**, **Puriya**\n• **Multani**, **Desh**, and **Bhimpalasi**.',
    keywords: ['popular concert raagas', 'famous concert ragas', 'staple classical ragas'],
    relatedIds: ['icm_hindustani_music', 'rg_yaman']
  },
  {
    id: 'rg_list_rare_advanced',
    question: 'Which are rare and advanced Raagas?',
    category: 'Raagas',
    answer: 'Challenging and intricate Raagas for advanced flute practitioners:\n• **Shuddha Kalyan**, **Pooriya Kalyan**, **Jogkauns**, **Charukeshi**\n• **Gorakh Kalyan**, **Kalavati**, **Shankara**, **Nat Bhairav**\n• **Kaushi Kanada**, **Nayaki Kanada**, **Jaijaiwanti**, **Maru Bihag**\n• **Shivranjani**, **Chandrakauns**, **Hemant**, **Hanskinkini**, **Nand**, **Vachaspati**, **Abhogi**, **Hem Kalyan**.',
    keywords: ['rare raagas', 'advanced raagas', 'complex ragas', 'charukeshi', 'shivranjani'],
    relatedIds: ['rg_list_popular_concert', 'icm_how_long_classical']
  },

  // ==========================================
  // 🎼 THAAT-WISE RAAGA CLASSIFICATIONS
  // ==========================================
  {
    id: 'thaat_bilawal_ragas',
    question: 'Which Raagas belong to Bilawal Thaat?',
    category: 'Music Theory',
    answer: 'Bilawal Thaat (All Shuddha notes) includes:\n• **Bilawal**\n• **Alhaiya Bilawal**\n• **Deshkar**\n• **Shankara**\n• **Durga**.',
    keywords: ['bilawal thaat raagas', 'bilawal group', 'deshkar', 'durga'],
    relatedIds: ['th_bilawal', 'rg_durga_overview']
  },
  {
    id: 'thaat_kalyan_ragas',
    question: 'Which Raagas belong to Kalyan Thaat?',
    category: 'Music Theory',
    answer: 'Kalyan Thaat (Tivra Ma) includes:\n• **Yaman**\n• **Shuddha Kalyan**\n• **Kedar**\n• **Hameer**\n• **Chhayanat**\n• **Kamod**.',
    keywords: ['kalyan thaat raagas', 'yaman group', 'kedar', 'hameer'],
    relatedIds: ['th_kalyan', 'rg_yaman']
  },
  {
    id: 'thaat_khamaj_ragas',
    question: 'Which Raagas belong to Khamaj Thaat?',
    category: 'Music Theory',
    answer: 'Khamaj Thaat (Komal Ni) includes:\n• **Khamaj**\n• **Tilak Kamod**\n• **Desh**\n• **Jaijaiwanti**\n• **Jhinjhoti**.',
    keywords: ['khamaj thaat raagas', 'desh', 'tilak kamod', 'jhinjhoti'],
    relatedIds: ['th_khamaj', 'rg_desh_overview']
  },
  {
    id: 'thaat_kafi_ragas',
    question: 'Which Raagas belong to Kafi Thaat?',
    category: 'Music Theory',
    answer: 'Kafi Thaat (Komal Ga & Komal Ni) includes:\n• **Kafi**\n• **Bageshri**\n• **Bhimpalasi**\n• **Pilu**\n• **Brindavani Sarang**.',
    keywords: ['kafi thaat raagas', 'bageshri', 'bhimpalasi', 'pilu'],
    relatedIds: ['th_kafi', 'rg_bageshri_overview']
  },
  {
    id: 'thaat_asavari_ragas',
    question: 'Which Raagas belong to Asavari Thaat?',
    category: 'Music Theory',
    answer: 'Asavari Thaat (Komal Ga, Dha, Ni) includes:\n• **Asavari**\n• **Darbari Kanada**\n• **Jaunpuri**\n• **Adana**.',
    keywords: ['asavari thaat raagas', 'darbari kanada', 'jaunpuri', 'adana'],
    relatedIds: ['th_asavari', 'rg_darbari_overview']
  },
  {
    id: 'thaat_bhairav_ragas',
    question: 'Which Raagas belong to Bhairav Thaat?',
    category: 'Music Theory',
    answer: 'Bhairav Thaat (Komal Re & Komal Dha) includes:\n• **Bhairav**\n• **Ahir Bhairav**\n• **Ramkali**\n• **Nat Bhairav**.',
    keywords: ['bhairav thaat raagas', 'ahir bhairav', 'ramkali'],
    relatedIds: ['th_bhairav', 'rg_ahir_bhairav_overview']
  },
  {
    id: 'thaat_bhairavi_ragas',
    question: 'Which Raagas belong to Bhairavi Thaat?',
    category: 'Music Theory',
    answer: 'Bhairavi Thaat (Komal Re, Ga, Dha, Ni) includes:\n• **Bhairavi**\n• **Malkauns**\n• **Bilaskhani Todi**.',
    keywords: ['bhairavi thaat raagas', 'malkauns', 'bhairavi group'],
    relatedIds: ['th_bhairavi', 'rg_malkauns_overview']
  },
  {
    id: 'thaat_marwa_ragas',
    question: 'Which Raagas belong to Marwa Thaat?',
    category: 'Music Theory',
    answer: 'Marwa Thaat (Komal Re & Tivra Ma) includes:\n• **Marwa**\n• **Puriya**\n• **Sohini**.',
    keywords: ['marwa thaat raagas', 'puriya', 'sohini'],
    relatedIds: ['th_marwa', 'tt_evening_raagas']
  },
  {
    id: 'thaat_poorvi_ragas',
    question: 'Which Raagas belong to Poorvi Thaat?',
    category: 'Music Theory',
    answer: 'Poorvi Thaat (Komal Re, Dha & Tivra Ma) includes:\n• **Poorvi**\n• **Basant**\n• **Puriya Dhanashree**.',
    keywords: ['poorvi thaat raagas', 'basant', 'puriya dhanashree'],
    relatedIds: ['th_poorvi', 'sr_raag_basant']
  },
  {
    id: 'thaat_todi_ragas',
    question: 'Which Raagas belong to Todi Thaat?',
    category: 'Music Theory',
    answer: 'Todi Thaat (Komal Re, Ga, Dha & Tivra Ma) includes:\n• **Todi**\n• **Gujari Todi**\n• **Multani**\n• **Madhuvanti**.',
    keywords: ['todi thaat raagas', 'gujari todi', 'multani', 'madhuvanti'],
    relatedIds: ['th_todi', 'tt_morning_raagas']
  },

  // ==========================================
  // 🎼 STANDARD QUESTIONS FOR SPECIFIC RAAGAS
  // ==========================================
  {
    id: 'rg_durga_overview',
    question: 'What is Raag Durga?',
    category: 'Raagas',
    answer: '**Raag Durga** is a pentatonic (Audav) late evening Raag from Bilawal Thaat. It uses all Shuddha notes skipping Ga and Ni (`S R M P D S\'`), evoking energy, clarity, and pure joy.',
    keywords: ['raag durga', 'durga raag', 'what is durga'],
    relatedIds: ['rg_list_beginner', 'thaat_bilawal_ragas']
  },
  {
    id: 'rg_durga_details',
    question: 'What are the details of Raag Durga (Thaat, Jati, Notes, Vadi, Time)?',
    category: 'Raagas',
    answer: '• **Thaat:** Bilawal\n• **Jati:** Audav - Audav (5 notes: S R M P D)\n• **Vadi Swar:** Dhaivat (Dha)\n• **Samvadi Swar:** Rishabh (Re)\n• **Aaroh:** `S R M P D S\'`\n• **Avaroh:** `S\' D P M R S`\n• **Pakad:** `M P D M R, d S`\n• **Time:** Second prahar of night (9 PM – 12 AM)\n• **Rasa:** Vira (Heroic) / Joyful Devotion.',
    keywords: ['durga thaat jati vadi samvadi', 'durga details', 'durga aaroh avaroh'],
    relatedIds: ['rg_durga_overview', 'rg_list_beginner']
  },
  {
    id: 'rg_desh_overview',
    question: 'What is Raag Desh?',
    category: 'Raagas',
    answer: '**Raag Desh** is a soulful monsoon & evening Raag from Khamaj Thaat. It uses Shuddha Ni in ascent (`S R M P N S\'`) and Komal Ni in descent (`S\' n D P M G R S`), famously featured in India\'s national song *Vande Mataram*.',
    keywords: ['raag desh', 'desh raag', 'vande mataram raag'],
    relatedIds: ['rg_list_beginner', 'thaat_khamaj_ragas']
  },
  {
    id: 'rg_desh_details',
    question: 'What are the details of Raag Desh (Thaat, Jati, Notes, Vadi, Time)?',
    category: 'Raagas',
    answer: '• **Thaat:** Khamaj\n• **Jati:** Audav - Sampurna (5 notes ascent, 7 notes descent)\n• **Vadi Swar:** Rishabh (Re)\n• **Samvadi Swar:** Pancham (Pa)\n• **Aaroh:** `S R M P N S\'`\n• **Avaroh:** `S\' n D P M G R S`\n• **Pakad:** `R M P, n D P, R g R S`\n• **Time:** Second prahar of night (or monsoon season)\n• **Rasa:** Shringara (Romantic) / Patriotic.',
    keywords: ['desh details', 'desh thaat jati vadi', 'desh aaroh avaroh'],
    relatedIds: ['rg_desh_overview', 'sr_monsoon_raagas']
  },
  {
    id: 'rg_bhimpalasi_overview',
    question: 'What is Raag Bhimpalasi?',
    category: 'Raagas',
    answer: '**Raag Bhimpalasi** is a peaceful afternoon Raag from Kafi Thaat using Komal Ga and Komal Ni. It skips Re and Dha in ascent (`n\' S g M P n S\'`) and uses all 7 notes descending.',
    keywords: ['raag bhimpalasi', 'bhimpalasi raag', 'afternoon raag bhimpalasi'],
    relatedIds: ['thaat_kafi_ragas', 'tt_afternoon_raagas']
  },
  {
    id: 'rg_darbari_overview',
    question: 'What is Raag Darbari Kanada?',
    category: 'Raagas',
    answer: '**Raag Darbari Kanada** is a majestic late-night Raag created by Tansen in Emperor Akbar\'s court. Belonging to Asavari Thaat, it features heavy Andolan glides on Komal Ga and Komal Dha.',
    keywords: ['darbari kanada', 'raag darbari', 'regal night raag'],
    relatedIds: ['thaat_asavari_ragas', 'tt_night_raagas', 'orn_andolan']
  },
  {
    id: 'rg_ahir_bhairav_overview',
    question: 'What is Raag Ahir Bhairav?',
    category: 'Raagas',
    answer: '**Raag Ahir Bhairav** is a sublime morning Raag blending Bhairav and Kafi elements (Komal Re and Komal Ni). It produces an intensely peaceful, prayerful atmosphere.',
    keywords: ['ahir bhairav', 'raag ahir bhairav', 'morning prayer raag'],
    relatedIds: ['thaat_bhairav_ragas', 'tt_morning_raagas', 'rasa_devotion']
  },
  {
    id: 'rg_standard_20_questions_guide',
    question: 'What 20 standard questions define any Raag in classical music?',
    category: 'Music Theory',
    answer: 'When studying any Raag, master these 20 key parameters:\n1. Name & Meaning\n2. Parent Thaat\n3. Jati (Audav/Shadav/Sampurna)\n4. Aaroh (Ascent)\n5. Avaroh (Descent)\n6. Pakad (Signature Phrase)\n7. Vadi Swar (King note)\n8. Samvadi Swar (Queen note)\n9. Performance Time (Samay)\n10. Emotional Mood (Rasa)\n11. Beginner Suitability\n12. Common Ornamentations (Meend/Gamak/Khatka)\n13. Important Phrases\n14. Emphasized Notes\n15. Avoided Notes (Varjit Swaras)\n16. Bollywood Song Examples\n17. Famous Classical Compositions\n18. Recommended Flute Drills\n19. Common Beginner Pitfalls\n20. Next Logical Raag to Learn.',
    keywords: ['20 questions raag', 'standard raag questions', 'how to study a raag', 'raga parameters'],
    relatedIds: ['rgb_grammar', 'rgb_what_makes_unique']
  },

  // ==========================================
  // 🎵 BEGINNER BOLLYWOOD QUESTIONS
  // ==========================================
  {
    id: 'bol_can_play_bansuri',
    question: 'Can I play Bollywood songs on the Bansuri?',
    category: 'Songs & Melody',
    answer: 'Absolutely! The Bansuri is one of the most expressive instruments for playing Bollywood songs, ghazals, and popular film melodies due to its organic warmth and vocal-like fluid bending (Meend).',
    keywords: ['play bollywood on bansuri', 'bollywood film songs flute', 'can i play hindi songs'],
    relatedIds: ['sng_bollywood', 'bol_which_scale_best']
  },
  {
    id: 'bol_best_for_beginners',
    question: 'Which Bollywood songs are best for beginners?',
    category: 'Songs & Melody',
    answer: 'Top beginner-friendly melodies include:\n• *Pee Loon* (*Once Upon a Time in Mumbaai*)\n• *Zara Zara* (*Rehnaa Hai Terre Dil Mein*)\n• *Hai Apna Dil To Aawara*\n• *Lag Ja Gale*\n• *Yeh Shaam Mastani*\n• *Tujhe Dekha To Yeh Jaana Sanam*.',
    keywords: ['best beginner bollywood songs', 'easy hindi songs flute', 'starter bollywood melodies'],
    relatedIds: ['sng_bollywood', 'bol_easiest_beginners']
  },
  {
    id: 'bol_how_long_to_play',
    question: 'How long does it take to play Bollywood songs?',
    category: 'Songs & Melody',
    answer: 'With daily 20–30 minute practice, most students can play simple Bollywood tunes within 2 to 3 months once basic note production and finger movements become clean.',
    keywords: ['how long to play bollywood songs', 'timeline for film songs'],
    relatedIds: ['beg_how_long', 'bol_best_for_beginners']
  },
  {
    id: 'bol_classical_before_bollywood',
    question: 'Should I learn classical music before playing Bollywood songs?',
    category: 'Songs & Melody',
    answer: 'You do not need deep classical theory to start simple songs, but practicing basic Alankars (scales) alongside simple Bollywood songs accelerates your progress and improves finger speed tremendously.',
    keywords: ['classical before bollywood', 'learn raaga before song', 'theory required for songs'],
    relatedIds: ['icm_bollywood_without_classical', 'sng_bollywood']
  },
  {
    id: 'bol_which_scale_best',
    question: 'Which flute scale is best for Bollywood songs?',
    category: 'Songs & Melody',
    answer: 'An **E Medium** or **C Natural** flute is ideal for learning light/Bollywood songs. For deep, rich tones, a **G Natural Base** flute is extremely popular among professionals.',
    keywords: ['best flute scale for bollywood', 'which scale for hindi songs'],
    relatedIds: ['fl_g_natural_scale', 'fl_c_natural_scale']
  },
  {
    id: 'bol_g_natural_flute',
    question: 'Can I play Bollywood songs on a G Natural flute?',
    category: 'Songs & Melody',
    answer: 'Yes! The G Natural (Medium or Base) flute is the benchmark scale used by professional artists like Pt. Hariprasad Chaurasia for iconic Bollywood studio recordings.',
    keywords: ['g natural flute bollywood', 'play songs on g natural'],
    relatedIds: ['fl_g_natural_scale', 'bol_which_scale_best']
  },
  {
    id: 'bol_c_natural_flute',
    question: 'Can I play Bollywood songs on a C Natural flute?',
    category: 'Songs & Melody',
    answer: 'Yes! C Natural Medium flutes have comfortable hole spacing for beginners and produce crisp, sweet tones that fit Bollywood melodies perfectly.',
    keywords: ['c natural flute bollywood', 'play songs on c natural'],
    relatedIds: ['fl_c_natural_scale', 'bol_which_scale_best']
  },
  {
    id: 'bol_base_flute_suitable',
    question: 'Is a base flute suitable for Bollywood songs?',
    category: 'Songs & Melody',
    answer: 'Base flutes (E Base, D Base, C Base) produce deep, soothing, romantic tones perfect for slow emotional Bollywood ballads, though fast energetic tracks are easier on medium flutes.',
    keywords: ['base flute for bollywood', 'playing songs on bass bansuri'],
    relatedIds: ['fl_base_flute_vs_medium', 'bol_g_natural_flute']
  },
  {
    id: 'bol_play_by_ear',
    question: 'Can I play Bollywood songs by ear?',
    category: 'Songs & Melody',
    answer: 'Yes! Playing by ear develops naturally as you practice match-the-pitch exercises: listen to a short phrase, hum it, find the starting note on your flute, and map the melody note-by-note.',
    keywords: ['play by ear bollywood', 'play songs without notation', 'ear training flute'],
    relatedIds: ['ear_how_to_train', 'sng_bollywood']
  },
  {
    id: 'bol_learn_faster',
    question: 'How do I learn Bollywood songs faster?',
    category: 'Songs & Melody',
    answer: '1. Listen to the original track 5 times.\n2. Break the song into 4-bar chunks (Mukhda & Antara).\n3. Sing the Swaras aloud before playing.\n4. Practice slowly with a metronome.',
    keywords: ['learn bollywood songs faster', 'fast song learning tips'],
    relatedIds: ['sng_learn_by_ear', 'bol_best_for_beginners']
  },

  // ==========================================
  // 🎼 LEARNING SONGS
  // ==========================================
  {
    id: 'sng_how_to_start',
    question: 'How do I start learning a new Bollywood song?',
    category: 'Songs & Melody',
    answer: 'Identify the Mukhda (chorus) first. Find its root/key note (Sa), write or memorize the Swara notation for the first phrase, and play it very slowly until finger transitions are smooth.',
    keywords: ['start learning new song', 'how to learn song step by step'],
    relatedIds: ['bol_learn_faster', 'sng_identify_first_note']
  },
  {
    id: 'sng_listen_first',
    question: 'Should I listen to the original recording first?',
    category: 'Songs & Melody',
    answer: 'Yes! Listening repeatedly fixes the vocal inflections, rhythm, breath points, and emotional dynamics in your mind before your fingers touch the holes.',
    keywords: ['listen to recording first', 'listening before playing'],
    relatedIds: ['sng_how_to_start', 'sng_improve_listening']
  },
  {
    id: 'sng_identify_first_note',
    question: 'How do I identify the first note of a song?',
    category: 'Songs & Melody',
    answer: 'Hum the very first syllable of the song, sustain it, and check which note on your flute matches that exact pitch using a tuner app or Tanpura.',
    keywords: ['find first note of song', 'identify starting note'],
    relatedIds: ['ear_how_to_train', 'bol_play_by_ear']
  },
  {
    id: 'sng_improve_listening',
    question: 'How can I improve my listening skills?',
    category: 'Songs & Melody',
    answer: 'Practice active listening: close your eyes and focus on micro-ornaments (glides, grace notes, pauses). Try singing back short 3-note phrases immediately after hearing them.',
    keywords: ['improve listening skills', 'ear training for flute', 'active listening'],
    relatedIds: ['ear_how_to_train', 'sng_listen_first']
  },
  {
    id: 'sng_memorize_song',
    question: 'How do I memorize a song on the flute?',
    category: 'Songs & Melody',
    answer: 'Memorize phrase by phrase rather than the full song at once. Connect Swaras to vocal words (*Mukhda*, *Antara 1*, *Antara 2*) to reinforce mental muscle memory.',
    keywords: ['memorize song flute', 'remember flute notations'],
    relatedIds: ['sng_divide_sections', 'bol_learn_faster']
  },
  {
    id: 'sng_practice_slowly',
    question: 'Should I practice a song slowly first?',
    category: 'Songs & Melody',
    answer: 'Always! Practicing at half-tempo allows your fingers to execute clean hole coverage and subtle glides (Meend) without stumbling.',
    keywords: ['practice slowly first', 'slow practice benefits'],
    relatedIds: ['prac_slow_practice', 'bol_learn_faster']
  },
  {
    id: 'sng_divide_sections',
    question: 'How do I divide a song into sections for practice?',
    category: 'Songs & Melody',
    answer: 'Divide the song logically into 3 main parts: Mukhda (refrain), Antara (verse), and Sanchari/Bridge (instrumental interlude). Master each part independently before stitching them together.',
    keywords: ['divide song sections', 'mukhda antara bridge practice'],
    relatedIds: ['sng_how_to_start', 'sng_memorize_song']
  },
  {
    id: 'sng_how_many_beginners',
    question: 'How many songs should beginners learn in their first month?',
    category: 'Songs & Melody',
    answer: 'Focus on mastering 2 to 3 simple songs completely (with correct rhythm, pitch, and clean tone) rather than half-learning 10 songs.',
    keywords: ['how many songs beginner learn', 'song count first month'],
    relatedIds: ['bol_best_for_beginners', 'sng_practice_frequency']
  },
  {
    id: 'sng_practice_frequency',
    question: 'How often should I practice the same song?',
    category: 'Songs & Melody',
    answer: 'Practice the target song daily for 15–20 minutes after completing your basic long-blowing and scale warm-ups.',
    keywords: ['how often practice same song', 'daily song practice'],
    relatedIds: ['prac_daily_routine', 'sng_making_mistakes']
  },
  {
    id: 'sng_making_mistakes',
    question: 'What should I do if I keep making mistakes in a song?',
    category: 'Songs & Melody',
    answer: 'Isolate the exact 2-bar phrase where you stumble. Slow down to 50% speed and loop that small section 10 times until it feels smooth.',
    keywords: ['making mistakes in song', 'fix stumbling phrase'],
    relatedIds: ['sng_practice_slowly', 'prob_wrong_notes']
  },

  // ==========================================
  // 🎶 PLAYING TECHNIQUES
  // ==========================================
  {
    id: 'tech_make_expressive',
    question: 'How do I make Bollywood songs sound expressive?',
    category: 'Techniques',
    answer: 'Expressiveness comes from adding dynamic breath blowing (crescendo/decrescendo), delicate Kan Swaras (touch notes), and smooth Meend glides between key words.',
    keywords: ['make song expressive', 'soulful flute playing', 'expressive melodies'],
    relatedIds: ['tech_meend', 'tech_kan_swar', 'tech_emotional_melodies']
  },
  {
    id: 'tech_smooth_transitions',
    question: 'How do I play smooth transitions between notes?',
    category: 'Techniques',
    answer: 'Slide your fingers smoothly off the flute holes rather than lifting them abruptly, and maintain steady, unbroken airflow across the transition.',
    keywords: ['smooth note transitions', 'seamless finger movement'],
    relatedIds: ['tech_meend', 'fing_smooth_movement']
  },
  {
    id: 'tech_meend_in_bollywood',
    question: 'How do I use Meend in Bollywood songs?',
    category: 'Techniques',
    answer: 'Identify emotional vocal bends (like in *Lag Ja Gale*) and gradually slide your finger across the half-covered hole while supporting pitch with breath pitch-bending.',
    keywords: ['meend in bollywood songs', 'vocal bends on flute'],
    relatedIds: ['tech_meend', 'tech_make_expressive']
  },
  {
    id: 'tech_when_use_gamak',
    question: 'When should I use Gamak in songs?',
    category: 'Techniques',
    answer: 'Use Gamak (heavy rhythmic pitch oscillations) sparingly on sustained held notes or dramatic peaks in energetic or classical-based film songs.',
    keywords: ['when to use gamak', 'gamak in film songs'],
    relatedIds: ['tech_gamak', 'tech_decorate_melodies']
  },
  {
    id: 'tech_add_murki',
    question: 'Should I add Murki while playing film songs?',
    category: 'Techniques',
    answer: 'Yes! A subtle Murki (a fast 3-note cluster touch) adds instant sparkle to light romantic phrases and folk-inspired melodies.',
    keywords: ['add murki in songs', 'murki ornamentation'],
    relatedIds: ['tech_murki', 'tech_decorate_melodies']
  },
  {
    id: 'tech_decorate_melodies',
    question: 'How do professionals decorate melodies?',
    category: 'Techniques',
    answer: 'Professionals combine three layers:\n1. Base Swaras (core melody)\n2. Kan Swaras (grace touches on entry notes)\n3. Meend & Khatka on phrase endings.',
    keywords: ['decorate melodies flute', 'pro flute embellishments'],
    relatedIds: ['tech_make_expressive', 'tech_meend', 'tech_khatka']
  },
  {
    id: 'tech_improve_expression',
    question: 'How do I improve expression on the flute?',
    category: 'Techniques',
    answer: 'Sing the song with vocal emotion first. Mirror the singer\'s breath pauses, volume swells, and vocal vibrato on your instrument.',
    keywords: ['improve flute expression', 'feeling in playing'],
    relatedIds: ['tech_make_expressive', 'tech_emotional_melodies']
  },
  {
    id: 'tech_emotional_melodies',
    question: 'How do I play emotional melodies effectively?',
    category: 'Techniques',
    answer: 'Play slow ballads with deep diaphragm breath control, warm lower-register blowing, subtle vibrato, and generous negative space (silence between phrases).',
    keywords: ['emotional melodies flute', 'sad romantic songs flute'],
    relatedIds: ['tech_make_expressive', 'tech_control_dynamics']
  },
  {
    id: 'tech_control_dynamics',
    question: 'How do I control dynamics (volume soft/loud) on Bansuri?',
    category: 'Techniques',
    answer: 'Adjust your breath velocity while gently rolling the flute inward (to maintain pitch when playing softer) or outward (when blowing stronger).',
    keywords: ['control dynamics flute', 'flute volume control', 'crescendo decrescendo'],
    relatedIds: ['br_tone_purity', 'tech_emotional_melodies']
  },
  {
    id: 'tech_improve_phrasing',
    question: 'How do I improve phrasing in song playing?',
    category: 'Techniques',
    answer: 'Never break a musical phrase mid-word! Breathe only at natural punctuation marks or vocal commas in the song\'s lyrics.',
    keywords: ['improve phrasing flute', 'musical phrasing tips'],
    relatedIds: ['br_breath_control', 'tech_make_expressive']
  },

  // ==========================================
  // 🌬️ COMMON PROBLEMS & TROUBLESHOOTING
  // ==========================================
  {
    id: 'prob_not_sounding_original',
    question: 'Why doesn\'t my song sound like the original recording?',
    category: 'Troubleshooting',
    answer: 'Usually because you are playing plain notes without grace touches! Adding Kan Swaras, Meend glides, and natural breath dynamics turns a mechanical tune into a soulful melody.',
    keywords: ['song does not sound original', 'flat sounding melody'],
    relatedIds: ['tech_make_expressive', 'tech_decorate_melodies']
  },
  {
    id: 'prob_missing_notes',
    question: 'Why am I missing notes or getting squeaks while playing?',
    category: 'Troubleshooting',
    answer: 'Missing notes occur due to incomplete finger hole coverage or sudden, erratic changes in air pressure. Double check finger seals with your finger pads.',
    keywords: ['missing notes flute', 'squeaking on notes'],
    relatedIds: ['prob_air_leakage', 'fing_hole_coverage']
  },
  {
    id: 'prob_high_notes_cracking',
    question: 'Why do high notes crack when I play fast passages?',
    category: 'Troubleshooting',
    answer: 'High notes crack when the lip aperture opens too wide or breath pressure drops suddenly. Tighten your lips slightly into a focused stream for Taar Saptak notes.',
    keywords: ['high notes cracking', 'cracking taar saptak'],
    relatedIds: ['ns_upper_octave', 'sap_upper_difficult']
  },
  {
    id: 'prob_incorrect_rhythm',
    question: 'Why is my rhythm incorrect when playing along with songs?',
    category: 'Troubleshooting',
    answer: 'You may be rushing or dragging beats. Practice tapping your foot on the 1-2-3-4 pulse while playing, or use a Tabla/metronome app.',
    keywords: ['incorrect rhythm in songs', 'rhythm problems flute'],
    relatedIds: ['th_laya', 'prob_maintain_tempo']
  },
  {
    id: 'prob_improve_timing',
    question: 'How do I improve timing and rhythmic accuracy?',
    category: 'Troubleshooting',
    answer: 'Subdivide beats into quarters (1-and-2-and-3-and-4-and) and practice at a comfortable 60 BPM metronome tempo before attempting full speed.',
    keywords: ['improve timing flute', 'rhythm accuracy practice'],
    relatedIds: ['prob_incorrect_rhythm', 'al_practice_metronome']
  },
  {
    id: 'prob_flute_sounds_flat',
    question: 'Why does my flute sound flat or off-pitch?',
    category: 'Troubleshooting',
    answer: '1. Check ambient temperature (bamboo warms up with playing).\n2. Adjust your blowing angle (rolling slightly outward sharpens, inward flattens).\n3. Match your pitch against a digital tuner app.',
    keywords: ['flute sounds flat', 'pitch flat tuning'],
    relatedIds: ['fl_how_to_tune', 'br_pitch_stability']
  },
  {
    id: 'prob_maintain_tempo',
    question: 'How do I maintain a steady tempo throughout a song?',
    category: 'Troubleshooting',
    answer: 'Internalize the beat by counting silently or playing over a simple backing track instead of relying purely on memory.',
    keywords: ['maintain steady tempo', 'tempo consistency'],
    relatedIds: ['prob_improve_timing', 'th_laya']
  },
  {
    id: 'prob_out_of_breath_song',
    question: 'Why am I running out of breath in the middle of a song phrase?',
    category: 'Troubleshooting',
    answer: 'You may be wasting air through an overly wide embouchure hole or holding tension in your chest. Take deep abdominal breaths and refine lip focus.',
    keywords: ['running out of breath song', 'breath stamina in songs'],
    relatedIds: ['br_run_out_breath', 'br_breath_control']
  },
  {
    id: 'prob_difficult_parts_messy',
    question: 'Why do difficult song parts sound messy or blurred?',
    category: 'Troubleshooting',
    answer: 'Messy parts stem from uneven finger lifting. Practice finger-tapping drills on those specific 3 notes without blowing air to isolate finger independence.',
    keywords: ['difficult parts messy', 'sloppy fast passages'],
    relatedIds: ['fing_increase_speed', 'sng_making_mistakes']
  },
  {
    id: 'prob_finger_coordination',
    question: 'How do I improve finger coordination during song playing?',
    category: 'Troubleshooting',
    answer: 'Practice 10 minutes of structured Alankars daily (e.g. `S R G M, R G M P, G M P D`) to build crisp muscle memory across all 6 holes.',
    keywords: ['improve finger coordination', 'finger agility flute'],
    relatedIds: ['al_what_are_alankars', 'fing_smooth_movement']
  },

  // ==========================================
  // 🎵 SONGS BY DIFFICULTY
  // ==========================================
  {
    id: 'sng_easiest_beginners',
    question: 'Which Bollywood songs are easiest for absolute beginners?',
    category: 'Songs & Melody',
    answer: '1. *Hai Apna Dil To Aawara*\n2. *Pee Loon*\n3. *Lag Ja Gale*\n4. *Zara Zara*\n5. *Tujhe Dekha To Yeh Jaana Sanam*\n6. *Chhookar Mere Manko*.',
    keywords: ['easiest bollywood songs', 'absolute beginner songs flute'],
    relatedIds: ['bol_best_for_beginners', 'sng_suitable_intermediate']
  },
  {
    id: 'sng_suitable_intermediate',
    question: 'Which songs are suitable for intermediate players?',
    category: 'Songs & Melody',
    answer: '1. *Tere Bina Zindagi Se*\n2. *Dil Deewana* (*Maine Pyar Kiya*)\n3. *Kesariya* (*Brahmastra*)\n4. *Kal Ho Naa Ho*\n5. *Tum Hi Ho* (*Aashiqui 2*).',
    keywords: ['intermediate bollywood songs flute', 'medium difficulty songs'],
    relatedIds: ['sng_easiest_beginners', 'sng_suitable_advanced']
  },
  {
    id: 'sng_suitable_advanced',
    question: 'Which songs are suitable for advanced players?',
    category: 'Songs & Melody',
    answer: '1. *Ghar More Pardesiya* (*Kalank*)\n2. *Albela Sajan Aayo Re*\n3. *Mohe Rang Do Laal*\n4. *Madhuban Mein Radhika Nache Re*\n5. *Mere Dholna* (*Bhool Bhulaiyaa*).',
    keywords: ['advanced bollywood songs flute', 'fast classical film songs'],
    relatedIds: ['sng_suitable_intermediate', 'sng_require_fast_fingering']
  },
  {
    id: 'sng_require_meend',
    question: 'Which songs require expressive Meend glides?',
    category: 'Songs & Melody',
    answer: '• *Lag Ja Gale*\n• *Tere Bina Zindagi Se*\n• *Chupke Chupke Raat Din*\n• *Satyam Shivam Sundaram*\n• *Aaye Ho Meri Zindagi Mein*.',
    keywords: ['songs require meend', 'meend rich songs flute'],
    relatedIds: ['tech_meend_in_bollywood', 'tech_meend']
  },
  {
    id: 'sng_require_fast_fingering',
    question: 'Which songs require fast fingering and agility?',
    category: 'Songs & Melody',
    answer: '• *Ghar More Pardesiya*\n• *Dil Cheez Kya Hai*\n• *Pinga* (*Bajirao Mastani*)\n• *Dola Re Dola*\n• *Madhuban Mein Radhika*.',
    keywords: ['songs fast fingering', 'fast speed songs flute'],
    relatedIds: ['sng_suitable_advanced', 'fing_increase_speed']
  },
  {
    id: 'sng_good_breath_control',
    question: 'Which songs are good for practicing breath control?',
    category: 'Songs & Melody',
    answer: 'Slow sustained tracks like *Yeh Kahan Aa Gaye Hum*, *Roz Roz Aankhon Tale*, and *Kahiin To Hoga* force you to sustain long phrases cleanly.',
    keywords: ['songs for breath control', 'long phrase songs'],
    relatedIds: ['br_breath_control', 'sng_require_meend']
  },
  {
    id: 'sng_improve_finger_speed',
    question: 'Which songs help improve finger speed?',
    category: 'Songs & Melody',
    answer: 'Folk and semi-classical tracks like *Jiya Jale*, *Silsila Ye Yeena Ka*, and *Senorita* present crisp rhythmic staccato phrases ideal for finger agility.',
    keywords: ['songs improve finger speed', 'finger speed building songs'],
    relatedIds: ['sng_require_fast_fingering', 'fing_increase_speed']
  },
  {
    id: 'sng_help_expression',
    question: 'Which songs help develop deep musical expression?',
    category: 'Songs & Melody',
    answer: '*Tujhse Naraz Nahin Zindagi*, *Aina Mujhse Meri Pehli Mohabbat*, and *Mai Ri* allow endless freedom for micro-glides and emotional dynamics.',
    keywords: ['songs help expression', 'expressive songs bansuri'],
    relatedIds: ['tech_make_expressive', 'tech_emotional_melodies']
  },
  {
    id: 'sng_ideal_stage',
    question: 'Which songs are ideal for stage performance?',
    category: 'Songs & Melody',
    answer: 'Crowd pleasers like *Kesariya*, *Lag Ja Gale*, *Yeh Shaam Mastani*, *Pee Loon*, and *Sujalam Sufalam (Vande Mataram)* never fail to move an audience.',
    keywords: ['stage performance songs', 'flute concert songs'],
    relatedIds: ['perf_prepare_live', 'sng_easiest_beginners']
  },
  {
    id: 'sng_best_daily_practice',
    question: 'Which songs are best for daily practice routines?',
    category: 'Songs & Melody',
    answer: '*Lag Ja Gale* (for Meend), *Hai Apna Dil To Aawara* (for rhythm), and *Pee Loon* (for middle/upper register balance).',
    keywords: ['best songs daily practice', 'routine practice songs'],
    relatedIds: ['prac_daily_routine', 'sng_easiest_beginners']
  },

  // ==========================================
  // 🎼 PRACTICE QUESTIONS
  // ==========================================
  {
    id: 'prac_songs_before_raagas',
    question: 'How many Bollywood songs should I learn before moving to Raagas?',
    category: 'Practice',
    answer: 'Learn 3 to 5 simple songs alongside basic Alankars. Once you feel comfortable producing notes and holding rhythm, introducing beginner Raagas (like Raag Bhupali) becomes effortless.',
    keywords: ['how many songs before raagas', 'transition from songs to ragas'],
    relatedIds: ['rg_list_beginner', 'icm_bollywood_without_classical']
  },
  {
    id: 'prac_scales_before_songs',
    question: 'Should I practice scales before songs in my daily session?',
    category: 'Practice',
    answer: 'Yes! Always dedicate 10–15 minutes to long Sa blowing and Alankar scales first. Warm fingers and stabilized breath make learning songs 2x faster.',
    keywords: ['scales before songs', 'warmup before song practice'],
    relatedIds: ['prac_warm_up', 'prac_daily_routine']
  },
  {
    id: 'prac_songs_improve_technique',
    question: 'Can playing songs improve my flute technique?',
    category: 'Practice',
    answer: 'Yes! Song melodies apply theoretical techniques (Meend, Khatka, rhythm timing) into practical musical context, making practice engaging and musically rewarding.',
    keywords: ['can songs improve technique', 'benefits of playing songs'],
    relatedIds: ['tech_make_expressive', 'prac_scales_before_songs']
  },
  {
    id: 'prac_with_metronome',
    question: 'Should I practice songs with a metronome?',
    category: 'Practice',
    answer: 'Yes! Practicing with a metronome prevents tempo fluctuations and builds rock-solid rhythmic timing crucial for studio and live playing.',
    keywords: ['practice songs with metronome', 'metronome song practice'],
    relatedIds: ['al_practice_metronome', 'prob_improve_timing']
  },
  {
    id: 'prac_with_karaoke',
    question: 'Should I practice with karaoke or backing tracks?',
    category: 'Practice',
    answer: 'Once you know the notation by heart, playing along with a karaoke or Tanpura/Tabla track develops professional timing, pitch alignment, and performance confidence.',
    keywords: ['practice with karaoke', 'backing track flute practice'],
    relatedIds: ['play_along_original', 'play_find_scale']
  },
  {
    id: 'prac_without_accompaniment',
    question: 'Can I practice songs without accompaniment?',
    category: 'Practice',
    answer: 'Yes! Solo practice over a Tanpura drone is excellent for tuning pitch accuracy and refining subtle ornaments without distraction.',
    keywords: ['practice songs solo', 'tanpura solo song practice'],
    relatedIds: ['tan_why_use', 'prac_with_karaoke']
  },
  {
    id: 'prac_how_long_one_song',
    question: 'How long should I practice one song in a session?',
    category: 'Practice',
    answer: 'Spend 15 to 20 minutes focused on a single song per session. Quality focused practice on 4 bars is better than rushing through the entire track.',
    keywords: ['how long practice one song', 'song practice duration'],
    relatedIds: ['sng_practice_frequency', 'bol_learn_faster']
  },
  {
    id: 'prac_record_practice',
    question: 'Should I record my practice sessions?',
    category: 'Practice',
    answer: 'Highly recommended! Listening back to phone voice recordings reveals pitch micro-flaws, timing hiccups, and air leakage that you miss while actively playing.',
    keywords: ['record practice sessions', 'self recording flute'],
    relatedIds: ['rec_record_covers', 'rec_constructive_feedback']
  },
  {
    id: 'prac_know_when_mastered',
    question: 'How do I know when I have mastered a song?',
    category: 'Practice',
    answer: 'You have mastered a song when you can play it effortlessly from memory, in perfect rhythm with a backing track, with zero squeaks and full emotional expression.',
    keywords: ['know when song mastered', 'mastered a song'],
    relatedIds: ['sng_memorize_song', 'tech_make_expressive']
  },
  {
    id: 'prac_after_first_song',
    question: 'What should I learn after completing my first Bollywood song?',
    category: 'Practice',
    answer: 'Try a song with a slightly faster tempo or higher octave phrase, or pick a song based on a classic Raag (like *Pee Loon* in Raag Bhupali).',
    keywords: ['what after first song', 'next step after song'],
    relatedIds: ['bol_best_for_beginners', 'rg_list_beginner']
  },

  // ==========================================
  // 🎬 SONG RECOMMENDATIONS
  // ==========================================
  {
    id: 'rec_beautiful_flute_songs',
    question: 'Which Bollywood songs sound beautiful on the flute?',
    category: 'Songs & Melody',
    answer: '• *Zara Zara* (*RHTDM*)\n• *Lag Ja Gale* (*Woh Kaun Thi*)\n• *Yeh Shaam Mastani*\n• *Chupke Chupke Raat Din*\n• *Tere Bina Zindagi Se*\n• *Moh Moh Ke Dhaage*.',
    keywords: ['beautiful bollywood flute songs', 'most soothing film songs flute'],
    relatedIds: ['sng_easiest_beginners', 'rec_romantic_bansuri']
  },
  {
    id: 'rec_romantic_bansuri',
    question: 'Which romantic songs are suitable for Bansuri?',
    category: 'Songs & Melody',
    answer: '• *Pee Loon* (*OUATIM*)\n• *Kesariya* (*Brahmastra*)\n• *Tum Hi Ho*\n• *Pehla Nasha*\n• *Tujhe Dekha To Yeh Jaana Sanam*\n• *Raataan Lambiyan*.',
    keywords: ['romantic songs bansuri', 'love songs flute'],
    relatedIds: ['rec_beautiful_flute_songs', 'sng_require_meend']
  },
  {
    id: 'rec_devotional_film_songs',
    question: 'Which devotional film songs are easy to play?',
    category: 'Songs & Melody',
    answer: '• *Itni Shakti Hame Dena Data*\n• *O Palanhare* (*Lagaan*)\n• *Yashomati Maiya Se Bole Nandlala*\n• *Achyutam Keshavam*\n• *Badi Der Bhai Nandlala*.',
    keywords: ['devotional film songs flute', 'bhajan film songs flute'],
    relatedIds: ['rg_list_devotional', 'sng_easiest_beginners']
  },
  {
    id: 'rec_patriotic_songs',
    question: 'Which patriotic songs can be played on flute?',
    category: 'Songs & Melody',
    answer: '• *Vande Mataram* (*Sujalam Sufalam*)\n• *Ae Watan* (*Raazi*)\n• *Kar Chale Hum Fida*\n• *Aye Mere Watan Ke Logo*\n• *Teri Mitti* (*Kesari*).',
    keywords: ['patriotic songs flute', 'national songs bansuri', 'vande mataram flute'],
    relatedIds: ['rg_desh_overview', 'sng_ideal_stage']
  },
  {
    id: 'rec_old_bollywood_beginner',
    question: 'Which old classic Bollywood songs are beginner-friendly?',
    category: 'Songs & Melody',
    answer: '• *Hai Apna Dil To Aawara*\n• *Chhookar Mere Manko*\n• *Yeh Shaam Mastani*\n• *Lag Ja Gale*\n• *Ek Pyar Ka Nagma Hai*.',
    keywords: ['old bollywood beginner songs', 'retro hindi songs flute'],
    relatedIds: ['sng_easiest_beginners', 'rec_beautiful_flute_songs']
  },
  {
    id: 'rec_modern_bollywood_flute',
    question: 'Which modern Bollywood songs work well on flute?',
    category: 'Songs & Melody',
    answer: '• *Kesariya* (*Brahmastra*)\n• *Apna Bana Le* (*Bhediya*)\n• *Raataan Lambiyan* (*Shershaah*)\n• *Shayad* (*Love Aaj Kal*)\n• *Gehraiyaan Title Track*.',
    keywords: ['modern bollywood songs flute', 'new hindi songs bansuri'],
    relatedIds: ['rec_romantic_bansuri', 'sng_suitable_intermediate']
  },
  {
    id: 'rec_solo_flute_songs',
    question: 'Which songs are suitable for solo flute without backing tracks?',
    category: 'Songs & Melody',
    answer: '*Lag Ja Gale*, *Moh Moh Ke Dhaage*, *Chupke Chupke Raat Din*, and *Roz Roz Aankhon Tale* sound rich and complete even played completely solo.',
    keywords: ['solo flute songs', 'unaccompanied flute melodies'],
    relatedIds: ['prac_without_accompaniment', 'rec_beautiful_flute_songs']
  },
  {
    id: 'rec_concert_performed_songs',
    question: 'Which songs are commonly performed at flute concerts?',
    category: 'Songs & Melody',
    answer: '*Vaishnav Jan To*, *Vande Mataram*, *Krishna Nee Begane Baro*, *Lag Ja Gale*, and *Dhun in Raag Mishra Kafi*.',
    keywords: ['concert performed flute songs', 'famous performance pieces'],
    relatedIds: ['sng_ideal_stage', 'perf_prepare_live']
  },
  {
    id: 'rec_wedding_songs',
    question: 'Which songs are suitable for wedding performances?',
    category: 'Songs & Melody',
    answer: '• *Din Shagna Da*\n• *Madhanya*\n• *Mangalyam / Tere Ore*\n• *Khabar Nahi* / *Kudmayee*\n• *Dulhe Ka Sehra*.',
    keywords: ['wedding songs flute', 'shaadi flute performance'],
    relatedIds: ['rec_romantic_bansuri', 'sng_ideal_stage']
  },

  // ==========================================
  // 🎼 CLASSICAL CONNECTION TO BOLLYWOOD
  // ==========================================
  {
    id: 'cc_yaman_songs',
    question: 'Which Bollywood songs are based on Raag Yaman?',
    category: 'Music Theory',
    answer: '• *Ehsan Tera Hoga Mujh Par*\n• *Jab Deep Jale Aana*\n• *Inhi Logon Ne* (*Pakeezah*)\n• *Ghar Se Nikalte Hi*\n• *Aap Ki Ankhon Mein Kuch*.',
    keywords: ['bollywood songs raag yaman', 'yaman based film songs'],
    relatedIds: ['rg_yaman', 'thaat_kalyan_ragas']
  },
  {
    id: 'cc_bhupali_songs',
    question: 'Which Bollywood songs are based on Raag Bhupali?',
    category: 'Music Theory',
    answer: '• *Pee Loon* (*Once Upon a Time in Mumbaai*)\n• *Jyoti Kalash Jhalke*\n• *Dekha Ek Khwab To Yeh Silsile Huaye*\n• *Pankh Hote To Ud Aati Re*.',
    keywords: ['bollywood songs raag bhupali', 'bhupali based film songs'],
    relatedIds: ['rg_bhupali', 'thaat_bilawal_ragas']
  },
  {
    id: 'cc_kafi_songs',
    question: 'Which Bollywood songs are based on Raag Kafi?',
    category: 'Music Theory',
    answer: '• *Pyar Kiya To Darna Kya*\n• *Kahiin Deep Jale Kahiin Dil*\n• *Ye Desh Hai Veer Jawanon Ka*\n• *Tumhi Meri Mandir*.',
    keywords: ['bollywood songs raag kafi', 'kafi based film songs'],
    relatedIds: ['th_kafi', 'thaat_kafi_ragas']
  },
  {
    id: 'cc_bhairavi_songs',
    question: 'Which Bollywood songs are based on Raag Bhairavi?',
    category: 'Music Theory',
    answer: '• *Mile Sur Mera Tumhara*\n• *Laga Chunari Mein Daag*\n• *Awaara Hoon*\n• *Phool Geend Joshi*: classical evergreen tracks!',
    keywords: ['bollywood songs raag bhairavi', 'bhairavi based film songs'],
    relatedIds: ['th_bhairavi', 'rg_list_devotional']
  },
  {
    id: 'cc_desh_songs',
    question: 'Which Bollywood songs are based on Raag Desh?',
    category: 'Music Theory',
    answer: '• *Vande Mataram* (*National Song*)\n• *Aap Ki Khatir*\n• *Bekas Pe Karam Keejiye*\n• *Pyar Hua Iqrar Hua*.',
    keywords: ['bollywood songs raag desh', 'desh based film songs'],
    relatedIds: ['rg_desh_overview', 'rec_patriotic_songs']
  },
  {
    id: 'cc_bageshri_songs',
    question: 'Which Bollywood songs are based on Raag Bageshri?',
    category: 'Music Theory',
    answer: '• *Radha Na Bole Na Bole*\n• *Bedardi Balma Tujhko*\n• *Jaane Kahan Gaye Wo Din*\n• *Aaja Re Pardesi*.',
    keywords: ['bollywood songs raag bageshri', 'bageshri based film songs'],
    relatedIds: ['rg_bageshri_overview', 'rasa_romantic']
  },
  {
    id: 'cc_durga_songs',
    question: 'Which Bollywood songs are based on Raag Durga?',
    category: 'Music Theory',
    answer: '• *Geet Gaya Patharon Ne*\n• *Chanda Re Ja Re Ja Re*\n• *Bhoole Se Mohabbat Kar Baithe*.',
    keywords: ['bollywood songs raag durga', 'durga based film songs'],
    relatedIds: ['rg_durga_overview', 'thaat_bilawal_ragas']
  },
  {
    id: 'cc_kedar_songs',
    question: 'Which Bollywood songs are based on Raag Kedar?',
    category: 'Music Theory',
    answer: '• *Bekas Pe Karam Keejiye*\n• *Aap Ki Ankhon Mein Kuch*\n• *Humko Man Ki Shakti Dena*\n• *Darshan Do Ghanshyam*.',
    keywords: ['bollywood songs raag kedar', 'kedar based film songs'],
    relatedIds: ['thaat_kalyan_ragas', 'rg_list_devotional']
  },
  {
    id: 'cc_how_raagas_influence',
    question: 'How do Raagas influence Bollywood music composition?',
    category: 'Music Theory',
    answer: 'Legendary composers (Naushad, SD Burman, RD Burman, AR Rahman) used Raag note structures and emotional moods as melodic foundations for iconic hit film songs.',
    keywords: ['how raagas influence bollywood', 'classical influence on cinema'],
    relatedIds: ['icm_bollywood_without_classical', 'cc_yaman_songs']
  },
  {
    id: 'cc_learning_raagas_benefits',
    question: 'Can learning Raagas improve my Bollywood playing?',
    category: 'Music Theory',
    answer: 'Yes! Raaga training gives you deep pitch mastery, automatic ornament placement (Meend/Khatka), and instant ear-recognition of complex song phrases.',
    keywords: ['learning raagas improves bollywood', 'raaga training benefits'],
    relatedIds: ['icm_why_learn_classical', 'bol_classical_before_bollywood']
  },

  // ==========================================
  // 🎤 PERFORMANCE & LIVE PLAYING
  // ==========================================
  {
    id: 'perf_confident_playing',
    question: 'How do I perform a Bollywood song confidently?',
    category: 'Performance',
    answer: '1. Master the song completely with a backing track at home.\n2. Do 3 slow breath warm-ups before stepping up.\n3. Focus on your heart tone rather than fear of mistakes.',
    keywords: ['perform confidently', 'stage confidence flute'],
    relatedIds: ['perf_avoid_stage_fear', 'perf_prepare_live']
  },
  {
    id: 'perf_avoid_stage_fear',
    question: 'How do I avoid stage fear while playing flute?',
    category: 'Performance',
    answer: 'Stage nervousness causes dry mouth and shallow breath. Take 5 deep belly breaths, drink warm water, and smile at the audience before taking your first note breath.',
    keywords: ['avoid stage fear', 'flute stage fright tips'],
    relatedIds: ['perf_confident_playing', 'br_breath_control']
  },
  {
    id: 'perf_memorize_entire_song',
    question: 'Should I memorize the entire song for performance?',
    category: 'Performance',
    answer: 'Yes! Performing without looking at notation sheets lets you connect visually and emotionally with your listeners.',
    keywords: ['memorize song performance', 'play from memory live'],
    relatedIds: ['sng_memorize_song', 'perf_confident_playing']
  },
  {
    id: 'perf_prepare_live',
    question: 'How do I prepare for a live flute performance?',
    category: 'Performance',
    answer: '• Test your microphone soundcheck with Tanpura/backing track.\n• Warm up fingers with 5 minutes of long Sa notes.\n• Have a backup flute ready.',
    keywords: ['prepare live performance', 'flute stage checklist'],
    relatedIds: ['perf_avoid_stage_fear', 'rec_mic_best']
  },
  {
    id: 'perf_recover_missed_note',
    question: 'How do I recover gracefully if I miss a note on stage?',
    category: 'Performance',
    answer: 'Never stop playing or grimace! Continue seamlessly into the next beat with a subtle Meend glide—most listeners won\'t even notice!',
    keywords: ['recover missed note stage', 'stage mistake recovery'],
    relatedIds: ['perf_confident_playing', 'sng_making_mistakes']
  },
  {
    id: 'perf_improvise_live',
    question: 'Should I improvise during a live song performance?',
    category: 'Performance',
    answer: 'Keep the main Mukhda simple and recognizable, then add subtle improvisations (Kan Swaras or short Alap intro) in the interludes.',
    keywords: ['improvise live performance', 'flute song improvisation'],
    relatedIds: ['tech_decorate_melodies', 'alap_what_is']
  },
  {
    id: 'perf_end_gracefully',
    question: 'How do I end a Bollywood song gracefully?',
    category: 'Performance',
    answer: 'Conclude with a slow fading Meend landing on the root note (Sa), letting the breath taper off gently into silence (decrescendo).',
    keywords: ['end song gracefully', 'flute song ending technique'],
    relatedIds: ['tech_control_dynamics', 'perf_engage_audience']
  },
  {
    id: 'perf_engage_audience',
    question: 'How do I engage the audience during a performance?',
    category: 'Performance',
    answer: 'Maintain soft eye contact, express the song\'s emotion through your body language, and play recognizable melodic hooks warmheartedly.',
    keywords: ['engage audience flute', 'stage presence flutist'],
    relatedIds: ['perf_confident_playing', 'perf_end_gracefully']
  },
  {
    id: 'perf_use_background_music',
    question: 'Should I use background music or backing tracks?',
    category: 'Performance',
    answer: 'Yes! High-quality Tabla or acoustic guitar backing tracks provide a rich musical bed that makes solo flute sound professional.',
    keywords: ['use background music stage', 'flute backing track live'],
    relatedIds: ['prac_with_karaoke', 'play_along_original']
  },
  {
    id: 'perf_best_tempo_live',
    question: 'Which tempo is best for live performances?',
    category: 'Performance',
    answer: 'Play slightly broader (2–3 BPM slower) than studio tracks. Live room reverberation sounds sweeter when notes have time to breathe.',
    keywords: ['best tempo live performance', 'live performance speed'],
    relatedIds: ['perf_prepare_live', 'prob_maintain_tempo']
  },

  // ==========================================
  // 🎧 PLAYING ALONG & TRANSPOSITION
  // ==========================================
  {
    id: 'play_along_original',
    question: 'How do I play along with the original song recording?',
    category: 'Performance',
    answer: '1. Identify the key scale of the singer\'s track.\n2. Choose the matching Bansuri scale.\n3. Put on headphones and match your pitch to the vocal line.',
    keywords: ['play along original song', 'jamming with song'],
    relatedIds: ['play_find_scale', 'play_match_singer_pitch']
  },
  {
    id: 'play_find_scale',
    question: 'How do I find a song\'s scale or key signature?',
    category: 'Performance',
    answer: 'Play the root note (Sa) on your flute while the song chorus plays. The scale where your Sa blends seamlessly with the background chord is the song\'s key.',
    keywords: ['find song scale', 'identify song key flute'],
    relatedIds: ['play_along_original', 'play_transpose_song']
  },
  {
    id: 'play_transpose_song',
    question: 'How do I transpose a song to my flute scale?',
    category: 'Performance',
    answer: 'Transposition on Bansuri is effortless! If you know the relative Swara notation (`S R G M P`), playing those exact fingerings on ANY scale flute automatically transposes the song.',
    keywords: ['transpose song to flute', 'flute transposition'],
    relatedIds: ['play_find_scale', 'bol_which_scale_best']
  },
  {
    id: 'play_match_singer_pitch',
    question: 'How do I match the singer\'s pitch on flute?',
    category: 'Performance',
    answer: 'Listen to the root resting note of the singer\'s chorus phrase and match it to your flute\'s Sa or Pa using micro-breath tuning.',
    keywords: ['match singer pitch', 'singing pitch matching flute'],
    relatedIds: ['play_along_original', 'ear_how_to_train']
  },
  {
    id: 'play_different_key_original',
    question: 'What if the original song is in a different key than my flute?',
    category: 'Performance',
    answer: 'Either transpose your relative Swara fingerings to your flute scale, or use a pitch-shifter mobile app to shift the original mp3 key to match your flute!',
    keywords: ['original song different key', 'pitch shift original audio'],
    relatedIds: ['play_transpose_song', 'play_apps_slow_down']
  },
  {
    id: 'play_slow_down_practice',
    question: 'Can I slow down a song for practice without changing pitch?',
    category: 'Performance',
    answer: 'Yes! Use audio apps like *Anytune*, *Amazing Slow Downer*, or YouTube\'s playback speed settings (0.5x or 0.75x) to practice tricky phrases.',
    keywords: ['slow down song practice', 'slow motion audio practice'],
    relatedIds: ['play_apps_slow_down', 'sng_practice_slowly']
  },
  {
    id: 'play_apps_slow_down',
    question: 'Which apps help slow down music for flute practice?',
    category: 'Performance',
    answer: 'Top recommended apps:\n• **Anytune** (iOS/Android)\n• **Amazing Slow Downer**\n• **Moises.ai** (Isolates flute/vocal tracks)\n• **VLC Player** / **YouTube Playback Speed**.',
    keywords: ['apps slow down music', 'flute practice apps', 'moises app'],
    relatedIds: ['play_slow_down_practice', 'play_along_original']
  },
  {
    id: 'play_practice_difficult_passages',
    question: 'How do I practice difficult song passages repeatedly?',
    category: 'Performance',
    answer: 'Use the A-B loop feature in audio apps to endlessly repeat the target 4-second section at 60% speed while you play along.',
    keywords: ['practice difficult passages loop', 'a b loop audio practice'],
    relatedIds: ['play_apps_slow_down', 'sng_making_mistakes']
  },
  {
    id: 'play_headphones_practice',
    question: 'Should I use headphones while practicing along with tracks?',
    category: 'Performance',
    answer: 'Yes! Use open-back or single-ear headphone setups so you can hear both the backing track and your flute\'s live acoustic resonance clearly.',
    keywords: ['use headphones practice', 'headphones flute playback'],
    relatedIds: ['play_along_original', 'rec_record_covers']
  },

  // ==========================================
  // 📹 RECORDING & SHARING
  // ==========================================
  {
    id: 'rec_record_covers',
    question: 'How do I record flute cover videos for social media?',
    category: 'Recording & Audio',
    answer: '1. Play along with a backing track using headphones.\n2. Record high-quality audio on a mic/phone app.\n3. Combine video and audio in an editing app.',
    keywords: ['record flute covers', 'flute youtube cover', 'instagram flute reel'],
    relatedIds: ['rec_mic_best', 'rec_sync_audio_video']
  },
  {
    id: 'rec_mic_best',
    question: 'Which microphone is best for recording Bansuri?',
    category: 'Recording & Audio',
    answer: 'A condenser microphone like the **Rode NT1-A**, **Audio-Technica AT2020**, or a USB mic like **Blue Yeti** captures the delicate breath and acoustic resonance of bamboo beautifully.',
    keywords: ['best mic for flute', 'bansuri recording microphone'],
    relatedIds: ['rec_audio_quality', 'rec_record_covers']
  },
  {
    id: 'rec_reduce_background_noise',
    question: 'How do I reduce background noise during recording?',
    category: 'Recording & Audio',
    answer: 'Record in a quiet carpeted room with soft furnishings (curtains/mattresses) to absorb echoes, and place the microphone 12–18 inches away from the blowing hole slightly off-axis.',
    keywords: ['reduce background noise flute', 'echo reduction recording'],
    relatedIds: ['rec_mic_best', 'rec_audio_quality']
  },
  {
    id: 'rec_camera_angle',
    question: 'Which camera angle is best for filming flute playing?',
    category: 'Recording & Audio',
    answer: 'A side-angle or 45-degree front shot at chest level clearly showcases your lip embouchure, finger placement, and flute posture.',
    keywords: ['camera angle flute video', 'filming flute posture'],
    relatedIds: ['rec_record_covers', 'rec_editing_software']
  },
  {
    id: 'rec_audio_quality',
    question: 'How do I improve flute audio recording quality?',
    category: 'Recording & Audio',
    answer: 'Add a subtle touch of **Reverb** (hall reverb) and light EQ (boosting warm low-mids around 300Hz) in your audio editor to recreate cathedral acoustic sweetness.',
    keywords: ['improve audio quality flute', 'flute reverb eq settings'],
    relatedIds: ['rec_mic_best', 'rec_editing_software']
  },
  {
    id: 'rec_sync_audio_video',
    question: 'How do I sync recorded audio and video cleanly?',
    category: 'Recording & Audio',
    answer: 'Clap your hands loudly on camera before playing! Use that sharp clap spike on the audio waveform to align your studio audio with video perfectly.',
    keywords: ['sync audio video flute', 'align flute audio video'],
    relatedIds: ['rec_editing_software', 'rec_record_covers']
  },
  {
    id: 'rec_youtube_covers',
    question: 'Can I upload flute covers to YouTube without copyright strikes?',
    category: 'Recording & Audio',
    answer: 'Yes! Instrumental covers are generally allowed under YouTube Content ID policy; ad revenue may be shared with the original music publishers without taking down your video.',
    keywords: ['upload flute covers youtube', 'copyright flute cover'],
    relatedIds: ['rec_record_covers', 'rec_editing_software']
  },
  {
    id: 'rec_editing_software',
    question: 'Which editing software is beginner-friendly for flute videos?',
    category: 'Recording & Audio',
    answer: '• Mobile: **CapCut**, **VN Video Editor**, **InShot**\n• Desktop: **DaVinci Resolve**, **Premiere Rush**, **Audacity** (for audio tweaking).',
    keywords: ['editing software flute', 'capcut vn editor flute'],
    relatedIds: ['rec_record_covers', 'rec_sync_audio_video']
  },
  {
    id: 'rec_constructive_feedback',
    question: 'How do I receive constructive feedback on my flute playing?',
    category: 'Recording & Audio',
    answer: 'Share short 30-second video clips in dedicated flute communities (like FluteSangam forum or teacher review groups) specifying what area (pitch, rhythm, Meend) you want critiqued.',
    keywords: ['get constructive feedback', 'flute teacher critique'],
    relatedIds: ['prac_record_practice', 'rec_record_covers']
  },

  // ==========================================
  // 🌟 POPULAR BOLLYWOOD RECOMMENDATION GUIDES
  // ==========================================
  {
    id: 'rec_complete_beginners_guide',
    question: 'Which Bollywood songs are recommended for complete beginners?',
    category: 'Songs & Melody',
    answer: 'Start with 3 iconic, forgiving melodies:\n1. *Hai Apna Dil To Aawara* (simple major notes)\n2. *Pee Loon* (smooth pentatonic flow)\n3. *Lag Ja Gale* (slow expressive tempo).',
    keywords: ['songs complete beginners', 'first bollywood songs to learn'],
    relatedIds: ['sng_easiest_beginners', 'bol_best_for_beginners']
  },
  {
    id: 'rec_g_natural_easy_songs',
    question: 'Which Bollywood songs are easy to play on G Natural flute?',
    category: 'Songs & Melody',
    answer: '• *Zara Zara*\n• *Yeh Shaam Mastani*\n• *Lag Ja Gale*\n• *Chhookar Mere Manko*\n• *Pee Loon*.',
    keywords: ['easy g natural songs', 'g natural flute song list'],
    relatedIds: ['bol_g_natural_flute', 'rec_beautiful_flute_songs']
  },
  {
    id: 'rec_breath_control_songs',
    question: 'Which Bollywood songs help improve breath control stamina?',
    category: 'Songs & Melody',
    answer: 'Slow legato tracks like *Yeh Kahan Aa Gaye Hum*, *Roz Roz Aankhon Tale*, and *Chupke Chupke Raat Din* build deep diaphragm endurance.',
    keywords: ['breath control songs', 'stamina building songs'],
    relatedIds: ['sng_good_breath_control', 'br_breath_control']
  },
  {
    id: 'rec_middle_octave_songs',
    question: 'Which Bollywood songs use mostly middle octave notes?',
    category: 'Songs & Melody',
    answer: '• *Lag Ja Gale*\n• *Hai Apna Dil To Aawara*\n• *Ek Pyar Ka Nagma Hai*\n• *Aaye Ho Meri Zindagi Mein*.',
    keywords: ['middle octave songs', 'madhya saptak bollywood songs'],
    relatedIds: ['sap_middle_octave', 'sng_easiest_beginners']
  },
  {
    id: 'rec_upper_octave_songs',
    question: 'Which Bollywood songs include upper octave practice?',
    category: 'Songs & Melody',
    answer: '• *Kesariya* (Antara goes to Taar Sa/Re)\n• *Kal Ho Naa Ho*\n• *Tum Hi Ho*\n• *Ghar More Pardesiya*.',
    keywords: ['upper octave songs', 'taar saptak songs flute'],
    relatedIds: ['sap_upper_difficult', 'ns_upper_octave']
  },
  {
    id: 'rec_classical_inspired_film_songs',
    question: 'Which Bollywood songs are inspired by Indian classical Raagas?',
    category: 'Songs & Melody',
    answer: '• *Ehsan Tera Hoga Mujh Par* (Raag Yaman)\n• *Pee Loon* (Raag Bhupali)\n• *Vande Mataram* (Raag Desh)\n• *Radha Na Bole* (Raag Bageshri)\n• *Laga Chunari Mein Daag* (Raag Bhairavi).',
    keywords: ['classical inspired film songs', 'raaga based bollywood songs'],
    relatedIds: ['cc_yaman_songs', 'cc_bhupali_songs', 'cc_bhairavi_songs']
  },
  {
    id: 'rec_flute_competition_songs',
    question: 'Which Bollywood songs are ideal for flute competitions?',
    category: 'Songs & Melody',
    answer: 'Showcase pieces that combine slow soulful Alap-style intros with fast technical passages, like *Ghar More Pardesiya*, *Albela Sajan*, or *Mohe Rang Do Laal*.',
    keywords: ['flute competition songs', 'contest performance songs'],
    relatedIds: ['sng_suitable_advanced', 'sng_ideal_stage']
  },
  {
    id: 'rec_live_event_requested_songs',
    question: 'Which Bollywood songs are most requested at live events?',
    category: 'Songs & Melody',
    answer: '1. *Kesariya*\n2. *Lag Ja Gale*\n3. *Pee Loon*\n4. *Zara Zara*\n5. *Tujhe Dekha To Yeh Jaana Sanam*\n6. *Sujalam Sufalam (Vande Mataram)*.',
    keywords: ['live event requested songs', 'popular request songs flute'],
    relatedIds: ['sng_ideal_stage', 'rec_romantic_bansuri']
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
