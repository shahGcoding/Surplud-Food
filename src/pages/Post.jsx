import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Select, Input } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

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
          appwriteService.getUserById(post.userId).then((user) => {
            setSeller(user);
            if (userData?.role === "buyer" && deliveryMethod === "online-delivery") {
              calculateDeliveryCharges(user);
            }
          });
        } else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate, userData, deliveryMethod]);

  const calculateDeliveryCharges = async (sellerData) => {
    try {
      const buyerDoc = await appwriteService.getUserById(userData.$id);

      const buyerLat = parseFloat(buyerDoc.latitude);
      const buyerLng = parseFloat(buyerDoc.longitude);
      const sellerLat = parseFloat(sellerData.latitude);
      const sellerLng = parseFloat(sellerData.longitude);

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
        const charge = distance * 50; // Rs.10 per km
        setDeliveryCharge(Number(charge.toFixed(2)));
      } else {
        console.warn("Missing lat/lng for delivery charge calculation");
        setDeliveryCharge(0.00);
      }
    } catch (error) {
      console.error("Error calculating delivery charges:", error);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

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

    const buyerDoc = await appwriteService.getUserById(userData.$id);

    if (buyerDoc.status !== "active") {
      alert("You are blocked. You cannot place orders.");
      setPlacingOrder(false);
      return;
    }

    if (deliveryMethod === "online-delivery" && !deliveryCharge) {
      alert("Unable to calculate delivery charges. Please update location.");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        foodTitle: post.title,
        quantity: selectedQuantity,
        totalPrice: totalPrice,
        paymentMethod: "cash on delivery",
        buyerName: userData.name || userData.email || "Unknown Buyer",
        orderDate: new Date().toISOString(),
        sellerId: post.userId,
        sellerName: seller?.name || seller?.email || "Unknown Seller",
        buyerId: userData.$id,
        status: "Pending",
        deliveryMethod: deliveryMethod,
        deliveryCharge: Number( deliveryMethod === "online-delivery" ? deliveryCharge : 0 ),
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
                  <Button bgColor="bg-green-500 hover:cursor-pointer">
                    Edit
                  </Button>
                </Link>
              )}
              <Button
                className="bg-red-500 hover:cursor-pointer"
                onClick={deletePost}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="md:w-1/2 w-full p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
            <div className="mt-2 text-gray-600">{parse(post.content)}</div>
            <p className="text-lg font-semibold text-green-700 mt-4">
              Price: Rs. {post.price} per Kg
            </p>
            <p className="text-lg text-gray-700">
              Quantity Available: {post.quantity} Kg
            </p>
            <p className="text-lg text-blue-700">
              Delivery Charges: Rs.{" "}
              {deliveryMethod === "online-delivery" ? deliveryCharge : 0}
            </p>
            {userData?.role === "buyer" && (
              <p className="text-lg font-bold text-red-700">
                Total Price: Rs. {totalPrice}
              </p>
            )}
          </div>

          {userData?.role === "buyer" && (
            <>
              <div className="flex items-center gap-3">
                <label htmlFor="quantity" className="text-sm font-semibold">
                  Select Quantity:
                </label>
                <Input
                  type="number"
                  min="1"
                  max={post.quantity}
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  className="p-2 w-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <Select
                options={["online-delivery", "self-pickup"]}
                label="Select Delivery Method:"
                value={deliveryMethod}
                onChange={(e) => {
                  setDeliveryMethod(e.target.value);
                  if (e.target.value === "online-delivery" && seller) {
                    calculateDeliveryCharges(seller);
                  }
                }}
              />
            </>
          )}

          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm font-semibold mb-1">Seller Info:</p>
            <p className="text-sm text-gray-700">Name: {seller?.name}</p>
            <p className="text-sm text-gray-700">Email: {seller?.email}</p>
            <p className="text-sm text-gray-700">
              Address: {seller?.businessAddress}
            </p>
          </div>

          {userData?.role === "buyer" && (
            <Select
              options={["cash on delivery"]}
              label="Select payment method : "
              className="mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}

          {userData?.role === "buyer" ? (
            <Button
              onClick={handlePlaceOrder}
              bgColor="bg-green-700"
              className="hover:bg-green-600 hover:cursor-pointer transition-transform hover:scale-110 ml-64"
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          ) : userData?.role !== "seller" && userData?.role !== "admin" ? (
            <h1 className="font-bold text-2xl">Sign in for placing order !</h1>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
}
