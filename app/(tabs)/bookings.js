import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { View, Text, Image, TouchableOpacity, FlatList, Alert, Modal, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import noReservations from "@/assets/Assets/noReservations.webp";

import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/Config/Config";
import { Link } from 'expo-router';

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
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `${config.BACKEND_URL}/air-bnb/reservation/made-reservations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.bookings)
        setBookings(response.data.bookings);
      }
      catch (err) {
        setError('Failed to fetch bookings. Please try again.');
        console.error('Error fetching bookings:', err.response?.data || err.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const finalizeBooking = async () => {
    if (!selectedBooking || !selectedBooking._id) {
      alert("No booking selected to finalize.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${config.BACKEND_URL}/air-bnb/reservation/finalize-booking`,
        { bookingId: selectedBooking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh bookings or show a success message
      Alert.alert("Booking finalized successfully.");
      setSelectedBooking(null);
      setShowModal(false);
    } catch (err) {
      console.error('Error finalizing booking:', err.response?.data || err.message);
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

  if (loading) {
    return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>Loading...</Text>
    </View>;
  }

  if (error || bookings.length === 0) {
    return <>
      <View className='bg-gray-50 pt-[55px] p-6 min-h-screen justify-center items-center '>
        <View className="w-full" >
          <Text className='text-[24px] mb-[15px] text-rose-600 font-[700]'>Visited Places</Text>
          <View className='h-[2.5px] bg-rose-600 mb-[35px] lg:mb-[55px]'></View>
          <View className="min-h-screen w-full flex flex-col justify-center items-center mix-blend-multiply mt-[-150px]">
            <Image source={require('@/assets/Assets/noReservations.webp')} alt="No Reservations" className="scale-[0.4]" />
            <Text className="text-rose-800 font-[400] text-[15px] text-center mt-[-45px] md:mt-[-100px]">
              You haven't visited any place, make a Booking
              <Link href="/" replace={true} className="text-rose-600 underline font-[600]">Start Exploring</Link>
            </Text>
          </View>
        </View>
      </View>
    </>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingTop: 120, paddingBottom: 65, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ maxWidth: 950, width: '100%', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#e11d48' }}>
          My Reserved Bookings
        </Text>
        <View style={{ height: 2, backgroundColor: '#fda4af', marginVertical: 15, borderRadius: 2 }} />

        <FlatList
          data={bookings}
          keyExtractor={(item) => item?._id || String(item)} // handle cases where _id might be missing
          contentContainerStyle={{ gap: 15 }}
          renderItem={({ item }) => {
            // Ensure item is not null or undefined
            if (!item || !item.listing) {
              return null;  // Return nothing if item or item.listing is invalid
            }

            return (
              <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', padding: 16, marginBottom: 15 }}>
                {/* Booking Name */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#e11d48', justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome5 name="book" size={28} color="#f8f8f8" />
                  </View>
                  <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: '600', color: '#b91c1c' }}>
                    {item.listing.name.length > 25
                      ? `${item.listing.name.slice(0, 25)}...`
                      : item.listing.name}
                  </Text>
                </View>

                {/* Booking Dates */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6b7280' }}>Check-In</Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
                      {new Date(item.checkIn).toDateString()}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6b7280' }}>Check-Out</Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
                      {new Date(item.checkOut).toDateString()}
                    </Text>
                  </View>
                </View>

                {/* Status and Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6b7280' }}>Status</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#fff',
                        paddingVertical: 3,
                        paddingHorizontal: 12,
                        borderRadius: 15,
                        marginTop: 5,
                        backgroundColor: getStatusStyle(item.status),
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openModal(item)}
                    style={{ backgroundColor: '#e11d48', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 25 }}
                  >
                    <Text style={{ fontSize: 13, color: '#fff' }}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />


        {/* Modal for Booking Details */}
        {showModal && selectedBooking && (
          <Modal transparent={true} animationType="slide" visible={showModal} onRequestClose={closeModal}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '90%', maxWidth: 600, backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
                <TouchableOpacity onPress={closeModal} style={{ position: 'absolute', top: 16, right: 16 }}>
                  <FontAwesome5 name="times" size={24} color="#555" />
                </TouchableOpacity>
                <ScrollView>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'center' }}>
                    <FontAwesome5 name="book" size={28} color="#f8f8f8" style={{ borderRadius: 50, padding: 10, backgroundColor: '#e11d48' }} />
                    <Text style={{ marginLeft: 10, fontSize: 25, fontWeight: '600', color: '#e11d48' }}>Booking Details</Text>
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
    </View>
  );
};

export default Bookings;
