import React from 'react';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { AppView } from '../types';

interface AboutAuthorSectionProps {
  onViewChange?: (view: AppView) => void;
  className?: string;
}

export default function AboutAuthorSection({ onViewChange, className = '' }: AboutAuthorSectionProps) {
  const handleAboutUsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange('about_us');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/about-us';
    }
  };

  return (
    <div 
      aria-label="About the Author"
      className={`bg-gradient-to-br from-amber-50/90 via-white to-bamboo-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-3xs relative overflow-hidden my-6 transition-all hover:shadow-xs ${className}`}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-200/20 rounded-full blur-xl pointer-events-none -mr-8 -mt-8"></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
        {/* Author Avatar / Badge */}
        <div className="flex-shrink-0 relative">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-bamboo-800 via-bamboo-700 to-amber-600 text-white flex items-center justify-center shadow-xs border border-white ring-2 ring-amber-300/40">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider flex items-center gap-0.5">
            <Sparkles className="w-2 h-2" />
            Author
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-bold text-bamboo-950 font-display">
              About the Author
            </h4>
            
            <a
              href="/about-us"
              onClick={handleAboutUsClick}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-bamboo-800 hover:text-bamboo-950 bg-amber-100/90 hover:bg-amber-200 px-3 py-1 rounded-lg border border-amber-300/80 transition cursor-pointer shadow-3xs"
              title="Learn more about Aplut on the About Us page"
            >
              <span>About Us</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700" />
            </a>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed font-sans">
            <strong>Aplut</strong> is the Founder of FluteSangam, a global platform dedicated to the Indian bamboo flute (Bansuri). Through carefully crafted lessons, practice resources, raga guides, songs, and interactive tools, he aims to make flute learning accessible and enjoyable for enthusiasts worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
