import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Wind, Clock, Calendar, 
  HelpCircle, ArrowRight, UserCheck, Flame, Target, BookOpen, Music, Play, 
  ChevronDown, ChevronUp, RefreshCw, EyeOff, Activity, Sliders, Volume2, Heart,
  Compass, Radio, CircleDot, Feather, ExternalLink
} from 'lucide-react';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';

interface CommonFluteMistakesViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function CommonFluteMistakesView({ onViewChange }: CommonFluteMistakesViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mistakesList: Array<{
    id: number;
    title: string;
    tag: string;
    problems: string[];
    result?: string[];
    whyItMatters?: string;
    solutions: string[];
    relatedAction?: {
      targetView: AppView;
      label: string;
      icon: any;
    };
  }> = [
    {
      id: 1,
      title: 'Holding the Flute Incorrectly',
      tag: 'Posture & Ergonomics',
      problems: ['Tight grip', 'Bent wrists', 'Raised shoulders', 'Uncomfortable hand position'],
      whyItMatters: 'Incorrect hand placement creates unnecessary tension, making finger movement slower and causing fatigue during longer practice sessions.',
      solutions: [
        'Hold the flute gently instead of squeezing it.',
        'Keep your wrists relaxed.',
        'Let your fingers naturally curve over the holes.',
        'Maintain a balanced posture while supporting the flute comfortably.'
      ],
      relatedAction: {
        targetView: 'learn_basics',
        label: 'Learn Flute Holding & Basics',
        icon: BookOpen
      }
    },
    {
      id: 2,
      title: 'Covering Finger Holes Improperly',
      tag: 'Finger Technique',
      problems: ['Fingers only partially cover holes.', 'Fingers placed at awkward angles.', 'Air leaks from uncovered holes.'],
      result: ['Buzzing sounds', 'Weak notes', 'Difficulty producing higher notes', 'Unstable tone'],
      solutions: [
        'Practice slowly while checking each finger position.',
        'Use the soft pads of your fingers rather than fingertips.',
        'Ensure every hole is fully sealed without excessive pressure.'
      ],
      relatedAction: {
        targetView: 'learn_fingering_chart',
        label: 'Open Interactive Fingering Chart',
        icon: CircleDot
      }
    },
    {
      id: 3,
      title: 'Blowing Too Hard',
      tag: 'Breath & Sound',
      problems: ['Believing that blowing harder produces a louder or better sound.'],
      result: ['Sharp or shrill tone', 'Airy sound', 'Difficulty controlling notes', 'Quick exhaustion'],
      solutions: [
        'Use controlled, steady airflow instead of force.',
        'Imagine directing a smooth stream of air rather than pushing as much air as possible.',
        'Adjust embouchure angle slightly rather than increasing air speed.'
      ],
      relatedAction: {
        targetView: 'learn_basics',
        label: 'Read Embouchure & Airflow Guide',
        icon: Wind
      }
    },
    {
      id: 4,
      title: 'Weak Breath Support',
      tag: 'Breathing',
      problems: ['Shallow chest breathing limits tone quality and note stability.'],
      result: ['Notes fade quickly', 'Uneven sound', 'Poor sustain', 'Limited control'],
      solutions: [
        'Practice deep diaphragmatic breathing exercises before playing.',
        'Focus on slow inhalation followed by controlled exhalation.',
        'Keep shoulders relaxed while expanding the abdomen.'
      ],
      relatedAction: {
        targetView: 'learn_daily_practice',
        label: 'View Breathing & Swar Sadhana Guide',
        icon: Target
      }
    },
    {
      id: 5,
      title: 'Poor Posture',
      tag: 'Body Mechanics',
      problems: ['Slouching', 'Leaning forward', 'Looking down constantly', 'Raised shoulders'],
      result: ['Restricted airflow', 'Physical strain in neck and back', 'Reduced endurance'],
      solutions: [
        'Stand or sit upright with a straight back.',
        'Keep shoulders relaxed and drop tension.',
        'Hold the flute naturally without twisting your neck or body.',
        'Good posture allows free airflow and prevents long-term physical strain.'
      ],
      relatedAction: {
        targetView: 'learn_basics',
        label: 'Check Posture Fundamentals',
        icon: BookOpen
      }
    },
    {
      id: 6,
      title: 'Practicing Too Fast',
      tag: 'Practice Discipline',
      problems: ['Rushing through exercises hoping to improve quickly.'],
      result: ['Reinforcing mistakes into muscle memory', 'Inaccurate swara movement', 'Loss of rhythm'],
      solutions: [
        'Start slowly with a metronome.',
        'Once you can play accurately without mistakes, gradually increase tempo.',
        'Remember: Accuracy always comes before speed.'
      ],
      relatedAction: {
        targetView: 'learn_tuner',
        label: 'Use Metronome & Flute Tuner',
        icon: Radio
      }
    },
    {
      id: 7,
      title: 'Ignoring Long Note Practice (Swar Sadhana)',
      tag: 'Tone Development',
      problems: ['Skipping long notes in favor of fast songs.'],
      result: ['Shaky tone', 'Lack of pitch stability', 'Weak breath endurance'],
      solutions: [
        'Spend at least 10 minutes on long notes every daily session.',
        'Focus on sustaining pure, resonant notes without pitch fluctuations.',
        'Benefits include better breath control, improved tone, increased stability, and stronger embouchure.'
      ],
      relatedAction: {
        targetView: 'learn_daily_practice',
        label: 'Start Swar Sadhana Routine',
        icon: Target
      }
    },
    {
      id: 8,
      title: 'Moving Fingers Too High',
      tag: 'Finger Efficiency',
      problems: ['Lifting fingers excessively high above the holes between notes.'],
      result: ['Slower playing', 'Reduced accuracy', 'Uneven rhythm', 'Extra hand fatigue'],
      solutions: [
        'Keep finger movements small, efficient, and close to the holes.',
        'Lift fingers only as much as necessary before placing them back smoothly.'
      ],
      relatedAction: {
        targetView: 'learn_fingering_chart',
        label: 'Check Fingering Chart Positions',
        icon: CircleDot
      }
    },
    {
      id: 9,
      title: 'Looking at Fingers Constantly',
      tag: 'Visual Habit',
      problems: ['Watching your fingers while playing.'],
      result: ['Poor posture from looking down', 'Reduced confidence', 'Slower memorization', 'Difficulty reading music or sargam'],
      solutions: [
        'Practice simple exercises facing a mirror or looking straight ahead.',
        'Trust tactile feedback so your fingers naturally remember their positions.'
      ],
      relatedAction: {
        targetView: 'learn_alankaras',
        label: 'Practice Alankar Drills Blindly',
        icon: Feather
      }
    },
    {
      id: 10,
      title: 'Inconsistent Practice',
      tag: 'Habit & Routine',
      problems: ['Practicing once a week for several hours instead of daily.'],
      result: ['Loss of muscle memory', 'Slower progress', 'Lips and fingers lose conditioning'],
      solutions: [
        'Aim for consistent daily practice.',
        'Even 30 to 60 minutes of focused daily practice produces better long-term progress than occasional marathon sessions.'
      ],
      relatedAction: {
        targetView: 'learn_daily_practice',
        label: 'Explore 45-Min Daily Routine',
        icon: Target
      }
    },
    {
      id: 11,
      title: 'Skipping Basic Exercises',
      tag: 'Fundamentals',
      problems: ['Jumping directly to songs without building foundation.'],
      result: ['Difficulty playing ornamentation (meend, murki)', 'Messy swara execution'],
      solutions: [
        'Always include: Long notes, Finger exercises, Scale practice, Alankars, Breathing exercises, and Rhythm practice in your warm-ups.'
      ],
      relatedAction: {
        targetView: 'alankar_generator',
        label: 'Generate Practice Alankars Engine',
        icon: Sparkles
      }
    },
    {
      id: 12,
      title: 'Poor Rhythm Control',
      tag: 'Timing & Taal',
      problems: ['Speeding up unintentionally', 'Slowing down during difficult passages', 'Uneven timing'],
      result: ['Off-beat playing', 'Difficulty playing with Tabla or Tanpura accompaniment'],
      solutions: [
        'Count aloud or practice with a metronome or electronic Tanpura/Taal tool.',
        'Master the beat at slow tempos before speeding up.'
      ],
      relatedAction: {
        targetView: 'learn_tuner',
        label: 'Launch Metronome & Scale Tuner',
        icon: Radio
      }
    },
    {
      id: 13,
      title: 'Forgetting to Listen Carefully',
      tag: 'Ear Training',
      problems: ['Playing mechanically without actively listening to your tone.'],
      result: ['Unnoticed pitch deviation', 'Air noise', 'Harsh transitions'],
      solutions: [
        'Pay close attention to tone quality, pitch stability, air noise, finger clarity, and smooth transitions.',
        'Record your practice sessions occasionally to review objectively.'
      ],
      relatedAction: {
        targetView: 'learn_raagas',
        label: 'Listen to Raga Audio Guides',
        icon: Music
      }
    },
    {
      id: 14,
      title: 'Practicing Too Long Without Breaks',
      tag: 'Physical Health',
      problems: ['Pushing through intense practice sessions without resting.'],
      result: ['Hand and lip fatigue', 'Reduced concentration', 'Poor technique', 'Muscle tension'],
      solutions: [
        'Take short 5-10 minute breaks every 30 to 45 minutes.',
        'Stretch your neck, shoulders, and fingers during breaks.'
      ],
      relatedAction: {
        targetView: 'learn_daily_practice',
        label: 'View Timed Routine Breakdown',
        icon: Target
      }
    },
    {
      id: 15,
      title: 'Becoming Frustrated Too Quickly',
      tag: 'Mindset',
      problems: ['Expecting instant perfection and giving up when notes sound airy or shaky.'],
      result: ['Loss of motivation', 'Abandoning daily sadhana'],
      solutions: [
        'Understand that progress in music is gradual.',
        'Every skilled flutist once made the same mistakes.',
        'Celebrate small improvements and trust the process.'
      ],
      relatedAction: {
        targetView: 'community',
        label: 'Join Community Sadhana Feed',
        icon: Compass
      }
    }
  ];

  const faqs = [
    {
      q: 'Why does my flute sound airy?',
      a: 'An airy sound usually results from an incorrect blowing angle, incomplete finger hole coverage, or inconsistent breath support. Practice long notes while experimenting with small adjustments to your lip position and airflow.',
      targetView: 'learn_tuner' as AppView,
      targetLabel: 'Use Flute Tuner to Check Pitch'
    },
    {
      q: 'How long does it take to fix bad flute habits?',
      a: 'The time varies depending on the habit and consistency of your practice. With focused daily practice, noticeable improvement can often be seen within 2 to 4 weeks.',
      targetView: 'learn_daily_practice' as AppView,
      targetLabel: 'Open Daily Practice Guide'
    },
    {
      q: 'Is it normal to make mistakes while learning?',
      a: 'Yes! Mistakes are a natural part of learning any musical instrument. The key is recognizing them early and practicing the correct technique consistently.',
      targetView: 'learn_basics' as AppView,
      targetLabel: 'Read Flute Basics'
    },
    {
      q: 'Should I practice difficult passages repeatedly?',
      a: 'Yes, but practice them slowly first. Repeating mistakes at full speed reinforces incorrect habits into muscle memory. Slow, accurate repetition builds real confidence and finger control.',
      targetView: 'alankar_generator' as AppView,
      targetLabel: 'Try Alankar Generator Engine'
    }
  ];

  const quickNavLinks = [
    { label: 'Why Mistakes Happen', href: '#why-mistakes-happen' },
    { label: '15 Mistakes & Fixes', href: '#mistakes-list' },
    { label: 'Daily Practice Routine', href: '#daily-routine' },
    { label: 'Tips for Improvement', href: '#faster-tips' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'About Author', href: '#author' },
  ];

  const learningTools = [
    { view: 'learn_basics' as AppView, label: 'Flute Basics', icon: BookOpen },
    { view: 'learn_fingering_chart' as AppView, label: 'Fingering Chart', icon: CircleDot },
    { view: 'learn_alankaras' as AppView, label: 'Alankaras', icon: Feather },
    { view: 'alankar_generator' as AppView, label: 'Alankar Generator', icon: Sparkles },
    { view: 'learn_tuner' as AppView, label: 'Flute Tuner', icon: Radio },
    { view: 'learn_daily_practice' as AppView, label: 'Daily Practice', icon: Target },
    { view: 'learn_raagas' as AppView, label: 'Ragas Guide', icon: Music },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" itemScope itemType="https://schema.org/EducationalArticle">
      {/* Title & Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-amber-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Flute Practice &amp; Technique
              </div>
              <h1 className="text-3xl md:text-4xl font-black font-display text-bamboo-950 tracking-tight" itemProp="headline">
                Common Flute Mistakes and How to Fix Them
              </h1>
              <p className="text-base md:text-lg text-amber-900 font-semibold italic">
                A Complete Guide for Every Flute Player
              </p>
            </div>

            {/* Timestamps */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-3.5 py-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-gray-500">Published:</span>
                <time itemProp="datePublished" dateTime="2026-08-05" className="font-semibold text-gray-900">
                  Aug 5, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-gray-500">Updated:</span>
                <time itemProp="dateModified" dateTime="2026-08-05" className="font-semibold text-gray-900">
                  Aug 5, 2026
                </time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-gray-500">Read Time:</span>
                <span className="font-semibold text-gray-900">8 mins</span>
              </div>
            </div>
          </div>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed border-l-4 border-amber-500 pl-4 py-1 italic bg-amber-50/40 rounded-r-xl">
            Learning the flute is an exciting journey, but every player—from complete beginners to experienced musicians—encounters mistakes along the way. The good news is that mistakes are a natural part of learning. Identifying them early and practicing the correct techniques can dramatically improve your tone, finger control, rhythm, and overall confidence.
          </p>

          {/* Quick Section Navigation Bar */}
          <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 space-y-2">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>Quick Page Navigation</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickNavLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs transition cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Do Flute Mistakes Happen Box */}
      <section id="why-mistakes-happen" className="scroll-mt-20 md:scroll-mt-24 bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden border border-amber-800/40 space-y-4">
        <div className="flex items-center gap-3 border-b border-amber-800/60 pb-3">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold font-display text-amber-200">
            Why Do Flute Mistakes Happen?
          </h2>
        </div>

        <p className="text-sm md:text-base text-gray-200 leading-relaxed">
          Most flute mistakes occur not because of a lack of talent, but because of common practice oversights:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {[
            'Learning without a structured practice routine',
            'Practicing too quickly without accuracy',
            'Skipping the fundamentals (long notes, swar sadhana)',
            'Inconsistent daily practice schedules',
            'Lack of attention to posture and breathing',
            'Rushing to play songs before mastering basic techniques'
          ].map((cause, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-start gap-2.5 text-xs text-amber-100">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-bamboo-950 font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                !
              </span>
              <span>{cause}</span>
            </div>
          ))}
        </div>

        <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl p-4 text-xs md:text-sm text-amber-100 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-300 shrink-0" />
            <p>
              <strong>Remember:</strong> Every skilled flutist once faced these exact same challenges. Improvement comes through patience, mindful awareness, and consistent daily practice.
            </p>
          </div>
          {onViewChange && (
            <button
              onClick={() => onViewChange('learn_daily_practice')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-bamboo-950 font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Build Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Detailed Mistakes & Fixes List */}
      <section id="mistakes-list" className="scroll-mt-20 md:scroll-mt-24 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
          <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-600" />
            15 Common Mistakes &amp; How to Fix Them
          </h2>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            Comprehensive Checklist
          </span>
        </div>

        <div className="space-y-5">
          {mistakesList.map((item) => {
            const RelatedIcon = item.relatedAction?.icon;
            return (
              <div 
                key={item.id} 
                id={`mistake-${item.id}`}
                className="bg-white rounded-2xl p-5 md:p-6 border border-amber-200/80 shadow-2xs hover:border-amber-400 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-sm border border-amber-200 shrink-0">
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold font-display text-bamboo-950">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>

                {/* Problems & Result Grid */}
                <div className="grid md:grid-cols-2 gap-4 text-xs md:text-sm">
                  <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200/60 space-y-2">
                    <span className="font-bold text-rose-900 uppercase tracking-wider text-[10px] block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Common Problems &amp; Symptoms
                    </span>
                    <ul className="space-y-1 text-gray-700">
                      {item.problems.map((prob, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.result && (
                    <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 space-y-2">
                      <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        Negative Impact / Result
                      </span>
                      <ul className="space-y-1 text-gray-700">
                        {item.result.map((res, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {item.whyItMatters && (
                  <p className="text-xs md:text-sm text-gray-600 italic bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                    <strong>Why It Matters:</strong> {item.whyItMatters}
                  </p>
                )}

                {/* How to Fix It */}
                <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/80 space-y-2">
                  <span className="font-bold text-emerald-900 uppercase tracking-wider text-xs block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    How to Fix It / Correct Technique
                  </span>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-800">
                    {item.solutions.map((sol, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Action Button to Move to Other App Pages */}
                {item.relatedAction && onViewChange && (
                  <div className="pt-1 border-t border-gray-100 flex items-center justify-end">
                    <button
                      onClick={() => onViewChange(item.relatedAction!.targetView)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200/80 transition cursor-pointer group"
                    >
                      {RelatedIcon && <RelatedIcon className="w-3.5 h-3.5 text-amber-700" />}
                      <span>{item.relatedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple Daily Practice Routine Section */}
      <section id="daily-routine" className="scroll-mt-20 md:scroll-mt-24 bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Action Plan
            </span>
            <h2 className="text-2xl font-bold font-display text-bamboo-950 mt-1">
              A Simple Daily Practice Routine to Avoid Common Mistakes
            </h2>
          </div>
          {onViewChange && (
            <button
              onClick={() => onViewChange('learn_daily_practice')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 self-start cursor-pointer"
            >
              <span>View Full Practice Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs md:text-sm text-gray-600">
          A balanced daily practice routine ensures you reinforce good habits and correct technique consistently:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber-700" />
                  1. Warm-Up (5–10 Minutes)
                </h3>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">5-10m</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-1 pl-6 list-disc">
                <li>Deep breathing exercises</li>
                <li>Relaxation &amp; posture check</li>
                <li>Long note practice (Swar Sadhana)</li>
              </ul>
            </div>
            {onViewChange && (
              <button
                onClick={() => onViewChange('learn_basics')}
                className="self-start text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              >
                <span>Practice Warm-Ups in Basics</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-700" />
                  2. Technique Practice (15–20 Minutes)
                </h3>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">15-20m</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-1 pl-6 list-disc">
                <li>Finger independence exercises</li>
                <li>Alankars with metronome</li>
                <li>Scale practice across octaves</li>
              </ul>
            </div>
            {onViewChange && (
              <button
                onClick={() => onViewChange('alankar_generator')}
                className="self-start text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              >
                <span>Launch Alankar Generator</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-700" />
                  3. Music Practice (20–30 Minutes)
                </h3>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">20-30m</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-1 pl-6 list-disc">
                <li>Song sargams &amp; melodies</li>
                <li>Raga chalan &amp; compositions</li>
                <li>Ornamentation (Meend, Murki)</li>
                <li>Rhythm exercises</li>
              </ul>
            </div>
            {onViewChange && (
              <button
                onClick={() => onViewChange('learn_raagas')}
                className="self-start text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              >
                <span>Explore Ragas Collection</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-700" />
                  4. Review &amp; Cool Down (5 Minutes)
                </h3>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">5m</span>
              </div>
              <ul className="text-xs text-gray-700 space-y-1 pl-6 list-disc">
                <li>Repeat difficult sections slowly</li>
                <li>End session with relaxed playing</li>
              </ul>
            </div>
            {onViewChange && (
              <button
                onClick={() => onViewChange('learn_tuner')}
                className="self-start text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              >
                <span>Check Pitch on Flute Tuner</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tips for Faster Improvement */}
      <section id="faster-tips" className="scroll-mt-20 md:scroll-mt-24 bg-amber-100/60 border border-amber-300 rounded-3xl p-6 md:p-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-700" />
          Tips for Faster Improvement
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
          {[
            'Practice every single day, even if for only 20 minutes.',
            'Focus on quality and accuracy rather than practice duration.',
            'Stay physically relaxed in your lips, jaw, wrists, and shoulders.',
            'Listen carefully to your tone and record your playing occasionally.',
            'Be patient with gradual improvement — progress is cumulative.',
            'Build strong fundamentals before attempting advanced ornamentation.',
            'Review older exercises and basic alankars regularly.',
            'Celebrate small improvements instead of expecting instant perfection.'
          ].map((tip, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 flex items-start gap-2 text-bamboo-950 font-medium shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faqs" className="scroll-mt-20 md:scroll-mt-24 bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-2xs space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-amber-200/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 bg-amber-50/50 hover:bg-amber-100/50 font-bold text-bamboo-950 text-sm md:text-base flex items-center justify-between transition cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-800 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs md:text-sm text-gray-700 leading-relaxed border-t border-amber-100 space-y-3">
                  <p>{faq.a}</p>
                  {faq.targetView && onViewChange && (
                    <button
                      onClick={() => onViewChange(faq.targetView)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-200 transition cursor-pointer"
                    >
                      <span>{faq.targetLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Thoughts */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-2xs space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-bamboo-950">
          Final Thoughts
        </h2>
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
          Every flute player makes mistakes, regardless of experience. What separates successful musicians is not avoiding mistakes altogether, but learning from them with patience and consistent practice. By focusing on proper posture, relaxed breathing, accurate finger placement, steady rhythm, and regular practice, you can build a strong technical foundation that supports every stage of your musical journey.
        </p>
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
          Improvement on the flute is a gradual process. Stay committed, enjoy the learning experience, and remember that every practice session—no matter how small—brings you one step closer to becoming a more confident and expressive flutist.
        </p>
      </section>

      {/* About Author Section */}
      <div id="author" className="scroll-mt-20 md:scroll-mt-24">
        <AboutAuthorSection />
      </div>
    </div>
  );
}
