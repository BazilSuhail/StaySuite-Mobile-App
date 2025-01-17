
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollView, View, Text, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
//import { AddRating, FavoriteButton, Reviews } from './ListingRating';
import { useAuthContext } from '@/hooks/AuthProvider';
import { Link, usePathname, useRouter } from 'expo-router';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteButton } from '@/components/FavouriteButton';
import { Reviews } from '@/components/Reviews';
import { AddRating } from '@/components/AddRating';
import { StatusBar } from 'expo-status-bar';
import Carousel from '@/components/CustomCarousel';

const LisitngDetailsLoader = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>sdf...</Text>
        </View>
    );
};

const isLoggedIn = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isTokenExpired = payload.exp * 1000 < Date.now();
        return isTokenExpired;
    }
    catch (err) {
        //console.warn('Invalid token structure');
        return false;
    }
};

const ListingDetails = () => {
    const router = useRouter();

    const { userRole } = useAuthContext();
    //const { id } = useParams();

    const pathname = usePathname();
    const id = pathname.split("/").pop();

    const [listing, setListing] = useState(null);
    const [userLoginStatus, setUserLoginStatus] = useState(null);
    const [hostdetails, setHostdetails] = useState(null);
    const [isInitiallyFavorited, setIsInitiallyFavorited] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingerror, setRatingerror] = useState(null);
    const [showModal, setShowModal] = useState(false);


    const [isListingPicturesModalOpen, setIsListingPicturesModalOpen] = useState(false);
    const [ratingReviews, setRatingReviews] = useState([]);


    const fetch_Review_count_and_rating = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.BACKEND_URL}/air-bnb/listing-rating/rating-review-count/${id}`);
            setRatingReviews(response.data);
        }
        catch (err) {
            setRatingerror('Failed to fetch reviews. Please try again.');
            //console.error('Error fetching reviews:', err.response?.data || err.message);
        }
    };

    useEffect(() => {
        const status = isLoggedIn();
        setUserLoginStatus(status);
        //console.log(status)
        fetch_Review_count_and_rating();
    }, []);

    useEffect(() => {
        if (userLoginStatus === null) return;

        const fetchListingDetails = async () => {
            try {
                const token = userLoginStatus ? await AsyncStorage.getItem('token') : null;
                const response = await axios.get(`${config.BACKEND_URL}/air-bnb/home/${userLoginStatus ? 'listings' : 'listing-details'}/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setListing(response.data.listing);
                setIsInitiallyFavorited(response.data.isLiked);
                setHostdetails(response.data.hostDetails);
                setLoading(false);
            }
            catch (err) {
                //console.error(err);
                setError('Failed to fetch listing details');
                setLoading(false);
            }
        };

        fetchListingDetails();
    }, [userLoginStatus]);

    if (loading) {
        return <LisitngDetailsLoader />;
    }

    /*if (error) {
        return <div className="text-center min-h-screen mt-[250px] text-red-500">{error}</div>;
    }*/

    const handleBooking = (id) => {
        router.push({
            pathname: `/${listing.hostID}/${id}`,
            query: { listing: JSON.stringify(listing), ratingReviews: JSON.stringify(ratingReviews) }
        });
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} className='bg-gray-50'>


            <Carousel images={listing.images.additionalPictures.slice(0, 5)} />
            {isListingPicturesModalOpen && (
                <Modal transparent={true} animationType="fade" visible={isListingPicturesModalOpen} onRequestClose={() => setIsListingPicturesModalOpen(false)}>
                    <View className="bg-black/60 w-screen h-screen fixed inset-0 flex items-center justify-center">
                        <View className="bg-white rounded-lg pt-[55px] h-[88vh] px-[8px] w-[95%]">

                            <Pressable onPress={() => setIsListingPicturesModalOpen(false)} className="absolute top-3 right-3" >
                                <Entypo name="cross" size={24} color="#374151" />
                            </Pressable>

                            <ScrollView showsHorizontalScrollIndicator={false} className="flex-col h-[55vh]">
                                <Image source={{ uri: listing.images.coverPicture }} className="w-full h-52 mb-3 rounded-md" />

                                {listing.images.additionalPictures.map((url, index) => (
                                    <Image key={index}
                                        source={{ uri: url }}
                                        className="w-full mb-3 h-56 rounded-md"
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}

            <View className='w-full flex-row items-center mt-[12px] justify-between px-[15px]'>
                <Text className='text-[20px] w-[75%] text-red-900 font-[600]'>
                    {listing.name}
                </Text>
                <Pressable onPress={() => setIsListingPicturesModalOpen(true)} className='w-[85px] py-[3px] rounded-[15px] bg-gray-400'>
                    <Text className='text-white text-center text-[11px] font-[600]'>See Photos</Text>
                </Pressable>
            </View>


            <View className='flex-row justify-between items-center mt-[10px] bg-white rounded-[16px] mx-[10px] border border-gray-200 shadow-md py-[8px] px-[15px]'>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {listing.property_type} In {listing.address.suburb}, {listing.address.country}
                    </Text>
                    <Text className='text-[12px] text-gray-600 mt-[3px]'>
                        {listing.bedrooms} beds · {listing.bathrooms} Shared bathroom
                    </Text>
                </View>

                {userRole === 'Guest' && (
                    <FavoriteButton listingId={id} isInitiallyFavorited={listing.isInitiallyFavorited} />
                )}
            </View>

            <View className='flex mt-[10px] bg-white rounded-[16px] mx-[10px] border border-gray-200 overflow-hidden shadow-md py-[12px] px-[15px]'>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <View style={{ width: 34, height: 34, backgroundColor: '#e1e1e1', borderRadius: 25, marginRight: 10 }} />
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>{hostdetails.name}</Text>
                        <Text style={{ fontSize: 12, color: '#555' }}>
                            {ratingReviews.averageRating > 4 ? 'Super Host' : 'Host'} ·{' '}
                            {(() => {
                                const reviewDate = new Date(hostdetails.createdAt);
                                const now = new Date();
                                const timeDiff = now - reviewDate;
                                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                                const months = Math.floor(days / 30);
                                const years = Math.floor(days / 365);

                                if (years >= 1) {
                                    return `${years} year${years > 1 ? 's' : ''} ago`;
                                } else if (months >= 1) {
                                    return `${months} month${months > 1 ? 's' : ''} ago`;
                                } else {
                                    return `${days} day${days > 1 ? 's' : ''} ago`;
                                }
                            })()}
                        </Text>
                    </View>
                </View>

                <View className='flex-row items-center mt-[10px] mb-[15px]'>
                    <FontAwesome5 name="medal" size={28} style={{ color: '#b91c1c', marginRight: 10 }} />
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>Top 5% of homes</Text>
                        <Text style={{ fontSize: 12, color: '#555' }}>
                            This home is highly ranked based on ratings, reviews, and reliability.
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <FontAwesome5 name="home" size={28} style={{ color: '#b91c1c', marginRight: 10 }} />
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>{listing.bedrooms} Bedroom{listing.bedrooms > 1 ? 's' : ''}</Text>
                        <Text className='text-[#555] break-words text-[12px]'>
                            Your own {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} in the {listing.property_type}, plus access to individualized shared spaces.
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <FontAwesome5 name="toilet" size={28} style={{ color: '#b91c1c', marginRight: 14, marginLeft: 6 }} />
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>{listing.bathrooms} Shared Bathroom{listing.bathrooms > 1 ? 's' : ''}</Text>
                        <Text style={{ fontSize: 12, color: '#555' }}>Enjoy ease space with fellow travelers.</Text>
                    </View>
                </View>
            </View>

            <View className='flex-row justify-between items-center my-[10px] bg-white rounded-[16px] mx-[10px] border border-gray-200 shadow-md pt-[15px] pb-[22px] px-[15px]'>
                <View>
                    <View className='flex-row mb-[5px]  items-center'>
                        <FontAwesome name="info-circle" size={15} color="#be123c" />
                        <Text className='text-[12px] font-[700] text-gray-400 mb-[1px]'>{"  "}About this place:</Text>
                    </View>
                    <Text className='text-[12px] font-[500] text-gray-800'>{listing.summary}</Text>
                </View>
            </View>

            <View className='flex-row justify-between items-center mt-[10px] bg-white rounded-[16px] mx-[10px] border border-gray-200 shadow-md py-[8px] px-[15px]'>
                {ratingReviews.averageRating === 0 ? <View>
                    <Text className='text-red-800 font-[600] text-[12px]'>No Rating Given</Text>
                </View>
                    :
                    <View>
                        <View className=''>
                            <Text className='text-[12px] font-[700] text-gray-500'>Rating: <Text className='text-black text-[13px]'>{ratingReviews.averageRating}{" "}</Text></Text>
                        </View>
                        <View className='flex-row items-center mt-[2px]'>
                            {[...Array(Math.floor(ratingReviews.averageRating))].map((_, index) => (
                                <AntDesign key={`full-${index}`} name="star" size={15} style={{ color: '#ffcc00' }} />
                            ))}
                            {ratingReviews.averageRating % 1 >= 0.5 && (
                                <FontAwesome key="half" name="star-half-empty" size={15} style={{ color: '#ffcc00' }} />
                            )}
                            {[...Array(5 - Math.floor(ratingReviews.averageRating) - (ratingReviews.averageRating % 1 >= 0.5 ? 1 : 0))].map(
                                (_, index) => (
                                    <AntDesign key={`empty-${index}`} name="star" size={15} style={{ color: '#e1e1e1' }} />
                                )
                            )}
                        </View>
                    </View>
                }

                <TouchableOpacity onPress={() => setShowModal(true)} className='flex-row px-[8px] py-[3px] rounded-md bg-rose-700 items-center'>
                    <FontAwesome name="comments" size={18} color="white" />
                    <Text className='text-white text-[12px] font-[700]'>{"  "}{ratingReviews.arraySize} Reviews</Text>
                </TouchableOpacity>
            </View>

            {userLoginStatus && <AddRating listingId={id} />}


            <View className="border bg-white mx-[10px] shadow-lg rounded-[15px] mt-[10px] py-[30px] px-4 border-[#e7e7e7] space-y-[18px]">
                <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-semibold">${listing.price}</Text>
                    <Text className="text-sm text-gray-600 font-[600]">/ night</Text>
                </View>

                <View className="border border-[#818181] rounded-lg py-4 w-full">
                    <View className="flex-row items-center justify-between px-[15px] border-b border-[#818181] pb-[10px]">
                        <View className="space-y-[1px]">
                            <Text className="text-[9px] font-semibold text-gray-500">CHECK-IN</Text>
                            <Text className="text-sm font-medium text-gray-800">6/25/2025</Text>
                        </View>
                        <View className="space-y-[1px]">
                            <Text className="text-[9px] font-semibold text-gray-500">CHECKOUT</Text>
                            <Text className="text-sm font-medium text-gray-800">7/4/2025</Text>
                        </View>
                    </View>

                    <View className="px-4 pt-4">
                        <View className="space-y-1">
                            <Text className="text-[9px] font-semibold text-gray-500">Max Accomodation</Text>
                            <Text className="text-[14px] font-medium text-gray-800">{listing.maxGuests} {listing.maxGuests > 1 ? 'Guests' : 'Guest'}</Text>
                        </View>
                    </View>
                </View>

                {userRole === 'Guest' ?
                    <TouchableOpacity onPress={() => handleBooking(id)} className="w-full py-2 bg-rose-700 rounded-lg">
                        <Text className='font-[700] text-[15px] text-white text-center'>Reserve</Text>
                    </TouchableOpacity>
                    :
                    <View>
                        <View className="w-full py-2 bg-rose-300  text-rose-100 cursor-pointer font-semibold rounded-[8px]"><Text className='text-center text-white'>Reserve</Text></View>
                        <Link href={"/authentication/signIn"} className='text-rose-700 underline font-[500] text-[12px] text-center mt-[8px]'>Login as a Guest To Reserve a booking</Link>
                    </View>
                }

                <Text className="text-center text-gray-600 font-[500] underline text-[12px]">You won't be charged yet</Text>

                <View className="space-y-[2px] text-gray-600 font-[500] underline text-[15px]">
                    <View className="flex-row justify-between items-center">
                        <Text className='text-[13px] text-gray-500 font-[600]'>${listing.price} x 7 nights</Text>
                        <Text className='text-[15px] font-[700]'>${listing.price * 7}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className='text-[13px] text-gray-500 font-[600]'>Cleaning fee</Text>
                        <Text className='text-[15px] font-[700]'>$29</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className='text-[13px] text-gray-500 font-[600]'>Airbnb service fee</Text>
                        <Text className='text-[15px] font-[700]'>$89</Text>
                    </View>
                </View>
                <View className='mx-auto h-[1px] w-full bg-gray-500'></View>
                <View className="flex-row justify-between font-semibold">
                    <Text>Total before taxes</Text>
                    <Text>${(listing.price * 7) + 29 + 89}</Text>
                </View>
            </View>

            {showModal && <Reviews listingId={id} ratingReviews={ratingReviews} onClose={() => setShowModal(false)} />}

        </ScrollView>
    );
};

export default ListingDetails;
