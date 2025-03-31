'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MobileFilterContent({
  showFilter,
  setShowFilter,
  selectedFilters,
  filters,
  handleChange,
  cat,
  router,
  sort,
  sortOptions,
  handleSortChange,
}) {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleClearAll = useCallback(() => {
    // Simply navigate to the base path without any query parameters
    router.push(`/shop/${cat.join('/')}`);
  }, [cat, router]);

  // Function to apply filters and close modal
  const applyFilters = useCallback(() => {
    // Just close the filter modal - all changes are already applied through handleChange
    setShowFilter(false);
  }, [setShowFilter]);

  // Combine filters with sort options for the main menu
  const allOptions = [
    { name: 'sort', label: 'Sort by', value: sort },
    ...filters
      .filter((filter) => {
        // Hide category filter on subcategory pages
        if (filter.name === 'cat' && cat.length > 1) {
          return false;
        }
        return true;
      })
      .map((filter) => ({
        name: filter.name,
        label:
          filter.name === 'cat'
            ? 'Category'
            : filter.name.charAt(0).toUpperCase() + filter.name.slice(1),
        value: selectedFilters[filter.name]?.join(', ') || 'All',
      })),
  ];

  const handleBack = () => {
    if (selectedSection) {
      setSelectedSection(null);
    } else {
      setShowFilter(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 top-14 z-50 transform bg-white transition-transform duration-300 ${
        showFilter ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Header */}
      <div className="bg-grayBg flex h-14 items-center justify-between border-b border-gray-200 px-4">
        {selectedSection && (
          <button
            onClick={handleBack}
            className="flex items-center text-gray-500"
            aria-label={
              selectedSection ? 'Back to filter menu' : 'Close filters'
            }
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <h2 className="text-lg font-medium text-primary/40">
          {selectedSection
            ? allOptions.find((opt) => opt.name === selectedSection)?.label
            : 'Filter Options'}
        </h2>
        {!selectedSection && (
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Main Menu */}
      {!selectedSection ? (
        <div className="divide-y divide-gray-200">
          {allOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => setSelectedSection(option.name)}
              className="flex w-full items-center justify-between px-4 py-4 text-sm"
            >
              <span className="font-medium">{option.label}</span>
              <div className="flex items-center text-gray-500">
                <span className="mr-2 text-sm">{option.value}</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>
          ))}
        </div>
      ) : selectedSection === 'sort' ? (
        // Sort Options Content
        <div className="divide-y divide-gray-200">
          <div className="px-4">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleSortChange(option.value);
                  setSelectedSection(null);
                }}
                className={`block w-full py-4 text-left text-sm ${
                  sort === option.value
                    ? 'font-medium text-primary'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Filter Options Content
        <div className="divide-y divide-gray-200">
          <div className="px-4">
            {filters
              .find((f) => f.name === selectedSection)
              ?.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-sm text-gray-700">{option}</span>
                  <input
                    type={selectedSection === 'price' ? 'radio' : 'checkbox'}
                    name={selectedSection}
                    value={option.toLowerCase()}
                    onChange={(e) => handleChange(e, selectedSection)}
                    checked={selectedFilters[selectedSection]?.includes(
                      option.toLowerCase()
                    )}
                    className="h-5 w-5 rounded border-gray-300 text-primary"
                  />
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Footer - Only show when a section is selected */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <button
          onClick={() => {
            if (selectedSection) {
              setSelectedSection(null);
            } else {
              applyFilters();
              setShowFilter(false);
            }
          }}
          className="w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white"
        >
          {selectedSection ? 'Apply' : 'Done'}
        </button>
      </div>
    </div>
  );
}
