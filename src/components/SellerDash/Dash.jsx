import React, { useEffect, useState } from "react";
import {
  BsFillBoxSeamFill,
  BsClipboardCheck,
  BsPeopleFill,
  BsCheckCircle,
} from "react-icons/bs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  getUserById,
  getCurrentUser,
  getPostsByUser,
  getOrderBySellerId,
} from "../../config/config";

const Dash = () => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [listings, setListings] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [chartData, setChartData] = useState([]);

  // Fetch user and dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
  
        const session = await getCurrentUser();
        console.log("session", session);

        const doc = await getUserById(session._id);
        setUser(doc);

        await fetchDashboardData(doc._id);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchData();
  }, []);

  const fetchDashboardData = async (sellerId) => {
    if (!sellerId) return;

    try {
      // Listings
      const listing = await getPostsByUser(sellerId);
      console.log("listing", listing);
      setListings(listing.length || 0);

      // Orders
      const orderRes = await getOrderBySellerId(sellerId);
      const orders = orderRes;

      setPendingOrders(orders.filter((o) => o.status === "Pending").length);
      setCompletedOrders(orders.filter((o) => o.status === "Delivered").length);

      const uniqueBuyers = new Set(orders.map((o) => o.buyerId));
      setBuyers(uniqueBuyers.size);

      // Chart Data
      const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekData = {
        Sun: { name: "Sun", completed: 0, pending: 0 },
        Mon: { name: "Mon", completed: 0, pending: 0 },
        Tue: { name: "Tue", completed: 0, pending: 0 },
        Wed: { name: "Wed", completed: 0, pending: 0 },
        Thu: { name: "Thu", completed: 0, pending: 0 },
        Fri: { name: "Fri", completed: 0, pending: 0 },
        Sat: { name: "Sat", completed: 0, pending: 0 },
      };

      orders.forEach((order) => {

        if(!order.$createdAt) return;

        const createdAt = new Date(order.$createdAt);
        const dayName = daysMap[createdAt.getDay()];

         if (!weekData[dayName]) return;

        if (order.status === "Pending") {
          weekData[dayName].pending += 1;
        } else if (order.status === "Delivered") {
          weekData[dayName].completed += 1;
        }
      });

      const orderedWeekData = daysMap.map((day) => weekData[day]);
      setChartData(orderedWeekData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  if (isLoadingUser) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  return (
    <main className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="text-3xl font-bold text-gray-800">Dashboard</div>

      {user?.status === "inactive" && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          Your account is currently blocked. Limited access.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<BsFillBoxSeamFill size={26} />}
          label="Listings"
          value={listings}
          color="text-blue-600"
        />
        <StatsCard
          icon={<BsClipboardCheck size={26} />}
          label="Pending Orders"
          value={pendingOrders}
          color="text-yellow-500"
        />
        <StatsCard
          icon={<BsCheckCircle size={26} />}
          label="Completed Orders"
          value={completedOrders}
          color="text-green-600"
        />
        <StatsCard
          icon={<BsPeopleFill size={26} />}
          label="Buyers"
          value={buyers}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md h-[300px]">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Weekly Orders - Line Chart
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
