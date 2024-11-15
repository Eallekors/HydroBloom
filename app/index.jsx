import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { router, Stack } from "expo-router";
import Container from "../components/Container.jsx";
import Header from "../components/Header.jsx";
import IconButton from "../components/IconButton.jsx";
import React, { useState } from "react";

export default function Index() {
  // Define a state to hold the selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Callback function to handle the selected option from the IconButton
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container style={styles.container}>
        <Header title="Splash" showBack={true} />
        <Text>Hello world!</Text>
        <ScrollView style={styles.scrollView}>
          {/* Pass handleOptionSelect as a prop to each IconButton */}
          <IconButton
            title="Click Me 1"
            onPress={() => console.log('Button pressed')}
            icon={require('../assets/icons/ruler.png')}
            dropdownItems={dropdownItems}
            onOptionSelect={handleOptionSelect}  // Pass callback to child
          />
          <IconButton
            title="Click Me 2"
            onPress={() => console.log('Button pressed')}
            icon={require('../assets/icons/ruler.png')}
            dropdownItems={dropdownItems}
            onOptionSelect={handleOptionSelect}  // Pass callback to child
          />
          <IconButton
            title="Click Me 3"
            onPress={() => console.log('Button pressed')}
            icon={require('../assets/icons/ruler.png')}
            dropdownItems={dropdownItems}
            onOptionSelect={handleOptionSelect}  // Pass callback to child
          />
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
});
