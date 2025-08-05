import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import { Button, Container, Input } from "../../components";
import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

function ManageListings() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setIloading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const fetchAllPosts = async () => {
    setIloading(true);
    try {
      const postResponse = await appwriteService.getPostsForAdmin();
      if (postResponse) {
        setPosts(postResponse.documents);
      }

      const userResponse = await appwriteService.getAllUsers();
      if (userResponse) setUsers(userResponse.documents);
    } catch (error) {
      throw error;
    } finally {
      setIloading(false);
    }
  };

  const handleDelete = async (postId, imageId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await appwriteService.deletePost(postId);
        await appwriteService.deleteFile(imageId);
        fetchAllPosts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const toggleButton = async (postId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await appwriteService.updatePost(postId, { status: newStatus });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.$id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
      throw error;
    }
  };

  const getSellerName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.name : "Unknown Seller";
  };

  // for searching
  useEffect(() => {
    if (!searchQuery) {
      setFilteredResults(posts);
    } else {
      
      const result = posts.filter((post) =>{
        const user = users.find((u) => u.userId === post.userId);
        return (
            user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
        
      
      setFilteredResults(result);
    }
  }, [searchQuery, users, posts]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">All Sellers' Listings</h1>
      <div className="relative w-52 max-w-sm m-4">
        <BsSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={20}
        />
        <Input
          type="text"
          placeholder="search...."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {loading ? (
        <p>Loding posts....</p>
      ) : posts.length === 0 ? (
        <p>no posts Available</p>
      ) : (
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.map((post) => (
              <div
                key={post.$id}
                className="bg-white rounded shadow p-4 flex flex-col justify-between"
              >
                <img
                  src={appwriteService.getFileURL(post.featuredImage)}
                  alt={post.title}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-700">Price: Rs {post.price}</p>
                <p className="text-sm text-gray-700">
                  Quantity: {post.quantity} Kg
                </p>
                <p className="text-sm text-gray-700">
                  Seller: {getSellerName(post.userId)}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={
                      post.status === "blocked"
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {post.status}
                  </span>
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <Link to={`/post/${post.$id}`}>
                    <Button
                      bgColor="bg-green-500"
                      className="w-full hover:bg-green-700"
                    >
                      View
                    </Button>
                  </Link>

                  <Button
                    bgColor={
                      post.status === "blocked"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }
                    className="w-full hover:cursor-pointer "
                    onClick={() => toggleButton(post.$id, post.status)}
                  >
                    {post.status === "blocked" ? "Unblock Post" : "Block Post"}
                  </Button>

                  <Button
                    bgColor="bg-red-600"
                    className="w-full hover:bg-red-700"
                    onClick={() => handleDelete(post.$id, post.featuredImage)}
                  >
                    Delete Post
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      )}
    </div>
  );
}

export default ManageListings;
