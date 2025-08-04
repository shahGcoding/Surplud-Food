import React from 'react'
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { DarkMode, LogoutBtn } from '../index';

function AdminLayout() {

  const authStatus = useSelector((state) => state.auth.status);
  const role = useSelector((state) => state.auth.role);

   const navLinkStyle = ({ isActive }) =>
    `flex items-center mb-4 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100 hover:text-green-700"
    }`;

  return (
    <div className='flex h-screen'>
      <div className='right-full'>
        <DarkMode />
      </div>
      <aside className="w-64 bg-green-50 border-r border-green-200 p-5 shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-8">Admin Panel</h2>
        <NavLink to={"/admin/maindashboard"} className={navLinkStyle}>
          🏠 <span className="ml-2">Dashboard</span>
        </NavLink>
        <NavLink to={"/admin/usermanage"} className={navLinkStyle}>
          👥 <span className="ml-2">Manage Users</span>
        </NavLink>
        <NavLink to={"/admin/listingmanage"} className={navLinkStyle}>
          🍱 <span className="ml-2">Manage Listings</span>
        </NavLink>
        <NavLink to={"/admin/complainthandle"} className={navLinkStyle}>
          📋 <span className="ml-2">Handle Complaints</span>
        </NavLink>
        <NavLink to={"/admin/reportgenerate"} className={navLinkStyle}>
          📊 <span className="ml-2">Generate Report</span>
        </NavLink>

        {
          authStatus && role === 'admin' && (
            
            <div className={` pt-2 mt-52 border-t border-green-300`}>
              <LogoutBtn />
            </div>
          )
        }

        </aside>

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet/>
        </main>

      </div>
  )
}

export default AdminLayout