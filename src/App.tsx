import { useState, useEffect } from 'react';
import AeroShards from './components/AeroShards';
import FallbackBackground from './components/FallbackBackground';
import ContestTimer from './components/ContestTimer';
import { Compass, Maximize2, Minimize2, Bell, BellOff } from 'lucide-react';

export default function App() {
  const [hasGpuError, setHasGpuError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignored if permissions not granted
    }
  };

  const logos = [
    { src: '/logos/logo3.png', alt: 'C3 Logo' },
    { src: '/logos/logo1.png', alt: 'IIT (ISM) Dhanbad Centenary Logo' },
    { src: '/logos/logo0.png', alt: 'Concetto Logo' },
    { src: '/logos/logo2.png', alt: 'NVCTI Logo' },
  ];

  return (
    <div className="relative h-screen max-h-screen w-full bg-[#0c0914] text-white selection:bg-purple-500/30 selection:text-amber-200 overflow-hidden flex flex-col justify-between">
      {/* Background Component Layer */}
      <div className="fixed inset-0 pointer-events-auto z-0">
        {!hasGpuError ? (
          <AeroShards
            backgroundColor="#0c0914"
            shardColor="#7C5295"
            accentColor="#E5B962"
            placement="full"
            flow="stream"
            material="chrome"
            detail="balanced"
            effect="none"
            scale={1}
            spread={1}
            depth={1}
            speed={0.8}
            spin={1}
            interaction="repel"
            density={1.4}
            shardSize={1.1}
            stretch={1}
            turbulence={1}
            glow={1.2}
            edgeSoftness={2}
            bloom={0.5}
            grain={0.04}
            chromaticAberration={0.007}
            transitionDuration={1}
            interactionRadius={1.5}
            interactionStrength={0.5}
            rippleIntensity={1}
            holdToGather
            paused={false}
            onError={() => setHasGpuError(true)}
          />
        ) : (
          <FallbackBackground />
        )}
      </div>

      {/* Ambient gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[#0c0914]/85 via-transparent to-[#0c0914]/90" />

      {/* Main Single Page Content */}
      <div className="relative z-10 flex flex-col h-full justify-between px-4 sm:px-8 py-3">
        {/* Top Header: 4 Logos EXACTLY CENTERED (No names, just logos) */}
        <header className="w-full pt-1 relative flex items-center justify-center">
          {/* Centered 4 Logos */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {logos.map((logo, idx) => (
              <div
                key={idx}
                className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-white flex items-center justify-center p-1 border-2 border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:scale-110 transition-transform duration-200"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Floating Stage Controls (top right corner, does not push logos off center) */}
          <div className="absolute top-1 right-0 flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all text-xs flex items-center justify-center cursor-pointer ${
                soundEnabled
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Stage Fullscreen Mode'}
              className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Central Stage Area: Title + Live Timer */}
        <main className="flex-1 flex flex-col items-center justify-center px-2 py-1 my-auto w-full">
          {/* Top Event Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase mb-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>CONCETTO '26 PRESENTS</span>
          </div>

          {/* Balanced LOGIC ODYSSEY Typography */}
          <div className="text-center w-full max-w-4xl mx-auto mb-3">
            {/* L O G I C */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-0.5">
              <div className="w-12 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-amber-400" />
              <h2 className="font-serif-title text-base sm:text-xl md:text-2xl font-bold tracking-[0.35em] sm:tracking-[0.5em] text-amber-200 uppercase drop-shadow-[0_2px_12px_rgba(232,193,114,0.4)]">
                LOGIC
              </h2>
              <div className="w-12 sm:w-24 h-[1px] bg-gradient-to-l from-transparent via-amber-400/70 to-amber-400" />
            </div>

            {/* ODYSSEY - Sized to fit perfectly and elegantly */}
            <h1 className="font-serif-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.08em] sm:tracking-[0.12em] gold-gradient-text drop-shadow-[0_10px_35px_rgba(217,180,110,0.4)] flex items-center justify-center leading-none select-none my-1">
              <span className="relative inline-flex items-center justify-center">
                <span>O</span>
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Compass className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 text-neutral-950 fill-amber-300 rotate-45 transform" />
                </span>
              </span>
              <span>DYSSEY</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-1 text-[11px] sm:text-xs md:text-sm font-mono uppercase tracking-[0.22em] text-neutral-300 font-medium">
              A ZIO-STYLE PEN & PAPER LOGIC CONTEST
            </p>

            {/* Motto */}
            <div className="mt-0.5 flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono tracking-[0.3em] text-amber-300/90 font-semibold">
              <span>THINK</span>
              <span className="text-amber-500/40">·</span>
              <span>REASON</span>
              <span className="text-amber-500/40">·</span>
              <span>SOLVE</span>
            </div>
          </div>

          {/* Central Live Contest Timer with Custom Time Input */}
          <ContestTimer soundEnabled={soundEnabled} />
        </main>

        {/* Footer Exactly as Originally Desired */}
        <footer className="w-full py-3 px-4 text-center text-xs text-neutral-400 font-mono backdrop-blur-md bg-black/50 border-t border-purple-500/15">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/logos/logo3.png"
                alt="C3 Logo"
                className="w-5 h-5 rounded-full object-contain bg-white p-0.5"
              />
              <span>COMPETITIVE CODING CLUB · IIT (ISM) DHANBAD</span>
            </div>
            <div className="text-amber-300/80">
              CONCETTO '26 ANNUAL TECHNO-MANAGEMENT FEST
            </div>
            <div className="text-neutral-500">
              © {new Date().getFullYear()} C3 · Think. Reason. Solve.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
