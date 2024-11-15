// import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import Container from "../components/Container.jsx";
import Header from "../components/Header.jsx"
import IconButton from "../components/IconButton.jsx";

export default function Index() {
  const dropdownItems = [
    {
      title: 'Option 1',
      onPress: () => alert('Option 1 selected'),
    },
    {
      title: 'Option 2',
       onPress: () => alert('Option 2 selected'),
    },
    {
      title: 'Option 3',
      onPress: () => alert('Option 3 selected'),
    },
  ];

  return (
    <SafeAreaView>
      <Container >
        <Header title="SPlash"  showBack={true}/>
        <Text>Hello world!</Text>
        <IconButton
        title="Click Me"
        onPress={() => console.log('Button pressed')}
        icon={require('../assets/icons/ruler.png')} // Your icon image path here
        dropdownItems={dropdownItems}
        />
        <IconButton
        title="Click Me"
        onPress={() => console.log('Button pressed')}
        icon={require('../assets/icons/ruler.png')} // Your icon image path here
        dropdownItems={dropdownItems}
        />
      </Container>
    </SafeAreaView>
  );
}
