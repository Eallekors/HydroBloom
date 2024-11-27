import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  

  return (
    <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
     
          <Stack.Screen name="(tabs)" />
      
          <Stack.Screen name="Auth/login" />
          <Stack.Screen name="Auth/signup" />
          <Stack.Screen name="(tabs)/addWater" />
      
    </Stack>
  );
}
