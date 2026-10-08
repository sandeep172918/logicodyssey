import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Plus, Minus, AlertTriangle, Sparkles, Settings2, Check } from 'lucide-react';

interface ContestTimerProps {
  soundEnabled: boolean;
}

export default function ContestTimer({ soundEnabled }: ContestTimerProps) {
  // Duration in seconds (default 90 mins = 5400s)
  const [totalSeconds, setTotalSeconds] = useState<number>(90 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(90 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Custom input state (in minutes)
  const [customMinutes, setCustomMinutes] = useState<string>('90');
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Audio synthesizer using Web Audio API
  const playChime = (type: 'start' | 'warning' | 'finish') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'finish') {
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      }
    } catch {
      // AudioContext policy
    }
  };

  // Countdown timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime('finish');
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#E8C172', '#C084FC', '#FFFFFF'],
            });
            return 0;
          }

          if (prev === 10 * 60 || prev === 60) {
            playChime('warning');
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, soundEnabled]);

  const handleStartPause = () => {
    if (!isRunning) {
      if (remainingSeconds === 0) {
        setRemainingSeconds(totalSeconds);
      }
      setIsRunning(true);
      setHasStarted(true);
      playChime('start');
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = (durationSec = totalSeconds) => {
    setIsRunning(false);
    setHasStarted(false);
    setRemainingSeconds(durationSec);
  };

  const handleSetPreset = (minutes: number) => {
    const sec = minutes * 60;
    setTotalSeconds(sec);
    setCustomMinutes(String(minutes));
    handleReset(sec);
  };

  const handleApplyCustomMinutes = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseFloat(customMinutes);
    if (!isNaN(parsed) && parsed > 0) {
      const sec = Math.round(parsed * 60);
      setTotalSeconds(sec);
      handleReset(sec);
      setIsEditingCustom(false);
    }
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    setRemainingSeconds((prev) => Math.max(0, prev + deltaSeconds));
    setTotalSeconds((prev) => Math.max(0, prev + deltaSeconds));
  };

  // Format time units
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  const isTimeUp = remainingSeconds === 0 && hasStarted;
  const isLowTime = remainingSeconds > 0 && remainingSeconds <= 10 * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Main Glass Timer Box */}
      <div
        className={`w-full p-6 sm:p-8 rounded-3xl transition-all duration-500 relative overflow-hidden ${
          isTimeUp
            ? 'glass-panel border-red-500/60 shadow-[0_0_60px_rgba(239,68,68,0.35)]'
            : isLowTime
            ? 'glass-panel border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.25)]'
            : 'glass-panel-glow'
        }`}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            {isTimeUp ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-500/50 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                TIME UP — SUBMIT PAPERS
              </span>
            ) : isRunning ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                CONTEST RUNNING
              </span>
            ) : hasStarted ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40">
                PAUSED
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                READY TO START
              </span>
            )}
          </div>

          {/* Quick presets and custom trigger */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[90, 60, 45, 30].map((m) => (
              <button
                key={m}
                onClick={() => handleSetPreset(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  totalSeconds === m * 60 && !isEditingCustom
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                }`}
              >
                {m}m
              </button>
            ))}

            <button
              onClick={() => setIsEditingCustom(!isEditingCustom)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                isEditingCustom
                  ? 'bg-purple-500 text-white font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30'
              }`}
              title="Set Custom Minutes"
            >
              <Settings2 className="w-3 h-3" />
              <span>Custom</span>
            </button>
          </div>
        </div>

        {/* Custom Input Form (Visible when Custom is toggled) */}
        {isEditingCustom && (
          <form
            onSubmit={handleApplyCustomMinutes}
            className="mb-4 p-3 rounded-2xl bg-black/60 border border-amber-500/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1"
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-mono text-neutral-400">Set Minutes:</span>
              <input
                type="number"
                min="1"
                max="600"
                step="1"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                autoFocus
                placeholder="e.g. 75"
                className="w-24 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-amber-400 text-center"
              />
              <span className="text-xs font-mono text-neutral-400">mins ({Number(customMinutes || 0) * 60}s)</span>
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </form>
        )}

        {/* Giant Digits Display */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 my-2 text-center select-none">
          {/* Hours Block */}
          <div className="flex flex-col items-center">
            <div className="w-full py-4 sm:py-6 rounded-2xl bg-black/60 border border-white/10 shadow-inner backdrop-blur-md">
              <span className="font-mono-digits text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight gold-gradient-text drop-shadow-[0_4px_24px_rgba(232,193,114,0.3)]">
                {pad(hours)}
              </span>
            </div>
            <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest font-mono text-neutral-400">
              Hours
            </span>
          </div>

          {/* Minutes Block */}
          <div className="flex flex-col items-center">
            <div className="w-full py-4 sm:py-6 rounded-2xl bg-black/60 border border-white/10 shadow-inner backdrop-blur-md">
              <span className="font-mono-digits text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight gold-gradient-text drop-shadow-[0_4px_24px_rgba(232,193,114,0.3)]">
                {pad(minutes)}
              </span>
            </div>
            <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest font-mono text-neutral-400">
              Minutes
            </span>
          </div>

          {/* Seconds Block */}
          <div className="flex flex-col items-center">
            <div className="w-full py-4 sm:py-6 rounded-2xl bg-black/60 border border-white/10 shadow-inner backdrop-blur-md">
              <span
                className={`font-mono-digits text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight drop-shadow-[0_4px_24px_rgba(232,193,114,0.3)] ${
                  isTimeUp
                    ? 'text-red-500 animate-pulse'
                    : isLowTime
                    ? 'text-amber-300'
                    : 'gold-gradient-text'
                }`}
              >
                {pad(seconds)}
              </span>
            </div>
            <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest font-mono text-neutral-400">
              Seconds
            </span>
          </div>
        </div>

        {/* Minimal Clean Progress Bar without hardcoded labels */}
        <div className="mt-4 mb-2">
          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isTimeUp
                  ? 'bg-red-500'
                  : isLowTime
                  ? 'bg-gradient-to-r from-amber-500 to-red-500'
                  : 'bg-gradient-to-r from-purple-500 via-amber-400 to-amber-500'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-5 flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
          <button
            onClick={handleStartPause}
            className={`px-7 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 shadow-amber-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{hasStarted ? 'Resume' : 'Start Timer'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleReset()}
            className="px-4 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to selected duration"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => handleAdjustTime(5 * 60)}
            className="px-3.5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-mono flex items-center gap-1 transition-all cursor-pointer"
            title="Add 5 Minutes"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>5m</span>
          </button>

          <button
            onClick={() => handleAdjustTime(-5 * 60)}
            className="px-3.5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-mono flex items-center gap-1 transition-all cursor-pointer"
            title="Subtract 5 Minutes"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>5m</span>
          </button>
        </div>
      </div>
    </div>
  );
}
