import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, View, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons, AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Expo icons

import Slider from '@react-native-community/slider';
const FilterModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [country, setCountry] = useState('');
    const [suburb, setSuburb] = useState('');
    const [minPrice, setMinPrice] = useState(10);
    const [maxPrice, setMaxPrice] = useState(250);
    const [beds, setBeds] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [category, setCategory] = useState('');
    const [heights, setHeights] = useState([]);

    useEffect(() => {
        const calculatedHeights = Array.from({ length: 50 }, () => Math.floor(Math.random() * (80 - 10 + 1)) + 10);
        setHeights(calculatedHeights);
    }, []);

    const resetFilters = () => {
        setTitle('');
        setCountry('');
        setSuburb('');
        setMinPrice(10);
        setMaxPrice(250);
        setBeds(0);
        setBathrooms(0);
        setCategory('');
    };

    const logValues = () => {
        console.log({ title, suburb, country, minPrice, maxPrice, beds, bathrooms, category });
        //setSearchFilters({ title, suburb, country, minPrice, maxPrice, beds, bathrooms, category });
        setIsModalVisible(false)
        //closeFilterModal();
    };
    return (
        <View className="flex-1 justify-center items-center">
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                className="bg-rose-700 px-6 py-3 rounded-full"
            >
                <Text className="text-white">Open Filters</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className='flex-1 justify-end items-center bg-[#0000003d]'>
                    <View className="w-[95%] bg-white rounded-lg p-4">

                        <View className="flex-row justify-between items-center border-b border-gray-400 pb-4">
                            <Text className="text-lg font-semibold">Filters</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <View className="mt-4">
                            <View className="mb-[10px] pl-[6px] flex-row items-center border-[2px] border-gray-300 rounded-[12px]">
                                <Ionicons name="search" size={22} color="gray" />
                                <TextInput
                                    style={{ fontSize: 14 }}
                                    placeholder="Search by title"
                                    value={title}
                                    onChangeText={setTitle}
                                    className="outline-none  text-[14px]"
                                />
                            </View>

                            <View className="mb-6 flex-row items-center">
                                <TextInput
                                    placeholder="Enter Country Name"
                                    value={country}
                                    onChangeText={setCountry}
                                    className="px-2 py-[4px] overflow-hidden w-[49%] mr-[1%] text-[12px] outline-none border-[2px] border-gray-300 rounded-[6px]"
                                />
                                <TextInput
                                    placeholder="Enter Suburb of Country"
                                    value={suburb}
                                    onChangeText={setSuburb}
                                    className="px-2 py-[4px] overflow-hidden w-[49%] ml-[1%] text-[12px] outline-none border-[2px] border-gray-300 rounded-[6px]"
                                />
                            </View>

                            <Text className="font-medium">Price Range</Text>
                            <Text className="text-[12px] mb-[15px] text-gray-500">
                                Nightly prices before fees and taxes
                            </Text>


                            <View className="pt-[15px]  border-t-[2px] border-gray-300 border-b-[2px] pb-[28px]">
                                <View className="flex-row overflow-hidden w-full scale-y-[-1] mb-2">
                                    {heights.map((randomHeight, index) => {
                                        const stepValue = 10 + index * 5; // Each bar represents a step of 5
                                        const isInRange = stepValue >= minPrice && stepValue <= maxPrice;

                                        return (
                                            <View
                                                key={index}
                                                className={`w-full ${isInRange ? 'bg-pink-500' : 'bg-gray-300'}`}
                                                style={{
                                                    flex: 0, // Remove 'w-full' class and avoid conflicts
                                                    width: 6.5, // Explicit width
                                                    marginRight: 1, // Margin between bars
                                                    height: randomHeight, // Use height directly
                                                }}
                                            ></View>
                                        );
                                    })}
                                </View>
                                <View className="flex-row justify-between mt-2">
                                    <Text className='text-[15px] text-gray-400 font-[700]'>${minPrice}</Text>
                                    <Text className='text-[15px] text-rose-600 font-[700]'>${maxPrice}+</Text>
                                </View>
                                <Slider
                                    minimumValue={10}
                                    maximumValue={250}
                                    step={5}
                                    value={minPrice}
                                    onValueChange={(value) => setMinPrice(value)}
                                    className="absolute w-full slider-thumb text-rose-700 appearance-none bg-transparent z-10 pointer-events-auto"
                                />
                                <Slider
                                    minimumValue={10}
                                    maximumValue={250}
                                    step={5}
                                    value={maxPrice}
                                    onValueChange={(value) => setMaxPrice(value)}
                                    className="absolute w-full slider-thumb2 appearance-none bg-transparent mt-[15px] z-10 pointer-events-auto"
                                />
                            </View>

                            <View className="pt-[15px]  border-t-[2px] border-gray-300 border-b-[2px] pb-[28px]">
                                <Text className="font-medium text-gray-500"><FontAwesome5 name="bed" size={18} color="#6B7280" />{"  "}Beds and Bathrooms</Text>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text>Beds</Text>
                                    <View className="flex-row  items-center">
                                        <TouchableOpacity
                                            className="p-[6px] border-[1.5px] rounded-full shadow-md text-gray-700 border-gray-200 bg-gray-50"
                                            onPress={() => setBeds((prev) => (prev === 'Any' ? 0 : Math.max(0, prev - 1)))}
                                        >
                                            <AntDesign name="minus" size={12} />
                                        </TouchableOpacity>
                                        <Text className="px-4 text-gray-500 text-[16px] font-[600]">{beds}</Text>
                                        <TouchableOpacity
                                            className="p-[6px] border-[1.5px] rounded-full shadow-md text-gray-700 border-gray-200 bg-gray-50"
                                            onPress={() => setBeds((prev) => (prev === 'Any' ? 1 : prev + 1))}
                                        >
                                            <AntDesign name="plus" size={12} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View className="flex-row  justify-between items-center mt-2">
                                    <Text>Bathrooms</Text>
                                    <View className="flex-row  items-center">
                                        <TouchableOpacity
                                            className="p-[6px] border-[1.5px] rounded-full shadow-md text-gray-700 border-gray-200 bg-gray-50"
                                            onPress={() => setBathrooms((prev) => prev === 'Any' ? 0 : Math.max(0, prev - 1))}
                                        >
                                            <AntDesign name="minus" size={12} />
                                        </TouchableOpacity>
                                        <Text className="px-4 text-gray-500 text-[16px] font-[600]">{bathrooms}</Text>
                                        <TouchableOpacity
                                            className="p-[6px] border-[1.5px] rounded-full shadow-md text-gray-700 border-gray-200 bg-gray-50"
                                            onPress={() => setBathrooms((prev) => (prev === 'Any' ? 1 : prev + 1))}
                                        >
                                            <AntDesign name="plus" size={12} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </View>
                        <View className="flex-row justify-between items-center mt-[15px]">
                            <Pressable
                                className="text-gray-700 font-[600]"
                                onPress={resetFilters}
                            >
                                <Text>Clear all</Text>
                            </Pressable>
                            <Pressable
                                className="bg-rose-700 flex-row  items-center  px-[15px] py-[6px] rounded-[11px] hover:bg-rose-900 duration-200"
                                onPress={logValues}
                            >
                                <Ionicons name="search" size={18} color="white" /><Text className='text-white font-[600]'>{" "}Search</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </Modal>
        </View>
    );
};

export default FilterModal;
