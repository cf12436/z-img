import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Z-Image Free - AI Image Generator | No Login Required",
  description: "Generate stunning AI images for free with Z-Image. No registration, no login required. Powered by advanced 6B parameter model. z image, z-image, z image free, z-image free, no login z image, free zimage",
  keywords: "z image, z-image, z image free, z-image free, no login z image, free zimage, AI image generator, free AI art, text to image",
  authors: [{ name: "Z-Image Team" }],
  metadataBase: new URL('https://z-img.pics'),
  alternates: {
    canonical: '/en',
  },
  openGraph: {
    title: "Z-Image Free - AI Image Generator",
    description: "Generate stunning AI images for free. No login required.",
    type: "website",
    locale: "en_US",
    url: 'https://z-img.pics/en',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
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
