import React, { useState } from 'react';

interface CrisisModeProps {
  onExit: () => void;
}

const CrisisMode: React.FC<CrisisModeProps> = ({ onExit }) => {
    const [step, setStep] = useState(0);

    // Simple visual change for demo, though CSS animation handles the loop
    // In a real app we might time the text change with the CSS animation exactly.
    // For now we trust the static text from the design: "Inhale..."

  return (
    <div className="bg-dm-blue-mist font-display h-screen w-full overflow-hidden flex flex-col items-center relative text-dm-text-soft selection:bg-dm-primary selection:text-white">
      <div className="absolute inset-0 z-0 bg-calm-gradient opacity-100"></div>
      <div
        className="absolute inset-0 z-0 opacity-[0.02] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3qWocmFJ5o_9B9shbbH5qdWNbUahBgB5roAGwoySMCF0emS0YT9PrVeqG_5u7no1lZf5t8XbEl7Wwzykch9SZo0a_tD1LteDXVstGfUI4fc-DNDXLyVSsDzfKJzqvLkBWfh8N5gFlPjerSKa6Nld7KAtcXtOKDIybYwT2UgcEwELZ3XgSNcjYwppdW5smYPcGIkfcrEuaAD9dNBmtRdeUfzsTVhOFWZ2ClLulhKAWpeLGNGjVJ2Y-8M2CHF6lNuBbQnoB9Fa3czhh')",
        }}
      ></div>

      {/* Top Bar */}
      <div className="relative z-20 w-full flex items-center justify-between p-6 pt-12 safe-top">
        <button
          onClick={onExit}
          aria-label="Settings"
          className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors text-dm-text-muted hover:text-dm-text-soft"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/20 backdrop-blur-sm shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-dm-primary animate-pulse">
            spa
          </span>
          <span className="text-xs font-medium tracking-wider text-dm-text-soft uppercase">
            Crisis Mode Active
          </span>
        </div>
        <button
          aria-label="Toggle Haptics"
          className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors text-dm-text-muted hover:text-dm-text-soft"
        >
          <span className="material-symbols-outlined text-[24px]">vibration</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center -mt-10">
        <div className="relative flex items-center justify-center size-[320px] sm:size-[400px]">
          <div className="absolute inset-0 rounded-full border border-dm-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute inset-4 rounded-full border border-dm-primary/10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
          
          <div className="relative z-10 flex items-center justify-center">
            <div className="size-48 sm:size-56 rounded-full bg-gradient-to-br from-dm-glow-start to-dm-glow-end backdrop-blur-xl border border-white/50 shadow-[0_0_60px_-10px_rgba(139,157,195,0.3)] animate-breathe flex items-center justify-center">
              <div className="size-full rounded-full bg-white/30 blur-md"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <h1 className="text-4xl md:text-5xl font-light italic text-dm-text-soft drop-shadow-sm tracking-wide mb-2 transition-all duration-1000">
                Inhale...
              </h1>
              <div className="flex flex-col items-center gap-1 opacity-80">
                <span className="text-sm uppercase tracking-[0.2em] font-medium text-dm-primary">
                  Nose
                </span>
                <span className="text-xs text-dm-text-muted font-serif italic">
                  4 seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center px-6 max-w-md animate-pulse">
          <p className="text-lg md:text-xl text-dm-text-soft/80 font-normal leading-relaxed">
            Focus only on the circle.<br />
            <span className="italic text-dm-primary">
              Let your anxiety dissolve with each breath.
            </span>
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 w-full p-8 pb-12 flex flex-col items-center gap-6 safe-bottom">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-dm-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-dm-text-soft/20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-dm-text-soft/20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-dm-text-soft/20"></div>
        </div>
        <button onClick={onExit} className="group relative flex items-center justify-center px-8 py-3 rounded-xl bg-white/40 hover:bg-white/60 border border-white/40 shadow-sm transition-all duration-300 w-full max-w-[280px]">
          <div className="absolute inset-0 rounded-xl bg-dm-primary/0 group-hover:bg-dm-primary/5 transition-colors duration-500"></div>
          <span className="material-symbols-outlined mr-2 text-dm-text-muted group-hover:text-dm-text-soft transition-colors">
            check_circle
          </span>
          <span className="text-base font-medium text-dm-text-soft group-hover:text-dm-text-soft tracking-wide">
            I'm feeling grounded
          </span>
        </button>
        <p className="text-xs text-dm-text-muted/60 font-light">
          The Love Ability Gym
        </p>
      </div>
    </div>
  );
};

export default CrisisMode;