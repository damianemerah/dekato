'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { productSearch } from '@/app/action/productAction';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './button';

export default function SearchBox({ className, setOpen, open }) {
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState({
    products: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);
  const submitBtnRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // 1) Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 2) Focus input whenever the sheet opens (mobile)
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // 3) Debounced live-search: whenever searchString ≥ 3 chars, fetch results
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchString.trim().length > 2) {
        setIsLoading(true);
        try {
          const results = await productSearch({ q: searchString.trim() });
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // If input is < 3 chars, clear results
        setSearchResults({ products: [], categories: [] });
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchString]);

  // 4) Handle “Enter” (submit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchString.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchString.trim())}`);
      setShowResults(false);
    }
    if (open) setOpen(false);
  };

  const triggerSubmit = () => {
    if (submitBtnRef.current) {
      submitBtnRef.current.click();
    }
  };

  return (
    <div
      className={`relative w-full font-roboto md:static ${className}`}
      ref={searchRef}
    >
      {open && (
        <p className="mb-3 text-center text-xl">
          What are you looking for today?
        </p>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          ref={inputRef}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <button
          type="submit"
          className="z-15 absolute inset-y-0 left-0 flex items-center pl-3"
          ref={submitBtnRef}
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
      </form>

      {showResults && (
        <div className="absolute left-0 right-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Scrollable area */}
          <div className="relative max-h-[82vh] overflow-y-auto p-2 pb-16">
            {searchResults.categories.length > 0 && (
              <div className="mb-4 border-b pb-2">
                <h3 className="px-2 text-xs font-semibold uppercase text-primary">
                  Categories
                </h3>
                <ul>
                  {searchResults.categories.slice(0, 6).map((category) => {
                    const displayName = category.parent
                      ? `${category.parent.name} / ${category.name}`
                      : category.name;
                    const urlPath = category.path || category.slug;
                    return (
                      <li key={category.id}>
                        <Link
                          href={`/shop/${urlPath}`}
                          className="block px-4 py-2 text-primary hover:bg-secondary"
                          onClick={() => {
                            setShowResults(false);
                            open && setOpen(false);
                          }}
                        >
                          {displayName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {searchResults.products.length > 0 && (
              <div>
                <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-primary">
                  Products
                </h3>
                <ul className="space-y-2 md:flex md:gap-4 md:space-y-0 md:overflow-x-auto">
                  {searchResults.products.slice(0, 12).map((product) => (
                    <li
                      key={product.id}
                      className="w-full flex-shrink-0 md:w-48"
                    >
                      <Link
                        href={`/product/${product.slug}-${product.id}`}
                        className="flex items-center gap-3 rounded-md border p-2 text-primary transition hover:shadow md:flex-col md:items-start"
                        onClick={() => {
                          open && setOpen(false);
                          setShowResults(false);
                        }}
                      >
                        {product.image?.[0] && (
                          <div className="h-16 w-16 flex-shrink-0 md:h-48 md:w-full">
                            <Image
                              src={product.image[0] || '/placeholder.svg'}
                              alt={product.name}
                              width={192}
                              height={192}
                              className="h-full w-full rounded-md object-cover"
                            />
                          </div>
                        )}
                        <span className="line-clamp-2 text-sm font-medium">
                          {product.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Sticky footer: always rendered at the bottom of the dropdown */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between space-x-2 border-t bg-white px-4 py-2">
            <span className="text-sm text-gray-600">
              Viewing {searchResults.products.length} of{' '}
              {searchResults.totalCount} results
            </span>

            <div className="flex gap-2">
              {/* Only show “Show all” if there truly are more results than we've listed */}
              {searchResults.totalCount > searchResults.products.length && (
                <button
                  type="button"
                  onClick={triggerSubmit}
                  className="text-sm font-medium text-blue-500 hover:underline"
                >
                  Show all results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
