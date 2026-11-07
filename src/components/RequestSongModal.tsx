import React, { useState } from 'react';
import { Music, Film, FileText, Mail, User, X, Send, CheckCircle2, Sparkles, Clock, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface RequestSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSongName?: string;
  defaultMovieName?: string;
}

export const RequestSongModal: React.FC<RequestSongModalProps> = ({
  isOpen,
  onClose,
  defaultSongName = '',
  defaultMovieName = ''
}) => {
  const [formData, setFormData] = useState({
    movieName: defaultMovieName,
    songName: defaultSongName,
    description: '',
    email: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.songName.trim()) {
      setErrorMsg('Please enter the song name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const trimmedSong = formData.songName.trim();
    const trimmedMovie = formData.movieName.trim();
    const trimmedDesc = formData.description.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedName = formData.name.trim();

    // 1. Prepare mailto link to flutesangam@gmail.com
    const subject = encodeURIComponent(`[Song Notation Request] ${trimmedSong}${trimmedMovie ? ` (${trimmedMovie})` : ''}`);
    const bodyContent = [
      `Song Notation Request:`,
      `--------------------------------`,
      `Song Name: ${trimmedSong}`,
      `Movie / Album: ${trimmedMovie || 'Not specified'}`,
      `Requested by: ${trimmedName || 'Flute Learner'}`,
      `Email: ${trimmedEmail || 'Not specified'}`,
      ``,
      `Specific Part / Description:`,
      `${trimmedDesc || 'Full song notations / Mukhda & Antara'}`,
      `--------------------------------`,
      `Sent via FluteSangam.com Song Request Form`
    ].join('\n');

    const mailtoUrl = `mailto:flutesangam@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    // 2. Save to Firestore `songRequests` collection
    try {
      await addDoc(collection(db, 'songRequests'), {
        songName: trimmedSong,
        movieName: trimmedMovie,
        notes: trimmedDesc,
        userEmail: trimmedEmail,
        userName: trimmedName || 'Flute Learner',
        status: 'pending',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      });
    } catch (dbErr) {
      console.warn('Could not save to Firestore, continuing with email submission:', dbErr);
    }

    // 3. Post to backend API
    try {
      fetch('/api/request-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songName: trimmedSong,
          movieName: trimmedMovie,
          description: trimmedDesc,
          email: trimmedEmail,
          name: trimmedName
        })
      }).catch(() => {});
    } catch {
      // Ignore background post failure
    }

    // 4. Open mailto link so user's client dispatches mail to flutesangam@gmail.com
    try {
      window.location.href = mailtoUrl;
    } catch {
      // Fallback if browser blocks protocol navigation
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-song-modal-title"
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl border border-amber-200 overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-bamboo-900 via-amber-900 to-amber-800 text-white p-5 sm:p-6 relative shrink-0">
          <button 
            type="button"
            onClick={handleClose} 
            className="absolute top-4 right-4 text-amber-200 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-400/30 rounded-2xl text-amber-300 shrink-0">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Flute Notation Request
              </span>
              <h2 id="request-song-modal-title" className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
                Request Song Notations
              </h2>
            </div>
          </div>

          <p className="text-xs text-amber-100/90 leading-relaxed mt-2.5">
            Can&apos;t find notes for your favorite song? Tell us what you want to learn on bansuri, and we&apos;ll prepare the accurate Sargam &amp; Western notes for you.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold font-display text-gray-900">
                  Your request has been submitted!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  You will receive a response from us within a few days at <span className="font-semibold text-amber-800">flutesangam@gmail.com</span>.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-left text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Request Details Recorded:</span>
                </div>
                <div className="space-y-1 text-slate-700 font-sans pl-1">
                  <p><strong className="text-bamboo-950">Song:</strong> {formData.songName}</p>
                  {formData.movieName && <p><strong className="text-bamboo-950">Movie/Album:</strong> {formData.movieName}</p>}
                  {formData.description && <p><strong className="text-bamboo-950">Part / Description:</strong> {formData.description}</p>}
                </div>
                <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Our flute team verifies each note and fingering before publication.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Movie / Album Name */}
              <div>
                <label htmlFor="req-movie" className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-600" />
                  <span>Movie / Album Name</span>
                  <span className="text-gray-400 text-[11px] font-normal">(Optional)</span>
                </label>
                <input
                  id="req-movie"
                  type="text"
                  placeholder="e.g. Kati Patang, DDLJ, Dil Se, Album title"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  value={formData.movieName}
                  onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
                />
              </div>

              {/* Song Name (Required) */}
              <div>
                <label htmlFor="req-song" className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-600" />
                  <span>Song Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="req-song"
                  required
                  type="text"
                  placeholder="e.g. Yeh Shaam Mastani, Tujhe Dekha To, Raabta"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  value={formData.songName}
                  onChange={(e) => setFormData({ ...formData, songName: e.target.value })}
                />
              </div>

              {/* Short Description (Specific part, para, antra, etc.) */}
              <div>
                <label htmlFor="req-desc" className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Short Description / Specific Part</span>
                </label>
                <textarea
                  id="req-desc"
                  rows={3}
                  placeholder="Tell us if you need notations for any particular part (e.g. intro flute piece, mukhda, 1st antra, fast phrases, etc.)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* User Email & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="req-email" className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>Your Email</span>
                  </label>
                  <input
                    id="req-email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="req-name" className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Your Name</span>
                  </label>
                  <input
                    id="req-name"
                    type="text"
                    placeholder="e.g. Amit"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Request to flutesangam@gmail.com'}</span>
                </button>
                <p className="text-[11px] text-gray-500 text-center mt-2">
                  On submit, your request will be delivered to our flute editorial team at flutesangam@gmail.com.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
