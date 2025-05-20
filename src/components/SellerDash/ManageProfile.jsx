// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Input, Button } from '../index' // Adjust import paths as needed
// import appwriteService from "../../appwrite/config";

// function SellerProfile() {
//   const userData = useSelector((state) => state.auth.userData);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     businessName: "",
//     businessAddress: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         name: userData.name || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         businessName: userData.businessName || "",
//         businessAddress: userData.businessAddress || "",
//       });
//     }
//   }, [userData]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const updated = await appwriteService.updateUserData(userData?.$id, formData);
//       if (updated) {
//         setMessage("Profile updated successfully.");
//       } else {
//         setMessage("Failed to update profile.");
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage("An error occurred while updating.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-8">
//       <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Manage Profile</h2>
      
//       {message && (
//         <div
//           className={`mb-4 p-3 rounded text-sm ${
//             message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block font-medium mb-1">Full Name</label>
//           <input
//             type="text"
//             name="name"
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Email Address</label>
//           <input
//             type="email"
//             name="email"
//             className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
//             value={formData.email}
//             disabled
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             className="w-full border rounded px-3 py-2"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Business Name</label>
//           <input
//             type="text"
//             name="businessName"
//             className="w-full border rounded px-3 py-2"
//             value={formData.businessName}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="md:col-span-2">
//           <label className="block font-medium mb-1">Business Address</label>
//           <textarea
//             name="businessAddress"
//             className="w-full border rounded px-3 py-2 h-24 resize-none"
//             value={formData.businessAddress}
//             onChange={handleChange}
//           ></textarea>
//         </div>

//         <div className="md:col-span-2 text-right">
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow disabled:opacity-50"
//           >
//             {loading ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default SellerProfile;


import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { Button } from "../index";
import { Input } from "../index";
import { toast } from "react-toastify";

function ManageProfile() {
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.$id;

  const [formData, setFormData] = useState({
    name: "",
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
        const userDoc = await appwriteService.getUserDocumentByUserId(userId);
        setDocumentId(userDoc.$id); // Save doc ID for updates
        setFormData({
          name: userDoc.name || "",
          email: userDoc.email || "",
          phone: userDoc.phone || "",
          businessName: userDoc.businessName || "",
          businessAddress: userDoc.businessAddress || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        toast.error("Failed to load profile.");
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
        toast.error("User document not found.");
        return;
      }

      await appwriteService.updateUserData(documentId, {
        name: formData.name,
        phone: formData.phone,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
      });

      toast.success("Profile updated successfully.");
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
          <Input type="text" name="name" value={formData.name} onChange={handleChange} />
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

        <Button onClick={handleUpdate} className="mt-4 w-full">
          Update Profile
        </Button>
      </div>
    </div>
  );
}

export default ManageProfile;


// import React, { useEffect, useState } from "react";
// import appwriteService from "../../appwrite/config";

// const ManageProfile = () => {
//   const [userId, setUserId] = useState("");
//   const [userDocId, setUserDocId] = useState(""); // For updating
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "seller",
//     businessName: "",
//     businessAddress: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const currentUser = await appwriteService.getCurrentUser();
//         if (currentUser) {
//           setUserId(currentUser.$id);
//           const result = await appwriteService.getUserData(currentUser.$id);
//           if (result) {
//             setUserDocId(result.$id);
//             setUserData({
//               name: result.name || "",
//               email: result.email || "",
//               phone: result.phone || "",
//               role: result.role || "seller",
//               businessName: result.businessName || "",
//               businessAddress: result.businessAddress || "",
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       if (userDocId) {
//         await appwriteService.updateUserData(userDocId, userData);
//         setMessage("Profile updated successfully.");
//       } else {
//         const newUser = await appwriteService.saveUserData(userId, userData);
//         setUserDocId(newUser.$id);
//         setMessage("Profile created successfully.");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setMessage("Failed to update profile.");
//     }
//   };

//   if (loading) return <div className="p-4">Loading profile...</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
//       <h2 className="text-2xl font-bold mb-6">Manage Your Profile</h2>

//       {message && (
//         <div className="mb-4 text-sm text-green-600 font-medium">{message}</div>
//       )}

//       <form onSubmit={handleUpdate} className="space-y-4">
//         <div>
//           <label className="block font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             className="w-full border rounded p-2 mt-1"
//             value={userData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             className="w-full border rounded p-2 mt-1"
//             value={userData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             className="w-full border rounded p-2 mt-1"
//             value={userData.phone}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Business Name</label>
//           <input
//             type="text"
//             name="businessName"
//             className="w-full border rounded p-2 mt-1"
//             value={userData.businessName}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Business Address</label>
//           <textarea
//             name="businessAddress"
//             className="w-full border rounded p-2 mt-1"
//             rows="3"
//             value={userData.businessAddress}
//             onChange={handleChange}
//           />
//         </div>

//         <button
//           type="submit"
//           className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           {userDocId ? "Update Profile" : "Create Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ManageProfile;
