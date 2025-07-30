import conf from "../conf/conf.js";
import config from "./config.js";
import { Client, Account, ID, Databases, Query } from "appwrite";

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
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      console.log("User Created:", userAccount);

      if (userAccount) {
        await this.login({ email, password });

        const userPrefs = {
          role,
          businessName: role === "seller" ? businessName : "",
          businessAddress: role === "seller" ? businessAddress : "",
          phone: role === "seller" ? phone : ""
        };
        await this.account.updatePrefs(userPrefs);

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
      const userDocs = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        [Query.equal("userId", userId)]
      );

      if (userDocs.total > 0) {
        return userDocs.documents[0];
      } else {
        throw new Error("User data not found in the database.");
      }
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
      const userData = await this.getUserData(user.$id);

      return {
        //userId: user.$id,
        $id: user.$id,
        email: user.email,
        role: userData?.role || user.prefs?.role || "buyer",
        businessName: userData?.businessName || user.prefs?.businessName || "",
        businessAddress: userData?.businessAddress || user.prefs?.businessAddress || "",
        phone: userData?.phone || user.prefs?.phone || ""
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
