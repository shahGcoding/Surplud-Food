import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { Container } from "../../components";

export default function PlaceOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (userData?.userId) {
            appwriteService.getOrdersBySeller(userData.userId).then((res) => {
                setOrders(res);
                setLoading(false);
            });
        }
    }, [userData]);


    return (
        <Container>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Placed Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center text-gray-500">No orders found.</div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div
                            key={order.$id}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold">{order.postTitle}</h2>
                                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                    Quantity: {order.quantity}
                                </span>
                            </div>
                            <div className="text-gray-600 mb-2">
                                <span className="font-medium">Total:</span> Rs. {order.total}
                            </div>
                            <div className="text-gray-600 mb-2">
                                <span className="font-medium">Buyer:</span> {order.buyerName}
                            </div>
                            <div className="text-gray-600 mb-2">
                                <span className="font-medium">Contact:</span> {order.buyerPhone}
                            </div>
                            <div className="text-gray-600">
                                <span className="font-medium">Status:</span> {order.status || "Pending"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}
