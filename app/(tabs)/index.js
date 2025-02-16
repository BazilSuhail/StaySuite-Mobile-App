import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import config from '@/Config/Config';
import HorizontalScrollList from '@/components/HorizontalScrollList';
import { useAuthContext } from '@/hooks/AuthProvider';
import { Header } from '@/components/Header';
import { Listing } from '@/components/Listing';

const Home = () => {
    const router = useRouter();
    const { user } = useAuthContext();
    const [listings, setListings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('All');
 
    const fetchListings = async (page, category) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.BACKEND_URL}/air-bnb/home/listings`, {
                params: { page, limit: 10, category },
            });

            const newListings = response.data.listings;

            if (page === 1) {
                // If it's the first page, replace the existing listings
                setListings(newListings);
            } else {
                // If it's a subsequent page, append the new listings
                setListings((prev) => [...prev, ...newListings]);
            }

            // Update hasMore based on the response
            setHasMore(page < response.data.totalPages);
        } catch (err) {
            setError('Failed to fetch listings. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset to page 1 and fetch listings when the category changes
        setCurrentPage(1);
        fetchListings(1, category);
    }, [category]);

    useEffect(() => {
        // Fetch listings when currentPage changes
        if (currentPage > 1) {
            fetchListings(currentPage, category);
        }
    }, [currentPage]);

    const loadMore = () => {
        if (hasMore && !loading) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <View className='flex-1 bg-gray-50'>
            <StatusBar backgroundColor='#ffffff' barStyle='light-content' />
            <Header heading={"home"} />

            <HorizontalScrollList setCategory={setCategory} />

            {error ? (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text>{error}</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={listings}
                        renderItem={(props) => Listing({ ...props, router })}
                        keyExtractor={(item) => item._id} // Ensure _id is unique
                        numColumns={1}
                        ListFooterComponent={
                            <>
                                {loading && (
                                    <View style={{ paddingVertical: 20 }}>
                                        <ActivityIndicator size="small" color="#E11D48" />
                                    </View>
                                )}
                                {hasMore && !loading && (
                                    <TouchableOpacity
                                        onPress={loadMore}
                                        style={{ paddingVertical: 10, alignItems: 'center' }}
                                    >
                                        <Text style={{ color: '#E11D48', fontWeight: '600' }}>Show More</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        }
                    />

                    {listings.length === 0 && !loading && (
                        <View style={{ marginTop: 150, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: 'gray', fontWeight: '600', fontSize: 15, marginTop: -70, paddingHorizontal: 55, backgroundColor: 'white', paddingTop: 18 }}>
                                No listings found
                            </Text>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

export default Home;