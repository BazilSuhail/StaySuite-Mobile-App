import React, { useState, useEffect } from 'react';
import axios from 'axios';
import noResults from "@/assets/Assets/noFavourites.webp";
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/Config/Config";
import { useAuthContext } from '@/hooks/AuthProvider';
import { Header } from '@/components/Header';
import { Link, useRouter } from 'expo-router';

const Favourite = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [currentPage]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.BACKEND_URL}/air-bnb/profile/guest-favourites?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (currentPage === 1) {
        setListings(response.data.listings);
      }
      else {
        setListings((prev) => [...prev, ...response.data.listings]);
      }
      console.log(listings)
      setTotalPages(response.data.totalPages);
    }
    catch (err) {
      setError('Failed to fetch favorite listings. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (error || listings.length === 0) {
    return (
      <View className='bg-gray-50 pt-[35px] min-h-screen justify-center items-center '>
        <Header heading={"Favourites"} />
        <View className="w-full" >
          <View className="min-h-screen w-full flex justify-center items-center mix-blend-multiply">
            <Image source={require('@/assets/Assets/noFavourites.webp')} alt="No Reservations" className="scale-[0.6] mt-[-240px]" />
            <Text className="text-rose-800 font-[600] text-[12px] text-center mt-[-85px]">
              You Have no favourite Listings
            </Text>
            <Link href="/" replace={true} className="text-rose-600 underline text-[14px] font-[700]">Start Exploring</Link>
          </View>
        </View>
      </View>
    );
  }

  /*if (error) {
      return <>
          <div className='bg-gray-100 pt-[115px] p-6 min-h-screen justify-center items-center '>
          <div className="max-w-[1150px] mx-auto" >
              <h3 className='text-[24px] mb-[15px] text-rose-600 font-[700]'>Favourite Listings</h3>
              <div className='h-[2.5px] bg-rose-600 mb-[35px] lg:mb-[55px]'></div>
              </div>
              <div className="flex flex-col justify-center items-center mix-blend-multiply">
                  <img src={noFavourites} alt="" className="scale-[0.6] md:scale-[0.7] opacity-70" />
              </div>
              <p className='text-center mt-[-65px] font-[600] text-rose-700 mx-auto'>You Have no Favourite Listings</p>
          </div>
      </>;
  }*/

  return (
    <View className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor='#f9fafb' barStyle='light-content' />

      <Header heading={"Favourites"} />
      <View className='bg-[#f3f3f3] flex-1 px-[10px] pt-[35px]'>

        {/* Listings */}
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => router.push(`/${item._id}`)}
              className={`${index % 2 === 0 ? 'mr-[1%]' : 'ml-[1%]'} mb-[15px] shadow-md overflow-hidden border-[1px] bg-white border-[#ddd] w-[49%] mr-[2%] rounded-[8px]`}
            >
              <Image
                source={{
                  uri: item.images.coverPicture || 'https://via.placeholder.com/300',
                }}
                style={{
                  height: 110,
                  width: '100%',
                }}
                resizeMode="cover"
              />
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: '600' }}>{item.name.slice(0, 21)}{item.name.length > 21 && '...'}</Text>
                <Text className='bg-[#6b7280] rounded-lg text-[8px] text-white w-[65px] py-[1.5px] mt-[5px] text-center'>
                  {item.property_type}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 8 }}>
                  ${item.price} <Text className='text-[12px] font-[600] text-gray-600'>/night</Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Show More Button */}
        {currentPage < totalPages && (
          <View
            style={{
              marginTop: 24,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={handleShowMore}
              style={{
                backgroundColor: '#e11d48',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: 'center',
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                  }}
                >
                  Show More
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Favourite;
