import React from "react";
import { Pressable, Image, Text, View, StyleSheet } from "react-native";

// Move styles outside the component to ensure it's created only once
export default function Header ({ title, onBackPress, onLogout, showBack, showLogout }) {
  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable hitSlop={20} onPress={onBackPress}>
          <Image style={styles.icon} source={require('../assets/images/Arrow_left.png')} />
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
      {showLogout && (
        <Pressable hitSlop={20} onPress={onLogout}>
          <Image style={styles.icon} source={require('../assets/images/Sign_out_square.png')} />
        </Pressable>
      )}
    </View>
  );
};

// Styles are now outside the component to avoid re-creation on every render
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1.9, 
    borderBottomColor: "#D3D3D3"
  },
  icon: {
    width: 34,
    height: 34,
    tintColor: "#000",
  },
  title: {
    flex: 1,   
    textAlign: "center", 
    fontSize: 20,
    fontWeight: "bold",
  },
});

