import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config'; // your Appwrite service
import { useSelector } from 'react-redux';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  // useEffect(() => {
  //   const fetchListings = async () => {
  //     try {
  //       const response = await service.getUserPosts(userData.$id); // fetch posts by user ID
  //       setListings(response.documents);
  //     } catch (error) {
  //       console.error('Failed to fetch listings:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (userData?.$id) {
  //     fetchListings();
  //   }
  // }, [userData]);

  // if (loading) return <p className="text-center text-gray-500">Loading listings...</p>;

  // if (listings.length === 0) {
  //   return <p className="text-center text-gray-600">You have not added any listings yet.</p>;
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((post) => (
        <div key={post.$id} className="bg-white rounded-lg shadow p-4">
          <img
            src={service.getFilePreview(post.image)}
            alt={post.title}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
          <h3 className="text-lg font-semibold text-green-700">{post.title}</h3>
          <p className="text-gray-600 text-sm">{post.description}</p>
          <p className="mt-2 text-sm text-green-600 font-medium">Price: Rs. {post.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Listings;
