import { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import axios from 'axios'
import config from '@/Config/Config'
import HorizontalScrollList from '@/components/HorizontalScrollList'
import { Header } from '@/components/Header'
import { Listing } from '@/components/Listing'
import { useSafeAreaInsets,SafeAreaView } from 'react-native-safe-area-context'
import ListingSkeleton from '@/components/Loaders/ListingSkeleton'
import { ScrollView } from 'react-native-gesture-handler'

const Home = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
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
                setListings(newListings);
            }
            else {
                setListings((prev) => [...prev, ...newListings]);
            }

            setHasMore(page < response.data.totalPages);
        }
        catch (err) {
            setError('Failed to fetch listings. Please try again later.');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchListings(1, category);
    }, [category]);

    useEffect(() => {
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
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>

            <StatusBar backgroundColor='#ffffff' barStyle='light-content' />

            <View className='flex-1 bg-gray-50'>
                <Header heading={"home"} />
                <HorizontalScrollList activeCategory={category} setCategory={setCategory} />

                {error ? (
                    <View className="flex-1 justify-center items-center px-[15px]">
                        <Text>{error}</Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={listings}
                            renderItem={(props) => Listing({ ...props, router })}
                            keyExtractor={(item) => item._id}
                            numColumns={1}
                            ListFooterComponent={
                                <>
                                    {loading && (
                                        <ScrollView showsVerticalScrollIndicator={false} className="py-[20px] px-[15px]">
                                            {Array.from({ length: 10 }).map((_, index) => (<ListingSkeleton key={index} />))}
                                        </ScrollView>
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
        </SafeAreaView>
    );
};

export default Home;