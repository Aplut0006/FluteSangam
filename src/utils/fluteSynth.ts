// Realistic Bamboo Flute (Bansuri) Audio Synthesizer using Web Audio API

export const playBambooFluteTone = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.28
) => {
  try {
    // Master Gain for smooth natural breath envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, startTime);
    // Smooth breath ingress (attack ~ 90ms)
    masterGain.gain.linearRampToValueAtTime(volume, startTime + 0.09);
    masterGain.gain.setValueAtTime(volume, startTime + Math.max(0.1, duration - 0.12));
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // 1. Fundamental Oscillator (Pure sine base)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // 2. 2nd Harmonic (Warm tube body - octave above)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.22;

    // 3. 3rd Harmonic (Hollow bamboo resonance)
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(freq * 3, startTime);
    const gain3 = ctx.createGain();
    gain3.gain.value = 0.08;

    // 4. Subtle LFO (Human breath vibrato/tremolo ~ 4.8 Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4.8, startTime);
    lfoGain.gain.setValueAtTime(0, startTime);
    lfoGain.gain.setValueAtTime(0, startTime + 0.1);
    lfoGain.gain.linearRampToValueAtTime(freq * 0.009, startTime + 0.25); // gentle pitch warmth

    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);
    lfo.connect(osc3.frequency);

    // 5. Bamboo Tube Acoustic Resonance Filter
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(1600, startTime);
    bodyFilter.Q.setValueAtTime(1.8, startTime);

    // 6. Air/Breath Noise (Emulates blowing air across bamboo embouchure)
    const bufferSize = Math.floor(ctx.sampleRate * Math.min(duration, 2));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2200, startTime);
    noiseFilter.Q.setValueAtTime(2.2, startTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.015, startTime + 0.05); // subtle air chuff
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    osc1.connect(bodyFilter);
    osc2.connect(gain2);
    gain2.connect(bodyFilter);
    osc3.connect(gain3);
    gain3.connect(bodyFilter);

    bodyFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    lfo.start(startTime);
    noiseSource.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    osc3.stop(startTime + duration);
    lfo.stop(startTime + duration);
    noiseSource.stop(startTime + duration);
  } catch (err) {
    console.warn("Bamboo flute synthesis error", err);
  }
};
