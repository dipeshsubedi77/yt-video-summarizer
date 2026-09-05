import React from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { SummaryLength, SummaryStyle, SummaryLanguage } from '../types/index.ts';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  length: SummaryLength;
  style: SummaryStyle;
  language: SummaryLanguage;
  onSave: (length: SummaryLength, style: SummaryStyle, language: SummaryLanguage) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  length,
  style,
  language,
  onSave
}) => {
  const [curLength, setCurLength] = React.useState<SummaryLength>(length);
  const [curStyle, setCurStyle] = React.useState<SummaryStyle>(style);
  const [curLanguage, setCurLanguage] = React.useState<SummaryLanguage>(language);

  React.useEffect(() => {
    setCurLength(length);
    setCurStyle(style);
    setCurLanguage(language);
  }, [length, style, language, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(curLength, curStyle, curLanguage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]">
              <Sliders className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                AI Synthesis Preferences
              </h3>
              <p className="text-xs text-slate-500">
                Configure default settings for subsequent lecture analyses
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

        <div className="space-y-4 mb-6">
          {/* Default Length */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 font-display">
              Default Summary Depth
            </label>
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100/90 p-1 text-xs">
              {(['short', 'medium', 'detailed'] as SummaryLength[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setCurLength(l)}
                  className={`rounded-xl py-2 font-bold capitalize transition-all ${
                    curLength === l
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Default Style */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 font-display">
              Default Learning Style
            </label>
            <select
              value={curStyle}
              onChange={(e) => setCurStyle(e.target.value as SummaryStyle)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-medium outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all cursor-pointer"
            >
              <option value="simple">Simple (Clear, concise & conversational)</option>
              <option value="academic">Academic (Rigorous, formal & scholarly)</option>
              <option value="technical">Technical (Engineering & deep dive)</option>
              <option value="beginner_friendly">Beginner-Friendly (With intuitive analogies)</option>
              <option value="exam_focused">Exam-Focused (Definitions & high-yield test points)</option>
            </select>
          </div>

          {/* Default Language */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 font-display">
              Default Output Language
            </label>
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100/90 p-1 text-xs">
              {(['English', 'Nepali', 'Hindi'] as SummaryLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setCurLanguage(lang)}
                  className={`rounded-xl py-2 font-bold transition-all ${
                    curLanguage === lang
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-xs active:scale-95"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

