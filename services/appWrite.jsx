import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

// Appwrite configuration
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66f95858003215b653db",
  databaseId: "673c58c60017ad6cca00",
  personalDataCollectionId: "673c59070032c19adaec"
};

// Initialize Appwrite client and services
const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
const account = new Account(client);
const databases = new Databases(client);

// Fetch the current session
export const getSession = async () => {
    try {
        const session = await account.getSession('current');
        return session;
    } catch (error) {
        return null;
    }
};

// User account functions
export async function createUser(email, password) {
  try {
    // Create a new Appwrite account
    const newAccount = await account.create(ID.unique(), email, password);

    // Sign the user in immediately after creation
    await signIn(email, password);

    // Store user details in the database
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.personalDataCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get user profile information from the database
export async function getUserProfile() {
    try {
      const currentAccount = await account.get();
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.personalDataCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      );
  
      // Return the user's profile data or default if not found
      return {
        email: currentUser.documents[0]?.email || "No Email"
      };
    } catch (error) {
      throw new Error(error.message);
    }
}

// Sign in function for email/password session
export async function signIn(email, password) {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sign out the current user
export async function signOut() {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get current logged in user information
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.personalDataCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

export const saveUserData = async (userData) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.personalDataCollectionId,
      ID.unique(),
      userData 
    );
    console.log('User data saved:', response);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data');
  }
};
export const getUserData = async () => {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('User is not authenticated.');
    }

    // Fetch the current user from the session
    const currentAccount = await account.get();
    console.log('Current Account:', currentAccount);

    // Fetch user data from the collection
    const currentUserData = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.personalDataCollectionId,
      [Query.equal('userId', currentAccount.$id)]
    );

    console.log('Fetched User Data:', currentUserData);

    if (currentUserData.documents.length === 0) {
      throw new Error('User data not found in the database.');
    }

    return currentUserData.documents[0];
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};


export { client, account, databases, ID };
