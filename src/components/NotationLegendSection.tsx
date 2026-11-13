import React from 'react';
import { useLocation } from 'react-router-dom';
import { Music, BookOpen, Sparkles, Wind } from 'lucide-react';
import { SONG_MUSICAL_ANALYSIS_DATA } from '../data/songMusicalAnalysisData';

export interface LegendItem {
  symbol: string;
  meaning: string;
}

export interface NotationLegendSectionProps {
  legend: LegendItem[];
  songSlug?: string;
  id?: string;
  className?: string;
}

export const NotationLegendSection: React.FC<NotationLegendSectionProps> = ({
  legend,
  songSlug,
  id = 'notation-guide-legend',
  className = ''
}) => {
  const location = useLocation();

  const resolvedSlug = React.useMemo(() => {
    if (songSlug) return songSlug;
    const cleanPath = (location.pathname || '').trim().replace(/\/+$/, '');
    if (cleanPath.startsWith('/notations/')) {
      const extracted = cleanPath.replace('/notations/', '');
      if (extracted === 'hothon-se-chhu-lo-tum-flute-notes') {
        return 'hothon-se-chhoo-lo-tum-flute-notes';
      }
      return extracted;
    }
    return '';
  }, [songSlug, location.pathname]);

  const musicalAnalysis = resolvedSlug ? SONG_MUSICAL_ANALYSIS_DATA[resolvedSlug] : undefined;

  if ((!legend || legend.length === 0) && !musicalAnalysis) return null;

  return (
    <>
      {musicalAnalysis && (
        <section
          aria-label="Musical Structure and Bansuri Expression Analysis"
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200/90 shadow-sm space-y-5 sm:space-y-6"
        >
          <div className="border-b border-amber-100 pb-3 sm:pb-4 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>In-Depth Musicological &amp; Technique Study</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 leading-snug">
              {musicalAnalysis.heading}
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-bamboo-950 font-display flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-700 shrink-0" />
                <span>1. {musicalAnalysis.ragaAndScaleTitle}</span>
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {musicalAnalysis.ragaAndScaleContext}
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-bamboo-50/50 border border-bamboo-200/70 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-bamboo-950 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>2. {musicalAnalysis.ornamentationTitle}</span>
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {musicalAnalysis.ornamentationAndArticulation}
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/30 border border-amber-200/60 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-bamboo-950 font-display flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>3. {musicalAnalysis.rhythmAndBreathTitle}</span>
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {musicalAnalysis.rhythmAndBreathArchitecture}
              </p>
            </div>
          </div>
        </section>
      )}

      {legend && legend.length > 0 && (
        <section 
          id={id} 
          aria-label="Notation reading guide"
          className={`scroll-mt-24 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200/80 shadow-2xs space-y-3 sm:space-y-4 ${className}`}
        >
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 shrink-0" />
            <h2 className="text-base sm:text-xl font-bold text-amber-950 font-display">
              Notation Symbols &amp; Reading Guide
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Understand the specific symbols, lower octave Mandra dots, grace touches, and half-hole notes used in this notation:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 pt-1 sm:pt-2">
            {legend.map((item, idx) => (
              <div key={idx} className="bg-sand-50/80 border border-amber-200/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="font-mono font-bold text-amber-900 text-xs sm:text-sm block">{item.symbol}</span>
                <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium leading-tight block mt-0.5">{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default NotationLegendSection;
