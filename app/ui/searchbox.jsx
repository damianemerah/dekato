import { useProductStore, useSearchStore } from "@/store/store";
import { use, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { getAllProducts, productSearch } from "../action/productAction";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Debounce hook to delay the search input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Fetcher function for SWR
const fetcher = async (str) => {
  const products = await productSearch({ q: str });
  return products;
};

const SearchBox = () => {
  const activeDropdown = useSearchStore((state) => state.activeDropdown);
  const setActiveDropdown = useSearchStore((state) => state.setActiveDropdown);
  const setSearchString = useSearchStore((state) => state.setSearchString);
  const searchString = useSearchStore((state) => state.searchString);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const debouncedSearch = useDebounce(searchString, 500);
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Fetch data using SWR
  const { data: pSearchList, error } = useSWR(
    debouncedSearch && debouncedSearch.length > 1 ? debouncedSearch : null,
    fetcher,
  );

  useEffect(() => {
    setSearchString(debouncedSearch);
    setActiveDropdown(debouncedSearch ? true : false);
  }, [debouncedSearch, setSearchString, setActiveDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !dropdownRef?.current?.contains(event.target) &&
        !searchRef?.current?.contains(event.target) &&
        !mobileSearchRef?.current?.contains(event.target)
      ) {
        setActiveDropdown(false);
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActiveDropdown]);

  const handleSearchProduct = async (e) => {
    e.preventDefault();
    router.push(`/search?q=${searchString}`);
  };

  const handleMobileSearchClick = () => {
    setShowMobileSearch(true);
    setTimeout(() => {
      mobileSearchRef.current?.focus();
    }, 0);
  };

  return (
    <>
      <div className="relative z-[55] hidden lg:block">
        <form onSubmit={(e) => handleSearchProduct(e)}>
          <input
            ref={searchRef}
            onFocus={() => setActiveDropdown(true)}
            type="text"
            placeholder="Search..."
            className="h-8 w-72 bg-white px-4 py-2 text-primary outline-none placeholder:text-sm"
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={(e) => handleSearchProduct(e)}
          >
            <svg
              className="h-5 w-5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        </form>
        {pSearchList && activeDropdown && (
          <ul
            ref={dropdownRef}
            className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-y-auto bg-white text-primary shadow-sm"
          >
            {pSearchList.map((product) => (
              <li
                key={product.id}
                className="cursor-pointer truncate px-4 py-2 text-sm lowercase opacity-90 hover:bg-grayBg"
              >
                <Link href={`/p/${product.slug}-${product.id}`}>
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lg:hidden">
        <button
          onClick={handleMobileSearchClick}
          className="flex h-8 w-8 items-center justify-center"
        >
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
        </button>
      </div>
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-0 z-[60] !m-0 w-full bg-white py-2 lg:hidden">
          <form onSubmit={(e) => handleSearchProduct(e)} className="w-full">
            <input
              ref={mobileSearchRef}
              onFocus={() => setActiveDropdown(true)}
              type="text"
              placeholder="Search..."
              className="h-10 w-full bg-white px-4 py-2 text-primary outline-none placeholder:text-sm"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 transform"
              onClick={(e) => handleSearchProduct(e)}
            >
              <svg
                className="h-5 w-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            </button>
          </form>
          {pSearchList && activeDropdown && (
            <ul
              ref={dropdownRef}
              className="mt-2 max-h-60 w-full overflow-y-auto bg-white text-primary shadow-sm"
            >
              {pSearchList.map((product) => (
                <li
                  key={product.id}
                  className="cursor-pointer truncate px-4 py-2 text-sm lowercase opacity-90 hover:bg-grayBg"
                >
                  <Link href={`/p/${product.slug}-${product.id}`}>
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBox;
