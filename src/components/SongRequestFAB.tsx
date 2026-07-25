import React, { useState } from 'react';
import { Music, X } from 'lucide-react';

export const SongRequestFAB = ({ isHidden }: { isHidden?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ songName: '', singerName: '', movieName: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isHidden) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    try {
      const response = await fetch('/api/request-notation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || 'Failed');
      setStatus('success');
      setFormData({ songName: '', singerName: '', movieName: '' });
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send request');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 md:bottom-6 right-6 z-[90] bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-500 transition-all hover:scale-105 flex items-center gap-2"
      >
        <Music size={24} />
        <span className="hidden sm:inline font-semibold">Request Notation</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Request Song Notation</h2>
            {status === 'success' ? (
              <p className="text-green-600 font-medium">Song notation requested, you will receive the notations on chat once ready.</p>
            ) : (
              <>
                {status === 'error' && <p className="text-red-600 mb-4">{errorMessage || 'Failed to send request. Please try again.'}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    placeholder="Song Name"
                    className="w-full p-3 border rounded-lg"
                    value={formData.songName}
                    onChange={e => setFormData({ ...formData, songName: e.target.value })}
                  />
                  <input
                    required
                    placeholder="Singer Name"
                    className="w-full p-3 border rounded-lg"
                    value={formData.singerName}
                    onChange={e => setFormData({ ...formData, singerName: e.target.value })}
                  />
                  <input
                    placeholder="Movie Name (optional)"
                    className="w-full p-3 border rounded-lg"
                    value={formData.movieName}
                    onChange={e => setFormData({ ...formData, movieName: e.target.value })}
                  />
                  <button
                    disabled={status === 'submitting'}
                    className="w-full bg-amber-600 text-white p-3 rounded-lg font-bold hover:bg-amber-500 disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
