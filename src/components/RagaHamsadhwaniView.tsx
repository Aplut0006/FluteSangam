import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, Printer, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb, RotateCcw
} from 'lucide-react';
import { AppView } from '../types';
import { playTakMetronomeClick } from '../lib/audioUtils';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaHamsadhwaniViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaHamsadhwaniView({ onViewChange }: RagaHamsadhwaniViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(35 * 60);

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz for Hamsadhwani notes)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,   // Sa (261Hz)
    'R': 293.66,   // Shuddha Re (293Hz)
    'G': 329.63,   // Shuddha Ga (329Hz) - Vadi Swara
    'P': 392.00,   // Pa (392Hz)
    'N': 493.88,   // Shuddha Ni (493Hz) - Samvadi Swara
    'S\'': 523.25,  // Upper Sa (523Hz)
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
      
      // Warm flute-like timbre using triangle wave + gentle lowpass filter
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.1);
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
        setCurrentBeat(prev => {
          const next = (prev % 16) + 1;
          try {
            const ctx = getAudioContext();
            playTakMetronomeClick(ctx, next === 1);
          } catch (e) {}
          return next;
        });
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(beatInterval);
  }, [isPlayingComposition, bpm]);

  const basicInfo = [
    { label: 'Raga Name', value: 'Hamsadhwani', icon: <Music className="w-4 h-4 text-emerald-600" /> },
    { label: 'Thaat', value: 'Bilawal / Shankarabharanam', icon: <Compass className="w-4 h-4 text-emerald-600" /> },
    { label: 'Jati', value: 'Audav – Audav (Pentatonic)', icon: <Sliders className="w-4 h-4 text-emerald-600" /> },
    { label: 'Time of Day', value: 'Early night (6 PM – 9 PM) / Any Auspicious Time', icon: <Moon className="w-4 h-4 text-indigo-600" /> },
    { label: 'Vadi (King Note)', value: 'Ga (Gandhar)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Samvadi (Queen Note)', value: 'Ni (Nishad)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Nature', value: 'Joyful, Auspicious, Swan-like Grace', icon: <Heart className="w-4 h-4 text-emerald-600" /> },
    { label: 'Rasa', value: 'Ananda (Joy), Bhakti (Devotion), Tejas (Radiance)', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Difficulty Level', value: 'Beginner', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  const faqs = [
    {
      q: 'Is Raag Hamsadhwani suitable for beginners?',
      a: 'Yes. Its five-note pentatonic structure makes it one of the easiest and most joyful ragas to learn after mastering Bhoopali and Durga. It builds clean finger transitions and pitch control.'
    },
    {
      q: 'Which notes are omitted in Raag Hamsadhwani?',
      a: 'Madhyam (Ma) and Dhaivat (Dha) are strictly omitted in both Aaroh and Avaroh. Never play Ma or Dha when performing Raag Hamsadhwani.'
    },
    {
      q: 'Which note is most important in Raag Hamsadhwani?',
      a: 'Gandhar (Ga) is treated as the Vadi (king) note, while Nishad (Ni) serves as the Samvadi (queen) note providing key melodic resolution and stability.'
    },
    {
      q: 'Which flute can be used to practice Raag Hamsadhwani?',
      a: 'Raag Hamsadhwani can be practiced on any properly tuned bansuri. A G Base or C Natural Medium bansuri is ideal and comfortable for most adult beginners.'
    },
    {
      q: 'What is the best time to perform Raag Hamsadhwani?',
      a: 'Traditionally, Raag Hamsadhwani is performed during the early part of the night (approximately 6 PM – 9 PM). However, its auspicious nature makes it popular for concert openings at any time.'
    }
  ];

  const relatedRagas = [
    { name: 'Raag Bhoopali', view: 'raga_bhoopali', description: 'Pentatonic scale skipping Ma and Ni; serene evening raga focused on Ga and Dha.', difficulty: 'Beginner' },
    { name: 'Raag Durga', view: 'raga_durga', description: 'Pentatonic scale skipping Ga and Ni; peaceful evening raga focused on Ma and Sa.', difficulty: 'Beginner' },
    { name: 'Raag Bilawal', view: 'raga_bilawal', description: 'Parent Thaat scale using all seven Shuddha notes; equivalent to Major scale.', difficulty: 'Beginner' },
    { name: 'Raag Yaman', view: 'raga_yaman', description: 'Evening scale introducing Teevra Ma; foundation of classical improvisation.', difficulty: 'Beginner' },
    { name: 'Raag Desh', view: 'raga_desh', description: 'Monsoon evening scale with graceful glides and memorable phrases.', difficulty: 'Intermediate' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-16" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Article / LearningResource JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Raag Hamsadhwani: Notes, Aaroh, Avaroh, Pakad, Practice & Original Composition",
          "headline": "Raag Hamsadhwani: Notes, Aaroh, Avaroh, Pakad, Practice & Original Composition on Bansuri",
          "description": "Master Raag Hamsadhwani on Indian bamboo flute (Bansuri) with step-by-step swara guides, Aaroh-Avaroh, Pakad, Chalan, practice routine, alankars, and the original composition Udaya Sur.",
          "learningResourceType": "Lesson",
          "educationalLevel": "Beginner",
          "author": {
            "@type": "Organization",
            "name": "FluteSangam",
            "alternateName": "Flute Sangam",
            "url": "https://flutesangam.com"
          },
          "datePublished": "2026-07-30T00:00:00Z",
          "dateModified": "2026-07-30T10:00:00Z",
          "inLanguage": "en",
          "keywords": ["Raag Hamsadhwani", "Hamsadhwani Raga", "Learn Bansuri", "Flute Raga", "Udaya Sur", "Hindustani Classical", "Sargam Notes"]
        })}
      </script>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-emerald-950 via-bamboo-900 to-emerald-900 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-amber-500/10 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none"></div>

        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-emerald-200/80 font-medium">
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
            <span className="text-amber-400 font-bold truncate max-w-[120px] sm:max-w-none">Raag Hamsadhwani</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                Carnatic &amp; Hindustani • Audav-Audav
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-emerald-50 leading-tight" itemProp="headline">
                Raag Hamsadhwani Guide
              </h1>
              <p className="text-emerald-200/90 text-xs sm:text-lg font-medium leading-relaxed">
                Notes, Aaroh, Avaroh, Pakad, Practice Routine &amp; Original FluteSangam Composition <em className="text-amber-300 font-serif">"Udaya Sur"</em>.
              </p>
            </div>

            {/* Timestamps & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-emerald-950/80 border border-emerald-800/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Published: <strong className="text-white">Jul 30, 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Updated: <strong className="text-white">Jul 30, 2026</strong></span>
                </div>
                <div className="pt-1 border-t border-emerald-800/60 flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Educational Content</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 min-h-[38px]"
                  title="Print or Save Lesson PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
                <button
                  onClick={() => copyToClipboard(window.location.href, 'link')}
                  className="bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 min-h-[38px]"
                  title="Share link"
                >
                  {copiedSection === 'link' ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'link' ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Introduction</span>
        </h2>
        <div className="prose prose-bamboo text-gray-700 text-xs sm:text-base leading-relaxed space-y-3">
          <p>
            Raag Hamsadhwani is a bright, joyful, and auspicious pentatonic (Audav) raga in Indian classical music. The name <em>Hamsadhwani</em> translates to <strong>"The Sound of the Swan"</strong>, symbolizing purity, grace, radiance, and divine elegance.
          </p>
          <p>
            Originally created by Ramaswami Dikshitar in Carnatic music, Raag Hamsadhwani was later embraced into Hindustani Classical Music and has become a beloved fixture of the bansuri flute repertoire. It uses five natural notes, strictly omitting Madhyam (Ma) and Dhaivat (Dha).
          </p>
          <p className="font-medium text-bamboo-900 bg-emerald-50/60 p-3 sm:p-4 rounded-xl border-l-4 border-emerald-600">
            Due to its auspicious and energetic mood, Raag Hamsadhwani is traditionally chosen as an opening piece for classical concerts and cultural celebrations to invoke joy and spiritual positivity.
          </p>
        </div>
      </div>

      {/* Basic Information Grid */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Basic Information</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {basicInfo.map((info, idx) => (
            <div key={idx} className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 sm:p-4 flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-3xs border border-emerald-100 shrink-0">
                {info.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  {info.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-bamboo-950 truncate block mt-0.5">
                  {info.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swaras Used Section (With Interactive Tone Pads) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
            <span>Swaras Used in Raag Hamsadhwani</span>
          </h2>
          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2.5 py-1 rounded-full self-start sm:self-auto">
            Tap Swaras to Hear Flute Tone
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Notes Used */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Notes Used (5 Natural Swaras)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { name: 'S', full: 'Sa (Shadj)' },
                { name: 'R', full: 'Re (Rishabh)' },
                { name: 'G', full: 'Ga (Gandhar - Vadi)', isVadi: true },
                { name: 'P', full: 'Pa (Pancham)' },
                { name: 'N', full: 'Ni (Nishad - Samvadi)', isSamvadi: true },
                { name: 'S\'', full: 'Sa\' (Upper Sa)' },
              ].map((swara) => (
                <button
                  key={swara.name}
                  onClick={() => playSwaraTone(swara.name)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer touch-manipulation active:scale-95 ${
                    activeSwara === swara.name 
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300' 
                      : swara.isVadi
                        ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                        : swara.isSamvadi
                          ? 'bg-indigo-100 text-indigo-950 border-indigo-300 hover:bg-indigo-200'
                          : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-100/60'
                  }`}
                  title={`Play ${swara.full}`}
                >
                  <span className="block text-base font-extrabold font-mono">{swara.name}</span>
                  <span className="block text-[9px] font-semibold mt-0.5 opacity-80 truncate">{swara.full.split(' ')[0]}</span>
                  {swara.isVadi && <span className="block text-[8px] text-amber-800 font-bold uppercase mt-0.5">Vadi</span>}
                  {swara.isSamvadi && <span className="block text-[8px] text-indigo-800 font-bold uppercase mt-0.5">Samvadi</span>}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-emerald-900/80 italic pt-1">
              * Note: All notes used in Raag Hamsadhwani are strictly <strong>Shuddha Swaras</strong> (natural notes).
            </p>
          </div>

          {/* Notes Omitted */}
          <div className="bg-red-50/50 border border-red-200/80 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-red-950 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Notes Omitted (Varjit Swaras)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-red-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-lg font-mono font-bold text-red-600 line-through">Ma (M)</span>
                <span className="block text-[11px] text-gray-600 font-medium">Madhyam</span>
                <span className="text-[9px] text-red-700 font-extrabold bg-red-100 px-2 py-0.5 rounded-full inline-block">Strictly Omitted</span>
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-lg font-mono font-bold text-red-600 line-through">Dha (D)</span>
                <span className="block text-[11px] text-gray-600 font-medium">Dhaivat</span>
                <span className="text-[9px] text-red-700 font-extrabold bg-red-100 px-2 py-0.5 rounded-full inline-block">Strictly Omitted</span>
              </div>
            </div>
            <p className="text-[11px] text-red-900/80 leading-relaxed pt-1">
              Omitting Ma and Dha creates the signature Audav-Audav pentatonic framework of Raag Hamsadhwani.
            </p>
          </div>
        </div>
      </div>

      {/* Aaroh, Avaroh, Pakad & Chalan */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Aaroh, Avaroh, Pakad &amp; Chalan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Aaroh */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Aaroh (Ascending Scale)</span>
              <button
                onClick={() => copyToClipboard("S R G P N S'", 'aaroh')}
                className="text-[11px] text-emerald-700 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'aaroh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'aaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-center gap-2 sm:gap-3 text-lg font-mono font-extrabold text-bamboo-950">
              {['S', 'R', 'G', 'P', 'N', "S'"].map((note, idx) => (
                <span key={idx} className="bg-emerald-50 px-2 py-1 rounded border border-emerald-200 cursor-pointer hover:bg-emerald-200 transition" onClick={() => playSwaraTone(note)}>
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Avaroh */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Avaroh (Descending Scale)</span>
              <button
                onClick={() => copyToClipboard("S' N P G R S", 'avaroh')}
                className="text-[11px] text-emerald-700 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'avaroh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'avaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-center gap-2 sm:gap-3 text-lg font-mono font-extrabold text-bamboo-950">
              {["S'", 'N', 'P', 'G', 'R', 'S'].map((note, idx) => (
                <span key={idx} className="bg-emerald-50 px-2 py-1 rounded border border-emerald-200 cursor-pointer hover:bg-emerald-200 transition" onClick={() => playSwaraTone(note)}>
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pakad */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Pakad (Signature Catchphrase)
            </h3>
            <button
              onClick={() => copyToClipboard("S R G | P N | P G | R S", 'pakad')}
              className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy Notation'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-amber-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Primary Pakad</span>
              <div className="text-base sm:text-lg font-mono font-bold text-bamboo-950 tracking-wider">
                S R G &nbsp;|&nbsp; P N &nbsp;|&nbsp; P G &nbsp;|&nbsp; R S
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Alternative Phrase</span>
              <div className="text-base sm:text-lg font-mono font-bold text-bamboo-950 tracking-wider">
                R G P &nbsp;|&nbsp; N P &nbsp;|&nbsp; G R &nbsp;|&nbsp; S
              </div>
            </div>
          </div>
        </div>

        {/* Chalan */}
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-bamboo-950 text-sm sm:text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            Chalan (Melodic Progression)
          </h3>
          <p className="text-xs text-gray-600">
            Follow this signature sequence to understand how Raag Hamsadhwani glides smoothly across octaves:
          </p>
          <div className="bg-white rounded-xl p-4 border border-emerald-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">S R G</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">P N S'</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">N P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">G R</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">S</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="bg-amber-100/70 text-amber-950 px-2.5 py-1 rounded-md font-bold">R G P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/70 text-amber-950 px-2.5 py-1 rounded-md font-bold">N P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/70 text-amber-950 px-2.5 py-1 rounded-md font-bold">G R S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Characteristics & Mood/Emotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Characteristics */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Important Characteristics</span>
          </h2>
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            {[
              'Ma and Dha are strictly omitted in all ascending and descending phrases.',
              'Gandhar (Ga) is the Vadi (most important note) and gives the raga its bright, sweet identity.',
              'Nishad (Ni) serves as the Samvadi note providing melodic balance.',
              'Smooth glides between Ga–Pa and Ni–Pa add swan-like grace and beauty.',
              'Commonly chosen as an auspicious opening raga in classical music concerts.',
            ].map((char, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mood & Emotion */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-amber-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-emerald-200/80 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-950 font-display flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Mood and Emotion (Rasa)</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
            Raag Hamsadhwani radiates bright, uplifting spiritual feelings of:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {['Joy & Bliss', 'Devotion (Bhakti)', 'Radiance (Tejas)', 'Swan Grace', 'Optimism', 'Auspicious Energy'].map((mood, idx) => (
              <span key={idx} className="bg-white border border-emerald-300 text-emerald-950 font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs shadow-3xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                {mood}
              </span>
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-900/90 leading-relaxed pt-2 border-t border-emerald-200/60">
            It fills the atmosphere with bright energy, spiritual optimism, and serene celebration.
          </p>
        </div>
      </div>

      {/* Why Beginners Should Learn Raag Hamsadhwani */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Why Beginners Should Learn Raag Hamsadhwani</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: 'Bright Five-Note Scale', desc: 'Pentatonic structure with only pure Shuddha swaras and no altered notes.' },
            { title: 'Smooth Finger Motion', desc: 'Skipping Ma and Dha builds great finger agility and interval training.' },
            { title: 'Develops Upper Octave Control', desc: 'Reaching Ni and upper Sa\' builds steady high octave air support.' },
            { title: 'Cultivates Pure Resonant Tone', desc: 'Bright note ratios encourage clear, open flute embouchure.' },
            { title: 'Universal Repertoire Value', desc: 'Core raga shared seamlessly across Hindustani and Carnatic traditions.' },
            { title: 'Gateway to Advanced Ragas', desc: 'Perfect stepping stone before learning seven-note major ragas like Bilawal.' },
          ].map((reason, idx) => (
            <div key={idx} className="bg-emerald-50/40 border border-emerald-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1 hover:shadow-sm transition">
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">0{idx + 1}</span>
              <h3 className="font-bold text-bamboo-950 text-xs sm:text-sm mt-1">{reason.title}</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beginner Practice Routine */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
              <Repeat className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
              <span>Beginner Practice Routine</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Structured Sargam and Alankar drills for daily practice</p>
          </div>

          {/* Practice Session Timer Widget */}
          <div className="bg-emerald-950 text-white rounded-xl p-2.5 sm:p-3 flex items-center justify-between sm:justify-end gap-3 border border-emerald-800 shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-[65px]">
                <span className="text-[9px] text-emerald-300 font-medium block uppercase leading-none">Timer</span>
                <span className="text-sm font-mono font-extrabold text-amber-300">{formatTimer(timerSeconds)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1.5 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-white transition cursor-pointer"
                title={isTimerRunning ? "Pause Timer" : "Start 35-Min Timer"}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(35 * 60); }}
                className="p-1.5 bg-emerald-900 hover:bg-emerald-800 rounded-lg text-emerald-300 transition cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 1. Long Notes */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center">1</span>
            <span>Long Notes (Kharaj &amp; Hold)</span>
          </h3>
          <p className="text-xs text-gray-600">
            Hold each note for <strong>8–10 seconds</strong> with steady, smooth breath support:
          </p>
          <div className="bg-white rounded-xl p-3 border border-emerald-200 flex flex-wrap items-center justify-center gap-2 text-base font-mono font-bold text-bamboo-950">
            {['S', 'R', 'G', 'P', 'N', "S'"].map((note, i) => (
              <span key={i} className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Aaroh-Avaroh Repetitions */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center">2</span>
            <span>Aaroh–Avaroh Scale Drills</span>
          </h3>
          <p className="text-xs text-gray-600">
            Repeat slowly <strong>10 times</strong> at steady tempo:
          </p>
          <div className="bg-white rounded-xl p-3 border border-emerald-200 space-y-1 text-center font-mono font-bold text-xs sm:text-sm text-bamboo-950">
            <div>Ascending: S R G P N S'</div>
            <div className="text-emerald-700">Descending: S' N P G R S</div>
          </div>
        </div>

        {/* 3. Alankars */}
        <div className="space-y-4">
          <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center">3</span>
            <span>Pattern Alankars for Finger Agility</span>
          </h3>

          {/* Alankar 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 1 (2-Note Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R | R G | G P | P N | N S'\nDescending: S' N | N P | P G | G R | R S", 'alankar1')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <div><strong className="text-emerald-900 block text-[10px] uppercase font-sans">Ascending</strong> S R &nbsp;|&nbsp; R G &nbsp;|&nbsp; G P &nbsp;|&nbsp; P N &nbsp;|&nbsp; N S'</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' N &nbsp;|&nbsp; N P &nbsp;|&nbsp; P G &nbsp;|&nbsp; G R &nbsp;|&nbsp; R S</div>
            </div>
          </div>

          {/* Alankar 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 2 (3-Note Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R G | R G P | G P N | P N S'\nDescending: S' N P | N P G | P G R | G R S", 'alankar2')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <div><strong className="text-emerald-900 block text-[10px] uppercase font-sans">Ascending</strong> S R G &nbsp;|&nbsp; R G P &nbsp;|&nbsp; G P N &nbsp;|&nbsp; P N S'</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' N P &nbsp;|&nbsp; N P G &nbsp;|&nbsp; P G R &nbsp;|&nbsp; G R S</div>
            </div>
          </div>

          {/* Alankar 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 3 (4-Note Return Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R G R | R G P G | G P N P | P N S' N\nDescending: S' N P N | N P G P | P G R G | G R S", 'alankar3')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <div><strong className="text-emerald-900 block text-[10px] uppercase font-sans">Ascending</strong> S R G R &nbsp;|&nbsp; R G P G &nbsp;|&nbsp; G P N P &nbsp;|&nbsp; P N S' N</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' N P N &nbsp;|&nbsp; N P G P &nbsp;|&nbsp; P G R G &nbsp;|&nbsp; G R S</div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Mistakes & Performance Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Common Mistakes */}
        <div className="bg-red-50/40 border border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-red-950 font-display flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <span>Common Mistakes to Avoid</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
            {[
              'Accidentally playing Ma (Madhyam) when ascending from Ga to Pa.',
              'Accidentally playing Dha (Dhaivat) when descending from upper Sa\'.',
              'Rushing through phrases without holding Gandhar (Vadi note).',
              'Overblowing on upper Nishad causing sharp pitch distortion.',
              'Playing mechanically without expressing joyful swan-like motion.',
            ].map((mistake, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">❌</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips for Better Performance */}
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-950 font-display flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Tips for Better Performance</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
            {[
              'Always practice with a background Tanpura drone set to Sa-Pa.',
              'Focus on producing a warm, open Gandhar (Ga) tone.',
              'Give slight, graceful emphasis to Nishad (Ni) in upper phrases.',
              'Keep note transitions smooth, connected, and crisp.',
              'Start slowly at 50 BPM before increasing tempo gradually.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FluteSangam Original Practice Composition: "Udaya Sur" */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            FluteSangam Original Composition
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-bamboo-900 tracking-tight">
            Composition: "Udaya Sur" (Melody of Sunrise)
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            A beginner-friendly practice composition set to <strong>Teentaal (16 Beats)</strong> in <strong>Madhya Laya</strong>.
          </p>
        </div>

        {/* Metronome Control & Visual Beat Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-bamboo-950 to-emerald-900 text-white rounded-2xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <button
                onClick={() => setIsPlayingComposition(!isPlayingComposition)}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition cursor-pointer touch-manipulation active:scale-95 shadow-md ${
                  isPlayingComposition 
                    ? 'bg-amber-500 hover:bg-amber-400 text-amber-950' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlayingComposition ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                  {isPlayingComposition ? 'Pause Metronome' : 'Start Teentaal Metronome'}
                </span>
              </button>

              <div className="hidden md:block text-xs">
                <span className="text-emerald-300 font-medium block">Taal: Teentaal</span>
                <span className="text-amber-300 font-bold">16 Beats / Cycle</span>
              </div>
            </div>

            {/* BPM Slider */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2 bg-emerald-900/60 border border-emerald-700/60 rounded-xl p-2 sm:p-2.5">
              <span className="text-xs font-extrabold text-emerald-200 shrink-0">BPM: {bpm}</span>
              <input
                type="range"
                min="50"
                max="100"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-20 sm:w-32 accent-amber-400 cursor-pointer"
              />
              <div className="flex gap-1 shrink-0">
                {[50, 60, 70, 80].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setBpm(speed)}
                    className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition touch-manipulation ${
                      bpm === speed ? 'bg-amber-400 text-amber-950' : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual 16 Beat Tracker */}
          <div className="space-y-1.5 pt-2 border-t border-emerald-800/60">
            <div className="flex justify-between text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              <span>Sam (1)</span>
              <span>Tali (5)</span>
              <span>Khali (9)</span>
              <span>Tali (13)</span>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
              {Array.from({ length: 16 }).map((_, i) => {
                const beatNum = i + 1;
                const isActive = currentBeat === beatNum;
                const isSam = beatNum === 1;
                const isKhali = beatNum === 9;
                return (
                  <div
                    key={i}
                    className={`h-7 sm:h-8 rounded-md flex items-center justify-center text-[10px] font-extrabold transition-all ${
                      isActive 
                        ? 'bg-amber-400 text-amber-950 scale-105 shadow-lg ring-2 ring-amber-300 z-10' 
                        : isSam
                          ? 'bg-emerald-700 text-amber-300 border border-amber-400/50'
                          : isKhali
                            ? 'bg-indigo-900/80 text-indigo-200'
                            : 'bg-emerald-900/50 text-emerald-300'
                    }`}
                  >
                    {beatNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notation Grid */}
        <div className="space-y-6">
          {/* Sthayi */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-950 text-sm sm:text-base flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-600" />
                <span>Sthayi (First Section)</span>
              </h3>
              <button
                onClick={() => copyToClipboard("| S  R  G  P | N  P  G  R |\n| S  R  G  P | G  R  S  - |\n| R  G  P  N | S' N  P  G |\n| R  G  R  S | -  -  -  - |", 'sthayi')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'sthayi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sthayi' ? 'Copied' : 'Copy Sthayi'}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-emerald-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2 overflow-x-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| S &nbsp; R &nbsp; G &nbsp; P |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| N &nbsp; P &nbsp; G &nbsp; R |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| S &nbsp; R &nbsp; G &nbsp; P |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| G &nbsp; R &nbsp; S &nbsp; - |</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold pt-1">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| R &nbsp; G &nbsp; P &nbsp; N |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| S' N &nbsp; P &nbsp; G |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| R &nbsp; G &nbsp; R &nbsp; S |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| - &nbsp; - &nbsp; - &nbsp; - |</div>
              </div>
            </div>
            <p className="text-[11px] text-emerald-900/80 font-medium italic">
              * Repeat Sthayi once before moving to Antara.
            </p>
          </div>

          {/* Antara */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-950 text-sm sm:text-base flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-600" />
                <span>Antara (Upper Octave Section)</span>
              </h3>
              <button
                onClick={() => copyToClipboard("| S' N  P  N | S' N  P  G |\n| P  G  R  S | R  G  P  N |\n| S' N  P  G | R  G  P  G |\n| R  S  R  G | P  G  R  S |", 'antara')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'antara' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'antara' ? 'Copied' : 'Copy Antara'}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-emerald-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2 overflow-x-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold">
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| S' N &nbsp; P &nbsp; N |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| S' N &nbsp; P &nbsp; G |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| P &nbsp; G &nbsp; R &nbsp; S |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| R &nbsp; G &nbsp; P &nbsp; N |</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold pt-1">
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| S' N &nbsp; P &nbsp; G |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| R &nbsp; G &nbsp; P &nbsp; G |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| R &nbsp; S &nbsp; R &nbsp; G |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| P &nbsp; G &nbsp; R &nbsp; S |</div>
              </div>
            </div>
          </div>

          {/* Ending (Tihai) */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <h3 className="font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Ending (Tihai)</span>
            </h3>
            <p className="text-xs text-gray-700">
              Repeat this cadence sequence <strong>three times</strong> to complete the composition:
            </p>
            <div className="bg-white rounded-xl p-3 border border-amber-200 text-center font-mono font-bold text-sm sm:text-base text-bamboo-950">
              <div className="text-amber-900">Repeat 3 Times: G P N &nbsp;|&nbsp; P G R &nbsp;|&nbsp; S</div>
              <div className="text-xs text-emerald-800 mt-1 font-sans font-extrabold uppercase">Finish on: Sa (S)</div>
            </div>
          </div>
        </div>

        {/* How to Practice This Composition */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-bamboo-950 text-sm sm:text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>How to Practice "Udaya Sur"</span>
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
            <li>Play the Aaroh and Avaroh 5 times to warm up.</li>
            <li>Practice the Pakad until transitions feel fluid.</li>
            <li>Learn the Sthayi slowly beat by beat.</li>
            <li>Practice the Antara section separately.</li>
            <li>Join both Sthayi and Antara together smoothly.</li>
            <li>Finish with the 3x Tihai cadence.</li>
            <li className="col-span-1 sm:col-span-2 font-bold text-emerald-900">
              Begin at 50 BPM and gradually increase to 80 BPM as confidence builds.
            </li>
          </ol>
        </div>
      </div>

      {/* Suggested 35-Minute Daily Schedule */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3.5 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Suggested Daily Practice Schedule</span>
        </h2>

        {/* Mobile View: Cards */}
        <div className="block sm:hidden space-y-2.5">
          {[
            { module: 'Long Notes', duration: '5 Mins', objective: 'Tone stability and breath control on S, R, G, P, N, S\'' },
            { module: 'Aaroh–Avaroh', duration: '5 Mins', objective: 'Scale fluency & symmetrical pentatonic muscle memory' },
            { module: 'Pakad Practice', duration: '3 Mins', objective: 'Internalizing signature raga identity & rest on Ga' },
            { module: 'Alankars (Pattern Drills)', duration: '7 Mins', objective: 'Finger speed, agility, and accurate interval jumps' },
            { module: 'Original Composition ("Udaya Sur")', duration: '10 Mins', objective: 'Sthayi, Antara, Teentaal beat sync, and Tihai execution' },
            { module: 'Free Improvisation', duration: '5 Mins', objective: 'Expressive musical exploration and vistaar' },
          ].map((item, idx) => (
            <div key={idx} className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-bamboo-950 text-xs">{item.module}</span>
                <span className="font-mono text-emerald-800 text-[11px] font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">{item.duration}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-normal">{item.objective}</p>
            </div>
          ))}
          <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-3 flex items-center justify-between font-bold text-bamboo-950 text-xs">
            <span>Total Practice Time</span>
            <span className="font-mono text-emerald-900 text-sm">35 Minutes</span>
          </div>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-950 text-xs uppercase font-bold border-b border-emerald-200">
                <th className="p-3">Exercise Module</th>
                <th className="p-3 text-center">Allocated Time</th>
                <th className="p-3">Primary Objective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Long Notes</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">5 Mins</td>
                <td className="p-3">Tone stability and breath control on S, R, G, P, N, S'</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Aaroh–Avaroh Repetitions</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">5 Mins</td>
                <td className="p-3">Scale fluency &amp; symmetrical pentatonic muscle memory</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Pakad Practice</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">3 Mins</td>
                <td className="p-3">Internalizing signature raga identity &amp; rest on Ga</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Alankars (Pattern Drills)</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">7 Mins</td>
                <td className="p-3">Finger speed, agility, and accurate interval jumps</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Original Composition ("Udaya Sur")</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">10 Mins</td>
                <td className="p-3">Sthayi, Antara, Teentaal beat sync, and Tihai execution</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Free Improvisation</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">5 Mins</td>
                <td className="p-3">Expressive musical exploration and vistaar</td>
              </tr>
              <tr className="bg-emerald-100/60 font-bold text-bamboo-950">
                <td className="p-3">Total Recommended Daily Session</td>
                <td className="p-3 text-center font-mono text-sm text-emerald-900">35 Minutes</td>
                <td className="p-3 text-emerald-900">Optimal routine for consistent progress on bansuri</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden transition">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-3.5 sm:p-4 text-left font-bold text-bamboo-950 flex items-center justify-between gap-2.5 bg-gray-50/50 hover:bg-emerald-50/50 transition cursor-pointer active:bg-emerald-100/40"
              >
                <span className="text-xs sm:text-base leading-snug">{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Ragas */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
            <span>Related Ragas to Explore Next</span>
          </h2>
          <button
            onClick={() => onViewChange?.('learn_raagas')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">View All Ragas</span>
            <span className="sm:hidden">All Ragas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {relatedRagas.map((raga, idx) => (
            <div 
              key={idx} 
              onClick={() => onViewChange?.(raga.view as AppView)}
              className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2 hover:shadow-md hover:border-emerald-400 hover:bg-emerald-100/50 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-bamboo-950 text-xs sm:text-sm group-hover:text-emerald-800 transition">{raga.name}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  {raga.difficulty}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{raga.description}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-900 group-hover:translate-x-0.5 transition pt-1">
                <span>Open Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />

      {/* Footer Copyright Notice */}
      <div className="text-center text-[11px] sm:text-xs text-gray-500 pt-4 border-t border-bamboo-100 space-y-1">
        <p className="font-semibold text-bamboo-800">© FluteSangam Original Content</p>
        <p>This article, including the "Udaya Sur" beginner practice composition, has been created as original educational material for FluteSangam. You are free to publish it on your website, edit it, and use it in your own lessons. It is intended as an original educational composition rather than a traditional classical bandish.</p>
      </div>
    </div>
  );
}
