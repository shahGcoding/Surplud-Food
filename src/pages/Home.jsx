import React, { useEffect, useState } from "react";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config";
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
    foodType: "",
    quantity: "",
  });

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Fetch all posts from Appwrite
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
        //  setFilteredPosts(response.documents);
      }
    });
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const queries = [Query.equal("status", "active")];

      if (filters.location) {
        queries.push(Query.equal("location", String(filters.location)));
        setIsFiltered(true);
      }

      if (filters.quantity) {
        queries.push(Query.equal("quantity", String(filters.quantity)));
        setIsFiltered(true);
      }

      if (parseInt(filters.price) > 0) {
        queries.push(Query.lessThanEqual("price", String(filters.price)));
        setIsFiltered(true);
      }

      try {
        const response = await appwriteService.getFilteredPosts(queries);
        setPosts(response.documents);
      } catch (error) {
        console.error("Error loading filtered posts:", error);
      }
    };

    loadPosts();
  }, [filters]);

  return (
    <div className="w-full py-0.5 px-2 sm:px-6 lg:px-0">
      <div className="relative w-full mb-4 h-[720px]">
        {/* Background Image */}
        <img
          src="/public/hero.jpg"
          alt="Food"
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Overlay content */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to Surplus Food
          </h1>
          <p className="mb-4 text-sm md:text-base max-w-md">
            Save food, feed people, and fight waste. Browse our surplus meals
            now!
          </p>
          {!authStatus && (
            <Link to={"/signup"} className="inline-block">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Carousel
      <div className="mb-10">
        <Carousel />
      </div> */}

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
          {(isSearching ? searchResults : posts).map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      </Container>

      <Testimonial />
    </div>
  );
}

export default Home;
