// import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import Container from "../components/Container.jsx";

export default function Index() {
  return (
    <SafeAreaView>
      <Container >
        <Text>Hello world!</Text>
        <Button title="Login" onPress={() => router.push('/Auth/login')} />
        <Button title="Sign up" onPress={() => router.push('/Auth/signup')} />
       
      </Container>
    </SafeAreaView>
  );
}
