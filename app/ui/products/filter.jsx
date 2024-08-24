"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { set } from "lodash";

export default function Filter() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    color: [],
    size: [],
    style: [],
    category: [],
  });
  const [sort, setSort] = useState("relevance");

  const router = useRouter();
  const dropdownRef = useRef(null);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleChange = (e, name) => {
    const { value, checked } = e.target;
    setSelectedFilters((prev) => {
      const updatedFilter = checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value);

      return {
        ...prev,
        [name]: updatedFilter,
      };
    });
  };

  const handleSortChange = (value) => {
    setSort(value);
    toggleDropdown("sort");
  };

  const pushFiltersToRouter = () => {
    const query = {};

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key].length) {
        query[key] = selectedFilters[key].join(",");
      }
    });

    router.push({
      pathname: "/men",
      query,
    });
  };

  useEffect(() => {
    pushFiltersToRouter();
    console.log(selectedFilters);
  }, [selectedFilters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filters = [
    {
      name: "price",
      options: [
        "₦0 - ₦10000",
        "₦10000 - ₦30000",
        "₦30000 - ₦100000",
        "₦100000 - Above",
      ],
    },
    { name: "color", options: ["Red", "Blue", "Green", "Black", "White"] },
    { name: "size", options: ["Small", "Medium", "Large", "X-Large"] },
    { name: "style", options: ["Casual", "Formal", "Sport", "Ethnic"] },
    { name: "category", options: ["Shirts", "Pants", "Shoes", "Accessories"] },
  ];

  return (
    <div
      ref={dropdownRef}
      className="sticky top-[108px] z-10 flex h-14 w-full items-center justify-between bg-gray-100 px-8 shadow-md"
    >
      <div className="flex items-center">
        <p className="text-sm">Filter by:</p>
        <div className="ml-4 flex items-center justify-start space-x-5">
          {filters.map((filter) => (
            <div key={filter.name} className="relative">
              <button
                onClick={() => toggleDropdown(filter.name)}
                className={`flex items-center gap-2 px-3 py-1 text-sm font-medium ${activeDropdown === filter.name ? "bg-white" : ""} hover:bg-white`}
              >
                {filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="h-0.5 w-2 bg-black transition-transform duration-300" />
                  <span
                    className={`absolute h-0.5 w-2 bg-black transition-transform duration-300 ${activeDropdown === filter.name ? "rotate-0" : "rotate-90"}`}
                  />
                </span>
              </button>

              {activeDropdown === filter.name && (
                <div className="absolute left-0 flex w-max flex-col bg-white text-[#303030]">
                  {filter.options.map((option, index) => (
                    <label
                      key={index}
                      className="inline-flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          value={option.toLowerCase().replace(/ /g, "-")}
                          onChange={(e) => handleChange(e, filter.name)}
                          checked={selectedFilters[filter.name].includes(
                            option.toLowerCase().replace(/ /g, "-"),
                          )}
                          className="peer relative h-5 w-5 cursor-pointer appearance-none border border-gray-900 transition-all checked:bg-gray-900"
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
        <p className="text-sm">Sort:</p>
        <div className="relative ml-4">
          <button
            onClick={() => toggleDropdown("sort")}
            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium ${
              activeDropdown === "sort" ? "bg-white" : ""
            } hover:bg-white`}
          >
            {sort}
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="h-0.5 w-2 bg-black transition-transform duration-300" />
              <span
                className={`absolute h-0.5 w-2 bg-black transition-transform duration-300 ${
                  activeDropdown === "sort" ? "rotate-0" : "rotate-90"
                }`}
              />
            </span>
          </button>

          {activeDropdown === "sort" && (
            <div className="absolute right-0 w-max bg-white">
              <button
                onClick={() => handleSortChange("relevance")}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  sort === "relevance" ? "font-medium" : ""
                } hover:bg-gray-100`}
              >
                Relevance
              </button>
              <button
                onClick={() => handleSortChange("price-low-high")}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  sort === "price-low-high" ? "font-medium" : ""
                } hover:bg-gray-100`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => handleSortChange("price-high-low")}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  sort === "price-high-low" ? "font-medium" : ""
                } hover:bg-gray-100`}
              >
                Price: High to Low
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
