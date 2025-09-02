import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api/v1", withCredentials: true });

// USER APIs........

// Register User
export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data?.data;
};

export const verifyEmail = async (data) => {
  const res = await API.post("/users/verifyemail", data);
  return res.data?.data;
}

export const forgotPassword = async (data) => {
  const res = await API.post("/users/forgotpassword", data);
  return res.data;
}

export const resetPassword = async (token,data) => {
  const res = await API.post(`/users/resetpassword/${token}`, data);
  return res.data;
} 

// Login User
export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);
  return res.data?.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const res = await API.get("/users/getcurrentuser");
  return res.data?.data;
};

export const updateUserData = async (id, updatedData) =>{
  const res = await API.put(`/users/updateuserdata/${id}`, updatedData);
  return res.data?.data;
}

export const getUserById = async (id) => {
  const res = await API.get(`/users/getuserbyid/${id}`);
  return res.data?.data;  
}

export const getUserRole = async (id) => {
  const res = await API.get(`/users/getuserrole/${id}/role`);
  return res.data?.data;
}

// Get All Users (Admin only)
export const getAllUsers = async () => {
  const res = await API.get("/users/getallusers");
  return res.data?.data
};

// Logout
export const logoutUser = async () => {
  const res = await API.post("/users/logout", {});
  return res.data?.data;
};

// Refresh Token
export const refreshAccessToken = async () => {
  const res = await API.post("/users/refresh-token");
  return res.data?.data;
};



//   FOOD APIs


// Create Food Listing
export const createFoodPost = async (data) => {
  const res = await API.post("/foods/foodpost", data);
  return res.data?.data;
};

// Get All Foods
export const getAllFoodPosts = async () => {
  const res = await API.get("/foods/getallfoodposts");
  return res.data?.data;
};

export const getPostsByUser = async (userId) => {
  try {
    const res = await API.get(`/foods/getfoodpostsbyuser/${userId}`); 
    return res.data?.data;
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    return [];
  }
};

export const getAllFoodPostsForAdmin = async () => {
  const res = await API.get("/foods/getallfoodpostsforadmin");
  return res.data?.data;
}

export const getFilteredFoodPosts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const res = await API.get(`/foods/getallfoodposts?${queryParams}`);
    return res.data?.data;
  } catch (error) {
    console.error("Error fetching filtered food posts:", error);
    throw error.response?.data || error;
  }
};

// Get Food by ID
export const getFoodPostById = async (id) => {
  const res = await API.get(`/foods/getfoodpostbyid/${id}`);
  return res.data?.data;
};

export const getListingsBySeller = async (sellerId) => {
  const res = await API.get(`/foods/getlistingsbyseller/${sellerId}`);
  return res.data?.data;
}

// Update Food
export const updateFoodPost = async (id, data ) => {
  const res = await API.put(`/foods/updatefoodpost/${id}`, data);
  return res.data?.data;
};

// Delete Food
export const deleteFoodPost = async (id) => {
  const res = await API.delete(`/foods/deletefoodpost/${id}`);
  return res.data?.data;
};

// Upload File (Image)
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("featuredImage", file);

    const res = await API.post("/foods/uploadfile", formData);

    return res.data?.data; 
  } catch (error) {
    console.error("Upload featuredImage error:", error);
    throw error.response?.data || error;
  }
};

// Delete File (Image)
export const deleteFile = async (publicId) => {
  try {
    const res = await API.delete(`/foods/deletefile/${publicId}`);

    return res.data; 
  } catch (error) {
    console.error("Delete file error:", error);
    throw error.response?.data || error;
  }
};




// Place Order
export const placeOrder = async (data ) => {
  const res = await API.post("/orders/postorder", data);
  return res.data;
};

// Get Orders (Buyer)
export const getOrderByBuyerId = async (buyerId) => {
  const res = await API.get(`/orders/getorderbybuyerid/${buyerId}`);
  return res.data?.data;
};

// Get Orders (Seller)
export const getOrderBySellerId = async (sellerId) => {
  const res = await API.get(`/orders/getorderbysellerid/${sellerId}`);
  return res.data?.data || [];
};

// Update Order Status
export const updateOrderStatus = async (id, status ) => {
  const res = await API.put(`/orders/updateorderstatus/${id}`, { status });
  return res.data?.data;
};

export const updateCommissionStatus = async (id) => {
  const res = await API.put(`/orders/updatecommisionstatus/${id}`);
  return res.data?.data;
}

export const getAllOrders = async() => {
  const res = await API.get("/orders/getallorders");
  return res.data?.data;
}



//   COMPLAINT APIs


// File Complaint
export const postComplaint = async (data) => {
  const res = await API.post("/complaints/postcomplaint", data);
  return res.data;
};

// Get All Complaints (Admin only)
export const getAllComplaints = async () => {
  const res = await API.get("/complaints/getallcomplaint");
  return res.data?.data;
};

// Update Complaint Status
export const updateComplaintStatus = async (id, status) => {
  const res = await API.put(`/complaints/updatecomplaintstatus/${id}`, { status });
  return res.data?.data;
};

export const deleteComplaint = async (id) => {
  const res = await API.delete(`/complaints/deletecomplaint/${id}`);
  return res.data?.data;   
}



//   MESSAGE APIs


// Send Message
export const postMessage = async (data) => {
  const res = await API.post("/messages/postmessage", data);
  return res.data;
};

// Get Messages (for Seller)
export const getMessageForSeller = async ( sellerId) => {
  const res = await API.get(`/messages/getmessageforseller/${sellerId}`);
  return res.data?.data;
};

// Mark Message as Read
export const markMessageAsRead = async (id, ) => {
  const res = await API.put(`/messages/markmessageasread/${id}`, {});
  return res.data?.data;
};
