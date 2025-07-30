const config = {
  appwriteUrl: String(import.meta.env.APPWRITE_ENDPOINT),
  appwriteProjectId: String(import.meta.env.APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.APPWRITE_DATABASE_ID),

  usersMetadataCollectionId: String(
    import.meta.env.USERS_METADATA_COLLECTION_ID,
  ),
  rolesCollectionId: String(import.meta.env.ROLES_COLLECTION_ID),
  roleKeywordsCollectionId: String(import.meta.env.ROLE_KEYWORDS_COLLECTION_ID),
  channelFiltersCollectionId: String(
    import.meta.env.CHANNEL_FILTERS_COLLECTION_ID,
  ),
  searchesCollectionId: String(import.meta.env.SEARCHES_COLLECTION_ID),
  historyCollectionId: String(import.meta.env.HISTORY_COLLECTION_ID),

  appwriteFunctionCreateSession: String(
    import.meta.env.APPWRITE_FUNCTION_CREATE_SESSION,
  ),
  appwriteFunctionStripeWebhook: String(
    import.meta.env.APPWRITE_FUNCTION_STRIPE_WEBHOOK,
  ),

  stripePublicKey: String(import.meta.env.STRIPE_PUBLIC_KEY),

  ytApiKey: String(import.meta.env.YOUTUBE_API_KEY),

  aiApiKey: String(import.meta.env.COHERE_AI_API_KEY),
};

export default config;
