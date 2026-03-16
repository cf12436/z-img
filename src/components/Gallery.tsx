'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

interface GalleryProps {
  locale: Locale;
}

const excludedImages = [7, 27, 28, 29];

const galleryImages = Array.from({ length: 31 }, (_, i) => i + 2)
  .filter(num => !excludedImages.includes(num))
  .map(num => {
    const paddedNum = num.toString().padStart(3, '0');
    const ext = num >= 30 ? 'png' : 'jpeg';
    return `https://zimg.artkits.store/image_${paddedNum}.${ext}`;
  });

export default function Gallery({ locale }: GalleryProps) {
  const t = translations[locale];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
          <span className="gradient-text">{t.gallery}</span>
        </h2>
        <p className="text-gray-200 text-center mb-12 max-w-2xl mx-auto font-medium">
          {t.heroDesc}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Selected gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
