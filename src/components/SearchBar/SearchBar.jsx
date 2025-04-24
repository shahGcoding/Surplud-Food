import React, { useState } from 'react'
import {Button, Filter, Input} from '../index'

function SearchBar({ posts, setSearchResults, setIsSearching }) {

    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === "") {
            setSearchResults([]);
            setIsSearching(false);
        } else {
            const filteredResults = posts.filter((post) =>
                post.title.toLowerCase().includes(query)
            );
            setSearchResults(filteredResults);
            setIsSearching(true);
        }
    }

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 top-[80px] left-0 w-full shadow-md z-40 mb-4">
  {/* Filter / Sort Dropdown */}
  
  <Filter  />

  {/* Search Input */}
  
              <Input
                type="Search"
                placeholder="Search for food here.."
                value={searchQuery}
                onChange= {handleInputChange}
                
              />

  {/* Search Button */}
  <Button type='search' className='w-2xs bg-green-700 transition-transform hover:bg-green-500 hover:cursor-pointer' onClick= {() => onSearch(searchTerm)}>
    Search
  </Button>
</div>

  )
}

export default SearchBar





// import React from "react";
// import { Button, Filter, Input } from "../index";

// function SearchBar({ filters, setFilters }) {
//   return (
//     <div className="flex items-center gap-2 p-2 bg-gray-100 shadow-md z-40 mb-4 sticky top-[80px] w-full">
      
//       {/* Filter / Sort Dropdown */}
//       <Filter filters={filters} setFilters={setFilters} />

//       {/* Search Input */}
//       <Input
//         type="text"
//         placeholder="Search for food here..."
//         value={filters.searchQuery}
//         onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
//       />

//       {/* Search Button */}
//       <Button type="button" className="w-2xs" onClick={() => setFilters({ ...filters })}>
//         Search
//       </Button>
//     </div>
//   );
// }

// export default SearchBar;
