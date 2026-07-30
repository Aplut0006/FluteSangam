import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, Printer, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb
} from 'lucide-react';
import { AppView } from '../types';

interface RagaBhoopaliViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function RagaBhoopaliView({ onViewChange }: RagaBhoopaliViewProps) {
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
    'S': 261.63,  // Sa (Middle C / 261Hz)
    'R': 293.66,  // Re (Shuddha Re)
    'G': 329.63,  // Ga (Shuddha Ga)
    'P': 392.00,  // Pa (Pancham)
    'D': 440.00,  // Dha (Shuddha Dha)
    'S\'': 523.25, // Sa' (Upper Sa)
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
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

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
        // Gentle click sound
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
    { label: 'Also Known As', value: 'Bhup / Bhoop', icon: <Music className="w-4 h-4 text-amber-600" /> },
    { label: 'Thaat', value: 'Kalyan', icon: <Compass className="w-4 h-4 text-amber-600" /> },
    { label: 'Jati', value: 'Audav – Audav (Pentatonic)', icon: <Sliders className="w-4 h-4 text-amber-600" /> },
    { label: 'Time of Day', value: 'First quarter of night (6 PM – 9 PM)', icon: <Moon className="w-4 h-4 text-indigo-600" /> },
    { label: 'Vadi (King Note)', value: 'Ga (G)', icon: <CrownIcon className="w-4 h-4 text-amber-700" /> },
    { label: 'Samvadi (Queen Note)', value: 'Dha (D)', icon: <Sparkles className="w-4 h-4 text-amber-700" /> },
    { label: 'Nature & Sentiment', value: 'Peaceful, Devotional, Serene', icon: <Heart className="w-4 h-4 text-emerald-600" /> },
    { label: 'Rasa', value: 'Shanta (Peace) & Bhakti (Devotion)', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Difficulty Level', value: 'Beginner', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  const faqs = [
    {
      q: 'Is Raag Bhoopali suitable for beginners?',
      a: 'Yes! Its simple five-note pentatonic structure makes it one of the easiest and most melodious ragas to learn. It builds finger muscle memory and blowing stability without the complexity of sharp or flat notes.'
    },
    {
      q: 'Which notes are omitted in Bhoopali?',
      a: 'Madhyam (Ma) and Nishad (Ni) are strictly omitted in both Aaroh (ascent) and Avaroh (descent). Playing either Ma or Ni breaks the identity of Raag Bhoopali.'
    },
    {
      q: 'Which flute is best for practicing Bhoopali?',
      a: 'A G Base bansuri is a popular choice for adults because of its comfortable pitch, warm resonance, and expressive sound. However, the raga can be practiced on any properly tuned bansuri, including C Medium or E Bass.'
    },
    {
      q: 'What is the best time to perform Bhoopali?',
      a: 'The first quarter of the night, typically between 6 PM and 9 PM. Performing it during this window aligns with the traditional Samay Chakra (time cycle) of Hindustani classical music.'
    },
    {
      q: 'Which emotions does Bhoopali express?',
      a: 'Raag Bhoopali expresses peace (Shanti), devotion (Bhakti), serenity, positivity, and spiritual reflection. It is widely used in meditative compositions and devotional bhajans.'
    }
  ];

