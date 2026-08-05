import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="scroll-to-top-button"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          title="Scroll back to top"
          aria-label="Scroll to top of page"
          className="fixed left-4 md:left-6 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 z-[1001] flex items-center justify-center p-3 rounded-full bg-white/95 hover:bg-amber-50 text-amber-900 border border-amber-300/90 shadow-xl backdrop-blur-md transition-all cursor-pointer group hover:scale-105"
        >
          <ArrowUp className="w-5 h-5 text-amber-800 group-hover:-translate-y-0.5 transition-transform" />
          <span className="sr-only">Scroll to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
