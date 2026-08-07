import { FaqItem } from '../components/FluteFaqView';

export const FLUTE_CARE_FAQS: FaqItem[] = [
  {
    id: 'care-how-to-clean-moisture-after-playing',
    category: 'Flute Care & Maintenance',
    question: 'How do I swab internal moisture out of my bamboo flute after playing?',
    answer: `Swabbing internal moisture after every playing session is essential to prevent bamboo rotting, mold, and warping:

- Use a Soft Cotton Swab: Wrap a lint-free soft microfiber or cotton cloth around a smooth wooden or plastic swabbing rod.
- Gentle Insertion: Gently slide the swab through the open bottom end up toward the internal cork stopper.
- Swab Internal Walls: Rotate gently to absorb all accumulated condensation.
- Dry Before Storing: Allow the flute to air-dry in a cool, ventilated room for 10–15 minutes before closing it inside a sealed case.`,
    relatedLink: { text: 'Read Flute Care Guidelines', view: 'learn_basics' },
    tags: ['moisture swabbing', 'internal cleaning', 'bamboo care', 'hygiene']
  },
  {
    id: 'care-oiling-bamboo-flute',
    category: 'Flute Care & Maintenance',
    question: 'Should I oil my bamboo flute, which oils are safe, and how often?',
    answer: `Oiling protects natural bamboo from drying out, cracking, and moisture absorption:

- Safe Natural Oils: Use non-rancid, light natural oils like Mustard Oil, Sweet Almond Oil, or White Mineral Oil. Avoid heavy vegetable oils that turn sticky or rancid over time.
- Oiling Frequency: Oil the internal bore once every 2 to 3 months, or before seasonal weather transitions (e.g., before dry winter months).
- Application Method: Apply a few drops of oil to a soft cotton swab and gently coat the inside bamboo bore evenly. Do NOT get oil on the internal cork stopper face.`,
    relatedLink: { text: 'View Flute Maintenance Blueprint', view: 'learn_basics' },
    tags: ['oiling flute', 'mustard oil', 'almond oil', 'bamboo protection']
  },
  {
    id: 'care-preventing-and-repairing-cracks',
    category: 'Flute Care & Maintenance',
    question: 'How do I prevent bamboo cracks, and what should I do if a crack develops?',
    answer: `Natural Assam bamboo reacts to humidity fluctuations and sudden impacts:

- Prevention: Keep thread bindings tight, oil the bore regularly, and never leave flutes in direct sunlight, hot cars, or under direct AC vents.
- Minor Hairline Crack Repair: If a hairline crack appears, wrap high-tensile nylon thread tightly around the cracked section and secure thread knots with a tiny drop of cyanoacrylate glue (super glue).
- Major Cracks: For deep split cracks that compromise finger holes, consult a professional bansuri maker for re-tuning or replacement.`,
    relatedLink: { text: 'Explore Flute Care & Binding Guide', view: 'learn_basics' },
    tags: ['bamboo cracks', 'crack repair', 'thread binding', 'maintenance']
  },
  {
    id: 'care-thread-binding-maintenance',
    category: 'Flute Care & Maintenance',
    question: 'What is thread binding (Dhaaga) on a bansuri, and how do I maintain or re-bind it?',
    answer: `Thread bindings (nylon ring wraps) placed at key points along the bamboo tube prevent natural splits and reinforce stress points:

- Function: Bamboo expands and contracts with humidity. Tight thread rings act as safety hoops preventing splits from spreading.
- Maintenance: Inspect bindings monthly. If a thread knot unravels, push threads tight and seal the end with a micro-drop of clear glue.
- Replacing Bindings: You can easily re-bind your flute using strong nylon fish-line thread or silk thread wrapped in neat, tight, adjacent turns.`,
    relatedLink: { text: 'Read Bansuri Anatomy Guide', view: 'learn_basics' },
    tags: ['thread binding', 'dhaaga', 'reinforcement', 'bamboo protection']
  },
  {
    id: 'care-storing-flutes-safely',
    category: 'Flute Care & Maintenance',
    question: 'How should I store my flutes at home to protect them from humidity and pests?',
    answer: `Proper home storage preserves bamboo acoustics and prevents pest infestation:

- Padded Hard Case: Store flutes horizontally in a padded, breathable hard tube or case.
- Silica Gel Packs: Include 1 or 2 food-grade silica gel packets inside the case during humid monsoon seasons to absorb excess moisture.
- Avoid Floor Storage: Store cases on elevated shelves away from damp floors, direct sunlight, and heat radiators.
- Protection from Pests: Natural Assam bamboo can occasionally attract insects if stored damp—ensure flutes are completely dry before closing cases.`,
    relatedLink: { text: 'Check Flute Accessories & Cases', view: 'learn_choose_flute' },
    tags: ['storing flutes', 'silica gel', 'humidity control', 'flute case']
  },
  {
    id: 'care-protecting-flute-during-travel',
    category: 'Flute Care & Maintenance',
    question: 'How do I protect my bamboo flutes during air travel and road trips?',
    answer: `Travel exposes flutes to extreme pressure, temperature swings, and physical impacts:

- Carry-On Cabin Luggage: Always carry high-value bamboo flutes in cabin hand luggage when flying—never check them into cargo hold baggage where freezing temperatures and rough handling occur.
- Padded PVC/Fiber Tube Case: Use a rigid, padded PVC or carbon-fiber travel tube case capable of withstanding external pressure.
- Avoid Leaving in Cars: Never leave bamboo flutes inside a parked car, as interior temperatures can reach 60°C (140°F) within minutes and cause instant cracking.`,
    relatedLink: { text: 'Read Travel Protection Blueprint', view: 'learn_basics' },
    tags: ['air travel', 'cabin luggage', 'travel tube', 'car heat']
  },
  {
    id: 'care-temperature-and-weather-protection',
    category: 'Health & Breathing',
    question: 'How do extreme temperature and humidity changes affect bamboo flutes?',
    answer: `Bamboo is an organic, hygroscopic material that expands in high humidity and shrinks in dry weather:

- Temperature Shifts: Cold air causes bamboo to contract and play slightly flat; warm air causes bamboo to expand and play slightly sharp.
- Acclimatization: When moving a flute from a cold outdoors into a warm room, allow the flute to sit inside its case for 15 minutes to adjust to room temperature naturally before blowing warm air through it.`,
    relatedLink: { text: 'Read Flute Care Guidelines', view: 'learn_basics' },
    tags: ['temperature shifts', 'humidity', 'acclimatization', 'tuning']
  },
  {
    id: 'care-cleaning-finger-holes-and-blowhole',
    category: 'Flute Care & Maintenance',
    question: 'How do I clean dust, oil, and debris from finger holes and blow hole without damaging pitch?',
    answer: `Dust and skin oils accumulate along finger hole edges over time, affecting pitch accuracy and air seal:

- Cleaning Method: Use a soft, dry cotton Q-tip or soft-bristled artist paintbrush to gently sweep dust out of finger holes.
- Avoid Sharp Metal Tools: Never use metal pins, blades, or coarse sandpaper inside finger holes, as scraping bamboo edges alters hole diameter and ruins tuning.`,
    relatedLink: { text: 'View Flute Maintenance Tips', view: 'learn_basics' },
    tags: ['finger hole cleaning', 'q-tip', 'dust removal', 'tuning safety']
  },
  {
    id: 'care-pvc-flute-maintenance',
    category: 'Flute Care & Maintenance',
    question: 'How do I clean and maintain a PVC flute compared to a bamboo flute?',
    answer: `PVC plastic flutes are exceptionally durable and low-maintenance:

- Water-Washable: Unlike bamboo, PVC flutes are 100% waterproof. You can wash a PVC flute under lukewarm tap water with mild soapy water.
- No Oiling Required: PVC requires zero oiling and will never crack due to dry weather or temperature swings.
- Ideal for Beginners & Travel: Great for outdoor practice, rainy seasons, and rugged travel.`,
    relatedLink: { text: 'Compare Bamboo vs PVC Flutes', view: 'learn_choose_flute' },
    tags: ['pvc flute', 'waterproof', 'low maintenance', 'travel flute']
  },
  {
    id: 'care-cork-and-cork-positioning',
    category: 'Flute Care & Maintenance',
    question: 'What is the internal cork (cork stopper) in a bansuri, and what if it moves?',
    answer: `The internal cork stopper sits inside the top head-joint of the flute, just past the blow hole:

- Function: Sets the internal acoustic chamber length, directly governing octave tuning and pitch balance across all registers.
- Correct Position: The cork face is positioned approximately one tube diameter length away from the center of the blow hole.
- If it Displaces: Never push the cork blindly. Use a wooden rod marked with the exact factory depth to adjust the cork stopper back into place gently.`,
    relatedLink: { text: 'Read Flute Anatomy Guide', view: 'learn_basics' },
    tags: ['cork stopper', 'head joint', 'tuning chamber', 'cork adjustment']
  },
  {
    id: 'care-lifespan-of-bamboo-flute',
    category: 'Flute Care & Maintenance',
    question: 'What is the average lifespan of a seasoned Assam bamboo flute?',
    answer: `A well-crafted bansuri made from seasoned Assam bamboo can last decades or even a lifetime:

- Lifespan Factors: Depends on bamboo seasoning quality, regular oiling, moisture swabbing, and careful handling.
- Maturation of Sound: As seasoned bamboo ages and matures with years of daily playing, its acoustic resonance often sweetens and becomes warmer and more vibrant.`,
    relatedLink: { text: 'Explore Scale Selection Guide', view: 'learn_choose_flute' },
    tags: ['flute lifespan', 'seasoned bamboo', 'longevity', 'aging sound']
  },
  {
    id: 'care-sanitizing-flute-safely',
    category: 'Flute Care & Maintenance',
    question: 'How do I safely sanitize my flute mouthpiece without harming natural bamboo or lacquer?',
    answer: `Sanitizing the blow hole area preserves hygiene without damaging natural bamboo:

- Safe Cleaning: Dampen a microfiber cloth with a 70% isopropyl alcohol spray and wipe only the outer lip area gently.
- Avoid Soaking Bamboo: Never submerge bamboo flutes in alcohol or water, as liquid penetration ruins thread glue and internal cork seals.`,
    relatedLink: { text: 'Read Flute Hygiene Blueprint', view: 'learn_basics' },
    tags: ['sanitizing', 'hygiene', 'isopropyl alcohol', 'blow hole']
  }
];
