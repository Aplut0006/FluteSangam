import React from 'react';
import { Music, Wind, ArrowUpRight, ArrowDownRight, Lightbulb, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Metronome from './Metronome';
import AboutAuthorSection from './AboutAuthorSection';
import { AppView } from '../types';

interface LearnAlankarasViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function LearnAlankarasView({ onViewChange }: LearnAlankarasViewProps = {}) {
  const alankars = [
    {
      title: "1. The Straight Scale (Saral Alankar)",
      desc: "This is the absolute foundation. It helps you focus on producing a clean sound on each individual note and matching your breath to the length of the note.",
      aroha: ["Sa | Re | Ga | Ma | Pa | Dha | Ni | Sā"],
      avroha: ["Sā | Ni | Dha | Pa | Ma | Ga | Re | Sa"]
    },
    {
      title: "2. The Double Swara Pattern (Jod Alankar)",
      desc: "This pattern teaches you to tongue the notes correctly (cutting the air briefly with your throat or tongue to separate identical notes) and builds finger stability.",
      aroha: ["Sa-Sa | Re-Re | Ga-Ga | Ma-Ma | Pa-Pa | Dha-Dha | Ni-Ni | Sā-Sā"],
      avroha: ["Sā-Sā | Ni-Ni | Dha-Dha | Pa-Pa | Ma-Ma | Ga-Ga | Re-Re | Sa-Sa"]
    },
    {
      title: "3. The Triplet Pattern (Teevra/Teen Swara)",
      desc: "This introduces a basic rhythm of three beats per phrase. It starts building agility as your fingers have to move across sequential notes continuously.",
      aroha: [
        "Sa-Re-Ga",
        "Re-Ga-Ma",
        "Ga-Ma-Pa",
        "Ma-Pa-Dha",
        "Pa-Dha-Ni",
        "Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha",
        "Ni-Dha-Pa",
        "Dha-Pa-Ma",
        "Pa-Ma-Ga",
        "Ma-Ga-Re",
        "Ga-Re-Sa"
      ]
    },
    {
      title: "4. The Quadruplet Pattern (Chaar Swara)",
      desc: "A four-note sequence that expands your breath capacity and helps you track longer phrases mentally while maintaining an even finger speed.",
      aroha: [
        "Sa-Re-Ga-Ma",
        "Re-Ga-Ma-Pa",
        "Ga-Ma-Pa-Dha",
        "Ma-Pa-Dha-Ni",
        "Pa-Dha-Ni-Sā"
      ],
      avroha: [
        "Sā-Ni-Dha-Pa",
        "Ni-Dha-Pa-Ma",
        "Dha-Pa-Ma-Ga",
        "Pa-Ma-Ga-Re",
        "Ma-Ga-Re-Sa"
      ]
    },
    {
      title: "5. The Skip Pattern (Alankaar of Alternating Notes)",
      desc: "This is where the real finger coordination begins. By skipping a note, you train your fingers to lift and close independently rather than just moving in a straight line.",
      aroha: [
        "Sa-Ga",
        "Re-Ma",
        "Ga-Pa",
        "Ma-Dha",
        "Pa-Ni",
        "Dha-Sā"
      ],
      avroha: [
        "Sā-Dha",
        "Ni-Pa",
        "Dha-Ma",
        "Pa-Ga",
        "Ma-Re",
        "Ga-Sa"
      ]
    },
    {
      title: "6. The Zig-Zag Triplet (Vakra Teen Swara)",
      desc: "This pattern takes two steps forward and one step back. It breaks the habit of linear thinking and builds excellent independent finger control.",
      aroha: [
        "Sa-Re-Sa",
        "Re-Ga-Re",
        "Ga-Ma-Ga",
        "Ma-Pa-Ma",
        "Pa-Dha-Pa",
        "Dha-Ni-Dha",
        "Ni-Sā-Ni"
      ],
      avroha: [
        "Sā-Ni-Sā",
        "Ni-Dha-Ni",
        "Dha-Pa-Dha",
        "Pa-Ma-Pa",
        "Ma-Ga-Ma",
        "Ga-Re-Ga",
        "Re-Sa-Re"
      ]
    },
    {
      title: "7. The Pendulum / Echo Pattern (Pyramid Alankar)",
      desc: "This pattern builds a note up by constantly returning to the anchor note. It is fantastic for breath control because the phrases grow progressively longer.",
      arohaTitle: "Aroha (Ascending Pyramid) - You constantly return down to the base Sa.",
      aroha: [
        "Sa",
        "Sa-Re-Sa",
        "Sa-Re-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Dha-Pa-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Dha-Pa-Ma-Ga-Re-Sa",
        "Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa"
      ],
      avrohaTitle: "Avroha (Descending Pyramid) - You constantly return up to the higher octave Sā.",
      avroha: [
        "Sā",
        "Sā-Ni-Sā",
        "Sā-Ni-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Ga-Ma-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Ga-Ma-Pa-Dha-Ni-Sā",
        "Sā-Ni-Dha-Pa-Ma-Ga-Re-Sa-Re-Ga-Ma-Pa-Dha-Ni-Sā"
      ]
    },
    {
      title: "8. The Hook / Return Pattern (Vakra Chaar Swara)",
      desc: "A beautiful four-note phrase where you go up three notes, but hook back to the second note before moving to the next block. This mimics common classical compositions.",
      aroha: [
        "Sa-Re-Ga-Re",
        "Re-Ga-Ma-Ga",
        "Ga-Ma-Pa-Ma",
        "Ma-Pa-Dha-Pa",
        "Pa-Dha-Ni-Dha",
        "Dha-Ni-Sā-Ni"
      ],
      avroha: [
        "Sā-Ni-Dha-Ni",
        "Ni-Dha-Pa-Dha",
        "Dha-Pa-Ma-Pa",
        "Pa-Ma-Ga-Ma",
        "Ma-Ga-Re-Ga",
        "Ga-Re-Sa-Re"
      ]
    },
    {
      title: "9. The Staggered Skip (Advanced Variable Skip)",
      desc: "You already did Sa-Ga, Re-Ma. Now, we expand the gap. This pattern skips two notes, leaping straight to the fourth note, and then fills in the gap backwards. This is a brilliant stretch for your finger pads.",
      aroha: [
        "Sa-Ma-Ga-Re",
        "Re-Pa-Ma-Ga",
        "Ga-Dha-Pa-Ma",
        "Ma-Ni-Dha-Pa",
        "Pa-Sā-Ni-Dha"
      ],
      avroha: [
        "Sā-Pa-Dha-Ni",
        "Ni-Ma-Pa-Dha",
        "Dha-Ga-Ma-Pa",
        "Pa-Re-Ga-Ma",
        "Ma-Sa-Re-Ga"
      ]
    },
    {
      title: "10. The Long Jump (Swaron Ki Chhalaang)",
      desc: "This is the ultimate test of your muscle memory and embouchure adjustment. You jump a full octave or a massive interval instantly. On a Bansuri, blowing a Sa versus blowing a Pa or higher Sā requires a slight change in air velocity and lip pressure.",
      arohaTitle: "Aroha & Avroha Pairs",
      aroha: [
        "Sa - Sā | Sā - Sa",
        "Sa - Pa | Pa - Sa",
        "Re - Dha | Dha - Re",
        "Ga - Ni | Ni - Ga",
        "Ma - Sā | Sā - Ma"
      ],
      avroha: []
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" itemScope itemType="https://schema.org/LearningResource">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-inner">
                <Music className="w-7 h-7 text-amber-700" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight" itemProp="headline">
                Basic Alankaras
              </h1>
            </div>

            {/* Explicit Freshness Signals & Timestamps */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-3.5 py-2 shrink-0">
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
              <p className="text-sm sm:text-lg text-gray-700 mb-6 leading-relaxed">
                Here are the essential basic Alankars every beginner should master. Practice them in two parts: Aroha (ascending order) and Avroha (descending order).
              </p>

              {/* Single Master Metronome Bar for Smartphone Practice */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 sm:p-5 mb-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-amber-950 m-0">Interactive Practice Metronome</h3>
                      <p className="text-[11px] sm:text-xs text-amber-800 m-0">Use this metronome while practicing all 10 Alankar patterns below.</p>
                    </div>
                  </div>
                </div>
                <div className="max-w-md">
                  <Metronome />
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {alankars.map((alankar, index) => (
                  <div key={index} className="bg-white border border-bamboo-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:border-amber-300 transition-all">
                    <div className="bg-bamboo-50/80 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-bamboo-100">
                      <h3 className="text-base sm:text-xl font-bold text-bamboo-950 m-0">{alankar.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 m-0 leading-relaxed">{alankar.desc}</p>
                    </div>
                    <div className="p-3.5 sm:p-6 space-y-4">
                      <div className="space-y-4">
                        {alankar.aroha && alankar.aroha.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs sm:text-sm mb-1.5">
                              <ArrowUpRight className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{alankar.arohaTitle || 'Aroha (Ascending)'}</span>
                            </div>
                            <div className="font-mono text-xs sm:text-base text-gray-800 bg-gray-50/90 p-3 sm:p-3.5 rounded-xl border border-gray-200/80 overflow-x-auto whitespace-nowrap flex flex-col gap-1.5 leading-relaxed">
                              {alankar.aroha.map((line, i) => (
                                <div key={i} className="tracking-wide">{line}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        {alankar.avroha && alankar.avroha.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm mb-1.5">
                              <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{alankar.avrohaTitle || 'Avroha (Descending)'}</span>
                            </div>
                            <div className="font-mono text-xs sm:text-base text-gray-800 bg-gray-50/90 p-3 sm:p-3.5 rounded-xl border border-gray-200/80 overflow-x-auto whitespace-nowrap flex flex-col gap-1.5 leading-relaxed">
                              {alankar.avroha.map((line, i) => (
                                <div key={i} className="tracking-wide">{line}</div>
                              ))}
                            </div>
                          </div>
                        )}
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

            {/* Author Section */}
            <AboutAuthorSection onViewChange={onViewChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
