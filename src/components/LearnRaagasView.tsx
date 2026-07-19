import React, { useState } from 'react';
import { BookOpen, Filter, Music, Sun, Moon } from 'lucide-react';
import { LEARN_RAAGAS } from '../data/learnRaagasData';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export default function LearnRaagasView() {
  const [filter, setFilter] = useState<Difficulty>('Beginner');
  const raagas = LEARN_RAAGAS;

  const filteredRaagas = raagas.filter(r => r.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeIcon = (time: string) => {
    if (time.toLowerCase().includes('morning')) return <Sun className="w-4 h-4 text-amber-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-bamboo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-inner">
              <BookOpen className="w-7 h-7 text-indigo-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-bamboo-900 tracking-tight">
              Learn Raagas
            </h1>
          </div>

          <div className="prose prose-bamboo prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <p className="text-xl leading-relaxed text-gray-600 font-medium border-l-4 border-indigo-400 pl-6 py-2 italic">
                In Indian classical music, a Raaga (or Raga) is much more than a scale, a mode, or a melody. The word originates from the Sanskrit root Ranj, which means "to color the mind." Therefore, the truest definition of a Raaga is an acoustic framework that has the power to color the mind and evoke a specific emotional state (Rasa) in the listener.
              </p>
              <p className="mt-4">
                If a Western scale is a collection of bricks, a Raaga is the fully realized architectural blueprint of a house. It dictates not just which notes you can use, but exactly how you must approach them, sustain them, ornament them, and leave them.
              </p>
              <p>
                To understand a Raaga in deep detail, it must be broken down into its structural, technical, and aesthetic pillars.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-indigo-900">1. The Structural Grammar of a Raaga</h2>
              <p>Every Raaga operates under strict grammatical rules. A musician cannot simply play the notes randomly; they must adhere to the following elements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Aroha and Avroha (The Ascent and Descent):</strong> The linear path up the scale and back down. Crucially, they are not always symmetrical. For example, in Raag Yaman, you ascend using all seven notes, but in Raag Bhupali, you must strictly skip two notes (Ma and Ni) in both directions. In some Raags, the path is Vakra (zig-zag), meaning you must loop backward before moving forward.</li>
                <li><strong>Vadi (The King Note):</strong> The most heavily emphasized note in the Raaga. It is the sonic center of gravity. A musician will return to this note repeatedly, hold it the longest, and use it to anchor improvisations.</li>
                <li><strong>Samvadi (The Queen Note):</strong> The second most important note, typically a perfect fourth or fifth interval away from the Vadi. It creates a harmonic balance within the Raaga structure.</li>
                <li><strong>Pakad (The Signature Catchphrase):</strong> A distinct, brief sequence of notes that immediately reveals the identity of the Raaga. The moment a seasoned listener hears the Pakad, they know exactly which Raaga is being played, even before the main melody begins.</li>
                <li><strong>Varjit Swaras (Forbidden Notes):</strong> The notes that are strictly prohibited from being played. Omitting a single note completely alters the landscape of the scale.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-indigo-900">2. The Microtonal & Aesthetic Pillars</h2>
              <p>What separates a mechanical rendering of a scale from a soulful execution of a Raaga are the microtonal nuances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Shrutis (Microtones):</strong> While an octave contains 12 semi-tones (like a piano), Indian classical music recognizes 22 Shrutis (microtones). A Raaga dictates the exact microtonal pitch a note must take. For instance, the flat second (Komal Re) in a morning Raag like Todi is played much lower and closer to the base note Sa than the Komal Re in Raag Bhairav.</li>
                <li><strong>Alankars and Ornamentation:</strong> A note is almost never hit flat or isolated; it is approached with ornamentation.</li>
                <li><strong>Meend:</strong> A slow, continuous gliding sweep from one pitch to another without any break in the sound—a signature capability of the Bansuri and vocal music.</li>
                <li><strong>Andolan:</strong> A gentle, controlled oscillation or rocking wave on a specific note.</li>
                <li><strong>Kan Swara:</strong> Grace notes, where a primary note is briefly touched or framed by a neighboring note.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-indigo-900">3. The Time and Seasonal Cycle (Samay Chakra)</h2>
              <p>One of the most profound aspects of the Raaga system is its deep connection to nature and cosmology. Raags are assigned specific times of the day or seasons based on how their musical intervals mirror human circadian rhythms and shifting atmospheric energy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Prahar (Time Zones):</strong> The 24-hour day is divided into eight Prahars (3-hour shifts). Morning Raags (like Bhairav) use notes that evoke awakening, dawn, and meditation. Afternoon Raags (like Multani) handle tension and heat, while late-night Raags (like Darbari) use heavy, deep intervals that mirror darkness, gravity, and rest.</li>
                <li><strong>Seasonal Raags:</strong> Certain Raags are unbound by daily hours but are explicitly tied to seasons. Raag Miyan Malhar is played to evoke the power, thunder, and relief of the Monsoon rains. Raag Basant captures the vibrant, joyful energy of Spring.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-indigo-900">4. The Spiritual and Emotional End: Rasa</h2>
              <p>Ultimately, the structural rules exist purely to serve the Rasa (the emotional essence). According to ancient Indian dramaturgy, there are nine primary emotions (Navarasa), such as Shanti (peace), Shringar (romance/love), Karuna (pathos/sadness), and Veer (heroism/valor).</p>
              <p>A master classical musician uses the Raaga's grammar not as a restriction, but as a vehicle. By strictly living within the boundaries of a specific Raaga, the artist creates a concentrated emotional atmosphere, guiding both themselves and the listener into a deep, shared meditative state.</p>
            </section>

            <hr className="border-indigo-100" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Filter className="w-5 h-5 text-indigo-500" />
                <span>Filter by Difficulty:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      filter === level
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 mt-8">
              {filteredRaagas.map((raaga, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <h3 className="text-2xl font-bold font-display text-bamboo-900 m-0 flex items-center gap-2">
                      <Music className="w-5 h-5 text-indigo-600" />
                      {raaga.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelColor(raaga.level)} self-start sm:self-auto`}>
                      {raaga.level}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-1 mb-4">
                    {getTimeIcon(raaga.time)}
                    <span>{raaga.time}</span>
                  </p>

                  <div className="space-y-3 text-sm border-t border-b border-gray-100 py-4 mb-4">
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-3 text-gray-500 font-medium">Aaroh:</span>
                      <span className="col-span-9 font-semibold text-bamboo-800">{raaga.aaroh}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-3 text-gray-500 font-medium">Avroh:</span>
                      <span className="col-span-9 font-semibold text-bamboo-800">{raaga.avroh}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-3 text-gray-500 font-medium">Vadi / Samvadi:</span>
                      <span className="col-span-9 font-semibold text-amber-800">{raaga.vadi} / {raaga.samvadi}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-3 text-gray-500 font-medium">Pakad:</span>
                      <span className="col-span-9 italic text-bamboo-700 font-medium">"{raaga.pakad}"</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-700 uppercase block">The Mood (Rasa)</span>
                    <p className="text-sm font-semibold text-gray-700">{raaga.mood}</p>
                  </div>

                  <p className="text-gray-600 m-0 leading-relaxed text-base">
                    {raaga.description}
                  </p>
                </div>
              ))}
            </div>
            
            {filteredRaagas.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No raagas found for this difficulty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
