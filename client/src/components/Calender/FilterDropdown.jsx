import React from "react";
import { MdFilterList, MdArrowDropDown } from "react-icons/md";

const FilterDropdown = ({
  filterOptions,
  activeFilter,
  filterOpen,
  setFilterOpen,
  handleFilterChange,
  clearFilters
}) => (
  <div className="relative">
    <button
      onClick={() => setFilterOpen((v) => !v)}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <MdFilterList className="w-5 h-5 mr-2" />
      {filterOptions.find(option => option.value === activeFilter)?.label || "Filter"}
      <MdArrowDropDown className="w-5 h-5 ml-1" />
    </button>
    {filterOpen && (
      <>
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
          onClick={() => setFilterOpen(false)}
        />
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:translate-y-0 lg:mt-2 p-4 w-auto lg:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 space-y-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filter Events
            </h3>
            <button
              onClick={() => setFilterOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <span className="sr-only">Close</span>×
            </button>
          </div>
          <div className="space-y-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  handleFilterChange(option.value);
                  setFilterOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeFilter === option.value
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
                {activeFilter === option.value && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
          {activeFilter !== "all" && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  clearFilters();
                  setFilterOpen(false);
                }}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </>
    )}
  </div>
);

export default FilterDropdown;