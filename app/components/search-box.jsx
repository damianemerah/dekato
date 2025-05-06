'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { productSearch } from '@/app/action/productAction';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchBox({ className }) {
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState({
    products: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchString.trim().length > 2) {
        setIsLoading(true);
        try {
          const results = await productSearch({ q: searchString });
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults({ products: [], categories: [] });
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchString]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchString.trim()) {
      // Navigate to the search page with the query
      router.push(`/search?q=${encodeURIComponent(searchString.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
      </form>

      {showResults &&
        (searchResults.products.length > 0 ||
          searchResults.categories.length > 0) && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {searchResults.categories.length > 0 && (
              <div className="border-b p-2">
                <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-primary">
                  Categories
                </h3>
                <ul>
                  {searchResults.categories.map((category) => {
                    // Format the category path for display
                    const displayName = category.parent
                      ? `${category.parent.name} / ${category.name}`
                      : category.name;

                    // Format the URL path correctly
                    const urlPath = category.path || category.slug;

                    return (
                      <li key={category.id || category._id}>
                        <Link
                          href={`/shop/${urlPath}`}
                          className="block px-4 py-2 text-primary hover:bg-secondary"
                          onClick={() => setShowResults(false)}
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
              <div className="p-2">
                <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-primary">
                  Products
                </h3>
                <ul>
                  {searchResults.products.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}-${product.id}`}
                        className="flex items-center px-4 py-2 text-primary hover:bg-secondary"
                        onClick={() => setShowResults(false)}
                      >
                        {product.image && product.image[0] && (
                          <div className="mr-3 h-10 w-10 flex-shrink-0">
                            <Image
                              src={product.image[0] || '/placeholder.svg'}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full rounded-md object-cover"
                            />
                          </div>
                        )}
                        <span>{product.name}</span>
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
        )}
    </div>
  );
}
