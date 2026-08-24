import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Wind, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  BookOpen, 
  Music, 
  Users, 
  Wrench, 
  FileText, 
  Globe, 
  Heart,
  HelpCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { AppView } from '../types';

interface AboutUsViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function AboutUsView({ onViewChange }: AboutUsViewProps = {}) {
  const handleNav = (view: AppView) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto py-10 px-4 sm:px-6"
    >
      {/* 1. H1 Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bamboo-100 text-bamboo-800 text-xs font-semibold mb-4 border border-bamboo-200">
          <Wind className="w-4 h-4 text-bamboo-700" />
          <span>The Flute Community</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-bamboo-950 tracking-tight mb-4">
          About FluteSangam
        </h1>
        <p className="text-base sm:text-lg text-amber-900/80 max-w-2xl mx-auto font-medium">
          A global community for people who love learning, playing, and exploring the flute.
        </p>
      </div>

      <div className="space-y-12 sm:space-y-16">

        {/* 2. Introduction */}
        <section className="bg-gradient-to-br from-amber-50/80 via-white to-bamboo-50/50 p-6 sm:p-10 rounded-3xl border border-bamboo-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-bamboo-100 text-bamboo-800">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              Introduction
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            <strong>FluteSangam</strong> is an open digital platform created for flute learners, players, teachers, and enthusiasts around the world. Whether you are picking up a flute for the first time, an adult learner balancing practice with a busy professional life, or an experienced musician refining your technique and improvisation, FluteSangam provides resources, tools, and a community to support your musical journey.
          </p>
        </section>

