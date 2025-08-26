import React, { useState, useEffect } from "react";
import { getAllFoodPosts,  } from "../../config/config";
import { Container, PostCard } from "../../components";
import { useSelector } from "react-redux";

function MyListing() {
  const reduxUserId = useSelector((state) => state.auth.userData?._id);

  const userId = reduxUserId || localStorage.getItem("userId");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
  if (!userId) return;

  const fetchUserPosts = async () => {
    try {
      const response = await getAllFoodPosts(); // response is array of posts

      const userPosts = response.filter((post) => {

        return post.userId?._id === userId;
        
      });

      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchUserPosts();
}, [userId]);

  return (
    <div className="w-full py-4">
      <h1 className="font-bold text-3xl mb-4">My Food Listings</h1>
      <Container>
        <div className="flex flex-wrap">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))
          ) : (
            <p className="text-center w-full text-gray-500">
              No listings found.
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

export default MyListing;
