import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Lock, Eye, Server, UserCheck, Mail, ArrowLeft, 
  Cookie, BarChart3, Radio, FileText, CheckCircle2, HelpCircle 
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
        {/* Banner Header */}
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
            Transparency, security, user account safety, and cookie compliance for the global FluteSangam community.
          </p>
        </div>

        {/* Policy Content */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
          {/* Key Commitment Callout */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3 text-amber-900 shadow-3xs">
            <div className="flex items-start gap-3.5">
              <Lock className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-950 text-sm sm:text-base">Our Core Privacy Commitment</h3>
                <p className="text-xs sm:text-sm leading-relaxed mt-1">
                  At <strong>FluteSangam</strong>, your privacy and trust are fundamental. We are dedicated to protecting the personal information of our global community of flute learners, gurus, and artists. We <strong>never sell or rent</strong> your personal data to third parties.
                </p>
              </div>
            </div>
            <div className="bg-white/90 border border-amber-300/80 rounded-xl p-3.5 text-xs text-amber-950 font-medium space-y-2">
              <p><strong>App Scope:</strong> FluteSangam is a free learning platform providing classical raga guides, sargam exercises, interactive flute tools, and a community space for flute players worldwide.</p>
              <p><strong>Microphone & Audio Processing:</strong> Interactive tools like the <em>Bansuri Flute Tuner</em> access your device microphone purely for real-time pitch and frequency calculations using the browser's Web Audio API. Audio is processed strictly in local browser memory and is <strong>never recorded, stored, or transmitted</strong> to any server.</p>
              <p><strong>Authentication & Accounts:</strong> We utilize secure Firebase Authentication (Email/Password and Google Sign-In) to verify identity, protect user profiles, and enable members to post audio recitals, song notation requests, and community discussions.</p>
            </div>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <UserCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Depending on how you interact with FluteSangam, we collect the following categories of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li>
                <strong>Community Account & Profile Data:</strong> When registering via Email or Google Auth, we store your email address, display name, profile avatar, bio, location, flute scale preference, and proficiency level.
              </li>
              <li>
                <strong>User Generated Content (UGC):</strong> Public posts, audio/video recital links, comments, song notation requests, likes, and community discussions published under your account profile.
              </li>
              <li>
                <strong>Direct Messaging:</strong> Private messages and media shared between community members within the platform.
              </li>
              <li>
                <strong>Technical & Log Data:</strong> Standard internet log info such as IP address, browser type, operating system, device identifiers, and page viewing metrics to ensure site security and optimal performance.
              </li>
              <li>
                <strong>Local Microphone Stream:</strong> Temporary, in-memory audio frequency streams when using the real-time pitch tuner (never stored or transmitted).
              </li>
            </ul>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Eye className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>2. How We Use Your Information</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              We utilize collected information strictly for operational and educational purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li>To create, manage, and secure your community account and profile.</li>
              <li>To facilitate community discussions, recital feedback, and song notation requests.</li>
              <li>To send essential transactional notifications (such as password resets or reply alerts).</li>
              <li>To analyze platform traffic and improve our educational guides and interactive tools.</li>
              <li>To maintain security, prevent unauthorized account access, and enforce community standards.</li>
            </ul>
          </section>

          {/* Section 3: Cookies and Tracking Technologies */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Cookie className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>3. Cookies, Web Beacons & Local Storage</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam uses cookies, web beacons, and browser local storage to enhance your experience, maintain session state, analyze usage, and support advertising services.
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-bamboo-50/70 border border-bamboo-200/80 space-y-1">
                <h4 className="font-bold text-bamboo-900 text-xs sm:text-sm">Essential & Authentication Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Required for core site functionality, keeping you logged into your community account via Firebase Auth, and preserving security tokens.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <h4 className="font-bold text-amber-900 text-xs sm:text-sm">Preference & Local State Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Store client settings such as metronome tempo, flute scale preference, and UI layout settings across sessions.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <h4 className="font-bold text-emerald-900 text-xs sm:text-sm">Analytical & Performance Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Set by Google Analytics to gather anonymized traffic patterns, view counts, and usage trends to improve content quality.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                <h4 className="font-bold text-rose-900 text-xs sm:text-sm">Advertising & Third-Party Cookies</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Set by advertising networks (such as Google AdSense) to serve relevant ads based on prior browsing history and measure ad performance.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 pt-1">
              <strong>Managing Cookies:</strong> You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, disabling essential cookies may affect your ability to log in or interact with community features.
            </p>
          </section>

          {/* Section 4: Google Analytics */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <BarChart3 className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>4. Google Analytics Disclosure</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We use <strong>Google Analytics</strong>, a web analytics service provided by Google LLC ("Google"). Google Analytics uses cookies to help us analyze how visitors navigate and interact with FluteSangam.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The information generated by the cookie regarding your use of the website (including your anonymized IP address) is transmitted to and stored by Google on servers in the United States. Google uses this information to evaluate website activity, compile reports for website operators, and provide other services related to website activity and internet usage.
            </p>
            <p className="text-xs text-bamboo-800 bg-bamboo-50 p-3 rounded-xl border border-bamboo-200">
              You can opt out of Google Analytics tracking across all websites by installing the official <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="font-bold underline text-bamboo-900 hover:text-amber-700">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </section>

          {/* Section 5: Third-Party Advertising & Google AdSense */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Radio className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>5. Google AdSense & Third-Party Advertising Vendors</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam may display advertisements served by <strong>Google AdSense</strong> and other third-party advertising partners to support the free educational platform.
            </p>
            
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs sm:text-sm text-amber-950">
              <h4 className="font-bold text-amber-900 text-sm">Important AdSense Disclosures:</h4>
              <ul className="list-disc list-inside space-y-1.5 pl-1 text-gray-700">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to FluteSangam or other websites on the internet.
                </li>
                <li>
                  Google's use of advertising cookies (including the DoubleClick DART cookie) enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline hover:text-amber-950">Google Ads Settings</a>.
                </li>
                <li>
                  Alternatively, users can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline hover:text-amber-950">www.aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline hover:text-amber-950">Your Online Choices</a>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Data Protection & Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Server className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>6. Data Protection, Firebase & Security</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              FluteSangam leverages secure Google Cloud and Firebase Cloud Firestore infrastructure with robust security rules. All data in transit is encrypted using HTTPS/TLS protocols. Access controls ensure that your account details and direct communications are strictly safeguarded against unauthorized access, loss, or disclosure.
            </p>
          </section>

          {/* Section 7: User Rights (GDPR & CCPA) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>7. Your Rights & Data Choices (GDPR & CCPA)</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Under applicable privacy laws (including GDPR and CCPA), you hold the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You may update or correct your account details at any time in Profile Settings.</li>
              <li><strong>Right to Erasure (Account Deletion):</strong> You have the right to request full account deletion and removal of your user-generated content.</li>
              <li><strong>Right to Opt-Out:</strong> We do not sell personal data. You can manage or opt out of personalized cookies as described in Section 5.</li>
            </ul>
          </section>

          {/* Section 8: Contact Us */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Mail className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>8. Contact Us & Privacy Requests</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy, cookie options, or account data removal, please contact our support team at:
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

          {/* Timestamp */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
            <span>FluteSangam • Official Privacy Policy</span>
            <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyView;
