import { FaqItem } from '../components/FluteFaqView';

export const FLUTE_CARE_FAQS: FaqItem[] = [
  // ==========================================
  // 1. GENERAL CARE (10 Questions)
  // ==========================================
  {
    id: 'care-general-why-important',
    category: 'Flute Care & Maintenance',
    question: 'Why is flute care important?',
    answer: `Flute care is critical because bamboo is an organic, living wood material that continuously reacts to moisture, temperature fluctuations, and human contact. Unlike metal or plastic instruments, a bamboo bansuri relies on well-preserved natural fibers to maintain its structural resonance, pitch calibration, and rich tonal warmth.

Proper maintenance prevents three major hazards:
- Structural Cracking: Unmaintained bamboo dries out or swells unevenly, leading to hairline or catastrophic body cracks along the grain.
- Mold & Bacterial Growth: Saliva and moisture trapped inside the bore foster fungal spores, causing unpleasant odors and potential respiratory risks.
- Pitch & Tone Degradation: Accumulated dust, skin oils, or internal moisture alter the bore's internal diameter, causing notes to sound dull or go out of tune.

Investing just two minutes in post-practice care preserves your flute's acoustic precision and ensures it remains a lifelong musical companion.`,
    relatedLink: { text: 'Read Beginner Bansuri Guide', view: 'learn_basics' },
    tags: ['flute care', 'bamboo maintenance', 'longevity', 'hygiene']
  },
  {
    id: 'care-general-how-often-clean',
    category: 'Flute Care & Maintenance',
    question: 'How often should I clean my flute?',
    answer: `The frequency of flute cleaning depends on whether you are doing daily routine swab-downs or periodic deep conditioning.

Recommended cleaning schedule:
- After Every Practice Session (Daily): Swab the internal bore using a soft cotton pull-through cloth tied to a thin wooden rod. This removes condensation and saliva before moisture soaks into the bamboo walls. Wipe finger smudges off the exterior with a microfiber cloth.
- Weekly Maintenance: Inspect the finger holes and blowhole edge (embouchure) for dust or lint buildup. Clean gently with a soft dry brush or cotton swab.
- Every 3 to 6 Months: Perform internal oiling using 3–4 drops of non-sticky natural oil (like mustard oil or sweet almond oil) to keep the bamboo fibers flexible and moisture-resistant.

Following this simple rhythm keeps your bansuri smelling fresh, sounding bright, and performing reliably every day.`,
    relatedLink: { text: 'View Daily Practice Schedules', view: 'learn_daily_practice' },
    tags: ['cleaning schedule', 'routine care', 'daily swabbing', 'oiling']
  },
  {
    id: 'care-general-best-way-care',
    category: 'Flute Care & Maintenance',
    question: 'What is the best way to care for a bamboo flute?',
    answer: `The absolute best way to care for a bamboo flute involves a three-pillar rule: Dry after playing, protect from environmental shocks, and store securely.

Key practices for best care:
1. Swab Immediately After Playing: Never put a wet flute directly into a closed case. Always run a cotton swab through the inside bore to remove condensation.
2. Protect from Thermal Shock: Keep your bansuri away from direct sunlight, air conditioner drafts, space heaters, and hot parked vehicles. Sudden temperature shifts cause bamboo to expand or contract rapidly, inducing cracks.
3. Keep Thread Bindings Tight: Check the nylon or silk thread wrappings (Dhaaga) periodically. These bindings act as protective hoops, absorbing structural stress and keeping the bamboo intact.
4. Store in a Rigid PVC Pipe Case: Store your flutes horizontally in a padded hard case or PVC tube lined with soft velvet to guard against drops and humidity changes.`,
    relatedLink: { text: 'Explore Choosing the Right Bansuri', view: 'learn_choose_flute' },
    tags: ['best care practices', 'bamboo protection', 'thread binding', 'pvc case']
  },
  {
    id: 'care-general-make-flute-last-longer',
    category: 'Flute Care & Maintenance',
    question: 'How can I make my flute last longer?',
    answer: `A well-crafted Assam bamboo bansuri can last 30 to 50 years or even generations if cared for with mindfulness and respect.

Actionable steps to extend your flute's lifespan:
- Maintain Fiber Elasticity with Oiling: Apply unrefined mustard oil or sesame oil inside the bore twice a year. Oil seals micro-pores, making the bamboo water-repellent while preserving fiber flexibility.
- Handle with Clean, Dry Hands: Always wash your hands before playing to prevent body oils, sweat, or food residue from degrading the natural bamboo finish.
- Never Force or Drop It: Handle the flute gently by the body rather than grabbing the thin lip edge or cork end.
- Use Silica Gel in Rainy Seasons: Place small silica gel packets inside your carrying bag during monsoons to absorb excessive environmental humidity.

Treating your bansuri as a sacred artistic tool ensures its tonal richness only improves with age.`,
    relatedLink: { text: 'Learn About Flute Scales & Materials', view: 'learn_choose_flute' },
    tags: ['flute lifespan', 'longevity', 'bamboo oiling', 'preservation']
  },
  {
    id: 'care-general-basic-maintenance-tips',
    category: 'Flute Care & Maintenance',
    question: 'What are the basic maintenance tips for a flute?',
    answer: `Basic flute maintenance requires no expensive tools—just consistency, gentle handling, and basic hygiene.

Essential maintenance checklist:
- Dry Swabbing: Pass a soft cotton pull-through cloth through the inside bore after every session.
- Exterior Wipe: Wipe down the exterior with a dry, lint-free microfiber cloth.
- Check the Cork Position: Ensure the natural cork plug near the blowing hole remains firmly sealed and undisturbed. Never poke sharp objects near the internal cork!
- Thread Care: If thread bindings unravel, re-wrap them tightly or secure loose ends with a tiny drop of clear glue.
- Safe Air-Drying: Allow the flute to air-dry vertically in a safe room corner for 10–15 minutes before zipping it into an airtight case.

These basic steps take less than three minutes and prevent 95% of common bamboo flute problems.`,
    relatedLink: { text: 'Read Common Mistakes Guide', view: 'learn_common_mistakes' },
    tags: ['maintenance tips', 'checklist', 'cork plug', 'thread bindings']
  },
  {
    id: 'care-general-can-poor-maintenance-affect-sound',
    category: 'Flute Care & Maintenance',
    question: 'Can poor maintenance affect sound quality?',
    answer: `Yes, poor maintenance severely degrades both the acoustic quality and pitch accuracy of a bamboo flute. 

How lack of care hurts sound quality:
- Dull, Muffled Tone: Accumulated saliva, dust, or mold inside the bore disrupts the smooth airflow, dampening sound wave resonance and making notes sound muffled.
- Out-of-Tune Pitches: Waterlogged bamboo swells internally, narrowing the inner bore diameter and causing notes—especially upper octave Taar Saptak notes—to play flat or become difficult to blow.
- Squeaking & Air Leakage: Hairline cracks caused by dryness allow air to escape from the sides, causing frustrating squeaks, loss of bass depth, or complete note failure on lower notes like Mandra Pa.

Regular cleaning and proper humidity control restore crisp response, effortless blowing, and sweet, crystalline tone quality.`,
    relatedLink: { text: 'Troubleshoot Sound Issues in Common Mistakes', view: 'learn_common_mistakes' },
    tags: ['sound quality', 'muffled tone', 'pitch drift', 'squeaks']
  },
  {
    id: 'care-general-how-to-know-needs-maintenance',
    category: 'Flute Care & Maintenance',
    question: 'How do I know if my flute needs maintenance?',
    answer: `Your bansuri will display subtle visual, tactile, and auditory warning signs when it requires attention or maintenance.

Watch out for these 5 signs:
1. Musty or Stale Odor: Indicates trapped moisture, saliva buildup, or early mold growth inside the bore.
2. Difficulty Reaching High or Low Notes: If lower Mandra notes feel airy or upper Taar Saptak notes jump out of control, internal moisture swell or air leaks may be present.
3. Unraveling Thread Wrappings: Loose or snapped thread bindings signal that structural stress isn't being distributed properly.
4. Dry, Faded Bamboo Surface: Indicates the bamboo is dehydrated and vulnerable to cracking; it requires light internal oiling.
5. Visible Fine Lines: Tiny hairline cracks along the bamboo grain require immediate binding or glue seal before they expand.`,
    relatedLink: { text: 'Open Flute Sangam Interactive Tuner', view: 'learn_tuner' },
    tags: ['warning signs', 'maintenance triggers', 'musty odor', 'faded bamboo']
  },
  {
    id: 'care-general-common-care-mistakes',
    category: 'Flute Care & Maintenance',
    question: 'What are the most common flute care mistakes?',
    answer: `Avoid these four widespread flute care blunders made by beginners:

1. Washing the Flute with Water: Submerging or rinsing a bamboo bansuri in water ruins the raw wood fibers, warps the bore geometry, and destroys internal tuning.
2. Leaving the Flute in Hot Vehicles: Car interiors reach scorching temperatures that bake bamboo, causing instant longitudinal cracks.
3. Poking Sharp Objects into the Bore: Inserting metal rods or sharp keys can scratch the delicate inner lining or displace the internal cork plug.
4. Packing Away a Wet Flute: Zipping a moisture-drenched flute straight into a synthetic vinyl case creates a humid greenhouse effect that breeds mold and rot.

By avoiding these critical errors, your bamboo flute remains in peak playing condition for decades.`,
    relatedLink: { text: 'Read Full Common Playing & Care Mistakes', view: 'learn_common_mistakes' },
    tags: ['care mistakes', 'washing warning', 'hot car', 'mold prevention']
  },
  {
    id: 'care-general-should-beginners-learn-maintenance',
    category: 'Flute Care & Maintenance',
    question: 'Should beginners learn flute maintenance right from the start?',
    answer: `Absolutely! Learning basic flute care on day one is just as important as learning how to hold the instrument or produce your first sound.

Why beginners must learn maintenance early:
- Protects Your Investment: Even beginner flutes deserve proper care. Developing good swabbing habits early prevents accidental cracks and saves money on replacements.
- Builds Hygienic Habits: Keeps the embouchure area clean and sanitary, preventing bad odors or lip irritations.
- Enhances Ear Training: A clean, dry flute responds predictably, allowing beginners to hear true pitch and focus on tone production without fighting out-of-tune acoustics.
- Deepens Connection with Instrument: Understanding how bamboo reacts to breath and climate builds respect for the physical craftsmanship of your bansuri.`,
    relatedLink: { text: 'Start Beginner Flute Learning Journey', view: 'learn_basics' },
    tags: ['beginners', 'early habits', 'hygiene', 'instrument respect']
  },
  {
    id: 'care-general-does-cleaning-improve-performance',
    category: 'Flute Care & Maintenance',
    question: 'Does regular cleaning improve flute performance?',
    answer: `Yes, regular cleaning directly boosts your flute's responsiveness, tone clarity, and pitch stability.

Performance benefits of a clean flute:
- Crystalline Tonal Projection: Removing moisture and saliva residue leaves the internal bore smooth, allowing sound waves to travel cleanly without acoustic dampening.
- Effortless Octave Switching: Clean finger hole edges and dry inner walls allow crisp air pressure buildup, making transitions between Middle (Madhya) and Upper (Taar) octaves smooth and predictable.
- Immediate Air Response: A dry, smooth bore responds instantly to soft breath expressions, subtle Meend slides, and rapid finger Taans.
- Fresh Hygienic Feel: Playing a clean, pleasant-smelling flute encourages longer, more enjoyable practice sessions!`,
    relatedLink: { text: 'Explore Daily Practice Routines', view: 'learn_daily_practice' },
    tags: ['performance boost', 'clear tone', 'octave response', 'swabbing']
  },

  // ==========================================
  // 2. CLEANING THE FLUTE (10 Questions)
  // ==========================================
  {
    id: 'care-cleaning-how-to-clean-bamboo-flute',
    category: 'Flute Care & Maintenance',
    question: 'How do I clean a bamboo flute step by step?',
    answer: `Cleaning a natural bamboo bansuri is a gentle, straightforward process that takes under two minutes.

Step-by-step cleaning procedure:
1. Prepare a Cleaning Swab: Attach a soft, lint-free cotton cloth or thin microfiber strip to the slotted eyelet of a flexible wooden or plastic cleaning rod.
2. Insert Gently into the Bore: Insert the rod into the open bottom end of the flute and gently push it upward towards the top blowhole.
3. Stop Near the Cork Plug: Stop when you feel gentle resistance near the cork plug (approx. 1–2 cm past the blowhole). NEVER push forcefully against the internal cork!
4. Rotate and Withdraw: Slowly rotate the rod to absorb all inner wall condensation, then pull it back out smoothly.
5. Wipe the Exterior: Use a soft dry cloth to wipe finger smudges off the outer surface and around finger holes.
6. Air Dry: Leave the flute standing vertically in a open, shaded room area for 10 minutes before storing.`,
    relatedLink: { text: 'View Flute Selection & Care Guide', view: 'learn_choose_flute' },
    tags: ['step by step cleaning', 'swab rod', 'cotton cloth', 'cork caution']
  },
  {
    id: 'care-cleaning-what-to-use-inside',
    category: 'Flute Care & Maintenance',
    question: 'What should I use to clean the inside of the flute?',
    answer: `To clean the inside bore of a bamboo bansuri safely, use soft, non-abrasive, highly absorbent materials.

Recommended internal cleaning materials:
- Soft Cotton Swab Cloth: Pure unbleached cotton or soft flannel cloth absorbs moisture instantly without scratching bamboo fibers.
- Microfiber Cleaning Pull-Through: Synthetic microfiber pulls away moisture and fine dust particles effectively.
- Wooden or Plastic Cleaning Rod: Use a thin, smooth wooden dowel or plastic rod with a slotted end. Avoid metal rods, which can scratch the delicate inner wall or chip the blowing hole edge!
- Cotton Ear Swabs (Q-Tips): Perfect for gently cleaning dust or saliva residue out of individual finger holes and the blowhole perimeter.

Avoid paper towels or tissue paper inside the bore, as they tear easily and leave damp paper debris stuck in the bamboo interior.`,
    relatedLink: { text: 'Read Basics & Equipment Recommendations', view: 'learn_basics' },
    tags: ['cleaning rod', 'cotton cloth', 'microfiber', 'q-tips']
  },
  {
    id: 'care-cleaning-can-i-wash-with-water',
    category: 'Flute Care & Maintenance',
    question: 'Can I wash my bamboo flute with water?',
    answer: `NO! You should NEVER wash, rinse, soak, or submerge a bamboo flute in water.

Why water is dangerous for bamboo flutes:
- Fiber Swelling & Warping: Raw bamboo fibers absorb water rapidly. Swelling alters the precision bore geometry, ruining the flute's pitch tuning.
- Extreme Cracking Risk: As water evaporates from soaked bamboo, internal layers dry at different rates than outer layers, creating immense structural tension that cracks the tube wide open.
- Glue & Thread Damage: Water weakens natural adhesives holding thread bindings and internal cork plugs in place.

If the exterior gets dirty, wipe it with a slightly damp cloth that has been wrung out thoroughly until nearly dry, and dry it immediately with a towel. Keep liquid water far away from your bansuri!`,
    relatedLink: { text: 'Troubleshoot Flute Care Mistakes', view: 'learn_common_mistakes' },
    tags: ['water warning', 'no washing', 'bamboo swelling', 'cracking hazard']
  },
  {
    id: 'care-cleaning-safe-to-use-soap',
    category: 'Flute Care & Maintenance',
    question: 'Is it safe to use soap or detergent on a bamboo flute?',
    answer: `No, liquid soaps, dish detergents, or chemical household cleaners should never be applied to a bamboo bansuri.

Why soaps and chemicals harm bamboo:
- Strips Natural Oils: Detergents strip away the natural protective oils and wax layers present in seasoned bamboo, leaving wood dry, brittle, and susceptible to severe cracking.
- Toxic Residue: Harsh chemical residues seep into porous bamboo walls, creating unpleasant chemical smells that you breathe in while playing.
- Color Bleeding: Chemical agents can discolor polished bamboo surfaces and damage decorative thread wrappings.

To keep your flute clean, rely purely on dry cotton swabbing, soft microfiber wiping, and natural internal oiling every few months. Nature provides all the protection bamboo needs!`,
    relatedLink: { text: 'Explore Flute Care Essentials', view: 'learn_choose_flute' },
    tags: ['no soap', 'no detergents', 'chemical free', 'natural bamboo']
  },
  {
    id: 'care-cleaning-how-to-remove-moisture',
    category: 'Flute Care & Maintenance',
    question: 'How do I remove moisture after playing?',
    answer: `Removing moisture after every playing session is the single most effective habit to preserve your bansuri.

3 Steps to remove post-practice moisture:
1. Swab the Internal Bore: Pass a soft cotton pull-through cloth attached to a wooden cleaning rod through the bore 2–3 times until the interior walls feel dry to the touch.
2. Clean Finger Holes & Blowhole: Gently dab a cotton swab around the edge of the blowhole (embouchure) and inside finger holes where moisture gathers during playing.
3. Air-Dry Vertically: Stand the flute vertically against a secure wall corner or in a flute stand for 10–15 minutes in a well-ventilated room before packing it into its carrying case.

This simple routine takes under two minutes and keeps your bansuri dry, sanitary, and crack-free.`,
    relatedLink: { text: 'View Daily Flute Care Checklist', view: 'learn_daily_practice' },
    tags: ['remove moisture', 'swabbing', 'air dry', 'post-playing routine']
  },
  {
    id: 'care-cleaning-how-long-to-let-dry',
    category: 'Flute Care & Maintenance',
    question: 'How long should I let my flute dry before putting it in a case?',
    answer: `After swabbing the internal bore with a cotton cloth, allow your bamboo flute to air-dry for approximately 10 to 15 minutes before closing it inside a zipped bag or hard case.

Guidelines for drying:
- Dry in a Well-Ventilated Area: Place the flute vertically in a room with gentle air circulation.
- Avoid Direct Sun or Fans: Never place a damp flute under direct sunlight or directly in front of an intense high-speed fan or heater to dry faster. Accelerated drying causes rapid thermal contraction that cracks bamboo.
- Don't Leave Exposed Overnight: While 15 minutes of drying is ideal, do not leave your flutes sitting out on open tables overnight where accidental drops or ambient humidity shifts can occur.

Once the 15-minute air-dry is complete, store the flute safely in its padded case.`,
    relatedLink: { text: 'Read Storage Guidelines in Basics', view: 'learn_basics' },
    tags: ['drying time', 'air dry', '15 minutes', 'safe drying']
  },
  {
    id: 'care-cleaning-should-i-clean-after-every-session',
    category: 'Flute Care & Maintenance',
    question: 'Should I clean my flute after every practice session?',
    answer: `Yes! Swabbing internal moisture after EVERY practice session—whether you played for 15 minutes or 2 hours—is essential for maintaining bamboo health.

Why post-session swabbing is non-negotiable:
- Condensation Accumulates Rapidly: Human breath contains high humidity. Within minutes of blowing, water droplets coat the inner bamboo bore.
- Prevents Permanent Fiber Saturation: Leaving moisture inside allows water to soak deep into raw bamboo grain, causing swelling, tuning distortion, and mold.
- Prevents Bad Odors: Stagnant saliva dries into a stale layer that breeds bacteria and foul smells over time.

A quick 60-second swab at the end of every session keeps your bansuri fresh, sweet-sounding, and structurally sound forever.`,
    relatedLink: { text: 'Explore Flute Sangam Daily Practice Routines', view: 'learn_daily_practice' },
    tags: ['every session', 'post practice', 'swabbing habit', 'hygiene']
  },
  {
    id: 'care-cleaning-can-i-use-alcohol',
    category: 'Flute Care & Maintenance',
    question: 'Can I use alcohol or disinfectant to clean my flute?',
    answer: `No, you should NOT use rubbing alcohol, isopropyl alcohol, hand sanitizers, or bleach disinfectants on a bamboo flute.

Why alcohol damages bamboo:
- Severe Dehydration: Alcohol is a powerful solvent and drying agent. Applying it to bamboo strips away natural moisture and oils instantly, causing severe wood shrinkage and immediate cracking.
- Shellac & Polish Ruin: Alcohol dissolves natural lacquers, polish, and thread adhesives used by flute makers.
- Toxic Breath Inhalation: Residual alcohol fumes trapped inside the bore create harsh, dangerous vapors when inhaled during playing.

If you need to sanitize the blowhole area, wipe it gently with a soft cloth slightly dampened with plain warm water, then dry it thoroughly immediately.`,
    relatedLink: { text: 'Read Safety Tips in Common Mistakes', view: 'learn_common_mistakes' },
    tags: ['no alcohol', 'no disinfectant', 'dehydration hazard', 'bamboo protection']
  },
  {
    id: 'care-cleaning-remove-dirt-from-finger-holes',
    category: 'Flute Care & Maintenance',
    question: 'How do I remove dirt and dust from finger holes?',
    answer: `Over time, natural skin oils, dust, and microscopic sweat gather around the edges of finger holes, affecting finger seal and aesthetic look.

How to clean finger holes safely:
1. Use a Dry Cotton Q-Tip: Insert a dry cotton swab gently into each finger hole and rotate it gently to sweep away accumulated lint or grime.
2. Use a Soft Toothbrush: For stubborn dirt around thread bindings or hole edges, use an extra-soft dry toothbrush with feather-light strokes.
3. Avoid Metal Tools: Never use metal pins, needles, or pocket knives to scrape finger holes! Metal easily chips the delicate bamboo hole edges, altering pitch calibration permanently.
4. Wash Hands Before Playing: Prevent future dirt buildup by always washing and drying your hands thoroughly before picking up your bansuri.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['finger holes', 'cleaning q-tip', 'dirt removal', 'pitch protection']
  },
  {
    id: 'care-cleaning-what-cleaning-cloth-is-best',
    category: 'Flute Care & Maintenance',
    question: 'What cleaning cloth is best for a bamboo flute?',
    answer: `Choosing the right cloth ensures efficient moisture absorption without leaving lint or scratching bamboo surfaces.

Best cloth choices:
- Pure Unbleached Cotton / Flannel: Excellent for internal swabbing. Cotton fibers absorb moisture instantly and can be easily washed and reused.
- High-Density Microfiber: Ideal for wiping down the exterior bamboo surface, polishing finger hole areas, and removing fingerprints without water or chemicals.
- Silk Pull-Throughs: Extremely soft and smooth, preferred by classical players for gentle internal swabbing.

Avoid using rough paper towels, coarse shop rags, or synthetic materials like nylon, which scratch polished bamboo surfaces or shred inside the bore.`,
    relatedLink: { text: 'Read Equipment Recommendations', view: 'learn_basics' },
    tags: ['best cleaning cloth', 'cotton flannel', 'microfiber', 'silk swab']
  },

  // ==========================================
  // 3. MOISTURE & HUMIDITY (10 Questions)
  // ==========================================
  {
    id: 'care-moisture-why-builds-up',
    category: 'Flute Care & Maintenance',
    question: 'Why does moisture build up inside the flute while playing?',
    answer: `Moisture buildup inside a flute is a natural physical consequence of human respiration. Warm, humid breath exhaled from your lungs (at ~37°C / 98.6°F) meets the cooler room-temperature inner wall of the bamboo tube.

As warm breath cools upon contacting the bamboo surface, water vapor condenses into liquid water droplets—a process known as condensation. This condensation gathers along the internal bore wall, especially near the blowing hole and top finger holes.

Because breath moisture contains natural minerals and enzymes, leaving this liquid trapped inside the flute allows it to soak into raw bamboo fibers. Swabbing immediately after playing removes this condensation before damage occurs.`,
    relatedLink: { text: 'Understand Flute Acoustics in Basics', view: 'learn_basics' },
    tags: ['moisture buildup', 'breath condensation', 'physics of sound', 'swabbing']
  },
  {
    id: 'care-moisture-can-moisture-damage',
    category: 'Flute Care & Maintenance',
    question: 'Can moisture damage a bamboo flute?',
    answer: `Yes, unmanaged moisture is one of the leading causes of damage in bamboo flutes. While bamboo is naturally water-tolerant when living, harvested and dried bansuris absorb liquid rapidly.

Risks of unmanaged moisture:
- Fiber Expansion & Warping: Constant wet-dry cycles cause bamboo fibers to swell and shrink repeatedly, leading to structural stress and longitudinal cracks.
- Pitch Distortion: Swollen internal walls reduce bore volume, making notes play noticeably out of tune.
- Mold & Fungal Rot: Dark, damp conditions inside a stored un-swabbed flute create a breeding ground for black mold spores, ruining the instrument and posing health risks.
- Cork Degradation: Excess moisture can rot or loosen the natural internal cork seal near the blowhole.

Regular swabbing keeps moisture levels balanced and safe.`,
    relatedLink: { text: 'Troubleshoot Sound & Pitch Flaws', view: 'learn_common_mistakes' },
    tags: ['moisture damage', 'swelling', 'mold rot', 'cork damage']
  },
  {
    id: 'care-moisture-how-to-prevent-buildup',
    category: 'Flute Care & Maintenance',
    question: 'How do I prevent excess moisture buildup while playing?',
    answer: `While you cannot eliminate breath condensation entirely, you can significantly reduce excessive moisture buildup using smart techniques.

Tips to manage moisture buildup:
- Warm Up the Flute First: Before blowing hard, warm the head-joint area gently with your hands for 30 seconds. A warmer flute wall reduces temperature contrast, minimizing condensation.
- Avoid Playing Right After Eating: Always rinse your mouth with water before playing. Food residue and sugary drinks increase saliva viscosity and coat the inside bore.
- Take Swabbing Pauses During Long Sessions: In 1–2 hour practice sessions, take a quick 30-second break every 30 minutes to swab out accumulated moisture.
- Maintain Relaxed Embouchure: Avoid spitting or blowing with excessive force; a smooth, focused air stream produces sweeter tone with less excess saliva.`,
    relatedLink: { text: 'Explore Daily Practice Routines', view: 'learn_daily_practice' },
    tags: ['prevent moisture', 'warm up flute', 'mouth hygiene', 'swabbing breaks']
  },
  {
    id: 'care-moisture-should-i-dry-immediately',
    category: 'Flute Care & Maintenance',
    question: 'Should I dry my flute immediately after playing?',
    answer: `Yes! Drying your bansuri immediately after finishing your practice session is a crucial protection rule.

Why immediate drying is critical:
- Prevents Deep Water Absorption: Standing water droplets begin soaking into raw bamboo within 10–15 minutes. Swabbing right away removes liquid before it penetrates deep wood grain.
- Prevents Sticky Residue: Saliva dries into a tacky film if left alone, making future cleaning harder and dulling sound resonance.
- Keeps Storage Case Dry: Swabbing before casing prevents moisture from transferring into your case lining, which can breed mold inside the bag.

Make it a automatic ritual: finish your last note, swab the bore, wipe the body, and air-dry for 10 minutes.`,
    relatedLink: { text: 'View Equipment & Maintenance Guide', view: 'learn_basics' },
    tags: ['immediate drying', 'swabbing habit', 'post practice', 'mold prevention']
  },
  {
    id: 'care-moisture-is-humidity-harmful',
    category: 'Flute Care & Maintenance',
    question: 'Is ambient environmental humidity harmful to bamboo flutes?',
    answer: `Both extremes—excessively high humidity AND extremely low humidity—pose distinct threats to bamboo flutes.

Humidity impact breakdown:
- Extremely High Humidity (>70% RH, e.g., Monsoon Season): Bamboo absorbs atmospheric moisture, causing wood fibers to swell. This can make key notes play flat, weaken thread bindings, and foster mold inside cases.
- Extremely Low Humidity (<30% RH, e.g., Arid Winters or Air-Conditioned Rooms): Dry air sucks natural moisture out of bamboo rapidly. Dried-out bamboo shrinks, becomes brittle, and develops sudden cracks along its natural grain lines.
- Ideal Relative Humidity: Bamboo thrives in a stable relative humidity range of 45% to 60% RH.

Using silica gel packets in humid seasons and storing flutes in sealed cases during dry winters protects against climate extremes.`,
    relatedLink: { text: 'Read Choose Right Flute Guide', view: 'learn_choose_flute' },
    tags: ['humidity', 'relative humidity', 'monsoon', 'dry air', 'cracking']
  },
  {
    id: 'care-moisture-can-flute-absorb-too-much',
    category: 'Flute Care & Maintenance',
    question: 'Can a bamboo flute absorb too much moisture?',
    answer: `Yes! Bamboo is a porous natural grass that acts like a micro-sponge when exposed to prolonged dampness or standing water.

Consequences of over-absorption:
- Pitch Shift (Dropping Flat): Water-logged bamboo increases in weight and density, lowering the fundamental pitch frequency (Sa) and making the flute sound flat compared to standard tuning (A=440Hz).
- Muffled Resonance: Heavy, water-soaked walls dampen acoustic vibrations, stripping the bansuri of its crisp harmonic overtones and projection.
- Internal Softening & Mold: Excessive moisture softens raw internal bamboo fibers, making them prone to fungal rot.

If your flute becomes saturated, swab it thoroughly and allow it to air-dry slowly in a cool, shaded room for 24–48 hours before playing again.`,
    relatedLink: { text: 'Open Flute Sangam Interactive Tuner', view: 'learn_tuner' },
    tags: ['over absorption', 'waterlogged', 'flat pitch', 'dull tone']
  },
  {
    id: 'care-moisture-ideal-humidity',
    category: 'Flute Care & Maintenance',
    question: 'What is the ideal humidity level for storing a bamboo flute?',
    answer: `The ideal environmental humidity range for storing a natural bamboo bansuri is between 45% and 60% Relative Humidity (RH).

How humidity levels affect your bansuri:
- Below 35% RH (Dangerously Dry): High risk of bamboo dehydration and cracking. Use a small room humidifier or place a damp sponge inside a perforated bag near (not touching) flute cases.
- 45%–60% RH (The Sweet Spot): Perfect equilibrium where bamboo maintains its optimal moisture balance, pitch calibration, and fiber flexibility.
- Above 70% RH (Excessively Humid): Risk of mold growth and wood swelling. Place 2–3 silica gel packets inside carrying cases to absorb excess airborne moisture.

Investing in a inexpensive digital hygrometer for your music room lets you monitor and maintain ideal storage conditions easily.`,
    relatedLink: { text: 'Read Storage & Equipment Safety', view: 'learn_basics' },
    tags: ['ideal humidity', 'relative humidity', 'hygrometer', 'silica gel']
  },
  {
    id: 'care-moisture-protect-during-rainy-season',
    category: 'Flute Care & Maintenance',
    question: 'How do I protect my flute during the monsoon or rainy season?',
    answer: `The rainy season brings high atmospheric humidity and damp air that can cause mold growth and thread loosening if left unmonitored.

Monsoon care protocol for bamboo flutes:
1. Add Silica Gel Packets: Place 2 to 4 silica gel desiccant sachets inside your flute bag or PVC pipe case. Replace or reactivate them once a month.
2. Swab Rigorously: Humidity slows down natural air drying, so swab the bore thoroughly after playing.
3. Increase Air Drying Time: Allow flutes to air-dry for 20 minutes in a room with a ceiling fan running before zipping them into bags.
4. Inspect Weekly for Mold: Check inside the bore with a flashlight once a week. If white or green spots appear, wipe immediately with a cotton swab lightly dampened with a drop of neem oil or tea tree oil.
5. Keep Bags Off Damp Floors: Never store flute bags directly on cold tile or concrete floors during monsoons.`,
    relatedLink: { text: 'Read Common Care Mistakes Guide', view: 'learn_common_mistakes' },
    tags: ['monsoon care', 'rainy season', 'silica gel', 'mold prevention']
  },
  {
    id: 'care-moisture-should-i-use-silica-gel',
    category: 'Flute Care & Maintenance',
    question: 'Should I use silica gel packets in my flute case?',
    answer: `Yes, using silica gel packets inside your flute carrying case is a highly effective way to control excess humidity, especially during monsoons or in coastal regions.

How to use silica gel safely:
- Absorbs Airborne Dampness: Silica gel pulls excess moisture out of enclosed bag air, keeping bamboo dry and preventing mold spores from germinating.
- Do Not Touch Bamboo Directly: Keep silica gel packets wrapped in cloth or tucked inside bag side pockets so they don't scrub directly against polished bamboo surfaces.
- Don't Over-Dry in Arid Winters: Remove silica gel packets during dry winter months when humidity drops below 35% RH to avoid drying out the bamboo excessively.
- Reactivate Periodically: Recharge orange/blue indicating silica packets by warming them in sunlight or a warm oven according to manufacturer instructions.`,
    relatedLink: { text: 'View Equipment Recommendations', view: 'learn_basics' },
    tags: ['silica gel', 'desiccant', 'case protection', 'monsoon']
  },
  {
    id: 'care-moisture-can-dryness-damage',
    category: 'Flute Care & Maintenance',
    question: 'Can excessive dryness damage a bamboo flute?',
    answer: `Yes! Excessive environmental dryness is actually far more dangerous to a bamboo bansuri than high humidity. Rapid dehydration is the #1 cause of sudden longitudinal cracks.

Why dry air damages bamboo:
- Shrinkage Stress: Bamboo walls consist of dense outer bark and porous inner pith. In dry conditions (<30% RH), outer layers lose moisture faster than inner layers, creating intense mechanical tension that snaps bamboo along its vertical grain.
- High-Risk Scenarios: Using air conditioners continuously in summer, indoor radiator heaters in cold winters, or traveling to arid desert climates.
- Protection Steps: Keep flutes inside closed padded cases when not playing. During dry seasons, apply a light coat of unrefined mustard oil inside the bore and use a room humidifier.`,
    relatedLink: { text: 'Learn Crack Prevention & Repair', view: 'learn_common_mistakes' },
    tags: ['dryness hazard', 'bamboo cracks', 'air conditioning', 'dehydration']
  },

  // ==========================================
  // 4. STORAGE (10 Questions)
  // ==========================================
  {
    id: 'care-storage-best-way-to-store',
    category: 'Flute Care & Maintenance',
    question: 'What is the best way to store a bamboo flute?',
    answer: `The ideal storage setup protects your bansuri from physical impacts, dust, direct sunlight, pet accidents, and sudden climate shifts.

Golden rules for storing bamboo flutes:
1. Horizontal Padded Storage: Store flutes horizontally inside a padded carrying bag, rigid PVC hard case, or velvet-lined flute box.
2. Climate-Controlled Room: Keep stored flutes in a room with moderate temperature (20°C–26°C) and stable humidity (45%–60% RH).
3. Away from Direct Sunlight & Vents: Store cases away from windows, direct sun rays, air conditioner blowers, and radiators.
4. Keep Off the Floor: Store cases on elevated shelves, inside cupboards, or on dedicated instrument racks—never directly on cold floors or near drafty doorways.

Storing your instruments properly guarantees they stay in peak playing condition and tuned ready for every session.`,
    relatedLink: { text: 'Read Choose Right Flute Guide', view: 'learn_choose_flute' },
    tags: ['best storage', 'horizontal storage', 'pvc case', 'climate control']
  },
  {
    id: 'care-storage-should-i-keep-in-case',
    category: 'Flute Care & Maintenance',
    question: 'Should I always keep my flute in a case when not playing?',
    answer: `Yes, keeping your bamboo flute inside a protective case whenever you aren't playing is the safest rule for every flutist.

Why case storage is essential:
- Guards Against Accidental Drops: An open flute left on a chair or bed can easily be knocked down, stepped on, or rolled onto hard flooring.
- Buffers Climate Spikes: A zipped padded case or rigid PVC tube acts as a thermal buffer, slowing down rapid temperature and humidity fluctuations.
- Dust & Pest Protection: Prevents dust, insects, or household pets from contacting blowing holes and thread bindings.
- Extended Lifespan: Flutes kept consistently in cases stay crack-free and in tune significantly longer than flutes left exposed in open rooms.`,
    relatedLink: { text: 'View Equipment Safety Tips', view: 'learn_basics' },
    tags: ['flute case', 'protection', 'thermal buffer', 'drop prevention']
  },
  {
    id: 'care-storage-can-i-leave-on-table',
    category: 'Flute Care & Maintenance',
    question: 'Can I leave my flute lying on an open table?',
    answer: `Leaving a bamboo bansuri exposed on an open table is risky and should be avoided whenever possible.

Risks of leaving flutes on open tables:
- Rolling Hazards: Cylindrical bamboo flutes roll easily. A slight bump or draft can send your flute rolling off the table edge onto hard floor surfaces.
- Direct Sun & Air Shock: Tables near windows expose bamboo to direct sunlight or harsh AC air streams, causing rapid drying and cracking.
- Accidental Spills: Liquids, hot coffee, or food spilled on tables can permanently stain or damage raw bamboo.

If you must set your flute down briefly during a practice break, lay it on a soft folded towel in the middle of a flat surface far from table edges.`,
    relatedLink: { text: 'Read Common Flute Mistakes', view: 'learn_common_mistakes' },
    tags: ['table hazard', 'rolling drop', 'accidental damage', 'safety']
  },
  {
    id: 'care-storage-safe-to-hang-on-wall',
    category: 'Flute Care & Maintenance',
    question: 'Is it safe to hang a bamboo flute on the wall as decoration?',
    answer: `While hanging a bansuri on a wall looks aesthetically pleasing, it is NOT recommended if you intend to play the instrument regularly.

Drawbacks of wall hanging:
- Climate Vulnerability: Wall surfaces experience high temperature variations and drafts. Unprotected bamboo hung on walls dries out rapidly and cracks.
- Dust Accumulation: Open wall storage allows dust and airborne grime to settle inside finger holes and the blowing embouchure.
- Fall Hazard: Unsecured wall pegs or earthquake vibrations can cause the flute to fall and shatter.

If you wish to display flutes, use a glass-fronted closed display cabinet with controlled humidity rather than hanging them exposed on open drywall.`,
    relatedLink: { text: 'Explore Flute Storage Guidelines', view: 'learn_basics' },
    tags: ['wall hanging', 'display hazard', 'dust accumulation', 'cabinet']
  },
  {
    id: 'care-storage-can-i-store-vertically',
    category: 'Flute Care & Maintenance',
    question: 'Can I store my flute vertically in a stand?',
    answer: `Yes, storing bamboo flutes vertically in a specialized multi-flute stand or vertical rack is safe, provided the environment is indoor-controlled and stable.

Vertical storage considerations:
- Use a Stable Flute Stand: Ensure the stand has soft padded pegs that support the flute securely without scratching the inner bore or applying stress to blowing holes.
- Great for Short Air-Drying: Vertical stands are ideal right after playing because they allow remaining moisture to drain downward away from the top cork plug.
- Keep in Safe Corners: Place vertical stands away from high-traffic walkways where children, pets, or vacuum cleaners could knock them over.
- Cover with Cloth when Idle: If leaving flutes on a vertical stand for days, throw a soft cotton cloth over them to keep dust off.`,
    relatedLink: { text: 'View Equipment & Practice Setup', view: 'learn_daily_practice' },
    tags: ['vertical storage', 'flute stand', 'air drying', 'rack']
  },
  {
    id: 'care-storage-keep-away-from-sunlight',
    category: 'Flute Care & Maintenance',
    question: 'Should I keep my flute away from direct sunlight?',
    answer: `YES! Direct sunlight is one of the most destructive natural elements for a bamboo bansuri.

Why sunlight damages bamboo flutes:
- Solar Heat bakes Wood: UV radiation and intense heat bake the outer bamboo shell, causing rapid moisture loss.
- High Cracking Hazard: Uneven heating snaps bamboo along its vertical fibers within minutes.
- Discoloration & Thread Fading: Solar rays bleach natural bamboo sheen and cause colorful nylon/silk thread wrappings to fade and become brittle.

Always store your flute cases in shaded room corners, inside wardrobes, or on shelves well away from window glass.`,
    relatedLink: { text: 'Read Crack Prevention Guidelines', view: 'learn_common_mistakes' },
    tags: ['no sunlight', 'uv damage', 'heat risk', 'bamboo baking']
  },
  {
    id: 'care-storage-can-heat-damage',
    category: 'Flute Care & Maintenance',
    question: 'Can heat damage a bamboo flute?',
    answer: `Yes, extreme heat or hot environments cause severe and often irreversible damage to bamboo flutes.

Thermal heat damage effects:
- Thermal Expansion & Cracking: Heat causes bamboo cells to expand rapidly. As moisture boils off, internal wall stress causes loud, visible longitudinal splitting.
- Cork Shrinkage & Dislodgement: High heat dries out the internal natural cork plug, causing it to shrink, lose its airtight seal, or slip out of position, ruining fundamental Sa tuning.
- Thread & Adhesive Failure: Heat softens binding glues, causing thread wrappings to unravel.

Keep flutes far away from room heaters, fireplaces, kitchen stoves, hot lights, and sun-baked vehicles!`,
    relatedLink: { text: 'Troubleshoot Tuning & Cork Issues', view: 'learn_common_mistakes' },
    tags: ['heat damage', 'cork shrinkage', 'thermal shock', 'splitting']
  },
  {
    id: 'care-storage-near-air-conditioner',
    category: 'Flute Care & Maintenance',
    question: 'Should I keep my flute near an air conditioner or heater?',
    answer: `No! Storing or playing your bamboo flute directly in the airflow path of an air conditioner or space heater is extremely dangerous.

Why AC and heater airflows are dangerous:
- AC Dehumidification Shock: Air conditioners blow cold, ultra-dry air that leaches moisture out of bamboo fibers instantly.
- Radiator Thermal Shock: Space heaters blow scorching dry heat that bakes wood.
- Draft-Induced Cracks: Rapid alternation between cold AC air and warm room air creates severe thermal shock.

Keep your instrument cases at least 6–8 feet away from direct AC blowers, vents, or heating units.`,
    relatedLink: { text: 'Read Choose Right Flute Guide', view: 'learn_choose_flute' },
    tags: ['air conditioner hazard', 'space heater', 'thermal shock', 'dry air']
  },
  {
    id: 'care-storage-safe-in-cupboard',
    category: 'Flute Care & Maintenance',
    question: 'Is it safe to store a flute inside a wardrobe or cupboard?',
    answer: `Yes, storing your bamboo flute inside a closed wardrobe, closet, or wooden cupboard is one of the safest indoor storage methods available!

Benefits of cupboard storage:
- Stable Micro-Climate: Cupboards buffer against sudden room temperature changes, drafts, and direct sunlight.
- Dust-Free Environment: Protects finger holes and thread bindings from room dust and pet hair.
- Safe from Accidental Bumps: Keeps instruments tucked away from physical foot traffic and children.
- Tips for Cupboard Storage: Ensure the cupboard is dry and free from damp walls. Place a small silica gel packet inside your flute bag if storing during humid monsoon months.`,
    relatedLink: { text: 'Explore Storage & Safety Rules', view: 'learn_basics' },
    tags: ['cupboard storage', 'wardrobe', 'micro climate', 'safe storage']
  },
  {
    id: 'care-storage-how-to-store-multiple-flutes',
    category: 'Flute Care & Maintenance',
    question: 'How should I store multiple flutes safely?',
    answer: `As your bansuri collection grows across different scale keys (E Bass, C Medium, G Base), organized multi-flute storage becomes essential.

Best practices for multiple flutes:
- Multi-Slot Flute Bag / Roll Bag: Use a multi-pocket padded canvas roll bag where each flute sits in its own individual velvet-lined compartment.
- Rigid PVC Multi-Flute Carrying Case: Store multiple flutes in a custom multi-tube PVC hard case for maximum travel protection.
- Prevent Flutes from Bumping Together: Never toss loose flutes together into a single open bag! Flutes knocking against each other scratch polished surfaces and chip delicate hole edges.
- Label Your Flutes: Mark scale keys clearly on bag pocket slots (e.g., E Bass, A Medium, G Base) for quick access during performance.`,
    relatedLink: { text: 'Explore Flute Sangam Scale Selection Guide', view: 'learn_choose_flute' },
    tags: ['multiple flutes', 'multi-pocket bag', 'flute collection', 'organization']
  },

  // ==========================================
  // 5. CRACKS & DAMAGE (10 Questions)
  // ==========================================
  {
    id: 'care-cracks-why-do-flutes-crack',
    category: 'Flute Care & Maintenance',
    question: 'Why do bamboo flutes crack?',
    answer: `Bamboo flutes crack primarily due to environmental stress, moisture imbalance, and physical shock acting on natural bamboo cellular structures.

Primary causes of bamboo cracks:
1. Dehydration & Dry Air: Low humidity (<35% RH) causes outer bamboo layers to shrink faster than inner layers, pulling fibers apart along natural vertical grain lines.
2. Rapid Thermal Shock: Sudden shifts from cold to heat (e.g., bringing a cold flute into a hot car or playing in freezing winter air) cause expansion stress.
3. Unswabbed Standing Water: Swollen wet interior walls combined with dry exteriors create severe internal wall tension.
4. Dropping on Hard Surfaces: Accidental drops on tile or concrete split vulnerable bottom or top ends.
5. Snapped Thread Bindings: Broken thread wrappings allow micro-fissures to expand freely.`,
    relatedLink: { text: 'Read Common Mistakes & Safety', view: 'learn_common_mistakes' },
    tags: ['why flutes crack', 'dehydration', 'thermal shock', 'bamboo grain']
  },
  {
    id: 'care-cracks-how-to-prevent',
    category: 'Flute Care & Maintenance',
    question: 'How can I prevent cracks in a bamboo flute?',
    answer: `Preventing cracks requires proactive moisture management and physical protection habits.

Crack prevention master guide:
- Swab Internal Bore After Every Play: Removes standing condensation before it causes internal swelling.
- Oil Internal Bore Twice a Year: Apply 3–4 drops of unrefined mustard or sweet almond oil inside the bore to keep bamboo fibers flexible and water-resistant.
- Maintain Intact Thread Bindings (Dhaaga): Ensure thread wrappings at both ends and middle points are tight. They act as protective steel hoops on a barrel.
- Avoid Direct Sun & AC Air: Store flutes in padded cases away from windows and air conditioners.
- Let Cold Flutes Warm Slowly: Never blow hot breath forcefully into a freezing cold flute! Hold it in your hands for 1 minute first to warm up naturally.`,
    relatedLink: { text: 'Explore Flute Care Essentials', view: 'learn_choose_flute' },
    tags: ['prevent cracks', 'oiling', 'thread bindings', 'thermal care']
  },
  {
    id: 'care-cracks-can-cracked-flute-be-played',
    category: 'Flute Care & Maintenance',
    question: 'Can a cracked flute still be played?',
    answer: `Whether a cracked flute can still be played depends on the location and severity of the crack.

Playing viability based on crack type:
- Hairline Cracks (Not Passing Through Bore): Minor surface hairline cracks that do not leak air allow the flute to play normally, but MUST be bound immediately with thread to prevent spreading.
- Deep Air-Leaking Cracks: If a crack extends through the wall thickness, air escapes from the side. This causes squeaks, loss of low bass notes (Mandra Sa/Pa), and erratic pitch. The flute cannot be played properly until sealed.
- Cracks Across Blowing Hole or Cork Area: Cracks directly cutting through the embouchure hole or top cork area severely destroy tone and require professional binding or replacement.`,
    relatedLink: { text: 'Troubleshoot Sound Issues in Common Mistakes', view: 'learn_common_mistakes' },
    tags: ['cracked flute', 'hairline crack', 'air leak', 'repairability']
  },
  {
    id: 'care-cracks-how-to-identify',
    category: 'Flute Care & Maintenance',
    question: 'How do I identify a crack in my flute?',
    answer: `Identifying early hairline cracks before they expand allows you to save your bansuri with simple thread binding.

3 Easy Tests to Identify Cracks:
1. Visual Inspection with Flashlight: Shine a bright flashlight down the internal bore while inspecting the exterior surface under light. Look for thin dark lines running parallel to bamboo fibers.
2. The Smoke or Soapy Water Air-Leak Test: Cover all finger holes and the bottom end, blow gently into the blowing hole, and check if air or sound leaks from any part of the body.
3. Sudden Loss of Lower Notes: If lower Mandra notes (Mandra Pa, Dha, Ni) suddenly sound airy, weak, or impossible to blow despite correct finger seals, an undetected micro-crack is usually leaking air.`,
    relatedLink: { text: 'Open Flute Sangam Interactive Tuner', view: 'learn_tuner' },
    tags: ['identify crack', 'air leak test', 'flashlight inspection', 'mandra notes']
  },
  {
    id: 'care-cracks-can-small-cracks-be-repaired',
    category: 'Flute Care & Maintenance',
    question: 'Can small cracks in a bamboo flute be repaired?',
    answer: `YES! Small hairline cracks can easily be repaired at home with complete success if caught early.

DIY Crack Repair Method:
1. Clean and Dry the Area: Ensure the crack is completely clean and dry.
2. Apply Cyanoacrylate Superglue (Fevikwik / Krazy Glue): Apply a tiny drop of thin liquid superglue directly along the hairline seam. Let capillary action pull the glue deep into the crack.
3. Compress Gently: Press the bamboo sides together firmly for 30 seconds.
4. Bind Tightly with Nylon Thread: Wrap strong nylon or silk thread tightly around the repaired area extending 1 cm past both ends of the crack. Secure thread ends with glue.
5. Sand Smooth: Gently sand any excess exterior glue with ultra-fine 600-grit sandpaper. The flute will play good as new!`,
    relatedLink: { text: 'Read Common Care & Maintenance Guide', view: 'learn_common_mistakes' },
    tags: ['repair crack', 'superglue', 'thread wrapping', 'diy repair']
  },
  {
    id: 'care-cracks-should-i-replace',
    category: 'Flute Care & Maintenance',
    question: 'When should I replace a cracked flute instead of repairing it?',
    answer: `While minor hairline cracks are easy to repair, certain severe structural damages make replacing the bansuri more practical.

When to replace your flute:
- Multiple Long Splits: If the bamboo has split into multiple major longitudinal cracks extending down the full length of the instrument.
- Cracks Through Embouchure Hole: Major cracks cutting directly through the blowing hole edge distort air blade optics permanently.
- Crushed or Shattered Bamboo: Impact damage that crushes the circular roundness of the bore destroys internal tuning harmonic node points.
- Cost of Repair Exceeds Replacement: If an inexpensive beginner flute requires extensive professional restoration, replacing it with a fresh, well-seasoned Assam bamboo flute is a wiser investment.`,
    relatedLink: { text: 'Explore Master Grade Flute Selection', view: 'learn_choose_flute' },
    tags: ['replace flute', 'severe damage', 'embouchure crack', 'buying new']
  },
  {
    id: 'care-cracks-can-temp-changes-cause',
    category: 'Flute Care & Maintenance',
    question: 'Can sudden temperature changes cause bamboo flutes to crack?',
    answer: `Yes! Thermal shock caused by rapid temperature shifts is one of the most common triggers for sudden bamboo cracking.

How thermal shock cracks bamboo:
- Differential Expansion: Outer bamboo skin heats up or cools down much faster than the inner core walls. This rapid temperature gradient creates intense shear stress across the bamboo fibers.
- High-Risk Examples:
  * Taking a cold flute out of a winter vehicle and blowing warm breath into it instantly.
  * Leaving a flute in a sun-baked car trunk in summer.
  * Playing directly in front of cold air conditioner blowers.
- Safety Prevention: Always allow a cold flute to sit inside its case at room temperature for 10–15 minutes to acclimate before playing.`,
    relatedLink: { text: 'Read Safety Rules in Basics', view: 'learn_basics' },
    tags: ['temperature shock', 'thermal expansion', 'winter care', 'acclimating']
  },
  {
    id: 'care-cracks-can-dropping-damage',
    category: 'Flute Care & Maintenance',
    question: 'Can dropping a bamboo flute damage it permanently?',
    answer: `Yes, dropping a bamboo flute on hard flooring (like marble, tile, or concrete) can cause serious structural damage.

Types of drop damage:
- End Splitting: The open bottom end or top head end strikes the floor first, causing vertical splits along natural bamboo grain lines.
- Chipped Finger Hole Edges: Impact against hard furniture corners can chip the delicate rim of finger holes, leading to air leaks.
- Dislodged Internal Cork: Impact inertia can shift the internal cork plug away from its calibrated Sa position, throwing the whole scale out of tune.

Prevention Tip: Always play over carpeted areas when practicing, and never leave flutes resting near table edges where they can roll off!`,
    relatedLink: { text: 'Troubleshoot Cork & Tuning Issues', view: 'learn_common_mistakes' },
    tags: ['dropping flute', 'impact damage', 'end split', 'dislodged cork']
  },
  {
    id: 'care-cracks-protect-while-traveling',
    category: 'Flute Care & Maintenance',
    question: 'How do I protect my flute from damage while traveling?',
    answer: `Travel exposes flutes to rough baggage handling, cabin pressure shifts, and extreme climate changes.

Master travel protection tips:
1. Use Rigid Heavy-Duty PVC Carrying Tubes: Store flutes inside thick-walled PVC pipe cases lined with foam or velvet. PVC tubes can withstand heavy pressure and accidental drops without bending.
2. Carry as Cabin Hand Luggage: Never check bamboo flutes into airplane cargo holds where cold temperatures and rough luggage tossing cause cracks!
3. Add Silica Packets for Flight Travel: Airplane cabins have very low humidity (~15% RH). Keep silica packets inside cases to stabilize humidity.
4. Keep Away from Car Trunks: Never store flutes in hot car trunks; keep cases in the climate-controlled passenger cabin.`,
    relatedLink: { text: 'Read Choose Right Flute & Accessories', view: 'learn_choose_flute' },
    tags: ['travel protection', 'pvc tube', 'hand luggage', 'flight travel']
  },
  {
    id: 'care-cracks-what-to-do-if-crack-develops',
    category: 'Flute Care & Maintenance',
    question: 'What immediate steps should I take if my flute develops a crack?',
    answer: `If you notice a crack forming on your bansuri, act immediately using this 4-step emergency protocol to prevent it from lengthening:

Emergency Crack Action Plan:
1. Stop Playing Immediately: Cease blowing air into the flute. Breath pressure and moisture will force the crack to open wider.
2. Apply Temporary Thread Binding: Wrap strong sewing thread or rubber bands tightly around the cracked section to hold bamboo walls compressed together.
3. Seal with Liquid Superglue: Apply 1 drop of liquid superglue along the crack seam and let it cure fully for 15 minutes.
4. Permanent Thread Wrapping (Dhaaga): Wrap high-tensile nylon thread neatly over the repaired area, extend 1 cm past both ends, and seal thread knots with clear glue.`,
    relatedLink: { text: 'View Equipment Care Checklist', view: 'learn_daily_practice' },
    tags: ['emergency action', 'crack repair', 'thread binding', 'superglue']
  },

  // ==========================================
  // 6. TUNING & PERFORMANCE (10 Questions)
  // ==========================================
  {
    id: 'care-tuning-can-poor-maintenance-affect-tuning',
    category: 'Flute Care & Maintenance',
    question: 'Can poor maintenance affect flute tuning?',
    answer: `Yes! Poor maintenance is one of the primary reasons a once perfectly tuned bansuri begins to sound out of tune.

How lack of care disrupts tuning:
- Internal Wall Swelling: Un-swabbed moisture absorbed into raw bamboo narrows the internal bore diameter, making notes sound noticeably flat.
- Shifted Internal Cork Plug: Poking sharp rods or dropping the flute can shift the internal natural cork plug away from its precise factory position (approx. 1x bore diameter from blowhole), destroying pitch alignment across octaves.
- Dirt Build-up in Finger Holes: Grime lining finger hole perimeters effectively shrinks hole size, causing affected notes to play flat.

Regular swabbing, hole cleaning, and careful cork checks ensure your flute remains perfectly in tune.`,
    relatedLink: { text: 'Open Flute Sangam Interactive Tuner', view: 'learn_tuner' },
    tags: ['tuning', 'cork position', 'bore swelling', 'pitch accuracy']
  },
  {
    id: 'care-tuning-why-sounds-different-after-cleaning',
    category: 'Flute Care & Maintenance',
    question: 'Why does my flute sound clearer and different after cleaning?',
    answer: `It is completely normal for your flute to sound noticeably brighter, crisper, and more resonant right after a thorough cleaning!

Reasons for tone improvement after cleaning:
- Unobstructed Acoustic Resonance: Swabbing removes wet film, saliva droplets, and dust layers from the bore, allowing sound waves to bounce cleanly off smooth bamboo walls without acoustic dampening.
- Restored Bore Volume: Drying out excess moisture restores the calibrated internal bore volume, bringing pitches back up to true concert pitch (A=440Hz).
- Crisp Finger Hole Air Vents: Cleaning dust out of finger hole edges restores sharp air venting, making articulation and fast Taans sound crisp and defined.

Enjoy the vibrant, clean projection of your freshly swabbed bansuri!`,
    relatedLink: { text: 'Explore Alankar Generator Exercises', view: 'alankar_generator' },
    tags: ['sound improvement', 'bright tone', 'acoustic resonance', 'clean bore']
  },
  {
    id: 'care-tuning-can-moisture-cause-out-of-tune',
    category: 'Flute Care & Maintenance',
    question: 'Can internal moisture make a flute go out of tune during long practice sessions?',
    answer: `Yes, during extended 1–2 hour practice sessions, heavy moisture buildup inside the bore will cause the flute's tuning to drift flat.

Mechanism of moisture pitch drift:
- Air Column Heavy Load: Water droplets clinging to internal walls increase friction and add weight to the oscillating air column, lowering pitch frequencies.
- Octave Inconsistency: High Taar Saptak notes become disproportionately flat compared to lower notes, making octave leaps sound out of tune.
- Solution: Take a 30-second break every 30 minutes during long sessions to run a cotton swab through the bore. Your flute's pitch will immediately snap back to crisp concert accuracy!`,
    relatedLink: { text: 'View Interactive Flute Tuner', view: 'learn_tuner' },
    tags: ['moisture pitch drift', 'flat notes', 'swabbing break', 'long sessions']
  },
  {
    id: 'care-tuning-does-weather-affect-tuning',
    category: 'Flute Care & Maintenance',
    question: 'Does weather and room temperature affect flute tuning?',
    answer: `Yes! Temperature has a direct physical effect on the speed of sound in air, directly impacting flute pitch calibration.

Temperature & tuning rules:
- Hot Weather / Warm Rooms: Sound travels faster in warm air. In hot temperatures, your bansuri will naturally play SHARPER (higher pitch).
- Cold Weather / AC Rooms: Sound travels slower in cold air. In chilly environments, your bansuri will naturally play FLATTER (lower pitch).
- How to Compensate:
  * In cold rooms: Warm up the flute by blowing gentle breath through the bore for 1 minute before checking pitch with a tuner.
  * Roll embouchure slightly inward to flatter pitch when hot, or outward to sharpen pitch when cold.`,
    relatedLink: { text: 'Open Flute Sangam Online Tuner', view: 'learn_tuner' },
    tags: ['weather impact', 'temperature tuning', 'speed of sound', 'sharp or flat']
  },
  {
    id: 'care-tuning-how-to-maintain-consistent-sound',
    category: 'Flute Care & Maintenance',
    question: 'How can I maintain consistent sound quality from my flute every day?',
    answer: `Achieving reliable, sweet tonal projection every day requires combining physical flute care with consistent warm-up habits.

Daily routine for consistent sound:
1. Warm Up the Flute First: Blow gentle, warm breath through the instrument for 30 seconds before launching into fast scales.
2. Maintain Stable Breath Support: Use deep diaphragm breathing rather than shallow chest breath to maintain steady air velocity.
3. Keep the Bore Dry & Clean: Swab internal condensation at the end of every practice session.
4. Practice in Climate-Stable Rooms: Avoid practicing directly under high-speed fan blades or AC vents where erratic air drafts disrupt embouchure stability.`,
    relatedLink: { text: 'Explore Daily Practice Schedules', view: 'learn_daily_practice' },
    tags: ['consistent sound', 'warm up routine', 'diaphragm breath', 'embouchure']
  },
  {
    id: 'care-tuning-can-dirt-affect-pitch',
    category: 'Flute Care & Maintenance',
    question: 'Can dirt or dust inside the finger holes affect pitch?',
    answer: `Yes! Accumulated dust, lint, skin oils, or dried saliva inside finger holes directly alters the acoustic venting area of the note holes.

How finger hole dirt affects pitch:
- Smaller Hole Area = Flatter Pitch: In flute physics, shrinking a finger hole's effective diameter lowers the pitch of that note. Heavy dirt lining hole edges makes that specific swara sound flat.
- Uneven Scale Intonation: If only the 3rd hole has dirt buildup, 'Ga' will play flat while 'Re' and 'Ma' sound normal, destroying scale harmony.
- Cleaning Solution: Gently clean finger hole perimeters once a month with a dry cotton Q-tip to keep pitches perfectly calibrated.`,
    relatedLink: { text: 'View Interactive Fingering Chart', view: 'learn_fingering_chart' },
    tags: ['dirt impact', 'finger hole cleaning', 'flat pitch', 'q-tip']
  },
  {
    id: 'care-tuning-should-i-warm-up-flute',
    category: 'Flute Care & Maintenance',
    question: 'Should I warm up the flute before playing or tuning?',
    answer: `YES! Warming up your flute before tuning or performing is a professional standard practice used by all master flutists.

Why warming up is vital:
- Reaches Operating Temperature: Human breath warms the internal air column to approximately 30°C–33°C. Warming up brings the air speed and pitch to its true steady-state operating level.
- Accurate Tuner Alignment: If you tune a cold flute, it will sound flat initially. Once warm 5 minutes later, it will drift sharp! Always blow for 2–3 minutes before adjusting tuning or playing with Tanpura.
- Relaxes Embouchure Muscles: Gentle warm-up long notes (Sa, Pa) relax your lip corners and steady your diaphragm support.`,
    relatedLink: { text: 'Read Beginner Warm-Up Exercises', view: 'learn_basics' },
    tags: ['warm up', 'operating temperature', 'accurate tuning', 'tanpura sync']
  },
  {
    id: 'care-tuning-why-flute-sounds-dull',
    category: 'Flute Care & Maintenance',
    question: 'Why does my flute sound dull or airy, and how can I fix it?',
    answer: `A dull, airy, or muffled tone usually stems from three common maintenance or embouchure issues.

Causes & Solutions for Dull Tone:
1. Internal Moisture Saturation: Damp, wet bore walls absorb sound vibration. Solution: Swab the internal bore thoroughly and let it air-dry for 15 minutes.
2. Dirty Blowhole Edge (Embouchure): Dust or lint trapped along the sharp striking edge of the blowhole disrupts clean air splitting. Solution: Gently clean the blowhole edge with a dry cotton swab.
3. Air Leaks from Micro-Cracks or Cork: A loose top cork plug or hairline crack lets air bleed out. Solution: Inspect cork sealing and bind any micro-cracks with thread.
4. Soft Embouchure Hole Alignment: Re-align lip placement over the blowhole to cover approximately 1/3 of the opening with your lower lip.`,
    relatedLink: { text: 'Troubleshoot Flute Sound in Common Mistakes', view: 'learn_common_mistakes' },
    tags: ['dull tone', 'airy sound', 'embouchure clean', 'cork leak']
  },
  {
    id: 'care-tuning-can-regular-maintenance-improve-tone',
    category: 'Flute Care & Maintenance',
    question: 'Can regular maintenance improve my flute tone and resonance?',
    answer: `Yes! Regular maintenance preserves the smooth internal acoustic reflector walls of your bamboo bansuri, allowing maximum sound wave resonance and projection.

Tone improvements from maintenance:
- Crystalline Harmonic Overtones: Clean, smooth internal walls allow upper harmonic frequencies to flourish, producing that signature sweet, meditative bansuri tone.
- Effortless Meend & Gamak: A well-conditioned, lightly oiled bore allows smooth pitch slides (Meend) and expressive oscillations without stuttering.
- Powerful Projection: Eliminating air leaks and wall friction maximizes acoustic efficiency, allowing your flute to sound louder with less blowing effort.`,
    relatedLink: { text: 'Explore Classical Raaga Guides', view: 'learn_raagas' },
    tags: ['tone improvement', 'harmonic overtones', 'meend', 'projection']
  },
  {
    id: 'care-tuning-how-often-check-condition',
    category: 'Flute Care & Maintenance',
    question: 'How often should I inspect my flute condition?',
    answer: `Performing quick visual and acoustic checks keeps your bansuri collection in top condition.

Recommended inspection schedule:
- Daily (30 Seconds): Check for moisture after playing, swab bore, wipe body, and check thread wrappings.
- Monthly (5 Minutes): Check internal cork position near blowhole, inspect finger holes for dirt, and inspect the body under bright light for hairline cracks.
- Seasonally (Spring & Autumn): Perform light internal oiling with 3 drops of unrefined mustard oil, inspect silica gel packets in storage cases, and verify pitch accuracy against FluteSangam Tuner.`,
    relatedLink: { text: 'Open Free Interactive Flute Tuner', view: 'learn_tuner' },
    tags: ['inspection schedule', 'daily check', 'monthly check', 'seasonal oiling']
  },

  // ==========================================
  // 7. TRANSPORTATION (10 Questions)
  // ==========================================
  {
    id: 'care-transport-safest-way-to-carry',
    category: 'Flute Care & Maintenance',
    question: 'What is the safest way to carry a bamboo flute?',
    answer: `The safest way to carry a bamboo bansuri is inside a rigid PVC hard case lined with soft velvet or dense foam padding.

Why PVC hard cases offer ultimate protection:
- Crush-Proof Rigidity: PVC pipes withstand heavy weight, luggage pressure, and accidental drops without bending or crushing flutes inside.
- Weather Resistance: Sealed PVC tubes block external rain, sudden drafts, and humidity shifts during transit.
- Multi-Flute Organization: Individual foam-padded compartments keep flutes separated so they don't knock against each other.

For daily local travel, a heavy-duty padded canvas roll bag with shoulder straps offers great convenience and mobility.`,
    relatedLink: { text: 'Read Choose Right Flute & Accessories', view: 'learn_choose_flute' },
    tags: ['carry flute', 'pvc hard case', 'padded bag', 'crush proof']
  },
  {
    id: 'care-transport-can-i-travel-by-air',
    category: 'Flute Care & Maintenance',
    question: 'Can I travel with a bamboo flute by air on airplanes?',
    answer: `Yes, you can travel with bamboo flutes on airplanes, but you MUST follow essential airline safety rules!

Air travel guidelines for flute players:
1. Always Carry as Hand Luggage (Cabin Bag): NEVER check bamboo flutes into checked baggage cargo holds! Unheated cargo holds experience freezing temperatures and rough luggage tossing that shatters bamboo.
2. Use Compact Multi-Flute Bags: Compact PVC tubes or padded canvas flute rolls easily fit into overhead plane bins or under the seat in front of you.
3. Inform Security Gently: Security screeners may inspect cylindrical tubes. Politely inform them that they are fragile wooden musical instruments.
4. Monitor Cabin Air Dryness: Airplane cabins have very low humidity (~15% RH). Keep flutes zipped inside padded bags with a silica gel packet during flight.`,
    relatedLink: { text: 'Read Equipment & Accessories Guide', view: 'learn_basics' },
    tags: ['air travel', 'flight cabin', 'hand luggage', 'cargo warning']
  },
  {
    id: 'care-transport-hard-case-vs-soft-case',
    category: 'Flute Care & Maintenance',
    question: 'Should I use a hard case or a soft case for my flute?',
    answer: `Both hard cases and soft cases serve distinct purposes depending on your travel environment.

Comparison:
- Rigid PVC Hard Cases:
  * Best For: Long-distance travel, air flights, public transport, and heavy luggage storage.
  * Pros: 100% crush-proof, rain-resistant, ultimate impact protection.
  * Cons: Slightly heavier to carry.
- Padded Soft Canvas Bags:
  * Best For: Daily home practice, local music classes, and quick rehearsals.
  * Pros: Lightweight, easy shoulder strap carrying, flexible pockets.
  * Cons: Does not protect against heavy crush loads if stepped on.

Recommendation: Own both! Use a padded soft bag for daily classes and a rigid PVC tube for long travel.`,
    relatedLink: { text: 'Explore Flute Selection Guide', view: 'learn_choose_flute' },
    tags: ['hard case vs soft case', 'pvc tube', 'padded bag', 'travel']
  },
  {
    id: 'care-transport-protect-during-long-journeys',
    category: 'Flute Care & Maintenance',
    question: 'How do I protect my flute during long road or train journeys?',
    answer: `Long train or road trips expose instruments to constant vibrations, luggage shifting, and changing weather conditions.

Road & train protection tips:
- Store Bags Horizontally on Elevated Shelves: Keep flute bags on upper luggage racks away from heavy suitcases that could slide or crush them.
- Avoid Vehicle Window Glass: Keep flute cases away from sunny car or train windows where direct solar radiation bakes cases.
- Thermal Buffering: Keep flutes inside padded bags rather than taking them out in air-conditioned or dusty train compartments.
- Cushion against Vibrations: Place a soft jacket or foam pad under your flute tube to absorb road bumps on long bus or car drives.`,
    relatedLink: { text: 'Read Basics & Equipment Safety', view: 'learn_basics' },
    tags: ['road travel', 'train journey', 'vibration dampening', 'luggage safety']
  },
  {
    id: 'care-transport-can-baggage-handling-damage',
    category: 'Flute Care & Maintenance',
    question: 'Can airport baggage handling damage a bamboo flute?',
    answer: `YES! Automated airport baggage conveyor belts and luggage handlers toss checked bags forcefully. Heavy suit cases stacking on top of a soft bag will crush bamboo flutes instantly.

How to avoid baggage damage:
- Never Check Flutes in Cargo Hold: Carry your bansuri bag into the plane cabin as personal hand luggage.
- If Cargo Checking is Mandatory: If an airline forces you to check a large multi-flute case, it MUST be an ultra-thick, lockable flight case built with industrial PVC or aluminum casing lined with dense egg-crate foam.
- Tag as Fragile: Place bright "FRAGILE - MUSICAL INSTRUMENT" stickers on all sides of the case.`,
    relatedLink: { text: 'Read Common Mistakes Guide', view: 'learn_common_mistakes' },
    tags: ['baggage handling', 'cargo danger', 'hand luggage', 'flight case']
  },
  {
    id: 'care-transport-carry-in-hand-luggage',
    category: 'Flute Care & Maintenance',
    question: 'Should I carry my flute in cabin hand luggage when flying?',
    answer: `Yes, carrying your bamboo flutes in your cabin hand luggage is the universally accepted best practice for all touring musicians.

Why cabin hand luggage is required:
- Temperature Control: Airplane passenger cabins are temperature-controlled (~20°C–22°C), shielding bamboo from freezing cargo temperatures.
- Personal Physical Control: You maintain direct control over your instruments, preventing accidental drops or heavy luggage stacking.
- Standard Airline Policy: Most international and domestic airlines permit small musical instrument cases in cabin overhead bins or under seats as personal items.`,
    relatedLink: { text: 'View Equipment Recommendations', view: 'learn_basics' },
    tags: ['cabin luggage', 'hand baggage', 'airplane safety', 'touring musicians']
  },
  {
    id: 'care-transport-protect-from-temp-changes-traveling',
    category: 'Flute Care & Maintenance',
    question: 'How do I protect a flute from sudden temperature changes while traveling?',
    answer: `Traveling between hot outdoors and cool air-conditioned airports, cars, or hotels creates severe thermal shock risks for bamboo.

How to cushion thermal shocks:
- Thermal Insulated Cases: Use padded carrying bags with thermal lining (like high-density foam or velvet lining) that slow down heat transfer.
- Acclimate Before Opening: When arriving from a cold outdoor environment into a warm room (or vice versa), keep the flute zipped inside its case for 15 minutes before taking it out.
- Never Leave Exposed near Air Vents: Keep cases away from vehicle AC vents or open car windows during transit.`,
    relatedLink: { text: 'Read Choose Right Flute Guide', view: 'learn_choose_flute' },
    tags: ['thermal shock', 'traveling', 'acclimate', 'insulated bag']
  },
  {
    id: 'care-transport-can-i-leave-in-parked-car',
    category: 'Flute Care & Maintenance',
    question: 'Can I leave my bamboo flute inside a parked car?',
    answer: `NEVER leave a bamboo flute inside a parked car! Parked vehicles act as solar ovens; interior temperatures can reach over 60°C (140°F) within 20 minutes on a warm day.

Consequences of leaving flutes in parked cars:
- Instant Longitudinal Splitting: Extreme heat bakes bamboo, causing rapid water loss that snaps the tube along its grain.
- Cork Plug Ruin: High temperatures shrink internal cork plugs and melt natural binding glues.
- Theft Risk: Visible instrument bags inside parked cars attract vehicle break-ins.

Rule of Thumb: If it is too hot or cold for a child or pet to sit in the car, it is too dangerous for your bamboo flute! Take your flute case with you.`,
    relatedLink: { text: 'Read Full Common Care Mistakes', view: 'learn_common_mistakes' },
    tags: ['parked car warning', 'solar heat', 'bamboo baking', 'theft prevention']
  },
  {
    id: 'care-transport-how-to-transport-multiple-flutes',
    category: 'Flute Care & Maintenance',
    question: 'How do I transport multiple flutes safely to concerts or classes?',
    answer: `Transporting a full set of concert flutes (e.g., E Bass, C Medium, G Base, A Medium) requires structured multi-flute protection.

Best setup for transporting multiple flutes:
- Multi-Tube Velvet Roll Bag: Store each flute in its own separate padded velvet sleeve so bamboo surfaces never rub or scratch against each other.
- Rigid PVC Outer Shell: Place the velvet roll bag inside a sturdy 4-inch or 5-inch diameter PVC carrying tube with end caps and a shoulder strap.
- Organize by Key Scale: Label each sleeve with key markings (e.g., C, D, E, G) so you can pull the required scale instantly during performance without searching.`,
    relatedLink: { text: 'Explore Flute Scale Selection Chart', view: 'learn_choose_flute' },
    tags: ['transport multiple flutes', 'velvet roll bag', 'pvc shell', 'concert setup']
  },
  {
    id: 'care-transport-useful-travel-accessories',
    category: 'Flute Care & Maintenance',
    question: 'What travel accessories are useful for flute players on the go?',
    answer: `Having a well-equipped travel care kit ensures smooth practice and performance wherever your music takes you.

Must-have travel accessories for flutists:
1. Portable Cleaning Rod & Cotton Cloth: Lightweight wooden rod with a swab cloth for post-practice drying on the go.
2. Silica Gel Sachets: 2–3 moisture-absorbing packets inside your case to handle humid hotel rooms or monsoons.
3. Compact Digital Tuner & Metronome App: Smartphone app (or clip-on tuner) like FluteSangam Tuner for quick tuning before rehearsals.
4. Emergency Thread & Superglue Kit: Small spool of nylon thread and liquid glue for quick on-the-road hairline crack fixes.
5. Microfiber Exterior Wipe Cloth: To keep your flutes shining and fingerprint-free before going on stage.`,
    relatedLink: { text: 'Explore Flute Sangam Learning Tools', view: 'learn_dashboard' },
    tags: ['travel kit', 'accessories', 'swab rod', 'silica gel', 'tuner app']
  },

  // ==========================================
  // 8. LONG-TERM MAINTENANCE (10 Questions)
  // ==========================================
  {
    id: 'care-longterm-how-long-does-flute-last',
    category: 'Flute Care & Maintenance',
    question: 'How long does a bamboo flute usually last?',
    answer: `A high-quality Assam bamboo bansuri crafted from well-seasoned wood can last 30 to 50 years or even longer when cared for properly. Many classical Indian maestros perform on prized bansuris that are 40+ years old!

Factors affecting flute lifespan:
- Bamboo Seasoning Quality: Master flute makers season raw Assam bamboo for 2 to 3 years before crafting. Seasoned bamboo is far more durable than young green wood.
- Daily Care Consistency: Swabbing moisture after every session and keeping thread bindings intact extends lifespan dramatically.
- Regular Oiling: Periodic oiling prevents wood from becoming brittle over decades.

With simple daily mindfulness, your bamboo flute becomes a lifelong musical heirloom that matures in tone over time.`,
    relatedLink: { text: 'Read Choose Right Flute Guide', view: 'learn_choose_flute' },
    tags: ['flute lifespan', 'seasoned bamboo', 'longevity', 'heirloom']
  },
  {
    id: 'care-longterm-increase-lifespan',
    category: 'Flute Care & Maintenance',
    question: 'How can I increase the lifespan of my bamboo flute?',
    answer: `Maximizing your flute's lifespan involves combining good daily habits with long-term bamboo conditioning.

5 Rules for Maximum Lifespan:
1. Swab Moisture Religiously: Never let breath condensation sit inside the bore after playing.
2. Oil the Internal Bore Twice a Year: Apply 3–4 drops of unrefined mustard oil or sweet almond oil inside the bore to nourish bamboo fibers and seal micro-pores.
3. Protect Thread Wrappings: Inspect thread bindings regularly. If thread loosens, re-wrap it immediately to maintain protective hoop tension.
4. Avoid Climate Shocks: Keep flutes in climate-controlled rooms with 45%–60% RH, away from direct sunlight, AC blowers, and hot vehicles.
5. Use Padded Rigid Cases: Always store and travel with your flutes in rigid PVC hard cases or padded bags.`,
    relatedLink: { text: 'Explore Daily Practice Schedules', view: 'learn_daily_practice' },
    tags: ['increase lifespan', 'oiling', 'thread care', 'climate control']
  },
  {
    id: 'care-longterm-should-i-oil-my-flute',
    category: 'Flute Care & Maintenance',
    question: 'Should I oil my bamboo flute, and how is it done?',
    answer: `Yes, internal oiling every 3 to 6 months is an essential long-term maintenance practice for natural bamboo flutes.

Benefits & How to Oil Your Flute:
- Why Oil?: Oil seeps into internal bamboo pores, replacing lost moisture, preventing fiber brittleness, and creating a natural water-repellent barrier.
- How to Oil Step-by-Step:
  1. Ensure the flute is completely clean and dry.
  2. Apply 3 to 4 drops of unrefined natural oil (like mustard oil, sesame oil, or sweet almond oil) onto a clean cotton swab attached to a wooden rod.
  3. Pass the oiled swab gently through the inside bore, coating internal walls evenly.
  4. CAUTION: Do NOT oil near the blowing hole edge or directly on external thread wrappings!
  5. Stand the flute vertically on paper towels for 2 hours to let excess oil drain out.`,
    relatedLink: { text: 'Read Full Maintenance Guide', view: 'learn_choose_flute' },
    tags: ['oiling flute', 'bamboo oiling', 'mustard oil', 'sweet almond oil']
  },
  {
    id: 'care-longterm-which-oils-are-safe',
    category: 'Flute Care & Maintenance',
    question: 'Which oils are safe for bamboo flutes, and which should I avoid?',
    answer: `Selecting the right oil is crucial because non-drying or sticky oils can turn rancid and ruin your instrument.

Safe & Recommended Oils:
- Unrefined Mustard Oil (Sarson ka Tel): Traditional choice used by Indian bansuri makers for centuries. Excellent natural preservative with natural antifungal properties.
- Sweet Almond Oil: Light, sweet-smelling, and non-sticky. Perfect for internal bore conditioning.
- Sesame Oil (Til ka Tel): Traditional natural oil that nourishes wood fibers effectively.
- Pure Bore Oil / Walnut Oil: Refined natural wood oils suitable for wooden/bamboo wind instruments.

Oils to AVOID:
- NEVER use Mineral Oil, Engine Oil, or Synthetic Lubricants (toxic and ruin wood).
- AVOID heavy sticky vegetable cooking oils like palm oil or unrefined coconut oil in cold climates (can solidify into sticky white residue inside the bore).`,
    relatedLink: { text: 'Read Common Care Mistakes Guide', view: 'learn_common_mistakes' },
    tags: ['safe oils', 'mustard oil', 'sweet almond oil', 'oils to avoid']
  },
  {
    id: 'care-longterm-how-often-inspect-damage',
    category: 'Flute Care & Maintenance',
    question: 'How often should I inspect my flute for hidden damage?',
    answer: `Routine inspections help you catch micro-fissures, cork leaks, and thread loosening before they become major problems.

Inspection Checklist:
- Weekly: Inspect thread bindings (Dhaaga) at both ends and middle points. Look for loose ends or fraying thread.
- Monthly: Hold the flute up to a bright light and inspect the internal bore. Look for dust, mold spots, or fine hairline cracks along the bamboo grain.
- Seasonally: Check tuning alignment against the FluteSangam Tuner app to ensure the internal cork plug hasn't shifted.

Early detection allows simple 5-minute thread fixes that save your bansuri from major damage!`,
    relatedLink: { text: 'Open Flute Sangam Interactive Tuner', view: 'learn_tuner' },
    tags: ['inspection checklist', 'weekly check', 'cork inspection', 'early detection']
  },
  {
    id: 'care-longterm-when-to-replace',
    category: 'Flute Care & Maintenance',
    question: 'When should I replace my flute with a new one?',
    answer: `While a well-maintained flute lasts decades, certain milestone situations indicate it is time to upgrade or replace your instrument.

When to replace or upgrade:
1. Advancing Skill Level: Replacing an unbranded beginner flute with a professional-grade concert bansuri (crafted from aged Assam bamboo with precise tuning) as your playing matures.
2. Irreparable Structural Splits: Major longitudinal cracks through the blowing hole or crushed bore geometry that cannot be sealed.
3. Desiring Different Key Scales: Expanding your collection to include different pitch keys (e.g., adding E Bass, G Base, or C Medium for specific raagas).
4. Permanent Tuning Degradation: Severe internal wall warping that prevents standard concert pitch alignment (A=440Hz).`,
    relatedLink: { text: 'Explore Master Flute Selection Guide', view: 'learn_choose_flute' },
    tags: ['replace flute', 'upgrade bansuri', 'concert grade', 'scale collection']
  },
  {
    id: 'care-longterm-can-old-flute-be-restored',
    category: 'Flute Care & Maintenance',
    question: 'Can an old or neglected bamboo flute be restored?',
    answer: `Yes! Many vintage or long-neglected bamboo flutes can be restored to beautiful playing condition with patient care.

Restoration Steps for Old Flutes:
1. Deep Swabbing & Mold Removal: Clean internal bore dust and mold with a dry swab followed by a cotton swab lightly dampened with 1 drop of neem oil.
2. Re-Bind Loose Threads: Strip old unraveling thread wrappings and tightly re-wrap fresh high-tensile nylon thread along the body.
3. Re-Calibrate Internal Cork Plug: Check cork position using a tuning dowel; adjust cork distance to align Sa pitch precisely with concert tuning.
4. Internal Oiling Treatment: Apply 3–4 drops of sweet almond or mustard oil inside the bore and let it absorb for 24 hours to restore wood elasticity.`,
    relatedLink: { text: 'Troubleshoot Cork & Tuning Issues', view: 'learn_common_mistakes' },
    tags: ['restore old flute', 'vintage bansuri', 're-binding', 'cork adjustment']
  },
  {
    id: 'care-longterm-signs-needs-professional-repair',
    category: 'Flute Care & Maintenance',
    question: 'What signs indicate that my flute needs professional repair or maker tuning?',
    answer: `While basic thread wrapping and swabbing are easily done at home, certain technical repairs require the expertise of a professional flute maker (Bansuri Maker).

Seek professional repair if:
- Loose or Missing Internal Cork: The internal natural cork plug has fallen out or disintegrated, and you don't know the exact millimeter distance for Sa calibration.
- Re-Tuning & Hole Scaling Required: Notes play consistently sharp or flat across octaves and require precision hole carving or internal wax tuning.
- Major Structural Crack Sealing: Deep longitudinal splits requiring professional resin binding and high-tension thread wrapping.
- Custom Thread Binding Art: Re-doing decorative silk thread wrappings across the entire instrument body.`,
    relatedLink: { text: 'Read Choose Right Flute Guide', view: 'learn_choose_flute' },
    tags: ['professional repair', 'flute maker', 'cork calibration', 're-tuning']
  },
  {
    id: 'care-longterm-biggest-maintenance-mistakes',
    category: 'Flute Care & Maintenance',
    question: 'What are the biggest long-term maintenance mistakes flute players make?',
    answer: `Avoid these three fatal long-term maintenance mistakes that ruin prized bamboo flutes:

1. Never Oiling the Flute: Leaving bamboo dry for years causes fibers to become extremely brittle, leading to sudden unprovoked cracks during dry seasons.
2. Neglecting Broken Thread Wrappings: Ignoring a loose thread wrapping allows normal playing vibration to turn a tiny micro-fissure into a full longitudinal split.
3. Storing Damp Flutes in Plastic Bags: Storing wet flutes in airtight plastic bags creates a humid mold trap that rots raw bamboo interior walls over months.

By swabbing daily, oiling twice a year, and keeping thread bindings tight, your bansuri will stay resonant and crack-free forever!`,
    relatedLink: { text: 'Read Common Playing & Care Mistakes', view: 'learn_common_mistakes' },
    tags: ['maintenance mistakes', 'dry bamboo', 'loose thread', 'mold trap']
  },
  {
    id: 'care-longterm-where-to-learn-more-flutesangam',
    category: 'Flute Care & Maintenance',
    question: 'Where can I learn more about flute care, tuning, and playing on FluteSangam?',
    answer: `FluteSangam offers a complete ecosystem of free interactive tools, video guides, and comprehensive articles to support every step of your flute journey!

Explore these dedicated resources on FluteSangam:
- Free Interactive Flute Tuner: Check your bansuri's pitch accuracy, calibrate Sa, and practice steady note holding with real-time frequency feedback.
- Interactive Fingering Chart: View accurate finger placement for all 12 Shuddha and Komal swaras across three octaves.
- Alankar Generator & Practice Modules: Master speed, finger dexterity, and rhythm cycles (Taal) with custom metronome-guided exercises.
- Comprehensive Raaga Library: Study detailed Raaga frameworks, Pakads, Bandish notations, and classical compositions.
- FluteSangam Community Hub: Connect with fellow flute enthusiasts, ask maintenance questions, share recordings, and learn together!`,
    relatedLink: { text: 'Explore FluteSangam Learning Dashboard', view: 'learn_dashboard' },
    tags: ['flutesangam resources', 'flute tuner', 'fingering chart', 'raaga library', 'community']
  }
];
