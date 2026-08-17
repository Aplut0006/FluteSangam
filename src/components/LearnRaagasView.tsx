import React, { useState, useRef } from 'react';
import { 
  BookOpen, Filter, Music, Sun, Moon, Calendar, Clock, CheckCircle2, 
  ArrowRight, Sparkles, Search, Volume2, Play, Compass, Feather, 
  Layers, Heart, Award, Check, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LEARN_RAAGAS, RaagaDetails } from '../data/learnRaagasData';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

type Difficulty = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
type ConceptTab = 'grammar' | 'microtones' | 'time' | 'rasa';

interface LearnRaagasViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function LearnRaagasView({ onViewChange }: LearnRaagasViewProps) {
  const [filter, setFilter] = useState<Difficulty>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ConceptTab>('grammar');
  const [playingRaagaName, setPlayingRaagaName] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const raagas = LEARN_RAAGAS;

  // Search & Filter Logic
  // When a filter is selected (e.g., Beginner), search strictly filters within that selected filter
  const filteredRaagas = raagas.filter(r => {
    const matchesFilter = filter === 'All' || r.level === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      r.name.toLowerCase().includes(q) ||
      r.aaroh.toLowerCase().includes(q) ||
      r.avroh.toLowerCase().includes(q) ||
      r.vadi.toLowerCase().includes(q) ||
      r.samvadi.toLowerCase().includes(q) ||
      r.pakad.toLowerCase().includes(q) ||
      r.time.toLowerCase().includes(q) ||
      r.mood.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.level.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // Featured Step-by-Step Guides list with Level metadata
  const featuredGuides = [
    { name: 'Raag Bhoopali', view: 'raga_bhoopali', title: 'Prabhat Prerna', level: 'Beginner', color: 'bg-amber-600 hover:bg-amber-700' },
    { name: 'Raag Durga', view: 'raga_durga', title: 'Shant Dhara', level: 'Beginner', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { name: 'Raag Yaman', view: 'raga_yaman', title: 'Sandhya Prakash', level: 'Beginner', color: 'bg-amber-700 hover:bg-amber-800' },
    { name: 'Raag Hamsadhwani', view: 'raga_hamsadhwani', title: 'Udaya Sur', level: 'Beginner', color: 'bg-rose-600 hover:bg-rose-700' },
    { name: 'Raag Bilawal', view: 'raga_bilawal', title: 'Pratah Sur', level: 'Beginner', color: 'bg-amber-800 hover:bg-amber-900' },
    { name: 'Raag Brindavani Sarang', view: 'raga_brindavani_sarang', title: 'Vrindavan Prabhat', level: 'Beginner', color: 'bg-teal-600 hover:bg-teal-700' },
    { name: 'Raag Desh', view: 'raga_desh', title: 'Sandhya Vihar', level: 'Intermediate', color: 'bg-orange-700 hover:bg-orange-800' },
    { name: 'Raag Kafi', view: 'raga_kafi', title: 'Komal Sur Lahari', level: 'Intermediate', color: 'bg-bamboo-800 hover:bg-bamboo-900' },
    { name: 'Raag Bhimpalasi', view: 'raga_bhimpalasi', title: 'Madhur Vela', level: 'Intermediate', color: 'bg-amber-800 hover:bg-amber-900' },
    { name: 'Raag Bageshree', view: 'raga_bageshree', title: 'Nisha Dhwani', level: 'Intermediate', color: 'bg-purple-700 hover:bg-purple-800' },
    { name: 'Raag Bhairav', view: 'raga_bhairav', title: 'Pratah Dhyan', level: 'Intermediate', color: 'bg-orange-700 hover:bg-orange-800' },
    { name: 'Raag Khamaj', view: 'raga_khamaj', title: 'Madhur Milan', level: 'Intermediate', color: 'bg-rose-800 hover:bg-rose-900' },
    { name: 'Raag Bihag', view: 'raga_bihag', title: 'Sandhya Madhurya', level: 'Intermediate', color: 'bg-amber-700 hover:bg-amber-800' },
    { name: 'Raag Malkauns', view: 'raga_malkauns', title: 'Nisha Dhyan', level: 'Intermediate', color: 'bg-indigo-800 hover:bg-indigo-900' },
    { name: 'Raag Marwa', view: 'raga_marwa', title: 'Sandhya Dhyan', level: 'Advanced', color: 'bg-rose-700 hover:bg-rose-800' },
    { name: 'Raag Jog', view: 'raga_jog', title: 'Nisha Gambhirya', level: 'Advanced', color: 'bg-indigo-900 hover:bg-indigo-950' },
    { name: 'Raag Todi', view: 'raga_todi', title: 'Pratah Dhyan', level: 'Advanced', color: 'bg-amber-800 hover:bg-amber-900' },
    { name: 'Raag Multani', view: 'raga_multani', title: 'Madhya Bhaag', level: 'Advanced', color: 'bg-amber-900 hover:bg-amber-950' },
    { name: 'Raag Pahadi', view: 'raga_pahadi', title: 'Himalayan Lok Sur', level: 'Intermediate', color: 'bg-emerald-800 hover:bg-emerald-900' },
    { name: 'Raag Tilang', view: 'raga_tilang', title: 'Madhur Tilang', level: 'Intermediate', color: 'bg-amber-700 hover:bg-amber-800' },
    { name: 'Raag Miyan Ki Malhar', view: 'raga_miyan_ki_malhar', title: 'Varsha Dhyan', level: 'Advanced', color: 'bg-sky-800 hover:bg-sky-900' },
  ];

  // Featured Guides filtered according to chosen level filter & search
  const filteredFeaturedGuides = featuredGuides.filter(guide => {
    const matchesFilter = filter === 'All' || guide.level === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      guide.name.toLowerCase().includes(q) || 
      guide.title.toLowerCase().includes(q) || 
      guide.level.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300/60 dark:text-emerald-400';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-800 border-amber-300/60 dark:text-amber-400';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-800 border-purple-300/60 dark:text-purple-400';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-300';
    }
  };

  const getTimeIcon = (time: string) => {
    const t = time.toLowerCase();
    if (t.includes('morning') || t.includes('dawn') || t.includes('pratah')) {
      return <Sun className="w-3.5 h-3.5 text-amber-500" />;
    } else if (t.includes('night') || t.includes('evening') || t.includes('sandhya')) {
      return <Moon className="w-3.5 h-3.5 text-amber-600" />;
    }
    return <Compass className="w-3.5 h-3.5 text-teal-500" />;
  };

  // Helper to parse swara tokens into visual chips
  const renderSwaraChips = (swaraStr: string, isAaroh = true) => {
    const tokens = swaraStr.split(/[\s,]+/).filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {tokens.map((token, i) => {
          const isKomal = token.toLowerCase().includes('komal');
          const isTivra = token.toLowerCase().includes('tivra') || token.toLowerCase().includes('m(tivra)');

          let cleanName = token
            .replace(/\(komal\)/gi, '♭')
            .replace(/\(tivra\)/gi, '♯')
            .replace(/\(lower\)/gi, '↓')
            .replace(/'/g, '′');

          return (
            <span
              key={i}
              className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                isKomal
                  ? 'bg-rose-50 text-rose-800 border-rose-200 shadow-2xs'
                  : isTivra
                  ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs'
                  : 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80 shadow-2xs'
              }`}
            >
              {cleanName}
            </span>
          );
        })}
      </div>
    );
  };

  // Swara Audio Player Synthesis
  const playRaagaAudio = (raagaName: string, aarohStr: string) => {
    if (playingRaagaName === raagaName) {
      setPlayingRaagaName(null);
      return;
    }

    setPlayingRaagaName(raagaName);

    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Map swara tokens to base frequency ratios relative to Sa = C4 (261.63 Hz)
      const baseSa = 261.63;
      const freqMap: Record<string, number> = {
        'sa': baseSa,
        're(komal)': baseSa * 1.05946,
        're': baseSa * 1.12246,
        'ga(komal)': baseSa * 1.18921,
        'ga': baseSa * 1.25992,
        'ma': baseSa * 1.33484,
        'ma(tivra)': baseSa * 1.41421,
        'pa': baseSa * 1.49831,
        'dha(komal)': baseSa * 1.58740,
        'dha': baseSa * 1.68179,
        'ni(komal)': baseSa * 1.78180,
        'ni': baseSa * 1.88775,
        "sa'": baseSa * 2.0,
        // Short forms
        's': baseSa,
        'r': baseSa * 1.12246,
        'g': baseSa * 1.25992,
        'm': baseSa * 1.33484,
        'p': baseSa * 1.49831,
        'd': baseSa * 1.68179,
        'n': baseSa * 1.88775,
        "s'": baseSa * 2.0
      };

      const tokens = aarohStr.split(/[\s,]+/).filter(Boolean);
      let startTime = ctx.currentTime + 0.1;

      tokens.forEach((token, idx) => {
        const cleanKey = token.toLowerCase().trim();
        const freq = freqMap[cleanKey] || baseSa * (1 + idx * 0.12);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine'; // Pure bamboo flute-like tone
        osc.frequency.setValueAtTime(freq, startTime);

        // Envelope for soft breath attack & gentle decay
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);

        startTime += 0.42;
      });

      setTimeout(() => {
        setPlayingRaagaName(null);
      }, (tokens.length * 420) + 300);

    } catch (err) {
      console.error('Audio playback error:', err);
      setPlayingRaagaName(null);
    }
  };

  const getGuideRouteForRaag = (name: string): AppView | null => {
    const n = name.toLowerCase();
    if (n.includes('bhupali') || n.includes('bhoopali')) return 'raga_bhoopali';
    if (n.includes('durga')) return 'raga_durga';
    if (n.includes('yaman')) return 'raga_yaman';
    if (n.includes('hamsadhwani')) return 'raga_hamsadhwani';
    if (n.includes('bilawal') && !n.includes('alhaiya')) return 'raga_bilawal';
    if (n.includes('brindavani') || n.includes('sarang')) return 'raga_brindavani_sarang';
    if (n.includes('desh')) return 'raga_desh';
    if (n.includes('kafi')) return 'raga_kafi';
    if (n.includes('bhimpalasi')) return 'raga_bhimpalasi';
    if (n.includes('bageshree')) return 'raga_bageshree';
    if (n.includes('bhairav')) return 'raga_bhairav';
    if (n.includes('khamaj')) return 'raga_khamaj';
    if (n.includes('bihag')) return 'raga_bihag';
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" itemScope itemType="https://schema.org/LearningResource">
      
      {/* Dynamic Animated Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-bamboo-950 to-stone-900 text-white p-6 md:p-10 shadow-xl border border-amber-500/20"
      >
        {/* Background Ambient Glowing Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-900/90 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                  <Music className="w-8 h-8 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div>
                <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Indian Classical Music Heritage
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white" itemProp="headline">
                  Classical Raagas
                </h1>
              </div>
            </div>

            {/* Microdata Signals & Timestamps */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-amber-100/90 bg-amber-950/60 border border-amber-500/30 backdrop-blur-md rounded-2xl px-4 py-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200/80">Published:</span>
                <time itemProp="datePublished" dateTime="2026-07-26T00:00:00Z" className="font-semibold text-white">
                  Jul 26, 2026
                </time>
              </div>
              <span className="text-amber-500/60">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200/80">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-08-10T02:46:00Z" className="font-semibold text-white">
                  August 10, 2026
                </time>
              </div>
            </div>
          </div>

          <p className="text-amber-100/90 text-base md:text-lg max-w-3xl leading-relaxed font-light">
            In Indian classical music, a <strong className="text-amber-300 font-semibold">Raaga</strong> is an acoustic framework designed to <em className="italic text-white">"color the mind"</em> and evoke deep emotional states (<strong className="text-emerald-300 font-semibold">Rasa</strong>). Explore structural grammar, swara scales, signature pakad phrases, and step-by-step flute guides.
          </p>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-2xl font-black text-amber-400 font-mono">15+</span>
              <p className="text-xs text-amber-200/80 font-medium">Core Classical Raags</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-2xl font-black text-emerald-400 font-mono">15</span>
              <p className="text-xs text-amber-200/80 font-medium">Full Flute Guides</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-2xl font-black text-amber-300 font-mono">3</span>
              <p className="text-xs text-amber-200/80 font-medium">Skill Level Tiers</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-2xl font-black text-rose-400 font-mono">22</span>
              <p className="text-xs text-amber-200/80 font-medium">Microtonal Shrutis</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Concept Pillars Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Mastering Raga Theory & Pillars
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a pillar below to explore structural rules, microtones, time cycles, and emotional rasa.
            </p>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {[
              { id: 'grammar', label: '1. Grammar', icon: Layers },
              { id: 'microtones', label: '2. Microtones', icon: Feather },
              { id: 'time', label: '3. Time Cycle', icon: Clock },
              { id: 'rasa', label: '4. Emotional Rasa', icon: Heart },
            ].map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as ConceptTab)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-amber-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeConceptTab"
                      className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl border border-amber-200/80 dark:border-slate-600 shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
          >
            {activeTab === 'grammar' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-amber-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-amber-100 dark:border-slate-700">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300 text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Scale Grammar & Direction
                  </h3>
                  <ul className="space-y-3 text-xs md:text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                      <span><strong>Aroha &amp; Avroha:</strong> The linear path ascending up the scale and descending down. Paths can be straight or <em>Vakra</em> (zig-zag).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                      <span><strong>Varjit Swaras:</strong> Strictly prohibited notes. Omitting a single note transforms the entire scale and character.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4 bg-amber-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-amber-100 dark:border-slate-700">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300 text-base flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    Key Notes & Signature Phrase
                  </h3>
                  <ul className="space-y-3 text-xs md:text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                      <span><strong>Vadi (King Note) &amp; Samvadi (Queen Note):</strong> The sonic center of gravity held longest, anchored usually a 4th or 5th interval apart.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                      <span><strong>Pakad (Signature Phrase):</strong> The iconic note sequence that instantly reveals the Raaga's identity to listeners.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'microtones' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-emerald-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-emerald-100 dark:border-slate-700">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-base flex items-center gap-2">
                    <Feather className="w-4 h-4 text-emerald-600" />
                    22 Shrutis (Microtonal Intervals)
                  </h3>
                  <p className="text-xs md:text-sm">
                    While Western music divides an octave into 12 equal semitones, Indian classical music identifies 22 distinct microtonal pitches. For example, the Komal Re in morning Raag Todi is played microtonally flatter than in Raag Bhairav.
                  </p>
                </div>

                <div className="space-y-3 bg-rose-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-rose-100 dark:border-slate-700">
                  <h3 className="font-bold text-rose-900 dark:text-rose-300 text-base flex items-center gap-2">
                    <Music className="w-4 h-4 text-rose-600" />
                    Flute Ornamentations (Alankars)
                  </h3>
                  <ul className="space-y-2 text-xs md:text-sm">
                    <li><strong>Meend:</strong> Continuous gliding sweep between notes without sound gaps.</li>
                    <li><strong>Andolan:</strong> Controlled, gentle wave-like oscillation on specific notes.</li>
                    <li><strong>Kan Swara:</strong> Subtle grace note touching neighboring pitches.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'time' && (
              <div className="bg-gradient-to-r from-amber-500/10 via-slate-100 dark:via-slate-800 to-orange-500/10 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Samay Chakra (24-Hour Time & Seasonal Cycle)
                </h3>
                <p className="text-xs md:text-sm leading-relaxed">
                  Raagas are tied to nature and circadian energy. The day is divided into eight <strong>Prahars</strong> (3-hour slots). Morning Raags (e.g., Bhairav) induce awakening and meditation, while late night Raags (e.g., Darbari) evoke gravity and rest. Seasonal Raagas like <em>Miyan Malhar</em> celebrate monsoon rains!
                </p>
              </div>
            )}

            {activeTab === 'rasa' && (
              <div className="bg-purple-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-purple-100 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-purple-900 dark:text-purple-300 text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  The Emotional Essence (Navarasa)
                </h3>
                <p className="text-xs md:text-sm leading-relaxed">
                  Grammar exists to serve <strong>Rasa</strong> (emotional essence). Among the nine classical emotions (<em>Shanti</em> - Peace, <em>Shringar</em> - Romance, <em>Veer</em> - Heroism, <em>Karuna</em> - Pathos), a master Bansuri player uses the Raaga framework to guide both musician and listener into shared meditation.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="raagas-search-input" className="sr-only">
            Search raaga by name, swaras, time, or mood
          </label>
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="raagas-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search raaga by name, swaras, time, or mood..."
            className="w-full pl-10 pr-12 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
            aria-label="Search raaga by name, swaras, time, or mood"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Clear raaga search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-amber-600 shrink-0 mr-1 hidden sm:block" />
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(lvl => {
            const isSelected = filter === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`relative px-3.5 py-2.5 min-h-[44px] flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'text-white bg-amber-800 shadow-md shadow-amber-800/20'
                    : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Raga Guides Spotlight Hub - Filters dynamically according to filter chosen */}
      <AnimatePresence>
        {filteredFeaturedGuides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-emerald-500/10 border border-amber-300/60 dark:border-amber-500/30 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">
                  Featured Step-by-Step Raga Flute Guides
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-700">
                {filteredFeaturedGuides.length} {filter !== 'All' ? `${filter} ` : ''}Guide{filteredFeaturedGuides.length === 1 ? '' : 's'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore step-by-step guides complete with Swara pitch audio playback, 45-min practice routines, metronome, original compositions, and notation sheets.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {filteredFeaturedGuides.map((guide, idx) => (
                <button
                  key={idx}
                  onClick={() => onViewChange?.(guide.view as AppView)}
                  className={`${guide.color} text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer group hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span>{guide.name} ("{guide.title}")</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Raagas Grid List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
          <span>
            SHOWING {filteredRaagas.length} CLASSICAL RAAGA{filteredRaagas.length === 1 ? '' : 'S'}
            {filter !== 'All' ? ` (${filter.toUpperCase()})` : ''}
            {searchQuery ? ` - SEARCH: "${searchQuery}"` : ''}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear search filter
            </button>
          )}
        </div>

        <div className="grid gap-6">
          {filteredRaagas.map((raaga, idx) => {
            const guideRoute = getGuideRouteForRaag(raaga.name);
            const isPlaying = playingRaagaName === raaga.name;

            return (
              <motion.div
                key={`${raaga.name}-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all group relative overflow-hidden"
              >
                {/* Top Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold shrink-0">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black font-display text-slate-900 dark:text-white m-0 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {raaga.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          {getTimeIcon(raaga.time)}
                          {raaga.time}
                        </span>
                        <span>•</span>
                        <span className="italic text-slate-600 dark:text-slate-300 font-medium">
                          Mood: {raaga.mood}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Audio Play Scale Button */}
                    <button
                      onClick={() => playRaagaAudio(raaga.name, raaga.aaroh)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                        isPlaying
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs animate-pulse'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                      }`}
                      title="Play C# Flute Scale Audio Preview"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlaying ? 'Playing Swaras...' : 'Listen Scale'}</span>
                    </button>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelBadgeStyle(raaga.level)}`}>
                      {raaga.level}
                    </span>
                  </div>
                </div>

                {/* Swara Details Breakdown Grid */}
                <div className="grid md:grid-cols-2 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 text-xs md:text-sm">
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Aaroh (Ascent)</span>
                    </div>
                    {renderSwaraChips(raaga.aaroh, true)}
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Avroh (Descent)</span>
                    </div>
                    {renderSwaraChips(raaga.avroh, false)}
                  </div>
                </div>

                {/* Vadi, Samvadi & Pakad Banner */}
                <div className="grid sm:grid-cols-3 gap-3 py-4 text-xs">
                  <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-0.5">Vadi (King Note)</span>
                    <span className="text-sm font-extrabold text-amber-950 dark:text-amber-200">{raaga.vadi}</span>
                  </div>

                  <div className="bg-orange-50/60 dark:bg-orange-950/30 p-3 rounded-xl border border-orange-200/60 dark:border-orange-800/40">
                    <span className="text-[10px] font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider block mb-0.5">Samvadi (Queen Note)</span>
                    <span className="text-sm font-extrabold text-orange-950 dark:text-orange-200">{raaga.samvadi}</span>
                  </div>

                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 sm:col-span-1 col-span-2">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block mb-0.5">Pakad (Catchphrase)</span>
                    <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 italic">"{raaga.pakad}"</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 pb-3">
                  {raaga.description}
                </p>

                {/* Action Link for Full Guide if available */}
                {guideRoute && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => onViewChange?.(guideRoute)}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-xs cursor-pointer group"
                    >
                      <span>Read Step-by-Step {raaga.name} Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredRaagas.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              No classical raagas found matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setFilter('All');
                setSearchQuery('');
              }}
              className="bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-800 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </div>
  );
}
