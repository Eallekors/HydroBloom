// Example: app/login.js
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
 
  const handleSignUp = async () => {
    router.push('/home')
   };

  return (
    <SafeAreaView>
      <Text>Sign-up</Text>
      {/* Add input fields for email and password */}
      <Button title="Sign-up" onPress={handleSignUp} />
    </SafeAreaView>
  );
}
