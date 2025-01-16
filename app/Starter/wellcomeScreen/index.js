import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleNavigateToSignin = () => {
    navigation.navigate('Signin'); // Navigate to Signin screen
  };

  return (
    <View style={styles.container}>
      {/* Logo or Image */}
      <Image
        source={{ uri: 'https://your-logo-url.com/logo.png' }} // Replace with your image URL
        style={styles.logo}
      />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Our App!</Text>
      <Text style={styles.subtitle}>We are excited to have you here. Please sign in to continue.</Text>

      {/* Button to navigate to Signin */}
      <Button title="Get Started" onPress={handleNavigateToSignin} />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50', // Dark color for title
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#7f8c8d', // Lighter color for subtitle
  },
});
