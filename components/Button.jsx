import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//run expo install expo-linear-gradient
export default function CenteredButton({ title, onPress, style, textStyle }) {
  return (
    <View style={styles.centerContainer}>
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.2)', 'transparent']}
          start={[0.5, 0]} 
          end={[0.5, 0.2]}  
          style={styles.insetShadow}
        />
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'flex-end',  
  },
  button: {
    backgroundColor: '#EEEDFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: 210,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    overflow: 'hidden', 
    position: 'relative',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  insetShadow: {
    ...StyleSheet.absoluteFillObject, 
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#A6A6A6',
    zIndex: -1, // Places gradient behind text
  },
});
