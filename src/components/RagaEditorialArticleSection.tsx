import React from 'react';
import {
  BookOpen,
  History,
  GitCompare,
  Disc3,
  Music,
  Compass,
  Award,
  ArrowRight,
  Feather,
  Flame,
} from 'lucide-react';
import { AppView } from '../types';
import { RagaEditorialEntry, RagaSlug } from '../data/ragaEditorialTypes';
import { RAGA_EDITORIAL_PART_1 } from '../data/ragaEditorialPart1';
import { RAGA_EDITORIAL_PART_2 } from '../data/ragaEditorialPart2';
import { RAGA_EDITORIAL_PART_3 } from '../data/ragaEditorialPart3';

export const RAGA_EDITORIAL_DATA: Record<RagaSlug, RagaEditorialEntry> = {
  ...RAGA_EDITORIAL_PART_1,
  ...RAGA_EDITORIAL_PART_2,
  ...RAGA_EDITORIAL_PART_3,
} as Record<RagaSlug, RagaEditorialEntry>;

interface RagaEditorialArticleSectionProps {
  ragaSlug: RagaSlug;
  part: 'origins-and-rasa' | 'comparisons-and-repertoire';
  onViewChange?: (view: AppView) => void;
}

const THEME_CLASSES = {
  amber: {
    border: 'border-amber-200/80',
    badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300/70',
    headingIcon: 'text-amber-700',
    calloutBg: 'bg-gradient-to-br from-amber-50/90 to-orange-50/60 border-amber-300/80 text-amber-950',
    quoteBorder: 'border-l-4 border-amber-600 bg-amber-50/50',
    cardBg: 'bg-amber-50/35 border-amber-200/70',
    linkText: 'text-amber-800 hover:text-amber-950',
  },
  emerald: {
    border: 'border-emerald-200/80',
    badgeBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/70',
    headingIcon: 'text-emerald-700',
    calloutBg: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border-emerald-300/80 text-emerald-950',
    quoteBorder: 'border-l-4 border-emerald-600 bg-emerald-50/50',
    cardBg: 'bg-emerald-50/35 border-emerald-200/70',
    linkText: 'text-emerald-800 hover:text-emerald-950',
  },
  indigo: {
    border: 'border-indigo-200/80',
    badgeBg: 'bg-indigo-100/90 text-indigo-900 border-indigo-300/70',
    headingIcon: 'text-indigo-700',
    calloutBg: 'bg-gradient-to-br from-indigo-50/90 to-slate-50/70 border-indigo-300/80 text-indigo-950',
    quoteBorder: 'border-l-4 border-indigo-600 bg-indigo-50/50',
    cardBg: 'bg-indigo-50/35 border-indigo-200/70',
    linkText: 'text-indigo-800 hover:text-indigo-950',
  },
  rose: {
    border: 'border-rose-200/80',
    badgeBg: 'bg-rose-100/90 text-rose-900 border-rose-300/70',
    headingIcon: 'text-rose-700',
    calloutBg: 'bg-gradient-to-br from-rose-50/90 to-amber-50/50 border-rose-300/80 text-rose-950',
    quoteBorder: 'border-l-4 border-rose-600 bg-rose-50/50',
    cardBg: 'bg-rose-50/35 border-rose-200/70',
    linkText: 'text-rose-800 hover:text-rose-950',
  },
  stone: {
    border: 'border-stone-200/80',
    badgeBg: 'bg-stone-100 text-stone-900 border-stone-300',
    headingIcon: 'text-stone-700',
    calloutBg: 'bg-stone-50 border-stone-300 text-stone-900',
    quoteBorder: 'border-l-4 border-stone-600 bg-stone-50/60',
    cardBg: 'bg-stone-50/50 border-stone-200',
    linkText: 'text-stone-800 hover:text-stone-950',
  },
  sky: {
    border: 'border-sky-200/80',
    badgeBg: 'bg-sky-100/90 text-sky-900 border-sky-300/70',
    headingIcon: 'text-sky-700',
    calloutBg: 'bg-gradient-to-br from-sky-50/90 to-indigo-50/50 border-sky-300/80 text-sky-950',
    quoteBorder: 'border-l-4 border-sky-600 bg-sky-50/50',
    cardBg: 'bg-sky-50/35 border-sky-200/70',
    linkText: 'text-sky-800 hover:text-sky-950',
  },
};

