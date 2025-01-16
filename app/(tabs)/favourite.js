import React, { useState, useEffect } from 'react';
import axios from 'axios';
import noResults from "@/assets/Assets/noFavourites.webp";
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/Config/Config";
import { useAuthContext } from '@/hooks/AuthProvider';

const Favourite = () => {
const {handleScroll} = useAuthContext();
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


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
      }
      );

      if (currentPage === 1) {
        setListings(response.data.listings);
      }
      else {
        setListings((prev) => [...prev, ...response.data.listings]);
      }

      setTotalPages(response.data.totalPages);
    }
    catch (err) {
      setError('Failed to fetch favorite listings. Please try again.');
      console.error(err.response?.data || err.message);
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
    <View showsVerticalScrollIndicator={false} className='bg-[#f3f3f3] flex-1 px-[18px] pb-[85px]'>
      <View>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 15,
            color: '#e11d48',
            fontWeight: '700',
          }}
        >
          Favourite Listings
        </Text>
        <View
          style={{
            height: 2.5,
            backgroundColor: '#e11d48',
            marginBottom: 35,
          }}
        />

        {/* Listings */}
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          numColumns={1}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => navigate(`/listing/${item._id}`)}
              style={{
                width: 330,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 16,
                alignSelf: 'center',
              }}
            >
              <Image
                source={{
                  uri: item.images.coverPicture || 'https://via.placeholder.com/300',
                }}
                style={{
                  height: 220,
                  width: '100%',
                  margin: 2,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: '#6b7280', marginVertical: 4 }}>
                  {item.property_type}
                </Text>
                <Text style={{ color: '#374151' }}>Bedrooms: {item.bedrooms}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 8 }}>
                  ${item.price} / night
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
