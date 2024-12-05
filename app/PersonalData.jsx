import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Container from '../components/Container';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../components/Button';
import Input from '../components/Input';
import { BackHandler } from 'react-native';
import { getUserData, saveUserData } from '../services/appWrite';

export default function PersonalData() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    weight: '',
    age: '',
    activitys: '',
    wakeUpTime: '',
    sleepTime: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData();
        setFormData({
          name: userData.documents[0].name || '',
          gender: userData.documents[0].gender || '',
          weight: userData.documents[0].weight?.toString() || '',
          age: userData.documents[0].age?.toString() || '',
          activityLevel: userData.documents[0].activityLevel || '',
          wakeUpTime: userData.documents[0].wakeUpTime || '',
          sleepTime: userData.documents[0].sleepTime || ''
        });
      } catch (error) {
        Alert.alert('Error', `Failed to fetch user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const genderOptions = [
    { id: 1, label: 'Male', value: 'male' },
    { id: 2, label: 'Female', value: 'female' }
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

  const handleTimeChange = (key, text) => {
    let formattedText = text.replace(/[^\d]/g, "");
    let hours = formattedText.slice(0, 2);
    let minutes = formattedText.slice(2, 4);
  
    if (parseInt(hours, 10) > 23) hours = "23";
    if (minutes && parseInt(minutes, 10) > 59) minutes = "59";
  
    if (formattedText.length > 2) {
      formattedText = `${hours}:${minutes}`;
    } else {
      formattedText = hours;
    }
  
    handleInputChange(key, formattedText);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }
  
    setLoading(true);
  
    try {
      const weightInKg = parseFloat(formData.weight);
      const ageInYears = parseInt(formData.age, 10);
      const newWaterIntake = calculateWaterIntake(weightInKg, formData.activityLevel);
      const updatedUserData = {
        ...formData,
        weight: weightInKg,
        age: ageInYears,
        waterIntake: newWaterIntake
      };
  
      await saveUserData(updatedUserData);
  
      Alert.alert('Success', 'Your data has been updated successfully!');
      router.push('/(tabs)/settings');
    } catch (error) {
      Alert.alert('Error', `Failed to save your data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateWaterIntake = (weight, activityLevel) => {
    let baseWaterIntake = weight * 30;
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

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#83D2F6', '#D9F5FF', '#83D2F6']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradientContainer}
      >
        <Container style={styles.container}>
          <Header
            title="Update your personal data"
            showBack={true}
            onBackPress={() => router.replace('/(tabs)/settings')}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : (
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
                onChangeText={(value) => handleInputChange('weight', value)}
                value={formData.weight}
              />
              <Input
                label="Age"
                placeholder="Insert your age"
                type="number"
                onChangeText={(value) => handleInputChange('age', value)}
                value={formData.age}
              />
              <Input
                label="How often do you exercise?"
                placeholder="Select your activity level"
                type="picker"
                options={activityOptions}
                onChangeText={(value) => handleInputChange('activityLevel', value)}
                value={formData.activityLevel}
              />
              <Input
                label="What time do you normally wake up?"
                placeholder="HH:mm (24 hour format)"
                type="number"
                onChangeText={(value) => handleTimeChange('wakeUpTime', value)}
                value={formData.wakeUpTime}
              />
              <Input
                label="What time do you normally go to sleep?"
                placeholder="HH:mm (24 hour format)"
                type="number"
                onChangeText={(value) => handleTimeChange('sleepTime', value)}
                value={formData.sleepTime}
              />
            </ScrollView>
          )}
          <CenteredButton
            title={loading ? 'Saving...' : 'Save'}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginVertical: 20,
    width: 120
  }
});
