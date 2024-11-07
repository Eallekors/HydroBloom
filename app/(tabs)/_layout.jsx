import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
       
      />
      <Tabs.Screen
        name="statistics"
        
      />
      <Tabs.Screen
        name="settings"
        
      />
    </Tabs>
  );
}