import { Text, View, FlatList, StyleSheet, Alert } from 'react-native';
import IconButton from "../../components/IconButton.jsx";
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../../components/Container.jsx';
import Header from '../../components/Header.jsx';
import { account } from '../../services/appWrite';
import { router } from 'expo-router';

const Profile = () => {
  // Define a state to hold the selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = (buttonTitle, selectedOption) => {
    console.log(`Selected from ${buttonTitle}: ${selectedOption.title}`);
    
    // Update the state with the selected option
    setSelectedOptions((prev) => [
      ...prev,
      { buttonTitle, selectedOption },
    ]);
  };

  const dropdownItems = [
    {
      title: 'Option 1',
      onPress: () => alert('Option 1 selected'),
    },
    {
      title: 'Option 2',
      onPress: () => alert('Option 2 selected'),
    },
    {
      title: 'Option 3',
      onPress: () => alert('Option 3 selected'),
    },
  ];

  // Log out function
  const handleLogout = async () => {
    try {
    
      await account.deleteSession('current'); 

      // Redirect to the sign-in screen
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
          <View style={{ height: 20 }} />
          <IconButton
            title="Click Me 1"
            onPress={() => console.log('Button pressed')}
            icon='ruler'
            dropdownItems={dropdownItems}
            onOptionSelect={handleOptionSelect} 
          />
        </Container>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  gradientContainer: {
    flex: 1,
  },
  button: {
    marginBottom: 25,
    width: 120
  },
  button2: {
    marginBottom: 25,
    width: 170,
  },
  container: {
    height: "100%",
  },
});

export default Profile;
