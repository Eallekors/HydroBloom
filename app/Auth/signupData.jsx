import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../../components/Button';
import Input from '../../components/Input';
import { BackHandler } from 'react-native';

export default function SignUpScreenData() {
    useEffect(() => {
        const backAction = () => {
          // Disable back navigation
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);
    
    const genderOptions = [
    { id: 1, label: "Male", value: "1" },
    { id: 2, label: "Female", value: "2" }
  ];
  const activityOptions = [
    { id: 1, label: "Sedentary", value: "1" },
    { id: 2, label: "Lightly active", value: "2" },
    { id: 3, label: "Moderately active", value: "3" },
    { id: 4, label: "Very active", value: "4" }
  ];

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    weight: '',
    age: '',
    activity: '',
    wakeTime: '',
    sleepTime: ''
  });

  const isFormValid = () => {
    return Object.values(formData).every((field) => field !== '');
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }
    router.push('/home');
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
          <Header title="Please insert your data" />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={{ height: 20 }} />
            <Input
              label="Name"
              placeholder="Insert your firstname"
              onChangeText={(value) => handleInputChange('name', value)}
              value={formData.name}
            />
            <Input
              label="Gender"
              placeholder="Select your gender"
              type="picker"
              options={genderOptions}
              onChangeText={(value) => handleInputChange('gender', value)}
              value={formData.gender}
            />
            <Input
              label="Weight (kg)"
              placeholder="Insert your weight"
              type="number"
              onChangeText={(value) => {
                // Allow empty value when the user deletes input
                if (value === '') {
                  handleInputChange('weight', '');
                } else {
                  const weight = Math.min(Math.max(parseInt(value) || 0, 1), 300);
                  handleInputChange('weight', weight.toString());
                }
              }}
              value={formData.weight}
            />
            <Input
              label="Age"
              placeholder="Insert your age"
              type="number"
              onChangeText={(value) => {
                if (value === '') {
                  handleInputChange('age', '');
                } else {
                  const age = Math.min(Math.max(parseInt(value) || 0, 1), 99);
                  handleInputChange('age', age.toString());
                }
              }}
              value={formData.age}
            />
            <Input
              label="Activity level"
              placeholder="Select your activity level"
              type="picker"
              options={activityOptions}
              onChangeText={(value) => handleInputChange('activity', value)}
              value={formData.activity}
            />
            <Input
              label="What time do you normally wake up?"
              placeholder="HH:mm (24 hour format)"
              type="time"
              onChangeText={(value) => handleInputChange('wakeTime', value)}
              value={formData.wakeTime}
            />
            <Input
              label="What time do you normally go to sleep?"
              placeholder="HH:mm (24 hour format)"
              type="time"
              onChangeText={(value) => handleInputChange('sleepTime', value)}
              value={formData.sleepTime}
            />
          </ScrollView>
          <CenteredButton
            title="Continue"
            onPress={handleSubmit}
            style={styles.button}
            disabled={!isFormValid()}
          />
        </Container>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  gradientContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  scrollContainer: {
    paddingBottom: 20
  },
  button: {
    marginVertical: 20,
    width: 120
  }
});
