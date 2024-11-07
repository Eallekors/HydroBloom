import React from "react";
import { Pressable, Image, Text, View, StyleSheet } from "react-native";

export default function Header({ title, onBackPress, onLogout, showBack, showLogout }) {
  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable hitSlop={20} onPress={onBackPress} style={styles.backButton}>
          <Image style={styles.icon} source={require('../assets/images/Arrow_left.png')} />
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
      {showLogout && (
        <Pressable hitSlop={20} onPress={onLogout} style={styles.logoutButton}>
          <Image style={styles.icon} source={require('../assets/images/Sign_out_square.png')} />
        </Pressable>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1.9,
    borderBottomColor: "#D3D3D3",
    position: "relative", 
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
  backButton: {
    position: "absolute", 
    left: 20,
  },
  logoutButton: {
    position: "absolute",
    right: 20,
  },
});
