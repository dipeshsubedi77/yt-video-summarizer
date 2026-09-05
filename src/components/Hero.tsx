import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Code,
  Mic,
  UserCheck,
  Film,
  Play,
  BookOpen,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Clock,
  HelpCircle,
  Layers,
  ArrowRight,
  RotateCw,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { YouTubeInput } from './YouTubeInput.tsx';
import { SummaryLength, SummaryStyle, SummaryLanguage, HistoryEntry } from '../types/index.ts';

interface ExampleItem {
  category: 'Lecture' | 'Tutorial' | 'Podcast' | 'Interview' | 'Documentary';
  title: string;
  channel: string;
  url: string;
  duration?: string;
  icon: any;
}

interface HeroProps {
  onProcessVideo: (url: string, length?: SummaryLength, style?: SummaryStyle, language?: SummaryLanguage) => void;
  onOpenManualModal: () => void;
  onOpenHistory: () => void;
  history: HistoryEntry[];
  onSelectHistoryVideo: (youtubeId: string) => void;
  preferences: {
    defaultLength: SummaryLength;
    defaultStyle: SummaryStyle;
    defaultLanguage: SummaryLanguage;
  };
  isLoading: boolean;
}

const EXAMPLES: ExampleItem[] = [
  {
    category: 'Lecture',
    title: 'Intro to Large Language Models',
    channel: 'Andrej Karpathy',
    duration: '1h 00m',
    url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    icon: GraduationCap
  },
  {
    category: 'Tutorial',
    title: 'What is a neural network?',
    channel: '3Blue1Brown',
    duration: '19 min',
    url: 'https://www.youtube.com/watch?v=sVx1MmxW074',
    icon: Code
  },
  {
    category: 'Podcast',
    title: 'OpenAI, GPT-4 & Future of AI',
    channel: 'Lex Fridman',
    duration: '2h 35m',
    url: 'https://www.youtube.com/watch?v=L_Guz73e6fw',
    icon: Mic
  },
  {
    category: 'Interview',
    title: 'Stanford Commencement Address',
    channel: 'Steve Jobs',
    duration: '15 min',
    url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    icon: UserCheck
  },
  {
    category: 'Documentary',
    title: 'The Simplest Math Problem',
    channel: 'Veritasium',
    duration: '22 min',
    url: 'https://www.youtube.com/watch?v=094y1Z2wpJg',
    icon: Film
  }
];

