import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, BookOpen, Clock, Moon, Calendar, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Compass, Zap, Repeat, HelpCircle, ArrowRight, Share2, Printer, 
  Sliders, Radio, Award, Sparkles, Flame, ShieldAlert, Lightbulb, RotateCcw
} from 'lucide-react';
import { AppView } from '../types';

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

  // Frequency mapping for G Base / C Scale Swaras (Approx Hz for Hamsadhwani notes: S, R, G, P, N, S')
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

  // Teentaal Metronome for "Udaya Sur"
  useEffect(() => {
    let metronomeInterval: any = null;
    if (isPlayingComposition) {
      const intervalMs = (60 / bpm) * 1000;
      metronomeInterval = setInterval(() => {
        setCurrentBeat(prev => (prev % 16) + 1);
        // Subtle tick sound
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
        } catch(e) {}
      }, intervalMs);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(metronomeInterval);
  }, [isPlayingComposition, bpm, currentBeat]);

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Is Raag Hamsadhwani suitable for beginners?',
      a: 'Yes. Its five-note pentatonic structure makes it one of the easiest and most joyful ragas to learn after mastering Bhoopali and Durga.'
    },
    {
      q: 'Which notes are omitted in Raag Hamsadhwani?',
      a: 'Madhyam (Ma) and Dhaivat (Dha) are completely omitted in both Aaroh and Avaroh.'
    },
    {
      q: 'Which note is most important in Hamsadhwani?',
      a: 'Gandhar (Ga) is treated as the Vadi (most prominent) note, while Nishad (Ni) serves as the Samvadi (second most prominent) note providing key melodic resolution.'
    },
    {
      q: 'Which flute should I use to practice Raag Hamsadhwani?',
      a: 'Raag Hamsadhwani can be played on any properly tuned bansuri. A G Base or C Natural Medium bansuri is ideal and comfortable for most adult beginners.'
    },
    {
      q: 'What is the best time to perform Raag Hamsadhwani?',
      a: 'Traditionally, it is performed during the early part of the night, approximately 6 PM – 9 PM. However, its auspicious nature also makes it popular for concert openings at any time.'
    }
  ];

  const udayaSurText = `Title: Udaya Sur (Melody of Sunrise)
Raag: Hamsadhwani
Taal: Teentaal (16 Beats) | Tempo: Madhya Laya

Section A
| S  R  G  P | N  P  G  R |
| S  R  G  P | G  R  S  - |
| R  G  P  N | S' N  P  G |
| R  G  R  S | -  -  -  - |

Section B
| S' N  P  N | S' N  P  G |
| P  G  R  S | R  G  P  N |
| S' N  P  G | R  G  P  G |
| R  S  R  G | P  G  R  S |

Ending Phrase (Repeat 3x):
G P N | P G R | S -> Finish on S`;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500" itemScope itemType="https://schema.org/LearningResource">
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": "Raag Hamsadhwani Bansuri Guide, Practice Schedule & Original Composition Udaya Sur",
          "description": "Comprehensive step-by-step guide for Raag Hamsadhwani on Indian bamboo flute. Includes Aaroh, Avaroh, Pakad, Chalan, practice routine, alankars, and original piece Udaya Sur.",
          "educationalLevel": "Beginner",
          "learningResourceType": "Guide & Practice Piece",
          "provider": {
            "@type": "Organization",
            "name": "FluteSangam"
          }
        })
      }} />

      {/* Main Glass Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-xs border border-bamboo-200 overflow-hidden relative">
        
        {/* Background Decorative Gradient Radial */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        {/* Header Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => onViewChange?.('learn_dashboard')} className="hover:text-amber-800 transition cursor-pointer">Learn Hub</button>
            <span>/</span>
            <button onClick={() => onViewChange?.('learn_raagas')} className="hover:text-amber-800 transition cursor-pointer">Raga Guides</button>
            <span>/</span>
            <span className="text-amber-900 font-bold">Raag Hamsadhwani</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              title="Print Lesson Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Top Header Section */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="bg-rose-100 text-rose-900 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-rose-200/80 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Carnatic &amp; Hindustani Raga
                </span>
                <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-amber-200">
                  Difficulty: Beginner
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-extrabold text-bamboo-950 font-display tracking-tight leading-tight" itemProp="headline">
                Raag Hamsadhwani: Notes, Aaroh, Avaroh, Pakad, Practice &amp; Composition
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                "The Sound of the Swan" — Symbolizing Purity, Grace, Energy, and Auspiciousness
              </p>
            </div>

            {/* Practice Timer Widget Header */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-3.5 sm:p-4 shrink-0 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 bg-amber-200/80 text-amber-900 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">35-Min Daily Routine</div>
                <div className="font-mono text-lg font-bold text-amber-950 leading-none my-0.5">
                  {formatTimer(timerSeconds)}
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                >
                  {isTimerRunning ? 'Pause Timer' : 'Start Routine Timer'}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Swara Audio Pitch Board */}
          <div className="bg-gradient-to-r from-bamboo-900 via-amber-950 to-bamboo-950 text-white rounded-2xl p-4 sm:p-5 mb-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-amber-500/20 pb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-amber-200 flex items-center gap-2 m-0">
                  <Volume2 className="w-4.5 h-4.5 text-amber-400" />
                  Interactive Swara Sound Board (G Base / C Scale)
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-300/80 m-0 mt-0.5">
                  Click any swara button below to hear its warm flute tone and verify your pitch accuracy.
                </p>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2.5 py-1 rounded-lg border border-amber-400/30 shrink-0 self-start sm:self-auto">
                Pentatonic: S - R - G - P - N - S'
              </span>
            </div>

            {/* Swara Note Buttons */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {[
                { name: 'S', full: 'Sa', freq: '261Hz', type: 'Shuddha' },
                { name: 'R', full: 'Re', freq: '293Hz', type: 'Shuddha' },
                { name: 'G', full: 'Ga', freq: '329Hz', type: 'Vadi (Prominent)' },
                { name: 'P', full: 'Pa', freq: '392Hz', type: 'Shuddha' },
                { name: 'N', full: 'Ni', freq: '493Hz', type: 'Samvadi' },
                { name: 'S\'', full: 'Upper Sa', freq: '523Hz', type: 'Taar Saptak' },
              ].map((note) => (
                <button
                  key={note.name}
                  onClick={() => playSwaraTone(note.name)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    activeSwara === note.name
                      ? 'bg-amber-400 text-bamboo-950 border-amber-200 scale-105 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  <span className="font-mono text-base sm:text-xl font-black leading-none">{note.name}</span>
                  <span className="text-[10px] font-semibold text-amber-200/90 mt-1">{note.full}</span>
                  <span className="text-[8px] opacity-75 hidden sm:inline mt-0.5">{note.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 1: Introduction */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-3 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              Introduction to Raag Hamsadhwani
            </h2>
            
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              <strong>Raag Hamsadhwani</strong> is a bright, joyful, and auspicious pentatonic raga that is loved by both beginners and experienced musicians. The name <em>Hamsadhwani</em> translates to <strong>"The Sound of the Swan"</strong>, symbolizing purity, grace, and beauty.
            </p>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Originally created by Ramaswami Dikshitar in Carnatic music, Raag Hamsadhwani was adapted into Hindustani Classical Music and is now an essential part of the Indian flute repertoire. Its simple five-note structure makes it an excellent raga for bansuri students after learning Raag Bhoopali and Raag Durga.
            </p>

            <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-2xl text-xs sm:text-sm text-amber-950 leading-relaxed font-medium mb-6">
              "Because of its energetic yet deeply devotional character, Raag Hamsadhwani is traditionally chosen as an opening piece during classical music concerts and cultural celebrations to create an uplifting, divine atmosphere."
            </div>
          </section>

          {/* SECTION 2: Basic Information Table */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Sliders className="w-5 h-5 text-amber-700" />
              Basic Information &amp; Raga Attributes
            </h2>

            <div className="bg-white border border-bamboo-200 rounded-2xl overflow-hidden shadow-xs mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-bamboo-100">
                <div className="divide-y divide-bamboo-100 text-xs sm:text-sm">
                  <div className="p-3.5 flex justify-between bg-bamboo-50/50">
                    <span className="font-bold text-bamboo-900">Raga Name</span>
                    <span className="font-semibold text-gray-800">Hamsadhwani (हंसध्वनि)</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="font-bold text-bamboo-900">Thaat</span>
                    <span className="font-semibold text-gray-800">Bilawal (Hindustani)</span>
                  </div>
                  <div className="p-3.5 flex justify-between bg-bamboo-50/50">
                    <span className="font-bold text-bamboo-900">Jati</span>
                    <span className="font-semibold text-gray-800">Audav – Audav (5 Notes Ascending &amp; Descending)</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="font-bold text-bamboo-900">Time of Performance</span>
                    <span className="font-semibold text-gray-800">Early Night (6 PM – 9 PM)</span>
                  </div>
                  <div className="p-3.5 flex justify-between bg-bamboo-50/50">
                    <span className="font-bold text-bamboo-900">Vadi Swara (Primary)</span>
                    <span className="font-semibold text-rose-800 font-mono">Ga (Shuddha Gandhar)</span>
                  </div>
                </div>

                <div className="divide-y divide-bamboo-100 text-xs sm:text-sm">
                  <div className="p-3.5 flex justify-between bg-bamboo-50/50 sm:bg-transparent">
                    <span className="font-bold text-bamboo-900">Samvadi Swara (Secondary)</span>
                    <span className="font-semibold text-emerald-800 font-mono">Ni (Shuddha Nishad)</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="font-bold text-bamboo-900">Nature &amp; Vibe</span>
                    <span className="font-semibold text-gray-800">Bright, Joyful, Devotional</span>
                  </div>
                  <div className="p-3.5 flex justify-between bg-bamboo-50/50">
                    <span className="font-bold text-bamboo-900">Rasa (Emotions)</span>
                    <span className="font-semibold text-gray-800">Bhakti (Devotion), Veer, Hasya</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="font-bold text-bamboo-900">Difficulty Level</span>
                    <span className="font-bold text-amber-800">Beginner Friendly</span>
                  </div>
                  <div className="p-3.5 flex justify-between bg-bamboo-50/50">
                    <span className="font-bold text-bamboo-900">Recommended Flute</span>
                    <span className="font-semibold text-gray-800">G Base / C Natural Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Swaras Used & Omitted */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Compass className="w-5 h-5 text-amber-700" />
              Swaras Used &amp; Swaras Omitted
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Notes Used (5 Shuddha Swaras)</span>
                </div>
                <div className="flex flex-wrap gap-2 my-3">
                  {['Sa (S)', 'Re (R)', 'Ga (G)', 'Pa (P)', 'Ni (N)'].map(sw => (
                    <span key={sw} className="bg-white border border-emerald-300 font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl text-emerald-950 shadow-2xs">
                      {sw}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-emerald-800 m-0">All notes used in Raag Hamsadhwani are natural (Shuddha) swaras.</p>
              </div>

              <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base mb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Notes Omitted (Varjit Swaras)</span>
                </div>
                <div className="flex flex-wrap gap-2 my-3">
                  {['Madhyam (Ma / M)', 'Dhaivat (Dha / D)'].map(sw => (
                    <span key={sw} className="bg-white border border-rose-300 font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl text-rose-950 shadow-2xs line-through opacity-85">
                      {sw}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-rose-800 m-0">Never blow Ma or Dha while playing Raag Hamsadhwani.</p>
              </div>
            </div>
          </section>

          {/* SECTION 4: Aaroh, Avaroh, Pakad & Chalan */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Zap className="w-5 h-5 text-amber-700" />
              Aaroh, Avaroh, Pakad &amp; Chalan
            </h2>

            <div className="space-y-4">
              {/* Aaroh */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm sm:text-base text-bamboo-900 m-0">Aaroh (Ascending Scale)</h3>
                  <button
                    onClick={() => playSwaraTone('S')}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Play Scale
                  </button>
                </div>
                <div className="bg-bamboo-50/80 p-3 rounded-xl border border-bamboo-100 font-mono text-base sm:text-lg font-bold text-bamboo-950 tracking-wider">
                  S  R  G  P  N  S'
                </div>
              </div>

              {/* Avaroh */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm sm:text-base text-bamboo-900 m-0">Avaroh (Descending Scale)</h3>
                  <button
                    onClick={() => playSwaraTone('S\'')}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Play Scale
                  </button>
                </div>
                <div className="bg-bamboo-50/80 p-3 rounded-xl border border-bamboo-100 font-mono text-base sm:text-lg font-bold text-bamboo-950 tracking-wider">
                  S'  N  P  G  R  S
                </div>
              </div>

              {/* Pakad */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">Pakad (Catch Phrase / Signature Phrase)</h3>
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 font-mono text-sm sm:text-base font-bold text-amber-950 leading-relaxed mb-2">
                  S R G  |  P N  |  P G  |  R S
                </div>
                <p className="text-xs text-gray-600 mb-2">Alternative Signature Phrase:</p>
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 font-mono text-sm sm:text-base font-bold text-amber-950 leading-relaxed">
                  R G P  |  N P  |  G R  |  S
                </div>
              </div>

              {/* Chalan */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">Chalan (Melodic Progression)</h3>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 font-mono text-xs sm:text-sm text-gray-900 space-y-1.5 leading-relaxed">
                  <div>S R G</div>
                  <div>P N S'</div>
                  <div>N P</div>
                  <div>G R</div>
                  <div>S</div>
                  <div className="pt-2 border-t border-gray-200">R G P</div>
                  <div>N P</div>
                  <div>G R S</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Important Characteristics & Mood */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              Important Characteristics &amp; Mood
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-950 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4.5 h-4.5 text-amber-600" />
                  Key Characteristics
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 list-disc pl-4">
                  <li><strong>Ma and Dha</strong> are strictly omitted.</li>
                  <li><strong>Ga (Gandhar) and Ni (Nishad)</strong> are the most prominent notes.</li>
                  <li>The raga should always sound bright, crisp, and energetic.</li>
                  <li>Smooth transitions between <strong>Ga–Pa</strong> and <strong>Ni–Pa</strong> add great beauty.</li>
                  <li>Avoid accidentally touching Ma or Dha while sliding between notes.</li>
                </ul>
              </div>

              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-950 mb-3 flex items-center gap-2">
                  <Heart className="w-4.5 h-4.5 text-rose-600" />
                  Mood &amp; Emotion (Rasa)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold mb-3">
                  <div className="bg-amber-50 text-amber-900 p-2 rounded-xl border border-amber-200 text-center">✨ Joy &amp; Happiness</div>
                  <div className="bg-rose-50 text-rose-900 p-2 rounded-xl border border-rose-200 text-center">🙏 Deep Devotion (Bhakti)</div>
                  <div className="bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200 text-center">🌟 Optimism &amp; Hope</div>
                  <div className="bg-blue-50 text-blue-900 p-2 rounded-xl border border-blue-200 text-center">🎉 Energy &amp; Celebration</div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed m-0">
                  Its cheerful nature makes it a universally acclaimed choice for concert openings and spiritual compositions.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: Why Beginners Should Learn Hamsadhwani */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Award className="w-5 h-5 text-amber-700" />
              Why Beginners Should Learn Raag Hamsadhwani
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                { title: 'Easy 5-Note Structure', desc: 'No complicated komal or tivra swaras to confuse your fingers.' },
                { title: 'Comfortable Finger Grip', desc: 'Smooth spacing makes note transitions relaxed and natural.' },
                { title: 'Improves Breath Control', desc: 'Holding sustained notes on Ga and Ni builds strong lung capacity.' },
                { title: 'Develops Phrase Memory', desc: 'Melodic jumps like Ga-Pa and Ni-Pa train your ear rapidly.' },
                { title: 'Strengthens Note Accuracy', desc: 'Clean, crisp notes leave no room for airy or off-pitch blowing.' },
                { title: 'Gateway to Expressive Music', desc: 'Prepares your embouchure for classical meend and gamak ornaments.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-amber-50/60 to-white border border-amber-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="font-bold text-xs sm:text-sm text-amber-950 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 m-0 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: Beginner Practice Routine & Alankars */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Repeat className="w-5 h-5 text-amber-700" />
              Beginner Practice Routine &amp; FluteSangam Original Alankars
            </h2>

            <div className="space-y-6">
              {/* Step 1: Long Notes */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">1. Long Note Practice (Kharaj &amp; Swara Sadhana)</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">Hold each note steadily for 8–10 seconds with a full belly breath:</p>
                <div className="font-mono text-sm sm:text-base font-bold text-amber-950 bg-amber-50 p-3 rounded-xl border border-amber-200 tracking-widest text-center">
                  S  —  R  —  G  —  P  —  N  —  S'
                </div>
              </div>

              {/* Step 2: Aaroh-Avaroh 10x */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">2. Aaroh–Avaroh Repetitions</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">Repeat slowly 10 times in a single practice session:</p>
                <div className="font-mono text-xs sm:text-sm font-bold text-bamboo-950 bg-bamboo-50/80 p-3 rounded-xl border border-bamboo-100 space-y-1">
                  <div>Ascending: S R G P N S'</div>
                  <div>Descending: S' N P G R S</div>
                </div>
              </div>

              {/* Alankar 1 */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">FluteSangam Original Alankar 1 (2-Note Pattern)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                    <span className="font-sans font-bold text-amber-900 block mb-1">Aroha:</span>
                    S R | R G | G P | P N | N S'
                  </div>
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                    <span className="font-sans font-bold text-emerald-900 block mb-1">Avroha:</span>
                    S' N | N P | P G | G R | R S
                  </div>
                </div>
              </div>

              {/* Alankar 2 */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">FluteSangam Original Alankar 2 (3-Note Pattern)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                    <span className="font-sans font-bold text-amber-900 block mb-1">Aroha:</span>
                    S R G | R G P | G P N | P N S'
                  </div>
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                    <span className="font-sans font-bold text-emerald-900 block mb-1">Avroha:</span>
                    S' N P | N P G | P G R | G R S
                  </div>
                </div>
              </div>

              {/* Alankar 3 */}
              <div className="bg-white border border-bamboo-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-bamboo-900 mb-2">FluteSangam Original Alankar 3 (4-Note Return Pattern)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                    <span className="font-sans font-bold text-amber-900 block mb-1">Aroha:</span>
                    S R G R | R G P G | G P N P | P N S' N
                  </div>
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                    <span className="font-sans font-bold text-emerald-900 block mb-1">Avroha:</span>
                    S' N P N | N P G P | P G R G | G R S
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: Common Mistakes & Performance Tips */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Common Mistakes &amp; Tips for Performance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 sm:p-5">
                <h3 className="font-bold text-sm sm:text-base text-rose-950 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
                  Common Pitfalls to Avoid
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-rose-900">
                  <li className="flex items-start gap-2">❌ <span><strong>Playing Ma:</strong> Accidentally lifting too many fingers and sounding Madhyam.</span></li>
                  <li className="flex items-start gap-2">❌ <span><strong>Playing Dha:</strong> Using Dhaivat while descending from Taar Saptak.</span></li>
                  <li className="flex items-start gap-2">❌ <span><strong>Rushing the tempo:</strong> Speeding up before note transitions are clean.</span></li>
                  <li className="flex items-start gap-2">❌ <span><strong>Ignoring Ga:</strong> Skipping emphasis on Gandhar (Vadi note).</span></li>
                  <li className="flex items-start gap-2">❌ <span><strong>Mechanical blowing:</strong> Playing without dynamic breath expression.</span></li>
                </ul>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
                <h3 className="font-bold text-sm sm:text-base text-emerald-950 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  Tips for Golden Sound Quality
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
                  <li className="flex items-start gap-2">✅ <span>Practice with a clear tanpura drone tuned to C / G base.</span></li>
                  <li className="flex items-start gap-2">✅ <span>Keep your finger pads relaxed over the bamboo tone holes.</span></li>
                  <li className="flex items-start gap-2">✅ <span>Focus on producing a pure, round, resonance-filled tone.</span></li>
                  <li className="flex items-start gap-2">✅ <span>Use controlled diaphragm air pressure when shifting to Taar Sa.</span></li>
                  <li className="flex items-start gap-2">✅ <span>Increase speed only after achieving 100% note accuracy.</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 9: FluteSangam Original Learning Piece "Udaya Sur" */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-500/10 border-2 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-sm relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-amber-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-800 text-amber-50 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      FluteSangam Exclusive
                    </span>
                    <span className="text-xs text-amber-900 font-bold">Teentaal (16 Beats) • Madhya Laya</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-amber-950 font-display m-0 mt-1">
                    Original Learning Piece: "Udaya Sur" (Melody of Sunrise)
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-900 font-medium m-0 mt-0.5">
                    Purpose: Beginner Educational Practice Piece in Raag Hamsadhwani
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(udayaSurText, 'udaya_sur')}
                    className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    {copiedSection === 'udaya_sur' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'udaya_sur' ? 'Copied Sargam!' : 'Copy Sargam'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Teentaal Metronome Bar */}
              <div className="bg-white/80 border border-amber-200/80 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsPlayingComposition(!isPlayingComposition)}
                    className="w-10 h-10 bg-amber-800 hover:bg-amber-900 text-white rounded-xl flex items-center justify-center shrink-0 transition shadow-2xs cursor-pointer"
                  >
                    {isPlayingComposition ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-amber-950">Teentaal Rhythm Trainer</div>
                    <div className="text-[11px] text-amber-800">16-Beat Metronome • Current Beat: <span className="font-bold font-mono text-amber-950">{currentBeat > 0 ? currentBeat : 'Ready'}</span></div>
                  </div>
                </div>

                {/* Beat Visualizer 1 to 16 */}
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-1">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((b) => (
                    <span
                      key={b}
                      className={`w-5 h-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        currentBeat === b
                          ? b === 1 ? 'bg-rose-600 text-white scale-110 shadow-xs' : 'bg-amber-600 text-white scale-105'
                          : b === 1 ? 'bg-amber-200 text-amber-950 font-extrabold' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sargam Notation Sheet */}
              <div className="space-y-6">
                {/* Section A */}
                <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs">
                  <h3 className="font-bold text-sm sm:text-base text-amber-950 mb-3 border-b border-amber-100 pb-1.5">
                    Section A (Sthayi)
                  </h3>
                  <div className="font-mono text-xs sm:text-base text-gray-900 space-y-2 overflow-x-auto whitespace-nowrap">
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  S   R   G   P  |  N   P   G   R  |
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  S   R   G   P  |  G   R   S   -  |
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  R   G   P   N  |  S'  N   P   G  |
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  R   G   R   S  |  -   -   -   -  |
                    </div>
                  </div>
                </div>

                {/* Section B */}
                <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs">
                  <h3 className="font-bold text-sm sm:text-base text-amber-950 mb-3 border-b border-amber-100 pb-1.5">
                    Section B (Antara)
                  </h3>
                  <div className="font-mono text-xs sm:text-base text-gray-900 space-y-2 overflow-x-auto whitespace-nowrap">
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  S'  N   P   N  |  S'  N   P   G  |
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  P   G   R   S  |  R   G   P   N  |
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  S'  N   P   G  |  R   G   P   G  |
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      |  R   S   R   G  |  P   G   R   S  |
                    </div>
                  </div>
                </div>

                {/* Ending Phrase */}
                <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs">
                  <h3 className="font-bold text-sm sm:text-base text-amber-950 mb-2">
                    Ending Phrase (Tihai / Conclusion)
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">Repeat this phrase 3 times consecutively:</p>
                  <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300 font-mono text-sm sm:text-base font-bold text-amber-950 text-center tracking-widest mb-2">
                    G  P  N  |  P  G  R  |  S
                  </div>
                  <div className="text-xs font-bold text-amber-900 text-center">
                    Finish cleanly holding final Sam on: <span className="font-mono text-base text-amber-950">S</span>
                  </div>
                </div>
              </div>

              {/* How to Practice Steps */}
              <div className="mt-6 pt-4 border-t border-amber-200">
                <h4 className="font-bold text-xs sm:text-sm text-amber-950 mb-2">How to Practice This Learning Piece:</h4>
                <ol className="list-decimal pl-5 text-xs sm:text-sm text-amber-900 space-y-1">
                  <li>Master the basic Aaroh and Avaroh first.</li>
                  <li>Repeat the Pakad 5 times until the signature flavor is in your head.</li>
                  <li>Learn Section A slowly line by line.</li>
                  <li>Practice Section B separately until upper notes sound clean.</li>
                  <li>Join both sections together with the ending phrase.</li>
                  <li>Begin practicing at 50 BPM and gradually increase to 80 BPM.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* SECTION 10: Suggested Daily Practice Table */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Clock className="w-5 h-5 text-amber-700" />
              Suggested 35-Minute Daily Practice Schedule
            </h2>

            <div className="bg-white border border-bamboo-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-bamboo-50 text-bamboo-950 font-bold border-b border-bamboo-100">
                  <tr>
                    <th className="p-3 sm:p-4">Exercise Module</th>
                    <th className="p-3 sm:p-4">Focus Area</th>
                    <th className="p-3 sm:p-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bamboo-100 text-gray-700">
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-bamboo-900">1. Long Notes (Swara Sadhana)</td>
                    <td className="p-3 sm:p-4">Steady tone, breath stability on S, R, G, P, N</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-amber-800">5 Mins</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-bamboo-900">2. Aaroh–Avaroh Scale</td>
                    <td className="p-3 sm:p-4">10 slow, smooth repetitions</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-amber-800">5 Mins</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-bamboo-900">3. Pakad Repetition</td>
                    <td className="p-3 sm:p-4">Signature phrase recognition (S R G | P N | P G | R S)</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-amber-800">3 Mins</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-bamboo-900">4. FluteSangam Alankars</td>
                    <td className="p-3 sm:p-4">Finger agility, rhythm &amp; speed build</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-amber-800">7 Mins</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-bamboo-900">5. "Udaya Sur" Composition</td>
                    <td className="p-3 sm:p-4">Sthayi, Antara and 3x Tihai ending</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-amber-800">10 Mins</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-bamboo-900">6. Free Improvisation (Alaap)</td>
                    <td className="p-3 sm:p-4">Spontaneous expression &amp; emotional connection</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-amber-800">5 Mins</td>
                  </tr>
                </tbody>
                <tfoot className="bg-amber-50 font-bold text-amber-950 border-t border-amber-200">
                  <tr>
                    <td colSpan={2} className="p-3 sm:p-4">Total Recommended Daily Practice</td>
                    <td className="p-3 sm:p-4 text-right font-mono text-base">35 Minutes</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* SECTION 11: Frequently Asked Questions */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <HelpCircle className="w-5 h-5 text-amber-700" />
              Frequently Asked Questions About Raag Hamsadhwani
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-bamboo-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-3.5 sm:p-4 text-left font-bold text-bamboo-950 flex items-center justify-between gap-3 cursor-pointer hover:bg-bamboo-50/50 transition"
                    >
                      <span className="text-xs sm:text-base leading-snug">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 sm:p-4 pt-0 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-bamboo-100 bg-amber-50/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 12: Related Ragas Navigation */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 mb-4 flex items-center gap-2 border-b border-bamboo-100 pb-2">
              <Radio className="w-5 h-5 text-amber-700" />
              Explore Related Classical Ragas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Raag Bhoopali', desc: 'Pentatonic Audav-Audav (S R G P D)', view: 'raga_bhoopali' as AppView },
                { name: 'Raag Durga', desc: 'Pentatonic Audav-Audav (S R M P D)', view: 'raga_durga' as AppView },
                { name: 'Raag Yaman', desc: '7-Note Sampurna with Tivra Ma (N R G M\' P D N)', view: 'raga_yaman' as AppView },
              ].map((raga, idx) => (
                <button
                  key={idx}
                  onClick={() => onViewChange?.(raga.view)}
                  className="bg-white hover:bg-amber-50 border border-bamboo-200 hover:border-amber-300 p-4 rounded-2xl text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-bamboo-950 group-hover:text-amber-900 transition-colors m-0">{raga.name}</h3>
                    <p className="text-[11px] text-gray-500 m-0 mt-0.5">{raga.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 13: Copyright & Exclusive Content Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-700 m-0 mb-1">© FluteSangam Original Educational Content</p>
            <p className="max-w-2xl mx-auto m-0">
              This article and the <em>"Udaya Sur"</em> learning piece have been created exclusively for FluteSangam as original educational content. The learning piece is intended to help students practice the note set and characteristic movements of Raag Hamsadhwani. It is an original educational exercise and is not presented as a traditional bandish or a composition from any specific gharana.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
