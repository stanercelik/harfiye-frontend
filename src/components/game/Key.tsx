interface KeyProps {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'unused';
  onClick: (letter: string) => void;
}

export default function Key({ letter, status, onClick }: KeyProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white border-green-600';
      case 'present':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'absent':
        return 'bg-slate-500 text-white border-slate-600';
      case 'unused':
      default:
        return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 border-slate-300 hover:from-slate-200 hover:to-slate-300';
    }
  };

  return (
    <button
      onClick={() => onClick(letter)}
      className={`
        w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 lg:w-12 lg:h-14
        border rounded-md font-semibold text-base sm:text-lg md:text-xl lg:text-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
        transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
        ${getStatusClasses()}
      `}
    >
      {letter}
    </button>
  );
} 