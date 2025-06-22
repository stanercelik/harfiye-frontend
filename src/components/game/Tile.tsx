import { useState, useEffect } from 'react';

interface TileProps {
  letter?: string;
  status: 'correct' | 'present' | 'absent' | 'empty' | 'typing';
  animate?: boolean;
  delay?: number; // Animasyon gecikmesi için
}

export default function Tile({ letter = '', status, animate = false, delay = 0 }: TileProps) {
  // const [isFlipping] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  // Status değiştiğinde flip animasyonu tetikle
  useEffect(() => {
    if (animate && status !== 'empty' && status !== 'typing' && status !== currentStatus) {
      setTimeout(() => {
        // setIsFlipping(true);
        setTimeout(() => {
          setCurrentStatus(status);
          // setTimeout(() => {
          //   setIsFlipping(false);
          // }, 250); // Flip animasyonunun yarısı
        }, 250); // Flip animasyonunun yarısı
      }, delay);
    } else {
      setCurrentStatus(status);
    }
  }, [status, animate, delay, currentStatus]);

  const getStatusClasses = () => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 border-green-600 text-white';
      case 'present':
        return 'bg-yellow-500 border-yellow-600 text-white';
      case 'absent':
        return 'bg-slate-500 border-slate-600 text-white';
      case 'typing':
        return 'bg-white border-slate-600 text-slate-800 border-2';
      case 'empty':
      default:
        return 'bg-white border-slate-300 text-slate-800';
    }
  };

  return (
    <div
      className={`
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
        border-2 rounded-lg
        flex items-center justify-center
        font-bold text-lg sm:text-xl md:text-2xl
        transition-all duration-300
        ${getStatusClasses()}
        ${animate ? 'animate-flip' : ''}
      `}
      style={{
        animationDelay: animate ? `${delay}ms` : undefined,
      }}
    >
      {letter.toUpperCase()}
    </div>
  );
} 