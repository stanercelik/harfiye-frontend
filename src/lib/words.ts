// Türkçe kelime listelerini import et
import words5Data from '../../words_tr_5.json';
import words6Data from '../../words_tr_6.json';
import words7Data from '../../words_tr_7.json';

/**
 * Şapkalı harfleri normal harflere dönüştürür (â→a, î→i, û→u)
 */
export function normalizeAccentedChars(text: string): string {
  const accentMap: Record<string, string> = {
    'â': 'a', 'Â': 'A',
    'î': 'i', 'Î': 'I',
    'û': 'u', 'Û': 'U'
  };
  
  return text.split('').map(char => accentMap[char] || char).join('');
}

/**
 * Türkçe karakterlere özel büyük harf -> küçük harf dönüşümü
 */
export function turkishToLowerCase(text: string): string {
  const turkishCharMap: Record<string, string> = {
    'A': 'a', 'B': 'b', 'C': 'c', 'Ç': 'ç', 'D': 'd', 'E': 'e', 'F': 'f',
    'G': 'g', 'Ğ': 'ğ', 'H': 'h', 'I': 'ı', 'İ': 'i', 'J': 'j', 'K': 'k',
    'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o', 'Ö': 'ö', 'P': 'p', 'Q': 'q',
    'R': 'r', 'S': 's', 'Ş': 'ş', 'T': 't', 'U': 'u', 'Ü': 'ü', 'V': 'v',
    'W': 'w', 'X': 'x', 'Y': 'y', 'Z': 'z'
  };

  return text.split('').map(char => turkishCharMap[char] || char.toLowerCase()).join('');
}

/**
 * Türkçe karakterlere özel küçük harf -> büyük harf dönüşümü
 */
export function turkishToUpperCase(text: string): string {
  const turkishCharMap: Record<string, string> = {
    'a': 'A', 'b': 'B', 'c': 'C', 'ç': 'Ç', 'd': 'D', 'e': 'E', 'f': 'F',
    'g': 'G', 'ğ': 'Ğ', 'h': 'H', 'ı': 'I', 'i': 'İ', 'j': 'J', 'k': 'K',
    'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'ö': 'Ö', 'p': 'P', 'q': 'Q',
    'r': 'R', 's': 'S', 'ş': 'Ş', 't': 'T', 'u': 'U', 'ü': 'Ü', 'v': 'V',
    'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z'
  };

  return text.split('').map(char => turkishCharMap[char] || char.toUpperCase()).join('');
}

// Kelime listeleri - Şapkalı harfleri normal harflere çevir ve küçük harfe çevir
export const WORDS_5: string[] = words5Data.map(word => turkishToLowerCase(normalizeAccentedChars(word)));
export const WORDS_6: string[] = words6Data.map(word => turkishToLowerCase(normalizeAccentedChars(word)));
export const WORDS_7: string[] = words7Data.map(word => turkishToLowerCase(normalizeAccentedChars(word)));

// Geriye uyumluluk için varsayılan olarak 5 harfli kelimeleri kullan
export const WORDS: string[] = WORDS_5;

// Console'a kelime sayılarını yazdır
console.log(`🗂️ Kelime dosyaları yüklendi:`);
console.log(`📄 5 harfli: ${WORDS_5.length} kelime`);
console.log(`📄 6 harfli: ${WORDS_6.length} kelime`);
console.log(`📄 7 harfli: ${WORDS_7.length} kelime`);
console.log(`📄 İlk 5 kelime (5 harf):`, WORDS_5.slice(0, 5));
console.log(`📄 İlk 5 kelime (6 harf):`, WORDS_6.slice(0, 5));
console.log(`📄 İlk 5 kelime (7 harf):`, WORDS_7.slice(0, 5));

/**
 * Harf sayısına göre kelime listesi döner
 */
export function getWordsByLength(wordLength: 5 | 6 | 7): string[] {
  switch (wordLength) {
    case 5:
      return WORDS_5;
    case 6:
      return WORDS_6;
    case 7:
      return WORDS_7;
    default:
      return WORDS_5;
  }
}

/**
 * Belirtilen harf sayısına göre rastgele bir kelime seçer
 */
