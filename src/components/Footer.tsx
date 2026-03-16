'use client';

import { Sparkles } from 'lucide-react';
import { Locale, locales, localeNames, localeFlags } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

interface FooterProps {
  locale: Locale;
}

const BADGES = [
  { href: 'https://submitmysaas.com', img: 'https://submitmysaas.com/featured-badge.png', alt: 'Featured on SubmitMySaas' },
  { href: 'https://twelve.tools', img: 'https://twelve.tools/badge0-dark.svg', alt: 'Featured on Twelve Tools' },
  { href: 'https://goodaitools.com', img: 'https://goodaitools.com/assets/images/badge.png', alt: 'Good AI Tools' },
  { href: 'https://www.showmysites.com', img: 'https://www.showmysites.com/static/backlink/blue_border.webp', alt: 'ShowMySites Badge' },
  { href: 'https://dang.ai/', img: 'https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png', alt: 'Dang.ai' },
  { href: 'https://mossai.org', text: 'MossAI Tools', alt: 'MossAI Tools' },
  { href: 'https://www.aiheron.com/', text: 'AiHeron', alt: '智鹭AI导航' },
  { href: 'https://aiai.tools/', text: 'Ai Tools List', alt: 'Ai Tools List' },
  { href: 'https://right-ai.com/', text: 'RightAI Tools Directory', alt: 'RightAI Tools Directory' },
  { href: 'https://aitoolcenter.com/', text: 'AI Tool Center', alt: 'AI Tool Center' },
  { href: 'https://fazier.com', img: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light', alt: 'Fazier badge' },
  { href: 'https://showmebest.ai', img: 'https://showmebest.ai/badge/feature-badge-dark.webp', alt: 'Featured on ShowMeBestAI' },
  { href: 'https://submitaitools.org', img: 'https://submitaitools.org/static_submitaitools/images/submitaitools.png', alt: 'Submit AI Tools' },
  { href: 'https://aiwget.com', img: 'https://aiwget.com/aiwget_badge.png', alt: 'Featured on AIWget' },
  { href: 'https://startupslab.site', img: 'https://cdn.startupslab.site/site-images/badge-light.png', alt: 'Featured on Startups Lab' },
  { href: 'https://milliondothomepage.com', img: 'https://milliondothomepage.com/assets/images/badge.png', alt: 'Million Dot Homepage' },
  { href: 'https://softwarebolt.com', img: 'https://softwarebolt.com/assets/images/badge.png', alt: 'Software Bolt' },
];

export default function Footer({ locale }: FooterProps) {
  const t = translations[locale];

  const handleLanguageChange = (newLocale: Locale) => {
    localStorage.setItem('preferred-locale', newLocale);
    window.location.href = `/${newLocale}`;
  };

  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold gradient-text">Z-Image Free</span>
            </div>
            <p className="text-gray-200 mb-4 max-w-md font-medium">
              {t.description}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t.footerSeoText}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.sitemap}</h4>
            <ul className="space-y-2 text-gray-200 font-medium">
              <li><a href="#gallery" className="hover:text-white transition-colors">{t.gallery}</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">{t.features}</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t.about}</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">{t.faq}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.friendLinks}</h4>
            <ul className="space-y-2 text-gray-200 font-medium">
              <li>
                <a 
                  href="https://nanosora.art" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  NanoSora Art
                </a>
              </li>
              <li>
                <a 
                  href="https://z-img.art" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Z-Img Art
                </a>
              </li>
              <li>
                <a 
                  href="https://videodance.cc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  VideoDance
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-200 font-medium">
              <li>
                <a 
                  href={`/${locale}/privacy`}
                  className="hover:text-white transition-colors"
                >
                  {t.privacy}
                </a>
              </li>
              <li>
                <a 
                  href={`/${locale}/terms`}
                  className="hover:text-white transition-colors"
                >
                  {t.terms}
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@z-img.pics"
                  className="hover:text-white transition-colors"
                >
                  Contact: support@z-img.pics
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          {/* 语言切换区域 */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="text-gray-400 text-sm mr-2">{t.selectLanguage}:</span>
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  l === locale
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {localeFlags[l]} {localeNames[l]}
              </button>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm">{t.footer}</p>

          {/* 徽章滚动轮播 */}
          <div className="mt-8 overflow-hidden">
            <div className="badge-carousel flex items-center gap-6">
              {/* 复制两份徽章以实现无缝滚动 */}
              {[...BADGES, ...BADGES].map((badge, index) => (
                <a
                  key={index}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                  title={badge.alt}
                >
                  {badge.img ? (
                    <img
                      src={badge.img}
                      alt={badge.alt}
                      className="h-[54px] w-auto object-contain"
                    />
                  ) : (
                    <span className="inline-block px-4 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white text-sm font-medium whitespace-nowrap">
                      {badge.text}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .badge-carousel {
          animation: scroll 5s linear infinite;
        }
        .badge-carousel:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  );
}
