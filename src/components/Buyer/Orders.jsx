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

    return (
        <Container>
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-4 mb-4">
                    {orders.map((order) => (
                        <div
                            key={order.$id}
                            className="border p-4 rounded-md shadow-sm bg-white"
                        >
                            <p className="font-semibold">Food: {order.foodTitle}</p>
                            <p>Quantity: {order.quantity}</p>
                            <p>Total Price: Rs. {order.totalPrice}</p>
                            <p>Order Date: {order.orderDate}</p>
                            <p>Seller ID: {order.sellerId}</p>
                            <p className="text-blue-600">Status: {order.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}
