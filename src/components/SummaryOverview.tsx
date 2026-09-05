import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Quote,
  ListTodo,
  Tag,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  BookmarkCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SummaryData, VideoMetadata } from '../types/index.ts';

interface SummaryOverviewProps {
  summary: SummaryData;
  video: VideoMetadata;
  isAiSynthesized?: boolean;
  onOpenManualTranscript?: () => void;
}

export const SummaryOverview: React.FC<SummaryOverviewProps> = ({
  summary,
  video,
  isAiSynthesized,
  onOpenManualTranscript
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* AI Synthesis Notice if YouTube captions were blocked */}
      {isAiSynthesized && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 text-xs text-violet-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-[#7C3AED] text-white shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Synthesized with Gemini AI Knowledge</p>
              <p className="text-slate-600 text-xs leading-relaxed mt-0.5">
                YouTube automated subtitles were unavailable or restricted for this video. This study guide was synthesized based on the video title and core subject matter.
              </p>
            </div>
          </div>
          {onOpenManualTranscript && (
            <button
              type="button"
              onClick={onOpenManualTranscript}
              className="px-3.5 py-1.5 bg-white border border-violet-200 hover:bg-violet-100/70 text-[#7C3AED] text-xs font-bold rounded-xl shrink-0 transition-all shadow-2xs active:scale-95"
            >
              Paste Exact Subtitles
            </button>
          )}
        </div>
      )}

      {/* 1. TL;DR Executive Summary */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-100 text-[#7C3AED]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Executive TL;DR
              </h2>
              <p className="text-xs text-slate-500">Core narrative thesis in 30 seconds</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(summary.tldr, 'tldr')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
          >
            {copiedItem === 'tldr' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy TL;DR</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal bg-slate-50/60 p-4 rounded-xl border border-slate-100">
          {summary.tldr}
        </p>

        {/* Quick Highlights bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Target Level:</span>
            <span className="rounded-full bg-violet-50 border border-violet-200/60 text-[#7C3AED] px-2.5 py-0.5 font-bold text-[11px]">
              {summary.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Pedagogical Style:</span>
            <span className="capitalize text-slate-700 font-semibold">{summary.style}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Study Language:</span>
            <span className="text-slate-700 font-semibold">{summary.language}</span>
          </div>
        </div>
      </section>

      {/* 2. Key Takeaways */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-100 text-[#7C3AED]">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Key Takeaways & Insights
              </h2>
              <p className="text-xs text-slate-500">Essential principles to remember</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(summary.keyTakeaways.join('\n• '), 'takeaways')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-all active:scale-95 shadow-2xs"
          >
            {copiedItem === 'takeaways' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy List</span>
              </>
            )}
          </button>
        </div>

        <ul className="grid grid-cols-1 gap-3">
          {summary.keyTakeaways.map((takeaway, idx) => (
            <li
              key={idx}
              className="group flex items-start gap-3.5 p-3.5 sm:p-4 bg-slate-50/70 hover:bg-violet-50/40 rounded-xl border border-slate-200/70 hover:border-[#7C3AED]/30 transition-all"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-[#7C3AED] shadow-2xs shrink-0 mt-0.5 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {takeaway}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Detailed Conceptual Summary */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-violet-100 text-[#7C3AED]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Detailed Conceptual Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Deep-dive sections organized into logical learning modules
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {summary.detailedSummary.map((section, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 hover:bg-white hover:border-[#7C3AED]/40 hover:shadow-xs transition-all"
            >
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2.5 font-display">
                <span className="text-[11px] font-mono text-[#7C3AED] bg-violet-100 border border-violet-200 px-2 py-0.5 rounded-lg font-bold">
                  Module 0{idx + 1}
                </span>
                <span>{section.title}</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-3.5">
                {section.content}
              </p>

              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Core Points</span>
                  <ul className="space-y-2">
                    {section.keyPoints.map((kp, kIdx) => (
                      <li key={kIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Important Concepts & Definitions */}
      {summary.importantConcepts && summary.importantConcepts.length > 0 && (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-xl bg-violet-100 text-[#7C3AED]">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Important Concepts & Terminology
              </h2>
              <p className="text-xs text-slate-500">Key glossary terms and contextual definitions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {summary.importantConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/50 hover:bg-white hover:border-[#7C3AED]/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-xs text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                    {concept.term}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-2">
                  {concept.definition}
                </p>
                {concept.context && (
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 leading-normal">
                    Context: {concept.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Action Items & Practical Checklist */}
      {summary.actionItems && summary.actionItems.length > 0 && (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-100 text-[#7C3AED]">
                <ListTodo className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Action Items & Implementation Checklist
                </h2>
                <p className="text-xs text-slate-500">Click to track your practical progress</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {Object.values(checkedItems).filter(Boolean).length} / {summary.actionItems.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {summary.actionItems.map((item, idx) => {
              const isDone = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                    isDone
                      ? 'bg-violet-50/60 border-violet-200 text-slate-400'
                      : 'bg-slate-50/60 border-slate-200/80 text-slate-800 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`action-item-${idx}`}
                    checked={isDone}
                    onChange={() => toggleCheck(idx)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                  />
                  <label
                    htmlFor={`action-item-${idx}`}
                    className={`text-xs sm:text-sm font-medium cursor-pointer select-none leading-relaxed ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item}
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Memorable Quotes */}
      {summary.keyQuotes && summary.keyQuotes.length > 0 && (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-xl bg-violet-100 text-[#7C3AED]">
              <Quote className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Memorable Quotes
              </h2>
              <p className="text-xs text-slate-500">Key insights spoken during the video</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {summary.keyQuotes.map((q, idx) => (
              <blockquote
                key={idx}
                className="relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-4.5 flex flex-col justify-between hover:bg-white hover:border-slate-300 transition-all"
              >
                <p className="text-xs sm:text-sm italic text-slate-800 leading-relaxed mb-3">
                  "{q.quote}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2.5">
                  <span className="font-semibold text-slate-700">— {q.speaker || video.channelTitle}</span>
                  {q.timestamp && (
                    <span className="flex items-center gap-1 font-mono text-[#7C3AED] bg-violet-50 border border-violet-200/60 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <Clock className="h-3 w-3" />
                      {q.timestamp}
                    </span>
                  )}
                </div>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* 7. Keywords */}
      {summary.keywords && summary.keywords.length > 0 && (
        <section className="pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              <span>Topics & Tags:</span>
            </span>
            {summary.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:border-[#7C3AED]/40 hover:text-[#7C3AED] transition-colors cursor-default"
              >
                #{kw}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

