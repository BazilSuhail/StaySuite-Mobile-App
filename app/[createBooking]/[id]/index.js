import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuthContext } from '@/hooks/AuthProvider';
import { usePathname, useRouter } from 'expo-router';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { ScrollView, View, Text, TextInput, Button } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // For FontAwesome icons
import { Calendar } from 'react-native-calendars'; // Use this package for the calendar component


const CreateBooking = () => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const [hostId, listingId] = segments;

  console.log("Host ID:", hostId);
  console.log("Listing ID:", listingId);

  const { showToast } = useAuthContext();
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [specialRequests, setSpecialRequests] = useState('');
  const [reftechBooking, setReftechBooking] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(null);
  const totalAmount = 1500;

  //const totalAmount = listing.price;

  useEffect(() => {

    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/air-bnb/reservation/get-reserved-bookings/${listingId}`);
        const dates = response.data.blockedDates.map((date) => new Date(date).toISOString().split('T')[0]);
        setBlockedDates(dates);
        console.log("-------------------")
        console.log(blockedDates)
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
      alert('Selected date cannot be before the current date.');
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
        alert('Check-Out date must be after Check-In date.');
      }
    }
  };

  const getMarkedDates = () => {
    const markedDates = {};

    // Mark blocked dates (disabled with gray background)
    blockedDates.forEach((date) => {
      markedDates[date] = {
        disabled: true,
        disableTouchEvent: true,
        color: 'lightgray',
      };
    });

    // Mark selected check-in and check-out dates
    if (selectedDates.checkIn) {
      markedDates[selectedDates.checkIn] = {
        ...markedDates[selectedDates.checkIn], // Preserve existing blocked styling, if any
        selected: true,
        startingDay: true,
        color: 'blue',
        textColor: 'white',
      };
    }

    if (selectedDates.checkOut) {
      markedDates[selectedDates.checkOut] = {
        ...markedDates[selectedDates.checkOut], // Preserve existing blocked styling, if any
        selected: true,
        endingDay: true,
        color: 'blue',
        textColor: 'white',
      };
    }

    // Mark dates in between check-in and check-out as part of the period
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
            color: 'blue',
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
      alert('Please select both Check-In and Check-Out dates.');
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
      //toast
      showToast("Reservation applied Successfully");
      //navigate(-1);
    }
    catch (err) {
      console.error('Error creating booking:', err.response?.data || err.message);
      showToast("Failed to create booking. Try Later !!");
      //setMessage('Failed to create booking. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 120, marginTop: 90 }}>

        {/* Left Column */}
        <View style={{ flex: 1, marginBottom: 24 }}>
          <View style={{ padding: 16, backgroundColor: '#F9F9F9', borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Request to book</Text>
            <Text style={{ color: '#D60075', flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="shield-alt" size={16} />
              <Text style={{ marginLeft: 8 }}>This is a rare find. Bo's place is usually booked.</Text>
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            {/*<Calendar
              onDayPress={(day) => handleDateChange(day.dateString)}
              markedDates={{
                [selectedDates.checkIn]: { selected: true, startingDay: true, color: 'blue' },
                [selectedDates.checkOut]: { selected: true, endingDay: true, color: 'blue' },
              }}
              markedDates={getMarkedDates()}
              markingType="period"
            />*/}
            <Calendar
              onDayPress={(day) => handleDateChange(day.dateString)} // Handle date selection
              markedDates={getMarkedDates()} // Consolidate all markings
              markingType="period" // Show periods between selected dates
            />

          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ padding: 16, backgroundColor: '#F9F9F9', borderRadius: 8, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 8 }}>
                <Text style={{ color: '#8A8A8A' }}>Date</Text>
                <FontAwesome5 name="edit" size={18} color="#8A8A8A" />
              </View>

              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                  <Text style={{ fontWeight: '600', color: '#D60075' }}>Check-In</Text>
                  <Text style={{ fontWeight: '600', color: '#D60075' }}>Check-Out</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                  {selectedDates.checkIn && <Text>{selectedDates.checkIn}</Text>}
                  {selectedDates.checkOut && <Text>{selectedDates.checkOut}</Text>}
                </View>
              </View>
            </View>

            {/* Guests */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <Text style={{ color: '#8A8A8A' }}>Guests</Text>
                <Text style={{ fontWeight: '600', color: '#D60075' }}>
                  {(guests.adults + guests.children + guests.infants) || '0'} guests
                </Text>
              </View>
              <FontAwesome5 name="edit" size={18} color="#8A8A8A" />
            </View>

            {/* Guest Inputs */}
            <View style={{ padding: 16, backgroundColor: '#F9F9F9', borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ color: '#8A8A8A' }}>Enter Number of Adults:</Text>
              <TextInput
                keyboardType="numeric"
                value={String(guests.adults || 0)}
                onChangeText={(text) => setGuests({ ...guests, adults: parseInt(text, 10) })}
                style={{ borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 4 }}
              />
              <Text style={{ color: '#8A8A8A' }}>Enter Number of Children:</Text>
              <TextInput
                keyboardType="numeric"
                value={String(guests.children || 0)}
                onChangeText={(text) => setGuests({ ...guests, children: parseInt(text, 10) })}
                style={{ borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 4 }}
              />
              <Text style={{ color: '#8A8A8A' }}>Enter Number of Infants:</Text>
              <TextInput
                keyboardType="numeric"
                value={String(guests.infants || 0)}
                onChangeText={(text) => setGuests({ ...guests, infants: parseInt(text, 10) })}
                style={{ borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 4 }}
              />
            </View>

            {/* Special Requests */}
            <View style={{ padding: 16, backgroundColor: '#F9F9F9', borderRadius: 8 }}>
              <Text style={{ color: '#8A8A8A' }}>Special Requests</Text>
              <TextInput
                multiline
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Enter Your Request ..."
                style={{ borderWidth: 1, padding: 10, minHeight: 100, borderRadius: 4 }}
              />
            </View>

            <Button
              title="Continue"
              onPress={handleBooking}
              disabled={numberOfDays === null}
              color={numberOfDays ? '#D60075' : '#C1C1C1'}
            />
          </View>
        </View>

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