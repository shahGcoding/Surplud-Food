import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { Container } from "../../components";

export default function Order() {
    const userData = useSelector((state) => state.auth.userData);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    {orders.slice().reverse().map((order) => (
                        <div
                            key={order.$id}
                            className="border p-4 rounded-md shadow-sm bg-white"
                        >
                            <p className="font-semibold">Food: {order.foodTitle}</p>
                            <p>Quantity: {order.quantity}</p>
                            <p>Total Price: Rs. {order.totalPrice}</p>
                            <p>Order Date: {order.orderDate}</p>
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
