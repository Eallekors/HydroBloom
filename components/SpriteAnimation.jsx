import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const SpriteAnimation = () => {
  const progress = useSharedValue(0);

  // Sprite Configuration
  const SPRITE_WIDTH = 32; // Width of each frame
  const SPRITE_HEIGHT = 32; // Height of each frame
  const FRAMES = 5; // Total frames
  const DURATION = 1000; // Total duration in milliseconds

  // Start the animation only once
  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION });
  }, []);

  // Frame animation logic
  const animatedStyle = useAnimatedStyle(() => {
    const frameIndex = Math.floor(interpolate(progress.value, [0, 1], [0, FRAMES - 1]));
    return {
      transform: [{ translateX: -(frameIndex * SPRITE_WIDTH) }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.spriteContainer}>
        <Animated.Image
          source={require('../assets/images/animation.png')}
          style={[
            {
              width: SPRITE_WIDTH * FRAMES, // Total width of the sprite sheet
              height: SPRITE_HEIGHT, // Height of one frame
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteContainer: {
    width: 32, // Match SPRITE_WIDTH
    height: 32, // Match SPRITE_HEIGHT
    overflow: 'hidden',
    transform: [{ scale: 5 }],
  },
});

export default SpriteAnimation;
