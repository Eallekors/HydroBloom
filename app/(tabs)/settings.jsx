import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import IconButton from "../../components/IconButton.jsx";
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../../components/Container.jsx';
import Header from '../../components/Header.jsx';
import { account, checkForSettingsDocument, getUserData, getSettings } from '../../services/appWrite';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

const Settings = () => {
  const [userId,setUserId] = useState(null)
  // Define a state to hold the selected option for each button by title
  const [selectedOptions, setSelectedOptions] = useState({
    Units: "kg, ml",
    "Clock format": "13:00",
    Notifications: "Once a day",
  });
  const [error, setError] = useState(null);

  const waterFacts = [
    "Drinking water can help improve your focus and concentration.",
    "Water makes up about 60% of your body weight.",
    "Drinking water boosts your metabolism and helps with weight loss.",
    "Drinking water helps maintain the balance of bodily fluids.",
    "Drinking water is essential for healthy skin.",
    "Your body loses water through breathing, sweating, and digestion.",
    "Drinking water can help prevent headaches and migraines.",
    "Water helps flush out toxins from your body.",
    "Drinking water is good for your kidneys and liver.",
    "Water helps regulate your body temperature."
  ];

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * waterFacts.length);
    return waterFacts[randomIndex];
  };

  const scheduleNotifications = async (intervalHours) => {
    const isTestMode = intervalHours === 2; // For testing, 2 hours selected will trigger notifications after 2 seconds
  
    if (intervalHours === 0) {
      // Cancel all notifications if the user turns notifications OFF
      await Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }
  
    // Cancel any existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
  
    let trigger;
  
    if (isTestMode) {
      trigger = { seconds: 5 }; // For testing, notifications will trigger after 5 seconds
    } else {
        switch (intervalHours) {
          case 2:
            // Schedule a notification once a day at a specific time (e.g., 9 AM)
            trigger = {
              hour: 12, // Change this to your desired hour
              minute: 0,
              repeats: true,
            };
            break;

          case 4:
            // Schedule two notifications per day, e.g., at 9 AM and 9 PM
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "HydroBloom Reminder",
                body: `${getRandomFact()}`,
                sound: true,
              },
              trigger: { hour: 12, minute: 0, repeats: true },
            });

            await Notifications.scheduleNotificationAsync({
              content: {
                title: "HydroBloom Reminder",
                body: `${getRandomFact()}`,
                sound: true,
              },
              trigger: { hour: 16, minute: 0, repeats: true }, // 9 PM
            });
            console.log("Scheduled two notifications: 9 AM and 9 PM");
            return; // Skip the default scheduling for "Twice a day"
            
          default:
            // Handle other cases if necessary
            trigger = {
              hour: (new Date().getHours() + intervalHours) % 24, // Default scheduling based on the intervalHours
              minute: 0,
              repeats: true,
            };
            break;
        }
    }
  
    console.log('Triggering notification with this trigger:', trigger);
  
    // Schedule the notification
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "HydroBloom Reminder",
          body: `${getRandomFact()}`,
          sound: true,
        },
        trigger,
      });
      console.log('Notification scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };
  
  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      console.log('Notifications are enabled');
    } else if (status === 'denied') {
      console.log('Notifications are denied');
    } else if (status === 'undetermined') {
      console.log('Notification permission is undetermined');
    }
  };
  
  useEffect(() => {
    checkNotificationPermissions();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        //console.log('Fetched user data:', data);
        setUserId(data.documents[0].userId);
        
      } catch (error) {
        Alert.alert('Error', `Failed to load data: ${error.message}`);
      } 
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) {
        console.log('userId is not available yet');
        return; // Early return if userId is not available
      }

      try {
        const response = await getSettings(userId);

        // Check if documents exist and handle accordingly
        if (!response.documents || response.documents.length === 0) {
          console.log('No settings found for this user');
          return; // Early return if no documents are found
        }

        // Assuming response.documents contains an array with the fetched settings
        const settings = response.documents[0]; // Get the first document
        console.log('Fetched Settings:', settings);
       
        // Set the selectedOptions state with the fetched values
        setSelectedOptions({
          Units: settings.units || null,
          "Clock format": settings.clockFormat || null,
          Notifications: settings.notifications || null,
        });

      } catch (error) {
        console.error('Error fetching settings:', error);
        setError(error);
      }
    };

    fetchSettings(); // Call the async function when userId changes
  }, [userId]); // Effect runs when userId changes

  const handleOptionSelect = async (buttonTitle, selectedOption) => {
   
    // Update the selected option for the specific button
    setSelectedOptions((prevState) => {
      const newOptions = {
        ...prevState,
        [buttonTitle]: selectedOption.title,
      };
  
      if (buttonTitle === "Notifications") {
        const intervalHours = notifItems.find(item => item.title === selectedOption.title)?.value || 0;
        scheduleNotifications(intervalHours); // Call the scheduling function
      }

      // Ensure the document exists and then update it
      checkForSettingsDocument(userId, newOptions)
        .then((existingDocument) => {
          // You can also update the document here if needed
          console.log("Document exists", existingDocument);
          // Optionally, you can update this document with the new settings if needed
          // Update the existing document logic can be added here
        })
        .catch((error) => {
          console.error("Error ensuring document exists or updating:", error);
        });
      
      return newOptions;
    });
  };
  
  console.log(selectedOptions)
  // Define the dropdown items for each button
  const unitItems = [
    { title: 'kg, ml' },
    { title: 'lb, oz' }
  ];

  const clockItems = [
    { title: '13:00' },
    { title: '1 PM' }
  ];

  const notifItems = [
     { title: 'OFF', value: 0.1 },
  { title: 'Once a day', value: 2 },
  { title: 'Twice a day', value: 4 },
  ];

  // Log out function
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/Auth/login');
      console.log("Logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "There was an issue logging out. Please try again.");
    }
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#83D2F6', '#D9F5FF', '#83D2F6']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradientContainer}
      >
        <Container style={styles.container}>
          <Header title="Settings" showLogout={true} onLogout={handleLogout} />
          
          {/* Wrap the content inside ScrollView to make it scrollable */}
          <ScrollView style={styles.scrollContainer}>
            <IconButton
              title="Units"
              onPress={() => console.log('Button pressed')}
              icon='ruler'
              dropdownItems={unitItems}
              onOptionSelect={handleOptionSelect}
              defaultSelected={selectedOptions['Units']}  // Pass selected option for this button
            />
            <IconButton
              title="Clock format"
              onPress={() => console.log('Button pressed')}
              icon='clock'
              dropdownItems={clockItems}
              onOptionSelect={handleOptionSelect}
              defaultSelected={selectedOptions['Clock format']}  // Pass selected option for this button
            />
            <IconButton
              title="Notifications"
              onPress={() => console.log('Button pressed')}
              icon='notif'
              dropdownItems={notifItems}
              onOptionSelect={handleOptionSelect}
              defaultSelected={selectedOptions['Notifications']}  // Pass selected option for this button
            />
            <IconButton
              title="Personal Data"
              onPress={() => router.push('../PersonalData')}
              icon='data'
              selectedOption={selectedOptions['Personal Data']}  // Pass selected option for this button
            />
          </ScrollView>
        </Container>
      </LinearGradient>
    </View>
  );
};

// Define your styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,  // Make sure the gradient takes full screen height
  },
  container: {
    flex: 1, // Ensures the container expands to fill available space
    padding: 20, // Adds padding to the container
  },
  scrollContainer: {
    flex: 1, // Ensure the ScrollView fills the available space
  },
});

export default Settings;
