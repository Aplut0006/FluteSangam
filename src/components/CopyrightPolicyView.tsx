import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  Scale, 
  Globe, 
  Search, 
  Music, 
  ExternalLink,
  Users,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CopyrightPolicyViewProps {
  onBackToHomepage?: () => void;
  onBackToCommunity?: () => void;
}

export const CopyrightPolicyView: React.FC<CopyrightPolicyViewProps> = ({ 
  onBackToHomepage,
  onBackToCommunity 
}) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    if (onBackToHomepage) {
      e.preventDefault();
      onBackToHomepage();
    } else if (onBackToCommunity) {
      e.preventDefault();
      onBackToCommunity();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
      id="copyright-policy-view"
    >
      {/* Top Navigation */}
      <Link
        to="/"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/80 hover:bg-bamboo-100 border border-bamboo-200/80 px-3.5 py-1.5 rounded-full mb-6 transition-all cursor-pointer"
        id="copyright-policy-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Homepage
      </Link>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-bamboo-100 overflow-hidden">
        
        {/* Banner Header: H1 Title */}
        <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-400/20 backdrop-blur-md rounded-2xl border border-amber-300/30">
              <Scale className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-300/20">
              Legal &amp; Intellectual Property
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wide mb-2 text-white">
            Copyright Policy &amp; DMCA Notice
          </h1>
          <p className="text-bamboo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Respecting intellectual property rights, educational transcription guidelines, and our streamlined infringement review procedure.
          </p>
          <div className="mt-4 pt-4 border-t border-bamboo-700/60 text-xs text-amber-300/90 font-medium">
            <strong>Last updated:</strong> October 2, 2026
          </div>
        </div>

        {/* Policy Content */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed font-sans text-xs sm:text-sm">
          
          {/* Mission & Overview Box */}
          <section className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-6 space-y-3 text-amber-950 shadow-3xs">
            <p className="leading-relaxed">
              <strong>FluteSangam</strong> respects the intellectual property rights of composers, lyricists, musicians, performers, publishers, producers, artists, copyright owners, and other rights holders.
            </p>
            <p className="leading-relaxed text-slate-700">
              FluteSangam is an independent website that provides flute-learning resources, including flute notation, Sargam and Western note references, practice guidance, educational articles, interactive tools, and community features.
            </p>
            <p className="leading-relaxed text-slate-700">
              This page explains how FluteSangam approaches copyright-related material and how copyright owners or their authorized representatives can report material they believe infringes their rights.
            </p>
          </section>

          {/* Section 1: Respect for Copyright */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>1. Respect for Copyright</h2>
            </div>
            <p>
              FluteSangam respects copyright and other intellectual property rights.
            </p>
            <p>
              Some pages on FluteSangam may refer to songs, musical compositions, films, television programs, artists, performers, or other third-party works for identification, educational discussion, or flute-learning purposes.
            </p>
            <p>
              The original copyrighted works and related rights remain with their respective owners.
            </p>
            <p>
              FluteSangam does not claim ownership of third-party songs, compositions, lyrics, recordings, films, television programs, artwork, trademarks, or other protected material unless expressly stated.
            </p>
          </section>

          {/* Section 2: Flute Notation and Educational Material */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Music className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>2. Flute Notation and Educational Material</h2>
            </div>
            <p>
              FluteSangam creates and publishes independently prepared flute-learning material.
            </p>
            <p>Depending on the page, this may include:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sargam notation</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Western note references</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Octave information</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flute fingering guidance</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Playing and phrasing suggestions</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Practice exercises</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Learning tips</span>
              </li>
              <li className="flex items-center gap-2 bg-sand-50/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Explanations of musical concepts</span>
              </li>
            </ul>
            <p className="pt-2">
              The notation and instructional explanations published by FluteSangam may be independently prepared by the site and do not represent a claim of ownership over the underlying musical composition.
            </p>
            <p>
              Where a page relates to a third-party song or composition, the original work remains the property of its respective copyright owner.
            </p>
            <p className="text-slate-600 italic">
              Copyright law can depend on the specific work, the nature and amount of material used, the purpose of the use, the jurisdiction, and other circumstances. The educational or informational nature of a page does not by itself establish that a particular use is permitted under copyright law.
            </p>
          </section>

          {/* Section 3: Third-Party Songs, Compositions and Works */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <BookOpen className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>3. Third-Party Songs, Compositions and Works</h2>
            </div>
            <p>
              FluteSangam may publish learning resources relating to songs and musical works created by third parties.
            </p>
            <p>
              Names of songs, artists, composers, lyricists, films, television programs, and other third-party works may be used to identify the material being discussed or taught.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-slate-700">
              <p className="font-semibold text-slate-900">Unless explicitly stated otherwise:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>FluteSangam is not the copyright owner of those third-party works.</li>
                <li>FluteSangam is not affiliated with or endorsed by the relevant copyright owner, artist, label, producer, film studio, television network, or other rights holder.</li>
                <li>References to third-party names are provided for identification and informational purposes.</li>
                <li>Original recordings, official artwork, lyrics, compositions, trademarks, and other protected material remain subject to the rights of their respective owners.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Copyright & Reuse */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <FileText className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>4. Copyright &amp; Reuse</h2>
            </div>
            <p>
              The original instructional content on this page—including FluteSangam&apos;s explanations, practice guidance, playing tips, formatting, and other original material—is created for FluteSangam and may not be reproduced, copied, republished, or redistributed on another website without permission.
            </p>
            <p>
              The underlying musical composition, song, lyrics, recording, and other third-party material referenced on this page remain the property of their respective copyright owners.
            </p>
            <p>
              If you would like to reproduce or republish FluteSangam&apos;s original instructional material, please contact us for permission.
            </p>
          </section>

          {/* Section 5: Copyright & DMCA Infringement Notices */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>5. Copyright &amp; DMCA Infringement Notices</h2>
            </div>
            <p>
              If you are a copyright owner or an authorized representative and believe that material published on FluteSangam infringes your copyright, you may contact us with a copyright complaint.
            </p>
            <p>
              Although FluteSangam is based in India, we use this process to provide an accessible way for rights holders and authorized representatives, including those from other jurisdictions, to raise copyright concerns.
            </p>
            <p>
              A copyright complaint should identify the specific material and URL involved so that we can properly review the concern.
            </p>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-3">
              <h3 className="font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                Information to Include in a Copyright Complaint
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                Please provide as much of the following information as possible:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-800 font-medium pl-1">
                <li><strong>Your full name</strong></li>
                <li><strong>Your contact email address</strong></li>
                <li><strong>Your relationship to the copyrighted work</strong></li>
                <li><strong>Identification of the copyrighted work</strong> that you believe has been infringed</li>
                <li><strong>The exact FluteSangam URL(s)</strong> containing the material you are reporting</li>
                <li><strong>A description of the material</strong> you believe infringes your rights</li>
                <li><strong>An explanation of your copyright concern</strong></li>
                <li>If you are acting on behalf of the copyright owner, information confirming that you are authorized to do so</li>
                <li>Any additional information or documentation that may help us evaluate the complaint</li>
              </ol>
              <p className="text-xs text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/60 mt-2 font-sans font-medium">
                <strong>Important:</strong> Providing the exact URL is particularly important because it allows us to locate and review the specific material identified in the complaint.
              </p>
            </div>
          </section>

          {/* Section 6: Review of Copyright Complaints */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Search className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>6. Review of Copyright Complaints</h2>
            </div>
            <p>
              FluteSangam will review copyright complaints received through the designated contact channel.
            </p>
            <p>After reviewing a complaint, we may, depending on the circumstances:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 pl-2">
              <li>Request additional information</li>
              <li>Contact the relevant contributor or content creator</li>
              <li>Remove or modify the reported material</li>
              <li>Restrict access to the reported material</li>
              <li>Take no action where the complaint does not provide sufficient information or does not establish a valid basis for removal</li>
            </ul>
            <p className="text-slate-600 italic">
              Submitting a complaint does not automatically establish that copyright infringement has occurred. FluteSangam may need additional information to understand the nature of the material, the rights claimed, and the circumstances of the use.
            </p>
          </section>

          {/* Section 7: Good-Faith Copyright Complaints */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <CheckCircle2 className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>7. Good-Faith Copyright Complaints</h2>
            </div>
            <p>
              Please submit copyright complaints only when you genuinely believe that your copyrighted work or the rights you are authorized to represent have been infringed.
            </p>
            <p>
              False, misleading, incomplete, or abusive copyright complaints may make it difficult to process legitimate requests.
            </p>
            <p>
              FluteSangam may request clarification or supporting information where necessary.
            </p>
          </section>

          {/* Section 8: User-Submitted Content */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Users className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>8. User-Submitted Content</h2>
            </div>
            <p>
              FluteSangam may provide community features that allow users to submit posts, comments, recordings, images, links, notation, or other material.
            </p>
            <p>
              Users are responsible for ensuring that they have the necessary rights or permissions to submit material to FluteSangam.
            </p>
            <p>
              If you believe that user-submitted material infringes your copyright, please identify the specific content and URL and contact us using the procedure described on this page.
            </p>
          </section>

          {/* Section 9: Removal and Modification */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <AlertTriangle className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>9. Removal and Modification</h2>
            </div>
            <p>
              Where a copyright concern appears legitimate and sufficiently supported, FluteSangam may remove, modify, restrict, or disable access to the relevant material.
            </p>
            <p>
              In appropriate circumstances, FluteSangam may also take steps to prevent the same material from being republished through its services.
            </p>
            <p>
              Any action taken will depend on the specific circumstances and information available at the time.
            </p>
          </section>

          {/* Section 10: Trademarks and Third-Party Names */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Globe className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>10. Trademarks and Third-Party Names</h2>
            </div>
            <p>
              Names of songs, artists, composers, performers, films, television programs, music labels, brands, and other third-party entities may appear on FluteSangam.
            </p>
            <p>
              Such names and trademarks belong to their respective owners.
            </p>
            <p>
              Their appearance on FluteSangam does not imply sponsorship, partnership, affiliation, or endorsement unless explicitly stated.
            </p>
          </section>

          {/* Section 11: Links to Third-Party Websites */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <ExternalLink className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>11. Links to Third-Party Websites</h2>
            </div>
            <p>
              FluteSangam may occasionally link to third-party websites or resources.
            </p>
            <p>
              FluteSangam does not control the content, copyright practices, or policies of third-party websites.
            </p>
            <p>
              Questions regarding material hosted on another website should generally be directed to the owner or operator of that website.
            </p>
          </section>

          {/* Section 12: Copyright Complaints and Google Search */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <Search className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>12. Copyright Complaints and Google Search</h2>
            </div>
            <p>
              A copyright owner may have separate options for requesting removal of allegedly infringing material from search engines or other services.
            </p>
            <p>
              Google, for example, provides a legal process for copyright removal requests. Such a request may involve identifying the copyrighted work and the specific URLs at issue. Google evaluates copyright removal requests according to its own procedures and applicable legal requirements.
            </p>
            <p>
              A request to FluteSangam and a request to a search engine are separate matters. Removing a page from Google Search does not necessarily remove the page from the website itself. Likewise, removing material from FluteSangam does not necessarily cause search results to disappear immediately.
            </p>
          </section>

          {/* Section 13: Copyright Contact Channel */}
          <section className="bg-gradient-to-br from-amber-50 to-sand-100 border border-amber-200/90 rounded-2xl p-5 sm:p-8 space-y-4 text-amber-950">
            <div className="flex items-center gap-3 text-bamboo-950 font-display font-bold text-lg sm:text-xl">
              <Mail className="w-6 h-6 text-amber-700 shrink-0" />
              <h2>13. Copyright Contact</h2>
            </div>
            <p>For copyright-related concerns, please contact:</p>
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200 space-y-1.5">
              <div className="font-bold text-bamboo-950 text-base">FluteSangam</div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold text-bamboo-900">Email:</span>
                <a href="mailto:flutesangam@gmail.com" className="text-amber-700 hover:text-amber-800 font-bold underline">
                  flutesangam@gmail.com
                </a>
              </div>
            </div>
            <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
              <p className="font-semibold mb-1">Recommended Email Subject:</p>
              <code className="bg-white px-2 py-1 rounded font-mono font-bold text-amber-900 block sm:inline">
                Copyright Infringement Notice – FluteSangam
              </code>
              <span className="block mt-1 text-slate-600">This helps us identify and route copyright-related messages promptly.</span>
            </div>
          </section>

          {/* Section 14: Policy Updates */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-bamboo-900 font-display font-bold text-lg sm:text-xl border-b border-bamboo-100 pb-2">
              <HelpCircle className="w-5 h-5 text-bamboo-600 shrink-0" />
              <h2>14. Policy Updates</h2>
            </div>
            <p>
              FluteSangam may update this Copyright Policy from time to time as the website, its services, or applicable legal requirements change.
            </p>
            <p>
              The latest version of this policy will be published on this page.
            </p>
          </section>

          {/* Section 15: Important Notice / Legal Disclaimer */}
          <section className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 text-slate-700">
            <div className="flex items-center gap-2.5 text-slate-900 font-display font-bold text-base sm:text-lg border-b border-slate-200 pb-2">
              <Scale className="w-5 h-5 text-slate-700 shrink-0" />
              <h2>15. Important Notice</h2>
            </div>
            <p>
              This page describes FluteSangam&apos;s copyright practices and complaint-handling process. It is not legal advice and does not determine whether any particular use of copyrighted material is lawful.
            </p>
            <p>
              Copyright rights and exceptions can vary depending on the applicable law and circumstances.
            </p>
            <p>
              If you have a specific legal question about copyright, you should consult a qualified legal professional.
            </p>
          </section>

          {/* Bottom Community Tagline */}
          <div className="pt-6 border-t border-bamboo-100 text-center space-y-1">
            <div className="font-display font-bold text-bamboo-950 text-base">
              FluteSangam
            </div>
            <p className="text-xs text-slate-500 italic">
              A global community for people who love learning, playing, and exploring the flute.
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default CopyrightPolicyView;
