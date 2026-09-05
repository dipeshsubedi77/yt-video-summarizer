import { YoutubeTranscript } from 'youtube-transcript';
import { TranscriptSegment, VideoMetadata } from '../src/types/index.ts';
import { CURATED_VIDEOS } from './curated-transcripts.ts';

/**
 * Extracts YouTube Video ID from any standard URL or ID string
 */
export function extractVideoId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatSecondsToTimestamp(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const sec = Math.floor(totalSeconds);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const paddedMin = String(minutes).padStart(2, '0');
  const paddedSec = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMin}:${paddedSec}`;
  }
  return `${paddedMin}:${paddedSec}`;
}

/**
 * Decodes HTML entities commonly found in YouTube subtitles
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Fetches official YouTube metadata via public oEmbed API
 */
export async function fetchVideoMetadata(videoId: string): Promise<VideoMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const fallbackThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // Check curated videos first for rich cached metadata
  if (CURATED_VIDEOS[videoId]) {
    const curated = CURATED_VIDEOS[videoId];
    return {
      id: curated.videoId,
      youtubeId: curated.videoId,
      url: curated.url,
      title: curated.title,
      channelTitle: curated.channelTitle,
      thumbnailUrl: curated.thumbnailUrl,
      durationSec: curated.durationSec,
      durationText: curated.durationText,
      publishedAt: 'Recent'
    };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
    const res = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: videoId,
        youtubeId: videoId,
        url: watchUrl,
        title: data.title || `YouTube Video (${videoId})`,
        channelTitle: data.author_name || 'YouTube Creator',
        thumbnailUrl: data.thumbnail_url || fallbackThumbnail,
        durationSec: 600, // Estimated default if not parsed from page
        durationText: '10:00',
        authorUrl: data.author_url,
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    }
  } catch (err) {
    console.warn(`oEmbed fetch failed for ${videoId}, using fallback:`, err);
  }

  return {
    id: videoId,
    youtubeId: videoId,
    url: watchUrl,
    title: `YouTube Video (${videoId})`,
    channelTitle: 'YouTube Creator',
    thumbnailUrl: fallbackThumbnail,
    durationSec: 600,
    durationText: '10:00',
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

/**
 * Fetches and normalizes transcript from YouTube or custom input,
 * falling back to Gemini AI knowledge synthesis if YouTube scraper is restricted.
 */
export async function fetchTranscript(
  videoId: string,
  customTranscript?: string,
  videoMeta?: VideoMetadata
): Promise<{
  segments: TranscriptSegment[];
  fullText: string;
  language: string;
  isAuto: boolean;
  isAiSynthesized?: boolean;
}> {
  // 1. If user provided a custom pasted transcript
  if (customTranscript && customTranscript.trim().length > 10) {
    const cleanText = decodeHtmlEntities(customTranscript.trim());
    // Parse into pseudo-segments every 3-4 sentences
    const sentences = cleanText.match(/[^.!?]+[.!?]+(\s|$)/g) || [cleanText];
    const segments: TranscriptSegment[] = [];
    let currentTime = 0;

    for (let i = 0; i < sentences.length; i += 3) {
      const chunkText = sentences.slice(i, i + 3).join(' ').trim();
      if (chunkText) {
        const estDuration = Math.max(5, Math.round(chunkText.split(/\s+/).length * 0.4));
        segments.push({
          text: chunkText,
          start: currentTime,
          duration: estDuration
        });
        currentTime += estDuration;
      }
    }

    return {
      segments,
      fullText: cleanText,
      language: 'en',
      isAuto: false,
      isAiSynthesized: false
    };
  }

  // 2. Check if this is one of our curated educational demo videos
  if (CURATED_VIDEOS[videoId]) {
    const curated = CURATED_VIDEOS[videoId];
    const fullText = curated.segments.map(s => s.text).join(' ');
    return {
      segments: curated.segments,
      fullText,
      language: 'en',
      isAuto: false,
      isAiSynthesized: false
    };
  }

  // 3. Attempt extraction via youtube-transcript
  try {
    const rawItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (rawItems && rawItems.length > 0) {
      const segments: TranscriptSegment[] = rawItems.map(item => ({
        text: decodeHtmlEntities(item.text),
        start: Math.round(item.offset / 1000),
        duration: Math.round(item.duration / 1000)
      })).filter(seg => seg.text.length > 0);

      const fullText = segments.map(s => s.text).join(' ');
      return {
        segments,
        fullText,
        language: 'en',
        isAuto: true,
        isAiSynthesized: false
      };
    }
  } catch (err: any) {
    console.warn(`youtube-transcript extraction failed for ${videoId}:`, err?.message || err);
  }

  // 4. Smart Fallback: Synthesize transcript using Gemini AI Knowledge
  // This solves the common cloud server IP restriction ("Sign in to confirm you are not a bot")
  if (videoMeta && videoMeta.title) {
    try {
      console.log(`[YouTube Service] Subtitles restricted for "${videoMeta.title}" (${videoId}). Initiating AI synthesis fallback...`);
      const { getAIService } = await import('./ai-service.ts');
      const aiService = getAIService();
      const synthesized = await aiService.synthesizeTranscript(videoMeta);
      console.log(`[YouTube Service] Successfully synthesized ${synthesized.segments.length} segments for "${videoMeta.title}".`);
      return synthesized;
    } catch (aiErr) {
      console.error(`AI transcript synthesis failed for ${videoId}:`, aiErr);
    }
  }

  // 5. If extraction and synthesis both failed, throw a descriptive, human-readable error with helpful advice
  throw new Error(
    `We couldn't retrieve a transcript for this video. Captions may be disabled on this video, or YouTube may have restricted automated subtitle retrieval. You can paste the transcript manually or select one of our curated sample videos.`
  );
}

