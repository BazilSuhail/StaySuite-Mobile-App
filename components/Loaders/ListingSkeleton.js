import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const ListingSkeleton = () => {
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
        outputRange: ['rgb(219, 222, 227)', 'rgb(236, 238, 241)'],
    });

    return (
        <View className="w-full mt-[15px]">
            <Animated.View
                style={{ backgroundColor }}
                className="w-full h-[200px] rounded-lg"
            ></Animated.View>
            <Animated.View
                style={{ backgroundColor }}
                className="w-[160px] h-[10px] mt-[10px] rounded-lg"
            ></Animated.View>
            <Animated.View
                style={{ backgroundColor }}
                className="w-[160px] h-[10px] mt-[10px] rounded-lg"
            ></Animated.View>
            <View className="flex-row justify-between items-center">
                <Animated.View
                    style={{ backgroundColor }}
                    className="w-[120px] h-[30px] mt-[12px] rounded-md"
                ></Animated.View>
                <Animated.View
                    style={{ backgroundColor }}
                    className="w-[120px] h-[30px] mt-[12px] rounded-md"
                ></Animated.View>
            </View>
        </View>
    );
};

export default ListingSkeleton;