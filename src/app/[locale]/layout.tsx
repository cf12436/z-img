import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { locales, localeNames, Locale } from '@/i18n/locales';

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const isValidLocale = locales.includes(locale);
  const currentLocale = isValidLocale ? locale : 'en';
  const langName = localeNames[currentLocale] || 'English';
  
  return {
    title: `Z-Image Free - AI Image Generator | ${langName}`,
    description: "Generate stunning AI images for free with Z-Image. No registration, no login required. Powered by advanced 6B parameter model. z image, z-image, z image free, z-image free, no login z image, free zimage",
    keywords: "z image, z-image, z image free, z-image free, no login z image, free zimage, AI image generator, free AI art, text to image",
    authors: [{ name: "Z-Image Team" }],
    metadataBase: new URL('https://z-img.pics'),
    alternates: {
      canonical: `/${currentLocale}`,
      languages: Object.fromEntries(
        locales.map(l => [l, `/${l}`])
      ),
    },
    openGraph: {
      title: "Z-Image Free - AI Image Generator",
      description: "Generate stunning AI images for free. No login required.",
      type: "website",
      locale: currentLocale,
      url: `https://z-img.pics/${currentLocale}`,
      images: [
        {
          url: "https://zimg.artkits.store/image_015.jpeg",
          width: 1200,
          height: 630,
          alt: "Z-Image Free Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Z-Image Free - AI Image Generator",
      description: "Generate stunning AI images for free. No login required.",
      images: ["https://zimg.artkits.store/image_015.jpeg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const isValidLocale = locales.includes(locale);
  const htmlLang = isValidLocale ? locale : 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={htmlLang} dir={dir}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="alternate" hrefLang="x-default" href="https://z-img.pics/en" />
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5068809502204851"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6HNGXD7SEH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6HNGXD7SEH');
          `}
        </Script>
      </body>
    </html>
  );
}
