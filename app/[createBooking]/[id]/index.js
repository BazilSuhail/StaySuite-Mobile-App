import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuthContext } from '@/hooks/AuthProvider';
import { Link, usePathname, useRouter } from 'expo-router';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { ScrollView, View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // For FontAwesome icons
import { Calendar } from 'react-native-calendars'; // Use this package for the calendar component
import { StatusBar } from 'expo-status-bar';


const CreateBooking = () => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [hostId, listingId] = segments;
  //console.log("Host ID:", hostId);
  //console.log("Listing ID:", listingId);
 
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [specialRequests, setSpecialRequests] = useState('');
  const [reftechBooking, setReftechBooking] = useState(false);
  const [error, setError] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(null);
  const totalAmount = 1500;

  //const totalAmount = listing.price;

  useEffect(() => {

    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/air-bnb/reservation/get-reserved-bookings/${listingId}`);
        const dates = response.data.blockedDates.map((date) => new Date(date).toISOString().split('T')[0]);
        setBlockedDates(dates); 
        //console.log(blockedDates)
      }
      catch (err) {
        console.error('Error fetching blocked dates:', err.response?.data || err.message);
      }
    };

    fetchBlockedDates();
  }, [listingId, reftechBooking]);

  useEffect(() => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const checkInDate = new Date(selectedDates.checkIn);
      const checkOutDate = new Date(selectedDates.checkOut);
      const timeDifference = checkOutDate - checkInDate;

      if (timeDifference >= 0) {
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        setNumberOfDays(daysDifference);
      }
      else {
        setNumberOfDays(0);
      }
    }
    else {
      setNumberOfDays(null);
    }
  }, [selectedDates]);

  const handleDateChange = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      Alert.alert('Selected date cannot be before the current date.');
      return;
    }

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: date, checkOut: null });
    }
    else {
      if (date > selectedDates.checkIn) {
        setSelectedDates({ ...selectedDates, checkOut: date });
      }
      else {
        Alert.alert('Check-Out date must be after Check-In date.');
      }
    }
  };

  const getMarkedDates = () => {
    const markedDates = {};
    blockedDates.forEach((date) => {
      markedDates[date] = {
        disabled: true,
        disableTouchEvent: true,
        color: '#E0E0E0',
        textColor: '#A0A0A0',
      };
    });

    if (selectedDates.checkIn) {
      markedDates[selectedDates.checkIn] = {
        ...markedDates[selectedDates.checkIn],
        selected: true,
        startingDay: true,
        color: 'red',
        textColor: 'white',
      };
    }

    if (selectedDates.checkOut) {
      markedDates[selectedDates.checkOut] = {
        ...markedDates[selectedDates.checkOut],
        selected: true,
        endingDay: true,
        color: 'red',
        textColor: 'white',
      };
    }

    if (selectedDates.checkIn && selectedDates.checkOut) {
      const checkIn = new Date(selectedDates.checkIn);
      const checkOut = new Date(selectedDates.checkOut);

      for (
        let d = new Date(checkIn);
        d <= checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        const dateString = d.toISOString().split('T')[0];
        if (!markedDates[dateString]) {
          markedDates[dateString] = {
            selected: true,
            color: 'red',
            textColor: 'white',
          };
        }
      }
    }

    return markedDates;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      Alert.alert('Please select both Check-In and Check-Out dates.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${config.BACKEND_URL}/air-bnb/reservation/create-booking`,
        {
          listingId,
          checkIn: selectedDates.checkIn,
          checkOut: selectedDates.checkOut,
          guests,
          totalAmount,
          hostId,
          specialRequests,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReftechBooking(true);
      console.log(response.data);

      setBlockedDates([]);
      setSelectedDates({ checkIn: null, checkOut: null });
      setGuests({ adults: 1, children: 0, infants: 0 });
      setSpecialRequests('');
      setNumberOfDays(null); 
    }
    catch (err) {
      //console.error('Error creating booking:', err.response?.data || err.message); 
      setError('Error creating booking:', err.response?.data || err.message);
    }
  };

  return (
    <ScrollView >

      <StatusBar backgroundColor='#f9fafb' barStyle='light-content' />
      {/* Left Column */}
      <View className='mt-[35px] mb-[25px]'>

        <View className='flex mt-[15px] bg-white rounded-[12px] mx-[15px] border border-gray-200 shadow-md py-[8px] px-[15px]'>
          <Text className='text-[14px] font-[600]'>Request to book</Text>
          <Text style={{ color: '#D60075', flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="shield-alt" size={16} />
            <Text style={{ marginLeft: 8 }}>{"  "}This is a rare find. This place is usually booked.</Text>
          </Text>
        </View>

        <View className='mx-[15px] rounded-lg mt-[15px] bg-white px-[4px] pt-[15px] overflow-hidden border-[1px] border-gray-200'>
          <View className='flex-row  w-full border-b-[1px] border-gray-300 pb-[12px] items-center pl-[8px]'>
            <Entypo name="calendar" size={22} color="#be123c" />
            <Text className='text-[14px] font-[700] text-gray-500 mb-[1px]'>{"  "}Select a Date:</Text>
          </View>
          <Calendar
            onDayPress={(day) => handleDateChange(day.dateString)}
            markedDates={getMarkedDates()}
            markingType="period"
          />

        </View>


        <View className='mx-[15px] rounded-[12px] mt-[15px] bg-white px-[12px] py-[15px] overflow-hidden border-[1px] border-gray-200'>
          <View className='pb-[8px] flex-row justify-between items-center border-b-[1px] border-gray-300'>
            <Text style={{ color: '#8A8A8A' }}>Date</Text>
            <FontAwesome5 name="edit" size={15} color="#8A8A8A" />
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
              <Text className='text-[12px] font-[600] text-[#D60075]'>Check-In</Text>
              <Text className='text-[12px] font-[600] text-[#D60075]'>Check-Out</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {selectedDates.checkIn && <Text className='text-[14px] font-[700] text-gray-700'>{selectedDates.checkIn}</Text>}
              {selectedDates.checkOut && <Text className='text-[14px] font-[700] text-gray-700'>{selectedDates.checkOut}</Text>}
            </View>
          </View>
        </View>

        {/* Guests */}
        <View className='mx-[15px] rounded-[12px] mt-[15px] bg-white px-[12px] py-[15px] overflow-hidden border-[1px] border-gray-200'>
          <View>
            <Text className='text-[#a6a5a5] text-[12px] font-[600]'>Totoal Guests</Text>
            <Text style={{ fontWeight: '600', color: '#D60075' }}>
              {(guests.adults + guests.children + guests.infants) || '0'} guests
            </Text>
          </View>
        </View>

        {/* Guest Inputs */}
        <View className='mx-[15px] rounded-[12px] mt-[15px] bg-white px-[12px] py-[15px] overflow-hidden border-[1px] border-gray-200'>
          <Text className='text-[#a6a5a5] text-[12px] font-[600]'>Enter Number of Adults:</Text>
          <TextInput
            keyboardType="numeric"
            value={String(guests.adults || 0)}
            onChangeText={(text) => setGuests({ ...guests, adults: parseInt(text, 10) })}
            className='bg-gray-50 py-[6px] border border-gray-200 mt-[5px] mb-[12px] pl-[8px] rounded-[4px]'
          />
          <Text className='text-[#a6a5a5] text-[12px] font-[600]'>Enter Number of Children:</Text>
          <TextInput
            keyboardType="numeric"
            value={String(guests.children || 0)}
            onChangeText={(text) => setGuests({ ...guests, children: parseInt(text, 10) })}
            className='bg-gray-50 py-[6px] border border-gray-200 mt-[5px] mb-[12px] pl-[8px] rounded-[4px]'
          />
          <Text className='text-[#a6a5a5] text-[12px] font-[600]'>Enter Number of Infants:</Text>
          <TextInput
            keyboardType="numeric"
            value={String(guests.infants || 0)}
            onChangeText={(text) => setGuests({ ...guests, infants: parseInt(text, 10) })}
            className='bg-gray-50 py-[6px] border border-gray-200 mt-[5px] mb-[12px] pl-[8px] rounded-[4px]'
          />
        </View>

        {/* Special Requests */}
        <View className='mx-[15px] rounded-[12px] mt-[15px] bg-white px-[12px] py-[15px] overflow-hidden border-[1px] border-gray-200'>
          <View className='flex-row items-center mb-[15px]'>
            <FontAwesome name="user-plus" size={18} color="#9ca3af" />
            <Text className='text-[#a6a5a5] text-[13px] font-[600]'>{"  "}Special Requests</Text>
          </View>
          <TextInput
            multiline
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholder="Enter Your Request ..."
            className='bg-gray-50 px-[8px] pt-[10px] pb-[55px] rounded-[8px] border-[1px] border-gray-200'
          />
        </View>

        {numberOfDays === null ?
          <View className="w-full py-2 bg-rose-300 mx-[10px] mt-[15px] text-rose-100 cursor-pointer font-semibold rounded-[8px]">
            <Text className='text-center text-white'>Reserve</Text>
          </View>

          :
          <TouchableOpacity onPress={handleBooking} className="mx-[15px] mt-[15px] py-2 bg-[#D60075] rounded-lg">
            <Text className='font-[700] text-[15px] text-white text-center'>Reserve</Text>
          </TouchableOpacity>
        }

        {/*<Button
          title="Continue"
          onPress={handleBooking}
          disabled={numberOfDays === null}
          color={numberOfDays ? '#D60075' : '#C1C1C1'}
        />*/}


        {/* Right Column 
        <View style={{ flex: 1, maxWidth: 360 }}>
          {listing && (
            <View style={{ flexDirection: 'row', padding: 16, backgroundColor: '#F9F9F9', borderRadius: 8, marginBottom: 16 }}>
              <img
                src={listing.images.coverPicture}
                alt={listing.name}
                style={{ width: 75, height: 75, borderRadius: 8, marginRight: 15 }}
              />
              <View style={{ justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{listing.name}</Text>
                <Text style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome5 name="star" size={14} color="gold" />
                  <Text style={{ marginLeft: 8 }}>{ratingReviews.averageRating || ''}</Text>
                </Text>
                <Text style={{ color: '#8A8A8A' }}>
                  {listing.address.suburb}, {listing.address.country}
                </Text>
              </View>
            </View>
          )}
        </View>*/}
      </View>
    </ScrollView>
  );
};

export default CreateBooking; 