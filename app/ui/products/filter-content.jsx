import React from "react";

export default function FilterContent({
  dropdownRef,
  activeDropdown,
  selectedFilters,
  setSelectedFilters,
  sort,
  filters,
  filterStatus,
  setFilterStatus,
  handleFilter,
  handleChange,
  handleSortChange,
  toggleDropdown,
  sortOptions,
}) {
  return (
    <>
      <div
        ref={dropdownRef}
        className="sticky top-16 z-10 flex h-14 w-full items-center justify-between bg-gray-100 px-8 capitalize shadow-md"
      >
        <div className="flex items-center">
          <p className="text-nowrap text-[13px]">Filter by:</p>
          <div className="ml-4 flex items-center justify-start space-x-2">
            {filters.map((filter) => (
              <div
                key={filter.name}
                className={`relative ${filter.options.length > 0 ? "block" : "hidden"}`}
              >
                <button
                  onClick={() => toggleDropdown(filter.name)}
                  className={`flex items-center gap-2 px-3 py-1 text-[13px] font-medium capitalize ${activeDropdown === filter.name ? "bg-white" : ""}`}
                >
                  {filter.name === "cat"
                    ? "Category"
                    : filter.name.charAt(0).toUpperCase() +
                      filter.name.slice(1)}
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="h-0.5 w-2 bg-primary transition-transform duration-300" />
                    <span
                      className={`absolute h-0.5 w-2 bg-primary transition-transform duration-300 ${activeDropdown === filter.name ? "rotate-0" : "rotate-90"}`}
                    />
                  </span>
                </button>

                {activeDropdown === filter.name && (
                  <div className="absolute left-0 flex max-h-[50vh] w-max min-w-20 flex-col overflow-auto bg-white text-[#303030]">
                    {filter.options.map((option, index) => (
                      <label
                        key={index}
                        className="inline-flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100"
                      >
                        <div className="relative flex items-center">
                          <input
                            type={
                              filter.name === "price" ? "radio" : "checkbox"
                            }
                            name={filter?.name}
                            value={option.toLowerCase()}
                            onChange={(e) => handleChange(e, filter.name)}
                            checked={selectedFilters[filter.name]?.includes(
                              option.toLowerCase(),
                            )}
                            className={`peer relative h-5 w-5 cursor-pointer ${filter.name === "price" ? "" : "appearance-none"} border border-gray-900 transition-all checked:bg-gray-900`}
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
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-[13px]">Sort:</p>
          <div className="relative ml-4">
            <button
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center gap-2 px-3 py-1 text-[13px] font-medium capitalize ${
                activeDropdown === "sort" ? "bg-white" : ""
              } hover:bg-white`}
            >
              {sort}
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="h-0.5 w-2 bg-primary transition-transform duration-300" />
                <span
                  className={`absolute h-0.5 w-2 bg-primary transition-transform duration-300 ${
                    activeDropdown === "sort" ? "rotate-0" : "rotate-90"
                  }`}
                />
              </span>
            </button>

            {activeDropdown === "sort" && (
              <div className="absolute right-0 w-max bg-white">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full px-4 py-2 text-left text-[13px] capitalize ${
                      sort === option.value ? "font-medium" : ""
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
        <div className="mt-6 flex items-center px-6">
          <div className="ml-4 flex items-center justify-start space-x-3">
            {Object.entries(selectedFilters)?.map(([key, value]) =>
              value.length > 0 ? (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-3xl hover:bg-gray-100"
                >
                  <span className="flex items-center rounded-3xl border p-2 text-[13px] font-medium">
                    {value.map((item, index) => (
                      <span key={index}>
                        {`${item}${index < value.length - 1 ? ",\u00A0" : ""}`}
                      </span>
                    ))}

                    <button
                      onClick={() => {
                        setFilterStatus("active");
                        setSelectedFilters((prev) => ({
                          ...prev,
                          [key]: [],
                        }));
                        setFilterStatus("active");
                      }}
                      className="ml-2 text-[13px] font-medium text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#303030"
                      >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>
                    </button>
                  </span>
                </div>
              ) : null,
            )}
          </div>

          {filterStatus === "active" && (
            <button
              onClick={handleFilter}
              className="hdfxmen-cloth9.over:bg-primary-dark ml-3 bg-primary px-4 py-1.5 text-white"
            >
              Apply Filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
