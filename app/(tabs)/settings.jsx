import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import IconButton from "../../components/IconButton.jsx";
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../../components/Container.jsx';
import Header from '../../components/Header.jsx';
import { account, checkForSettingsDocument, getUserData } from '../../services/appWrite';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

const Settings = () => {
  const [userId,setUserId] = useState(null)
  // Define a state to hold the selected option for each button by title
  const [selectedOptions, setSelectedOptions] = useState({
    Units: null,
    "Clock format": null,
    Notifications: null,
  });

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
      trigger = { seconds: 5 }; // For testing, notifications will trigger after 2 seconds
    } else {
      // Standard scheduling (every X hours)
      trigger = {
        hour: (new Date().getHours() + intervalHours) % 24,
        minute: 0,
        repeats: true,
      };
    }
  
    console.log('Triggering notification with this trigger:', trigger);
  
    // Schedule the notification
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "HydroBloom Reminder",
          body: "It's time to track your water intake!",
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
          console.log("Document exists");
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
              selectedOption={selectedOptions['Units']}  // Pass selected option for this button
            />
            <IconButton
              title="Clock format"
              onPress={() => console.log('Button pressed')}
              icon='clock'
              dropdownItems={clockItems}
              onOptionSelect={handleOptionSelect}
              selectedOption={selectedOptions['Clock format']}  // Pass selected option for this button
            />
            <IconButton
              title="Notifications"
              onPress={() => console.log('Button pressed')}
              icon='notif'
              dropdownItems={notifItems}
              onOptionSelect={handleOptionSelect}
              selectedOption={selectedOptions['Notifications']}  // Pass selected option for this button
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
