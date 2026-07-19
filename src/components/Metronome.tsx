import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Zap } from 'lucide-react';

export default function Metronome() {
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  const metronomeLoop = useRef<Tone.Loop | null>(null);
  const clickSynth = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    return () => {
      if (metronomeLoop.current) metronomeLoop.current.dispose();
      if (clickSynth.current) clickSynth.current.dispose();
    };
  }, []);

  const toggleMetronome = async () => {
    await Tone.start();
    if (!metronomePlaying) {
      if (!clickSynth.current) {
        clickSynth.current = new Tone.Synth({
            oscillator: { type: "square" },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
        }).toDestination();
      }
      
      Tone.Transport.bpm.value = bpm;
      let beat = 0;
      metronomeLoop.current = new Tone.Loop((time) => {
        const isAccent = beat === 0;
        clickSynth.current?.triggerAttackRelease(isAccent ? "C6" : "C5", "16n", time);
        beat = (beat + 1) % beatsPerMeasure;
        setCurrentBeat(beat);
      }, "4n").start(0);
      Tone.Transport.start();
      setMetronomePlaying(true);
    } else {
      Tone.Transport.stop();
      metronomeLoop.current?.dispose();
      metronomeLoop.current = null;
      setMetronomePlaying(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-bamboo-100 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-bamboo-800">
        <Zap className="w-4 h-4 text-amber-600" />
        <h3 className="font-bold text-sm">Metronome</h3>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-700">Beats:</label>
        <select
          value={beatsPerMeasure}
          onChange={(e) => setBeatsPerMeasure(parseInt(e.target.value))}
          className="p-1.5 bg-bamboo-50 rounded-lg text-xs"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(beat => <option key={beat} value={beat}>{beat}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => {
            const newBpm = parseInt(e.target.value);
            setBpm(newBpm);
            Tone.Transport.bpm.value = newBpm;
          }}
          className="w-full h-1.5 bg-bamboo-100 rounded-lg appearance-none cursor-pointer"
        />
        <span className="font-mono text-xs font-bold text-bamboo-900 w-12 text-right">{bpm} BPM</span>
      </div>
      <button 
        onClick={toggleMetronome}
        className={`w-full py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold ${metronomePlaying ? 'bg-amber-600 text-white' : 'bg-bamboo-700 text-white'}`}
      >
        {metronomePlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        {metronomePlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
