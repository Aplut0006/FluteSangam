import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Wind, Music, Feather, ShoppingBag, Radio, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface LearnDashboardProps {
  onViewChange: (view: AppView) => void;
}

export default function LearnDashboard({ onViewChange }: LearnDashboardProps) {
  const options = [
    { id: 'learn_intro', label: 'Introduction', icon: Wind, color: 'text-bamboo-600', desc: 'Origins, legacy & bansuri fundamentals' },
    { id: 'learn_choose_flute', label: 'Choose the Right Flute', icon: ShoppingBag, color: 'text-emerald-600', desc: 'Scale guide for children, teens & adults' },
    { id: 'learn_basics', label: 'The Basics', icon: BookOpen, color: 'text-bamboo-700', desc: 'Embouchure, posture & finger grip' },
    { id: 'learn_alankaras', label: 'Alankaras', icon: Feather, color: 'text-rose-600', desc: 'Essential daily warmups & exercises' },
    { id: 'learn_raagas', label: 'Ragas', icon: Music, color: 'text-bamboo-800', desc: 'Classical Hindustani & Carnatic guides' },
    { id: 'learn_tuner', label: 'Flute Tuner', icon: Radio, color: 'text-amber-700', desc: 'Interactive live frequency & scale tuner (440Hz)' },
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
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(option.id as AppView)}
              className="frosted-panel p-6 rounded-3xl flex flex-col items-center text-center hover:shadow-lg transition-all border border-bamboo-100/80 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-bamboo-50/80 group-hover:bg-amber-100/80 rounded-2xl flex items-center justify-center mb-4 transition-colors border border-bamboo-200/50">
                <Icon className={`w-8 h-8 ${option.color}`} />
              </div>
              <h3 className="text-lg font-bold text-bamboo-900 mb-1">{option.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{option.desc}</p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
