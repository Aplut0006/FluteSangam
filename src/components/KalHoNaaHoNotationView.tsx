import React from 'react';
import { 
  Music, 
  Calendar, 
  ChevronRight, 
  Layers, 
  FileText,
  Heart,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Film,
  Mic,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { PUBLISHED_SONG_NOTATIONS } from '../data/songNotationsData';

interface KalHoNaaHoNotationViewProps {
  onViewChange?: (view: AppView) => void;
}

export const KalHoNaaHoNotationView: React.FC<KalHoNaaHoNotationViewProps> = ({ 
  onViewChange 
}) => {
  const song = PUBLISHED_SONG_NOTATIONS.find(s => s.slug === 'kal-ho-naa-ho-flute-notes') || PUBLISHED_SONG_NOTATIONS[0];

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
            Kal Ho Naa Ho Flute Notes
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-2xl sm:rounded-3xl p-4 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-3 sm:space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
              Bollywood Title Track
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              Level: Intermediate
            </span>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            {song.h1}
          </h1>

          <p className="text-amber-100/90 text-xs sm:text-base max-w-2xl font-medium leading-relaxed">
            Learn Kal Ho Naa Ho flute notes with Sargam and Western notation. Play the song melody on flute with clear notes for each section and helpful practice guidance.
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

        {/* 3. Introduction & Context */}
        <section aria-label="Introduction" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <p className="text-xs sm:text-base text-gray-700 leading-relaxed font-sans">
            {song.intro}
          </p>

          {/* Song Attribution & Educational Notice Box */}
          <div className="bg-amber-50/70 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-amber-200 space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Film className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Kal Ho Naa Ho — Flute Notes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="font-semibold text-gray-900">Movie:</span> Kal Ho Naa Ho
              </div>
              <div>
                <span className="font-semibold text-gray-900">Original song:</span> &ldquo;Kal Ho Naa Ho&rdquo;
              </div>
              <div>
                <span className="font-semibold text-gray-900">Singer:</span> Sonu Nigam
              </div>
              <div>
                <span className="font-semibold text-gray-900">Music / Lyrics:</span> Shankar-Ehsaan-Loy / Javed Akhtar
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed pt-1 border-t border-amber-200/70 font-sans">
              This page provides an independently prepared flute notation/transcription for learning and practice.
            </p>
          </div>
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
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Movie</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-medium">Kal Ho Naa Ho</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-bamboo-900">Singer</td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 font-medium">Sonu Nigam</td>
                </tr>
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
            Note: Indian bansuri uses movable Sa; you can practice and perform this melody on any flute scale you have.
          </p>
        </section>

        {/* 5. Notation Reading Guide */}
        <section aria-label="Notation reading guide" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Notation Reading Guide
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-sans">
            Symbols used in this song transcription:
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

        {/* 6. Song Notation: Full Sargam Breakdown */}
        <section aria-label="Kal Ho Naa Ho Flute Sargam Notation" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-amber-100 pb-2.5 sm:pb-3">
            <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-1.5 sm:gap-2">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <span>Kal Ho Naa Ho Flute Sargam Notation</span>
            </h2>
            <span className="text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Full Song (Mukhda &amp; Antara)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Sing along with the words while feeling the rhythm and timing. Each lyric syllable is placed directly on top of its corresponding bansuri swar:
          </p>

          <div className="space-y-3 sm:space-y-6">
            {song.phrases.map((phrase) => (
              <React.Fragment key={phrase.phraseNumber}>
                {/* Repeat indicator between Mukhda and Antara */}
                {phrase.phraseNumber === 5 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-center text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>(First 4 lines will repeat again) &bull; Then continue to Antara below:</span>
                  </div>
                )}

                <div className="bg-amber-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-amber-200/90 space-y-2.5 sm:space-y-4">
                  {/* Phrase Header */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-b border-amber-200/60 pb-1.5 sm:pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        Line {phrase.phraseNumber}
                      </span>
                      {phrase.phraseNumber <= 4 ? (
                        <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Mukhda
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                          Antara
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-base font-bold text-bamboo-950 italic">
                      &ldquo;{phrase.lyric}&rdquo;
                    </span>
                  </div>

                  {/* Syllable-by-Note Alignment Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2.5">
                    {phrase.units.map((unit, uIdx) => (
                      <div 
                        key={uIdx} 
                        className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-amber-200/80 text-center space-y-1 sm:space-y-1.5 shadow-2xs hover:border-amber-400 transition flex flex-col justify-center min-h-[56px] sm:min-h-[64px]"
                      >
                        <div className="text-[10px] sm:text-xs font-bold text-amber-900/90 bg-amber-50/90 py-0.5 sm:py-1 px-1 sm:px-1.5 rounded-md border border-amber-100 truncate">
                          {unit.lyric}
                        </div>
                        <div className="font-mono font-black text-sm sm:text-xl text-bamboo-950 tracking-tight sm:tracking-wider break-words">
                          {unit.sargam}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continuous Sargam Sequence Bar */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs text-gray-600 bg-white/70 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-amber-200/60 font-mono">
                    <span className="text-gray-500 font-sans font-semibold shrink-0">Sargam notation:</span>
                    <span className="font-extrabold text-xs sm:text-base text-amber-950 tracking-wider break-words">
                      {phrase.sargamNotes}
                    </span>
                  </div>

                  {/* Phrase Tip */}
                  <p className="text-[11px] sm:text-xs text-gray-600 italic bg-amber-50/90 p-2 rounded-lg border border-amber-200/50">
                    <strong className="text-amber-900 not-italic font-semibold">Tip:</strong> {phrase.guidance}
                  </p>
                </div>
              </React.Fragment>
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
            For Western concert flute, keyboard, and recorder learners playing in the key of C:
          </p>

          <div className="space-y-3 sm:space-y-6">
            {song.phrases.map((phrase) => (
              <React.Fragment key={phrase.phraseNumber}>
                {/* Repeat indicator between Mukhda and Antara */}
                {phrase.phraseNumber === 5 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-slate-200/80 border border-slate-300 text-center text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>(First 4 lines will repeat again) &bull; Then continue to Antara below:</span>
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-200 space-y-2.5 sm:space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-200/80 pb-1.5 sm:pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                        Line {phrase.phraseNumber}
                      </span>
                      {phrase.phraseNumber <= 4 ? (
                        <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Mukhda
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                          Antara
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-base font-bold text-slate-900 italic">
                      &ldquo;{phrase.lyric}&rdquo;
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2.5">
                    {phrase.units.map((unit, uIdx) => (
                      <div 
                        key={uIdx} 
                        className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-200 text-center space-y-1 sm:space-y-1.5 shadow-2xs flex flex-col justify-center min-h-[56px] sm:min-h-[64px]"
                      >
                        <div className="text-[10px] sm:text-xs font-bold text-slate-600 bg-slate-100 py-0.5 sm:py-1 px-1 sm:px-1.5 rounded-md truncate">
                          {unit.lyric}
                        </div>
                        <div className="font-mono font-black text-sm sm:text-xl text-slate-900 tracking-tight sm:tracking-wider break-words">
                          {unit.western}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs text-slate-600 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 font-mono">
                    <span className="text-slate-500 font-sans font-semibold shrink-0">Western line:</span>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-wider break-words">
                      {phrase.westernNotes}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 8. Practice Method & Advice */}
        <section aria-label="Practice method" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Step-by-Step Practice Routine
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
            {song.practiceMethod.map((item, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Common Mistakes to Avoid */}
        <section aria-label="Common mistakes" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Common Mistakes &amp; How to Fix Them
          </h2>

          <div className="space-y-2.5 sm:space-y-3 pt-1">
            {song.commonMistakes.map((mistake, idx) => (
              <div key={idx} className="p-3 sm:p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                  {mistake}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Useful Flute Tools & Learning Resources */}
        <section aria-label="Useful tools" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Helpful Tools &amp; Related Guides
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {song.usefulTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.url}
                onClick={(e) => handleLinkClick(e, tool.viewKey)}
                className="p-3.5 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-200/70 hover:border-amber-400 hover:bg-amber-100/60 transition group flex flex-col justify-between space-y-2"
              >
                <span className="font-bold text-xs sm:text-sm text-bamboo-950 group-hover:text-amber-800 transition">
                  {tool.name}
                </span>
                <span className="text-[11px] sm:text-xs text-amber-700 font-semibold flex items-center gap-1">
                  Open Guide <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. Copyright Notice & Attribution */}
        <section aria-label="Copyright notice" className="bg-sand-100/70 rounded-2xl p-4 sm:p-6 border border-amber-200/80 space-y-2 text-xs text-gray-600 font-sans leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Educational Transcription &amp; Copyright Notice</span>
          </div>
          <p>
            &ldquo;Kal Ho Naa Ho&rdquo; is a copyrighted song. This page provides independently prepared flute notation for learning and practice. All rights to the original song, composition, lyrics, recording and film belong to their respective copyright owners.
          </p>
        </section>

        {/* 11. Author Section */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
};

export default KalHoNaaHoNotationView;
