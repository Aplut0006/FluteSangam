import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Music, CheckCircle2, Clock, Search, Disc, User, Calendar } from 'lucide-react';

export const NotationRequestsView = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'songRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching song requests:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || (filter === 'ready' ? req.status === 'ready' : req.status !== 'ready');
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      req.songName?.toLowerCase().includes(query) ||
      req.singerName?.toLowerCase().includes(query) ||
      req.movieName?.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-bamboo-800 to-bamboo-900 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Music className="w-3.5 h-3.5" />
            <span>Community Requests</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">Song Notation Requests</h1>
          <p className="text-bamboo-100 text-sm max-w-xl">
            Browse notations requested by fellow flute enthusiasts or track the status of your requested song notations.
          </p>
        </div>
        <Music className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by song, singer, or movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-500/20 focus:border-bamboo-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-white text-bamboo-800 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ready'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ready to View
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'pending'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          Loading notation requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <Music className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-700 font-bold mb-1">No requests found</h3>
          <p className="text-gray-500 text-xs">
            {searchQuery ? 'Try clearing your search terms.' : 'Be the first to request a song notation using the Floating Request button (+)!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((req) => {
            const isReady = req.status === 'ready';
            const dateFormatted = req.createdAt ? new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

            return (
              <div 
                key={req.id} 
                className="bg-white border border-gray-100 hover:border-bamboo-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <Music className="w-4 h-4 text-bamboo-600 shrink-0" />
                      {req.songName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700">{req.singerName}</span>
                    </span>
                    {req.movieName && (
                      <span className="flex items-center gap-1">
                        <Disc className="w-3.5 h-3.5 text-gray-400" />
                        <span>{req.movieName}</span>
                      </span>
                    )}
                    {dateFormatted && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateFormatted}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
                  {isReady ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Notation Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      <Clock className="w-3.5 h-3.5" />
                      Request Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
