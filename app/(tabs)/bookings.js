/*import { useState, useEffect } from 'react'
import axios from 'axios'
import { View, Text, Image, TouchableOpacity, FlatList, Alert, Modal, ScrollView, Pressable } from 'react-native'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'

import AsyncStorage from "@react-native-async-storage/async-storage"
import config from "@/Config/Config"
import { Link } from 'expo-router'
import { Header } from '@/components/Header'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import BookingSkeleton from '@/components/Loaders/BookingSkeleton'

const getStatusStyle = (status) => {
  switch (status) {
    case 'paid':
      return '#047857';
    case 'pending':
      return '#F59E0B';
    case 'confirmed':
      return '#1E40AF';
    case 'canceled':
      return '#B91C1C';
    default:
      return '#9CA3AF';
  }
};

const Bookings = () => {
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${config.BACKEND_URL}/air-bnb/reservation/made-reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data.bookings);
        console.log(bookings)
      }
      catch (err) {
        console.log("asd")

        setError('Failed to fetch bookings');
      }
      finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const finalizeBooking = async () => {
    if (!selectedBooking || !selectedBooking._id) {
      Alert.alert("No booking selected to finalize.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${config.BACKEND_URL}/air-bnb/reservation/finalize-booking`,
        { bookingId: selectedBooking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Booking finalized successfully.");
      setSelectedBooking(null);
      setShowModal(false);
    } catch (err) {
      Alert.alert('Failed to finalize booking. Please try again.');
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  if (!loading) {
    return (
      <SafeAreaView className={`flex-1 pt-${insets.top} h-screen pb-[1000px]`}>
        <Header heading={"Booking"} />
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-y-[5px] px-[15px]">
          {Array.from({ length: 20 }).map((_, index) => (<BookingSkeleton key={index} />))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 pt-${insets.top} h-screen pb-[1000px]`}>
        <Header heading={"Booking"} />
        <View className="w-full h-screen" >
          <View className="min-h-screen w-full flex flex-col justify-center items-center mix-blend-multiply mt-[-120px]">
            <Image source={require('@/assets/Assets/noReservations.png')} alt="No Reservations" className="scale-[0.5] mb-[-90px]" />
            <Text className='text-[13px] text-red-900  font-[600]'>You haven't visited any place yet ...</Text>
            <Link href={'/'}>
              <Text className='text-[13px] mt-[2px] font-[800] underline text-red-600'>Start Exploring Today !!</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 pt-${insets.top} bg-gray-50 pb-[1000px]`}>
      <StatusBar backgroundColor='#f9fafb' barStyle='light-content' />
      <Header heading={"My Bookings"} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-y-[5px] px-[15px]">
        {Array.from({ length: 10 }).map((_, index) => (<BookingSkeleton key={index} />))}
      </ScrollView>

      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <Text className='text-[12px] font-[600] text-[#574a4d] my-[15px]'>
          Your reserved booking appear here.
        </Text>

        <FlatList
          data={bookings}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id || String(item)}
          contentContainerStyle={{ gap: 15 }}
          renderItem={({ item }) => {
            if (!item || !item.listing) {
              return null;
            }
            return (
              <View className="bg-white rounded-xl border border-gray-300 p-4 mb-0.5">
                
                <View className="flex-row items-center mb-3">
                  <View className="w-6 h-6 rounded-full bg-rose-600 justify-center items-center">
                    <FontAwesome5 name="book" size={11} color="#f8f8f8" />
                  </View>
                  <Text className="ml-2 text-sm font-semibold text-rose-700">
                    {item.listing.name.length > 35
                      ? `${item.listing.name.slice(0, 35)}...`
                      : item.listing.name}
                  </Text>
                </View>
                
                <View className="flex-row justify-between mb-3">
                  <View>
                    <Text className="text-xs font-semibold text-gray-500">Check-In</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {new Date(item.checkIn).toDateString()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs font-semibold text-gray-500">Check-Out</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {new Date(item.checkOut).toDateString()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text
                    className={`text-xs font-semibold text-white py-0.5 px-3 rounded-full ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </Text>
                  <TouchableOpacity
                    onPress={() => openModal(item)}
                    className="bg-rose-600 py-0.5 px-3 rounded-full"
                  >
                    <Text className="text-xs text-white">View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />

 
        {showModal && selectedBooking && (
          <Modal transparent={true} animationType="fade" visible={showModal} onRequestClose={closeModal}>
            <StatusBar backgroundColor='#00000080' barStyle='light-content' />
            <View className='flex-1 justify-center items-center bg-[#00000080]'>
              <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
                <Pressable onPress={closeModal} className='ml-auto'>
                  <Entypo name="cross" size={24} className='text-gray-500' />
                </Pressable>
                <ScrollView>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'center' }}>
                    <FontAwesome5 name="book" size={18} color="#f8f8f8" style={{ borderRadius: 60, padding: 7, backgroundColor: '#e11d48' }} />
                    <Text style={{ marginLeft: 10, fontSize: 22, fontWeight: '600', color: '#e11d48' }}>Booking Details</Text>
                  </View>

                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Name: {selectedBooking.listing.name}
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Property Type: {selectedBooking.listing.property_type}
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Check-In: <Text style={{ color: '#16a34a' }}>{new Date(selectedBooking.checkIn).toDateString()}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Check-Out: <Text style={{ color: '#dc2626' }}>{new Date(selectedBooking.checkOut).toDateString()}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Total Amount: <Text style={{ fontWeight: 'bold', color: '#10b981' }}>${selectedBooking.totalAmount}</Text>
                  </Text>
                  {selectedBooking.specialRequests && (
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 10 }}>
                      Special Requests: {selectedBooking.specialRequests}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={finalizeBooking}
                    style={{ marginTop: 20, backgroundColor: '#dc2626', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Finalize Booking</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Bookings;
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { View, Text, Image, TouchableOpacity, FlatList, Alert, Modal, ScrollView, Pressable } from 'react-native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/Config/Config";
import { Link } from 'expo-router';
import { Header } from '@/components/Header';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BookingSkeleton from '@/components/Loaders/BookingSkeleton';
import ListingSkeleton from '@/components/Loaders/ListingSkeleton';

const getStatusStyle = (status) => {
  switch (status) {
    case 'paid':
      return '#047857';
    case 'pending':
      return '#F59E0B';
    case 'confirmed':
      return '#1E40AF';
    case 'canceled':
      return '#B91C1C';
    default:
      return '#9CA3AF';
  }
};

const Bookings = () => {
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${config.BACKEND_URL}/air-bnb/reservation/made-reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data.bookings);
      }
      catch (err) {
        setError('Failed to fetch bookings. Please try again.' + err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const finalizeBooking = async () => {
    if (!selectedBooking || !selectedBooking._id) {
      Alert.alert("No booking selected to finalize.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${config.BACKEND_URL}/air-bnb/reservation/finalize-booking`,
        { bookingId: selectedBooking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Booking finalized successfully.");
      setSelectedBooking(null);
      setShowModal(false);
    } catch (err) {
      Alert.alert('Failed to finalize booking. Please try again.');
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  if (!loading) {
    return (
      <SafeAreaView className={`flex-1 pt-${insets.top} bg-white h-screen`}>
        <Header heading={"My Bookings"} />
        <View className="border-t-[2px] border-gray-100">
        <Text className='text-[11px] mx-[15px] underline underline-offset-4 mt-[10px] font-[700] text-rose-600'>
          Your reserved bookings will appear here.
        </Text> 
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="px-[15px]">
          {Array.from({ length: 10 }).map((_, index) => (<BookingSkeleton key={index} />))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 pt-${insets.top} bg-white h-screen `}>
        <Header heading={"Booking"} />
        <View className="w-full h-screen" >
          <View className="min-h-screen w-full flex flex-col justify-center items-center mix-blend-multiply mt-[-120px]">
            <Image source={require('@/assets/Assets/noReservations.png')} alt="No Reservations" className="scale-[0.5] mb-[-90px]" />
            <Text className='text-[13px] text-red-900  font-[600]'>You haven't visited any place yet ...</Text>
            <Link href={'/'}>
              <Text className='text-[13px] mt-[2px] font-[800] underline text-red-600'>Start Exploring Today !!</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 pt-${insets.top} bg-gray-50 pb-[100px]`}>
      <StatusBar backgroundColor='#f9fafb' barStyle='light-content' />
      <Header heading={"My Bookings"} />
      <View style={{ width: '100%', paddingHorizontal: 16 }}> 
        <Text className='text-[11px] underline underline-offset-4 my-[10px] font-[700] text-rose-600'>
          Your reserved bookings will appear here.
        </Text> 

        <FlatList
          data={bookings}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id || String(item)}
          contentContainerStyle={{ gap: 15 }}
          renderItem={({ item }) => {
            if (!item || !item.listing) {
              return null;
            }
            return (
              <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', padding: 16, marginBottom: 2 }}>
                {/* Booking Name */}
                <View className="flex-row items-center mb-3">
                  <View className="w-6 h-6 rounded-full bg-rose-600 justify-center items-center">
                    <FontAwesome5 name="book" size={11} color="#f8f8f8" />
                  </View>
                  <Text className="ml-2 text-sm font-semibold text-rose-700">
                    {item.listing.name.length > 35
                      ? `${item.listing.name.slice(0, 35)}...`
                      : item.listing.name}
                  </Text>
                </View>

                {/* Booking Dates */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View >
                    <Text style={{ fontSize: 10, fontWeight: '600', color: '#6b7280' }}>Check-In</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#1f2937' }}>
                      {new Date(item.checkIn).toDateString()}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: '#6b7280' }}>Check-Out</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#1f2937' }}>
                      {new Date(item.checkOut).toDateString()}
                    </Text>
                  </View>
                </View>

                {/* Status and Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: '600',
                      color: '#fff',
                      paddingVertical: 2,
                      paddingHorizontal: 12,
                      borderRadius: 15,
                      backgroundColor: getStatusStyle(item.status),
                    }}
                  >
                    {item.status}
                  </Text>
                  <TouchableOpacity
                    onPress={() => openModal(item)}
                    style={{ backgroundColor: '#e11d48', paddingVertical: 2, paddingHorizontal: 12, borderRadius: 25 }}
                  >
                    <Text style={{ fontSize: 10, color: '#fff' }}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />


        {/* Modal for Booking Details */}
        {showModal && selectedBooking && (
          <Modal transparent={true} animationType="fade" visible={showModal} onRequestClose={closeModal}>
            <StatusBar backgroundColor='#00000080' barStyle='light-content' />
            <View className='flex-1 justify-center items-center bg-[#00000080]'>
              <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
                <Pressable onPress={closeModal} className='ml-auto'>
                  <Entypo name="cross" size={24} className='text-gray-500' />
                </Pressable>
                <ScrollView>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'center' }}>
                    <FontAwesome5 name="book" size={18} color="#f8f8f8" style={{ borderRadius: 60, padding: 7, backgroundColor: '#e11d48' }} />
                    <Text style={{ marginLeft: 10, fontSize: 22, fontWeight: '600', color: '#e11d48' }}>Booking Details</Text>
                  </View>

                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Name: {selectedBooking.listing.name}
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Property Type: {selectedBooking.listing.property_type}
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Check-In: <Text style={{ color: '#16a34a' }}>{new Date(selectedBooking.checkIn).toDateString()}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Check-Out: <Text style={{ color: '#dc2626' }}>{new Date(selectedBooking.checkOut).toDateString()}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
                    Total Amount: <Text style={{ fontWeight: 'bold', color: '#10b981' }}>${selectedBooking.totalAmount}</Text>
                  </Text>
                  {selectedBooking.specialRequests && (
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 10 }}>
                      Special Requests: {selectedBooking.specialRequests}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={finalizeBooking}
                    style={{ marginTop: 20, backgroundColor: '#dc2626', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Finalize Booking</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Bookings;
