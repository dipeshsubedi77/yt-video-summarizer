import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  User,
  Bot,
  Play,
  Loader2,
  Trash2,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';
import { ChatMessageItem, VideoMetadata } from '../types/index.ts';
import { getYouTubeTimestampUrl } from '../lib/time-utils.ts';

interface ChatInterfaceProps {
  messages: ChatMessageItem[];
  video: VideoMetadata;
  onSendMessage: (question: string) => Promise<void>;
  isSending: boolean;
}

const EXAMPLE_PROMPTS = [
  "Explain the core thesis simply",
  "What are the 3 most crucial takeaways?",
  "Create 2 practice exam questions",
  "What counter-arguments are addressed?",
  "Summarize the final conclusion"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  video,
  onSendMessage,
  isSending
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setInput('');
    await onSendMessage(trimmed);
  };

  const handlePromptClick = async (promptText: string) => {
    if (isSending) return;
    await onSendMessage(promptText);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 flex flex-col h-[680px]">
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-[#7C3AED]">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <span>Interactive Transcript Assistant</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                Grounded
              </span>
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">
              Ask any question directly referencing "{video.title}"
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts if chat is short */}
      {messages.length <= 2 && (
        <div className="mb-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#7C3AED]" />
            <span>Suggested Inquiries</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                disabled={isSending}
                onClick={() => handlePromptClick(prompt)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-300 hover:text-[#7C3AED] hover:bg-violet-50/50 disabled:opacity-50 transition-all text-left shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-violet-100 text-[#7C3AED]'
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Message Content */}
              <div
                className={`text-xs sm:text-sm p-4 leading-relaxed max-w-[85%] sm:max-w-[78%] shadow-2xs ${
                  isUser
                    ? 'bg-[#7C3AED] text-white rounded-2xl rounded-tr-none font-medium'
                    : 'bg-slate-50/90 border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-none'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div>
                    <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed text-slate-800">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Citations / Timestamps */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-200/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                          <Play className="h-2.5 w-2.5 fill-current" />
                          <span>Referenced Moments in Video:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((c, cIdx) => {
                            const jumpUrl = getYouTubeTimestampUrl(video.youtubeId, c.seconds);
                            return (
                              <a
                                key={cIdx}
                                href={jumpUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-violet-50 border border-violet-200/80 px-2 py-0.5 font-mono text-[11px] font-bold text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all active:scale-95"
                              >
                                <Play className="h-2.5 w-2.5 fill-current" />
                                <span>[{c.timestamp}]</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-100 text-[#7C3AED] flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#7C3AED]" />
              <span>Analyzing transcript for exact citations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-3 relative">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition-all">
          <input
            id="chat-question-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this video (e.g., What did the speaker say about...?)"
            disabled={isSending}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden font-medium"
          />
          <button
            id="send-chat-question-btn"
            type="submit"
            disabled={isSending || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all active:scale-95 shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

