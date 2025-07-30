import client from "./client.js";
import { Account, ID } from "appwrite";
import service from "./Databases.js";

export class AuthService {
  client;
  account;

  constructor() {
    this.client = client;
    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      if (userAccount) {
        await this.login(email, password);
        await service.createUserMetadata();
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Appwrite Error : CreateAccount :", error.message);
      throw error;
    }
  }

  async login(email, password) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite Service : Login : Error : ", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("AppWrite auth.js : getCurrentUser", error.message);
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("AppWrite auth.js : logout : error : ", error.message);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
