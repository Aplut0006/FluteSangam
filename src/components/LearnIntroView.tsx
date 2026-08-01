import React from 'react';
import { Wind, Feather, Music, Heart, BookOpen, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import AboutAuthorSection from './AboutAuthorSection';
import { AppView } from '../types';

interface LearnIntroViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function LearnIntroView({ onViewChange }: LearnIntroViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500" itemScope itemType="https://schema.org/LearningResource">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-xs border border-bamboo-100 overflow-hidden relative">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-bamboo-100 to-amber-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                <Wind className="w-5 h-5 sm:w-7 sm:h-7 text-bamboo-700" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight" itemProp="headline">
                Introduction to Flute/Bansuri
              </h1>
            </div>

            {/* Explicit Freshness Signals & Timestamps */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-gray-600 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-500">Published:</span>
                <time itemProp="datePublished" dateTime="2026-07-26T00:00:00Z" className="font-semibold text-gray-900">
                  Jul 26, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-500">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-07-27T10:00:00Z" className="font-semibold text-gray-900">
                  Jul 27, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">
                <CheckCircle2 className="w-3 h-3 text-amber-700" /> Verified
              </span>
            </div>
          </div>

          <div className="prose prose-bamboo prose-lg max-w-none text-gray-700 space-y-6 sm:space-y-10">
            
            {/* Intro section */}
            <section>
              <p className="text-base sm:text-xl leading-relaxed text-gray-600 font-medium border-l-4 border-amber-400 pl-4 sm:pl-6 py-1.5 sm:py-2 italic">
                The Bansuri (Indian classical flute) is one of the world's oldest and most elegant musical instruments. Derived from the words bans (bamboo) and sur (musical note), it is a deceptively simple instrument—just a single piece of hollow bamboo with six or seven finger holes. Yet, in the hands of a master, it is capable of mimicking the microtones (shrutis) and emotional depth of the human voice.
              </p>
            </section>

            <picture className="block w-full">
              <source
                type="image/webp"
                srcSet="/images/radha_krishna-400w.webp 400w, /images/radha_krishna-800w.webp 800w, /images/radha_krishna-1200w.webp 1200w"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <source
                type="image/jpeg"
                srcSet="/images/radha_krishna-400w.jpg 400w, /images/radha_krishna-800w.jpg 800w, /images/radha_krishna-1200w.jpg 1200w"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <img 
                src="/images/radha_krishna-800w.jpg" 
                alt="Radha and Krishna" 
                width="800"
                height="450"
                className="w-full h-64 md:h-80 object-cover object-top rounded-2xl shadow-md"
                loading="lazy"
                decoding="async"
              />
            </picture>

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
                    <li><strong className="text-bamboo-800">Ancient Texts:</strong> The flute is explicitly mentioned in the Vedas (texts dating back over 3,000 years) under names like Nadi or Tunava. It is also heavily detailed in Bharata Muni’s Natya Shastra (around 200 BCE–200 CE), the foundational treatise on Indian performing arts.</li>
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
                    <p className="text-gray-600 mt-1">The key transition was led by pioneers like Sarabha Sastri and later T.R. Mahalingam (Flute Mali), who popularized the smaller, 8-holed South Indian cross-flute (often called the Pullanguzhal or Carnatic flute).</p>
                  </div>
                </div>
              </div>
            </section>

            <picture className="block w-full">
              <source
                type="image/webp"
                srcSet="/images/bansuri_scales-400w.webp 400w, /images/bansuri_scales-800w.webp 800w, /images/bansuri_scales-1200w.webp 1200w"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <source
                type="image/jpeg"
                srcSet="/images/bansuri_scales-400w.jpg 400w, /images/bansuri_scales-800w.jpg 800w, /images/bansuri_scales-1200w.jpg 1200w"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <img 
                src="/images/bansuri_scales-800w.jpg" 
                alt="Set of Bamboo Bansuri Flutes" 
                width="800"
                height="600"
                className="w-full h-48 md:h-64 object-cover object-center rounded-2xl shadow-md"
                loading="lazy"
                decoding="async"
              />
            </picture>

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
                      <th className="p-4 font-bold text-bamboo-900 border-b border-bamboo-200 rounded-tr-xl">Carnatic Flute (South India)</th>
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

            {/* Author Section */}
            <AboutAuthorSection onViewChange={onViewChange} />
            
          </div>
        </div>
      </div>
    </div>
  );
}
