import { Language } from '@/lib/translations';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageToggle = ({ language, setLanguage }: LanguageToggleProps) => {
  const options: { value: Language; label: string }[] = [
    { value: 'en', label: 'English 🇬🇧' },
    { value: 'ta', label: 'தமிழ் 🇮🇳' },
    { value: 'hi', label: 'हिंदी 🇮🇳' },
  ];

  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            language === opt.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
