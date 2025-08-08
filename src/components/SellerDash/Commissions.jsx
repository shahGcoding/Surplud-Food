import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import Button from "../Button";
import Container from "../container/Container";

function Commissions() {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = useSelector((state) => state.auth.userData);
  const sellerId = userData.$id;

  const fetchOrder = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const session = await appwriteService.getOrdersBySeller(sellerId);
      const order = session?.documents ?? [];

      const deliveredOrder = order.filter(
        (o) => o.status === "Delivered"
      );
      console.log("Filtered Delivered Orders:", deliveredOrder);
      setFilteredOrders(deliveredOrder);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData.$id) {
      fetchOrder();
    }
  }, [sellerId]);

  const markAsPaid = async (orderId) => {
    try {
      await appwriteService.updateOrder(orderId, { comissionPaid: "true" });
      alert("Mark Paid successfully !");
      fetchOrder();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="font-bold text-2xl">Order's Commision</h1>

      {loading ? (
        <p>Orders Loading.....</p>
      ) : filteredOrders.length === 0 ? (
        <p>Not Available</p>
      ) : (
        <Container>
        <div>
          {filteredOrders.slice().reverse().map((order) => (
            <div
              key={order.$id}
              className="bg-white rounded-lg border shadow mb-4 p-4"
            >
              <div>
                <p className="font-semibold">Food: {order.foodTitle}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Price: {order.totalPrice}</p>
                <p>Commission: {order.comission}</p>
                <p>
                  Seller: {order.sellerName} ({order.sellerId})
                </p>
                <p>
                  Commission Status:{" "}
                  {order.comissionPaid === "true" ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-600">Unpaid</span>
                  )}
                </p>
              </div>
            {order.comissionPaid !== "true" &&
                <div className="flex justify-end items-end">
              <Button onClick={() => markAsPaid(order.$id)}
                className="bg-green-500 hover:bg-green-700 transition-transform hover:scale-90 hover:cursor-pointer"
              >
                Mark as Paid
              </Button>
              </div>
                }       
            </div>
          ))}
        </div>
        </Container>
      )}
    </div>
  );
}

export default Commissions;