        {/* 3. Our Story */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              Our Story
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
            The story of FluteSangam began with a simple observation: learning the flute—especially traditional instruments like the Indian bamboo bansuri—has historically been fragmented, intimidating, and scattered across individual video tutorials, articles, and traditional learning environments.
          </p>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            The idea for FluteSangam came from recognizing how difficult it can be to find clear, structured guidance on embouchure, scale selection, Sargam notations, and Raga dynamics in one central, welcoming place. FluteSangam was created to bridge this gap, bringing timeless musical traditions together with modern interactive web technologies so anyone can learn with confidence.
          </p>
        </section>

        {/* 4. Meet the Founder */}
        <section className="bg-gradient-to-r from-bamboo-950 via-bamboo-900 to-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leadership & Vision</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Meet the Founder
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold text-amber-300 mb-4">
              Aplut
            </h3>
            <p className="text-bamboo-100 leading-relaxed text-base sm:text-lg mb-6 max-w-3xl">
              Aplut is the founder of FluteSangam. With a passion for both flute and technology, he created FluteSangam to make learning, practicing, and connecting with other flute players more accessible.
            </p>
            <a 
              href="/founder"
              onClick={handleNav('founder')}
              className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-bamboo-950 px-6 py-3 rounded-full font-extrabold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Read Aplut's Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* 5. Why FluteSangam Exists */}
        <section className="bg-amber-50/60 p-6 sm:p-10 rounded-3xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-900">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              Why FluteSangam Exists
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
            Most flute learners face a recurring set of obstacles: inconsistent practice routines, lack of structured song notations, difficulty finding accurate Raga information, and the isolation of practicing alone without feedback. Moreover, adult beginners often feel hesitant or fear starting late in life.
          </p>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            <strong>FluteSangam exists to solve these exact problems.</strong> By providing free interactive tools (like digital tuners, metronomes, and scale helpers), structured learning guides, organized Sargam notations, and a supportive community, we aim to reduce the barriers to flute learning so every player can experience the peace and fulfillment of music.
          </p>
        </section>

        {/* 6. What You Can Do on FluteSangam */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-bamboo-100 text-bamboo-800">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              What You Can Do on FluteSangam
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Learn Flute */}
            <div className="p-5 rounded-2xl bg-bamboo-50/60 border border-bamboo-200/60 hover:border-bamboo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-bamboo-700 text-white flex items-center justify-center mb-3 font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-bamboo-950 mb-2">Learn Flute</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access structured beginner guides, embouchure masterclasses, blowing techniques, scale selection tools, and adult learner roadmaps.
              </p>
            </div>

            {/* Explore Ragas */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 font-bold">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-bamboo-950 mb-2">Explore Ragas</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore classical Hindustani Ragas such as Bhupali, Yaman, Desh, Bageshree, and Bilawal, with Aroha, Avroha, Pakad, traditional performance times, and original practice pieces.
              </p>
            </div>

            {/* Practice */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-bamboo-950 mb-2">Practice</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Follow daily Sadhana routines, Kharaj (low-note) long-breath exercises, Alankar patterns, speed building, and habit tracking.
              </p>
            </div>

            {/* Use Interactive Tools */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/60 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-bamboo-950 mb-2">Use Interactive Tools</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Utilize in-browser chromatic tuners, metronomes, scale decision tools, and interactive fingering charts.
              </p>
            </div>

            {/* Explore Sargam & Notations */}
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/60 hover:border-purple-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-bamboo-950 mb-2">Explore Sargam & Notations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Browse a rich repository of organized Sargam song notations for popular melodies, Bollywood classics, devotional bhajans, and folk tunes.
              </p>
            </div>

            {/* Connect with Other Flutists */}
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/60 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-3 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-bamboo-950 mb-2">Connect with Other Flutists</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Engage in community feeds, ask technique questions, post practice audio/video clips, exchange feedback, and join our WhatsApp group.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Our Vision */}
        <section className="bg-gradient-to-br from-bamboo-900 to-bamboo-950 text-white p-6 sm:p-10 rounded-3xl shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-400 text-bamboo-950 font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">
              Our Vision
            </h2>
          </div>
          <p className="text-bamboo-100 leading-relaxed text-lg sm:text-xl font-medium">
            A place where flute players can learn, practice, share and connect.
          </p>
          <p className="text-bamboo-200 leading-relaxed text-base mt-3">
            Our vision is to build a supportive and interconnected platform where flute players from every corner of the earth can learn without barriers, practice with precision, share their progress openly, and connect through their shared love for flute music.
          </p>
        </section>

        {/* 8. Built for Flute Players Worldwide */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              Built for Flute Players Worldwide
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
            Although FluteSangam has strong roots in the Indian bamboo bansuri and Hindustani classical music, <strong>the platform warmly welcomes flute players with all musical backgrounds and instruments from around the globe</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            Whether you play the Western silver transverse flute, Native American flute, Xiao, Shakuhachi, Irish tin whistle, recorder, or Andean Quena, music is a universal language. While different flute traditions have their own techniques and musical languages, breath control, tone production, practice, and musical expression are experiences shared by flute players around the world.
          </p>
        </section>

        {/* 9. Community */}
        <section className="bg-emerald-50/70 p-6 sm:p-10 rounded-3xl border border-emerald-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-200 text-emerald-900">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              Community
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">
            The heart of FluteSangam is its thriving social community. Music is best experienced when shared. Through our interactive community feed, members can post audio and video recordings of their daily practice, receive encouraging feedback from fellow flutists, ask technique questions, and stay inspired.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs">
            <div className="flex-1">
              <h3 className="font-bold text-bamboo-950 text-lg mb-1">Join Our WhatsApp Family</h3>
              <p className="text-sm text-gray-600">Connect in real time with fellow flutists, ask questions, and share recordings.</p>
            </div>
            <a 
              href="https://chat.whatsapp.com/HwfFf145b2A7ieIUrytve2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md text-sm shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </section>

        {/* 10. Explore FluteSangam */}
        <section className="bg-gradient-to-br from-amber-100/70 via-bamboo-100/60 to-emerald-100/70 p-6 sm:p-10 rounded-3xl border border-bamboo-200/80 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950 mb-3">
            Explore FluteSangam
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto mb-8 text-base">
            Start your journey today! Dive into our structured learning modules, practice tools, classical Raga guides, and community channels.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            <a 
              href="/learn"
              onClick={handleNav('learn_dashboard')}
              className="p-3.5 bg-white hover:bg-bamboo-50 rounded-2xl border border-bamboo-200/80 font-bold text-bamboo-900 text-xs sm:text-sm flex flex-col items-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-bamboo-700" />
              <span>Learn Flute</span>
            </a>

            <a 
              href="/learn/raagas"
              onClick={handleNav('learn_raagas')}
              className="p-3.5 bg-white hover:bg-amber-50 rounded-2xl border border-amber-200/80 font-bold text-amber-900 text-xs sm:text-sm flex flex-col items-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <Music className="w-5 h-5 text-amber-600" />
              <span>Explore Ragas</span>
            </a>

            <a 
              href="/learn/daily-practice-guide"
              onClick={handleNav('learn_daily_practice')}
              className="p-3.5 bg-white hover:bg-emerald-50 rounded-2xl border border-emerald-200/80 font-bold text-emerald-900 text-xs sm:text-sm flex flex-col items-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <Wind className="w-5 h-5 text-emerald-600" />
              <span>Practice Tools</span>
            </a>

            <a 
              href="/notations"
              onClick={handleNav('notation_requests')}
              className="p-3.5 bg-white hover:bg-purple-50 rounded-2xl border border-purple-200/80 font-bold text-purple-900 text-xs sm:text-sm flex flex-col items-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Sargam Library</span>
            </a>

            <a 
              href="/faq"
              onClick={handleNav('flute_faq')}
              className="p-3.5 bg-white hover:bg-blue-50 rounded-2xl border border-blue-200/80 font-bold text-blue-900 text-xs sm:text-sm flex flex-col items-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Flute FAQ</span>
            </a>

            <a 
              href="/#recent-discussions-section"
              onClick={handleNav('community')}
              className="p-3.5 bg-white hover:bg-teal-50 rounded-2xl border border-teal-200/80 font-bold text-teal-900 text-xs sm:text-sm flex flex-col items-center gap-2 transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <Users className="w-5 h-5 text-teal-600" />
              <span>Community</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free & Open Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Structured Music Resources</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Flute Community</span>
          </div>
        </section>

      </div>
    </motion.div>
  );
}
