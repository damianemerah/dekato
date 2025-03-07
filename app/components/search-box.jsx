'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { useSearchStore } from '@/app/store/store';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { productSearch } from '@/app/action/productAction';

// Debounce hook to delay the search input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Fetcher function
const fetcher = async (str) => {
  const { products, categories } = await productSearch({ q: str });
  return { products, categories };
};

export function SearchBox({ className }) {
  const activeDropdown = useSearchStore((state) => state.activeDropdown);
  const setActiveDropdown = useSearchStore((state) => state.setActiveDropdown);
  const setSearchString = useSearchStore((state) => state.setSearchString);
  const searchString = useSearchStore((state) => state.searchString);
  const dropdownRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const router = useRouter();
  const [searchResults, setSearchResults] = React.useState(null);
  const debouncedSearch = useDebounce(searchString || '', 500);

  // Fetch search results
  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch?.length > 2) {
        const results = await fetcher(debouncedSearch);
        setSearchResults(results);
      } else {
        setSearchResults(null);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  React.useEffect(() => {
    setSearchString(debouncedSearch);
    setActiveDropdown(
      debouncedSearch && debouncedSearch.length > 2 ? true : false
    );
  }, [debouncedSearch, setSearchString, setActiveDropdown]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchRef.current?.contains(event.target)
      ) {
        setActiveDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveDropdown]);

  const handleSearchProduct = (e) => {
    e.preventDefault();
    if (searchString) {
      router.push(`/search?q=${searchString}`);
      setActiveDropdown(false);
    }
  };

  return (
    <div className={`relative z-40 ${className}`}>
      <form onSubmit={handleSearchProduct} className="relative">
        <Input
          ref={searchRef}
          type="text"
          placeholder="Search all items and brands"
          className="h-10 w-full bg-white pr-10 text-black"
          value={searchString || ''}
          onChange={(e) => setSearchString(e.target.value)}
          onFocus={() => setActiveDropdown(true)}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full text-black"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {activeDropdown && searchResults && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto bg-white text-black shadow-lg"
        >
          {searchResults.categories?.length > 0 && (
            <div className="border-b border-gray-100 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Categories
              </h3>
              <ul className="space-y-1">
                {searchResults.categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/category/${category.path}`}
                      className="block py-1 text-sm hover:text-gray-900"
                      onClick={() => setActiveDropdown(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchResults.products?.length > 0 && (
            <div className="p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Products
              </h3>
              <ul className="space-y-2">
                {searchResults.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 rounded hover:bg-gray-50"
                  >
                    <div className="h-12 w-12 flex-shrink-0">
                      <Image
                        src={product.image[0] || '/placeholder.svg'}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Link
                      href={`/product/${product.slug}-${product.id}`}
                      className="flex-1 py-2 text-sm hover:text-gray-900"
                      onClick={() => setActiveDropdown(false)}
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!searchResults.categories?.length &&
            !searchResults.products?.length && (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found for "{searchString}"
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
