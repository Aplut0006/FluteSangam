import React from 'react';
import { 
  Music, 
  Search, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Info, 
  Wind,
  ShieldCheck,
  ChevronRight,
  Disc,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';
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
    <div className="min-h-screen bg-sand-50/50 pb-20 pt-4 sm:pt-6 font-sans antialiased text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">

        {/* 1. Breadcrumbs */}
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
          <ChevronRight className="w-3 h-3 text-bamboo-400" />
          <span className="text-bamboo-950 font-bold" aria-current="page">
            Song Notations
          </span>
        </nav>

        {/* 2. Hero Header */}
        <header className="bg-gradient-to-br from-amber-700 via-amber-800 to-bamboo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5" />
            FluteSangam Notations Library
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            Flute &amp; Bansuri Song Notations
          </h1>

          <p className="text-amber-100 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
            Explore FluteSangam’s song notations prepared for flute and bansuri learners. Each lesson includes song lyrics paired alongside Sargam notes, suggested flute scales, octave guidance, phrase breakdowns and practical playing tips.
          </p>
        </header>

        {/* 3. Search Bar & Category Filter */}
        <section aria-label="Filter and search song notations" className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-4">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-amber-600 absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              aria-label="Search by song, singer or category"
              placeholder="Search by song, title, singer or scale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-amber-50/40 rounded-xl border border-amber-200/70 text-sm text-bamboo-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs font-bold text-gray-500 hover:text-amber-800 px-2 py-1 bg-amber-100 rounded-md transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-100/80">
            <span className="text-xs font-bold text-bamboo-900 mr-1 flex items-center gap-1.5">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'All'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-bamboo-900 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span>All</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'All' ? 'bg-amber-700 text-amber-100' : 'bg-white text-gray-600'
              }`}>
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('English')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'English'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-bamboo-900 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span>English</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'English' ? 'bg-amber-700 text-amber-100' : 'bg-white text-gray-600'
              }`}>
                {counts.english}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('Hindi/Bollywood')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'Hindi/Bollywood'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-bamboo-900 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span>Hindi / Bollywood</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'Hindi/Bollywood' ? 'bg-amber-700 text-amber-100' : 'bg-white text-gray-600'
              }`}>
                {counts.hindi}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('Devotional')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'Devotional'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-bamboo-900 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span>Devotional</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'Devotional' ? 'bg-amber-700 text-amber-100' : 'bg-white text-gray-600'
              }`}>
                {counts.devotional}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('Others')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'Others'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-bamboo-900 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span>Others</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'Others' ? 'bg-amber-700 text-amber-100' : 'bg-white text-gray-600'
              }`}>
                {counts.others}
              </span>
            </button>
          </div>
        </section>

        {/* 4. Notation Cards Grid */}
        <section aria-label="Available Song Notations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Published Song Lessons {selectedCategory !== 'All' && <span className="text-amber-700 font-normal">({selectedCategory})</span>}
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-amber-100">
              {filteredNotations.length} {filteredNotations.length === 1 ? 'Notation' : 'Notations'}
            </span>
          </div>

          {filteredNotations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-amber-200/80 shadow-xs">
              <Disc className="w-10 h-10 text-amber-500 mx-auto animate-spin-slow" />
              <p className="text-sm font-bold text-bamboo-950">
                No matching notation found in this category. More FluteSangam song lessons will be added gradually.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredNotations.map((song) => (
                <article 
                  key={song.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        song.category === 'Hindi/Bollywood' 
                          ? 'bg-rose-50 border-rose-200 text-rose-800' 
                          : song.category === 'Devotional'
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : song.category === 'Others'
                          ? 'bg-purple-50 border-purple-200 text-purple-800'
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}>
                        {song.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        Level: {song.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Updated: {song.updatedDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                      <Link 
                        to={`/notations/${song.slug}`}
                        onClick={(e) => handleSongClick(e, song.slug)}
                        className="hover:text-amber-700 transition"
                      >
                        {song.title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span className="font-semibold text-bamboo-800">
                        Formats: <span className="text-gray-700 font-normal">{song.notationFormats}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed font-sans">
                    {song.description}
                  </p>

                  <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-xs sm:text-sm space-y-1.5">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-amber-700" />
                      Suggested Flute:
                    </span>
                    <p className="text-gray-700">
                      {song.suggestedFlute}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <Link
                      to={`/notations/${song.slug}`}
                      onClick={(e) => handleSongClick(e, song.slug)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition"
                    >
                      <span>View Notation</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5. Educational Content */}
        <section aria-label="How to Read FluteSangam Notations" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                How to Read FluteSangam Notations
              </h2>
              <p className="text-xs text-gray-600">Standardized notation symbols used across all FluteSangam song transcriptions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-200 bg-amber-50/60 text-bamboo-950 font-bold">
                  <th scope="col" className="py-3 px-4">Meaning</th>
                  <th scope="col" className="py-3 px-4">Symbol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-gray-700 font-sans">
                <tr>
                  <td className="py-2.5 px-4 font-medium">Middle octave</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">S R G M P D N</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Lower octave</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">.P .D .N</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Higher octave</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">S' R' G' M' P'</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Komal Re, Ga, Dha and Ni</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">r g d n</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Lower-octave komal note</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">.r .g .d .n</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Higher-octave komal note</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">r' g' d' n'</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Tivra Ma</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">M^</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Lower-octave Tivra Ma</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">.M^</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Higher-octave Tivra Ma</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">M^'</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Hold a note</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Breath</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">/</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Meend</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">~</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Kan swar</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">(G)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Fast murki group</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">&#123;GRS&#125;</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Phrase division</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-900">|</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-xs sm:text-sm text-bamboo-950 space-y-1.5 leading-relaxed">
            <h3 className="font-bold text-amber-900">Swar Variants in Indian Music:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Sa and Pa</strong> are Achala (immovable) notes and do not have komal or tivra forms.</li>
              <li><strong>Re, Ga, Dha and Ni</strong> may be shuddh (natural) or komal (flat).</li>
              <li><strong>Ma</strong> may be shuddh (natural) or tivra (sharp).</li>
            </ul>
          </div>
        </section>

        {/* 6. Choosing a Flute Key */}
        <section aria-label="Choosing a Flute Key" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
            Choosing a Flute Key
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            Indian Classical and light music notation uses a <strong>movable Sa</strong> system. This means the relative Sargam fingerings remain identical regardless of which bansuri scale you hold in your hands. Playing the same Sargam on a G Medium flute, an E Bass flute, or a C Natural flute will produce the correct relative melody, although the resulting pitch will sound higher or lower.
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            A C Medium bansuri is commonly recommended for beginners due to comfortable finger spacing and moderate breath requirements, but it is not compulsory. You can practice any FluteSangam lesson on whichever flute key you currently own.
          </p>
        </section>

        {/* 7. How FluteSangam Prepares Notations */}
        <section aria-label="How FluteSangam Prepares Notations" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
            How FluteSangam Prepares Notations
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            FluteSangam song notations are arranged as practical learning guides for flute and bansuri players. Published transcriptions are organised phrase by phrase with consistent notation symbols and playing guidance. Small melodic variations may occur between performances and individual interpretations.
          </p>
        </section>

        {/* 8. Educational Notice */}
        <section aria-label="Educational Notice" className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Educational Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
            These song notations are provided for music-learning and educational purposes. FluteSangam does not claim ownership of underlying traditional or copyrighted melodies. Notation may vary according to key, octave and individual interpretation.
          </p>
        </section>

      </div>
    </div>
  );
};
