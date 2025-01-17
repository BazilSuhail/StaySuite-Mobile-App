import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthContext } from '@/hooks/AuthProvider';
import FilterModal from '@/components/FilterModal';
import { Header } from '@/components/Header';
import config from '@/Config/Config';
import { Listing } from '@/components/Listing';
import { useRouter } from 'expo-router';

const Search = () => {
  const router = useRouter();
  const { searchfilters } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchListings = async () => {
      try {
        const response = await axios.post(`${config.BACKEND_URL}/air-bnb/home/filtered-listings`, searchfilters);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchfilters]);

  if (loading) {
    return (
      <View> 
        <Text>Signing In...</Text>
      </View>
    );
  }

  return (
    <View className='bg-gray-50 flex-1'>
      <StatusBar backgroundColor='#ffffff' barStyle='light-content' />
      <Header heading={"Search"} />
      
      {/* Filter Modal, ensure it has a higher z-index */}
      <View className="absolute top-[85px] left-0 right-0 z-50">
        <FilterModal />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={results}
        renderItem={(props) => Listing({ ...props, router })}
        keyExtractor={item => item._id}
        numColumns={1}
      />
    </View>
  );
};

export default Search;
