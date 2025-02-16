import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import axios from 'axios'
import config from '@/Config/Config'
import { useAuthContext } from '@/hooks/AuthProvider'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import authBackground from '@/assets/authBackground.jpg'
import logo from '@/assets/logo.webp'

const SignIn = () => {
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.BACKEND_URL}/air-bnb/auth/login`, formData);
      login(response.data.token);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-blue-500">Signing In...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 items-center'>

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

      <View className='p-4 w-full flex justify-center items-center'>

        <Text className="text-2xl font-bold mb-6">Login</Text>

        {/* Email Input */}
        <View className="w-full mb-4">
          <Text className="text-sm text-gray-700 mb-2">Email</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your email"
            value={email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="w-full mb-6">
          <Text className="text-sm text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg">
            <TextInput
              className="flex-1 p-3"
              placeholder="Enter your password"
              value={password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} className="p-3">
              {showPassword ? (
                <Entypo name="eye" size={20} color="#9CA3AF" />
              ) : (
                <Entypo name="eye-with-line" size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-rose-600 p-3 rounded-lg mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold">Log In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Sign In Link */}
        <View>
          <Text className="text-gray-500 text-center">
            Doesn't have an account yet?{' '}
            <Link href="/authentication/signUp" replace className="text-rose-700 underline">Register</Link>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignIn;