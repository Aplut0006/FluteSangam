import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldAlert, Users, Music, Scale, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TermsOfServiceViewProps {
  onBackToCommunity?: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onBackToCommunity }) => {
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
      id="terms-of-service-view"
    >
      {/* Top Navigation */}
      {onBackToCommunity && (
        <button
          onClick={onBackToCommunity}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/80 hover:bg-bamboo-100 border border-bamboo-200/80 px-3.5 py-1.5 rounded-full mb-6 transition-all cursor-pointer"
          id="terms-of-service-back-btn"
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
              <FileText className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-300/20">
              Community Terms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wide mb-2 text-white">
            Terms of Service
          </h1>
          <p className="text-bamboo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Please read these terms carefully before participating in the FluteSangam flute and bansuri community.
          </p>
        </div>

        {/* Terms Content */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
          {/* Key Commitment Callout */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2 text-amber-900 shadow-3xs">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm leading-relaxed">
                By accessing or creating an account on <strong>FluteSangam</strong>, you agree to comply with these terms, maintain a respectful space for flute enthusiasts, and honor fellow artists and learners.
              </p>
            </div>
            <div className="bg-white/80 border border-amber-300/80 rounded-xl p-3 text-xs text-amber-950 font-medium space-y-1">
              <p><strong>App Purpose:</strong> FluteSangam is an educational and social platform dedicated to Indian bamboo flute learning, audio recital sharing, and sheet music/sargam requests.</p>
              <p><strong>Account Authentication:</strong> We use email and Google Sign-In to securely authenticate users, create member accounts, and attribute published posts, comments, and notation requests to their profile.</p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Users className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>1. Community Guidelines & Respectful Conduct</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              FluteSangam is built on mutual respect, encouragement, and the shared love of Indian flute music:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Constructive Feedback:</strong> Provide encouraging, polite, and constructive feedback on member recitals and audio clips.</li>
              <li><strong>Zero Tolerance for Abuse:</strong> Harassment, hate speech, offensive content, or personal attacks will result in immediate suspension or ban.</li>
              <li><strong>No Spam or Self-Promotion:</strong> Avoid repetitive promotional posts, irrelevant sales spam, or unauthorized commercial solicitations.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Music className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>2. Audio Recordings & User Submissions</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              When sharing audio recordings, song notation requests, or discussions:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Ownership:</strong> You retain ownership of your original musical recordings and sargam notations shared on FluteSangam.</li>
              <li><strong>Community License:</strong> By posting, you grant FluteSangam a non-exclusive license to display your public posts to other members in the community feed.</li>
              <li><strong>Copyright Respect:</strong> Only upload audio clips, covers, or notations that do not infringe on third-party copyrights or intellectual property.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldAlert className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>3. Account Responsibility & Security</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized access or security breaches.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Scale className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>4. Platform Availability & Disclaimers</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is provided on an "as-is" and "as-available" basis. While we strive for 100% uptime and smooth performance, we do not guarantee uninterrupted access and reserve the right to perform scheduled maintenance or update features as necessary.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mail className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>5. Contact & Support</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              For questions regarding these Terms of Service or community moderation issues, please reach out to our team at:
            </p>
            <div className="mt-2 bg-bamboo-50/80 border border-bamboo-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-bamboo-900 text-sm">FluteSangam Administration</p>
                <p className="text-xs text-gray-600">Primary support contact for terms and account inquiries</p>
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
            <span>FluteSangam • Terms of Service</span>
            <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfServiceView;
