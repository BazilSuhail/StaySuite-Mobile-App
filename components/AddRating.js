import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

export const AddRating = ({ listingId }) => {
    const [rating, setRating] = useState(2);
    const [review, setReview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, setSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!rating || rating < 1 || rating > 5) {
            setError('Rating must be between 1 and 5.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                `${config.BACKEND_URL}/air-bnb/listing-rating/add-review`,
                { listingId, rating, review },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Review submitted successfully!');
            setRating(2);
            setReview('');
        } catch (err) {
            console.error('Error submitting review:', err.response?.data || err.message);
            setError('Failed to submit review. Please try again.');
        }
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    return (
        <View className='mx-[10px] mt-[15px] p-[15px] bg-white border border-gray-200 shadow-md rounded-[15px]'>
            <Text className='text-[15px] font-[600]'>Add a Review</Text>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {success && (
                <View className="absolute top-1 right-1 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md" >
                    <Text>{success}</Text>
                </View>
            )}
            <View>
                <View className='flex-row items-center mt-[5px]'>
                    {[...Array(5)].map((_, index) => (
                        <Pressable key={index} onPress={() => handleStarClick(index)}>
                            <AntDesign
                                name="star" size={20}
                                style={{
                                    marginRight: 2,
                                    color: index < rating ? '#ffcc00' : '#D1D5DB',
                                }}
                            />
                        </Pressable>
                    ))}
                </View>
                <View className='mt-[8px]'>
                    <TextInput className='px-[8px] pt-[5px] pb-[95px] bg-gray-50 border border-gray-200 mt-[5px] rounded-[8px]'
                        multiline
                        placeholder='Write your review here ...'
                        numberOfLines={4}
                        value={review}
                        onChangeText={setReview}
                    />
                </View>
                <View className="flex-row items-center mt-[8px] justify-end">
                    <TouchableOpacity
                        onPress={() => Alert.alert('Cancel', 'Review was not submitted.')}
                        className="px-4 py-[4px] bg-gray-100 rounded-md mr-2"
                    >
                        <Text className="text-[12px] font-[600] text-rose-600">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="px-4 py-[4px] bg-rose-500 rounded-md"
                    >
                        <Text className="text-[12px] font-[600] text-white">Submit</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};
