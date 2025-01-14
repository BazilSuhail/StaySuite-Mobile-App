import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

export const AddRating = ({ listingId }) => {
    const [rating, setRating] = useState(3);
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
        <View style={{ width: '100%' }}>
            <View style={{ backgroundColor: 'white', borderTopWidth: 3, borderColor: '#d1d5db', marginTop: 25, paddingTop: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Add a Review</Text>
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                {success && (
                    <AnimatePresence>
                        <View
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                backgroundColor: 'green',
                                color: 'white',
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                            }}
                        >
                            {success}
                        </View>
                    </AnimatePresence>
                )}
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '600', marginRight: 10 }}>Rating:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {[...Array(5)].map((_, index) => (
                            <TouchableOpacity key={index} onPress={() => handleStarClick(index)}>
                                <AntDesign
                                    name="staro" size={24}
                                    style={{
                                        marginRight: 5,
                                        color: index < rating ? 'yellow' : 'gray',
                                    }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#4b5563' }}>Review:</Text>
                        <TextInput
                            style={{
                                borderColor: '#d1d5db',
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: 10,
                                width: '100%',
                                height: 100,
                            }}
                            multiline
                            numberOfLines={4}
                            value={review}
                            onChangeText={setReview}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => Alert.alert('Cancel', 'Review was not submitted.')}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                backgroundColor: '#f3f4f6',
                                borderRadius: 8,
                                marginRight: 8,
                            }}
                        >
                            <Text style={{ fontSize: 14, color: '#e11d48' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                backgroundColor: '#f43f5e',
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ fontSize: 14, color: 'white' }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
