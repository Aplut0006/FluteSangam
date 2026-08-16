import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Music, 
  ArrowRight, 
  ArrowLeftRight, 
  Copy, 
  Check, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  Share2,
  Trash2,
  Play,
  Square
} from 'lucide-react';
import { 
  ALL_FLUTE_KEYS, 
  PRIMARY_FLUTE_KEYS, 
  SWARA_DEFINITIONS, 
  WESTERN_PITCH_CLASSES,
  convertSwarasToWestern, 
  convertWesternToSwaras, 
  convertChangeFluteKey,
  getFluteKeyConfig,
  ConversionItem
} from '../utils/fluteConverterEngine';
import { playBambooFluteTone } from '../utils/fluteSynth';

type ConversionMode = 'swara_to_western' | 'western_to_swara' | 'change_flute_key';

interface Props {
  onNavigate?: (view: any) => void;
}

export const FluteNoteKeyConverterView: React.FC<Props> = ({ onNavigate }) => {
  // State
  const [mode, setMode] = useState<ConversionMode>('swara_to_western');
  const [fluteKey, setFluteKey] = useState<string>('C');
  const [targetFluteKey, setTargetFluteKey] = useState<string>('G');
  
  // Input states
  const [swaraInput, setSwaraInput] = useState<string>('Sa Re Ga Pa Dha Sa\'');
  const [westernInput, setWesternInput] = useState<string>('C D E G A C');
  const [changeKeyInput, setChangeKeyInput] = useState<string>('Sa Re Ga Pa Dha');
  
  // Feedback
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [showAdvancedKeys, setShowAdvancedKeys] = useState<boolean>(false);
  const [changeKeyPerspective, setChangeKeyPerspective] = useState<'relative_fingering' | 'constant_pitch'>('relative_fingering');
  const [changeKeyPadType, setChangeKeyPadType] = useState<'swaras' | 'western'>('swaras');
  const [changeKeyOutputNotation, setChangeKeyOutputNotation] = useState<'swaras' | 'western' | 'auto'>('auto');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopAudioRef = useRef<boolean>(false);

  // Effective output notation
  const effectiveOutputNotation = useMemo(() => {
    if (changeKeyOutputNotation !== 'auto') return changeKeyOutputNotation;
    return changeKeyPadType === 'western' ? 'western' : 'swaras';
  }, [changeKeyOutputNotation, changeKeyPadType]);

  // Initialize audio context lazily
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Conversions computation
  const swaraToWesternResult = useMemo(() => {
    return convertSwarasToWestern(swaraInput, fluteKey);
  }, [swaraInput, fluteKey]);

  const westernToSwaraResult = useMemo(() => {
    return convertWesternToSwaras(westernInput, fluteKey);
  }, [westernInput, fluteKey]);

  const changeKeyResult = useMemo(() => {
    return convertChangeFluteKey(changeKeyInput, fluteKey, targetFluteKey, effectiveOutputNotation);
  }, [changeKeyInput, fluteKey, targetFluteKey, effectiveOutputNotation]);

  // Current active result
  const currentResultItems: ConversionItem[] = useMemo(() => {
    if (mode === 'swara_to_western') {
      return swaraToWesternResult.items;
    } else if (mode === 'western_to_swara') {
      return westernToSwaraResult.items;
    } else {
      return changeKeyPerspective === 'relative_fingering' 
        ? changeKeyResult.relativeFingeringResult.items 
        : changeKeyResult.constantPitchResult.items;
    }
  }, [mode, swaraToWesternResult, westernToSwaraResult, changeKeyResult, changeKeyPerspective]);

  const currentInvalidTokens = useMemo(() => {
    if (mode === 'swara_to_western') return swaraToWesternResult.invalidTokens;
    if (mode === 'western_to_swara') return westernToSwaraResult.invalidTokens;
    return changeKeyResult.relativeFingeringResult.invalidTokens;
  }, [mode, swaraToWesternResult, westernToSwaraResult, changeKeyResult]);

  // Copy to clipboard
  const handleCopyResult = () => {
    let textToCopy = '';
    if (mode === 'swara_to_western') {
      textToCopy = `Flute (${fluteKey}):\nInput Swaras: ${swaraToWesternResult.summaryInput}\nWestern Notes: ${swaraToWesternResult.summaryOutput}`;
    } else if (mode === 'western_to_swara') {
      textToCopy = `Flute (${fluteKey}):\nWestern Notes: ${westernToSwaraResult.summaryInput}\nIndian Swaras: ${westernToSwaraResult.summaryOutput}`;
    } else {
      const activeRes = changeKeyPerspective === 'relative_fingering' 
        ? changeKeyResult.relativeFingeringResult 
        : changeKeyResult.constantPitchResult;

      textToCopy = `From ${fluteKey} Flute to ${targetFluteKey} Flute (${effectiveOutputNotation === 'western' ? 'Western Notes' : 'Indian Swaras'}):\nInput: ${activeRes.summaryInput}\nConverted Output (${
        changeKeyPerspective === 'relative_fingering' ? 'Same Fingering' : 'Constant Pitch'
      }): ${activeRes.summaryOutput}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Swap Flute Keys
  const handleSwapKeys = () => {
    const temp = fluteKey;
    setFluteKey(targetFluteKey);
    setTargetFluteKey(temp);
  };

  // Clear current input
  const handleClear = () => {
    if (mode === 'swara_to_western') setSwaraInput('');
    else if (mode === 'western_to_swara') setWesternInput('');
    else setChangeKeyInput('');
  };

  // Reset to default
  const handleReset = () => {
    setFluteKey('C');
    setTargetFluteKey('G');
    setSwaraInput('Sa Re Ga Pa Dha Sa\'');
    setWesternInput('C D E G A C');
    setChangeKeyInput(changeKeyPadType === 'western' ? 'C D E G A' : 'Sa Re Ga Pa Dha');
  };

  // Add token via button click
  const handleAddSwaraToken = (token: string) => {
    if (mode === 'swara_to_western') {
      setSwaraInput(prev => (prev.trim() ? `${prev.trim()} ${token}` : token));
    } else if (mode === 'change_flute_key') {
      setChangeKeyInput(prev => (prev.trim() ? `${prev.trim()} ${token}` : token));
    }
  };

  const handleAddWesternToken = (token: string) => {
    if (mode === 'western_to_swara') {
      setWesternInput(prev => (prev.trim() ? `${prev.trim()} ${token}` : token));
    } else if (mode === 'change_flute_key') {
      setChangeKeyInput(prev => (prev.trim() ? `${prev.trim()} ${token}` : token));
    }
  };

  // Play audio preview
  const handlePlaySequence = async () => {
    if (isPlayingAudio) {
      stopAudioRef.current = true;
      setIsPlayingAudio(false);
      setActiveNoteIndex(null);
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    stopAudioRef.current = false;
    setIsPlayingAudio(true);

    const items = currentResultItems;
    if (items.length === 0) {
      setIsPlayingAudio(false);
      return;
    }

    const noteDuration = 0.55; // seconds per note
    const now = ctx.currentTime;

    for (let i = 0; i < items.length; i++) {
      if (stopAudioRef.current) break;
      
      const item = items[i];
      setActiveNoteIndex(i);

      if (item.frequency) {
        playBambooFluteTone(ctx, item.frequency, ctx.currentTime, noteDuration, 0.32);
      }

      await new Promise(resolve => setTimeout(resolve, noteDuration * 850));
    }

    setIsPlayingAudio(false);
    setActiveNoteIndex(null);
  };

  // Presets
  const SWARA_PRESETS = [
    { label: 'Sargam (Bilawal)', value: 'Sa Re Ga Ma Pa Dha Ni Sa\'' },
    { label: 'Raag Bhoopali', value: 'Sa Re Ga Pa Dha Sa\'' },
    { label: 'Raag Yaman', value: 'Sa Re Ga M\' Pa Dha Ni Sa\'' },
    { label: 'Raag Bhairav', value: 'Sa r Ga Ma Pa d Ni Sa\'' },
    { label: 'Raag Kafi', value: 'Sa Re g Ma Pa Dha n Sa\'' },
    { label: 'Raag Malkauns', value: 'Sa g Ma d n Sa\'' },
  ];

  const WESTERN_PRESETS = [
    { label: 'C Major Scale', value: 'C D E F G A B C' },
    { label: 'Pentatonic Major', value: 'C D E G A C' },
    { label: 'D Natural Scale', value: 'D E F# G A B C# D' },
    { label: 'G Major Scale', value: 'G A B C D E F# G' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-gray-800 pb-20">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-b from-bamboo-950 via-bamboo-900 to-bamboo-800 text-amber-50 pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden border-b border-amber-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            FluteSangam Interactive Musical Utility
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            Flute Note & Key Converter
          </h1>
          
          <p className="text-amber-200/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Convert Indian swaras and Western notes between different flute keys.
          </p>
        </div>
      </div>

      {/* Main Interactive Tool Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Tool Shell */}
        <div className="bg-white rounded-3xl shadow-xl border border-bamboo-100 p-5 sm:p-8 space-y-6">
          
          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-stone-100 rounded-2xl gap-1.5 border border-stone-200/80">
            <button
              onClick={() => setMode('swara_to_western')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'swara_to_western'
                  ? 'bg-bamboo-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-bamboo-900 hover:bg-stone-200/60'
              }`}
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>Swaras → Western Notes</span>
            </button>

            <button
              onClick={() => setMode('western_to_swara')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'western_to_swara'
                  ? 'bg-bamboo-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-bamboo-900 hover:bg-stone-200/60'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Western Notes → Swaras</span>
            </button>

            <button
              onClick={() => setMode('change_flute_key')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'change_flute_key'
                  ? 'bg-bamboo-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-bamboo-900 hover:bg-stone-200/60'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>Change Flute Key</span>
            </button>
          </div>

          {/* Flute Key Controls Bar */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Primary Flute Key Dropdown */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label htmlFor="flute-key-select" className="text-xs sm:text-sm font-bold text-bamboo-950 flex items-center gap-1.5 whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                {mode === 'change_flute_key' ? 'From Flute Key:' : 'My Flute Key:'}
              </label>

              <div className="relative w-full sm:w-auto">
                <select
                  id="flute-key-select"
                  value={fluteKey}
                  onChange={(e) => setFluteKey(e.target.value)}
                  className="w-full sm:w-48 bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-bamboo-900 shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer appearance-none pr-9"
                >
                  <optgroup label="Popular Flute Keys">
                    {PRIMARY_FLUTE_KEYS.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.name} (Sa = {k.key})
                      </option>
                    ))}
                  </optgroup>
                  {showAdvancedKeys && (
                    <optgroup label="Chromatic & Altered Keys">
                      {ALL_FLUTE_KEYS.filter(k => k.category === 'chromatic').map((k) => (
                        <option key={k.key} value={k.key}>
                          {k.name} (Sa = {k.key})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-amber-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {!showAdvancedKeys && (
                <button
                  type="button"
                  onClick={() => setShowAdvancedKeys(true)}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                >
                  Show all 12 keys
                </button>
              )}
            </div>

            {/* Target Flute Key (Only for 'Change Flute Key' mode) */}
            {mode === 'change_flute_key' && (
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={handleSwapKeys}
                  title="Swap Source and Target Keys"
                  className="hidden sm:flex p-2.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-xl text-amber-900 transition shadow-xs cursor-pointer items-center justify-center"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                <label htmlFor="target-flute-key-select" className="text-xs sm:text-sm font-bold text-bamboo-950 flex items-center gap-1.5 whitespace-nowrap">
                  To Flute Key:
                </label>

                <div className="relative w-full sm:w-auto">
                  <select
                    id="target-flute-key-select"
                    value={targetFluteKey}
                    onChange={(e) => setTargetFluteKey(e.target.value)}
                    className="w-full sm:w-48 bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-bamboo-900 shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer appearance-none pr-9"
                  >
                    <optgroup label="Popular Flute Keys">
                      {PRIMARY_FLUTE_KEYS.map((k) => (
                        <option key={k.key} value={k.key}>
                          {k.name} (Sa = {k.key})
                        </option>
                      ))}
                    </optgroup>
                    {showAdvancedKeys && (
                      <optgroup label="Chromatic & Altered Keys">
                        {ALL_FLUTE_KEYS.filter(k => k.category === 'chromatic').map((k) => (
                          <option key={k.key} value={k.key}>
                            {k.name} (Sa = {k.key})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Quick Action Reset */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleReset}
                className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 transition flex items-center gap-1 cursor-pointer"
                title="Reset all settings"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Mode 1 & 3: Swaras / Western Notes Input Builder & Text Area */}
          {(mode === 'swara_to_western' || mode === 'change_flute_key') && (
            <div className="space-y-4">
              
              {/* Clickable Input Pad (Supports Swaras & Western Notes in Change Flute Key mode) */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-bamboo-900 uppercase tracking-wider flex items-center gap-1.5">
                    {mode === 'change_flute_key' && changeKeyPadType === 'western' ? (
                      <>
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        Click to Add Western Notes:
                      </>
                    ) : (
                      <>
                        <Music className="w-3.5 h-3.5 text-amber-600" />
                        Click to Add Swaras:
                      </>
                    )}
                  </span>

                  {mode === 'change_flute_key' ? (
                    <div className="flex items-center bg-stone-100 border border-stone-300 p-1 rounded-xl gap-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setChangeKeyPadType('swaras');
                          setChangeKeyOutputNotation('swaras');
                          if (changeKeyInput === 'C D E G A' || changeKeyInput === 'C D E G A C') {
                            setChangeKeyInput('Sa Re Ga Pa Dha');
                          }
                        }}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                          changeKeyPadType === 'swaras'
                            ? 'bg-bamboo-800 text-white shadow-xs'
                            : 'text-stone-700 hover:text-bamboo-900 hover:bg-stone-200/60'
                        }`}
                      >
                        <Music className="w-3 h-3" />
                        <span>Indian Swaras</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setChangeKeyPadType('western');
                          setChangeKeyOutputNotation('western');
                          if (changeKeyInput === 'Sa Re Ga Pa Dha' || changeKeyInput === "Sa Re Ga Pa Dha Sa'") {
                            setChangeKeyInput('C D E G A');
                          }
                        }}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                          changeKeyPadType === 'western'
                            ? 'bg-bamboo-800 text-white shadow-xs'
                            : 'text-stone-700 hover:text-bamboo-900 hover:bg-stone-200/60'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>Western Notes</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-500">
                      Natural (Shuddha) & Altered (Komal / Tivra)
                    </span>
                  )}
                </div>

                {/* Conditional Pad based on mode and selected pad type */}
                {mode === 'change_flute_key' && changeKeyPadType === 'western' ? (
                  <div className="space-y-2 bg-amber-50/40 p-3 rounded-2xl border border-amber-200/60">
                    <div className="text-[11px] text-amber-900/80 font-medium">
                      Enter notes on your <strong className="text-bamboo-950 font-bold">{fluteKey} Flute</strong>. The converter will transpose them to your <strong className="text-bamboo-950 font-bold">{targetFluteKey} Flute</strong>:
                    </div>

                    {/* Natural Western Notes */}
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => (
                        <button
                          key={note}
                          onClick={() => handleAddWesternToken(note)}
                          className="py-2.5 px-2 bg-white hover:bg-bamboo-600 hover:text-white text-bamboo-900 border border-bamboo-200 rounded-xl font-bold text-xs sm:text-sm transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                        >
                          <span>{note}</span>
                          <span className="text-[10px] opacity-70 font-normal">Natural</span>
                        </button>
                      ))}
                    </div>

                    {/* Accidentals Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {['C#', 'D#', 'F#', 'G#', 'A#'].map((note) => (
                        <button
                          key={note}
                          onClick={() => handleAddWesternToken(note)}
                          className="py-2 px-2 bg-amber-100 hover:bg-amber-600 hover:text-white text-amber-950 border border-amber-300 rounded-xl font-semibold text-xs transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                        >
                          <span className="font-bold">{note}</span>
                          <span className="text-[10px] opacity-75 font-normal">
                            {note === 'C#' ? 'Db' : note === 'D#' ? 'Eb' : note === 'F#' ? 'Gb' : note === 'G#' ? 'Ab' : 'Bb'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Shuddha Swara Row */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', 'Sa\''].map((swara) => (
                        <button
                          key={swara}
                          onClick={() => handleAddSwaraToken(swara)}
                          className="py-2.5 px-2 bg-bamboo-50 hover:bg-bamboo-600 hover:text-white text-bamboo-900 border border-bamboo-200 rounded-xl font-bold text-xs sm:text-sm transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                        >
                          <span>{swara}</span>
                          <span className="text-[10px] opacity-70 font-normal">Shuddha</span>
                        </button>
                      ))}
                    </div>

                    {/* Komal & Tivra Swara Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {[
                        { label: 'Komal Re', token: 'r', sub: 'Komal Re (r)' },
                        { label: 'Komal Ga', token: 'g', sub: 'Komal Ga (g)' },
                        { label: 'Tivra Ma', token: 'M\'', sub: 'Tivra Ma (M\')' },
                        { label: 'Komal Dha', token: 'd', sub: 'Komal Dha (d)' },
                        { label: 'Komal Ni', token: 'n', sub: 'Komal Ni (n)' },
                      ].map((item) => (
                        <button
                          key={item.token}
                          onClick={() => handleAddSwaraToken(item.token)}
                          className="py-2 px-2 bg-amber-100/70 hover:bg-amber-600 hover:text-white text-amber-950 border border-amber-300 rounded-xl font-semibold text-xs transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                        >
                          <span className="font-bold">{item.label}</span>
                          <span className="text-[10px] opacity-75 font-mono">{item.token}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Text Input & Quick Preset Selectors */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="swara-text-input" className="text-xs font-bold text-gray-700">
                    Or Type / Edit Sequence:
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Input</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    id="swara-text-input"
                    rows={2}
                    value={mode === 'swara_to_western' ? swaraInput : changeKeyInput}
                    onChange={(e) => {
                      if (mode === 'swara_to_western') setSwaraInput(e.target.value);
                      else setChangeKeyInput(e.target.value);
                    }}
                    placeholder={
                      mode === 'change_flute_key'
                        ? "e.g. Sa Re Ga Pa Dha or C D E G A (accepts both Swaras & Western notes)"
                        : "e.g. Sa Re Ga Ma Pa Dha Ni Sa' or r g M' d n"
                    }
                    className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-3.5 text-sm sm:text-base font-mono text-gray-800 focus:bg-white focus:border-bamboo-600 focus:outline-hidden transition shadow-inner"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-gray-500 mr-1">Quick Presets:</span>
                  {(mode === 'change_flute_key' && changeKeyPadType === 'western' ? WESTERN_PRESETS : SWARA_PRESETS).map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        if (mode === 'swara_to_western') setSwaraInput(p.value);
                        else setChangeKeyInput(p.value);
                      }}
                      className="text-xs bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium"
                    >
                      {p.label}
                    </button>
                  ))}
                  {mode === 'change_flute_key' && changeKeyPadType === 'swaras' && (
                    <button
                      onClick={() => {
                        setChangeKeyInput('Sa Re Ga Pa Dha');
                      }}
                      className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium"
                    >
                      Bhoopali (Sa Re Ga Pa Dha)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Western Notes Input Builder & Text Area */}
          {mode === 'western_to_swara' && (
            <div className="space-y-4">
              
              {/* Clickable Western Notes Pad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-bamboo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    Click to Add Western Notes:
                  </span>
                  <span className="text-[11px] text-gray-500">
                    12 Chromatic Pitch Classes
                  </span>
                </div>

                {/* Natural Western Notes */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => (
                    <button
                      key={note}
                      onClick={() => handleAddWesternToken(note)}
                      className="py-2.5 px-2 bg-bamboo-50 hover:bg-bamboo-600 hover:text-white text-bamboo-900 border border-bamboo-200 rounded-xl font-bold text-xs sm:text-sm transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                    >
                      <span>{note}</span>
                      <span className="text-[10px] opacity-70 font-normal">Natural</span>
                    </button>
                  ))}
                </div>

                {/* Accidentals Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {['C#', 'D#', 'F#', 'G#', 'A#'].map((note) => (
                    <button
                      key={note}
                      onClick={() => handleAddWesternToken(note)}
                      className="py-2 px-2 bg-amber-100/70 hover:bg-amber-600 hover:text-white text-amber-950 border border-amber-300 rounded-xl font-semibold text-xs transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                    >
                      <span className="font-bold">{note}</span>
                      <span className="text-[10px] opacity-75 font-normal">
                        {note === 'C#' ? 'Db' : note === 'D#' ? 'Eb' : note === 'F#' ? 'Gb' : note === 'G#' ? 'Ab' : 'Bb'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Area */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="western-text-input" className="text-xs font-bold text-gray-700">
                    Or Type / Edit Sequence:
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Input</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    id="western-text-input"
                    rows={2}
                    value={westernInput}
                    onChange={(e) => setWesternInput(e.target.value)}
                    placeholder="e.g. C D E F G A B C or C4 D4 E4 G4 A4"
                    className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-3.5 text-sm sm:text-base font-mono text-gray-800 focus:bg-white focus:border-bamboo-600 focus:outline-hidden transition shadow-inner"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-gray-500 mr-1">Quick Presets:</span>
                  {WESTERN_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setWesternInput(p.value)}
                      className="text-xs bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Invalid Tokens Alert */}
          {currentInvalidTokens.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Unrecognized notes ignored: </strong>
                <span className="font-mono bg-rose-100 px-1.5 py-0.5 rounded-md font-bold">
                  {currentInvalidTokens.join(', ')}
                </span>
                <p className="mt-1 text-rose-700/90 text-xs">
                  Tip: Use standard notation like <code>Sa, Re, Ga, Ma, Pa, Dha, Ni, r, g, M', d, n</code> or Western pitches <code>C, D, E, F, G, A, B, C#, Eb</code>.
                </p>
              </div>
            </div>
          )}

          {/* Perspective Sub-Toggle for Change Flute Key */}
          {mode === 'change_flute_key' && (
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-bamboo-950 uppercase tracking-wider block">
                Select Conversion Perspective:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChangeKeyPerspective('relative_fingering')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    changeKeyPerspective === 'relative_fingering'
                      ? 'bg-bamboo-50 border-bamboo-600 ring-2 ring-bamboo-500/20'
                      : 'bg-white border-stone-200 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-bamboo-900">
                      1. Same Note Fingering
                    </span>
                    {changeKeyPerspective === 'relative_fingering' && (
                      <span className="text-[10px] bg-bamboo-700 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-snug">
                    Keep your fingers playing the same finger positions. Shows what notes will actually sound on the new <strong>{targetFluteKey}</strong> flute.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setChangeKeyPerspective('constant_pitch')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    changeKeyPerspective === 'constant_pitch'
                      ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500/20'
                      : 'bg-white border-stone-200 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-950">2. Preserve Concert Pitch</span>
                    {changeKeyPerspective === 'constant_pitch' && (
                      <span className="text-[10px] bg-amber-700 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-snug">
                    Produce the exact same sound as the {fluteKey} flute. Shows what new notes/fingerings to play on the <strong>{targetFluteKey}</strong> flute.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Results Display Section */}
          <div className="border-t border-bamboo-100 pt-6 space-y-5">
            
            {/* Header / Summary Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold font-display text-bamboo-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Conversion Result
                </h3>
                <p className="text-xs text-gray-500">
                  {mode === 'swara_to_western' && `Indian Swaras → Western Pitch relative to ${fluteKey} Flute`}
                  {mode === 'western_to_swara' && `Western Notes → Indian Swaras relative to ${fluteKey} Flute`}
                  {mode === 'change_flute_key' && `${fluteKey} Flute → ${targetFluteKey} Flute (${changeKeyPerspective === 'relative_fingering' ? 'Same Fingering' : 'Constant Pitch'})`}
                </p>
              </div>

              {/* Action Buttons & Format Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                {mode === 'change_flute_key' && (
                  <div className="flex items-center bg-stone-100 border border-stone-200 p-1 rounded-xl gap-1 text-xs">
                    <span className="text-stone-500 font-bold px-1 text-[11px]">Result:</span>
                    <button
                      type="button"
                      onClick={() => setChangeKeyOutputNotation('western')}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center gap-1 ${
                        effectiveOutputNotation === 'western'
                          ? 'bg-bamboo-800 text-white shadow-xs'
                          : 'text-stone-700 hover:bg-stone-200/80'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Western</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChangeKeyOutputNotation('swaras')}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center gap-1 ${
                        effectiveOutputNotation === 'swaras'
                          ? 'bg-bamboo-800 text-white shadow-xs'
                          : 'text-stone-700 hover:bg-stone-200/80'
                      }`}
                    >
                      <Music className="w-3 h-3" />
                      <span>Swaras</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handlePlaySequence}
                  disabled={currentResultItems.length === 0}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingAudio ? 'Stop Sound' : 'Play Flute Audio'}</span>
                </button>

                <button
                  onClick={handleCopyResult}
                  disabled={currentResultItems.length === 0}
                  className="px-3.5 py-2 bg-bamboo-800 hover:bg-bamboo-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
                </button>
              </div>
            </div>

            {/* Sequence High-Level Strip */}
            {currentResultItems.length > 0 ? (
              <div className="bg-stone-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 font-mono shadow-inner border border-stone-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-stone-400 border-b border-stone-800 pb-2">
                  <span>Input:</span>
                  <span className="text-amber-400 font-bold">
                    {mode === 'swara_to_western'
                      ? swaraToWesternResult.summaryInput
                      : mode === 'western_to_swara'
                      ? westernToSwaraResult.summaryInput
                      : changeKeyPerspective === 'relative_fingering'
                      ? changeKeyResult.relativeFingeringResult.summaryInput
                      : changeKeyResult.constantPitchResult.summaryInput}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm sm:text-base font-bold">
                  <span className="text-stone-400 text-xs font-normal">Converted Output:</span>
                  <span className="text-emerald-400 text-base sm:text-lg tracking-wide">
                    {mode === 'swara_to_western' && swaraToWesternResult.summaryOutput}
                    {mode === 'western_to_swara' && westernToSwaraResult.summaryOutput}
                    {mode === 'change_flute_key' && (
                      changeKeyPerspective === 'relative_fingering'
                        ? changeKeyResult.relativeFingeringResult.summaryOutput
                        : changeKeyResult.constantPitchResult.summaryOutput
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
                Enter notes above or click the swara pads to view live conversion.
              </div>
            )}

            {/* Visual Conversion Cards Grid */}
            {currentResultItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {currentResultItems.map((item, idx) => {
                  const isActive = activeNoteIndex === idx;
                  return (
                    <div
                      key={`${item.inputLabel}-${idx}`}
                      className={`p-3.5 rounded-2xl border transition text-center flex flex-col items-center justify-between relative overflow-hidden ${
                        isActive
                          ? 'bg-amber-100 border-amber-500 shadow-md scale-105 ring-2 ring-amber-400'
                          : 'bg-stone-50/90 hover:bg-white border-stone-200 hover:border-bamboo-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Note Sequence Index */}
                      <span className="text-[9px] text-gray-400 font-bold absolute top-1.5 left-2">
                        #{idx + 1}
                      </span>

                      {/* Input Note Top */}
                      <div className="mt-1">
                        <span className="text-xs sm:text-sm font-bold text-gray-700 block">
                          {item.inputLabel}
                        </span>
                      </div>

                      {/* Arrow Divider */}
                      <div className="my-1.5 flex items-center justify-center text-amber-600">
                        <span className="text-xs font-black">↓</span>
                      </div>

                      {/* Converted Output Bottom */}
                      <div className="w-full bg-white rounded-xl py-1.5 px-2 border border-bamboo-200/80 shadow-2xs">
                        <span className="text-sm sm:text-base font-extrabold text-bamboo-900 block font-mono">
                          {item.outputLabel}
                        </span>
                      </div>

                      {/* Architectural Extensible Fingering Diagram Slot */}
                      {item.fingeringDiagramSlot && (
                        <div className="mt-2 pt-1 border-t border-stone-200/60 w-full flex items-center justify-center gap-0.5" title={`Bansuri holes indicator: ${item.fingeringDiagramSlot.holesClosed} closed`}>
                          {[...Array(6)].map((_, holeIdx) => {
                            const isClosed = holeIdx < (item.fingeringDiagramSlot?.holesClosed || 0);
                            return (
                              <span
                                key={holeIdx}
                                className={`w-1.5 h-1.5 rounded-full inline-block ${
                                  isClosed ? 'bg-bamboo-800' : 'border border-gray-400 bg-white'
                                }`}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Educational Information Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-bamboo-950">
            Understanding Flute Keys & Swara Conversion
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive guide to understanding Indian bansuri scales, tonic references, and Western musical notation.
          </p>
        </div>

        {/* 4 Core Educational Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: What is a Flute Key? */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bamboo-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-bamboo-900">
              What is a Flute Key?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              In the Indian bamboo flute (Bansuri) tradition, the <strong>key of the flute</strong> is designated by the fundamental pitch produced when the upper three finger holes are closed. In Hindustani classical music, this specific note is treated as <strong>Sa (Shadja)</strong>, serving as the master tonic and reference pitch for all other swaras.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              For instance, on a <strong>C Natural Flute</strong>, closing three holes sounds the pitch C (so Sa = C). On a <strong>G Flute</strong>, that exact same finger posture sounds the pitch G (so Sa = G).
            </p>
          </div>

          {/* Card 2: What are Sa, Re, Ga, Ma, Pa, Dha, Ni? */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bamboo-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-bamboo-900">
              What are Sa, Re, Ga, Ma, Pa, Dha, and Ni?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Indian classical music organizes pitch into a family of seven primary notes called the <strong>Saptak</strong>: <em>Shadja (Sa), Rishabh (Re), Gandhar (Ga), Madhyam (Ma), Pancham (Pa), Dhaivat (Dha), and Nishad (Ni)</em>.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              While <strong>Sa and Pa</strong> are fixed (Achala swaras), the remaining five swaras can be modified to create twelve chromatic semitones within the octave: four <strong>Komal</strong> (flat) swaras (Re, Ga, Dha, Ni) and one <strong>Tivra</strong> (sharp) swara (Ma).
            </p>
          </div>

          {/* Card 3: Indian Swaras vs Western Notes */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bamboo-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-bamboo-900">
              Indian Swaras vs Western Notes
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The crucial difference between Indian classical music and Western music lies in <strong>relative vs. absolute pitch</strong>:
            </p>
            <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
              <li><strong>Western notes</strong> (like C4 = 261.6 Hz or A4 = 440 Hz) represent fixed, absolute acoustic frequencies.</li>
              <li><strong>Indian swaras</strong> are relative solfège. Sa has no permanent fixed frequency—it adopts whichever pitch your chosen bansuri is tuned to!</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed pt-1">
              This converter bridges that gap by calculating exactly how relative swaras map to fixed Western notes depending on your bansuri’s tonic key.
            </p>
          </div>

          {/* Card 4: Why Flute Players Need a Note Converter */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bamboo-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-bamboo-900">
              Why Flute Players Need a Note Converter
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              A note converter solves multiple real-world challenges for bansuri players:
            </p>
            <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
              <li><strong>Collaborating with Keyboards & Guitars:</strong> Communicate chords and melody lines easily with bandmates playing Western instruments.</li>
              <li><strong>Learning from Sheet Music & Tutorials:</strong> Translate Western staff notation into clear Indian sargam fingering.</li>
              <li><strong>Transposing Across Flutes:</strong> Quickly know how a song will sound when switching from an E Bass flute to a C Medium flute.</li>
            </ul>
          </div>

        </div>

        {/* Master Quick-Reference Swara-to-Western Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-100 pb-4">
            <div>
              <h3 className="text-xl font-bold font-display text-bamboo-950">
                Master Swara-to-Western Quick Reference Table
              </h3>
              <p className="text-xs text-gray-600">
                Direct cross-key reference chart across popular bansuri keys (C, D, E, F, G, A).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-bamboo-900 text-white">
                  <th className="p-3 font-bold rounded-tl-xl">Indian Swara</th>
                  <th className="p-3 font-bold">Western Interval</th>
                  <th className="p-3 font-bold bg-bamboo-800">C Flute</th>
                  <th className="p-3 font-bold">D Flute</th>
                  <th className="p-3 font-bold">E Flute</th>
                  <th className="p-3 font-bold">F Flute</th>
                  <th className="p-3 font-bold">G Flute</th>
                  <th className="p-3 font-bold rounded-tr-xl">A Flute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  { swara: 'Sa', interval: 'Root (0)', c: 'C', d: 'D', e: 'E', f: 'F', g: 'G', a: 'A' },
                  { swara: 'Komal Re (r)', interval: 'Minor 2nd (+1)', c: 'C# / Db', d: 'D# / Eb', e: 'F', f: 'F# / Gb', g: 'G# / Ab', a: 'A# / Bb' },
                  { swara: 'Shuddha Re', interval: 'Major 2nd (+2)', c: 'D', d: 'E', e: 'F#', f: 'G', g: 'A', a: 'B' },
                  { swara: 'Komal Ga (g)', interval: 'Minor 3rd (+3)', c: 'D# / Eb', d: 'F', e: 'G', f: 'G# / Ab', g: 'A# / Bb', a: 'C' },
                  { swara: 'Shuddha Ga', interval: 'Major 3rd (+4)', c: 'E', d: 'F#', e: 'G#', f: 'A', g: 'B', a: 'C#' },
                  { swara: 'Shuddha Ma', interval: 'Perfect 4th (+5)', c: 'F', d: 'G', e: 'A', f: 'A# / Bb', g: 'C', a: 'D' },
                  { swara: 'Tivra Ma (M\')', interval: 'Aug 4th (+6)', c: 'F#', d: 'G#', e: 'A#', f: 'B', g: 'C#', a: 'D#' },
                  { swara: 'Pa', interval: 'Perfect 5th (+7)', c: 'G', d: 'A', e: 'B', f: 'C', g: 'D', a: 'E' },
                  { swara: 'Komal Dha (d)', interval: 'Minor 6th (+8)', c: 'G# / Ab', d: 'A# / Bb', e: 'C', f: 'C# / Db', g: 'D# / Eb', a: 'F' },
                  { swara: 'Shuddha Dha', interval: 'Major 6th (+9)', c: 'A', d: 'B', e: 'C#', f: 'D', g: 'E', a: 'F#' },
                  { swara: 'Komal Ni (n)', interval: 'Minor 7th (+10)', c: 'A# / Bb', d: 'C', e: 'D', f: 'D# / Eb', g: 'F', a: 'G' },
                  { swara: 'Shuddha Ni', interval: 'Major 7th (+11)', c: 'B', d: 'C#', e: 'D#', f: 'E', g: 'F#', a: 'G#' },
                ].map((row, rIdx) => (
                  <tr key={row.swara} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70 hover:bg-amber-50/50'}>
                    <td className="p-3 font-bold text-bamboo-950">{row.swara}</td>
                    <td className="p-3 text-stone-500 font-mono text-xs">{row.interval}</td>
                    <td className="p-3 font-bold text-bamboo-800 bg-bamboo-50/40">{row.c}</td>
                    <td className="p-3 text-stone-800">{row.d}</td>
                    <td className="p-3 text-stone-800">{row.e}</td>
                    <td className="p-3 text-stone-800">{row.f}</td>
                    <td className="p-3 text-stone-800">{row.g}</td>
                    <td className="p-3 text-stone-800">{row.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold font-display text-bamboo-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            Frequently Asked Questions on Flute Key Conversion
          </h3>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="border-b border-stone-200 pb-4">
              <h4 className="font-bold text-bamboo-900 mb-1">
                If I switch from a C flute to a G flute, do my fingerings change?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                If you play the exact same finger positions, your physical fingering remains identical, but the pitch that comes out of the flute will sound 7 semitones (a perfect 5th) higher. If you want to keep the song sounding at the exact same concert pitch as the C flute, you would use our "Preserve Concert Pitch" mode to calculate the new swara positions.
              </p>
            </div>

            <div className="border-b border-stone-200 pb-4">
              <h4 className="font-bold text-bamboo-900 mb-1">
                How do I know what key my bansuri is?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Close the top three finger holes on your bansuri and blow a clean, steady tone into our built-in Flute Tuner tool. The pitch detected (e.g., C4, E3, G3) is the fundamental key of your bansuri.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-bamboo-900 mb-1">
                Why is C Medium recommended for beginners over E Bass or G Base?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                A C Medium flute has moderate hole spacing and requires less breath volume, making it easy for beginners to seal all finger holes without straining their hands. As your finger reach and breath control improve, you can smoothly transition to larger Bass flutes like E or G.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Flute Note Converter – Swara, Notes & Flute Keys",
            "url": "https://flutesangam.com/tools/flute-note-key-converter",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "All",
            "description": "Convert flute notes, Indian swaras and different flute keys with this interactive FluteSangam tool. Useful for learning melodies, practice and music notation.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </div>
  );
};

export default FluteNoteKeyConverterView;
