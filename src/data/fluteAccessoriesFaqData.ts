import { FaqItem } from '../components/FluteFaqView';

export const FLUTE_ACCESSORIES_FAQS: FaqItem[] = [
  {
    id: 'acc-beginner-essential-toolkit',
    category: 'Flute Accessories',
    question: 'What flute accessories should every beginner own?',
    answer: `An essential beginner accessory kit ensures proper protection, maintenance, and tuning:

1. Padded Flute Case/Bag: Protects natural bamboo against accidental impacts and dust.
2. Swabbing Rod & Microfiber Cloth: Essential for swabbing internal moisture after every practice session.
3. Tanpura & Tuner App: Mobile apps (like iTanpura or digital tuner apps) for tuning and pitch alignment.
4. Metronome App: For building rhythmic timing and speed control.
5. Mustard or Almond Oil: A small bottle of natural oil for periodic bore maintenance every few months.`,
    relatedLink: { text: 'Explore Flute Care Blueprint', view: 'learn_basics' },
    tags: ['essential accessories', 'beginner kit', 'case', 'tanpura app', 'swab']
  },
  {
    id: 'acc-hard-case-vs-soft-cover',
    category: 'Flute Accessories',
    question: 'Hard Flute Case vs Soft Flute Cover: Which is better for bansuris?',
    answer: `Comparing protective cases for bamboo flutes:

- Padded Hard Case (PVC/Fiber Tube): The ultimate protection against crushing, heavy objects, and rough travel. Highly recommended for air travel, commuting, or storing multiple flutes.
- Soft Padded Bag / Cover: Lightweight and easy to carry with a shoulder strap for casual visits to music classes. Offers scratch protection but lacks rigid crush resistance.
- Recommendation: Use a rigid hard tube case for travel and home storage.`,
    relatedLink: { text: 'Read Travel Protection Guidelines', view: 'learn_basics' },
    tags: ['hard case', 'soft cover', 'flute protection', 'travel tube']
  },
  {
    id: 'acc-swabbing-rod-and-cleaning-cloths',
    category: 'Flute Accessories',
    question: 'What cleaning rods and cloths are best for swabbing bamboo flutes?',
    answer: `Selecting safe swabbing tools prevents internal bamboo scratches:

- Swabbing Rod Material: Use smooth wooden or plastic swabbing rods. Avoid sharp metal rods that can scratch internal bamboo walls or dislodge the delicate internal cork stopper.
- Swabbing Cloth: High-absorbency, lint-free microfiber or soft cotton flannel cloths absorb moisture instantly without leaving loose threads inside the bore.`,
    relatedLink: { text: 'View Maintenance & Cleaning Blueprint', view: 'learn_basics' },
    tags: ['swabbing rod', 'microfiber cloth', 'cleaning tools', 'bamboo safety']
  },
  {
    id: 'acc-flute-stands-safety-and-use',
    category: 'Flute Accessories',
    question: 'Do I need a flute stand, and is it safe to keep a bansuri on a stand?',
    answer: `Flute stands provide convenient access during practice sessions:

- Benefits: Keeps your flute safely upright during short practice breaks, preventing it from rolling off tables or chairs.
- Safety Precautions:
  - Use a felt-padded wooden or heavy-base tripod stand designed for transverse flutes.
  - Never leave bamboo flutes on stands overnight or near open windows where draft, sunlight, or pets can knock them over.`,
    relatedLink: { text: 'Read Practice Setup Guidelines', view: 'learn_daily_practice' },
    tags: ['flute stand', 'safety', 'practice setup', 'storage']
  },
  {
    id: 'acc-tanpura-and-tuner-mobile-apps',
    category: 'Flute Accessories',
    question: 'Which mobile apps are best for Tanpura drones, tuners, and metronomes?',
    answer: `Top digital accessories for smartphone practice:

- Tanpura Drone Apps: iTanpura, Tanpura Droid, or Radel electronic tanpura apps provide rich, authentic drone harmonics tuned to A=440Hz.
- Tuner Apps: Soundcorset, TE Tuner, or FluteSangam's built-in Live Tuner help monitor real-time pitch accuracy and microtonal deviation.
- Metronome Apps: Soundcorset or Pro Metronome for steady click subdivisions (Vilambit to Drut Lay).`,
    relatedLink: { text: 'Use FluteSangam Built-in Live Tuner', view: 'learn_tuner' },
    tags: ['tanpura app', 'tuner app', 'metronome app', 'digital tools']
  },
  {
    id: 'acc-microphones-for-bamboo-flute',
    category: 'Flute Accessories',
    question: 'Which microphones and recording gear work best for recording bansuri at home?',
    answer: `Capturing the warm, woody, breathy acoustic timbre of a bamboo flute:

- Large-Diaphragm Condenser Mics (e.g., Rode NT1-A, Audio-Technica AT2020): Excellent for home studio recordings, capturing subtle breath dynamics and deep bass resonance cleanly.
- Clip-On Wireless Mics / Lavalier: Great for live stage performances where moving around freely is required.
- Placement Tip: Position the mic 12 to 18 inches away from the blow hole at a slight off-axis angle to avoid direct breath popping noises.`,
    relatedLink: { text: 'Read Home Studio Recording Blueprint', view: 'learn_basics' },
    tags: ['microphones', 'condenser mic', 'recording gear', 'home studio']
  },
  {
    id: 'acc-travel-cases-and-air-travel-kits',
    category: 'Flute Accessories',
    question: 'What travel accessories and humidity packs protect flutes during journeys?',
    answer: `Essential accessories for flutists on the go:

1. Rigid PVC/Carbon Travel Tube: Fits into cabin overhead bins safely.
2. Two-Way Humidity Control Packs (e.g., Boveda 49%-55%): Regulates relative humidity inside the case during climate changes.
3. Compact Microfiber Swab: For quick post-performance swabbing.
4. Shoulder Strap Bag: Keeps hands free while navigating airports or train stations.`,
    relatedLink: { text: 'Read Air Travel Protection Blueprint', view: 'learn_basics' },
    tags: ['travel case', 'boveda packs', 'humidity control', 'touring']
  },
  {
    id: 'acc-humidity-packs-and-silica-gel',
    category: 'Flute Accessories',
    question: 'Should I use humidity packs or silica gel inside my flute case?',
    answer: `Managing humidity balance inside closed cases:

- Monsoon Season / High Humidity (>70% RH): Use food-grade Silica Gel packets to absorb excess moisture and prevent mold/rot inside cases.
- Extremely Dry Winter / Desert Climates (<30% RH): Use 2-way Boveda humidity control packs (49%–55% RH) to release gentle moisture and prevent bamboo shrinkage or cracking.`,
    relatedLink: { text: 'Read Flute Care Guidelines', view: 'learn_basics' },
    tags: ['humidity control', 'silica gel', 'boveda packs', 'monsoon care']
  },
  {
    id: 'acc-finger-grips-and-ergonomic-aids',
    category: 'Flute Accessories',
    question: 'Are finger grip stickers or thumb rests useful for bansuri players?',
    answer: `Ergonomic aids for hand comfort:

- Tactile Hole Reference Stickers: Tiny, raised silicone dots placed near hole edges can help beginners feel hole boundaries without looking down at their hands.
- Thumb Cushion / Grip Tape: A soft silicone sleeve or thin non-slip tape placed where the right thumb supports the flute tube prevents slippage due to hand sweat during long recitals.`,
    relatedLink: { text: 'View Ergonomics & Posture Guide', view: 'learn_basics' },
    tags: ['finger grips', 'thumb cushion', 'ergonomics', 'slippage']
  },
  {
    id: 'acc-multi-flute-bags-and-cases',
    category: 'Flute Accessories',
    question: 'How do multi-flute cases and gig bags organize multiple scale keys safely?',
    answer: `Organizing a collection of bansuris:

- Individual Padded Slots: Multi-flute gig bags feature individual soft velvet or padded nylon sleeves for each flute, preventing flutes from knocking against each other and scratching.
- Scale Labeling: Keep small scale tags (e.g., C Medium, E Bass, G Medium) on sleeve tops for instant identification during live stage recitals.`,
    relatedLink: { text: 'Explore Flute Collections Guide', view: 'learn_choose_flute' },
    tags: ['multi flute case', 'gig bag', 'scale organization', 'velvet sleeves']
  },
  {
    id: 'acc-audio-interfaces-for-home-studio',
    category: 'Flute Accessories',
    question: 'Do I need a USB audio interface to record high-quality flute videos or tracks?',
    answer: `Upgrading from smartphone recording to professional audio:

- Why Use an Audio Interface (e.g., Focusrite Scarlett, Audient EVO): Converts XLR microphone signals into clean, low-noise digital audio for recording software (DAWs).
- Is it Essential for Beginners?: No. Smartphone microphones or direct USB mics (like Blue Yeti) are more than adequate for recording daily practice and social media clips.`,
    relatedLink: { text: 'Read Recording & Audio Setup Blueprint', view: 'learn_basics' },
    tags: ['audio interface', 'focusrite', 'home recording', 'daw']
  },
  {
    id: 'acc-best-gifts-for-flute-players',
    category: 'Flute Accessories',
    question: 'What are the best gifts for a flute player or bansuri student?',
    answer: `Thoughtful, practical gifts for bansuri enthusiasts:

1. Premium Multi-Flute Gig Bag / Travel Tube.
2. Concert-Grade C Natural Medium or E Bass Bamboo Bansuri.
3. Bluetooth Speaker / Tanpura Box for daily practice.
4. Classical Flute Music Books & Raag Notation Guides.
5. High-Quality Wooden Flute Stand.`,
    relatedLink: { text: 'Explore FluteSangam Learning Platform', view: 'learn_dashboard' },
    tags: ['gifts for flutists', 'gift ideas', 'bansuri gifts', 'accessories']
  }
];