export function getRandomWord(wordLength: 5 | 6 | 7 = 5): string {
  const words = getWordsByLength(wordLength);
  const randomIndex = Math.floor(Math.random() * words.length);
  const selectedWord = words[randomIndex];
  console.log(`🎲 Rastgele kelime seçildi (${wordLength} harf) - Index: ${randomIndex}/${words.length} -> Kelime: "${selectedWord}"`);
  return selectedWord;
}

/**
 * Kelimenin geçerli olup olmadığını kontrol eder
 * Harf sayısına göre uygun listede arar
 */
export function isValidWord(word: string, wordLength?: 5 | 6 | 7): boolean {
  const normalizedWord = turkishToLowerCase(normalizeAccentedChars(word));
  
  // Eğer wordLength belirtilmişse sadece o listede ara
  if (wordLength) {
    const words = getWordsByLength(wordLength);
    const isValid = words.includes(normalizedWord);
    
    console.log(`🔍 ===== KELIME KONTROLÜ (${wordLength} harf) =====`);
    console.log(`📝 Girilen kelime: "${word}"`);
    console.log(`🔤 Normalize edilmiş: "${normalizedWord}"`);
    console.log(`📚 ${wordLength} harfli kelime sayısı: ${words.length}`);
    console.log(`✅ Kelime geçerli mi: ${isValid}`);
    
    if (!isValid) {
      const similarWords = words.filter(w => w.includes(normalizedWord) || normalizedWord.includes(w));
      console.log(`🔎 Benzer kelimeler (${similarWords.length} adet):`, similarWords.slice(0, 10));
    }
    
    console.log(`🔍 ============================`);
    return isValid;
  }
  
  // Eğer wordLength belirtilmemişse tüm listelerde ara
  const isValid5 = WORDS_5.includes(normalizedWord);
  const isValid6 = WORDS_6.includes(normalizedWord);
  const isValid7 = WORDS_7.includes(normalizedWord);
  const isValid = isValid5 || isValid6 || isValid7;
  
  console.log(`🔍 ===== KELIME KONTROLÜ (Tüm Listeler) =====`);
  console.log(`📝 Girilen kelime: "${word}"`);
  console.log(`🔤 Normalize edilmiş: "${normalizedWord}"`);
  console.log(`📚 5 harfli: ${isValid5}, 6 harfli: ${isValid6}, 7 harfli: ${isValid7}`);
  console.log(`✅ Kelime geçerli mi: ${isValid}`);
  console.log(`🔍 =====================================`);
  
  return isValid;
}

/**
 * Tahmini değerlendirir ve feedback döner
 * Türkçe büyük-küçük harf duyarsız ve şapkalı harf duyarsız değerlendirme yapar
 */
export function evaluateGuess(guess: string, solution: string): ('correct' | 'present' | 'absent')[] {
  const feedback: ('correct' | 'present' | 'absent')[] = [];
  const solutionArray = turkishToLowerCase(normalizeAccentedChars(solution)).split('');
  const guessArray = turkishToLowerCase(normalizeAccentedChars(guess)).split('');
  const wordLength = solutionArray.length;
  
  console.log(`🎯 Tahmin değerlendirme - Tahmin: "${guess}" (${turkishToLowerCase(normalizeAccentedChars(guess))}) vs Çözüm: "${solution}" (${turkishToLowerCase(normalizeAccentedChars(solution))})`);
  
  // İlk geçişte doğru pozisyondaki harfleri işaretle
  for (let i = 0; i < wordLength; i++) {
    if (guessArray[i] === solutionArray[i]) {
      feedback[i] = 'correct';
      solutionArray[i] = '*'; // İşaretlendi olarak kabul et
    }
  }
  
  // İkinci geçişte yanlış pozisyondaki harfleri kontrol et
  for (let i = 0; i < wordLength; i++) {
    if (feedback[i] === undefined) {
      const letterIndex = solutionArray.indexOf(guessArray[i]);
      if (letterIndex !== -1) {
        feedback[i] = 'present';
        solutionArray[letterIndex] = '*'; // İşaretlendi olarak kabul et
      } else {
        feedback[i] = 'absent';
      }
    }
  }
  
  console.log(`📊 Feedback:`, feedback);
  return feedback;
}

/**
 * Kelime sayısını döner (belirtilen harf sayısına göre)
 */
export function getWordCount(wordLength?: 5 | 6 | 7): number {
  if (wordLength) {
    return getWordsByLength(wordLength).length;
  }
  return WORDS_5.length + WORDS_6.length + WORDS_7.length;
} 