import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PlayerState {
  id: string;
  name: string;
  guesses: {
    guess: string;
    feedback: ('correct' | 'present' | 'absent')[];
  }[];
  timeRemaining: number;
  isReady: boolean;
  isTimedOut: boolean;
}

interface GameResultModalProps {
  isOpen: boolean;
  winnerId: string | null;
  currentPlayerId: string;
  solution: string;
  allPlayers: PlayerState[]; // Tüm oyuncuları içeren array
  gameDuration: number; // saniye cinsinden
  wordLength?: number; // Kelime uzunluğu
  onNewGame: () => void;
  onClose: () => void;
  onRequestRematch: () => void;
  showRematchOption: boolean;
  rematchRequested: boolean;
  rematchStatus?: 'waiting' | 'accepted' | 'declined';
}

export default function GameResultModal({
  isOpen,
  winnerId,
  currentPlayerId,
  solution,
  allPlayers,
  // gameDuration,
  wordLength = 5, // Varsayılan 5 harf
  onNewGame,
  onClose,
  onRequestRematch,
  showRematchOption,
  rematchRequested,
  rematchStatus = 'waiting'
}: GameResultModalProps) {
  if (!isOpen) return null;

  const currentPlayer = allPlayers.find(p => p.id === currentPlayerId);
  const otherPlayers = allPlayers.filter(p => p.id !== currentPlayerId);
  const winner = winnerId ? allPlayers.find(p => p.id === winnerId) : null;
  
  const isWinner = winnerId === currentPlayerId;
  const isLoser = winnerId && winnerId !== currentPlayerId;
  // const isDraw = !winnerId;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultIcon = () => {
    if (isWinner) return '🎉';
    if (isLoser) return '😔';
    return '🤝';
  };

  const getResultTitle = () => {
    if (isWinner) return 'KAZANDIN!';
    if (isLoser) return 'KAYBETTİN!';
    return 'BERABERE!';
  };

  const getResultMessage = () => {
    if (isWinner) {
      const guessCount = currentPlayer?.guesses.length || 0;
      const timeSpent = formatTime(90 - (currentPlayer?.timeRemaining || 0));
      return `${guessCount} denemede ${timeSpent} sürede kazandın!`;
    }
    if (isLoser && winner) {
      const winnerGuessCount = winner.guesses.length || 0;
      return `${winner.name} ${winnerGuessCount} denemede daha hızlı buldu!`;
    }
    return 'Kimse kelimeyi bulamadı veya berabere bitti!';
  };

  // Tahmin tablolarını göstermek için grid bileşeni
  const renderGuessGrid = (player: PlayerState) => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const guess = player.guesses[i];
      const row = [];
      for (let j = 0; j < wordLength; j++) {
        let bgColor = 'bg-slate-200 dark:bg-slate-600';
        let textColor = 'text-slate-500 dark:text-slate-400';
        let letter = '';
        
        if (guess) {
          letter = guess.guess[j]?.toUpperCase() || '';
          const feedback = guess.feedback[j];
          
          switch (feedback) {
            case 'correct':
              bgColor = 'bg-green-500';
              textColor = 'text-white';
              break;
            case 'present':
              bgColor = 'bg-yellow-500';
              textColor = 'text-white';
              break;
            case 'absent':
              bgColor = 'bg-slate-500';
              textColor = 'text-white';
              break;
          }
        }
        
        row.push(
          <div
            key={j}
            className={`w-8 h-8 ${bgColor} ${textColor} border border-slate-300 dark:border-slate-600 flex items-center justify-center text-sm font-bold rounded`}
          >
            {letter}
          </div>
        );
      }
      rows.push(
        <div key={i} className="flex gap-1">
          {row}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Oyun Bitti
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Sonuç Başlığı */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getResultIcon()}</div>
            <h1 className={`text-3xl font-bold mb-4 ${
              isWinner ? 'text-green-600 dark:text-green-400' : 
              isLoser ? 'text-red-600 dark:text-red-400' : 
              'text-blue-600 dark:text-blue-400'
            }`}>
              {getResultTitle()}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              {getResultMessage()}
            </p>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 inline-block">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Doğru Kelime</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                {solution}
              </p>
            </div>
          </div>

          {/* Oyun İstatistikleri - Tüm Oyuncular */}
          <div className={`grid gap-6 mb-8 ${
            allPlayers.length <= 2 ? 'md:grid-cols-2' :
            allPlayers.length === 3 ? 'md:grid-cols-3' :
            allPlayers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
            'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          }`}>
            {/* Önce mevcut oyuncuyu göster */}
            {currentPlayer && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border-2 border-cyan-300 dark:border-cyan-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  {currentPlayer.name} (Sen)
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Deneme:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {currentPlayer.guesses.length}/6
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Süre:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {formatTime(90 - currentPlayer.timeRemaining)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Durum:</span>
                    <span className={`font-semibold ${
                      winnerId === currentPlayer.id ? 'text-green-600 dark:text-green-400' :
                      winnerId ? 'text-red-600 dark:text-red-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {winnerId === currentPlayer.id ? '🎉 Kazandı' : winnerId ? '😔 Kaybetti' : '🤝 Berabere'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {renderGuessGrid(currentPlayer)}
                </div>
              </div>
            )}

            {/* Sonra diğer oyuncuları göster */}
            {otherPlayers.map((player, index) => {
              const playerStyles = [
                {
                  bg: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50',
                  border: 'border-orange-300 dark:border-orange-700',
                  dot: 'bg-orange-500'
                },
                {
                  bg: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50',
                  border: 'border-purple-300 dark:border-purple-700',
                  dot: 'bg-purple-500'
                },
                {
                  bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50',
                  border: 'border-green-300 dark:border-green-700',
                  dot: 'bg-green-500'
                },
                {
                  bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50',
                  border: 'border-yellow-300 dark:border-yellow-700',
                  dot: 'bg-yellow-500'
                }
              ];
              const style = playerStyles[index % playerStyles.length];
              
              return (
                <div key={player.id} className={`${style.bg} border-2 ${style.border} rounded-lg p-4`}>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                    <div className={`w-3 h-3 ${style.dot} rounded-full mr-2`}></div>
                    {player.name}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Deneme:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {player.guesses.length}/6
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Süre:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {formatTime(90 - player.timeRemaining)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Durum:</span>
                      <span className={`font-semibold ${
                        winnerId === player.id ? 'text-green-600 dark:text-green-400' :
                        winnerId ? 'text-red-600 dark:text-red-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {winnerId === player.id ? '🎉 Kazandı' : winnerId ? '😔 Kaybetti' : '🤝 Berabere'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {renderGuessGrid(player)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rövanş Durumu */}
          {showRematchOption && (
            <div className="mb-6">
              {rematchRequested ? (
                <div className="text-center">
                  {rematchStatus === 'waiting' ? (
                    <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                        <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                          Rövanş talebi gönderildi, rakibinizin cevabı bekleniyor...
                        </p>
                      </div>
                    </div>
                  ) : rematchStatus === 'declined' ? (
                    <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        ❌ Rövanş talebi reddedildi
                      </p>
                    </div>
                  ) : rematchStatus === 'accepted' ? (
                    <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        ✅ Rövanş kabul edildi! Oyun başlıyor...
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={onRequestRematch}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg mb-4"
                  >
                    🔄 Rövanş Teklif Et
                  </button>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Aynı rakiple bir oyun daha oynamak ister misin?
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNewGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Anasayfaya Dön
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Sonuçları Gizle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 