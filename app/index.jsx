import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, Image, StyleSheet, ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import Container from "../components/Container.jsx";
import CenteredButton from "../components/Button.jsx";
import { LinearGradient } from "expo-linear-gradient";
import { getSession } from "../services/appWrite";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          setHasSession(true);
        }
      } catch (error) {
        console.log("No active session:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!isLoading && hasSession) {
      router.push("/home");
    }
  }, [isLoading, hasSession]);

  if (isLoading) {
    // Show loading spinner while checking session
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!hasSession) {
    // Show splash screen if no session exists and loading is complete
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#83D2F6", "#D9F5FF", "#83D2F6"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradientContainer}
        >
          <Container style={styles.container}>
            <Image source={require("../assets/images/SplashImg.png")} style={styles.image} />
            <Text style={styles.welcomeText}>
              Welcome to HydroBloom! This app reminds you to drink water!
            </Text>
            <CenteredButton
              title={"Sign Up"}
              style={styles.button}
              onPress={() => router.push("/Auth/signup")}
            />
            <Text style={styles.text}>Already have an account?</Text>
            <Text style={styles.signin} onPress={() => router.push("/Auth/login")}>
              Sign In
            </Text>
          </Container>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return null; 
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
  },
  signin: {
    color: "#241F5E",
    fontWeight: "bold",
    fontSize: 18,
  },
  button: {
    marginBottom: 50,
  },
});
