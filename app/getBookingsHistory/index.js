import { useState, useEffect } from 'react'
import axios from 'axios'
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import config from "@/Config/Config"
import { Header } from 'react-native/Libraries/NewAppScreen'


const GetBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const response = await axios.get(
                    `${config.BACKEND_URL}/air-bnb/reservation/reservations-history`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setBookings(response.data.bookings || []);
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
                        <Image source={require('@/assets/Assets/noReservations.png')} alt="No Reservations" className="scale-[0.4]" />
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
        <View style={{ backgroundColor: '#f3f4f6', paddingTop: 115, padding: 16, minHeight: '100%', justifyContent: 'center', alignItems: 'center' }}>
           <Header heading={"Booking"} />
            <View style={{ maxWidth: 1150, width: '100%' }}>
                <Text style={{ fontSize: 24, marginBottom: 15, color: '#DC2626', fontWeight: '700' }}>
                    Visited Places
                </Text>
                <View style={{ height: 2.5, backgroundColor: '#DC2626', marginBottom: 35, marginTop: 10 }} />

                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ gap: 15 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => navigate(`/listing/${item.listingId}`)}
                            style={{
                                overflow: 'hidden',
                                width: '100%',
                                borderRadius: 12,
                                backgroundColor: '#fff',
                                marginHorizontal: 8,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                padding: 8,
                                cursor: 'pointer',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <Image
                                source={{ uri: item.listingImage || 'https://via.placeholder.com/300' }}
                                alt="Booking"
                                style={{ width: '95%', height: 220, margin: 8 }}
                            />
                            <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 10, color: '#9B1C1C' }}>
                                {item.listingSuburb.length > 8 ? `${item.listingSuburb.substring(0, 8)}...` : item.listingSuburb},
                                {item.listingCountry.length > 8 ? `${item.listingCountry.substring(0, 8)}...` : item.listingCountry}
                            </Text>

                            <View style={{ marginLeft: 50, marginTop: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <FontAwesome5 name="calendar-alt" size={18} color="#B91C1C" />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginLeft: 5 }}>Check-In</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#10B981', marginLeft: 5 }}>
                                        {new Date(item.checkIn).toDateString()}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <FontAwesome5 name="calendar-alt" size={18} color="#B91C1C" />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginLeft: 5 }}>Check-Out</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444', marginLeft: 5 }}>
                                        {new Date(item.checkOut).toDateString()}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <FontAwesome5 name="user" size={18} color="#B91C1C" />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginLeft: 5 }}>Guests:</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#B91C1C', marginLeft: 5 }}>
                                        {item.guests.adults + item.guests.children + item.guests.infants}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <FontAwesome5 name="user" size={18} color="#B91C1C" />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginLeft: 5 }}>Total Bill:</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#B91C1C', marginLeft: 5 }}>
                                        ${item.totalAmount || '100'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

export default GetBookingHistory;
