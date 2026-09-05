import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, FileDown, Sparkles } from 'lucide-react';
import { ProcessedVideoPayload } from '../types/index.ts';
import {
  exportPdf,
  generateMarkdown,
  generatePlainText,
  downloadFile
} from '../lib/export-utils.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: ProcessedVideoPayload;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  payload
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const cleanFilename = payload.video.title
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]">
              <Download className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Export Lecture Notes
              </h3>
              <p className="text-xs text-slate-500">
                Save formatted study materials locally or copy to clipboard
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

        {/* Export Options Grid */}
        <div className="space-y-3 mb-6">
          {/* PDF Download */}
          <button
            type="button"
            onClick={() => exportPdf(payload)}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-left hover:border-violet-300 hover:bg-violet-50/40 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors shrink-0">
                <FileDown className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Download Formatted PDF
                </h4>
                <p className="text-xs text-slate-500">
                  Printable document with title, TL;DR, key takeaways & chapters
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#7C3AED] group-hover:underline shrink-0 ml-2">
              .pdf
            </span>
          </button>

          {/* Markdown Download */}
          <button
            type="button"
            onClick={() => {
              const md = generateMarkdown(payload);
              downloadFile(md, `${cleanFilename}_notes.md`, 'text/markdown');
            }}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-left hover:border-violet-300 hover:bg-violet-50/40 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Download Markdown (.md)
                </h4>
                <p className="text-xs text-slate-500">
                  Ideal for Notion, Obsidian, GitHub, or Logseq
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#7C3AED] group-hover:underline shrink-0 ml-2">
              .md
            </span>
          </button>

          {/* Plain text Download */}
          <button
            type="button"
            onClick={() => {
              const txt = generatePlainText(payload);
              downloadFile(txt, `${cleanFilename}_summary.txt`, 'text/plain');
            }}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-left hover:border-violet-300 hover:bg-violet-50/40 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Plain Text File (.txt)
                </h4>
                <p className="text-xs text-slate-500">
                  Clean, unformatted text export for any text editor
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#7C3AED] group-hover:underline shrink-0 ml-2">
              .txt
            </span>
          </button>
        </div>

        {/* Quick Clipboard Copy buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => handleCopy(payload.summary.tldr, 'tldr')}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all active:scale-95"
          >
            {copiedType === 'tldr' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Summary Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy TL;DR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleCopy(generateMarkdown(payload), 'all')}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-xs"
          >
            {copiedType === 'all' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Full Guide Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Study Guide</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

