import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shuffle,
  Lightbulb,
  Check
} from 'lucide-react';
import { FlashcardItem, VideoMetadata } from '../types/index.ts';

interface FlashcardsViewProps {
  flashcards: FlashcardItem[];
  video: VideoMetadata;
  onUpdateCard: (cardId: string, updates: Partial<FlashcardItem>) => Promise<void>;
  onGenerateMore: () => Promise<void>;
  isGeneratingMore: boolean;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  video,
  onUpdateCard,
  onGenerateMore,
  isGeneratingMore
}) => {
  const [deck, setDeck] = useState<FlashcardItem[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterDifficult, setFilterDifficult] = useState(false);

  // Sync deck when flashcards change
  useEffect(() => {
    setDeck(flashcards);
  }, [flashcards]);

  const activeCards = filterDifficult
    ? deck.filter(fc => fc.isDifficult)
    : deck;

  const currentCard = activeCards[currentIndex] || activeCards[0];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeCards.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % (activeCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + activeCards.length) % (activeCards.length || 1));
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleDifficult = async () => {
    if (!currentCard) return;
    await onUpdateCard(currentCard.id, {
      isDifficult: !currentCard.isDifficult
    });
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-sm text-slate-500 mb-4">No flashcards generated yet for this session.</p>
        <button
          onClick={onGenerateMore}
          disabled={isGeneratingMore}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
        >
          <Sparkles className="h-4 w-4 text-[#C084FC]" />
          <span>Generate Study Flashcards</span>
        </button>
      </div>
    );
  }

  if (filterDifficult && activeCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Zero Difficult Cards!</h3>
        <p className="text-xs text-slate-500 mb-5">
          You've conquered all marked flashcards. Great job retaining the lecture concepts!
        </p>
        <button
          onClick={() => setFilterDifficult(false)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
        >
          Show All Cards
        </button>
      </div>
    );
  }

  const difficultCount = deck.filter(f => f.isDifficult).length;
  const progressPercent = activeCards.length > 0 ? ((currentIndex + 1) / activeCards.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Header bar */}
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Spaced-Repetition Study Flashcards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active recall mode • Tap space to flip, arrows to navigate
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShuffle}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            title="Shuffle deck order"
          >
            <Shuffle className="h-3.5 w-3.5 text-slate-500" />
            <span>Shuffle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterDifficult(!filterDifficult);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
              filterDifficult
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            <span>Flagged ({difficultCount})</span>
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span className="font-mono">
            Card {currentIndex + 1} of {activeCards.length}
          </span>
          {currentCard?.concept && (
            <span className="rounded-md bg-violet-50 border border-violet-200/60 px-2.5 py-0.5 text-[11px] font-bold text-[#7C3AED]">
              {currentCard.concept}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <div
        id="flashcard-container"
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative min-h-[300px] sm:min-h-[340px] w-full cursor-pointer rounded-3xl border-2 p-8 shadow-sm transition-all duration-300 flex flex-col justify-between select-none ${
          isFlipped
            ? 'border-violet-300/80 bg-gradient-to-b from-violet-50/40 via-white to-white'
            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md'
        }`}
      >
        {/* Top Tag & Card Side Badge */}
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isFlipped ? 'bg-violet-100 text-[#7C3AED]' : 'bg-slate-100 text-slate-600'
          }`}>
            {isFlipped ? 'Verified Explanation' : 'Question Prompt'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDifficult();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
              currentCard.isDifficult
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Mark this card for extra review"
          >
            <Bookmark className="h-3.5 w-3.5" fill={currentCard.isDifficult ? 'currentColor' : 'none'} />
            <span>{currentCard.isDifficult ? 'Flagged for Review' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Center Text */}
        <div className="my-auto py-8 text-center px-2 sm:px-6">
          <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-relaxed font-display">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
        </div>

        {/* Bottom hint */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <RotateCw className="h-3.5 w-3.5 text-slate-400" />
          <span>Click card or press Spacebar to flip</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          id="flashcard-prev-btn"
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <button
          id="flashcard-flip-btn"
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-slate-800 transition-all active:scale-95"
        >
          <RotateCw className="h-3.5 w-3.5 text-purple-300" />
          <span>{isFlipped ? 'Show Question' : 'Reveal Answer'}</span>
        </button>

        <button
          id="flashcard-next-btn"
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Deck dot navigation */}
      {activeCards.length > 1 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
          {activeCards.map((c, i) => (
            <button
              key={c.id || i}
              type="button"
              onClick={() => {
                setCurrentIndex(i);
                setIsFlipped(false);
              }}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-[#7C3AED]'
                  : c.isDifficult
                  ? 'w-2 bg-amber-400'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Card ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Generate more flashcards */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 text-center">
        <button
          id="generate-more-flashcards-btn"
          type="button"
          onClick={onGenerateMore}
          disabled={isGeneratingMore}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all active:scale-95"
        >
          {isGeneratingMore ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7C3AED]" />
              <span>Generating cards...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
              <span>Generate More Flashcards</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

