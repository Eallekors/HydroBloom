import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const Cloud = ({ currentIntakeState, waterIntake }) => {
  const percentage = Math.min((currentIntakeState / waterIntake) * 100, 100); // Clamp percentage to 100
  const { width } = Dimensions.get('window'); // Get screen width
  const raindrops = Array.from({ length: 30 }, () => useRef(new Animated.Value(0)).current); // Create 30 raindrops

  // Start animation for a single raindrop
  const startRaindropAnimation = (raindrop, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(raindrop, {
          toValue: 1,
          duration: 1500, // Duration for the drop to fall
          delay: delay, // Random delay
          useNativeDriver: true,
        }),
        Animated.timing(raindrop, {
          toValue: 0,
          duration: 0, // Reset position immediately
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start rain animation for all raindrops
  useEffect(() => {
    if (percentage === 100) {
      raindrops.forEach((raindrop, index) => {
        const randomDelay = Math.random() * 1000; // Random delay up to 1 second
        startRaindropAnimation(raindrop, randomDelay);
      });
    }
  }, [percentage]);

  // Select the cloud image based on the percentage
  const getCloudImage = () => {
    if (percentage === 0) {
      return require('../assets/images/Cloud.png'); // Default cloud
    } else if (percentage <= 33) {
      return require('../assets/images/Cloud_33.png'); // Cloud with 33% filled
    } else if (percentage <= 66) {
      return require('../assets/images/Cloud_66.png'); // Cloud with 66% filled
    } else {
      return require('../assets/images/Cloud_100.png'); // Fully filled cloud
    }
  };

  return (
    <View style={styles.container}>
      {/* Text above the cloud */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>Daily Goal: {waterIntake} ml</Text>
       
        
        <View style={styles.divider} />
       
        <Text style={styles.text}>
          {currentIntakeState < waterIntake 
            ? `${waterIntake - currentIntakeState} ml to go` 
            : 'Goal reached!'}
        </Text>
        </View>
         {/*
        */}
  

      {/* Cloud Image */}
      <View style={styles.imageContainer}>
        <Image source={getCloudImage()} style={styles.cloudImage} />
        
        {/* Display Percentage */}
        <Text style={styles.overlayText}>
          {Math.round(percentage)}%
        </Text>

        {/* Rain Animation */}
        {percentage === 100 &&
          raindrops.map((raindrop, index) => {
            const randomXPosition = Math.random() * width / 2; // Random horizontal position
            return (
              <Animated.View
                key={index}
                style={[
                  styles.rainDrop,
                  {
                    transform: [
                      {
                        translateY: raindrop.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-60, 400], // Rain starts above the cloud and falls to 400px below
                        }),
                      },
                      {
                        translateX: raindrop.interpolate({
                          inputRange: [0, 1],
                          outputRange: [randomXPosition - 100, randomXPosition - 100], // Wind pushes raindrop left
                        }),
                      },
                    ],
                    opacity: raindrop.interpolate({
                      inputRange: [0, 0.1, 1],
                      outputRange: [0, 1, 1], // Rain fades in as it starts falling
                    }),
                  },
                ]}
              />
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 10, // Space between text and cloud
    backgroundColor: '#ffffff',
    padding:10,
    top: -90,
    borderRadius: 25,
    height: 'auto',
    width: 'auto',
    elevation: 5
  },
  text: {
    fontSize: 23,
    fontFamily: 'ka1',
    color: '#000',
    backgroundColor: 'white',
  },
  divider: {
    height: 1,
    width: 80,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  imageContainer: {
    position: 'relative',
    width: 200, // Adjust based on your image size
    height: 200, // Adjust based on your image size
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudImage: {
    width: '140%',
    height: '140%',
    resizeMode: 'contain',
  },
  overlayText: {
    position: 'absolute',
    color: '#ddd',
    fontFamily: 'text',
    fontSize: 25,
    zIndex: 2,
  },
  rainDrop: {
    position: 'absolute',
    top: 200, // Starting point of the rain below the cloud
    width: 3,
    height: 20,
    backgroundColor: '#87CEEB', // Light blue raindrop color
    borderRadius: 2,
  },
});

export default Cloud;
