import React from 'react';
import { View, Text, Button, Image } from 'react-native'; 

const WelcomeScreen = () => { 

  return (
    <View className='bg-yellow-300 flex-1 h-screen justify-center items-center'> 
      <Text  >Welcome to Our App!</Text>
      <Text >We are excited to have you here. Please sign in to continue.</Text>
 
    </View>
  );
};

export default WelcomeScreen;
 