import React from "react";
import { Button } from "./index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function PostCard({ _id, title, price, featuredImage }) {

  const userData = useSelector((state) => state.auth.userData);

  const imageUrl = featuredImage || "https://via.placeholder.com/300x200.png?text=No+Image";

  return (
    <Link to={`/post/${_id}`}>
      <div className="w-full bg-gray-200 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-xl w-full object-cover h-[200px]"
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
        <h2 className="text-xl font-bold mt-4">Rs.{price}</h2>
        {userData?.role === "buyer" && (
          <Button
            type="submit"
            className="w-full mt-4 bg-green-700 text-white p-2 duration-200 transition-transform hover:cursor-pointer hover:scale-95 hover:bg-green-500  rounded-lg"
          >
            Order Now!
          </Button>
        )}
      </div>
    </Link>
  );
}

export default PostCard;
