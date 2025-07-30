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

  async createPost({ title, slug, content, featuredImage, status, price, quantity, userId }) {
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

  async postOrder({ sellerId, sellerName, buyerName, buyerId, foodTitle, quantity, totalPrice, status, orderDate}){
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
          status,
          orderDate,
          sellerName,
        }
      );
      
    } catch (error) {
      throw error;
    }
  }

  async postMessage({ sellerId, buyerId, buyerName, orderId, message, dateSent, status}) {

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
      )
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
          Query.orderDesc("$createdAt") // Assuming you want the latest messages first
        ]
      )
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
      )
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
        [
          Query.equal("sellerId", sellerId),
           Query.orderDesc("$createdAt")
        ]
      );
    }
    catch (error) {
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

  //   const DB_ID = conf.appwriteDatabaseId;
  //   const ORDER_COLLECTION_ID = conf.appwriteOrderCollectionId;

  //   try {
      
  //   // Step 1: Get the current order
  //   const order = await this.databases.getDocument(DB_ID, ORDER_COLLECTION_ID, orderId);

  //   // Step 2: Update the status with all required fields preserved
  //   const updatedOrder = await this.databases.updateDocument(DB_ID, ORDER_COLLECTION_ID, orderId, {
  //     buyerId: order.buyerId,
  //     sellerId: order.sellerId,
  //     postId: order.postId,
  //     quantity: order.quantity,
  //     price: order.price,
  //     status: newStatus,
  //   });

  //   return updatedOrder;
  // } catch (error) {
  //   console.error("❌ Error updating order status:", error);
  //   throw error;
  // }
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


  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Appwirte service :: createPost :: error", error);
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
    const res = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteOrderCollectionId,
      [Query.equal("sellerId", sellerId)]
    );
    return res.documents;
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
      )
    } catch (error) {
      console.error("Error fetching listings by seller:", error);
      throw error;
    }
  }

    

  //save user data

  // async saveUserData(userId, userData) {
  //     try {

  //         console.log("Saving User Data:", userData);

  //         // Check if the user already exists in the collection
  //         const existingUsers = await this.databases.listDocuments(
  //             conf.appwriteDatabaseId,
  //             conf.appwriteUserCollectionId,
  //             [Query.equal("email", userData.email)] // Check if the same userId exists
  //         );

  //         if (existingUsers.total > 0) {
  //             console.log("User already exists in the database.");
  //             return existingUsers.documents[0];  // Return existing user data
  //         }

  //         // If the user does not exist, create a new record
  //         return await this.databases.createDocument(
  //             conf.appwriteDatabaseId,
  //             conf.appwriteUserCollectionId,
  //             ID.unique(),  // Ensure a unique document ID

  //             {
  //             userId,
  //             name: userData.name,
  //             email: userData.email,
  //             phone: userData.phone || "",  // Ensure it's not undefined
  //             role: userData.role || "",
  //             businessName: userData.businessName || "",
  //             businessAddress: userData.businessAddress || ""
  //             }
  //         );
  //     } catch (error) {
  //         console.error("Error saving user data:", error);
  //         throw error;
  //     }
  // }

  async saveUserData(userId, userData) {
    try {
      console.log("Saving User Data:", userData);

      // Check if the user already exists
      const existingUsers = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        [Query.equal("userId", userId)]
      );

      if (existingUsers.total > 0) {
        console.log("User already exists in the database.");
        return existingUsers.documents[0];
      }

      // Create a new user document
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
          businessName: userData.businessName || "",
          businessAddress: userData.businessAddress || "",
        }
      );
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  }

//  async getOrdersBySeller(sellerId) {
//     return this.databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteOrderCollectionId,
//         [Query.equal("sellerId", sellerId)]
//     ).then(res => res.documents);
// }


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

// In appwrite/config.js or wherever your appwriteService is
async getUserById(userId) {
  return this.databases.listDocuments(
    conf.appwriteDatabaseId,
    conf.appwriteUserCollectionId,
    [Query.equal("userId", userId)]
  ).then(res => res.documents[0]);
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
