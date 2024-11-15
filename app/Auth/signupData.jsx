import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../../components/Button';
import Input from '../../components/Input';

export default function SignUpScreen() {
  

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#83D2F6', '#D9F5FF', '#83D2F6']}
        start={[0, 0]}
        end={[1, 1]} 
        style={styles.gradientContainer}
      >
        <Container style={styles.container}>
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
    height: "100%"
  }
});
