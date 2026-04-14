import { Language } from './translations';

const ones_en = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens_en = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertToWordsEN(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 0) return 'Minus ' + convertToWordsEN(-n);
  
  let words = '';
  
  if (Math.floor(n / 10000000) > 0) {
    words += convertToWordsEN(Math.floor(n / 10000000)) + ' Crore ';
    n %= 10000000;
  }
  if (Math.floor(n / 100000) > 0) {
    words += convertToWordsEN(Math.floor(n / 100000)) + ' Lakh ';
    n %= 100000;
  }
  if (Math.floor(n / 1000) > 0) {
    words += convertToWordsEN(Math.floor(n / 1000)) + ' Thousand ';
    n %= 1000;
  }
  if (Math.floor(n / 100) > 0) {
    words += ones_en[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (words !== '') words += 'and ';
    if (n < 20) words += ones_en[n];
    else {
      words += tens_en[Math.floor(n / 10)];
      if (n % 10 > 0) words += ' ' + ones_en[n % 10];
    }
  }
  return words.trim();
}

const ones_ta = ['', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது',
  'பத்து', 'பதினொன்று', 'பன்னிரண்டு', 'பதிமூன்று', 'பதினான்கு', 'பதினைந்து', 'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது'];
const tens_ta = ['', '', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது', 'அறுபது', 'எழுபது', 'எண்பது', 'தொண்ணூறு'];

function convertToWordsTa(n: number): string {
  if (n === 0) return 'பூஜ்யம்';
  let words = '';
  if (Math.floor(n / 10000000) > 0) { words += convertToWordsTa(Math.floor(n / 10000000)) + ' கோடி '; n %= 10000000; }
  if (Math.floor(n / 100000) > 0) { words += convertToWordsTa(Math.floor(n / 100000)) + ' லட்சம் '; n %= 100000; }
  if (Math.floor(n / 1000) > 0) { words += convertToWordsTa(Math.floor(n / 1000)) + ' ஆயிரம் '; n %= 1000; }
  if (Math.floor(n / 100) > 0) { words += ones_ta[Math.floor(n / 100)] + ' நூறு '; n %= 100; }
  if (n > 0) {
    if (n < 20) words += ones_ta[n];
    else { words += tens_ta[Math.floor(n / 10)]; if (n % 10 > 0) words += ' ' + ones_ta[n % 10]; }
  }
  return words.trim();
}

const ones_hi = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ',
  'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
const tens_hi = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

function convertToWordsHi(n: number): string {
  if (n === 0) return 'शून्य';
  let words = '';
  if (Math.floor(n / 10000000) > 0) { words += convertToWordsHi(Math.floor(n / 10000000)) + ' करोड़ '; n %= 10000000; }
  if (Math.floor(n / 100000) > 0) { words += convertToWordsHi(Math.floor(n / 100000)) + ' लाख '; n %= 100000; }
  if (Math.floor(n / 1000) > 0) { words += convertToWordsHi(Math.floor(n / 1000)) + ' हज़ार '; n %= 1000; }
  if (Math.floor(n / 100) > 0) { words += ones_hi[Math.floor(n / 100)] + ' सौ '; n %= 100; }
  if (n > 0) {
    if (n < 20) words += ones_hi[n];
    else { words += tens_hi[Math.floor(n / 10)]; if (n % 10 > 0) words += ' ' + ones_hi[n % 10]; }
  }
  return words.trim();
}

export function amountToWords(amount: number, lang: Language): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  const suffixes: Record<Language, { rupees: string; paise: string; only: string }> = {
    en: { rupees: 'Rupees', paise: 'Paise', only: 'Only' },
    ta: { rupees: 'ரூபாய்', paise: 'பைசா', only: 'மட்டும்' },
    hi: { rupees: 'रुपये', paise: 'पैसे', only: 'मात्र' },
  };

  const converters: Record<Language, (n: number) => string> = {
    en: convertToWordsEN,
    ta: convertToWordsTa,
    hi: convertToWordsHi,
  };

  const s = suffixes[lang];
  const convert = converters[lang];
  
  let result = convert(rupees) + ' ' + s.rupees;
  if (paise > 0) result += ' ' + convert(paise) + ' ' + s.paise;
  result += ' ' + s.only;
  return result;
}
