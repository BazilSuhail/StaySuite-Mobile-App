import React from 'react';
import { Text, View } from 'react-native';

const Search = () => {
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
        Search
      </Text>
    </View>
  );
};

export default Search;
