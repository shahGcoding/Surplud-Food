// import React, { useState, useEffect } from "react";
// import appwriteService from "../../appwrite/config";
// import { useSelector } from "react-redux";

// function AdminComission() {
//   const [commission, setCommission] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sellers, setSellers] = useState([]);
//   const [selectedSeller, setSelectedSeller] = useState("");

//   const userData = useSelector((state) => state.auth.status);
//   const sellerId = userData?.$id;

//   const fetchCommissions = async () => {
//     setLoading(true);
//     try {
//       const session = await appwriteService.getAllOrders();
//       const orders = session?.documents || [];

//       //Extract seller for filter
//       const sellerList = [
//         ...new Set(orders.map((o) => o.sellerId)),
//       ];
//       setSellers(sellerList);

//       const deliveredOrders = orders.filter(
//         (o) => o.status === "Delivered" && o.commission
//       );
//       setCommission(deliveredOrders);

//     } catch (error) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCommissions();
//   }, []);

//   const filteredData = selectedSeller
//     ? commission.filter((o) => o.sellerId === selectedSeller)
//     : commission;

//   const totalCommission = filteredData.reduce(
//     (sum, c) => sum + (c.commissionAmount || 0),
//     0
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Commission Management</h1>

//       {loading ? (
//         <p>Loading commissions...</p>
//       ) : (
//         <>
//           <div className="flex items-center mb-4 gap-4">
//             <label>Filter by Seller</label>
//             <select
//               value={selectedSeller}
//               onChange={(e) => setSelectedSeller(e.target.value)}
//               className="border px-3 py-2 rounded-md focus:border-green-300"
//             >
//               <option value="">All sellers</option>
//               {sellers.map((id) => (
//                 <option key={id} value={id}>
//                   {id}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-4 font-bold text-lg">
//             Total Commission: Rs. {totalCommission.toFixed(2)}
//           </div>

//           {/* Commission Table */}
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full text-sm text-gray-700">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-2 px-4">Order ID</th>
//                   <th className="py-2 px-4">Seller ID</th>
//                   <th className="py-2 px-4">Total Amount</th>
//                   <th className="py-2 px-4">Commission %</th>
//                   <th className="py-2 px-4">Commission Amount</th>
//                   <th className="py-2 px-4">Paid Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((order) => (
//                     <tr key={order.$id} className="border-b">
//                       <td className="py-2 px-4">{order.$id}</td>
//                       <td className="py-2 px-4">{order.sellerId}</td>
//                       <td className="py-2 px-4">Rs. {order.totalAmount}</td>
//                       <td className="py-2 px-4">10%</td>
//                       <td className="py-2 px-4 text-green-600 font-semibold">
//                         Rs. {order.comission}
//                       </td>
//                       <td className="py-2 px-4">
//                         {order.comissionPaid === "true" ? (
//                           <span className="text-green-500 font-bold">Paid</span>
//                         ) : (
//                           <span className="text-red-500 font-bold">Unpaid</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="py-4 text-center text-gray-500">
//                       No commission data found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//     </div>
//   );
// }

// export default AdminComission;

import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";

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
        const res = await appwriteService.getAllOrders();
        setOrders(res.documents);

        // Extract unique seller IDs from orders
        const uniqueSellerIds = [
          ...new Set(res.documents.map((order) => order.sellerId)),
        ];

        // Fetch sellers' emails
        const sellerDetails = await Promise.all(
          uniqueSellerIds.map(async (id) => {
            const sellerDoc = await appwriteService.getUserById(id);
            return {
              id,
              email: sellerDoc.email || "Unknown Email",
            };
          })
        );

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
        (order) => order.sellerId === selectedSeller
      );
      setFilteredOrders(filtered);

      // Calculate total commission for selected seller
      const total = filtered.reduce(
        (sum, order) => sum + (Number(order.comission) || 0),
        0
      );
      setTotalCommission(total);

      const Paid = filtered
        .filter((order) => order.comissionPaid === "true")
        .reduce((sum, o) => sum + (Number(o.comission) || 0),
        0
    );
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
        className="border-gray-400 border p-2 rounded mb-4 focus:border-green-400"
        value={selectedSeller}
        onChange={(e) => setSelectedSeller(e.target.value)}
      >
        <option value="">Select Seller</option>
        {sellers.map((seller) => (
          <option key={seller.id} value={seller.id}>
            {seller.email}
          </option>
        ))}
      </select>

      {/* for total commision */}
      {selectedSeller && (
        <div className="mb-4 font-semibold text-lg">
          Total Commission: Rs. {totalCommission.toFixed(2)} | Paid Commision: {paidCommission.toFixed(2)}
          Rs.
        </div>
      )}

      {/* Orders table */}
      {filteredOrders.length > 0 ? (
        <table className="w-full min-w-full text-sm text-gray-700">
          <thead className="bg-gray-400">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Seller Name</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Commission</th>
              <th className="border p-2">Paid status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.$id}>
                <td className="border p-2">{order.$id}</td>
                <td className="border p-2">{order.sellerName}</td>
                <td className="border p-2">{order.totalPrice}</td>
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
