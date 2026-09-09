import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Wind, Music, Feather, ShoppingBag, Radio, CircleDot, Target, AlertTriangle, HelpCircle, Layers, Compass, FileText } from 'lucide-react';
import { AppView } from '../types';
import AdsterraNativeBanner from './AdsterraNativeBanner';
import AdsterraDisplayBanner from './AdsterraDisplayBanner';

interface LearnDashboardProps {
  onViewChange?: (view: AppView) => void;
}

export default function LearnDashboard({ onViewChange }: LearnDashboardProps) {
  const options = [
    { id: 'learn_intro', path: '/learn/intro', label: 'Introduction', icon: Wind, color: 'text-bamboo-600', desc: 'Origins, legacy & bansuri fundamentals' },
    { id: 'learn_choose_flute', path: '/learn/choose-flute', label: 'Choose the Right Flute', icon: ShoppingBag, color: 'text-emerald-600', desc: 'Scale guide for children, teens & adults' },
    { id: 'learn_basics', path: '/learn/basics', label: 'The Basics', icon: BookOpen, color: 'text-bamboo-700', desc: 'Embouchure, posture & finger grip' },
    { id: 'how_to_read_bansuri_notation', path: '/learn/how-to-read-bansuri-notation', label: 'Read Flute Notation', icon: FileText, color: 'text-amber-800', desc: 'Sargam symbols, Komal & Tivra notes, octaves, rhythm & ornaments' },
    { id: 'learn_fingering_chart', path: '/learn/fingering-chart', label: 'Fingering Chart', icon: CircleDot, color: 'text-amber-600', desc: 'Interactive scale selector, Sa Re Ga Ma notes & audio playback' },
    { id: 'learn_alankaras', path: '/learn/alankaras', label: 'Alankaras', icon: Feather, color: 'text-rose-600', desc: 'Essential daily warmups & exercises' },
    { id: 'learn_scales_octaves', path: '/learn/flute-scales-octaves', label: 'Flute Scales & Octaves', icon: Layers, color: 'text-amber-600', desc: 'Master Mandra, Madhya & Taar registers with audio notes & charts' },
    { id: 'learn_daily_practice', path: '/learn/daily-practice-guide', label: 'Daily Practice Guide', icon: Target, color: 'text-amber-600', desc: 'Complete daily routine for steady progress' },
    { id: 'learn_common_mistakes', path: '/learn/common-flute-mistakes', label: 'Common Flute Mistakes', icon: AlertTriangle, color: 'text-amber-700', desc: '15 common mistakes & step-by-step fixes for every player' },
    { id: 'budget_flutes', path: '/best-budget-flutes', label: 'Best Budget Flutes', icon: ShoppingBag, color: 'text-amber-600', desc: 'Affordable Bamboo & PVC bansuri recommendations for beginners' },
    { id: 'flute_faq', path: '/faq', label: 'Flute FAQ Center', icon: HelpCircle, color: 'text-amber-600', desc: 'Comprehensive Q&A knowledge base on flute, practice & raagas' },
    { id: 'note_key_converter', path: '/tools/flute-note-key-converter', label: 'Note & Key Converter', icon: Music, color: 'text-emerald-700', desc: 'Convert Swaras ⇄ Western Notes & explore cross-key relationships' },
    { id: 'find_song_scale', path: '/learn/how-to-find-scale-of-a-song-on-flute', label: 'Find Scale of a Song', icon: Compass, color: 'text-amber-700', desc: 'Ear training guide to identify key, tonic / Sa and melody on flute' },
    { id: 'learn_raagas', path: '/learn/raagas', label: 'Ragas', icon: Music, color: 'text-bamboo-800', desc: 'Classical Hindustani & Carnatic guides' },
    { id: 'learn_tuner', path: '/tuner', label: 'Flute Tuner', icon: Radio, color: 'text-amber-700', desc: 'Interactive live frequency & scale tuner (440Hz)' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-bamboo-900 mb-2">Learn Flute (Bansuri)</h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Step-by-step educational modules to master the Indian bamboo flute (Bansuri)
        </p>
      </div>

      {/* Adsterra Display Banner: 300x250 after Introduction */}
      <div className="mb-8">
        <AdsterraDisplayBanner />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              key={option.id}
              to={option.path}
              onClick={() => {
                if (onViewChange) onViewChange(option.id as AppView);
              }}
              className="frosted-panel p-6 rounded-3xl flex flex-col items-center text-center hover:shadow-lg transition-all border border-bamboo-100/80 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-14 h-14 bg-bamboo-50/80 group-hover:bg-amber-100/80 rounded-2xl flex items-center justify-center mb-4 transition-colors border border-bamboo-200/50">
                <Icon className={`w-8 h-8 ${option.color}`} />
              </div>
              <h3 className="text-lg font-bold text-bamboo-900 mb-1">{option.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{option.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Native Banner Ad */}
      <AdsterraNativeBanner className="mt-8" />

      {/* COMPREHENSIVE BANSURI LEARNING ROADMAP & CURRICULUM */}
      <div className="mt-16 space-y-12 text-left">
        {/* Section 1: 5-Stage Learning Roadmap */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-100 shadow-sm space-y-6">
          <div className="border-b border-bamboo-100 pb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700">Structured Curriculum</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-bamboo-950 mt-1">
              The 5-Stage Bansuri Sadhana Roadmap
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Learning the Indian bamboo flute requires a systematic transition from basic acoustic sound production to expressive classical ornamentation. Follow this structured roadmap to build solid foundations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center">1</span>
                <h3 className="font-bold text-bamboo-900 text-base">Sound Cultivation &amp; Embouchure</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Focus on producing a rich, unforced tone on the open flute. Master the 70/30 lip-plate coverage rule, relaxed chin posture, and diaphragm-supported breath stream without covering any finger holes.
              </p>
            </div>

            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center">2</span>
                <h3 className="font-bold text-bamboo-900 text-base">Shuddha Swaras &amp; Finger Sealing</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gradually close holes 1 through 6 using the flat pads of your fingers (never the fingertips). Establish clear intonation across the natural scale: Pa, Dha, Ni, Sa, Re, Ga, Ma in Madhya Saptak.
              </p>
            </div>

            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center">3</span>
                <h3 className="font-bold text-bamboo-900 text-base">Alankars &amp; Finger Agility</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Practice ascending (Aroha) and descending (Avaroha) permutations in set rhythm. Alankar riyaz develops finger independence, micro-second reflex coordination, and rhythmic precision (Laya).
              </p>
            </div>

            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center">4</span>
                <h3 className="font-bold text-bamboo-900 text-base">Octave Register Transitions</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Learn how air speed—not volume—triggers register shifts. Switch smoothly between the deep, meditative Mandra Saptak (lower octave) and the bright, singing Taar Saptak (upper octave).
              </p>
            </div>

            <div className="bg-bamboo-50/50 rounded-2xl p-5 border border-bamboo-100 space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center">5</span>
                <h3 className="font-bold text-bamboo-900 text-base">Classical Ragas &amp; Embellishments (Alankritic Ornaments)</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Begin exploring foundational evening ragas like Raga Yaman and Raga Bhoopali. Incorporate Indian classical ornamentation: Meend (continuous microtonal glissando), Gamak (rapid breath oscillation), Kan (grace notes), and Murki.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Recommended Flute Scale Guide */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-100 shadow-sm space-y-6">
          <div className="border-b border-bamboo-100 pb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700">Gear Selection</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-bamboo-950 mt-1">
              Which Bansuri Should You Start With?
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Choosing an incorrect flute scale is the #1 reason beginners experience finger fatigue or struggle to produce clear notes. Match your physical hand size to the ideal flute key:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-bamboo-900 text-white">
                  <th className="p-3 font-bold rounded-tl-xl">Learner Profile</th>
                  <th className="p-3 font-bold">Recommended Scale</th>
                  <th className="p-3 font-bold">Approx. Length</th>
                  <th className="p-3 font-bold rounded-tr-xl">Why It Works</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className="bg-stone-50/60">
                  <td className="p-3 font-bold text-bamboo-950">Adult Beginners</td>
                  <td className="p-3 font-bold text-amber-800">C Natural Medium</td>
                  <td className="p-3 text-stone-600">~19 inches (48 cm)</td>
                  <td className="p-3 text-stone-700">Comfortable hole spacing, moderate breath volume requirement, and aligns with standard vocal keys.</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-bold text-bamboo-950">Teens / Smaller Hands</td>
                  <td className="p-3 font-bold text-amber-800">G Medium / A Medium</td>
                  <td className="p-3 text-stone-600">~15–17 inches (38–43 cm)</td>
                  <td className="p-3 text-stone-700">Compact finger reach, lightweight, and responds instantly to lighter breath pressure.</td>
                </tr>
                <tr className="bg-stone-50/60">
                  <td className="p-3 font-bold text-bamboo-950">Children (Under 10)</td>
                  <td className="p-3 font-bold text-amber-800">C High / D High</td>
                  <td className="p-3 text-stone-600">~11–13 inches (28–33 cm)</td>
                  <td className="p-3 text-stone-700">Zero finger strain; ideal for cultivating the foundational embouchure habit early.</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-bold text-bamboo-950">Intermediate / Classical Soloists</td>
                  <td className="p-3 font-bold text-amber-800">E Bass / F# Bass</td>
                  <td className="p-3 text-stone-600">~28–30 inches (71–76 cm)</td>
                  <td className="p-3 text-stone-700">Deep, meditative resonance favored by Pt. Hariprasad Chaurasia and traditional Hindustani concerts.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Daily Practice Pillars */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-bamboo-50 rounded-3xl p-6 sm:p-10 border border-amber-200/80 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-800">Daily Riyaz Discipline</span>
            <h2 className="text-2xl font-bold font-display text-bamboo-950 mt-1">
              Three Golden Rules for Productive Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-gray-700">
            <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="font-bold text-bamboo-900 text-base">1. Always Play with Tanpura</h3>
              <p className="text-gray-600 leading-relaxed text-xs">
                The bansuri is a fretless instrument with no fixed keys. Practicing against a calibrated Tanpura drone trains your ear to instinctively detect microtonal deviations and center every swara in harmony.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="font-bold text-bamboo-900 text-base">2. Tone Quality Over Speed</h3>
              <p className="text-gray-600 leading-relaxed text-xs">
                Rushing through fast alankars with a breathy or trembling sound reinforces poor muscle memory. Spend at least 15 minutes sustaining long, uninterrupted notes (Kharaj Sadhana) at the beginning of each session.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="font-bold text-bamboo-900 text-base">3. Consistency Beats Marathon Hours</h3>
              <p className="text-gray-600 leading-relaxed text-xs">
                Playing 25 minutes every day produces far faster neuromuscular adaptation than practicing for three hours only once a week. Daily contact keeps your facial embouchure muscles supple and responsive.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Bansuri Learning FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-100 shadow-sm space-y-6">
          <div className="border-b border-bamboo-100 pb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700">Expert Guidance</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-bamboo-950 mt-1">
              Frequently Asked Questions on Learning Bansuri
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Common questions answered by experienced mentors to help accelerate your bansuri journey.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Can I learn bansuri online without a physical teacher?</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Yes. With modern high-fidelity audio, accurate fingering charts, digital tuners, and interactive alankar generators, thousands of students have learned to play bansuri independently. The key is to record yourself frequently, use a 440 Hz tuner or Tanpura to verify your intonation, and follow a structured curriculum without skipping foundational breath exercises.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">How many days does it take to produce the first clear sound on a flute?</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Most students produce their first resonant note within 2 to 5 days of dedicated 15-minute practice sessions. The secret is to keep the lower lip covering approximately one-third of the blowing hole and gently blowing a thin, focused stream of air downward against the opposite inner edge of the embouchure hole.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Should a beginner buy a Bamboo or PVC bansuri?</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Both have distinct advantages. PVC flutes are completely weatherproof, crack-resistant, washable, and hold precise pitch in any climate, making them exceptionally durable for initial practice and travel. Natural Assam bamboo (Arundinaria or Bambusa tulda) offers richer acoustic harmonics, warm resonance, and organic tactile feel essential for serious classical performance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-bamboo-950 text-sm sm:text-base">Do I need prior knowledge of Indian classical music theory?</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Not at all. You can begin playing immediately with basic Sargam (Sa, Re, Ga, Ma, Pa, Dha, Ni) which directly corresponds to Western Solfege (Do, Re, Mi, Fa, Sol, La, Ti). As your finger coordination strengthens, you can gradually learn ragas, thaats, and tala rhythms using our step-by-step guides.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
