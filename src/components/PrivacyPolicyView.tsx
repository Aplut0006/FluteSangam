import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, Server, UserCheck, Mail, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBackToCommunity?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBackToCommunity }) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
      id="privacy-policy-view"
    >
      {/* Top Navigation */}
      {onBackToCommunity && (
        <button
          onClick={onBackToCommunity}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/80 hover:bg-bamboo-100 border border-bamboo-200/80 px-3.5 py-1.5 rounded-full mb-6 transition-all cursor-pointer"
          id="privacy-policy-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </button>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-bamboo-100 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-400/20 backdrop-blur-md rounded-2xl border border-amber-300/30">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-300/20">
              Official Policy
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wide mb-2 text-white">
            Privacy Policy
          </h1>
          <p className="text-bamboo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Transparency, security, and trust across the global FluteSangam bansuri and flute community.
          </p>
        </div>

        {/* Policy Content */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
          {/* Key Commitment Callout */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2 text-amber-900 shadow-3xs">
            <div className="flex items-start gap-3.5">
              <Lock className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm leading-relaxed">
                At <strong>FluteSangam</strong>, your trust is paramount. We are dedicated to protecting the privacy of our global community of flute learners, gurus, and artists. We <strong>never sell or rent</strong> your personal data.
              </p>
            </div>
            <div className="bg-white/80 border border-amber-300/80 rounded-xl p-3 text-xs text-amber-950 font-medium space-y-1">
              <p><strong>App Purpose:</strong> FluteSangam is an educational and community platform for Indian bamboo flute (Bansuri) enthusiasts to learn classical ragas, share audio recitals, check pitch with our real-time Flute Tuner, and request song notations.</p>
              <p><strong>Microphone & Audio Privacy:</strong> FluteSangam requests microphone permission solely for real-time pitch detection in the Flute Tuner tool. Microphone audio is processed entirely in your local browser using the Web Audio API and is <strong>never recorded, stored, or transmitted</strong> to any external server.</p>
              <p><strong>Authentication Notice:</strong> FluteSangam uses email and Google Sign-In to authenticate users, verify user identity, create member profiles, and securely allow flutists to post recitals, comments, and notation requests.</p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <UserCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              To deliver an interactive and personalized learning community, we collect necessary account and interaction details:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Microphone & Live Audio Stream:</strong> When using interactive tools like the <em>Bansuri Flute Tuner</em>, we request temporary microphone access. Audio streams are analyzed locally in your browser memory for pitch/frequency calculation (A=440 Hz) and are immediately discarded without saving or recording.</li>
              <li><strong>Account Information:</strong> Display name, email address, unique username, profile picture, bio, location, and flute proficiency level when creating your profile.</li>
              <li><strong>User Content:</strong> Audio/video recordings, discussion posts, song notation requests, comments, and post likes created in the community.</li>
              <li><strong>Direct Messages:</strong> Private chat communications and shared media exchanged directly with fellow community members.</li>
              <li><strong>Device & Analytics:</strong> Technical metrics such as browser type and routing logs strictly used to enhance application stability and performance.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Eye className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>2. How We Use Your Information</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              We process your data solely to support community features and provide an enriching educational environment:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li>Facilitating member discussions, audio recitals, comment threads, and direct messaging.</li>
              <li>Personalizing learning modules, sargam notation requests, and raga study guides.</li>
              <li>Delivering real-time notifications for replies, likes, or direct chat messages.</li>
              <li>Maintaining platform security and preventing spam or abuse.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Server className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>3. Data Protection & Security</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam leverages secure Firebase Cloud infrastructure with end-to-end firestore security rules. Access controls ensure that your private messages and account details are protected against unauthorized access, loss, or disclosure.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>4. Your Privacy Rights & Data Control</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You retain total ownership and control over your profile and contributions:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li>You may update or modify your profile info, avatar, and musical details anytime via Profile Settings.</li>
              <li>You can delete posts or comments created under your account at any time.</li>
              <li>You may request complete account termination and data removal by reaching out to community administration.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mail className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>5. Contact Us</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you have any questions, concerns, or inquiries regarding this Privacy Policy or data privacy rights, please reach out to us at:
            </p>
            <div className="mt-2 bg-bamboo-50/80 border border-bamboo-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-bamboo-900 text-sm">Community Support Team</p>
                <p className="text-xs text-gray-600">Primary email contact for privacy queries</p>
              </div>
              <a 
                href="mailto:aplut0006@gmail.com"
                className="inline-flex items-center gap-2 bg-bamboo-700 hover:bg-bamboo-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-3xs"
              >
                <Mail className="w-4 h-4" />
                aplut0006@gmail.com
              </a>
            </div>
          </section>

          {/* Timestamp */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
            <span>FluteSangam • Privacy Policy</span>
            <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyView;
