import React, { useState, useEffect } from 'react';
import { Music, X, Mic, Film, Sparkles, CheckCircle2, ShieldAlert, Send, FileText, Info, KeyRound, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface SongRequestFABProps {
  isHidden?: boolean;
  currentUser: any;
  onOpenAuth?: () => void;
}

export const SongRequestFAB: React.FC<SongRequestFABProps> = ({ isHidden, currentUser, onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    songName: '',
    singerName: '',
    movieName: '',
    fluteKey: 'C# Medium',
    notationType: 'Sargam (Indian)',
    notes: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wasAuthPrompted, setWasAuthPrompted] = useState(false);

  // If user signs in while modal is open after being prompted
  useEffect(() => {
    if (currentUser && wasAuthPrompted && status === 'idle' && formData.songName.trim()) {
      setWasAuthPrompted(false);
    }
  }, [currentUser, wasAuthPrompted, formData.songName, status]);

  if (isHidden) return null;

  const handleFabClick = () => {
    // Open modal regardless of auth state so user can enter details first
    setIsOpen(true);
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setWasAuthPrompted(false);
    if (status === 'success') {
      setStatus('idle');
      setFormData({
        songName: '',
        singerName: '',
        movieName: '',
        fluteKey: 'C# Medium',
        notationType: 'Sargam (Indian)',
        notes: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.songName.trim() || !formData.singerName.trim()) {
      setErrorMessage("Please enter both the Song Name and Singer Name.");
      setStatus('error');
      return;
    }

    // AUTH CHECK: If not logged in, prompt auth first!
    if (!currentUser) {
      setWasAuthPrompted(true);
      setErrorMessage(null);
      onOpenAuth?.();
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const userName = currentUser.displayName || currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : 'Flute Musician');
      await addDoc(collection(db, 'songRequests'), {
        songName: formData.songName.trim(),
        singerName: formData.singerName.trim(),
        movieName: formData.movieName.trim(),
        fluteKey: formData.fluteKey,
        notationType: formData.notationType,
        notes: formData.notes.trim(),
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        userName: userName,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      setStatus('success');
      setFormData({
        songName: '',
        singerName: '',
        movieName: '',
        fluteKey: 'C# Medium',
        notationType: 'Sargam (Indian)',
        notes: ''
      });
      setWasAuthPrompted(false);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send request. Please try again.');
    }
  };

  const fluteKeys = [
    'C# Medium', 'C Natural Medium', 'G Base', 'E Bass', 'A Medium', 'D Medium', 'F Medium', 'G# Medium', 'Any Flute Key'
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleFabClick}
        id="fab-request-notation-btn"
        className="fixed bottom-[100px] md:bottom-6 right-5 md:right-6 z-[90] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-3.5 md:px-5 md:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2.5 border border-amber-400/30 group cursor-pointer"
        title="Request Song Notation"
      >
        <div className="relative">
          <Music className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" />
          <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="hidden sm:inline font-bold text-sm tracking-wide">Request Notation</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-bamboo-100 overflow-hidden relative my-auto">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white p-5 sm:p-6 relative">
              <button 
                onClick={handleClose} 
                className="absolute top-4 right-4 text-bamboo-200 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition cursor-pointer"
                id="close-notation-request-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-amber-300 shrink-0">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Sargam & Notes Request
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-0.5">
                    Request Song Notation
                  </h2>
                </div>
              </div>

              <p className="text-xs text-bamboo-100/90 leading-relaxed pl-1 sm:pl-12">
                Can't find notes for your favorite song? Submit your request and our community gurus will transcribe the sargam notations.
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-5">
              {status === 'success' ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Request Submitted Successfully!</h3>
                    <p className="text-xs text-gray-600 mt-1.5 max-w-sm mx-auto leading-relaxed">
                      Your notation request has been added to the community board. You will receive notifications and updates in your feed when ready.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-left text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>What happens next?</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed">
                      Our experienced flute artists review pending requests daily. Keep an eye on the "Notation Requests" tab in the top navigation bar!
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
                  >
                    Done & Return
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Auth Warning / State Notice if not logged in */}
                  {!currentUser && (
                    <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold text-amber-900">
                          {wasAuthPrompted ? "Authentication Required to Submit" : "Sign in required upon submission"}
                        </p>
                        <p className="text-[11px] text-amber-800/90 leading-relaxed">
                          You can fill in your song details now! When you click submit, you will be prompted to sign in with your email or Google account so we can link the request to your profile.
                        </p>
                        {wasAuthPrompted && (
                          <button
                            type="button"
                            onClick={() => onOpenAuth?.()}
                            className="mt-1.5 inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Sign In / Create Account Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {status === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Song Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-amber-600" />
                        <span>Song / Composition Name</span>
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Tera Fitoor, Jab koi baat bigad jaye, O Saathi Re"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm transition text-gray-800 placeholder-gray-400 font-medium outline-none"
                      value={formData.songName}
                      onChange={e => setFormData({ ...formData, songName: e.target.value })}
                    />
                  </div>

                  {/* Singer / Artist Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-amber-600" />
                        <span>Singer / Original Artist</span>
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kishore Kumar, Lata Mangeshkar, Arijit Singh"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm transition text-gray-800 placeholder-gray-400 font-medium outline-none"
                      value={formData.singerName}
                      onChange={e => setFormData({ ...formData, singerName: e.target.value })}
                    />
                  </div>

                  {/* Movie / Album & Flute Key Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-amber-600" />
                        <span>Movie / Album (Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aashiqui 2, Kati Patang"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm transition text-gray-800 placeholder-gray-400 font-medium outline-none"
                        value={formData.movieName}
                        onChange={e => setFormData({ ...formData, movieName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Preferred Flute Scale</span>
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm transition text-gray-800 font-medium outline-none cursor-pointer"
                        value={formData.fluteKey}
                        onChange={e => setFormData({ ...formData, fluteKey: e.target.value })}
                      >
                        {fluteKeys.map(key => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notation Format Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Notation Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Sargam (Indian)', 'Western Staff', 'Both Formats'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, notationType: type })}
                          className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition cursor-pointer text-center ${
                            formData.notationType === type
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes / Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Additional Notes / Scale / Specific Part (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Include intro flute piece, specify Taal / Beat, or request specific sthai/antara..."
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs transition text-gray-800 placeholder-gray-400 font-medium outline-none resize-none"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      id="submit-notation-request-btn"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : !currentUser ? (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Sign In & Submit Request</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Notation Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
