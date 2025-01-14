import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoriteButton = ({ listingId, isInitiallyFavorited }) => {
    const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
    const [error, setError] = useState('');

    const toggleFavorite = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${config.BACKEND_URL}/air-bnb/home/listings/${listingId}/toggle-favorite`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsFavorited(!isFavorited);
        }
        catch (err) {
            setError('Failed to toggle favorite. Please try again.');
            console.error('Error toggling favorite:', err.response?.data || err.message);
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleFavorite}>
                <FontAwesome6
                    icon="book-bookmark"
                    style={{
                        fontSize: 30,
                        color: isFavorited ? 'yellow' : 'gray',
                        opacity: 1,
                    }}
                />
            </TouchableOpacity>
            {error && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};