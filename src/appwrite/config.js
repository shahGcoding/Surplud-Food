import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    price,
    quantity,
    userId,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          price,
          quantity,
          userId,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async postOrder({
    sellerId,
    sellerName,
    buyerName,
    buyerId,
    foodTitle,
    quantity,
    totalPrice,
    paymentMethod,
    status,
    orderDate,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        ID.unique(), // Use unique ID for each order
        {
          sellerId,
          buyerName,
          buyerId,
          foodTitle,
          quantity,
          totalPrice,
          paymentMethod,
          status,
          orderDate,
          sellerName,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async postComplaint({
    buyerId,
    buyerName,
    sellerId,
    messageBy,
    sellerName,
    buyerRole,
    sellerRole,
    orderId,
    message,
    status,
    createdAt,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteComplaintsCollectionId,
        ID.unique(),
        {
          buyerId,
          buyerName,
          sellerId,
          sellerName,
          buyerRole,
          sellerRole,
          orderId,
          messageBy,
          message,
          status,
          createdAt,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async postMessage({
    sellerId,
    buyerId,
    buyerName,
    orderId,
    message,
    dateSent,
    status,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteMessagesCollectionId,
        ID.unique(), // Use unique ID for each message
        {
          sellerId,
          buyerId,
          buyerName,
          orderId,
          message,
          dateSent,
          status,
        }
      );
    } catch (error) {
      console.error("Error posting message:", error);
      throw error;
    }
  }

  async messageFromBuyer(sellerId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteMessagesCollectionId,
        [
          Query.equal("sellerId", sellerId),
          Query.orderDesc("$createdAt"), // Assuming you want the latest messages first
        ]
      );
    } catch (error) {
      console.error("Error fetching messages from buyer:", error);
      throw error;
    }
  }

  async markMessageAsRead(messageId) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteMessagesCollectionId,
        messageId,
        { status: "Read" } // Assuming you want to update the status to "Read"
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }

  async getOrdersBySellerId(sellerId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        [Query.equal("sellerId", sellerId), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        orderId,
        { status: newStatus }
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  async getOrdersByBuyer(buyerName) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        [Query.equal("buyerName", buyerName)]
      );
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(orderId, data) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        orderId,
        data,
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePost(slug, updates) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        updates
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
      return false;
    }
  }

  async getAllComplaints() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteComplaintsCollectionId
      );
    } catch (error) {
      throw error;
    }
  }

  async getPostsForAdmin() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
      return false;
    }
  }

  async getPostsByUser(userId) {
    try {
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)]
      );
      return res;
    } catch (error) {
      console.log("Appwrite service :: getPostsByUser :: error", error);
      return { documents: [] }; // Return empty array instead of false
    }
  }

  async getOrdersBySeller(sellerId) {
    try {
        return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId,
        [Query.equal("sellerId", sellerId)]
      );
    } catch (error) {
      console.log("Appwrite service :: getOrdersBySeller :: error", error);
      return [];
    }
  }

  async getListingsBySeller(sellerId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", sellerId)]
      );
    } catch (error) {
      console.error("Error fetching listings by seller:", error);
      throw error;
    }
  }

  // async saveUserData(userId, userData) {
  //   try {
  //     console.log("Saving User Data:", userData);

  //     // Check if the user already exists
  //     const existingUsers = await this.databases.listDocuments(
  //       conf.appwriteDatabaseId,
  //       conf.appwriteUserCollectionId,
  //       [Query.equal("userId", userId)]
  //     );

  //     if (existingUsers.total > 0) {
  //       console.log("User already exists in the database.");
  //       return existingUsers.documents[0];
  //     }

  //     // Create a new user document
  //     return await this.databases.createDocument(
  //       conf.appwriteDatabaseId,
  //       conf.appwriteUserCollectionId,
  //       ID.unique(),
  //       {
  //         userId,
  //         name: userData.name,
  //         email: userData.email,
  //         phone: userData.phone || "",
  //         role: userData.role || "buyer",
  //         status: userData.status || "",
  //         businessName: userData.businessName || "",
  //         businessAddress: userData.businessAddress || "",
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error saving user data:", error);
  //     throw error;
  //   }
  // }

  async saveUserData(userId, userData) {
  try {
    const existingUsers = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteUserCollectionId,
      [Query.equal("userId", userId)]
    );

    if (existingUsers.total > 0) {
      return existingUsers.documents[0];
    }

    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteUserCollectionId,
      ID.unique(),
      {
        userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        role: userData.role || "buyer",
        status: userData.status || "",
        businessName: userData.businessName || "",
        businessAddress: userData.businessAddress || "",
        latitude: userData.latitude || "",
        longitude: userData.longitude || ""
      }
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
}


  async updateUserData(documentId, updatedData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        documentId,
        updatedData
      );
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  async updateComplaintStatus(complaintId, status) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteComplaintsCollectionId,
        complaintId,
        { status }
      );
    } catch (error) {
      throw error;
    }
  }

  deleteComplaint(complaintId) {
    try {
      return this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteComplaintsCollectionId,
        complaintId
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserDocumentByUserId(userId) {
    try {
      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        [Query.equal("userId", userId)]
      );

      if (result.total > 0) {
        return result.documents[0]; // First matching document
      } else {
        throw new Error("User document not found.");
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      throw error;
    }
  }

  async getUserRole(userId) {
    try {
      const userDoc = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        [Query.equal("userId", userId)]
      );
      return userDoc.total > 0 ? userDoc.documents[0].role : "buyer"; // Default to "buyer" if no role found
    } catch (error) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  }

  // In appwrite/config.js or wherever your appwriteService is
  async getUserById(userId) {
    return this.databases
      .listDocuments(conf.appwriteDatabaseId, conf.appwriteUserCollectionId, [
        Query.equal("userId", userId),
      ])
      .then((res) => res.documents[0]);
  }

  async getAllUsers() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        [Query.limit(100), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteOrderCollectionId
      );
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  }

  async updateUser(userId, data) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        userId,
        data
      );
    } catch (error) {
      throw error;
    }
  }

  async getListingByAllSeller() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
    } catch (error) {
      console.error("Error fetching listings by all sellers:", error);
      throw error;
    }
  }

  async getFilteredPosts(queries) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
      throw error;
    }
  }

  //file upload method

  async uploadFile(file) {
    try {
      const uploadFile = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      return uploadFile;
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
      return false;
    }
  }

  // getFilePreview(fileId){
  //     return this.bucket.getFilePreview(
  //         conf.appwriteBucketId,
  //         fileId
  //     )
  // }

  //   getFileView(fileId) {
  //     if (!fileId) return null;
  //     return this.bucket.getFileView(conf.appwriteBucketId, fileId).href;
  // }

  getFileURL(fileId) {
    if (!fileId) return null;
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
