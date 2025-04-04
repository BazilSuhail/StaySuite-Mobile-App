import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native'
import axios from 'axios'
import { Entypo, FontAwesome6 } from '@expo/vector-icons'
import config from '@/Config/Config'
import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import authBackground from '@/assets/authBackground.jpg'
import logo from '@/assets/images/icon.png'

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Guest',
  });

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.BACKEND_URL}/air-bnb/auth/register`, formData);
      //console.log('Registration successful:', response.data);
      router.push('/authentication/signIn');
    } catch (error) {
      setError("Registration Failed, Account Already Exists")
    } finally {
      setLoading(false) 
    }
  };
 

  return (
    <View className="flex-1 bg-white" >
      <StatusBar backgroundColor='#00000001' barStyle='light-content' />

      <View className='w-full bg-rose-600 h-[250px] rounded-b-[20px] overflow-hidden flex justify-center items-center relative'>
        <Image source={authBackground} className='w-full h-full absolute' />
        
        <View className='w-full h-full absolute bg-black/50 rounded-b-[28px]' /> 
        <View className="flex-row items-center justify-center mb-2 z-10">
          <View className='rounded-full overflow-hidden mt-[3px] w-[52px] h-[50px]'>
            <Image
              source={logo}
              className='w-full h-full'
            />
          </View>
          <Text className="text-white text-[38px] font-bold ml-2">
            Stay<Text className="text-red-300">Suite</Text>
          </Text>
        </View>

        {/* Text */}
        <Text className="text-rose-50 text-center text-[13px] ml-[15px] font-[600]">
          Stay, Host, Explore.
        </Text>
      </View>

      <View className="w-full p-4">

        {/* Role Selection */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={`flex-1 p-[5px] border-2 rounded-lg mr-2 ${formData.role === 'Guest' ? 'border-rose-600 bg-rose-100' : 'border-gray-300'}`}
            onPress={() => handleRoleChange('Guest')}
          >
            <View className="flex-row items-center justify-center">
            <FontAwesome6 name="people-group" size={20} color="#dc2626" /> 
              <Text className="text-rose-950 text-lg ml-2">Guest</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-[5px] border-2 rounded-lg ml-2 ${formData.role === 'Host' ? 'border-rose-600 bg-rose-100' : 'border-gray-300'}`}
            onPress={() => handleRoleChange('Host')}
          >
            <View className="flex-row items-center justify-center">
            <FontAwesome6 name="people-roof"size={20} color="#dc2626" /> 
              <Text className="text-rose-950 text-lg ml-2">Host</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Name Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Name</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(value) => setFormData({ ...formData, fullName: value })}
          />
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Email</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="">
          <Text className="text-sm text-gray-700 mb-2">Password</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => setFormData({ ...formData, password: value })}
            secureTextEntry
          />
        </View>

        {error !== "" && 
        <View className="mt-[15px] flex-row justify-start">
          <Text className="text-red-600 text-[12px] font-[600]">*
            <Text className="underline underline-offset-4">{error}</Text>
          </Text>
        </View>}

        {/* Sign Up Button */}
        {loading ?
            <View className="w-full mt-6 flex-row justify-center bg-[#fa6182] p-3 rounded-lg mb-4" >
              <Text className="text-rose-200 mr-[8px] font-bold">Sign Up</Text>
              <ActivityIndicator size={22} color="#FECDD3" />
            </View>
            :
            <TouchableOpacity className="w-full mt-6 bg-rose-600 p-3 rounded-lg mb-4" onPress={handleSubmit} >
              <Text className="text-white text-center font-bold">Sign Up</Text>
            </TouchableOpacity>
        } 

        {/* Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Sign In Link */}
        <View>
          <Text className="text-gray-500 text-center">
            Already have an account?{' '}
            <Link href="/authentication/signIn" replace className="text-rose-700 underline">Sign In</Link>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignUp;