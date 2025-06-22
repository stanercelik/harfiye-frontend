import React from 'react';

interface RematchRequestModalProps {
  isOpen: boolean;
  requesterName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function RematchRequestModal({
  isOpen,
  requesterName,
  onAccept,
  onDecline
}: RematchRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center">
            🔄 Rövanş Teklifi
          </h2>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⚔️</div>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {requesterName}
              </span> size rövanş teklif ediyor!
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bir oyun daha oynamak ister misiniz?
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex space-x-4">
            <button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              ✅ Kabul Et
            </button>
            <button
              onClick={onDecline}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              ❌ Reddet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 