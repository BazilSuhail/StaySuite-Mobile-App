
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollView, View, Text, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
//import { AddRating, FavoriteButton, Reviews } from './ListingRating';
import { useAuthContext } from '@/hooks/AuthProvider';
import { usePathname, useRouter } from 'expo-router';
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
                console.log(response.data.listing)

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
        //console.log(listing)
        router.push({
            pathname: `/${listing.hostID}/${id}`,
            query: { listing: JSON.stringify(listing), ratingReviews: JSON.stringify(ratingReviews) }
        });
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} className='bg-gray-50'>

            {showModal && <Reviews listingId={id} ratingReviews={ratingReviews} onClose={() => setShowModal(false)} />}

            <Carousel images={listing.images.additionalPictures.slice(0, 5)} />

            {/*<View className='w-full h-[300px]'>
                    <Image source={{ uri: listing.images.coverPicture }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                </View>}*/}

            {/*<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {listing.images.additionalPictures.slice(0, 4).map((url, index) => (
                        <View key={index} style={{ width: '48%', marginBottom: 10 }}>
                            <Image source={{ uri: url }} style={{ width: '100%', height: 100, borderRadius: 10 }} />
                        </View>
                    ))}
                </View>

                <Text style={{ fontSize: 22, color: '#b91c1c', fontWeight: 'bold', marginTop: 85, marginBottom: 20 }}>
                    {listing.name}
                </Text>*/}


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
                                    <Image
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

            {userLoginStatus && <AddRating listingId={id} />}

            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    {/*<FontAwesome5 name="angel" size={30} style={{ marginRight: 10, color: '#b91c1c' }} />*/}
                    <FontAwesome name="star" size={24} color="black" />
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Guest Favourite</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#555' }}>
                    One of the most loved homes on Airbnb, according to guests
                </Text>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{ratingReviews.averageRating}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {[...Array(Math.floor(ratingReviews.averageRating))].map((_, index) => (
                            <FontAwesome5 key={`full-${index}`} name="star" size={15} style={{ color: '#ffcc00' }} />
                        ))}
                        {ratingReviews.averageRating % 1 >= 0.5 && (
                            <FontAwesome5 key="half" name="star-half-alt" size={15} style={{ color: '#ffcc00' }} />
                        )}
                        {[...Array(5 - Math.floor(ratingReviews.averageRating) - (ratingReviews.averageRating % 1 >= 0.5 ? 1 : 0))].map(
                            (_, index) => (
                                <FontAwesome5 key={`empty-${index}`} name="star" size={15} style={{ color: '#e1e1e1' }} />
                            )
                        )}
                    </View>
                </View>

                <TouchableOpacity onPress={() => setShowModal(true)} style={{ marginTop: 10 }}>
                    <Text style={{ color: '#b91c1c', fontWeight: 'bold' }}>{ratingReviews.arraySize} Reviews</Text>
                </TouchableOpacity>
            </View>


            <View style={{ padding: 20, backgroundColor: '#f3f4f6', borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>${listing.price}</Text>
                    <Text style={{ fontSize: 12, color: '#555' }}>per night</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Dates</Text>
                        <Text style={{ color: '#555' }}>Select dates</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Guests</Text>
                        <Text style={{ color: '#555' }}>Add guests</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Total</Text>
                        <Text style={{ color: '#555' }}>${listing.price}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => handleBooking(id)} style={{ backgroundColor: '#b91c1c', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>BOOK NOW</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ListingDetails;
