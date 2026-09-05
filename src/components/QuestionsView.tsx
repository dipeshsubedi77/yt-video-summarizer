import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Check, Play, Loader2, ThumbsUp, RotateCcw, CheckCircle2 } from 'lucide-react';
import { QuestionItem, QuestionCategory, VideoMetadata } from '../types/index.ts';

interface QuestionsViewProps {
  questions: QuestionItem[];
  video: VideoMetadata;
  onGenerateMore: () => Promise<void>;
  isGeneratingMore: boolean;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  video,
  onGenerateMore,
  isGeneratingMore
}) => {
  const [activeCategory, setActiveCategory] = useState<QuestionCategory | 'All'>('All');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [masteredMap, setMasteredMap] = useState<Record<string, boolean>>({});

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markMastered = (id: string) => {
    setMasteredMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = () => {
    const next: Record<string, boolean> = {};
    questions.forEach(q => { next[q.id] = true; });
    setRevealedAnswers(next);
  };

  const hideAll = () => {
    setRevealedAnswers({});
  };

  const filteredQuestions = questions.filter(q =>
    activeCategory === 'All' ? true : q.category === activeCategory
  );

  const categoryColors = {
    Basic: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-200/80',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200/80'
  };

  const masteredCount = Object.values(masteredMap).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top filter bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Self-Assessment Quiz & Q&A
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your comprehension of core arguments and lecture topics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {masteredCount} of {questions.length} Mastered
          </div>
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-white text-xs font-semibold">
            <button
              type="button"
              onClick={revealAll}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded px-2.5 py-1 transition-colors"
            >
              Show All
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={hideAll}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded px-2.5 py-1 transition-colors"
            >
              Hide All
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['All', 'Basic', 'Intermediate', 'Advanced'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 text-[11px] opacity-75">
                ({questions.filter(q => q.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isRevealed = !!revealedAnswers[q.id];
          const isMastered = !!masteredMap[q.id];

          return (
            <div
              key={q.id}
              className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all ${
                isMastered ? 'border-emerald-200/80 bg-emerald-50/10' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      categoryColors[q.category]
                    }`}
                  >
                    {q.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Question #{idx + 1}
                  </span>
                  {isMastered && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <Check className="h-3 w-3" /> Mastered
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleAnswer(q.id)}
                  className="flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                  {isRevealed ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Question text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3.5 font-display">
                {q.question}
              </h3>

              {/* Collapsible Answer & Explanation */}
              {isRevealed ? (
                <div className="pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
                  <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-200/70">
                    <span className="text-xs font-bold text-emerald-700 block mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Verified Answer:</span>
                    </span>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                      {q.answer}
                    </p>
                  </div>

                  <div className="p-3 bg-violet-50/40 rounded-xl border border-violet-100 text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Pedagogical Context: </span>
                    {q.explanation}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => markMastered(q.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isMastered
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{isMastered ? 'Marked Mastered' : 'I Understood This'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => toggleAnswer(q.id)}
                  className="cursor-pointer text-xs text-slate-400 hover:text-[#7C3AED] transition-colors py-1 flex items-center gap-1.5"
                >
                  <span>Click to reveal solution and concept breakdown...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Generate More Button */}
      <div className="mt-8 text-center pt-4">
        <button
          id="generate-more-questions-btn"
          type="button"
          onClick={onGenerateMore}
          disabled={isGeneratingMore}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all active:scale-95"
        >
          {isGeneratingMore ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#7C3AED]" />
              <span>Generating quiz questions...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-[#7C3AED]" />
              <span>Generate More Questions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

