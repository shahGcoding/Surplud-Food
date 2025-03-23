import conf from "../conf/conf.js";
import config from "./config.js";

import { Client, Account, ID, Databases } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }



async createAccount({ email, password, name, role, businessName, businessAddress, phone }) {
    try {
        // Step 1: Create the User Account
        const userAccount = await this.account.create(ID.unique(), email, password, name);
        console.log("User Created:", userAccount);

        if (userAccount) {
            // Step 2: Auto-login after signup (required before updating prefs)
            await this.login({ email, password });

            const userPrefs = {
                role, 
                businessName: role === "seller" ? businessName : "",
                businessAddress: role === "seller" ? businessAddress : "",
                phone: role === "seller" ? phone : ""
              };
              await this.account.updatePrefs(userPrefs);

            // Step 4: Save user details in your database (if needed)
            const userId = userAccount.$id;
            const userData = { 
                name, 
                email, 
                role,
                ...userPrefs
            };
            await config.saveUserData(userId, userData);

            return userAccount;
        }
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
}


  async getUserData(userId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        userId // Fetch using userId
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {

    try {
      const user = await this.account.get();
      console.log("Raw User Data:", user); // Debugging
      return {
        userId: user.$id,
        email: user.email,
        role: user.prefs?.role || "buyer", // Ensure role exists
         businessName: user.prefs?.businessName || "",
        businessAddress: user.prefs?.businessAddress || "",
        phone: user.prefs?.phone || "",
      };
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
