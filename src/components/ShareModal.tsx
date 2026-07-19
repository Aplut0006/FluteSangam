import React, { useState } from 'react';
import { Post } from '../types';
import { X, Copy, Check, Twitter, Facebook, MessageCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export default function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  // Derive the share text
  const shareTitle = `Check out this post on FluteSangam: "${post.title}" by ${post.authorName}!`;
  const shareUrl = window.location.href;
  const fullShareText = `${shareTitle} Join the global bansuri & flute community: ${shareUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Pre-filled social URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`FluteSangam: ${post.title}`)}&body=${encodeURIComponent(fullShareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" id="share-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm frosted-panel-thick rounded-2xl shadow-2xl overflow-hidden"
        id="share-modal-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-bamboo-50/50">
          <h3 className="font-display font-semibold text-bamboo-800 text-sm">Share Performance Details</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Invite your musician friends, teachers, and student groups to view this musical journey on FluteSangam!
          </p>

          {/* Social Icons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1.5 p-2.5 rounded-xl hover:bg-green-50 transition text-green-600"
            >
              <div className="p-2.5 bg-green-100 rounded-xl">
                <MessageCircle className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-[10px] font-semibold text-gray-600">WhatsApp</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1.5 p-2.5 rounded-xl hover:bg-gray-50 transition text-gray-900"
            >
              <div className="p-2.5 bg-gray-100 rounded-xl">
                <Twitter className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-[10px] font-semibold text-gray-600">Twitter</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1.5 p-2.5 rounded-xl hover:bg-blue-50 transition text-blue-600"
            >
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Facebook className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-[10px] font-semibold text-gray-600">Facebook</span>
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              className="flex flex-col items-center space-y-1.5 p-2.5 rounded-xl hover:bg-amber-50 transition text-amber-600"
            >
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Mail className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-[10px] font-semibold text-gray-600">Email</span>
            </a>
          </div>

          {/* Copy Link field */}
          <div className="pt-2">
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">Copy Sharing Card</label>
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <input
                type="text"
                readOnly
                value={fullShareText}
                className="w-full bg-transparent text-xs text-gray-600 focus:outline-none select-all truncate px-1"
              />
              <button
                onClick={copyToClipboard}
                className={`p-1.5 rounded-lg transition-all shrink-0 ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-bamboo-700 hover:bg-bamboo-800 text-white"
                }`}
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] text-green-600 font-semibold mt-1 block text-right animate-pulse">
                Copied to clipboard!
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
