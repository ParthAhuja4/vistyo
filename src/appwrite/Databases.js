import config from "../config/config";
import { ID, Databases, Query, Account, Functions } from "appwrite";
import client from "./client";

export class Service {
  client;
  databases;
  account;
  functions;

  constructor() {
    this.client = client;
    this.databases = new Databases(this.client);
    this.account = new Account(this.client);
    this.functions = new Functions(this.client);
  }

  async createCheckoutSession() {
    try {
      const [plan, userId] = await Promise.all([
        this.getUserPlan(),
        this.getCurrentUserId(),
      ]);
      const payload = JSON.stringify({ userId, planType: plan });
      const execution = await this.functions.createExecution(
        config.appwriteFunctionCreateSession,
        payload,
        true,
      );
      const response = JSON.parse(execution.response);
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("Stripe URL not returned");
      }
    } catch (err) {
      console.error("Checkout session error:", err);
      throw err;
    }
  }

  async getCurrentUserId() {
    try {
      const user = await this.account.get();
      return user.$id;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw new Error("User not authenticated");
    }
  }

  async getUserPlan() {
    try {
      const userId = await this.getCurrentUserId();
      const doc = await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.usersMetadataCollectionId,
        userId,
      );
      return doc.plan;
    } catch (error) {
      console.error("Error fetching user plan:", error);
      throw error;
    }
  }

  // ==================== USERS METADATA ====================
  async createUserMetadata() {
    try {
      const userId = await this.getCurrentUserId();
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.usersMetadataCollectionId,
        userId,
        { userId, plan: "free", remainingSearches: 2 },
      );
    } catch (error) {
      console.error("Error creating user metadata:", error);
      throw error;
    }
  }

  async getUserMetadata() {
    try {
      const userId = await this.getCurrentUserId();
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.usersMetadataCollectionId,
        userId,
      );
    } catch (error) {
      console.error("Error getting user metadata:", error);
      throw error;
    }
  }

  async updateRemainingSearches() {
    try {
      const doc = await this.getUserMetadata();
      const userId = doc?.userId;
      const remainingSearches = Math.max(0, doc?.remainingSearches - 1);
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.usersMetadataCollectionId,
        userId,
        { remainingSearches },
      );
    } catch (error) {
      console.error("Error updating remaining searches", error);
      throw error;
    }
  }

  // ==================== ROLES ====================
  async createRole(name) {
    const [role, plan] = await Promise.all([
      this.listUserRoles(),
      this.getUserPlan(),
    ]);
    const isActive = false;
    const alreadyExists = role.documents.some(
      (r) => r.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (alreadyExists) throw new Error("Role name already exists");
    if ((plan === "free" || plan === "lite") && role?.total >= 1)
      throw new Error("NOT AUTHORISED");
    try {
      const userId = await this.getCurrentUserId();
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.rolesCollectionId,
        ID.unique(),
        { userId, name, isActive },
      );
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  }

  async updateRole(roleId, name, isActive) {
    const [role, plan] = await Promise.all([
      this.listUserRoles(),
      this.getUserPlan(),
    ]);
    if ((plan === "free" || plan === "lite") && role?.total > 1)
      throw new Error("NOT AUTHORISED");
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.rolesCollectionId,
        roleId,
        { name, isActive },
      );
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  }

  async deleteRole(roleId) {
    const plan = await this.getUserPlan();
    if (plan === "free" || plan === "lite") throw new Error("NOT AUTHORISED");
    try {
      await this.deleteRoleKeywords(roleId);
      await this.deleteChannelFilter(roleId);
      return await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.rolesCollectionId,
        roleId,
      );
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  }

  async listUserRoles() {
    try {
      const userId = await this.getCurrentUserId();
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.rolesCollectionId,
        [Query.equal("userId", userId)],
      );
    } catch (error) {
      console.error("Error listing user roles:", error);
      throw error;
    }
  }

  async getRoleIdByName(name) {
    try {
      const userId = await this.getCurrentUserId();
      const result = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.rolesCollectionId,
        [Query.equal("userId", userId), Query.equal("name", name)],
      );
      if (result.total === 0) {
        throw new Error(`Role "${name}" not found for this user.`);
      }
      return result.documents[0].$id;
    } catch (error) {
      console.error("Error fetching role ID by name:", error);
      throw error;
    }
  }
  async getActiveRole() {
    try {
      const userId = await this.getCurrentUserId();
      const result = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.rolesCollectionId,
        [Query.equal("userId", userId), Query.equal("isActive", true)],
      );
      if (result.total === 0) {
        throw new Error(`None active not found for this user.`);
      }
      const id = result.documents[0].$id;
      const name = result.documents[0].name;
      return { id, name };
    } catch (error) {
      console.error("Error fetching active role", error);
      throw error;
    }
  }

  // ==================== ROLE KEYWORDS ====================
  async createRoleKeywords(roleId, keywords) {
    try {
      const existing = await this.listRoleKeywords(roleId);
      if (existing?.documents?.length > 0) {
        throw new Error(`Role keywords already exist for roleId: ${roleId}`);
      }
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.roleKeywordsCollectionId,
        ID.unique(),
        { roleId, keywords },
      );
    } catch (error) {
      console.error("Error creating role keywords:", error);
      throw error;
    }
  }

  async listRoleKeywords(roleId) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.roleKeywordsCollectionId,
        [Query.equal("roleId", roleId)],
      );
      return res.documents[0] || null;
    } catch (error) {
      console.error("Error listing role keywords:", error);
      throw error;
    }
  }

  async listActiveRoleKeywords() {
    try {
      const { id } = await this.getActiveRole();
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.roleKeywordsCollectionId,
        [Query.equal("roleId", id)],
      );
      const doc = res?.documents[0];
      if (doc) {
        return {
          id,
          keywords: doc.keywords,
        };
      }
      return null;
    } catch (error) {
      console.error("Error listing role keywords:", error);
      throw error;
    }
  }

  async deleteRoleKeywords(roleId) {
    try {
      const plan = await this.getUserPlan();
      if (plan === "free" || plan === "lite") throw new Error("NOT AUTHORISED");
      const result = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.roleKeywordsCollectionId,
        [Query.equal("roleId", roleId)],
      );
      if (result.documents.length > 0) {
        const docId = result.documents[0].$id;
        await this.databases.deleteDocument(
          config.appwriteDatabaseId,
          config.roleKeywordsCollectionId,
          docId,
        );
      }
      return "SUCCESFULL";
    } catch (error) {
      console.error("Error deleting role keywords:", error);
      throw error;
    }
  }

  // ==================== CHANNEL FILTERS ====================
  async createChannelFilter(roleId, channelIds) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.channelFiltersCollectionId,
        ID.unique(),
        { roleId, channelIds },
      );
    } catch (error) {
      console.error("Error creating channel filter:", error);
      throw error;
    }
  }

  async listChannelFilters(roleId) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.channelFiltersCollectionId,
        [Query.equal("roleId", roleId)],
      );
      return res.documents[0] || null;
    } catch (error) {
      console.error("Error listing channel filters:", error);
      throw error;
    }
  }

  async listActiveChannelFilters(id) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.channelFiltersCollectionId,
        [Query.equal("roleId", id)],
      );
      return res.documents[0].channelIds || null;
    } catch (error) {
      console.error("Error listing active channel filters:", error);
      throw error;
    }
  }

  async deleteChannelFilter(roleId) {
    try {
      const plan = await this.getUserPlan();
      if (plan === "free" || plan === "lite") throw new Error("NOT AUTHORISED");
      const result = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.channelFiltersCollectionId,
        [Query.equal("roleId", roleId)],
      );
      if (result.total === 0) {
        throw new Error("Channel filter not found.");
      }
      const filterId = result.documents[0].$id;
      return await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.channelFiltersCollectionId,
        filterId,
      );
    } catch (error) {
      console.error("Error deleting channel filter:", error);
      throw error;
    }
  }

  // ==================== SEARCHES ====================
  async createSearch(roleId, query) {
    try {
      const userId = await this.getCurrentUserId();
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.searchesCollectionId,
        ID.unique(),
        {
          userId,
          roleId,
          query,
          createdAt: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Error creating search:", error);
      throw error;
    }
  }

  async deleteSearch(searchId) {
    try {
      const plan = await this.getUserPlan();
      if (plan !== "unlimited") throw new Error("NOT AUTHORISED");
      return await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.searchesCollectionId,
        searchId,
      );
    } catch (error) {
      console.error("deleteSearch error:", error);
      throw error;
    }
  }

  async listUserAllSearches(limit = 50, lastDocId = null, id) {
    try {
      const [plan, userId] = await Promise.all([
        this.getUserPlan(),
        this.getCurrentUserId(),
      ]);
      if (plan !== "unlimited") throw new Error("NOT AUTHORISED");
      const queries = [
        Query.equal("userId", userId),
        Query.equal("roleId", id),
        Query.orderDesc("createdAt"),
        Query.limit(limit),
      ];
      if (lastDocId) {
        queries.push(Query.cursorAfter(lastDocId));
      }
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.searchesCollectionId,
        queries,
      );
    } catch (error) {
      console.error("Error listing user searches:", error);
      throw error;
    }
  }

  // ====================HISTORY ====================
  async createHistory(
    videoId,
    roleId,
    title,
    duration,
    thumbnail,
    channelName,
    description,
    channelId,
  ) {
    try {
      const userId = await this.getCurrentUserId();
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.historyCollectionId,
        ID.unique(),
        {
          userId,
          videoId,
          roleId,
          title,
          duration,
          thumbnail,
          channelName,
          description,
          channelId,
          createdAt: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Error creating history record:", error);
      throw error;
    }
  }

  async isTrustedView(videoId, roleId) {
    try {
      const [plan, userId] = await Promise.all([
        this.getUserPlan(),
        this.getCurrentUserId(),
      ]);
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.historyCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("videoId", videoId),
          Query.equal("roleId", roleId),
          Query.orderDesc("createdAt"),
          Query.limit(1),
        ],
      );
      if (res.total === 0) return false;
      if (plan === "unlimited") return true;
      const watchedAt = new Date(res.documents[0].createdAt);
      const now = new Date();
      const diff = now - watchedAt;
      return diff <= 1800000;
    } catch (error) {
      console.error("Error checking trusted view:", error);
      throw error;
    }
  }
  async deleteHistory(docId) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.historyCollectionId,
        docId,
      );
    } catch (error) {
      console.error("Error deleting history record:", error);
      throw error;
    }
  }

  async listUserHistory(limit = 50, cursorId = null, id) {
    try {
      const [plan, userId] = await Promise.all([
        this.getUserPlan(),
        this.getCurrentUserId(),
      ]);
      if (plan !== "unlimited") throw new Error("NOT AUTHORISED");
      const queries = [
        Query.equal("userId", userId),
        Query.equal("roleId", id),
        Query.orderDesc("createdAt"),
        Query.limit(limit),
      ];
      if (cursorId) {
        queries.push(Query.cursorAfter(cursorId));
      }
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.historyCollectionId,
        queries,
      );
    } catch (error) {
      console.error("Error listing user history:", error);
      throw error;
    }
  }
}

const service = new Service();
export default service;
