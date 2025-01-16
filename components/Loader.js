import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, withRepeat, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const Loader = () => {
  // Shared value for rotation
  const rotation = useSharedValue(0);

  // Rotation animation
  rotation.value = withRepeat(
    withTiming(360, { duration: 2000, easing: Easing.linear }),
    Infinity,
    0
  );

  // Animated style for the spinner
  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, spinnerStyle]} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background
  },
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 8,
    borderColor: '#3498db', // Modern blue color
    borderRadius: 30,
    borderTopColor: 'transparent', // Create the spinning effect by making top part transparent
  },
});
