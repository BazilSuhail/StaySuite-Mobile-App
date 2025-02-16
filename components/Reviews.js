
import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import config from '@/Config/Config'
import { AntDesign, Entypo } from '@expo/vector-icons'
import avatarImages from '@/constants/avatar'
import axios from 'axios'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export const Reviews = ({ listingId, ratingReviews, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const bottomSheetRef = useRef(null);

    const fetchReviews = async (page) => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.BACKEND_URL}/air-bnb/listing-rating/get-reviews/${listingId}`, { params: { page, limit: 5 } });

            if (page === 1) {
                setReviews(response.data.reviews);
            }
            else {
                setReviews((prevReviews) => [...prevReviews, ...response.data.reviews]);
            }

            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        }
        catch (err) {
            setError('Failed to fetch reviews. Please try again.');
            console.error('Error fetching reviews:', err.response?.data || err.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(1);
    }, [listingId]);

    const handleShowMore = () => {
        if (currentPage < totalPages) {
            fetchReviews(currentPage + 1);
        }
    };


    const handleCloseSheet = () => {
        bottomSheetRef.current?.close(); // Close the sheet
        onClose();
    };

    if (error) {
        return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>{error}...</Text>
        </View>;
    }


    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['30%', '40%', '80%']}
            onClose={handleCloseSheet}
            index={1}
        >
            <View className='flex-row border-b-[2px] border-gray-200 mb-[8px] justify-between items-center px-[10px]'>
                <View className=' flex-row   items-center'>
                    <Image source={avatarImages["left"]} className='w-[26px] h-[45px]' />
                    <Text className='text-[28px] mb-[5px] text-gray-700  font-[700]'>{" "}{ratingReviews.averageRating}</Text>
                    <Image source={avatarImages["right"]} className='w-[26px] h-[45px]' />
                </View>
                <TouchableOpacity onPress={onClose}>
                    <Entypo name="cross" size={24} className='text-gray-500' />
                </TouchableOpacity>
            </View>

            <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View>
                    <View className='flex-row items-center justify-between px-[17px] mb-[8px]'>
                        <Text className='text-[11px] py-[2px] px-[10px] rounded-lg bg-gray-400 text-white'>Guest favorite</Text>
                        <Text className='font-[600] text-[16px]'>{ratingReviews.arraySize} <Text className='text-gray-700 text-[14px]'>Reviews</Text></Text>
                    </View>
                    {!loading ? (
                        <>
                            {reviews.length === 0 ? (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <Image source={{ uri: 'noComments' }} style={{ width: 150, height: 150, marginBottom: 10 }} /> */}
                                    <Text style={{ color: '#9CA3AF', fontSize: 32, fontWeight: '600' }}>No Review Made Till Now</Text>
                                </View>
                            ) : (
                                reviews.slice(0, currentPage * 5).map((review, index) => (
                                    <View key={index} className='border-b-[1px] border-gray-200 mx-[18px] pb-[8px] mt-[15px] rounded-md'>
                                        <View className='flex-row justify-between items-start'>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                <Image source={avatarImages[review.user.profilePicture]} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E5E7EB' }} />
                                                <View>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{review.user?.username || 'Anonymous'}</Text>
                                                    <Text style={{ color: '#6B7280', fontSize: 12 }}>{review.user?.location.city || ''}, {review.user?.location.country || ''}</Text>
                                                </View>
                                            </View>

                                            <View>
                                                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                                    {(() => {
                                                        const reviewDate = new Date(review.date);
                                                        const now = new Date();
                                                        const timeDiff = now - reviewDate;

                                                        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                                                        const months = Math.floor(days / 30);
                                                        const years = Math.floor(days / 365);

                                                        if (years >= 1) {
                                                            return `${years} year${years > 1 ? 's' : ''} ago`;
                                                        }
                                                        else if (months >= 1) {
                                                            return `${months} month${months > 1 ? 's' : ''} ago`;
                                                        }
                                                        else {
                                                            return days === 0 ? "Today" : `${days} day${days > 1 ? 's' : ''} ago`;
                                                        }
                                                    })()}
                                                </Text>
                                                <View className='flex-row items-center mt-[2px]'>
                                                    {[...Array(Math.floor(review.rating))].map((_, index) => (
                                                        <AntDesign key={`full-${index}`} name="star" size={14} style={{ color: '#ffcc00' }} />
                                                    ))}
                                                    {review.rating % 1 >= 0.5 && (
                                                        <FontAwesome key="half" name="star-half-empty" size={14} style={{ color: '#ffcc00' }} />
                                                    )}
                                                    {[...Array(5 - Math.floor(review.rating) - (review.rating % 1 >= 0.5 ? 1 : 0))].map(
                                                        (_, index) => (
                                                            <AntDesign key={`empty-${index}`} name="star" size={14} style={{ color: '#e1e1e1' }} />
                                                        )
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                        <Text className='text-[13px] font-[500] text-[#4B5563] px-[6px] py-[3px] rounded-md mt-[10px]'>{review.review}</Text>
                                    </View>
                                ))
                            )}
                            {currentPage < totalPages && !loading && (
                                <View style={{ marginTop: 16 }}>
                                    <TouchableOpacity onPress={handleShowMore} style={{ paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#EF4444', borderRadius: 8 }}>
                                        <Text style={{ fontSize: 14, color: 'white' }}>Show More</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};


/*import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import config from '@/Config/Config';
import { AntDesign, Entypo } from '@expo/vector-icons';
import avatarImages from '@/constants/avatar';
import axios from 'axios';

export const Reviews = ({ listingId, ratingReviews, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = async (page) => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.BACKEND_URL}/air-bnb/listing-rating/get-reviews/${listingId}`, { params: { page, limit: 5 } });

            if (page === 1) {
                setReviews(response.data.reviews);
            }
            else {
                setReviews((prevReviews) => [...prevReviews, ...response.data.reviews]);
            }

            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        }
        catch (err) {
            setError('Failed to fetch reviews. Please try again.');
            console.error('Error fetching reviews:', err.response?.data || err.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(1);
    }, [listingId]);

    const handleShowMore = () => {
        if (currentPage < totalPages) {
            fetchReviews(currentPage + 1);
        }
    };

    if (error) {
        return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>{error}...</Text>
        </View>;
    }

    return (
        <View >
            <View className='bg-white h-[70vh] w-[95vw]'>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, padding: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Guest Reviews</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Entypo name="cross" size={24} className='text-gray-500' />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={{ flex: 2 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
                                <Image source={avatarImages["left"]} style={{ width: 75, height: 75 }} />
                                <Text style={{ fontSize: 65, fontWeight: '600', marginHorizontal: 12 }}>{ratingReviews.averageRating}</Text>
                                <Image source={avatarImages["left"]} style={{ width: 75, height: 75 }} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingHorizontal: 16, borderWidth: 1, borderColor: '#6B7280', borderRadius: 8 }}>
                                    
                                    <Text style={{ marginLeft: 8, fontSize: 15 }}>Guest favorite</Text>
                                </View>
                            </View>
                            <Text style={{ marginTop: 15, fontSize: 13, color: '#4B5563' }}>One of the most loved homes on Airbnb based on ratings, reviews, and reliability</Text>
                        </View>
                        <View style={{ flex: 3, marginTop: 15 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>{ratingReviews.arraySize} Reviews</Text>
                            <ScrollView style={{ maxHeight: 520, marginBottom: 75 }}>
                                {!loading ? (
                                    <>
                                        {reviews.length === 0 ? (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={{ uri: 'noComments' }} style={{ width: 150, height: 150, marginBottom: 10 }} />
                                                <Text style={{ color: '#9CA3AF', fontSize: 32, fontWeight: '600' }}>No Review Made Till Now</Text>
                                            </View>
                                        ) : (
                                            reviews.slice(0, currentPage * 5).map((review, index) => (
                                                <View key={index} style={{ marginBottom: 24, padding: 16, backgroundColor: 'white' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                        <Image source={{ uri: `/Avatars/${review.user.profilePicture}.jpg` }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16, borderWidth: 1, borderColor: '#E5E7EB' }} />
                                                        <View>
                                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>{review.user?.username || 'Anonymous'}</Text>
                                                            <Text style={{ color: '#6B7280', fontSize: 12 }}>{review.user?.location.city || ''}, {review.user?.location.country || ''}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            {[...Array(Math.floor(review.rating))].map((_, index) => (
                                                                <AntDesign name="staro" size={24} key={`full-${index}`} color="yellow" />
                                                            ))}
                                                            {review.rating % 1 >= 0.5 && <AntDesign name="staro" size={24} color="yellow" />}
                                                            {[...Array(5 - Math.floor(review.rating) - (review.rating % 1 >= 0.5 ? 1 : 0))].map((_, index) => (
                                                                <AntDesign name="staro" size={24} key={`empty-${index}`} color="gray" />
                                                            ))}
                                                        </View>
                                                        <Text style={{ marginLeft: 16, fontSize: 12, color: '#6B7280' }}>
                                                            {(() => {
                                                                const reviewDate = new Date(review.date);
                                                                const now = new Date();
                                                                const timeDiff = now - reviewDate;

                                                                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                                                                const months = Math.floor(days / 30);
                                                                const years = Math.floor(days / 365);

                                                                if (years >= 1) {
                                                                    return `${years} year${years > 1 ? 's' : ''} ago`;
                                                                }
                                                                else if (months >= 1) {
                                                                    return `${months} month${months > 1 ? 's' : ''} ago`;
                                                                }
                                                                else {
                                                                    return days === 0 ? "Today" : `${days} day${days > 1 ? 's' : ''} ago`;
                                                                }
                                                            })()}
                                                        </Text>
                                                    </View>
                                                    <Text style={{ marginTop: 8, fontSize: 14, color: '#4B5563' }}>{review.review}</Text>
                                                </View>
                                            ))
                                        )}
                                        {currentPage < totalPages && !loading && (
                                            <View style={{ marginTop: 16 }}>
                                                <TouchableOpacity onPress={handleShowMore} style={{ paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#EF4444', borderRadius: 8 }}>
                                                    <Text style={{ fontSize: 14, color: 'white' }}>Show More</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <Text>Loading...</Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};*/
