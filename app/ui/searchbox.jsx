import { useProductStore, useSearchStore } from "@/store/store";
import { use, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { getAllProducts, productSearch } from "../action/productAction";
import { useRouter } from "next/navigation";

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
  const debouncedSearch = useDebounce(searchString, 500);
  const router = useRouter();

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
        !searchRef?.current?.contains(event.target)
      ) {
        setActiveDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActiveDropdown]);

  const handleSearchProduct = async (e) => {
    e.preventDefault();
    router.push(`/search?q=${searchString}`);
  };

  return (
    <div className="relative z-[55] min-w-72">
      <form onSubmit={(e) => handleSearchProduct(e)}>
        <input
          ref={searchRef}
          onFocus={() => setActiveDropdown(true)}
          type="text"
          placeholder="Search..."
          className="h-8 w-full bg-white px-4 py-2 text-black outline-none placeholder:text-sm"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 transform"
          onClick={(e) => handleSearchProduct(e)}
        >
          <svg
            className="h-5 w-5 text-black"
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
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
