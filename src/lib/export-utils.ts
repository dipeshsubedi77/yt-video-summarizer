import { jsPDF } from 'jspdf';
import { ProcessedVideoPayload } from '../types/index.ts';

export function generateMarkdown(payload: ProcessedVideoPayload): string {
  const { video, summary, chapters, questions, flashcards } = payload;

  let md = `# ${video.title}\n\n`;
  md += `**Channel:** ${video.channelTitle}  \n`;
  md += `**Duration:** ${video.durationText}  \n`;
  md += `**Video URL:** ${video.url}  \n`;
  md += `**Summarized on:** ${new Date(summary.createdAt).toLocaleDateString()}  \n`;
  md += `**Difficulty:** ${summary.difficulty} | **Style:** ${summary.style} | **Length:** ${summary.length}\n\n`;
  md += `---\n\n`;

  md += `## TL;DR\n\n${summary.tldr}\n\n`;

  md += `## Key Takeaways\n\n`;
  summary.keyTakeaways.forEach((item, idx) => {
    md += `${idx + 1}. ${item}\n`;
  });
  md += `\n`;

  md += `## Detailed Summary\n\n`;
  summary.detailedSummary.forEach(section => {
    md += `### ${section.title}\n\n${section.content}\n\n`;
    if (section.keyPoints && section.keyPoints.length > 0) {
      section.keyPoints.forEach(kp => {
        md += `- ${kp}\n`;
      });
      md += `\n`;
    }
  });

  if (chapters && chapters.length > 0) {
    md += `## Timestamp-Based Chapters\n\n`;
    chapters.forEach(ch => {
      md += `- **[${ch.timestamp}]** ${ch.title}: ${ch.summary}\n`;
    });
    md += `\n`;
  }

  if (summary.importantConcepts && summary.importantConcepts.length > 0) {
    md += `## Important Concepts\n\n`;
    summary.importantConcepts.forEach(c => {
      md += `### ${c.term}\n**Definition:** ${c.definition}  \n`;
      if (c.context) md += `**Context:** ${c.context}  \n`;
      md += `\n`;
    });
  }

  if (summary.actionItems && summary.actionItems.length > 0) {
    md += `## Action Items\n\n`;
    summary.actionItems.forEach(ai => {
      md += `- [ ] ${ai}\n`;
    });
    md += `\n`;
  }

  if (questions && questions.length > 0) {
    md += `## Review Questions\n\n`;
    questions.forEach((q, idx) => {
      md += `### Q${idx + 1} (${q.category}): ${q.question}\n`;
      md += `**Answer:** ${q.answer}\n`;
      md += `**Explanation:** ${q.explanation}\n\n`;
    });
  }

  if (flashcards && flashcards.length > 0) {
    md += `## Study Flashcards\n\n`;
    flashcards.forEach((fc, idx) => {
      md += `**Card ${idx + 1} [${fc.concept || 'General'}]:**\n`;
      md += `*Front:* ${fc.front}\n`;
      md += `*Back:* ${fc.back}\n\n`;
    });
  }

  return md;
}

export function generatePlainText(payload: ProcessedVideoPayload): string {
  const { video, summary, chapters } = payload;
  let txt = `TITLE: ${video.title}\n`;
  txt += `CHANNEL: ${video.channelTitle}\n`;
  txt += `URL: ${video.url}\n\n`;
  txt += `========================================\n`;
  txt += `TL;DR:\n${summary.tldr}\n\n`;
  txt += `========================================\n`;
  txt += `KEY TAKEAWAYS:\n`;
  summary.keyTakeaways.forEach((item, idx) => {
    txt += `${idx + 1}. ${item}\n`;
  });
  txt += `\n========================================\n`;
  txt += `CHAPTERS:\n`;
  chapters.forEach(ch => {
    txt += `[${ch.timestamp}] ${ch.title} - ${ch.summary}\n`;
  });
  txt += `\n========================================\n`;
  txt += `DETAILED SUMMARY:\n`;
  summary.detailedSummary.forEach(sec => {
    txt += `\n${sec.title.toUpperCase()}\n${sec.content}\n`;
  });
  return txt;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPdf(payload: ProcessedVideoPayload) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 18;
  const pageWidth = 210;
  const maxLineWidth = pageWidth - margin * 2;
  let y = 20;

  function checkPageBreak(spaceNeeded: number) {
    if (y + spaceNeeded > 275) {
      doc.addPage();
      y = 20;
    }
  }

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 17, 17);
  const titleLines = doc.splitTextToSize(payload.video.title, maxLineWidth);
  checkPageBreak(titleLines.length * 8 + 15);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 4;

  // Metadata subheader
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Channel: ${payload.video.channelTitle}  |  Duration: ${payload.video.durationText}  |  Difficulty: ${payload.summary.difficulty}`, margin, y);
  y += 10;

  // Horizontal divider
  doc.setDrawColor(229, 229, 229);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Section: TL;DR
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(124, 58, 237); // Accent purple
  checkPageBreak(15);
  doc.text('TL;DR Executive Summary', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(34, 34, 34);
  const tldrLines = doc.splitTextToSize(payload.summary.tldr, maxLineWidth);
  checkPageBreak(tldrLines.length * 5 + 10);
  doc.text(tldrLines, margin, y);
  y += tldrLines.length * 5 + 8;

  // Section: Key Takeaways
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(124, 58, 237);
  checkPageBreak(15);
  doc.text('Key Takeaways', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(34, 34, 34);
  for (let i = 0; i < payload.summary.keyTakeaways.length; i++) {
    const item = `${i + 1}. ${payload.summary.keyTakeaways[i]}`;
    const lines = doc.splitTextToSize(item, maxLineWidth);
    checkPageBreak(lines.length * 5 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  }
  y += 5;

  // Section: Detailed Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(124, 58, 237);
  checkPageBreak(15);
  doc.text('Detailed Summary', margin, y);
  y += 7;

  payload.summary.detailedSummary.forEach(sec => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 17, 17);
    doc.text(sec.title, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const secLines = doc.splitTextToSize(sec.content, maxLineWidth);
    checkPageBreak(secLines.length * 5 + 6);
    doc.text(secLines, margin, y);
    y += secLines.length * 5 + 6;
  });

  // Section: Chapters
  if (payload.chapters && payload.chapters.length > 0) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(124, 58, 237);
    doc.text('Timestamped Chapters', margin, y);
    y += 7;

    payload.chapters.forEach(ch => {
      const line = `[${ch.timestamp}] ${ch.title} - ${ch.summary}`;
      const splitLines = doc.splitTextToSize(line, maxLineWidth);
      checkPageBreak(splitLines.length * 5 + 3);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(splitLines, margin, y);
      y += splitLines.length * 5 + 2;
    });
  }

  const cleanName = payload.video.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
  doc.save(`${cleanName}_summary.pdf`);
}
