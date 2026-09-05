import React, { useState } from 'react';
import { X, FileText, Sparkles, Lightbulb } from 'lucide-react';
import { SummaryLength, SummaryStyle, SummaryLanguage } from '../types/index.ts';

interface ManualTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, transcript: string, length: SummaryLength, style: SummaryStyle, language: SummaryLanguage) => void;
  initialUrl?: string;
}

export const ManualTranscriptModal: React.FC<ManualTranscriptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = ''
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [transcript, setTranscript] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');
  const [style, setStyle] = useState<SummaryStyle>('simple');
  const [language, setLanguage] = useState<SummaryLanguage>('English');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialUrl && !url) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim() || transcript.trim().length < 20) {
      setError('Please paste a transcript of at least a few sentences.');
      return;
    }
    onSubmit(url.trim(), transcript.trim(), length, style, language);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Paste Video Transcript
              </h3>
              <p className="text-xs text-slate-500">
                Ideal for restricted videos, custom lectures, Zoom recordings, or unlisted talks
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1 font-display">
              YouTube Video URL (optional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 outline-hidden focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1 font-display">
              Subtitles / Spoken Transcript *
            </label>
            <textarea
              rows={7}
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste the speech transcript, timestamped text, or lecture notes here..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 outline-hidden focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20 leading-relaxed resize-none transition-all"
            />
            {error && <p className="text-xs font-semibold text-rose-600 mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Depth
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as SummaryLength)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-hidden focus:border-[#7C3AED]"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tone & Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as SummaryStyle)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-hidden focus:border-[#7C3AED]"
              >
                <option value="simple">Simple</option>
                <option value="academic">Academic</option>
                <option value="technical">Technical</option>
                <option value="beginner_friendly">Beginner-Friendly</option>
                <option value="exam_focused">Exam-Focused</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SummaryLanguage)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-hidden focus:border-[#7C3AED]"
              >
                <option value="English">English</option>
                <option value="Nepali">Nepali</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-bold">Tip:</span> On YouTube, expand the video description, click <span className="font-bold">"... More"</span>, then select <span className="font-bold">"Show transcript"</span>. Select all, copy, and paste here for instant analysis.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-xs active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>Synthesize Notes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

