import { FaqItem } from '../components/FluteFaqView';

export const FLUTE_TYPES_FAQS: FaqItem[] = [
  {
    id: 'type-main-categories-overview',
    category: 'Flute Types',
    question: 'What are the main types of flutes used in world music?',
    answer: `Flutes fall into distinct global families based on material and sound mechanism:

1. Indian Bamboo Bansuri: Keyless transverse (side-blown) flute made from natural Assam bamboo, prized for its warm, vocal-like microtonal capability (Meend).
2. PVC Plastic Flute: Modern synthetic bansuri made from durable PVC pipe, resistant to weather and cracks, ideal for outdoor practice.
3. Western Concert Flute: Metal instrument featuring complex key mechanisms, pads, and a silver/cupronickel tube, designed for chromatic Western classical and orchestra music.
4. End-Blown Fipple Flutes: Flutes like the recorder or Tin Whistle with a built-in mouthpiece channel, easy to blow but lacking fluid microtonal pitch bending.`,
    relatedLink: { text: 'Explore Beginner Flute Selection Guide', view: 'learn_choose_flute' },
    tags: ['flute types', 'bansuri', 'pvc flute', 'western flute', 'overview']
  },
  {
    id: 'type-best-scale-for-beginners',
    category: 'Choosing the Right Flute',
    question: 'Which flute key/scale is best for beginners (C Medium vs G Medium)?',
    answer: `For adult beginners learning Indian classical music:

- C Natural Medium (approx. 19 inches / 48 cm long): Universally recommended as the best starter scale. Its comfortable finger hole spacing fits average hands effortlessly, while producing a pleasant, balanced mid-register pitch.
- G Natural Medium (approx. 15 inches / 38 cm long): Excellent for children or adults with smaller hands, as the holes sit closer together.
- E Bass (approx. 30 inches / 76 cm long): The legendary concert scale used by masters, but requires a wider finger stretch—not recommended as a first flute for complete beginners.`,
    relatedLink: { text: 'Read Scale & Key Selection Guide', view: 'learn_choose_flute' },
    tags: ['c medium', 'g medium', 'beginner scale', 'choosing first flute']
  },
  {
    id: 'type-assam-bamboo-vs-pvc',
    category: 'Choosing the Right Flute',
    question: 'Bamboo Flute vs PVC Flute: What are the differences, pros, and cons?',
    answer: `Comparing natural bamboo against synthetic PVC flutes:

- Bamboo Bansuri:
  - Pros: Organic, rich, warm, resonant acoustic tone; authentic classical aesthetic.
  - Cons: Requires humidity care; can crack if dropped or exposed to sudden heat/dry weather.
- PVC Flute:
  - Pros: Unbreakable, 100% waterproof, immune to weather splits; extremely affordable.
  - Cons: Synthetic plastic aesthetic; sound can lack a fraction of natural bamboo timber warmth.`,
    relatedLink: { text: 'Read Material Comparison Chart', view: 'learn_choose_flute' },
    tags: ['bamboo vs pvc', 'materials', 'durability', 'comparison']
  },
  {
    id: 'type-side-blown-vs-end-blown',
    category: 'Flute Types',
    question: 'Side-Blown Bansuri vs End-Blown Fipple Flutes: What is the difference?',
    answer: `Understanding blowing mechanisms:

- Side-Blown Transverse Bansuri: You blow across an open circular blow hole using your lip embouchure. This allows total control over pitch bending, dynamics, tone color, and microtones (Meend).
- End-Blown Fipple Flutes (e.g., Recorder, Punji): Air passes through a fixed narrow channel onto a wooden wedge. It produces sound instantly with zero lip training, but limits dynamic pitch control and subtle ornamentation.`,
    relatedLink: { text: 'Read Bansuri Fundamentals', view: 'learn_basics' },
    tags: ['side blown', 'transverse', 'fipple', 'blowing mechanism']
  },
  {
    id: 'type-six-hole-vs-seven-hole',
    category: 'Flute Types',
    question: '6-Hole Bansuri vs 7-Hole Bansuri: Which is better and why?',
    answer: `Comparing 6-hole and 7-hole Indian bamboo flutes:

- 6-Hole Bansuri: The classic design pioneered by Pt. Pannalal Ghosh. Straightforward to hold and master for beginners. Covers a 2.5 octave range.
- 7-Hole Bansuri: Adds a 7th hole near the bottom end, extending the lower range down to Mandra Teevra Ma / Mandra Pa and facilitating fast octave jumps. Requires pinky finger reach training.
- Recommendation: Beginners should start on a standard 6-hole C Medium bansuri before progressing to a 7-hole Bass flute.`,
    relatedLink: { text: 'View Fingering Charts for 6 and 7 Hole Flutes', view: 'learn_fingering_chart' },
    tags: ['6 hole', '7 hole', 'pinky hole', 'mandra pa']
  },
  {
    id: 'type-bass-medium-and-treble-flutes',
    category: 'Flute Types',
    question: 'What are Medium, Bass, and Treble flutes, and how do they sound?',
    answer: `Indian bansuris are categorized into pitch registers based on physical tube length:

- Treble Flutes (High Pitch): Short tubes (8 to 14 inches) in high keys like F#, G, A High. Crisp, bright, penetrating sound used in fast folk melodies.
- Medium Flutes (Mid Pitch): Standard length (16 to 22 inches) in keys like D, C, B Medium. Balanced, soothing tone—ideal for learning and practice.
- Bass Flutes (Low Pitch): Long, wide tubes (26 to 34 inches) in keys like E, D, C Bass. Deep, meditative, resonant acoustic voice—the gold standard for classical recitals.`,
    relatedLink: { text: 'Explore Scale & Octave Dimensions', view: 'learn_choose_flute' },
    tags: ['bass flute', 'medium flute', 'treble flute', 'pitch registers']
  },
  {
    id: 'type-hand-size-and-finger-stretch',
    category: 'Choosing the Right Flute',
    question: 'How do I choose a flute key that matches my hand size and finger reach?',
    answer: `Selecting a flute key that matches your hand dimensions prevents joint strain:

- Measuring Finger Reach: Place your hand flat on a piece of paper and measure the distance from your index finger pad to your ring finger pad.
- Small Hands / Children: Choose G Medium, A Medium, or F Medium flutes (hole spacing under 3.5 cm).
- Average Adult Hands: C Natural Medium or B Medium (hole spacing 3.8 to 4.5 cm).
- Large Hands / Experienced Players: E Bass, D Bass, or C Bass (hole spacing 5.0 cm+).`,
    relatedLink: { text: 'Use Hand Size Measurement Chart', view: 'learn_choose_flute' },
    tags: ['hand size', 'finger stretch', 'hole spacing', 'ergonomics']
  },
  {
    id: 'type-western-concert-vs-indian-bansuri',
    category: 'Choosing the Right Flute',
    question: 'How does the Western metal key flute differ from the Indian bamboo bansuri?',
    answer: `Comparing Western orchestral flutes with Indian bansuris:

- Key Mechanism: Western flutes use padded keys and springs to cover tone holes mechanically; bansuris use direct finger pad seals over natural open holes.
- Microtones & Meend: Open holes on a bansuri allow continuous glides (Meend) and microtonal Shrutis that keyed metal flutes cannot easily replicate.
- Scales & Tuning: Western flutes are tuned to equal temperament; bansuris are tuned to natural pure harmonics (Just Intonation) for Indian classical music.`,
    relatedLink: { text: 'Read Music Theory Comparison', view: 'learn_basics' },
    tags: ['western flute vs bansuri', 'keys vs open holes', 'equal temperament']
  },
  {
    id: 'type-student-vs-professional-bansuri',
    category: 'Choosing the Right Flute',
    question: 'What is the difference between a student flute and a professional concert-grade bansuri?',
    answer: `Key differences between beginner student and concert-grade flutes:

- Bamboo Quality: Concert bansuris use 3 to 5-year aged, naturally seasoned, straight Assam bamboo with uniform wall thickness.
- Tuning Precision: Master makers tune professional flutes individually against a Tanpura across all 3 octaves at 25°C room temperature.
- Acoustic Resonance: Professional flutes feature expertly shaped embouchure holes that produce immediate response, warm bass resonance, and pure Taar Saptak notes.`,
    relatedLink: { text: 'Read Buyer Checklist for Flutes', view: 'learn_choose_flute' },
    tags: ['student vs professional', 'concert grade', 'bamboo quality', 'tuning']
  },
  {
    id: 'type-c-natural-medium-explained',
    category: 'Choosing the Right Flute',
    question: 'Why is C Natural Medium (Scale 1) recommended as the standard starter flute?',
    answer: `C Natural Medium is the worldwide benchmark starter flute for Indian music:

- Universal Notation Standard: In Hindustani music, C Natural is commonly designated as "Scale 1" (Pahila Safed), making notation reading straightforward.
- Ergonomic Fit: Its hole spacing is comfortable for almost all teenagers and adults without causing wrist strain.
- Pleasant Acoustic Pitch: Not too shrill like high treble flutes, nor too heavy to blow like long bass flutes.`,
    relatedLink: { text: 'Read Starter Flute Recommendation', view: 'learn_choose_flute' },
    tags: ['c natural medium', 'scale 1', 'starter flute', 'pahila safed']
  },
  {
    id: 'type-e-bass-flute-explained',
    category: 'Choosing the Right Flute',
    question: 'What makes the E Bass bansuri famous, and why is it preferred for classical recitals?',
    answer: `E Bass (approx. 30 inches / 76 cm long) is the iconic concert scale made world-famous by Pt. Hariprasad Chaurasia:

- Deep Vocal Resonance: Its pitch matches the natural human vocal range, producing a serene, deeply moving acoustic voice.
- Concert Standard: Most classical Indian instrumentalists and Tabla players tune recitals around E Bass or D# Bass.
- Learning Curve: Requires developed finger stretch and strong diaphragmatic breath support—ideally learned after mastering C Medium.`,
    relatedLink: { text: 'Read Maestros & E Bass Legacy', view: 'founder' },
    tags: ['e bass', 'hariprasad chaurasia', 'concert scale', 'classical flute']
  },
  {
    id: 'type-buying-a-set-of-flutes',
    category: 'Choosing the Right Flute',
    question: 'When and why should a flute player buy a set of multiple scale keys?',
    answer: `A bansuri is a fixed-pitch instrument—you cannot simply press a key to transpose to a different key signature:

- Why Own Multiple Keys: To play alongside singers or accompanists who perform in different tonic keys (e.g., C#, D, E, F, G).
- Recommended Growth Path: Start with C Medium. Next, add E Bass for classical recitals, and G Medium or A Treble for fast folk melodies.
- Master Sets: Professional flutists typically carry a set of 7 to 12 flutes covering all chromatic keys from E Bass up to A Treble.`,
    relatedLink: { text: 'Explore Flute Collections Guide', view: 'learn_choose_flute' },
    tags: ['flute set', 'multiple keys', 'transposition', 'accompaniment']
  },
  {
    id: 'type-avoiding-cheap-toy-flutes',
    category: 'Choosing the Right Flute',
    question: 'How do I spot un-tuned, un-seasoned toy flutes before making a purchase?',
    answer: `Avoid un-tuned souvenir flutes sold at street fairs:

- Red Flags:
  - Green or un-seasoned bamboo that smells fresh or feels damp (will warp and split within weeks).
  - Roughly drilled, uneven finger holes with splinters.
  - Absence of internal cork tuning stopper or inaccurate hole placements that fail to play octaves in tune.
- Solution: Always buy from reputed bansuri makers or verified musical stores who tune instruments against a Tanpura at A=440Hz.`,
    relatedLink: { text: 'Read Flute Buying Advice', view: 'learn_choose_flute' },
    tags: ['toy flutes', 'red flags', 'tuning check', 'buying advice']
  },
  {
    id: 'type-left-handed-flutes',
    category: 'Choosing the Right Flute',
    question: 'Are there specialized left-handed bansuris, or can any flute be played left-handed?',
    answer: `Left-handed flutists can play transverse bamboo flutes comfortably:

- Symmetrical 6-Hole Flutes: Standard 6-hole bansuris are completely symmetrical—you simply hold the flute pointing to your left side with your left hand on top.
- 7-Hole Flutes: 7-hole flutes have an offset 7th hole tailored for either right-hand pinky or left-hand pinky reach. Left-handed players using 7-hole flutes should specify a left-handed offset when ordering from a maker.`,
    relatedLink: { text: 'View Posture & Grip Guide', view: 'learn_basics' },
    tags: ['left handed', 'southpaw', '7th hole offset', 'symmetry']
  },
  {
    id: 'type-upgrading-to-pro-flute',
    category: 'Choosing the Right Flute',
    question: 'When should a student upgrade from a beginner C Medium flute to a professional Bass flute?',
    answer: `Upgrading to a concert-grade Bass flute is recommended when:

- You Have Mastered Finger Hole Sealing: You can play all basic Alankars and songs on C Medium cleanly without air leaks or squeaks.
- You Want Deeper Classical Resonance: You are beginning to study classical Raagas (like Yaman or Bhairav) and desire the deep, meditative voice of E Bass or D# Bass.
- Your Hand Stretch Has Developed: You have developed comfortable finger dexterity to reach the wider hole spacing of long bass tubes.`,
    relatedLink: { text: 'Explore Advanced Raag Lessons', view: 'learn_raagas' },
    tags: ['upgrading flute', 'c medium to e bass', 'progress', 'bass bansuri']
  }
];
