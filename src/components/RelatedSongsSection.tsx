import React from 'react';
import { Link } from 'react-router-dom';
import { Music, ChevronRight, Film, Mic, Layers, ArrowRight } from 'lucide-react';
import { AppView } from '../types';
import { VIEW_URLS } from '../routes';
import { PUBLISHED_SONG_NOTATIONS, SongNotationItem } from '../data/songNotationsData';

export interface RelatedSongsSectionProps {
  currentSlug: string;
  onViewChange?: (view: AppView) => void;
  maxSongs?: number;
}

export const RelatedSongsSection: React.FC<RelatedSongsSectionProps> = ({
  currentSlug,
  onViewChange,
  maxSongs = 4
}) => {
  const currentSong = PUBLISHED_SONG_NOTATIONS.find(s => s.slug === currentSlug);

  // Find related songs based on category and difficulty
  const relatedSongs = React.useMemo(() => {
    const candidates = PUBLISHED_SONG_NOTATIONS.filter(s => s.slug !== currentSlug);
    if (!currentSong) return candidates.slice(0, maxSongs);

    // 1. Same category
    const sameCategory = candidates.filter(s => s.category === currentSong.category);
    
    // 2. Same difficulty (not already included)
    const sameDifficulty = candidates.filter(
      s => s.category !== currentSong.category && s.difficulty === currentSong.difficulty
    );

    // 3. Others
    const others = candidates.filter(
      s => s.category !== currentSong.category && s.difficulty !== currentSong.difficulty
    );

    const pool = [...sameCategory, ...sameDifficulty, ...others];
    return pool.slice(0, maxSongs);
  }, [currentSlug, currentSong, maxSongs]);

  if (relatedSongs.length === 0) return null;

  const getSongViewKey = (slug: string): AppView => {
    const targetPath = `/notations/${slug}`;
    const matchingKey = Object.keys(VIEW_URLS).find(
      key => VIEW_URLS[key as AppView] === targetPath
    ) as AppView;
    return matchingKey || 'notation_requests';
  };

  const handleSongClick = (e: React.MouseEvent, song: SongNotationItem) => {
    if (e.ctrlKey || e.metaKey) return;
    const viewKey = getSongViewKey(song.slug);
    if (onViewChange) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onViewChange(viewKey);
    }
  };

  return (
    <section 
      aria-label="Related Song Notations" 
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200/90 shadow-sm space-y-4 sm:space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3 sm:pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
            <span>Recommended for You</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Related Flute Song Notations</span>
          </h2>
        </div>

        <Link
          to="/notations"
          onClick={(e) => {
            if (onViewChange && !e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onViewChange('notation_requests');
            }
          }}
          className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 group transition cursor-pointer"
        >
          <span>View All Songs</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
        {relatedSongs.map((song) => {
          const targetUrl = VIEW_URLS[getSongViewKey(song.slug)] || `/notations/${song.slug}`;

          return (
            <Link
              key={song.slug}
              to={targetUrl}
              onClick={(e) => handleSongClick(e, song)}
              className="bg-gradient-to-br from-amber-50/40 via-white to-sand-50/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group cursor-pointer"
            >
              <div className="space-y-2">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] sm:text-[11px]">
                    {song.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] sm:text-[11px] ${
                    song.difficulty === 'Beginner' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : song.difficulty === 'Intermediate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {song.difficulty}
                  </span>
                </div>

                {/* Song Title */}
                <h3 className="text-sm sm:text-base font-bold text-bamboo-950 group-hover:text-amber-700 transition font-display leading-snug">
                  {song.title}
                </h3>

                {/* Movie & Singer Subtitle */}
                {(song.movie || song.singer) && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 font-sans">
                    {song.movie && (
                      <span className="flex items-center gap-1 truncate">
                        <Film className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{song.movie}</span>
                      </span>
                    )}
                    {song.movie && song.singer && <span className="text-slate-300">•</span>}
                    {song.singer && (
                      <span className="flex items-center gap-1 truncate">
                        <Mic className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{song.singer}</span>
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Specs pill & CTA arrow */}
              <div className="pt-2 border-t border-amber-100/80 flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-slate-500 font-medium">
                  Flute Key: <strong className="text-amber-900 font-bold">{song.suggestedFlute.split('/')[0]}</strong>
                </span>

                <span className="font-bold text-amber-800 group-hover:text-amber-950 flex items-center gap-1 transition">
                  <span>Practice Swars</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedSongsSection;
