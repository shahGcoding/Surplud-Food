import React, { useEffect, useState } from "react";
import { getUserById, updateUserData } from "../../config/config";
import { useSelector } from "react-redux";
import { Button } from "../index";
import { Input } from "../index";

function ManageProfile() {
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
  });

  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState(null); // Track the Appwrite doc ID

  // Fetch and set existing user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getUserById(userId);
        setDocumentId(userDoc._id); // Save doc ID for updates
        setFormData({
          username: userDoc.username || "",
          email: userDoc.email || "",
          phone: userDoc.phone || "",
          businessName: userDoc.businessName || "",
          businessAddress: userDoc.businessAddress || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (!documentId) {
        alert("User document not found.");
        return;
      }

      await updateUserData(documentId, {
        username: formData.username,
        phone: formData.phone,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
      });

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Manage Your Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email (read-only)</label>
          <Input type="email" name="email" value={formData.email} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <Input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <Input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Business Address</label>
          <Input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} />
        </div>

        <Button onClick={handleUpdate} className="mt-4 ml-60 bg-green-500 hover:bg-green-700 hover:cursor-pointer">
          Update Profile
        </Button>
      </div>
    </div>
  );
}

export default ManageProfile;
