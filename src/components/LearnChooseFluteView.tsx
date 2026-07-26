import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Sparkles, User, Users, Baby, Music, Store, Check, ArrowRight, Radio } from 'lucide-react';
import { AppView } from '../types';

interface LearnChooseFluteViewProps {
  onBackToLearn?: () => void;
  onViewChange?: (view: AppView) => void;
}

export default function LearnChooseFluteView({ onBackToLearn, onViewChange }: LearnChooseFluteViewProps) {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6"
      id="learn-choose-flute-view"
    >
      {/* Navigation header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToLearn || (() => onViewChange?.('learn_dashboard'))}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/80 hover:bg-bamboo-100 border border-bamboo-200/80 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-3xs"
          id="choose-flute-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learn Flute
        </button>

        <div className="flex items-center gap-2 text-xs text-bamboo-700 font-medium bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Beginner's Buying Guide
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10">
          {/* Header Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-100 to-bamboo-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0 border border-amber-200/50">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-amber-800" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold font-display text-bamboo-900 tracking-tight">
                Choose the Right Flute (Bansuri)
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                A complete scale selection guide tailored for children, teenagers, and adults
              </p>
            </div>
          </div>

          {/* Core Question Quote */}
          <div className="bg-gradient-to-r from-amber-50/80 via-bamboo-50/60 to-amber-50/80 p-5 sm:p-6 rounded-2xl border-l-4 border-amber-500 mb-8 shadow-2xs">
            <p className="text-lg sm:text-xl font-display font-bold text-bamboo-950 mb-2">
              "Which flute should I start with?"
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              One of the most common questions every beginner asks! Choosing the right flute is important because it can make your learning journey much more comfortable and enjoyable. The recommendations below are based on practical learning experience and are intended to help beginners make an informed choice.
            </p>
          </div>

          <div className="space-y-10 text-gray-700">

            {/* Section 1: Buy Quality */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
                <Store className="w-6 h-6 text-amber-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 m-0">
                  1. Buy a Good Quality, Tuned Flute
                </h2>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                Before choosing a scale, make sure you buy your flute from a <strong className="text-bamboo-900">reputable and professional flute maker</strong>. A well-crafted, properly tuned flute will produce better sound, be easier to play, and help you develop good technique right from the beginning.
              </p>

              <div className="bg-bamboo-50/60 p-5 sm:p-6 rounded-2xl border border-bamboo-200/80 space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-bamboo-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-bamboo-700" />
                  Why visit a local flute maker or music store in person?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Whenever possible, visit a local flute maker or music store instead of buying online. This allows you to:
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700 pt-1">
                  <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-bamboo-100 shadow-3xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Check whether the flute is <strong>properly tuned</strong> (A440 Hz standard).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-bamboo-100 shadow-3xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Test how <strong>comfortable</strong> it feels in your hands and fingers.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-bamboo-100 shadow-3xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Get guidance on selecting a flute based on your <strong>blowing strength & finger reach</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-bamboo-100 shadow-3xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Receive <strong>expert recommendations</strong> from an experienced flute craftsman.</span>
                  </li>
                </ul>
                <p className="text-xs text-bamboo-800 font-medium pt-1">
                  💡 If you're a complete beginner, don't worry—they can usually suggest the most suitable flute to help you get started smoothly!
                </p>
              </div>
            </section>

            {/* Section 2: Recommended Flute Scales */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
                <Music className="w-6 h-6 text-bamboo-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 m-0">
                  Recommended Flute Scales
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1: Children */}
                <div className="bg-white p-6 rounded-2xl border-2 border-amber-200/80 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-4 border border-amber-200/60">
                      <Baby className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">Below 10 Years</span>
                    <h3 className="text-lg font-bold text-bamboo-900 mb-3">👦 Children</h3>
                    <div className="bg-amber-50 text-amber-900 font-bold text-sm px-3 py-2 rounded-xl border border-amber-200 mb-3 text-center">
                      ✅ C Middle or D Middle Flute
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      These flutes are smaller in length, lighter, and much easier for young children to hold, blow, and play comfortably without stretching fingers.
                    </p>
                  </div>
                </div>

                {/* Card 2: Teenagers */}
                <div className="bg-white p-6 rounded-2xl border-2 border-bamboo-200/80 shadow-sm flex flex-col justify-between hover:border-bamboo-400 transition-all">
                  <div>
                    <div className="w-12 h-12 bg-bamboo-100 text-bamboo-800 rounded-2xl flex items-center justify-center mb-4 border border-bamboo-200/60">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-bamboo-700 uppercase tracking-wider block mb-1">10 – 17 Years</span>
                    <h3 className="text-lg font-bold text-bamboo-900 mb-3">🧒 Children & Teenagers</h3>
                    <div className="bg-bamboo-50 text-bamboo-900 font-bold text-sm px-3 py-2 rounded-xl border border-bamboo-200 mb-3 text-center">
                      ✅ A Base or G Base Flute
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Choose the scale that feels more natural based on hand size, finger stretch flexibility, and overall comfort while holding the flute.
                    </p>
                  </div>
                </div>

                {/* Card 3: Adults */}
                <div className="bg-white p-6 rounded-2xl border-2 border-emerald-300 shadow-md flex flex-col justify-between relative overflow-hidden hover:border-emerald-500 transition-all">
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-bl-xl shadow-2xs">
                    Most Popular
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-4 border border-emerald-200/60">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">18+ Years</span>
                    <h3 className="text-lg font-bold text-bamboo-900 mb-3">👨 Adults</h3>
                    <div className="bg-emerald-50 text-emerald-900 font-bold text-sm px-3 py-2 rounded-xl border border-emerald-200 mb-3 text-center">
                      ✅ G Base Flute
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      For most adult learners, the <strong>G Base flute</strong> is the ideal starting instrument. It provides comfortable finger spacing while producing a warm, rich, and beautiful bass tone.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Flutes Shown in the Image / Visual Comparison */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 m-0">
                  📷 Comparing the Scales & Sizes
                </h2>
              </div>

              <div className="bg-bamboo-900 text-white p-6 rounded-3xl shadow-md overflow-hidden relative">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ad/All_scales_of_Bansuris_in_a_set.jpg" 
                  alt="Bansuri Flutes Comparison - G Base, A Base, C Middle" 
                  className="w-full h-56 sm:h-72 object-cover object-center rounded-2xl shadow-inner mb-6 border border-bamboo-700/60"
                  referrerPolicy="no-referrer"
                />

                <div className="bg-bamboo-950/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-bamboo-700/80">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-3">
                    Flutes Visual Reference Guide:
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div className="bg-bamboo-900/90 p-3 rounded-xl border border-bamboo-700">
                      <span className="text-amber-300 font-bold block mb-0.5">Top Flute:</span>
                      <strong className="text-white text-base block">G Base Flute</strong>
                      <span className="text-bamboo-200 text-xs">Longest length, deeper resonant tone, ideal for adults.</span>
                    </div>
                    <div className="bg-bamboo-900/90 p-3 rounded-xl border border-bamboo-700">
                      <span className="text-amber-300 font-bold block mb-0.5">Middle Flute:</span>
                      <strong className="text-white text-base block">A Base Flute</strong>
                      <span className="text-bamboo-200 text-xs">Medium-large size, balanced finger spacing for teens/adults.</span>
                    </div>
                    <div className="bg-bamboo-900/90 p-3 rounded-xl border border-bamboo-700">
                      <span className="text-amber-300 font-bold block mb-0.5">Bottom Flute:</span>
                      <strong className="text-white text-base block">C Middle Flute</strong>
                      <span className="text-bamboo-200 text-xs">Shorter length, higher pitch, easy reach for young learners.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Important Note */}
            <section className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <h3 className="text-lg sm:text-xl font-display font-bold text-amber-950">
                  ⚠️ Important Note
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                These scale recommendations are <strong>general guidelines</strong>, not strict or unbreakable rules!
              </p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Every person's hands are different. Finger length, palm size, flexibility, and physical comfort all play an important role in choosing the right flute. If a recommended flute feels difficult to hold or cover properly, it's perfectly fine to choose another scale (such as E Bass or B Base) that suits your hands better.
              </p>
              <p className="text-xs sm:text-sm font-bold text-bamboo-900 pt-1">
                ✨ Remember: The best flute is the one that allows you to play comfortably and enjoy your practice session every day.
              </p>
            </section>

            {/* Section 5: Final Tip */}
            <section className="bg-gradient-to-r from-bamboo-900 to-amber-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center shrink-0 border border-amber-300/30">
                  <Lightbulb className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-1">
                    Final Tip for Beginners
                  </h3>
                  <p className="text-xs sm:text-sm text-bamboo-100 leading-relaxed">
                    Don't spend too much time worrying about finding the "perfect" flute. Start with a good-quality, tuned flute that feels comfortable in your hands, practice consistently, and focus on building strong fundamentals (blowing & finger grip). As your skills improve, you can always explore flutes in different scales to expand your musical journey!
                  </p>
                </div>
              </div>
            </section>

            {/* Next Lesson: Flute Tuner Banner */}
            {onViewChange && (
              <section className="bg-gradient-to-r from-amber-500/20 via-amber-100/40 to-bamboo-100/40 border border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold tracking-wider bg-amber-200/80 text-amber-950 px-3 py-1 rounded-full border border-amber-300/60">
                    <Radio className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span>Next Lesson Module</span>
                  </span>
                  <h3 className="text-xl font-display font-bold text-bamboo-950">
                    Flute Tuner &amp; Frequency Scale Guide
                  </h3>
                  <p className="text-xs text-gray-600 max-w-lg">
                    Check your flute&apos;s scale frequency in real-time with our interactive speedometer tuner calibrated to <strong>A = 440 Hz</strong> standard reference!
                  </p>
                </div>

                <button
                  onClick={() => onViewChange('learn_tuner')}
                  className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-bamboo-800 to-amber-800 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md hover:from-bamboo-900 hover:to-amber-900 transition flex items-center justify-center gap-2 cursor-pointer select-none active:scale-95"
                >
                  <span>Open Flute Tuner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </section>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
}
