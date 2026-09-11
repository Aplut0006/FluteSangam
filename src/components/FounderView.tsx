import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Compass, 
  Music, 
  ArrowRight, 
  Globe, 
  MessageCircle, 
  ExternalLink,
  Code2,
  BookOpen,
  Wrench,
  Users,
  Mail
} from 'lucide-react';
import { AppView } from '../types';

interface FounderViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function FounderView({ onViewChange }: FounderViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNav = (view: AppView) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10 sm:space-y-14"
    >
      {/* 1. H1 Header & Hero Card */}
      <section className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-bamboo-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Founder & Creator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white">
            Meet the Founder
          </h1>

          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-300 font-display">
              Aplut — Founder of FluteSangam
            </h2>
          </div>

          <p className="text-sm sm:text-base text-bamboo-100 leading-relaxed font-sans max-w-3xl">
            Hello and welcome! I’m <strong>Aplut</strong>, a self-taught bansuri learner practising since 2022 and the founder of FluteSangam. With a passion for music and software engineering, I created FluteSangam to make flute learning accessible, structured, and enjoyable for fellow flute enthusiasts worldwide.
          </p>
        </div>
      </section>

      {/* 2. My Journey with Flute */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
            My Journey with Flute
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            My fascination with music began during my college years around <strong>2017</strong>. Every day while traveling to college by bus, I would listen to melodies featuring the soulful sound of the flute. The calming, tranquil quality of the instrument fascinated me, and I realized how profoundly music could ease stress and bring inner peace.
          </p>
          <p>
            While I admired the flute for years, I officially began learning and practicing in <strong>2022</strong>, after graduating with a B.Tech in Computer Science and starting my professional career in the IT industry.
          </p>
          <p>
            I started practicing in my free time, largely teaching myself through various resources and gradually building my own learning routine. As I practiced daily, I discovered that learning the flute is far more than mastering blowing techniques or fingering patterns—it is an exercise in mindfulness, patience, breath control, and consistent dedication.
          </p>
          <p>
            Experiencing the journey directly as an active flute learner allowed me to understand firsthand the joys and challenges every beginner faces.
          </p>
          <p>
            I am still on my own flute-learning journey, and that experience continues to shape how I build FluteSangam. I understand that learning an instrument is a long process, and I want the platform to grow alongside the people who use it.
          </p>
        </div>
      </section>

      {/* Blueprint for Self-Taught Learners & Adult Beginners */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-200 shadow-sm space-y-6">
        <div className="border-b border-bamboo-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">From Personal Experience</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950 mt-1">
            The Self-Taught Flute Practitioner&apos;s Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            When you begin learning the bansuri as an adult without a traditional gurukul environment, progress can feel unpredictable. Here is the realistic 4-phase milestone roadmap I developed from my own practice:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
            <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">Phase 1 (Months 1–3)</span>
            <strong className="text-bamboo-950 block text-base font-bold">The Tone &amp; Embouchure Stage</strong>
            <p className="text-gray-600 leading-relaxed text-xs">
              Overcoming the initial dizziness and airy hiss. Focusing purely on producing a clean, sustained Middle Sa. Getting comfortable holding the flute without arm cramps, and learning to relax your shoulders.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-bamboo-50/60 border border-bamboo-200/70 space-y-2">
            <span className="text-[11px] font-bold uppercase text-bamboo-800 tracking-wider">Phase 2 (Months 4–6)</span>
            <strong className="text-bamboo-950 block text-base font-bold">Kharaj Sadhana &amp; Octave Mastery</strong>
            <p className="text-gray-600 leading-relaxed text-xs">
              Practicing lower Mandra Saptak notes (.Pa, .Dha, .Ni) with morning breath exercises. Sealing all 6 holes cleanly with flat finger pads, and transitioning smoothly into the higher Taar Saptak without breath bursting.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-bamboo-50/60 border border-bamboo-200/70 space-y-2">
            <span className="text-[11px] font-bold uppercase text-bamboo-800 tracking-wider">Phase 3 (Months 7–12)</span>
            <strong className="text-bamboo-950 block text-base font-bold">Alankars &amp; First Classical Ragas</strong>
            <p className="text-gray-600 leading-relaxed text-xs">
              Speeding up finger agility through 60 progressive paltas. Playing your first classical compositions in Raag Bhoopali, Raag Yaman, and Raag Bilawal with steady metronome timing and Tanpura accompaniment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
            <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">Phase 4 (Year 2 &amp; Beyond)</span>
            <strong className="text-bamboo-950 block text-base font-bold">Soulful Expression &amp; Meend Glides</strong>
            <p className="text-gray-600 leading-relaxed text-xs">
              Moving beyond mechanical note-hitting to emotional expression. Mastering continuous microtonal slides (Meend), subtle touch ornaments (Kan-swar), breath vibrato (Kampita), and playing Bollywood melodies by ear.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs sm:text-sm text-gray-700">
          <strong className="text-bamboo-950 block font-bold">💡 Advice for Adult Learners Balancing Careers:</strong>
          <p className="leading-relaxed">
            You do not need 3 hours of practice a day to make genuine progress. A focused <strong>20 to 25 minutes of daily morning Swar Sadhana</strong> with a Tanpura drone is far more powerful than an erratic 2-hour weekend marathon. Consistency builds neuromuscular memory; patience creates musical beauty.
          </p>
        </div>
      </section>

      {/* 3. Why I Created FluteSangam (Most Important Section) */}
      <section className="bg-gradient-to-br from-amber-50/90 via-white to-bamboo-50/80 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Core Purpose</span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-bamboo-950">
              Why I Created FluteSangam
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-gray-800 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            During my own learning journey, I quickly encountered a major hurdle: flute learning materials were widely scattered across disconnected video tutorials, unorganized articles, and hard-to-find notation sheets.
          </p>
          <p>
            Beginners often struggled to answer basic questions: <em>Which scale flute should I buy? How do I practice long notes correctly? Where can I find reliable Sargam notations? How can I practice with a Tanpura drone or check my pitch accuracy?</em> Furthermore, there was no central, welcoming space where flute players could share their practice recordings, ask questions, or connect with peers.
          </p>
          <p className="font-semibold text-bamboo-950 bg-amber-100/70 p-4 rounded-2xl border border-amber-200/80">
            I created FluteSangam to solve these exact problems—bringing together structured guides, interactive practice tools, classical Raga breakdowns, notations, and community discussion in one open platform.
          </p>
        </div>
      </section>

      {/* 4. Building FluteSangam */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-bamboo-100 text-bamboo-800 flex items-center justify-center font-bold">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
            Building FluteSangam
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            Combining my software engineering background with my love for the flute, I began designing and building FluteSangam during my evenings and weekends while working full-time in the IT industry.
          </p>
          <p>
            I have been developing the web platform from scratch, focusing on speed, clean design, and ease of use on mobile devices. Step by step, I built:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-bamboo-50/60 p-4 rounded-2xl border border-bamboo-200/60 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-bamboo-700 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-bamboo-950 text-sm">Learning Guides &amp; Ragas</h3>
                <p className="text-xs text-gray-600 mt-1">Structured modules covering blowing, embouchure, scale choice, and classical Ragas (Bhupali, Yaman, Desh, etc.).</p>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-start gap-3">
              <Wrench className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-bamboo-950 text-sm">Interactive Practice Tools</h3>
                <p className="text-xs text-gray-600 mt-1">Real-time pitch tuner, Tanpura drone player, Alankar engine, metronome, and fingering guides.</p>
              </div>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/60 flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-bamboo-950 text-sm">Community Features</h3>
                <p className="text-xs text-gray-600 mt-1">A community feed where players can post practice recordings, exchange feedback, and connect globally.</p>
              </div>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200/60 flex items-start gap-3">
              <Music className="w-5 h-5 text-purple-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-bamboo-950 text-sm">Sargam Library</h3>
                <p className="text-xs text-gray-600 mt-1">Organized song notations for popular melodies, classical compositions, and devotional pieces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. My Vision for FluteSangam */}
      <section className="bg-gradient-to-br from-bamboo-900 to-bamboo-950 text-white rounded-3xl p-6 sm:p-10 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-bamboo-950 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            My Vision for FluteSangam
          </h2>
        </div>

        <p className="text-amber-200 text-lg sm:text-xl font-medium leading-relaxed">
          "I want FluteSangam to become a place where flute players from different backgrounds can learn, practice, share their music, and connect with other musicians around the world."
        </p>
        
        <p className="text-bamboo-100 text-sm sm:text-base leading-relaxed">
          Whether someone plays the Indian bansuri, Western flute, or any other traditional flute instrument, FluteSangam aims to provide an open, encouraging, and supportive environment for lifelong musical growth.
        </p>
      </section>

      {/* 6. About FluteSangam */}
      <section className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-bamboo-950">
          About FluteSangam
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          FluteSangam is an open digital platform built for flute learners, players, teachers, and enthusiasts worldwide. It offers structured learning resources, interactive tools, classical Raga breakdowns, Sargam song notations, and community features to support your musical journey.
        </p>
        <div>
          <a
            href="/about"
            onClick={handleNav('about_us')}
            className="inline-flex items-center gap-2 bg-bamboo-800 hover:bg-bamboo-700 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <span>Learn More About FluteSangam</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 7. Connect */}
      <section className="bg-bamboo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold border border-amber-300/30">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Connect
          </h2>
        </div>

        <p className="text-sm sm:text-base text-bamboo-100 leading-relaxed">
          I would love to connect with fellow flute players, learners, and enthusiasts. If you have questions, feedback, or ideas for FluteSangam, feel free to reach out or join our community:
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a 
            href="https://chat.whatsapp.com/HwfFf145b2A7ieIUrytve2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Join WhatsApp Community</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <a 
            href="mailto:aplut0006@gmail.com"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-bamboo-950 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-md"
          >
            <Mail className="w-4 h-4" />
            <span>aplut0006@gmail.com</span>
          </a>
        </div>
      </section>
    </motion.div>
  );
}
