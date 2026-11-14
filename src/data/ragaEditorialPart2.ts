import { RagaEditorialEntry } from './ragaEditorialTypes';

export const RAGA_EDITORIAL_PART_2: Record<string, RagaEditorialEntry> = {
  bhimpalasi: {
    slug: 'bhimpalasi',
    ragaName: 'Raag Bhimpalasi',
    layoutVariant: 'treatise-monograph',
    accentTheme: 'amber',
    originsHeading: 'Historical Origins, The Dhanashree Lineage & Evolution of Raag Bhimpalasi',
    originsSubtitle: 'How the fusion of medieval Bhim and Palasi created Hindustani music\'s greatest afternoon masterpiece',
    originsParagraphs: [
      'Raag Bhimpalasi represents the crowning achievement of the Dhanashree-ang within the Kafi Thaat of North Indian classical music. Historically, musicological treatises from the sixteenth to eighteenth centuries—including Ahobala\'s Sangita Parijata and Bhavabhatta\'s Anupa Sangita Ratnakara—trace its evolution as a composite synthesis of two older regional ragas: Bhim and Palasi (themselves closely linked with the ancient medieval raga Dhanashree). Over centuries of Dhrupad and Khayal refinement across the Gwalior, Agra, and Kirana Gharanas, Bhimpalasi absorbed the emotional gravity of the Dhanashree family and became the definitive benchmark for afternoon ragas.',
      'Structurally, Bhimpalasi is classified as an Audav–Sampurna raga of the Kafi Thaat, employing Komal Gandhar (`g`) and Komal Nishad (`n`) alongside Shuddha Re, Ma, Pa, and Dha. Its architectural genius lies in the contrast between its five-note ascending sweep (`n, S g M P n S\'`), which omits both Rishabh (`R`) and Dhaivat (`D`), and its seven-note descending cascade (`S\' n D P, M P g M g R S`), where Dhaivat and Rishabh appear as lush, lingering stepping stones.',
      'For the bansuri player, Raag Bhimpalasi is revered for its unmatched vocal (Gayaki) expressiveness. Because the ascending leaps across `n, S g` and `P n S\'` require subtle microtonal inflections (Shrutis) and sweeping glides (Meend), Pandit Pannalal Ghosh and Pandit Hariprasad Chaurasia both considered Bhimpalasi one of the supreme tests of a flutist\'s emotional depth.'
    ],
    treatiseCallout: {
      title: 'Ati-Komal Shruti & The Ma–Sa Consonance',
      citation: 'Dhanashree-Ang Shruti Intonation in Bhimpalasi',
      insight: 'In Raag Bhimpalasi, both Komal Gandhar (`g`) and Komal Nishad (`n`) are approached from above via Shuddha Madhyam (`M g`) and Taar Sa (`S\' n`) or slightly inflected with a gentle upward pull (`n, S g M`), giving them a deeply poignant microtonal glow.'
    },
    rasaHeading: 'Emotional Rasa, Late-Afternoon Samay & Acoustic Pathos on the Bamboo Flute',
    rasaSubtitle: 'Why the third Prahar of the day (1 PM – 4 PM) awakens Karuna-Shringar (tender afternoon yearning)',
    rasaParagraphs: [
      'According to the Hindustani Samay theory, Raag Bhimpalasi is performed during the Tritiya Prahar of the day (roughly 1:00 PM to 4:00 PM)—the languid, sun-drenched hours of mid-to-late afternoon when the intensity of midday heat begins to soften into reflective stillness. Aesthetically, Bhimpalasi embodies Vipralambha Shringar (passionate, unfulfilled longing), Karuna Rasa (compassionate tenderness), and Bhakti (devotional absorption).',
      'What gives Bhimpalasi its unmistakable afternoon ache? Acoustically, the raga is governed by Shuddha Madhyam (`M`) as its Vadi (king note) and Shadja (`S`) as its Samvadi. In the lower and middle registers, every phrase gravitates toward Madhyam: the flutist launches from Mandra Komal Nishad (`n, S g M —`), holds Madhyam with a warm, pulsating breath, touches Pancham (`g M P`), and then slides back across Madhyam into Komal Ga (`M P g M g R S`). Because Re and Dha are omitted on the way up, the ascending line leaps across minor thirds (`S–g` and `P–n`), creating a breathless, upward-reaching urgency.',
      'Then, as the melody descends from Taar Sa (`S\' n D P, D M P g M g R S`), the sudden entry of Shuddha Dhaivat (`D`) and Shuddha Rishabh (`R`)—especially when `D` is touched with a gentle Meend from `n` and `R` is approached with a sighing slide from `M g R`—releases that tension like a cool breeze across a warm courtyard.'
    ],
    acousticTakeaway: 'On the bansuri, never attack Komal Ga (`g`) cold in Bhimpalasi; always touch Shuddha Ma first as a Kana-swara or glide (`n, S (M)g M —`) so Komal Ga carries its authentic vocal weight.',
    samprakriticHeading: 'Comparative Analysis: Bhimpalasi vs. Bageshree, Dhani & Patdeep',
    samprakriticSubtitle: 'Distinguishing Bhimpalasi from its closest Kafi-Thaat and Dhanashree-ang siblings',
    samprakriticIntroParagraphs: [
      'Because Bhimpalasi is the matriarch of a large family of afternoon and night ragas, flute players must clearly understand how its phraseology separates it from Raag Bageshree, Raag Dhani, and Raag Patdeep.',
      'Notice how changing a single note\'s weight or altering the seventh degree completely shifts the raga\'s identity.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Bageshree',
        alliedRagaView: 'raga_bageshree',
        sharedElements: 'Identical Kafi Thaat notes (`S R g M P D n`), Vadi Ma, Samvadi Sa, and omission of Re in ascent.',
        criticalDistinction: 'Bhimpalasi omits Dha in ascent (`n, S g M P n S\'`) and highlights Pancham prominently (`g M P`), whereas Bageshree omits Pa in ascent (`D, n, S g M D n S\'`) and centers on the Ma–Dha axis.',
        bansuriNuance: 'In Bhimpalasi, `g M P` is your central highway; in Bageshree, `g M D` is the highway and Pa is largely avoided.'
      },
      {
        alliedRagaName: 'Raag Dhani',
        sharedElements: 'Identical ascending scale (`n, S g M P n S\'`) and Dhanashree-ang bounce.',
        criticalDistinction: 'Dhani is strictly pentatonic (Audav-Audav), omitting Re and Dha in BOTH ascent and descent (`S\' n P M g S`), and has Vadi Komal Ga, whereas Bhimpalasi includes Dha and Re richly in descent (`S\' n D P M g R S`) with Vadi Ma.',
        bansuriNuance: 'When descending in Bhimpalasi, always pause expressively on Dhaivat and Rishabh (`S\' n D P` and `M g R S`) so your rendition does not shrink into Raag Dhani.'
      },
      {
        alliedRagaName: 'Raag Patdeep',
        sharedElements: 'Identical afternoon time, Audav-Sampurna structure omitting Re and Dha in ascent, and `g M P` Purvanga.',
        criticalDistinction: 'Patdeep replaces Komal Nishad (`n`) with bright Shuddha Nishad (`N`: `N, S g M P N S\'`), creating a striking contrast between Komal Ga and Shuddha Ni.',
        bansuriNuance: 'Keep your fifth finger carefully half-holed on Komal Ni (`n`) throughout Bhimpalasi.'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Bansuri Recitals & Film Melodies in Raag Bhimpalasi',
    repertoireSubtitle: 'From "Ja Ja Re Apne Mandirwa" to unforgettable melodies of Indian cinema',
    repertoireParagraphs: [
      'In Hindustani vocal music, Raag Bhimpalasi is celebrated through timeless Khayal bandishes such as "Ja Ja Re Apne Mandirwa" (Madhya-laya Teentaal), "Ab To Badi Der Bhayi," and the solemn Vilambit Khayal "Bansi Bajao." Every bansuri student should listen to how vocalists stretch the glide from `P` to `g` through `M` (`M P g M g R S`) on the Sam of Teentaal.',
      'In Indian film music, Bhimpalasi\'s soulful afternoon romance has inspired dozens of immortal songs across generations.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Ja Ja Re Apne Mandirwa" & "Ab To Badi Der Bhayi" (Traditional Teentaal Bandishes)',
        contextAndAnalysis: 'Classic compositions that anchor the Sam on Vadi Madhyam (n, S g M) and demonstrate the lush S\' n D P M P g M g R S descent.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia – Raag Bhimpalasi (Afternoon Concert Alaap & Gat)',
        contextAndAnalysis: 'Shows how to sustain deep Mandra Saptak exploration (`M, P, n, S g R S`) and execute sweeping two-octave Meends on the bansuri.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Nainon Mein Badra Chhaye" (Mera Saya) & "Kismat Se Tum Humko Mile Ho" (Pukar)',
        contextAndAnalysis: 'Madan Mohan\'s "Nainon Mein Badra Chhaye" is a textbook masterclass in Bhimpalasi phrasing, opening directly on n, S g M P g M g R S.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Tu Mile Dil Khile" (Criminal) & "Ae Ajnabi Tu Bhi Kabhi" (Dil Se)',
        contextAndAnalysis: 'Demonstrates how modern Indian cinema continues to draw upon Bhimpalasi\'s aching S g M P n S\' contour.'
      }
    ],
    concertProgressionHeading: 'Sculpting the Signature M–P–g–M–g–R–S Glide on the Bansuri',
    concertProgressionParagraphs: [
      'The single most important phrase to master in Raag Bhimpalasi on the bansuri is `M P (M)g M g R S`. Rather than lifting and dropping your fingers in separate steps, roll the fingers smoothly from Pancham through Madhyam onto Komal Ga, then rebound lightly back to Madhyam before sliding down through Komal Ga and Rishabh to Shadja.',
      'Begin your daily practice with ten minutes of slow Mandra and Madhya Alaap (`S, n, D, P, M, P, n, S g R S`), locking in the microtonal sweetness of Komal Ga before practicing the Teentaal composition below.'
    ]
  },

  'brindavani-sarang': {
    slug: 'brindavani-sarang',
    ragaName: 'Raag Brindavani Sarang',
    layoutVariant: 'concert-chronicle',
    accentTheme: 'amber',
    originsHeading: 'Historical Origins, Swami Haridas\'s Vrindavan Heritage & The Sarang Family Lineage',
    originsSubtitle: 'How the sacred groves of Vrindavan and the Krishna-bhakti tradition birthed the quintessential midday raga',
    originsParagraphs: [
      'Raag Brindavani Sarang (also spelled Vrindavani Sarang) is the oldest and most celebrated member of the illustrious Sarang family of Hindustani ragas. Its name directly evokes Vrindavan—the sacred forest along the Yamuna river associated with Lord Krishna, the divine flutist (Muralidhar). According to medieval musicological tradition and the hagiographies of the Bhakti movement, Brindavani Sarang was crystallized into its classical Dhrupad and Vishnupad form by the sixteenth-century saint-musician Swami Haridas of Vrindavan (the revered guru of Mian Tansen). While early treatises like Sharngadeva\'s Sangita Ratnakara mention ancient Saranga melodies, Swami Haridas and the Ashtachhap poets infused Brindavani Sarang with the radiant spirit of Vrindavan\'s midday devotion.',
      'Structurally, Brindavani Sarang is an Audav–Audav (pentatonic) raga classified under the Kafi Thaat, although it occupies a unique modal bridge between Kafi and Khamaj Thaats. It completely omits both Gandhar (`G`) and Dhaivat (`D`) in ascent and descent, while utilizing both varieties of Nishad: Shuddha Nishad (`N`) in the ascending movement (`S R M P N S\'`) and Komal Nishad (`n`) in the descending movement (`S\' n P M R S`).',
      'For a bansuri player, Raag Brindavani Sarang holds special spiritual and technical resonance: because Lord Krishna is traditionally depicted playing the bansuri in the groves of Vrindavan at midday, Brindavani Sarang is considered a signature raga of the bamboo flute.'
    ],
    treatiseCallout: {
      title: 'The "Sarang-Ang" Motif (R–M–P–n–P–M–R)',
      citation: 'Swami Haridas & Traditional Sarang Grammar',
      insight: 'Every member of the Sarang family—whether Brindavani, Shuddha, Madhmad, or Miyan Ki Sarang—is united by the unmistakable Sarang-ang nucleus: omitting Ga and Dha while pivoting on Vadi Rishabh (`R M P, n P M R — S`).'
    },
    rasaHeading: 'Emotional Rasa, Midday (Madhyanha) Samay & Acoustic Brilliance under the Noon Sun',
    rasaSubtitle: 'Capturing Bhakti-Shringar Rasa and the dazzling contrast of Shuddha Ni and Komal Ni at noon',
    rasaParagraphs: [
      'In the Hindustani Samay cycle, Raag Brindavani Sarang rules the Madhyanha Prahar—high noon (12:00 PM to 3:00 PM), when the sun blazes directly overhead. Acoustically, how does a raga capture the blinding brightness of noon while offering a cool canopy of forest shade? Brindavani Sarang achieves this miracle through the dual personality of its scale.',
      'First, by omitting Gandhar and Dhaivat, the ascending line (`N, S R M P N S\'`) climbs in bold, open intervals anchored by Vadi Rishabh (`R`) and Samvadi Pancham (`P`). The upward drive through Shuddha Nishad (`P N S\'`) mirrors the vertical intensity of the midday sun. Then, the moment the melody turns downward (`S\' n P M R S`), the replacement of Shuddha Ni with Komal Ni (`n`)—especially in the lingering glide `M P n P M R`—spreads like the cool shade of Vrindavan\'s kadamba trees.',
      'On the bansuri, sustaining Rishabh (`R`) with a rich, steady airstream after descending from Madhyam (`M R — N, S`) creates a noble, meditative poise that immediately identifies the raga.'
    ],
    acousticTakeaway: 'Master the seamless switch on your fifth finger between fully open Shuddha Ni (`P N S\'`) on the way up and half-holed Komal Ni (`S\' n P`) on the way down; that contrast is the soul of Brindavani Sarang.',
    samprakriticHeading: 'Comparative Analysis: Brindavani Sarang vs. Desh, Madhmad Sarang & Megh Malhar',
    samprakriticSubtitle: 'Why strict omission of Ga and Dha separates Brindavani Sarang from its closest cousins',
    samprakriticIntroParagraphs: [
      'Because Brindavani Sarang shares its exact five-note skeleton (`S R M P N/n`) with several monsoon and night ragas, flute players must be vigilant about ornamentation (Gamak vs. lyrical Meend) and strict Varjit-swara discipline.',
      'Here is how to distinguish Brindavani Sarang from Raag Desh, Raag Madhmad Sarang, and Raag Megh Malhar on the bansuri.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Desh',
        alliedRagaView: 'raga_desh',
        sharedElements: 'Identical ascending scale (`S R M P N S\'`), Vadi Re, Samvadi Pa, and dual Nishads (`N` and `n`).',
        criticalDistinction: 'Brindavani Sarang is strictly 5-note (Audav-Audav) and forbids Dha and Ga in descent (`S\' n P M R S`), whereas Desh is Audav-Sampurna and prominently features Dha and Shuddha Ga in descent (`S\' n D P M G R G N, S`).',
        bansuriNuance: 'When descending from Komal Ni to Pa (`S\' n P`) and from Ma to Re (`M R S`) in Brindavani Sarang, drop your fingers cleanly together so Dha and Ga are never heard.'
      },
      {
        alliedRagaName: 'Raag Madhmad Sarang',
        sharedElements: 'Same midday time, Vadi Re, Samvadi Pa, and omission of Ga and Dha.',
        criticalDistinction: 'Madhmad Sarang uses ONLY Komal Nishad (`n`) in both ascent and descent (`S R M P n S\' — S\' n P M R S`), whereas Brindavani Sarang uses Shuddha Ni (`N`) in ascent and Komal Ni (`n`) in descent.',
        bansuriNuance: 'Always use bright Shuddha Ni when climbing to Taar Sa (`P N S\'`) in Brindavani Sarang.'
      },
      {
        alliedRagaName: 'Raag Megh Malhar',
        alliedRagaView: 'raga_miyan_ki_malhar',
        sharedElements: 'Shares the S R M P n/N pentatonic skeleton.',
        criticalDistinction: 'Megh Malhar is a monsoon raga characterized by heavy diaphragmatic Gamak, booming Mandra phrases, and slow Malhar-ang glides (`R \\ S, M \\ R`), whereas Brindavani Sarang has a brisk, luminous midday gait.',
        bansuriNuance: 'Keep your phrasing in Brindavani Sarang bright, agile, and crystalline rather than heavy and stormy.'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Bansuri Masterpieces & Film Melodies in Brindavani Sarang',
    repertoireSubtitle: 'From "Jaun Tori Charan Kamal" to classic melodies of cinema and bhajan',
    repertoireParagraphs: [
      'In the Hindustani vocal tradition, Raag Brindavani Sarang is celebrated through the famous Teentaal bandish "Jaun Tori Charan Kamal Vari" and "Tum Rab Tum Saheb." Every bansuri learner should also listen to Pandit Hariprasad Chaurasia\'s and Pandit Pannalal Ghosh\'s legendary Brindavani Sarang recordings, where the flute dances effortlessly between `N, S R`, `R M P`, and `n P M R`.',
      'In film and devotional music, Brindavani Sarang has inspired some of the most joyous and memorable compositions ever recorded.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Jaun Tori Charan Kamal" & "Papiyaarah" (Traditional Teentaal Khayals)',
        contextAndAnalysis: 'Showcases the authoritative pause on Vadi Rishabh (N, S R —) and the contrast between ascending P N S\' and descending S\' n P M R.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia – Raag Brindavani Sarang (Alaap, Jod & Gat in Jhaptaal/Teentaal)',
        contextAndAnalysis: 'A gold-standard demonstration of how to bring out the pastoral Vrindavan charm of the bamboo flute.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Jhanak Jhanak Tori Baje Payaliya" (Mere Huzoor) & "Ghoomar" / Rajasthani Folk-Sarang Classics',
        contextAndAnalysis: 'Manna Dey\'s classical tour-de-force in Mere Huzoor captures every nuance of Brindavani Sarang\'s R-M-P-N/n interplay.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Sawan Aye Ya Na Aye" (Dil Diya Dard Liya) & "Man Mohana Bade Jhoothe" (Seema)',
        contextAndAnalysis: 'Illustrates how film composers use the Sarang scale for both romantic duets and classical numbers.'
      }
    ],
    concertProgressionHeading: 'Developing the Sarang-Ang Glide (M R & n P) on the Bamboo Flute',
    concertProgressionParagraphs: [
      'To bring authentic Sarang-ang life to your bansuri playing, pay special attention to the descent from Madhyam to Rishabh (`M ~> R`). Rather than snapping the index and middle fingers down mechanically, close them with a slight rolling motion so a liquid Meend connects `M` to `R`, followed immediately by a dip to Mandra Shuddha Ni (`R, N, S`).',
      'Practice alternating `M P N S\'` (ascending with open-hole Shuddha Ni) and `S\' n P M R` (descending with half-hole Komal Ni) until the transition feels completely natural at any tempo.'
    ]
  },

  khamaj: {
    slug: 'khamaj',
    ragaName: 'Raag Khamaj',
    layoutVariant: 'sadhana-essays',
    accentTheme: 'amber',
    originsHeading: 'Historical Origins, The Nawabi Thumri Renaissance & Lineage of Raag Khamaj',
    originsSubtitle: 'From medieval Kambhoji and courtly Kathak-Thumri to devotional Vaishnava bhajans and concert bansuri',
    originsParagraphs: [
      'Raag Khamaj is the eponymous parent (Janak) raga of the Khamaj Thaat and one of the most lyrically enchanting scales in Indian music. Historically, musicologists trace its lineage back to the medieval raga Kambhoji (and Kshama/Khamachi mentioned in seventeenth- and eighteenth-century treatises), which flourished across Gujarat, Rajasthan, and the Gangetic plains. During the eighteenth and nineteenth centuries—particularly under the patronage of the Mughal court in Delhi and Nawab Wajid Ali Shah\'s court in Lucknow (Awadh)—Raag Khamaj became the supreme vehicle for the Bol-Banav and Bandish Thumri, Dadra, and Kathak dance repertoire.',
      'At the same time, Khamaj possesses a profound devotional side: Mahatma Gandhi\'s beloved fifteenth-century Gujarati bhajan "Vaishnava Jana To" by Narsinh Mehta is set squarely in Raag Khamaj! Structurally, Khamaj is classified as a Shadava–Sampurna raga: it omits Rishabh (`R`) in its ascending path (`S G M P D N S\'`) while including all seven swaras in its descent (`S\' n D P, M G R S`), featuring Shuddha Nishad (`N`) in ascent and Komal Nishad (`n`) in descent.',
      'On the bansuri, Raag Khamaj is a celebration of melodic grace, Murki (delicate rapid turns), and Khatka. Because the ascending leap from Sa directly to Shuddha Ga (`S G M P`) opens up the Purvanga immediately, the flute sings with effortless, romantic warmth.'
    ],
    treatiseCallout: {
      title: 'Dual Aesthetics: Shringar Thumri & Bhakti Bhajan',
      citation: 'Khamaj Thaat Performance Tradition',
      insight: 'Few ragas span two emotional worlds as seamlessly as Khamaj: in slow Khayal and Bhajan it radiates serene devotional humility, while in Thumri and Dhun its `G M P D n D P` turns sparkle with romantic playfulness.'
    },
    rasaHeading: 'Emotional Rasa, Late-Night Samay & Acoustic Sweetness of Gandhar and Nishad',
    rasaSubtitle: 'How Vadi Ga–Samvadi Ni and the interplay of both Nishads create nocturnal Shringar Rasa',
    rasaParagraphs: [
      'Raag Khamaj is traditionally performed during the second Prahar of the night (9:00 PM to midnight). Its primary aesthetic mood is Shringar Rasa (romantic charm, grace, and affectionate yearning) blended with Bhakti Rasa (devotional sweetness). Unlike heavy, brooding midnight ragas that rely on flat thirds or flat sixths, Khamaj retains a luminous Shuddha Gandhar (`G`) and Shuddha Dhaivat (`D`), softening only its seventh degree (`Komal Ni`) on the way down.',
      'From an acoustic perspective, the dialogue between Vadi Gandhar (`G`) and Samvadi Nishad (`N` / `n`) gives Khamaj its intoxicating lilt. When the flutist ascends `S G M P D N S\'`, the bright leading-tone Shuddha Nishad (`N`) sparkles at the top of the octave. Moments later, as the phrase turns around (`S\' n D P, D M P D, M G`), introducing half-holed Komal Nishad (`n`) relaxes the harmonic tension and sends the melody cascading gently back to Gandhar (`G`) before stepping down through `R S`.',
      'Another hallmark of Khamaj on the bansuri is the expressive pause on Madhyam and Dhaivat in phrases like `G M P D — M G`, where a quick ornamental flick (Khatka) on Dhaivat makes the bamboo flute sound remarkably like a Thumri vocalist.'
    ],
    acousticTakeaway: 'In Raag Khamaj, always launch your ascending phrases with the clean major-third leap `S G M P` (omitting Re); reserving Re strictly for the final descending resolution (`P M G R S`) preserves the authentic Khamaj contour.',
    samprakriticHeading: 'Comparative Analysis: Raag Khamaj vs. Desh, Tilang & Bihag',
    samprakriticSubtitle: 'Keeping Khamaj distinct from its closest Khamaj-Thaat and Bilawal-Thaat neighbors',
    samprakriticIntroParagraphs: [
      'Because Raag Khamaj is the parent scale of the Khamaj Thaat, its DNA flows through Raag Desh, Raag Tilang, Raag Jhinjhoti, and Raag Rageshree. Advancing flute players must understand how Khamaj\'s specific omission of Re in ascent and inclusion of Dha throughout distinguish it from its siblings.',
      'Compare the four ragas below to sharpen your structural clarity.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Desh',
        alliedRagaView: 'raga_desh',
        sharedElements: 'Same Khamaj Thaat, dual Nishads (`N` in ascent, `n` in descent), and night performance window.',
        criticalDistinction: 'Khamaj omits Re in ascent (`S G M P D N S\'`) and has Vadi Ga, whereas Desh omits Ga and Dha in ascent (`S R M P N S\'`) and has Vadi Re.',
        bansuriNuance: 'Khamaj opens brightly on `S G M P`; Desh opens pastorally on `S R M P`.'
      },
      {
        alliedRagaName: 'Raag Tilang',
        alliedRagaView: 'raga_tilang',
        sharedElements: 'Identical Purvanga ascent (`S G M P N S\'`), Vadi Ga, and use of `N` in ascent / `n` in descent.',
        criticalDistinction: 'Tilang is an Audav-Audav (5-note) raga that completely omits BOTH Re and Dha in ascent and descent (`S\' n P M G S`), whereas Khamaj prominently features Dhaivat in both ascent and descent (`G M P D N S\' — S\' n D P`) and Re in descent (`M G R S`).',
        bansuriNuance: 'In Khamaj, Dhaivat (`D`) is a vital resting and pivoting note (`P D n D P`); in Tilang, Dhaivat is strictly forbidden.'
      },
      {
        alliedRagaName: 'Raag Bihag',
        alliedRagaView: 'raga_bihag',
        sharedElements: 'Shares the `N, S G M P N S\'` ascending leap omitting Re, Vadi Ga, and Samvadi Ni.',
        criticalDistinction: 'Bihag omits Dha in ascent, uses Shuddha Ni in descent (`S\' N D P`), and adds ornamental Tivra Ma (`P M^ P G M G`), whereas Khamaj includes Dha in ascent and relies on Komal Ni (`S\' n D P`) without Tivra Ma (in pure classical form).',
        bansuriNuance: 'Use Komal Ni (`n`) consistently in descending Khamaj phrases (`S\' n D P`).'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Devotional Bhajans & Film Melodies in Raag Khamaj',
    repertoireSubtitle: 'From "Koyalaliya Bole Ambua" and "Vaishnava Jana To" to immortal Bollywood classics',
    repertoireParagraphs: [
      'Raag Khamaj boasts an extraordinarily rich repertoire across classical Khayal, Thumri, Bhajan, and Hindi cinema. In traditional Khayal, "Koyalaliya Bole Ambua Ki Daar" and "Na Manoongi Na Manoongi" are beloved Teentaal compositions that highlight the `S G M P D N S\'` sweep and the `S\' n D P M G R S` cascade.',
      'In devotional and film music, some of the most cherished melodies in Indian history are sculpted directly in Raag Khamaj.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Koyalaliya Bole" & "Vaishnava Jana To Tene Kahiye" (Narsinh Mehta Bhajan)',
        contextAndAnalysis: '"Vaishnava Jana To" opens directly on S G M P D n D P, M G R S—making it the most famous melodic textbook of Raag Khamaj in the world.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia & Ustad Bismillah Khan – Khamaj Thumri & Dhun Recordings',
        contextAndAnalysis: 'Demonstrates how wind instruments (bansuri and shehnai) bring out the sparkling Murki and Khatka ornamentations of Lucknow/Banaras Khamaj.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Tere Mere Milan Ki Yeh Raina" (Abhimaan) & "Kuch To Log Kahenge" (Amar Prem)',
        contextAndAnalysis: 'S. D. Burman and R. D. Burman used the Khamaj scale (`S G M P` and `n D P M G`) to craft timeless, conversational melodies.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Aayo Kahan Se Ghanshyam" (Buddha Mil Gaya) & "Bada Natkhat Hai Re" (Amar Prem)',
        contextAndAnalysis: 'Masterpieces of classical-film scoring that showcase Khamaj\'s full emotional range from devotion to maternal affection.'
      }
    ],
    concertProgressionHeading: 'Incorporating Khatka, Murki & Dual-Nishad Control on the Flute',
    concertProgressionParagraphs: [
      'When playing Raag Khamaj on the bansuri, cultivate a light, dancing finger touch. In your Alaap, establish the `S G M P` opening, pause on Gandhar, and then explore the upper tetrachord contrast: climb with bright Shuddha Ni (`M P D N S\'`) and descend immediately with soft half-holed Komal Ni (`S\' n D P, D M G`).',
      'As you practice the FluteSangam composition below, add a crisp finger tap (Khatka) on Dhaivat when playing Pancham (`(D)P M G`) to give your phrases authentic semi-classical sparkle.'
    ]
  },

  bhairav: {
    slug: 'bhairav',
    ragaName: 'Raag Bhairav',
    layoutVariant: 'treatise-monograph',
    accentTheme: 'amber',
    originsHeading: 'Historical Origins, Adi-Raga Mythology & The Ancient Lineage of Raag Bhairav',
    originsSubtitle: 'From Shiva\'s cosmic dawn meditation and medieval Raga-Ragini systems to the concert bansuri',
    originsParagraphs: [
      'In the sacred cosmology of Indian classical music, Raag Bhairav is revered as the Adi-Raga—the primordial first raga said to have emanated directly from the eastern face of Lord Shiva (Bhairava) at the break of cosmic dawn. Across medieval Raga-Ragini classification systems—including the Hanuman, Narada, and Someshwara schools documented between the eleventh and seventeenth centuries—Bhairav was universally crowned as the first of the six great patriarchal ragas (Shad-Ragas). While early medieval treatises like Sharngadeva\'s Sangita Ratnakara described an older pentatonic/hexatonic precursor (Bhairava/Bhinna Shadja), by the sixteenth-century Mughal era and Pandit Ahobala\'s Sangita Parijata, Bhairav had crystallized into its iconic seven-note double-harmonic form.',
      'Pandit Vishnu Narayan Bhatkhande designated Raag Bhairav as the eponymous Janak (parent) of the Bhairav Thaat. Its scale pairs two flat notes—Komal Rishabh (`r`) and Komal Dhaivat (`d`)—with four natural notes (`Sa`, `Shuddha Ga`, `Shuddha Ma`, `Pa`) and a sharp leading tone (`Shuddha Ni`). This creates two symmetrical tetrachords (`S – r – G – M` and `P – d – N – S\'`), each containing an augmented second (three-semitone) leap between the flat second/sixth and the major third/seventh (`r–G` and `d–N`).',
      'On the bansuri, Raag Bhairav is a profound spiritual discipline. Because both Komal Re (`r`) and Komal Dha (`d`) are produced via delicate half-hole fingerings and require slow, meditative microtonal oscillation (Andolan), playing Bhairav at sunrise unites breath control (Pranayama) with musical Nada-Yoga.'
    ],
    treatiseCallout: {
      title: 'Symmetrical Double-Harmonic Tetrachords',
      citation: 'Bhairav Thaat Architecture & Andolan Grammar',
      insight: 'In Raag Bhairav, the Purvanga (`S r G M`) and Uttaranga (`P d N S\'`) are exact structural mirrors. Both Komal Dha (Vadi) and Komal Re (Samvadi) receive slow, dignified Andolan descending from Ma (`M r —`) and Pa/Sa\' (`P d —`).'
    },
    rasaHeading: 'Emotional Rasa, Sunrise (Sandhiprakash) Samay & The Acoustic Gravity of Andolan',
    rasaSubtitle: 'Why the pairing of Komal Re/Dha with Shuddha Ga/Ni awakens Shanta, Bhakti, and Adbhuta Rasa at dawn',
    rasaParagraphs: [
      'Raag Bhairav belongs to the morning Sandhiprakash (twilight junction of night and day, 4:00 AM to 7:00 AM) and early morning Prahar. Its emotional universe is vast, solemn, and awe-inspiring—combining Shanta Rasa (profound meditative peace), Bhakti Rasa (ascetic devotion), and Karuna-Gambhirya (solemn majesty). Why does this specific combination of notes evoke the stillness of dawn?',
      'From the standpoint of acoustic psychology, the secret lies in the juxtaposition of extreme half-step proximity (`S–r` and `P–d`) with wide augmented-second intervals (`r–G` and `d–N`). When the bansuri player sounds Komal Rishabh (`r`) just above the tonic Sa, or Komal Dhaivat (`d`) just above the fifth Pa, the flat note creates a solemn, inward-turning tension against the Tanpura drone. Then, when the melody steps up across the wide gap to bright Shuddha Gandhar (`G`) or Shuddha Nishad (`N`), it feels like the first golden rays of the sun piercing the morning mist.',
      'Crucially, in authentic Raag Bhairav, Komal Re and Komal Dha are never played as flat, static pitches. Instead, the flutist approaches Komal Re from Shuddha Ma (`G M r — S`) and Komal Dha from Taar Sa or Pa (`N S\' d — P`), imparting a slow, regal wave of pitch oscillation (Andolan) through finger shading and breath modulation.'
    ],
    acousticTakeaway: 'When oscillating (Andolan) on Komal Re (`r`) and Komal Dha (`d`) on the bansuri, never shake your head or jaw violently; instead, gently rock the pad of the first or fourth finger over the half-hole in slow rhythm with your diaphragm.',
    samprakriticHeading: 'Comparative Analysis: Raag Bhairav vs. Ahir Bhairav, Ramkali & Kalingda',
    samprakriticSubtitle: 'Distinguishing pure Bhairav from its closest morning relatives in the Bhairav family',
    samprakriticIntroParagraphs: [
      'Because the Bhairav Ang is one of the pillars of Hindustani music, dozens of morning ragas share its `S r G M` lower tetrachord. For a bansuri player, understanding the exact differences between pure Raag Bhairav, Raag Kalingda, Raag Ramkali, and Raag Ahir Bhairav is essential.',
      'Notice how microtonal Andolan, Madhyam/Nishad varieties, and tempo separate these morning ragas.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Kalingda',
        sharedElements: 'Identical seven notes (`S r G M P d N S\'`) of the Bhairav Thaat!',
        criticalDistinction: 'Bhairav is a solemn, meditative raga where Komal Re and Komal Dha receive slow Andolan (`G M r — S`, `d — P`) and Re/Pa are often skipped in initial ascents (`S G M P d N S\'`), whereas Kalingda is a brisk, light-classical raga played without Andolan in straight scalar runs.',
        bansuriNuance: 'If you play Bhairav\'s notes fast and flat without Meend or Andolan on `r` and `d`, it turns into Kalingda. Always honor the slow `G M r — S` glide in Bhairav.'
      },
      {
        alliedRagaName: 'Raag Ahir Bhairav',
        sharedElements: 'Shares the Bhairav Purvanga (`S r G M P`) and morning devotional mood.',
        criticalDistinction: 'Ahir Bhairav combines a Bhairav lower half (`S r G M`) with a Kafi/Khamaj upper half featuring Shuddha Dha (`D`) and Komal Ni (`n`: `P D n S\'`), whereas pure Bhairav uses Komal Dha (`d`) and Shuddha Ni (`N`).',
        bansuriNuance: 'In pure Bhairav, keep Dhaivat strictly Komal (`d`, half-hole) and Nishad strictly Shuddha (`N`, open hole).'
      },
      {
        alliedRagaName: 'Raag Ramkali',
        sharedElements: 'Same early morning time, Bhairav Thaat base notes, and Vadi Dha / Samvadi Re.',
        criticalDistinction: 'Ramkali introduces Tivra Madhyam (`M^`) and Komal Nishad (`n`) in specific upper-register oblique phrases (`P M^ P d n d P`), whereas pure Bhairav uses only Shuddha Ma and Shuddha Ni.',
        bansuriNuance: 'Maintain pure Shuddha Madhyam throughout your Bhairav performance.'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Morning Bansuri Recitals & Film Melodies in Raag Bhairav',
    repertoireSubtitle: 'From Tansen\'s Dhrupads and "Jago Mohan Pyare" to immortal sunrise compositions',
    repertoireParagraphs: [
      'Raag Bhairav\'s repertoire stretches back five hundred years to the great Dhrupads of Swami Haridas and Mian Tansen, alongside the universally taught Khayal bandish "Jago Brijraj Kunwar" and "Balamwa More Sainya." In the twentieth century, Ustad Bismillah Khan (shehnai) and Pandit Hariprasad Chaurasia (bansuri) recorded legendary morning recitals of Raag Bhairav that capture the temple bells and mist of Varanasi at dawn.',
      'In Indian cinema, whenever a filmmaker wished to portray the sanctity of sunrise, spiritual awakening, or profound inner strength, composers turned immediately to Raag Bhairav.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Jago Brijraj Kunwar" & "Dhan Dhan Murat Krishna Murari" (Traditional Morning Khayals)',
        contextAndAnalysis: 'Canonical morning bandishes that showcase the S G M P d P opening, the slow Andolan on Komal Dha, and the majestic G M r — S resolution.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Pannalal Ghosh & Pandit Hariprasad Chaurasia – Raag Bhairav Morning Recitals',
        contextAndAnalysis: 'Demonstrates how to execute slow, vocal-style Andolan on half-holed Komal Dha and Komal Re on a bass bamboo flute.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Jago Mohan Pyare" (Jagte Raho) & "Mohe Bhool Gaye Sanwariya" (Baiju Bawra)',
        contextAndAnalysis: 'Salil Chowdhury\'s "Jago Mohan Pyare" (sung by Lata Mangeshkar) and Naushad\'s "Mohe Bhool Gaye Sanwariya" are immortal cinematic monuments to Raag Bhairav.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Albela Sajan Aayo Re" (Hum Dil De Chuke Sanam — Ahir Bhairav/Bhairav Ang) & "Ram Teri Ganga Maili"',
        contextAndAnalysis: 'Highlights how the morning Bhairav Purvanga (`G M r S`) continues to inspire modern classical-film compositions.'
      }
    ],
    concertProgressionHeading: 'Practicing Morning Nada-Sadhana & G–M–r–S Meend on the Flute',
    concertProgressionParagraphs: [
      'There is no substitute for practicing Raag Bhairav in the quiet hours of early morning. Begin by sustaining Shadja (`S`) over a Tanpura drone, then slowly dip to Mandra Komal Dha (`S, N, d, — P, d, N, S r — S`). Notice how approaching Komal Re from Shuddha Ma (`G M r — S`) allows you to slide the finger smoothly into the half-hole position.',
      'Give full weight and unhurried breathing to `G M d — P` before moving into the rhythmic exercises and the FluteSangam morning composition "Pratah Dhyan."'
    ]
  },

  bihag: {
    slug: 'bihag',
    ragaName: 'Raag Bihag',
    layoutVariant: 'comparative-symposium',
    accentTheme: 'amber',
    originsHeading: 'Historical Origins, Bilawal–Kalyan Synthesis & The Courtly Elegance of Raag Bihag',
    originsSubtitle: 'How a late-night Bilawal-Thaat raga embraced Tivra Madhyam to become a favorite of Khayal and Bansuri',
    originsParagraphs: [
      'Raag Bihag (also spelled Behag in older treatises) is one of the most aristocratic, romantic, and structurally fascinating ragas of the North Indian night repertoire. Documented in seventeenth- and eighteenth-century musicological works such as Ahobala\'s Sangita Parijata and Srikantha\'s Rasakaumudi, Bihag originally belonged to a pure Shuddha-swara lineage classified under the Bilawal Thaat by Pandit Vishnu Narayan Bhatkhande. Over the nineteenth and twentieth centuries, however, as Khayal and instrumental maestros sought to heighten its nocturnal poignancy, a delicate chromatic touch of Tivra Madhyam (`M^`) was woven into its upper-middle register (`P M^ P G M G`), transforming Bihag into a luminous bridge between Bilawal and Kalyan aesthetics.',
      'Structurally, Raag Bihag is an Audav–Sampurna raga. Its ascending scale (`N, S G M P N S\'`) omits both Rishabh (`R`) and Dhaivat (`D`), leaping across major thirds and fourths (`S–G` and `P–N`) with effortless grace. In the descending movement (`S\' N D P, M^ P G M G, R S`), all seven notes appear, but Dhaivat (`D`) and Rishabh (`R`) are treated as weak, non-resting passing notes (Alpatva), while Gandhar (`G`), Madhyam (`M`), and Nishad (`N`) shine with abundant prominence (Bahutva).',
      'On the bansuri, Raag Bihag is pure poetry. The signature descending phrase—sliding from Pancham with a whisper of Tivra Ma into the double-Gandhar cradle `P M^ P G M G`—was a lifelong favorite of both Pandit Pannalal Ghosh and Pandit Hariprasad Chaurasia.'
    ],
    treatiseCallout: {
      title: 'Vivadi / Ornamental Tivra Ma vs. Structural Shuddha Ma',
      citation: 'Bilawal Thaat Classification & Modern Concert Practice',
      insight: 'In Raag Bihag, Shuddha Madhyam (`M`) is the structural pillar (`N, S G M P, G M G`), while Tivra Madhyam (`M^`) acts exclusively as an ornamental bridge tethered to Pancham in descending gestures (`P M^ P G M G`).'
    },
    rasaHeading: 'Emotional Rasa, Midnight Samay & The Romantic Lilt of P–M–G–M–G',
    rasaSubtitle: 'Why the second Prahar of the night awakens Shringar Rasa through Vadi Ga and Samvadi Ni',
    rasaParagraphs: [
      'Raag Bihag is performed during the second Prahar of the night (9:00 PM to midnight), when the evening energy of Yaman softens into intimate, moonlit contemplation. Aesthetically, Bihag is the epitome of Samyoga and Vipralambha Shringar Rasa (noble romance, tender memory, and poetic longing) intertwined with serene Bhakti.',
      'What gives Bihag its unmistakable emotional signature on the bamboo flute? First, its ascending trajectory (`N, S G M P N S\'`) avoids the grounded step of Rishabh and the earthy weight of Dhaivat, giving the melody a floating, weightless buoyancy. Second, its Vadi swara is Gandhar (`G`) and its Samvadi is Nishad (`N`). Whenever the flutist ascends from Mandra Nishad (`N, S G —`) and cradles Gandhar with Shuddha Madhyam (`G M G`), the listener feels a warm, comforting embrace.',
      'Then comes the masterstroke in the upper register: descending from Taar Sa (`S\' N D P`), the flutist lightly brushes Dhaivat without pausing on it, lands on Pancham, touches open-hole Tivra Ma (`P M^ P`), and glides immediately into half-holed Shuddha Ma and Gandhar (`G M G R S`). That juxtaposition of bright `M^` and tender `M` within a single breath is one of the most exquisite moments in all of Hindustani music.'
    ],
    acousticTakeaway: 'When executing `P M^ P G M G` on the bansuri, treat Tivra Ma (`M^`) as a light, fleeting grace note between two Panchams, and let your real emotional weight settle onto Shuddha Ma and Gandhar (`G M G`).',
    samprakriticHeading: 'Comparative Analysis: Raag Bihag vs. Yaman, Khamaj & Maru Bihag',
    samprakriticSubtitle: 'Understanding the exact weight of Shuddha Ma and Tivra Ma across the Bihag and Kalyan families',
    samprakriticIntroParagraphs: [
      'Because Raag Bihag uses both Madhyams (`M` and `M^`) and shares its `N, S G M P N S\'` contour with Raag Maru Bihag and Raag Khamaj, flute students must clearly grasp the boundaries between these closely related night ragas.',
      'Compare the three ragas below to keep your Bihag phrasing crystal-clear.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Maru Bihag',
        sharedElements: 'Shares the Bihag ascending arch, both Madhyams (`M` and `M^`), and night performance window.',
        criticalDistinction: 'In pure Bihag, Shuddha Ma (`M`) dominates (`S G M P, G M G`) and Tivra Ma (`M^`) is strictly an ornamental touch (`P M^ P G M G`). In Maru Bihag, Tivra Ma (`M^`) dominates the entire ascent and upper phrasing (`S G M^ P D N S\'`, `M^ G, M^ P`), with Shuddha Ma reserved only for the opening `S G M P`.',
        bansuriNuance: 'In this guide to Raag Bihag, never ascend using Tivra Ma (`G M^ P` is forbidden in pure Bihag); always ascend via Shuddha Ma (`S G M P`).'
      },
      {
        alliedRagaName: 'Raag Yaman / Yaman Kalyan',
        alliedRagaView: 'raga_yaman',
        sharedElements: 'Evening/night mood, Vadi Ga, Samvadi Ni, and shared use of Shuddha swaras with Madhyam.',
        criticalDistinction: 'Yaman includes Re and Dha prominently (`N, R G M^ P D N S\'`) and relies on Tivra Ma, whereas Bihag omits Re and Dha in ascent (`N, S G M P N S\'`) and relies on Shuddha Ma (`P M G M G`).',
        bansuriNuance: 'In Bihag, skip Re and Dha completely when climbing, and avoid lingering on Re or Dha when descending.'
      },
      {
        alliedRagaName: 'Raag Khamaj',
        alliedRagaView: 'raga_khamaj',
        sharedElements: 'Both start with `S G M P` (omitting Re in ascent) and have Vadi Ga / Samvadi Ni.',
        criticalDistinction: 'Khamaj includes Dha in ascent (`G M P D N S\'`) and uses Komal Ni in descent (`S\' n D P`), whereas Bihag omits Dha in ascent (`G M P N S\'`), keeps Ni strictly Shuddha (`S\' N D P`), and uses `P M^ P G M G`.',
        bansuriNuance: 'Keep Nishad strictly Shuddha (`N`) in both ascent and descent throughout Raag Bihag.'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Bansuri Recitals & Film Melodies in Raag Bihag',
    repertoireSubtitle: 'From "Kaise Sukh Sove" and "Lat Uljhi" to golden-era Bollywood classics',
    repertoireParagraphs: [
      'In the Hindustani Khayal tradition, Raag Bihag is treasured through timeless bandishes such as "Kaise Sukh Sove Neendariya" (Vilambit/Madhya Teentaal), "Lat Uljhi Suljha Ja Balam," and "Abahun Lalan Maan." Listening to Ustad Amir Khan, Pandit Bhimsen Joshi, or Vidushi Kishori Amonkar sing the opening phrase `N, S G M P, G M G` reveals the unhurried aristocratic poise of Bihag.',
      'In Indian film music, Bihag\'s romantic `S G M P` leap and `P M G M G` cadence have inspired some of the most beloved songs in cinema history.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Kaise Sukh Sove" & "Lat Uljhi Suljha Ja Balam" (Traditional Khayal Bandishes)',
        contextAndAnalysis: 'Demonstrates the classic N, S G M P opening, the gentle recession of Dhaivat in S\' N D P, and the signature P M^ P G M G resolution.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia – Raag Bihag (Late-Night Concert Recital)',
        contextAndAnalysis: 'A masterclass in how to balance Shuddha Ma and Tivra Ma on the bansuri while maintaining Gayaki-ang continuity.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Tere Sur Aur Mere Geet" (Goonj Uthi Shehnai) & "Zindagi Ke Safar Mein" (Aap Ki Kasam)',
        contextAndAnalysis: '"Tere Sur Aur Mere Geet" is a textbook exposition of Raag Bihag, opening directly on the signature S G M P, G M G R S contour.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Boliye Surili Boliyan" (Griha Pravesh) & "Piya Bawri" (Khubsoorat)',
        contextAndAnalysis: 'Showcases the luminous interplay of Vadi Gandhar, Shuddha Ni, and the P M G M G turn in classic film orchestration.'
      }
    ],
    concertProgressionHeading: 'Mastering the Dual-Madhyam Bridge (P M^ P G M G) on the Flute',
    concertProgressionParagraphs: [
      'To master Raag Bihag on the bansuri, practice the transition between Pancham (`P`), open-hole Tivra Ma (`M^`), and half-hole Shuddha Ma (`M`) in slow motion. In the motif `P M^ P G M G`, lift all six fingers briefly from `P` to sound `M^`, drop them back onto `P`, and then jump directly to Gandhar (`G`) before touching half-hole Shuddha Ma (`M`) and settling back on `G`.',
      'Always keep Rishabh (`R`) and Dhaivat (`D`) gentle and fleeting—never stop or sustain your breath on `R` or `D`—so the noble Bilawal-Kalyan glow of Bihag shines through.'
    ]
  },

  malkauns: {
    slug: 'malkauns',
    ragaName: 'Raag Malkauns',
    layoutVariant: 'concert-chronicle',
    accentTheme: 'indigo',
    originsHeading: 'Historical Origins, Ancient Malavakaushika & The Mystical Lineage of Raag Malkauns',
    originsSubtitle: 'How one of India\'s oldest pentatonic ragas omits both Re and Pa to create supernatural midnight depth',
    originsParagraphs: [
      'Raag Malkauns (derived from the Sanskrit Malavakaushika—a synthesis of the ancient Malava region\'s modal tradition and the Vedic/medieval Kaushika Grama-Raga) is one of the oldest, most revered, and most awe-inspiring ragas in Indian musical civilization. Celebrated in ancient Sanskrit epics, Sharngadeva\'s Sangita Ratnakara, and medieval Raga-Ragini manuscripts (where Malakosh/Malkauns is often depicted as a heroic mystic or ascetic immersed in deep meditation), Malkauns has survived over a millennium with its core spiritual gravity intact.',
      'When Pandit Vishnu Narayan Bhatkhande classified Hindustani ragas into ten Thaats, he placed Raag Malkauns under the Bhairavi Thaat because its five notes—Sa, Komal Gandhar (`g`), Shuddha Madhyam (`M`), Komal Dhaivat (`d`), and Komal Nishad (`n`)—are all present in the Bhairavi scale. Yet acoustically and structurally, Malkauns does something radical: it completely omits Pancham (`P`, the fifth harmonic) as well as Rishabh (`R`). By removing Pancham (`P`) and replacing the Sa–Pa fifth axis with a Sa–Ma fourth axis (`Shadja–Madhyam Bhava`), Malkauns steps outside ordinary earthly tonality.',
      'On the bansuri, Raag Malkauns is the supreme vehicle for deep Mandra-Saptak meditation and long, unbroken Meends. Because three of its five swaras (`g`, `d`, `n`) are Komal half-hole notes and its Vadi swara (`M`) is also a half-hole note on the six-hole bamboo flute, playing Malkauns requires complete mastery of embouchure shading, breath warmth, and microtonal ear training.'
    ],
    treatiseCallout: {
      title: 'The Pancham-Varjit Quartet of Fourths',
      citation: 'Shadja-Madhyam Consonance in Ancient Malavakaushika',
      insight: 'Because Malkauns omits Pancham (`P`), every single note in its scale (`S, g, M, d, n`) forms a perfect fourth (Madhyam-bhava) with another note in the scale: `S–M`, `g–d`, `M–n`, and `d–R` (implied), creating a seamless, circular acoustic vortex.'
    },
    rasaHeading: 'Emotional Rasa, Deep Midnight Samay & Acoustic Transcendence on the Bansuri',
    rasaSubtitle: 'Why the third Prahar of the night (12 AM – 3 AM) awakens Shanta, Adbhuta, and Veera-Gambhirya Rasa',
    rasaParagraphs: [
      'Raag Malkauns is performed during the deepest, quietest hours of the night—the transition from the second to the third Prahar (11:00 PM to 2:00 AM). Its aesthetic Rasa is a monumental blend of Gambhirya (profound solemnity), Shanta-Bhakti (transcendental meditation), Adbhuta (mystical wonder), and quiet Veera Rasa (fearless inner strength). Unlike romantic midnight ragas such as Bageshree or Bihag, Malkauns does not speak of worldly romance; it speaks of cosmic solitude and the infinite.',
      'Why does omitting Pancham (`P`) and pairing `S g M d n` produce such a hypnotic effect on the human nervous system? When the Tanpura is tuned to `Ma–Sa–Sa–Sa` (replacing the usual `Pa` string with `Shuddha Ma`), the entire harmonic overtone field shifts from the bright fifth to the introspective fourth. Every interval in Malkauns is either a whole step (`g–M`, `d–n`, `n–S\'`) or a minor third (`S–g`, `M–d`). There is not a single semitone (half-step) anywhere in the raga!',
      'When a flutist plays slow, undulating Meends in the Mandra and Madhya registers (`S, n, d, M, d, n, S — g M, g S`), allowing Komal Ga (`g`) and Komal Dha (`d`) to oscillate gently toward Madhyam (`M`), the bamboo flute produces a cavernous, temple-sanctum resonance.'
    ],
    acousticTakeaway: 'Tune your electronic or acoustic Tanpura to `Ma–Sa` (Madhyam-Shadja) rather than `Pa–Sa` whenever you practice Raag Malkauns; hearing the continuous Madhyam drone will transform your intonation on `g`, `M`, `d`, and `n`.',
    samprakriticHeading: 'Comparative Analysis: Raag Malkauns vs. Chandrakauns, Kaunsi Kanada & Bhairavi',
    samprakriticSubtitle: 'Understanding how Nishad and Re/Pa variations differentiate the great Kauns family',
    samprakriticIntroParagraphs: [
      'Raag Malkauns is the patriarch of the "Kauns" (Kaushiki) family of ragas. Advancing bansuri players must understand how Malkauns relates to its closest structural relatives—Raag Chandrakauns, Raag Madhukauns, and Raag Kaunsi Kanada.',
      'Notice how changing a single note or adding an oblique descent alters the entire nocturnal mood.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Chandrakauns',
        sharedElements: 'Identical four lower notes (`S g M d`) and Audav-Audav midnight framework omitting Re and Pa.',
        criticalDistinction: 'Malkauns uses Komal Nishad (`n`: `S g M d n S\'`), creating a seamless minor-pentatonic flow, whereas Chandrakauns replaces Komal Ni with razor-sharp Shuddha Nishad (`N`: `S g M d N S\'`), creating an eerie, moonlit augmented-second gap between `d` and `N`.',
        bansuriNuance: 'In Malkauns, keep your fifth finger half-holed on Komal Ni (`n`); opening it fully to Shuddha Ni immediately turns the scale into Chandrakauns.'
      },
      {
        alliedRagaName: 'Raag Kaunsi Kanada',
        sharedElements: 'Uses the complete Malkauns ascent (`n, S g M d n S\'`) and deep midnight gravity.',
        criticalDistinction: 'Malkauns is strictly 5-note (`S g M d n`), whereas Kaunsi Kanada blends Malkauns with Darbari Kanada by introducing Pancham (`P`) and Rishabh (`R`) in vakra descending Kanada phrases (`S\' d n P, d M P, g M R S`).',
        bansuriNuance: 'Never touch Pa or Re in pure Malkauns; descend cleanly across `S\' n d M, g M g S`.'
      },
      {
        alliedRagaName: 'Raag Bageshree',
        alliedRagaView: 'raga_bageshree',
        sharedElements: 'Shares the Audav ascending contour (`S g M D/d n S\'`), Vadi Ma, Samvadi Sa, and omission of Re and Pa in ascent.',
        criticalDistinction: 'Bageshree belongs to Kafi Thaat and uses bright Shuddha Dhaivat (`D`) plus Re and Pa in descent, whereas Malkauns belongs to Bhairavi Thaat, uses dark Komal Dhaivat (`d`), and omits Re and Pa completely.',
        bansuriNuance: 'Compare `S g M D n S\'` (Bageshree, open Dha) with `S g M d n S\'` (Malkauns, half-hole Komal Dha) to train your ear in sixth-degree contrast.'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Legendary Flute Recitals & Film Melodies in Raag Malkauns',
    repertoireSubtitle: 'From "Manat Nahin" and "Pag Ghungroo" to immortal cinematic anthems',
    repertoireParagraphs: [
      'In Hindustani vocal music, Raag Malkauns is synonymous with monumental Khayal bandishes such as "Manat Nahin Manero" (Vilambit Ektal/Teentaal), "Koyaliya Bole," and "Aaj More Ghar Aaye." On the bansuri, Pandit Pannalal Ghosh and Pandit Hariprasad Chaurasia recorded legendary full-length Malkauns recitals that remain milestones of recorded Indian classical music.',
      'In Indian cinema, music directors Naushad, Shankar-Jaikishan, and C. Ramchandra used Malkauns to create some of the most sublime, unforgettable songs of all time.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Manat Nahin" & "Mandir Dekh Dare" (Traditional Vilambit & Drut Khayal Bandishes)',
        contextAndAnalysis: 'Demonstrates the cavernous Mandra Saptak opening (M, d, n, S), the sustained Vadi Madhyam (g M —), and the rolling g M g S nyasa.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia – Raag Malkauns (Deep Night Concert Alaap, Jod & Gat)',
        contextAndAnalysis: 'Showcases how a bass bansuri executes sweeping two-note and three-note Meends (`M ~> g ~> S` and `S\' ~> n ~> d ~> M`) without touching Re or Pa.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Man Tarpat Hari Darshan Ko Aaj" (Baiju Bawra) & "Tu Chhupi Hai Kahan" (Navrang)',
        contextAndAnalysis: 'Naushad\'s "Man Tarpat Hari Darshan Ko Aaj" (sung by Mohammed Rafi) is universally hailed as the greatest cinematic presentation of pure Raag Malkauns (`d, n, S g M — d n d M g M g S`).'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Aadha Hai Chandrama Raat Aadhi" (Navrang) & "Deep Shikha" Classics',
        contextAndAnalysis: 'Captures the mystical midnight atmosphere of Malkauns in classic Indian cinema.'
      }
    ],
    concertProgressionHeading: 'Mastering Four Consecutive Half-Hole Notes (g, M, d, n) on the Bansuri',
    concertProgressionParagraphs: [
      'Because four of the five notes in Raag Malkauns (`g`, `M`, `d`, `n`) require half-hole shading on a standard six-hole bansuri—with only `Sa` using a standard three-finger-closed position—Malkauns is the ultimate masterclass in half-hole intonation. Never rush into fast taans in Malkauns.',
      'Spend the first half of your practice session playing ultra-slow, continuous Meends: glide from `M` down to `g` and `S` (`M ~> g ~> S`), and from `S\'` down through `n` and `d` to `M` (`S\' ~> n ~> d ~> M`). Notice how `g M g S` sounds infinitely richer when `g` is approached from `M`.'
    ]
  },

  marwa: {
    slug: 'marwa',
    ragaName: 'Raag Marwa',
    layoutVariant: 'sadhana-essays',
    accentTheme: 'amber',
    originsHeading: 'Historical Origins, Desert Dusk Traditions & The Revolutionary Architecture of Raag Marwa',
    originsSubtitle: 'How the parent scale of Marwa Thaat omits Pancham and suppresses Shadja to capture the restlessness of sunset',
    originsParagraphs: [
      'Raag Marwa is one of the most audacious, intellectually gripping, and emotionally profound creations of North Indian classical music. Originating from the ancient cultural heartland of Marwar (Rajasthan) and Malwa, and refined over centuries by Dhrupad Beenkar (Rudra Veena) and Rababiya lineages, Marwa was designated by Pandit Vishnu Narayan Bhatkhande as the eponymous Janak (parent) of the Marwa Thaat. While its scale inventory—Sa, Komal Rishabh (`r`), Shuddha Gandhar (`G`), Tivra Madhyam (`M^`), Shuddha Dhaivat (`D`), and Shuddha Nishad (`N`), omitting Pancham (`P`)—appears simple on paper, its actual melodic behavior defies every conventional rule of tonic gravity.',
      'In almost every raga of world music, the tonic (`Sa`) is the undisputed home of rest and resolution, while the fifth (`Pa`) provides harmonic grounding. Raag Marwa abolishes Pancham (`P`) altogether and treats Shadja (`S`) as a fleeting, shadow-like note that is bypassed in most ascending and descending phrases (`N, r G M^ D, N r\' N D, M^ G r`). Instead, the entire universe of Marwa is suspended between its Vadi swara, Komal Rishabh (`r`), and its Samvadi swara, Shuddha Dhaivat (`D`).',
      'On the bansuri, Raag Marwa requires extraordinary tonal discipline: the flutist must sustain half-holed Komal Re (`r`) and open/closed Shuddha Dha (`D`) with unwavering authority against the Sa-drone of the Tanpura without yielding to the magnetic temptation of resolving prematurely onto Sa.'
    ],
    treatiseCallout: {
      title: 'Tonic Suspension (Shadja-Alpatva) & The r–D Axis',
      citation: 'Beenkar & Maihar Gharana Sunset Grammar',
      insight: 'In Raag Marwa, resting heavily on Komal Rishabh (`r`) and Shuddha Dhaivat (`D`) while avoiding Pancham and keeping Shadja (`S`) recessed creates the sensation of hovering in mid-air as daylight vanishes into dusk.'
    },
    rasaHeading: 'Emotional Rasa, Sunset (Sandhiprakash) Samay & Acoustic Tension on the Bamboo Flute',
    rasaSubtitle: 'Exploring Vairagya (stoic detachment), existential wonder, and the D–M^–G–r sunset cadence',
    rasaParagraphs: [
      'Raag Marwa is the supreme evening Sandhiprakash raga, performed during the twilight transition from late afternoon through sunset (roughly 4:30 PM to 6:30 PM). Psychologically and spiritually, sunset is a liminal hour of impermanence—the sun is sinking below the horizon, shadows lengthen across the earth, and the stability of day dissolves before night has arrived. Aesthetically, Marwa embodies Vairagya (philosophical detachment), Adbhuta-Karuna (solemn, awe-struck pathos), and intense meditative expectancy.',
      'Look closely at the acoustic intervals that generate this sunset restlessness: Komal Rishabh (`r`) sits just a half-step above the Tanpura\'s Sa drone, creating a poignant, rubbing dissonance whenever the flutist holds `r` for several seconds (`N, r —`). Meanwhile, Tivra Madhyam (`M^`) forms a tritone with Sa, and Shuddha Dhaivat (`D`) stands a major sixth above Sa—forming a startling diminished-fifth / augmented-fourth relationship with Komal Re (`r` to `D`)!',
      'When a bansuri player executes the canonical Marwa phrase—leaping from `r G M^ D` and then gliding slowly back down across `D M^ G r —`—every note pulls away from the tonic, leaving the listener suspended in the amber glow of twilight until the final, hushed resolution onto `r S`.'
    ],
    acousticTakeaway: 'When holding Vadi Komal Re (`r`) in Raag Marwa on the bansuri, resist the reflex to drop down to Sa; hold `r` steady with firm diaphragmatic support so its microtonal friction against the Tanpura Sa drone creates the true Marwa mood.',
    samprakriticHeading: 'Comparative Analysis: Raag Marwa vs. Puriya, Sohini & Puriya Dhanashree',
    samprakriticSubtitle: 'The legendary "Marwa–Puriya–Sohini" triad: how identical notes create three distinct ragas',
    samprakriticIntroParagraphs: [
      'Perhaps the most famous musicological study in all of Hindustani classical music is the triad of Raag Marwa, Raag Puriya, and Raag Sohini. All three ragas use the EXACT same six notes: `S, r, G, M^, D, N` (omitting Pancham `P`). How can three major ragas share the exact same scale and yet sound unmistakably different within three seconds?',
      'The answer is a masterclass in Vadi-Samvadi weight, Saptak register, and Chalan.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Puriya',
        sharedElements: 'Exact same 6 swaras (`S r G M^ D N`, omitting Pa) of the Marwa Thaat and evening twilight time.',
        criticalDistinction: 'Marwa emphasizes Komal Re (`r`) and Shuddha Dha (`D`) with straight, bold leaps (`N, r G M^ D — M^ G r`), whereas Puriya emphasizes Gandhar (`G`) and Nishad (`N`) with sinuous Mandra Saptak phrases (`N, r G — M^ G, M^ D, N, r N, D, N, r G`).',
        bansuriNuance: 'In Marwa, pause powerfully on `r` and `D`; if you pause repeatedly on `G` and `N`, the raga turns into Puriya!'
      },
      {
        alliedRagaName: 'Raag Sohini',
        sharedElements: 'Exact same 6 swaras (`S r G M^ D N`, omitting Pa).',
        criticalDistinction: 'Marwa is a solemn sunset raga anchored in the Mandra and Madhya registers around `r` and `D` (`D M^ G r`), whereas Sohini is a sparkling pre-dawn (late-night) raga that races upward into the Taar Saptak (`G M^ D N S\' r\' S\'`).',
        bansuriNuance: 'In Marwa, avoid dwelling on Taar Sa (`S\'`); turn your upper phrases back from Nishad or Komal Re (`M^ D N r\' N D, M^ G r`).'
      },
      {
        alliedRagaName: 'Raag Multani / Todi',
        alliedRagaView: 'raga_multani',
        sharedElements: 'Shares Komal Re (`r`) and Tivra Ma (`M^`) in serious daytime/twilight contemplation.',
        criticalDistinction: 'Multani and Todi use Komal Ga (`g`), Komal Dha (`d`), and include Pancham (`P`), whereas Marwa uses bright Shuddha Ga (`G`), Shuddha Dha (`D`), and strictly forbids Pancham.',
        bansuriNuance: 'Never touch Pancham in Marwa; leap cleanly between Tivra Ma (`M^`) and Shuddha Dha (`D`).'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Master Instrumental Recitals & Film Melodies in Raag Marwa',
    repertoireSubtitle: 'From "Piya More Anat Des" and Ustad Amir Khan\'s Marwa to twilight compositions',
    repertoireParagraphs: [
      'In the classical Khayal world, Raag Marwa is forever linked with Ustad Amir Khan\'s monumental Vilambit Jhumra rendition and the classic Teentaal bandishes "Piya More Anat Des Gaye" and "Guru Bin Gyan Nahin Pave." On instrumental stages, Pandit Ravi Shankar, Ustad Ali Akbar Khan, and Pandit Hariprasad Chaurasia have recorded legendary Marwa recitals that explore the `D, N, r — G M^ D — M^ G r` architecture in breathtaking detail.',
      'Even in film music, courageous composers have used Marwa\'s twilight scale to evoke deep pathos and desert horizons.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Piya More Anat Des" & "Ab Mil Aaye" (Traditional Vilambit & Drut Khayal Bandishes)',
        contextAndAnalysis: 'Demonstrates how entire stanzas revolve around Komal Re (r) and Shuddha Dha (D) while treating Sa as a rare resting point.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia & Pandit Pannalal Ghosh – Raag Marwa Sunset Recitals',
        contextAndAnalysis: 'Shows how the bansuri executes the wide M^–D leap and the dramatic D–M^–G–r sunset glide over a Mandra-rich Alaap.'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Payaliya Bawari Baje" (Saaz Aur Awaz)',
        contextAndAnalysis: 'One of the rare and brilliant Hindi film compositions set in Raag Marwa by Naushad, showcasing the unmistakable r G M^ D M^ G r contour.'
      }
    ],
    concertProgressionHeading: 'Developing Sunset Alaap & Shadja-Avoidance on the Bansuri',
    concertProgressionParagraphs: [
      'When beginning Raag Marwa on the bansuri, resist starting on Madhya Sa. Instead, open in the lower register on Mandra Dhaivat (`D, N, r —`), letting your breath settle firmly onto half-holed Komal Rishabh (`r`). Feel the acoustic vibration of `r` against the Tanpura.',
      'From `r`, step through `G` and `M^` up to `D` (`r G M^ D —`), pause on Dhaivat, and then execute a slow, stately descent `D M^ G r —`. Only at the very conclusion of a major section—or on the final Sam of the composition—allow `r` to subside gently onto `S`.'
    ]
  },

  jog: {
    slug: 'jog',
    ragaName: 'Raag Jog',
    layoutVariant: 'comparative-symposium',
    accentTheme: 'indigo',
    originsHeading: 'Historical Origins, Dual-Gandhar Modernity & The Twentieth-Century Ascent of Raag Jog',
    originsSubtitle: 'How Ustad Mehboob Khan (Darpiya) and the Agra–Maihar maestros turned a rare Audav scale into a concert phenomenon',
    originsParagraphs: [
      'Raag Jog is one of the most thrilling, hypnotic, and blues-inflected ragas of the modern Hindustani concert stage. While references to a medieval melody named Joga appear in older Ragamala traditions, the concert form of Raag Jog as performed today was sculpted and popularized in the early twentieth century by Ustad Mehboob Khan ("Darpiya") of the Agra/Atrauli Gharana—who composed its most famous bandishes, including "O Balama" and "Sajan More Ghar Aaye"—and subsequently carried to global fame by Ustad Faiyaz Khan, Pandit Ravi Shankar, and Pandit Hariprasad Chaurasia.',
      'Structurally, Raag Jog is an Audav–Audav (pentatonic) raga classified under the Kafi Thaat that completely omits both Rishabh (`R`) and Dhaivat (`D`). What gives Jog its electrifying, otherworldly personality is its simultaneous mastery of BOTH varieties of Gandhar—bright Shuddha Gandhar (`G`) in the ascending movement (`S G M P n S\'`) and plaintive Komal Gandhar (`g`) tucked into the descending return (`S\' n P M, G M g S`)—anchored by Komal Nishad (`n`) in the upper tetrachord.',
      'On the bansuri, Raag Jog is an absolute showstopper. The ability to bend the pitch continuously from Shuddha Ga (`G`) through Komal Ga (`g`) down to Shadja (`S`) via Shuddha Ma (`G M (M)g S`) makes the bamboo flute weep and sing with unmatched expressive power.'
    ],
    treatiseCallout: {
      title: 'The Dual-Gandhar Paradox (G–M–g–S)',
      citation: 'Agra & Maihar Gharana Performance Practice',
      insight: 'In Raag Jog, Shuddha Gandhar (`G`) and Komal Gandhar (`g`) are never played as a clumsy chromatic step (`G g S`); instead, Komal Ga is always approached from above via Shuddha Madhyam (`G M, P M, (M)g S`), turning a theoretical contradiction into liquid poetry.'
    },
    rasaHeading: 'Emotional Rasa, Midnight Samay & The Blues-Like Acoustic Pull of Komal Ga',
    rasaSubtitle: 'Why the juxtaposition of Major Third (G) and Minor Third (g) evokes intense Shringar-Karuna and Jogia mysticism',
    rasaParagraphs: [
      'Raag Jog is performed during the second and third Prahars of the night (roughly 9:30 PM to 1:00 AM). Its aesthetic Rasa blends intense Vipralambha Shringar (passionate nocturnal longing), Karuna (piercing vulnerability), and Adbhuta-Bhakti (mystical absorption—the word "Jog" itself is the vernacular form of Yoga, signifying union with the divine beloved).',
      'Why does Raag Jog resonate so immediately with listeners from both Indian classical and global musical backgrounds? Acoustically, the interplay of the major third (`Shuddha Ga`), perfect fourth (`Shuddha Ma`), perfect fifth (`Pa`), flat seventh (`Komal Ni`), and flat third (`Komal Ga`) parallels the universal harmonic language of blues and modal jazz—yet within a rigorous classical architecture of Meend and Shruti.',
      'When the bansuri player opens a phrase in the Mandra Saptak (`S, n, P, n, S G M —`), the bright major third (`S G M`) establishes a warm, hopeful glow. Moments later, descending from Pancham (`P M G M, g S`), the flutist shades the Gandhar hole and slides from Madhyam across Komal Ga into Sa (`(M)g ~> S`), transforming sunny hope into a breathtaking midnight sigh.'
    ],
    acousticTakeaway: 'On the bansuri, never slide directly from Shuddha Ga to Komal Ga (`G -> g`); always bounce up to Shuddha Ma first (`G M`) and then pull a smooth Meend from Ma through half-holed Komal Ga down to Sa (`G M ~> g ~> S`).',
    samprakriticHeading: 'Comparative Analysis: Raag Jog vs. Tilang, Hanskinkini & Jogkauns',
    samprakriticSubtitle: 'Distinguishing Raag Jog from other Re-Dha-varjit pentatonic ragas on the flute',
    samprakriticIntroParagraphs: [
      'Because Raag Jog omits both Re and Dha (`S G/g M P n`), it shares its five-note skeleton with Raag Tilang and serves as the foundation for composite ragas like Raag Jogkauns and Raag Madhukauns.',
      'Compare how Nishad and Gandhar behave across these allied ragas so your Jog remains unmistakably pure.'
    ],
    samprakriticComparisons: [
      {
        alliedRagaName: 'Raag Tilang',
        alliedRagaView: 'raga_tilang',
        sharedElements: 'Both are Audav-Audav ragas omitting Re and Dha (`S G M P N/n`) with a strong `S G M P` opening.',
        criticalDistinction: 'Tilang uses ONLY Shuddha Ga (`G`) and uses both Nishads (`N` in ascent, `n` in descent: `S G M P N S\' — S\' n P M G S`), whereas Jog uses ONLY Komal Ni (`n` in primary phrases) and uses BOTH Gandhars (`G` in ascent, `g` in descent: `G M g S`).',
        bansuriNuance: 'Up to `S G M P`, Jog and Tilang sound identical; the moment you resolve `G M g S` (with Komal Ga) and climb `M P n S\'` (with Komal Ni), you establish Raag Jog.'
      },
      {
        alliedRagaName: 'Raag Jogkauns',
        alliedRagaView: 'raga_malkauns',
        sharedElements: 'Shares the complete lower tetrachord of Raag Jog (`S G M, G M g S`).',
        criticalDistinction: 'Jogkauns is a composite of Jog and Chandrakauns/Malkauns that introduces Komal Dha (`d`) and Shuddha Ni (`N`) in the upper tetrachord (`M d N S\'`), whereas pure Jog strictly omits Dhaivat and centers on `M P n S\'`.',
        bansuriNuance: 'Never touch Dhaivat in pure Raag Jog; keep the upper movement strictly on `M P n S\' n P M`.'
      },
      {
        alliedRagaName: 'Raag Kafi / Bhimpalasi',
        alliedRagaView: 'raga_bhimpalasi',
        sharedElements: 'Shares `g`, `M`, `P`, and `n` from Kafi Thaat.',
        criticalDistinction: 'Bhimpalasi uses only Komal Ga (`g`) and includes Re and Dha in descent, whereas Jog uses both `G` and `g` and strictly forbids Re and Dha.',
        bansuriNuance: 'When descending from `g` to `S` in Jog (`G M g S`), close directly onto `S` without ever touching `R`.'
      }
    ],
    repertoireHeading: 'Iconic Classical Bandishes, Bansuri Duets & Film Melodies in Raag Jog',
    repertoireSubtitle: 'From "Sajan More Ghar Aaye" and "O Balama" to contemporary classical-fusion classics',
    repertoireParagraphs: [
      'In the classical Khayal repertoire, Ustad Mehboob Khan\'s "Sajan More Ghar Aaye" (Madhya-laya Teentaal) and "O Balama" (Drut Teentaal) are sung by virtually every major vocalist in India. On the instrumental stage, Pandit Hariprasad Chaurasia\'s solo bansuri recitals and his iconic jugalbandis in Raag Jog have introduced millions of listeners around the world to the magic of the `G M P n P M G M g S` cadence.',
      'In film and light-classical music, Raag Jog\'s bluesy, intoxicating dual-Gandhar motif has inspired memorable songs.'
    ],
    notableWorks: [
      {
        category: 'Classical Bandish / Dhrupad',
        title: '"Sajan More Ghar Aaye" & "O Balama" (Ustad Mehboob Khan "Darpiya" – Teentaal)',
        contextAndAnalysis: 'The foundational compositions of Raag Jog, demonstrating how S G M P n P M and G M g S weave together seamlessly.'
      },
      {
        category: 'Concert Bansuri / Instrumental',
        title: 'Pandit Hariprasad Chaurasia – Raag Jog (Live Concert Recitals & Call of the Valley Heritage)',
        contextAndAnalysis: 'A masterclass in how the bansuri bends Shuddha Ma into Komal Ga (`(M)g S`) and explores deep Mandra Pancham and Komal Ni (`P, n, S`).'
      },
      {
        category: 'Film & Light-Classical Reference',
        title: '"Noor-e-Khuda" (My Name Is Khan — Jog-Inflected) & Classical Ghazals in Jog',
        contextAndAnalysis: 'Showcases how the alternating major-third (`S G M`) and minor-third (`M g S`) colors create immediate emotional poignancy.'
      }
    ],
    concertProgressionHeading: 'Perfecting the (M)g–S Glide & Taar-Saptak Komal Ga on the Flute',
    concertProgressionParagraphs: [
      'When practicing Raag Jog on the bansuri, pay close attention to two critical regions: first, in the Purvanga, always approach Komal Ga with a strong Kana (grace) or glide from Shuddha Ma (`G M, P M, (M)g S`). Second, when your improvisation climbs into the Taar Saptak (`M P n S\'`), remember that above Taar Sa, traditional performers primarily use Komal Ga (`n S\' g\' S\' n P M`) rather than ascending too high on Shuddha Ga, which intensifies the nocturnal pathos at the climax of the Antara.',
      'Practice the exercises and the FluteSangam original composition below with a steady Tanpura drone to internalize the magnetic tension between `G` and `g`.'
    ]
  }
};
