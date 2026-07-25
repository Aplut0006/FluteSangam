import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  addDoc, 
  arrayUnion, 
  arrayRemove, 
  increment,
  deleteDoc
} from 'firebase/firestore';
import { 
  Music, 
  CheckCircle2, 
  Clock, 
  Search, 
  Disc, 
  User, 
  Calendar, 
  Heart, 
  MessageSquarePlus, 
  Send, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText,
  Sparkles,
  ChevronRight,
  Trash2
} from 'lucide-react';

interface NotationRequestsViewProps {
  currentUser?: any;
  onOpenAuth?: () => void;
}

export const NotationRequestsView: React.FC<NotationRequestsViewProps> = ({ currentUser, onOpenAuth }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal / Detail state
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [notations, setNotations] = useState<any[]>([]);
  const [loadingNotations, setLoadingNotations] = useState(false);

  // Form state for submitting a new notation
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [scale, setScale] = useState('C Medium');
  const [notationText, setNotationText] = useState('');
  const [notes, setNotes] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submittingNotation, setSubmittingNotation] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [firebaseUser, setFirebaseUser] = useState<any>(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
    });
    return () => unsub();
  }, []);

  const activeEmail = (currentUser?.email || firebaseUser?.email || auth.currentUser?.email || '').toLowerCase().trim();
  const activeUid = currentUser?.uid || firebaseUser?.uid || auth.currentUser?.uid || '';

  const isAdmin = activeEmail === 'aplut0006@gmail.com';

  const canDeleteRequest = (reqUserId?: string) => {
    if (isAdmin) return true;
    if (!activeUid || !reqUserId) return false;
    return reqUserId === activeUid;
  };

  const canDeleteNotation = (authorId?: string) => {
    if (isAdmin) return true;
    if (!activeUid || !authorId) return false;
    return authorId === activeUid;
  };

  // Handle Delete Request
  const handleDeleteRequest = async (e: React.MouseEvent, reqId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this notation request?')) return;
    try {
      await deleteDoc(doc(db, 'songRequests', reqId));
      if (selectedRequest?.id === reqId) {
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error('Error deleting song request:', err);
      alert('Failed to delete request.');
    }
  };

  // Handle Delete Submitted Notation
  const handleDeleteNotation = async (notationId: string) => {
    if (!selectedRequest) return;
    if (!confirm('Are you sure you want to delete this submitted notation?')) return;
    try {
      await deleteDoc(doc(db, 'songRequests', selectedRequest.id, 'notations', notationId));
    } catch (err) {
      console.error('Error deleting notation:', err);
      alert('Failed to delete notation.');
    }
  };

  // Real-time subscription for all requests
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

  // Real-time subscription for subcollection notations when a request is selected
  useEffect(() => {
    setShowSubmitForm(false);
    if (!selectedRequest) {
      setNotations([]);
      return;
    }
    setLoadingNotations(true);
    const q = query(
      collection(db, 'songRequests', selectedRequest.id, 'notations'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotations(list);
        setLoadingNotations(false);
      },
      (error) => {
        console.error('Error fetching notations:', error);
        setLoadingNotations(false);
      }
    );
    return () => unsubscribe();
  }, [selectedRequest?.id]);

  // Handle Like Request
  const handleLikeRequest = async (e: React.MouseEvent, reqId: string, likedBy: string[] = []) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth?.();
      return;
    }
    const isLiked = likedBy.includes(currentUser.uid);
    const reqRef = doc(db, 'songRequests', reqId);
    try {
      await updateDoc(reqRef, {
        likedBy: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (err) {
      console.error('Error updating request like:', err);
    }
  };

  // Handle Like Submitted Notation
  const handleLikeNotation = async (notationId: string, likedBy: string[] = []) => {
    if (!currentUser) {
      onOpenAuth?.();
      return;
    }
    if (!selectedRequest) return;
    const isLiked = likedBy.includes(currentUser.uid);
    const notationRef = doc(db, 'songRequests', selectedRequest.id, 'notations', notationId);
    try {
      await updateDoc(notationRef, {
        likedBy: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (err) {
      console.error('Error updating notation like:', err);
    }
  };

  // Handle Submit Notation
  const handleSubmitNotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth?.();
      return;
    }
    if (!selectedRequest || !notationText.trim()) return;

    setSubmittingNotation(true);
    try {
      // Add notation doc
      await addDoc(collection(db, 'songRequests', selectedRequest.id, 'notations'), {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.username || 'Flute Sangam Musician',
        authorPhoto: currentUser.photoURL || '',
        scale: scale.trim() || 'C Medium',
        notationText: notationText.trim(),
        notes: notes.trim(),
        videoUrl: videoUrl.trim(),
        createdAt: new Date().toISOString(),
        likedBy: []
      });

      // Update parent song request status to 'ready'
      await updateDoc(doc(db, 'songRequests', selectedRequest.id), {
        status: 'ready',
        notationsCount: increment(1)
      });

      setNotationText('');
      setNotes('');
      setVideoUrl('');
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitForm(false);
      }, 2500);
    } catch (err) {
      console.error('Error submitting notation:', err);
    } finally {
      setSubmittingNotation(false);
    }
  };

  // Copy Notation Swaras
  const handleCopyNotation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || (filter === 'ready' ? req.status === 'ready' : req.status !== 'ready');
    const queryStr = searchQuery.toLowerCase().trim();
    const matchesSearch = !queryStr || 
      req.songName?.toLowerCase().includes(queryStr) ||
      req.singerName?.toLowerCase().includes(queryStr) ||
      req.movieName?.toLowerCase().includes(queryStr);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bamboo-800 to-bamboo-900 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Music className="w-3.5 h-3.5" />
            <span>Community Flute Notations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">Song Notation Requests</h1>
          <p className="text-bamboo-100 text-sm max-w-xl">
            Browse requests, submit swaras/notations for songs requested by fellow flutists, and view notations shared by the community.
          </p>
        </div>
        <Music className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5 pointer-events-none" />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search song, singer, or movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-500/20 focus:border-bamboo-500 transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl gap-1 shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-bamboo-800 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'ready'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ready to View
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          Loading song notation requests...
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
            const likedBy = req.likedBy || [];
            const isLiked = currentUser && likedBy.includes(currentUser.uid);
            const likesCount = likedBy.length;
            const notationsCount = req.notationsCount || 0;

            return (
              <div 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                className="bg-white border border-gray-100 hover:border-bamboo-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-bamboo-800 transition flex items-center gap-2">
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

                {/* Right Actions */}
                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
                  {/* Status badge */}
                  {isReady ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to View
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  )}

                  {/* Likes button */}
                  <button
                    onClick={(e) => handleLikeRequest(e, req.id, likedBy)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                      isLiked 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{likesCount}</span>
                  </button>

                  {/* Delete button (Admin or Owner) */}
                  {canDeleteRequest(req.userId) && (
                    <button
                      onClick={(e) => handleDeleteRequest(e, req.id)}
                      title="Delete Request"
                      className="p-1.5 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Open details arrow */}
                  <div className="flex items-center gap-1 text-xs text-bamboo-700 font-semibold group-hover:translate-x-0.5 transition">
                    <span>View & Reply</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL FOR NOTATION REQUEST */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-bamboo-800 to-bamboo-900 text-white relative shrink-0">
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedRequest.status === 'ready' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {selectedRequest.status === 'ready' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {selectedRequest.status === 'ready' ? 'Ready to View' : 'Pending Request'}
                </span>
              </div>

              <h2 className="text-2xl font-black">{selectedRequest.songName}</h2>
              <p className="text-bamboo-100 text-sm mt-1 flex flex-wrap gap-x-4">
                <span>Singer: <strong className="text-white">{selectedRequest.singerName}</strong></span>
                {selectedRequest.movieName && <span>Movie: <strong className="text-white">{selectedRequest.movieName}</strong></span>}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-bamboo-200">
                <span>Requested by {selectedRequest.userEmail || 'Community Member'}</span>
                <div className="flex items-center gap-2">
                  {canDeleteRequest(selectedRequest.userId) && (
                    <button
                      onClick={(e) => handleDeleteRequest(e, selectedRequest.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Request</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => handleLikeRequest(e, selectedRequest.id, selectedRequest.likedBy)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      currentUser && (selectedRequest.likedBy || []).includes(currentUser.uid)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${currentUser && (selectedRequest.likedBy || []).includes(currentUser.uid) ? 'fill-white' : ''}`} />
                    <span>{(selectedRequest.likedBy || []).length} Likes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              {/* SUBMITTED NOTATIONS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-bamboo-700" />
                    Submitted Notations ({notations.length})
                  </h3>
                  {notations.length > 0 && (
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                      ✓ Notations Available
                    </span>
                  )}
                </div>

                {loadingNotations ? (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    Loading notations...
                  </div>
                ) : notations.length === 0 ? (
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 text-center">
                    <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-amber-900 mb-1">No notation submitted yet!</p>
                    <p className="text-xs text-amber-700">
                      Be the first musician to share swaras for this song below. Once submitted, this request moves to <strong>Ready to View</strong>!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notations.map((not) => {
                      const likedBy = not.likedBy || [];
                      const isLiked = currentUser && likedBy.includes(currentUser.uid);
                      const isCopied = copiedId === not.id;

                      return (
                        <div key={not.id} className="bg-bamboo-50/30 border border-bamboo-100 rounded-2xl p-5 space-y-3 relative group">
                          {/* Contributor info & scale */}
                          <div className="flex items-center justify-between gap-2 border-b border-bamboo-100/60 pb-3">
                            <div className="flex items-center gap-2.5">
                              {not.authorPhoto ? (
                                <img src={not.authorPhoto} alt={not.authorName} className="w-8 h-8 rounded-full object-cover border border-bamboo-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-bamboo-700 text-white font-bold text-xs flex items-center justify-center">
                                  {not.authorName ? not.authorName.charAt(0).toUpperCase() : 'M'}
                                </div>
                              )}
                              <div>
                                <h4 className="text-xs font-bold text-gray-900">{not.authorName}</h4>
                                <p className="text-[10px] text-gray-500">{new Date(not.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-bamboo-700 text-white rounded-full text-[11px] font-semibold">
                                Scale: {not.scale || 'C Medium'}
                              </span>
                              <button
                                onClick={() => handleCopyNotation(not.notationText, not.id)}
                                title="Copy Swaras"
                                className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-bamboo-700 transition cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                              {canDeleteNotation(not.authorId) && (
                                <button
                                  onClick={() => handleDeleteNotation(not.id)}
                                  title="Delete Notation"
                                  className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Swaras / Notation Box */}
                          <div className="bg-white border border-bamboo-200/80 rounded-xl p-4 font-mono text-xs md:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-2xs">
                            {not.notationText}
                          </div>

                          {/* Notes if provided */}
                          {not.notes && (
                            <p className="text-xs text-gray-600 italic bg-white/60 p-2.5 rounded-lg border border-gray-100">
                              💡 <strong>Notes/Tips:</strong> {not.notes}
                            </p>
                          )}

                          {/* Footer Actions: Video URL & Like button */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            {not.videoUrl ? (
                              <a
                                href={not.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-bamboo-700 font-semibold hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Watch Video Demo</span>
                              </a>
                            ) : <div />}

                            <button
                              onClick={() => handleLikeNotation(not.id, likedBy)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                                isLiked 
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold' 
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span>{likedBy.length} Likes</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SUBMIT NOTATION SECTION */}
              <div className="border-t border-gray-100 pt-6">
                {!showSubmitForm ? (
                  <div className="bg-bamboo-50/50 border border-bamboo-100 rounded-2xl p-6 text-center space-y-3">
                    <p className="text-xs text-gray-600 font-medium">
                      Know the flute swaras for this song? Share your notation to help fellow musicians!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth?.();
                          return;
                        }
                        setShowSubmitForm(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bamboo-800 hover:bg-bamboo-900 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition cursor-pointer"
                    >
                      <MessageSquarePlus className="w-4 h-4 text-amber-400" />
                      <span>Submit your Notation</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquarePlus className="w-5 h-5 text-bamboo-800" />
                        <h3 className="font-bold text-gray-900 text-base">Submit Notation for this Song</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSubmitForm(false)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {submitSuccess && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Thank you! Your notation has been published and this request is now set to "Ready to View".
                      </div>
                    )}

                    <form onSubmit={handleSubmitNotation} className="space-y-4 bg-gray-50/80 p-4 md:p-5 rounded-2xl border border-gray-200/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Flute Scale / Key
                          </label>
                          <select
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-bamboo-500/20 focus:border-bamboo-500"
                          >
                            <option value="C Natural Medium">C Natural Medium</option>
                            <option value="C# Medium">C# Medium</option>
                            <option value="D Medium">D Medium</option>
                            <option value="E Medium">E Medium</option>
                            <option value="E Bass">E Bass</option>
                            <option value="F Medium">F Medium</option>
                            <option value="G Natural">G Natural</option>
                            <option value="A Medium">A Medium</option>
                            <option value="B Medium">B Medium</option>
                            <option value="Custom">Other Scale</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Video / Demo Link (Optional)
                          </label>
                          <input
                            type="url"
                            placeholder="e.g. https://youtube.com/..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-500/20 focus:border-bamboo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Swaras / Notation Text <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder={`Enter the flute swaras here, for example:\nS R G M P D N S'\nS' N D P M G R S\n\n[Chorus]\nP D N S' - S' R' G' M'...`}
                          value={notationText}
                          onChange={(e) => setNotationText(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-bamboo-500/20 focus:border-bamboo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Performance Tips / Notes (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Use gentle Meend from P to N in the second line"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-500/20 focus:border-bamboo-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowSubmitForm(false)}
                          className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingNotation || !notationText.trim()}
                          className="px-5 py-2.5 bg-bamboo-800 hover:bg-bamboo-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingNotation ? 'Submitting...' : 'Post Notation'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
