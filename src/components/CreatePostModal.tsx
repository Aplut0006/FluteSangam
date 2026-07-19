import React, { useState, useEffect } from 'react';
import { UserProfile, Post } from '../types';
import { POPULAR_RAGAS } from '../data/ragas';
import { addPost, editPost } from '../lib/db';
import { X, Sparkles, Music, Youtube, HelpCircle, FileText, Settings, Video, Image as ImageIcon, UploadCloud, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  postToEdit?: Post | null;
}

export default function CreatePostModal({ isOpen, onClose, currentUser, postToEdit = null }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Performance' | 'Tutorial' | 'Raga Discussion' | 'Review' | 'Question'>('Performance');
  const [raga, setRaga] = useState('None');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '');
      setDescription(postToEdit.description || '');
      setCategory(postToEdit.category || 'Performance');
      setRaga(postToEdit.raga || 'None');
      setVideoUrl(postToEdit.videoUrl || '');
      setImageUrl(postToEdit.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Performance');
      setRaga('None');
      setVideoUrl('');
      setImageUrl('');
    }
    setError('');
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle files
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select/drop a valid image file.");
      return;
    }
    if (file.size > 800 * 1024) {
      setError("Image size is too large (must be under 800KB). Please use a smaller or compressed image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // List of high quality default youtube links for easy demo seeding if the user wants!
  const demoVideoSuggestions = [
    { name: "Hariprasad Chaurasia (Raga Yaman)", url: "https://www.youtube.com/embed/5U9N5Xor9tY" },
    { name: "Pravin Godkhindi (Raga Bhimpalasi)", url: "https://www.youtube.com/embed/zH3F8rR_Zrs" },
    { name: "Deep Classical Bansuri Sadhana", url: "https://www.youtube.com/embed/7o0ZJz6bQd4" }
  ];

  // Quick Youtube clean url parser to get proper embed links
  const cleanYoutubeUrl = (url: string) => {
    if (!url) return '';
    try {
      // If it is already an embed link, return it
      if (url.includes('embed/')) return url;
      
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0];
      } else {
        // Fallback or matches directly
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
          videoId = match[2];
        }
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // return original if we can't parse it
    } catch (e) {
      return url;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Please fill in the title and description.");
      return;
    }

    setLoading(true);
    setError('');

    const formattedVideoUrl = cleanYoutubeUrl(videoUrl);

    try {
      if (postToEdit) {
        await editPost(postToEdit.id, {
          title,
          description,
          category,
          raga: raga !== 'None' ? raga : undefined,
          videoUrl: formattedVideoUrl || undefined,
          imageUrl: imageUrl || undefined
        });
        onClose();
      } else {
        const postId = await addPost({
          authorId: currentUser.uid,
          authorName: currentUser.displayName,
          authorPhoto: currentUser.photoURL,
          authorLevel: currentUser.level,
          authorUsername: currentUser.username,
          title,
          description,
          category,
          raga: raga !== 'None' ? raga : undefined,
          videoUrl: formattedVideoUrl || undefined,
          imageUrl: imageUrl || undefined
        });

        if (postId) {
          onClose();
          // Reset form
          setTitle('');
          setDescription('');
          setCategory('Performance');
          setRaga('None');
          setVideoUrl('');
          setImageUrl('');
        } else {
          throw new Error("Could not upload post. Please try again.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDemoVideo = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" id="create-post-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg frosted-panel-thick rounded-2xl shadow-2xl overflow-hidden"
        id="create-post-card"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-bamboo-700 to-bamboo-800 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-display font-semibold tracking-wide text-base">
              {postToEdit ? "Edit Your Post" : "Share Your Musical Journey"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition text-white/90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto" id="create-post-form">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Post Category</label>
            <div className="grid grid-cols-5 gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200/60" id="category-selector-container">
              {[
                { value: 'Performance', label: 'Play', icon: Music },
                { value: 'Tutorial', label: 'Learn', icon: Video },
                { value: 'Raga Discussion', label: 'Raga', icon: Settings },
                { value: 'Review', label: 'Review', icon: FileText },
                { value: 'Question', label: 'Ask', icon: HelpCircle }
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value as any)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
                      isSelected
                        ? "bg-bamboo-700 text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Title / Composition Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'Performance' ? "e.g. Dhun in Raga Yaman on E Bass" :
                category === 'Review' ? "e.g. Punam Flutes E Bass Review" :
                "e.g. Tips on cross fingering..."
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Share Your Description / Learnings</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your musical journey, key learnings, techniques, or ask your questions here..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent resize-none"
            />
          </div>

          {/* Image Attachment Field */}
          <div className="space-y-1.5" id="post-image-attachment-container">
            <label className="block text-xs font-semibold text-gray-700">Attach Image (Optional)</label>
            
            {imageUrl ? (
              <div className="relative group border border-gray-200 rounded-xl overflow-hidden shadow-2xs bg-gray-50 flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt="Attachment Preview" 
                  className="max-h-48 object-contain rounded-lg w-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                    }}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? "border-bamboo-600 bg-bamboo-50/50" 
                    : "border-gray-200 hover:border-bamboo-400/80 hover:bg-gray-50/50"
                }`}
                onClick={() => document.getElementById('post-image-file')?.click()}
              >
                <input 
                  type="file" 
                  id="post-image-file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-bamboo-600 animate-bounce' : 'text-gray-400'}`} />
                  <p className="text-xs font-semibold text-gray-700">
                    Drag & drop your image here, or <span className="text-bamboo-700 hover:underline font-bold">browse</span>
                  </p>
                  <p className="text-[10px] text-gray-400">Supports JPG, PNG, GIF up to 800KB</p>
                </div>
              </div>
            )}
          </div>

          {/* Performance Video Link (YouTube embedding) */}
          {(category === 'Performance' || category === 'Tutorial') && (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                  YouTube Performance or Video Link (Optional)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=5U9N5Xor9tY"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                />
              </div>

              {/* Suggestions panel to quickly test video embeddings */}
              <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
                  ✨ Instant Demo suggestions (click to prefill)
                </span>
                <div className="flex flex-wrap gap-2">
                  {demoVideoSuggestions.map((video) => (
                    <button
                      key={video.name}
                      type="button"
                      onClick={() => handleApplyDemoVideo(video.url)}
                      className="px-2 py-1 text-[10px] font-semibold bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition"
                    >
                      {video.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-sm"
            >
              {loading 
                ? (postToEdit ? "Saving changes..." : "Publishing to community...") 
                : (postToEdit ? "Save Changes" : "Publish Post")
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
