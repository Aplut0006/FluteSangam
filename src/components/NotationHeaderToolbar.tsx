import React, { useState } from 'react';
import { Layers, ChevronDown, HelpCircle, ArrowDown } from 'lucide-react';

export interface QuickInfoData {
  difficulty?: string;
  suggestedFlute?: string;
  startingSwar?: string;
  highestSwar?: string;
  mainChallenge?: string;
  practiceSpeed?: string;
  [key: string]: any;
}

export interface NotationHeaderToolbarProps {
  quickInfo: QuickInfoData;
  songTitle?: string;
  movieName?: string;
  singerName?: string;
  noteText?: string;
  legendTargetId?: string;
}

export const NotationHeaderToolbar: React.FC<NotationHeaderToolbarProps> = ({
  quickInfo,
  songTitle = '',
  movieName = '',
  singerName = '',
  noteText = '',
  legendTargetId = 'notation-guide-legend'
}) => {
  const [showQuickInfo, setShowQuickInfo] = useState(false);

  const scrollToLegend = () => {
    const el = document.getElementById(legendTargetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const defaultNote = noteText || 'Note: Indian bansuri uses movable Sa; you can practice this melody comfortably on any scale flute (C Medium, D Medium, or E Bass).';

  return (
    <div className="space-y-3">
      {/* 1. Sleek Action Bar with Quick Info dropdown and Legend jump button */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-amber-200/90 shadow-2xs">
        {/* Quick Song Info Toggle Button */}
        <button
          type="button"
          onClick={() => setShowQuickInfo(prev => !prev)}
          aria-expanded={showQuickInfo}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer select-none ${
            showQuickInfo 
              ? 'bg-amber-100/90 text-amber-950 border-amber-300 shadow-2xs' 
              : 'bg-amber-50 hover:bg-amber-100/80 text-amber-950 border-amber-200/80'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Quick Song Information</span>
          <ChevronDown 
            className={`w-3.5 h-3.5 text-amber-700 transition-transform duration-200 ${
              showQuickInfo ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Notation Guide / Legend Scroll Button */}
        <button
          type="button"
          onClick={scrollToLegend}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg sm:rounded-xl bg-sand-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 text-xs sm:text-sm font-bold border border-amber-200/70 transition cursor-pointer select-none"
          title="Jump to notation symbols and guide at bottom of page"
        >
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notation Guide &amp; Legend</span>
          <ArrowDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        </button>
      </div>

      {/* 2. Dropdown Panel for Quick Song Information (Shown only when toggled) */}
      {showQuickInfo && (
        <section 
          aria-label="Quick song information"
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-200 shadow-sm space-y-3 sm:space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
            <h2 className="text-sm sm:text-base font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <span>Quick Song Information &amp; Flute Specifications</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowQuickInfo(false)}
              className="text-xs text-amber-800 hover:text-amber-950 font-bold px-2 py-1 rounded hover:bg-amber-50 transition cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full text-left text-[11px] sm:text-sm border-collapse font-sans">
              <thead>
                <tr className="border-b-2 border-amber-200 bg-amber-50/60 text-bamboo-950 font-bold">
                  <th scope="col" className="py-2 sm:py-2.5 px-3 sm:px-4 w-1/3">Detail</th>
                  <th scope="col" className="py-2 sm:py-2.5 px-3 sm:px-4">Information</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-gray-700 font-sans">
                {movieName && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Movie / Album</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold">{movieName}</td>
                  </tr>
                )}
                {singerName && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Singer &amp; Composer</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold">{singerName}</td>
                  </tr>
                )}
                {quickInfo?.difficulty && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Difficulty</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4">{quickInfo.difficulty}</td>
                  </tr>
                )}
                {quickInfo?.suggestedFlute && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Suggested Flute</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4">{quickInfo.suggestedFlute}</td>
                  </tr>
                )}
                {quickInfo?.startingSwar && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Starting Swar</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-mono font-bold text-amber-900">{quickInfo.startingSwar}</td>
                  </tr>
                )}
                {quickInfo?.highestSwar && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Highest Swar</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-mono font-bold text-amber-900">{quickInfo.highestSwar}</td>
                  </tr>
                )}
                {quickInfo?.mainChallenge && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Main Challenge</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4">{quickInfo.mainChallenge}</td>
                  </tr>
                )}
                {quickInfo?.practiceSpeed && (
                  <tr>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Practice Speed</td>
                    <td className="py-2 sm:py-2.5 px-3 sm:px-4">{quickInfo.practiceSpeed}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 italic pt-1 border-t border-amber-100">
            {defaultNote}
          </p>
        </section>
      )}
    </div>
  );
};

export default NotationHeaderToolbar;
