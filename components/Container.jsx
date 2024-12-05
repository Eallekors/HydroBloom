// src/components/Container.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function Container({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 67 ,  
    borderRadius: 25,
    height: height * 0.75, 
    minHeight: 100,
    maxHeight: 650,
    // For iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // For Android shadow
    elevation: 10, 
  },
});