  const relatedRagas = [
    { name: 'Raag Durga', description: 'Pentatonic scale skipping Ga and Ni; crisp finger movements.', difficulty: 'Beginner' },
    { name: 'Raag Hamsadhwani', description: 'Pentatonic scale skipping Ma and Dha; bright, auspicious mood.', difficulty: 'Beginner' },
    { name: 'Raag Yaman', description: 'Evening scale introducing Teevra Ma; foundation of classical improvisation.', difficulty: 'Beginner' },
    { name: 'Raag Bilawal', description: 'Natural scale using all Shuddha notes; equivalent to Western Major scale.', difficulty: 'Beginner' },
    { name: 'Raag Desh', description: 'Rainy season scale with graceful glides between natural and flat notes.', difficulty: 'Intermediate' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16" itemScope itemType="https://schema.org/LearningResource">
      {/* Schema.org Article / LearningResource JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Raag Bhoopali (Bhupali) – Complete Guide for Beginners",
          "headline": "Raag Bhoopali (Bhupali) – Complete Guide for Beginners on Bansuri",
          "description": "Learn Raag Bhoopali online with step-by-step swara guides, Aaroh-Avaroh, Pakad, Chalan, practice exercises, alankars, and the original composition Prabhat Prerna.",
          "learningResourceType": "Lesson",
          "educationalLevel": "Beginner",
          "author": {
            "@type": "Organization",
            "name": "FluteSangam",
            "url": "https://flutesangam.com"
          },
          "datePublished": "2026-07-30T00:00:00Z",
          "dateModified": "2026-07-30T10:00:00Z",
          "inLanguage": "en",
          "keywords": ["Raag Bhoopali", "Bhupali", "Learn Bansuri", "Flute Raga", "Prabhat Prerna", "Hindustani Classical"]
        })}
      </script>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-amber-900 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-bamboo-500/10 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-amber-200/80 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-white transition cursor-pointer"
            >
              Learn Hub
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_raagas')}
              className="hover:text-white transition cursor-pointer"
            >
              Ragas
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold">Raag Bhoopali</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Hindustani Classical • Audav-Audav
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-amber-50" itemProp="headline">
                Raag Bhoopali (Bhupali)
              </h1>
              <p className="text-amber-200/90 text-base sm:text-lg font-medium leading-relaxed">
                Complete Guide for Beginners: Swaras, Aaroh-Avaroh, Pakad, Practice Routine, and Original FluteSangam Composition <em className="text-amber-300 font-serif">"Prabhat Prerna"</em>.
              </p>
            </div>

            {/* Timestamps & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <div className="bg-amber-950/80 border border-amber-800/60 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Published: <strong className="text-white">Jul 30, 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Updated: <strong className="text-white">Jul 30, 2026</strong></span>
                </div>
                <div className="pt-1 border-t border-amber-800/60 flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Educational Content</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-amber-800/50 hover:bg-amber-700/60 text-amber-100 border border-amber-700/60 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Print or Save Lesson PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
                <button
                  onClick={() => copyToClipboard(window.location.href, 'link')}
                  className="bg-amber-800/50 hover:bg-amber-700/60 text-amber-100 border border-amber-700/60 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Share link"
                >
                  {copiedSection === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'link' ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Paragraph */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-amber-600" />
          Introduction to Raag Bhoopali
        </h2>
        <div className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-4">
          <p>
            <strong>Raag Bhoopali</strong>, also affectionately known as <strong>Bhup</strong> or <strong>Bhoop</strong>, is widely celebrated as one of the most accessible and melodic entry points into Hindustani Classical Music. It is traditionally the very first raga taught to bansuri students because of its straightforward pentatonic structure, absence of microtonal alterations (all notes are Shuddha swaras), and instantly soothing resonance.
          </p>
          <p>
            Belonging to the prestigious <strong>Kalyan Thaat</strong>, Raag Bhoopali utilizes exactly five notes in both its ascending and descending passages, strictly omitting <em>Madhyam (Ma)</em> and <em>Nishad (Ni)</em>. This deliberate omission yields a peaceful, expansive, and devotional acoustic atmosphere.
          </p>
          <p>
            Performed during the <strong>first quarter of the night (6 PM – 9 PM)</strong>, Raag Bhoopali is extensively featured across classical concerts, spiritual bhajans, cinematic melodies, and contemplative bansuri solos.
          </p>
        </div>
      </div>

      {/* Basic Information Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-600" />
          Basic Information &amp; Key Metadata
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicInfo.map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3.5 hover:shadow-sm hover:border-amber-300 transition">
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 shadow-3xs shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900/60 uppercase tracking-wider block">
                  {item.label}
                </span>
                <span className="text-base font-bold text-bamboo-950 mt-0.5 block">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swaras Used & Omitted + Interactive Audio Touch Pads */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
              <Radio className="w-6 h-6 text-amber-600 animate-pulse" />
              Swaras Used &amp; Interactive Tone Pads
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Click any note pad below to hear the swara played on a warm flute-like frequency.
            </p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full self-start sm:self-auto border border-emerald-200">
            All Shuddha Notes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Used Notes */}
          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Used Notes (Pentatonic)
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">5 Notes</span>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                { name: 'Sa', symbol: 'S', desc: 'Shadja (Root)' },
                { name: 'Re', symbol: 'R', desc: 'Shuddha Rishabh' },
                { name: 'Ga', symbol: 'G', desc: 'Shuddha Gandhar (Vadi)' },
                { name: 'Pa', symbol: 'P', desc: 'Pancham (Fifth)' },
                { name: 'Dha', symbol: 'D', desc: 'Shuddha Dhaivat (Samvadi)' },
                { name: 'Sa\'', symbol: 'S\'', desc: 'Tar Saptak Sa' },
              ].map((swara) => (
                <button
                  key={swara.symbol}
                  onClick={() => playSwaraTone(swara.symbol)}
                  className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-xl border-2 transition cursor-pointer ${
                    activeSwara === swara.symbol
                      ? 'bg-amber-600 text-white border-amber-700 scale-105 shadow-md'
                      : 'bg-white text-emerald-950 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100/50'
                  }`}
                  title={`Click to listen to ${swara.name} (${swara.symbol})`}
                >
                  <span className="text-lg font-black font-mono">{swara.symbol}</span>
                  <span className="text-[10px] font-semibold opacity-80 mt-0.5">{swara.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-emerald-800/80 pt-1 italic">
              * Tap any swara button above to test pitch accuracy on your bansuri.
            </p>
          </div>

          {/* Omitted Notes */}
          <div className="bg-red-50/60 border border-red-200/70 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-red-900 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Omitted Notes (Varjit Swaras)
              </h3>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">2 Notes Strictly Forbidden</span>
            </div>
            <div className="flex gap-4 pt-2">
              <div className="flex-1 bg-white border-2 border-red-200 rounded-xl p-3 text-center opacity-75">
                <span className="text-xl font-black font-mono text-red-600 line-through">Ma (M)</span>
                <span className="text-xs text-red-800 block mt-1 font-semibold">Madhyam</span>
              </div>
              <div className="flex-1 bg-white border-2 border-red-200 rounded-xl p-3 text-center opacity-75">
                <span className="text-xl font-black font-mono text-red-600 line-through">Ni (N)</span>
                <span className="text-xs text-red-800 block mt-1 font-semibold">Nishad</span>
              </div>
            </div>
            <p className="text-xs text-red-800/90 pt-1">
              <strong>Crucial Rule:</strong> Never blow Madhyam or Nishad while performing Bhoopali. Accidental inclusion alters the raga into Deshkar or Yaman.
            </p>
          </div>
        </div>
      </div>

      {/* Musical Grammar: Aaroh, Avaroh, Pakad, Chalan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Music className="w-6 h-6 text-amber-600" />
            Grammar &amp; Key Musical Phrases
          </h2>
          <button
            onClick={() => copyToClipboard("Aaroh: S R G P D S'\nAvaroh: S' D P G R S\nPakad: S R G | R S | D S | R G P | G R S", 'phrases')}
            className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedSection === 'phrases' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'phrases' ? 'Copied Phrases!' : 'Copy Phrases'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aaroh */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              Aaroh (Ascending Scale)
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-bamboo-950 tracking-widest bg-white p-3 rounded-xl border border-amber-200 text-center shadow-3xs">
              S &nbsp; R &nbsp; G &nbsp; P &nbsp; D &nbsp; S'
            </div>
            <p className="text-xs text-amber-900/80">
              Ascends strictly using Sa, Re, Ga, Pa, Dha to upper Sa.
            </p>
          </div>

          {/* Avaroh */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              Avaroh (Descending Scale)
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-bamboo-950 tracking-widest bg-white p-3 rounded-xl border border-amber-200 text-center shadow-3xs">
              S' &nbsp; D &nbsp; P &nbsp; G &nbsp; R &nbsp; S
            </div>
            <p className="text-xs text-amber-900/80">
              Descends symmetrically using upper Sa, Dha, Pa, Ga, Re, Sa.
            </p>
          </div>
        </div>

        {/* Pakad */}
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Pakad (Signature Catchphrase)
            </span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
              Identity Phrase
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-indigo-950 bg-white p-4 rounded-xl border border-indigo-200 flex flex-wrap gap-3 items-center justify-center text-center shadow-3xs">
            <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">S R G</span>
            <span className="text-indigo-300">•</span>
            <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">R S</span>
            <span className="text-indigo-300">•</span>
            <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">D(lower) S</span>
            <span className="text-indigo-300">•</span>
            <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">R G P</span>
            <span className="text-indigo-300">•</span>
            <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">G R S</span>
          </div>
          <p className="text-xs text-indigo-900/80 leading-relaxed">
            Hearing this characteristic movement immediately identifies the music as Raag Bhoopali. Rest gently on <strong>Ga</strong> and <strong>Sa</strong>.
          </p>
        </div>

        {/* Chalan */}
        <div className="bg-bamboo-50/60 border border-bamboo-200/80 rounded-2xl p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-bamboo-900 block">
            Chalan (Melodic Progression Movement)
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-bamboo-950 bg-white p-4 rounded-xl border border-bamboo-200 flex flex-wrap gap-2.5 items-center justify-center text-center shadow-3xs">
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">S R G</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">P D S'</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">D P</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">G R S</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">S R G P</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">D P</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">G R</span>
            <span className="text-bamboo-300">→</span>
            <span className="bg-bamboo-50 px-2 py-1 rounded border border-bamboo-200">S</span>
          </div>
        </div>
      </div>

      {/* Characteristics & Mood/Emotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Characteristics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <h2 className="text-xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            Important Characteristics
          </h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {[
              'Uses strictly five notes (Pentatonic / Audav-Audav).',
              'Madhyam (Ma) and Nishad (Ni) are completely omitted.',
              'Ga (Gandhar) is the Vadi (King) note—held longest and emphasized.',
              'Dha (Dhaivat) is the Samvadi (Queen) note—providing harmonic balance.',
              'Graceful movement (meend/kan) between Re and Ga enhances its beauty.',
              'The raga should sound calm, meditative, and devotional rather than rushed or aggressive.',
            ].map((char, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mood & Emotion */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-bamboo-500/10 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-4">
          <h2 className="text-xl font-bold text-amber-950 font-display flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-600" />
            Mood &amp; Emotional Essence (Rasa)
          </h2>
          <p className="text-sm text-amber-950/80 leading-relaxed">
            Raag Bhoopali evokes deep spiritual feelings of:
          </p>
          <div className="flex flex-wrap gap-2">
            {['Peace (Shanti)', 'Devotion (Bhakti)', 'Positivity', 'Calmness', 'Meditation', 'Hope'].map((mood, idx) => (
              <span key={idx} className="bg-white border border-amber-300 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs shadow-3xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {mood}
              </span>
            ))}
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed pt-2 border-t border-amber-200/60">
            Because of these tranquil qualities, Bhoopali is widely used in traditional bhajans, morning prayers, and reflective instrumental compositions.
          </p>
        </div>
      </div>

      {/* Why Beginners Should Learn Bhoopali */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-600" />
          Why Beginners Should Learn Bhoopali First
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Simple Note Structure', desc: '5 natural notes without accidentals, making swara recognition effortless.' },
            { title: 'Easy Bansuri Fingering', desc: 'Smooth hole coverage transitions that help build clean finger posture.' },
            { title: 'Develops Breath Control', desc: 'Holding Ga and Sa strengthens diaphragm support and tone stability.' },
            { title: 'Improves Pitch Accuracy', desc: 'Helps students train their ear to hit pure Shuddha notes without drifting.' },
            { title: 'Builds Improvisation Confidence', desc: 'Fewer notes mean easier mental combination during early vistaar.' },
            { title: 'Gateway to Hindustani Music', desc: 'Provides the ideal foundation before advancing to Yaman or Bhairav.' },
          ].map((reason, idx) => (
            <div key={idx} className="bg-bamboo-50/40 border border-bamboo-100 rounded-2xl p-4 space-y-1.5">
              <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">0{idx + 1}</span>
              <h3 className="font-bold text-bamboo-950 text-sm mt-1">{reason.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beginner Practice Routine & Interactive 35-Min Timer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-600" />
              Beginner Practice Routine (Alankars &amp; Drills)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Follow this step-by-step daily practice routine to master Raag Bhoopali on bansuri.
            </p>
          </div>

          {/* Interactive Timer Controls */}
          <div className="bg-amber-900 text-white rounded-2xl p-3 flex items-center gap-3 shrink-0">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-amber-200 block uppercase font-bold tracking-wider">35-Min Session</span>
              <span className="text-lg font-mono font-black">{formatTimer(timerSeconds)}</span>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 p-2 rounded-xl transition cursor-pointer font-bold"
              title={isTimerRunning ? "Pause Timer" : "Start Practice Timer"}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {/* 1. Long Notes */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                Long Notes Hold (5 Minutes)
              </h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">Hold 8–10 Sec Each</span>
            </div>
            <p className="text-xs text-gray-700">
              Sustain each note with steady air flow without shaking. Focus on warm tone quality.
            </p>
            <div className="flex flex-wrap gap-2 text-center font-mono font-bold text-lg text-bamboo-950">
              {['S', 'R', 'G', 'P', 'D', "S'"].map((sw, i) => (
                <span key={i} className="bg-white border border-amber-300 px-4 py-2 rounded-xl shadow-3xs">
                  {sw}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Aaroh-Avaroh Practice */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Aaroh–Avaroh Practice (5 Minutes)
              </h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">Repeat Slowly 10–15 Times</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 font-mono text-base font-bold text-bamboo-950 space-y-1 text-center">
              <div>Aaroh: S R G P D S'</div>
              <div className="text-amber-700">Avaroh: S' D P G R S</div>
            </div>
          </div>

          {/* 3. Alankars */}
          <div className="space-y-4">
            <h3 className="font-bold text-bamboo-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              Alankar Exercises (7 Minutes)
            </h3>

            {/* Alankar 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">Alankar 1 (2-Note Phrases)</span>
                <button 
                  onClick={() => copyToClipboard("Alankar 1:\nAscending: S R | R G | G P | P D | D S'\nDescending: S' D | D P | P G | G R | R S", 'a1')}
                  className="text-[11px] text-gray-500 hover:text-amber-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'a1' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'a1' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm sm:text-base font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl space-y-1">
                <div><span className="text-amber-700 font-bold">Ascending:</span> S R | R G | G P | P D | D S'</div>
                <div><span className="text-amber-700 font-bold">Descending:</span> S' D | D P | P G | G R | R S</div>
              </div>
            </div>

            {/* Alankar 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">Alankar 2 (3-Note Triplets)</span>
                <button 
                  onClick={() => copyToClipboard("Alankar 2:\nAscending: S R G | R G P | G P D | P D S'\nDescending: S' D P | D P G | P G R | G R S", 'a2')}
                  className="text-[11px] text-gray-500 hover:text-amber-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'a2' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'a2' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm sm:text-base font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl space-y-1">
                <div><span className="text-amber-700 font-bold">Ascending:</span> S R G | R G P | G P D | P D S'</div>
                <div><span className="text-amber-700 font-bold">Descending:</span> S' D P | D P G | P G R | G R S</div>
              </div>
            </div>

            {/* Alankar 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">Alankar 3 (Return Loops)</span>
                <button 
                  onClick={() => copyToClipboard("Alankar 3:\nAscending: S R G R | R G P G | G P D P | P D S' D\nDescending: S' D P D | D P G P | P G R G | G R S", 'a3')}
                  className="text-[11px] text-gray-500 hover:text-amber-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'a3' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'a3' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm sm:text-base font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl space-y-1">
                <div><span className="text-amber-700 font-bold">Ascending:</span> S R G R | R G P G | G P D P | P D S' D</div>
                <div><span className="text-amber-700 font-bold">Descending:</span> S' D P D | D P G P | P G R G | G R S</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Mistakes & Performance Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mistakes */}
        <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-red-950 font-display flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Common Mistakes to Avoid
          </h2>
          <ul className="space-y-2.5 text-sm text-red-900">
            {[
              'Accidentally blowing Madhyam (Ma).',
              'Accidentally touching Nishad (Ni).',
              'Playing too fast without stabilizing pitch.',
              'Failing to rest or pause naturally on Ga (Vadi).',
              'Treating it purely like a Western major pentatonic scale without ragic phrases (Pakad).',
            ].map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 font-bold">❌</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Performance Tips */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-emerald-950 font-display flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Tips for Better Performance
          </h2>
          <ul className="space-y-2.5 text-sm text-emerald-900">
            {[
              'Start slowly at 50–60 BPM before increasing speed.',
              'Maintain a pure, unforced tone on every swara.',
              'Use proper diaphragm breath support.',
              'Pause naturally on Ga and anchor your phrases on Sa.',
              'Avoid heavy ornamentations (gamak/khatka) in early practice.',
              'Always practice with a Tanpura drone (G / C# scale).',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Original FluteSangam Composition: Prabhat Prerna */}
      <div className="bg-gradient-to-br from-amber-900 via-bamboo-950 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/60 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-800/60 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full">
              Original FluteSangam Composition
            </span>
            <h2 className="text-3xl font-black font-display text-amber-100 mt-2">
              Prabhat Prerna (Bandish)
            </h2>
            <p className="text-xs text-amber-200/80 mt-1">
              Raag: Bhoopali • Taal: Teentaal (16 Beats) • Laya: Madhya
            </p>
          </div>

          {/* Interactive Composition Metronome */}
          <div className="bg-amber-950/90 border border-amber-800/80 p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlayingComposition(!isPlayingComposition)}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {isPlayingComposition ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingComposition ? 'Pause Metronome' : 'Start Metronome'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-300 font-bold">{bpm} BPM</span>
              <input
                type="range"
                min="50"
                max="90"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-20 accent-amber-500 cursor-pointer"
              />
            </div>

            {isPlayingComposition && (
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-900/80 px-2 py-1 rounded">
                Beat: {currentBeat}/16
              </div>
            )}
          </div>
        </div>

        {/* Composition Notation Layout */}
        <div className="space-y-6 font-mono">
          {/* Sthayi */}
          <div className="bg-amber-950/60 border border-amber-800/60 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Sthayi (First Section - Repeat Once)</span>
              <span>16 Beats (4 x 4)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base font-bold text-amber-100">
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | S &nbsp; R &nbsp; G &nbsp; P | D &nbsp; P &nbsp; G &nbsp; R |
              </div>
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | S &nbsp; R &nbsp; G &nbsp; P | G &nbsp; R &nbsp; S &nbsp; - |
              </div>
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | G &nbsp; P &nbsp; D &nbsp; S' | D &nbsp; P &nbsp; G &nbsp; R |
              </div>
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | S &nbsp; R &nbsp; G &nbsp; R | S &nbsp; - &nbsp; - &nbsp; - |
              </div>
            </div>
          </div>

          {/* Antara */}
          <div className="bg-amber-950/60 border border-amber-800/60 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Antara (Upper Register Section)</span>
              <span>16 Beats (4 x 4)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base font-bold text-amber-100">
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | S' &nbsp; D &nbsp; P &nbsp; D | S' &nbsp; D &nbsp; P &nbsp; G |
              </div>
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | P &nbsp; G &nbsp; R &nbsp; S | R &nbsp; G &nbsp; P &nbsp; D |
              </div>
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | S' &nbsp; D &nbsp; P &nbsp; G | R &nbsp; G &nbsp; P &nbsp; G |
              </div>
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-center">
                | R &nbsp; S &nbsp; R &nbsp; G | P &nbsp; G &nbsp; R &nbsp; S |
              </div>
            </div>
          </div>

          {/* Tihai */}
          <div className="bg-amber-950/60 border border-amber-800/60 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Tihai (Rhythmic Climax - Repeat 3 Times)</span>
              <span>Final Landing on Sam (Sa)</span>
            </div>
            <div className="text-center font-bold text-amber-100 space-y-2">
              <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/40 text-lg">
                G P D &nbsp;|&nbsp; P G R &nbsp;|&nbsp; S
              </div>
              <p className="text-xs text-amber-300 font-sans italic">
                (Repeat phrase 3 times, ending forcefully on root Sa)
              </p>
            </div>
          </div>
        </div>

        {/* How to Practice Composition */}
        <div className="bg-amber-950/80 p-5 rounded-2xl border border-amber-800/60 space-y-3 text-xs text-amber-200">
          <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2 font-sans">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            How to Practice "Prabhat Prerna"
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-sans">
            <li className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/40">1. Practice Aaroh &amp; Avaroh until smooth</li>
            <li className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/40">2. Play Pakad 5 times to absorb the mood</li>
            <li className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/40">3. Master Sthayi slowly at 50 BPM</li>
            <li className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/40">4. Practice Antara upper register notes</li>
            <li className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/40">5. Combine both sections seamlessly</li>
            <li className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/40">6. Execute Tihai &amp; landing on Sam (Sa)</li>
          </ol>
        </div>
      </div>

      {/* Suggested 35-Minute Daily Schedule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Calendar className="w-6 h-6 text-amber-600" />
          Suggested Daily Practice Schedule
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50 text-amber-950 text-xs uppercase font-bold border-b border-amber-200">
                <th className="p-3.5 rounded-l-xl">Exercise Module</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5 rounded-r-xl">Objective</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Long Notes (Kharaj &amp; Swara Hold)</td>
                <td className="p-3.5 font-mono text-amber-800 font-bold">5 Minutes</td>
                <td className="p-3.5 text-gray-600">Tone stability and breath control on S, R, G, P, D, S'</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Aaroh – Avaroh Repetitions</td>
                <td className="p-3.5 font-mono text-amber-800 font-bold">5 Minutes</td>
                <td className="p-3.5 text-gray-600">Scale fluency &amp; symmetrical finger muscle memory</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Pakad Practice</td>
                <td className="p-3.5 font-mono text-amber-800 font-bold">3 Minutes</td>
                <td className="p-3.5 text-gray-600">Internalizing signature raga identity &amp; rest on Ga</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Alankars (Pattern Drills)</td>
                <td className="p-3.5 font-mono text-amber-800 font-bold">7 Minutes</td>
                <td className="p-3.5 text-gray-600">Finger speed, agility, and accurate interval jumps</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Original Composition ("Prabhat Prerna")</td>
                <td className="p-3.5 font-mono text-amber-800 font-bold">10 Minutes</td>
                <td className="p-3.5 text-gray-600">Sthayi, Antara, Teentaal beat sync, and Tihai execution</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-bamboo-950">Free Practice / Vistaar</td>
                <td className="p-3.5 font-mono text-amber-800 font-bold">5 Minutes</td>
                <td className="p-3.5 text-gray-600">Improvisation &amp; expressive musical exploration</td>
              </tr>
              <tr className="bg-amber-100/50 font-bold text-bamboo-950">
                <td className="p-3.5">Total Practice Time</td>
                <td className="p-3.5 font-mono text-amber-900 text-base">35 Minutes</td>
                <td className="p-3.5 text-amber-900">Optimal daily routine for steady bansuri progress</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-bamboo-950 flex items-center justify-between gap-3 bg-gray-50/50 hover:bg-amber-50/50 transition cursor-pointer"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 bg-white border-t border-gray-100 text-sm text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Ragas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-600" />
            Related Ragas to Explore Next
          </h2>
          <button
            onClick={() => onViewChange?.('learn_raagas')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 transition flex items-center gap-1 cursor-pointer"
          >
            <span>View All Ragas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedRagas.map((raga, idx) => (
            <div key={idx} className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-2 hover:shadow-sm hover:border-amber-300 transition">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-bamboo-950 text-sm">{raga.name}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {raga.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{raga.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Copyright Notice */}
      <div className="text-center text-xs text-gray-500 pt-4 border-t border-bamboo-100 space-y-1">
        <p className="font-semibold text-bamboo-800">© FluteSangam Original Content</p>
        <p>This article and the "Prabhat Prerna" composition are original educational content prepared for FluteSangam.</p>
      </div>
    </div>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M3 20h18" />
    </svg>
  );
}
