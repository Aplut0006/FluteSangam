import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Wind, Music, Feather, ShoppingBag, Radio, CircleDot, Target, AlertTriangle, HelpCircle, Layers, Compass, FileText } from 'lucide-react';
import { AppView } from '../types';

interface LearnDashboardProps {
  onViewChange?: (view: AppView) => void;
}

export default function LearnDashboard({ onViewChange }: LearnDashboardProps) {
  const options = [
    { id: 'learn_intro', path: '/learn/intro', label: 'Introduction', icon: Wind, color: 'text-bamboo-600', desc: 'Origins, legacy & bansuri fundamentals' },
    { id: 'learn_choose_flute', path: '/learn/choose-flute', label: 'Choose the Right Flute', icon: ShoppingBag, color: 'text-emerald-600', desc: 'Scale guide for children, teens & adults' },
    { id: 'learn_basics', path: '/learn/basics', label: 'The Basics', icon: BookOpen, color: 'text-bamboo-700', desc: 'Embouchure, posture & finger grip' },
    { id: 'how_to_read_bansuri_notation', path: '/learn/how-to-read-bansuri-notation', label: 'Read Flute Notation', icon: FileText, color: 'text-amber-800', desc: 'Sargam symbols, Komal & Tivra notes, octaves, rhythm & ornaments' },
    { id: 'learn_fingering_chart', path: '/learn/fingering-chart', label: 'Fingering Chart', icon: CircleDot, color: 'text-amber-600', desc: 'Interactive scale selector, Sa Re Ga Ma notes & audio playback' },
    { id: 'learn_alankaras', path: '/learn/alankaras', label: 'Alankaras', icon: Feather, color: 'text-rose-600', desc: 'Essential daily warmups & exercises' },
    { id: 'learn_scales_octaves', path: '/learn/flute-scales-octaves', label: 'Flute Scales & Octaves', icon: Layers, color: 'text-amber-600', desc: 'Master Mandra, Madhya & Taar registers with audio notes & charts' },
    { id: 'learn_daily_practice', path: '/learn/daily-practice-guide', label: 'Daily Practice Guide', icon: Target, color: 'text-amber-600', desc: 'Complete daily routine for steady progress' },
    { id: 'learn_common_mistakes', path: '/learn/common-flute-mistakes', label: 'Common Flute Mistakes', icon: AlertTriangle, color: 'text-amber-700', desc: '15 common mistakes & step-by-step fixes for every player' },
    { id: 'budget_flutes', path: '/best-budget-flutes', label: 'Best Budget Flutes', icon: ShoppingBag, color: 'text-amber-600', desc: 'Affordable Bamboo & PVC bansuri recommendations for beginners' },
    { id: 'flute_faq', path: '/faq', label: 'Flute FAQ Center', icon: HelpCircle, color: 'text-amber-600', desc: 'Comprehensive Q&A knowledge base on flute, practice & raagas' },
    { id: 'note_key_converter', path: '/tools/flute-note-key-converter', label: 'Note & Key Converter', icon: Music, color: 'text-emerald-700', desc: 'Convert Swaras ⇄ Western Notes & explore cross-key relationships' },
    { id: 'find_song_scale', path: '/learn/how-to-find-scale-of-a-song-on-flute', label: 'Find Scale of a Song', icon: Compass, color: 'text-amber-700', desc: 'Ear training guide to identify key, tonic / Sa and melody on flute' },
    { id: 'learn_raagas', path: '/learn/raagas', label: 'Ragas', icon: Music, color: 'text-bamboo-800', desc: 'Classical Hindustani & Carnatic guides' },
    { id: 'learn_tuner', path: '/tuner', label: 'Flute Tuner', icon: Radio, color: 'text-amber-700', desc: 'Interactive live frequency & scale tuner (440Hz)' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-bamboo-900 mb-2">Learn Flute (Bansuri)</h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Step-by-step educational modules to master the Indian bamboo flute (Bansuri)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              key={option.id}
              to={option.path}
              onClick={() => {
                if (onViewChange) onViewChange(option.id as AppView);
              }}
              className="frosted-panel p-6 rounded-3xl flex flex-col items-center text-center hover:shadow-lg transition-all border border-bamboo-100/80 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-14 h-14 bg-bamboo-50/80 group-hover:bg-amber-100/80 rounded-2xl flex items-center justify-center mb-4 transition-colors border border-bamboo-200/50">
                <Icon className={`w-8 h-8 ${option.color}`} />
              </div>
              <h3 className="text-lg font-bold text-bamboo-900 mb-1">{option.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{option.desc}</p>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
