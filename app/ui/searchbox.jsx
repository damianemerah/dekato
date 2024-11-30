import { useSearchStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { productSearch } from "../action/productAction";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";

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

const SearchBox = ({ className }) => {
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
    debouncedSearch?.length > 2 ? debouncedSearch : null,
    fetcher,
  );

  useEffect(() => {
    setSearchString(debouncedSearch);
    setActiveDropdown(debouncedSearch ? true : false);
  }, [debouncedSearch, setSearchString, setActiveDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on the input itself
      const isClickOnInput =
        searchRef?.current?.contains(event.target) ||
        mobileSearchRef?.current?.contains(event.target);

      // Only close if click is outside both dropdown and inputs
      if (!dropdownRef?.current?.contains(event.target) && !isClickOnInput) {
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
      <div className={`relative z-[32] mx-auto hidden lg:block ${className} `}>
        <form onSubmit={(e) => handleSearchProduct(e)}>
          <input
            ref={searchRef}
            onFocus={() => setActiveDropdown(true)}
            type="text"
            placeholder="Search..."
            className="h-8 w-44 bg-white px-4 py-2 text-primary outline-none placeholder:text-sm"
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={(e) => handleSearchProduct(e)}
          >
            <SearchOutlined className="!text-primary" />
          </button>
        </form>
        {(pSearchList?.categories || pSearchList?.products) &&
          activeDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 z-40 mt-2 max-h-96 overflow-y-auto bg-white text-primary shadow-sm"
            >
              {pSearchList?.categories?.length > 0 && (
                <div className="border-b border-gray-100 px-4 py-2">
                  <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                    Categories
                  </h3>
                  <ul>
                    {pSearchList.categories.map((category) => (
                      <li key={category._id} className="mb-1">
                        <Link
                          href={`/category/${category.slug}`}
                          className="block py-1 text-sm text-primary hover:text-gray-900"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pSearchList?.products?.length > 0 && (
                <div className="px-4 py-2">
                  <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                    Products
                  </h3>
                  <ul>
                    {pSearchList.products.map((product) => (
                      <li
                        key={product.id}
                        className="mb-2 flex items-center gap-3 hover:bg-gray-50"
                      >
                        <div className="h-12 w-12 flex-shrink-0">
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Link
                          href={`/p/${product.slug}-${product.id}`}
                          className="flex-1 py-2 text-sm text-primary hover:text-gray-900"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
      </div>
      <div className="lg:hidden">
        <button onClick={handleMobileSearchClick}>
          <SearchOutlined className="!text-white" />
        </button>
      </div>
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-16 z-[32] !m-0 w-full bg-white py-2 lg:hidden">
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
              <CloseOutlined className="text-lg !text-primary" />
            </button>
          </form>
          {(pSearchList?.categories || pSearchList?.products) &&
            activeDropdown && (
              <div
                ref={dropdownRef}
                className="mt-2 max-h-96 w-full overflow-y-auto bg-white text-gray-800 shadow-sm"
              >
                {pSearchList?.categories?.length > 0 && (
                  <div className="border-b border-gray-100 px-4 py-2">
                    <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                      Categories
                    </h3>
                    <ul>
                      {pSearchList.categories.map((category) => (
                        <li key={category._id} className="mb-1">
                          <Link
                            href={`/category/${category.slug}`}
                            className="block py-1 text-sm text-gray-800 hover:text-gray-900"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pSearchList?.products?.length > 0 && (
                  <div className="px-4 py-2">
                    <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                      Products
                    </h3>
                    <ul>
                      {pSearchList.products.map((product) => (
                        <li
                          key={product.id}
                          className="mb-2 flex items-center gap-3 hover:bg-gray-50"
                        >
                          <div className="h-12 w-12 flex-shrink-0">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Link
                            href={`/p/${product.slug}-${product.id}`}
                            className="flex-1 py-2 text-sm text-gray-800 hover:text-gray-900"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default SearchBox;
