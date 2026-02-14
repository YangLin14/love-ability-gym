import React, { useState } from 'react';
import BackgroundBlobs from '../components/BackgroundBlobs';
import { ScreenType } from '../types';

interface QuickLogProps {
  onNavigate: (screen: ScreenType) => void;
}

const QuickLog: React.FC<QuickLogProps> = ({ onNavigate }) => {
  const [valence, setValence] = useState(2);

  const getValenceColor = (val: number) => {
    if (val > 0) return 'text-moss-dark';
    if (val < 0) return 'text-muted-rose';
    return 'text-soft-charcoal';
  };

  const getValenceDisplay = (val: number) => {
      if (val > 0) return `+${val}`;
      return val;
  }

  return (
    <div className="bg-cream text-soft-charcoal font-body min-h-screen relative overflow-hidden flex flex-col selection:bg-primary-light selection:text-moss-dark">
      <BackgroundBlobs />
      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-32">
        <header className="flex flex-col gap-2 p-6 pt-10">
          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('home')} className="p-2 rounded-full hover:bg-white/50 transition-colors text-moss-dark">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display italic text-2xl text-soft-charcoal drop-shadow-sm">
              Quick Awareness
            </h1>
            <div className="w-10"></div>
          </div>
          <p className="text-center text-moss-dark/70 text-sm mt-2">
            Pause. Breathe. Record.
          </p>
        </header>

        <section className="px-6 mb-8">
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
            <form className="flex flex-col gap-8">
              <div className="relative group">
                <label
                  className="block text-xs font-medium text-moss-dark uppercase tracking-wider mb-1"
                  htmlFor="time"
                >
                  Time
                </label>
                <input
                  className="soft-input w-full py-2 text-xl font-display text-soft-charcoal focus:outline-none bg-transparent placeholder-gray-400"
                  id="time"
                  name="time"
                  type="time"
                  defaultValue="14:30"
                />
              </div>
              <div className="relative group">
                <label
                  className="block text-xs font-medium text-moss-dark uppercase tracking-wider mb-1"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  className="soft-input w-full py-2 text-xl font-display text-soft-charcoal focus:outline-none bg-transparent placeholder-gray-400/60"
                  id="location"
                  name="location"
                  placeholder="Where are you?"
                  type="text"
                />
              </div>
              <div className="relative group">
                <label
                  className="block text-xs font-medium text-moss-dark uppercase tracking-wider mb-1"
                  htmlFor="event"
                >
                  Trigger / Event
                </label>
                <input
                  className="soft-input w-full py-2 text-xl font-display text-soft-charcoal focus:outline-none bg-transparent placeholder-gray-400/60"
                  id="event"
                  name="event"
                  placeholder="What just happened?"
                  type="text"
                />
              </div>
              <div className="relative group">
                <label
                  className="block text-xs font-medium text-moss-dark uppercase tracking-wider mb-1"
                  htmlFor="emotion"
                >
                  Primary Emotion
                </label>
                <input
                  className="soft-input w-full py-2 text-xl font-display text-soft-charcoal focus:outline-none bg-transparent placeholder-gray-400/60"
                  id="emotion"
                  name="emotion"
                  placeholder="Name the feeling..."
                  type="text"
                />
              </div>
            </form>
          </div>
        </section>

        <section className="px-6 mb-10">
          <div className="bg-white/60 rounded-2xl p-6 shadow-soft border border-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-medium text-moss-dark uppercase tracking-wider">
                Emotional Valence
              </span>
              <span className={`font-display text-2xl transition-colors ${getValenceColor(valence)}`}>
                {getValenceDisplay(valence)}
              </span>
            </div>
            <div className="relative w-full h-12 flex items-center justify-center">
              <div className="absolute w-full h-2 rounded-full slider-track"></div>
              <input
                className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                id="emotion-slider"
                max="10"
                min="-10"
                type="range"
                value={valence}
                onChange={(e) => setValence(parseInt(e.target.value))}
              />
              {/* Visual Thumb calculated via inline style */}
              <div
                className="absolute z-10 w-6 h-6 bg-white border-2 border-moss-dark rounded-full shadow-md pointer-events-none transition-all duration-100 ease-out"
                style={{
                  left: `${((valence + 10) / 20) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              ></div>
              <div className="w-full flex justify-between px-1 absolute top-6 mt-2">
                <span className="text-[10px] text-muted-rose font-medium">
                  -10
                </span>
                <span className="text-[10px] text-gray-400 font-medium">0</span>
                <span className="text-[10px] text-sage-green font-medium">
                  +10
                </span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6 italic">
              Slide to reflect your current state
            </p>
          </div>
        </section>

        <section className="px-6 pb-6">
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="font-display text-lg text-moss-dark">
              14-Day Trend
            </h3>
            <span className="text-xs text-primary font-medium flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">
                show_chart
              </span>
              Stabilizing
            </span>
          </div>
          <div className="h-24 w-full relative">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 50"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8fa889" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#8fa889" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                d="M0 50 L0 35 L7 38 L14 30 L21 32 L28 25 L35 28 L42 20 L50 25 L57 22 L64 28 L71 30 L78 20 L85 15 L92 18 L100 12 L100 50 Z"
                fill="url(#chartGradient)"
                stroke="none"
              ></path>
              <path
                d="M0 35 L7 38 L14 30 L21 32 L28 25 L35 28 L42 20 L50 25 L57 22 L64 28 L71 30 L78 20 L85 15 L92 18 L100 12"
                fill="none"
                stroke="#8fa889"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              ></path>
              <circle
                cx="100"
                cy="12"
                fill="#fff"
                r="2"
                stroke="#5e6b5c"
                strokeWidth="1.5"
              ></circle>
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
              <span>14 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </section>

        <div className="px-6 mt-4 flex justify-center">
          <button onClick={() => onNavigate('home')} className="w-full bg-moss-dark text-white font-display text-lg py-4 rounded-xl shadow-lg shadow-moss-dark/20 hover:bg-soft-charcoal transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">
              check_circle
            </span>
            Log Entry
          </button>
        </div>
      </div>

       {/* FAB for Log Screen as well? Design implies mostly Home, but let's keep SOS handy */}
       <div className="fixed bottom-24 right-6 z-30">
        <button
          onClick={() => onNavigate('crisis')}
          className="breathe-animation-button relative flex items-center justify-center size-14 rounded-full bg-soft-coral/90 backdrop-blur-md border border-white/40 text-white shadow-lg shadow-soft-coral/30 hover:bg-soft-coral transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl drop-shadow-md">
            sos
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuickLog;