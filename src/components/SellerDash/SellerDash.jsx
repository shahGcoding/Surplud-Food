import React from "react";

const SellerDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <header className="bg-white w-full shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Welcome, Seller!</h2>

        {/* Seller Info */}
        <div className="bg-gray-200 p-4 rounded-md">
          <p><strong>Email:</strong> seller@example.com</p>
          <p><strong>Business Name:</strong> ABC Caterers</p>
          <p><strong>Address:</strong> 123 Market Street, City</p>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="bg-blue-500 text-white p-3 rounded-md">Manage Listings</button>
          <button className="bg-green-500 text-white p-3 rounded-md">View Orders</button>
          <button className="bg-yellow-500 text-white p-3 rounded-md">Edit Profile</button>
          <button className="bg-purple-500 text-white p-3 rounded-md">Analytics</button>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
