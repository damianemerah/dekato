import React from "react";
import { createSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FilterContent({
  dropdownRef,
  activeDropdown,
  selectedFilters,
  setSelectedFilters,
  sort,
  filters,
  handleChange,
  handleSortChange,
  toggleDropdown,
  sortOptions,
  cat,
  router,
  variantOptions,
}) {
  return (
    <div className="bg-gray-50">
      <div
        ref={dropdownRef}
        className="flex w-full flex-col items-center justify-between bg-gray-100 px-4 py-4 capitalize shadow-md sm:h-14 sm:flex-row sm:px-8 sm:py-0"
      >
        <div className="mb-4 flex w-full flex-wrap items-center justify-start sm:mb-0 sm:w-auto">
          <div className="flex flex-wrap items-center justify-start space-x-2">
            {filters.map((filter) => (
              <div
                key={filter.name}
                className={`relative mb-2 sm:mb-0 ${filter.options.length > 0 ? "block" : "hidden"}`}
              >
                <button
                  onClick={() => toggleDropdown(filter.name)}
                  className={`flex items-center gap-2 px-3 py-1 text-[13px] font-medium capitalize ${activeDropdown === filter.name ? "bg-white" : ""}`}
                >
                  {filter.name === "cat"
                    ? "Category"
                    : filter.name.charAt(0).toUpperCase() +
                      filter.name.slice(1)}
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
                            type={
                              filter.name === "price" ? "radio" : "checkbox"
                            }
                            name={filter?.name}
                            value={option.toLowerCase()}
                            onChange={(e) => {
                              handleChange(e, filter.name);
                            }}
                            checked={selectedFilters[filter.name]?.includes(
                              option.toLowerCase(),
                            )}
                            className={`peer relative h-5 w-5 cursor-pointer ${
                              filter.name === "price" ? "" : "appearance-none"
                            } border border-gray-900 transition-all checked:bg-gray-900`}
                          />
                          <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-end sm:w-auto">
          <p className="mr-2 text-sm text-gray-500">Sort:</p>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center gap-2 px-3 py-1 text-[13px] font-medium capitalize ${
                activeDropdown === "sort" ? "bg-white" : ""
              } hover:bg-white`}
            >
              {sort}
              {activeDropdown === "sort" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {activeDropdown === "sort" && (
              <div
                id="dropdown-sort"
                className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full px-4 py-3 text-left text-sm capitalize ${
                      sort === option.value ? "bg-gray-100 font-medium" : ""
                    } hover:bg-gray-100`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFilters && (
        <div className="mt-4 flex flex-wrap items-center justify-between px-4 sm:px-6">
          <div className="mb-2 flex flex-wrap items-center justify-start gap-2 sm:mb-0">
            {Object.entries(selectedFilters)?.map(([key, value]) =>
              value.length > 0 ? (
                <div
                  key={key}
                  className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-100"
                >
                  <span className="text-xs font-medium">
                    {value.map((item, index) => (
                      <span key={index}>
                        {`${item}${index < value.length - 1 ? ", " : ""}`}
                      </span>
                    ))}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFilters((prev) => {
                        const newFilters = {
                          ...prev,
                          [key]: [],
                        };

                        // Apply filters immediately when removing
                        const queryObj = Object.fromEntries(
                          Object.entries(newFilters).filter(
                            ([key, value]) =>
                              value.length > 0 &&
                              value.every((v) => v.length > 0) &&
                              key in newFilters,
                          ),
                        );

                        if (Object.keys(queryObj).length === 0) {
                          router.push(`/${cat}`);
                          return newFilters;
                        }

                        // Handle variant filters
                        for (const [key, value] of Object.entries(queryObj)) {
                          if (variantOptions.some((opt) => opt.name === key)) {
                            queryObj[key + "-vr"] = value;
                            delete queryObj[key];
                          }
                        }

                        const searchParams = createSearchParams(queryObj);
                        router.push(`/${cat}?${searchParams}`);

                        return newFilters;
                      });
                    }}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Remove ${key} filter`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : null,
            )}
          </div>
          {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
            <button
              onClick={() => {
                setSelectedFilters((prev) => {
                  // Reset all filters to empty arrays
                  const newFilters = Object.keys(prev).reduce(
                    (acc, key) => ({
                      ...acc,
                      [key]: [],
                    }),
                    {},
                  );

                  // Clear URL and redirect to base category path
                  router.push(`/${cat}`);

                  return newFilters;
                });
              }}
              className="flex items-center gap-1 rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-300"
            >
              Clear All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
