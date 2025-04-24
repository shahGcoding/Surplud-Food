import React, { useState } from "react";
import {Select, Input} from "../index";

function Filter() {

    const [filters, setFilters] = useState("All Locations")

    return (
      <div className="w-3xl bg-white shadow-md flex flex-wrap items-center gap-1">

        <Select
                      options={["All Locations", "Lahore", "Karachi", "Islamabad"]}
                      label="filters"
                      placeholder="Select role"
                      className=""
                      onChange={(e) => setFilters(e.target.value)}
                    />

      {/* <select
        className="border p-2 rounded-md"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      >
        <option value="">All Locations</option>
        <option value="lahore">Lahore</option>
        <option value="karachi">Karachi</option>
        <option value="islamabad">Islamabad</option>
      </select> */}
  
        {/* Price Range Filter */}
        {/* <div className="flex items-center gap-2">
          <span>Price:</span>
          <Input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={filters.price}
            onChange={(e) => setFilters({ ...filters, price: e.target.value })}
            className="cursor-pointer"
          />
          <span className="font-semibold">Rs.{filters.price}</span>
        </div> */}
  
        {/* Food Type Filter */}
        <select
          className="border p-2 rounded-md"
          value={filters.foodType}
          onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="bakery">Bakery</option>
        </select>
  
        {/* Quantity Filter */}
        <select
          className="border p-2 rounded-md"
          value={filters.quantity}
          onChange={(e) => setFilters({ ...filters, quantity: e.target.value })}
        >
          <option value="">All Quantities</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="bulk">Bulk</option>
        </select>
  
        {/* Sort Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="">Sort By</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="recent">Recently Added</option>
          <option value="popular">Most Popular</option>
        </select>
  
        {/* Apply Filters Button */}
        {/* <button
          onClick={() => console.log("Filters Applied:", filters)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Apply Filters
        </button> */}
      </div>
    );
  };
  
  export default Filter;




// import React from "react";

// function Filter({ filters, setFilters }) {
//   return (
//     <div className="flex flex-wrap items-center gap-2 bg-white shadow-md p-2 rounded-md">

//       {/* Location Filter */}
//       <select
//         className="border p-2 rounded-md"
//         value={filters.location}
//         onChange={(e) => setFilters({ ...filters, location: e.target.value })}
//       >
//         <option value="">All Locations</option>
//         <option value="Lahore">Lahore</option>
//         <option value="Karachi">Karachi</option>
//         <option value="Islamabad">Islamabad</option>
//       </select>

//       {/* Food Type Filter */}
//       <select
//         className="border p-2 rounded-md"
//         value={filters.foodType}
//         onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
//       >
//         <option value="">All Types</option>
//         <option value="veg">Veg</option>
//         <option value="non-veg">Non-Veg</option>
//         <option value="bakery">Bakery</option>
//       </select>

//       {/* Quantity Filter */}
//       <select
//         className="border p-2 rounded-md"
//         value={filters.quantity}
//         onChange={(e) => setFilters({ ...filters, quantity: e.target.value })}
//       >
//         <option value="">All Quantities</option>
//         <option value="small">Small</option>
//         <option value="medium">Medium</option>
//         <option value="bulk">Bulk</option>
//       </select>

//       {/* Sorting Dropdown */}
//       <select
//         className="border p-2 rounded-md"
//         value={filters.sortBy}
//         onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
//       >
//         <option value="">Sort By</option>
//         <option value="price_low">Price: Low to High</option>
//         <option value="price_high">Price: High to Low</option>
//         <option value="recent">Recently Added</option>
//         <option value="popular">Most Popular</option>
//       </select>

//     </div>
//   );
// }

// export default Filter;

  