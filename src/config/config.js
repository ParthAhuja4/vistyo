const config = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

  usersMetadataCollectionId: String(
    import.meta.env.VITE_USERS_METADATA_COLLECTION_ID,
  ),
  rolesCollectionId: String(import.meta.env.VITE_ROLES_COLLECTION_ID),
  roleKeywordsCollectionId: String(
    import.meta.env.VITE_ROLE_KEYWORDS_COLLECTION_ID,
  ),
  channelFiltersCollectionId: String(
    import.meta.env.VITE_CHANNEL_FILTERS_COLLECTION_ID,
  ),
  searchesCollectionId: String(import.meta.env.VITE_SEARCHES_COLLECTION_ID),
  historyCollectionId: String(import.meta.env.VITE_HISTORY_COLLECTION_ID),

  appwriteFunctionCreateSession: String(
    import.meta.env.VITE_APPWRITE_FUNCTION_CREATE_SESSION,
  ),

  stripePublicKey: String(import.meta.env.VITE_STRIPE_PUBLIC_KEY),

  ytApiKey: String(import.meta.env.VITE_YOUTUBE_API_KEY),

  aiApiKey: String(import.meta.env.VITE_COHERE_AI_API_KEY),
};

export default config;
