import React, { useState } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

const WelcomeScreen = () => {
  const [step, setStep] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const translateX = useSharedValue(0);

  const handleNext = () => {
    if (step < 3) {
      translateX.value = withTiming(-(screenWidth * (step + 1)), {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setStep(step + 1);
    } else {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setStep(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className={`bg-white flex-1 w-screen h-screen ${step === 3 ? 'justify-center' : 'justify-between'}  items-center`}>

      <View>
        {/* Empty View for potential header or other content */}
      </View>
      <View className='overflow-hidden w-screen flex justify-center'>
        <Animated.View style={[animatedStyle, { flexDirection: 'row', width: screenWidth * 3 }]}>
          <View className='w-screen flex items-center'>
            <View className='h-[200px] w-[280px]'>
              <Image
                source={require('@/assets/Assets/noReservations.webp')}
                alt="No Reservations"
                className="w-full h-full"
              />
            </View>
            <Text className='text-rose-800 text-[12px] font-[500] mt-[15px] w-[70%] text-center'>
              Explore a variety of stunning properties and book your ideal stay with a simple, hassle-free reservation process.
            </Text>
          </View>

          <View className='w-screen flex items-center'>
            <View className='h-[200px] w-[210px]'>
              <Image
                source={require('@/assets/Assets/wellcome-1.jpg')}
                alt="No Reservations"
                className="w-full h-full"
              />
            </View>
            <Text className='text-rose-800 text-[12px] font-[500] mt-[15px] w-[70%] text-center'>
              Mark properties as favorites to easily compare and revisit your top choices whenever you are ready to book.
            </Text>
          </View>

          <View className='w-screen flex items-center'>
            <View className='h-[220px] w-[180px]'>
              <Image
                source={require('@/assets/Assets/wellcome-2.jpg')}
                alt="No Reservations"
                className="w-full h-full"
              />
            </View>
            <Text className='text-rose-800 text-[12px] font-[500] mt-[15px] w-[70%] text-center'>
              Sign up to leave meaningful reviews, share your experiences, and help others find the perfect property.
            </Text>
          </View>

          <View className='w-screen flex mb-[25px] items-center'>
            <View className='h-[110px] w-[280px]'>
              <Image
                source={require('@/assets/Assets/wellcome-3.jpg')}
                alt="No Reservations"
                className="w-full h-full"
              />
            </View>

            <Text className='mt-[35px] font-[600] text-rose-600'>How would you like to continue</Text>

            <Pressable className='bg-rose-700 mt-[30px] rounded-[20px] py-[8px] w-[250px]'>
              <Text className='text-white text-[16px] text-center'>Register</Text>
            </Pressable>
            <Pressable className='border-[2px] border-rose-700 mt-[8px] rounded-[20px] py-[8px] w-[250px]'>
              <Text className='text-rose-700 text-[16px] font-[700] text-center'>Login</Text>
            </Pressable>

          </View>
        </Animated.View>

        <View className='mx-auto mt-[15px] flex-row '>
          <View
            className={`bg-rose-600 mr-[3px] h-[10px] rounded-full ${step === 0 ? 'w-[22px]' : 'w-[10px]'
              }`}
          />
          <View
            className={`bg-rose-600 mr-[3px] h-[10px] rounded-full ${step === 1 ? 'w-[22px]' : 'w-[10px]'
              }`}
          />
          <View
            className={`bg-rose-600 mr-[3px] h-[10px] rounded-full ${step === 2 ? 'w-[22px]' : 'w-[10px]'
              }`}
          />
          <View
            className={`bg-rose-600 mr-[3px] h-[10px] rounded-full ${step === 3 ? 'w-[22px]' : 'w-[10px]'
              }`}
          />
        </View>
      </View>

      {step !== 3 &&
        <View className='w-full flex-row px-[15px] justify-between items-center mb-[20px]'>
          <Pressable className='' onPress={handleNext}>
            <Text className='text-red-600 font-[600] underline underline-offset-1 text-[16px]'>Skip</Text>
          </Pressable>

          <Pressable className='bg-rose-700 rounded-[15px] px-[15px]' onPress={handleNext}>
            <Text className='text-white font-[600] text-[14px] my-[3px]'>Next</Text>
          </Pressable>
        </View>
      }
    </View>
  );
};

export default WelcomeScreen;
