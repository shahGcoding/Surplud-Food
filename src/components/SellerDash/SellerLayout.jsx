import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LogoutBtn } from '../index';
import { useSelector } from "react-redux";

const SellerLayout = () => {
  const authStatus = useSelector((state) => state.auth.status);

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
          <NavLink to="/" className={navLinkStyle}>
            🍱 <span className="ml-2">My Listings</span>
          </NavLink>
          <NavLink to="/seller/listings" className={navLinkStyle}>
            ➕ <span className="ml-2">Add New Listing</span>
          </NavLink>
          <NavLink to="/seller/order" className={navLinkStyle}>
            🧾 <span className="ml-2">Orders</span>
          </NavLink>
          <NavLink to="/seller/message" className={navLinkStyle}>
            💬 <span className="ml-2">Messages</span>
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
