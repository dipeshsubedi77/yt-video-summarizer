import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, ExternalLink, Play, Sparkles, FileText, X } from 'lucide-react';
import { TranscriptSegment, VideoMetadata } from '../types/index.ts';
import { formatSeconds, getYouTubeTimestampUrl } from '../lib/time-utils.ts';

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  fullText: string;
  video: VideoMetadata;
  isAiSynthesized?: boolean;
  onOpenManualTranscript?: () => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  fullText,
  video,
  isAiSynthesized,
  onOpenManualTranscript
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter(seg => seg.text.toLowerCase().includes(q));
  }, [segments, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200/90 text-slate-900 rounded-sm px-1 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Notice if AI Synthesized */}
      {isAiSynthesized && (
        <div className="mb-6 rounded-2xl border border-violet-200 bg-violet-50/80 p-4 text-xs text-violet-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-violet-900">AI Synthesized Transcript</p>
              <p className="text-violet-700 text-[11px] leading-relaxed mt-0.5">
                Because direct YouTube subtitle scraping was restricted, these timestamped lecture segments were reconstructed via Gemini AI based on the video's subject matter.
              </p>
            </div>
          </div>
          {onOpenManualTranscript && (
            <button
              type="button"
              onClick={onOpenManualTranscript}
              className="px-3.5 py-1.5 bg-white border border-violet-200 hover:bg-violet-100/60 text-[#7C3AED] text-xs font-bold rounded-xl shrink-0 transition-all shadow-2xs"
            >
              Paste Exact Subtitles
            </button>
          )}
        </div>
      )}

      {/* Controls Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="search-transcript-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words in transcript..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Copy button & counts */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {filteredSegments.length} of {segments.length} segments
          </span>
          <button
            id="copy-full-transcript-btn"
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Full Transcript</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Segments */}
      <div className="rounded-2xl border border-slate-200/90 bg-white divide-y divide-slate-100 overflow-hidden shadow-xs">
        {filteredSegments.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No matching phrases found in transcript.
          </div>
        ) : (
          filteredSegments.map((seg, idx) => {
            const timeStr = formatSeconds(seg.start);
            const jumpUrl = getYouTubeTimestampUrl(video.youtubeId, seg.start);

            return (
              <div
                key={idx}
                className="flex items-start gap-3 sm:gap-4 p-4 hover:bg-slate-50/70 transition-colors group"
              >
                <a
                  href={jumpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 group-hover:bg-violet-50 group-hover:border-violet-200 border border-transparent px-2.5 py-1 font-mono text-xs font-bold text-slate-600 group-hover:text-[#7C3AED] transition-all shrink-0"
                  title={`Jump to ${timeStr} on YouTube`}
                >
                  <Play className="h-2.5 w-2.5 fill-current" />
                  <span>{timeStr}</span>
                </a>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed flex-1 font-normal">
                  {highlightText(seg.text, searchQuery)}
                </p>

                <a
                  href={jumpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#7C3AED] p-1"
                  title="Play from this point"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

