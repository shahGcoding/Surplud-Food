import React, { useEffect, useState } from "react";
import { postMessage, getOrderByBuyerId } from "../../config/config";
import { useSelector } from "react-redux";
import { Container, Button } from "../../components";
import { Link } from "react-router-dom";

export default function Order() {
  const userData = useSelector((state) => state.auth.userData);
  const buyerId = userData?._id;

  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  const [messageInput, setMessageInput] = useState({});
  const [sendingStatus, setSendingStatus] = useState({});

  const handleSendMessage = async (sellerId, orderId, message) => {
    setSendingStatus((prev) => ({ ...prev, orderId: "sending" }));
    try {
      await postMessage({
        sellerId,
        buyerId: userData._id,
        orderId,
        message,
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
    if (buyerId) {
      fetchOrders();
    }
  }, [buyerId]);

  const fetchOrders = async () => {
    try {
      const response = await getOrderByBuyerId(userData._id); // or userData.userId if stored that way
      setOrders(response || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Accepted":
        return "text-yellow-600";
      case "Rejected":
        return "text-red-600";
      case "Pending":
      default:
        return "text-blue-600";
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
        <div className="flex flex-col space-y-4 mb-4">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded-md shadow-sm bg-white"
              >
                <p className="font-bold">Food: {order.foodTitle}</p>
                <p>Quantity: {order.quantity} kg</p>
                <p>Total Price: Rs. {order.totalPrice}</p>
                <p>Payment Method: {order.paymentMethod} </p>
                <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>

                <div className=" flex flex-col mt-4">
                  <label className="block text-sm font-semibold mb-1">
                    Message to Seller:
                  </label>
                  <textarea
                    value={messageInput[order._id] || ""}
                    onChange={(e) =>
                      setMessageInput((prev) => ({
                        ...prev,
                        [order._id]: e.target.value,
                      }))
                    }
                    placeholder="Write a message or report an issue..."
                    className="w-full border p-2 rounded mb-2"
                    rows={3}
                  />
                  {order.status !== "Delivered" && (
                    <Button
                      onClick={() =>
                        handleSendMessage(
                          order.sellerId,
                          order._id,
                          messageInput[order._id]
                        )
                      }
                      className="bg-green-500 w-40 text-white px-4 py-1 rounded hover:bg-green-700 "
                      disabled={sendingStatus[order._id] === "sending"}
                    >
                      {sendingStatus[order._id] === "sending"
                        ? "Sending..."
                        : "Send Message"}
                    </Button>
                  )}
                </div>

                <p>Seller Name: {order.sellerId?.username}</p>
                <p>
                  Status:{" "}
                  <span className={`font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
                {order.status !== "Delivered" && (
                  <div className="flex justify-end">
                    <Link
                      to={`/buyer/buyercomplaint?sellerId=${
                        typeof order.sellerId === "object"
                          ? order.sellerId._id
                          : order.sellerId
                      }&orderId=${order._id}&sellerName=${encodeURIComponent(
                        order.sellerId?.username || "Unknown"
                      )}`}
                    >
                      <Button className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-600">
                        complaint to admin
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </Container>
  );
}
