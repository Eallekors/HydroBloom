import { Text, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'


const Home = () => {
  useEffect(() => {
    const backAction = () => {
        // Prevent going back
        return true;
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => backHandler.remove();
}, []);

  return (
    <SafeAreaView style={{ backgroundColor:'#fff'}}>
      <Text>Home</Text>
    </SafeAreaView>
  )
}
export default Home