import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Lock, Eye, Server, UserCheck, Mail, ArrowLeft, 
  Cookie, BarChart3, Radio, FileText, CheckCircle2, HelpCircle,
  Database, Trash2, Baby, Globe, RefreshCw, Mic, Volume2
} from 'lucide-react';

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
        {/* Banner Header: Section 1 - Title */}
        <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-400/20 backdrop-blur-md rounded-2xl border border-amber-300/30">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-300/20">
              Official Legal Policy
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wide mb-2 text-white">
            Privacy Policy
          </h1>
          <p className="text-bamboo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Transparency, security, user account safety, and privacy compliance for the global FluteSangam community.
          </p>
        </div>

        {/* Policy Content */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
          
          {/* Section 2: Our Privacy Commitment */}
          <section className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-6 space-y-3 text-amber-900 shadow-3xs">
            <div className="flex items-start gap-3.5">
              <Lock className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold font-display text-amber-950 text-base sm:text-lg">Our Privacy Commitment</h2>
                <p className="text-xs sm:text-sm leading-relaxed mt-1 text-amber-900">
                  At <strong>FluteSangam</strong>, your privacy and trust are fundamental. We are dedicated to protecting the personal information of our global community of flute learners, gurus, and artists. We <strong>never sell or rent</strong> your personal data to third parties under any circumstances.
                </p>
              </div>
            </div>
            <div className="bg-white/90 border border-amber-300/80 rounded-xl p-3.5 text-xs text-amber-950 font-medium space-y-2">
              <p><strong>App Scope:</strong> FluteSangam is a free learning platform providing classical raga guides, sargam exercises, interactive flute tools, and a social community space for flute players worldwide.</p>
              <p><strong>Key Principles:</strong> Transparent data collection, strict browser-only audio handling, secure authentication, and full user control over community accounts.</p>
            </div>
          </section>

          {/* Section 3: Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <UserCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Information We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Depending on how you interact with FluteSangam, we collect the following categories of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li>
                <strong>Community Account & Profile Data:</strong> When registering via Email/Password or Google Authentication, we collect your email address, display name, profile avatar URL, bio, location, preferred flute scale, and proficiency level.
              </li>
              <li>
                <strong>User-Generated Content (UGC):</strong> Public posts, audio/video recital links, comments, song notation requests, likes, and community forum discussions published under your profile.
              </li>
              <li>
                <strong>Direct Messaging:</strong> Private messages and shared media sent directly between community members within the platform.
              </li>
              <li>
                <strong>Technical & Server Log Data:</strong> IP address, browser type, device type, operating system, pages viewed, time spent, and referral headers collected for security auditing and performance monitoring.
              </li>
              <li>
                <strong>Local Storage Settings:</strong> Client preferences such as metronome tempo (BPM), scale selections, and tuner settings saved locally in your browser's <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">localStorage</code>.
              </li>
            </ul>
          </section>

          {/* Section 4: How We Use Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Eye className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>How We Use Information</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              We utilize collected information strictly for operational, educational, and platform integrity purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li>To register, authenticate, and maintain your member account via Firebase Auth.</li>
              <li>To display your member profile and attribute your recitals, posts, comments, and song notation requests.</li>
              <li>To facilitate private messaging between registered community members.</li>
              <li>To deliver essential transactional notices (such as password reset requests or reply notifications).</li>
              <li>To analyze aggregated usage metrics (via Google Analytics) to improve our educational guides, tools, and user experience.</li>
              <li>To detect, prevent, and address technical errors, fraudulent activity, or violations of our Terms of Service.</li>
            </ul>
          </section>

          {/* Section 5: Cookies & Similar Technologies */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Cookie className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Cookies & Similar Technologies</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam uses cookies, local storage, and similar web technologies to enhance user navigation, maintain authentication sessions, analyze site usage, and support potential advertising integrations.
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-bamboo-50/70 border border-bamboo-200/80 space-y-1">
                <h4 className="font-bold text-bamboo-900 text-xs sm:text-sm">Essential & Authentication Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Required for core site operation, maintaining your logged-in session state via Firebase Authentication, and security tokens.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <h4 className="font-bold text-amber-900 text-xs sm:text-sm">Preference & Local Storage</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Stores client settings such as metronome speed, flute scale preference, and active tab preferences directly in your browser.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <h4 className="font-bold text-emerald-900 text-xs sm:text-sm">Analytical Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Set by Google Analytics to collect information about how visitors use FluteSangam, such as page views and interactions.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                <h4 className="font-bold text-rose-900 text-xs sm:text-sm">Advertising & Third-Party Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  May be set by third-party ad networks (such as Google AdSense) when ad units are displayed to serve relevant advertisements.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 pt-1">
              <strong>Managing Cookies:</strong> You can choose to disable or selectively block cookies in your browser settings. Please note that disabling essential cookies may impact account login or community interactions.
            </p>
          </section>

          {/* Section 6: Google Analytics */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <BarChart3 className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Google Analytics</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Google Analytics uses cookies and similar technologies to collect information about how visitors use FluteSangam, such as page views, interactions, browser information, and approximate geographic information.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Information collected is processed by Google to generate aggregate reports for platform maintenance. IP anonymization is enabled by default. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="font-bold underline text-bamboo-900 hover:text-amber-700">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </section>

          {/* Section 7: Advertising & Google AdSense */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Radio className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Advertising & Google AdSense</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam may display advertisements served by <strong>Google AdSense</strong> or other third-party advertising partners to help keep the learning platform free for everyone.
            </p>
            
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs sm:text-sm text-amber-950">
              <h4 className="font-bold text-amber-900 text-sm">Advertising Disclosures & Cookie Notice:</h4>
              <ul className="list-disc list-inside space-y-1.5 pl-1 text-gray-700">
                <li>
                  Third-party vendors, including Google, may use cookies to serve advertisements based on a user's prior visits to FluteSangam or other websites on the internet.
                </li>
                <li>
                  Google's use of advertising cookies enables it and its partners to serve relevant ads based on visits to our site and/or other sites across the internet.
                </li>
                <li>
                  Users may opt out of personalized advertising at any time by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline hover:text-amber-950">Google Ads Settings</a>.
                </li>
                <li>
                  Alternatively, users can opt out of third-party vendor advertising cookies by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline hover:text-amber-950">www.aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline hover:text-amber-950">Your Online Choices</a>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8: Firebase & Third-Party Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Database className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Firebase & Third-Party Services</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is hosted on Google Cloud infrastructure and utilizes <strong>Google Firebase</strong> (Firebase Authentication and Cloud Firestore Database) to securely store user credentials, member profiles, public posts, comments, direct messages, and song notation requests.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Firebase Security Rules are used to restrict database access and help prevent unauthorized users from accessing or modifying protected information. Third-party APIs (such as YouTube or Soundcloud embedded players for recital links) operate under their respective privacy policies.
            </p>
          </section>

          {/* Section 9: User-Generated Content & Community */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <FileText className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>User-Generated Content & Community</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              When you post audio recitals, comments, forum discussions, or song notation requests in the FluteSangam community space, that content becomes publicly viewable to other members and visitors.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We urge members to exercise caution and avoid sharing sensitive personally identifiable information (such as phone numbers, home addresses, or financial data) in public community threads.
            </p>
          </section>

          {/* Section 10: Microphone & Audio Processing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mic className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Microphone & Audio Processing</h2>
            </div>
            <div className="bg-bamboo-50/80 border border-bamboo-200 rounded-2xl p-4 space-y-2 text-xs sm:text-sm text-bamboo-950">
              <p className="font-bold text-bamboo-900">100% In-Memory Local Audio Processing:</p>
              <p className="text-gray-700 leading-relaxed">
                Interactive tools such as the <em>Bansuri Flute Tuner</em> request temporary access to your device microphone. Audio frequency detection is performed entirely inside your web browser using the native Web Audio API.
              </p>
              <p className="text-gray-700 font-semibold leading-relaxed">
                Audio signals are <strong>never recorded, stored, saved, or transmitted</strong> to any remote server or third party. You can grant or revoke microphone permissions at any time via your browser's site settings.
              </p>
            </div>
          </section>

          {/* Section 11: Data Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Server className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Data Security</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, misuse, alteration, or disclosure. All network traffic between your browser and our platform is encrypted using HTTPS/TLS protocols, and database access is managed through Firebase Security Rules.
            </p>
          </section>

          {/* Section 12: Data Retention */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Database className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Data Retention</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We retain personal data only for as long as necessary to provide our services and fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Account & Profile Data:</strong> Retained for as long as your account remains active.</li>
              <li><strong>User-Generated Content:</strong> Forum posts, comments, and recitals are retained until deleted by you or removed by moderators.</li>
              <li><strong>Server Logs:</strong> Technical logs may be retained for a limited period as reasonably necessary for security, troubleshooting, performance monitoring, and legal obligations.</li>
              <li><strong>Local Storage:</strong> Preference data remains in your browser until cleared manually or via browser cache cleanup.</li>
            </ul>
          </section>

          {/* Section 13: Your Privacy Rights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Your Privacy Rights</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Depending on your location (including rights under GDPR, CCPA, and global privacy frameworks), you hold the following privacy rights:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Edit or update inaccurate profile information directly in your Account Settings.</li>
              <li><strong>Right to Erasure:</strong> Request full deletion of your account and associated personal data.</li>
              <li><strong>Right to Restrict or Object:</strong> Object to processing of personal data or manage cookie preferences.</li>
            </ul>
          </section>

          {/* Section 14: Account Deletion */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Trash2 className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Account Deletion</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You have the right to delete your FluteSangam community account at any time. Account deletion removes your authentication credentials, member profile details, and private settings from our active database.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              To request account deletion, navigate to <strong>Profile Settings</strong> in the app or contact us directly at <a href="mailto:aplut0006@gmail.com" className="font-bold underline text-bamboo-800 hover:text-amber-700">aplut0006@gmail.com</a> with your registered email address.
            </p>
          </section>

          {/* Section 15: Children's Privacy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Baby className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Children's Privacy</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is a general audience educational website and is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you are a parent or guardian and believe your child under 13 has created an account or provided personal information, please contact us immediately at <a href="mailto:aplut0006@gmail.com" className="font-bold underline text-bamboo-800 hover:text-amber-700">aplut0006@gmail.com</a> so we can promptly delete that information.
            </p>
          </section>

          {/* Section 16: International Data Transfers */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Globe className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>International Data Transfers</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam is accessible globally. Personal information may be processed or stored by our service providers in countries outside your country of residence, including the United States. Where required by applicable law, we rely on appropriate safeguards for international data transfers.
            </p>
          </section>

          {/* Section 17: Changes to This Privacy Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <RefreshCw className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Changes to This Privacy Policy</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in platform features, legal requirements, or operational practices. We encourage you to review this Privacy Policy periodically. Material changes will be communicated through the website or, where appropriate, to registered members.
            </p>
          </section>

          {/* Section 18: Contact & Privacy Requests */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mail className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>Contact & Privacy Requests</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you have any questions, concerns, or privacy requests regarding this policy or your account data, please contact our support team at:
            </p>
            <div className="mt-2 bg-bamboo-50/80 border border-bamboo-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-bamboo-900 text-sm">FluteSangam Privacy Team</p>
                <p className="text-xs text-gray-600">Official contact for data protection and privacy inquiries</p>
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

          {/* Section 19: Last Updated */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2 font-medium">
            <span>FluteSangam • Official Privacy Policy</span>
            <span>Last Updated: August 8, 2026</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyView;
