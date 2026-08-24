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

interface RagaDurgaViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaDurgaView({ onViewChange }: RagaDurgaViewProps) {
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

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz for Durga notes)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,   // Sa (261Hz)
    'R': 293.66,   // Shuddha Re (293Hz)
    'M': 349.23,   // Shuddha Ma (349Hz) - Vadi Swara
    'P': 392.00,   // Pa (392Hz)
    'D': 440.00,   // Shuddha Dha (440Hz)
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
      filter.frequency.setValueAtTime(1300, ctx.currentTime);

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
    { label: 'Raga Name', value: 'Durga', icon: <Music className="w-4 h-4 text-emerald-600" /> },
    { label: 'Thaat', value: 'Bilawal', icon: <Compass className="w-4 h-4 text-emerald-600" /> },
    { label: 'Jati', value: 'Audav – Audav (Pentatonic)', icon: <Sliders className="w-4 h-4 text-emerald-600" /> },
    { label: 'Time of Day', value: '2nd quarter of night (9 PM – 12 AM)', icon: <Moon className="w-4 h-4 text-indigo-600" /> },
    { label: 'Vadi (King Note)', value: 'Ma (Madhyam)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Samvadi (Queen Note)', value: 'Sa (Shadj)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Nature', value: 'Peaceful, Devotional, Majestic', icon: <Heart className="w-4 h-4 text-emerald-600" /> },
    { label: 'Rasa', value: 'Bhakti (Devotion), Veer (Courage), Shanta (Peace)', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Difficulty Level', value: 'Beginner', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  const faqs = [
    {
      q: 'Is Raag Durga suitable for beginners?',
      a: 'Yes. Its five-note structure makes it one of the easiest ragas to learn after Bhoopali. It builds clean finger transitions and pitch control without flat or sharp notes.'
    },
    {
      q: 'Which notes are omitted in Raag Durga?',
      a: 'Gandhar (Ga) and Nishad (Ni) are strictly omitted in both Aaroh and Avaroh. Never play Ga or Ni when performing Raag Durga.'
    },
    {
      q: 'Which note is most important in Raag Durga?',
      a: 'Madhyam (Ma) is the Vadi (king) note. Pausing on Ma and giving it subtle emphasis gives Raag Durga its peaceful, uplifting character.'
    },
    {
      q: 'Which flute can be used to practice Raag Durga?',
      a: 'Raag Durga can be practiced on any properly tuned bansuri. A G Base bansuri is a comfortable choice for many adult learners, but C Medium or E Bass work wonderfully too.'
    },
    {
      q: 'What is the best time to perform Raag Durga?',
      a: 'Traditionally, Raag Durga is performed during the second quarter of the night (approximately 9 PM – 12 AM).'
    }
  ];

  const relatedRagas = [
    { name: 'Raag Bhoopali', view: 'raga_bhoopali', description: 'Pentatonic scale skipping Ma and Ni; serene evening raga focused on Ga and Dha.', difficulty: 'Beginner' },
    { name: 'Raag Hamsadhwani', view: 'raga_hamsadhwani', description: 'Bright pentatonic scale skipping Ma and Dha; auspicious and energetic mood.', difficulty: 'Beginner' },
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
          "name": "Raag Durga: Notes, Aaroh, Avaroh, Pakad, Practice & Original Composition",
          "headline": "Raag Durga: Notes, Aaroh, Avaroh, Pakad, Practice & Original Composition on Bansuri",
          "description": "Master Raag Durga on Indian bamboo flute (Bansuri) with step-by-step swara guides, Aaroh-Avaroh, Pakad, Chalan, practice routine, alankars, and the original composition Shant Dhara.",
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
          "keywords": ["Raag Durga", "Durga Raga", "Learn Bansuri", "Flute Raga", "Shant Dhara", "Hindustani Classical", "Sargam Notes"]
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
            <span className="text-amber-400 font-bold truncate max-w-[120px] sm:max-w-none">Raag Durga</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                Hindustani Classical • Audav-Audav
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-emerald-50 leading-tight" itemProp="headline">
                Raag Durga Guide
              </h1>
              <p className="text-emerald-200/90 text-xs sm:text-lg font-medium leading-relaxed">
                Notes, Aaroh, Avaroh, Pakad, Practice Routine &amp; Original FluteSangam Composition <em className="text-amber-300 font-serif">"Shant Dhara"</em>.
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
                  <span>Educational Guide</span>
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
            Raag Durga is a beautiful pentatonic (Audav) raga in Hindustani Classical Music. It is known for its peaceful, devotional, and uplifting character, making it an excellent choice for beginners learning the bansuri.
          </p>
          <p>
            Raag Durga uses only five notes, omitting Gandhar (Ga) and Nishad (Ni). The absence of these notes gives the raga a distinct identity that is easy to recognize. Although simple in structure, Raag Durga offers rich opportunities for expression and develops good control over note transitions and breath.
          </p>
          <p className="font-medium text-bamboo-900 bg-emerald-50/60 p-3 sm:p-4 rounded-xl border-l-4 border-emerald-600">
            It is commonly performed in the evening and is suitable for both instrumental and vocal performances.
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
            <span>Swaras Used in Raag Durga</span>
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
                { name: 'M', full: 'Ma (Madhyam - Vadi)', isVadi: true },
                { name: 'P', full: 'Pa (Pancham)' },
                { name: 'D', full: 'Dha (Dhaivat)' },
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
                        : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-100/60'
                  }`}
                  title={`Play ${swara.full}`}
                >
                  <span className="block text-base font-extrabold font-mono">{swara.name}</span>
                  <span className="block text-[9px] font-semibold mt-0.5 opacity-80 truncate">{swara.full.split(' ')[0]}</span>
                  {swara.isVadi && <span className="block text-[8px] text-amber-800 font-bold uppercase mt-0.5">Vadi</span>}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-emerald-900/80 italic pt-1">
              * Note: All notes used in Raag Durga are strictly <strong>Shuddha Swaras</strong> (natural notes).
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
                <span className="text-lg font-mono font-bold text-red-600 line-through">Ga (G)</span>
                <span className="block text-[11px] text-gray-600 font-medium">Gandhar</span>
                <span className="text-[9px] text-red-700 font-extrabold bg-red-100 px-2 py-0.5 rounded-full inline-block">Strictly Omitted</span>
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-lg font-mono font-bold text-red-600 line-through">Ni (N)</span>
                <span className="block text-[11px] text-gray-600 font-medium">Nishad</span>
                <span className="text-[9px] text-red-700 font-extrabold bg-red-100 px-2 py-0.5 rounded-full inline-block">Strictly Omitted</span>
              </div>
            </div>
            <p className="text-[11px] text-red-900/80 leading-relaxed pt-1">
              Omitting Ga and Ni creates the signature Audav-Audav pentatonic framework of Raag Durga.
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
                onClick={() => copyToClipboard("S R M P D S'", 'aaroh')}
                className="text-[11px] text-emerald-700 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'aaroh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'aaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-center gap-2 sm:gap-3 text-lg font-mono font-extrabold text-bamboo-950">
              {['S', 'R', 'M', 'P', 'D', "S'"].map((note, idx) => (
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
                onClick={() => copyToClipboard("S' D P M R S", 'avaroh')}
                className="text-[11px] text-emerald-700 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'avaroh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'avaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-center gap-2 sm:gap-3 text-lg font-mono font-extrabold text-bamboo-950">
              {["S'", 'D', 'P', 'M', 'R', 'S'].map((note, idx) => (
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
              onClick={() => copyToClipboard("S R M P | D P | M R | S", 'pakad')}
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
                S R M P &nbsp;|&nbsp; D P &nbsp;|&nbsp; M R &nbsp;|&nbsp; S
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Alternative Phrase</span>
              <div className="text-base sm:text-lg font-mono font-bold text-bamboo-950 tracking-wider">
                R M P &nbsp;|&nbsp; M R &nbsp;|&nbsp; S
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
            Follow this signature sequence to understand how Raag Durga moves smoothly across octaves:
          </p>
          <div className="bg-white rounded-xl p-4 border border-emerald-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">S R M</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">P D S'</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">D P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">M R</span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-100/70 text-emerald-950 px-2.5 py-1 rounded-md font-bold">S</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="bg-amber-100/70 text-amber-950 px-2.5 py-1 rounded-md font-bold">R M P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/70 text-amber-950 px-2.5 py-1 rounded-md font-bold">D P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/70 text-amber-950 px-2.5 py-1 rounded-md font-bold">M R S</span>
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
              'Ga and Ni are never used in any phrasing.',
              'Madhyam (Ma) is the Vadi (most important) note.',
              'Shadj (Sa) provides stability, balance, and resolution.',
              'The raga should be played with smooth, flowing phrases.',
              'Avoid treating it like a simple Western pentatonic scale; emphasize characteristic classical phrases.',
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
            Raag Durga expresses deep spiritual and majestic feelings of:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {['Peace', 'Devotion (Bhakti)', 'Strength', 'Serenity', 'Hope', 'Confidence'].map((mood, idx) => (
              <span key={idx} className="bg-white border border-emerald-300 text-emerald-950 font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs shadow-3xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                {mood}
              </span>
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-900/90 leading-relaxed pt-2 border-t border-emerald-200/60">
            It is often associated with simplicity and spiritual calmness, evoking both serene devotion and dignified strength.
          </p>
        </div>
      </div>

      {/* Why Beginners Should Learn Raag Durga */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>Why Beginners Should Learn Raag Durga</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: 'Easy Five-Note Structure', desc: 'Pentatonic scale without complex accidentals or altered notes.' },
            { title: 'Comfortable Bansuri Fingering', desc: 'Smooth finger hole transitions across Sa, Re, Ma, Pa, and Dha.' },
            { title: 'Develops Breath Control', desc: 'Sustaining Ma and Sa helps build long, steady airflow.' },
            { title: 'Improves Note Accuracy', desc: 'Clean intervals help tune your ear to pure Shuddha notes.' },
            { title: 'Strengthens Ma Transitions', desc: 'Prepares your fingers for agile half-hole or full-hole Ma work.' },
            { title: 'Preparation for Advanced Ragas', desc: 'Excellent foundation before tackling 7-note ragas like Bilawal or Khamaj.' },
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
            {['S', 'R', 'M', 'P', 'D', "S'"].map((note, i) => (
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
            <div>Ascending: S R M P D S'</div>
            <div className="text-emerald-700">Descending: S' D P M R S</div>
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
                onClick={() => copyToClipboard("Ascending: S R | R M | M P | P D | D S'\nDescending: S' D | D P | P M | M R | R S", 'alankar1')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <div><strong className="text-emerald-900 block text-[10px] uppercase font-sans">Ascending</strong> S R &nbsp;|&nbsp; R M &nbsp;|&nbsp; M P &nbsp;|&nbsp; P D &nbsp;|&nbsp; D S'</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' D &nbsp;|&nbsp; D P &nbsp;|&nbsp; P M &nbsp;|&nbsp; M R &nbsp;|&nbsp; R S</div>
            </div>
          </div>

          {/* Alankar 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 2 (3-Note Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R M | R M P | M P D | P D S'\nDescending: S' D P | D P M | P M R | M R S", 'alankar2')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <div><strong className="text-emerald-900 block text-[10px] uppercase font-sans">Ascending</strong> S R M &nbsp;|&nbsp; R M P &nbsp;|&nbsp; M P D &nbsp;|&nbsp; P D S'</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' D P &nbsp;|&nbsp; D P M &nbsp;|&nbsp; P M R &nbsp;|&nbsp; M R S</div>
            </div>
          </div>

          {/* Alankar 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 3 (4-Note Return Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R M R | R M P M | M P D P | P D S' D\nDescending: S' D P D | D P M P | P M R M | M R S", 'alankar3')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <div><strong className="text-emerald-900 block text-[10px] uppercase font-sans">Ascending</strong> S R M R &nbsp;|&nbsp; R M P M &nbsp;|&nbsp; M P D P &nbsp;|&nbsp; P D S' D</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' D P D &nbsp;|&nbsp; D P M P &nbsp;|&nbsp; P M R M &nbsp;|&nbsp; M R S</div>
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
              'Accidentally playing Ga (Gandhar) during fast runs.',
              'Accidentally playing Ni (Nishad) when ascending to upper Sa\'.',
              'Rushing through phrases without sustaining the notes.',
              'Ignoring Ma as the primary resting note (Vadi).',
              'Playing mechanically without expressing the serene mood.',
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
              'Always practice with a background Tanpura drone on Sa-Pa.',
              'Maintain steady, calm airflow without overblowing.',
              'Give slight, tasteful emphasis to Ma in phrasing.',
              'Keep note transitions smooth and connected.',
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

      {/* FluteSangam Original Practice Composition: "Shant Dhara" */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            FluteSangam Original Composition
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-bamboo-900 tracking-tight">
            Composition: "Shant Dhara" (Peaceful Flow)
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

          {/* Visual 16 Beat Tracker - 8 columns on mobile, 16 on desktop for clean layout */}
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
                onClick={() => copyToClipboard("| S  R  M  P | D  P  M  R |\n| S  R  M  P | M  R  S  - |\n| R  M  P  D | S' D  P  M |\n| R  M  R  S | -  -  -  - |", 'sthayi')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'sthayi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sthayi' ? 'Copied' : 'Copy Sthayi'}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-emerald-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2 overflow-x-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| S &nbsp; R &nbsp; M &nbsp; P |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| D &nbsp; P &nbsp; M &nbsp; R |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| S &nbsp; R &nbsp; M &nbsp; P |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| M &nbsp; R &nbsp; S &nbsp; - |</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold pt-1">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| R &nbsp; M &nbsp; P &nbsp; D |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| S' D &nbsp; P &nbsp; M |</div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">| R &nbsp; M &nbsp; R &nbsp; S |</div>
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
                onClick={() => copyToClipboard("| S' D  P  D | S' D  P  M |\n| P  M  R  S | R  M  P  D |\n| S' D  P  M | R  M  P  M |\n| R  S  R  M | P  M  R  S |", 'antara')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'antara' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'antara' ? 'Copied' : 'Copy Antara'}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-emerald-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2 overflow-x-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold">
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| S' D &nbsp; P &nbsp; D |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| S' D &nbsp; P &nbsp; M |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| P &nbsp; M &nbsp; R &nbsp; S |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| R &nbsp; M &nbsp; P &nbsp; D |</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold pt-1">
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| S' D &nbsp; P &nbsp; M |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| R &nbsp; M &nbsp; P &nbsp; M |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| R &nbsp; S &nbsp; R &nbsp; M |</div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">| P &nbsp; M &nbsp; R &nbsp; S |</div>
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
              <div className="text-amber-900">Repeat 3 Times: M P D &nbsp;|&nbsp; P M R &nbsp;|&nbsp; S</div>
              <div className="text-xs text-emerald-800 mt-1 font-sans font-extrabold uppercase">Finish on: Sa (S)</div>
            </div>
          </div>
        </div>

        {/* How to Practice This Composition */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-bamboo-950 text-sm sm:text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>How to Practice "Shant Dhara"</span>
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
            { module: 'Long Notes', duration: '5 Mins', objective: 'Tone stability and breath control on S, R, M, P, D, S\'' },
            { module: 'Aaroh–Avaroh', duration: '5 Mins', objective: 'Scale fluency & symmetrical pentatonic muscle memory' },
            { module: 'Pakad Practice', duration: '3 Mins', objective: 'Internalizing signature raga identity & rest on Ma' },
            { module: 'Alankars (Pattern Drills)', duration: '7 Mins', objective: 'Finger speed, agility, and accurate interval jumps' },
            { module: 'Original Composition ("Shant Dhara")', duration: '10 Mins', objective: 'Sthayi, Antara, Teentaal beat sync, and Tihai execution' },
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
                <td className="p-3">Tone stability and breath control on S, R, M, P, D, S'</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Aaroh–Avaroh Repetitions</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">5 Mins</td>
                <td className="p-3">Scale fluency &amp; symmetrical pentatonic muscle memory</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Pakad Practice</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">3 Mins</td>
                <td className="p-3">Internalizing signature raga identity &amp; rest on Ma</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Alankars (Pattern Drills)</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-800">7 Mins</td>
                <td className="p-3">Finger speed, agility, and accurate interval jumps</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-bamboo-900">Original Composition ("Shant Dhara")</td>
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
        <p>This article, including the "Shant Dhara" beginner practice composition, has been created as original educational material for FluteSangam. You are free to publish it on your website, edit it, and use it in your own lessons. It is intended as an original educational composition rather than a traditional classical bandish.</p>
      </div>
    </div>
  );
}
