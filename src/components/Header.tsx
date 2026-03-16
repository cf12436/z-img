'use client';

import { Sparkles } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function Header({ locale, onLocaleChange }: HeaderProps) {
  const t = translations[locale];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold gradient-text">Z-Image</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t.gallery}
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t.features}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t.about}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t.faq}
            </button>
            <a
              href="https://nanosora.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              NanoSora
            </a>
            <a
              href="https://z-img.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Z-Img
            </a>
            <a
              href="https://videodance.cc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              VideoDance
            </a>
          </nav>

          <LanguageSelector currentLocale={locale} onLocaleChange={onLocaleChange} />
        </div>
      </div>
    </header>
  );
}
