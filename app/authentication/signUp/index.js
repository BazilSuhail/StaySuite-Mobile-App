import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import axios from 'axios'
import { Entypo } from '@expo/vector-icons'
import config from '@/Config/Config'
import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      console.error('Registration failed:', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-blue-500">Registering...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 items-center'>

      <StatusBar backgroundColor='#E11D48' barStyle='light-content' />

      <View className='w-full bg-rose-600 h-[220px] rounded-b-[28px] flex justify-center items-center'>
        {/* Logo Section */}
        <View className="flex-row items-center justify-center mb-2">
          <View className=" bg-rose-600 rounded-full flex items-center justify-center">
            <Text className="text-white text-lg font-bold">S</Text>
          </View>
          <Text className="text-rose-50 text-2xl font-bold ml-2">
            Stay<Text className="text-red-300">Suite</Text>
          </Text>
        </View>

        <Text className="text-rose-50 text-center text-[11px] font-[600]">
          Stay, Host, Explore.
        </Text>

      </View>

      <View className="w-full p-4">

        {/* Role Selection */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={`flex-1 p-3 border-2 rounded-lg mr-2 ${formData.role === 'Guest' ? 'border-rose-600 bg-rose-100' : 'border-gray-300'}`}
            onPress={() => handleRoleChange('Guest')}
          >
            <View className="flex-row items-center justify-center">
              <Entypo name="user" size={20} color="#dc2626" />
              <Text className="text-rose-950 text-lg ml-2">Guest</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-3 border-2 rounded-lg ml-2 ${formData.role === 'Host' ? 'border-rose-600 bg-rose-100' : 'border-gray-300'}`}
            onPress={() => handleRoleChange('Host')}
          >
            <View className="flex-row items-center justify-center">
              <Entypo name="user" size={20} color="#dc2626" />
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
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Password</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => setFormData({ ...formData, password: value })}
            secureTextEntry
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="w-full bg-rose-600 p-3 rounded-lg mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold">Sign Up</Text>
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
            Already have an account?{' '}
            <Link href="/authentication/signIn" replace className="text-rose-700 underline">Sign In</Link>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignUp;