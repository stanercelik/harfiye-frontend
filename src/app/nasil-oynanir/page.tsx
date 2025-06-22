import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/ui/Header';

export const metadata: Metadata = {
  title: "Nasıl Oynanır?",
  description: "Harfiye oyun kurallarını öğren. Rakibinden önce 5, 6 veya 7 harfli gizli kelimeyi nasıl bulacağını keşfet. Detaylı oyun rehberi ve ipuçları.",
  keywords: ["harfiye nasıl oynanır", "kelime oyunu kuralları", "harfiye rehber", "kelime bulma taktikleri"],
  openGraph: {
    title: "Nasıl Oynanır? - Harfiye",
    description: "Harfiye oyun kurallarını öğren. Rakibinden önce gizli kelimeyi nasıl bulacağını keşfet.",
    url: "https://harfiye.com/nasil-oynanir",
    images: [
      {
        url: "https://harfiye.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harfiye - Nasıl Oynanır"
      }
    ],
    locale: "tr_TR",
    type: "article"
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://harfiye.com/nasil-oynanir"
  }
};

export default function NasilOynanir() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">
            🎯 Nasıl Oynanır?
          </h1>
          
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">📝 Oyunun Amacı</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Harfiye&apos;de amacınız, rakibinizden önce gizli kelimeyi bulmaktır. Her oyuncu aynı kelimeyi tahmin etmeye çalışır ve ilk bulan kazanır!
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🎮 Oyun Kuralları</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-cyan-800 mb-2">1. Oda Kurma</h3>
                  <div className="text-cyan-700 text-sm sm:text-base">
                    <p>• Kelime uzunluğunu seçin (5, 6 veya 7 harf)</p>
                    <p>• Maksimum oyuncu sayısını belirleyin (2-6 kişi)</p>
                    <p>• Oda linkini arkadaşlarınıza gönderin</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">2. Tahmin Yapma</h3>
                  <div className="text-yellow-700 text-sm sm:text-base">
                    <p>• Her turda bir kelime tahmin edin</p>
                    <p>• Toplam 6 tahmin hakkınız var</p>
                    <p>• Sadece geçerli Türkçe kelimeler kabul edilir</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-green-800 mb-2">3. Renk Sistemi</h3>
                  <div className="space-y-2 text-green-700 text-sm sm:text-base">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded"></div>
                      <span>Yeşil: Doğru harf, doğru konum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-500 rounded"></div>
                      <span>Sarı: Doğru harf, yanlış konum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-slate-500 rounded"></div>
                      <span>Gri: Harf kelimede yok</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">⏱️ Zaman Limitleri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">90s</div>
                  <div className="text-xs sm:text-sm text-slate-600">5 harfli kelimeler</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">120s</div>
                  <div className="text-xs sm:text-sm text-slate-600">6 harfli kelimeler</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">150s</div>
                  <div className="text-xs sm:text-sm text-slate-600">7 harfli kelimeler</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🏆 Kazanma Koşulları</h2>
              <div className="space-y-2 text-slate-600 text-sm sm:text-base">
                <p>• Gizli kelimeyi ilk bulan oyuncu kazanır</p>
                <p>• Süre bitmeden kelimeyi bulamazsanız kaybedersiniz</p>
                <p>• Aynı anda bulan oyuncular arasında beraberlik olur</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">💡 İpuçları</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 sm:p-4 lg:p-6">
                <ul className="space-y-1 sm:space-y-2 text-purple-800 text-sm sm:text-base">
                  <li>• Yaygın harflerle başlayın (A, E, İ, R, N, L)</li>
                  <li>• Sarı harfleri farklı pozisyonlarda deneyin</li>
                  <li>• Gri harfleri bir daha kullanmayın</li>
                  <li>• Türkçe kelime yapısını düşünün</li>
                  <li>• Rakibinizin ilerlemesini takip edin</li>
                </ul>
              </div>
            </section>

            {/* Örnek Oyun Gösterimi - Responsive */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🎯 Örnek Oyun</h2>
              <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
                <p className="text-center text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  &quot;KELME&quot; tahmini sonucu:
                </p>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="flex gap-1 sm:gap-2 lg:gap-3">
                    {/* K - Doğru */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-green-500 border-2 border-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white">K</span>
                    </div>
                    {/* E - Yanlış yer */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-yellow-500 border-2 border-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white">E</span>
                    </div>
                    {/* L - Yok */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-slate-500 border-2 border-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white">L</span>
                    </div>
                    {/* M - Yok */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-slate-500 border-2 border-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white">M</span>
                    </div>
                    {/* E - Doğru */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-green-500 border-2 border-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white">E</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-slate-600 text-xs sm:text-sm lg:text-base">
                  K ve E doğru yerde, E ortada kelimede var ama yanlış yerde, L ve M yok.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            🚀 Hemen Oyna
          </Link>
        </div>
      </main>
    </div>
  );
} 