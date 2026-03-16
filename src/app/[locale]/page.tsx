'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Features from '@/components/Features';
import About from '@/components/About';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { Locale, locales, defaultLocale } from '@/i18n/locales';

export default function LocalePage() {
  const params = useParams();
  const localeParam = params.locale as string;
  
  // 验证locale是否有效
  const isValidLocale = locales.includes(localeParam as Locale);
  const [locale, setLocale] = useState<Locale>(isValidLocale ? localeParam as Locale : defaultLocale);

  useEffect(() => {
    if (isValidLocale) {
      setLocale(localeParam as Locale);
      localStorage.setItem('preferred-locale', localeParam);
    }
  }, [localeParam, isValidLocale]);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
    // 使用路由跳转
    window.location.href = `/${newLocale}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header locale={locale} onLocaleChange={handleLocaleChange} />
      <Hero locale={locale} />
      <Gallery locale={locale} />
      <Features locale={locale} />
      <About locale={locale} />
      <FAQ locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
