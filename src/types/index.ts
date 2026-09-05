export type SummaryLength = 'short' | 'medium' | 'detailed';
export type SummaryStyle = 'simple' | 'academic' | 'technical' | 'beginner_friendly' | 'exam_focused';
export type SummaryLanguage = 'English' | 'Nepali' | 'Hindi';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type QuestionCategory = 'Basic' | 'Intermediate' | 'Advanced';

export interface TranscriptSegment {
  text: string;
  start: number; // in seconds
  duration: number; // in seconds
}

export interface VideoMetadata {
  id: string;
  youtubeId: string;
  url: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  durationSec: number;
  durationText: string;
  publishedAt?: string;
  authorUrl?: string;
}

export interface DetailedSection {
  title: string;
  content: string;
  keyPoints?: string[];
}

export interface ImportantConcept {
  term: string;
  definition: string;
  context?: string;
}

export interface KeyQuote {
  quote: string;
  timestamp?: string;
  speaker?: string;
}

export interface SummaryData {
  id: string;
  videoId: string;
  length: SummaryLength;
  style: SummaryStyle;
  language: SummaryLanguage;
  difficulty: DifficultyLevel;
  tldr: string;
  keyTakeaways: string[];
  detailedSummary: DetailedSection[];
  importantConcepts: ImportantConcept[];
  actionItems: string[];
  keyQuotes: KeyQuote[];
  keywords: string[];
  createdAt: string;
}

export interface ChapterItem {
  id: string;
  videoId: string;
  title: string;
  startTime: number; // in seconds
  timestamp: string; // e.g. "02:15"
  summary: string;
  keyPoints?: string[];
}

export interface QuestionItem {
  id: string;
  videoId: string;
  category: QuestionCategory;
  question: string;
  answer: string;
  explanation: string;
  timestamp?: string;
}

export interface FlashcardItem {
  id: string;
  videoId: string;
  front: string;
  back: string;
  concept?: string;
  isDifficult: boolean;
  repetitions: number;
  interval: number;
  easeFactor: number;
  nextReview?: string;
}

export interface ChatCitation {
  timestamp: string;
  seconds: number;
  snippet?: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: ChatCitation[];
  createdAt: string;
}

export interface ProcessedVideoPayload {
  video: VideoMetadata;
  transcript: {
    language: string;
    isAuto: boolean;
    isAiSynthesized?: boolean;
    segments: TranscriptSegment[];
    fullText: string;
  };
  summary: SummaryData;
  chapters: ChapterItem[];
  questions: QuestionItem[];
  flashcards: FlashcardItem[];
  chatMessages: ChatMessageItem[];
}

export interface ProcessOptions {
  url: string;
  length?: SummaryLength;
  style?: SummaryStyle;
  language?: SummaryLanguage;
  customTranscript?: string;
}

export interface HistoryEntry {
  id: string;
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  durationText: string;
  summaryLength: SummaryLength;
  summaryStyle: SummaryStyle;
  language: SummaryLanguage;
  dateSummarized: string;
  tldr: string;
}

export type ProcessingStepStatus = 'waiting' | 'in-progress' | 'completed' | 'error';

export interface ProcessingStep {
  id: string;
  label: string;
  status: ProcessingStepStatus;
  detail?: string;
}
