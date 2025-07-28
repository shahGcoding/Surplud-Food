import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import { Container, PostCard } from "../../components";
import { useSelector } from "react-redux";

function MyListing() {
  const reduxUserId = useSelector((state) => state.auth.userData?.$id);
  console.log("🔁 Redux userId:", reduxUserId);
  const userId = reduxUserId || localStorage.getItem("userId");
  console.log("✅ Final resolved userId:", userId);

  console.log("📦 LocalStorage userId:", localStorage.getItem("userId"));
  const [posts, setPosts] = useState([]);
  //const [userId, setUserId] = useState(null);

  // Load userId from redux or localStorage on mount
  //   useEffect(() => {
  //   console.log("Redux user ID:", reduxUserId);
  //   const savedUserId = reduxUserId || localStorage.getItem("userId");
  //   console.log("From localStorage:", localStorage.getItem("userId"));

  //   if (savedUserId) {
  //     console.log("✅ User ID available:", savedUserId);
  //     setUserId(savedUserId);
  //   } else {
  //     console.warn("⚠️ User ID not found in redux or localStorage");
  //   }
  // }, [reduxUserId]);

  // Fetch posts when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchUserPosts = async () => {
      try {
        const response = await appwriteService.getPosts([]);
        if (response?.documents) {
          console.log("All fetched posts:", response.documents);

          const userPosts = response.documents.filter((post) => {
            console.log(
              `Comparing post.userId (${post.userId}) === userId (${userId})`
            );
            return post.userId === userId;
          });

          console.log("Filtered userPosts:", userPosts);
          setPosts(userPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
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
