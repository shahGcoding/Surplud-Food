import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { Container } from "../../components";

export default function Order() {
  const userData = useSelector((state) => state.auth.userData);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messageInput, setMessageInput] = useState({});
  const [sendingStatus, setSendingStatus] = useState({});

  const handleSendMessage = async (sellerId, orderId, message) => {
    setSendingStatus((prev) => ({ ...prev, orderId: "sending" }));
    try {
      await appwriteService.postMessage({
        sellerId,
        buyerId: userData.$id,
        buyerName: userData.name,
        orderId,
        message,
        dateSent: new Date().toISOString(),
        status: "Unread",
      });
      alert("Message sent successfully!");
      setMessageInput((prev) => ({ ...prev, [orderId]: "" }));
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingStatus((prev) => ({ ...prev, orderId: "sent" }));
    }
  };

  useEffect(() => {

    console.log("Current user:", userData);
    if (userData && userData.email) {
      fetchOrders(userData.email);
    }
  }, [userData]);

  const fetchOrders = async () => {
    try {
      const response = await appwriteService.getOrdersByBuyer(userData.email); // or userData.userId if stored that way
      setOrders(response.documents || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      case "Pending":
      default:
        return "text-yellow-600";
    }
  };

  return (
    <Container>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4 mb-4">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.$id}
                className="border p-4 rounded-md shadow-sm bg-white"
              >
                <p className="font-semibold">Food: {order.foodTitle}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total Price: Rs. {order.totalPrice}</p>
                <p>Order Date: {order.orderDate}</p>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-1">
                    Message to Seller:
                  </label>
                  <textarea
                    value={messageInput[order.$id] || ""}
                    onChange={(e) =>
                      setMessageInput((prev) => ({
                        ...prev,
                        [order.$id]: e.target.value,
                      }))
                    }
                    placeholder="Write a message or report an issue..."
                    className="w-full border p-2 rounded mb-2"
                    rows={3}
                  />
                  <button
                    onClick={() =>
                      handleSendMessage(
                        order.sellerId,
                        order.$id,
                        messageInput[order.$id]
                      )
                    }
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    disabled={sendingStatus[order.$id] === "sending"}
                  >
                    {sendingStatus[order.$id] === "sending"
                      ? "Sending..."
                      : "Send Message"}
                  </button>
                </div>

                <p>Seller Name: {order.sellerId}</p>
                <p>
                  Status:{" "}
                  <span className={`font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            ))}
        </div>
      )}
    </Container>
  );
}
