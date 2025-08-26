import React, { useState, useEffect } from "react";
import { getUserById, getAllOrders } from "../../config/config";

function AdminCommission() {
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [selectedSeller, setSelectedSeller] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [totalCommission, setTotalCommission] = useState(0);
  const [paidCommission, setPaidCommission] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res || []);
        
        // Extract unique seller IDs from orders
        const uniqueSellerIds = [ ...new Set(res.map((order) => order.sellerId._id))];

        // Fetch sellers' emails
        const sellerDetails = await Promise.all(
          uniqueSellerIds.map(async (id) => {
            const sellerDoc = await getUserById(id);
            return {
              _id: sellerDoc._id,
              email: sellerDoc.email || "Unknown Email",
            };
          })
        );
        console.log("sellerDetails", sellerDetails);

        setSellers(sellerDetails);
      } catch (error) {
        console.error("Error fetching orders or sellers:", error);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by selected seller
  useEffect(() => {
    if (selectedSeller) {
      const filtered = orders.filter(
        (order) => order.sellerId._id === selectedSeller
      );
      setFilteredOrders(filtered);

      // Calculate total commission for selected seller
      const total = filtered.reduce(
        (sum, order) => sum + (order.comission || 0),
        0
      );
      setTotalCommission(total);

      const Paid = filtered
        .filter((order) => order.comissionPaid === "true")
        .reduce((sum, o) => sum + (o.comission || 0), 0);
      setPaidCommission(Paid);
    } else {
      setFilteredOrders([]);
      setTotalCommission(0);
      setPaidCommission(0);
    }
  }, [selectedSeller, orders]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Commission</h1>

      {/* Dropdown for sellers */}
      <select
        className="border-gray-400 border w-55 p-2 rounded mb-4 focus:border-green-400"
        value={selectedSeller}
        onChange={(e) => setSelectedSeller(e.target.value)}
      >
        <option value="">Select Seller</option>
        {sellers.map((seller) => (
          <option key={seller._id} value={seller._id}>
            {seller.email}
          </option>
        ))}
      </select>

      {/* for total commision */}
      {selectedSeller && (
        <div className="mb-4 font-semibold text-lg">
          Total Commission: Rs. {totalCommission.toFixed(2)} | Paid
          Commision:Rs. {paidCommission.toFixed(2)} | Total Orders:{" "}
          {filteredOrders.length}
        </div>
      )}

      {/* Orders table */}
      {filteredOrders.length > 0 ? (
        <table className="w-full min-w-full text-sm text-gray-700">
          <thead className="bg-gray-400">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Seller Name</th>
              <th className="border p-2">Order Amount</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Commission</th>
              <th className="border p-2">Paid status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.sellerId.username}</td>
                <td className="border p-2">{order.totalPrice}</td>
                {order.status === "Pending" ? (
                  <td className="border p-2 text-yellow-600">{order.status}</td>
                ) : order.status === "Accepted" ? (
                  <td className="border p-2 text-blue-600">{order.status}</td>
                ) : order.status === "Delivered" ? (
                  <td className="border p-2 text-green-600">{order.status}</td>
                ) : (
                  <td className="border p-2 text-red-600">{order.status}</td>
                )}
                <td className="border p-2">{order.comission}</td>
                <td className="border p-2">
                  {order.comissionPaid === "true" ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-600">Unpaid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedSeller && <p>No orders found for this seller.</p>
      )}
    </div>
  );
}

export default AdminCommission;
