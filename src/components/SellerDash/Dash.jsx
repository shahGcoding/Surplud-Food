import React, { useEffect, useState } from "react";
import {BsFillBoxSeamFill,BsClipboardCheck,BsPeopleFill,BsCheckCircle} from "react-icons/bs";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,LineChart,Line} from 'recharts';
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";

const Dash = () => {
  const { userData } = useSelector((state) => state.auth);
  const sellerId = userData?.$id;
  
  const [listings, setListings] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [buyers, setBuyers] = useState(0);

  const data = [
    { name: "Mon", completed: 8, pending: 4 },
    { name: "Tue", completed: 5, pending: 3 },
    { name: "Wed", completed: 9, pending: 6 },
    { name: "Thu", completed: 7, pending: 2 },
    { name: "Fri", completed: 4, pending: 5 },
    { name: "Sat", completed: 10, pending: 1 },
    { name: "Sun", completed: 6, pending: 3 },
  ];

  const fetchDashboardData = async () => {
    if (!sellerId) return;

    try {
      // Fetch Listings
      const listingRes = await appwriteService.getPostsByUser(sellerId);
      const listing = listingRes?.documents?.length || 0;
      setListings(listing);

      // Fetch Orders
      const orders = await appwriteService.getOrdersBySeller(sellerId);

      const pending = orders.filter((o) => o.status === "Pending").length;
      const completed = orders.filter((o) => o.status === "Completed").length;
      const uniqueBuyers = new Set(orders.map((o) => o.buyerId));

      setPendingOrders(pending);
      setCompletedOrders(completed);
      setBuyers(uniqueBuyers.size);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [sellerId]);

  return (
    <main className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="text-3xl font-bold text-gray-800">📊 Dashboard</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={<BsFillBoxSeamFill size={26} />} label="Listings" value={listings} color="text-blue-600" />
        <StatsCard icon={<BsClipboardCheck size={26} />} label="Pending Orders" value={pendingOrders} color="text-yellow-500" />
        <StatsCard icon={<BsCheckCircle size={26} />} label="Completed Orders" value={completedOrders} color="text-green-600" />
        <StatsCard icon={<BsPeopleFill size={26} />} label="Buyers" value={buyers} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md h-[300px]">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Weekly Orders - Bar Chart</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#facc15" />
              <Bar dataKey="completed" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md h-[300px]">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Weekly Orders - Line Chart</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke="#facc15" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="completed" stroke="#4ade80" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

const StatsCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
    <div className={`flex items-center gap-3 ${color}`}>
      {icon}
      <h3 className="text-md font-semibold">{label}</h3>
    </div>
    <h1 className="text-3xl font-bold mt-2 text-gray-800">{value}</h1>
  </div>
);

export default Dash;

