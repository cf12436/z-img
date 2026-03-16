'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, defaultLocale, locales } from '@/i18n/locales';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查保存的语言偏好或浏览器语言
    const savedLocale = localStorage.getItem('preferred-locale') as Locale;
    const browserLang = navigator.language.split('-')[0] as Locale;
    
    let targetLocale = defaultLocale;
    
    if (savedLocale && locales.includes(savedLocale)) {
      targetLocale = savedLocale;
    } else if (locales.includes(browserLang)) {
      targetLocale = browserLang;
    }
    
    // 重定向到对应语言路由
    router.replace(`/${targetLocale}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
