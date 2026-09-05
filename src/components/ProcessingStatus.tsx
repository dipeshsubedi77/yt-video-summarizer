import React from 'react';
import { Check, Loader2, Sparkles, User, Calendar } from 'lucide-react';
import { VideoMetadata } from '../types/index.ts';

interface ProcessingStatusProps {
  video: VideoMetadata | null;
  activeStepIndex: number; // 0 to 4
}

const STEPS = [
  { id: 'video', label: 'Connecting video source' },
  { id: 'transcript', label: 'Retrieving & syncing subtitles' },
  { id: 'understanding', label: 'Gemini reasoning & context analysis' },
  { id: 'summary', label: 'Synthesizing key insights & chapters' },
  { id: 'insights', label: 'Generating study quiz & recall cards' },
];

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  video,
  activeStepIndex
}) => {
  const progressPercent = Math.min(100, Math.max(15, ((activeStepIndex + 1) / STEPS.length) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto my-10 p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#7C3AED] flex items-center justify-center">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Synthesizing Lecture with AI
            </h2>
            <p className="text-xs text-slate-500">
              Generating chapters, key takeaways, quiz, and study materials
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-[#7C3AED] bg-violet-50 border border-violet-200/60 px-2.5 py-1 rounded-full">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Video Preview Card if metadata is already known */}
      {video && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
          <div className="relative aspect-video w-full sm:w-44 shrink-0 overflow-hidden rounded-xl bg-slate-200 border border-slate-200">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {video.durationText && (
              <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white font-mono">
                {video.durationText}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 font-display">
              {video.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <User className="h-3 w-3 text-slate-400" />
                {video.channelTitle}
              </span>
              {video.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {video.publishedAt}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-3.5 my-5">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;

          return (
            <div key={step.id} className="flex items-center gap-3.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : isCurrent
                    ? 'border-2 border-[#7C3AED] bg-violet-50 text-[#7C3AED] ring-4 ring-violet-100'
                    : 'border border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-[11px]">{idx + 1}</span>
                )}
              </div>

              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isDone
                    ? 'text-slate-800'
                    : isCurrent
                    ? 'font-bold text-[#7C3AED]'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>

              {isCurrent && (
                <span className="ml-auto text-xs text-[#7C3AED] animate-pulse font-semibold">
                  Processing...
                </span>
              )}
              {isDone && (
                <span className="ml-auto text-xs text-emerald-600 font-semibold">
                  Complete
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

