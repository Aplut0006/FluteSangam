import React, { useState } from 'react';
import { AppView } from '../types';
import { 
  Wind, Search, Home, BookOpen, Music, Compass, 
  Sparkles, ArrowRight, HelpCircle, Radio, Sliders, FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface NotFoundViewProps {
  onViewChange?: (view: AppView, stateExtra?: any) => void;
  onSearchSubmit?: (query: string) => void;
}

export default function NotFoundView({ onViewChange, onSearchSubmit }: NotFoundViewProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchInput.trim());
      } else if (onViewChange) {
        onViewChange('community');
      }
    }
  };

  const quickLinks = [
    {
      title: 'Learn Flute Hub',
      desc: 'Step-by-step beginner guides & posture drills',
      icon: BookOpen,
      view: 'learn_dashboard' as AppView,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    },
    {
      title: 'Raag Lessons',
      desc: 'Master Bhoopali, Durga, Yaman & sargam compositions',
      icon: Music,
      view: 'learn_raagas' as AppView,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Fingering Chart',
      desc: 'Interactive swara positioning and audio notes',
      icon: Compass,
      view: 'learn_fingering_chart' as AppView,
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    },
    {
      title: 'Online Flute Tuner',
      desc: 'Real-time pitch detector & Tanpura drone',
      icon: Radio,
      view: 'learn_tuner' as AppView,
      color: 'bg-purple-500/10 text-purple-700 border-purple-200',
    },
    {
      title: 'Alankar Generator',
      desc: 'Custom sargam exercise patterns & metronome',
      icon: Sliders,
      view: 'alankar_generator' as AppView,
      color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    },
    {
      title: 'Song Notation Requests',
      desc: 'Browse or request sargam notes for songs',
      icon: FileText,
      view: 'notation_requests' as AppView,
      color: 'bg-teal-500/10 text-teal-700 border-teal-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm border border-bamboo-200 text-center relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bamboo-400/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Visual Badge / Graphic */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 via-amber-50 to-bamboo-100 rounded-3xl flex items-center justify-center shadow-inner border border-amber-200/80 mb-6 relative group"
          >
            <Wind className="w-10 h-10 sm:w-12 sm:h-12 text-amber-700 transition-transform duration-500 group-hover:rotate-12" />
            <span className="absolute -top-2 -right-2 bg-amber-800 text-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              404 Error
            </span>
          </motion.div>

          <span className="text-amber-800 font-bold text-xs sm:text-sm uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-3">
            Swara Not Found • Sub-Tone Missing
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-bamboo-950 font-display tracking-tight max-w-xl leading-tight mb-3">
            Lost in the Melodic Swaras?
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-lg mb-8 leading-relaxed">
            The page or lesson you requested seems to have drifted away like a gentle breeze through bamboo groves. Let's guide you back to the right pitch!
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search lessons, ragas, or community posts..."
                className="w-full pl-10 pr-24 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 w-full max-w-md">
            <button
              onClick={() => onViewChange?.('community')}
              className="flex-1 min-w-[160px] bg-bamboo-800 hover:bg-bamboo-900 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home Feed</span>
            </button>

            <button
              onClick={() => onViewChange?.('learn_dashboard')}
              className="flex-1 min-w-[160px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Flute Learning Hub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-100 my-2 mb-8 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Or Explore Popular Destinations
            </span>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full text-left">
            {quickLinks.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onViewChange?.(item.view)}
                  className="bg-gray-50/80 hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 rounded-2xl p-4 transition-all duration-200 flex items-start gap-3.5 text-left group cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${item.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-amber-900 transition-colors m-0 leading-snug">
                        {item.title}
                      </h3>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mt-0.5 m-0 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Contact Callout */}
          <div className="mt-10 p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-amber-950 m-0">Found a broken link or need help?</p>
                <p className="text-[11px] text-amber-800 m-0">Reach out to our community team for assistance or song requests.</p>
              </div>
            </div>
            <button
              onClick={() => onViewChange?.('contact_us')}
              className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shrink-0 cursor-pointer shadow-2xs"
            >
              Contact Support
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
