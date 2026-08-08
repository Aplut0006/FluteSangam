import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, MessageSquare, HelpCircle, ArrowLeft, CheckCircle, Sparkles, MapPin, Globe } from 'lucide-react';

interface ContactUsViewProps {
  onBackToCommunity?: () => void;
}

export default function ContactUsView({ onBackToCommunity }: ContactUsViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('aplut0006@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    // Construct mailto URL as fallback/direct send
    const mailtoSubject = encodeURIComponent(`[FluteSangam Contact] ${formData.subject} - from ${formData.name || 'a Flutist'}`);
    const mailtoBody = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`);
    
    // Open email client
    window.location.href = `mailto:aplut0006@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
      id="contact-us-view"
    >
      {/* Back Button */}
      {onBackToCommunity && (
        <button
          onClick={onBackToCommunity}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-bamboo-800 hover:text-bamboo-900 bg-bamboo-50/80 hover:bg-bamboo-100 border border-bamboo-200/80 px-3.5 py-1.5 rounded-full mb-6 transition-all cursor-pointer shadow-3xs"
          id="contact-us-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </button>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            We'd Love to Hear From You
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-wide mb-4 text-white">
            Contact FluteSangam
          </h1>
          <p className="text-bamboo-200 text-base sm:text-lg leading-relaxed">
            Have questions about learning bansuri, suggestions for new ragas, song sargam requests, or platform feedback? Reach out to our team anytime.
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="frosted-panel p-6 rounded-2xl border border-bamboo-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-bamboo-100/80 text-bamboo-800 rounded-2xl flex items-center justify-center mb-4 border border-bamboo-200/60">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-display font-bold text-bamboo-900 mb-2">Direct Email</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Send us a direct message for administrative inquiries, feature suggestions, or account support.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-bamboo-900 select-all mb-3 font-mono">aplut0006@gmail.com</p>
            <button
              onClick={handleCopyEmail}
              className="w-full py-2 px-3 bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800 border border-bamboo-200/80 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
              id="copy-email-btn"
            >
              {copiedEmail ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Mail className="w-4 h-4" />}
              {copiedEmail ? 'Email Copied!' : 'Copy Email Address'}
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="frosted-panel p-6 rounded-2xl border border-bamboo-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-amber-100/80 text-amber-800 rounded-2xl flex items-center justify-center mb-4 border border-amber-200/60">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-display font-bold text-bamboo-900 mb-2">Reddit Community</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Join our subreddit to discuss bansuri techniques, share recordings, and interact with fellow flutists.
            </p>
          </div>
          <a
            href="https://www.reddit.com/r/FluteSangam/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition text-center block shadow-2xs cursor-pointer"
            id="contact-reddit-btn"
          >
            Visit r/FluteSangam
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="frosted-panel p-6 rounded-2xl border border-bamboo-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-emerald-100/80 text-emerald-800 rounded-2xl flex items-center justify-center mb-4 border border-emerald-200/60">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-display font-bold text-bamboo-900 mb-2">Global Sangam</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Serving bansuri learners, teachers, and experienced flutists globally across India, North America, Europe, and Asia.
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-900 text-[11px] font-semibold px-3 py-2 rounded-xl border border-emerald-200/80 text-center">
            Response Time: Within 24-48 Hours
          </div>
        </motion.div>
      </div>

      {/* Main Contact Form Section */}
      <div className="bg-white rounded-3xl border border-bamboo-100 shadow-lg p-6 sm:p-10 mb-12">
        <h2 className="text-2xl font-display font-bold text-bamboo-900 mb-2 flex items-center gap-2">
          <Send className="w-6 h-6 text-amber-600" />
          Send Us a Message
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-8">
          Fill out the form below and click send. This will open your preferred email composer prepopulated with your message.
        </p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-display font-bold">Message Drafted!</h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
              Your default email client should have opened. If it didn't open automatically, please send your message directly to <strong className="font-mono">aplut0006@gmail.com</strong>.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name-input" className="block text-xs font-bold text-bamboo-950 uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pandit Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 min-h-[44px] bg-bamboo-50/50 border border-bamboo-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  id="contact-name-input"
                  aria-label="Your Name"
                />
              </div>

              <div>
                <label htmlFor="contact-email-input" className="block text-xs font-bold text-bamboo-950 uppercase tracking-wider mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 min-h-[44px] bg-bamboo-50/50 border border-bamboo-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  id="contact-email-input"
                  aria-label="Your Email Address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-category-select" className="block text-xs font-bold text-bamboo-950 uppercase tracking-wider mb-2">
                Inquiry Category
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 min-h-[44px] bg-bamboo-50/50 border border-bamboo-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition cursor-pointer"
                id="contact-category-select"
                aria-label="Inquiry Category"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Song Sargam Notation Request">Song Sargam Notation Request</option>
                <option value="Feedback & Feature Suggestion">Feedback & Feature Suggestion</option>
                <option value="Technical Support or Bug Report">Technical Support or Bug Report</option>
                <option value="Community Collaboration">Community Collaboration</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message-input" className="block text-xs font-bold text-bamboo-950 uppercase tracking-wider mb-2">
                Message Content
              </label>
              <textarea
                rows={5}
                required
                placeholder="Share your thoughts, notation requests, or feedback..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 min-h-[120px] bg-bamboo-50/50 border border-bamboo-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition resize-y"
                id="contact-message-input"
                aria-label="Message Content"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-bamboo-800 hover:bg-bamboo-900 text-white font-bold rounded-xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              id="send-message-submit-btn"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-bamboo-50/60 rounded-3xl p-6 sm:p-8 border border-bamboo-200/60">
        <h3 className="text-xl font-display font-bold text-bamboo-900 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          Frequently Asked Questions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-bamboo-100 shadow-2xs">
            <h4 className="text-sm font-bold text-bamboo-900 mb-2">How do I request a song Sargam notation?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              You can post directly on the <span className="font-semibold text-bamboo-800">Song Notation Board</span> using the "Request Notation" button on the main community feed!
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-bamboo-100 shadow-2xs">
            <h4 className="text-sm font-bold text-bamboo-900 mb-2">How do I upload an audio recital?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Click on <span className="font-semibold text-bamboo-800">Create Post</span> in the community header, select "Audio Performance", and attach or record your flute session audio.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-bamboo-100 shadow-2xs">
            <h4 className="text-sm font-bold text-bamboo-900 mb-2">Is FluteSangam free for everyone?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Yes! FluteSangam is 100% free for all flute learners, teachers, and enthusiasts around the world.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-bamboo-100 shadow-2xs">
            <h4 className="text-sm font-bold text-bamboo-900 mb-2">How can I contribute to the platform?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              You can contribute by sharing audio recitals, answering questions in the feed, transcribing sargams for requested songs, and spreading the word to fellow flutists!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
