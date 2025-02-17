import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const FavouriteSkeleton = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const blink = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: false,
                }),
            ]).start(() => blink());
        };

        blink();
    }, [fadeAnim]);

    const backgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(229, 229, 229)', 'rgb(243, 244, 246)'], // gray-200 to gray-50
    });

    return (
        <View className="w-full flex-row items-center">
            <Animated.View
                style={{ backgroundColor }}
                className={`mb-[8px] ml-[1%] h-[150px] w-[48%] mr-[1%] rounded-[8px]`}
            ></Animated.View>
            <Animated.View
                style={{ backgroundColor }}
                className={`mb-[8px] mr-[1%] h-[150px] w-[48%] ml-[1%] rounded-[8px]`}
            ></Animated.View>
        </View>
    );
};

export default FavouriteSkeleton;