import React from 'react';
import { 
  Music, 
  Search, 
  ChevronRight, 
  Layers, 
  Filter, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
import AboutAuthorSection from './AboutAuthorSection';
import { PUBLISHED_SONG_NOTATIONS } from '../data/songNotationsData';

interface SongNotationsLibraryViewProps {
  onViewChange?: (view: AppView) => void;
  onNavigateToSong?: (slug: string) => void;
}

export const SongNotationsLibraryView: React.FC<SongNotationsLibraryViewProps> = ({ 
  onViewChange,
  onNavigateToSong
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<'All' | 'English' | 'Hindi/Bollywood' | 'Devotional' | 'Others'>('All');

  const counts = React.useMemo(() => {
    return {
      all: PUBLISHED_SONG_NOTATIONS.length,
      english: PUBLISHED_SONG_NOTATIONS.filter(item => item.category === 'English').length,
      hindi: PUBLISHED_SONG_NOTATIONS.filter(item => item.category === 'Hindi/Bollywood').length,
      devotional: PUBLISHED_SONG_NOTATIONS.filter(item => item.category === 'Devotional').length,
      others: PUBLISHED_SONG_NOTATIONS.filter(item => item.category === 'Others').length
    };
  }, []);

  const filteredNotations = React.useMemo(() => {
    let list = PUBLISHED_SONG_NOTATIONS;
    if (selectedCategory !== 'All') {
      list = list.filter(item => item.category === selectedCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.difficulty.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.suggestedFlute.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const handleSongClick = (e: React.MouseEvent, slug: string) => {
    if (e.ctrlKey || e.metaKey) return;
    if (onNavigateToSong) {
      e.preventDefault();
      onNavigateToSong(slug);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50/50 pb-20 pt-2 sm:pt-6 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto px-1 sm:px-6 space-y-6 sm:space-y-10">

        {/* 1. Breadcrumbs */}
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
          <span className="text-bamboo-950 font-bold truncate" aria-current="page">
            Song Notations
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-2xl sm:rounded-3xl p-4 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-3 sm:space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5" />
            FluteSangam Notations Library
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            Flute &amp; Bansuri Song Notations
          </h1>

          <p className="text-amber-100 text-xs sm:text-base leading-relaxed max-w-3xl font-normal">
            Explore FluteSangam’s song notations prepared for flute and bansuri learners. Each lesson includes song lyrics paired alongside Sargam notes, suggested flute scales, octave guidance, phrase breakdowns and practical playing tips.
          </p>
        </header>

        {/* 3. Search Bar & Category Filter */}
        <section aria-label="Filter and search song notations" className="bg-white rounded-2xl p-3.5 sm:p-5 border border-amber-200/80 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by song name, movie, category, or flute key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-amber-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm bg-sand-50/40 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-sand-100 text-gray-700 hover:bg-sand-200'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setSelectedCategory('English')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === 'English'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-sand-100 text-gray-700 hover:bg-sand-200'
                }`}
              >
                English ({counts.english})
              </button>
              <button
                onClick={() => setSelectedCategory('Hindi/Bollywood')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === 'Hindi/Bollywood'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-sand-100 text-gray-700 hover:bg-sand-200'
                }`}
              >
                Hindi / Bollywood ({counts.hindi})
              </button>
              <button
                onClick={() => setSelectedCategory('Devotional')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === 'Devotional'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-sand-100 text-gray-700 hover:bg-sand-200'
                }`}
              >
                Devotional ({counts.devotional})
              </button>
              <button
                onClick={() => setSelectedCategory('Others')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === 'Others'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-sand-100 text-gray-700 hover:bg-sand-200'
                }`}
              >
                Others ({counts.others})
              </button>
            </div>
          </div>
        </section>

        {/* 4. Notations Grid */}
        <section aria-label="Notations Catalog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              Available Lessons ({filteredNotations.length})
            </h2>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
              Sorted by Popularity
            </span>
          </div>

          {filteredNotations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-amber-200 space-y-3">
              <Music className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-gray-700">No songs match your search</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Try searching with a different term, or reset category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
              {filteredNotations.map((song) => (
                <article 
                  key={song.slug}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-3 sm:space-y-4 group"
                >
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {song.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {song.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-xl font-bold font-display text-bamboo-950 group-hover:text-amber-800 transition leading-snug">
                        <Link 
                          to={song.url}
                          onClick={(e) => handleSongClick(e, song.slug)}
                        >
                          {song.title}
                        </Link>
                      </h3>
                      <p className="text-[11px] sm:text-xs text-amber-900/80 font-medium mt-0.5">
                        {song.type}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-sans">
                      {song.description}
                    </p>

                    <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500 font-sans">
                      <div>
                        <span className="font-semibold text-gray-700">Flute:</span> {song.suggestedFlute}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Starts on:</span> <span className="font-mono font-bold text-amber-900">{song.startingSwar}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={song.url}
                      onClick={(e) => handleSongClick(e, song.slug)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-900 group-hover:text-white font-bold text-xs sm:text-sm transition duration-150 border border-amber-200 group-hover:border-amber-600"
                    >
                      <span>View Notation</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5. How to Practice Notations Guide Section */}
        <section aria-label="How to practice" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            <h2 className="text-base sm:text-xl font-bold font-display text-bamboo-950">
              How to Practice Flute Song Notations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">1. Sing the Sargam with Lyrics</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                Before blowing into your flute, sing the Sargam aloud with proper timing and melody so your mind internalizes the swar transitions.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">2. Practise Phrase-by-Phrase</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                Master one phrase at a slow speed (e.g. 50–60 BPM) before linking it into the full verse or mukhda. Clean finger placement prevents airy notes.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-bamboo-950">3. Match Tone with Metronome</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                Use FluteSangam's built-in metronome and tanpura drones to verify pitch stability and steady rhythm for the complete song.
              </p>
            </div>
          </div>
        </section>

        {/* 6. About Author & Community */}
        <AboutAuthorSection onViewChange={onViewChange} />

      </div>
    </div>
  );
};

export default SongNotationsLibraryView;
