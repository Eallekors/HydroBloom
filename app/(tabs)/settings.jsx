import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import IconButton from "../../components/IconButton.jsx";
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../../components/Container.jsx';
import Header from '../../components/Header.jsx';
import { account } from '../../services/appWrite';
import { router } from 'expo-router';

const Settings = () => {
  // Define a state to hold the selected option for each button by title
  const [selectedOptions, setSelectedOptions] = useState({
    Units: null,
    "Clock format": null,
    Notifications: null,
    "Personal Data": null,
  });

  // Function to handle option selection
  const handleOptionSelect = (buttonTitle, selectedOption) => {
    console.log(`Selected from ${buttonTitle}: ${selectedOption.title}`);
    
    // Update the selected option for the specific button
    setSelectedOptions((prevState) => ({
      ...prevState,
      [buttonTitle]: selectedOption.title,  // Update the selected option for the specific button
    }));
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
    { title: 'OFF' },
    { title: 'Every 2 hours' },
    { title: 'Every 4 hours' },
    { title: 'Every 6 hours' }
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
              onPress={() => router.push('../settingsData')}
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
