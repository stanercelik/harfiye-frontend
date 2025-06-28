'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdSenseManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Oyun odalarında ve diğer yasak sayfalarda AdSense'i yükleme
    const isGameRoom = pathname?.startsWith('/oda/');
    const isRestrictedPage = isGameRoom;

    if (!isRestrictedPage) {
      // Sadece izin verilen sayfalarda AdSense'i yükle
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2958213735333735';
      script.crossOrigin = 'anonymous';
      
      // Script zaten yüklenmemişse ekle
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        document.head.appendChild(script);
      }

      // AdSense'in hazır olduğundan emin ol
      script.onload = () => {
        try {
          interface WindowWithAdSense extends Window {
            adsbygoogle?: unknown[];
          }
          ((window as WindowWithAdSense).adsbygoogle = (window as WindowWithAdSense).adsbygoogle || []).push({});
        } catch (e) {
          console.warn('AdSense yükleme hatası:', e);
        }
      };
    } else {
      // Yasak sayfalarda var olan AdSense script'lerini kaldır
      const existingScripts = document.querySelectorAll('script[src*="adsbygoogle.js"]');
      existingScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });

      // AdSense global değişkenini temizle
      if (typeof window !== 'undefined') {
        interface WindowWithAdSense extends Window {
          adsbygoogle?: unknown[];
        }
        (window as WindowWithAdSense).adsbygoogle = undefined;
      }
    }
  }, [pathname]);

  return null; // Bu component hiçbir görsel element render etmez
} 