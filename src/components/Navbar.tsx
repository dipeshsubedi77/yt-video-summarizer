import React from 'react';
import { History, Sliders, Sparkles, Youtube, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onResetToHome: () => void;
  hasActiveVideo: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenSettings,
  onResetToHome,
  hasActiveVideo,
  historyCount
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 transition-all">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            onClick={onResetToHome}
            className="group flex items-center gap-2.5 text-left transition-transform active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white shadow-sm shadow-[#7C3AED]/20 transition-transform group-hover:scale-105">
              <Youtube className="h-4 w-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 font-display">
                  TubeSummarize<span className="text-[#7C3AED]">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200/60">
                  <Zap className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                  Gemini Flash
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {hasActiveVideo && (
            <button
              id="nav-new-summary-btn"
              onClick={onResetToHome}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-white hover:border-[#7C3AED]/60 hover:text-[#7C3AED] transition-all shadow-2xs active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
              <span>New Summary</span>
            </button>
          )}

          <button
            id="nav-history-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs active:scale-95"
            title="View recent video summaries"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="rounded-full bg-[#7C3AED]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#7C3AED] border border-[#7C3AED]/20">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="nav-settings-btn"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs active:scale-95"
            title="Summary AI preferences"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Preferences</span>
          </button>
        </div>
      </div>
    </header>
  );
};

