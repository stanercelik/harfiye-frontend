'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Header from '@/components/ui/Header';
import GuessGrid from '@/components/game/GuessGrid';
import Keyboard from '@/components/game/Keyboard';
import Timer from '@/components/game/Timer';
import GameResultModal from '@/components/ui/GameResultModal';
import RematchRequestModal from '@/components/ui/RematchRequestModal';
import RematchCountdownModal from '@/components/ui/RematchCountdownModal';
import socket from '@/lib/socket';
import { isValidWord, turkishToLowerCase, turkishToUpperCase } from '@/lib/words';

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

interface GameState {
  roomId: string;
  players: PlayerState[];
  maxPlayers: number;
  wordLength: number; // Kelime uzunluğu
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
}

interface UsedKeys {
  [key: string]: 'correct' | 'present' | 'absent';
}

type GamePhase = 'joining' | 'waiting' | 'countdown' | 'playing' | 'finished';

export default function GameRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const roomId = params.roomId as string;
  const playerName = searchParams.get('playerName') || 'Anonim';
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [usedKeys, setUsedKeys] = useState<UsedKeys>({});
  const [gamePhase, setGamePhase] = useState<GamePhase>('joining');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showInvalidWord, setShowInvalidWord] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [solution, setSolution] = useState('');
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Rövanş durumu
  const [showRematchRequestModal, setShowRematchRequestModal] = useState(false);
  const [showRematchCountdownModal, setShowRematchCountdownModal] = useState(false);
  const [rematchRequesterName, setRematchRequesterName] = useState('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchStatus, setRematchStatus] = useState<'waiting' | 'accepted' | 'declined'>('waiting');
  const [rematchCountdownSeconds, setRematchCountdownSeconds] = useState(3);
  const [isRivalsExpanded, setIsRivalsExpanded] = useState(false);

  // Oyun durumunu temizle
  const resetGameState = () => {
    setCurrentGuess('');
    setUsedKeys({});
    setMessage('');
    setShowInvalidWord(false);
    setSolution('');
    setWinnerId(null);
    setShowResultModal(false);
    // Rövanş durumunu sıfırla
    setRematchRequested(false);
    setRematchStatus('waiting');
    setShowRematchRequestModal(false);
    setShowRematchCountdownModal(false);
  };

  // Oyun başladığında kendi grid'e scroll yap
  useEffect(() => {
    if (gamePhase === 'playing') {
      // Biraz gecikme ile scroll yap (animasyonlar bitsin diye)
      setTimeout(() => {
        const myGridElement = document.getElementById('my-grid');
        if (myGridElement) {
          myGridElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
    }
  }, [gamePhase]);

  // Socket bağlantısını kur ve olayları dinle
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // Sayfa başlığını ayarla
            document.title = `Harfiye - Oda: ${roomId}`;

    // Oda olaylarını dinle
    socket.on('room_created', ({ roomId: newRoomId }: { roomId: string }) => {
      console.log('Oda oluşturuldu:', newRoomId);
      setGamePhase('waiting');
    });

    socket.on('room_joined', ({ gameState: newGameState }: { gameState: GameState }) => {
      console.log('Odaya katıldı:', newGameState);
      setGameState(newGameState);
      setGamePhase('waiting');
    });

    socket.on('player_joined', ({ gameState: newGameState, newPlayerName }: { gameState: GameState; newPlayerName: string }) => {
      console.log('Yeni oyuncu odaya katıldı:', newPlayerName, newGameState);
      setGameState(newGameState);
      setMessage(`${newPlayerName} odaya katıldı!`);
      
      // Mesajı 3 saniye sonra temizle
      setTimeout(() => {
        setMessage('');
      }, 3000);
    });

    socket.on('game_start', ({ gameState: newGameState }: { gameState: GameState }) => {
      console.log('Oyun başlıyor - game_start eventi alındı:', newGameState);
      setGameState(newGameState);
      setGamePhase('countdown');
      resetGameState();
      
      // Title'ı güncelle
              document.title = 'Oyun Başlıyor! - Harfiye';
      
      // Rövanş modal'larını kapat
      setShowRematchCountdownModal(false);
      
      // 3 saniyelik geri sayım
      let countdown = 3;
      setCountdownSeconds(countdown);
      
      console.log('Geri sayım başlatılıyor - 3 saniye...');
      
      const countdownInterval = setInterval(() => {
        countdown--;
        setCountdownSeconds(countdown);
        console.log(`Geri sayım: ${countdown}`);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          setGamePhase('playing');
          document.title = 'Oyun Devam Ediyor! - Harfiye';
          console.log('Geri sayım tamamlandı - oyun başlıyor!');
        }
      }, 1000);
    });

    socket.on('update_state', ({ gameState: newGameState }: { gameState: GameState }) => {
      console.log('Oyun durumu güncellendi:', newGameState);
      setGameState(newGameState);
    });

    socket.on('invalid_word', ({ message }: { message: string }) => {
      console.log('Geçersiz kelime:', message);
      setShowInvalidWord(true);
      setMessage(message);
      
      setTimeout(() => {
        setShowInvalidWord(false);
        setMessage('');
      }, 2000);
    });

    socket.on('game_over', ({ winnerId: gameWinnerId, solution: gameSolution, gameState: finalGameState }: { 
      winnerId: string | null; 
      solution: string;
      gameState: GameState;
    }) => {
      console.log('Oyun bitti:', { winnerId: gameWinnerId, solution: gameSolution });
      setGameState(finalGameState);
      setWinnerId(gameWinnerId);
      setSolution(gameSolution);
      setGamePhase('finished');
      setShowResultModal(true);
      
      // Title'ı oyun sonucuna göre güncelle
      if (gameWinnerId === socket.id) {
                  document.title = '🎉 Kazandınız! - Harfiye';
      } else if (gameWinnerId === null) {
                  document.title = '⏱️ Süre Bitti! - Harfiye';
      } else {
                  document.title = '💔 Kaybettiniz! - Harfiye';
      }
    });

    socket.on('player_left', ({ gameState: newGameState }: { gameState: GameState }) => {
      console.log('Oyuncu ayrıldı:', newGameState);
      setGameState(newGameState);
      setMessage('Rakibiniz oyundan ayrıldı!');
    });

    socket.on('timer_update', ({ playerId, timeRemaining }: { playerId: string; timeRemaining: number }) => {
      console.log('Timer güncellendi:', { playerId, timeRemaining });
      // Sadece kendi timer güncellemelerini işle
      if (playerId === socket.id) {
        setGameState(prevState => {
          if (!prevState) return prevState;
          
          const updatedPlayers = prevState.players.map(player =>
            player.id === playerId ? { ...player, timeRemaining } : player
          );
          
          return { ...prevState, players: updatedPlayers };
        });
      }
    });

    socket.on('player_timeout', ({ message }: { message: string }) => {
      console.log('Zaman aşımı:', message);
      setMessage(message);
      setTimeout(() => setMessage(''), 5000); // Daha uzun gösterim süresi
    });

    socket.on('error', ({ message }: { message: string }) => {
      console.log('Hata:', message);
      setError(message);
    });

    // Rövanş olayları
    socket.on('rematch_requested', ({ requesterName }: { requesterName: string }) => {
      console.log('Rövanş talebi alındı:', requesterName);
      setRematchRequesterName(requesterName);
      setShowRematchRequestModal(true);
    });

    socket.on('rematch_accepted', () => {
      console.log('Rövanş kabul edildi');
      setShowRematchRequestModal(false);
      setShowRematchCountdownModal(true);
      setRematchStatus('accepted');
    });

    socket.on('rematch_declined', () => {
      console.log('Rövanş reddedildi');
      setRematchStatus('declined');
      setShowRematchRequestModal(false);
    });

    socket.on('rematch_countdown', ({ seconds }: { seconds: number }) => {
      console.log('Rövanş geri sayımı:', seconds);
      setRematchCountdownSeconds(seconds);
    });

    // Cleanup
    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('game_start');
      socket.off('update_state');
      socket.off('invalid_word');
      socket.off('game_over');
      socket.off('player_left');
      socket.off('timer_update');
      socket.off('player_timeout');
      socket.off('error');
      socket.off('rematch_requested');
      socket.off('rematch_accepted');
      socket.off('rematch_declined');
      socket.off('rematch_countdown');
    };
  }, []);

  // Sayfa yüklendiğinde odaya katılmaya çalış
  useEffect(() => {
    if (roomId && playerName) {
      setGamePhase('joining');
      socket.emit('join_room', { roomId, playerName });
    }
  }, [roomId, playerName]);

  // Mevcut oyuncuyu bul
  const currentPlayer = gameState?.players.find(p => p.id === socket.id);

  const handleKeyPress = useCallback((key: string) => {
    const maxLength = gameState?.wordLength || 5;
    if (gamePhase !== 'playing' || currentGuess.length >= maxLength || currentPlayer?.isTimedOut) return;
    setCurrentGuess(prev => prev + key);
    
    if (showInvalidWord) {
      setShowInvalidWord(false);
      setMessage('');
    }
  }, [gamePhase, currentGuess, gameState?.wordLength, currentPlayer?.isTimedOut, showInvalidWord]);

  const handleBackspace = useCallback(() => {
    if (gamePhase !== 'playing' || currentPlayer?.isTimedOut) return;
    setCurrentGuess(prev => prev.slice(0, -1));
    
    if (showInvalidWord) {
      setShowInvalidWord(false);
      setMessage('');
    }
  }, [gamePhase, currentPlayer?.isTimedOut, showInvalidWord]);

  const handleEnter = useCallback(() => {
    const expectedLength = gameState?.wordLength || 5;
    if (gamePhase !== 'playing' || currentGuess.length !== expectedLength || currentPlayer?.isTimedOut) return;
    
    const lowerGuess = turkishToLowerCase(currentGuess);
    
    // Frontend'de kelime geçerliliğini kontrol et (UX için)
    const wordLength = gameState?.wordLength as 5 | 6 | 7 || 5;
    if (!isValidWord(lowerGuess, wordLength)) {
      setShowInvalidWord(true);
      setMessage('Kelime listede bulunamadı!');
      
      setTimeout(() => {
        setShowInvalidWord(false);
        setMessage('');
      }, 2000);
      
      return;
    }

    // Sunucuya tahmini gönder
    socket.emit('make_guess', { guess: lowerGuess });
    
    // Kullanılan tuşları güncelle (optimistic update)
    const newUsedKeys = { ...usedKeys };
    currentGuess.split('').forEach((letter) => {
      const upperLetter = letter.toUpperCase();
      if (!newUsedKeys[upperLetter]) {
        newUsedKeys[upperLetter] = 'absent'; // Geçici olarak absent yap
      }
    });
    setUsedKeys(newUsedKeys);
    setCurrentGuess('');
  }, [gamePhase, currentGuess, gameState?.wordLength, currentPlayer?.isTimedOut, usedKeys]);

  // Fiziksel klavye desteği
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = turkishToLowerCase(event.key);

      if (key === 'enter') {
        handleEnter();
      } else if (key === 'backspace') {
        handleBackspace();
      } else if (key.length === 1 && /^[a-zçğıöşüA-ZÇĞIİÖŞÜ]$/.test(key)) {
        const upperKey = key.toUpperCase();
        handleKeyPress(upperKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, handleEnter, handleBackspace, handleKeyPress]);



  const handleNewGame = () => {
    router.push('/');
  };

  const handleCopyRoomId = async () => {
    try {
      // Modern tarayıcılar ve HTTPS için
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(roomId);
        setMessage('Oda kodu kopyalandı!');
      } else {
        // Fallback: Geleneksel yöntem
        const textArea = document.createElement('textarea');
        textArea.value = roomId;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setMessage('Oda kodu kopyalandı!');
        } else {
          // Son çare: Kullanıcıya manuel kopyalama talimatı
          setMessage(`Oda kodu: ${roomId} - Manuel olarak kopyalayın`);
        }
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
      setMessage(`Oda kodu: ${roomId} - Manuel olarak kopyalayın`);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // Rövanş fonksiyonları
  const handleRequestRematch = () => {
    socket.emit('request_rematch');
    setRematchRequested(true);
    setRematchStatus('waiting');
  };

  const handleAcceptRematch = () => {
    socket.emit('accept_rematch');
    setShowRematchRequestModal(false);
  };

  const handleDeclineRematch = () => {
    socket.emit('decline_rematch');
    setShowRematchRequestModal(false);
  };

  // const otherPlayers = gameState?.players?.filter(p => p.id !== socket.id) || [];
  // const opponent = otherPlayers[0];

  // Gerçek oyun durumuna göre kullanılan tuşları güncelle
  useEffect(() => {
    if (currentPlayer && currentPlayer.guesses.length > 0) {
      const newUsedKeys: UsedKeys = {};
      
      currentPlayer.guesses.forEach(({ guess, feedback }) => {
        guess.split('').forEach((letter, index) => {
          const upperLetter = turkishToUpperCase(letter);
          const letterFeedback = feedback[index];
          
          if (!newUsedKeys[upperLetter] || 
              (letterFeedback === 'correct') ||
              (letterFeedback === 'present' && newUsedKeys[upperLetter] === 'absent')) {
            newUsedKeys[upperLetter] = letterFeedback;
          }
        });
      });
      
      setUsedKeys(newUsedKeys);
    }
  }, [currentPlayer]);

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-red-800 mb-4">
                Hata
              </h2>
              <p className="text-red-600 mb-6">
                {error}
              </p>
              <button
                onClick={handleNewGame}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl btn-glow"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Rakip Bekleniyor... - Harfiye</title>
        <meta name="description" content="Harfiye kelime düellosu odası. Arkadaşını davet et ve oyuna hemen başla." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Kelime Düellosuna Davetlisin!" />
        <meta property="og:description" content="Harfiye'de bana karşı oyna! Linke tıkla ve düelloya katıl." />
        <meta property="og:url" content={`https://harfiye.com/oda/${roomId}`} />
        <meta property="og:image" content="https://harfiye.com/og-invite-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kelime Düellosuna Davetlisin!" />
        <meta name="twitter:description" content="Harfiye'de bana karşı oyna! Linke tıkla ve düelloya katıl." />
        <meta name="twitter:image" content="https://harfiye.com/og-invite-image.png" />
      </Head>
      
      <div className="min-h-screen">
        <Header />
      
      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Oda Bilgileri */}
        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-800">
                Oda: {roomId}
              </h1>
              <p className="text-sm sm:text-base text-slate-500">
                Oyuncu: {playerName}
              </p>
            </div>
            
            {gamePhase === 'waiting' && (
              <button
                onClick={handleCopyRoomId}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2 sm:py-3 px-4 sm:px-5 rounded-xl transition-all duration-300 text-sm transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl btn-glow"
              >
                📋 Oda Kodunu Kopyala
              </button>
            )}
          </div>
        </div>

        {/* Durum Mesajları */}
        {message && (
          <div className={`border rounded-xl p-4 mb-6 transition-all duration-300 shadow-lg ${
            showInvalidWord 
              ? 'bg-gradient-to-r from-red-50 to-rose-100 border-red-200 animate-shake' 
              : 'bg-gradient-to-r from-blue-50 to-cyan-100 border-blue-200'
          }`}>
            <p className={`text-center font-medium ${
              showInvalidWord 
                ? 'text-red-600' 
                : 'text-blue-600'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Oyun Durumuna Göre İçerik */}
        {gamePhase === 'joining' && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Odaya Katılıyor...
              </h2>
              <p className="text-slate-500">
                Bağlantı kuruluyor
              </p>
            </div>
          </div>
        )}

        {gamePhase === 'waiting' && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center px-4">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">⏳</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">
                {gameState?.maxPlayers === 2 ? 'Rakip Bekleniyor...' : 'Oyuncular Bekleniyor...'}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mb-2">
                Oda kodunu arkadaşlarınızla paylaşın
              </p>
              <p className="text-sm text-slate-400 mb-2">
                Oyuncu: {gameState?.players.length || 1}/{gameState?.maxPlayers || 2}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mb-2">
                Kelime Uzunluğu: {gameState?.wordLength || 5} harf
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                {gameState?.maxPlayers} kişi olduğunda oyun otomatik başlar
              </p>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 rounded-xl p-4 sm:p-6 font-mono text-lg sm:text-2xl tracking-wider text-slate-800 shadow-lg">
                {roomId}
              </div>
              
              {/* Beklenen oyuncular listesi */}
              {gameState && gameState.players.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">Odadaki Oyuncular:</p>
                  <div className="space-y-1">
                    {gameState.players.map((player) => (
                      <div key={player.id} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-slate-600">
                          {player.name} {player.id === socket.id ? '(Sen)' : ''}
                        </span>
                      </div>
                    ))}
                    {/* Boş slotları göster */}
                    {Array.from({ length: (gameState.maxPlayers || 2) - gameState.players.length }, (_, i) => (
                      <div key={`empty-${i}`} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mr-2"></div>
                        <span className="text-slate-400">
                          Boş slot
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {gamePhase === 'countdown' && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center px-4">
              <div className="text-6xl sm:text-8xl font-bold text-cyan-500 mb-4 animate-pulse">
                {countdownSeconds}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Oyun Başlıyor!
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-2">
                Hazır olun...
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {gameState?.players.length === gameState?.maxPlayers ? 'Tüm oyuncular hazır!' : 'Oyuncular hazırlanıyor...'}
              </p>
            </div>
          </div>
        )}

        {(gamePhase === 'playing' || gamePhase === 'finished') && gameState && (
          <div className="space-y-6 sm:space-y-8">
            {/* Ana Grid Layout: Desktop/Tablet'ta Yan Yana - Mobile'da Alt Alta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
              
              {/* Sol Kolon: Kendi Grid (Desktop/Tablet'ta sol, Mobile'da üst) */}
              <div className="order-1 lg:order-1 lg:col-span-2">
                <div id="my-grid" className="bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-400 rounded-2xl shadow-2xl">
                  <div className="p-3 sm:p-4 border-b border-cyan-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                        {currentPlayer?.name} (Sen)
                      </h3>
                      {currentPlayer && (
                        <Timer
                          timeRemaining={currentPlayer.timeRemaining}
                          isActive={gamePhase === 'playing' && !currentPlayer.isTimedOut}
                          isCurrentPlayer={true}
                        />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Tahmin: {currentPlayer?.guesses.length || 0}/6
                    </p>
                    {currentPlayer?.isTimedOut && (
                      <p className="text-xs sm:text-sm text-red-600 font-medium">
                        ⏰ Süre doldu!
                      </p>
                    )}
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4">
                    <GuessGrid 
                      guesses={currentPlayer?.guesses || []}
                      currentGuess={gamePhase === 'playing' ? currentGuess : ''}
                      wordLength={gameState?.wordLength || 5}
                      showInvalidWord={showInvalidWord}
                    />
                  </div>
                </div>
              </div>

              {/* Sağ Kolon: Kompakt Rakip Özeti (sadece Desktop/Tablet'ta) */}
              <div className="order-3 lg:order-2 hidden lg:block">
                {gameState.players.filter(p => p.id !== socket.id).length > 0 && (
                  <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg p-3">
                    <button
                      onClick={() => setIsRivalsExpanded(!isRivalsExpanded)}
                      className="w-full text-left hover:bg-slate-50 rounded-lg p-2 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-700">
                          Rakipler ({gameState.players.filter(p => p.id !== socket.id).length})
                        </h3>
                        <svg 
                          className={`w-4 h-4 transition-transform ${isRivalsExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {!isRivalsExpanded ? (
                      /* Kompakt Görünüm */
                      <div className="space-y-2">
                        {gameState.players.filter(p => p.id !== socket.id).map((player) => (
                          <div key={player.id} className="bg-white border border-slate-100 rounded-lg p-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-700 truncate">{player.name}</span>
                              <span className="text-slate-500">{player.guesses.length}/6</span>
                            </div>
                            {/* Son tahmin - sadece renkler */}
                            {player.guesses.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {player.guesses[player.guesses.length - 1].feedback.map((feedback, i) => (
                                  <div
                                    key={i}
                                    className={`w-3 h-3 rounded ${
                                      feedback === 'correct' ? 'bg-green-500' :
                                      feedback === 'present' ? 'bg-yellow-500' :
                                      'bg-slate-400'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Genişletilmiş Görünüm */
                      <div className="space-y-3">
                        {gameState.players.filter(p => p.id !== socket.id).map((player) => (
                          <div key={player.id} className="bg-white border border-slate-100 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-slate-800 text-sm">{player.name}</h4>
                              <span className="text-xs text-slate-500">{player.guesses.length}/6</span>
                            </div>
                            <div className="scale-75 origin-top-left">
                              <GuessGrid 
                                guesses={player.guesses}
                                currentGuess=""
                                wordLength={gameState?.wordLength || 5}
                                hideLetters={true}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Klavye Bölümü - Genel Alt Tarafta Ortada (sadece oyun devam ederken) */}
            {gamePhase === 'playing' && (
              <div className="w-full flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-6 shadow-xl">
                    {currentPlayer?.isTimedOut ? (
                      <div className="text-center py-6 sm:py-8">
                        <div className="text-3xl sm:text-4xl mb-4">⏰</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-2">
                          Süreniz Doldu!
                        </h3>
                        <p className="text-sm sm:text-base text-slate-500">
                          Artık tahmin yapamazsınız. Diğer oyuncuların oyunu bitirmesini bekleyin...
                        </p>
                      </div>
                    ) : (
                      <Keyboard
                        usedKeys={usedKeys}
                        onKeyPress={handleKeyPress}
                        onEnter={handleEnter}
                        onBackspace={handleBackspace}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Rakip Özeti - Klavyenin altında */}
            <div className="lg:hidden">
              {gameState.players.filter(p => p.id !== socket.id).length > 0 && (
                <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg p-3">
                  <button
                    onClick={() => setIsRivalsExpanded(!isRivalsExpanded)}
                    className="w-full text-left hover:bg-slate-50 rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Rakipler ({gameState.players.filter(p => p.id !== socket.id).length})
                      </h3>
                      <svg 
                        className={`w-4 h-4 transition-transform ${isRivalsExpanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {!isRivalsExpanded ? (
                    /* Mobile Kompakt Görünüm */
                    <div className="space-y-2">
                      {gameState.players.filter(p => p.id !== socket.id).map((player) => (
                        <div key={player.id} className="bg-white border border-slate-100 rounded-lg p-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700 truncate">{player.name}</span>
                            <span className="text-slate-500">{player.guesses.length}/6</span>
                          </div>
                          {/* Son tahmin - sadece renkler */}
                          {player.guesses.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {player.guesses[player.guesses.length - 1].feedback.map((feedback, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 rounded ${
                                    feedback === 'correct' ? 'bg-green-500' :
                                    feedback === 'present' ? 'bg-yellow-500' :
                                    'bg-slate-400'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Mobile Genişletilmiş Görünüm */
                    <div className="space-y-3">
                      {gameState.players.filter(p => p.id !== socket.id).map((player) => (
                        <div key={player.id} className="bg-white border border-slate-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-800 text-sm">{player.name}</h4>
                            <span className="text-xs text-slate-500">{player.guesses.length}/6</span>
                          </div>
                          <div className="scale-90 origin-center">
                            <GuessGrid 
                              guesses={player.guesses}
                              currentGuess=""
                              wordLength={gameState?.wordLength || 5}
                              hideLetters={true}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Oyun Sonu Kısa Özet */}
            {gamePhase === 'finished' && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">
                  {winnerId === socket.id ? '🎉' : winnerId ? '😔' : '🤝'}
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                  {winnerId === socket.id ? 'Kazandınız!' : winnerId ? 'Kaybettiniz!' : 'Berabere!'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Doğru kelime: <strong className="text-slate-800 dark:text-slate-100 uppercase">{solution}</strong>
                </p>
                <button
                  onClick={() => setShowResultModal(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Detayları Gör
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Oyun Sonuç Modalı */}
      <GameResultModal
        isOpen={showResultModal}
        winnerId={winnerId}
        currentPlayerId={socket.id || ''}
        solution={solution}
        allPlayers={gameState?.players || []} // Tüm oyuncuları geç
        gameDuration={0} // Şimdilik 0, gelecekte oyun süresi hesaplanabilir
        wordLength={gameState?.wordLength || 5} // Dinamik kelime uzunluğu
        onNewGame={handleNewGame}
        onClose={() => setShowResultModal(false)}
        onRequestRematch={handleRequestRematch}
        showRematchOption={gameState?.players.length === gameState?.maxPlayers}
        rematchRequested={rematchRequested}
        rematchStatus={rematchStatus}
      />

      {/* Rövanş Teklif Modalı */}
      <RematchRequestModal
        isOpen={showRematchRequestModal}
        requesterName={rematchRequesterName}
        onAccept={handleAcceptRematch}
        onDecline={handleDeclineRematch}
      />

      {/* Rövanş Geri Sayım Modalı */}
      <RematchCountdownModal
        isOpen={showRematchCountdownModal}
        countdownSeconds={rematchCountdownSeconds}
      />
      </div>
    </>
  );
} 