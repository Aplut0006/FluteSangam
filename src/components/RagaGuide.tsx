import React, { useState } from 'react';
import { LEARN_RAAGAS } from '../data/learnRaagasData';
import { RagaDetail } from '../types';
import { BookOpen, Music, Sun, Moon, Info, Heart, ArrowRight } from 'lucide-react';

interface RagaGuideProps {
  onSelectRagaDiscussion: (ragaName: string) => void;
  activeRagaFilter: string | null;
}

export default function RagaGuide({ onSelectRagaDiscussion, activeRagaFilter }: RagaGuideProps) {
  const [selectedRaga, setSelectedRaga] = useState<RagaDetail>(LEARN_RAAGAS[0]);

  // Helper to determine time icon
  const getTimeIcon = (time: string) => {
    if (time.toLowerCase().includes('morning')) return <Sun className="w-4 h-4 text-amber-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  return (
    <div className="frosted-panel rounded-2xl overflow-hidden" id="raga-guide-section">
      <div className="bg-gradient-to-r from-bamboo-700 to-bamboo-800 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-yellow-300" />
          <h2 className="font-display font-semibold tracking-wide">RagaSadhana Guide</h2>
        </div>
        <span className="text-[10px] bg-bamboo-600 px-2.5 py-0.5 rounded-full text-white/90">Bansuri Basics</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Dropdown of all ragas */}
        <select
          onChange={(e) => {
            const raga = LEARN_RAAGAS.find(r => r.name === e.target.value);
            if (raga) setSelectedRaga(raga);
          }}
          className="w-full px-4 py-2 bg-bamboo-50 text-bamboo-800 rounded-xl text-xs font-semibold border-none focus:ring-2 focus:ring-bamboo-600"
        >
          {LEARN_RAAGAS.map((raga) => (
            <option key={raga.name} value={raga.name}>
              {raga.name}
            </option>
          ))}
        </select>

        {/* Selected Raga Detail Card */}
        <div className="bg-white/30 backdrop-blur-xs rounded-xl p-4 border border-white/40 space-y-3" id="raga-detail-container">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold font-display text-bamboo-800 flex items-center gap-1.5">
                <Music className="w-4.5 h-4.5 text-yellow-600 shrink-0" />
                Raga {selectedRaga.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium flex items-center gap-1">
                {getTimeIcon(selectedRaga.time)}
                <span>Prahar: {selectedRaga.time}</span>
              </p>
            </div>
                
            <button
              onClick={() => onSelectRagaDiscussion(selectedRaga.name)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition ${
                activeRagaFilter === selectedRaga.name
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-bamboo-700 text-white hover:bg-bamboo-800"
              }`}
              title="See discussions about this raga"
            >
              {activeRagaFilter === selectedRaga.name ? "Viewing Discussion" : "Discuss Raga"}
            </button>
          </div>

          <div className="space-y-2 text-xs border-t border-b border-bamboo-100/60 py-2.5">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 text-gray-500 font-medium">Aaroh:</span>
              <span className="col-span-9 font-semibold text-bamboo-800 tracking-wider font-display">
                {selectedRaga.aaroh}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 text-gray-500 font-medium">Avroh:</span>
              <span className="col-span-9 font-semibold text-bamboo-800 tracking-wider font-display">
                {selectedRaga.avroh}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2 pt-1 border-t border-dashed border-bamboo-100/30">
              <span className="col-span-3 text-gray-500 font-medium">Vadi / Samvadi:</span>
              <span className="col-span-9 font-semibold text-amber-800">
                {selectedRaga.vadi} / {selectedRaga.samvadi}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 text-gray-500 font-medium">Pakad:</span>
              <span className="col-span-9 italic text-bamboo-700 font-medium">
                "{selectedRaga.pakad}"
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase block">The Mood (Rasa)</span>
            <p className="text-xs font-semibold text-gray-700">{selectedRaga.mood}</p>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed pt-1 text-justify">
            {selectedRaga.description}
          </p>
        </div>

        {/* Learning Quick Tips */}
        <div className="border border-yellow-200 bg-yellow-50/50 rounded-xl p-3 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-semibold text-amber-950">Sadhana Tip for Beginners</h4>
            <p className="text-gray-700 leading-normal text-[11px]">
              When practicing a new Raga, focus on playing the Aaroh and Avroh in slow steady beats first. Do not rush to fast compositions (Taans) until your single-note clarity is absolute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
