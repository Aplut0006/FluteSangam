import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { FAQ_DATA } from '../data/allFaqData';

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

export const FLUTE_PRACTICE_FAQS: FaqItem[] = [
  {
    q: '1. How long should I practice the flute every day?',
    a: (
      <span>
        For beginners, practicing the flute for <strong>20–30 minutes every day</strong> is a good starting point. As your breathing, tone, and finger control improve, you can gradually increase your practice to <strong>45–60 minutes or more</strong>. Regular daily practice is generally more effective than practicing for several hours only once or twice a week.
      </span>
    )
  },
  {
    q: '2. How can I improve my flute blowing technique?',
    a: (
      <span>
        Focus on producing a <strong>steady, controlled stream of air</strong> rather than blowing as hard as possible. Practice long, sustained notes and pay attention to your embouchure, air pressure, and tone. Start with comfortable notes and gradually practice across different octaves. Consistent slow practice can help develop better breath and sound control.
      </span>
    )
  },
  {
    q: '3. How can I produce a clear and stable sound on the bansuri?',
    a: (
      <span>
        Begin by practicing <strong>long notes at a comfortable volume</strong>. Keep your fingers positioned properly over the holes and maintain a steady airflow. Avoid excessive blowing, as too much air can make the sound harsh or unstable. Regular long-note practice can gradually improve your tone, stability, and control.
      </span>
    )
  },
  {
    q: '4. What flute exercises should beginners practice every day?',
    a: (
      <span>
        Beginners can include <strong>long notes, basic scales, note transitions, simple alankars, and breathing exercises</strong> in their daily practice. Start slowly and focus on producing clean notes rather than playing quickly. As your control improves, gradually increase the speed while maintaining accuracy and a consistent tone.
      </span>
    )
  },
  {
    q: '5. How can I improve my finger speed and accuracy on the flute?',
    a: (
      <span>
        Practice <strong>slow note patterns and alankars</strong> with a steady rhythm. Make sure every finger movement is relaxed and precise. Do not focus on speed at the beginning. Once you can play a pattern accurately at a slow tempo, gradually increase the speed. Regular practice will help develop coordination and finger control.
      </span>
    )
  },
  {
    q: '6. What are the best alankars for improving flute playing?',
    a: (
      <span>
        Alankars are excellent exercises for developing <strong>finger coordination, note accuracy, rhythm, and fluency</strong>. Beginners should start with simple ascending and descending note patterns and gradually move toward more complex combinations. Practice them slowly at first and use a metronome when possible to maintain consistent rhythm.
      </span>
    )
  },
  {
    q: '7. How should I practice scales and notes on the Indian flute?',
    a: (
      <span>
        Start by playing the basic notes slowly in <strong>ascending and descending order</strong>. Concentrate on clean transitions between notes and maintain a steady tone. Once the basic scale becomes comfortable, practice different note combinations and alankars. You can gradually increase the tempo while keeping your notes clear and accurate.
      </span>
    )
  },
  {
    q: '8. How can I improve my breath control while playing the flute?',
    a: (
      <span>
        Practice <strong>long, sustained notes</strong> and try to keep the sound steady from beginning to end. Take relaxed, deep breaths and avoid unnecessary tension in your shoulders and body. Over time, regular long-note practice, scales, and musical phrases can help you develop better breath management for playing the bansuri.
      </span>
    )
  },
  {
    q: '9. How long does it take to become good at playing the bansuri?',
    a: (
      <span>
        There is no fixed timeline because progress depends on your practice routine, consistency, guidance, and musical goals. With regular practice, a beginner can gradually develop basic sound production, fingering, and simple song-playing skills within the first few months. Becoming a confident and expressive bansuri player takes continued practice over a longer period.
      </span>
    )
  },
  {
    q: '10. What should I practice daily to improve my Indian classical flute playing?',
    a: (
      <span>
        A balanced practice session can include <strong>long notes, scales, alankars, breath control, raag practice, and musical phrases</strong>. Start slowly and focus on sound quality and accuracy before increasing speed. As you progress, spend more time practicing raagas, ornamentation, rhythm, and improvisation to develop your musical expression.
      </span>
    )
  }
];

import { AppView } from '../types';

interface FlutePracticeFaqSectionProps {
  onViewChange?: (view: AppView) => void;
}

export default function FlutePracticeFaqSection({ onViewChange }: FlutePracticeFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="frosted-panel rounded-2xl p-4 space-y-4 shadow-xs" id="community-tips-card">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h2 className="font-display font-bold text-bamboo-900 text-sm sm:text-base flex items-center gap-2 m-0">
          <HelpCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <span>Frequently Asked Questions About Flute Practice</span>
        </h2>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border border-amber-200">
          10 Q&amp;A
        </span>
      </div>

      <div className="space-y-2 min-h-[220px]">
        {FLUTE_PRACTICE_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                isOpen 
                  ? 'border-amber-300 bg-amber-50/40 shadow-2xs' 
                  : 'border-gray-200/80 bg-white hover:border-amber-200 hover:bg-gray-50/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-3 text-left font-bold text-bamboo-950 flex items-center justify-between gap-2.5 cursor-pointer select-none text-xs sm:text-sm leading-snug"
              >
                <span className={isOpen ? 'text-amber-950' : 'text-gray-800'}>
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-3 pb-3 pt-0 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-amber-200/40 mt-1">
                  <div className="pt-2 text-gray-600">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onViewChange && (
        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => onViewChange('flute_faq')}
            className="w-full py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Explore All {FAQ_DATA.length}+ Flute FAQs &amp; Help Center &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
