import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Wind, Clock, Calendar, CheckCircle2, Play, Pause, 
  Volume2, Copy, Check, Sparkles, Flame, ShieldAlert, Lightbulb, 
  Target, Repeat, Headphones, Heart, ArrowRight, Share2, Compass,
  Activity, Sliders, Radio, AlertCircle, Award
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import Metronome from './Metronome';

interface DailyPracticeGuideViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function DailyPracticeGuideView({ onViewChange }: DailyPracticeGuideViewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);

  // Timer Effect
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

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Daily Flute Practice Guide – A Complete Routine for Steady Progress',
    'description': 'Master your daily bansuri flute practice routine. Step-by-step guide to improve tone, breath control, finger coordination, rhythm, scales, and musicality.',
    'datePublished': '2026-08-02T00:00:00Z',
    'dateModified': '2026-08-02T00:00:00Z',
    'author': {
      '@type': 'Person',
      'name': 'Aplut',
      'jobTitle': 'Founder of FluteSangam'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'FluteSangam',
      'alternateName': 'Flute Sangam',
      'url': 'https://flutesangam.com'
    },
    'mainEntityOfPage': 'https://flutesangam.com/learn/daily-practice-guide'
  };

  const practiceScheduleData = [
    { area: 'Breathing Practice', time: '5 minutes', desc: 'Deep nose breaths & smooth airflow' },
    { area: 'Long Notes', time: '10 minutes', desc: 'Hold Sa Re Ga Ma with clean stability' },
    { area: 'Tone Development', time: '10 minutes', desc: 'Adjust lip embouchure & air direction' },
    { area: 'Finger Exercises', time: '10 minutes', desc: 'Neighboring note transitions' },
    { area: 'Scale Practice', time: '10–15 minutes', desc: 'Ascending & descending in slow/fast tempo' },
    { area: 'Rhythm Practice', time: '10 minutes', desc: 'Metronome timing (1, 2, 4 notes per beat)' },
    { area: 'Ornament Practice', time: '10 minutes', desc: 'Smooth decorative grace notes & glides' },
    { area: 'Melody Practice', time: '15–20 minutes', desc: 'Sargam notations, film, devotional songs' },
    { area: 'Listening Practice', time: '10 minutes', desc: 'Master performances for phrasing & tone' },
    { area: 'Free Playing', time: '5–10 minutes', desc: 'Improvisation & pure creative enjoyment' }
  ];

  const weeklyFocusData = [
    { day: 'Monday', focus: 'Breath Control', desc: 'Long breath holds, air column stability, blowing endurance' },
    { day: 'Tuesday', focus: 'Tone Quality', desc: 'Embouchure refinement, clarity, eliminating airiness' },
    { day: 'Wednesday', focus: 'Finger Coordination', desc: 'Relaxed finger lifts, silent hole seals, fast neighboring transitions' },
    { day: 'Thursday', focus: 'Scales & Transitions', desc: 'Saral & Vakra Alankars, octave jumps, seamless note glides' },
    { day: 'Friday', focus: 'Rhythm & Timing', desc: 'Strict metronome practice, taals, subdivisions per beat' },
    { day: 'Saturday', focus: 'Musical Expression & Ornamentation', desc: 'Meend, Kan-swara, Gamak, dynamics & emotional depth' },
    { day: 'Sunday', focus: 'Revision, Recording & Free Playing', desc: 'Record yourself, review progress, free improvisation' }
  ];

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
      <section className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-bamboo-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-amber-200/80 font-medium">
            <button 
              onClick={() => onViewChange?.('learn_dashboard')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Learn
            </button>
            <span>/</span>
            <button 
              onClick={() => onViewChange?.('learn_alankaras')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Alankaras Practice
            </button>
            <span>/</span>
            <span className="text-white font-bold">Daily Practice Guide</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-bamboo-800/80 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Complete Practice Routine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                Daily Flute Practice Guide – A Complete Routine for Steady Progress
              </h1>
              <p className="text-sm sm:text-base text-bamboo-100 max-w-2xl leading-relaxed font-sans">
                Learning the flute is not about practicing for the longest number of hours. It is about practicing with attention, consistency, and purpose. Even 30–60 minutes of focused daily practice will produce better results than several hours of unfocused playing.
              </p>
            </div>

            {/* Quick Practice Timer Card */}
            <div className="bg-bamboo-900/90 border border-bamboo-700/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center shrink-0 min-w-[210px] shadow-inner">
              <div className="text-xs text-bamboo-200 font-medium mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Session Companion Timer</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 my-1">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex gap-2 mt-2 w-full">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    isTimerRunning ? 'bg-amber-500 text-bamboo-950 hover:bg-amber-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(45 * 60);
                  }}
                  className="py-1.5 px-3 bg-bamboo-800 hover:bg-bamboo-700 text-bamboo-200 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Pillars Badges */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider block">
              Every practice session strengthens these 7 core pillars:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Breath Control',
                'Tone Quality',
                'Finger Coordination',
                'Rhythm & Timing',
                'Musical Expression',
                'Listening Ability',
                'Performance Confidence'
              ].map((pillar, idx) => (
                <span key={idx} className="bg-bamboo-900/80 border border-bamboo-700 text-amber-200 px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{pillar}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-bamboo-200/90 pt-2 border-t border-bamboo-800/60">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 bg-bamboo-900/60 px-3 py-1 rounded-lg border border-bamboo-800">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Published: Aug 2, 2026</span>
              </span>
              <span className="flex items-center gap-1.5 bg-bamboo-900/60 px-3 py-1 rounded-lg border border-bamboo-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Updated: Aug 2, 2026</span>
              </span>
              <span className="flex items-center gap-1.5 bg-bamboo-900/60 px-3 py-1 rounded-lg border border-bamboo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Original FluteSangam Guide</span>
              </span>
            </div>

            <button 
              onClick={() => copyToClipboard(window.location.href, 'page_url')}
              className="hover:text-amber-300 transition flex items-center gap-1 text-xs bg-bamboo-900/80 px-3 py-1 rounded-lg border border-bamboo-700 cursor-pointer"
            >
              {copiedSection === 'page_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'page_url' ? 'Copied Link!' : 'Share Guide'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core House Analogy Callout */}
      <section className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-3">
          <Award className="w-8 h-8 text-amber-600 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
            "Think of your practice as building a house. A strong foundation makes every future lesson easier."
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            A calm mind, steady breath, relaxed technique, and patient repetition are the foundations of confident flute playing.
          </p>
        </div>
      </section>

      {/* Before You Begin */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
        <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Compass className="w-6 h-6 text-bamboo-700" />
          <span>Before You Begin</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Spend a minute preparing yourself before playing your first note. Starting calmly improves the entire practice session:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {[
            { title: 'Posture', text: 'Sit or stand with a straight but relaxed posture.' },
            { title: 'Relaxation', text: 'Relax your shoulders, arms, and jaw completely.' },
            { title: 'Grip', text: 'Hold the flute comfortably without unnecessary finger tension.' },
            { title: 'Breathing', text: 'Take a few slow, deep breaths through your nose.' },
            { title: 'Mindset', text: 'Focus on producing a beautiful sound instead of playing fast.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-bamboo-50/60 border border-bamboo-100 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">{item.title}</span>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10-Step Detailed Practice Routine */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-bamboo-950 flex items-center gap-2">
              <ListNumberedIcon className="w-7 h-7 text-amber-600" />
              <span>Step-by-Step Practice Routine</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Follow these 10 structured steps in sequence during your daily practice sessions.
            </p>
          </div>
          <span className="text-xs bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full font-bold self-start sm:self-auto">
            10 Sequential Steps
          </span>
        </div>

        {/* Step 1: Breathing Practice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                1
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 1: Breathing Practice
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 5 Minutes</span>
              </div>
            </div>
            <Wind className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            The flute depends completely on breath. Better breathing produces a richer and more stable tone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Exercise 1: Deep Slow Airflow</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Take a deep breath through the nose.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Release the air slowly through the flute.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Try to keep the airflow smooth from beginning to end.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Repeat several times calmly.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Exercise 2: Breath Count Control</h4>
              <p className="text-xs text-gray-600">Count while blowing continuously:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['8 counts', '10 counts', '12 counts', '15 counts'].map((cnt, i) => (
                  <span key={i} className="bg-white border border-amber-200 font-mono text-xs font-bold px-2.5 py-1 rounded-lg text-amber-900">
                    {cnt}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 pt-1">Gradually increase the duration without forcing.</p>
            </div>
          </div>

          <div className="bg-bamboo-50 p-3 rounded-2xl border border-bamboo-200 text-xs text-bamboo-900 font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>The goal is smooth, controlled airflow rather than holding the breath for the longest time.</span>
          </div>
        </div>

        {/* Step 2: Long Notes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                2
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 2: Long Notes (Swar Abhyas)
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10 Minutes</span>
              </div>
            </div>
            <Activity className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Long-note practice develops: <strong>Stable tone</strong>, <strong>Better breath control</strong>, <strong>Pitch stability</strong>, and <strong>Finger balance</strong>.
          </p>

          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Guidelines for Every Note</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-bamboo-950">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200/60 text-center">1. Start gently</div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200/60 text-center">2. Keep sound steady</div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200/60 text-center">3. Avoid shaking</div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200/60 text-center">4. Finish smoothly</div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Example Note Sequence (Hold for 5s, 10s, or 15s per note):
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-sm font-bold text-bamboo-950">
              {['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', "Sā"].map((note, idx) => (
                <div key={idx} className="bg-bamboo-50 border border-bamboo-200 px-4 py-2 rounded-xl text-center shadow-3xs">
                  {note}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600">Do not hurry to reach the next note. Listen carefully to every sound.</p>
        </div>

        {/* Step 3: Tone Development */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                3
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 3: Tone Development
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10 Minutes</span>
              </div>
            </div>
            <Volume2 className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Beautiful flute playing is recognized by tone before speed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-bamboo-900 uppercase tracking-wider">Self-Evaluation Questions</h4>
              <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Is the sound clear?</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Is it airy? (Minimize air noise)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Is it pitch stable?</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Is it warm and pleasant?</span>
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Micro-Adjustments to Experiment With</h4>
              <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span><strong>Air direction:</strong> Angle slightly across the embouchure hole.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span><strong>Lip opening:</strong> Adjust aperture width for sweet focus.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span><strong>Breath pressure:</strong> Match lower vs upper octaves.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs text-rose-950 font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Never sacrifice tone for speed. Small adjustments often create a much richer sound.</span>
          </div>
        </div>

        {/* Step 4: Finger Coordination */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                4
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 4: Finger Coordination
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10 Minutes</span>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Good finger movement should be: <strong>Relaxed</strong>, <strong>Accurate</strong>, <strong>Silent</strong>, and <strong>Controlled</strong>. Lift fingers only as much as necessary. Avoid raising fingers too high above the holes.
          </p>

          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Neighboring Note Transitions Exercise</h4>
            <div className="flex flex-wrap gap-2 font-mono text-xs sm:text-sm font-bold text-bamboo-950">
              {['Sa–Re', 'Re–Ga', 'Ga–Ma', 'Ma–Pa', 'Pa–Dha', 'Dha–Ni', 'Ni–Sa'].map((trans, idx) => (
                <span key={idx} className="bg-white border border-amber-200 px-3 py-1.5 rounded-xl">
                  {trans}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              Repeat each transition many times until movement becomes completely effortless and silent.
            </p>
          </div>
        </div>

        {/* Step 5: Scale Practice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                5
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 5: Scale Practice
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10–15 Minutes</span>
              </div>
            </div>
            <Repeat className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Scales improve finger memory, note accuracy, breath coordination, and smooth transitions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-bamboo-50 border border-bamboo-200 p-3.5 rounded-2xl text-center space-y-1">
              <span className="text-xs font-bold text-bamboo-900 block">1. Slow Tempo</span>
              <p className="text-xs text-gray-600">Establish pitch accuracy and note clarity.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center space-y-1">
              <span className="text-xs font-bold text-amber-900 block">2. Medium Tempo</span>
              <p className="text-xs text-gray-600">Build continuous breath flow and rhythmic control.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-center space-y-1">
              <span className="text-xs font-bold text-emerald-900 block">3. Fast Tempo</span>
              <p className="text-xs text-gray-600">Gradual speed increases only after accuracy.</p>
            </div>
          </div>
        </div>

        {/* Step 6: Rhythm Practice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                6
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 6: Rhythm Practice
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10 Minutes</span>
              </div>
            </div>
            <Radio className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Many beginners know the notes but lose rhythm. Practice using a steady metronome beat.
          </p>

          {/* Embedded Interactive Metronome */}
          <div className="pt-2">
            <Metronome />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-center">
              <span className="text-xs font-bold text-gray-900 block">1 Note Per Beat</span>
              <span className="text-xs text-gray-500 font-mono">Sa | Re | Ga | Ma</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-center">
              <span className="text-xs font-bold text-gray-900 block">2 Notes Per Beat</span>
              <span className="text-xs text-gray-500 font-mono">Sa-Re | Ga-Ma</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-center">
              <span className="text-xs font-bold text-gray-900 block">4 Notes Per Beat</span>
              <span className="text-xs text-gray-500 font-mono">Sa-Re-Ga-Ma | Pa-Dha-Ni-Sa</span>
            </div>
          </div>
        </div>

        {/* Step 7: Ornament Practice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                7
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 7: Ornament Practice (Meend &amp; Grace Notes)
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10 Minutes</span>
              </div>
            </div>
            <Flame className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Musical expression comes from graceful note transitions. Focus on smooth movement, clear execution, and proper timing. Never rush decorative movements. Master one technique before learning another.
          </p>
        </div>

        {/* Step 8: Melody Practice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                8
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 8: Melody Practice
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 15–20 Minutes</span>
              </div>
            </div>
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            After technical exercises, play actual music: simple melodies, traditional compositions, folk tunes, film songs, devotional music, or classical compositions.
          </p>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Key Details to Monitor</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-800">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">Correct Notes</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">Steady Rhythm</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">Volume Dynamics</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">Emotional Expression</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">Breathing Points</span>
            </div>
            <p className="text-xs text-rose-800 font-semibold pt-1">
              Avoid memorizing mistakes. If something sounds incorrect, slow down and fix it immediately.
            </p>
          </div>
        </div>

        {/* Step 9: Listening Practice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                9
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 9: Listening Practice
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 10 Minutes</span>
              </div>
            </div>
            <Headphones className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Learning also happens without playing. Listen carefully to skilled master flute performances.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-bamboo-950">
            <div className="bg-bamboo-50 p-2.5 rounded-xl border border-bamboo-200 text-center">Tone &amp; Clarity</div>
            <div className="bg-bamboo-50 p-2.5 rounded-xl border border-bamboo-200 text-center">Breath Placement</div>
            <div className="bg-bamboo-50 p-2.5 rounded-xl border border-bamboo-200 text-center">Timing &amp; Laya</div>
            <div className="bg-bamboo-50 p-2.5 rounded-xl border border-bamboo-200 text-center">Musical Phrasing</div>
          </div>
        </div>

        {/* Step 10: Free Playing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-500 text-bamboo-950 font-black flex items-center justify-center text-base shadow-xs">
                10
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950">
                  Step 10: Free Playing &amp; Creative Expression
                </h3>
                <span className="text-xs text-amber-700 font-bold">Recommended Time: 5–10 Minutes</span>
              </div>
            </div>
            <Heart className="w-6 h-6 text-rose-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            End every session by simply enjoying the flute. Play your favorite tune, improvised melodies, slow relaxing notes, or simple musical ideas. This develops creativity and keeps practice deeply enjoyable.
          </p>
        </div>
      </section>

      {/* Suggested Daily Practice Schedule Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-bamboo-700" />
              <span>Suggested Daily Practice Schedule</span>
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Comprehensive sequence for steady technical and musical progress.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(
              practiceScheduleData.map(item => `${item.area}: ${item.time} (${item.desc})`).join('\n'),
              'schedule_table'
            )}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            {copiedSection === 'schedule_table' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Schedule</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-bamboo-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bamboo-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="p-3.5 sm:p-4">Practice Area</th>
                <th className="p-3.5 sm:p-4">Recommended Time</th>
                <th className="p-3.5 sm:p-4 hidden sm:table-cell">Focus &amp; Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bamboo-100 text-xs sm:text-sm text-gray-800">
              {practiceScheduleData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-bamboo-50/40'}>
                  <td className="p-3.5 sm:p-4 font-bold text-bamboo-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{row.area}</span>
                  </td>
                  <td className="p-3.5 sm:p-4 font-semibold text-amber-800 whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="p-3.5 sm:p-4 text-gray-600 hidden sm:table-cell">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-bamboo-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div>
            <span className="text-xs text-bamboo-200 uppercase font-bold block">Total Full Schedule Time</span>
            <span className="text-base sm:text-lg font-bold text-amber-300">Approximately 95–115 minutes</span>
          </div>
          <p className="text-xs text-bamboo-200/90 max-w-md text-center sm:text-right">
            If you have less time (e.g., 30–45 mins), shorten each section proportionately while keeping the exact same sequence.
          </p>
        </div>
      </section>

      {/* Weekly Practice Focus Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-bamboo-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-600" />
              <span>Weekly Practice Focus</span>
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Dedicate extra attention to one specialized skill area each day.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(
              weeklyFocusData.map(item => `${item.day}: ${item.focus} - ${item.desc}`).join('\n'),
              'weekly_table'
            )}
            className="text-xs bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-900 border border-bamboo-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            {copiedSection === 'weekly_table' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Weekly Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeklyFocusData.map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">{item.day}</span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <h3 className="text-sm font-bold text-bamboo-950">{item.focus}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Practice Guidelines Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Slowly First */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-3">
          <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Practice Slowly First</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            One of the biggest mistakes is trying to play fast too early. Slow practice allows you to notice:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Finger placement mistakes</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Breathing &amp; posture problems</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Uneven timing or rhythm</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Airy or unstable tone</li>
          </ul>
          <p className="text-xs text-emerald-800 font-bold pt-1">
            Once everything feels comfortable, increase tempo gradually. Slow practice builds speed safely.
          </p>
        </div>

        {/* Quality Over Quantity */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-3">
          <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Quality Over Quantity</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            One focused hour is often more productive than three distracted hours.
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Stay mentally engaged throughout</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Listen carefully to every note</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct mistakes immediately</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Repeat difficult passages patiently</li>
          </ul>
          <p className="text-xs text-bamboo-900 font-bold pt-1">
            Purposeful repetition creates lasting improvement.
          </p>
        </div>

        {/* Rest When Needed & Record Yourself */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-3">
          <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span>Rest &amp; Record Yourself</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Take short breaks every 20–30 minutes to stretch your hands and relax your shoulders.
          </p>
          <div className="bg-bamboo-50 p-3 rounded-2xl border border-bamboo-100 text-xs text-gray-700 space-y-1">
            <strong className="block text-bamboo-950">Record your practice sessions:</strong>
            <p>Recording is one of the fastest ways to improve. Listen for tone quality, pitch accuracy, finger noise, and breath placement.</p>
          </div>
        </div>

        {/* Goal-Oriented Practice */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-bamboo-100 space-y-3">
          <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <span>Practice with a Specific Goal</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Avoid practicing without direction. Set daily mini-goals:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-800">
            <span className="bg-amber-50 p-2 rounded-xl border border-amber-200">• Produce cleaner tone</span>
            <span className="bg-amber-50 p-2 rounded-xl border border-amber-200">• Improve breath control</span>
            <span className="bg-amber-50 p-2 rounded-xl border border-amber-200">• Play scale evenly</span>
            <span className="bg-amber-50 p-2 rounded-xl border border-amber-200">• Master 1 transition</span>
          </div>
        </div>
      </section>

      {/* Common Practice Mistakes to Avoid */}
      <section className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-display text-rose-950 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          <span>Common Practice Mistakes to Avoid</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-800">
          {[
            'Playing too fast before mastering stability',
            'Ignoring breathing technique and posture',
            'Practicing only favorite songs without warmup',
            'Skipping warm-up long notes',
            'Using excessive finger movement above holes',
            'Practicing with poor or slouched posture',
            'Becoming frustrated after minor mistakes',
            'Playing through errors without correcting them',
            'Practicing irregularly instead of daily'
          ].map((mistake, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-2xl border border-rose-200/70 flex items-start gap-2 shadow-3xs">
              <span className="text-rose-600 font-bold shrink-0">❌</span>
              <span>{mistake}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Next Step Banner: Ragas */}
      <section className="bg-gradient-to-r from-bamboo-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Next Step in Your Learning Journey</span>
          <h3 className="text-xl sm:text-2xl font-black font-display">Indian Classical Raagas Guides</h3>
          <p className="text-xs sm:text-sm text-bamboo-200 max-w-xl">
            Apply your daily practice routine to full Indian classical raga guides: Bhoopali, Durga, Yaman, Hamsadhwani, Bilawal &amp; Desh.
          </p>
        </div>
        <button
          onClick={() => onViewChange?.('learn_raagas')}
          className="bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
        >
          <span>Explore Raagas Guides</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Author Section */}
      <AboutAuthorSection onViewChange={onViewChange} />
    </motion.div>
  );
}

function ListNumberedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h12M9 12h12M9 19h12M3 5h2v2H3V5zm0 7h2v2H3v-2zm0 7h2v2H3v-2z" />
    </svg>
  );
}
