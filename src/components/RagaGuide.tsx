import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEARN_RAAGAS } from '../data/learnRaagasData';
import { RagaDetail, AppView } from '../types';
import { BookOpen, Music, Sun, Moon, Info, ArrowRight } from 'lucide-react';

interface RagaGuideProps {
  onSelectRagaDiscussion: (ragaName: string) => void;
  activeRagaFilter: string | null;
  onViewChange?: (view: AppView) => void;
}

export default function RagaGuide({ onSelectRagaDiscussion, activeRagaFilter, onViewChange }: RagaGuideProps) {
  const [selectedRaga, setSelectedRaga] = useState<RagaDetail>(LEARN_RAAGAS[0]);

  // Helper to determine time icon
  const getTimeIcon = (time: string) => {
    if (time.toLowerCase().includes('morning')) return <Sun className="w-4 h-4 text-amber-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  // Helper to resolve route for dedicated Raag page
  const getRagaView = (raga: RagaDetail): { view: AppView; path: string } | null => {
    const n = raga.name.toLowerCase();
    if (n.includes('bhupali') || n.includes('bhoopali')) return { view: 'raga_bhoopali', path: '/learn/raga-bhoopali' };
    if (n.includes('durga')) return { view: 'raga_durga', path: '/learn/raga-durga' };
    if (n.includes('yaman')) return { view: 'raga_yaman', path: '/learn/raga-yaman' };
    if (n.includes('hamsadhwani')) return { view: 'raga_hamsadhwani', path: '/learn/raga-hamsadhwani' };
    if (n.includes('bilawal') && !n.includes('alhaiya')) return { view: 'raga_bilawal', path: '/learn/raga-bilawal' };
    if (n.includes('brindavani') || n.includes('sarang')) return { view: 'raga_brindavani_sarang', path: '/learn/raga-brindavani-sarang' };
    if (n.includes('desh') && !n.includes('deshkar')) return { view: 'raga_desh', path: '/learn/raga-desh' };
    if (n.includes('kafi')) return { view: 'raga_kafi', path: '/learn/raga-kafi' };
    if (n.includes('bhimpalasi')) return { view: 'raga_bhimpalasi', path: '/learn/raga-bhimpalasi' };
    if (n.includes('bageshree')) return { view: 'raga_bageshree', path: '/learn/raga-bageshree' };
    if (n.includes('bhairav') && !n.includes('ahir')) return { view: 'raga_bhairav', path: '/learn/raga-bhairav' };
    if (n.includes('khamaj')) return { view: 'raga_khamaj', path: '/learn/raga-khamaj' };
    if (n.includes('bihag')) return { view: 'raga_bihag', path: '/learn/raga-bihag' };
    if (n.includes('malkauns')) return { view: 'raga_malkauns', path: '/learn/raga-malkauns' };
    if (n.includes('marwa')) return { view: 'raga_marwa', path: '/learn/raga-marwa' };
    if (n.includes('jog')) return { view: 'raga_jog', path: '/learn/raga-jog' };
    if (n.includes('todi')) return { view: 'raga_todi', path: '/learn/raga-todi' };
    if (n.includes('multani')) return { view: 'raga_multani', path: '/learn/raga-multani' };
    if (n.includes('pahadi')) return { view: 'raga_pahadi', path: '/learn/raga-pahadi' };
    if (n.includes('tilang')) return { view: 'raga_tilang', path: '/learn/raga-tilang' };
    if (n.includes('malhar')) return { view: 'raga_miyan_ki_malhar', path: '/learn/raga-miyan-ki-malhar' };
    if (n.includes('shivranjani')) return { view: 'raga_shivranjani', path: '/learn/raga-shivranjani' };
    if (n.includes('jaunpuri')) return { view: 'raga_jaunpuri', path: '/learn/raga-jaunpuri' };
    return null;
  };

  const targetView = getRagaView(selectedRaga);

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
        <div className="space-y-1">
          <label htmlFor="raga-guide-select" className="block text-xs font-bold text-bamboo-950 uppercase tracking-wider">
            Select Raga
          </label>
          <select
            id="raga-guide-select"
            value={selectedRaga.name}
            onChange={(e) => {
              const raga = LEARN_RAAGAS.find(r => r.name === e.target.value);
              if (raga) setSelectedRaga(raga);
            }}
            className="w-full px-4 py-2.5 min-h-[44px] bg-bamboo-50 text-bamboo-950 rounded-xl text-xs font-bold border border-bamboo-300 focus:ring-2 focus:ring-bamboo-600 cursor-pointer"
            aria-label="Select Raga"
          >
            {LEARN_RAAGAS.map((raga) => (
              <option key={raga.name} value={raga.name}>
                {raga.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Raga Detail Card */}
        <div className="bg-white/30 backdrop-blur-xs rounded-xl p-4 border border-white/40 space-y-3" id="raga-detail-container">
          <div className="flex justify-between items-start flex-wrap gap-2">
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
                
            <div className="flex items-center gap-1.5 flex-wrap">
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

          {/* Dedicated Raag Page Link */}
          {targetView && (
            <div className="pt-2 border-t border-bamboo-200/60 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-bamboo-900 font-medium">
                Full lesson &amp; practice audio available
              </span>
              <Link
                to={targetView.path}
                onClick={() => {
                  if (onViewChange) {
                    onViewChange(targetView.view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer group"
              >
                <span>Go to Raag Page</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
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
