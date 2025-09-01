import React, { useEffect, useState } from "react";
import { getAllFoodPosts, getFilteredFoodPosts } from "../config/config";
import { useSelector } from "react-redux";
import {
  Container,
  PostCard,
  SearchBar,
  Filter,
  Testimonial,
} from "../components";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    price: 0,
    quantity: "",
  });

  const authStatus = useSelector((state) => state.auth.status);

  // Load all posts
  useEffect(() => {
    getAllFoodPosts().then((posts) => {
      if (posts) {
        setPosts(posts);
      }
    });
  }, []);

  // Apply filters
  useEffect(() => {
    const loadPosts = async () => {
      try {
        if (
          filters.location ||
          filters.quantity ||
          (filters.price > 0)
        ) {
          setIsFiltered(true);
          const response = await getFilteredFoodPosts(filters);
          setPosts(response);
        } else {
          setIsFiltered(false);
          const allPosts = await getAllFoodPosts();
          setPosts(allPosts);
        }
      } catch (error) {
        console.error("Error loading filtered posts:", error);
      }
    };

    loadPosts();
  }, [filters]);

  return (
    <div className="w-full py-0.5 px-2 sm:px-6 lg:px-0">
    
      {/* Hero Section */}
      <div className="relative w-full mb-4 h-[720px]">
        <img
          src="/public/hero.jpg"
          alt="Food"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to Surplus Food
          </h1>
          <p className="mb-4 text-sm md:text-base max-w-md">
            Save food, feed people, and fight waste. Browse our surplus meals now!
          </p>
          {!authStatus && (
            <Link to={"/signup"} className="inline-block">
              <button className="bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white px-4 py-2 rounded-md transition duration-300">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-start gap-4 ml-10 mt-4">
        <SearchBar
          posts={posts}
          setSearchResults={setSearchResults}
          setIsSearching={setIsSearching}
        />
        <Filter filters={filters} setFilters={setFilters} />
      </div>

      {/* Post Listings */}
      <Container>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          {isSearching
            ? "Search Results"
            : isFiltered
            ? "Filtered Results"
            : "Latest Available Surplus Food"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(isSearching ? searchResults : posts).slice().reverse().map((post) => (
            (post.quantity !== 0) && <PostCard key={post._id} {...post} />
          ))}
        </div>
      </Container>

      <Testimonial />
    </div>
  );
}

export default Home;
