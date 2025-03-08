import React, { useEffect, useRef } from 'react';
import { View, Animated, ScrollView } from 'react-native';

const ProfileSkeleton = () => {
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
        <ScrollView showsVerticalScrollIndicator={false} className="w-full border-t-[2px] border-gray-200 bg-white pt-[10px] px-[15px]">
            <Animated.View style={{ backgroundColor }} className="rounded-[18px] w-full flex-row justify-center items-center h-[150px]">
                <View className="h-[90px] w-[90px] rounded-full bg-gray-50"></View>
                <View className="pl-[15px]">
                    <View className="h-[25px] rounded-md w-[100px] bg-gray-50"></View>
                    <View className="h-[12px] rounded-md w-[180px] mt-[15px] bg-gray-50"></View>
                    <View className="h-[8px] rounded-sm w-[180px] mt-[8px] bg-gray-50"></View>
                </View>
            </Animated.View>

            <Animated.View style={{ backgroundColor }} className="rounded-[10px] mt-[25px] w-full h-[200px]">
                <View className="h-[65px] mx-auto mt-[40px] rounded-md w-[80%] bg-gray-50"></View>
                <View className="h-[15px] mx-auto mt-[35px] rounded-md w-[80%] bg-gray-50"></View>
                <View className="h-[15px] mx-auto mt-[8px] rounded-md w-[80%] bg-gray-50"></View>
            </Animated.View>

            <Animated.View style={{ backgroundColor }} className="rounded-[10px] w-full mt-[25px] flex-row justify-center items-center h-[320px]"></Animated.View>
        </ScrollView>
    );
};

export default ProfileSkeleton;