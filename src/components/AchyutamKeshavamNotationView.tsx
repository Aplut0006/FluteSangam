import React from 'react';
import { 
  Music, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb, 
  Layers, 
  Wind, 
  ShieldCheck,
  Sparkles,
  Flower2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { PUBLISHED_SONG_NOTATIONS } from '../data/songNotationsData';

interface AchyutamKeshavamNotationViewProps {
  onViewChange?: (view: AppView) => void;
}

export const AchyutamKeshavamNotationView: React.FC<AchyutamKeshavamNotationViewProps> = ({ 
  onViewChange 
}) => {
  const song = PUBLISHED_SONG_NOTATIONS.find(s => s.slug === 'achyutam-keshavam-flute-notes') || PUBLISHED_SONG_NOTATIONS[4];

  const handleLinkClick = (e: React.MouseEvent, viewKey: string) => {
    if (e.ctrlKey || e.metaKey) return;
    if (onViewChange) {
      e.preventDefault();
      onViewChange(viewKey as AppView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-sand-50/50 pb-20 pt-4 sm:pt-6 font-sans antialiased text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

        {/* 1. Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-bamboo-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link 
            to="/" 
            onClick={(e) => {
              if (onViewChange && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onViewChange('community');
              }
            }}
            className="hover:text-amber-700 transition"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-bamboo-400 shrink-0" />
          <Link 
            to="/notations" 
            onClick={(e) => {
              if (onViewChange && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onViewChange('notation_requests');
              }
            }}
            className="hover:text-amber-700 transition"
          >
            Song Notations
          </Link>
          <ChevronRight className="w-3 h-3 text-bamboo-400 shrink-0" />
          <span className="text-bamboo-950 font-bold truncate" aria-current="page">
            Achyutam Keshavam Flute Notes
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flower2 className="w-3.5 h-3.5 text-amber-300" />
              Devotional Krishna Stuti / Bhajan
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Level: Easy / Beginner
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            {song.h1}
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base max-w-2xl font-medium">
            Learn the sacred devotional melody of <em>Achyutam Keshavam</em> on flute or bansuri with lyric-aligned Sargam and Western notes, lower octave markings, breath pause marks, and beginner practice tips.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-2 border-t border-amber-600/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Published: Sep 21, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Updated: Sep 21, 2026</span>
            </div>
          </div>
        </header>

        {/* 3. Introduction & Overview */}
        <section aria-label="Song Overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            About Achyutam Keshavam on Bansuri
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans">
            {song.intro}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed font-sans">
            The beauty of <em>Achyutam Keshavam</em> lies in its gentle devotional pace, sweet transitions into the lower octave (Mandra Saptak), and natural breathing breaks between poetic phrases. This lesson is arranged in a comfortable melodic range that works on any flute scale, making it one of the most rewarding devotional pieces for beginner and intermediate flutists.
          </p>
        </section>

        {/* 4. Quick Information Table */}
        <section aria-label="Quick Information" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Quick Song Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Melody Type</span>
              <span className="font-semibold text-bamboo-950">{song.quickInfo.melodyType}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Difficulty</span>
              <span className="font-semibold text-emerald-700">{song.quickInfo.difficulty}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Suggested Flute</span>
              <span className="font-semibold text-bamboo-950">{song.quickInfo.suggestedFlute}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Starting Swar</span>
              <span className="font-semibold text-bamboo-950">{song.quickInfo.startingSwar}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Highest Swar</span>
              <span className="font-semibold text-bamboo-950">{song.quickInfo.highestSwar}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Practice Speed</span>
              <span className="font-semibold text-bamboo-950">{song.quickInfo.practiceSpeed}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-100/50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-bold">Key Playing Focus:</span>
            <p>{song.quickInfo.mainChallenge}</p>
          </div>
        </section>

        {/* 5. Notation Legend */}
        <section aria-label="Notation Legend" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-600" />
            Notation Legend &amp; Reading Guide
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            {song.legend.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 text-center space-y-1">
                <span className="font-mono font-bold text-amber-900 text-sm block">{item.symbol}</span>
                <span className="text-gray-600 text-[11px] leading-tight block">{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Clean Sargam Notation (Lyrics + Swar) */}
        <section aria-label="Sargam Flute Notes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-600" />
              Achyutam Keshavam Sargam Notes
            </h2>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Bansuri / Indian Flute
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Each phrase is paired with its lyric syllables. Symbols like <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">.D</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">.N</code> denote lower octave notes, <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">—</code> indicates a sustained note, and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">/</code> marks a breath pause:
          </p>

          <div className="space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                    Phrase {phrase.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-bamboo-950 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-lg p-2.5 border border-amber-200/80 shadow-3xs">
                      <div className="text-[11px] text-gray-500 font-medium truncate">{unit.lyric}</div>
                      <div className="font-mono font-bold text-amber-950 text-sm sm:text-base mt-0.5">{unit.sargam}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200/60 font-mono">
                  <span className="text-amber-800 font-sans font-medium">Sargam line:</span>
                  <span className="font-extrabold text-sm sm:text-base text-amber-950 tracking-wider">
                    {phrase.sargamNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Western Notes with Sa set to C */}
        <section aria-label="Western Notes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Western Notes (Sa = C)
            </h2>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
              Key of C Equivalent
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            For Western flute players and recorder learners playing in the key of C, the corresponding note transcriptions are arranged below:
          </p>

          <div className="space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                    Phrase {phrase.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-3xs">
                      <div className="text-[11px] text-slate-500 font-medium truncate">{unit.lyric}</div>
                      <div className="font-mono font-bold text-slate-900 text-sm sm:text-base mt-0.5">{unit.western}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                  <span className="text-slate-500 font-sans font-medium">Western line:</span>
                  <span className="font-bold text-slate-900 tracking-wider">
                    {phrase.westernNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Phrase-by-Phrase Playing Guidance */}
        <section aria-label="Phrase Guidance" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            Phrase-by-Phrase Playing Guidance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {song.phrases.map((item) => (
              <div 
                key={item.phraseNumber}
                className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-amber-950">
                    Phrase {item.phraseNumber}:
                  </h3>
                  <span className="text-xs font-medium text-amber-800 italic truncate max-w-[200px]">
                    "{item.lyric}"
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {item.guidance}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Practice Method */}
        <section aria-label="Practice Method" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            Step-by-Step Practice Method
          </h2>

          <ol className="space-y-2.5 text-xs sm:text-sm text-gray-700 list-decimal list-inside font-sans leading-relaxed">
            {song.practiceMethod.map((step, idx) => (
              <li key={idx} className="pl-1 font-medium">
                <span className="text-gray-800">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 10. Common Mistakes */}
        <section aria-label="Common Mistakes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Common Mistakes to Avoid
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {song.commonMistakes.map((mistake, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100 text-gray-700"
              >
                <span className="text-red-500 font-bold">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 11. Useful FluteSangam Tools & Other Notations */}
        <section aria-label="Useful Tools and Other Notations" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-600" />
            Useful FluteSangam Tools &amp; Related Songs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/notations/tum-hi-ho-flute-notes"
              onClick={(e) => handleLinkClick(e, 'notation_tum_hi_ho')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-xs sm:text-sm font-bold text-bamboo-950 hover:text-amber-900 transition group"
            >
              <span>🌹 Tum Hi Ho Flute Notes (Aashiqui 2)</span>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/notations/my-heart-will-go-on-flute-notes"
              onClick={(e) => handleLinkClick(e, 'notation_titanic')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-xs sm:text-sm font-bold text-bamboo-950 hover:text-amber-900 transition group"
            >
              <span>🚢 Titanic Flute Notes (My Heart Will Go On)</span>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/notations/happy-birthday-flute-notes"
              onClick={(e) => handleLinkClick(e, 'notation_happy_birthday')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-xs sm:text-sm font-bold text-bamboo-950 hover:text-amber-900 transition group"
            >
              <span>🎂 Happy Birthday Flute Notes</span>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/notations/jingle-bells-flute-notes"
              onClick={(e) => handleLinkClick(e, 'notation_jingle_bells')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-xs sm:text-sm font-bold text-bamboo-950 hover:text-amber-900 transition group"
            >
              <span>🔔 Jingle Bells Flute Notes</span>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            {song.usefulTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.url}
                onClick={(e) => handleLinkClick(e, tool.viewKey)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-xs sm:text-sm font-bold text-bamboo-950 hover:text-amber-900 transition group"
              >
                <span>{tool.name}</span>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* 12. Authorship & Educational Notice */}
        <section aria-label="Authorship and Educational Notice" className="space-y-4">
          <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200/80 text-xs sm:text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Devotional &amp; Educational Notice</span>
            </div>
            <p>
              This notation is prepared for educational and spiritual bansuri practice purposes. <em>Achyutam Keshavam</em> is a traditional Sanskrit stuti and devotional bhajan celebrating the divine forms of Krishna and Rama. FluteSangam provides this arrangement to help students and flute sadhakas cultivate purity of tone and devotion.
            </p>
          </div>

          <AboutAuthorSection onViewChange={onViewChange} />
        </section>

      </div>
    </div>
  );
};

export default AchyutamKeshavamNotationView;