export const RagaEditorialArticleSection: React.FC<RagaEditorialArticleSectionProps> = ({
  ragaSlug,
  part,
  onViewChange,
}) => {
  const entry = RAGA_EDITORIAL_DATA[ragaSlug];
  if (!entry) return null;

  const theme = THEME_CLASSES[entry.accentTheme] || THEME_CLASSES.amber;

  if (part === 'origins-and-rasa') {
    // Vary the semantic DOM layout based on layoutVariant so pages do not share an identical skeleton
    if (entry.layoutVariant === 'treatise-monograph' || entry.layoutVariant === 'comparative-symposium') {
      return (
        <article
          className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border ${theme.border} space-y-8`}
          aria-label={`Musicological History and Rasa Analysis of ${entry.ragaName}`}
        >
          {/* Historical Origins & Treatise Lineage */}
          <section className="space-y-4">
            <div className="space-y-1.5 border-b border-gray-100 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${theme.badgeBg}`}>
                  <History className="w-3.5 h-3.5" />
                  Musicological Monograph &amp; Lineage
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 leading-snug pt-1">
                {entry.originsHeading}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {entry.originsSubtitle}
              </p>
            </div>

            <div className="prose prose-bamboo max-w-none text-gray-700 text-xs sm:text-base leading-relaxed space-y-4 font-sans">
              {entry.originsParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <aside className={`p-4 sm:p-5 rounded-2xl border ${theme.calloutBg} space-y-1.5`}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className={`w-4 h-4 ${theme.headingIcon} shrink-0`} />
                  <span>{entry.treatiseCallout.title}</span>
                </h3>
                <span className="text-[11px] font-semibold opacity-80 italic">
                  Ref: {entry.treatiseCallout.citation}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {entry.treatiseCallout.insight}
              </p>
            </aside>
          </section>

          {/* Emotional Rasa, Samay & Acoustic Psychology */}
          <section className="space-y-4 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2 leading-snug">
                <span>{entry.rasaHeading}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {entry.rasaSubtitle}
              </p>
            </div>

            <div className="prose prose-bamboo max-w-none text-gray-700 text-xs sm:text-base leading-relaxed space-y-4 font-sans">
              {entry.rasaParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <blockquote className={`p-3.5 sm:p-4 rounded-xl ${theme.quoteBorder} text-xs sm:text-sm text-bamboo-950 font-medium leading-relaxed`}>
              <strong className="font-bold block mb-0.5 text-bamboo-900">
                Bansuri Acoustic &amp; Intonation Insight:
              </strong>
              {entry.acousticTakeaway}
            </blockquote>
          </section>
        </article>
      );
    }

    // Layout Variant: 'concert-chronicle' or 'sadhana-essays'
    return (
      <div className="space-y-6">
        <article className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border ${theme.border} space-y-5`}>
          <header className="space-y-1.5 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-bamboo-800">
              <Feather className={`w-4 h-4 ${theme.headingIcon}`} />
              <span>Historical Evolution &amp; Bansuri Heritage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 leading-snug">
              {entry.originsHeading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {entry.originsSubtitle}
            </p>
          </header>

          <div className="text-gray-700 text-xs sm:text-base leading-relaxed space-y-4 font-sans">
            {entry.originsParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className={`p-4 sm:p-5 rounded-2xl border ${theme.calloutBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75 block">
                {entry.treatiseCallout.citation}
              </span>
              <h3 className="text-sm font-bold">{entry.treatiseCallout.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                {entry.treatiseCallout.insight}
              </p>
            </div>
          </div>
        </article>

        <article className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border ${theme.border} space-y-4`}>
          <header className="space-y-1 border-b border-gray-100 pb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-bamboo-800">
              <Flame className={`w-4 h-4 ${theme.headingIcon}`} />
              <span>Aesthetic Mood (Rasa), Samay &amp; Flute Acoustics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 leading-snug">
              {entry.rasaHeading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {entry.rasaSubtitle}
            </p>
          </header>

          <div className="text-gray-700 text-xs sm:text-base leading-relaxed space-y-4 font-sans">
            {entry.rasaParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className={`p-4 rounded-xl ${theme.quoteBorder} text-xs sm:text-sm text-bamboo-950 leading-relaxed`}>
            <span className="font-bold text-bamboo-900">Flute Embouchure &amp; Shruti Note: </span>
            {entry.acousticTakeaway}
          </div>
        </article>
      </div>
    );
  }

  // part === 'comparisons-and-repertoire'
  return (
    <div className="space-y-6">
      {/* Samprakritic / Allied Ragas Comparative Analysis */}
      <article
        className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border ${theme.border} space-y-5`}
        aria-label={`Comparative Analysis of ${entry.ragaName} with Samprakritic Ragas`}
      >
        <header className="space-y-1.5 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${theme.badgeBg}`}>
              <GitCompare className="w-3.5 h-3.5" />
              Samprakritic &amp; Allied Raga Study
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 leading-snug pt-1">
            {entry.samprakriticHeading}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {entry.samprakriticSubtitle}
          </p>
        </header>

        <div className="text-gray-700 text-xs sm:text-base leading-relaxed space-y-3.5 font-sans">
          {entry.samprakriticIntroParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <div className="space-y-4 pt-2">
          {entry.samprakriticComparisons.map((comp, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 sm:p-5 ${theme.cardBg} space-y-2.5`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-2">
                <h3 className="text-sm sm:text-base font-bold text-bamboo-950 flex items-center gap-2">
                  <Compass className={`w-4 h-4 ${theme.headingIcon} shrink-0`} />
                  <span>{entry.ragaName} vs. {comp.alliedRagaName}</span>
                </h3>
                {comp.alliedRagaView && onViewChange && (
                  <button
                    type="button"
                    onClick={() => onViewChange(comp.alliedRagaView!)}
                    className={`text-xs font-bold ${theme.linkText} flex items-center gap-1 cursor-pointer transition`}
                  >
                    <span>Explore {comp.alliedRagaName} Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm leading-relaxed">
                <div className="bg-white/80 p-3 rounded-xl border border-gray-200/60">
                  <dt className="font-bold text-gray-900 text-[11px] uppercase tracking-wider mb-1">
                    Shared Musical DNA
                  </dt>
                  <dd className="text-gray-700">{comp.sharedElements}</dd>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-gray-200/60">
                  <dt className="font-bold text-gray-900 text-[11px] uppercase tracking-wider mb-1">
                    Critical Structural Distinction
                  </dt>
                  <dd className="text-gray-700">{comp.criticalDistinction}</dd>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-gray-200/60">
                  <dt className="font-bold text-bamboo-900 text-[11px] uppercase tracking-wider mb-1">
                    How to Differentiate on Bansuri
                  </dt>
                  <dd className="text-gray-700">{comp.bansuriNuance}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </article>

      {/* Iconic Classical Bandishes, Instrumental Recordings & Film Melodies + Concert Progression */}
      <article
        className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border ${theme.border} space-y-6`}
        aria-label={`Famous Classical and Film Compositions in ${entry.ragaName}`}
      >
        <section className="space-y-4">
          <header className="space-y-1.5 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${theme.badgeBg}`}>
                <Disc3 className="w-3.5 h-3.5" />
                Classical Bandishes &amp; Cinematic Repertoire
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 leading-snug pt-1">
              {entry.repertoireHeading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {entry.repertoireSubtitle}
            </p>
          </header>

          <div className="text-gray-700 text-xs sm:text-base leading-relaxed space-y-3.5 font-sans">
            {entry.repertoireParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {entry.notableWorks.map((work, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${theme.cardBg} space-y-1.5`}
              >
                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                  <Music className="w-3 h-3" />
                  {work.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-bamboo-950 pt-0.5">
                  {work.title}
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {work.contextAndAnalysis}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Concert Gayaki / Tantrakari Progression */}
        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Award className={`w-5 h-5 ${theme.headingIcon} shrink-0`} />
            <span>{entry.concertProgressionHeading}</span>
          </h3>
          <div className="text-gray-700 text-xs sm:text-base leading-relaxed space-y-3 font-sans">
            {entry.concertProgressionParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

export default RagaEditorialArticleSection;
