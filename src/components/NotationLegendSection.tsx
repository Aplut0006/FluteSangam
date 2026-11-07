import React from 'react';
import { Music } from 'lucide-react';

export interface LegendItem {
  symbol: string;
  meaning: string;
}

export interface NotationLegendSectionProps {
  legend: LegendItem[];
  id?: string;
  className?: string;
}

export const NotationLegendSection: React.FC<NotationLegendSectionProps> = ({
  legend,
  id = 'notation-guide-legend',
  className = ''
}) => {
  if (!legend || legend.length === 0) return null;

  return (
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
  );
};

export default NotationLegendSection;
