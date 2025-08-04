import React,{useState, useEffect} from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LogoutBtn } from '../index';
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";

const SellerLayout = () => {
  const authStatus = useSelector((state) => state.auth.status);

  const userData = useSelector((state) => state.auth.userData);
  const sellerId = userData?.$id;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {

    const fetchMessages = async () => {
      
      try {

        if (!sellerId) return;

        const response = await appwriteService.messageFromBuyer(sellerId);
        // const allMessages = response.documents || [];
        const unreadMessages = response.documents.filter((msg) => msg.status === "Unread").length;

        console.log("Unread messages count:", unreadMessages);

      setUnreadCount(unreadMessages);

      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    if (sellerId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [sellerId]);


  const navLinkStyle = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100 hover:text-green-700"
    }`;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-50 border-r border-green-200 p-5 shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-8">Seller Panel</h2>
        <nav className="flex flex-col gap-3">
          <NavLink to="/seller/dashboard" className={navLinkStyle}>
            🏠 <span className="ml-2">Dashboard</span>
          </NavLink>
          <NavLink to="/seller/mylisting" className={navLinkStyle}>
            🍱 <span className="ml-2">My Listings</span>
          </NavLink>
          <NavLink to="/seller/listings" className={navLinkStyle}>
            ➕ <span className="ml-2">Add New Listing</span>
          </NavLink>
          <NavLink to="/seller/order" className={navLinkStyle}>
            🧾 <span className="ml-2">Orders</span>
          </NavLink>
          <NavLink to="/seller/message" className={`${navLinkStyle} relative`}>
            💬 <span className="ml-2">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute t-0 left-40 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>
          {authStatus && (
            <div className="pt-4 mt-52 border-t border-green-200">
              <LogoutBtn />
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
