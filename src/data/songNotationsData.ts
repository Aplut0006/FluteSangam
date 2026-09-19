export interface PhraseUnit {
  lyric: string;
  sargam: string;
  western: string;
}

export interface SongPhraseDetail {
  phraseNumber: number;
  lyric: string;
  sargamNotes: string;
  westernNotes: string;
  units: PhraseUnit[];
  guidance: string;
}

export interface SongNotationItem {
  id: string;
  slug: string;
  title: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  suggestedFlute: string;
  startingSwar: string;
  highestSwar: string;
  mainChallenge: string;
  practiceSpeed: string;
  notationFormats: string;
  description: string;
  status: string;
  publishedDate: string;
  updatedDate: string;
  canonicalUrl: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  quickInfo: {
    difficulty: string;
    melodyType: string;
    suggestedFlute: string;
    startingSwar: string;
    highestSwar: string;
    mainChallenge: string;
    practiceSpeed: string;
  };
  legend: Array<{ symbol: string; meaning: string }>;
  phrases: SongPhraseDetail[];
  sargamPhrases: Array<{ phraseNumber: number; notes: string; lyric?: string }>;
  westernPhrases: Array<{ phraseNumber: number; notes: string; lyric?: string }>;
  phraseGuidance: Array<{ phraseNumber: number; guidance: string }>;
  practiceMethod: string[];
  commonMistakes: string[];
  usefulTools: Array<{ name: string; url: string; viewKey: string }>;
}

