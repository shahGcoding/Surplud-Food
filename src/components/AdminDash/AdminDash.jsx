import React, { useEffect, useState } from "react";
import { BsPerson, BsShop, BsBag, BsCardList } from "react-icons/bs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { getAllUsers, getAllOrders, getAllFoodPostsForAdmin } from "../../config/config";

function AdminDash() {
  const [sellers, setsellers] = useState(0);
  const [buyers, setbuyers] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await getAllUsers();
        const users = response || [];
        const sellerCount = users.filter(
          (users) => users.role === "seller"
        ).length;
        const buyerCount = users.filter(
          (users) => users.role === "buyer"
        ).length;

        const totalListing = await getAllFoodPostsForAdmin();
        const totalOrder = await getAllOrders();

        setsellers(sellerCount);
        setbuyers(buyerCount);
        setTotalListings(totalListing.length);
        setTotalOrders(totalOrder.length);

        // for chart

        const orders = totalOrder;
        const past7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return format(date, "yyyy-MM-dd");
        }).reverse();

        const dailyCounts = past7Days.map((day) => {
          const count = orders.filter((order) =>
            order?.createdAt?.startsWith(day)
          ).length;
          return {
            date: format(new Date(day), "EEE"),
            orders: count,
          };
        });

        setWeeklyOrders(dailyCounts);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <div className="text-3xl font-bold text-gray-800">Dashboard</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatsCard
          icon={<BsPerson size={26} />}
          label="Buyer"
          value={buyers}
          color="text-blue-600"
        />
        <StatsCard
          icon={<BsShop size={26} />}
          label="seller"
          value={sellers}
          color="text-green-600"
        />
        <StatsCard
          icon={<BsBag size={26} />}
          label="Total Listings"
          value={totalListings}
          color="text-yellow-500"
        />
        <StatsCard
          icon={<BsCardList size={26} />}
          label="Total Orders"
          value={totalOrders}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white mt-10 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Weekly Orders
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={weeklyOrders}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorOrders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

const StatsCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
    <div className={`flex items-center gap-3 ${color}`}>
      {icon}
      <h3 className="text-md font-semibold">{label}</h3>
    </div>
    <h1 className="text-3xl font-bold mt-2 text-gray-800">{value}</h1>
  </div>
);

export default AdminDash;
