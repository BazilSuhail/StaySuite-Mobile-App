import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const BookingSkeleton = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const blink = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: false,
                }),
            ]).start(() => blink());
        };

        blink();
    }, [fadeAnim]);

    const backgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(229, 229, 229)', 'rgb(243, 244, 246)'],  
    });

    return (
        <Animated.View
            style={{ backgroundColor }}
            className="w-full mt-[15px] h-[100px] rounded-lg"
        ></Animated.View>
    );
};

export default BookingSkeleton;