export const PUBLISHED_SONG_NOTATIONS: SongNotationItem[] = [
  {
    id: 'jingle-bells-flute-notes',
    slug: 'jingle-bells-flute-notes',
    title: 'Jingle Bells Flute Notes',
    type: 'Holiday & Celebration Melody',
    difficulty: 'Beginner',
    suggestedFlute: 'Any correctly tuned bansuri; C Medium is recommended for beginners',
    startingSwar: 'Ga (G)',
    highestSwar: 'Middle Dha (D)',
    mainChallenge: 'Clean transitions between lower octave (.P, .D, .N) and crisp triple notes (G G G)',
    practiceSpeed: 'Slow and steady, with bouncy rhythm',
    notationFormats: 'Song Notation (Sargam & Western) with Lyrics',
    description: 'Learn Jingle Bells on flute or bansuri with beginner-friendly Sargam and Western notes for the chorus and verse, including octave markings, phrase guidance and practical playing tips.',
    status: 'Song Notation',
    publishedDate: '2026-09-19',
    updatedDate: '2026-09-19',
    canonicalUrl: 'https://flutesangam.com/notations/jingle-bells-flute-notes',
    h1: 'Jingle Bells Flute Notes – Easy Sargam & Western Notes',
    metaTitle: 'Jingle Bells Flute Notes: Easy Sargam & Western Notes',
    metaDescription: 'Learn Jingle Bells on flute or bansuri with easy Sargam and Western notes for the chorus and verse, plus octave guidance and beginner practice tips.',
    intro: 'Jingle Bells is one of the most cheerful melodies for flute and bansuri beginners. It helps you develop crisp tonguing on repeated notes like G G G, as well as smooth movement between the lower octave (.P, .D, .N) and middle octave notes.',
    quickInfo: {
      difficulty: 'Beginner',
      melodyType: 'Holiday & Celebration Melody',
      suggestedFlute: 'C Medium or any comfortable flute key',
      startingSwar: 'Ga (G)',
      highestSwar: 'Middle Dha (D)',
      mainChallenge: 'Crisp repeated notes and lower octave (.P, .D, .N) transitions',
      practiceSpeed: 'Slow and steady, with bouncy rhythm'
    },
    legend: [
      { symbol: '.P .D .N', meaning: 'lower octave note' },
      { symbol: 'S R G M P D N', meaning: 'middle octave note' },
      { symbol: '—', meaning: 'hold the preceding note' },
      { symbol: '|', meaning: 'phrase division' },
      { symbol: '/', meaning: 'breathe' }
    ],
    phrases: [
      {
        phraseNumber: 1,
        lyric: 'Jingle bells, jingle bells, jingle all the way',
        sargamNotes: 'G G G — | G G G — | G P | S R G — /',
        westernNotes: 'E E E — | E E E — | E G | C D E — /',
        units: [
          { lyric: 'Jin-gle bells', sargam: 'G G G —', western: 'E E E —' },
          { lyric: 'jin-gle bells', sargam: 'G G G —', western: 'E E E —' },
          { lyric: 'jin-gle', sargam: 'G P', western: 'E G' },
          { lyric: 'all the way', sargam: 'S R G —', western: 'C D E —' }
        ],
        guidance: 'Play the three Ga (G) notes cleanly with light tonguing or quick finger taps. Make the jump to Pa (P) smooth, then step down to Sa (S) and rise to Ga (G).'
      },
      {
        phraseNumber: 2,
        lyric: 'Oh, what fun it is to ride in a one-horse open sleigh, hey!',
        sargamNotes: 'M M M | M G G G | G G R R | R G R | P — /',
        westernNotes: 'F F F | F E E E | E E D D | D E D | G — /',
        units: [
          { lyric: 'Oh what fun', sargam: 'M M M', western: 'F F F' },
          { lyric: 'it is to ride', sargam: 'M G G G', western: 'F E E E' },
          { lyric: 'in a one-horse', sargam: 'G G R R', western: 'E E D D' },
          { lyric: 'o-pen sleigh', sargam: 'R G R', western: 'D E D' },
          { lyric: 'hey!', sargam: 'P —', western: 'G —' }
        ],
        guidance: 'Play three crisp Ma notes (M M M), cascade through M G G G, step down to G G R R and R G R, concluding with an accented Pa (P).'
      },
      {
        phraseNumber: 3,
        lyric: 'Jingle bells, jingle bells, jingle all the way',
        sargamNotes: 'G G G — | G G G — | G P | S R G — /',
        westernNotes: 'E E E — | E E E — | E G | C D E — /',
        units: [
          { lyric: 'Jin-gle bells', sargam: 'G G G —', western: 'E E E —' },
          { lyric: 'jin-gle bells', sargam: 'G G G —', western: 'E E E —' },
          { lyric: 'jin-gle', sargam: 'G P', western: 'E G' },
          { lyric: 'all the way', sargam: 'S R G —', western: 'C D E —' }
        ],
        guidance: 'Repeat the opening hook with confidence and a cheerful, bouncy rhythmic feel.'
      },
      {
        phraseNumber: 4,
        lyric: 'Oh, what fun it is to ride in a one-horse open sleigh',
        sargamNotes: 'M M M | M G G G | G G P P | G R | S —',
        westernNotes: 'F F F | F E E E | E E G G | E D | C —',
        units: [
          { lyric: 'Oh what fun', sargam: 'M M M', western: 'F F F' },
          { lyric: 'it is to ride', sargam: 'M G G G', western: 'F E E E' },
          { lyric: 'in a one-horse', sargam: 'G G P P', western: 'E E G G' },
          { lyric: 'o-pen', sargam: 'G R', western: 'E D' },
          { lyric: 'sleigh', sargam: 'S —', western: 'C —' }
        ],
        guidance: 'Play M M M and M G G G, then rise to double Pa (G G P P) before resolving gracefully down through G R to Sa (S).'
      },
      {
        phraseNumber: 5,
        lyric: 'Dashing through the snow, in a one-horse open sleigh',
        sargamNotes: 'P G R S .P | P P | P G R S | .D — /',
        westernNotes: 'G E D C G(low) | G G | G E D C | A(low) — /',
        units: [
          { lyric: 'Dash-ing through the snow', sargam: 'P G R S .P', western: 'G E D C G(low)' },
          { lyric: 'in a', sargam: 'P P', western: 'G G' },
          { lyric: 'one-horse o-pen', sargam: 'P G R S', western: 'G E D C' },
          { lyric: 'sleigh', sargam: '.D —', western: 'A(low) —' }
        ],
        guidance: 'Descend from middle Pa (P) through G R S to lower Mandra Pa (.P), followed by double Pa (P P), P G R S, and landing softly on lower Mandra Dha (.D).'
      },
      {
        phraseNumber: 6,
        lyric: "O'er the fields we go, laughing all the way",
        sargamNotes: '.D M G R .N | P P | G R | G — /',
        westernNotes: 'A(low) F E D B(low) | G G | E D | E — /',
        units: [
          { lyric: "O'er the fields we go", sargam: '.D M G R .N', western: 'A(low) F E D B(low)' },
          { lyric: 'laugh-ing', sargam: 'P P', western: 'G G' },
          { lyric: 'all the', sargam: 'G R', western: 'E D' },
          { lyric: 'way', sargam: 'G —', western: 'E —' }
        ],
        guidance: 'Step up from lower Dha (.D) to M G R, touch lower Ni (.N), play double Pa (P P) for "laughing", and resolve on G R G.'
      },
      {
        phraseNumber: 7,
        lyric: 'Bells on bob-tail ring, making spirits bright',
        sargamNotes: 'P G R S .P | P G R S | .D — /',
        westernNotes: 'G E D C G(low) | G E D C | A(low) — /',
        units: [
          { lyric: 'Bells on bob-tail ring', sargam: 'P G R S .P', western: 'G E D C G(low)' },
          { lyric: 'mak-ing spir-its', sargam: 'P G R S', western: 'G E D C' },
          { lyric: 'bright', sargam: '.D —', western: 'A(low) —' }
        ],
        guidance: 'Play the descent P G R S .P, then repeat P G R S for "making spirits", ensuring clean finger coverage on lower Dha (.D) for "bright".'
      },
      {
        phraseNumber: 8,
        lyric: 'What fun it is to ride and sing a sleighing song tonight, oh!',
        sargamNotes: '.D M G R .N | P P P P | D P G | R S | P —',
        westernNotes: 'A(low) F E D B(low) | G G G G | A G E | D C | G —',
        units: [
          { lyric: 'What fun it is to', sargam: '.D M G R .N', western: 'A(low) F E D B(low)' },
          { lyric: 'ride and sing a', sargam: 'P P P P', western: 'G G G G' },
          { lyric: 'sleigh-ing song', sargam: 'D P G', western: 'A G E' },
          { lyric: 'to-night', sargam: 'R S', western: 'D C' },
          { lyric: 'oh!', sargam: 'P —', western: 'G —' }
        ],
        guidance: 'Play .D M G R .N, four crisp Pa notes (P P P P), step through D P G and R S, and conclude with the lively final Pa (P).'
      }
    ],
    sargamPhrases: [
      { phraseNumber: 1, notes: 'G G G — | G G G — | G P | S R G — /', lyric: 'Jingle bells, jingle bells, jingle all the way' },
      { phraseNumber: 2, notes: 'M M M | M G G G | G G R R | R G R | P — /', lyric: 'Oh, what fun it is to ride in a one-horse open sleigh, hey!' },
      { phraseNumber: 3, notes: 'G G G — | G G G — | G P | S R G — /', lyric: 'Jingle bells, jingle bells, jingle all the way' },
      { phraseNumber: 4, notes: 'M M M | M G G G | G G P P | G R | S —', lyric: 'Oh, what fun it is to ride in a one-horse open sleigh' },
      { phraseNumber: 5, notes: 'P G R S .P | P P | P G R S | .D — /', lyric: 'Dashing through the snow, in a one-horse open sleigh' },
      { phraseNumber: 6, notes: '.D M G R .N | P P | G R | G — /', lyric: "O'er the fields we go, laughing all the way" },
      { phraseNumber: 7, notes: 'P G R S .P | P G R S | .D — /', lyric: 'Bells on bob-tail ring, making spirits bright' },
      { phraseNumber: 8, notes: '.D M G R .N | P P P P | D P G | R S | P —', lyric: 'What fun it is to ride and sing a sleighing song tonight, oh!' }
    ],
    westernPhrases: [
      { phraseNumber: 1, notes: 'E E E — | E E E — | E G | C D E — /', lyric: 'Jingle bells, jingle bells, jingle all the way' },
      { phraseNumber: 2, notes: 'F F F | F E E E | E E D D | D E D | G — /', lyric: 'Oh, what fun it is to ride in a one-horse open sleigh, hey!' },
      { phraseNumber: 3, notes: 'E E E — | E E E — | E G | C D E — /', lyric: 'Jingle bells, jingle bells, jingle all the way' },
      { phraseNumber: 4, notes: 'F F F | F E E E | E E G G | E D | C —', lyric: 'Oh, what fun it is to ride in a one-horse open sleigh' },
      { phraseNumber: 5, notes: 'G E D C G(low) | G G | G E D C | A(low) — /', lyric: 'Dashing through the snow, in a one-horse open sleigh' },
      { phraseNumber: 6, notes: 'A(low) F E D B(low) | G G | E D | E — /', lyric: "O'er the fields we go, laughing all the way" },
      { phraseNumber: 7, notes: 'G E D C G(low) | G E D C | A(low) — /', lyric: 'Bells on bob-tail ring, making spirits bright' },
      { phraseNumber: 8, notes: 'A(low) F E D B(low) | G G G G | A G E | D C | G —', lyric: 'What fun it is to ride and sing a sleighing song tonight, oh!' }
    ],
    phraseGuidance: [
      { phraseNumber: 1, guidance: 'Play the three Ga (G) notes cleanly with light tonguing or quick finger taps. Make the jump to Pa (P) smooth, then step down to Sa (S) and rise to Ga (G).' },
      { phraseNumber: 2, guidance: 'Play three crisp Ma notes (M M M), cascade through M G G G, step down to G G R R and R G R, concluding with an accented Pa (P).' },
      { phraseNumber: 3, guidance: 'Repeat the opening hook with confidence and a cheerful, bouncy rhythmic feel.' },
      { phraseNumber: 4, guidance: 'Play M M M and M G G G, then rise to double Pa (G G P P) before resolving gracefully down through G R to Sa (S).' },
      { phraseNumber: 5, guidance: 'Descend from middle Pa (P) through G R S to lower Mandra Pa (.P), followed by double Pa (P P), P G R S, and landing softly on lower Mandra Dha (.D).' },
      { phraseNumber: 6, guidance: 'Step up from lower Dha (.D) to M G R, touch lower Ni (.N), play double Pa (P P) for "laughing", and resolve on G R G.' },
      { phraseNumber: 7, guidance: 'Play the descent P G R S .P, then repeat P G R S for "making spirits", ensuring clean finger coverage on lower Dha (.D) for "bright".' },
      { phraseNumber: 8, guidance: 'Play .D M G R .N, four crisp Pa notes (P P P P), step through D P G and R S, and conclude with the lively final Pa (P).' }
    ],
    practiceMethod: [
      'Sing or hum the song lyrics while clapping the bouncy 4/4 rhythm.',
      'Practice the famous opening chorus (Phrases 1 to 4) first until note transitions feel effortless.',
      'Practice the descending pattern P G R S separately to ensure each finger closes cleanly without leaks.',
      'Soften your breath on lower octave notes (.P, .D, .N) to produce a warm, deep tone without overblowing.',
      'Combine the verse and chorus together at a slow, steady tempo before speeding up.'
    ],
    commonMistakes: [
      'Blowing too hard on lower octave notes (.P, .D, .N), causing squeaks or unwanted octave jumps',
      'Blurring repeated notes (G G G) together without clear tongue articulation or finger articulation',
      'Rushing through the fast descending line (P G R S)',
      'Lifting fingers too high above the holes on rapid note changes',
      'Forgetting to sustain held notes (marked with —) for their full rhythmic duration'
    ],
    usefulTools: [
      { name: 'Interactive Bansuri Fingering Chart', url: '/learn/fingering-chart', viewKey: 'learn_fingering_chart' },
      { name: 'Online Flute Tuner', url: '/tuner', viewKey: 'learn_tuner' },
      { name: 'Flute Note and Key Converter', url: '/tools/flute-note-key-converter', viewKey: 'note_key_converter' },
      { name: 'How to Read Bansuri Notation', url: '/learn/how-to-read-bansuri-notation', viewKey: 'how_to_read_bansuri_notation' },
      { name: 'Daily Flute Practice Guide', url: '/learn/daily-practice-guide', viewKey: 'learn_daily_practice' }
    ]
  },
  {
    id: 'happy-birthday-flute-notes',
    slug: 'happy-birthday-flute-notes',
    title: 'Happy Birthday Flute Notes',
    type: 'Traditional Celebration Melody',
    difficulty: 'Beginner',
    suggestedFlute: 'Any correctly tuned bansuri; C Medium is convenient for beginners',
    startingSwar: 'Lower Pa (.P)',
    highestSwar: 'Middle Pa (P)',
    mainChallenge: 'Lower octave .P to middle P transitions and clean rhythm',
    practiceSpeed: 'Slow and steady',
    notationFormats: 'Song Notation (Sargam & Western) with Lyrics',
    description: 'Learn to play Happy Birthday on flute or bansuri with beginner-friendly Sargam and Western notes. Follow the lyric-aligned phrases, octave markings, breathing guidance and practical tips to practise the complete melody.',
    status: 'Song Notation',
    publishedDate: '2026-09-19',
    updatedDate: '2026-09-19',
    canonicalUrl: 'https://flutesangam.com/notations/happy-birthday-flute-notes',
    h1: 'Happy Birthday Flute Notes – Easy Sargam & Western Notes',
    metaTitle: 'Happy Birthday Flute Notes: Easy Sargam & Western Notes',
    metaDescription: 'Play Happy Birthday on flute or bansuri with easy Sargam and Western notes, lyrics, octave guidance, breathing marks and beginner practice tips.',
    intro: 'Happy Birthday is a simple and familiar melody for practising note transitions, rhythm and breath control. This arrangement starts in the lower octave (.P) and extends to middle Pa (P), pairing each lyric syllable directly with its corresponding note.',
    quickInfo: {
      difficulty: 'Beginner',
      melodyType: 'Traditional celebration melody',
      suggestedFlute: 'C Medium or any comfortable flute key',
      startingSwar: 'Lower Pa (.P)',
      highestSwar: 'Middle Pa (P)',
      mainChallenge: 'Clean lower .P to middle P shifts and steady breath control',
      practiceSpeed: 'Slow and steady'
    },
    legend: [
      { symbol: '.P .D .N', meaning: 'lower octave note' },
      { symbol: 'S R G M P D N', meaning: 'middle octave note' },
      { symbol: '—', meaning: 'hold the preceding note' },
      { symbol: '|', meaning: 'phrase division' },
      { symbol: '/', meaning: 'breathe' }
    ],
    phrases: [
      {
        phraseNumber: 1,
        lyric: 'Happy Birthday to you',
        sargamNotes: '.P .P | .D .P | S — .N — /',
        westernNotes: 'G G | A G | C — B — /',
        units: [
          { lyric: 'Hap-py', sargam: '.P .P', western: 'G G' },
          { lyric: 'Birth-day', sargam: '.D .P', western: 'A G' },
          { lyric: 'to', sargam: 'S —', western: 'C —' },
          { lyric: 'you', sargam: '.N —', western: 'B —' }
        ],
        guidance: 'Begin softly on lower octave Mandra Pa (.P) with steady, warm airflow. Transition cleanly to middle Sa (S) and lower Ni (.N) without overblowing.'
      },
      {
        phraseNumber: 2,
        lyric: 'Happy Birthday to you',
        sargamNotes: '.P .P | .D .P | R — S — /',
        westernNotes: 'G G | A G | D — C — /',
        units: [
          { lyric: 'Hap-py', sargam: '.P .P', western: 'G G' },
          { lyric: 'Birth-day', sargam: '.D .P', western: 'A G' },
          { lyric: 'to', sargam: 'R —', western: 'D —' },
          { lyric: 'you', sargam: 'S —', western: 'C —' }
        ],
        guidance: 'The opening repeats on .P and .D, then rises smoothly to middle Re (R) and resolves back onto middle Sa (S).'
      },
      {
        phraseNumber: 3,
        lyric: 'Happy Birthday dear [Name]',
        sargamNotes: '.P .P | P G | S | .N .D — /',
        westernNotes: 'G G | G E | C | B A — /',
        units: [
          { lyric: 'Hap-py', sargam: '.P .P', western: 'G G' },
          { lyric: 'Birth-day', sargam: 'P G', western: 'G E' },
          { lyric: 'dear', sargam: 'S', western: 'C' },
          { lyric: '[Name]', sargam: '.N .D —', western: 'B A —' }
        ],
        guidance: 'Jump cleanly from lower Pa (.P) to middle Pa (P) – the highest swar in this arrangement. Then transition to Sa (S) on "dear", and descend from lower Ni (.N) into held lower Dha (.D) on "[Name]".'
      },
      {
        phraseNumber: 4,
        lyric: 'Happy Birthday to you',
        sargamNotes: 'M M | G S | R — S —',
        westernNotes: 'F F | E C | D — C —',
        units: [
          { lyric: 'Hap-py', sargam: 'M M', western: 'F F' },
          { lyric: 'Birth-day', sargam: 'G S', western: 'E C' },
          { lyric: 'to', sargam: 'R —', western: 'D —' },
          { lyric: 'you', sargam: 'S —', western: 'C —' }
        ],
        guidance: 'Play the two Ma (M) notes cleanly. Step down gracefully to Ga (G), Sa (S), Re (R), and conclude by holding Sa (S).'
      }
    ],
    sargamPhrases: [
      { phraseNumber: 1, notes: '.P .P | .D .P | S — .N — /', lyric: 'Happy Birthday to you' },
      { phraseNumber: 2, notes: '.P .P | .D .P | R — S — /', lyric: 'Happy Birthday to you' },
      { phraseNumber: 3, notes: '.P .P | P G | S | .N .D — /', lyric: 'Happy Birthday dear [Name]' },
      { phraseNumber: 4, notes: 'M M | G S | R — S —', lyric: 'Happy Birthday to you' }
    ],
    westernPhrases: [
      { phraseNumber: 1, notes: 'G G | A G | C — B — /', lyric: 'Happy Birthday to you' },
      { phraseNumber: 2, notes: 'G G | A G | D — C — /', lyric: 'Happy Birthday to you' },
      { phraseNumber: 3, notes: 'G G | G E | C | B A — /', lyric: 'Happy Birthday dear [Name]' },
      { phraseNumber: 4, notes: 'F F | E C | D — C —', lyric: 'Happy Birthday to you' }
    ],
    phraseGuidance: [
      {
        phraseNumber: 1,
        guidance: 'Begin softly on lower octave Mandra Pa (.P) with steady, warm airflow. Transition cleanly to middle Sa (S) and lower Ni (.N) without overblowing.'
      },
      {
        phraseNumber: 2,
        guidance: 'The opening repeats on .P and .D, then rises smoothly to middle Re (R) and resolves back onto middle Sa (S).'
      },
      {
        phraseNumber: 3,
        guidance: 'Jump cleanly from lower Pa (.P) to middle Pa (P) – the highest swar in this arrangement. Then transition to Sa (S) on "dear", and descend from lower Ni (.N) into held lower Dha (.D) on "[Name]".'
      },
      {
        phraseNumber: 4,
        guidance: 'Play the two Ma (M) notes cleanly. Step down gracefully to Ga (G), Sa (S), Re (R), and conclude by holding Sa (S).'
      }
    ],
    practiceMethod: [
      'Sing or hum the song lyrics while tapping the beat before playing.',
      'Practise each lyric phrase separately at a slow, comfortable tempo.',
      'Practise the interval jump between lower .P and middle P separately.',
      'Pay special attention to fingering Ma (M) cleanly in phrase 4.',
      'Connect phrases 1 and 2, then phrases 3 and 4.',
      'Play through all four phrases while sustaining held notes smoothly.'
    ],
    commonMistakes: [
      'Overblowing on lower octave .P, .D and .N causing pitch distortion',
      'Cutting held notes short without sustaining the full syllable duration',
      'Lifting fingers too far from the bansuri holes during the lower .P to middle P jump',
      'Rushing through phrase 3 without clear separation of descending notes',
      'Losing track of the song rhythm while concentrating on finger placement'
    ],
    usefulTools: [
      { name: 'Interactive Bansuri Fingering Chart', url: '/learn/fingering-chart', viewKey: 'learn_fingering_chart' },
      { name: 'Online Flute Tuner', url: '/tuner', viewKey: 'learn_tuner' },
      { name: 'Flute Note and Key Converter', url: '/tools/flute-note-key-converter', viewKey: 'note_key_converter' },
      { name: 'How to Read Bansuri Notation', url: '/learn/how-to-read-bansuri-notation', viewKey: 'how_to_read_bansuri_notation' },
      { name: 'Daily Flute Practice Guide', url: '/learn/daily-practice-guide', viewKey: 'learn_daily_practice' }
    ]
  }
];
