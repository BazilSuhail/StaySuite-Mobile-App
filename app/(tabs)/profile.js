import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, TouchableOpacity, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/hooks/cartSlice';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import config from '@/Config/Config';
import { useRouter } from 'expo-router';
import Loader from '@/components/Loader';
import { clearToken } from '@/hooks/authSlice';

import noLogin from '@/assets/noLogin.jpg';

const Profile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        bio: '',
        address: {
            city: '',
            street: '',
            country: ''
        },
        contact: ''
    });
    const [isEditing, setIsEditing] = useState(false);


    const fetchProfile = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await axios.get(`${config.REACT_APP_API_BASE_URL}/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
                setFormData({
                    email: response.data.email,
                    fullName: response.data.fullName,
                    bio: response.data.bio,
                    address: response.data.address || { city: '', street: '', country: '' },
                    contact: response.data.contact || ''
                });
            }
            else {
                //navigation.navigate('Signin');
                setError('Failed to fetch profile');
            }
        } catch (error) {
            setError('Failed to fetch profile');
        }
    }, []);

    const handleChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddressChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.put(`${config.REACT_APP_API_BASE_URL}/auth/profile`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Optionally refetch the profile data to reflect updates
            fetchProfile();
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        dispatch(clearToken());
        dispatch(clearCart());
        setError('Failed to fetch profile');
        router.push(`/login`);
    };

    const handleNavigatetoSignIn = async () => {
        router.push('/login');
    };


    const handleSeeOrders = () => {
        router.push(`/showOrders`);
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (error) return (
        <View className='bg-white pt-[28px]'>
            <Text className="mx-auto mt-4 w-[92%] text-[20px] mb-1 text-red-800 font-bold">My Profile</Text>
            <View className="bg-gray-300 mb-3 w-[92%] h-[3px] mx-auto"></View>

            <View className=" flex h-screen w-screen justify-center items-center">
                <Image
                    source={noLogin}
                    className="h-[220px] w-[220px] mt-[-95px]"
                />
                <Text className='text-[15px] text-red-900  font-[600]'>You Are not Logged In</Text>
                <Pressable onPress={() => router.push(`/login`)}>
                    <Text className='text-[13px] mt-[2px] font-[800] underline text-red-600'>Register Now !!</Text>
                </Pressable>
            </View>
        </View>
    );

    if (!user) return (
        <View className='h-screen flex items-center justify-center'>
            <Loader />
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 pt-[50px] px-4">
            <View className="mb-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-lg text-red-700 font-bold ">
                        Welcome, <Text className="text-black text-2xl">{user.fullName || 'Anonymous User'}</Text>
                    </Text>
                    <TouchableOpacity onPress={handleLogout} className="bg-red-800 rounded-md p-[6px]">
                        <MaterialIcons name="logout" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="bg-gray-300 w-full mb-4 h-[3px]"></View>
                {isEditing ? (
                    <ScrollView className="space-y-4">
                        {user.fullName === "" &&
                            <Text className="text-[12px] text-red-500 mb-4">
                                * Kindly Before Placing Any Orders. Remember to Fill out Details for Faster Checkout. Only Entered info will be used for Shipping.
                            </Text>
                        }
                        <View className="bg-white px-3 py-2 rounded-xl border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">Email</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(value) => handleChange('email', value)}
                                className="px-[12px] py-[7px] border text-[14px] border-gray-400 rounded-[25px] bg-gray-50 mt-1"
                                keyboardType="email-address"
                                placeholder="Enter your Email"
                            />
                        </View>
                        <View className="bg-white px-3 py-2 rounded-l border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">Full Name</Text>
                            <TextInput
                                value={formData.fullName}
                                onChangeText={(value) => handleChange('fullName', value)}

                                className="px-[12px] py-[7px] border text-[14px] border-gray-400 rounded-[25px] bg-gray-50 mt-1"
                                placeholder="Enter your Full Name"
                            />
                        </View>
                        <View className="bg-white px-3 py-2 rounded-l border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">Bio</Text>
                            <TextInput
                                value={formData.bio}
                                onChangeText={(value) => handleChange('bio', value)}

                                className="px-[12px] py-[7px] border text-[14px] border-gray-400 rounded-[25px] bg-gray-50 mt-1"
                                placeholder="Enter your Bio"
                                multiline
                            />
                        </View>
                        <View className="bg-white px-3 py-2 rounded-l border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">City</Text>
                            <TextInput
                                value={formData.address.city}
                                onChangeText={(value) => handleAddressChange('city', value)}

                                className="px-[12px] py-[7px] border text-[14px] border-gray-400 rounded-[25px] bg-gray-50 mt-1"
                                placeholder="Enter your City"
                            />
                        </View>
                        <View className="bg-white px-3 py-2 rounded-l border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">Street</Text>
                            <TextInput
                                value={formData.address.street}
                                onChangeText={(value) => handleAddressChange('street', value)}

                                className="px-[12px] py-[7px] border text-[14px] border-gray-400 rounded-[25px] bg-gray-50 mt-1"
                                placeholder="Enter your Street"
                            />
                        </View>
                        <View className="bg-white px-3 py-2 rounded-l border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">Country</Text>
                            <TextInput
                                value={formData.address.country}
                                onChangeText={(value) => handleAddressChange('country', value)}

                                className="px-[12px] py-[7px] border text-[14px] border-gray-400 rounded-[25px] bg-gray-50 mt-1"
                                placeholder="Enter your Country"
                            />
                        </View>

                        <View className="bg-white px-3 py-2 rounded-l border border-gray-300">
                            <Text className="text-sm font-medium text-gray-700">Contact</Text>
                            <TextInput
                                value={formData.contact}
                                onChangeText={(value) => handleChange('contact', value)}
                                className="p-2 border border-gray-300 rounded-md"
                                placeholder="Enter your Contact"
                            />
                        </View>
                        <TouchableOpacity className="bg-blue-700 border border-gray-400 ml-[4px] rounded-lg px-3 py-3" onPress={handleSubmit}>
                            <Text className="text-[18px] text-center text-white font-semibold">Update Profile</Text>
                        </TouchableOpacity>
                        <View className="h-[65px]"></View>

                    </ScrollView>
                ) : (
                    <ScrollView className="space-y-4">
                        <View className="flex-row justify-around">
                            <View className="w-[48%] flex py-4 bg-yellow-100 rounded-md justify-center items-center">
                                <FontAwesome5 name="truck" size={45} color="#dad37d" />
                                <Text className="text-[12px] text-center font-bold text-[#fff589] bg-[#d5ce82] px-2 rounded-xl py-[3px]  mt-[15px]">Orders Pending</Text>
                            </View>
                            <TouchableOpacity onPress={handleSeeOrders} className="w-[48%] flex py-4 bg-white rounded-md justify-center items-center">
                                <FontAwesome5 name="truck-loading" size={45} color="#00b316" />
                                <Text className="text-[12px] text-center font-bold bg-green-100 text-green-700 px-2 rounded-xl py-[3px] mt-[15px]">Order History</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-gray-50 rounded-lg py-4 px-4">
                            <View className="w-[100%] mb-[15px] flex flex-row justify-center space-x-2">
                                <View className="w-[50%]">
                                    <Text className="text-sm text-gray-400  font-bold">Name:</Text>
                                    <Text className="text-gray-600 font-semibold text-[15px]">{user.fullName}</Text>
                                </View>
                                <View className="w-[50%]">
                                    <Text className="text-sm text-gray-400 font-bold">Email:</Text>
                                    <Text className="text-gray-600 font-semibold text-[14px]">{user.email}</Text>
                                </View>
                            </View>

                            <View className="w-[100%] mb-[15px] flex flex-row justify-center space-x-2">
                                <View className="w-[50%]">
                                    <Text className="text-sm text-gray-400 font-bold">Contact:</Text>
                                    <Text className="text-gray-600 font-semibold text-[14px]">{user.contact}</Text>
                                </View>
                                <View className="w-[50%]">
                                    <Text className="text-sm text-gray-400 font-bold">Country / City:</Text>
                                    <Text className="text-gray-600 font-semibold text-[14px]">{user.address?.country} / {user.address?.city}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity className="flex-row items-center ml-auto w-[114px] bg-blue-500 rounded-lg px-3 py-1" onPress={() => setIsEditing(!isEditing)}>
                            <FontAwesome5 name="edit" size={13} color="white" />
                            <Text className="text-[14px] ml-[5px] text-center text-white font-semibold">{isEditing ? "Cancel" : "Edit Profile"} </Text>
                        </TouchableOpacity>

                        <View>
                            <Text className="font-medium mb-2 mt-[-25px]">Address:</Text>
                            <View className="bg-red-100 bprder p-2 rounded-lg">
                                <Text className="text-[14px] font-semibold">{user.address?.street}</Text>
                            </View>
                            <Text className="text-[11px] font-[600] mt-[8px] text-red-500">* Kindly fill the details carefully as this info will be used automatically by the system for shipping</Text>
                        </View>
                        <View className="h-[55px]"></View>
                    </ScrollView>
                )}

            </View>
        </View>
    );
};

export default Profile;
