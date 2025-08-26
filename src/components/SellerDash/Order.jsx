import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  getUserById,
  getOrderBySellerId,
  updateOrderStatus,
} from "../../config/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function PlaceOrder() {
  const [orders, setOrders] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  const fetchOrders = async () => {
    const session = await getCurrentUser();
    const userDoc = await getUserById(session._id);

    try {
      if (userDoc.status === "inactive") {
        return alert("Blocked sellers cannot accept or reject orders.");
      }

      const response = await getOrderBySellerId(userDoc._id);
      setOrders(response);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    }
  };

  useEffect(() => {
    if (userData && userData._id) {
      fetchOrders();
    }
  }, [userData]);

  const markAsDelivered = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "Delivered");
      alert("Order marked as Delivered!");
      fetchOrders();
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("Failed to update order status.");
    }
  };

  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  if (orders.length === 0) {
    return <p className="text-center text-gray-600">No orders found.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Incoming Orders</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white p-4 rounded-lg shadow relative"
        >
          {order.status !== "Delivered" && (
            <Link to={`/seller/complain?buyerId=${order.buyerId._id}`}>
              <button className="absolute top-4 right-4 bg-violet-500 text-white px-3 py-1 rounded hover:bg-violet-700">
                Complaint to admin
              </button>
            </Link>
          )}

          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Food: {order.foodTitle}</p>
              <p>Quantity: {order.quantity} Kg</p>
              <p>Total Price: Rs. {order.totalPrice}</p>
              <p>Buyer: {order.buyerId ? order.buyerId.username : "N/A"}</p>
              <p>Buyer Email: {order.buyerId ? order.buyerId.email : "N/A"}</p>
              <p>
                Status:{" "}
                <span
                  className={`font-bold ${
                    order.status === "Pending"
                      ? "text-blue-600"
                      : order.status === "Accepted"
                      ? "text-yellow-600"
                      : order.status === "Delivered"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>

            <div className="flex gap-2 mt-28 items-start">
              {order.status === "Pending" && (
                <>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    onClick={() => handleOrderStatus(order._id, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleOrderStatus(order._id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              )}

              {order.status === "Accepted" && (
                <button
                  className="bg-green-500 text-white px-3 mt-28 py-1 rounded hover:bg-green-700"
                  onClick={() => markAsDelivered(order._id)}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
