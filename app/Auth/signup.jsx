import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../../components/Button';
import Input from '../../components/Input';

export default function SignUpScreen() {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const showErrorAlert = (message) => {
    Alert.alert("Error", message, [{ text: "OK" }]);
  };

  const handleSignUp = async () => {
    if (!emailInput || !password || !confirmPassword) {
      showErrorAlert("All fields are required.");
      return;
    }

    if (!validateEmail(emailInput)) {
      showErrorAlert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      showErrorAlert(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      showErrorAlert("Passwords do not match.");
      return;
    }

    router.push('/Auth/signupData');
  };

  const navigateToSignIn = () => {
    router.push('/Auth/login');
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
          <Header title="Sign up" />
          <View style={{ height: 20 }} />
          <Input
            label="E-mail"
            placeholder="Insert your e-mail"
            type="email"
            value={emailInput}
            onChangeText={setEmailInput}
          />
          <Input
            label="Password"
            placeholder="Create a password"
            isPassword={true}
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm your password"
            placeholder="Password"
            isPassword={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <CenteredButton title="Continue" onPress={handleSignUp} style={styles.button} />
          <Text style={styles.text}>Already have an account?</Text>
          <CenteredButton title="Sign In" onPress={navigateToSignIn} style={styles.button} />
        </Container>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  gradientContainer: {
    flex: 1,
  },
  button: {
    marginBottom: 25,
    width: 120,
  },
  container: {
    height: "100%",
  },
});
