import React from 'react';
import { Wind, Feather, Music, Heart, BookOpen } from 'lucide-react';

export default function LearnIntroView() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-bamboo-100 to-amber-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Wind className="w-7 h-7 text-bamboo-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight">
              Introduction to Flute/Bansuri
            </h1>
          </div>

          <div className="prose prose-bamboo prose-lg max-w-none text-gray-700 space-y-10">
            
            {/* Intro section */}
            <section>
              <p className="text-xl leading-relaxed text-gray-600 font-medium border-l-4 border-amber-400 pl-6 py-2 italic">
                The Bansuri (Indian classical flute) is one of the world's oldest and most elegant musical instruments. Derived from the words bans (bamboo) and sur (musical note), it is a deceptively simple instrument—just a single piece of hollow bamboo with six or seven finger holes. Yet, in the hands of a master, it is capable of mimicking the microtones (shrutis) and emotional depth of the human voice.
              </p>
            </section>

            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Radha_Krishna_20.jpg" 
              alt="Radha and Krishna" 
              className="w-full h-64 md:h-80 object-cover object-top rounded-2xl shadow-md"
              referrerPolicy="no-referrer"
            />

            {/* Origins */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-bamboo-100 pb-2">
                <BookOpen className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-bamboo-900 m-0">Origins: How and When it Was Found</h2>
              </div>
              <p>The Bansuri's origins are deeply rooted in ancient history, mythology, and nature itself.</p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50">
                  <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <Feather className="w-5 h-5 text-amber-600" />
                    The Natural Discovery
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Long before humans crafted instruments, the concept of the flute existed in nature. Wind passing through hollow bamboo reeds damaged by insects or birds created natural whistling sounds. Ancient pastoral communities (shepherds and herders) noticed this and began cutting bamboo to recreate these relaxing melodies.
                  </p>
                </div>
                
                <div className="bg-bamboo-50/50 p-6 rounded-2xl border border-bamboo-100/50">
                  <h3 className="text-lg font-bold text-bamboo-900 mb-3">Vedic and Mythological Roots</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    The instrument carries immense spiritual and cultural weight in India:
                  </p>
                  <ul className="text-sm text-gray-600 mt-3 space-y-2 pl-4 list-disc marker:text-bamboo-400">
                    <li><strong className="text-bamboo-800">The Divine Connection:</strong> In Hindu mythology, the bansuri is the divine instrument of Lord Krishna. His flute playing was said to be so mesmerizing that it enchanted animals, calmed flowing rivers, and captivated the gopis (cowherd maidens) of Vrindavan.</li>
                    <li><strong className="text-bamboo-800">Ancient Texts:</strong> The flute is explicitly mentioned in the Vedas (texts dating back over 3,000 years) under names like Venu, Nadi, or Tunava. It is also heavily detailed in Bharata Muni’s Natya Shastra (around 200 BCE–200 CE), the foundational treatise on Indian performing arts.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Classical Legacy */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-bamboo-100 pb-2">
                <Music className="w-6 h-6 text-bamboo-600" />
                <h2 className="text-2xl font-bold text-bamboo-900 m-0">Who Started the Classical Legacy?</h2>
              </div>
              <p>
                For centuries, the bansuri was primarily viewed as a folk instrument, used by shepherds or accompanying light dance and devotional music. It was considered too simple to handle the rigorous demands of Hindustani (North Indian) Classical Music, which requires complex glides (meend) and a deep bass range.
              </p>
              <p className="font-medium text-bamboo-800">
                That narrative changed completely in the 20th century due to a few legendary pioneers:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-amber-500 shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Pandit Pannalal Ghosh (The Father of Classical Bansuri)</h4>
                    <p className="text-gray-600 mt-1">In the 1930s and 40s, Pannalal Ghosh revolutionized the instrument. He experimented with bamboo sizes and introduced a massive, 32-inch bass flute. He also added a seventh finger hole to extend the instrument's range, allowing artists to play the lower notes required for classical Ragas. He proved to the world that the folk flute could hold its own alongside heavy classical instruments like the Sitar or Sarod.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-amber-500 shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Pandit Hariprasad Chaurasia</h4>
                    <p className="text-gray-600 mt-1">If Pannalal Ghosh brought the bansuri to the classical stage, Pt. Hariprasad Chaurasia took it to the global arena. His breathtaking breath control, technical mastery, and soulful improvisations popularized the instrument worldwide, establishing a massive global legacy.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-amber-500 shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">In South India (Carnatic Music)</h4>
                    <p className="text-gray-600 mt-1">The key transition was led by pioneers like Sarabha Sastri and later T.R. Mahalingam (Flute Mali), who popularized the smaller, 8-holed South Indian cross-flute (often called the Venu or Pullanguzhal).</p>
                  </div>
                </div>
              </div>
            </section>

            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/ad/All_scales_of_Bansuris_in_a_set.jpg" 
              alt="Set of Bamboo Bansuri Flutes" 
              className="w-full h-48 md:h-64 object-cover object-center rounded-2xl shadow-md"
              referrerPolicy="no-referrer"
            />

            {/* Structure */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-bamboo-900 border-b border-bamboo-100 pb-2">The Flute in Indian Classical Music Structure</h2>
              <p>
                The Indian classical flute differs drastically from the Western metal concert flute. It has no mechanical keys or pads; everything is controlled by direct contact between human flesh and organic bamboo.
              </p>
              
              <h3 className="text-xl font-bold text-bamboo-800 mt-6">Two Distinct Traditions</h3>
              <p>India features two major classical structures, and the flute adapts beautifully to both:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-bamboo-100/50">
                      <th className="p-4 font-bold text-bamboo-900 border-b border-bamboo-200 rounded-tl-xl">Feature</th>
                      <th className="p-4 font-bold text-bamboo-900 border-b border-bamboo-200">Hindustani Bansuri (North India)</th>
                      <th className="p-4 font-bold text-bamboo-900 border-b border-bamboo-200 rounded-tr-xl">Carnatic Venu (South India)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="hover:bg-bamboo-50/30 transition">
                      <td className="p-4 border-b border-bamboo-100 font-medium text-gray-900">Physical Build</td>
                      <td className="p-4 border-b border-bamboo-100 text-gray-600">Longer (usually 20 to 32 inches), wider bore.</td>
                      <td className="p-4 border-b border-bamboo-100 text-gray-600">Shorter (usually 12 to 15 inches), thinner bore.</td>
                    </tr>
                    <tr className="hover:bg-bamboo-50/30 transition bg-gray-50/50">
                      <td className="p-4 border-b border-bamboo-100 font-medium text-gray-900">Finger Holes</td>
                      <td className="p-4 border-b border-bamboo-100 text-gray-600">Traditionally 6 holes (or 7, introduced by Pt. Pannalal Ghosh).</td>
                      <td className="p-4 border-b border-bamboo-100 text-gray-600">Traditionally 8 holes.</td>
                    </tr>
                    <tr className="hover:bg-bamboo-50/30 transition">
                      <td className="p-4 font-medium text-gray-900">Playing Style</td>
                      <td className="p-4 text-gray-600">Emphasizes long, deep, sweeping notes and slow Raga development (Alaap).</td>
                      <td className="p-4 text-gray-600">Emphasizes fast, intricate rhythmic patterns and continuous ornamentation (Gamaka).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Benefits */}
            <section className="space-y-8 bg-amber-50/30 -mx-6 md:-mx-10 px-6 md:px-10 py-10 border-y border-amber-100/50">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-bamboo-900 m-0">Why Play the Flute? (Benefits & Uses)</h2>
              </div>
              <p className="text-gray-600">
                Playing the bansuri is widely regarded as a form of active meditation rather than just a hobby.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">1. The Ultimate Breath & Lung Exercise</h3>
                  <p className="text-sm text-gray-600">Because the bansuri requires a sustained, controlled stream of air to maintain pitch, playing it acts as a deep yogic breathing practice (Pranayama). It strengthens the diaphragm, increases lung capacity, and improves overall cardiovascular endurance.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">2. Mental Calming & Stress Relief</h3>
                  <p className="text-sm text-gray-600">The organic sound frequency of bamboo has an inherently soothing effect on the human nervous system. Focusing entirely on breath and finger placement forces mindfulness, making it an excellent tool for relieving anxiety and everyday stress.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">3. Deep Emotional Expression</h3>
                  <p className="text-sm text-gray-600">Unlike keyed instruments where pressing a button yields a perfect note, the bansuri relies on partial hole covering (fingers covering 1/4th, 1/2, or 3/4ths of a hole). This allows the player to seamlessly glide between notes, capturing microtonal inflections that evoke profound human emotions—from deep sorrow to joyous romance.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">4. Portability and Simplicity</h3>
                  <p className="text-sm text-gray-600">It requires no electricity, tuning keys, or heavy cases. You can carry a master-grade instrument anywhere in a simple PVC pipe, connecting with music instantly wherever you go.</p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="text-center py-6">
              <div className="inline-block bg-bamboo-800 text-white p-8 rounded-3xl shadow-lg transform -rotate-1 relative">
                <Wind className="w-12 h-12 text-bamboo-300 absolute -top-4 -left-4 opacity-50" />
                <h3 className="text-xl font-bold mb-3 font-display text-amber-300">The Spirit of the Bansuri</h3>
                <p className="text-bamboo-50 italic font-medium max-w-2xl mx-auto">
                  "In classical thought, the bansuri represents the human body. Just as the hollow bamboo must be completely empty inside for the wind to create beautiful music, a musician must empty themselves of ego to let the true beauty of the music flow through them."
                </p>
                <Feather className="w-8 h-8 text-bamboo-300 absolute -bottom-3 -right-3 opacity-50" />
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}
