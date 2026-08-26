import React, { useEffect, useState } from 'react';
import { ShoppingCart, Music, CheckCircle2, AlertTriangle, HelpCircle, Info, ChevronDown } from 'lucide-react';
import { AppView } from '../types';

interface BudgetFlutesViewProps {
  onViewChange: (view: AppView) => void;
}

const BudgetFlutesView: React.FC<BudgetFlutesViewProps> = ({ onViewChange }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is a cheap flute good for beginners?",
      a: "A budget flute can be suitable for someone who is just starting and cannot afford a professionally tuned instrument. It can help you learn basic blowing, fingering, and sargam. However, quality varies significantly between inexpensive flutes, so check reviews and construction carefully."
    },
    {
      q: "Should I buy a bamboo or PVC flute?",
      a: "We generally recommend bamboo if you can find a reasonably good-quality flute within your budget. If bamboo is not affordable, a PVC flute can also be used to start learning. The most important thing at the beginning is developing your ability to produce and control the notes."
    },
    {
      q: "Can I learn Sa Re Ga Ma on a budget flute?",
      a: "Yes. You can use a budget flute to practice basic notes and sargam. Once you become comfortable with the fundamentals, you can move to a better-quality flute for more accurate and advanced practice."
    },
    {
      q: "Are cheap flutes properly tuned?",
      a: "Not necessarily. Some budget flutes can be reasonably usable, while others may have significant tuning problems. Even when a product listing mentions a specific scale or key, you should not automatically assume that every note is perfectly tuned. Check user reviews and, if possible, test the flute before relying on it for serious musical practice."
    },
    {
      q: "Should I buy a G Base or E Base flute because it is available cheaply?",
      a: "Not necessarily. A larger flute is not automatically better simply because it is being sold cheaply. G Base and E Base flutes can require more finger reach and breath control. Choose a flute that is comfortable for your hands and appropriate for your current playing ability."
    },
    {
      q: "How much should I spend on my first flute?",
      a: "There is no single correct amount. If you are unsure whether you will continue learning, starting with an inexpensive flute can be reasonable. Once you know that you enjoy playing and are practicing regularly, you can invest in a better-quality and professionally tuned instrument."
    },
    {
      q: "How do I know whether a budget flute is good?",
      a: "Look for: Good user reviews, consistent construction, comfortable hole spacing, proper finishing, no obvious cracks or damage, reasonable sound quality, and reliable seller information. Remember that online product descriptions alone cannot guarantee tuning accuracy."
    },
    {
      q: "Can a beginner start with a PVC flute?",
      a: "Yes. PVC can be a practical alternative when a bamboo flute is outside your budget. It can allow a new player to learn basic blowing and fingering before investing in a better instrument."
    },
    {
      q: "Should I buy a flute online?",
      a: "You can buy a flute online, but pay close attention to the seller, reviews, product specifications, return policy, and customer feedback. If you have access to a knowledgeable flute player or teacher, getting their opinion before purchasing can also be helpful."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-200/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-full opacity-50 pointer-events-none -mr-10 -mt-10"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
              Buying Guide
            </span>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" /> Recommended
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bamboo-900 font-display leading-tight tracking-tight">
            Best Budget Flutes to Buy
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
            Learning the flute does not always require buying an expensive or professionally tuned instrument from the beginning. For someone who is just starting out and cannot yet afford a good-quality or professional flute, a budget flute can be a practical way to begin.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-5 text-gray-800 leading-relaxed text-[15px] sm:text-base">
        <p>
          These affordable flutes can help you develop the basic ability to produce a steady sound, understand fingering, and start practicing Sa Re Ga Ma and simple sargam patterns. Once you become comfortable with blowing and playing basic notes, you can consider moving to a better-quality, professionally tuned flute.
        </p>
        <p>
          On this page, we have selected budget-friendly flutes that can be considered by beginners who want to start their flute journey without making a large initial investment.
        </p>
        <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-xl">
          <p className="text-amber-900 text-sm font-semibold flex gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            Important: A budget flute should be considered a starting instrument. Its tuning, response, tone, and build quality may not be comparable to a professionally made flute.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-bamboo-900 font-display flex items-center gap-2">
          <Info className="w-6 h-6 text-amber-600" />
          Our Approach to Choosing a Budget Flute
        </h2>
        <div className="text-gray-700 space-y-4">
          <p>When choosing an affordable flute, price should not be the only consideration.</p>
          <p>A very cheap flute may look attractive because of its low price, but it may have problems such as:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-6">
            {['Uneven hole placement', 'Poor tuning', 'Difficult response', 'Air leakage', 'Rough finishing', 'Incorrect hole sizes', 'Difficulty producing certain notes', 'Inconsistent sound between different notes'].map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-rose-800 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100/50">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> {issue}
              </li>
            ))}
          </ul>
          <p className="font-medium text-bamboo-800">
            For this reason, we recommend looking at the overall construction and user feedback rather than simply choosing the cheapest flute available.
          </p>
        </div>
      </div>

      {/* Product Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-bamboo-900 font-display flex items-center gap-2 px-2">
          🏆 Best Budget Flutes/Bansuri (Under 500 rupees)
        </h2>
        <p className="px-2 text-gray-600 mb-4">Below are the budget flutes selected for beginners and those who want an affordable instrument for starting their practice.</p>
        
        {/* Foxit Bamboo */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100/60 shadow-md relative overflow-hidden transition hover:shadow-lg hover:border-emerald-200">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider z-10 shadow-sm">
            Best Bamboo Flute
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-emerald-50/50 rounded-2xl p-4 sm:p-6 border border-emerald-100/50">
               <img 
                 src="/foxit_flute_image.jpeg" 
                 alt="Foxit C Natural 7 Hole Bamboo Bansuri" 
                 className="w-full h-48 sm:h-56 object-contain rounded-xl bg-white p-2 border border-emerald-100 shadow-sm mb-4"
                 referrerPolicy="no-referrer"
               />
               <h3 className="text-xl font-bold text-center text-emerald-950 font-display leading-tight mb-2">Foxit C Natural 7 Hole 19 inch bansuri</h3>
               <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Scale: C Natural</span>
            </div>
            
            <div className="w-full md:w-2/3 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Best for</span>
                <p className="text-gray-800 font-medium">Beginners starting their flute journey</p>
              </div>
              
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-sm text-gray-700 italic">
                "We have personally used this flute for more than four years. It has been a good starting instrument for learning basic notes and sargam without spending a significant amount on a first flute."
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Why we recommend it</h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex gap-2"><span className="text-emerald-500">•</span> Affordable entry point</li>
                    <li className="flex gap-2"><span className="text-emerald-500">•</span> Suitable for initial practice</li>
                    <li className="flex gap-2"><span className="text-emerald-500">•</span> Bamboo material</li>
                    <li className="flex gap-2"><span className="text-emerald-500">•</span> Good tuning at this price</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Keep in mind</h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex gap-2"><span className="text-rose-400">•</span> Tuning may not be as consistent as pro flutes</li>
                    <li className="flex gap-2"><span className="text-rose-400">•</span> Quality can vary between instruments</li>
                    <li className="flex gap-2"><span className="text-rose-400">•</span> Flute may have natural bamboo marks</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href="https://www.amazon.in/Foxit-Musical-Natural-Hole-bansuri/dp/B08NJMS2MS?&linkCode=ll2&tag=flutesangam-21&linkId=5d9cefe4ba118cf6347d749668a0980e&ref_=as_li_ss_tl" 
                  target="_blank" 
                  rel="sponsored noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
                >
                  <span>🛒 Check on Amazon</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Radhe PVC */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100/60 shadow-md relative overflow-hidden transition hover:shadow-lg hover:border-indigo-200">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider z-10 shadow-sm">
            Best PVC Flute
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-indigo-50/50 rounded-2xl p-4 sm:p-6 border border-indigo-100/50">
               <img 
                 src="/radhe_flute_image.jpeg" 
                 alt="Radhe Flutes PVC Fiber C Natural Bansuri" 
                 className="w-full h-48 sm:h-56 object-contain rounded-xl bg-white p-2 border border-indigo-100 shadow-sm mb-4"
                 referrerPolicy="no-referrer"
               />
               <h3 className="text-xl font-bold text-center text-indigo-950 font-display leading-tight mb-2">Radhe Flutes PVC Fiber</h3>
               <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">Scale: C Natural</span>
            </div>
            
            <div className="w-full md:w-2/3 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">Best for</span>
                <p className="text-gray-800 font-medium">Beginners who want to use a PVC flute</p>
              </div>
              
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-sm text-gray-700 italic">
                "Good tuning, great for beginners. Those who want to use a PVC flute and cannot afford a Bamboo flute can buy this."
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-indigo-800 text-sm mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Why we recommend it</h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Quality of PVC material</li>
                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Tuning is great for the price</li>
                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Very durable (won't crack easily)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Keep in mind</h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex gap-2"><span className="text-rose-400">•</span> The cork may get displaced, but can be fixed</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href="https://www.amazon.in/Radhe-Flutes-Natural-Bansuri-Middle/dp/B07T35ZBHB?crid=DTQNXHD7Z4AL&dib=eyJ2IjoiMSJ9.ks2DwMeOQktxlABdLCZTkfghYoRzYJIwGsY7VyOL8XOpC_q4W-ILY3Qgq6mAGryKq54CSja7tnU-IArgFsA6WnI4btG-dmrZpFVHmIS2Sas4LuqUWyr8Bg_uJ_Uv4IMmg91O1_N46vXItaLb53UiopnbbzWt6IMxLwiL6TAo5Q6i8r0kw60_OCxANywxswTjq0Ayy4XMphr0TTeZgVd4Z50Nu-OjM_-PYS7lCN18touAp3p6sgSjJzCuWxuJe1n61GTR-eBoDi5PAvt2SIz4-K32dUBiZCq6AfbwBsauBDo.X4svHb3VfzZS_da7ZY95mAErx9U6eci2ansze-sAo9I&dib_tag=se&keywords=FLUTE&qid=1786786795&sprefix=flut%2Caps%2C336&sr=8-1-spons&aref=pD2PSarDRh&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=flutesangam-21&linkId=bea2451639fe6e8f2e654e798ac06ca3&ref_=as_li_ss_tl" 
                  target="_blank" 
                  rel="sponsored noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
                >
                  <span>🛒 Check on Amazon</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Bamboo vs PVC */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-bamboo-900 font-display">🎋 Bamboo or PVC Flute?</h3>
          <div className="text-sm text-gray-700 space-y-3">
            <p>Generally, we recommend starting with a bamboo flute when possible. It gives you the traditional playing experience and is the type of instrument most players eventually use.</p>
            <p>However, if a good bamboo flute is outside your budget, a PVC flute can also be fine for getting started. For a beginner, the most important thing is developing the ability to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Produce a clean sound</li>
              <li>Control the breath</li>
              <li>Cover the holes properly</li>
              <li>Practice Sa Re Ga Ma</li>
            </ul>
            <p>You don't need an expensive flute to develop these fundamentals.</p>
          </div>
        </div>

        {/* Hole Spacing */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-bamboo-900 font-display">🔎 Check Hole Spacing</h3>
          <div className="text-sm text-gray-700 space-y-3">
            <p>One useful thing to look at when buying a budget flute is the position and spacing of the finger holes.</p>
            <p>The holes should be positioned according to the intended scale. <strong>Do not assume</strong> that every flute will have the same spacing.</p>
            <p>If holes appear to be placed in an obviously uniform or mechanically even pattern (equal distances), be cautious. Traditional flute hole placement is acoustic, not simply dividing the flute evenly.</p>
            <p>Also consider whether the spacing is comfortable for your hands to avoid frustrating practice sessions.</p>
          </div>
        </div>
      </div>

      {/* What to check Checklist */}
      <div className="bg-bamboo-50/50 rounded-3xl p-6 sm:p-10 border border-bamboo-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-bamboo-900 font-display mb-8 text-center">
          🎯 What to Check Before Buying
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-bamboo-100 shadow-sm">
            <h4 className="font-bold text-bamboo-900 mb-2">1. Don't choose a large flute simply because it's cheap</h4>
            <p className="text-sm text-gray-700">Listings offering large G Base or E Base flutes at low prices shouldn't automatically be considered bargains for beginners. Larger flutes require difficult finger reach and more breath control. Choose what's appropriate for your physical comfort.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-bamboo-100 shadow-sm">
            <h4 className="font-bold text-bamboo-900 mb-2">2. Check reviews from actual users</h4>
            <p className="text-sm text-gray-700">Pay attention to comments about tuning, sound quality, cracks, hole finishing, air leakage, and whether notes match the advertised scale. Do not rely only on the product title.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-bamboo-100 shadow-sm">
            <h4 className="font-bold text-bamboo-900 mb-2">3. Advertised tuning may not tell the whole story</h4>
            <p className="text-sm text-gray-700">Budget flutes can have variations in pitch, octave accuracy, individual notes, and hole size. If 100% accurate tuning is vital, consider investing in a professionally made flute when budget allows.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-bamboo-100 shadow-sm">
            <h4 className="font-bold text-bamboo-900 mb-2">4. Check the material</h4>
            <p className="text-sm text-gray-700">For traditional bansuri, bamboo is recommended. However, PVC is a practical starting option when budget is the main concern. Don't reject a flute just because it's inexpensive if it helps you practice fundamentals.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-bamboo-100 shadow-sm">
            <h4 className="font-bold text-bamboo-900 mb-2">5. Make sure the flute is comfortable to hold</h4>
            <p className="text-sm text-gray-700">Consider overall length, finger-hole spacing, your hand size, and weight. A technically good flute is still a poor choice if you cannot comfortably cover the holes.</p>
          </div>
        </div>
      </div>

      {/* Upgrade Note */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/50 text-center">
        <h3 className="text-xl font-bold text-amber-900 font-display mb-3">🎵 When Should You Upgrade?</h3>
        <p className="text-sm text-amber-800 max-w-2xl mx-auto mb-4">
          You don't have to buy an expensive flute on your first day. A budget flute is enough to determine if you genuinely enjoy playing.
        </p>
        <p className="text-sm text-amber-800 font-medium">Consider upgrading when you can consistently:</p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {['Produce a clean sound', 'Play Sa Re Ga Ma', 'Control your breath', 'Play simple Alankars', 'Practice regularly'].map(t => (
            <span key={t} className="bg-white/60 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-200/60 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-bamboo-900 font-display mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-600" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`border rounded-xl transition-all ${openFaq === index ? 'border-amber-300 bg-amber-50/30' : 'border-stone-200 hover:border-amber-200'}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-stone-800 focus:outline-none"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${openFaq === index ? 'rotate-180 text-amber-600' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-stone-600 text-sm leading-relaxed border-t border-amber-100/50 mt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-lg font-bold text-stone-800 font-display">🪈 Ready to Choose?</h3>
        <p className="text-sm text-stone-600 max-w-2xl mx-auto">
          Start with something comfortable that allows you to develop basic sound and fingering. Once you master the fundamentals, move to a better-quality, professionally tuned flute.
        </p>
        <div className="border-t border-stone-200 pt-4 mt-6">
          <p className="text-xs text-stone-500 max-w-3xl mx-auto">
            <strong>Amazon Affiliate Disclosure:</strong> FluteSangam may earn a commission when you purchase qualifying products through links on this page. As an Amazon Associate I earn from qualifying purchases. Our recommendations help readers compare available options. Prices, availability, specifications, and reviews may change, so verify on the retailer's site before purchasing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetFlutesView;