export const Hero: React.FC<HeroProps> = ({
  onProcessVideo,
  onOpenManualModal,
  onOpenHistory,
  history,
  onSelectHistoryVideo,
  preferences,
  isLoading
}) => {
  // Interactive Live Preview tab state
  const [previewTab, setPreviewTab] = useState<'notes' | 'chapters' | 'flashcards' | 'chat'>('notes');
  const [isFlippedCard, setIsFlippedCard] = useState(false);

  return (
    <div className="relative py-8 sm:py-14 max-w-5xl mx-auto px-4 w-full">
      {/* Subtle ambient backdrop illumination */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-200/30 via-indigo-100/25 to-purple-100/20 blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* 1. Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/90 bg-white/90 backdrop-blur-xs px-4 py-1.5 text-xs font-bold text-violet-900 shadow-2xs mb-5 transition-transform hover:scale-105">
          <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
          <span>AI Lecture & Video Synthesizer • Powered by Gemini 3.8 Flash</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-4 font-display">
          Understand any lecture in{' '}
          <span className="bg-gradient-to-r from-slate-900 via-[#7C3AED] to-violet-600 bg-clip-text text-transparent">
            minutes, not hours.
          </span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Paste any YouTube video or university talk. Generate structured chapter notes, interactive active-recall flashcards, and an AI tutor grounded in the video.
        </p>
      </div>

      {/* 2. Centerpiece Search Input Box */}
      <div className="mb-8">
        <YouTubeInput
          onSubmit={onProcessVideo}
          onOpenManualModal={onOpenManualModal}
          isLoading={isLoading}
          defaultLength={preferences.defaultLength}
          defaultStyle={preferences.defaultStyle}
          defaultLanguage={preferences.defaultLanguage}
        />
      </div>

      {/* 3. One-Click Verified Demo Lectures */}
      <div className="mb-14">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs uppercase tracking-wider font-bold text-slate-500 font-display">
            Or explore a verified lecture
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXAMPLES.map((ex) => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.category}
                id={`example-btn-${ex.category.toLowerCase()}`}
                type="button"
                disabled={isLoading}
                onClick={() => onProcessVideo(ex.url)}
                className="group inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-2xs hover:border-[#7C3AED]/60 hover:bg-violet-50/40 hover:shadow-xs disabled:opacity-50 transition-all text-left active:scale-[0.98]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#7C3AED] group-hover:text-white transition-all shadow-2xs">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#7C3AED] text-[10px] uppercase tracking-wide">
                      {ex.category}
                    </span>
                    {ex.duration && <span className="text-[10px] text-slate-400 font-mono">• {ex.duration}</span>}
                  </div>
                  <span className="text-slate-800 font-semibold group-hover:text-[#7C3AED] transition-colors">
                    {ex.title}
                  </span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#7C3AED] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Studies Shelf (if user has history) */}
      {history && history.length > 0 && (
        <div className="mb-14 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7C3AED]"></div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Continue Where You Left Off ({history.length})
              </h3>
            </div>
            <button
              onClick={onOpenHistory}
              className="text-xs font-bold text-[#7C3AED] hover:text-violet-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View All Notebook</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryVideo(item.youtubeId)}
                className="group flex gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/20 cursor-pointer transition-all"
              >
                <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 py-0.2 rounded font-bold">
                    {item.durationText || 'Video'}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#7C3AED] transition-colors font-display">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.channelTitle}
                  </p>
                  <span className="text-[10px] text-violet-700 font-semibold mt-1 inline-flex items-center gap-1">
                    <span>Open Study Guide</span>
                    <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Interactive "What You Get" Studio Showcase */}
      <div className="mb-14">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <BookOpen className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>Interactive Studio Preview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Here's what SummTube builds for you
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click through the tabs below to test an actual synthesized study guide.
          </p>
        </div>

        {/* Studio Preview Window */}
        <div className="rounded-2xl border-2 border-slate-200/90 bg-white overflow-hidden shadow-xl shadow-slate-200/50">
          {/* Top Mockup Header Bar */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shrink-0">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/50">
                    Sample Lecture
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">1h 00m</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5 font-display">
                  Intro to Large Language Models • Andrej Karpathy
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Gemini 3.8 Flash Synthesized
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => setPreviewTab('notes')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                previewTab === 'notes'
                  ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Executive Notes & Takeaways</span>
            </button>
            <button
              onClick={() => setPreviewTab('chapters')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                previewTab === 'chapters'
                  ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Clickable Chapters (7)</span>
            </button>
            <button
              onClick={() => setPreviewTab('flashcards')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                previewTab === 'flashcards'
                  ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Active Recall Cards (Try Flip!)</span>
            </button>
            <button
              onClick={() => setPreviewTab('chat')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                previewTab === 'chat'
                  ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Grounded AI Tutor</span>
            </button>
          </div>

          {/* Interactive Tab Body */}
          <div className="p-5 sm:p-7 min-h-[300px] flex flex-col justify-center">
            {/* Tab 1: Executive Notes */}
            {previewTab === 'notes' && (
              <div className="animate-fadeIn space-y-5">
                <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-900 uppercase tracking-wide mb-1 font-display">
                    <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
                    <span>Executive Summary (TL;DR)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    Andrej Karpathy breaks down Large Language Models (LLMs) into two core components: 
                    the massive, compute-intensive pre-training phase that compiles internet text into base weights, 
                    and the subsequent fine-tuning / RLHF alignment that transforms raw text predictors into helpful assistants.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-display">
                    Key Actionable Takeaways
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                      <span><strong>Pre-training is lossy internet compression:</strong> Base models predict next tokens by internalizing world knowledge into parameter weights across billions of documents.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                      <span><strong>Fine-tuning & RLHF shape utility:</strong> Synthetic dialogues and human feedback teach models to act as conversational partners rather than raw document autocompleters.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                      <span><strong>Context Windows are RAM:</strong> Transformer attention behaves like CPU registers and working memory; retrieved prompt documents dictate instantaneous reasoning fidelity.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Chapters */}
            {previewTab === 'chapters' && (
              <div className="animate-fadeIn space-y-3">
                <p className="text-xs text-slate-500 mb-2 font-medium">
                  Click any chapter to test instant timestamp jumping:
                </p>
                {[
                  { time: '00:00', title: 'Introduction & What is an LLM', summary: 'Defining the tokenizer and the fundamental architecture of neural language generation.' },
                  { time: '14:22', title: 'Pre-Training: The Lossy Internet Compressor', summary: 'How GPU clusters spend millions in compute to predict the next word across web scrape tokens.' },
                  { time: '32:45', title: 'Supervised Fine-Tuning & Dialogue Formatting', summary: 'Curating tens of thousands of high-quality Q&A pairs to align raw models into assistants.' },
                  { time: '48:10', title: 'RLHF & Security Challenges (Jailbreaks)', summary: 'Reinforcement learning from human preferences and handling hallucinations or prompt injection.' }
                ].map((ch, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-colors flex items-start gap-3"
                  >
                    <span className="font-mono text-xs font-bold text-[#7C3AED] bg-violet-100 px-2.5 py-1 rounded-lg shrink-0">
                      {ch.time}
                    </span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-display">{ch.title}</h5>
                      <p className="text-xs text-slate-600 mt-0.5">{ch.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Interactive Flashcard */}
            {previewTab === 'flashcards' && (
              <div className="animate-fadeIn flex flex-col items-center justify-center py-4">
                <div
                  onClick={() => setIsFlippedCard(!isFlippedCard)}
                  className="w-full max-w-md h-52 cursor-pointer select-none rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-white to-violet-50/40 p-6 flex flex-col justify-between shadow-md hover:border-[#7C3AED] transition-all hover:shadow-lg relative group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="uppercase tracking-wider text-[#7C3AED]">Concept Flashcard #1</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <RotateCw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
                      <span>{isFlippedCard ? 'Showing Answer' : 'Click to Flip'}</span>
                    </span>
                  </div>

                  <div className="text-center my-auto px-2">
                    {!isFlippedCard ? (
                      <div>
                        <p className="text-xs text-violet-600 font-bold uppercase tracking-wider mb-2">Prompt / Question</p>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                          What is the fundamental difference between Pre-training and Fine-tuning in LLMs?
                        </h4>
                      </div>
                    ) : (
                      <div className="animate-fadeIn">
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Recall Answer</p>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                          Pre-training learns universal world knowledge by predicting next tokens on terabytes of raw text (expensive, months). 
                          Fine-tuning trains the pre-trained weights on structured Q&A conversations to adopt a helpful assistant persona.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
                    <span>Card 1 of 12</span>
                    <span className="text-violet-600 font-bold">Tap card to toggle front/back</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: AI Tutor */}
            {previewTab === 'chat' && (
              <div className="animate-fadeIn max-w-lg mx-auto space-y-3">
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs bg-[#7C3AED] text-white p-3 rounded-2xl rounded-tr-xs font-medium shadow-2xs max-w-[85%]">
                    Can you explain what "RLHF" actually stands for and why Karpathy emphasizes it?
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="text-xs bg-slate-100 text-slate-800 p-3.5 rounded-2xl rounded-tl-xs font-medium border border-slate-200 max-w-[90%] leading-relaxed">
                    <p>
                      <strong>RLHF</strong> stands for <em>Reinforcement Learning from Human Feedback</em>.
                    </p>
                    <p className="mt-1.5 text-slate-600">
                      Karpathy explains that while basic fine-tuning mimics dialogues, RLHF lets humans rank multiple model responses. A reward model is trained on these human preferences, allowing the assistant to align itself toward helpfulness and safety without hallucinating.
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">Grounded video citation:</span>
                      <span className="font-mono text-[10px] font-bold text-[#7C3AED] bg-violet-100 px-2 py-0.5 rounded cursor-pointer hover:bg-violet-200">
                        [38:20] RLHF Optimization
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Core Pillars Grid (High Craft, Anti-Slop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold mb-3">
            <Play className="h-4 w-4 fill-current ml-0.5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display mb-1.5">
            Zero-Hallucination Timestamps
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every chapter, quote, and summary point is mapped directly to the exact second in the YouTube stream.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold mb-3">
            <Layers className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display mb-1.5">
            Interactive Recall Decks
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Spaced repetition-ready flashcards and self-quizzing questions automatically extracted from core themes.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold mb-3">
            <Sparkles className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display mb-1.5">
            Contextual AI Tutor
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ask nuanced questions about complex technical proofs or concepts with instant citation back-links.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold mb-3">
            <Download className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display mb-1.5">
            Notion & PDF Export
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download formatted Markdown for Obsidian & Notion, or generate clean, publication-ready PDFs.
          </p>
        </div>
      </div>
    </div>
  );
};
