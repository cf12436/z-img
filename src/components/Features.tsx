'use client';

import { Zap, UserX, Sparkles, Gift } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

interface FeaturesProps {
  locale: Locale;
}

export default function Features({ locale }: FeaturesProps) {
  const t = translations[locale];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t.feature1Title,
      description: t.feature1Desc,
    },
    {
      icon: <UserX className="w-8 h-8" />,
      title: t.feature2Title,
      description: t.feature2Desc,
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t.feature3Title,
      description: t.feature3Desc,
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: t.feature4Title,
      description: t.feature4Desc,
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          <span className="gradient-text">{t.features}</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-200 font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
