import fs from 'fs';
import path from 'path';
import {
  ProcessedVideoPayload,
  HistoryEntry,
  FlashcardItem,
  ChatMessageItem,
  ChatCitation,
  SummaryLength,
  SummaryStyle,
  SummaryLanguage
} from '../src/types/index.ts';

interface AppDatabase {
  videos: Record<string, ProcessedVideoPayload>;
  history: HistoryEntry[];
  userPreferences: {
    defaultLength: SummaryLength;
    defaultStyle: SummaryStyle;
    defaultLanguage: SummaryLanguage;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app-db.json');

class DatabaseStore {
  private data: AppDatabase;

  constructor() {
    this.data = {
      videos: {},
      history: [],
      userPreferences: {
        defaultLength: 'medium',
        defaultStyle: 'simple',
        defaultLanguage: 'English'
      }
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          videos: parsed.videos || {},
          history: parsed.history || [],
          userPreferences: parsed.userPreferences || this.data.userPreferences
        };
      } else {
        this.persist();
      }
    } catch (err) {
      console.warn('Could not initialize file database, using in-memory fallback:', err);
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to file:', err);
    }
  }

  public saveVideo(payload: ProcessedVideoPayload) {
    const { video, summary } = payload;
    this.data.videos[video.youtubeId] = payload;

    // Update or insert history item
    const existingIdx = this.data.history.findIndex(h => h.youtubeId === video.youtubeId);
    const historyItem: HistoryEntry = {
      id: video.id,
      youtubeId: video.youtubeId,
      title: video.title,
      channelTitle: video.channelTitle,
      thumbnailUrl: video.thumbnailUrl,
      durationText: video.durationText,
      summaryLength: summary.length,
      summaryStyle: summary.style,
      language: summary.language,
      dateSummarized: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tldr: summary.tldr
    };

    if (existingIdx >= 0) {
      this.data.history[existingIdx] = historyItem;
    } else {
      this.data.history.unshift(historyItem);
    }

    this.persist();
    return payload;
  }

  public getVideo(youtubeId: string): ProcessedVideoPayload | null {
    return this.data.videos[youtubeId] || null;
  }

  public getHistory(search?: string): HistoryEntry[] {
    let list = [...this.data.history];
    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.channelTitle.toLowerCase().includes(q) ||
        item.tldr.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public deleteVideo(youtubeId: string): boolean {
    if (this.data.videos[youtubeId]) {
      delete this.data.videos[youtubeId];
      this.data.history = this.data.history.filter(h => h.youtubeId !== youtubeId);
      this.persist();
      return true;
    }
    return false;
  }

  public updateFlashcard(youtubeId: string, cardId: string, updates: Partial<FlashcardItem>): FlashcardItem | null {
    const video = this.data.videos[youtubeId];
    if (!video || !video.flashcards) return null;

    const card = video.flashcards.find(fc => fc.id === cardId);
    if (!card) return null;

    Object.assign(card, updates);
    this.persist();
    return card;
  }

  public addChatMessage(
    youtubeId: string,
    role: 'user' | 'assistant',
    content: string,
    citations?: ChatCitation[]
  ): ChatMessageItem {
    const video = this.data.videos[youtubeId];
    if (!video) throw new Error('Video not found');

    if (!video.chatMessages) {
      video.chatMessages = [];
    }

    const newMsg: ChatMessageItem = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      role,
      content,
      citations,
      createdAt: new Date().toISOString()
    };

    video.chatMessages.push(newMsg);
    this.persist();
    return newMsg;
  }

  public getPreferences() {
    return this.data.userPreferences;
  }

  public updatePreferences(prefs: Partial<AppDatabase['userPreferences']>) {
    this.data.userPreferences = { ...this.data.userPreferences, ...prefs };
    this.persist();
    return this.data.userPreferences;
  }
}

export const dbStore = new DatabaseStore();
