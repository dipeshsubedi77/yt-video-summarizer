import React from 'react';
import {
  ExternalLink,
  Download,
  Bookmark,
  Check,
  User,
  LayoutDashboard,
  AlignLeft,
  BookOpen,
  HelpCircle,
  Layers,
  MessageSquare,
  Play
} from 'lucide-react';
import { VideoMetadata, SummaryData } from '../types/index.ts';

export type DashboardTab = 'overview' | 'transcript' | 'chapters' | 'questions' | 'flashcards' | 'chat';

interface DashboardHeaderProps {
  video: VideoMetadata;
  summary: SummaryData;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenExport: () => void;
  onCopySummary: () => void;
  isCopied: boolean;
  questionCount: number;
  flashcardCount: number;
  chapterCount: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  video,
  summary,
  activeTab,
  onTabChange,
  onOpenExport,
  onCopySummary,
  isCopied,
  questionCount,
  flashcardCount,
  chapterCount
}) => {
  const tabs: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transcript', label: 'Transcript', icon: AlignLeft },
    { id: 'chapters', label: 'Chapters', icon: BookOpen, count: chapterCount },
    { id: 'questions', label: 'AI Quiz & Q&A', icon: HelpCircle, count: questionCount },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, count: flashcardCount },
    { id: 'chat', label: 'Ask Video Tutor', icon: MessageSquare }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/90 pt-6 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Video Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4.5 w-full lg:w-auto">
            {/* Thumbnail */}
            <div className="group relative aspect-video w-full sm:w-48 shrink-0 overflow-hidden rounded-2xl bg-slate-900 shadow-md ring-1 ring-slate-200/80">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 right-2 rounded-md bg-black/85 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white tracking-wider font-mono">
                {video.durationText || 'Video'}
              </span>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity"
                title="Play on YouTube"
              >
                <div className="h-10 w-10 rounded-full bg-white/90 text-[#7C3AED] flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                  <Play className="h-4 w-4 fill-[#7C3AED] ml-0.5" />
                </div>
              </a>
            </div>

            {/* Meta details */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center rounded-full bg-violet-50 border border-violet-200/60 px-2.5 py-0.5 text-[11px] font-bold text-[#7C3AED]">
                  {summary.difficulty} Level
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 capitalize">
                  {summary.style} Mode
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  {summary.language}
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 line-clamp-2 leading-snug font-display">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {video.channelTitle}
                </span>
                {video.publishedAt && (
                  <span>• {video.publishedAt}</span>
                )}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  <span>Open Video</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              id="header-copy-summary-btn"
              type="button"
              onClick={onCopySummary}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              id="header-export-btn"
              type="button"
              onClick={onOpenExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4.5 py-2.5 text-xs font-bold text-white shadow-sm hover:from-slate-800 hover:to-slate-700 transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-200/80 overflow-x-auto no-scrollbar pt-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#7C3AED] text-[#7C3AED]'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#7C3AED]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-violet-100 text-[#7C3AED]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

