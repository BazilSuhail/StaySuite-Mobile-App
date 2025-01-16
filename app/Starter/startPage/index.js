import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StartingPage = () => {
  const navigation = useNavigation();

  const handleNavigateToSignin = () => {
    navigation.navigate('Signin'); // Navigate to the Signin screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App!</Text>
      <Text style={styles.subtitle}>Please sign in to continue.</Text>
      <Button title="Go to Sign In" onPress={handleNavigateToSignin} />
    </View>
  );
};

export default StartingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
});
