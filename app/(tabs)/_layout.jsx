import { Tabs } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 20, // Apply rounded corners
          borderTopRightRadius: 20, // Apply rounded corners
          height: 50,       // Adjust the height of the tab bar
          backgroundColor: '#fff', // Optional: Set background color for tab bar
          borderTopWidth: 0, // Remove top border (if you have it)
          shadowColor: '#000', // Optional: Add shadow for elevation
          shadowOffset: { width: 0, height: -2 }, // Optional: Set shadow offset
          shadowOpacity: 0.1, // Optional: Set shadow opacity
          shadowRadius: 4, // Optional: Set shadow radius
        },
      }}
    >
     <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <LinearGradient
                  colors={['#83D2F6', '#007bff']}
                  start={[0, 0]}
                  end={[0, 1]}
                  style={styles.focusedBackground}
                />
              )}
              <Image
                source={require('../../assets/icons/home.png')}
                style={[
                  styles.icon,
                  { tintColor: focused ? '#fff' : '#555' },
                ]}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <LinearGradient
                  colors={['#83D2F6', '#007bff']}
                  start={[0, 0]}
                  end={[0, 1]}
                  style={styles.focusedBackground}
                />
              )}
              <Image
                source={require('../../assets/icons/statistics.png')}
                style={[
                  styles.icon,
                  { tintColor: focused ? '#fff' : '#555' },
                ]}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <LinearGradient
                  colors={['#83D2F6', '#007bff']}
                  start={[0, 0]}
                  end={[0, 1]}
                  style={styles.focusedBackground}
                />
              )}
              <Image
                source={require('../../assets/icons/settings.png')}
                style={[
                  styles.icon,
                  { tintColor: focused ? '#fff' : '#555' },
                ]}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderRadius: 20,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  focusedBackground: {
    position: 'absolute', // Allows part of the shape to extend beyond the container
    margin: 100,
    width: 60, // Wider for an oval shape
    height: 50, // Tall enough to extend below the screen
    backgroundColor: '#007bff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
   
  },
  icon: {
    width: 24,
    height: 24,
  },
});
