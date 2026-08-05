import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wind, Music, BookOpen, Clock, Sparkles, ArrowRight, Play, CheckCircle2, 
  Sliders, Radio, Award, Compass, MessageSquare, Plus, FileText, User, Users,
  Lightbulb, ShieldCheck, Calendar, Heart, HelpCircle, Search, Flame, ChevronRight,
  Volume2, Target, Mic, Layers, Activity
} from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface HomepageOverviewProps {
  onViewChange: (view: AppView) => void;
  onOpenAuth: () => void;
  onOpenCreatePost: () => void;
  currentUser: UserProfile | null;
}

export default function HomepageOverview({ 
  onViewChange, 
  onOpenAuth, 
  onOpenCreatePost, 
  currentUser 
}: HomepageOverviewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'learn' | 'ragas' | 'practice' | 'articles'>('all');

  // Featured Raagas Data (1 row of 3 cards)
  const featuredRaagas = [
    { 
      name: 'Raag Bhoopali', 
      thaat: 'Kalyan', 
      jati: 'Audav - Audav', 
      time: 'First quarter of night (7-10 PM)', 
      view: 'raga_bhoopali' as AppView, 
      difficulty: 'Beginner', 
      badge: 'Popular Starter',
      notes: 'S R G P D S\'',
      mood: 'Peaceful & Devotional',
      color: 'from-amber-500/10 to-bamboo-500/10'
    },
    { 
      name: 'Raag Yaman', 
      thaat: 'Kalyan', 
      jati: 'Sampurna - Sampurna', 
      time: 'Night (7-10 PM)', 
      view: 'raga_yaman' as AppView, 
      difficulty: 'Beginner', 
      badge: 'Essential Classical',
      notes: '\'N R G M\' P D N S\'',
      mood: 'Tranquil & Romantic',
      color: 'from-amber-500/10 to-orange-500/10'
    },
    { 
      name: 'Raag Bhimpalasi', 
      thaat: 'Kafi', 
      jati: 'Audav - Sampurna', 
      time: 'Afternoon (1-4 PM)', 
      view: 'raga_bhimpalasi' as AppView, 
      difficulty: 'Intermediate', 
      badge: 'Afternoon Devotion',
      notes: 'n S g M P n S\'',
      mood: 'Sweet Melancholy',
      color: 'from-bamboo-500/10 to-emerald-500/10'
    },
  ];

  // Latest Articles & Guides Data (1 row of 2 cards)
  const latestArticles = [
    {
      title: 'How to Master Breath Control & Long Notes (Swar Sadhana)',
      excerpt: 'Discover diaphragmatic breathing techniques, blowing pressure control, and daily 15-minute long note exercises for steady, rich flute tone.',
      readTime: '8 min read',
      date: 'August 5, 2026',
      category: 'Technique',
      targetView: 'learn_basics' as AppView,
      highlights: ['Diaphragmatic support', 'Tuning stability', '15-min daily routine']
    },
    {
      title: 'Choosing Your First Bansuri: C-Middle vs G-Natural Base',
      excerpt: 'Comprehensive comparison guide on hole spacing, embouchure size, blowing resistance, and key pitch recommendations for beginners.',
      readTime: '6 min read',
      date: 'August 4, 2026',
      category: 'Buying Guide',
      targetView: 'learn_choose_flute' as AppView,
      highlights: ['Finger stretch check', 'Bansuri scale choice', 'Blowing hole size']
    },
  ];

  // Learning Modules Data
  const learningModules = [
    {
      id: '01',
      title: 'Introduction to Bansuri',
      description: 'Discover history, bamboo selection, scale pitch basics, and posture essentials.',
      view: 'learn_intro' as AppView,
      icon: Wind,
      badge: 'Module 1',
      highlights: ['Bamboo Selection', 'Holding Posture', 'Pitch Scales']
    },
    {
      id: '02',
      title: 'Blowing & Sound Production',
      description: 'Master embouchure angle, blowing pressure, clear swara production & long note holding.',
      view: 'learn_basics' as AppView,
      icon: Volume2,
      badge: 'Module 2',
      highlights: ['Embouchure Angle', 'Long Note Holding', 'Tone Clarity']
    },
    {
      id: '03',
      title: 'Interactive Fingering Chart',
      description: 'Visual hole coverage diagrams for Shuddha & Komal swaras across 3 octaves with audio notes.',
      view: 'learn_fingering_chart' as AppView,
      icon: Activity,
      badge: 'Interactive',
      highlights: ['3 Octaves Covered', 'Komal & Teevra', 'Audio Previews']
    },
    {
      id: '04',
      title: 'How to Choose a Flute',
      description: 'Determine the right scale (C-Middle, A-Base, G-Base) for hand size and music style.',
      view: 'learn_choose_flute' as AppView,
      icon: Target,
      badge: 'Buying Guide',
      highlights: ['Hand Ergonomics', 'Scale Selection', 'Base vs Middle']
    },
  ];

  // Interactive Tools Data
  const interactiveTools = [
    {
      title: 'Interactive Alankar Generator',
      description: 'Generate customized sargam exercises for any scale with audio playback and speed controls.',
      view: 'alankar_generator' as AppView,
      icon: Sparkles,
      badge: 'Practice Engine',
      features: ['Audio Playback', 'BPM Speed Slider', 'Custom Pattern Builder'],
      gradient: 'from-amber-500/15 via-amber-400/5 to-transparent',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Online Flute Tuner & Tanpura',
      description: 'Tune your flute accurately using microphone frequency detection and background tanpura drone.',
      view: 'learn_tuner' as AppView,
      icon: Radio,
      badge: 'Live Audio',
      features: ['Mic Pitch Detect', 'Tanpura Drone (Sa-Pa)', 'Precision Cent Indicator'],
      gradient: 'from-amber-500/15 via-bamboo-500/5 to-transparent',
      borderColor: 'border-amber-200'
    },
    {
      title: '30-Min Daily Practice Routine',
      description: 'Structured sadhana breakdown: 10m Swar Sadhana, 10m Alankars, 10m Raga Chalan practice.',
      view: 'learn_daily_practice' as AppView,
      icon: Clock,
      badge: 'Daily Sadhana',
      features: ['10m Long Notes', '10m Speed Drills', '10m Raga Chalan'],
      gradient: 'from-amber-500/15 via-amber-400/5 to-transparent',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Song Sargam Requests',
      description: 'Request custom sargam sheet music for Bollywood, devotional, folk, or classical flute songs.',
      view: 'notation_requests' as AppView,
      icon: FileText,
      badge: 'Community Notation',
      features: ['Bollywood & Devotional', 'Verified Swaras', 'Community Requests'],
      gradient: 'from-amber-500/15 via-bamboo-500/5 to-transparent',
      borderColor: 'border-amber-200'
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-14" itemScope itemType="https://schema.org/EducationalOrganization">
      {/* SECTION 1: Welcome Purpose Banner */}
      <section className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-bamboo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] sm:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                <Wind className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Your Flute Journey Starts Here</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight" itemProp="name">
                Learn Flute, Connect with Flutists Worldwide
              </h1>

              <p className="text-xs sm:text-base text-amber-100/90 leading-relaxed font-sans max-w-2xl" itemProp="description">
                <strong>FluteSangam</strong> is an open educational platform dedicated to Indian Bamboo Flute (Bansuri) learning. Discover step-by-step beginner tutorials, interactive fingering charts, authentic Hindustani classical raga guides, daily alankar practice drills, online tuner tools, and a collaborative community feed.
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-lg space-y-3 shrink-0 lg:w-72 text-center lg:text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">Start Learning Now</span>
                <p className="text-xs text-white font-semibold">Join thousands of flute sadhakas practicing daily.</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onViewChange('learn_dashboard')}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-bamboo-950 font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Learning Hub</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('recent-discussions-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onViewChange('community');
                    }
                  }}
                  className="w-full py-2 px-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                  <span>Go to Discussions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Nav Pills Bar */}
          <div className="pt-4 border-t border-amber-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <span className="text-xs font-bold text-amber-300 shrink-0 uppercase tracking-wider mr-1 hidden sm:inline-block">Quick Sections:</span>
            <a href="#learn-flute-section" className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 rounded-xl text-xs font-semibold whitespace-nowrap border border-amber-400/30 transition flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Learn Flute</span>
            </a>
            <a href="#explore-raagas-section" className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 rounded-xl text-xs font-semibold whitespace-nowrap border border-amber-400/30 transition flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore Raagas</span>
            </a>
            <a href="#daily-practice-section" className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 rounded-xl text-xs font-semibold whitespace-nowrap border border-amber-400/30 transition flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span>Daily Practice</span>
            </a>
            <a href="#latest-articles-section" className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 rounded-xl text-xs font-semibold whitespace-nowrap border border-amber-400/30 transition flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Latest Articles</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: Learn Flute (Step-by-Step Fundamentals) */}
      <section id="learn-flute-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-200/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              Structured Curriculum
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
              Learn Flute &amp; Bansuri Fundamentals
            </h2>
            <p className="text-xs text-gray-600">
              Step-by-step learning modules designed for beginners, self-learners, and classical students.
            </p>
          </div>
          <button
            onClick={() => onViewChange('learn_dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition self-start sm:self-center cursor-pointer shadow-2xs group"
          >
            <span>View All Modules</span>
            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {learningModules.map((module, idx) => {
            const IconComp = module.icon;
            return (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => onViewChange(module.view)}
                className="bg-gradient-to-b from-white to-amber-50/30 rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-xl group-hover:bg-amber-400/15 transition-all pointer-events-none" />

                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-bold text-sm border border-amber-200 group-hover:bg-amber-800 group-hover:text-amber-100 transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-bamboo-950 text-base group-hover:text-amber-900 transition-colors leading-snug">
                      {module.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                      {module.description}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="pt-2 space-y-1.5 border-t border-amber-100/80">
                    {module.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950 transition-colors">
                  <span>Explore Module</span>
                  <div className="p-1.5 rounded-lg bg-amber-100/60 text-amber-800 group-hover:bg-amber-800 group-hover:text-amber-100 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Explore Raagas (Hindustani Classical Raga Directory) */}
      <section id="explore-raagas-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-200/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              <Music className="w-3.5 h-3.5 text-amber-700" />
              Classical Raga Directory
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
              Explore Hindustani Classical Raagas
            </h2>
            <p className="text-xs text-gray-600">
              In-depth guides featuring swara playback, Aaroh, Avaroh, Pakad, Chalan, Alankars, and practice pieces.
            </p>
          </div>
          <button
            onClick={() => onViewChange('learn_raagas')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition self-start sm:self-center cursor-pointer shadow-2xs group"
          >
            <span>View All 9 Raagas</span>
            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredRaagas.map((raga, idx) => (
            <motion.div
              key={raga.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onViewChange(raga.view)}
              className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group space-y-4 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Header Badge Strip */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {raga.badge}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    raga.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {raga.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-bamboo-950 text-xl group-hover:text-amber-900 transition-colors font-display">
                    {raga.name}
                  </h3>
                  <p className="text-[11px] text-amber-800 font-medium italic mt-0.5">
                    Mood: {raga.mood}
                  </p>
                </div>

                {/* Raaga Quick Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-amber-50/70 p-3 rounded-xl border border-amber-100/80">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Thaat</span>
                    <strong className="text-bamboo-950 font-semibold">{raga.thaat}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Jati</span>
                    <strong className="text-bamboo-950 font-semibold">{raga.jati}</strong>
                  </div>
                </div>

                {/* Swara Notes Preview */}
                <div className="bg-bamboo-950 text-amber-200 p-2.5 rounded-xl text-xs font-mono flex items-center justify-between border border-amber-800/40">
                  <span className="text-[10px] text-amber-400/80 uppercase tracking-widest font-sans font-bold">Aaroh:</span>
                  <span className="font-bold tracking-widest">{raga.notes}</span>
                </div>

                <p className="text-[11px] text-gray-600 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{raga.time}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950 transition-colors">
                <span>Explore {raga.name} Guide</span>
                <div className="p-1.5 rounded-lg bg-amber-100/60 text-amber-800 group-hover:bg-amber-800 group-hover:text-amber-100 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Daily Practice & Interactive Tools (Sadhana Hub) */}
      <section id="daily-practice-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-200/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              Sadhana &amp; Interactive Tools
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
              Daily Practice Routine &amp; Interactive Tools
            </h2>
            <p className="text-xs text-gray-600">
              Elevate your daily flute practice with real-time tuner, tanpura drone, alankar generator, and structured sadhana routines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {interactiveTools.map((tool, idx) => {
            const IconComp = tool.icon;
            return (
              <motion.div 
                key={tool.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => onViewChange(tool.view)}
                className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group space-y-4 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-amber-100/80 text-amber-900 rounded-xl border border-amber-200 group-hover:bg-amber-800 group-hover:text-amber-100 transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-bamboo-950 text-base group-hover:text-amber-900 transition-colors leading-snug">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                      {tool.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="pt-2 space-y-1.5 border-t border-amber-100/80">
                    {tool.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950 transition-colors">
                  <span>Launch Tool</span>
                  <div className="p-1.5 rounded-lg bg-amber-100/60 text-amber-800 group-hover:bg-amber-800 group-hover:text-amber-100 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: Latest Articles & Educational Flute Guides */}
      <section id="latest-articles-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-200/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Educational Flute Articles
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
              Latest Articles &amp; Expert Flute Guides
            </h2>
            <p className="text-xs text-gray-600">
              In-depth articles covering technique, instrument care, classical theory, and practice optimization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {latestArticles.map((article, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onViewChange(article.targetView)}
              className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group space-y-4 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-bamboo-950 text-lg sm:text-xl group-hover:text-amber-900 transition-colors leading-snug font-display">
                  {article.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Article Highlights */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {article.highlights.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-semibold text-bamboo-900 bg-amber-50/80 border border-amber-100 px-2 py-0.5 rounded-md">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950 transition-colors">
                <span>Read Full Article</span>
                <div className="p-1.5 rounded-lg bg-amber-100/60 text-amber-800 group-hover:bg-amber-800 group-hover:text-amber-100 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 6: FAQ & Verification Trust Banner for Google AdSense */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
              Why FluteSangam? Educational Integrity &amp; Quality
            </h2>
            <p className="text-xs text-gray-600 max-w-2xl">
              All music notations, raga details, and blowing exercises on FluteSangam are curated and verified by experienced Hindustani classical flute practitioners.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewChange('about_us')}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-bamboo-900 border border-amber-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              About FluteSangam
            </button>
            <button
              onClick={() => onViewChange('founder')}
              className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Founder Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
            <h3 className="font-bold text-bamboo-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Original Educational Content
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Every raga guide contains original swara notes, audio previews, alankars, and structured practice compositions created strictly for bamboo flute learners.
            </p>
          </div>

          <div className="p-4 bg-bamboo-50/50 rounded-2xl border border-bamboo-100 space-y-2">
            <h3 className="font-bold text-bamboo-900 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-bamboo-600" />
              Active Flutist Community
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with fellow learners, share audio recitals, ask technical questions, and receive constructive feedback on your daily sadhana.
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
            <h3 className="font-bold text-bamboo-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Free Interactive Tools
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Access real-time flute tuning tools, tanpura drone sound generators, fingering charts, and alankar drill generators with no cost or paywalls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

