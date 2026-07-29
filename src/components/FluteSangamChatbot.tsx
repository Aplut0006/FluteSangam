import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Sparkles, RotateCcw, 
  ChevronRight, Wind, BookOpen, Target, 
  ShoppingBag, ShieldCheck, Sliders, Music, ArrowUpRight,
  Hand, Volume2, Zap, Award, AlertCircle, Users, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CHATBOT_QA_DATABASE, 
  CHATBOT_CATEGORIES, 
  searchChatbotQA, 
  getRandomQuestions, 
  ChatbotQA 
} from '../data/chatbotData';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  relatedQuestions?: ChatbotQA[];
  actionLink?: {
    label: string;
    view: string;
  };
}

interface FluteSangamChatbotProps {
  onViewChange?: (view: any) => void;
  isHidden?: boolean;
}

export const FluteSangamChatbot: React.FC<FluteSangamChatbotProps> = ({ onViewChange, isHidden }) => {
  if (isHidden) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Beginner');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatbotWindowRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the chatbot window
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatbotWindowRef.current &&
        !chatbotWindowRef.current.contains(event.target as Node)
      ) {
        const triggerBtn = document.getElementById('flute-chatbot-trigger-btn');
        if (triggerBtn && triggerBtn.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'bot',
          text: '👋 Welcome to FluteSangam Assistant! Ask anything about learning the Indian Bansuri, flute selection, practice, techniques, raagas, or tap any category below to explore questions.',
          timestamp: now
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (isHidden) return null;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'Wind': return <Wind className="w-3.5 h-3.5" />;
      case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      case 'Target': return <Target className="w-3.5 h-3.5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Sliders': return <Sliders className="w-3.5 h-3.5" />;
      case 'Hand': return <Hand className="w-3.5 h-3.5" />;
      case 'Music': return <Music className="w-3.5 h-3.5" />;
      case 'Volume2': return <Volume2 className="w-3.5 h-3.5" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5" />;
      case 'Award': return <Award className="w-3.5 h-3.5" />;
      case 'AlertCircle': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Users': return <Users className="w-3.5 h-3.5" />;
      case 'HelpCircle': return <HelpCircle className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // 2. Perform Keyword Search
    setTimeout(() => {
      const { match, relatedQuestions } = searchChatbotQA(text);
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let actionLink: { label: string; view: string } | undefined = undefined;

      if (match) {
        // Detect if link to an internal app feature is useful
        const qId = match.id;
        if (qId.includes('tuner') || qId.includes('tune')) {
          actionLink = { label: 'Open Bansuri Tuner Tool', view: 'learn_tuner' };
        } else if (qId.includes('alankar')) {
          actionLink = { label: 'Open Alankar Generator', view: 'alankar_generator' };
        } else if (qId.includes('buy') || qId.includes('scale')) {
          actionLink = { label: 'View Fingering Chart', view: 'learn_fingering_chart' };
        } else if (qId.includes('raag')) {
          actionLink = { label: 'Explore Raga Library', view: 'learn_raagas' };
        }

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: match.answer,
          timestamp: botTimestamp,
          relatedQuestions: relatedQuestions,
          actionLink: actionLink
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const fallbackMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Sorry, I couldn't find an answer for that question yet. Please try another question or browse the suggested topics above.",
          timestamp: botTimestamp,
          relatedQuestions: getRandomQuestions(4)
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    }, 200);
  };

  const handleReset = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: '👋 Welcome to FluteSangam Assistant! Ask anything about learning the Indian Bansuri, flute selection, practice, techniques, raagas, or tap any category below to explore questions.',
        timestamp: now
      }
    ]);
  };

  const currentCategoryQuestions = CHATBOT_QA_DATABASE.filter(q => q.category === selectedCategory);

  // Simple formatter for bold text and line breaks
  const renderFormattedText = (content: string, isUser: boolean = false) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lIdx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={pIdx}
                  className={`font-bold ${isUser ? 'text-amber-200' : 'text-bamboo-950'}`}
                >
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button - positioned above mobile bottom nav */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="flute-chatbot-trigger-btn"
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 md:right-6 z-[1001] bg-gradient-to-r from-bamboo-800 via-bamboo-900 to-amber-950 hover:from-bamboo-700 hover:to-bamboo-900 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-2.5 border border-amber-400/50 group cursor-pointer"
          title="Ask FluteSangam Assistant"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110 shrink-0" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-bamboo-900 animate-pulse" />
          </div>
          <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white pr-0.5">
            Flute Assistant
          </span>
        </button>
      )}

      {/* Chat Window Dialog - positioned cleanly above mobile bottom nav */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-outside Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[1000] bg-black/20 backdrop-blur-[1px] md:bg-black/5 transition-opacity"
            />

            <motion.div
              ref={chatbotWindowRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-2 right-2 sm:left-auto sm:right-6 md:bottom-6 z-[1001] w-[calc(100vw-1rem)] sm:w-[420px] max-w-[500px] h-[78dvh] min-h-[480px] max-h-[calc(100dvh-5.25rem)] sm:h-[540px] sm:max-h-[620px] bg-white rounded-3xl shadow-2xl border border-bamboo-200 flex flex-col overflow-hidden font-sans"
            >
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-950 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="relative p-2 bg-amber-500/20 border border-amber-400/30 rounded-2xl text-amber-300 shrink-0">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-bamboo-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-white leading-none">
                      FluteSangam Assistant
                    </h3>
                    <span className="text-[9px] font-extrabold text-amber-200 uppercase tracking-widest bg-amber-500/30 px-1.5 py-0.5 rounded-md border border-amber-400/40">
                      Q&amp;A
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-100/90 mt-1 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Flute Knowledge Base • Instant Answers</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Close Assistant"
                  id="close-flute-chatbot-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="px-3 py-2 bg-amber-50/80 border-b border-amber-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {CHATBOT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-bamboo-800 text-white shadow-sm ring-1 ring-bamboo-900'
                      : 'bg-white text-gray-700 hover:bg-amber-100/60 hover:text-bamboo-900 border border-amber-200/80'
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Suggested Questions Bar for the Selected Category */}
            {currentCategoryQuestions.length > 0 && (
              <div className="px-3 py-2 bg-amber-100/50 border-b border-amber-200/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950 shrink-0 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Topics:</span>
                </span>
                {currentCategoryQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleSendMessage(q.question)}
                    className="px-2.5 py-1 text-[11px] font-medium text-amber-950 bg-white hover:bg-amber-100 border border-amber-200/90 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 shadow-3xs hover:border-amber-400"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-gray-50/50 to-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Bubble */}
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-3xs ${
                      msg.sender === 'user'
                        ? 'bg-bamboo-800 text-white rounded-tr-xs font-semibold'
                        : 'bg-white text-gray-900 border border-amber-200/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 font-extrabold text-amber-800 text-[10px] uppercase tracking-wider mb-1.5 pb-1 border-b border-amber-100">
                        <Bot className="w-3.5 h-3.5 text-amber-700" />
                        <span>FluteSangam Answer</span>
                      </div>
                    )}

                    <div>{renderFormattedText(msg.text, msg.sender === 'user')}</div>

                    {/* Quick Action Button if matching feature exists */}
                    {msg.actionLink && onViewChange && (
                      <button
                        onClick={() => {
                          onViewChange(msg.actionLink?.view);
                          setIsOpen(false);
                        }}
                        className="mt-3 w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-between transition cursor-pointer shadow-3xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-amber-700" />
                          <span>{msg.actionLink.label}</span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
                      </button>
                    )}

                    <span
                      className={`block text-[9px] mt-2 text-right ${
                        msg.sender === 'user' ? 'text-amber-200 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Related Questions Chips under Bot Answer */}
                  {msg.sender === 'bot' && msg.relatedQuestions && msg.relatedQuestions.length > 0 && (
                    <div className="mt-1.5 max-w-[95%] space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 pl-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Related Questions:</span>
                      </p>
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 max-w-full">
                        {msg.relatedQuestions.slice(0, 3).map(rel => (
                          <button
                            key={rel.id}
                            onClick={() => handleSendMessage(rel.question)}
                            className="text-[11px] font-medium text-bamboo-950 bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0 shadow-3xs hover:border-amber-400"
                          >
                            <span>{rel.question}</span>
                            <ChevronRight className="w-3 h-3 text-amber-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Flute, scales, practice..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-bamboo-600 focus:ring-2 focus:ring-bamboo-500/20 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 bg-bamboo-700 hover:bg-bamboo-800 disabled:opacity-40 text-white rounded-xl transition shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                id="send-flute-chatbot-msg-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};
