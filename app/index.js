import { useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logo from '@/assets/images/icon.png'
import { useRouter } from 'expo-router'

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkJustInstalled = async () => {
      try {
        const justInstalled = await AsyncStorage.getItem('justInstalled');
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (justInstalled === 'true') {
          router.replace('/(tabs)');
        }
        else {
          router.replace('/well-come-screen');
        }
      }
      catch (error) {
        router.replace('/well-come-screen');
      }
    };

    checkJustInstalled();
  }, [router]);

  return (
    <View className='flex-1 justify-between items-center bg-white'>
      <StatusBar backgroundColor='#FFFFFF' barStyle='light-content' />
      <View className='bg-rose-600 h-3 w-4'></View>

      <View className='rounded-full overflow-hidden mt-[3px] w-[110px] h-[110px]'>
        <Image source={logo} className='w-full h-full' />
      </View>

      <View className='mb-[15px]'>
        <Text className='text-rose-300 text-[10px] text-center font-[700]'>Made By</Text>
        <Text className='text-rose-700 font-[700]'>EntityStudio</Text>
      </View>
    </View>
  );
};

export default Index;