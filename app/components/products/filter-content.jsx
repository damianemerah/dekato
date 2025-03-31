'use client';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export default function FilterContent({
  dropdownRef,
  activeDropdown,
  selectedFilters,
  sort,
  filters,
  handleChange,
  handleSortChange,
  toggleDropdown,
  sortOptions,
  cat,
  router,
  variantOptions,
  searchParams,
}) {
  const handleClearAll = useCallback(() => {
    router.push(`/shop/${cat.join('/')}`);
  }, [cat, router]);

  const handleRemoveFilter = useCallback(
    (key) => {
      const currentParams = new URLSearchParams(
        typeof searchParams === 'object'
          ? Object.entries(searchParams).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : searchParams
      );

      const paramKey = variantOptions.some((opt) => opt.name === key)
        ? `${key}-vr`
        : key;

      currentParams.delete(paramKey);

      currentParams.set('page', '1');

      if (
        Array.from(currentParams.entries()).length === 0 ||
        (Array.from(currentParams.entries()).length === 1 &&
          currentParams.has('page'))
      ) {
        router.push(`/shop/${cat.join('/')}`);
      } else {
        router.push(`/shop/${cat.join('/')}?${currentParams.toString()}`);
      }
    },
    [cat, router, variantOptions, searchParams]
  );

  const filterButtons = useMemo(() => {
    return filters
      .map((filter) => {
        if (filter.name === 'cat' && cat.length > 1) {
          return null;
        }

        return (
          <div
            key={filter.name}
            className={`relative mb-2 sm:mb-0 ${filter.options.length > 0 ? 'block' : 'hidden'}`}
          >
            <button
              onClick={() => toggleDropdown(filter.name)}
              className={`flex items-center gap-2 pr-3 text-[13px] font-bold capitalize ${activeDropdown === filter.name ? 'bg-white' : ''}`}
            >
              {filter.name === 'cat'
                ? 'Category'
                : filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
              {activeDropdown === filter.name ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {activeDropdown === filter.name && (
              <div
                id={`dropdown-${filter.name}`}
                className="absolute left-0 z-10 mt-2 flex max-h-[50vh] w-64 flex-col overflow-y-auto rounded-md bg-white shadow-lg"
              >
                {filter.options.map((option, index) => (
                  <label
                    key={index}
                    className="inline-flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100"
                  >
                    <div className="relative flex items-center">
                      <input
                        type={filter.name === 'price' ? 'radio' : 'checkbox'}
                        name={filter?.name}
                        value={option.toLowerCase()}
                        onChange={(e) => handleChange(e, filter.name)}
                        checked={selectedFilters[filter.name]?.includes(
                          option.toLowerCase()
                        )}
                        className={`peer relative h-5 w-5 cursor-pointer ${
                          filter.name === 'price' ? '' : 'appearance-none'
                        } border border-gray-900 transition-all checked:bg-gray-900`}
                      />
                      <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })
      .filter(Boolean);
  }, [
    activeDropdown,
    filters,
    handleChange,
    selectedFilters,
    toggleDropdown,
    cat,
  ]);

  const sortButton = useMemo(() => {
    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown('sort')}
          className={`flex items-center gap-2 pr-3 text-[13px] font-medium capitalize ${
            activeDropdown === 'sort' ? 'bg-white' : ''
          } hover:bg-white`}
        >
          {sort}
          {activeDropdown === 'sort' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {activeDropdown === 'sort' && (
          <div
            id="dropdown-sort"
            className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`block w-full px-4 py-3 text-left text-sm capitalize ${
                  sort === option.value ? 'bg-gray-100 font-medium' : ''
                } hover:bg-gray-100`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }, [activeDropdown, handleSortChange, sort, sortOptions, toggleDropdown]);

  return (
    <>
      <div
        ref={dropdownRef}
        className="hidden w-full flex-col items-center justify-start bg-gray-100 px-4 py-4 capitalize shadow-md sm:flex sm:h-14 sm:flex-row sm:justify-between sm:px-8 sm:py-0"
      >
        <div className="mb-4 flex w-full flex-wrap items-center justify-start sm:mb-0 sm:w-auto">
          <div className="flex flex-wrap items-center justify-start space-x-2">
            {filterButtons}
          </div>
        </div>

        <div className="flex w-full items-center justify-start sm:w-auto sm:justify-end">
          <p className="mr-2 text-sm text-gray-500">Sort:</p>
          {sortButton}
        </div>
      </div>

      {Object.entries(selectedFilters)?.some(([_, v]) => v.length > 0) && (
        <div className="flex flex-wrap items-center justify-between bg-white px-4 py-2 sm:px-6">
          <div className="flex flex-wrap items-center justify-start gap-2 sm:mb-0">
            {Object.entries(selectedFilters)?.map(([key, value]) =>
              value.length > 0 ? (
                <div
                  key={key}
                  className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-100"
                >
                  <span className="text-xs font-medium">
                    {value.map((item, index) => (
                      <span
                        key={index}
                      >{`${item}${index < value.length - 1 ? ', ' : ''}`}</span>
                    ))}
                  </span>
                  <button
                    onClick={() => handleRemoveFilter(key)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Remove ${key} filter`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null
            )}
          </div>
          {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
            <button
              onClick={handleClearAll}
              className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-700 sm:mt-0"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </>
  );
}
