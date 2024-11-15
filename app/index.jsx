import { SafeAreaView, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import Container from "../components/Container.jsx";
import CenteredButton from "../components/Button.jsx";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const navigateToSignUp = () => {
    router.push('/Auth/signup');
  };
  const navigateToSignIn = () => {
    router.push('/Auth/login')
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#83D2F6', '#D9F5FF', '#83D2F6']}
        start={[0, 0]}
        end={[1, 1]} 
        style={styles.gradientContainer}
      >
      <Container style={styles.container}>
        <Image source={require('../assets/images/SplashImg.png')} style={styles.image} />
        <Text style={styles.welcomeText}>
          Welcome to HydroBloom! This app reminds you to drink water!
        </Text>
        <CenteredButton title={"Sign Up"} style={styles.button} onPress={navigateToSignUp}/>
        <Text style={styles.text}>Already have an account?</Text>
        <Text style={styles.signin} onPress={navigateToSignIn}>Sign In</Text>
      </Container>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  image: {
    resizeMode: 'contain',
    marginBottom: 20
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 5
  },
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  signin: {
    color: "#241F5E",
    fontWeight: "bold",
    fontSize: 18
  },
  button: {
    marginBottom: 50
  }
});