import { useState, useEffect } from 'react';
import Tile from './Tile';

interface Guess {
  guess: string;
  feedback: ('correct' | 'present' | 'absent')[];
}

interface GuessGridProps {
  guesses: Guess[];
  currentGuess: string;
  maxGuesses?: number;
  wordLength?: number; // Dinamik kelime uzunluğu
  hideLetters?: boolean;
  showInvalidWord?: boolean; // Shake animasyonu için
}

export default function GuessGrid({ 
  guesses, 
  currentGuess, 
  maxGuesses = 6,
  wordLength = 5, // Default 5 harf
  hideLetters = false,
  showInvalidWord = false
}: GuessGridProps) {
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);

  // Yeni tahmin eklendiğinde flip animasyonunu tetikle
  useEffect(() => {
    if (guesses.length > 0) {
      const lastGuessIndex = guesses.length - 1;
      setAnimatingRow(lastGuessIndex);
      
      // Animasyon bittikten sonra state'i temizle
      setTimeout(() => {
        setAnimatingRow(null);
      }, wordLength * 100 + 500); // wordLength * 100ms delay + 500ms animasyon
    }
  }, [guesses.length, wordLength]);

  const renderRow = (index: number) => {
    // Eğer bu satır daha önce yapılmış bir tahminse
    if (index < guesses.length) {
      const guess = guesses[index];
      const shouldAnimate = animatingRow === index;
      
      return guess.guess.split('').map((letter, letterIndex) => (
        <Tile
          key={letterIndex}
          letter={hideLetters ? '' : letter}
          status={guess.feedback[letterIndex]}
          animate={shouldAnimate}
          delay={letterIndex * 100} // Her harf için 100ms gecikme
        />
      ));
    }
    
    // Eğer bu satır şu anki tahmin satırıysa
    if (index === guesses.length && !hideLetters) {
      const letters = currentGuess.split('');
      return Array.from({ length: wordLength }, (_, letterIndex) => (
        <Tile
          key={letterIndex}
          letter={letters[letterIndex] || ''}
          status={letters[letterIndex] ? 'typing' : 'empty'}
        />
      ));
    }
    
    // Boş satırlar
    return Array.from({ length: wordLength }, (_, letterIndex) => (
      <Tile key={letterIndex} status="empty" />
    ));
  };

  return (
    <div className="grid grid-rows-6 gap-1 sm:gap-2 p-2 sm:p-4 max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      {Array.from({ length: maxGuesses }, (_, index) => (
        <div 
          key={index} 
          className={`
            grid gap-1 sm:gap-2 transition-transform duration-500
            ${showInvalidWord && index === guesses.length ? 'animate-shake' : ''}
          `}
          style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
        >
          {renderRow(index)}
        </div>
      ))}
    </div>
  );
} 