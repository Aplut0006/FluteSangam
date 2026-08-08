// Utility functions for FluteSangam audio playback

/**
 * Plays the authentic 'Tak tak' square-wave metronome voice click.
 * Used consistently across Alankar Practice, Alankar Generator, and all Raga pages.
 * 
 * @param ctx AudioContext instance
 * @param isAccent true for Sam / Beat 1 ('Tak' - higher pitch C6), false for other beats ('tak' - lower pitch C5)
 */
export function playTakMetronomeClick(ctx: AudioContext, isAccent: boolean): void {
  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Square wave gives the crisp woodblock "Tak tak" metronome voice
    osc.type = 'square';
    
    // High pitch "Tak" for Beat 1 / Sam (C6 = 1046.5 Hz), regular "tak" for other beats (C5 = 523.25 Hz)
    osc.frequency.setValueAtTime(isAccent ? 1046.5 : 523.25, ctx.currentTime);

    // Fast 1ms attack and crisp exponential decay
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Gracefully handle any web audio browser restrictions
  }
}
