import { io, Socket } from 'socket.io-client';

// Socket URL'ini dinamik olarak belirle
function getSocketURL(): string {
  // Eğer environment variable varsa onu kullan
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  
  // Tarayıcı ortamında ise, mevcut hostname'i kullan
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Localhost durumları
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3002';
    }
    
    // IP adresi durumları
    return `${protocol}//${hostname}:3002`;
  }
  
  // Server-side rendering durumunda varsayılan
  return 'http://localhost:3002';
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

// Debug amaçlı event listener'lar
console.log('🔧 Socket.IO URL:', SOCKET_URL);

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