import React from 'react';
import { 
  Music, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  Lightbulb, 
  Layers, 
  Sparkles,
  Flag,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { PUBLISHED_SONG_NOTATIONS } from '../data/songNotationsData';

interface JanaGanaManaNotationViewProps {
  onViewChange?: (view: AppView) => void;
}

export const JanaGanaManaNotationView: React.FC<JanaGanaManaNotationViewProps> = ({ 
  onViewChange 
}) => {
  const song = PUBLISHED_SONG_NOTATIONS.find(s => s.slug === 'jana-gana-mana-flute-notes') || PUBLISHED_SONG_NOTATIONS[6];

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
          <span className="text-amber-900 font-bold truncate">Jana Gana Mana Flute Notes</span>
        </nav>

        {/* 2. Header & Hero Section */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-100/50 via-emerald-50/30 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
                <Flag className="w-3.5 h-3.5 text-amber-700" />
                National Anthem of India
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {song.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-bamboo-100 text-bamboo-800 border border-bamboo-200">
                <Music className="w-3 h-3 text-bamboo-700" />
                Sargam &amp; Western
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950 tracking-tight leading-tight">
              {song.h1}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {song.intro}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 border-t border-amber-100/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                Published: {song.publishedDate}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Updated: {song.updatedDate}
              </span>
            </div>
          </div>
        </header>

        {/* 3. Quick Song & Practice Information Grid */}
        <section className="bg-gradient-to-br from-amber-50/80 to-sand-100/60 rounded-3xl p-6 sm:p-8 border border-amber-200/70 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-950">
                Quick Song Information &amp; Flute Specifications
              </h2>
              <p className="text-xs text-slate-600">Essential guidance for playing the National Anthem with precision and dignity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-1">
              <span className="text-xs font-semibold text-slate-600 block">Difficulty Level</span>
              <span className="text-base font-bold text-amber-900">{song.quickInfo.difficulty}</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-1">
              <span className="text-xs font-semibold text-slate-600 block">Melody Type</span>
              <span className="text-base font-bold text-amber-900">{song.quickInfo.melodyType}</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-1">
              <span className="text-xs font-semibold text-slate-600 block">Suggested Bansuri / Flute</span>
              <span className="text-base font-bold text-amber-900">{song.quickInfo.suggestedFlute}</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-1">
              <span className="text-xs font-semibold text-slate-600 block">Starting Note / Swara</span>
              <span className="text-base font-bold text-amber-900">{song.quickInfo.startingSwar}</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-1">
              <span className="text-xs font-semibold text-slate-600 block">Highest Note / Swara</span>
              <span className="text-base font-bold text-amber-900">{song.quickInfo.highestSwar}</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-1">
              <span className="text-xs font-semibold text-slate-600 block">Recommended Practice Speed</span>
              <span className="text-base font-bold text-amber-900">{song.quickInfo.practiceSpeed}</span>
            </div>
          </div>

          <div className="bg-amber-100/60 p-4 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
            <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Main Practice Challenge:</span> {song.quickInfo.mainChallenge}
            </div>
          </div>
        </section>

        {/* 4. Notation Symbols Legend */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg sm:text-xl font-bold text-amber-950">
              Notation Symbols &amp; Reading Guide
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Understand how note octaves, rests, holding dashes, and breath pauses are represented:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {song.legend.map((item, idx) => (
              <div key={idx} className="bg-sand-50/80 border border-amber-200/60 p-2.5 rounded-xl text-center">
                <span className="font-mono font-bold text-amber-900 text-sm block">{item.symbol}</span>
                <span className="text-[11px] text-slate-600 font-medium">{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Separate Section A: Complete Sargam Flute Notation */}
        <section aria-label="Sargam Flute Notes" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-700" />
              Jana Gana Mana Sargam Notes
            </h2>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Bansuri / Indian Flute
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Each phrase is detailed below with musical units. Lower dot (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">.N</code>) represents Mandra Saptak (lower octave Ni), and apostrophes (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">S'</code>) represent Tara Saptak (higher octave Sa):
          </p>

          <div className="space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
                    Line {phrase.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-amber-950 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-xl p-2.5 border border-amber-200/80 shadow-3xs">
                      <div className="text-[11px] text-slate-500 font-medium truncate">{unit.lyric}</div>
                      <div className="font-mono font-bold text-amber-950 text-sm sm:text-base mt-0.5">{unit.sargam}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200/60 font-mono">
                  <span className="text-amber-800 font-sans font-medium">Sargam line:</span>
                  <span className="font-extrabold text-sm sm:text-base text-amber-950 tracking-wider">
                    {phrase.sargamNotes}
                  </span>
                </div>

                {phrase.guidance && (
                  <p className="text-xs text-slate-600 italic bg-white/70 p-2.5 rounded-xl border border-amber-100">
                    <span className="font-bold not-italic text-amber-900 mr-1">Playing tip:</span>
                    {phrase.guidance}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Continuous Sargam Sheet */}
          <div className="pt-3 space-y-3 border-t border-amber-100">
            <h3 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700" />
              Continuous Sargam Sheet for Quick Practice
            </h3>
            <div className="bg-slate-900 text-amber-200 p-5 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto border border-amber-950/40">
              <p className="text-slate-400 mb-2">// Jana Gana Mana - Indian National Anthem - Sargam Notes</p>
              {song.sargamPhrases.map((sp) => (
                <div key={sp.phraseNumber} className="py-1">
                  <span className="text-amber-400 font-bold">{sp.notes}</span>
                  {sp.lyric && <span className="text-slate-400 ml-3 text-xs">// {sp.lyric}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Separate Section B: Western Notes */}
        <section aria-label="Western Notes" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-700" />
              Western Notes (Relative Key / Sa = C Pitch)
            </h2>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Western Flute &amp; Keyboard (C Root)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For Western concert flute players, keyboardists, and recorder learners, the melody is transcribed relative to key of C (where Sa = C, Re = D, Ga = E, Ma = F, Pa = G, Dha = A, Ni = B):
          </p>

          <div className="space-y-4">
            {song.phrases.map((phrase) => (
              <div 
                key={phrase.phraseNumber}
                className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-md">
                    Line {phrase.phraseNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 italic">
                    "{phrase.lyric}"
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-center text-xs">
                  {phrase.units.map((unit, uIdx) => (
                    <div key={uIdx} className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-3xs">
                      <div className="text-[11px] text-slate-500 font-medium truncate">{unit.lyric}</div>
                      <div className="font-mono font-bold text-slate-900 text-sm sm:text-base mt-0.5">{unit.western}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                  <span className="text-slate-500 font-sans font-medium">Western line:</span>
                  <span className="font-bold text-slate-900 tracking-wider">
                    {phrase.westernNotes}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Continuous Western Sheet */}
          <div className="pt-3 space-y-3 border-t border-slate-200">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              Continuous Western Notes Sheet
            </h3>
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto border border-slate-800">
              <p className="text-slate-400 mb-2">// Jana Gana Mana - Indian National Anthem - Western Notation</p>
              {song.westernPhrases.map((wp) => (
                <div key={wp.phraseNumber} className="py-1">
                  <span className="text-emerald-400 font-bold">{wp.notes}</span>
                  {wp.lyric && <span className="text-slate-400 ml-3 text-xs">// {wp.lyric}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Step-by-Step Practice Method */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-amber-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
              Structured Practice Method for Jana Gana Mana
            </h2>
          </div>

          <div className="space-y-3">
            {song.practiceMethod.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Common Mistakes & Fixes */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-amber-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
              Common Mistakes to Avoid
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {song.commonMistakes.map((mistake, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-base leading-none mt-0.5">•</span>
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Related Flute Tools & Learning Resources */}
        <section className="bg-gradient-to-br from-amber-50/80 to-sand-100/60 rounded-3xl p-6 sm:p-8 border border-amber-200/70 shadow-2xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-amber-950">
            Recommended Practice Tools &amp; Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {song.usefulTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.url}
                onClick={(e) => handleLinkClick(e, tool.viewKey)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-sm transition text-xs sm:text-sm font-semibold text-amber-950 group"
              >
                <span>{tool.name}</span>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* 10. About Author Section */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
};

export default JanaGanaManaNotationView;
