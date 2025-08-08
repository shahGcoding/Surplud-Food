import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import authService from "../../appwrite/auth";

export default function PlaceOrder() {
  const [orders, setOrders] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  const fetchOrders = async () => {
      const session = await authService.getCurrentUser();
      const userDoc = await appwriteService.getUserById(session.$id);
      try {
        if (userDoc.status !== "active") {
          return alert("Blocked sellers cannot accept or reject orders.");
        }
        const response = await appwriteService.getOrdersBySellerId(
          userData.$id
        ); // Assuming you have a method to fetch orders by seller ID
        setOrders(response.documents || []);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
      }
    };

  useEffect(() => {
    
    if (userData && userData.$id) {
      fetchOrders();
    }
  }, [userData]);

  // for admin comission in seller delivered order
  const markAsDelivered = async (orderId) => {

  const order = orders.find((o) => o.$id === orderId)
  if (!order) return alert("Order not found.");

  const commissionRate = 0.10;
  const commissionAmount = parseFloat(order.totalPrice * commissionRate);

  const data = {
      status: "Delivered",
      deliveredAt: new Date().toISOString(),
      comission: commissionAmount,
      comissionPaid: "false",
      }

    try {
      await appwriteService.updateOrder(orderId, data);
      alert("Order is updated !");
      fetchOrders();
    } catch (error) {
      throw error;
    }
  
}

  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      await appwriteService.updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.$id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
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
          key={order.$id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">Food: {order.foodTitle}</p>
            <p>Quantity: {order.quantity} Kg</p>
            <p>Total Price: Rs. {order.totalPrice}</p>
            <p>Buyer: {order.buyerName}</p>
            <p>BuyerId: {order.buyerId} </p>
            <p>
              Status:{" "}
              <span
                className={`font-bold ${
                  order.status === "Pending" ? "text-blue-600": order.status === "Accepted"? "text-yellow-600" : order.status === "Delivered" ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>

          {order.status === "Pending" && (
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                onClick={() => handleOrderStatus(order.$id, "Accepted")}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleOrderStatus(order.$id, "Rejected")}
              >
                Reject
              </button>
            </div>
          )}

          {order.status === "Accepted" && (
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => markAsDelivered(order.$id)}
              >
               Mark as Delivered  
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
