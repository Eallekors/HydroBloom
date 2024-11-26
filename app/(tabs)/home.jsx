import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getUserData } from '../../services/appWrite';

const Home = () => {
  // Handle hardware back press to prevent going back
  useEffect(() => {
    const backAction = () => {
      // Prevent going back
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const [waterIntake, setWaterIntake] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        console.log('Fetched user data:', data); 
        setWaterIntake(data.waterIntake); 
      } catch (error) {
        Alert.alert('Error', `Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUserData(); 
  }, []); 

  return (
    <SafeAreaView style={{ backgroundColor: '#fff'}}>
      <Text>Home</Text>

      {isLoading ? (
        // Show loading spinner while fetching data
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        waterIntake !== null && (
          <Text>
            Your recommended daily water intake is: {waterIntake} ml
          </Text>
        )
      )}
    </SafeAreaView>
  );
};

export default Home;
