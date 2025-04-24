import React, { useEffect, useState } from "react";
//import { service } from "@/appwrite/config"; // adjust the import path as needed
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const allOrders = await service.getOrders(); // Fetch all orders
//       setOrders(allOrders.documents || []);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//     }
//   };

//   const handleAccept = async (orderId) => {
//     await updateOrderStatus(orderId, "Accepted");
//   };

//   const handleReject = async (orderId) => {
//     await updateOrderStatus(orderId, "Rejected");
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await service.updateOrder(orderId, { status });
//       fetchOrders();
//     } catch (error) {
//       console.error("Failed to update order:", error);
//     }
//   };

//   const handleStatusChange = async (e) => {
//     e.preventDefault();
//     await updateOrderStatus(updatingStatusId, newStatus);
//     setUpdatingStatusId(null);
//     setNewStatus("");
//   };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Manage Orders</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Food Item</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.$id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.foodItem}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2 font-medium text-blue-600">
                    {order.status}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      onClick={() => handleAccept(order.$id)}
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      onClick={() => handleReject(order.$id)}
                    >
                      <FaTimes /> Reject
                    </button>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      onClick={() => {
                        setUpdatingStatusId(order.$id);
                        setNewStatus(order.status);
                      }}
                    >
                      <FaEdit /> Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {updatingStatusId && (
        <form
          onSubmit={handleStatusChange}
          className="mt-6 p-4 bg-white rounded shadow-md max-w-md"
        >
          <h3 className="text-lg font-semibold mb-3">Update Order Status</h3>
          <input
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            placeholder="Enter new status"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Update Status
          </button>
        </form>
      )}
    </div>
  );
};

export default Order;
