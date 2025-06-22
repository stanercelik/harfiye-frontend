import React from 'react';

interface RematchCountdownModalProps {
  isOpen: boolean;
  countdownSeconds: number;
}

export default function RematchCountdownModal({
  isOpen,
  countdownSeconds
}: RematchCountdownModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
        {/* Modal Content */}
        <div className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Rövanş Başlıyor!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Yeni oyun başlıyor...
            </p>
            
            {/* Geri Sayım */}
            <div className="relative">
              <div className={`
                text-8xl font-bold transition-all duration-300 transform
                ${countdownSeconds > 0 
                  ? 'text-blue-600 dark:text-blue-400 scale-110' 
                  : 'text-green-600 dark:text-green-400 scale-100'
                }
              `}>
                {countdownSeconds > 0 ? countdownSeconds : '🎮'}
              </div>
              
              {/* Pulse animasyonu */}
              {countdownSeconds > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-600/20 dark:bg-blue-400/20 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            
            {countdownSeconds <= 0 && (
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg mt-4">
                Başladı!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 