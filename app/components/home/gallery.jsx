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
  const { open } = useSidebar();

  return (
    <div
      className={`w-full overflow-hidden py-12 transition-all duration-300 ${open ? 'max-w-[calc(100vw-var(--sidebar-width))]' : ''}`}
    >
      <h2 className="font-oswald mb-6 text-center md:text-left">
        FOLLOW OUR INSTAGRAM
      </h2>
      <div className="grid max-w-full grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`${index === 2 ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2' : ''}`}
          >
            <div className="relative overflow-hidden">
              <Image
                src={image.src || '/placeholder.svg'}
                width={500}
                height={500}
                alt={image.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-opacity duration-300 hover:opacity-80"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
