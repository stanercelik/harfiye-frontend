import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/ui/Header';

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Harfiye projesinin amacı ve hikayesi. Kelime oyunu tutkunları için geliştirildi. Türkçe kelime oyunlarında yenilikçi çözümler sunuyoruz.",
  keywords: ["harfiye hakkında", "kelime oyunu geliştirici", "türkçe oyun", "word game türkiye"],
  openGraph: {
    title: "Hakkımızda - Harfiye",
    description: "Harfiye projesinin amacı ve hikayesi. Kelime oyunu tutkunları için geliştirildi.",
    url: "https://harfiye.com/hakkimizda",
    images: [
      {
        url: "https://harfiye.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harfiye - Hakkımızda"
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
    canonical: "https://harfiye.com/hakkimizda"
  }
};

export default function Hakkimizda() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">
            💫 Hakkımızda
          </h1>
          
          <div className="space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🎯 Misyonumuz</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                Harfiye, Türkçe kelime oyunlarını sosyal ve rekabetçi bir boyuta taşıyarak 
                arkadaşlarıyla eğlenceli vakit geçirmek isteyen oyuncular için tasarlandı. 
                Amacımız, kelime bulmaca keyfini gerçek zamanlı, çok oyunculu bir deneyimle 
                harmanlayarak Türkçe dilinin zenginliğini kutlamaktır.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🚀 Hikayemiz</h2>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 sm:p-6">
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                  Popüler kelime oyunu Wordle&apos;dan ilham alan Harfiye, Türkçe dil desteği ve 
                  çok oyunculu özelliklerle fark yaratıyor. Tek başına oynanan klasik formatın 
                  ötesine geçerek, arkadaşlarınızla aynı anda yarışabileceğiniz dinamik bir 
                  platform oluşturduk.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">✨ Özelliklerimiz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-green-800 mb-2 sm:mb-3">🔤 Çoklu Kelime Uzunluğu</h3>
                  <p className="text-green-700 text-xs sm:text-sm">
                    5, 6 ve 7 harfli kelimelerle farklı zorluk seviyelerinde oyun deneyimi sunuyoruz.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-purple-800 mb-2 sm:mb-3">👥 Çok Oyunculu</h3>
                  <p className="text-purple-700 text-xs sm:text-sm">
                    2&apos;den 6 kişiye kadar arkadaşlarınızla aynı anda oynayın ve gerçek zamanlı yarışın.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-yellow-800 mb-2 sm:mb-3">🇹🇷 Türkçe Odaklı</h3>
                  <p className="text-yellow-700 text-xs sm:text-sm">
                    Binlerce Türkçe kelime ile dilimizin güzelliğini keşfedin ve öğrenin.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-blue-800 mb-2 sm:mb-3">⚡ Gerçek Zamanlı</h3>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    Anında bağlantı, hızlı oyun deneyimi ve canlı rekabet atmosferi.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🛠️ Teknoloji</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
                <p className="text-slate-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                  Harfiye, modern web teknolojileri kullanılarak geliştirilmiştir:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <strong className="text-slate-800">Frontend:</strong>
                    <ul className="text-slate-600 mt-1">
                      <li>• Next.js 13+ (App Router)</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-slate-800">Backend:</strong>
                    <ul className="text-slate-600 mt-1">
                      <li>• Node.js + Express</li>
                      <li>• Socket.IO (Gerçek zamanlı)</li>
                      <li>• TypeScript</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">🎮 Neden Harfiye?</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-xl sm:text-2xl">🎯</div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Rekabetçi Ortam</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Arkadaşlarınızla yarışarak daha eğlenceli bir deneyim yaşayın.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-xl sm:text-2xl">🧠</div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Zihinsel Egzersiz</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Kelime haznenizi geliştirin ve analitik düşünme becerinizi artırın.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-xl sm:text-2xl">🚀</div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Kolay Erişim</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Kayıt gerektirmez, hemen link paylaşın ve oynamaya başlayın.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4">📞 İletişim</h2>
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 sm:p-6">
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Harfiye hakkında sorularınız, önerileriniz veya geri bildirimleriniz için 
                  bizimle iletişime geçebilirsiniz. Kullanıcı deneyimini sürekli iyileştirmek 
                  için her türlü görüş ve öneriyi değerli buluyoruz.
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
            🏠 Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    </div>
  );
} 