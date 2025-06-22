interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  playerName?: string;
  isCurrentPlayer?: boolean;
}

export default function Timer({ 
  timeRemaining, 
  isActive, 
  playerName,
  isCurrentPlayer = false 
}: TimerProps) {
  // Sınırsız zaman kontrolü
  const isUnlimited = timeRemaining === -1;
  const isLowTime = !isUnlimited && timeRemaining <= 10;
  const isCritical = !isUnlimited && timeRemaining <= 5;
  
  const formatTime = (seconds: number) => {
    if (seconds === -1) return '∞';
    return `${seconds}s`;
  };

  const getTimerColor = () => {
    if (!isActive) return 'text-slate-500 dark:text-slate-400';
    if (isUnlimited) return 'text-blue-700 dark:text-blue-300';
    if (isCritical) return 'text-red-700 dark:text-red-300';
    if (isLowTime) return 'text-amber-700 dark:text-amber-300';
    return 'text-green-700 dark:text-green-300';
  };

  const getBackgroundColor = () => {
    if (!isActive) return 'bg-slate-200 dark:bg-slate-800';
    if (isUnlimited) return 'bg-blue-50 dark:bg-blue-950/50';
    if (isCritical) return 'bg-red-50 dark:bg-red-950/50';
    if (isLowTime) return 'bg-amber-50 dark:bg-amber-950/50';
    return 'bg-green-50 dark:bg-green-950/50';
  };

  const getBorderColor = () => {
    if (!isActive) return 'border-slate-300 dark:border-slate-700';
    if (isUnlimited) return 'border-blue-300 dark:border-blue-600';
    if (isCritical) return 'border-red-300 dark:border-red-600';
    if (isLowTime) return 'border-amber-300 dark:border-amber-600';
    return 'border-green-300 dark:border-green-600';
  };

  return (
    <div className={`
      flex items-center justify-center px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-lg border-2 transition-all duration-300
      ${getBackgroundColor()} ${getBorderColor()}
      ${isCritical && isActive ? 'animate-pulse shadow-lg' : 'shadow-sm'}
    `}>
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Timer ikonu */}
        <div className={`text-xs sm:text-sm md:text-lg lg:text-xl ${getTimerColor()}`}>
          {isUnlimited ? '∞' : '⏰'}
        </div>
        
        {/* Süre */}
        <span className={`font-mono font-bold text-xs sm:text-sm md:text-lg lg:text-xl ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </span>
        
        {/* Oyuncu adı (opsiyonel) - Mobilde gizle */}
        {playerName && (
          <span className={`hidden sm:inline text-xs md:text-sm font-semibold ${
            isCurrentPlayer 
              ? 'text-slate-900 dark:text-slate-100' 
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {isCurrentPlayer ? '(Sen)' : `(${playerName})`}
          </span>
        )}
      </div>
      
      {/* Kritik uyarı */}
      {isCritical && isActive && (
        <div className="ml-1 sm:ml-2 text-red-700 dark:text-red-300 animate-bounce text-xs sm:text-sm md:text-lg lg:text-xl">
          ⚠️
        </div>
      )}
    </div>
  );
} 