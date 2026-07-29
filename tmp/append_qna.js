import fs from 'fs';

const newItems = [
  // 🎵 General Beginner Songs
  {
    id: 'rec_easiest_songs_with_notes',
    question: 'Which are the easiest flute songs for beginners with notes?',
    category: 'Songs',
    answer: 'Top easiest flute songs with notes include *Hai Apna Dil To Aawara*, *Pee Loon*, *Lag Ja Gale*, *Itni Shakti Hame Dena Data*, and *Zara Zara*. Our Song Library provides step-by-step Swara notations for all these tracks.',
    keywords: ['easiest flute songs with notes', 'beginner flute songs notes'],
    relatedIds: ['sng_easiest_beginners', 'rec_top10_beginner_songs_notes']
  },
  {
    id: 'rec_top10_beginner_songs_notes',
    question: 'What are the top 10 beginner flute songs with notes?',
    category: 'Songs',
    answer: '1. *Hai Apna Dil To Aawara*\n2. *Pee Loon*\n3. *Lag Ja Gale*\n4. *Zara Zara*\n5. *Itni Shakti Hame Dena Data*\n6. *Achyutam Keshavam*\n7. *Chhookar Mere Manko*\n8. *Tujhe Dekha To Yeh Jaana Sanam*\n9. *Vande Mataram*\n10. *Sare Jahan Se Achha*.',
    keywords: ['top 10 beginner flute songs with notes', 'best beginner flute songs'],
    relatedIds: ['sng_easiest_beginners', 'rec_easiest_songs_with_notes']
  },
  {
    id: 'rec_bollywood_easiest_notes',
    question: 'Which Bollywood songs are easiest to learn with notes?',
    category: 'Songs',
    answer: '*Hai Apna Dil To Aawara*, *Pee Loon*, *Zara Zara*, *Chhookar Mere Manko*, and *Tujhe Dekha To Yeh Jaana Sanam* are easiest to learn using Swara notations.',
    keywords: ['bollywood songs easiest with notes', 'easy hindi songs notes'],
    relatedIds: ['sng_easiest_beginners', 'sc_c_nat_bollywood']
  },
  {
    id: 'rec_devotional_easiest_notes',
    question: 'Which devotional songs are easiest with flute notes?',
    category: 'Songs',
    answer: '*Itni Shakti Hame Dena Data*, *Achyutam Keshavam*, *Yashomati Maiya Se Bole Nandlala*, and *O Palanhare* are the easiest bhajans to play with Indian Swara notation.',
    keywords: ['devotional songs easiest with flute notes', 'easy bhajan notes'],
    relatedIds: ['rec_devotional_film_songs', 'rg_list_devotional']
  },
  {
    id: 'rec_patriotic_easy_notes',
    question: 'Which patriotic songs are easy with notes?',
    category: 'Songs',
    answer: '*Sare Jahan Se Achha*, *Vande Mataram*, *Ae Watan* (*Raazi*), and *Jana Gana Mana* feature straightforward notes for beginners.',
    keywords: ['patriotic songs easy with notes', 'easy patriotic flute notes'],
    relatedIds: ['rec_patriotic_songs', 'rg_desh_overview']
  },
  {
    id: 'rec_nursery_rhymes_notes',
    question: 'Which nursery rhymes can I play on flute with notes?',
    category: 'Songs',
    answer: '• *Twinkle Twinkle Little Star*\n• *Lakdi Ki Kathi*\n• *Jingle Bells*\n• *Nani Teri Marni Ko Mor Le Gaye*\n• *Mary Had a Little Lamb*.',
    keywords: ['nursery rhymes flute notes', 'kids songs flute notes'],
    relatedIds: ['rec_gen_songs_for_children', 'beg_child_flute']
  },
  {
    id: 'rec_songs_basic_seven_notes',
    question: 'Which songs use only the basic seven notes?',
    category: 'Songs',
    answer: 'Songs based on Bilawal or Kalyan thaat like *Hai Apna Dil To Aawara*, *Yashomati Maiya*, *Achyutam Keshavam*, and *Sare Jahan Se Achha* stick almost exclusively to Shuddha (natural) Swaras (S R G M P D N).',
    keywords: ['songs use only basic seven notes', 'shuddha swara songs'],
    relatedIds: ['thaat_bilawal_ragas', 'rec_top10_beginner_songs_notes']
  },
  {
    id: 'rec_songs_learn_in_one_day',
    question: 'Which songs can I learn in one day?',
    category: 'Songs',
    answer: 'With basic blowing and fingering knowledge, you can learn simple 4-to-8 line melodies in one day, such as *Hai Apna Dil To Aawara*, *Twinkle Twinkle Little Star*, or *Achyutam Keshavam*.',
    keywords: ['songs can I learn in one day', 'quickest flute songs'],
    relatedIds: ['sng_easiest_beginners', 'rec_easiest_songs_with_notes']
  },
  {
    id: 'rec_songs_should_learn_first',
    question: 'Which songs should I learn first on the flute?',
    category: 'Songs',
    answer: 'Start with *Hai Apna Dil To Aawara* (simple rhythm), *Pee Loon* (smooth 5-note pentatonic melody), or *Itni Shakti Hame Dena Data* (clean devotional swaras).',
    keywords: ['songs should I learn first on flute', 'first song to learn bansuri'],
    relatedIds: ['sng_easiest_beginners', 'rec_gen_songs_every_player_learn']
  },
  {
    id: 'rec_songs_complete_beginners',
    question: 'Which songs are suitable for complete beginners?',
    category: 'Songs',
    answer: 'Complete beginners should choose short, slow melodies without upper octave or half-hole notes, such as *Hai Apna Dil To Aawara*, *Pee Loon*, and *Lakdi Ki Kathi*.',
    keywords: ['songs suitable for complete beginners', 'first week flute songs'],
    relatedIds: ['sng_easiest_beginners', 'rec_easiest_songs_with_notes']
  },

  // 🪈 By Flute Scale
  {
    id: 'rec_scale_g_nat_beginner_notes',
    question: 'Beginner songs with notes for G Natural flute',
    category: 'Notes & Scales',
    answer: 'For G Natural Base flute, start with *Hai Apna Dil To Aawara*, *Pee Loon*, *Lag Ja Gale*, and *Itni Shakti Hame Dena Data* using standard S R G M P D N notations.',
    keywords: ['beginner songs notes g natural flute', 'g base beginner songs notes'],
    relatedIds: ['sc_g_base_beginner', 'fl_g_natural_scale']
  },
  {
    id: 'rec_scale_c_nat_beginner_notes',
    question: 'Beginner songs with notes for C Natural flute',
    category: 'Notes & Scales',
    answer: 'C Natural Middle is lightweight and easy to hold. Great beginner songs with notes include *Pee Loon*, *Zara Zara*, *Hai Apna Dil To Aawara*, and *Achyutam Keshavam*.',
    keywords: ['beginner songs notes c natural flute', 'c natural beginner songs notes'],
    relatedIds: ['sc_c_nat_beginner_songs', 'fl_c_natural_scale']
  },
  {
    id: 'rec_scale_a_nat_beginner_notes',
    question: 'Beginner songs with notes for A Natural flute',
    category: 'Notes & Scales',
    answer: 'A Natural Base provides a rich warm sound. Best beginner songs with notation are *Lag Ja Gale*, *Pee Loon*, *Zara Zara*, and *Tere Bina Zindagi Se*.',
    keywords: ['beginner songs notes a natural flute', 'a base beginner songs notes'],
    relatedIds: ['sc_a_base_beginner', 'fl_g_natural_scale']
  },
  {
    id: 'rec_scale_e_base_beginner_notes',
    question: 'Beginner songs with notes for E Base flute',
    category: 'Notes & Scales',
    answer: 'E Base requires steady breath support. Practice slow, soothing melodies like *Lag Ja Gale*, *Yashomati Maiya*, *Tere Bina Zindagi Se*, and *O Palanhare*.',
    keywords: ['beginner songs notes e base flute', 'e base beginner songs notes'],
    relatedIds: ['sc_e_nat_beginner', 'fl_e_natural_scale']
  },
  {
    id: 'rec_scale_f_base_beginner_notes',
    question: 'Beginner songs with notes for F Base flute',
    category: 'Notes & Scales',
    answer: 'F Base has a resonant, deep tone. Recommended beginner songs with notes: *Lag Ja Gale*, *Pee Loon*, *Zara Zara*, and *Achyutam Keshavam*.',
    keywords: ['beginner songs notes f base flute', 'f base beginner songs notes'],
    relatedIds: ['sc_f_nat_beginner', 'fl_c_natural_scale']
  },
  {
    id: 'rec_scale_d_nat_beginner_notes',
    question: 'Beginner songs with notes for D Natural flute',
    category: 'Notes & Scales',
    answer: 'D Natural Middle is easy on small hands. Beginner favorites with notes: *Hai Apna Dil To Aawara*, *Yeh Shaam Mastani*, *Pee Loon*, and *Lakdi Ki Kathi*.',
    keywords: ['beginner songs notes d natural flute', 'd natural beginner songs notes'],
    relatedIds: ['sc_d_nat_beginner', 'sc_d_nat_children']
  },
  {
    id: 'rec_scale_b_nat_beginner_notes',
    question: 'Beginner songs with notes for B Natural flute',
    category: 'Notes & Scales',
    answer: 'B Natural Base is warm and expressive. Great beginner songs with notes include *Lag Ja Gale*, *Zara Zara*, *Achyutam Keshavam*, and *Yeh Kahan Aa Gaye Hum*.',
    keywords: ['beginner songs notes b natural flute', 'b base beginner songs notes'],
    relatedIds: ['sc_b_base_beginner', 'fl_g_natural_scale']
  },

  // 🎬 Bollywood Songs
  {
    id: 'rec_bolly_easy_notes',
    question: 'Easy Bollywood songs with flute notes',
    category: 'Songs',
    answer: '• *Hai Apna Dil To Aawara*\n• *Pee Loon*\n• *Lag Ja Gale*\n• *Zara Zara*\n• *Chhookar Mere Manko*\n• *Tujhe Dekha To Yeh Jaana Sanam*.',
    keywords: ['easy bollywood songs with flute notes', 'simple hindi flute notes'],
    relatedIds: ['rec_bollywood_easiest_notes', 'sng_easiest_beginners']
  },
  {
    id: 'rec_bolly_middle_octave_only',
    question: 'Bollywood flute songs using only middle octave notes',
    category: 'Songs',
    answer: '*Lag Ja Gale*, *Hai Apna Dil To Aawara*, *Zara Zara*, and *Chhookar Mere Manko* stay almost entirely in the middle octave (Madhya Saptak).',
    keywords: ['bollywood flute songs middle octave only', 'madhya saptak bollywood songs'],
    relatedIds: ['rec_middle_octave_songs', 'sc_c_nat_middle_octave']
  },
  {
    id: 'rec_bolly_romantic_notes',
    question: 'Romantic Bollywood songs with flute notes',
    category: 'Songs',
    answer: '• *Pee Loon*\n• *Kesariya*\n• *Tum Hi Ho*\n• *Zara Zara*\n• *Pehla Nasha*\n• *Lag Ja Gale*.',
    keywords: ['romantic bollywood songs with flute notes', 'love songs flute notation'],
    relatedIds: ['rec_romantic_bansuri', 'sc_c_nat_romantic_songs']
  },
  {
    id: 'rec_bolly_old_classic_notes',
    question: 'Old Bollywood songs with flute notes',
    category: 'Songs',
    answer: '• *Lag Ja Gale*\n• *Tere Bina Zindagi Se*\n• *Yeh Shaam Mastani*\n• *Chhookar Mere Manko*\n• *Hai Apna Dil To Aawara*\n• *Chupke Chupke Raat Din*.',
    keywords: ['old bollywood songs with flute notes', 'retro hindi flute notes'],
    relatedIds: ['rec_romantic_bansuri', 'sc_csharp_bollywood']
  },
  {
    id: 'rec_bolly_new_trending_notes',
    question: 'New Bollywood songs with flute notes',
    category: 'Songs',
    answer: '• *Kesariya* (*Brahmastra*)\n• *Raataan Lambiyan* (*Shershaah*)\n• *Apna Bana Le* (*Bhediya*)\n• *Tum Se Hi* (*Jab We Met*)\n• *Moh Moh Ke Dhaage*.',
    keywords: ['new bollywood songs with flute notes', 'trending hindi flute notes'],
    relatedIds: ['sc_c_nat_romantic_songs', 'rec_romantic_bansuri']
  },
  {
    id: 'rec_artist_arijit_singh_easy',
    question: 'Easy Arijit Singh songs with flute notes',
    category: 'Songs',
    answer: '• *Tum Hi Ho* (*Aashiqui 2*)\n• *Kesariya* (*Brahmastra*)\n• *Apna Bana Le* (*Bhediya*)\n• *Samjhawan* (*Humpty Sharma Ki Dulhania*).',
    keywords: ['easy arijit singh songs flute notes', 'arijit singh bansuri notes'],
    relatedIds: ['rec_bolly_new_trending_notes', 'rec_romantic_bansuri']
  },
  {
    id: 'rec_artist_kishore_kumar_easy',
    question: 'Easy Kishore Kumar songs with flute notes',
    category: 'Songs',
    answer: '• *Yeh Shaam Mastani*\n• *Chhookar Mere Manko*\n• *O Mere Dil Ke Chain*\n• *Pal Pal Dil Ke Paas*\n• *Pyaar Deewana Hota Hai*.',
    keywords: ['easy kishore kumar songs flute notes', 'kishore kumar bansuri notes'],
    relatedIds: ['rec_bolly_old_classic_notes', 'sc_d_nat_bollywood']
  },
  {
    id: 'rec_artist_lata_mangeshkar_easy',
    question: 'Easy Lata Mangeshkar songs with flute notes',
    category: 'Songs',
    answer: '• *Lag Ja Gale*\n• *Tujhe Dekha To Yeh Jaana Sanam*\n• *Adekha Hai Pehli Baar*\n• *Yashomati Maiya Se Bole Nandlala*\n• *Tere Bina Zindagi Se*.',
    keywords: ['easy lata mangeshkar songs flute notes', 'lata mangeshkar bansuri notes'],
    relatedIds: ['rec_bolly_old_classic_notes', 'sc_c_nat_bollywood']
  },
  {
    id: 'rec_artist_mohammed_rafi_easy',
    question: 'Easy Mohammed Rafi songs with flute notes',
    category: 'Songs',
    answer: '• *Hai Apna Dil To Aawara*\n• *Likhe Jo Khat Tujhe*\n• *Chaudhvin Ka Chand Ho*\n• *Gulabi Aankhen*\n• *Ehsan Tera Hoga Mujh Par*.',
    keywords: ['easy mohammed rafi songs flute notes', 'mohammed rafi bansuri notes'],
    relatedIds: ['rec_bolly_old_classic_notes', 'sng_easiest_beginners']
  },
  {
    id: 'rec_bolly_beginner_hindi_notation',
    question: 'Beginner Hindi flute songs with notation',
    category: 'Songs',
    answer: 'Check our app\'s Song Library tab for full line-by-line Swara notations for top beginner Hindi songs like *Pee Loon*, *Lag Ja Gale*, *Zara Zara*, and *Vande Mataram*.',
    keywords: ['beginner hindi flute songs notation', 'hindi flute sargam notes'],
    relatedIds: ['rec_bolly_easy_notes', 'sng_easiest_beginners']
  },

  // 🙏 Devotional Songs
  {
    id: 'rec_dev_krishna_bhajans_notes',
    question: 'Easy Krishna bhajans with flute notes',
    category: 'Songs',
    answer: '• *Achyutam Keshavam*\n• *Yashomati Maiya Se Bole Nandlala*\n• *Badi Der Bhai Nandlala*\n• *Choti Choti Gaiya Chote Chote Gwal*\n• *Radhe Radhe Barsane Wali Radhe*.',
    keywords: ['easy krishna bhajans flute notes', 'krishna flute notes'],
    relatedIds: ['rec_devotional_film_songs', 'rg_list_devotional']
  },
  {
    id: 'rec_dev_shiva_bhajans_notes',
    question: 'Easy Shiva bhajans with flute notes',
    category: 'Songs',
    answer: '• *Namo Namo* (*Kedarnath*)\n• *Shiv Tandav Stotram* (Slow Theme)\n• *Bolo Har Har Har*\n• *Shiv Shankara / Karpura Gauram*.',
    keywords: ['easy shiva bhajans flute notes', 'mahadev flute notes'],
    relatedIds: ['rec_devotional_film_songs', 'rg_list_devotional']
  },
  {
    id: 'rec_dev_ganesh_bhajans_notes',
    question: 'Easy Ganesh bhajans with flute notes',
    category: 'Songs',
    answer: '• *Jai Ganesh Deva* (Aarti)\n• *Sukhkarta Dukhharta*\n• *Morya Re* (*Don*)\n• *Gajanana* (*Bajirao Mastani*).',
    keywords: ['easy ganesh bhajans flute notes', 'ganpati flute notes'],
    relatedIds: ['rec_devotional_film_songs', 'rg_list_devotional']
  },
  {
    id: 'rec_dev_ram_bhajans_notes',
    question: 'Easy Ram bhajans with flute notes',
    category: 'Songs',
    answer: '• *Shri Ram Chandra Kripalu Bhajman*\n• *Ram Siya Ram* (*Adipurush*)\n• *Payoji Maine Ram Ratan Dhan Payo*\n• *Mangal Bhavan Amangal Hari*.',
    keywords: ['easy ram bhajans flute notes', 'ram bhajan flute notes'],
    relatedIds: ['rec_devotional_film_songs', 'rg_list_devotional']
  },
  {
    id: 'rec_dev_sai_baba_bhajans_notes',
    question: 'Easy Sai Baba bhajans with flute notes',
    category: 'Songs',
    answer: '• *Sai Ram Sai Shyam Sai Bhagwan*\n• *Shirdi Wale Sai Baba*\n• *Om Sai Namo Namah*.',
    keywords: ['easy sai baba bhajans flute notes', 'sai baba flute notes'],
    relatedIds: ['rec_devotional_film_songs', 'rg_list_devotional']
  },
  {
    id: 'rec_dev_easy_flute_songs_beginners',
    question: 'Easy devotional flute songs for beginners',
    category: 'Songs',
    answer: '• *Itni Shakti Hame Dena Data*\n• *Achyutam Keshavam*\n• *Yashomati Maiya*\n• *O Palanhare*\n• *Vaishnav Jan To*.',
    keywords: ['easy devotional flute songs beginners', 'simple bhajan notes'],
    relatedIds: ['rec_devotional_easiest_notes', 'rg_list_devotional']
  },
  {
    id: 'rec_dev_beginner_bhajans_notation',
    question: 'Beginner bhajans with Indian flute notation',
    category: 'Songs',
    answer: 'Our Song Library section offers complete Indian Sargam (S R G M P D N) notes for popular bhajans like *Achyutam Keshavam* and *Itni Shakti Hame Dena Data*.',
    keywords: ['beginner bhajans indian flute notation', 'bhajan sargam notes'],
    relatedIds: ['rec_dev_easy_flute_songs_beginners', 'rg_list_devotional']
  },

  // 🇮🇳 Patriotic Songs
  {
    id: 'rec_patr_songs_flute_notes',
    question: 'Patriotic songs with flute notes',
    category: 'Songs',
    answer: '• *Vande Mataram*\n• *Sare Jahan Se Achha*\n• *Ae Watan* (*Raazi*)\n• *Jana Gana Mana*\n• *Maa Tujhe Salaam*\n• *Kar Chale Hum Fida*.',
    keywords: ['patriotic songs flute notes', 'desh bhakti flute notes'],
    relatedIds: ['rec_patriotic_songs', 'rg_desh_overview']
  },
  {
    id: 'rec_patr_easy_beginners',
    question: 'Easy patriotic flute songs for beginners',
    category: 'Songs',
    answer: '*Sare Jahan Se Achha* and *Jana Gana Mana* are the easiest patriotic tunes to play on the bansuri as they use simple, steady swaras.',
    keywords: ['easy patriotic flute songs beginners', 'simple patriotic notes'],
    relatedIds: ['rec_patriotic_easy_notes', 'rec_patriotic_songs']
  },
  {
    id: 'rec_patr_vande_mataram_notes',
    question: 'Vande Mataram flute notes',
    category: 'Songs',
    answer: '*Vande Mataram* is based on **Raag Desh** (S R M P N S\' / S\' n D P M G R S). It sounds inspiring and soul-stirring on any bansuri.',
    keywords: ['vande mataram flute notes', 'vande mataram bansuri sargam'],
    relatedIds: ['rec_patriotic_songs', 'rg_desh_overview']
  },
  {
    id: 'rec_patr_sare_jahan_se_achha_notes',
    question: 'Sare Jahan Se Achha flute notes',
    category: 'Songs',
    answer: '*Sare Jahan Se Achha* uses straightforward Shuddha notes in the middle octave, making it one of the first songs beginners master.',
    keywords: ['sare jahan se achha flute notes', 'sare jahan se achha bansuri'],
    relatedIds: ['rec_patriotic_easy_notes', 'rec_patriotic_songs']
  },
  {
    id: 'rec_patr_ae_watan_notes',
    question: 'Ae Watan flute notes',
    category: 'Songs',
    answer: '*Ae Watan* (*Raazi*) is an emotional, melodious patriotic song that sounds expressive on E Medium and G Natural Base flutes.',
    keywords: ['ae watan flute notes', 'ae watan raazi bansuri notes'],
    relatedIds: ['rec_patriotic_songs', 'sc_e_nat_bollywood']
  },
  {
    id: 'rec_patr_jana_gana_mana_notes',
    question: 'Jana Gana Mana flute notes',
    category: 'Songs',
    answer: 'The Indian National Anthem follows clean Bilawal thaat notes (S R G M P D N). Keep blowing steady and solemn without unnecessary ornamentations.',
    keywords: ['jana gana mana flute notes', 'national anthem bansuri notes'],
    relatedIds: ['rec_patriotic_easy_notes', 'thaat_bilawal_ragas']
  },
  {
    id: 'rec_patr_maa_tujhe_salaam_notes',
    question: 'Maa Tujhe Salaam flute notes',
    category: 'Songs',
    answer: 'AR Rahman\'s *Maa Tujhe Salaam* requires strong rhythm and crisp upper octave transitions (Taar Saptak). Great for intermediate players!',
    keywords: ['maa tujhe salaam flute notes', 'vande mataram ar rahman bansuri'],
    relatedIds: ['rec_patriotic_songs', 'sng_suitable_intermediate']
  },

  // 🎼 Classical
  {
    id: 'rec_clas_beginner_raag_songs_notes',
    question: 'Beginner Raag-based songs with notes',
    category: 'Music Theory',
    answer: '• **Raag Bhupali**: *Jyoti Kalash Jhalke*\n• **Raag Yaman**: *Ehsan Tera Hoga Mujh Par*, *Chupke Chupke Raat Din*\n• **Raag Kafi**: *Radhe Radhe Barsane Wali*\n• **Raag Desh**: *Vande Mataram*.',
    keywords: ['beginner raag based songs notes', 'raag songs flute notation'],
    relatedIds: ['rg_list_beginner', 'icm_hindustani_music']
  },
  {
    id: 'rec_clas_easy_yaman_songs',
    question: 'Easy Raag Yaman songs with notes',
    category: 'Music Theory',
    answer: '• *Ehsan Tera Hoga Mujh Par*\n• *Chupke Chupke Raat Din*\n• *Jab Deep Jale Aana*\n• *Aapki Ankhon Mein Kuch*.',
    keywords: ['easy raag yaman songs notes', 'yaman Bollywood songs flute'],
    relatedIds: ['rg_yaman', 'thaat_kalyan_ragas']
  },
  {
    id: 'rec_clas_easy_bhupali_songs',
    question: 'Easy Raag Bhupali songs with notes',
    category: 'Music Theory',
    answer: '• *Jyoti Kalash Jhalke*\n• *Pankh Hote To Udd Aati Re*\n• *Dekha Ek Khwab To Yeh Silsile Huye* (Chorus).',
    keywords: ['easy raag bhupali songs notes', 'bhupali hindi songs flute'],
    relatedIds: ['rg_bhupali', 'rg_list_beginner']
  },
  {
    id: 'rec_clas_easy_durga_songs',
    question: 'Easy Raag Durga songs with notes',
    category: 'Music Theory',
    answer: '• *Geet Gaya Patharon Ne*\n• *Chandan Sa Badan* (influenced by Durga pentatonic scale).',
    keywords: ['easy raag durga songs notes', 'durga flute songs'],
    relatedIds: ['rg_durga_overview', 'rg_list_beginner']
  },
  {
    id: 'rec_clas_easy_desh_songs',
    question: 'Easy Raag Desh songs with notes',
    category: 'Music Theory',
    answer: '• *Vande Mataram*\n• *Phir Se Aaiyo Re*\n• *Bekas Pe Karam Kijeye*.',
    keywords: ['easy raag desh songs notes', 'desh flute songs'],
    relatedIds: ['rg_desh_overview', 'rec_patriotic_songs']
  },
  {
    id: 'rec_clas_easy_compositions_notes',
    question: 'Easy classical compositions with flute notes',
    category: 'Music Theory',
    answer: 'Learn basic Chhota Khayal Bandishes in **Raag Bhupali** (*Eri Ali Piya Bina*) or **Raag Yaman** (*Eri Aali Jinani*) to build classical foundations.',
    keywords: ['easy classical compositions flute notes', 'bandish flute notes'],
    relatedIds: ['rg_list_beginner', 'icm_hindustani_music']
  },

  // 🎵 By Difficulty
  {
    id: 'rec_diff_songs_sa_re_ga_only',
    question: 'Songs using only Sa Re Ga',
    category: 'Practice',
    answer: 'Simple nursery rhythms, basic Alankars, and initial warm-up phrases like *Sa Re Ga Ga Re Sa* use only the first three notes to build finger memory.',
    keywords: ['songs using only sa re ga', 'three note flute songs'],
    relatedIds: ['al_what_are_alankars', 'sng_easiest_beginners']
  },
  {
    id: 'rec_diff_songs_sa_re_ga_ma_only',
    question: 'Songs using only Sa Re Ga Ma',
    category: 'Practice',
    answer: 'Short exercises and simple folk themes use S R G M. Master M (half hole blowing or sharp Tivra M) before moving on to 5-note songs.',
    keywords: ['songs using only sa re ga ma', 'four note flute songs'],
    relatedIds: ['al_what_are_alankars', 'fing_half_holes']
  },
  {
    id: 'rec_diff_songs_no_upper_octave',
    question: 'Songs without upper octave notes',
    category: 'Practice',
    answer: '*Lag Ja Gale*, *Hai Apna Dil To Aawara*, *Chhookar Mere Manko*, and *Itni Shakti Hame Dena Data* stay comfortably within Madhya Saptak.',
    keywords: ['songs without upper octave notes', 'middle octave only flute songs'],
    relatedIds: ['rec_middle_octave_songs', 'sap_middle_octave']
  },
  {
    id: 'rec_diff_songs_no_meend',
    question: 'Songs without Meend',
    category: 'Practice',
    answer: 'Rhythmic, staccato songs like *Hai Apna Dil To Aawara*, *Jingle Bells*, and *Twinkle Twinkle* do not strictly require heavy vocal glides (Meend).',
    keywords: ['songs without meend', 'staccato flute songs'],
    relatedIds: ['tech_meend', 'sng_easiest_beginners']
  },
  {
    id: 'rec_diff_songs_no_gamak',
    question: 'Songs without Gamak',
    category: 'Practice',
    answer: 'Almost all light Bollywood romantic tracks (*Pee Loon*, *Zara Zara*, *Lag Ja Gale*) can be played smoothly using gentle Kan Swaras without heavy classical Gamak oscillations.',
    keywords: ['songs without gamak', 'non classical flute songs'],
    relatedIds: ['tech_gamak', 'tech_kan_swar']
  },
  {
    id: 'rec_diff_songs_breath_control',
    question: 'Songs for breath control practice',
    category: 'Practice',
    answer: '• *Yeh Kahan Aa Gaye Hum*\n• *Roz Roz Aankhon Tale*\n• *Tujhse Naraz Nahin Zindagi*\n• *O Palanhare*.',
    keywords: ['songs for breath control practice', 'breath stamina flute songs'],
    relatedIds: ['rec_breath_control_songs', 'br_breath_control']
  },
  {
    id: 'rec_diff_songs_finger_speed',
    question: 'Songs for finger speed practice',
    category: 'Practice',
    answer: '• *Jiya Jale*\n• *Senorita*\n• *Albela Sajan Aayo Re*\n• *Silsila Ye Yeena Ka*.',
    keywords: ['songs for finger speed practice', 'fast fingering flute songs'],
    relatedIds: ['sng_improve_finger_speed', 'fing_increase_speed']
  },
  {
    id: 'rec_diff_songs_middle_octave',
    question: 'Songs using only middle octave',
    category: 'Practice',
    answer: '*Lag Ja Gale*, *Hai Apna Dil To Aawara*, *Zara Zara*, and *Chhookar Mere Manko* keep you strictly in Madhya Saptak.',
    keywords: ['songs using only middle octave', 'madhya saptak songs'],
    relatedIds: ['rec_middle_octave_songs', 'sap_middle_octave']
  },
  {
    id: 'rec_diff_songs_first_week_learners',
    question: 'Songs for first-week flute learners',
    category: 'Practice',
    answer: '1. *Twinkle Twinkle Little Star*\n2. *Hai Apna Dil To Aawara*\n3. *Lakdi Ki Kathi*.',
    keywords: ['songs for first week flute learners', 'first week bansuri practice'],
    relatedIds: ['sng_easiest_beginners', 'rec_easiest_songs_with_notes']
  },
  {
    id: 'rec_diff_songs_after_alankars',
    question: 'Songs after learning Alankars',
    category: 'Practice',
    answer: 'Once you can play 10 basic Alankars smoothly, try *Pee Loon*, *Achyutam Keshavam*, *Zara Zara*, and *Sare Jahan Se Achha*.',
    keywords: ['songs after learning alankars', 'post alankar songs'],
    relatedIds: ['al_what_are_alankars', 'sng_easiest_beginners']
  },

  // 🎯 Learning Questions
  {
    id: 'rec_learn_read_flute_notes',
    question: 'How do I read flute notes for songs?',
    category: 'Basics & Getting Started',
    answer: 'Flute notes use Indian Sargam: S (Sa), R (Re), G (Ga), M (Ma), P (Pa), D (Dha), N (Ni).\n• Lower octave: .S .R .G (dot below)\n• Middle octave: S R G (plain)\n• Upper octave: S\' R\' G\' (dot or apostrophe above).',
    keywords: ['how do I read flute notes for songs', 'reading sargam notation'],
    relatedIds: ['fl_g_natural_scale', 'al_what_are_alankars']
  },
  {
    id: 'rec_learn_notes_suitable_beginners',
    question: 'Are these notes suitable for beginners?',
    category: 'Basics & Getting Started',
    answer: 'Yes! All notations in our Song Library are simplified into clean Swara letters without overly complicated classical symbols so beginners can play immediately.',
    keywords: ['are these notes suitable for beginners', 'easy notation beginner flute'],
    relatedIds: ['rec_learn_read_flute_notes', 'sng_easiest_beginners']
  },
  {
    id: 'rec_learn_which_flute_for_song',
    question: 'Which flute should I use for this song?',
    category: 'Choosing a Flute',
    answer: 'You can play ANY song on ANY bansuri scale by using relative Swaras (S R G M P D N). However, E Medium or G Natural Base are recommended for best acoustic tone.',
    keywords: ['which flute should I use for this song', 'which scale for hindi song'],
    relatedIds: ['ch_best_for_beginners', 'fl_g_natural_scale']
  },
  {
    id: 'rec_learn_which_octave_used',
    question: 'Which octave is used in this song?',
    category: 'Notes & Scales',
    answer: 'Most Bollywood melodies sit mainly in **Madhya Saptak** (Middle Octave), touching **Mandra Saptak** (Lower) in verses and **Taar Saptak** (Upper) in choruses/Antara.',
    keywords: ['which octave is used in this song', 'saptak in flute songs'],
    relatedIds: ['sap_middle_octave', 'rec_middle_octave_songs']
  },
  {
    id: 'rec_learn_which_raag_based',
    question: 'Which Raag is this song based on?',
    category: 'Music Theory',
    answer: 'Many Hindi film songs are inspired by classical Raagas (e.g., *Vande Mataram* in Raag Desh, *Lag Ja Gale* in Raag Pahadi, *Chupke Chupke* in Raag Yaman). Check our song cards for Raag details!',
    keywords: ['which raag is this song based on', 'raag of bollywood song'],
    relatedIds: ['rg_list_beginner', 'icm_hindustani_music']
  },
  {
    id: 'rec_learn_how_difficult_song',
    question: 'How difficult is this song?',
    category: 'Practice',
    answer: 'We tag songs into **Beginner** (linear notes, middle octave), **Intermediate** (some upper octave or Komal swaras), and **Advanced** (fast tempo, complex Meends).',
    keywords: ['how difficult is this song', 'flute song difficulty rating'],
    relatedIds: ['sng_easiest_beginners', 'sng_suitable_intermediate']
  },
  {
    id: 'rec_learn_techniques_used_in_song',
    question: 'What techniques are used in this song?',
    category: 'Techniques',
    answer: 'Common bansuri techniques include **Meend** (vocal slide between notes), **Kan Swara** (grace touch note), **Khatka** (rapid note cluster), and **Tonguing** (crisp attacks).',
    keywords: ['what techniques are used in this song', 'flute ornamentation techniques'],
    relatedIds: ['tech_meend', 'tech_kan_swar', 'tech_khatka']
  },
  {
    id: 'rec_learn_play_on_g_natural',
    question: 'Can I play this song on a G Natural flute?',
    category: 'Notes & Scales',
    answer: 'Yes! G Natural Base is the ultimate standard for playing Bollywood songs, devotional bhajans, and classical Raagas.',
    keywords: ['can I play this song on a g natural flute', 'g base song compatibility'],
    relatedIds: ['fl_g_natural_scale', 'sc_g_base_bollywood']
  },
  {
    id: 'rec_learn_play_on_c_natural',
    question: 'Can I play this song on a C Natural flute?',
    category: 'Notes & Scales',
    answer: 'Yes! C Natural Middle is light, crisp, and comfortable for beginners, children, and adult players alike.',
    keywords: ['can I play this song on a c natural flute', 'c natural song compatibility'],
    relatedIds: ['fl_c_natural_scale', 'sc_c_nat_bollywood']
  },
  {
    id: 'rec_learn_how_long_to_learn',
    question: 'How long will it take to learn this song?',
    category: 'Practice',
    answer: '• **Simple beginner song** (*Hai Apna Dil To Aawara*): 1–3 days.\n• **Melodic track with Meend** (*Lag Ja Gale*): 1–2 weeks.\n• **Classical/Fast composition** (*Albela Sajan*): 3–4 weeks of practice.',
    keywords: ['how long will it take to learn this song', 'time required to master flute song'],
    relatedIds: ['beg_hours_daily', 'sng_easiest_beginners']
  }
];

let fileContent = fs.readFileSync('src/data/chatbotData.ts', 'utf8');

function formatItem(item) {
  return `  {
    id: ${JSON.stringify(item.id)},
    question: ${JSON.stringify(item.question)},
    category: ${JSON.stringify(item.category)},
    answer: ${JSON.stringify(item.answer)},
    keywords: ${JSON.stringify(item.keywords)},
    relatedIds: ${JSON.stringify(item.relatedIds)}
  }`;
}

const formattedCode = newItems.map(formatItem).join(',\n');
const target = '];\n\n// Search logic function';

if (!fileContent.includes(target)) {
  console.error('Target not found');
  process.exit(1);
}

fileContent = fileContent.replace(target, ',\n' + formattedCode + '\n' + target);
fs.writeFileSync('src/data/chatbotData.ts', fileContent, 'utf8');
console.log('Appended ' + newItems.length + ' items successfully.');
