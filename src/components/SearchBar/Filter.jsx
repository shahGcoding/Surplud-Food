import React, { useState } from "react";
import { FiFilter } from "react-icons/fi";

function Filter({ filters, setFilters }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Reset Filters to default
  const resetFilters = () => {
    setFilters({
      location: "",
      price: 0,
      quantity: ""
    });
  };

  return (
    <div className="relative inline-block text-left">
      {/* Filter Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-green-700 hover:text-white transition-all"
      >
        <FiFilter className="mr-2" />
        Filters
      </button>

      {/* Dropdown Panel */}
      {showDropdown && (
        <div className="absolute z-20 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Location</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="">All Locations</option>
              <option value="lahore">Lahore</option>
              <option value="karachi">Karachi</option>
              <option value="islamabad">Islamabad</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Price Range (Rs.)</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={filters.price}
              onChange={(e) =>
                setFilters({ ...filters, price: (e.target.value) })
              }
              className="w-full accent-green-600"
            />
            <div className="text-sm text-gray-600 text-right">
              {filters.price > 0 ? `Rs. ${filters.price}` : "Any Price"}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Quantity</label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={filters.quantity}
                onChange={(e) => setFilters({...filters, quantity: parseInt(e.target.value) })}
                 className="w-full accent-green-600"
              />
              <div className="text-sm text-gray-600 text-right">
                {filters.quantity > 0 ? `${filters.quantity} kg` : "Any Quantity"}
              </div>
              
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-2">
            <button
              onClick={resetFilters}
              className="w-1/2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
            >
              Reset
            </button>
            <button
              onClick={() => setShowDropdown(false)}
              className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
