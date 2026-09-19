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
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { PUBLISHED_SONG_NOTATIONS } from '../data/songNotationsData';

interface JingleBellsNotationViewProps {
  onViewChange?: (view: AppView) => void;
}

export const JingleBellsNotationView: React.FC<JingleBellsNotationViewProps> = ({ 
  onViewChange 
}) => {
  const song = PUBLISHED_SONG_NOTATIONS.find(s => s.slug === 'jingle-bells-flute-notes') || PUBLISHED_SONG_NOTATIONS[0];

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

        {/* 1. Breadcrumb */}
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
            Jingle Bells Flute Notes
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              Song Notation Lesson
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Level: Beginner
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            {song.h1}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-2 border-t border-amber-600/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Published: Sep 19, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Updated: Sep 19, 2026</span>
            </div>
          </div>
        </header>

        {/* 3. Introduction & Overview */}
        <section aria-label="Lesson Overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Song Overview
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            {song.intro}
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Below you will find both the famous <strong>Chorus ("Jingle bells, jingle bells...")</strong> and the full <strong>Verse ("Dashing through the snow...")</strong>. Every syllable is mapped directly above its corresponding Sargam note with breath marks (<code className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">/</code>) and held-note dashes (<code className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">—</code>).
          </p>
        </section>

        {/* 4. Quick Information Table */}
        <section aria-label="Quick Information" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-600" />
            Quick Information
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-200 bg-amber-50/60 text-bamboo-950 font-bold">
                  <th scope="col" className="py-3 px-4 w-1/3">Detail</th>
                  <th scope="col" className="py-3 px-4">Information</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-gray-700 font-sans">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Difficulty</td>
                  <td className="py-2.5 px-4">{song.quickInfo.difficulty}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Suggested flute</td>
                  <td className="py-2.5 px-4">{song.quickInfo.suggestedFlute}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Starting swar</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">{song.quickInfo.startingSwar}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Highest swar</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">{song.quickInfo.highestSwar}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Main challenge</td>
                  <td className="py-2.5 px-4">{song.quickInfo.mainChallenge}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Practice speed</td>
                  <td className="py-2.5 px-4">{song.quickInfo.practiceSpeed}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 italic pt-1">
            Note: Indian music uses movable Sa; this melody can be played on any flute key you own.
          </p>
        </section>

        {/* 5. Notation Legend */}
        <section aria-label="Notation legend" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Notation Legend
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Symbols used in this song arrangement:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {song.legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="font-mono font-bold text-amber-900 bg-white px-2.5 py-1 rounded-md border border-amber-200 min-w-16 text-center">
                  {item.symbol}
                </span>
                <span className="text-gray-700">{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Song Notation (Sargam Notes & Lyrics) */}
        <section aria-label="Song notation" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-600" />
              Song Notation
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                Sargam Notes &amp; Lyrics
              </span>
              <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
                Movable Sa
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Sing along or speak the syllables as you play each phrase. Each word or syllable is paired directly with its corresponding flute swar below.
          </p>

          <div className="space-y-6">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-amber-50/50 rounded-2xl p-4 sm:p-6 border border-amber-200/90 space-y-4"
              >
                {/* Phrase Title & Lyric Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-md">
                    {phrase.phraseNumber <= 4 ? `Chorus – Phrase ${phrase.phraseNumber}` : `Verse – Phrase ${phrase.phraseNumber}`}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-bamboo-950 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                {/* Syllable-by-Note Visual Alignment Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {phrase.units.map((unit, uIdx) => (
                    <div 
                      key={uIdx} 
                      className="bg-white rounded-xl p-3.5 border border-amber-200/80 text-center space-y-2 shadow-2xs hover:border-amber-400 transition"
                    >
                      <div className="text-xs font-bold text-amber-900/90 bg-amber-50/90 py-1 px-2 rounded-md border border-amber-100">
                        {unit.lyric}
                      </div>
                      <div className="font-mono font-black text-xl sm:text-2xl text-bamboo-950 tracking-wider">
                        {unit.sargam}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continuous Notation Sequence Bar */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-gray-600 bg-white/70 p-2.5 rounded-xl border border-amber-200/60 font-mono">
                  <span className="text-gray-500 font-sans font-semibold">Notation line:</span>
                  <span className="font-extrabold text-sm sm:text-base text-amber-950 tracking-wider">
                    {phrase.sargamNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Western Notes with Sa set to C */}
        <section aria-label="Western notes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Western Notes (Sa = C)
            </h2>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
              Western Pitch Equivalents
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            For musicians accustomed to Western pitch letters, the notes corresponding to each lyric phrase (when Sa is tuned to C) are shown below:
          </p>

          <div className="space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                    {phrase.phraseNumber <= 4 ? `Chorus – Phrase ${phrase.phraseNumber}` : `Verse – Phrase ${phrase.phraseNumber}`}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-lg p-2 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">{unit.lyric}</div>
                      <div className="font-mono font-bold text-slate-900 text-sm sm:text-base mt-0.5">{unit.western}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 font-mono">
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
        <section aria-label="Phrase-by-phrase playing guidance" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            Phrase-by-Phrase Playing Guidance
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {song.phrases.map((item) => (
              <div 
                key={item.phraseNumber}
                className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-amber-950">
                    Phrase {item.phraseNumber}:
                  </h3>
                  <span className="text-xs font-medium text-amber-800 italic">
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

        {/* 9. Beginner Practice Method */}
        <section aria-label="Beginner practice method" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            Beginner Practice Method
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
        <section aria-label="Common mistakes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
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

        {/* 11. Useful FluteSangam Tools */}
        <section aria-label="Useful FluteSangam tools" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-600" />
            Useful FluteSangam Tools &amp; Lessons
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <span>Educational Notice</span>
            </div>
            <p>
              This song notation is prepared for educational and music-learning purposes. FluteSangam does not claim ownership of the underlying traditional melody.
            </p>
          </div>

          <AboutAuthorSection onViewChange={onViewChange} />
        </section>

      </div>
    </div>
  );
};
export default JingleBellsNotationView;
