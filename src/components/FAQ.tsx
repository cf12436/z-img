'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

interface FAQProps {
  locale: Locale;
}

export default function FAQ({ locale }: FAQProps) {
  const t = translations[locale];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t.faq1Q, answer: t.faq1A },
    { question: t.faq2Q, answer: t.faq2A },
    { question: t.faq3Q, answer: t.faq3A },
    { question: t.faq4Q, answer: t.faq4A },
    { question: t.faq5Q, answer: t.faq5A },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          <span className="gradient-text">{t.faq}</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-bold text-lg text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-gray-200 font-medium">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
