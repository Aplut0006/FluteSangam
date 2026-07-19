import React from 'react';
import { Wind, Volume2, UserCheck, Move, Play, Music } from 'lucide-react';

export default function LearnBasicsView() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-bamboo-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Volume2 className="w-7 h-7 text-emerald-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight">
              The Basics: Sound & Grip
            </h1>
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
            
          </div>
        </div>
      </div>
    </div>
  );
}
