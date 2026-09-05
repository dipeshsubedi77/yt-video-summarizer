import React, { useState } from 'react';
import { Play, ExternalLink, Clock, Search, Copy, Check, Sparkles } from 'lucide-react';
import { ChapterItem, VideoMetadata } from '../types/index.ts';
import { getYouTubeTimestampUrl } from '../lib/time-utils.ts';

interface ChapterListProps {
  chapters: ChapterItem[];
  video: VideoMetadata;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, video }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!chapters || chapters.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-slate-500">
        No chapters identified for this video.
      </div>
    );
  }

  const filteredChapters = chapters.filter(ch =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.keyPoints?.some(kp => kp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const copyChapterText = (ch: ChapterItem) => {
    const text = `[${ch.timestamp}] ${ch.title}\n${ch.summary}${ch.keyPoints?.length ? '\n• ' + ch.keyPoints.join('\n• ') : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ch.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header with Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Interactive Video Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key lecture checkpoints with direct YouTube timestamp deep-links
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters or topics..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
            />
          </div>
          <span className="shrink-0 text-xs font-bold text-[#7C3AED] bg-violet-50 border border-violet-200/60 px-3 py-1.5 rounded-xl">
            {chapters.length} Chapters
          </span>
        </div>
      </div>

      {/* Chapters list with timeline connector */}
      <div className="relative pl-4 sm:pl-6 border-l-2 border-slate-200/80 space-y-5 ml-2 sm:ml-4">
        {filteredChapters.map((chapter, index) => {
          const jumpUrl = getYouTubeTimestampUrl(video.youtubeId, chapter.startTime);
          const isCopied = copiedId === chapter.id;

          return (
            <div
              key={chapter.id}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-violet-300 hover:shadow-md transition-all duration-200"
            >
              {/* Timeline marker node */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-5 h-5 rounded-full bg-white border-2 border-[#7C3AED] flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <a
                    href={jumpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 border border-violet-200/70 px-2.5 py-1 font-mono text-xs font-bold text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all active:scale-95 shadow-2xs"
                    title={`Jump to ${chapter.timestamp} on YouTube`}
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>{chapter.timestamp}</span>
                  </a>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors font-display">
                    {chapter.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyChapterText(chapter)}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                    title="Copy chapter notes"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <a
                    href={jumpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-[#7C3AED] transition-colors"
                  >
                    <span>Watch</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4 font-normal">
                {chapter.summary}
              </p>

              {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                <div className="pt-3 border-t border-slate-100 bg-slate-50/50 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Highlights in Chapter
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {chapter.keyPoints.map((kp, kIdx) => (
                      <li key={kIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <span className="text-[#7C3AED] font-bold mt-0.5">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

