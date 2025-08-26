import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Select, Input } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import {
  getFoodPostById,
  deleteFoodPost,
  placeOrder,
  getUserById, // temporary way to fetch seller
} from "../config/config";

export default function Post() {
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("self-pickup");
  const [totalPrice, setTotalPrice] = useState(0);

  const { slug } = useParams();
  const navigate = useNavigate();
  const {userData} = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token); // assuming token is stored

  const canModify =
    userData?.role === "admin" ||
    (userData?.role === "seller" && (post?.userId?._id || post?.userId) === userData?._id);

  // Fetch post
  useEffect(() => {
    if (slug) {
      getFoodPostById(slug).then((food) => {
        if (food) {
          setPost(food);

          getUserById(food.userId._id).then((sellerData) => {
            setSeller(sellerData);
            if (userData?.role === "buyer" && deliveryMethod === "online-delivery") {
              calculateDeliveryCharges(sellerData);
            }
          });
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate, userData, deliveryMethod, token]);

  // Delivery charge calculation
  const calculateDeliveryCharges = (sellerData) => {
    try {
      const buyerLat = (userData.latitude);
      const buyerLng = (userData.longitude);
      const sellerLat = (sellerData.latitude);
      const sellerLng = (sellerData.longitude);

      if (
        !isNaN(buyerLat) &&
        !isNaN(buyerLng) &&
        !isNaN(sellerLat) &&
        !isNaN(sellerLng)
      ) {
        const distance = getDistanceFromLatLonInKm(
          buyerLat,
          buyerLng,
          sellerLat,
          sellerLng
        );
        const charge = distance * 50; // Rs.50 per km
        setDeliveryCharge(Number(charge.toFixed(2)));
      } else {
        setDeliveryCharge(0.0);
      }
    } catch (error) {
      console.error("Delivery charge error:", error);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Update total price when things change
  useEffect(() => {
    if (post) {
      let basePrice = post.price * selectedQuantity;
      if (deliveryMethod === "online-delivery") {
        setTotalPrice(basePrice + deliveryCharge);
      } else {
        setTotalPrice(basePrice);
      }
    }
  }, [post, selectedQuantity, deliveryCharge, deliveryMethod]);

  // Delete Post
  const deletePostHandler = async () => {
    try {
      await deleteFoodPost(post._id);
      navigate("/");
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Place Order
  const handlePlaceOrder = async () => {
    if (!userData || userData.role !== "buyer") {
      alert("Only buyers can place orders.");
      return;
    }

    if (deliveryMethod === "online-delivery" && deliveryCharge == null) {
      alert("Unable to calculate delivery charges.");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        foodId: post._id,
        quantity: selectedQuantity,
        paymentMethod: "cash on delivery",
        buyerId: userData._id,
        deliveryMethod,
      };

      await placeOrder(orderData);
      alert("Order placed successfully!");
      navigate("/buyer/orders");
    } catch (error) {
      console.error("Order error", error);
      alert("Something went wrong while placing the order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return post ? (
    <div className="py-8 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* LEFT: Image */}
        <div className="md:w-1/2 w-full relative">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover border-2 rounded-2xl"
          />
          {canModify && (
            <div className="absolute top-4 right-4 flex gap-2">
              {userData?.role === "seller" && (
                <Link to={`/edit-post/${post._id}`}>
                  <Button bgColor="bg-green-500">Edit</Button>
                </Link>
              )}
              <Button className="bg-red-500" onClick={deletePostHandler}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT: Post Info */}
        <div className="md:w-1/2 w-full p-6 space-y-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div>{parse(post.content)}</div>
          <p className="text-lg font-semibold text-green-700">
            Price: Rs. {post.price} per Kg
          </p>
          <p>Quantity Available: {post.quantity} Kg</p>
          <p>
            Delivery Charges: Rs.{" "}
            {deliveryMethod === "online-delivery" ? deliveryCharge : 0}
          </p>

          {/* Buyer Only */}
          {userData?.role === "buyer" && (
            <>
              <p className="text-lg font-bold text-red-700">
                Total Price: Rs. {totalPrice}
              </p>
              <div className="flex gap-3 items-center">
                <label>Quantity:</label>
                <Input
                  type="number"
                  min="1"
                  max={post.quantity}
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                />
              </div>
              <Select
                options={["online-delivery", "self-pickup"]}
                label="Delivery Method:"
                value={deliveryMethod}
                onChange={(e) => {
                  setDeliveryMethod(e.target.value);
                  if (e.target.value === "online-delivery" && seller) {
                    calculateDeliveryCharges(seller);
                  }
                }}
              />
              <Button
                onClick={handlePlaceOrder}
                bgColor="bg-green-700"
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

