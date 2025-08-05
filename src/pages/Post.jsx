import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);

  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const reduxUserId = useSelector((state) => state.auth.userData?.$id);

  const canModify =
    userData?.role === "admin" ||
    (userData?.role === "seller" && post?.userId === reduxUserId);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          appwriteService
            .getUserById(post.userId)
            .then((user) => setSeller(user));
        } else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  const handlePlaceOrder = async () => {

    if (!userData || userData.role !== "buyer") {
      alert("Only buyers can place orders.");
      return;
    }

    if (userData.status !== "active") {
      return alert("Your account is blocked. You cannot place orders.");
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        foodTitle: post.title,
        quantity: post.quantity,
        totalPrice: post.price,
        buyerName: userData.name || userData.email || "Unknown Buyer",
        orderDate: new Date().toISOString(),
        sellerId: post.userId,
        sellerName: userData.name || userData.email || "Unknown Seller",
        buyerId: userData.$id,
        status: "Pending",
      };

      const response = await appwriteService.postOrder(orderData);
      if (response) {
        alert("Order placed successfully!");
        navigate("/buyer/orders");
      }
    } catch (error) {
      console.error("Order placing error:", error);
      alert("Something went wrong while placing the order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return post ? (
    <div className="py-8 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">

        <div className="md:w-1/2 w-full relative">
          <img
            src={appwriteService.getFileURL(post.featuredImage)}
            alt={post.title}
            className="w-full h-full object-cover border-2 rounded-2xl"
          />

          {canModify && (
            <div className="absolute top-4 right-4 flex gap-2">
              {userData?.role === "seller" && (
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500">Edit</Button>
                </Link>
              )}
              <Button className="bg-red-500 hover:cursor-pointer" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 w-full p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
            <div className="mt-2 text-gray-600">{parse(post.content)}</div>
            <p className="text-lg font-semibold text-green-700 mt-4">
              Price: Rs. {post.price}
            </p>
            <p className="text-lg text-gray-700">
              Quantity: {post.quantity} Kg
            </p>
          </div>

          {userData?.role === "buyer" && (
            <div className="flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm font-semibold">
                Select Quantity:
              </label>
              <input
                type="number"
                min="1"
                max={post.quantity}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}


          {/* Seller Info */}
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm font-semibold mb-1">Seller Info:</p>
          <p className="text-sm text-gray-700">Name: {seller?.name}</p>
          <p className="text-sm text-gray-700">Email: {seller?.email}</p>
          <p className="text-sm text-gray-700">Address: {seller?.businessAddress}</p>
        </div>

          {/* Place Order Button */}
          {userData?.role === "buyer" && (
            <Button
              onClick={handlePlaceOrder}
              bgColor="bg-green-700"
              className="hover:bg-green-600 transition"
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
