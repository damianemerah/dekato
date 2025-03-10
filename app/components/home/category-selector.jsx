'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function CategorySelector({ initialCategory = 'women' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const router = useRouter();
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Initialize scroll position tracking
    const container = document.getElementById('category-container');
    if (container) {
      container.addEventListener('scroll', () => {
        setScrollPosition(container.scrollLeft);
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', () => {});
      }
    };
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Set cookie for server components
    Cookies.set('selected-category', category, { expires: 30 });

    // Refresh the page to update server components
    router.refresh();
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('category-container');
    if (!container) return;

    const scrollAmount = 300;

    if (direction === 'left') {
      container.scrollTo({
        left: Math.max(0, scrollPosition - scrollAmount),
        behavior: 'smooth',
      });
    } else {
      container.scrollTo({
        left: scrollPosition + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-4 mt-4 flex flex-wrap gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
      <p className="text-grayText whitespace-nowrap text-sm font-bold tracking-wide">
        Filter by:
      </p>
      <ul className="flex gap-4">
        {['women', 'men'].map((category) => (
          <li
            key={category}
            className={`${
              selectedCategory === category ? 'border-b-2 border-primary' : ''
            } cursor-pointer text-base font-bold uppercase tracking-wide`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        ))}
      </ul>

      {/* Scroll controls for mobile/tablet */}
      <div className="ml-auto hidden sm:flex sm:gap-2 lg:hidden">
        <button
          onClick={() => handleScroll('left')}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          aria-label="Scroll left"
        >
          ←
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>
    </div>
  );
}
