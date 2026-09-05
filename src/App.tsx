import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { YouTubeInput } from './components/YouTubeInput.tsx';
import { ProcessingStatus } from './components/ProcessingStatus.tsx';
import { DashboardHeader, DashboardTab } from './components/DashboardHeader.tsx';
import { SummaryOverview } from './components/SummaryOverview.tsx';
import { ChapterList } from './components/ChapterList.tsx';
import { TranscriptViewer } from './components/TranscriptViewer.tsx';
import { QuestionsView } from './components/QuestionsView.tsx';
import { FlashcardsView } from './components/FlashcardsView.tsx';
import { ChatInterface } from './components/ChatInterface.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { ManualTranscriptModal } from './components/ManualTranscriptModal.tsx';
import { PreferencesModal } from './components/PreferencesModal.tsx';
import { getYouTubeTimestampUrl } from './lib/time-utils.ts';
import { Play, Copy, Check, Download, Send, Loader2, ArrowRight, FileText, Sparkles, AlertCircle } from 'lucide-react';

import {
  ProcessedVideoPayload,
  HistoryEntry,
  SummaryLength,
  SummaryStyle,
  SummaryLanguage,
  VideoMetadata,
  FlashcardItem
} from './types/index.ts';

export function App() {
  const [activePayload, setActivePayload] = useState<ProcessedVideoPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingMeta, setProcessingMeta] = useState<VideoMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastAttemptedUrl, setLastAttemptedUrl] = useState('');
  const [isCopiedSummary, setIsCopiedSummary] = useState(false);
  const [sidebarChatInput, setSidebarChatInput] = useState('');

  // Modals & Drawers
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Sub-task loading states
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);

  // User History & Preferences
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [preferences, setPreferences] = useState<{
    defaultLength: SummaryLength;
    defaultStyle: SummaryStyle;
    defaultLanguage: SummaryLanguage;
  }>({
    defaultLength: 'medium',
    defaultStyle: 'simple',
    defaultLanguage: 'English'
  });

  // Load initial data
  useEffect(() => {
    fetchHistory();
    fetchPreferences();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.warn('Failed to load history:', err);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/preferences');
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (err) {
      console.warn('Failed to load preferences:', err);
    }
  };

  // Main process handler
  const handleProcessVideo = async (
    url: string,
    length = preferences.defaultLength,
    style = preferences.defaultStyle,
    language = preferences.defaultLanguage,
    customTranscript?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    if (url) {
      setLastAttemptedUrl(url);
    }
    setProcessingStep(0);
    setProcessingMeta(null);

    // Progressive step timers for feedback while AI model processes
    const timer1 = setTimeout(() => setProcessingStep(1), 1200);
    const timer2 = setTimeout(() => setProcessingStep(2), 2600);
    const timer3 = setTimeout(() => setProcessingStep(3), 5500);

    try {
      const response = await fetch('/api/videos/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          length,
          style,
          language,
          customTranscript
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze video.');
      }

      setProcessingStep(4);
      const data: ProcessedVideoPayload = await response.json();

      // Brief delay to show 100% completion before rendering dashboard
      setTimeout(() => {
        setActivePayload(data);
        setActiveTab('overview');
        setIsLoading(false);
        fetchHistory();
      }, 500);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  // Load from history
  const handleSelectHistoryVideo = async (youtubeId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/videos/${youtubeId}`);
      if (!res.ok) throw new Error('Video not found.');
      const data = await res.json();
      setActivePayload(data);
      setActiveTab('overview');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load video.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete from history
  const handleDeleteHistoryVideo = async (youtubeId: string) => {
    try {
      await fetch(`/api/videos/${youtubeId}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(h => h.youtubeId !== youtubeId));
      if (activePayload?.video.youtubeId === youtubeId) {
        setActivePayload(null);
      }
    } catch (err) {
      console.error('Failed to delete video:', err);
    }
  };

  // Copy TL;DR
  const handleCopySummary = () => {
    if (!activePayload) return;
    navigator.clipboard.writeText(activePayload.summary.tldr);
    setIsCopiedSummary(true);
    setTimeout(() => setIsCopiedSummary(false), 2000);
  };

  // Chat message sender
  const handleSendChatMessage = async (question: string) => {
    if (!activePayload) return;
    setIsSendingChatMessage(true);

    // Optimistically add user message
    const tempUserMsg = {
      id: `temp_${Date.now()}`,
      role: 'user' as const,
      content: question,
      createdAt: new Date().toISOString()
    };

    setActivePayload(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        chatMessages: [...prev.chatMessages, tempUserMsg]
      };
    });

    try {
      const res = await fetch(`/api/videos/${activePayload.video.youtubeId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!res.ok) throw new Error('Failed to get answer.');
      const assistantMsg = await res.json();

      setActivePayload(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          chatMessages: [...prev.chatMessages, assistantMsg]
        };
      });
    } catch (err: any) {
      console.error('Chat error:', err);
    } finally {
      setIsSendingChatMessage(false);
    }
  };

  // Generate more questions
  const handleGenerateMoreQuestions = async () => {
    if (!activePayload) return;
    setIsGeneratingQuestions(true);
    try {
      const res = await fetch(`/api/videos/${activePayload.video.youtubeId}/questions`, {
        method: 'POST'
      });
      if (res.ok) {
        const updatedQuestions = await res.json();
        setActivePayload(prev => {
          if (!prev) return prev;
          return { ...prev, questions: updatedQuestions };
        });
      }
    } catch (err) {
      console.error('Failed to generate more questions:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Generate more flashcards
  const handleGenerateMoreFlashcards = async () => {
    if (!activePayload) return;
    setIsGeneratingFlashcards(true);
    try {
      const res = await fetch(`/api/videos/${activePayload.video.youtubeId}/flashcards`, {
        method: 'POST'
      });
      if (res.ok) {
        const updatedCards = await res.json();
        setActivePayload(prev => {
          if (!prev) return prev;
          return { ...prev, flashcards: updatedCards };
        });
      }
    } catch (err) {
      console.error('Failed to generate more flashcards:', err);
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  // Update single flashcard
  const handleUpdateFlashcard = async (cardId: string, updates: Partial<FlashcardItem>) => {
    if (!activePayload) return;
    try {
      // Optimistic update
      setActivePayload(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          flashcards: prev.flashcards.map(c => c.id === cardId ? { ...c, ...updates } : c)
        };
      });

      await fetch(`/api/videos/${activePayload.video.youtubeId}/flashcards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.error('Failed to update flashcard:', err);
    }
  };

  // Save Preferences
  const handleSavePreferences = async (
    length: SummaryLength,
    style: SummaryStyle,
    language: SummaryLanguage
  ) => {
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultLength: length,
          defaultStyle: style,
          defaultLanguage: language
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsPreferencesOpen(true)}
        onResetToHome={() => {
          setActivePayload(null);
          setErrorMessage(null);
        }}
        hasActiveVideo={!!activePayload}
        historyCount={history.length}
      />

      <main className="flex-1 flex flex-col">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mt-4 px-4 w-full animate-fadeIn">
            {errorMessage.toLowerCase().includes('transcript') || errorMessage.toLowerCase().includes('caption') ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/95 p-5 text-xs sm:text-sm text-amber-950 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-amber-200/80 p-2 text-amber-900 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-950 text-sm font-display">
                        YouTube Subtitles Restricted or Unavailable
                      </h4>
                      <p className="mt-1 text-amber-800 text-xs leading-relaxed">
                        YouTube restricted automated subtitle scraping for this video, or captions are disabled. You can paste the transcript text directly in seconds, or try one of our curated high-speed demo lectures below.
                      </p>
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        <button
                          id="error-paste-transcript-btn"
                          type="button"
                          onClick={() => {
                            setErrorMessage(null);
                            setIsManualModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-xs active:scale-95"
                        >
                          <FileText className="h-3.5 w-3.5 text-violet-400" />
                          <span>Paste Transcript Manually</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null);
                            handleProcessVideo('https://www.youtube.com/watch?v=UF8uR6Z6KLc');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-white px-3.5 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100/60 transition-all shadow-2xs"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
                          <span>Try Steve Jobs Stanford Speech</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null);
                            handleProcessVideo('https://www.youtube.com/watch?v=zjkBMFhNj_g');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-white px-3.5 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100/60 transition-all shadow-2xs"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
                          <span>Try Andrej Karpathy LLM Talk</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 p-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <p className="font-medium">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="font-bold underline text-rose-900 ml-4 hover:opacity-80"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {/* View 1: Active Video Dashboard */}
        {activePayload && !isLoading ? (
          <div>
            {/* Desktop Studio 3-Column Layout */}
            <div className="hidden lg:flex p-6 gap-6 h-[calc(100vh-4rem)] overflow-hidden max-w-[1440px] mx-auto w-full">
              {/* Left Column: 280px */}
              <div className="w-[280px] flex flex-col gap-4 shrink-0 overflow-hidden">
                <a
                  href={activePayload.video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-900 group block shrink-0 shadow-xs"
                  title="Watch on YouTube"
                >
                  <img
                    src={activePayload.video.thumbnailUrl}
                    alt={activePayload.video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/50 flex items-center justify-center transition-colors">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-xs rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono">
                    {activePayload.video.durationText || 'Video'}
                  </div>
                </a>

                <div className="flex flex-col gap-1 shrink-0">
                  <h2 className="font-bold text-sm leading-snug text-slate-900 line-clamp-2 font-display">
                    {activePayload.video.title}
                  </h2>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {activePayload.video.channelTitle} {activePayload.video.publishedAt ? `• ${activePayload.video.publishedAt}` : ''}
                  </p>
                </div>

                {/* Key Chapters box */}
                <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl p-4 overflow-hidden flex flex-col min-h-0 shadow-xs">
                  <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 shrink-0">
                    Key Chapters ({activePayload.chapters.length})
                  </h3>
                  <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
                    {activePayload.chapters.length > 0 ? (
                      activePayload.chapters.map((ch) => {
                        const jumpUrl = getYouTubeTimestampUrl(activePayload.video.youtubeId, ch.startTime);
                        return (
                          <a
                            key={ch.id}
                            href={jumpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-2.5 items-start group cursor-pointer text-left p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-[10px] font-mono text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded-md shrink-0 font-bold">
                              {ch.timestamp}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-[#7C3AED] transition-colors line-clamp-2 leading-tight">
                              {ch.title}
                            </span>
                          </a>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic">No chapters available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Column: Study Content Area */}
              <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl flex flex-col overflow-hidden shadow-xs min-w-0">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-4 shrink-0 overflow-x-auto bg-slate-50/40">
                  {(['overview', 'transcript', 'questions', 'flashcards', 'chapters'] as DashboardTab[]).map((tab) => {
                    const isActive = activeTab === tab;
                    const labels: Record<DashboardTab, string> = {
                      overview: 'Overview',
                      transcript: 'Transcript',
                      questions: 'Questions',
                      flashcards: 'Flashcards',
                      chapters: 'All Chapters',
                      chat: 'Chat'
                    };
                    return (
                      <button
                        key={tab}
                        id={`desktop-tab-${tab}`}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                          isActive
                            ? 'border-[#7C3AED] text-[#7C3AED]'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {labels[tab]}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {activeTab === 'overview' && (
                    <SummaryOverview
                      summary={activePayload.summary}
                      video={activePayload.video}
                      isAiSynthesized={activePayload.transcript.isAiSynthesized}
                      onOpenManualTranscript={() => setIsManualModalOpen(true)}
                    />
                  )}

                  {activeTab === 'transcript' && (
                    <TranscriptViewer
                      segments={activePayload.transcript.segments}
                      fullText={activePayload.transcript.fullText}
                      video={activePayload.video}
                      isAiSynthesized={activePayload.transcript.isAiSynthesized}
                      onOpenManualTranscript={() => setIsManualModalOpen(true)}
                    />
                  )}

                  {activeTab === 'chapters' && (
                    <ChapterList
                      chapters={activePayload.chapters}
                      video={activePayload.video}
                    />
                  )}

                  {activeTab === 'questions' && (
                    <QuestionsView
                      questions={activePayload.questions}
                      video={activePayload.video}
                      onGenerateMore={handleGenerateMoreQuestions}
                      isGeneratingMore={isGeneratingQuestions}
                    />
                  )}

                  {activeTab === 'flashcards' && (
                    <FlashcardsView
                      flashcards={activePayload.flashcards}
                      video={activePayload.video}
                      onUpdateCard={handleUpdateFlashcard}
                      onGenerateMore={handleGenerateMoreFlashcards}
                      isGeneratingMore={isGeneratingFlashcards}
                    />
                  )}

                  {activeTab === 'chat' && (
                    <ChatInterface
                      messages={activePayload.chatMessages}
                      video={activePayload.video}
                      onSendMessage={handleSendChatMessage}
                      isSending={isSendingChatMessage}
                    />
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="p-3.5 px-5 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center shrink-0">
                  <div className="flex gap-2">
                    <button
                      id="desktop-copy-summary-btn"
                      type="button"
                      onClick={handleCopySummary}
                      className="px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl flex items-center gap-1.5 font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-2xs active:scale-95"
                    >
                      {isCopiedSummary ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>

                    <button
                      id="desktop-export-btn"
                      type="button"
                      onClick={() => setIsExportOpen(true)}
                      className="px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl flex items-center gap-1.5 font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-2xs active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>Export Study Pack</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold font-mono">
                    Gemini 3.8 Flash • Real-time Grounding
                  </span>
                </div>
              </div>

              {/* Right Column: 320px Ask the Video */}
              <div className="w-[320px] flex flex-col gap-4 shrink-0 overflow-hidden">
                <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl flex flex-col overflow-hidden shadow-xs min-h-0">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 font-display">
                        Ask the Lecture
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                      AI Tutor
                    </span>
                  </div>

                  <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                    {activePayload.chatMessages.length === 0 ? (
                      <div className="my-auto text-center py-8 px-2">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center mx-auto mb-2.5">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-slate-500 mb-3 font-medium">
                          Ask any specific question about this video's concepts.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSendChatMessage("What are the key takeaways of this video?")}
                          className="text-[11px] font-semibold rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-slate-700 hover:border-violet-300 hover:text-[#7C3AED] hover:bg-violet-50/40 transition-all text-left"
                        >
                          "What are the core takeaways?"
                        </button>
                      </div>
                    ) : (
                      activePayload.chatMessages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`text-xs p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                                isUser
                                  ? 'bg-[#7C3AED] text-white rounded-tr-xs font-medium shadow-2xs'
                                  : 'bg-slate-100/90 text-slate-900 rounded-tl-xs font-normal border border-slate-200/50'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
                                  {msg.citations.map((c, i) => (
                                    <a
                                      key={i}
                                      href={getYouTubeTimestampUrl(activePayload.video.youtubeId, c.seconds)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#7C3AED] font-mono font-bold text-[10px] bg-violet-50 px-1.5 py-0.5 rounded hover:bg-violet-100 transition-colors"
                                    >
                                      {c.timestamp}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {isSendingChatMessage && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 p-3 rounded-2xl rounded-tl-xs">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7C3AED]" />
                        <span>Searching lecture transcript...</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/50">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (sidebarChatInput.trim() && !isSendingChatMessage) {
                          handleSendChatMessage(sidebarChatInput.trim());
                          setSidebarChatInput('');
                        }
                      }}
                      className="relative"
                    >
                      <textarea
                        value={sidebarChatInput}
                        onChange={(e) => setSidebarChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (sidebarChatInput.trim() && !isSendingChatMessage) {
                              handleSendChatMessage(sidebarChatInput.trim());
                              setSidebarChatInput('');
                            }
                          }
                        }}
                        placeholder="Ask a question..."
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 resize-none outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 pr-9 font-medium"
                      />
                      <button
                        type="submit"
                        disabled={!sidebarChatInput.trim() || isSendingChatMessage}
                        className="absolute bottom-3 right-2.5 w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-slate-800 transition-all active:scale-95 shadow-2xs"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Quick Learning Mode card */}
                <div
                  onClick={() => setActiveTab('flashcards')}
                  className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between group cursor-pointer shrink-0 hover:bg-slate-800 transition-all shadow-xs"
                >
                  <div className="flex flex-col">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider">
                      Interactive Study Deck
                    </span>
                    <span className="text-white text-xs font-bold font-display">
                      Practice {activePayload.flashcards.length} Recall Flashcards
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white text-sm group-hover:translate-x-0.5 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet View (<1024px) */}
            <div className="lg:hidden">
              <DashboardHeader
                video={activePayload.video}
                summary={activePayload.summary}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onOpenExport={() => setIsExportOpen(true)}
                onCopySummary={handleCopySummary}
                isCopied={isCopiedSummary}
                questionCount={activePayload.questions.length}
                flashcardCount={activePayload.flashcards.length}
                chapterCount={activePayload.chapters.length}
              />

              <div className="max-w-7xl mx-auto w-full">
                {activeTab === 'overview' && (
                  <SummaryOverview
                    summary={activePayload.summary}
                    video={activePayload.video}
                    isAiSynthesized={activePayload.transcript.isAiSynthesized}
                    onOpenManualTranscript={() => setIsManualModalOpen(true)}
                  />
                )}

                {activeTab === 'transcript' && (
                  <TranscriptViewer
                    segments={activePayload.transcript.segments}
                    fullText={activePayload.transcript.fullText}
                    video={activePayload.video}
                    isAiSynthesized={activePayload.transcript.isAiSynthesized}
                    onOpenManualTranscript={() => setIsManualModalOpen(true)}
                  />
                )}

                {activeTab === 'chapters' && (
                  <ChapterList
                    chapters={activePayload.chapters}
                    video={activePayload.video}
                  />
                )}

                {activeTab === 'questions' && (
                  <QuestionsView
                    questions={activePayload.questions}
                    video={activePayload.video}
                    onGenerateMore={handleGenerateMoreQuestions}
                    isGeneratingMore={isGeneratingQuestions}
                  />
                )}

                {activeTab === 'flashcards' && (
                  <FlashcardsView
                    flashcards={activePayload.flashcards}
                    video={activePayload.video}
                    onUpdateCard={handleUpdateFlashcard}
                    onGenerateMore={handleGenerateMoreFlashcards}
                    isGeneratingMore={isGeneratingFlashcards}
                  />
                )}

                {activeTab === 'chat' && (
                  <ChatInterface
                    messages={activePayload.chatMessages}
                    video={activePayload.video}
                    onSendMessage={handleSendChatMessage}
                    isSending={isSendingChatMessage}
                  />
                )}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          /* View 2: Processing Status */
          <div className="flex-1 flex flex-col justify-center px-4">
            <ProcessingStatus
              video={processingMeta}
              activeStepIndex={processingStep}
            />
          </div>
        ) : (
          /* View 3: Homepage / Hero & Input */
          <div className="flex-1 flex flex-col justify-center">
            <Hero
              onProcessVideo={handleProcessVideo}
              onOpenManualModal={() => setIsManualModalOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              history={history}
              onSelectHistoryVideo={handleSelectHistoryVideo}
              preferences={preferences}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/90 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-medium text-slate-600">SummTube • AI-Powered Lecture Synthesis & Interactive Study</span>
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Local & Cloud Persistence</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {activePayload && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          payload={activePayload}
        />
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectVideo={handleSelectHistoryVideo}
        onDeleteVideo={handleDeleteHistoryVideo}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        length={preferences.defaultLength}
        style={preferences.defaultStyle}
        language={preferences.defaultLanguage}
        onSave={handleSavePreferences}
      />

      <ManualTranscriptModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        initialUrl={lastAttemptedUrl}
        onSubmit={(url, transcript, len, st, lang) => {
          handleProcessVideo(url, len, st, lang, transcript);
        }}
      />
    </div>
  );
}

export default App;
