import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '@/assets/logo.webp';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/hooks/AuthProvider';

const LoadApp = ({ onLoadComplete }) => {
    const {navigateUser} = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const checkTokenAndNavigate = async () => {
            // Wait for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            const token = await AsyncStorage.getItem('justInstalled');
            console.log('Token value:', token);

            if (token === 'true') {
                console.log("Navigating tok home");
                //onLoadComplete();

                router.replace("/search");
            }
            
            navigateUser(); 
            console.log("aaa") 
            onLoadComplete();
        };

        // Ensure navigation stack is ready
        const timeoutId = setTimeout(() => {
            checkTokenAndNavigate();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [router, onLoadComplete]);

    return (
        <View className='flex-1 justify-between items-center bg-white'>
            <StatusBar backgroundColor='#FFFFFF' barStyle='light-content' />
            <View className='bg-rose-600 h-3 w-4'></View>

            <View className='rounded-full overflow-hidden mt-[3px] w-[110px] h-[110px]'>
                <Image source={logo} className='w-full h-full' />
            </View>

            <View className='mb-[15px]'>
                <Text className='text-rose-300 text-[10px] text-center font-[700]'>Made By</Text>
                <Text className='text-rose-700 font-[700]'>EntidddtyStudio</Text>
            </View>
        </View>
    );
};

export default LoadApp;