export function formatSeconds(sec: number): string {
  if (isNaN(sec) || sec < 0) return '00:00';
  const total = Math.floor(sec);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
}

export function getYouTubeTimestampUrl(videoId: string, seconds: number): string {
  const roundedSec = Math.max(0, Math.floor(seconds));
  return `https://www.youtube.com/watch?v=${videoId}&t=${roundedSec}s`;
}
