import React from 'react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';

interface FooterProps {
  onViewChange?: (view: AppView) => void;
  onSadhanaFeedClick?: (e: React.MouseEvent) => void;
}

export default function Footer({ onViewChange, onSadhanaFeedClick }: FooterProps) {
  const handleLinkClick = (view: AppView, e?: React.MouseEvent) => {
    if (onViewChange) {
      onViewChange(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-bamboo-900 border-t border-bamboo-800 text-white pt-12 pb-10" id="flutesangam-global-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Brand & Community Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-bamboo-700/60">
          <Link
            to="/"
            onClick={(e) => handleLinkClick('community', e)}
            className="flex items-center gap-3 text-left group"
          >
            <img
              src="/flutesangam_without_tagline_compressed.png"
              alt="FluteSangam Logo"
              className="w-12 h-12 rounded-full border-2 border-amber-400/80 shadow-md group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight block">
                Flute<span className="text-amber-400">Sangam</span>
              </span>
              <span className="text-xs text-bamboo-300 block font-sans">
                Indian Flute &amp; Bansuri Learning Community
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.reddit.com/r/FluteSangam/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg text-xs sm:text-sm tracking-wide hover:scale-105"
            >
              Join Our Community on Reddit
            </a>
          </div>
        </div>

        {/* Crawlable Internal Links Sitemap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs pt-2">
          
          {/* Column 1: Flute Learning */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
              Flute Learning
            </h3>
            <ul className="space-y-2 text-bamboo-200">
              <li>
                <Link to="/learn" onClick={(e) => handleLinkClick('learn_dashboard', e)} className="hover:text-amber-300 transition">
                  Learning Hub Overview
                </Link>
              </li>
              <li>
                <Link to="/learn/intro" onClick={(e) => handleLinkClick('learn_intro', e)} className="hover:text-amber-300 transition">
                  Introduction to Bansuri
                </Link>
              </li>
              <li>
                <Link to="/learn/choose-flute" onClick={(e) => handleLinkClick('learn_choose_flute', e)} className="hover:text-amber-300 transition">
                  Choose Right Flute
                </Link>
              </li>
              <li>
                <Link to="/learn/basics" onClick={(e) => handleLinkClick('learn_basics', e)} className="hover:text-amber-300 transition">
                  Bansuri Basics &amp; Fingering
                </Link>
              </li>
              <li>
                <Link to="/learn/fingering-chart" onClick={(e) => handleLinkClick('learn_fingering_chart', e)} className="hover:text-amber-300 transition">
                  Interactive Fingering Chart
                </Link>
              </li>
              <li>
                <Link to="/learn/raagas" onClick={(e) => handleLinkClick('learn_raagas', e)} className="hover:text-amber-300 transition">
                  22 Classical Raagas Library
                </Link>
              </li>
              <li>
                <Link to="/best-budget-flutes" onClick={(e) => handleLinkClick('budget_flutes', e)} className="hover:text-amber-300 transition">
                  Best Budget Flutes Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={(e) => handleLinkClick('flute_faq', e)} className="hover:text-amber-300 transition text-amber-300 font-semibold">
                  Flute FAQ &amp; Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Practice & Tools */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
              Practice Tools
            </h3>
            <ul className="space-y-2 text-bamboo-200">
              <li>
                <Link to="/learn/alankaras" onClick={(e) => handleLinkClick('learn_alankaras', e)} className="hover:text-amber-300 transition">
                  Alankar Sargam Drills
                </Link>
              </li>
              <li>
                <Link to="/learn/daily-practice-guide" onClick={(e) => handleLinkClick('learn_daily_practice', e)} className="hover:text-amber-300 transition text-amber-300 font-semibold">
                  Daily Flute Practice Guide
                </Link>
              </li>
              <li>
                <Link to="/learn/flute-scales-octaves" onClick={(e) => handleLinkClick('learn_scales_octaves', e)} className="hover:text-amber-300 transition text-amber-300 font-semibold">
                  Flute Scales &amp; Octaves
                </Link>
              </li>
              <li>
                <Link to="/alankar-generator" onClick={(e) => handleLinkClick('alankar_generator', e)} className="hover:text-amber-300 transition font-bold text-amber-300">
                  Alankar Generator Engine
                </Link>
              </li>
              <li>
                <Link to="/tools/flute-note-key-converter" onClick={(e) => handleLinkClick('note_key_converter', e)} className="hover:text-amber-300 transition font-bold text-amber-300">
                  Flute Note &amp; Key Converter
                </Link>
              </li>
              <li>
                <Link to="/tuner" onClick={(e) => handleLinkClick('learn_tuner', e)} className="hover:text-amber-300 transition">
                  Online Flute Tuner (440Hz)
                </Link>
              </li>
              <li>
                <Link to="/notations" onClick={(e) => handleLinkClick('notation_requests', e)} className="hover:text-amber-300 transition">
                  Song Notation Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
              Community &amp; Hub
            </h3>
            <ul className="space-y-2 text-bamboo-200">
              <li>
                <a 
                  href="/#recent-discussions-section" 
                  onClick={(e) => {
                    if (onSadhanaFeedClick) {
                      onSadhanaFeedClick(e);
                    } else {
                      handleLinkClick('community', e);
                    }
                  }} 
                  className="hover:text-amber-300 transition cursor-pointer"
                >
                  Sadhana Feed &amp; Recitals
                </a>
              </li>
              <li>
                <Link to="/members" onClick={(e) => handleLinkClick('community_members', e)} className="hover:text-amber-300 transition">
                  Flutists Directory
                </Link>
              </li>
              <li>
                <Link to="/faq/raagas" className="hover:text-amber-300 transition">
                  Raagas FAQ
                </Link>
              </li>
              <li>
                <Link to="/faq/music-theory" className="hover:text-amber-300 transition">
                  Music Theory FAQ
                </Link>
              </li>
              <li>
                <Link to="/faq/tuning-and-pitch" className="hover:text-amber-300 transition">
                  Tuning &amp; Pitch FAQ
                </Link>
              </li>
              <li>
                <Link to="/faq/flute-types" className="hover:text-amber-300 transition">
                  Flute Types FAQ
                </Link>
              </li>
              <li>
                <Link to="/faq/flute-accessories" className="hover:text-amber-300 transition">
                  Flute Accessories FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Support (Crawlable on every page) */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
              Legal &amp; Support
            </h3>
            <ul className="space-y-2 text-bamboo-200">
              <li>
                <Link to="/about" onClick={(e) => handleLinkClick('about_us', e)} className="hover:text-amber-300 transition">
                  About FluteSangam
                </Link>
              </li>
              <li>
                <Link to="/founder" onClick={(e) => handleLinkClick('founder', e)} className="hover:text-amber-300 transition">
                  Founder Story (Aplut)
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={(e) => handleLinkClick('contact_us', e)} className="hover:text-amber-300 transition font-medium text-amber-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={(e) => handleLinkClick('privacy_policy', e)} className="hover:text-amber-300 transition font-medium text-amber-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" onClick={(e) => handleLinkClick('terms_of_service', e)} className="hover:text-amber-300 transition font-medium text-amber-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & mission statement */}
        <div className="pt-6 border-t border-bamboo-700/60 text-center space-y-2">
          <p className="text-xs text-bamboo-300/80 max-w-xl mx-auto leading-relaxed">
            FluteSangam is a free learning platform for flute and Bansuri players. Learn step-by-step with beginner guides, alankars, ragas, fingering charts, practice routines, and connect with flute learners worldwide.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-bamboo-300 pt-1">
            <Link to="/contact" className="hover:text-amber-300 transition underline underline-offset-2">
              Contact
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-amber-300 transition underline underline-offset-2">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-amber-300 transition underline underline-offset-2">
              Terms of Service
            </Link>
          </div>
          <p className="text-[11px] text-bamboo-400">
            © {new Date().getFullYear()} FluteSangam. All rights reserved.
          </p>
          <p className="text-[11px] text-bamboo-500 font-medium">
            Designed &amp; Developed by Aplut
          </p>
        </div>

      </div>
    </footer>
  );
}