/**
 * Splits transcript into intelligent chunks while preserving timestamp boundaries
 */
export function chunkTranscript(
  segments: TranscriptSegment[],
  maxCharsPerChunk = 6000
): { text: string; startTime: number; endTime: number; timestampRange: string }[] {
  if (!segments || segments.length === 0) return [];

  const chunks: { text: string; startTime: number; endTime: number; timestampRange: string }[] = [];
  let currentChunkSegments: TranscriptSegment[] = [];
  let currentLength = 0;

  for (const seg of segments) {
    const segLength = seg.text.length + 1;
    if (currentLength + segLength > maxCharsPerChunk && currentChunkSegments.length > 0) {
      const startTime = currentChunkSegments[0].start;
      const lastSeg = currentChunkSegments[currentChunkSegments.length - 1];
      const endTime = lastSeg.start + lastSeg.duration;
      const chunkText = currentChunkSegments.map(s => `[${formatSecondsToTimestamp(s.start)}] ${s.text}`).join(' ');

      chunks.push({
        text: chunkText,
        startTime,
        endTime,
        timestampRange: `${formatSecondsToTimestamp(startTime)} - ${formatSecondsToTimestamp(endTime)}`
      });

      currentChunkSegments = [seg];
      currentLength = segLength;
    } else {
      currentChunkSegments.push(seg);
      currentLength += segLength;
    }
  }

  if (currentChunkSegments.length > 0) {
    const startTime = currentChunkSegments[0].start;
    const lastSeg = currentChunkSegments[currentChunkSegments.length - 1];
    const endTime = lastSeg.start + lastSeg.duration;
    const chunkText = currentChunkSegments.map(s => `[${formatSecondsToTimestamp(s.start)}] ${s.text}`).join(' ');

    chunks.push({
      text: chunkText,
      startTime,
      endTime,
      timestampRange: `${formatSecondsToTimestamp(startTime)} - ${formatSecondsToTimestamp(endTime)}`
    });
  }

  return chunks;
}
