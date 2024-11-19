import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../../components/Button';
import Input from '../../components/Input';

export default function ForgotPasswordScreen() {
  const [emailInput, setEmailInput] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showErrorAlert = (message) => {
    Alert.alert("Error", message, [{ text: "OK" }]);
  };

  const handlePasswordReset = async () => {
    if (!emailInput) {
      showErrorAlert("Email is required.");
      return;
    }

    if (!validateEmail(emailInput)) {
      showErrorAlert("Please enter a valid email address.");
      return;
    }

    // Simulate a check for email existence
    const emailExists = true; 

    if (!emailExists) {
      showErrorAlert("This email doesn't exist.");
      return;
    }

    // TODO: Implement password reset logic
    Alert.alert("Success", "A reset link has been sent to your email.");
    router.push('/Auth/login'); 
  };

  const handleBackPress = () => {
    router.back();
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
          <Header title="Forgot Password" showBack={true} onBackPress={handleBackPress} />
          <View style={{ height: 20 }} />
          <Input
            label="We will send you a new password to your email."
            placeholder="Insert your e-mail"
            type="email"
            value={emailInput}
            onChangeText={setEmailInput}
          />
          <CenteredButton
            title="Request Password"
            onPress={handlePasswordReset}
            style={styles.button}
          />
        </Container>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  button: {
    marginTop: 25,
    width: 200,
  },
  container: {
    height: "100%",
  },
});
