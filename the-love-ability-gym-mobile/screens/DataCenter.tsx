import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { ScreenType } from '../types';

interface DataCenterProps {
  onNavigate: (screen: ScreenType) => void;
}

const data = [
  { subject: 'Stability', A: 80, fullMark: 100 },
  { subject: 'Voice', A: 65, fullMark: 100 },
  { subject: 'Empathy', A: 90, fullMark: 100 },
  { subject: 'Allowing', A: 40, fullMark: 100 },
  { subject: 'Impact', A: 70, fullMark: 100 },
];

const DataCenter: React.FC<DataCenterProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-text-main antialiased overflow-x-hidden selection:bg-accent-pink selection:text-white min-h-screen flex flex-col">
      <div className="flex min-h-screen w-full flex-col relative max-w-md mx-auto shadow-soft bg-background-light border-x border-black/5">
        <header className="flex items-center justify-between p-4 pb-2 pt-6">
          <button onClick={() => onNavigate('home')} className="p-2 rounded-full hover:bg-black/5 transition-colors text-text-main">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-text-main text-lg font-semibold leading-tight tracking-tight flex-1 text-center opacity-80">
            Growth Journey
          </h2>
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-text-main">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col gap-6 px-6 pb-24 overflow-y-auto no-scrollbar">
          <div className="text-center pt-2 pb-2 space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-background-soft text-xs font-sans font-medium text-text-muted tracking-wide mb-1">
              Oct 24 - Oct 30
            </div>
            <h1 className="text-text-main text-3xl font-medium tracking-tight">
              Emotional Balance
            </h1>
            <p className="text-text-muted text-sm font-sans tracking-wide max-w-[280px] mx-auto leading-relaxed">
              Your heart is opening. Notice the expansion in empathy this week.
            </p>
          </div>

          <div className="relative w-full aspect-square max-h-[340px] mx-auto flex items-center justify-center py-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-peach/20 via-transparent to-accent-blue/20 rounded-full blur-3xl opacity-60"></div>
            <div className="w-full h-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#E5E0D8" strokeDasharray="4 4" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#8C8C8C', fontSize: 11, fontWeight: 500, fontFamily: 'Noto Sans' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Mike"
                            dataKey="A"
                            stroke="#8B9D83"
                            strokeWidth={2}
                            fill="#8B9D83"
                            fillOpacity={0.4}
                            isAnimationActive={true}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 text-center shadow-soft border border-slate-50">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-widest">
                  Current State
                </span>
                <p className="text-text-main text-xl font-semibold font-display italic">
                  The Aware
                </p>
              </div>
              <div className="w-full bg-background-soft rounded-full h-2 mt-1 overflow-hidden shadow-inner-soft">
                <div
                  className="bg-gradient-to-r from-primary to-[#A4B99D] h-2 rounded-full"
                  style={{ width: "48%" }}
                ></div>
              </div>
              <p className="text-[10px] font-sans text-text-muted font-medium">
                Progressing gently
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white to-background-soft p-5 text-center shadow-soft border border-slate-50 relative overflow-hidden group">
              <div className="flex flex-col items-center gap-1 z-10">
                <span className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-widest">
                  Streak
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-text-main text-3xl font-display font-medium">
                    12
                  </span>
                  <span
                    className="material-symbols-outlined text-accent-peach text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-sans text-primary mt-2 font-medium z-10">
                Consistent Practice
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <h3 className="text-text-main text-lg font-semibold px-1 opacity-90">
              Deep Dive
            </h3>
            <div className="bg-white rounded-2xl p-2 shadow-soft border border-slate-50 space-y-1">
                {/* Metric Items */}
                {[
                    { label: "Emotion Stability", sub: "Consistency", val: 80, icon: "self_improvement", color: "text-primary", bg: "bg-primary-light" },
                    { label: "Expression", sub: "Clarity", val: 65, icon: "record_voice_over", color: "text-[#9370DB]", bg: "bg-accent-lavender" },
                    { label: "Empathy", sub: "Connection", val: 90, icon: "favorite", color: "text-[#D88C8C]", bg: "bg-accent-pink/30" },
                    { label: "Allowing", sub: "Flow", val: 40, icon: "waves", color: "text-[#7B9CB8]", bg: "bg-accent-blue/30" },
                    { label: "Influence", sub: "Impact", val: 70, icon: "groups", color: "text-[#D99A6C]", bg: "bg-accent-peach/30" },

                ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-background-soft transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center ${m.color} group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-[20px]">
                            {m.icon}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-text-main font-medium text-sm leading-none">
                            {m.label}
                            </span>
                            <span className="text-text-muted text-[10px] font-sans mt-1.5 uppercase tracking-wide">
                            {m.sub}
                            </span>
                        </div>
                        </div>
                        <span className={`font-bold text-lg font-display ${m.val > 75 ? 'text-primary' : 'text-text-muted'}`}>
                        {m.val}
                        </span>
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-light/50 to-white border border-primary/10 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
            <div className="bg-white p-2 rounded-full shadow-sm text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">spa</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-text-main font-semibold text-sm">
                Focus Area: Allowing
              </h4>
              <p className="text-text-main/70 text-xs font-sans leading-relaxed">
                Your emotional resistance is higher than usual. Try the "River
                Flow" meditation to gently encourage acceptance.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataCenter;