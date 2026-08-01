import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, BookOpen, Clock, Sun, Calendar, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, Printer, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaBilawalViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBilawalView({ onViewChange }: RagaBilawalViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [practiceStep, setPracticeStep] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(35 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,   // Sa
    'R': 293.66,   // Re
    'G': 329.63,   // Ga
    'M': 349.23,   // Ma (Shuddha)
    'P': 392.00,   // Pa
    'D': 440.00,   // Dha
    'N': 493.88,   // Ni
    'S\'': 523.25,  // Sa' (Upper Sa)
    'R\'': 587.33,  // Re'
    'G\'': 659.25,  // Ga'
    'P_': 196.00,  // Lower Pa
    'D_': 220.00,  // Lower Dha
    'N_': 246.94,  // Lower Ni
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSwaraTone = (swaraName: string, duration = 0.8) => {
    try {
      const ctx = getAudioContext();
      const freq = SWARA_FREQS[swaraName] || 261.63;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Soft flute timbre using triangle wave + gentle lowpass filter
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1300, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      setActiveSwara(swaraName);
      setTimeout(() => setActiveSwara(null), duration * 1000);
    } catch (e) {
      console.warn("Audio playback not supported or blocked", e);
    }
  };

  // Practice Timer hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  // Metronome for composition
  useEffect(() => {
    let beatInterval: any = null;
    if (isPlayingComposition) {
      const intervalMs = (60 / bpm) * 1000;
      beatInterval = setInterval(() => {
        setCurrentBeat(prev => (prev % 16) + 1);
        try {
          const ctx = getAudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(currentBeat === 1 ? 880 : 440, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(beatInterval);
  }, [isPlayingComposition, bpm, currentBeat]);

  const basicInfo = [
    { label: 'Raga Name', value: 'Bilawal', icon: <Music className="w-4 h-4 text-amber-600" /> },
    { label: 'Thaat', value: 'Bilawal (Parent Scale)', icon: <Compass className="w-4 h-4 text-amber-600" /> },
    { label: 'Jati', value: 'Sampurna – Sampurna (7 Notes)', icon: <Sliders className="w-4 h-4 text-amber-600" /> },
    { label: 'Time of Day', value: 'Morning (7 AM – 10 AM)', icon: <Sun className="w-4 h-4 text-amber-600" /> },
    { label: 'Vadi (King Note)', value: 'Dha (Dhaivat)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Samvadi (Queen Note)', value: 'Ga (Gandhar)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Nature', value: 'Bright, Peaceful, Joyful, Clear', icon: <Heart className="w-4 h-4 text-emerald-600" /> },
    { label: 'Rasa', value: 'Shanta (Peace), Hasya (Joy & Cheer)', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Difficulty Level', value: 'Beginner to Intermediate', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  const swarasList = [
    { name: 'Sa', symbol: 'S', type: 'Shuddha (Natural)', desc: 'Tonic / Base Note', freq: '261 Hz' },
    { name: 'Re', symbol: 'R', type: 'Shuddha (Natural)', desc: 'Major Second', freq: '293 Hz' },
    { name: 'Ga', symbol: 'G', type: 'Shuddha (Natural)', desc: 'Major Third (Samvadi)', freq: '330 Hz' },
    { name: 'Ma', symbol: 'M', type: 'Shuddha (Natural)', desc: 'Perfect Fourth', freq: '349 Hz' },
    { name: 'Pa', symbol: 'P', type: 'Shuddha (Natural)', desc: 'Perfect Fifth', freq: '392 Hz' },
    { name: 'Dha', symbol: 'D', type: 'Shuddha (Natural)', desc: 'Major Sixth (Vadi)', freq: '440 Hz' },
    { name: 'Ni', symbol: 'N', type: 'Shuddha (Natural)', desc: 'Major Seventh', freq: '494 Hz' },
    { name: 'Sa\'', symbol: 'S\'', type: 'Shuddha (Natural)', desc: 'Upper Octave Tonic', freq: '523 Hz' },
  ];

  const faqs = [
    {
      q: "Is Raag Bilawal suitable for beginners?",
      a: "Yes! Raag Bilawal introduces all seven natural (Shuddha) swaras without any flat (Komal) or sharp (Teevra) variations. It is an excellent bridge for students transitioning from pentatonic ragas (like Bhoopali or Durga) to full 7-note classical melodies."
    },
    {
      q: "Which notes are used in Raag Bilawal?",
      a: "Raag Bilawal uses all seven Shuddha Swaras: Sa, Re, Ga, Ma, Pa, Dha, and Ni. In Western music notation, this corresponds directly to the Natural Major Scale (Ionian Mode)."
    },
    {
      q: "Which flute should I use for practicing Raag Bilawal?",
      a: "Raag Bilawal can be practiced on any properly tuned Indian bamboo flute (Bansuri). A G Base or C Medium bansuri is highly recommended for adult beginners due to comfortable finger spacing and clear tone resonance."
    },
    {
      q: "What is the best time to perform or practice Raag Bilawal?",
      a: "Traditionally, Raag Bilawal is performed during the first prahar of the morning, between 7:00 AM and 10:00 AM. Its bright and refreshing character aligns wonderfully with morning sunshine and fresh energy."
    }
  ];

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Raag Bilawal: Complete Guide, Notes, Aaroh, Avaroh & Practice',
    'description': 'Master Raag Bilawal on Indian Bamboo Flute (Bansuri). Step-by-step guide featuring Swara playback, Pakad, Chalan, original Alankars, and the practice piece "Pratah Sur".',
    'datePublished': '2026-08-01T00:00:00Z',
    'dateModified': '2026-08-01T02:55:00Z',
    'author': {
      '@type': 'Person',
      'name': 'Aplut',
      'jobTitle': 'Founder of FluteSangam'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'FluteSangam',
      'url': 'https://flutesangam.com'
    },
    'mainEntityOfPage': 'https://flutesangam.com/learn/raga-bilawal'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-amber-950 via-bamboo-900 to-amber-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-amber-200/80 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-white transition cursor-pointer touch-manipulation"
            >
              Learn Hub
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-white transition cursor-pointer touch-manipulation"
            >
              Ragas
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold truncate max-w-[120px] sm:max-w-none">Raag Bilawal</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 px-3.5 py-1 rounded-full text-amber-300 text-xs font-bold">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Morning Raga (7 AM – 10 AM)</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 rounded-full text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Beginner to Intermediate</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight" itemProp="headline">
                Raag Bilawal: Complete Guide, Notes, Aaroh, Avaroh &amp; Practice
              </h1>

              <p className="text-sm sm:text-base text-bamboo-100 leading-relaxed font-sans">
                Raag Bilawal is one of the most fundamental ragas in Hindustani Classical Music and gives its name to the <strong>Bilawal Thaat</strong>, the parent scale containing all seven natural (Shuddha) notes.
              </p>
            </div>

            {/* Published & Updated Timestamps */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-amber-950/80 border border-amber-800/60 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-[11px] sm:text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Published: <strong className="text-white" itemProp="datePublished">Aug 1, 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Updated: <strong className="text-white" itemProp="dateModified">Aug 1, 2026</strong></span>
                </div>
                <div className="pt-1.5 border-t border-amber-800/60 flex items-center gap-1.5 text-amber-400 font-bold text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Verified Educational Content</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-amber-200 border-t border-amber-800/50">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-amber-400" /> Interactive Lesson</span>
            <span className="flex items-center gap-1.5"><Music className="w-4 h-4 text-amber-400" /> Web Audio Swara Player</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> 35-Min Daily Routine</span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-4">
        <h2 className="text-2xl font-display font-bold text-bamboo-950 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-600" />
          <span>Introduction</span>
        </h2>
        <div className="text-sm text-gray-700 leading-relaxed space-y-3 font-sans">
          <p>
            Raag Bilawal is one of the most fundamental ragas in Hindustani Classical Music and gives its name to the <strong>Bilawal Thaat</strong>, the parent scale containing all seven natural (Shuddha) notes. Because it uses only natural swaras, Raag Bilawal is often introduced after students become comfortable with pentatonic ragas and before they explore more ornamented or chromatic ragas.
          </p>
          <p>
            For bansuri players, Bilawal is excellent for developing smooth fingering, accurate intonation, and expressive phrasing. Its bright and cheerful nature also makes it enjoyable to practice every single morning.
          </p>
        </div>
      </section>

      {/* Basic Information Grid */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-bamboo-950 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-amber-600" />
          <span>Basic Information</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicInfo.map((info, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-bamboo-100 shadow-3xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 shrink-0">
                {info.icon}
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">{info.label}</span>
                <span className="text-sm font-bold text-bamboo-950 font-display mt-0.5 block">{info.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Swaras Used & Interactive Audio Player */}
      <section className="bg-gradient-to-br from-amber-50/80 via-white to-bamboo-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-bamboo-950 flex items-center gap-2">
              <Music className="w-6 h-6 text-amber-600" />
              <span>Swaras Used (Natural Scale)</span>
            </h2>
            <p className="text-xs text-amber-800 font-medium mt-1">
              Click any swara button below to hear its resonant flute tone!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>All 7 Shuddha Swaras</span>
          </div>
        </div>

        {/* Interactive Swara Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {swarasList.map((swara) => (
            <button
              key={swara.symbol}
              onClick={() => playSwaraTone(swara.symbol)}
              className={`p-3.5 rounded-2xl border transition text-center cursor-pointer flex flex-col items-center justify-between gap-1 shadow-3xs hover:shadow-xs ${
                activeSwara === swara.symbol
                  ? 'bg-amber-600 text-white border-amber-700 scale-105'
                  : 'bg-white hover:bg-amber-100/80 border-amber-200 text-bamboo-950'
              }`}
            >
              <span className="text-2xl font-extrabold font-display">{swara.symbol}</span>
              <span className={`text-[10px] font-bold ${activeSwara === swara.symbol ? 'text-amber-100' : 'text-amber-800'}`}>
                {swara.name}
              </span>
              <span className={`text-[9px] ${activeSwara === swara.symbol ? 'text-amber-200' : 'text-gray-500'}`}>
                {swara.freq}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Aaroh, Avaroh, Pakad & Chalan */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-display font-bold text-bamboo-950 flex items-center gap-2">
          <Compass className="w-6 h-6 text-amber-600" />
          <span>Aaroh, Avaroh, Pakad &amp; Chalan</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Aaroh Card */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Aaroh (Ascending)</span>
              <button 
                onClick={() => ['S','R','G','M','P','D','N','S\''].forEach((s, idx) => setTimeout(() => playSwaraTone(s), idx * 500))}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300/80 shadow-3xs"
              >
                <Play className="w-3 h-3 fill-current" /> Play Aaroh
              </button>
            </div>
            <div className="text-xl font-mono font-extrabold text-bamboo-950 tracking-wider bg-white p-3 rounded-xl border border-amber-200/60 text-center">
              S R G M P D N S'
            </div>
          </div>

          {/* Avaroh Card */}
          <div className="bg-bamboo-50/60 p-5 rounded-2xl border border-bamboo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-bamboo-800">Avaroh (Descending)</span>
              <button 
                onClick={() => ['S\'','N','D','P','M','G','R','S'].forEach((s, idx) => setTimeout(() => playSwaraTone(s), idx * 500))}
                className="text-xs font-bold text-bamboo-700 hover:text-bamboo-900 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-bamboo-300/80 shadow-3xs"
              >
                <Play className="w-3 h-3 fill-current" /> Play Avaroh
              </button>
            </div>
            <div className="text-xl font-mono font-extrabold text-bamboo-950 tracking-wider bg-white p-3 rounded-xl border border-bamboo-200/60 text-center">
              S' N D P M G R S
            </div>
          </div>
        </div>

        {/* Pakad Section */}
        <div className="space-y-3 bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-bamboo-500/10 p-5 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-bamboo-950">Pakad (Catch Phrase)</h3>
            <button 
              onClick={() => copyToClipboard('G R G M | P D | N D P | M G R S', 'pakad')}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy Pakad'}</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase block">Main Pakad</span>
              <div className="font-mono font-bold text-bamboo-950 text-base">G R G M &nbsp;|&nbsp; P D &nbsp;|&nbsp; N D P &nbsp;|&nbsp; M G R S</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase block">Alternative Phrase</span>
              <div className="font-mono font-bold text-bamboo-950 text-base">S R G M &nbsp;|&nbsp; P M G &nbsp;|&nbsp; R S</div>
            </div>
          </div>
        </div>

        {/* Chalan Section */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-bamboo-100">
          <h3 className="text-lg font-bold font-display text-bamboo-950">Chalan (Melodic Movement)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-sm font-bold text-bamboo-900">
            <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">S R G M</div>
            <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">P D N S'</div>
            <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">N D P</div>
            <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">M G R S</div>
            <div className="bg-bamboo-50/80 p-2.5 rounded-xl border border-bamboo-200">R G M P</div>
            <div className="bg-bamboo-50/80 p-2.5 rounded-xl border border-bamboo-200">D N D P</div>
            <div className="bg-bamboo-50/80 p-2.5 rounded-xl border border-bamboo-200">M G R</div>
            <div className="bg-bamboo-50/80 p-2.5 rounded-xl border border-bamboo-200">S</div>
          </div>
        </div>
      </section>

      {/* Important Characteristics, Mood & Why Learn */}
      <section className="grid md:grid-cols-3 gap-6">
        {/* Characteristics */}
        <div className="bg-white p-6 rounded-3xl border border-bamboo-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-display text-bamboo-950">Key Characteristics</h3>
          <ul className="space-y-2 text-xs text-gray-700 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">•</span>
              <span>Uses all seven natural (Shuddha) swaras.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">•</span>
              <span>Bright and balanced melodic movement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">•</span>
              <span>Smooth ascending &amp; descending phrases.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">•</span>
              <span><strong>Dha</strong> (Vadi) and <strong>Ga</strong> (Samvadi) are vital resting notes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">•</span>
              <span>Maintain even tone throughout octave transitions.</span>
            </li>
          </ul>
        </div>

        {/* Mood & Emotion */}
        <div className="bg-white p-6 rounded-3xl border border-bamboo-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-display text-bamboo-950">Mood &amp; Rasa</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-sans">
            Raag Bilawal conveys:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Joy', 'Freshness', 'Peace', 'Simplicity', 'Optimism'].map((m, i) => (
              <span key={i} className="bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-bold">
                {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed font-sans pt-1">
            Its morning character creates a feeling of clarity, tranquility, and new beginnings.
          </p>
        </div>

        {/* Why Learn */}
        <div className="bg-white p-6 rounded-3xl border border-bamboo-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-display text-bamboo-950">Why Learn Bilawal?</h3>
          <ul className="space-y-2 text-xs text-gray-700 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Introduces complete natural scale.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Improves fingering accuracy on Bansuri.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Strengthens breath control &amp; blowing stability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Develops smooth octave transitions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Prepares students for advanced classical ragas.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FluteSangam Original Alankars */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-bamboo-950 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-600" />
              <span>FluteSangam Original Alankars</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Targeted finger drills designed specifically for the Bilawal natural scale
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            3 Original Exercises
          </span>
        </div>

        {/* Alankar 1 */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-3">
          <h3 className="text-base font-bold font-display text-bamboo-950 flex items-center justify-between">
            <span>Alankar 1: Double Swara Pair Drills</span>
            <span className="text-xs text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-300">2-Note Pairs</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono font-semibold">
            <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[10px] text-amber-800 uppercase block font-sans font-bold">Ascending</span>
              <p className="text-bamboo-950">S R &nbsp;|&nbsp; R G &nbsp;|&nbsp; G M &nbsp;|&nbsp; M P &nbsp;|&nbsp; P D &nbsp;|&nbsp; D N &nbsp;|&nbsp; N S'</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[10px] text-amber-800 uppercase block font-sans font-bold">Descending</span>
              <p className="text-bamboo-950">S' N &nbsp;|&nbsp; N D &nbsp;|&nbsp; D P &nbsp;|&nbsp; P M &nbsp;|&nbsp; M G &nbsp;|&nbsp; G R &nbsp;|&nbsp; R S</p>
            </div>
          </div>
        </div>

        {/* Alankar 2 */}
        <div className="bg-bamboo-50/50 p-5 rounded-2xl border border-bamboo-200/80 space-y-3">
          <h3 className="text-base font-bold font-display text-bamboo-950 flex items-center justify-between">
            <span>Alankar 2: Triplet Swara Sequences</span>
            <span className="text-xs text-bamboo-800 bg-white px-2.5 py-0.5 rounded-full border border-bamboo-300">3-Note Triplets</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono font-semibold">
            <div className="bg-white p-3 rounded-xl border border-bamboo-200 space-y-1">
              <span className="text-[10px] text-bamboo-800 uppercase block font-sans font-bold">Ascending</span>
              <p className="text-bamboo-950">S R G &nbsp;|&nbsp; R G M &nbsp;|&nbsp; G M P &nbsp;|&nbsp; M P D &nbsp;|&nbsp; P D N &nbsp;|&nbsp; D N S'</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-bamboo-200 space-y-1">
              <span className="text-[10px] text-bamboo-800 uppercase block font-sans font-bold">Descending</span>
              <p className="text-bamboo-950">S' N D &nbsp;|&nbsp; N D P &nbsp;|&nbsp; D P M &nbsp;|&nbsp; P M G &nbsp;|&nbsp; M G R &nbsp;|&nbsp; G R S</p>
            </div>
          </div>
        </div>

        {/* Alankar 3 */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-3">
          <h3 className="text-base font-bold font-display text-bamboo-950 flex items-center justify-between">
            <span>Alankar 3: Four-Note Pattern</span>
            <span className="text-xs text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-300">4-Note Step Back</span>
          </h3>
          <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs font-mono font-semibold text-bamboo-950 space-y-2">
            <div><span className="font-sans text-[10px] text-amber-800 font-bold uppercase block">Pattern:</span> S R G R &nbsp;|&nbsp; R G M G &nbsp;|&nbsp; G M P M &nbsp;|&nbsp; M P D P &nbsp;|&nbsp; P D N D &nbsp;|&nbsp; D N S' N</div>
          </div>
        </div>
      </section>

      {/* Original Practice Piece: "Pratah Sur" */}
      <section className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-bamboo-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bamboo-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              FluteSangam Original Composition
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Practice Piece: "Pratah Sur" (Morning Melody)
            </h2>
            <p className="text-xs text-bamboo-200 font-sans mt-1">
              Taal: Teentaal (16 Beats) &nbsp;|&nbsp; Tempo: Madhya Laya &nbsp;|&nbsp; Original Educational Exercise
            </p>
          </div>

          {/* Interactive Metronome / Player */}
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className={`p-3 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                isPlayingComposition ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-amber-400 hover:bg-amber-300 text-bamboo-950'
              }`}
            >
              {isPlayingComposition ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlayingComposition ? 'Stop Beat' : 'Start Beat'}</span>
            </button>

            <div className="space-y-1">
              <div className="text-[10px] text-bamboo-200 font-bold uppercase">Metronome: {bpm} BPM</div>
              <input
                type="range"
                min="40"
                max="120"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-24 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Beats Visualizer */}
        {isPlayingComposition && (
          <div className="bg-bamboo-950/80 p-4 rounded-2xl border border-bamboo-700/80 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-amber-300 font-bold mr-2">Teentaal Beat:</span>
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                  currentBeat === i + 1
                    ? 'bg-amber-400 text-bamboo-950 scale-110 shadow-md font-black'
                    : 'bg-white/10 text-bamboo-300'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Notation Sections */}
        <div className="space-y-6 text-sm font-mono">
          {/* Section A */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-sans">Section A (Sthayi)</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-amber-100 font-bold text-base tracking-widest">
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| S &nbsp;R &nbsp;G &nbsp;M | P &nbsp;D &nbsp;N &nbsp;D |</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| P &nbsp;M &nbsp;G &nbsp;R | S &nbsp;- &nbsp;- &nbsp;- |</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| R &nbsp;G &nbsp;M &nbsp;P | D &nbsp;N &nbsp;S' N |</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| D &nbsp;P &nbsp;M &nbsp;G | R &nbsp;S &nbsp;- &nbsp;- |</div>
            </div>
          </div>

          {/* Section B */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-sans">Section B (Antara)</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-amber-100 font-bold text-base tracking-widest">
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| S' N &nbsp;D &nbsp;P | M &nbsp;G &nbsp;R &nbsp;S |</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| R &nbsp;G &nbsp;M &nbsp;P | D &nbsp;N &nbsp;S' - |</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| S' N &nbsp;D &nbsp;P | M &nbsp;P &nbsp;G &nbsp;R |</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">| S &nbsp;R &nbsp;G &nbsp;M | P &nbsp;M &nbsp;G &nbsp;R |</div>
            </div>
          </div>

          {/* Ending Tihai */}
          <div className="bg-amber-400/10 p-5 rounded-2xl border border-amber-300/30 space-y-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-sans flex items-center justify-between">
              <span>Ending Phrase (Tihai - Repeat 3 Times)</span>
              <span className="text-[10px] text-amber-200">Land cleanly on Sa</span>
            </h3>
            <div className="font-bold text-amber-200 text-base tracking-widest bg-black/40 p-3.5 rounded-xl border border-amber-300/20 text-center">
              ( G M P &nbsp;|&nbsp; M G R &nbsp;|&nbsp; S ) &nbsp;&times;3 &nbsp;&rarr;&nbsp; <span className="text-amber-400 font-extrabold underline">[ S ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Daily Practice Routine */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-bamboo-950 flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-600" />
              <span>Suggested Daily Practice Routine (35 Mins)</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Follow this structured timeline to build mastery step-by-step
            </p>
          </div>

          {/* Interactive Timer Control */}
          <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 self-start sm:self-auto">
            <div className="text-lg font-mono font-extrabold text-amber-900">
              {formatTimer(timerSeconds)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isTimerRunning ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {isTimerRunning ? 'Pause' : 'Start Timer'}
            </button>
            <button
              onClick={() => { setIsTimerRunning(false); setTimerSeconds(35 * 60); }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-bamboo-900 text-white font-display">
                <th className="p-3.5 rounded-l-xl">Exercise</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5 rounded-r-xl text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Long Notes (Meend &amp; Tone)</td>
                <td className="p-3.5">Hold S, R, G, M, P, D, N, S' for 8–10 seconds each with steady breath.</td>
                <td className="p-3.5 text-right font-semibold text-amber-800">5 min</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Aaroh – Avaroh</td>
                <td className="p-3.5">Repeat ascending and descending scale slowly 10 times with tanpura.</td>
                <td className="p-3.5 text-right font-semibold text-amber-800">5 min</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Pakad Practice</td>
                <td className="p-3.5">Focus on Dha and Ga as resting notes in characteristic phrases.</td>
                <td className="p-3.5 text-right font-semibold text-amber-800">3 min</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Alankars (1, 2 &amp; 3)</td>
                <td className="p-3.5">Practice doublets, triplets, and 4-note patterns with clean finger pops.</td>
                <td className="p-3.5 text-right font-semibold text-amber-800">7 min</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Practice Piece "Pratah Sur"</td>
                <td className="p-3.5">Play Sthayi and Antara with steady teentaal rhythm metronome.</td>
                <td className="p-3.5 text-right font-semibold text-amber-800">10 min</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Free Improvisation</td>
                <td className="p-3.5">Explore creative swara combinations adhering strictly to Bilawal rules.</td>
                <td className="p-3.5 text-right font-semibold text-amber-800">5 min</td>
              </tr>
              <tr className="bg-amber-50/80 font-bold text-bamboo-950">
                <td className="p-3.5 rounded-l-xl" colSpan={2}>Total Daily Practice Time</td>
                <td className="p-3.5 text-right text-amber-900 rounded-r-xl">35 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Mistakes & Performance Tips */}
      <section className="grid sm:grid-cols-2 gap-6">
        <div className="bg-rose-50/60 p-6 rounded-3xl border border-rose-200/80 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold font-display text-lg">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Common Mistakes to Avoid</span>
          </div>
          <ul className="space-y-2 text-xs text-rose-950 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">❌</span>
              <span>Uneven breath pressure while changing swaras.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">❌</span>
              <span>Playing too fast before mastering pitch accuracy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">❌</span>
              <span>Ignoring the importance of Dha (Vadi resting note).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">❌</span>
              <span>Inconsistent finger placement leading to accidental flat notes.</span>
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-200/80 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold font-display text-lg">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            <span>Tips for Better Performance</span>
          </div>
          <ul className="space-y-2 text-xs text-emerald-950 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Always practice with a background tanpura drone (G or C scale).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Play slowly at first, ensuring every note is equally clear.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Listen carefully to pitch accuracy on Ma and Ni.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Gradually increase metronome tempo as fingers become agile.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-display font-bold text-bamboo-950 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 bg-gray-50/80 hover:bg-amber-50/60 font-bold text-sm text-bamboo-950 flex items-center justify-between gap-3 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Ragas */}
      <section className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-4">
        <h3 className="text-xl font-display font-bold text-bamboo-950">Related Raga Guides</h3>
        <p className="text-xs text-gray-600">
          Continue your classical music journey with these other comprehensive guides:
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {[
            { name: 'Raag Bhoopali', view: 'raga_bhoopali' },
            { name: 'Raag Yaman', view: 'raga_yaman' },
            { name: 'Raag Durga', view: 'raga_durga' },
            { name: 'Raag Hamsadhwani', view: 'raga_hamsadhwani' },
          ].map((raga, idx) => (
            <button
              key={idx}
              onClick={() => onViewChange?.(raga.view as AppView)}
              className="bg-white hover:bg-amber-100 text-bamboo-950 border border-amber-300 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-3xs cursor-pointer"
            >
              <span>{raga.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          ))}
        </div>
      </section>

      {/* Copyright & Original Content Disclaimer */}
      <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2 font-sans">
        <div className="font-bold text-gray-800">© FluteSangam Original Educational Content</div>
        <p className="leading-relaxed">
          This article, exercises, alankars, and the "Pratah Sur" practice piece have been created exclusively for FluteSangam as original educational material. The practice piece is designed to reinforce note control and characteristic movements of the Bilawal scale. It is an original educational exercise and is not presented as a traditional bandish or classical gat.
        </p>
      </section>

      {/* Author Profile */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </motion.div>
  );
}
