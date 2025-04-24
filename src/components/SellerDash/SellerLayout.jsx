import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LogoutBtn } from '../index';
import { useSelector } from "react-redux";

const SellerLayout = () => {
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-300 text-black p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Seller Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink to="/seller/dashboard" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-400"}>🏠 Dashboard</NavLink>
          <NavLink to="/add-post" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-400"}>🍱 My Listings</NavLink>
          <NavLink to="/seller/listings" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-400"}>➕ Add New Listing</NavLink>
          <NavLink to="/seller/order" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-400"}>🧾 Orders</NavLink>
          <NavLink to="/seller/profile" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-400"}>👤 Manage Profile</NavLink>
          <NavLink to="/seller/messages" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-400"}>💬 Messages</NavLink>
          {authStatus && <LogoutBtn />}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
