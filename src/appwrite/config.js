import conf from "../conf/conf";
import {Client, ID, Databases, Storage, Query} from "appwrite"

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);    
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
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
                    userId,
                }
            )
        } catch (error) {
            throw error
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
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
            )
        } catch (error) {
            console.log("Appwirte service :: createPost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwirte service :: createPost :: error", error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwirte service :: createPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwirte service :: createPost :: error", error);
            return false;
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
                    businessAddress: userData.businessAddress || ""
                }
            );
        } catch (error) {
            console.error("Error saving user data:", error);
            throw error;
        }
    }
    
    
    //file upload method

    async uploadFile(file){
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

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwirte service :: createPost :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}   

const service = new Service()
export default service