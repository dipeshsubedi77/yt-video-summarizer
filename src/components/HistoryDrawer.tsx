import React, { useState } from 'react';
import { X, Search, Trash2, Clock, Play, Sparkles, BookOpen } from 'lucide-react';
import { HistoryEntry } from '../types/index.ts';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelectVideo: (youtubeId: string) => void;
  onDeleteVideo: (youtubeId: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectVideo,
  onDeleteVideo
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.channelTitle.toLowerCase().includes(search.toLowerCase()) ||
    item.tldr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#7C3AED] flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Recent Summaries
                </h3>
                <p className="text-xs text-slate-500">
                  {history.length} {history.length === 1 ? 'lecture' : 'lectures'} saved locally
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                id="history-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history by title or speaker..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  {search ? 'No saved videos match your query.' : 'No videos summarized yet.'}
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.youtubeId}
                  className="group relative rounded-2xl border border-slate-200/90 bg-white p-3.5 hover:border-violet-300 hover:shadow-xs transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        onSelectVideo(item.youtubeId);
                        onClose();
                      }}
                      className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 cursor-pointer border border-slate-200/80"
                    >
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {item.durationText && (
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[9px] font-bold text-white font-mono">
                          {item.durationText}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => {
                          onSelectVideo(item.youtubeId);
                          onClose();
                        }}
                        className="text-xs font-bold text-slate-900 line-clamp-2 cursor-pointer group-hover:text-[#7C3AED] transition-colors leading-snug mb-1 font-display"
                      >
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mb-1">
                        {item.channelTitle}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <span>{item.dateSummarized}</span>
                        <span>•</span>
                        <span className="capitalize text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded font-semibold">{item.summaryStyle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectVideo(item.youtubeId);
                        onClose();
                      }}
                      className="font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>View Study Guide</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteVideo(item.youtubeId)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

