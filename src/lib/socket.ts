import { io, Socket } from 'socket.io-client';

// Socket URL'ini SADECE environment değişkeninden al
function getSocketURL(): string {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  // Eğer .env dosyasını ayarlamayı unutursanız bu hata size yardımcı olacaktır.
  if (!url) {
    throw new Error("HATA: NEXT_PUBLIC_SOCKET_URL environment değişkeni tanımlanmamış. Lütfen .env.local veya Vercel ayarlarınızı kontrol edin.");
  }
  
  return url;
}

const SOCKET_URL = getSocketURL();

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Manuel bağlantı kontrolü için
  transports: ['websocket', 'polling'], // Fallback desteği
  forceNew: true, // Her zaman yeni bağlantı kur
  reconnection: true, // Otomatik yeniden bağlanma
  reconnectionAttempts: 5, // 5 deneme
  reconnectionDelay: 1000, // 1 saniye gecikme
  timeout: 10000 // 10 saniye timeout
});

// Debug amaçlı event listener'lar (bunlar çok faydalı, kalsın!)
console.log('🔧 Socket.IO bağlantısı için hedef URL:', SOCKET_URL);

socket.on('connect', () => {
  console.log('✅ Socket.IO bağlandı:', socket.id);
  console.log('🌐 Bağlanılan URL:', SOCKET_URL);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket.IO bağlantısı kesildi:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Socket.IO bağlantı hatası:', error);
  console.error('🔴 Denenen URL:', SOCKET_URL);
  console.error('🔴 Error detayları:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Socket.IO yeniden bağlandı, deneme:', attemptNumber);
});

socket.on('reconnect_error', (error) => {
  console.error('🔴 Yeniden bağlanma hatası:', error);
});

socket.on('reconnect_failed', () => {
  console.error('💀 Yeniden bağlanma başarısız - tüm denemeler tükendi');
});

export default socket; 