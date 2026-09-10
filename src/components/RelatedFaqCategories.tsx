import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { FAQ_CATEGORY_METADATA } from '../data/faqCategoryMetadata';
import { FAQ_DATA } from '../data/allFaqData';
import { 
  HelpCircle, BookOpen, Users, Compass, Activity, Award, Calendar, 
  Layers as LayersIcon, Music, Shield, Wind, Smile, Sparkles, Sliders, Package, MessageSquare 
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, any> = {
  'getting-started': HelpCircle,
  'learning-the-flute': BookOpen,
  'adult-learners': Users,
  'choosing-the-right-flute': Compass,
  'playing-techniques': Activity,
  'advanced-techniques': Award,
  'daily-practice': Calendar,
  'scales-and-alankars': LayersIcon,
  'raagas': Music,
  'flute-care-and-maintenance': Shield,
  'health-and-breathing': Wind,
  'children-and-beginners': Smile,
  'music-theory': Sparkles,
  'tuning-and-pitch': Sliders,
  'flute-accessories': Package,
  'flute-types': Compass,
  'platform': MessageSquare
};

interface RelatedFaqCategoriesProps {
  currentSlug: string;
  onSelectCategory?: (category: string) => void;
}

export const RelatedFaqCategories: React.FC<RelatedFaqCategoriesProps> = ({ currentSlug, onSelectCategory }) => {
  const currentMeta = FAQ_CATEGORY_METADATA[currentSlug];
  if (!currentMeta || !currentMeta.relatedSlugs || currentMeta.relatedSlugs.length === 0) {
    return null;
  }

  const relatedItems = currentMeta.relatedSlugs
    .map(slug => FAQ_CATEGORY_METADATA[slug])
    .filter(Boolean);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm space-y-5" id="related-faq-categories">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-600 shrink-0" />
          <h2 className="text-xl font-bold font-display text-bamboo-950">
            Related FAQ Categories
          </h2>
        </div>
        <Link
          to="/faq"
          onClick={() => onSelectCategory?.('All Categories')}
          className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
        >
          <span>View All FAQ Topics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {relatedItems.map(item => {
          const Icon = CATEGORY_ICON_MAP[item.slug] || HelpCircle;
          const questionCount = FAQ_DATA.filter(f => {
            if (item.slug === 'choosing-the-right-flute') return f.category === 'Choosing a Flute' || f.category === 'Choosing the Right Flute';
            if (item.slug === 'raagas') return f.category === 'Raagas' || f.category === 'Raagas & Sargam';
            if (item.slug === 'music-theory') return f.category === 'Music Theory & Notation' || f.category === 'Music Theory & Tuning' || f.category === 'Music Theory';
            if (item.slug === 'tuning-and-pitch') return f.category === 'Flute Tuning & Pitch' || f.category === 'Tuning & Pitch Calibration';
            if (item.slug === 'flute-accessories') return f.category === 'Flute Accessories' || f.category === 'Flute Accessories & Gear';
            if (item.slug === 'flute-types') return f.category === 'Flute Types' || f.category === 'Flute Types & Scales';
            return f.category === item.categoryName;
          }).length;

          return (
            <Link
              key={item.slug}
              to={`/faq/${item.slug}`}
              onClick={() => onSelectCategory?.(item.categoryName)}
              className="group p-4 bg-amber-50/40 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-400 rounded-2xl transition-all duration-200 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200/80 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-900 bg-white/80 border border-amber-200 px-2 py-0.5 rounded-full">
                    {questionCount} Q&amp;A
                  </span>
                </div>
                <h3 className="text-sm font-bold font-display text-bamboo-950 group-hover:text-amber-800 transition-colors">
                  {item.categoryName}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {item.h1}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-900">
                <span>Explore Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedFaqCategories;
