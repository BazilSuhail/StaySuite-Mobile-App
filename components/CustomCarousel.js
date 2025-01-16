import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Image, Dimensions, FlatList, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  return (
    <View>
      {/* Carousel */}
      <StatusBar backgroundColor='#0000004D' barStyle='light-content' />
      <View className="h-[330px] w-screen">
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image source={{ uri: item }} className="h-full w-full" />
            </View>
          )}
          snapToInterval={width}
          decelerationRate="fast"
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16} // For better scroll performance
        />
      </View>

      {/* Indicators */}
      <View className='flex-row items-center mt-[-22px] bg-black/30 px-[15px] rounded-lg py-[4px] mx-auto space-x-[4px]'>
        {images.map((_, index) => (
          <View
            key={index}
            className={`w-[6px] h-[6px] rounded-full bg-gray-300 ${currentIndex === index && 'bg-white w-[10px] h-[10px]'}`}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  carouselItem: {
    width: width,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
