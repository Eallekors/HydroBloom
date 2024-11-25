import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredButton from '../../components/Button';
import Input from '../../components/Input';
import { account } from '../../services/appWrite';

export default function SignInScreen() {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showErrorAlert = (message) => {
    Alert.alert("Error", message, [{ text: "OK" }]);
  };

  const handleSignIn = async () => {
    if (!emailInput || !password) {
      showErrorAlert("All fields are required.");
      return;
    }
  
    if (!validateEmail(emailInput)) {
      showErrorAlert("Please enter a valid email address.");
      return;
    }
  
    try {
      // Attempt to sign in with Appwrite
      const response = await account.createEmailPasswordSession(emailInput, password);
      console.log('User signed in:', response);
      router.push('/home'); 
    } catch (error) {
        showErrorAlert("Invalid credentials. Please try again.");
      return; 
    }
  };
  

  const navigateToForgotPassword = () => {
    router.push('/Auth/forgotPassword');
  };

  const handleBackPress = () => {
    router.replace('/');
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
          <Header title="Sign In" showBack={true} onBackPress={handleBackPress} />
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
            placeholder="Enter your password"
            isPassword={true}
            value={password}
            onChangeText={setPassword}
          />
          <CenteredButton title="Log In" onPress={handleSignIn} style={styles.button} />
          <Text style={styles.text}>Forgot your password?</Text>
          <CenteredButton
            title="Reset Password"
            onPress={navigateToForgotPassword}
            style={styles.button2}
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
    width: 120
  },
  button2: {
    marginBottom: 25,
    width: 170,
  },
  container: {
    height: "100%",
  },
});
