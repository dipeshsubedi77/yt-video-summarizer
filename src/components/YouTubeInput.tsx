import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, FileText, X, Clipboard, Play, Globe, BookOpen, Layers, Check } from 'lucide-react';
import { SummaryLength, SummaryStyle, SummaryLanguage } from '../types/index.ts';

interface YouTubeInputProps {
  onSubmit: (url: string, length: SummaryLength, style: SummaryStyle, language: SummaryLanguage) => void;
  onOpenManualModal: () => void;
  isLoading: boolean;
  defaultLength: SummaryLength;
  defaultStyle: SummaryStyle;
  defaultLanguage: SummaryLanguage;
}

export const YouTubeInput: React.FC<YouTubeInputProps> = ({
  onSubmit,
  onOpenManualModal,
  isLoading,
  defaultLength,
  defaultStyle,
  defaultLanguage
}) => {
  const [url, setUrl] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [length, setLength] = useState<SummaryLength>(defaultLength);
  const [style, setStyle] = useState<SummaryStyle>(defaultStyle);
  const [language, setLanguage] = useState<SummaryLanguage>(defaultLanguage);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isCopiedPasted, setIsCopiedPasted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('Please paste a valid YouTube video URL or ID.');
      return;
    }
    onSubmit(trimmed, length, style, language);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setInputError(null);
        setIsCopiedPasted(true);
        setTimeout(() => setIsCopiedPasted(false), 1500);
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const clearInput = () => {
    setUrl('');
    setInputError(null);
  };

  const hasCustomOptions = length !== 'medium' || style !== 'simple' || language !== 'English';

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main input card with elevated border and shadow */}
        <div className="rounded-2xl border-2 border-slate-200/90 bg-white p-2 sm:p-2.5 shadow-xl shadow-slate-200/40 transition-all duration-200 focus-within:border-[#7C3AED] focus-within:ring-4 focus-within:ring-[#7C3AED]/10 hover:border-slate-300">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 flex items-center pl-1 sm:pl-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs mr-3 transition-transform group-hover:scale-105">
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </div>
              <input
                id="youtube-url-input"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="Paste any YouTube video or lecture URL..."
                disabled={isLoading}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base outline-none pr-16 font-medium"
              />
              {url ? (
                <button
                  type="button"
                  onClick={clearInput}
                  className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  title="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl px-2.5 py-1.5 transition-all active:scale-95 shadow-2xs"
                >
                  {isCopiedPasted ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Pasted</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5 text-slate-500" />
                      <span>Paste</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                id="toggle-options-btn"
                onClick={() => setShowOptions(!showOptions)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all active:scale-95 ${
                  showOptions || hasCustomOptions
                    ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED] shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title="Customize summary depth, style and language"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Options</span>
                {hasCustomOptions && (
                  <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                )}
              </button>

              <button
                id="submit-summarize-btn"
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    <span>Synthesize Notes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Input Error Message */}
        {inputError && (
          <p className="mt-2 text-xs font-semibold text-rose-600 pl-3 flex items-center gap-1 animate-fadeIn">
            <span>⚠️</span>
            <span>{inputError}</span>
          </p>
        )}

        {/* Expandable Controls Panel */}
        {showOptions && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl shadow-slate-200/50 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Length */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 font-display">
                  <Layers className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span>Summary Depth</span>
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs">
                  {(['short', 'medium', 'detailed'] as SummaryLength[]).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setLength(len)}
                      className={`rounded-lg py-1.5 font-bold capitalize transition-all ${
                        length === len
                          ? 'bg-white text-[#7C3AED] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 font-display">
                  <BookOpen className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span>Learning Tone</span>
                </label>
                <select
                  id="summary-style-select"
                  value={style}
                  onChange={(e) => setStyle(e.target.value as SummaryStyle)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"
                >
                  <option value="simple">Simple (Conversational & Clear)</option>
                  <option value="academic">Academic (Rigorous & Cited)</option>
                  <option value="technical">Technical (Engineering & Code)</option>
                  <option value="beginner_friendly">Beginner-Friendly (ELI5 Analogy)</option>
                  <option value="exam_focused">Exam-Focused (Formulas & Terms)</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 font-display">
                  <Globe className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span>Output Language</span>
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs">
                  {(['English', 'Nepali', 'Hindi'] as SummaryLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`rounded-lg py-1.5 font-bold transition-all ${
                        language === lang
                          ? 'bg-white text-[#7C3AED] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span className="text-[11px] font-medium">Have restricted subtitles or a private audio recording?</span>
              <button
                type="button"
                onClick={onOpenManualModal}
                className="font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Paste Custom Transcript Text</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick hint beneath input */}
        <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Supports long lectures (2h+), tutorials, podcasts & uncaptioned audio</span>
          </span>
          <button
            type="button"
            onClick={onOpenManualModal}
            className="text-violet-700 hover:text-violet-900 font-bold transition-colors flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            <span>Paste Transcript</span>
          </button>
        </div>
      </form>
    </div>
  );
};

