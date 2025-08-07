import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
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
      const response = await appwriteService.getAllUsers();
      const user = response.documents || [];
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
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
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

      <div className="grid grid-cols-6 gap-4 bg-gray-300 text-gray-800 font-semibold px-4 py-4 ">
        <p className="font-bold">User</p>
        <p className="font-bold">Name</p>
        <p className="font-bold">Email</p>
        <p className="font-bold">Role</p>
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
              key={user.$id}
              className="grid grid-cols-6 gap-4 border border-green-200 bg-white shadow-sm px-4 py-3"
            >
              {/*  <div
            //   key={user.$id}
            //   onClick={() => {
            //     setSelectedUser(user);
            //     setEditForm({
            //       name: user.name || "",
            //       email: user.email || "",
            //       role: user.role || "",
            //       status: user.status || "",
            //     });
            //   }}
            //   className="grid grid-cols-6 gap-4 border border-green-200 cursor-pointer hover:bg-gray-100 transition px-4 py-3"
            // > */}
              <p className="text-gray-600">{user.$id}</p>
              <p className="text-gray-600">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.role}</p>
              <p className="text-gray-600">
                {new Date(user.$createdAt).toLocaleDateString()}
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
                    const newStatus = user.status === "active" ? "inactive" : "active";
                    try {
                      await appwriteService.updateUser(user.$id, {status: newStatus,});
                      fetchUsers(); // refresh list
                    } catch (error) {
                      console.error("Failed to update status:", error);
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded ${
                    user.status === "active"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {user.status === "active" ? "Block" : "Unblock"}
                </button>
              </div>
            </div>
          ))}

          {/* Edit User Form */}

          {/* {selectedUser && (
                <div className="mt-8 p-6 border rounded-md bg-white shadow-md max-w-xl">
                  <h2 className="text-xl font-semibold mb-4">
                    Edit User: {selectedUser.name}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Role</label>
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await appwriteService.updateUser(
                            selectedUser.$id,
                            editForm
                          );
                          fetchUsers(); // refresh user list
                          setSelectedUser(null);
                        } catch (err) {
                          console.error("Error updating user:", err);
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )} */}
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
