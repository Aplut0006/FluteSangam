import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ShieldAlert, Users, Music, Scale, Mail, ArrowLeft, 
  CheckCircle2, Lock, Radio, Cookie, Eye 
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
          {/* Key Commitment Callout */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3 text-amber-900 shadow-3xs">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-950 text-sm sm:text-base">Acceptance of Terms</h3>
                <p className="text-xs sm:text-sm leading-relaxed mt-1">
                  By accessing FluteSangam, creating a community account, or using our interactive tools, you agree to comply with these Terms of Service, Privacy Policy, and community guidelines.
                </p>
              </div>
            </div>
            <div className="bg-white/90 border border-amber-300/80 rounded-xl p-3.5 text-xs text-amber-950 font-medium space-y-2">
              <p><strong>Platform Mission:</strong> FluteSangam provides free educational guides, raga lessons, sargam practice generators, and a social community for flute and Bansuri enthusiasts worldwide.</p>
              <p><strong>Authentication & Community Accounts:</strong> We utilize secure Firebase Authentication (Email and Google OAuth) to verify accounts, manage community profiles, and attribute user-generated content.</p>
              <p><strong>Interactive Audio Tools:</strong> Microphone access for tools like the Flute Tuner is executed purely in local browser memory. No audio is recorded or stored on any server.</p>
            </div>
          </div>

          {/* Section 1: Community Accounts & Authentication */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Lock className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>1. Community Accounts & Authentication</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              When creating a community account on FluteSangam:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li>
                <strong>Account Eligibility:</strong> You must be at least 13 years of age (or the legal age of majority in your jurisdiction) to create an account.
              </li>
              <li>
                <strong>Authentication Security:</strong> Accounts are created using Email/Password or Google Authentication. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your profile.
              </li>
              <li>
                <strong>Accurate Profile Info:</strong> Users agree to provide truthful information when setting up member profiles, display names, and musical details.
              </li>
            </ul>
          </section>

          {/* Section 2: Community Conduct & Moderation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Users className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>2. User Generated Content & Community Guidelines</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              FluteSangam is built on mutual respect and encouragement. When publishing audio recitals, posts, comments, or notation requests:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li>
                <strong>Constructive Participation:</strong> Provide polite, encouraging, and constructive feedback to fellow flute learners and artists.
              </li>
              <li>
                <strong>Prohibited Content:</strong> You may not upload or transmit content that is abusive, hateful, defamatory, obscene, sexually explicit, harassing, or infringing on intellectual property or third-party copyrights.
              </li>
              <li>
                <strong>No Spam or Commercial Solicitations:</strong> Unsolicited sales spam, commercial advertising, or unauthorized repetitive marketing posts are strictly prohibited.
              </li>
              <li>
                <strong>Content Moderation:</strong> FluteSangam reserves the right to review, edit, or remove any post, comment, or user content that violates these terms, and to suspend or terminate violating accounts.
              </li>
            </ul>
          </section>

          {/* Section 3: Content Ownership & Licensing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Music className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>3. Content Ownership & Community License</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You retain ownership of your original musical recordings, audio recitals, and notation requests published on FluteSangam. By posting content to public community feeds, you grant FluteSangam a non-exclusive, worldwide, royalty-free license to display, host, and distribute your content to other users on the platform.
            </p>
          </section>

          {/* Section 4: Interactive Tools & Microphone Permission */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Eye className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>4. Interactive Tools & Microphone Permissions</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Interactive features such as the <em>Flute Tuner</em> require temporary browser microphone access. Enabling microphone permissions allows the client-side Web Audio API to detect audio frequencies locally in your browser. Audio signals are processed strictly in real-time memory and are never saved, stored, or transmitted to any server. You may revoke microphone access at any time through your browser settings.
            </p>
          </section>

          {/* Section 5: Cookies, Google Analytics & Advertising Disclosures */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Cookie className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>5. Cookies, Google Analytics & Advertisements</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam utilizes cookies, local storage, Google Analytics, and third-party advertising services (such as Google AdSense) to keep the site free and accessible:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Cookies & Analytics:</strong> Cookies are used to store login sessions, user preferences, and aggregated analytics via Google Analytics to help us understand platform usage.</li>
              <li><strong>Third-Party Advertisements:</strong> Advertisements on FluteSangam may be served by Google AdSense and third-party ad networks using advertising cookies (including the DoubleClick DART cookie) to deliver relevant ads based on prior web visits.</li>
              <li><strong>Third-Party Links:</strong> FluteSangam may contain links or ads pointing to third-party websites. We are not responsible for the content, privacy policies, or practices of external third-party sites.</li>
            </ul>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Scale className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>6. Intellectual Property Rights</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              All non-user content on FluteSangam—including educational lesson guides, raga diagrams, alankar generator logic, branding, logos, and UI designs—is the property of FluteSangam and protected by copyright and intellectual property laws. Unattributed copying or commercial redistribution of site materials without prior consent is prohibited.
            </p>
          </section>

          {/* Section 7: Disclaimers & Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldAlert className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>7. Disclaimers & Limitation of Liability</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. While we strive to maintain high availability and accurate educational materials, FluteSangam shall not be liable for any indirect, incidental, or consequential damages resulting from your use or inability to use the platform.
            </p>
          </section>

          {/* Section 8: Contact & Support */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mail className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>8. Contact & Administration Support</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you have questions regarding these Terms of Service or wish to report a community terms violation, please contact our administrative team at:
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
            <span>FluteSangam • Official Terms of Service</span>
            <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfServiceView;
