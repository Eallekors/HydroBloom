import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

// Appwrite configuration
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66f95858003215b653db",
  databaseId: "673c58c60017ad6cca00",
  personalDataCollectionId: "673c59070032c19adaec",
  buttonsCollectionId: "674963ff00254cb063b3",
  StatisticsCollectionId: "67498ad9003231cda4e5",
  settingsCollectionId: "674987df001d31801b89"
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
    // Get the current user's account ID
    const currentAccount = await account.get();

    // Fetch the existing user data from the database using the account ID
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.personalDataCollectionId,
      [Query.equal('userId', currentAccount.$id)]
    );

    if (userDocuments.documents.length > 0) {
      // Update the existing document
      const userDocumentId = userDocuments.documents[0].$id;
      const updatedUserData = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.personalDataCollectionId,
        userDocumentId,
        userData
      );
      console.log('User data updated:', updatedUserData);
    } else {
      // Create a new document if no data exists
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.personalDataCollectionId,
        ID.unique(),
        {
          ...userData,
          userId: currentAccount.$id
        }
      );
      console.log('User data saved:', response);
    }
  } catch (error) {
    console.error('Error saving/updating user data:', error);
    throw new Error('Failed to save or update user data');
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
    //console.log('Current Account:', currentAccount);

    // Fetch user data from the collection
    const currentUserData = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.personalDataCollectionId,
      [Query.equal('userId', currentAccount.$id)]
    );

   // console.log('Fetched User Data:', currentUserData);

    if (currentUserData.documents.length === 0) {
      throw new Error('User data not found in the database.');
    }

    return currentUserData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};

export const ensureDocumentExists = async (userId) => {
  try {
    // Query the collection for the userId
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.buttonsCollectionId,
      [Query.equal('userId', userId)]
    );

    if (response.total === 0) {
      // No document found, create a new one
      const buttons = [
        JSON.stringify({ defaultSelected: "500ml", icon: "water-bottle.png", title: "Water" }),
        JSON.stringify({ defaultSelected: "300ml", icon: "juice-bottle.png", title: "Juice" }),
        JSON.stringify({ defaultSelected: "280ml", icon: "coffe-glass.png", title: "Coffee" })
      ];
      
      const newDocument = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.buttonsCollectionId,
        ID.unique(),
        {
          userId: userId,
          buttons: buttons // Pass the serialized array
        }
      );
      console.log("Document created:", newDocument);
      return newDocument;
    } else {
     // console.log("Document already exists:", response.documents[0]);
      return response.documents[0];
    }
  } catch (error) {
    console.error("Error ensuring document exists:", error);
    throw error;
  }
};

export const updateAppwriteDocument = async (newButton, documentId, buttons) => {
  try {
    // Make sure the buttons array is updated with the new button
    const updatedButtons = [...buttons, newButton];
    
    // Convert the button objects to strings (since the current Appwrite structure stores them as JSON strings)
    const buttonsAsString = updatedButtons.map(button => JSON.stringify(button));
    
    console.log('Updated buttons to be sent:', buttonsAsString);  // Log the data to check
    
    // Update the document in Appwrite with the new buttons array
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      '674963ff00254cb063b3', // Collection ID
      documentId,              // Document ID (valid UID, confirmed as '6749754300074eeabd5f')
      { buttons: buttonsAsString }  // Correct data structure (array of JSON strings)
    );
    
    console.log("Document updated successfully:", response); // Log success response
  } catch (error) {
    console.error("Error updating document:", error); // Log the error
  }
};

export const deleteAppwriteDocument = async (newButtons, documentId) => {
  try {
    // Convert the button objects to strings (since the current Appwrite structure stores them as JSON strings)
    const buttonsAsString = newButtons.map(button => JSON.stringify(button));
    
    console.log('Updated buttons to be sent:', buttonsAsString);  // Log the data to check
    
    // Update the document in Appwrite with the new buttons array
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      '674963ff00254cb063b3', // Collection ID
      documentId,              // Document ID (valid UID, confirmed as '6749754300074eeabd5f')
      { buttons: buttonsAsString }  // Correct data structure (array of JSON strings)
    );
    
    console.log("Button deleted successfully:", response); // Log success response
  } catch (error) {
    console.error("Error deleting document:", error); // Log the error
  }
};

