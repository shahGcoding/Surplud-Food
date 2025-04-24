import React, {useEffect, useState} from 'react'
import appwriteService from '../appwrite/config'
import { Carousel, Container, PostCard, SearchBar } from '../components'

function Home() {

    const [posts, setPosts] = useState([]);
//    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({
//     location: "",
//     foodType: "",
//     quantity: "",
//     sortBy: "",
//     searchQuery: "",
//   });

    useEffect(() => {
        // Fetch all posts from Appwrite
        appwriteService.getPosts().then((posts) => {
          if (posts) {
            setPosts(posts.documents);
          //  setFilteredPosts(response.documents);
          }
        });
      }, []);

      const handleSearch = (query) => {
        setSearchQuery(query);  // Update state

        if (query.trim() === "") {
            setFilteredPosts(posts);  // If search is empty, show all posts
        } else {
            const filtered = posts.filter(post =>
                (post.title && post.title.toLowerCase().includes(query.toLowerCase())) ||
                (post.description && post.description.toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredPosts(filtered);
        }
    };  

    //   useEffect(() => {
    //     applyFilters();
    //   }, [filters, posts]);

    //   const applyFilters = () => {
    //     let updatedPosts = [...posts];
    
    //     // Filter by location
    //     if (filters.location) {
    //       updatedPosts = updatedPosts.filter(
    //         (post) => post.location.toLowerCase() === filters.location.toLowerCase()
    //       );
    //     }
    
    //     // Filter by food type
    //     if (filters.foodType) {
    //       updatedPosts = updatedPosts.filter(
    //         (post) => post.foodType.toLowerCase() === filters.foodType.toLowerCase()
    //       );
    //     }
    
    //     // Filter by quantity
    //     if (filters.quantity) {
    //       updatedPosts = updatedPosts.filter(
    //         (post) => post.quantity.toLowerCase() === filters.quantity.toLowerCase()
    //       );
    //     }
    
    //     // Search query filter
    //     if (filters.searchQuery) {
    //       updatedPosts = updatedPosts.filter((post) =>
    //         post.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
    //       );
    //     }
    
    //     // Sorting logic
    //     if (filters.sortBy === "price_low") {
    //       updatedPosts.sort((a, b) => a.price - b.price);
    //     } else if (filters.sortBy === "price_high") {
    //       updatedPosts.sort((a, b) => b.price - a.price);
    //     } else if (filters.sortBy === "recent") {
    //       updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //     } else if (filters.sortBy === "popular") {
    //       updatedPosts.sort((a, b) => b.popularity - a.popularity);
    //     }
    
    //     setFilteredPosts(updatedPosts);
    //   };

    return(
        <div className='w-full py-2'>
            
            {/* <SearchBar  onSearch={handleSearch}/> */}

            <SearchBar 
                posts={posts} 
                setSearchResults={setSearchResults} 
                setIsSearching={setIsSearching} 
            />

{isSearching ? (
                <Container>
                    <div className="flex flex-wrap">
                        {searchResults.map((post) => (
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                </Container>
            ) : (
                <>
                    <Carousel />
                    <Container>
                        <div className="flex flex-wrap">
                            {posts.map((post) => (
                                <div key={post.$id} className="p-2 w-1/4">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    </Container>
                </>
            )}

        </div>
    )

    // return (
    //     <div className="w-full py-2">
    //       <SearchBar filters={filters} setFilters={setFilters} />
    //       <Carousel />
    //       <Container>
    //         <div className="flex flex-wrap">
    //           {filteredPosts.length > 0 ? (
    //             filteredPosts.map((post) => (
    //               <div key={post.$id} className="p-2 w-1/4">
    //                 <PostCard {...post} />
    //               </div>
    //             ))
    //           ) : (
    //             <div className="w-full text-center text-gray-600 py-10">
    //               No posts found.
    //             </div>
    //           )}
    //         </div>
    //       </Container>
    //     </div>
    //   );

}

export default Home