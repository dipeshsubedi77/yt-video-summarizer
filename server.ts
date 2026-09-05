import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import {
  extractVideoId,
  fetchVideoMetadata,
  fetchTranscript
} from './server/youtube-service.ts';
import { getAIService } from './server/ai-service.ts';
import { dbStore } from './server/db.ts';
import {
  ProcessOptions,
  ProcessedVideoPayload,
  SummaryLength,
  SummaryStyle,
  SummaryLanguage
} from './src/types/index.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API ROUTES

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Process a YouTube Video URL (or custom transcript)
  app.post('/api/videos/process', async (req: Request, res: Response) => {
    try {
      const {
        url,
        length = 'medium',
        style = 'simple',
        language = 'English',
        customTranscript
      }: ProcessOptions = req.body;

      if (!url && !customTranscript) {
        return res.status(400).json({ error: 'Please provide a YouTube video URL or transcript.' });
      }

      const videoId = extractVideoId(url || '') || `custom_${Date.now()}`;
      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL format. Please provide a valid watch or youtu.be link.' });
      }

      // Check if already processed with identical options
      const existing = dbStore.getVideo(videoId);
      if (
        existing &&
        existing.summary.length === length &&
        existing.summary.style === style &&
        existing.summary.language === language &&
        !customTranscript
      ) {
        return res.json(existing);
      }

      // 1. Fetch Metadata
      const videoMeta = await fetchVideoMetadata(videoId);

      // 2. Fetch & clean transcript (with video metadata for intelligent fallback if YouTube captions are restricted)
      const transcriptData = await fetchTranscript(videoId, customTranscript, videoMeta);
      if (!transcriptData.segments || transcriptData.segments.length === 0) {
        return res.status(422).json({
          error: "We couldn't retrieve a transcript for this video. Please ensure the video has closed captions enabled, or paste the transcript text directly."
        });
      }

      // 3. AI Service generation (High-efficiency unified call saving 75% quota and avoiding 429 burst errors)
      const aiService = getAIService();
      const { summary, chapters, questions, flashcards } = await aiService.generateFullStudyGuide({
        videoId,
        videoTitle: videoMeta.title,
        channelTitle: videoMeta.channelTitle,
        transcriptText: transcriptData.fullText,
        segments: transcriptData.segments,
        length: length as SummaryLength,
        style: style as SummaryStyle,
        language: language as SummaryLanguage
      });

      const payload: ProcessedVideoPayload = {
        video: videoMeta,
        transcript: transcriptData,
        summary,
        chapters,
        questions,
        flashcards,
        chatMessages: [
          {
            id: `msg_welcome_${Date.now()}`,
            role: 'assistant',
            content: `Hello! I have analyzed **"${videoMeta.title}"**. Ask me anything about the key concepts, timestamps, explanations, or exam questions from this video.`,
            createdAt: new Date().toISOString()
          }
        ]
      };

      // 4. Save to persistent DB
      dbStore.saveVideo(payload);

      return res.json(payload);
    } catch (err: any) {
      console.error('Error processing video:', err);
      const userMessage = err?.message || 'An error occurred while analyzing the YouTube video.';
      return res.status(500).json({ error: userMessage });
    }
  });

  // Get Video by ID
  app.get('/api/videos/:id', (req: Request, res: Response) => {
    const video = dbStore.getVideo(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video analysis not found.' });
    }
    return res.json(video);
  });

  // Get Transcript only
  app.get('/api/videos/:id/transcript', (req: Request, res: Response) => {
    const video = dbStore.getVideo(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found.' });
    return res.json(video.transcript);
  });

  // Get Summary only
  app.get('/api/videos/:id/summary', (req: Request, res: Response) => {
    const video = dbStore.getVideo(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found.' });
    return res.json(video.summary);
  });

  // Generate more questions
  app.post('/api/videos/:id/questions', async (req: Request, res: Response) => {
    try {
      const video = dbStore.getVideo(req.params.id);
      if (!video) return res.status(404).json({ error: 'Video not found.' });

      const aiService = getAIService();
      const newQuestions = await aiService.generateQuestions({
        videoId: video.video.youtubeId,
        videoTitle: video.video.title,
        transcriptText: video.transcript.fullText
      });

      video.questions.push(...newQuestions);
      dbStore.saveVideo(video);
      return res.json(video.questions);
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to generate questions.' });
    }
  });

  // Generate more flashcards
  app.post('/api/videos/:id/flashcards', async (req: Request, res: Response) => {
    try {
      const video = dbStore.getVideo(req.params.id);
      if (!video) return res.status(404).json({ error: 'Video not found.' });

      const aiService = getAIService();
      const newFlashcards = await aiService.generateFlashcards({
        videoId: video.video.youtubeId,
        videoTitle: video.video.title,
        transcriptText: video.transcript.fullText
      });

      video.flashcards.push(...newFlashcards);
      dbStore.saveVideo(video);
      return res.json(video.flashcards);
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to generate flashcards.' });
    }
  });

  // Update flashcard difficulty/review status
  app.patch('/api/videos/:id/flashcards/:cardId', (req: Request, res: Response) => {
    const updated = dbStore.updateFlashcard(req.params.id, req.params.cardId, req.body);
    if (!updated) return res.status(404).json({ error: 'Flashcard not found.' });
    return res.json(updated);
  });

  // Ask this video (Conversational Chat)
  app.post('/api/videos/:id/chat', async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required.' });
      }

      const video = dbStore.getVideo(req.params.id);
      if (!video) return res.status(404).json({ error: 'Video not found.' });

      // Add user message
      dbStore.addChatMessage(video.video.youtubeId, 'user', question.trim());

      const history = (video.chatMessages || []).map(m => ({
        role: m.role,
        content: m.content
      }));

      const aiService = getAIService();
      const answerResult = await aiService.answerQuestion({
        videoId: video.video.youtubeId,
        videoTitle: video.video.title,
        transcriptText: video.transcript.fullText,
        segments: video.transcript.segments,
        question: question.trim(),
        history
      });

      // Add assistant response
      const assistantMsg = dbStore.addChatMessage(
        video.video.youtubeId,
        'assistant',
        answerResult.content,
        answerResult.citations
      );

      return res.json(assistantMsg);
    } catch (err: any) {
      console.error('Chat error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to process question.' });
    }
  });

  // History endpoints
  app.get('/api/history', (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const items = dbStore.getHistory(search);
    return res.json(items);
  });

  app.delete('/api/videos/:id', (req: Request, res: Response) => {
    const success = dbStore.deleteVideo(req.params.id);
    if (!success) return res.status(404).json({ error: 'Video not found in history.' });
    return res.json({ success: true });
  });

  // User preferences
  app.get('/api/preferences', (req: Request, res: Response) => {
    return res.json(dbStore.getPreferences());
  });

  app.post('/api/preferences', (req: Request, res: Response) => {
    const updated = dbStore.updatePreferences(req.body);
    return res.json(updated);
  });

  // Curated demo list endpoint
  app.get('/api/curated', (req: Request, res: Response) => {
    return res.json([
      {
        category: 'Lecture',
        title: '[1hr Talk] Intro to Large Language Models',
        channel: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
        videoId: 'zjkBMFhNj_g',
        duration: '1:00:00'
      },
      {
        category: 'Tutorial',
        title: 'But what is a neural network? | Deep learning, chapter 1',
        channel: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=sVx1MmxW074',
        videoId: 'sVx1MmxW074',
        duration: '19:10'
      },
      {
        category: 'Podcast',
        title: 'Sam Altman: OpenAI, GPT-4, and the Future of AI',
        channel: 'Lex Fridman',
        url: 'https://www.youtube.com/watch?v=L_Guz73e6fw',
        videoId: 'L_Guz73e6fw',
        duration: '2:22:00'
      },
      {
        category: 'Interview',
        title: "Steve Jobs' 2005 Stanford Commencement Address",
        channel: 'Stanford',
        url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
        videoId: 'UF8uR6Z6KLc',
        duration: '15:04'
      },
      {
        category: 'Documentary',
        title: 'The Simplest Math Problem No One Can Solve',
        channel: 'Veritasium',
        url: 'https://www.youtube.com/watch?v=094y1Z2wpJg',
        videoId: '094y1Z2wpJg',
        duration: '22:00'
      }
    ]);
  });

  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
