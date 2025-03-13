'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSidebar } from '@/app/components/ui/sidebar';

const galleryImages = [
  { src: '/assets/image5.webp', alt: 'Fashion model in urban setting' },
  { src: '/assets/image5.webp', alt: 'Close-up of stylish accessories' },
  {
    src: '/assets/image5.webp',
    alt: 'Group shot of models in latest collection',
  },
  {
    src: '/assets/image5.webp',
    alt: 'Behind the scenes at fashion photoshoot',
  },
  {
    src: '/assets/image5.webp',
    alt: 'Runway model showcasing designer outfit',
  },
  {
    src: '/assets/image5.webp',
    alt: 'Streetwear fashion in city environment',
  },
  { src: '/assets/image5.webp', alt: 'Detail shot of haute couture dress' },
];

export default function Gallery() {
  const { open, isMobile } = useSidebar();
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="py-12">
      <h2 className="mb-6 text-center font-oswald md:text-left">
        FOLLOW OUR INSTAGRAM
      </h2>
      <div
        className={`grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3 ${open && !isMobile ? 'max-w-full' : ''}`}
      >
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`${index === 2 ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2' : ''} cursor-pointer`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src || '/placeholder.svg'}
              width={500}
              height={500}
              alt={image.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-opacity duration-300 hover:opacity-80"
            />
          </div>
        ))}
      </div>

      {/* Modal for image preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={selectedImage.src || '/placeholder.svg'}
              width={1200}
              height={800}
              alt={selectedImage.alt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-black"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close image preview"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
