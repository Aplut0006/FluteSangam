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
  Play,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { PUBLISHED_SONG_NOTATIONS } from '../data/songNotationsData';

interface TitanicNotationViewProps {
  onViewChange?: (view: AppView) => void;
}

export const TitanicNotationView: React.FC<TitanicNotationViewProps> = ({ 
  onViewChange 
}) => {
  const song = PUBLISHED_SONG_NOTATIONS.find(s => s.slug === 'my-heart-will-go-on-flute-notes') || PUBLISHED_SONG_NOTATIONS[2];

  const handleLinkClick = (e: React.MouseEvent, viewKey: string) => {
    if (e.ctrlKey || e.metaKey) return;
    if (onViewChange) {
      e.preventDefault();
      onViewChange(viewKey as AppView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const introPhrases = song.phrases.filter(p => p.phraseNumber <= 2);
  const versePhrases = song.phrases.filter(p => p.phraseNumber > 2);

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
            Titanic (My Heart Will Go On)
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              Iconic Movie Theme
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Level: Beginner Friendly
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            {song.h1}
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base max-w-2xl font-medium">
            Learn the famous tin whistle and flute theme with lyric-aligned Sargam and Western notes, opening tune breakdowns, and beginner practice tips.
          </p>

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
            This lesson is divided into the <strong>Opening Flute Tune</strong> and the <strong>Opening verse practice arrangement ("Every night in my dreams...")</strong>. Each syllable is matched directly above its flute note with clear octave signs (<code className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">.P, .D, .N</code> for lower octave), breath pauses (<code className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">/</code>) and sustained beats (<code className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">—</code>).
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
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Melody Type</td>
                  <td className="py-2.5 px-4">{song.quickInfo.melodyType}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Suggested Flute</td>
                  <td className="py-2.5 px-4">{song.quickInfo.suggestedFlute}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Starting Swar</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">{song.quickInfo.startingSwar}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Highest Swar</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">{song.quickInfo.highestSwar}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Main Challenge</td>
                  <td className="py-2.5 px-4">{song.quickInfo.mainChallenge}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-bamboo-900">Practice Speed</td>
                  <td className="py-2.5 px-4">{song.quickInfo.practiceSpeed}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 italic pt-1">
            Note: Indian music uses movable Sa. You can play this piece on any flute or bansuri (C Medium, E Bass, G Medium, etc.) by treating all 3 upper holes covered as Sa.
          </p>
        </section>

        {/* 5. Notation Legend */}
        <section aria-label="Notation Legend" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Notation Legend
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Symbols used in this arrangement:
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

        {/* 6. Opening Flute Instrumental Tune */}
        <section aria-label="Opening Instrumental Tune" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-600" />
              Opening Flute Tune (Instrumental Intro)
            </h2>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Iconic Whistle &amp; Flute Motif
            </span>
          </div>

          <div className="bg-amber-100/50 p-4 rounded-2xl border border-amber-300/60 text-xs sm:text-sm text-amber-950 leading-relaxed font-sans space-y-2">
            <p className="font-semibold text-amber-900">
              🎵 Quick Summary of Opening Tune:
            </p>
            <div className="font-mono font-black text-sm sm:text-base text-bamboo-950 space-y-1">
              <div>Line 1: S R R G — | M G R S | R P —</div>
              <div>Line 2: G P D — — | P — — | R — —</div>
            </div>
          </div>

          <div className="space-y-6">
            {introPhrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-amber-50/50 rounded-2xl p-4 sm:p-6 border border-amber-200/90 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-md">
                    {phrase.lyric}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-amber-900 italic">
                    {phrase.guidance}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {phrase.units.map((unit, uIdx) => (
                    <div 
                      key={uIdx} 
                      className="bg-white rounded-xl p-3.5 border border-amber-200/80 text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition"
                    >
                      <div className="text-xs font-bold text-amber-900/90 bg-amber-50/90 py-1 px-2 rounded-md border border-amber-100">
                        {unit.lyric}
                      </div>
                      <div className="font-mono font-black text-xl sm:text-2xl text-bamboo-950 tracking-wider">
                        {unit.sargam}
                      </div>
                      <div className="font-mono text-xs font-semibold text-slate-500">
                        Western: {unit.western}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-gray-600 bg-white/70 p-2.5 rounded-xl border border-amber-200/60 font-mono">
                  <span className="text-gray-500 font-sans font-semibold">Sargam line:</span>
                  <span className="font-extrabold text-sm sm:text-base text-amber-950 tracking-wider">
                    {phrase.sargamNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Song Notation (Sargam Notes & Lyrics for Verse) */}
        <section aria-label="Song Notation and Lyrics" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-600" />
              Song Notation (Sargam &amp; Lyrics)
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                Verse Syllable-by-Note
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Sing along with the words while feeling the breath timing. Each lyric syllable is placed directly on top of its corresponding flute note.
          </p>

          <div className="space-y-6">
            {versePhrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-amber-50/50 rounded-2xl p-4 sm:p-6 border border-amber-200/90 space-y-4"
              >
                {/* Phrase Header & Lyric Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-md">
                    Verse – Phrase {phrase.phraseNumber - 2}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-bamboo-950 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                {/* Syllable-by-Note Alignment Grid */}
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

        {/* 8. Western Notes with Sa set to C */}
        <section aria-label="Western Notes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Western Notes (Sa = C)
            </h2>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
              Standard Pitch Equivalent
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            For flutists and whistle players accustomed to Western letter notation (with Sa tuned to C), the corresponding pitch notes are mapped below:
          </p>

          <div className="space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                    {phrase.phraseNumber <= 2 ? `Intro – ${phrase.lyric}` : `Verse – Phrase ${phrase.phraseNumber - 2}`}
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

        {/* 9. Phrase-by-Phrase Playing Guidance */}
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
                    {item.phraseNumber <= 2 ? `Intro ${item.phraseNumber}` : `Verse ${item.phraseNumber - 2}`}:
                  </h3>
                  <span className="text-xs font-medium text-amber-800 italic truncate max-w-[180px]">
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

        {/* 10. Practice Method */}
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

        {/* 11. Common Mistakes */}
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

        {/* 12. Useful FluteSangam Tools & Other Notations */}
        <section aria-label="Useful Tools and Other Notations" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-600" />
            Useful FluteSangam Tools &amp; Related Songs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* 13. Authorship & Educational Notice */}
        <section aria-label="Authorship and Educational Notice" className="space-y-4">
          <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200/80 text-xs sm:text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Educational Notice</span>
            </div>
            <p>
              This song notation is compiled for educational and bansuri learning purposes. FluteSangam does not claim copyright on the original composition by James Horner &amp; Will Jennings.
            </p>
          </div>

          <AboutAuthorSection onViewChange={onViewChange} />
        </section>

      </div>
    </div>
  );
};

export default TitanicNotationView;
