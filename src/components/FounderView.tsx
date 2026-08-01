import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Sparkles, Heart, Compass, GraduationCap, Briefcase, Award, Music, MessageSquare, ArrowRight, ShieldCheck, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { AppView } from '../types';

interface FounderViewProps {
  onViewChange?: (view: AppView) => void;
}

export default function FounderView({ onViewChange }: FounderViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Person JSON-LD Schema for AI engines and search crawlers
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://flutesangam.com/founder#aplut',
    'name': 'Aplut',
    'jobTitle': 'Founder & Lead Creator',
    'worksFor': {
      '@type': 'Organization',
      '@id': 'https://flutesangam.com/#organization',
      'name': 'FluteSangam',
      'alternateName': 'Flute Sangam',
      'url': 'https://flutesangam.com'
    },
    'description': 'Founder of FluteSangam, software professional and Indian bamboo flute (Bansuri) enthusiast creating free learning resources, interactive practice tools, and a global flute community.',
    'email': 'aplut0006@gmail.com',
    'url': 'https://flutesangam.com/founder',
    'knowsAbout': [
      'Indian Bamboo Flute',
      'Bansuri',
      'Sargam Notation',
      'Indian Classical Music',
      'Ragas & Alankars',
      'Software Engineering'
    ],
    'alumniOf': {
      '@type': 'EducationalOrganization',
      'name': 'B.Tech in Computer Science & Engineering (2021)',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Jamshedpur',
        'addressRegion': 'Jharkhand',
        'addressCountry': 'India'
      }
    }
  };

  const handleNav = (e: React.MouseEvent, view: AppView) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange(view);
    } else {
      window.location.href = view === 'community' ? '/' : `/${view.replace('_', '/')}`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10 sm:space-y-14"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Dynamic JSON-LD Person Schema Script Tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero / Header Card */}
      <section className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-bamboo-800/80 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bamboo-600/20 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar / Founder Badge */}
          <div className="shrink-0 text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-bamboo-700 to-amber-600 p-1 shadow-lg border border-amber-300/40 relative mx-auto">
              <div className="w-full h-full bg-bamboo-950 rounded-[22px] flex flex-col items-center justify-center text-white p-2">
                <Music className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mb-1 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">Bansuri</span>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder &amp; Creator</span>
            </div>
          </div>

          {/* Title & Quote */}
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white mb-1" itemProp="name">
                Aplut
              </h1>
              <p className="text-amber-300 font-semibold text-base sm:text-lg" itemProp="jobTitle">
                Founder of FluteSangam
              </p>
            </div>

            <blockquote className="italic text-bamboo-100 text-sm sm:text-base border-l-2 sm:border-l-4 border-amber-400 pl-3 sm:pl-4 py-1 bg-white/5 rounded-r-xl">
              "Every meaningful journey begins with a single note. Mine began with the sound of a flute."
            </blockquote>

            <p className="text-xs sm:text-sm text-bamboo-100 leading-relaxed font-sans" itemProp="description">
              Welcome! I'm <strong>Aplut</strong>, the founder of FluteSangam—a platform dedicated to bringing flute enthusiasts together from around the world. My vision is to make learning the Indian bamboo flute (Bansuri) simple, accessible, and enjoyable through free learning resources, practice tools, and a supportive global community.
            </p>
          </div>
        </div>
      </section>

      {/* Biography & Technology + Music */}
      <section className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-bamboo-950">
            Biography
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            <p>
              I completed my <strong>Bachelor of Technology (B.Tech.) in Computer Science &amp; Engineering</strong> from Jamshedpur, Jharkhand, India, in 2021. After graduation, I began my career in the IT industry, where I continue to work as a software professional.
            </p>
            <p>
              While technology became my profession, music has always been my passion. My engineering background helped me develop problem-solving and analytical skills, and over time I realized these skills could be used to create something meaningful for the flute community.
            </p>
            <p className="font-semibold text-bamboo-900 bg-amber-50 p-3 rounded-xl border border-amber-200/60">
              Today, I combine my passion for music with my technical expertise to build FluteSangam.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-bamboo-100 text-bamboo-800 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-bamboo-950">
            My Journey with the Flute
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            <p>
              My interest in the flute began around <strong>2017</strong> during my college years.
            </p>
            <p>
              Every day while travelling to college by bus, I would listen to songs featuring the beautiful sound of the Indian bamboo flute. The soothing and calming melodies fascinated me. I noticed how a simple flute could create peace, reduce stress, and instantly refresh the mind.
            </p>
            <p>
              Although I admired the instrument for years, I officially started learning the flute in <strong>2022</strong>, when I began my professional career in the IT industry.
            </p>
            <p className="text-gray-800">
              Since then, I have dedicated my free time to learning, practicing, and continuously improving my understanding of the Bansuri. Every practice session has taught me that learning the flute is a lifelong journey filled with patience, discipline, and joy.
            </p>
          </div>
        </div>
      </section>

      {/* Why I Created FluteSangam */}
      <section className="bg-gradient-to-br from-amber-50/90 via-white to-bamboo-50/80 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-bamboo-950">
              Why I Created FluteSangam
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 font-semibold">
              Solving real challenges for Bansuri learners worldwide
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          While learning the flute, I realized that beginners often struggle to find structured guidance, reliable practice resources, and a community where they can ask questions and learn together. As a software engineer, I wanted to use my technical knowledge to solve this problem. That idea became <strong>FluteSangam</strong>.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {[
            { title: "Structured Lessons", desc: "Learn the Indian bamboo flute step-by-step from scratch." },
            { title: "Ragas & Alankars", desc: "Explore classical ragas, sargam notes, and practice drills." },
            { title: "Interactive Tools", desc: "Use the online flute tuner, alankar generator, and fingering charts." },
            { title: "Global Community", desc: "Connect with fellow flute learners and share your sadhana." },
            { title: "Peer Knowledge", desc: "Ask questions, share advice, and inspire each other." },
            { title: "100% Free Resources", desc: "Access high-quality learning materials without subscription paywalls." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-amber-200/60 shadow-3xs flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-bamboo-700 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-bamboo-950 font-display">{item.title}</h4>
                <p className="text-[11px] text-gray-600 leading-tight mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm font-bold text-bamboo-900 text-center pt-2 italic">
          "FluteSangam is not just a website—it is a growing community built for everyone who wishes to experience the beauty of the flute."
        </p>
      </section>

      {/* Experience & Vision Grid */}
      <section className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-bamboo-950">
            Experience &amp; Approach
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            <p>
              Although I am still in the early stages of my musical journey, I have been learning and practicing the Indian bamboo flute for <strong>around four years</strong>.
            </p>
            <p>
              I believe that being an active learner helps me better understand the challenges faced by beginners. Every new lesson I learn becomes an opportunity to improve FluteSangam and make learning easier for others.
            </p>
            <p>
              I continue to balance my career in the IT industry while dedicating my time to expanding FluteSangam and creating helpful resources for flute learners worldwide.
            </p>
            <p className="text-bamboo-900 font-semibold italic">
              My journey as a musician is still unfolding, and I look forward to learning and growing alongside every member of the FluteSangam community.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-bamboo-100 text-bamboo-800 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-bamboo-950">
            My Vision
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            <p>
              My vision is to build one of the world's most trusted online community for Indian bamboo flute learners.
            </p>
            <p>
              I want FluteSangam to become a place where anyone from complete beginner to experienced player can find quality guidance, practical tools, authentic learning resources, and a welcoming community that encourages continuous growth.
            </p>
            <div className="bg-bamboo-900 text-white p-4 rounded-2xl shadow-xs">
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                Together, we can preserve, learn, and share the timeless beauty of the Indian Bansuri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect With Me & A Note to Every Learner */}
      <section className="bg-bamboo-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Connect With Me
            </h2>
            <p className="text-xs sm:text-sm text-bamboo-100 leading-relaxed">
              I'd love to hear from fellow flute enthusiasts, learners, and musicians. Whether you have feedback, questions, or ideas for FluteSangam, feel free to reach out.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="https://chat.whatsapp.com/HwfFf145b2A7ieIUrytve2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Join WhatsApp Community</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a 
                href="mailto:aplut0006@gmail.com"
                itemProp="email"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-bamboo-950 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-md hover:shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span>aplut0006@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="bg-bamboo-950/80 p-6 rounded-2xl border border-bamboo-700/80 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-amber-400 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>A Note to Every Flute Learner</span>
            </h3>
            <p className="text-xs text-bamboo-100 leading-relaxed font-sans italic">
              "Learning the flute is not about reaching a destination—it is about enjoying every note along the way. Whether you're playing your very first note or exploring complex ragas, remember that every practice session brings you one step closer to becoming a better musician. I look forward to learning and growing with you through FluteSangam."
            </p>
            <div className="text-right text-amber-300 text-xs font-extrabold pt-1">
              — Aplut
            </div>
          </div>
        </div>

        {/* Quick Links / Explore Section */}
        <div className="border-t border-bamboo-800/80 pt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-bamboo-300 font-semibold">
            Explore FluteSangam Features:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={(e) => handleNav(e, 'learn_intro')}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Learn Flute</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={(e) => handleNav(e, 'learn_tuner')}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Flute Tuner</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={(e) => handleNav(e, 'alankar_generator')}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Alankar Engine</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={(e) => handleNav(e, 'about_us')}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>About Us</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
