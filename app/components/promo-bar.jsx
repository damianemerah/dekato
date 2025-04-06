'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { formatToNaira } from '@/app/utils/getFunc'; // Ensure this path is correct
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel'; // Assuming shadcn/ui setup

const PromoBar = () => {
  const pathname = usePathname();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // Define promos directly in the component or import from a constants file
  const promos = [
    {
      id: 'promo-1', // Add unique key for React list rendering
      text: <p>Free shipping on all orders over {formatToNaira(150000)}</p>,
    },
    {
      id: 'promo-2',
      text: <p>20% Student Discount with valid ID</p>,
    },
    {
      id: 'promo-3',
      text: <p>Up to 50% off selected items</p>,
    },
  ];

  // Conditionally render the entire bar based on pathname
  if (pathname.includes('/admin') || pathname.includes('/account')) {
    return null;
  }

  return (
    <div
      className={`font-oswald ${pathname.startsWith('/product/') ? 'sticky top-0 z-[20]' : ''}`}
    >
      {/* Use Carousel for all screen sizes */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full bg-secondary text-secondary-foreground"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: 'start',
          loop: true, // Enable looping
        }}
      >
        <CarouselContent>
          {promos.map(({ id, text }) => (
            <CarouselItem key={id}>
              {/* Centered content within each slide */}
              <div className="flex h-8 items-center justify-center px-12 text-center text-xs tracking-wider">
                <span className="truncate">{text}</span>
                {/* Added truncate for smaller screens */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Basic Styling for Arrows - Customize further as needed */}
        <CarouselPrevious
          className="left-2 text-primary hover:cursor-pointer sm:left-4"
          variant="ghost"
        />
        <CarouselNext
          className="right-2 text-primary hover:cursor-pointer sm:right-4"
          variant="ghost"
        />
      </Carousel>

      {/* Conditional Navigation Links */}
      {pathname === '/' && (
        <nav>
          <ul className="flex items-center justify-center gap-8 border-t border-t-primary/10 px-8 py-2.5 font-oswald text-sm font-semibold uppercase sm:hidden">
            <li>
              <Link href="/shop/men">Shop men</Link>
            </li>
            <li>
              <Link href="/shop/women">Shop women</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default PromoBar;
