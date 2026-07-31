import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, Printer, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb, RotateCcw,
  Sun, ListOrdered, FileText, CheckSquare, Layers
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface RagaYamanViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaYamanView({ onViewChange }: RagaYamanViewProps) {
  // Interactive Swara Audio Player using Web Audio API
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingComposition, setIsPlayingComposition] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(60);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60); // 45 min schedule

  // Audio Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz for Yaman notes with Tivra Ma M^)
  const SWARA_FREQS: Record<string, number> = {
    'S': 261.63,     // Sa (261.63 Hz)
    'R': 293.66,     // Shuddha Re (293.66 Hz)
    'G': 329.63,     // Shuddha Ga (329.63 Hz) - Vadi Swara
    'M^': 369.99,    // Tivra Ma (369.99 Hz / F#4) - Defining Note!
    'P': 392.00,     // Pa (392.00 Hz)
    'D': 440.00,     // Shuddha Dha (440.00 Hz)
    'N': 493.88,     // Shuddha Ni (493.88 Hz) - Samvadi Swara
    "S'": 523.25,    // Upper Sa (523.25 Hz)
    "'N": 246.94,    // Lower Ni
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
    { label: 'Raga Name', value: 'Yaman', icon: <Music className="w-4 h-4 text-amber-600" /> },
    { label: 'Thaat', value: 'Kalyan', icon: <Compass className="w-4 h-4 text-amber-600" /> },
    { label: 'Jati', value: 'Sampurna – Sampurna (Heptatonic)', icon: <Sliders className="w-4 h-4 text-amber-600" /> },
    { label: 'Time of Day', value: '1st quarter of night (6 PM – 9 PM)', icon: <Moon className="w-4 h-4 text-indigo-600" /> },
    { label: 'Vadi (King Note)', value: 'Ga (Gandhar)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Samvadi (Queen Note)', value: 'Ni (Nishad)', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
    { label: 'Nature', value: 'Peaceful, Devotional, Romantic', icon: <Heart className="w-4 h-4 text-rose-600" /> },
    { label: 'Rasa', value: 'Shanta (Peace), Bhakti (Devotion), Shringar (Romance)', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Difficulty Level', value: 'Beginner to Intermediate', icon: <Award className="w-4 h-4 text-amber-600" /> },
  ];

  const dailySchedule = [
    { exercise: 'Long Notes (Kharaj & Sustained Hold)', time: '5 min', desc: 'Hold S, R, G, M^, P, D, N, S\' for 8–10s each with clean breath.' },
    { exercise: 'Aaroh – Avaroh Practice', time: '5 min', desc: 'Repeat N R G M^ D N S\' | S\' N D P M^ G R S 10 times slowly.' },
    { exercise: 'Pakad & Signature Phrases', time: '5 min', desc: 'Focus on N R G, M^ G, and R S with smooth pitch transitions.' },
    { exercise: 'Original Alankars (1, 2 & 3)', time: '10 min', desc: 'Practice 2-note, 3-note, and 4-note return patterns at steady tempo.' },
    { exercise: 'Learning Piece "Sandhya Prakash"', time: '10 min', desc: 'Section A, Section B, and Tihai ending with metronome at 50-80 BPM.' },
    { exercise: 'Free Improvisation (Alaap)', time: '10 min', desc: 'Explore gentle improvisations resting on Ga (Vadi) and Ni (Samvadi).' },
  ];

  const faqs = [
    {
      q: 'Why is Raag Yaman so important in Indian Classical Music?',
      a: 'It is one of the foundational ragas of Hindustani classical music and introduces the essential use of Tivra Madhyam (Ma^). Learning Yaman builds deep pitch accuracy, breath control, and expression.'
    },
    {
      q: 'Which Madhyam is used in Raag Yaman?',
      a: 'Only Tivra Madhyam (M^ / Ma Sharp). Shuddha Madhyam (M) is strictly avoided in the classical form of Raag Yaman.'
    },
    {
      q: 'Is Raag Yaman suitable for beginners on Bansuri?',
      a: 'Yes! Once you are comfortable with pentatonic ragas like Bhoopali and Durga, Raag Yaman is the ideal next step to introduce 7-note scales and altered notes.'
    },
    {
      q: 'Which flute key should I use for practicing Raag Yaman?',
      a: 'A properly tuned bansuri in any key can be used. Many adult learners practice on a G Base bansuri because of its comfortable finger stretch and rich, warm pitch.'
    },
    {
      q: 'What is the best time to perform Raag Yaman?',
      a: 'Traditionally, Raag Yaman is performed during the first quarter of the night (approximately 6 PM – 9 PM), matching the serene transition from dusk to evening.'
    }
  ];

  const relatedRagas = [
    { name: 'Raag Bhoopali', description: 'Pentatonic scale from Kalyan Thaat; uses S R G P D S\' omitting Ma and Ni.', difficulty: 'Beginner' },
    { name: 'Raag Durga', description: 'Serene evening pentatonic scale skipping Ga and Ni, centered around Shuddha Ma.', difficulty: 'Beginner' },
    { name: 'Raag Hamsadhwani', description: 'Auspicious pentatonic raga from Shankarabharanam / Bilawal parent scale.', difficulty: 'Beginner' },
    { name: 'Raag Kalyan (Yaman Kalyan)', description: 'Variant of Yaman that selectively introduces Shuddha Ma in specific descending phrases.', difficulty: 'Intermediate' },
    { name: 'Raag Bilawal', description: 'Parent Thaat scale using all seven Shuddha notes; equivalent to Major scale.', difficulty: 'Beginner' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-16" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Article / LearningResource JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Raag Yaman: Notes, Aaroh, Avaroh, Pakad, Practice & FluteSangam Original Piece",
          "headline": "Raag Yaman: Notes, Aaroh, Avaroh, Pakad, Practice & FluteSangam Original Learning Piece",
          "description": "Master Raag Yaman on Indian bamboo flute (Bansuri) with Tivra Madhyam swara guides, Aaroh-Avaroh, Pakad, Chalan, 45-min practice schedule, alankars, and original piece Sandhya Prakash.",
          "learningResourceType": "Lesson",
          "educationalLevel": "Beginner to Intermediate",
          "author": {
            "@type": "Organization",
            "name": "FluteSangam",
            "url": "https://flutesangam.com"
          },
          "datePublished": "2026-07-30T00:00:00Z",
          "dateModified": "2026-07-30T10:00:00Z",
          "inLanguage": "en",
          "keywords": ["Raag Yaman", "Yaman Raga", "Tivra Madhyam", "Learn Bansuri", "Sandhya Prakash", "Hindustani Classical", "Flute Lessons"]
        })}
      </script>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-amber-950 via-bamboo-950 to-amber-900 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-orange-500/10 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none"></div>

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
            <span className="text-amber-400 font-bold truncate max-w-[120px] sm:max-w-none">Raag Yaman</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                Hindustani Classical • Kalyan Thaat
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-amber-50 leading-tight" itemProp="headline">
                Raag Yaman Guide
              </h1>
              <p className="text-amber-200/90 text-xs sm:text-lg font-medium leading-relaxed">
                Notes, Aaroh, Avaroh, Pakad, 45-Min Practice Schedule &amp; Original Piece <em className="text-amber-300 font-serif">"Sandhya Prakash"</em>.
              </p>
            </div>

            {/* Timestamps & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-amber-950/80 border border-amber-800/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Published: <strong className="text-white">Jul 30, 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Updated: <strong className="text-white">Jul 30, 2026</strong></span>
                </div>
                <div className="pt-1 border-t border-amber-800/60 flex items-center gap-1.5 text-amber-400 font-bold text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Educational Content</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 border border-amber-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 min-h-[38px]"
                  title="Print or Save Lesson PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
                <button
                  onClick={() => copyToClipboard(window.location.href, 'link')}
                  className="bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 border border-amber-700/60 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 min-h-[38px]"
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
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Introduction</span>
        </h2>
        <div className="prose prose-bamboo text-gray-700 text-xs sm:text-base leading-relaxed space-y-3">
          <p>
            Raag Yaman is one of the most important and widely performed ragas in Hindustani Classical Music. It belongs to the <strong>Kalyan Thaat</strong> and is often considered the gateway to learning evening ragas. Every serious student of Indian classical music studies Raag Yaman because it introduces the use of <strong>Tivra Madhyam (M^)</strong> while maintaining a graceful and melodious character.
          </p>
          <p>
            The beauty of Raag Yaman lies in its smooth phrases, elegant movements, and expressive nature. It develops breath control, note accuracy, and improvisation skills, making it an excellent choice for flute players after learning pentatonic ragas such as Bhoopali and Durga.
          </p>
          <p className="font-medium text-bamboo-900 bg-amber-50/60 p-3 sm:p-4 rounded-xl border-l-4 border-amber-600">
            Raag Yaman is performed in the first quarter of the night (6 PM – 9 PM) and creates a peaceful, devotional, and romantic ambiance.
          </p>
        </div>
      </div>

      {/* Basic Information Grid */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Basic Information</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {basicInfo.map((info, idx) => (
            <div key={idx} className="bg-amber-50/40 border border-amber-100 rounded-xl p-3 sm:p-4 flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-3xs border border-amber-100 shrink-0">
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

      {/* Swaras Used Section (With Interactive Tone Pads & Tivra Ma Warning) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
            <span>Swaras Used in Raag Yaman</span>
          </h2>
          <span className="text-[11px] text-amber-900 font-semibold bg-amber-100/80 px-2.5 py-1 rounded-full self-start sm:self-auto">
            Tap Swaras to Hear Flute Tone
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Notes Used */}
          <div className="md:col-span-2 bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Notes Used (7 Swaras featuring Tivra Ma)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[
                { name: 'S', full: 'Sa' },
                { name: 'R', full: 'Re' },
                { name: 'G', full: 'Ga (Vadi)', isVadi: true },
                { name: 'M^', full: 'Tivra Ma', isTivra: true },
                { name: 'P', full: 'Pa' },
                { name: 'D', full: 'Dha' },
                { name: 'N', full: 'Ni (Samvadi)', isSamvadi: true },
              ].map((swara) => (
                <button
                  key={swara.name}
                  onClick={() => playSwaraTone(swara.name)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer touch-manipulation active:scale-95 ${
                    activeSwara === swara.name 
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300' 
                      : swara.isTivra
                        ? 'bg-rose-100 text-rose-950 border-rose-300 hover:bg-rose-200 ring-1 ring-rose-300'
                        : swara.isVadi || swara.isSamvadi
                          ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                          : 'bg-white text-bamboo-950 border-amber-200 hover:bg-amber-100/60'
                  }`}
                  title={`Play ${swara.full}`}
                >
                  <span className="block text-base font-extrabold font-mono">{swara.name}</span>
                  <span className="block text-[9px] font-semibold mt-0.5 opacity-80 truncate">{swara.full}</span>
                  {swara.isTivra && <span className="block text-[8px] text-rose-800 font-bold uppercase mt-0.5">Tivra</span>}
                  {swara.isVadi && <span className="block text-[8px] text-amber-800 font-bold uppercase mt-0.5">Vadi</span>}
                  {swara.isSamvadi && <span className="block text-[8px] text-amber-800 font-bold uppercase mt-0.5">Samvadi</span>}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-amber-900/90 italic pt-1">
              * Note: Yaman is a Sampurna (7-note) raga. All notes are Shuddha except <strong>Tivra Madhyam (M^)</strong>.
            </p>
          </div>

          {/* Important Rule Box */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-2.5">
            <h3 className="font-bold text-rose-950 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Critical Rule</span>
            </h3>
            <div className="space-y-2 text-xs text-rose-950 leading-relaxed">
              <p>
                <strong>Raag Yaman uses ONLY Tivra Madhyam (M^).</strong>
              </p>
              <p className="bg-white p-2.5 rounded-xl border border-rose-200 font-semibold text-[11px]">
                Shuddha Madhyam (M) is strictly NOT used in the classical form of Yaman.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aaroh, Avaroh, Pakad & Chalan */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Aaroh, Avaroh, Pakad &amp; Chalan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Aaroh */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Aaroh (Ascending Scale)</span>
              <button
                onClick={() => copyToClipboard("N R G M^ D N S'", 'aaroh')}
                className="text-[11px] text-amber-700 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'aaroh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'aaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100 flex items-center justify-center gap-1.5 sm:gap-2.5 text-base sm:text-lg font-mono font-extrabold text-bamboo-950 flex-wrap">
              {["'N", 'R', 'G', 'M^', 'D', 'N', "S'"].map((note, idx) => (
                <span key={idx} className={`px-2 py-1 rounded border transition cursor-pointer hover:bg-amber-200 ${note === 'M^' ? 'bg-rose-100 text-rose-950 border-rose-300 font-black' : 'bg-amber-50 border-amber-200'}`} onClick={() => playSwaraTone(note)}>
                  {note}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 text-center">
              Note: Aaroh traditionally commences from mandatory lower Nishad ('N).
            </p>
          </div>

          {/* Avaroh */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Avaroh (Descending Scale)</span>
              <button
                onClick={() => copyToClipboard("S' N D P M^ G R S", 'avaroh')}
                className="text-[11px] text-amber-700 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'avaroh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'avaroh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100 flex items-center justify-center gap-1.5 sm:gap-2.5 text-base sm:text-lg font-mono font-extrabold text-bamboo-950 flex-wrap">
              {["S'", 'N', 'D', 'P', 'M^', 'G', 'R', 'S'].map((note, idx) => (
                <span key={idx} className={`px-2 py-1 rounded border transition cursor-pointer hover:bg-amber-200 ${note === 'M^' ? 'bg-rose-100 text-rose-950 border-rose-300 font-black' : 'bg-amber-50 border-amber-200'}`} onClick={() => playSwaraTone(note)}>
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pakad */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Pakad (Signature Catchphrase)
            </h3>
            <button
              onClick={() => copyToClipboard("N R G | R G | M^ G | R S | N R G M^ | D N S'", 'pakad')}
              className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedSection === 'pakad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pakad' ? 'Copied' : 'Copy Notation'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl p-4 border border-amber-200 text-center space-y-2">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">Classical Yaman Pakad Phrases</span>
            <div className="text-sm sm:text-lg font-mono font-bold text-bamboo-950 tracking-wide flex flex-wrap items-center justify-center gap-2">
              <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">'N R G</span>
              <span>|</span>
              <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">R G</span>
              <span>|</span>
              <span className="bg-rose-50 border border-rose-200 text-rose-950 px-2.5 py-1 rounded-md">M^ G</span>
              <span>|</span>
              <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">R S</span>
              <span>|</span>
              <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">'N R G M^</span>
              <span>|</span>
              <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">D N S'</span>
            </div>
          </div>
        </div>

        {/* Chalan */}
        <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-bamboo-950 text-sm sm:text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            Chalan (Melodic Progression)
          </h3>
          <p className="text-xs text-gray-600">
            Follow this signature movement pattern to capture the authentic romantic and serene essence of Raag Yaman:
          </p>
          <div className="bg-white rounded-xl p-4 border border-amber-200 font-mono text-xs sm:text-sm text-bamboo-950 space-y-2.5 leading-relaxed">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-amber-100/80 text-amber-950 px-2.5 py-1 rounded-md font-bold">'N R G</span>
              <span className="text-gray-400">→</span>
              <span className="bg-rose-100/80 text-rose-950 px-2.5 py-1 rounded-md font-bold">M^</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/80 text-amber-950 px-2.5 py-1 rounded-md font-bold">D N S'</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
              <span className="bg-amber-100/80 text-amber-950 px-2.5 py-1 rounded-md font-bold">S' N D P</span>
              <span className="text-gray-400">→</span>
              <span className="bg-rose-100/80 text-rose-950 px-2.5 py-1 rounded-md font-bold">M^ G</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/80 text-amber-950 px-2.5 py-1 rounded-md font-bold">R S</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
              <span className="bg-amber-100/80 text-amber-950 px-2.5 py-1 rounded-md font-bold">'N R G</span>
              <span className="text-gray-400">→</span>
              <span className="bg-rose-100/80 text-rose-950 px-2.5 py-1 rounded-md font-bold">M^ D</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-100/80 text-amber-950 px-2.5 py-1 rounded-md font-bold">N S'</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Characteristics & Mood/Emotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Characteristics */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Important Characteristics</span>
          </h2>
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            {[
              'Tivra Madhyam (M^) is the defining note of the entire raga.',
              'Avoid Shuddha Madhyam (M) completely in classical Yaman.',
              'Ga (Gandhar - Vadi) and Ni (Nishad - Samvadi) are prominent resting notes.',
              'Use smooth, flowing movements and subtle glides (Meend).',
              'The raga should sound graceful, dignified, and serene at all times.',
            ].map((char, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mood & Emotion */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-orange-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-amber-200/80 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-amber-950 font-display flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Mood and Emotion (Rasa)</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
            Raag Yaman expresses soothing, romantic, and spiritual feelings:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {['Peace (Shanta)', 'Devotion (Bhakti)', 'Romance (Shringar)', 'Hope', 'Spirituality', 'Elegance'].map((mood, idx) => (
              <span key={idx} className="bg-white border border-amber-300 text-amber-950 font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs shadow-3xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                {mood}
              </span>
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-amber-900/90 leading-relaxed pt-2 border-t border-amber-200/60">
            It is universally acknowledged as one of the most soothing and enchanting ragas in Hindustani classical music.
          </p>
        </div>
      </div>

      {/* Why Learn Raag Yaman */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Why Learn Raag Yaman?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: 'Introduces Tivra Madhyam', desc: 'Teaches you how to execute sharp notes accurately on the bansuri.' },
            { title: 'Improves Breath Control', desc: 'Long sustained phrases on Ga and Ni build deep diaphragmatic breathing.' },
            { title: 'Develops Meend (Glides)', desc: 'Teaches smooth continuous finger slides between N-R, G-M^, and M^-D.' },
            { title: 'Strengthens Note Transitions', desc: 'Bridges beginner pentatonic scales to full heptatonic classical performance.' },
            { title: 'Builds Improvisation Skills', desc: 'Provides the ultimate flexible framework for Alaap and Taans.' },
            { title: 'Essential Gateway Raga', desc: 'Foundational benchmark raga studied by every classical bansuri artist.' },
          ].map((reason, idx) => (
            <div key={idx} className="bg-amber-50/40 border border-amber-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1 hover:shadow-sm transition">
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">0{idx + 1}</span>
              <h3 className="font-bold text-bamboo-950 text-xs sm:text-sm mt-1">{reason.title}</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beginner Practice Routine & Timer */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
              <Repeat className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
              <span>Beginner Practice Routine</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Structured Sargam and Alankar drills for daily practice</p>
          </div>

          {/* Practice Session Timer Widget */}
          <div className="bg-amber-950 text-white rounded-xl p-2.5 sm:p-3 flex items-center justify-between sm:justify-end gap-3 border border-amber-800 shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-[65px]">
                <span className="text-[9px] text-amber-300 font-medium block uppercase leading-none">Practice Timer</span>
                <span className="text-sm font-mono font-extrabold text-amber-300">{formatTimer(timerSeconds)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1.5 bg-amber-800 hover:bg-amber-700 rounded-lg text-white transition cursor-pointer"
                title={isTimerRunning ? "Pause Timer" : "Start 45-Min Timer"}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(45 * 60); }}
                className="p-1.5 bg-amber-900 hover:bg-amber-800 rounded-lg text-amber-300 transition cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 1. Long Notes */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-extrabold flex items-center justify-center">1</span>
            <span>Long Notes (Sustained Hold)</span>
          </h3>
          <p className="text-xs text-gray-600">
            Hold each note for <strong>8–10 seconds</strong> with steady airflow, paying special attention to tuning <strong>M^</strong>:
          </p>
          <div className="bg-white rounded-xl p-3 border border-amber-200 flex flex-wrap items-center justify-center gap-2 text-base font-mono font-bold text-bamboo-950">
            {['S', 'R', 'G', 'M^', 'P', 'D', 'N', "S'"].map((note, i) => (
              <span key={i} className={`px-3 py-1 rounded-lg border ${note === 'M^' ? 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold' : 'bg-amber-50 border-amber-200'}`}>
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Aaroh-Avaroh Repetitions */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-extrabold flex items-center justify-center">2</span>
            <span>Aaroh–Avaroh Scale Drills</span>
          </h3>
          <p className="text-xs text-gray-600">
            Repeat slowly <strong>10 times</strong> at steady tempo:
          </p>
          <div className="bg-white rounded-xl p-3 border border-amber-200 space-y-1 text-center font-mono font-bold text-xs sm:text-sm text-bamboo-950">
            <div>Ascending: 'N R G M^ D N S'</div>
            <div className="text-amber-800">Descending: S' N D P M^ G R S</div>
          </div>
        </div>

        {/* 3. Alankars */}
        <div className="space-y-4">
          <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-extrabold flex items-center justify-center">3</span>
            <span>FluteSangam Original Alankars</span>
          </h3>

          {/* Alankar 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-amber-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 1 (2-Note Step Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R | R G | G M^ | M^ P | P D | D N | N S'\nDescending: S' N | N D | D P | P M^ | M^ G | G R | R S", 'alankar1')}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Ascending</strong> S R &nbsp;|&nbsp; R G &nbsp;|&nbsp; G M^ &nbsp;|&nbsp; M^ P &nbsp;|&nbsp; P D &nbsp;|&nbsp; D N &nbsp;|&nbsp; N S'</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' N &nbsp;|&nbsp; N D &nbsp;|&nbsp; D P &nbsp;|&nbsp; P M^ &nbsp;|&nbsp; M^ G &nbsp;|&nbsp; G R &nbsp;|&nbsp; R S</div>
            </div>
          </div>

          {/* Alankar 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-amber-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 2 (3-Note Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R G | R G M^ | G M^ P | M^ P D | P D N | D N S'\nDescending: S' N D | N D P | D P M^ | P M^ G | M^ G R | G R S", 'alankar2')}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Ascending</strong> S R G &nbsp;|&nbsp; R G M^ &nbsp;|&nbsp; G M^ P &nbsp;|&nbsp; M^ P D &nbsp;|&nbsp; P D N &nbsp;|&nbsp; D N S'</div>
              <div><strong className="text-amber-900 block text-[10px] uppercase font-sans">Descending</strong> S' N D &nbsp;|&nbsp; N D P &nbsp;|&nbsp; D P M^ &nbsp;|&nbsp; P M^ G &nbsp;|&nbsp; M^ G R &nbsp;|&nbsp; G R S</div>
            </div>
          </div>

          {/* Alankar 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 hover:border-amber-300 transition">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-bamboo-950">Alankar 3 (4-Note Return Pattern)</h4>
              <button
                onClick={() => copyToClipboard("Ascending: S R G R | R G M^ G | G M^ P M^ | M^ P D P | P D N D | D N S' N", 'alankar3')}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'alankar3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'alankar3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs font-mono">
              <strong className="text-amber-900 block text-[10px] uppercase font-sans mb-1">Ascending Phrase</strong>
              S R G R &nbsp;|&nbsp; R G M^ G &nbsp;|&nbsp; G M^ P M^ &nbsp;|&nbsp; M^ P D P &nbsp;|&nbsp; P D N D &nbsp;|&nbsp; D N S' N
            </div>
          </div>
        </div>
      </div>

      {/* Common Mistakes & Performance Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Common Mistakes */}
        <div className="bg-rose-50/40 border border-rose-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-rose-950 font-display flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Common Mistakes to Avoid</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
            {[
              'Accidentally playing Shuddha Ma instead of Tivra Ma (M^).',
              'Rushing through phrases without sustaining the notes properly.',
              'Ignoring Tivra Ma or under-pitching it.',
              'Jumping abruptly between notes without smooth glides.',
              'Playing mechanically without expressing the serene evening mood.',
            ].map((mistake, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">❌</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips for Better Performance */}
        <div className="bg-amber-50/40 border border-amber-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-amber-950 font-display flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Tips for Better Performance</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
            {[
              'Always practice with a background Tanpura drone set to Sa-Pa.',
              'Give special attention to fine-tuning Tivra Ma (M^).',
              'Keep your tone smooth and continuous.',
              'Use controlled diaphragmatic breathing.',
              'Play slowly at 50 BPM before gradually increasing speed.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold shrink-0">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FluteSangam Original Learning Piece: "Sandhya Prakash" */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            FluteSangam Original Educational Piece
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-bamboo-900 tracking-tight">
            Original Piece: "Sandhya Prakash" (Evening Light)
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            An educational practice piece designed specifically for bansuri learners, set in <strong>Teentaal (16 Beats)</strong> in <strong>Madhya Laya</strong>.
          </p>
        </div>

        {/* Metronome Control & Visual Beat Bar */}
        <div className="bg-gradient-to-r from-amber-950 via-bamboo-950 to-amber-900 text-white rounded-2xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <button
                onClick={() => setIsPlayingComposition(!isPlayingComposition)}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition cursor-pointer touch-manipulation active:scale-95 shadow-md ${
                  isPlayingComposition 
                    ? 'bg-amber-500 hover:bg-amber-400 text-amber-950' 
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {isPlayingComposition ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                  {isPlayingComposition ? 'Pause Metronome' : 'Start Teentaal Metronome'}
                </span>
              </button>

              <div className="hidden md:block text-xs">
                <span className="text-amber-300 font-medium block">Taal: Teentaal</span>
                <span className="text-amber-300 font-bold">16 Beats / Cycle</span>
              </div>
            </div>

            {/* BPM Slider */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2 bg-amber-900/60 border border-amber-700/60 rounded-xl p-2 sm:p-2.5">
              <span className="text-xs font-extrabold text-amber-200 shrink-0">BPM: {bpm}</span>
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
                      bpm === speed ? 'bg-amber-400 text-amber-950' : 'bg-amber-800 text-amber-200 hover:bg-amber-700'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual 16 Beat Tracker - 8 columns on mobile, 16 on desktop */}
          <div className="space-y-1.5 pt-2 border-t border-amber-800/60">
            <div className="flex justify-between text-[10px] text-amber-300 font-bold uppercase tracking-wider">
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
                          ? 'bg-amber-700 text-amber-300 border border-amber-400/50'
                          : isKhali
                            ? 'bg-amber-900/80 text-amber-400 border border-amber-700/50'
                            : 'bg-amber-900/40 text-amber-200/80 border border-amber-800/40'
                    }`}
                  >
                    {beatNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notation Sections */}
        <div className="space-y-6">
          {/* Section A */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h3 className="font-extrabold text-amber-950 text-base sm:text-lg flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-600 text-white text-xs rounded-md">Section A</span>
                <span>Asthai Phrasing</span>
              </h3>
              <button
                onClick={() => copyToClipboard("| N R G M^ | D N S' N |\n| D P M^ G | R S - - |\n| N R G M^ | G R S - |\n| R G M^ D | N S' - - |", 'sectionA')}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'sectionA' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sectionA' ? 'Copied' : 'Copy Section A'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                <div className="text-[10px] font-sans font-bold text-gray-500 uppercase">Beats 1 - 8</div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | 'N &nbsp; R &nbsp; G &nbsp; M^ | D &nbsp; N &nbsp; S' &nbsp; N |
                </div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | D &nbsp; P &nbsp; M^ &nbsp; G | R &nbsp; S &nbsp; - &nbsp; - |
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                <div className="text-[10px] font-sans font-bold text-gray-500 uppercase">Beats 9 - 16</div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | 'N &nbsp; R &nbsp; G &nbsp; M^ | G &nbsp; R &nbsp; S &nbsp; - |
                </div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | R &nbsp; G &nbsp; M^ &nbsp; D | N &nbsp; S' &nbsp; - &nbsp; - |
                </div>
              </div>
            </div>
          </div>

          {/* Section B */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h3 className="font-extrabold text-amber-950 text-base sm:text-lg flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-700 text-white text-xs rounded-md">Section B</span>
                <span>Antara Phrasing</span>
              </h3>
              <button
                onClick={() => copyToClipboard("| S' N D P | M^ G R S |\n| N R G M^ | D N S' N |\n| D P M^ G | R G M^ D |\n| N D P M^ | G R S - |", 'sectionB')}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'sectionB' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sectionB' ? 'Copied' : 'Copy Section B'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                <div className="text-[10px] font-sans font-bold text-gray-500 uppercase">Beats 1 - 8</div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | S' &nbsp; N &nbsp; D &nbsp; P | M^ &nbsp; G &nbsp; R &nbsp; S |
                </div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | 'N &nbsp; R &nbsp; G &nbsp; M^ | D &nbsp; N &nbsp; S' &nbsp; N |
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                <div className="text-[10px] font-sans font-bold text-gray-500 uppercase">Beats 9 - 16</div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | D &nbsp; P &nbsp; M^ &nbsp; G | R &nbsp; G &nbsp; M^ &nbsp; D |
                </div>
                <div className="text-bamboo-950 font-extrabold tracking-wider bg-amber-50/80 p-2 rounded border border-amber-100 text-center">
                  | N &nbsp; D &nbsp; P &nbsp; M^ | G &nbsp; R &nbsp; S &nbsp; - |
                </div>
              </div>
            </div>
          </div>

          {/* Ending Phrase (Tihai) */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <h3 className="font-extrabold text-rose-950 text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Ending Phrase (Repeat 3 Times)</span>
            </h3>
            <p className="text-xs text-rose-900">
              Repeat the following 2-beat cadence 3 times to conclude the piece on <strong>Sa</strong>:
            </p>
            <div className="bg-white rounded-xl p-4 border border-rose-200 flex flex-wrap items-center justify-center gap-3 text-base sm:text-lg font-mono font-bold text-bamboo-950">
              <span className="bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-300">G M^ &nbsp; R S</span>
              <span className="text-gray-400">× 3</span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-600 text-white px-4 py-1.5 rounded-lg shadow-sm">Finish on Sa (S)</span>
            </div>
          </div>

          {/* How to Practice Steps */}
          <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 sm:p-6 space-y-3">
            <h3 className="font-bold text-bamboo-950 text-sm sm:text-base flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-amber-600 shrink-0" />
              <span>How to Practice "Sandhya Prakash"</span>
            </h3>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs text-gray-700">
              <li className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Step 1</span>
                <p className="font-semibold text-bamboo-950">Master Scale &amp; Pakad</p>
                <p className="text-[11px] text-gray-500">Practice Aaroh, Avaroh, and Pakad until smooth.</p>
              </li>
              <li className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Step 2</span>
                <p className="font-semibold text-bamboo-950">Learn Section A</p>
                <p className="text-[11px] text-gray-500">Memorize Asthai phrases slowly without metronome.</p>
              </li>
              <li className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Step 3</span>
                <p className="font-semibold text-bamboo-950">Learn Section B &amp; Tihai</p>
                <p className="text-[11px] text-gray-500">Memorize Antara and 3x repeat ending phrase.</p>
              </li>
              <li className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Step 4</span>
                <p className="font-semibold text-bamboo-950">Speed Up (50-80 BPM)</p>
                <p className="text-[11px] text-gray-500">Play both sections together starting at 50 BPM.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Daily Practice Schedule (45 Minutes) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Daily 45-Minute Practice Schedule</span>
        </h2>

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 sm:hidden gap-3">
          {dailySchedule.map((item, idx) => (
            <div key={idx} className="bg-amber-50/40 border border-amber-100 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-bamboo-950">{item.exercise}</span>
                <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">{item.time}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-amber-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-100/70 text-amber-950 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">Exercise</th>
                <th className="p-3.5 w-28">Allocated Time</th>
                <th className="p-3.5">Focus Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-gray-800 font-medium">
              {dailySchedule.map((item, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition">
                  <td className="p-3.5 font-bold text-bamboo-950">{item.exercise}</td>
                  <td className="p-3.5 text-amber-900 font-bold">
                    <span className="bg-amber-100 px-2.5 py-1 rounded-md text-xs">{item.time}</span>
                  </td>
                  <td className="p-3.5 text-gray-600 text-xs">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="border border-amber-100 rounded-2xl overflow-hidden transition bg-amber-50/20"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-bamboo-950 hover:bg-amber-50/80 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-amber-600 font-extrabold">Q.</span>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-amber-100/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Ragas Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
          <span>Related Ragas to Explore</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {relatedRagas.map((raga, idx) => (
            <div key={idx} className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 space-y-2 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-bamboo-950 text-sm">{raga.name}</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">{raga.difficulty}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{raga.description}</p>
              {raga.name.includes('Bhoopali') && (
                <button
                  onClick={() => onViewChange?.('raga_bhoopali')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-950 flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <span>Open Bhoopali Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {raga.name.includes('Durga') && (
                <button
                  onClick={() => onViewChange?.('raga_durga')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-950 flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <span>Open Durga Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />

      {/* Original Educational Content Copyright Banner */}
      <div className="bg-amber-950 text-amber-200/90 rounded-2xl p-4 sm:p-6 text-xs leading-relaxed space-y-2 border border-amber-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>© FluteSangam Original Educational Content</span>
        </div>
        <p>
          This article and the <strong>"Sandhya Prakash"</strong> learning piece are original educational materials created specifically for FluteSangam. The learning piece is designed as a practice exercise inspired by the note set and characteristic movements of Raag Yaman. It is not presented as a traditional bandish or a classical composition from any gharana, ensuring high clarity and focus for modern bansuri learners.
        </p>
      </div>
    </div>
  );
}