export const waterIntakeManager = async (userId, currentIntake, intakeGoal) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

    // Query the collection for the user's document
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.StatisticsCollectionId,
      [Query.equal("userId", userId)]
    );

    if (response.total === 0) {
      // No document found, create a new one
      const newDocument = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.StatisticsCollectionId,
        ID.unique(),
        {
          userId: userId,
          history: [
            JSON.stringify({
              day: today,
              dayAmount: currentIntake,
              dayGoal: intakeGoal,
            }),
          ], // Store as an array of JSON strings
        }
      );
      console.log("New document created:", newDocument);
      return newDocument;
    } else {
      // Document exists, update it
     
      const existingDocument = response.documents[0];
      const dailyIntake = existingDocument.history.map((entry) =>
        JSON.parse(entry)
      ); // Parse JSON strings into objects

      // Find today's entry
      const todayEntryIndex = dailyIntake.findIndex(
        (entry) => entry.day === today
      );

      if (todayEntryIndex !== -1) {
        // Update the existing entry for today
        dailyIntake[todayEntryIndex].dayAmount = currentIntake;
        dailyIntake[todayEntryIndex].dayGoal = intakeGoal; // Update the goal if needed
      } else {
        // Add a new entry for today
        dailyIntake.push({
          day: today,
          dayAmount: currentIntake,
          dayGoal: intakeGoal,
        });
      }

      // Convert back to array of JSON strings for storage
      const dailyIntakeStrings = dailyIntake.map((entry) =>
        JSON.stringify(entry)
      );
      console.log("Existing: ", existingDocument.$id)
      // Update the document with the modified dailyIntake
      const updatedDocument = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.StatisticsCollectionId,
        existingDocument.$id,
        { history: dailyIntakeStrings }
      );

      console.log("Document updated:", updatedDocument);
      return updatedDocument;
    }
  } catch (error) {
    console.error("Error managing water intake:", error);
     throw error;
  }
};
    
export const checkForSettingsDocument = async (userId, newOptions) => {
  try {
   

    // Flatten the newOptions for storing
    const flattenedOptions = {
      units: newOptions.Units || null,
      clockFormat: newOptions["Clock format"] || null,
      notifications: newOptions.Notifications || null,
    };

    // Check if the document exists
    const response = await databases.listDocuments(appwriteConfig.databaseId,
      appwriteConfig.settingsCollectionId,[Query.equal('userId', userId)]);

    if (response.total > 0) {
      // Update existing document
      const documentId = response.documents[0].$id;
      const updatedDocument = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.settingsCollectionId,
        documentId,
        flattenedOptions
      );
      return updatedDocument;
    } else {
      // Create a new document
      const newDocument = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.settingsCollectionId,
        ID.unique(),
        {
          userId,
          ...flattenedOptions,
        }
      );
      return newDocument;
    }
  } catch (error) {
    console.error('Error in checkForSettingsDocument:', error);

    throw error;
  }
};


export const getSettings = async (userId) => {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.settingsCollectionId,
    [Query.equal('userId', userId)]
  );
  return response; // Ensure the response is returned
};

export const getIntakeAmount = async (userId) => {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.StatisticsCollectionId,
    [Query.equal('userId', userId)]
  );
  return response; // Ensure the response is returned
}

export async function getStatisticsData() {
  try {
    // Get the current user session
    const currentAccount = await account.get();

    // Fetch statistics for the current user
    const statistics = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.StatisticsCollectionId,
      [Query.equal('userId', currentAccount.$id)] // Filter by user ID
    );

    return statistics.documents; // Return the list of documents with statistics
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to fetch statistics data');
  }
}


export { client, account, databases, ID };
