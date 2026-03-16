'use client';

import { Check } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

interface AboutProps {
  locale: Locale;
}

export default function About({ locale }: AboutProps) {
  const t = translations[locale];

  const features = [
    t.aboutFeature1,
    t.aboutFeature2,
    t.aboutFeature3,
    t.aboutFeature4,
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              <span className="gradient-text">{t.aboutTitle}</span>
            </h2>
            <p className="text-gray-100 mb-8 text-lg leading-relaxed font-medium">
              {t.aboutDesc}
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-gray-100 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden glass-effect p-2">
              <img
                src="https://zimg.artkits.store/image_015.jpeg"
                alt="Z-Image example"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
