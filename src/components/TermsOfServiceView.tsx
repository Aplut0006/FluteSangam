import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ShieldAlert, Users, Music, Scale, Mail, ArrowLeft, 
  CheckCircle2, Lock, Radio, Cookie, Eye, Compass, Copyright, 
  BookOpen, Link2, Ban, RefreshCw, HelpCircle, Mic
} from 'lucide-react';

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
              Official Legal Terms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wide mb-2 text-white">
            Terms of Service
          </h1>
          <p className="text-bamboo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Please review these terms governing your use of FluteSangam, community accounts, interactive tools, and learning resources.
          </p>
        </div>

        {/* Terms Content */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">

          {/* Section 1: Acceptance of Terms */}
          <section className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-6 space-y-3 text-amber-900 shadow-3xs">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold font-display text-amber-950 text-base sm:text-lg">Acceptance of Terms</h2>
                <p className="text-xs sm:text-sm leading-relaxed mt-1 text-amber-900">
                  By accessing or using <strong>FluteSangam</strong>, creating a community account, or utilizing our learning tools, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not access or use the platform.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Platform Mission */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Compass className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Platform Mission</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is a free educational platform dedicated to Indian classical Bansuri and flute enthusiasts worldwide. Our mission is to provide accessible step-by-step beginner guides, raga references, alankar generators, interactive practice tools, and a supportive community space for flute learners and artists of all skill levels.
            </p>
          </section>

          {/* Section 3: Community Accounts & Authentication */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Lock className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Community Accounts & Authentication</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              When creating and maintaining a community account on FluteSangam:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li>
                <strong>Account Eligibility:</strong> You must be at least 13 years old to create an account on FluteSangam. If applicable law in your jurisdiction requires a higher minimum age or parental/guardian consent, you must meet those requirements.
              </li>
              <li>
                <strong>Authentication Security:</strong> Accounts are registered using Email/Password or Google Authentication via Firebase Auth. You are responsible for safeguarding your login credentials and for all activities that occur under your profile.
              </li>
              <li>
                <strong>Accurate Profile Info:</strong> Users agree to provide truthful information when setting up member profiles, display names, location, and flute scale preferences.
              </li>
            </ul>
          </section>

          {/* Section 4: User-Generated Content & Community Guidelines */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Users className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>User-Generated Content & Community Guidelines</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              FluteSangam thrives on mutual respect, constructive feedback, and artistic encouragement. When publishing audio recitals, posts, comments, or song notation requests:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li>
                <strong>Constructive Participation:</strong> Maintain a polite, encouraging, and respectful tone toward fellow flute students, teachers, and enthusiasts.
              </li>
              <li>
                <strong>Prohibited Content:</strong> You may not post or transmit content that is abusive, harassing, defamatory, obscene, sexually explicit, hateful, or infringing on third-party intellectual property or copyrights.
              </li>
              <li>
                <strong>No Spam or Solicitations:</strong> Commercial spam, unauthorized marketing, referral link spam, or repetitive promotional posts are strictly prohibited.
              </li>
            </ul>
          </section>

          {/* Section 5: Content Ownership & Community License */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Music className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Content Ownership & Community License</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You retain ownership of your original musical recordings, audio recitals, and notation requests published on FluteSangam. By posting content to public community areas of the platform, you grant FluteSangam a non-exclusive, worldwide, royalty-free license to host, display, and distribute your content to other users on the platform solely for community and educational purposes.
            </p>
          </section>

          {/* Section 6: Copyright Complaints */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Copyright className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Copyright Complaints</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam respects the intellectual property rights of others. If you believe that any material or user post on the website infringes upon your copyright, please send a notification to our team at <a href="mailto:aplut0006@gmail.com" className="font-bold underline text-bamboo-800 hover:text-amber-700">aplut0006@gmail.com</a> containing details of the copyrighted work and the specific material location for prompt investigation and resolution.
            </p>
          </section>

          {/* Section 7: Interactive Tools & Microphone Permissions */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mic className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Interactive Tools & Microphone Permissions</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Interactive features such as the <em>Bansuri Flute Tuner</em> require temporary browser microphone access to calculate pitch frequencies in real time. Microphone processing is performed strictly in local browser memory using the Web Audio API. Audio signals are <strong>never recorded, saved, or transmitted</strong> to any remote server. You may grant or revoke microphone permissions at any time through your browser settings.
            </p>
          </section>

          {/* Section 8: Learning Resources & Tool Disclaimer */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <BookOpen className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Learning Resources & Tool Disclaimer</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The educational lesson guides, raga references, pitch tuner, metronome, and practice tools provided on FluteSangam are intended for learning, reference, and practice purposes. While we endeavor to maintain accurate musical information, learning progress depends on individual dedication and guidance from traditional gurus. Tools are provided as helpful aids rather than formal accreditation or professional measurement instruments.
            </p>
          </section>

          {/* Section 9: Cookies, Analytics & Advertising */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Cookie className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Cookies, Analytics & Advertising</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam utilizes cookies, local storage, Google Analytics, and third-party advertising services (such as Google AdSense) to support the free educational platform:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Cookies & Analytics:</strong> Used to maintain login sessions, store user preferences, and collect aggregated analytics via Google Analytics to help us understand usage patterns.</li>
              <li><strong>Third-Party Advertisements:</strong> Advertisements on FluteSangam may be served by Google AdSense and other third-party advertising networks. These providers may use cookies and similar technologies to deliver, personalize, measure, and improve advertisements, subject to applicable privacy choices and consent requirements. Users may manage or opt out of personalized advertising through Google's advertising settings or other available industry opt-out tools, where applicable.</li>
            </ul>
          </section>

          {/* Section 10: Third-Party Links & Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Link2 className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Third-Party Links & Services</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam may contain links to third-party websites, embedded audio/video players (such as YouTube or SoundCloud), or external resources. FluteSangam does not control and is not responsible for the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          {/* Section 11: Intellectual Property Rights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Scale className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Intellectual Property Rights</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              All non-user platform materials—including educational lesson guides, raga diagrams, alankar generator algorithms, site branding, logos, graphics, and interface designs—are the property of FluteSangam and protected by intellectual property laws. Unauthorized copying or commercial redistribution of platform assets without express written consent is prohibited.
            </p>
          </section>

          {/* Section 12: Account Suspension & Termination */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Ban className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Account Suspension & Termination</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam reserves the right to review, edit, suspend, or terminate user accounts, or restrict access to community features, at any time for conduct that violates these Terms of Service or community standards. You may also delete your account at any time through Account Settings or by contacting support.
            </p>
          </section>

          {/* Section 13: Disclaimers & Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldAlert className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Disclaimers & Limitation of Liability</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. To the fullest extent permitted by law, FluteSangam and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising out of your access to or inability to use the platform.
            </p>
          </section>

          {/* Section 14: Changes to These Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <RefreshCw className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Changes to These Terms</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We may update these Terms of Service periodically to reflect platform updates, feature additions, or legal requirements. We encourage you to review these Terms periodically. Material changes may be communicated through the website or, where appropriate, to registered members.
            </p>
          </section>

          {/* Section 15: Contact & Administration Support */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mail className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Contact & Administration Support</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you have any questions regarding these Terms of Service, copyright notices, or account administration, please contact our team at:
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

          {/* Section 16: Last Updated */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2 font-medium">
            <span>FluteSangam • Official Terms of Service</span>
            <span>Last Updated: August 8, 2026</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfServiceView;
