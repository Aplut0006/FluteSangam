import React from 'react';
import { motion } from 'motion/react';
import { Mail, Music, Users, Compass, Wind, Sparkles, ArrowRight, MessageCircle, ExternalLink } from 'lucide-react';
import { AppView } from '../types';

interface AboutUsViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function AboutUsView({ onViewChange }: AboutUsViewProps = {}) {
  const handleFounderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange('founder');
    } else {
      window.location.href = '/founder';
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-display font-extrabold text-bamboo-900 mb-6"
        >
          About FluteSangam
        </motion.h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Welcome to FluteSangam—a global sanctuary for everyone captivated by the timeless, soulful music of the flute.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="frosted-panel p-8 rounded-3xl"
        >
          <Compass className="w-10 h-10 text-bamboo-700 mb-4" />
          <h2 className="text-2xl font-display font-bold text-bamboo-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Music brings people together, and the flute holds a special place in connecting hearts across borders. FluteSangam was born out of a simple vision: to make learning the flute simpler, better, and accessible to everyone worldwide.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="frosted-panel p-8 rounded-3xl"
        >
          <Wind className="w-10 h-10 text-bamboo-700 mb-4" />
          <h2 className="text-2xl font-display font-bold text-bamboo-900 mb-4">What We Strive For</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-3"><span className="font-bold text-bamboo-800">Learn & Grow:</span> Providing clear Sargam notations, beginner-friendly guides, and practical tools to simplify your practice sessions.</li>
            <li className="flex gap-3"><span className="font-bold text-bamboo-800">Connect Globally:</span> Building a worldwide community where flute players of all skill levels can share their experiences.</li>
            <li className="flex gap-3"><span className="font-bold text-bamboo-800">Foster Passion:</span> Creating an encouraging space that keeps your musical passion alive.</li>
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-bamboo-900 text-white p-10 rounded-3xl mb-16 text-center"
      >
        <h2 className="text-3xl font-display font-bold mb-6">Meet the Creator</h2>
        <p className="text-xl mb-6 italic">"The journey with the flute is endless, and every note brings its own peace."</p>
        <p className="text-lg font-bold mb-2">Aplut | Founder of FluteSangam</p>
        <p className="text-bamboo-200 mb-6 max-w-2xl mx-auto leading-relaxed">
          Aplut is the Founder of FluteSangam, a global platform dedicated to the Indian bamboo flute (Bansuri). Through carefully crafted lessons, practice resources, raga guides, songs, and interactive tools, he aims to make flute learning accessible and enjoyable for enthusiasts worldwide.
        </p>
        <a 
          href="/founder"
          onClick={handleFounderClick}
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-bamboo-950 px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm transition shadow-md hover:shadow-lg cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-bamboo-950" />
          <span>Read Aplut's Story</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <h2 className="text-3xl font-display font-bold text-bamboo-900 mb-6">Join the Sangam</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          "Sangam" means a confluence or merging point. FluteSangam is where music, community, and technology meet. We invite you to explore our guides, practice your favorite tunes, join our global WhatsApp community, and help us grow a vibrant worldwide flute family!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://chat.whatsapp.com/HwfFf145b2A7ieIUrytve2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-sm sm:text-base cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Join WhatsApp Community</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          <a 
            href="mailto:aplut0006@gmail.com"
            className="inline-flex items-center gap-2 bg-bamboo-700 hover:bg-bamboo-800 text-white px-7 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-sm sm:text-base cursor-pointer"
          >
            <Mail className="w-5 h-5" />
            <span>Contact Me</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
