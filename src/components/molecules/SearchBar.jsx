import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  size = "md",
  showFilters = false
}) => {
  const [query, setQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const sizes = {
    sm: "text-sm px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3"
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "transition-colors duration-200 placeholder-gray-400",
              showFilters && "pr-12",
              sizes[size]
            )}
          />
          {showFilters && (
            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="Filter" className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
      
      {showFilterMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Filters</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-700">Active campaigns</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-700">Recent activity</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-700">High performing</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;