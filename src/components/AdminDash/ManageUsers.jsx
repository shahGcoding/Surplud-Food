import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserData } from "../../config/config";
import { BsSearch, BsArrowBarDown } from "react-icons/bs";
import { Input } from "../../components";

function ManageUsers() {

  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();

      const user = response.filter((u) => u.role !== "admin") || []; // remove admin account

      setUsers(user);
      setFilteredResults(user);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredResults(users);
      return;
    } else {
      const results = users.filter(
        (user) =>
          user.role !== "admin" && (
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredResults(results);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="">
      <h1 className="text-3xl font-bold ">Users({filteredResults.length})</h1>
      <div className="relative w-52 max-w-sm m-4 ">
        <BsSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      <div className="grid grid-cols-6 gap-6 bg-gray-300 text-gray-800 font-semibold px-4 py-4 ">
        <p className="font-bold">UserId</p>
        <p className="font-bold ml-12">Name</p>
        <p className="font-bold">Email</p>
        <p className="font-bold ml-7">Role</p>
        <p className="flex items-center gap-1">
          Created <BsArrowBarDown />{" "}
        </p>
        <p className="font-bold">Status</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div>
          {filteredResults.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-6 gap-6 border border-green-200 bg-white shadow-sm px-4 py-3"
            >

              <p className="text-gray-600">{user._id}</p>
              <p className="text-gray-600 ml-12">{user.username}</p>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 ml-7">{user.role}</p>
              <p className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {/* <p className="text-gray-600">{user.status}</p> */}

              <div className="flex items-center gap-2">
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    user.status === "active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {user.status}
                </span>

                <button
                  onClick={async () => {
                    let newStatus;
                    
                    if (user.status === "pending") {
                      newStatus = "active"; // approving seller
                    } else if (user.status === "active") {
                      newStatus = "inactive"; // blocking seller
                    } else {
                      newStatus = "active"; // unblocking seller
                    }

                    try {
                      await updateUserData(user._id, {status: newStatus});
                      fetchUsers(); // refresh list after update
                    } catch (error) {
                      console.error("Failed to update status:", error);
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded ${
                    user.status === "active"
                      ? "bg-red-500 text-white hover:bg-red-600" // Block button
                      : user.status === "pending"
                      ? "bg-green-500 text-white hover:bg-green-600" // Approve button
                      : "bg-green-500 text-white hover:bg-green-600" // Unblock button
                  }`}
                >
                  {user.status === "active"
                    ? "Block"
                    : user.status === "pending"
                    ? "Approve"
                    : "Unblock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
