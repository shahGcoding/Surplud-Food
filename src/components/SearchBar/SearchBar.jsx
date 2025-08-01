import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";  
import { Input } from "../index";

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
  };

  return (
    <div className="relative w-52 max-w-sm">
      <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
      <Input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;

