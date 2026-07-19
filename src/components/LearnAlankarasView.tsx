import React from 'react';
import { Music, Wind, ArrowUpRight, ArrowDownRight, Lightbulb } from 'lucide-react';

export default function LearnAlankarasView() {
  const alankars = [
    {
      title: "1. The Straight Scale (Saral Alankar)",
      desc: "This is the absolute foundation. It helps you focus on producing a clean sound on each individual note and matching your breath to the length of the note.",
      aroha: "Sa | Re | Ga | Ma | Pa | Dha | Ni | Sā",
      avroha: "Sā | Ni | Dha | Pa | Ma | Ga | Re | Sa"
    },
    {
      title: "2. The Double Swara Pattern (Jod Alankar)",
      desc: "This pattern teaches you to tongue the notes correctly (cutting the air briefly with your throat or tongue to separate identical notes) and builds finger stability.",
      aroha: "Sa-Sa | Re-Re | Ga-Ga | Ma-Ma | Pa-Pa | Dha-Dha | Ni-Ni | Sā-Sā",
      avroha: "Sā-Sā | Ni-Ni | Dha-Dha | Pa-Pa | Ma-Ma | Ga-Ga | Re-Re | Sa-Sa"
    },
    {
      title: "3. The Triplet Pattern (Teevra/Teen Swara)",
      desc: "This introduces a basic rhythm of three beats per phrase. It starts building agility as your fingers have to move across sequential notes continuously.",
      aroha: "Sa-Re-Ga | Re-Ga-Ma | Ga-Ma-Pa | Ma-Pa-Dha | Pa-Dha-Ni | Dha-Ni-Sā",
      avroha: "Sā-Ni-Dha | Ni-Dha-Pa | Dha-Pa-Ma | Pa-Ma-Ga | Ma-Ga-Re | Ga-Re-Sa"
    },
    {
      title: "4. The Quadruplet Pattern (Chaar Swara)",
      desc: "A four-note sequence that expands your breath capacity and helps you track longer phrases mentally while maintaining an even finger speed.",
      aroha: "Sa-Re-Ga-Ma | Re-Ga-Ma-Pa | Ga-Ma-Pa-Dha | Ma-Pa-Dha-Ni | Pa-Dha-Ni-Sā",
      avroha: "Sā-Ni-Dha-Pa | Ni-Dha-Pa-Ma | Dha-Pa-Ma-Ga | Pa-Ma-Ga-Re | Ma-Ga-Re-Sa"
    },
    {
      title: "5. The Skip Pattern (Alankaar of Alternating Notes)",
      desc: "This is where the real finger coordination begins. By skipping a note, you train your fingers to lift and close independently rather than just moving in a straight line.",
      aroha: "Sa-Ga | Re-Ma | Ga-Pa | Ma-Dha | Pa-Ni | Dha-Sā",
      avroha: "Sā-Dha | Ni-Pa | Dha-Ma | Pa-Ga | Ma-Re | Ga-Sa"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Music className="w-7 h-7 text-amber-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight">
              Basic Alankaras
            </h1>
          </div>

          <div className="prose prose-bamboo prose-lg max-w-none text-gray-700 space-y-10">
            <section>
              <p className="text-xl leading-relaxed text-gray-600 font-medium border-l-4 border-amber-400 pl-6 py-2 italic">
                In Indian classical music (both Hindustani and Carnatic), Alankars (also called Paltas) are structural, melodic patterns used to train your fingers, breath, and ear. For a beginner playing the Bansuri, practicing Alankars is the single best way to build muscle memory for finger placement and to achieve steady tone control.
              </p>
            </section>

            <section className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50">
              <p className="m-0 text-gray-700">
                Before you start, ensure you are comfortable with the basic notes (Swaras):
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-lg font-bold text-amber-900">
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Sa</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Re</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Ga</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Ma</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Pa</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Dha</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Ni</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-amber-200">Sā</span>
              </div>
            </section>

            <section>
              <p className="text-lg text-gray-700 mb-6">
                Here are the essential basic Alankars every beginner should master. Practice them in two parts: Aroha (ascending order) and Avroha (descending order).
              </p>

              <div className="space-y-8">
                {alankars.map((alankar, index) => (
                  <div key={index} className="bg-white border border-bamboo-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-bamboo-50 px-6 py-4 border-b border-bamboo-100">
                      <h3 className="text-xl font-bold text-bamboo-900 m-0">{alankar.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 m-0">{alankar.desc}</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Aroha (Ascending)</span>
                        </div>
                        <div className="font-mono text-sm sm:text-base text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200 overflow-x-auto whitespace-nowrap">
                          {alankar.aroha}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                          <ArrowDownRight className="w-4 h-4" />
                          <span>Avroha (Descending)</span>
                        </div>
                        <div className="font-mono text-sm sm:text-base text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200 overflow-x-auto whitespace-nowrap">
                          {alankar.avroha}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-bamboo-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-bamboo-900 m-0">How to Practice These on the Bansuri</h2>
              </div>
              
              <ul className="space-y-6 m-0 p-0 list-none">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                  <div>
                    <strong className="text-gray-900 block text-lg mb-1">Start Slooooowly:</strong>
                    <span className="text-gray-600">Do not rush. Use a tanpura drone app (like iShala or Tanpura Droid) and a metronome set to a very slow speed (60–70 BPM). Give every single note full value.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                  <div>
                    <strong className="text-gray-900 block text-lg mb-1">One Breath per Phrase:</strong>
                    <span className="text-gray-600">In the beginning, try to play an entire phrase (like Sa-Re-Ga-Ma) in a single, steady breath. Take a quick, clean breath before starting the next phrase (Re-Ga-Ma-Pa).</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                  <div>
                    <strong className="text-gray-900 block text-lg mb-1">Listen closely for Leaks:</strong>
                    <span className="text-gray-600">If a note sounds airy or squeaks, your fingers aren't sealing the holes completely. Stop, adjust the pads of your fingers, and ensure a tight seal before moving to the next pattern.</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
