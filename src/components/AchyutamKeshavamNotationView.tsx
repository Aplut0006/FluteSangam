import React from 'react';
import { 
  Music, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  Lightbulb, 
  Layers, 
  FileText,
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
    <div className="min-h-screen bg-sand-50/50 pb-20 pt-2 sm:pt-6 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto px-1 sm:px-6 space-y-6 sm:space-y-10">

        {/* 1. Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="px-2 sm:px-0 text-[11px] sm:text-xs font-semibold text-bamboo-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link 
            to="/" 
            onClick={(e) => {
              if (onViewChange && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onViewChange('community');
              }
            }}
            className="hover:text-amber-700 transition shrink-0"
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
            className="hover:text-amber-700 transition shrink-0"
          >
            Song Notations
          </Link>
          <ChevronRight className="w-3 h-3 text-bamboo-400 shrink-0" />
          <span className="text-bamboo-950 font-bold truncate" aria-current="page">
            Achyutam Keshavam Flute Notes
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-2xl sm:rounded-3xl p-4 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-3 sm:space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flower2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
              Devotional Krishna Stuti / Bhajan
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              Level: Easy / Beginner
            </span>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            {song.h1}
          </h1>

          <p className="text-amber-100/90 text-xs sm:text-base max-w-2xl font-medium leading-relaxed">
            Learn the sacred devotional melody of <em>Achyutam Keshavam</em> on flute or bansuri with lyric-aligned Sargam and Western notes, lower octave markings, breath pause marks, and beginner practice tips.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-amber-200/90 pt-2 border-t border-amber-600/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Published: {song.publishedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Updated: {song.updatedDate}</span>
            </div>
          </div>
        </header>

        {/* 3. Introduction */}
        <section aria-label="Introduction" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-base text-gray-700 leading-relaxed font-sans">
            {song.intro}
          </p>
        </section>

        {/* 4. Quick Song Information */}
        <section aria-label="Quick information" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Quick Song Information
          </h2>

          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full text-left text-[11px] sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-200 bg-amber-50/60 text-bamboo-950 font-bold">
                  <th scope="col" className="py-2.5 sm:py-3 px-3 sm:px-4 w-1/3">Detail</th>
                  <th scope="col" className="py-2.5 sm:py-3 px-3 sm:px-4">Information</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-gray-700 font-sans">
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Difficulty</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4">{song.quickInfo.difficulty}</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Suggested flute</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4">{song.quickInfo.suggestedFlute}</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Starting swar</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-mono font-bold text-amber-900">{song.quickInfo.startingSwar}</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Highest swar</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-mono font-bold text-amber-900">{song.quickInfo.highestSwar}</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Main challenge</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4">{song.quickInfo.mainChallenge}</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Practice speed</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4">{song.quickInfo.practiceSpeed}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 italic pt-1">
            Note: Indian music uses movable Sa; this devotional melody can be played on any flute key you own.
          </p>
        </section>

        {/* 5. Notation Reading Guide */}
        <section aria-label="Notation reading guide" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Notation Reading Guide
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-sans">
            Symbols used in this song arrangement:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            {song.legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-amber-200 min-w-14 sm:min-w-16 text-center text-xs sm:text-sm">
                  {item.symbol}
                </span>
                <span className="text-gray-700 text-xs sm:text-sm">{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Clean Sargam Notation (Lyrics + Swar) */}
        <section aria-label="Sargam Flute Notes" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-amber-100 pb-2.5 sm:pb-3">
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-1.5 sm:gap-2">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <span>Achyutam Keshavam Sargam Notes</span>
            </h2>
            <span className="text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Bansuri / Indian Flute
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Each phrase is paired with its lyric syllables. Symbols like <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">.D</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">.N</code> denote lower octave notes, <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">—</code> indicates a sustained note, and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">/</code> marks a breath pause:
          </p>

          <div className="space-y-3 sm:space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-amber-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-amber-200 space-y-2.5 sm:space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-b border-amber-200/60 pb-1.5 sm:pb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                    Phrase {phrase.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-bamboo-950 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-2.5 border border-amber-200/80 shadow-3xs flex flex-col justify-center min-h-[54px] sm:min-h-[58px]">
                      <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium truncate px-0.5">{unit.lyric}</div>
                      <div className="font-mono font-bold text-amber-950 text-xs sm:text-base mt-0.5 tracking-tight break-words">{unit.sargam}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs text-amber-900 bg-amber-100/60 p-2 sm:p-2.5 rounded-lg border border-amber-200/60 font-mono">
                  <span className="text-amber-800 font-sans font-medium shrink-0">Sargam line:</span>
                  <span className="font-extrabold text-xs sm:text-base text-amber-950 tracking-wider break-words">
                    {phrase.sargamNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Western Notes with Sa set to C */}
        <section aria-label="Western Notes" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-amber-100 pb-2.5 sm:pb-3">
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <span>Western Notes (Sa = C)</span>
            </h2>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Key of C Equivalent
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            For Western flute players and recorder learners playing in the key of C, the corresponding note transcriptions are arranged below:
          </p>

          <div className="space-y-3 sm:space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200 space-y-2.5 sm:space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-200/80 pb-1.5 sm:pb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                    Phrase {phrase.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-2.5 border border-slate-200 shadow-3xs flex flex-col justify-center min-h-[54px] sm:min-h-[58px]">
                      <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate px-0.5">{unit.lyric}</div>
                      <div className="font-mono font-bold text-slate-900 text-xs sm:text-base mt-0.5 tracking-tight break-words">{unit.western}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs text-slate-600 bg-white p-2 sm:p-2.5 rounded-lg border border-slate-200 font-mono">
                  <span className="text-slate-500 font-sans font-medium shrink-0">Western line:</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-wider break-words">
                    {phrase.westernNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Phrase-by-Phrase Playing Guidance */}
        <section aria-label="Phrase Guidance" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Phrase-by-Phrase Playing Guidance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {song.phrases.map((item) => (
              <div 
                key={item.phraseNumber}
                className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Phrase {item.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-bamboo-950 italic">
                    "{item.lyric}"
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-sans pt-1 leading-relaxed">
                  {item.guidance}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Step-by-Step Practice Method */}
        <section aria-label="Practice Method" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5 sm:pb-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
              Step-by-Step Practice Method
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {song.practiceMethod.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-50/40 border border-amber-200/60">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-600 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-gray-700 font-sans leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Common Mistakes & Fixes */}
        <section aria-label="Common Mistakes" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5 sm:pb-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950">
              Common Mistakes to Avoid
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {song.commonMistakes.map((mistake, idx) => (
              <div key={idx} className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-50/40 border border-rose-200/60 text-xs sm:text-sm text-gray-700 font-sans flex items-start gap-2 sm:gap-2.5">
                <span className="text-rose-600 font-bold text-base leading-none mt-0.5">•</span>
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 11. Useful Practice Tools */}
        <section aria-label="Useful Practice Tools" className="bg-gradient-to-br from-amber-50/80 to-sand-100/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200/70 shadow-2xs space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-xl font-bold font-display text-bamboo-950">
            Recommended Practice Tools &amp; Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {song.usefulTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.url}
                onClick={(e) => handleLinkClick(e, tool.viewKey)}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-sm transition text-xs sm:text-sm font-semibold text-bamboo-950 group"
              >
                <span>{tool.name}</span>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* 12. About Author */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
};

export default AchyutamKeshavamNotationView;
