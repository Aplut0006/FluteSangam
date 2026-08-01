import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Music, Zap, Volume2 } from 'lucide-react';
import Metronome from './Metronome';

export default function PracticeNowView() {
  const [tanpuraPlaying, setTanpuraPlaying] = useState(false);
  const [tanpuraPitch, setTanpuraPitch] = useState('E2');
  const [tanpuraVolume, setTanpuraVolume] = useState(-10);
  
  const tanpuraSynth = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    return () => {
      if (tanpuraSynth.current) tanpuraSynth.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (tanpuraSynth.current) {
        tanpuraSynth.current.volume.value = tanpuraVolume;
    }
  }, [tanpuraVolume]);

  const toggleTanpura = async () => {
    await Tone.start();
    if (!tanpuraPlaying) {
      if (!tanpuraSynth.current) {
        tanpuraSynth.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 1.0, decay: 0.5, sustain: 0.9, release: 3 }
        }).toDestination();
        tanpuraSynth.current.volume.value = tanpuraVolume;
      }
      tanpuraSynth.current.triggerAttack([tanpuraPitch, Tone.Frequency(tanpuraPitch).transpose(7).toNote()]);
      setTanpuraPlaying(true);
    } else {
      tanpuraSynth.current?.releaseAll();
      setTanpuraPlaying(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 rounded-3xl">
      <h2 className="text-2xl font-bold font-display text-bamboo-900">Practice Now</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tanpura Section */}
        <div className="bg-white p-6 rounded-2xl border border-bamboo-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bamboo-800">
            <Music className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold">Tanpura Drone</h3>
          </div>
          <select 
            value={tanpuraPitch}
            onChange={(e) => {
              setTanpuraPitch(e.target.value);
              if (tanpuraPlaying) {
                tanpuraSynth.current?.releaseAll();
                tanpuraSynth.current?.triggerAttack([e.target.value, Tone.Frequency(e.target.value).transpose(7).toNote()]);
              }
            }}
            className="w-full p-3 bg-bamboo-50 rounded-xl text-sm"
          >
            {['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2'].map(note => (
                <option key={note} value={note}>{note}</option>
            ))}
          </select>
          <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Volume:</label>
              <input 
                  type="range"
                  min="-40"
                  max="0"
                  value={tanpuraVolume}
                  onChange={(e) => setTanpuraVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-bamboo-100 rounded-lg appearance-none cursor-pointer"
              />
          </div>
          <button 
            onClick={toggleTanpura}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold ${tanpuraPlaying ? 'bg-amber-600 text-white' : 'bg-bamboo-700 text-white'}`}
          >
            {tanpuraPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {tanpuraPlaying ? 'Stop Drone' : 'Start Drone'}
          </button>
        </div>

        {/* Metronome Section */}
        <Metronome />
      </div>
    </div>
  );
}
