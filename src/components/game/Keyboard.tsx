import Key from './Key';

interface UsedKeys {
  [key: string]: 'correct' | 'present' | 'absent';
}

interface KeyboardProps {
  usedKeys: UsedKeys;
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

export default function Keyboard({ 
  usedKeys, 
  onKeyPress, 
  onEnter, 
  onBackspace 
}: KeyboardProps) {
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'];
  const bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'];

  const getKeyStatus = (letter: string) => {
    return usedKeys[letter] || 'unused';
  };

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3 sm:p-4">
      {/* Üst sıra */}
      <div className="flex justify-center gap-1 sm:gap-2 mb-3 sm:mb-3">
        {topRow.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            status={getKeyStatus(letter)}
            onClick={handleKeyPress}
          />
        ))}
      </div>

      {/* Orta sıra */}
      <div className="flex justify-center gap-1 sm:gap-2 mb-3 sm:mb-3">
        {middleRow.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            status={getKeyStatus(letter)}
            onClick={handleKeyPress}
          />
        ))}
      </div>

      {/* Alt sıra */}
      <div className="flex justify-center gap-1 sm:gap-2">
        {/* Enter tuşu */}
        <button
          onClick={onEnter}
          className="px-4 sm:px-5 md:px-7 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 
                     border border-slate-300 rounded-md font-semibold text-base sm:text-lg md:text-xl lg:text-lg
                     hover:from-slate-200 hover:to-slate-300 hover:shadow-lg hover:scale-105 
                     transition-all duration-300 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
                     transform active:scale-95 shadow-md"
        >
          GİR
        </button>

        {bottomRow.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            status={getKeyStatus(letter)}
            onClick={handleKeyPress}
          />
        ))}

        {/* Backspace tuşu */}
        <button
          onClick={onBackspace}
          className="px-4 sm:px-5 md:px-7 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 
                     border border-slate-300 rounded-md font-semibold text-xl sm:text-2xl md:text-3xl lg:text-2xl
                     hover:from-slate-200 hover:to-slate-300 hover:shadow-lg hover:scale-105 
                     transition-all duration-300 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
                     transform active:scale-95 shadow-md"
        >
          ⌫
        </button>
      </div>
    </div>
  );
} 