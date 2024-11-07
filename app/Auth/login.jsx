// Example: app/login.js
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function LoginScreen() {
 
  const handleLogin = async () => {
    router.push('/home')
   };

  return (
    <SafeAreaView>
      <Text>Login</Text>
      {/* Add input fields for email and password */}
      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
}
