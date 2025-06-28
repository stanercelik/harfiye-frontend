'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import socket from '@/lib/socket';

type GameMode = 'create' | 'join' | null;

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [wordLength, setWordLength] = useState(5);
  const [timeLimit, setTimeLimit] = useState(30);
  const [isTimeLimitEnabled, setIsTimeLimitEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Sayfa başlığını ve meta açıklamasını ayarla
  useEffect(() => {
    document.title = 'Harfiye - Gerçek Zamanlı Kelime Oyunu';
    
    // Meta açıklama güncelle
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Arkadaşlarınızla gerçek zamanlı Türkçe kelime düellosu! 5, 6, 7 harfli kelimelerle çok oyunculu yarış. Ücretsiz, kayıt gerektirmez. Hemen oda kurun ve Harfiye oyununa başlayın!'
      );
    }
  }, []);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Lütfen adınızı girin');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Socket.io bağlantısı kurulduktan sonra oda oluştur
    if (!socket.connected) {
      socket.connect();
    }
    
    socket.emit('create_room', { 
      playerName: playerName.trim(),
      maxPlayers: maxPlayers,
      wordLength: wordLength,
      timeLimit: isTimeLimitEnabled ? timeLimit : null
    });
    
    // Oda oluşturulduğunda cevabı dinle
    socket.once('room_created', ({ roomId: newRoomId }: { roomId: string }) => {
      setIsLoading(false);
      // Oda sayfasına yönlendir
      router.push(`/oda/${newRoomId}?playerName=${encodeURIComponent(playerName.trim())}`);
    });
    
    // Hata durumunu dinle
    socket.once('error', ({ message }: { message: string }) => {
      setIsLoading(false);
      setError(message);
    });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Lütfen adınızı girin');
      return;
    }
    
    if (!roomId.trim()) {
      setError('Lütfen oda kodunu girin');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Oda sayfasına yönlendir (oda kontrolü orada yapılacak)
    router.push(`/oda/${roomId.trim().toUpperCase()}?playerName=${encodeURIComponent(playerName.trim())}`);
  };

  const resetForm = () => {
    setPlayerName('');
    setRoomId('');
    setMaxPlayers(2);
    setWordLength(5);
    setTimeLimit(30);
    setIsTimeLimitEnabled(true);
    setGameMode(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Ana Başlık - Responsive boyutlar */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-6 gradient-animate">
              Harfiye
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-2 sm:mb-3">
              Gerçek zamanlı, çok oyunculu kelime oyunu
            </p>
            <p className="text-sm sm:text-base md:text-lg text-slate-500">
              Rakibinle aynı anda aynı kelimeyi bulmaya çalış!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Sol Kolon: Oyun Formu */}
            <div className="order-1 lg:order-1 flex justify-center">
              <div className="w-full max-w-md">
                {!gameMode ? (
                  /* Mod Seçim Butonları */
                  <div className="space-y-4 sm:space-y-6">
                    <button
                      onClick={() => setGameMode('create')}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl btn-glow"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-xl sm:text-2xl">🚀</span>
                        <span className="text-base sm:text-lg">Yeni Oda Oluştur</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setGameMode('join')}
                      className="w-full bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-cyan-400 hover:from-slate-50 hover:to-slate-100 text-slate-700 font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-xl sm:text-2xl">🎯</span>
                        <span className="text-base sm:text-lg">Odaya Katıl</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 glass">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                        {gameMode === 'create' ? '🚀 Oda Oluştur' : '🎯 Odaya Katıl'}
                      </h2>
                      <button
                        onClick={resetForm}
                        className="text-slate-500 hover:text-slate-700 transition-colors text-xl hover:scale-110 transform"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {/* İsim Girişi */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                          Adınız
                        </label>
                        <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Adınızı girin"
                          maxLength={20}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm focus:shadow-md text-sm sm:text-base"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Oyuncu Sayısı Seçimi (sadece oda oluşturma modunda) */}
                      {gameMode === 'create' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                            Maksimum Oyuncu: {maxPlayers} kişi
                          </label>
                          <div className="space-y-3">
                            <input
                              type="range"
                              min="2"
                              max="5"
                              value={maxPlayers}
                              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                              disabled={isLoading}
                            />
                            <div className="flex justify-between text-xs text-slate-500 px-1">
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Kelime Uzunluğu Seçimi (sadece oda oluşturma modunda) */}
                      {gameMode === 'create' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                            Kelime Uzunluğu: {wordLength} harf
                          </label>
                          <div className="space-y-3">
                            <input
                              type="range"
                              min="5"
                              max="7"
                              value={wordLength}
                              onChange={(e) => setWordLength(parseInt(e.target.value))}
                              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                              disabled={isLoading}
                            />
                            <div className="flex justify-between text-xs text-slate-500 px-1">
                              <span>5 harf</span>
                              <span>6 harf</span>
                              <span>7 harf</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Zaman Sınırı Ayarları (sadece oda oluşturma modunda) */}
                      {gameMode === 'create' && (
                        <div>
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <label className="text-sm font-medium text-slate-700">
                              Zaman Sınırı
                            </label>
                            <div className="flex items-center space-x-2 text-xs sm:text-sm">
                              <span className={`${!isTimeLimitEnabled ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                                Sınırsız
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsTimeLimitEnabled(!isTimeLimitEnabled)}
                                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                                  isTimeLimitEnabled ? 'bg-cyan-600' : 'bg-slate-300'
                                }`}
                                disabled={isLoading}
                              >
                                <span
                                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                                    isTimeLimitEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <span className={`${isTimeLimitEnabled ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                                Sınırlı
                              </span>
                            </div>
                          </div>
                          
                          {isTimeLimitEnabled && (
                            <div className="space-y-3">
                              <div className="text-center">
                                <span className="text-base sm:text-lg font-semibold text-slate-800">
                                  {timeLimit} saniye
                                </span>
                                <p className="text-xs text-slate-500">
                                  Her kelime için süre
                                </p>
                              </div>
                              
                              <div className="flex justify-center flex-wrap space-x-1 sm:space-x-2 gap-1">
                                {[30, 35, 60, 75, 90].map((seconds) => (
                                  <button
                                    key={seconds}
                                    type="button"
                                    onClick={() => setTimeLimit(seconds)}
                                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                      timeLimit === seconds
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                    disabled={isLoading}
                                  >
                                    {seconds}s
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Oda Kodu (sadece katılma modunda) */}
                      {gameMode === 'join' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                            Oda Kodu
                          </label>
                          <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                            placeholder="Oda kodunu girin (örn: ABC123)"
                            maxLength={6}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm focus:shadow-md uppercase text-sm sm:text-base"
                            disabled={isLoading}
                          />
                        </div>
                      )}

                      {/* Hata Mesajı */}
                      {error && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-3 sm:p-4">
                          <p className="text-red-600 text-sm font-medium">
                            {error}
                          </p>
                        </div>
                      )}

                      {/* Aksiyon Butonu */}
                      <button
                        onClick={gameMode === 'create' ? handleCreateRoom : handleJoinRoom}
                        disabled={isLoading || !playerName.trim() || (gameMode === 'join' && !roomId.trim())}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl btn-glow text-sm sm:text-base"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                            {gameMode === 'create' ? 'Oda Oluşturuluyor...' : 'Katılıyor...'}
                          </div>
                        ) : (
                          gameMode === 'create' ? 'Oda Oluştur' : 'Odaya Katıl'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Kolon: Nasıl Oynanır - Kompakt */}
            <div className="order-2 lg:order-2">
              <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 mb-4 sm:mb-6 text-center">
                  🎯 Nasıl Oynanır?
                </h2>

                {/* Kompakt Adımlar */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Adım 1 */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm sm:text-lg lg:text-xl font-bold text-white">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-amber-600 mb-1 sm:mb-2">Oda Kur</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-600">
                        Oda oluştur ve arkadaşına linki gönder.
                      </p>
                    </div>
                  </div>

                  {/* Adım 2 */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm sm:text-lg lg:text-xl font-bold text-white">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-amber-600 mb-1 sm:mb-2">Kelime Bul</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-600">
                        Gizli kelimeyi 6 denemede bulmaya çalış!
                      </p>
                    </div>
                  </div>

                  {/* Adım 3 */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm sm:text-lg lg:text-xl font-bold text-white">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-amber-600 mb-1 sm:mb-2">Renkleri Takip Et</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-3 sm:mb-4">
                        Yeşil: Doğru, Sarı: Var ama yanlış yer, Gri: Yok
                      </p>
                      
                      {/* Mini Örnek */}
                      <div className="flex justify-center gap-1 sm:gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs sm:text-sm lg:text-base font-bold text-white">K</span>
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs sm:text-sm lg:text-base font-bold text-white">E</span>
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-slate-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs sm:text-sm lg:text-base font-bold text-white">L</span>
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-slate-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs sm:text-sm lg:text-base font-bold text-white">İ</span>
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs sm:text-sm lg:text-base font-bold text-white">E</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adım 4 */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm sm:text-lg lg:text-xl font-bold text-white">4</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-amber-600 mb-1 sm:mb-2">Kazan!</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-600">
                        İlk bulan kazanır! Hızlı ol.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detaylı bilgi linki */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 text-center">
                  <a 
                    href="/nasil-oynanir"
                    className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium text-sm sm:text-base transition-colors"
                  >
                    Detaylı Kurallar
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO ve İçerik Artırma - Alt Bilgi Bölümü */}
        <div className="mt-12 lg:mt-16 space-y-8 lg:space-y-12">
          {/* Avantajlar */}
          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-6 sm:mb-8">
              🌟 Neden Harfiye?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Rekabetçi Oyun</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Arkadaşlarınızla gerçek zamanlı yarışın. Aynı kelimeyi aynı anda bulmaya çalışarak heyecanı katlayın.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Zihinsel Gelişim</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Kelime haznenizi geliştirin, Türkçe dilindeki zenginlikleri keşfedin ve analitik düşünce becerinizi artırın.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Hızlı Başlangıç</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Kayıt olmaya gerek yok! Hemen oda kurun, linki arkadaşlarınıza gönderin ve oynamaya başlayın.
                </p>
              </div>
            </div>
          </section>

          {/* Özellikler */}
          <section className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 text-center">
              ⚙️ Oyun Özellikleri
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-xl">🔤</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Çoklu Kelime Uzunluğu</h3>
                    <p className="text-slate-600 text-sm">5, 6 ve 7 harfli kelimelerle farklı zorluk seviyeleri</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-xl">👥</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Çok Oyunculu</h3>
                    <p className="text-slate-600 text-sm">2'den 6 kişiye kadar arkadaşlarınızla oynayın</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-xl">⏱️</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Zaman Kontrolü</h3>
                    <p className="text-slate-600 text-sm">Zaman sınırını kendiniz belirleyin veya sınırsız oynayın</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-xl">🇹🇷</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Türkçe Odaklı</h3>
                    <p className="text-slate-600 text-sm">Binlerce Türkçe kelime ile zengin bir oyun deneyimi</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-xl">📱</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Mobil Uyumlu</h3>
                    <p className="text-slate-600 text-sm">Telefon, tablet ve bilgisayarınızda sorunsuz çalışır</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-xl">🔄</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Rövanş Sistemi</h3>
                    <p className="text-slate-600 text-sm">Oyun bittiğinde hemen rövanş alabilirsiniz</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popüler Kelime Uzunlukları */}
          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">
              📊 Popüler Oyun Modları
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">5 Harf</div>
                <div className="text-green-800 font-medium mb-1">En Popüler</div>
                <div className="text-green-700 text-sm">Hızlı ve eğlenceli oyunlar</div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">6 Harf</div>
                <div className="text-yellow-800 font-medium mb-1">Orta Zorluk</div>
                <div className="text-yellow-700 text-sm">Denge ve strateji</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">7 Harf</div>
                <div className="text-purple-800 font-medium mb-1">Uzman Seviye</div>
                <div className="text-purple-700 text-sm">Gerçek kelime ustaları için</div>
              </div>
            </div>
          </section>

          {/* Alt Bilgi ve Linkler */}
          <section className="bg-slate-100 border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
              Harfiye Hakkında Daha Fazla Bilgi
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Harfiye, Türkçe kelime oyunlarını sosyal ve rekabetçi bir boyuta taşıyan ücretsiz web platformudur. 
              Modern teknolojiler kullanılarak geliştirilmiş olup, arkadaşlarınızla eğlenceli vakit geçirmek 
              için tasarlanmıştır.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="/nasil-oynanir"
                className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                📖 Oyun Kuralları
              </a>
              <a
                href="/hakkimizda"
                className="inline-flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                ℹ️ Hakkımızda
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
