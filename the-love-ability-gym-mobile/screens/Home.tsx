import React from 'react';
import BackgroundBlobs from '../components/BackgroundBlobs';
import { ScreenType } from '../types';

interface HomeProps {
  onNavigate: (screen: ScreenType) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="bg-cream text-soft-charcoal font-body min-h-screen relative overflow-hidden flex flex-col selection:bg-primary-light selection:text-moss-dark">
      <BackgroundBlobs />

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Header */}
        <header className="flex flex-col gap-2 p-6 pt-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-moss-dark/70 text-sm font-medium tracking-wide uppercase">
                Tuesday, October 24
              </p>
              <h1 className="font-display italic text-4xl text-soft-charcoal leading-tight mt-1 drop-shadow-sm">
                Good Evening, <br />
                <span className="not-italic font-light text-moss-dark">Alex</span>
              </h1>
            </div>
            <div className="rounded-full p-1 bg-white shadow-soft">
              <div
                className="size-12 rounded-full bg-cover bg-center border border-moss-light"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDL0zLuKlWMkSp1uCjByzGsQQorkf0pb4lOyQ_hUD1gFDWPIPW5DtMDYW3SwqpyfM37Bfi0cwmf2gqIFmO_w3nkWdmpIVTVN4NGqvC4Aay1YjR8BIa3vr7JDQTQvmTnsH3SwnBkZoXNoAOZgojwVg3GMMfyfdmomuvI10tlCRvky539lLEGU_-9gbViCUlSvGg_4bm_6VK537KHz1Au8clSFCx0TnOTkw0-YRPZ7qf0dluGxWqaiJwae6S2GEBah9MjRTT9LwP_ALIE')",
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* Emotional Weather */}
        <section className="px-6 mb-8">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-light/20 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="font-display text-xl font-medium text-moss-dark flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    cloud_queue
                  </span>
                  Emotional Weather
                </h2>
                <p className="text-xs text-gray-500 mt-1 ml-1">Weekly Resonance</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display text-soft-charcoal">Trending Up</p>
                <p className="text-primary text-sm font-medium flex items-center justify-end gap-1 bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>{" "}
                  +15%
                </p>
              </div>
            </div>
            <div className="h-28 w-full relative flex items-end justify-between px-2 gap-3">
              {[40, 30, 55, 45, 60, 75, 85].map((height, i) => (
                <div
                    key={i}
                  className={`w-full rounded-t-lg relative transition-colors ${
                    i > 2 ? 'bg-primary-light/60 group-hover:bg-primary/40' : 'bg-moss-light group-hover:bg-primary-light/40'
                  } ${i === 6 ? '!bg-gradient-to-t !from-primary/60 !to-primary-light shadow-lg shadow-primary/10' : ''}`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
              <svg
                className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
                style={{
                  filter: "drop-shadow(0px 2px 3px rgba(134, 153, 134, 0.2))",
                }}
              >
                <path
                  className="opacity-80"
                  d="M10 60 C 40 70, 80 90, 120 50 S 200 30, 280 20"
                  fill="none"
                  stroke="#8fa889"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Today's Focus */}
        <section className="px-6 mb-10">
          <div className="relative rounded-[2rem] overflow-hidden shadow-soft group hover:shadow-lg transition-shadow duration-500">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjitAk1Cx2c4B8glc2ZVlH1qBLWYziRO0Ix-u5xxR6uEotJMqZhwEHvEhIo1xMuEpX0X_siqRLV3H5cU0IWeCkQw_WmoADB94Mp1B6xeZGO5fkoq6SqZQKrY0uEDpIAglADVyNHp-dykaKLQE5A9KGEMbKGs2zy7p99cqObXgBzO4qrWIBJUlFgGoV7YsVpPBJ-p9OJwtDd7bj6JeZzDBm9b1GZ00Gxe86DA7ZjQep5K9meepEMV7OvKvbprSzBjL9HfkWNsgZRkjD')",
                filter: "grayscale(40%) contrast(90%)",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-moss-dark/40 via-moss-dark/70 to-moss-dark/90 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] tracking-widest uppercase font-bold border border-white/20 mb-5 backdrop-blur-md shadow-sm">
                Today's Focus
              </span>
              <h2 className="font-display text-4xl text-paper-white italic mb-3 drop-shadow-sm">
                "Allowing"
              </h2>
              <p className="text-white/90 text-sm font-normal leading-relaxed max-w-[260px] mb-8 drop-shadow-sm">
                Observe the feeling without trying to fix it. Let it pass through
                you like a gentle breeze.
              </p>
              <button onClick={() => onNavigate('log')} className="bg-paper-white hover:bg-white text-moss-dark px-8 py-3.5 rounded-full font-medium text-sm transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-black/5 hover:shadow-xl">
                <span className="material-symbols-outlined text-xl text-primary">
                  play_circle
                </span>
                Start Session
              </button>
            </div>
          </div>
        </section>

        {/* The Garden */}
        <section className="px-6 pb-6">
          <h3 className="font-display text-2xl text-soft-charcoal mb-6 pl-3 border-l-4 border-primary/40 flex items-center gap-2">
            The Garden
            <span className="text-xs font-body font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2">
              5 Modules
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Emotion", sub: "Understand", icon: "water_drop" },
              { title: "Expression", sub: "Communicate", icon: "graphic_eq" },
              { title: "Empathy", sub: "Connect", icon: "diversity_1" },
              { title: "Influence", sub: "Impact", icon: "blur_on" },
            ].map((item, idx) => (
              <button
                key={idx}
                className="soft-card group relative flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-white hover:border-primary/20 transition-all active:scale-[0.98]"
              >
                <div className="size-14 rounded-full bg-moss-light flex items-center justify-center mb-3 group-hover:bg-primary-light/30 transition-colors shadow-inner-light">
                  <span className="material-symbols-outlined text-moss-dark group-hover:text-primary transition-colors text-2xl">
                    {item.icon}
                  </span>
                </div>
                <span className="font-display text-lg text-soft-charcoal group-hover:text-black transition-colors">
                  {item.title}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 font-medium">
                  {item.sub}
                </span>
              </button>
            ))}

            <button className="col-span-2 group relative flex flex-row items-center justify-between px-6 py-5 rounded-2xl bg-white border border-primary/10 shadow-soft hover:shadow-md transition-all active:scale-[0.99]">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-primary group-hover:text-primary-dark transition-colors text-2xl">
                    spa
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-display text-xl text-soft-charcoal font-medium">
                    Allowing
                  </span>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">
                    Acceptance & Flow
                  </span>
                </div>
              </div>
              <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-xl group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>
          </div>
        </section>
        <div className="h-28"></div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <button
          onClick={() => onNavigate('crisis')}
          className="breathe-animation-button relative flex items-center justify-center size-16 rounded-full bg-soft-coral/90 backdrop-blur-md border border-white/40 text-white shadow-lg shadow-soft-coral/30 hover:bg-soft-coral transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-3xl drop-shadow-md">
            self_improvement
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80"></span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;