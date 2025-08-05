import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { Container, Button } from "../../components";
import {Link} from "react-router-dom"

export default function Order() {
  const userData = useSelector((state) => state.auth.userData);

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [orders, setOrders] = useState([]);

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



  const fetchSellerDetails = async () => {
    try {
      const response = await appwriteService.getAllUsers();
      setUsers(response.documents || []);
    } catch (error) {
      throw error
    }
  }

  const getSellerName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.name : "Unknown Seller";
  };

  useEffect(() => {

    console.log("Current user:", userData);
    if (userData && userData.email) {
      fetchOrders(userData.email);
    }
    fetchSellerDetails();
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
        <div className="flex flex-col space-y-4 mb-4">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.$id}
                className="border p-4 rounded-md shadow-sm bg-white"
              >
                <p className="font-bold">Food: {order.foodTitle}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total Price: Rs. {order.totalPrice}</p>
                <p>Order Date: {order.orderDate}</p>
                <div className=" flex flex-col mt-4">
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
                  <Button
                    onClick={() =>
                      handleSendMessage(
                        order.sellerId,
                        order.$id,
                        messageInput[order.$id]
                      )
                    }
                    className="bg-green-500 w-40 text-white px-4 py-1 rounded hover:bg-green-700 "
                    disabled={sendingStatus[order.$id] === "sending"}
                  >
                    {sendingStatus[order.$id] === "sending"
                      ? "Sending..."
                      : "Send Message"}
                  </Button>
                  
                </div>

                <p>Seller Name: {getSellerName(order.sellerId)}</p>
                <p>
                  Status:{" "}
                  <span className={`font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
                <div className="flex justify-end">
                <Link to={`/buyer/buyercomplaint?sellerId=${order.sellerId}&orderId=${order.$id}&sellerName=${getSellerName(order.sellerId)}`} >
                  <Button 
                    className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-600"
                  >
                    complaint to admin
                  </Button>    
                   </Link>
                 </div>      
              </div>
            ))}
        </div>
      )}
    </Container>
  );
}
