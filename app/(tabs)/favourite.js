import React from 'react';
import { Text, View } from 'react-native';

const Favourites = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        Favourites
      </Text>
    </View>
  );
};

export default Favourites;
