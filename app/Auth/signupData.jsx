import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../../components/Button';
import Input from '../../components/Input';
import { BackHandler } from 'react-native';
import { saveUserData as saveToAppWrite } from '../../services/appWrite';
import { getSession } from '../../services/appWrite';

export default function SignUpScreenData() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    weight: '',
    age: '',
    activity: '',
    wakeTime: '',
    sleepTime: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null);

  useEffect(() => {
    const backAction = () => {
      // Disable back navigation
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Fetch user session to get userId
    const fetchUserSession = async () => {
      const session = await getSession();
      if (session) {
        setAuthenticatedUserId(session.userId);
      }
    };
    
    fetchUserSession();

    return () => backHandler.remove();
  }, []);

  const genderOptions = [
    { id: 1, label: "Male", value: "male" },
    { id: 2, label: "Female", value: "female" }
  ];

  const activityOptions = [
    { id: 1, label: '<30 minutes of exercise per week', value: 'sedentary' },
    { id: 2, label: '30–150 minutes of light exercise per week', value: 'lightlyActive' },
    { id: 3, label: '150–300 minutes of moderate exercise per week', value: 'moderatelyActive' },
    { id: 4, label: '300+ minutes of moderate to high-intensity exercise per week', value: 'veryActive' }
  ];

  const isFormValid = () => {
    return Object.values(formData).every((field) => field !== '');
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateWaterIntake = (weight, activityLevel) => {
    let baseWaterIntake = weight * 30;
  
    // Adjust intake based on activity level
    switch (activityLevel) {
      case 'sedentary':
        return Math.round(baseWaterIntake);
      case 'lightlyActive':
        return Math.round(baseWaterIntake * 1.1);
      case 'moderatelyActive':
        return Math.round(baseWaterIntake * 1.2);
      case 'veryActive':
        return Math.round(baseWaterIntake * 1.4);
      default:
        return Math.round(baseWaterIntake);
    }
  };
  
  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }
  
    if (!authenticatedUserId) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }
  
    setLoading(true);
  
    try {
      const weightInKg = parseFloat(formData.weight);
      const waterIntake = calculateWaterIntake(weightInKg, formData.activity);
  
      const userData = {
        name: formData.name,
        gender: formData.gender,
        weight: weightInKg,
        age: parseInt(formData.age, 10),
        activityLevel: formData.activity,
        wakeUpTime: formData.wakeTime,
        sleepTime: formData.sleepTime,
        userId: authenticatedUserId,
        waterIntake: waterIntake
      };
  
      await saveToAppWrite(userData);
      router.push('/home'); 
    } catch (error) {
      Alert.alert('Error', `Failed to save your data: ${error.message}`);
    } finally {
      setLoading(false);
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
            title={loading ? 'Saving...' : 'Continue'}
            onPress={handleSubmit}
            style={styles.button}
            disabled={!isFormValid() || loading}
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
