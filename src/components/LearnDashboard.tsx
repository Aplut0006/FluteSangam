import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Wind, Music, Feather } from 'lucide-react';
import { AppView } from '../types';

interface LearnDashboardProps {
  onViewChange: (view: AppView) => void;
}

export default function LearnDashboard({ onViewChange }: LearnDashboardProps) {
  const options = [
    { id: 'learn_intro', label: 'Introduction', icon: Wind, color: 'text-bamboo-600' },
    { id: 'learn_basics', label: 'Basics', icon: BookOpen, color: 'text-amber-600' },
    { id: 'learn_alankaras', label: 'Alankaras', icon: Feather, color: 'text-rose-600' },
    { id: 'learn_raagas', label: 'Ragas', icon: Music, color: 'text-bamboo-800' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto py-12 px-6"
    >
      <h2 className="text-3xl font-display font-bold text-bamboo-900 mb-8 text-center">Learn Flute</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(option.id as AppView)}
              className="frosted-panel p-6 rounded-3xl flex flex-col items-center gap-4 text-center hover:shadow-lg transition-all"
            >
              <Icon className={`w-12 h-12 ${option.color}`} />
              <span className="text-lg font-bold text-bamboo-900">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
