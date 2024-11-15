import { Text, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import IconButton from "../../components/IconButton.jsx";
import React, { useEffect, useState } from 'react'


const Profile = () => {
  // Define a state to hold the selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = (buttonTitle, selectedOption) => {
    console.log(`Selected from ${buttonTitle}: ${selectedOption.title}`);
    
    // Update the state with the selected option
    setSelectedOptions((prev) => [
      ...prev,
      { buttonTitle, selectedOption },
    ]);
  };
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
    <SafeAreaView style={{ backgroundColor:'#fff'}}>
      <Text>Settings</Text>
      <IconButton
            title="Click Me 1"
            onPress={() => console.log('Button pressed')}
            icon={require('../../assets/icons/ruler.png')}
            dropdownItems={dropdownItems}
            onOptionSelect={handleOptionSelect}  // Pass callback to child
          />
    </SafeAreaView>
  )
}
export default Profile