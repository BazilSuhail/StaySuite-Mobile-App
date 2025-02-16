import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const FavoriteButton = ({ listingId, isInitiallyFavorited }) => {
    const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
    const [error, setError] = useState('');
    console.log(isFavorited)

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
                <FontAwesome name="bookmark" size={32} color={isFavorited ? '#e6e200' : '#bfbfbf'} />
            </TouchableOpacity>
            {error && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};