import React from 'react';
import { Wind, Volume2, UserCheck, Move, Play, Music, Calendar, Clock, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface LearnBasicsViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function LearnBasicsView({ onViewChange }: LearnBasicsViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" itemScope itemType="https://schema.org/LearningResource">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-bamboo-100 rounded-2xl flex items-center justify-center shadow-inner">
                <Volume2 className="w-7 h-7 text-emerald-700" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight" itemProp="headline">
                The Basics: Sound & Grip
              </h1>
            </div>

            {/* Explicit Freshness Signals & Timestamps */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 bg-emerald-50/80 border border-emerald-200/60 rounded-2xl px-3.5 py-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-gray-500">Published:</span>
                <time itemProp="datePublished" dateTime="2026-07-26T00:00:00Z" className="font-semibold text-gray-900">
                  Jul 26, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-gray-500">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-10-10T00:00:00Z" className="font-semibold text-gray-900">
                  Oct 10, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Guide
              </span>
            </div>
          </div>

          <div className="prose prose-bamboo prose-lg max-w-none text-gray-700 space-y-10">
            
            {/* Intro section */}
            <section>
              <p className="text-xl leading-relaxed text-gray-600 font-medium border-l-4 border-emerald-400 pl-6 py-2 italic">
                Before you can play melodies, you must master the two foundational pillars of the bansuri: producing a clear, resonant tone (the embouchure) and holding the instrument without tension (the grip).
              </p>
            </section>


            {/* Embouchure */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
                <Wind className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-bamboo-900 m-0">1. Master the Embouchure (Producing Sound)</h2>
              </div>
              
              <p>
                The embouchure refers to the exact positioning of your lips, jaw, and tongue in relation to the flute's blowing hole (mukha-randhra). Because the Bansuri is a simple bamboo tube with no mechanical reed or whistle, your lips act as the instrument's reed.
              </p>
              
              <div className="bg-white p-6 rounded-2xl border border-bamboo-200 shadow-sm my-6">
                <h3 className="text-lg font-bold text-bamboo-900 mb-3 flex items-center gap-2">
                  <Play className="w-5 h-5 text-emerald-600" />
                  The Physics of the Sound
                </h3>
                <p className="text-gray-600 m-0 text-base">
                  To create a clean note on a Bansuri, you must split a thin, focused stream of air right against the sharp, outer edge of the blowing hole. Half the air goes inside the flute (resonating the tube), and half goes over it.
                </p>
              </div>

              <h3 className="text-xl font-bold text-bamboo-800 mt-8 mb-4">Step-by-Step Technique:</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-bamboo-50/50 p-6 rounded-2xl border border-bamboo-100/50">
                  <h4 className="font-bold text-gray-900 mb-2">The Lip Placement</h4>
                  <p className="text-sm text-gray-600">Do not center the blowing hole directly on your lips. Instead, place the inner edge of the blowing hole right at the border where your lower lip meets your chin skin.</p>
                </div>
                
                <div className="bg-bamboo-50/50 p-6 rounded-2xl border border-bamboo-100/50">
                  <h4 className="font-bold text-gray-900 mb-2">The Pucker</h4>
                  <p className="text-sm text-gray-600">Keep your lips relaxed but formed into a tiny, focused "O" shape, as if you are blowing out a candle through a thin straw. Avoid pulling your lips back into a tight smile, as this thins out the tone and makes the sound airy.</p>
                </div>
                
                <div className="bg-bamboo-50/50 p-6 rounded-2xl border border-bamboo-100/50">
                  <h4 className="font-bold text-gray-900 mb-2">The Roll</h4>
                  <p className="text-sm text-gray-600">Look in a mirror. Cover the blowing hole entirely with your lower lip, and then slowly roll the flute outward (away from you) by about 30 to 45 degrees while blowing a steady, gentle stream of air.</p>
                </div>
                
                <div className="bg-bamboo-50/50 p-6 rounded-2xl border border-bamboo-100/50">
                  <h4 className="font-bold text-gray-900 mb-2">Finding the "Sweet Spot"</h4>
                  <p className="text-sm text-gray-600">As you roll the flute, you will suddenly hear the airy hiss transform into a resonant, warm, and clear bamboo tone. Stop rolling right there. That is your unique embouchure sweet spot.</p>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-800 p-5 rounded-xl border border-emerald-100 flex items-start gap-3 mt-6">
                <span className="text-2xl leading-none">💡</span>
                <div>
                  <strong className="block mb-1">Beginner Tip:</strong>
                  <span className="text-sm">Practice this with all finger holes completely open. Trying to close finger holes while finding your embouchure introduces structural leaks, making it impossible to tell if the issue is your breath or your fingers.</span>
                </div>
              </div>

              {/* Diagnostic Sound Production & Troubleshooting Matrix */}
              <div className="bg-sand-50/70 border border-sand-200 rounded-2xl p-6 space-y-4 my-6">
                <h3 className="text-lg font-bold text-bamboo-900 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-emerald-700" />
                  Diagnostic Tone Guide: How to Identify &amp; Fix Common Sound Failures
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  When first blowing into the bansuri, every student experiences one of four specific tone failures. Use this diagnostic matrix to identify what you hear and apply the exact physical correction:
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-white rounded-xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-rose-900 font-bold">1. Pure Hiss with No Note</strong>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-semibold">Missing Edge</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Observation:</strong> You hear rushing air like wind through a tunnel, but zero musical pitch.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Cause:</strong> The airstream is overshooting the opposite wall or the blowing hole is covered too little.
                    </p>
                    <p className="text-bamboo-900 text-xs font-medium">
                      <strong>Correction:</strong> Place the inner edge of the hole firmly against the lower lip margin. Slowly roll inward 5 degrees, narrow the lip aperture, and blow gently downward at a 45-degree angle.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-900 font-bold">2. High Shrill Squeak / Overblow</strong>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">Excess Force</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Observation:</strong> The flute screeches in the upper octave instead of producing a warm, low fundamental tone.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Cause:</strong> Air velocity is too high or lip aperture is pinched tight like a whistle.
                    </p>
                    <p className="text-bamboo-900 text-xs font-medium">
                      <strong>Correction:</strong> Drop jaw slightly, relax the lip corners, and whisper the syllable &ldquo;Dhooo&rdquo;. Halve your blowing force—the bansuri requires air speed control, not brute air volume.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-blue-900 font-bold">3. Dizziness &amp; Breath Depletion in 3s</strong>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">Wide Aperture</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Observation:</strong> You run out of breath after only 2 to 3 seconds and feel lightheaded.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Cause:</strong> The mouth opening is too wide, dumping your lung reserve without focusing into the hole.
                    </p>
                    <p className="text-bamboo-900 text-xs font-medium">
                      <strong>Correction:</strong> Form an aperture the diameter of a coffee stirrer straw in the middle of your lips. A focused micro-stream will sustain a note for 10–15 seconds easily.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-purple-900 font-bold">4. Pitch Drifts Flat at Breath End</strong>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">Chest Collapse</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Observation:</strong> The note starts in tune, then sags flat and wavers as you exhale.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Cause:</strong> Collapsing the ribcage rather than supporting breath from the lower diaphragm.
                    </p>
                    <p className="text-bamboo-900 text-xs font-medium">
                      <strong>Correction:</strong> Inhale by expanding your lower abdomen; keep shoulders still. Maintain slight abdominal engagement through the entire note to keep air speed steady.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Grip and Posture */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-bamboo-100 pb-3">
                <UserCheck className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-bamboo-900 m-0">2. Adopt the Correct Grip and Posture</h2>
              </div>
              
              <p>
                In the Indian classical tradition, your posture (Aasana) dictates your breath capacity, and your grip dictates your speed and fluid ornamentation (Meend and Gamaka).
              </p>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-bamboo-800 mb-4">The Posture (Sitting down vs. Standing)</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">Traditional Sitting:</strong>
                      <span className="text-gray-600 block mt-1">Ideally, sit cross-legged on the floor (Sukhasana or Padmasana). Keep your spine straight but entirely relaxed. A straight spine ensures your diaphragm can expand fully, providing sustained air support for long notes (Swar Sadhana).</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">The Angle:</strong>
                      <span className="text-gray-600 block mt-1">Hold the flute at a downward angle of roughly 15 to 30 degrees relative to the floor. Do not hold it perfectly horizontal (which strains the shoulders) or drop it too low (which compresses the throat).</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">Head Position:</strong>
                      <span className="text-gray-600 block mt-1">Keep your head straight. Bring the flute to your lips; do not tilt your head down to meet the flute.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-bamboo-800 mb-4">The Grip (Hindustani Traditional Style)</h3>
                
                <div className="bg-white p-6 rounded-2xl border border-bamboo-200 shadow-sm mb-6">
                  <p className="text-gray-700 m-0">
                    Unlike a western silver flute where you use the tips of your fingers, the long Hindustani bamboo Bansuri requires a unique approach because the holes are spaced widely apart.
                  </p>
                  <p className="text-bamboo-800 font-medium mt-4">
                    <strong>The Pads, Not the Tips:</strong> Always use the flat, fleshy pads of your fingers (the middle phalanx or the soft pad just below the tip) to cover the holes. Never use the very tips of your fingers. Using the pads ensures an airtight seal without needing to press down hard.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">The Left Hand (Upper Hand)</h4>
                    <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5 marker:text-emerald-500">
                      <li>The index, middle, and ring fingers cover the top three holes.</li>
                      <li>The left thumb acts as a crucial support anchor underneath the flute, balancing it against your lips.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">The Right Hand (Lower Hand)</h4>
                    <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5 marker:text-emerald-500">
                      <li>The index, middle, and ring fingers cover the bottom three holes.</li>
                      <li><strong>Crucial Detail:</strong> The pinky finger of your right hand rests lightly on the body of the flute past the last hole to act as a stabilizer.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 text-red-800 p-5 rounded-xl border border-red-100 mt-6">
                  <strong className="block mb-1 text-red-900">Relax the Tension:</strong>
                  <span className="text-sm">Your fingers should feel like soft rubber stamps. If you press too hard, your fingers will cramp, making fast transitions impossible, and air will ironically leak out of the micro-gaps created by tense skin.</span>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="text-center py-8">
              <div className="inline-block bg-gradient-to-r from-emerald-50 to-bamboo-50 px-8 py-6 rounded-3xl border border-emerald-100 shadow-sm max-w-2xl mx-auto">
                <Music className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-bamboo-800 font-medium italic m-0">
                  By practicing your embouchure for 10–15 minutes daily alongside maintaining a completely tension-free grip, your muscle memory will lock these coordinates in within a couple of weeks.
                </p>
              </div>
            </section>

            {/* Native Banner Ad */}

            {/* Next Step: Interactive Fingering Chart CTA */}
            {onViewChange && (
              <section className="pt-4">
                <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-bamboo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-400/40">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 bg-amber-300/20 text-amber-200 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300/30 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Next Step In Learning
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-2">
                      Interactive Bansuri Fingering Chart
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-100/90 max-w-md font-medium">
                      Select your flute key and tap Sa, Re, Ga, Ma, Pa, Dha, Ni to see closed finger holes & hear authentic audio tones!
                    </p>
                  </div>

                  <button
                    onClick={() => onViewChange('learn_fingering_chart')}
                    className="px-6 py-3 bg-white hover:bg-amber-50 text-bamboo-950 font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md cursor-pointer flex items-center gap-2 shrink-0 group"
                  >
                    <span>Open Fingering Chart</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-600" />
                  </button>
                </div>
              </section>
            )}

            {/* Author Section */}
            <AboutAuthorSection onViewChange={onViewChange} />
            
          </div>
        </div>
      </div>
    </div>
  );
}
