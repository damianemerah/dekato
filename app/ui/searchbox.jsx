import { useSearchStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { productSearch } from "../action/productAction";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

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
  const { products, categories } = await productSearch({ q: str });
  return { products, categories };
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

  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
    setSearchString("");
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
            <SearchOutlined className="h-6 w-6 !text-primary" />
          </button>
        </form>
        {pSearchList?.products && activeDropdown && (
          <ul
            ref={dropdownRef}
            className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-y-auto bg-white text-primary shadow-sm"
          >
            {pSearchList?.products.map((product) => (
              <li
                key={product.id}
                className="cursor-pointer truncate px-4 py-2 text-sm lowercase opacity-90 hover:bg-gray-200"
              >
                <Link
                  href={`/p/${product.slug}-${product.id}`}
                  className="text-primary hover:text-gray-900"
                >
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
          className="flex h-8 w-8 items-center justify-center bg-gray-800"
        >
          <SearchOutlined className="h-6 w-6 !text-primary" />
        </button>
      </div>
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-16 z-[60] !m-0 w-full bg-white py-2 lg:hidden">
          <form
            onSubmit={(e) => handleSearchProduct(e)}
            className="relative w-full"
          >
            <SearchOutlined className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform !text-gray-800" />
            <input
              ref={mobileSearchRef}
              onFocus={() => setActiveDropdown(true)}
              type="text"
              placeholder="Search..."
              className="h-10 w-full bg-white px-12 py-2 text-gray-800 outline-none placeholder:text-gray-600"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform"
              onClick={handleCloseMobileSearch}
            >
              <CloseOutlined className="h-5 w-5 !text-gray-800" />
            </button>
          </form>
          {pSearchList?.products && activeDropdown && (
            <ul
              ref={dropdownRef}
              className="mt-2 max-h-60 w-full overflow-y-auto bg-white text-gray-800 shadow-sm"
            >
              {pSearchList?.products.map((product) => (
                <li
                  key={product.id}
                  className="cursor-pointer truncate px-4 py-2 text-sm lowercase opacity-90 hover:bg-gray-200"
                >
                  <Link
                    href={`/p/${product.slug}-${product.id}`}
                    className="text-gray-800 hover:text-gray-900"
                  >
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
