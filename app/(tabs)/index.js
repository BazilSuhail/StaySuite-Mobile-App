import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';  // Import FontAwesome5 from expo-vector-icons
import { Link, useRouter } from 'expo-router';
import axios from 'axios'
import noResults from "@/assets/Assets/noResults.webp";
import config from '@/Config/Config';
import HorizontalScrollList from '@/components/HorizontalScrollList';
import { useAuthContext } from '@/hooks/AuthProvider';
import avatarImages from '@/constants/avatar';
import { Header } from '@/components/Header';


const renderItem = ({ item, router }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/${item._id}`)} // Using useRouter for navigation
      className='rounded-[12px] pb-[15px] mx-[15px] overflow-hidden mt-[20px] border-[1px] border-gray-300 shadow-sm bg-white '
    >
      <Image
        source={
          item.images.placePicture
            ? { uri: item.images.placePicture }
            : { uri: 'https://via.placeholder.com/300' }
        } className='h-[200px] w-full'
        resizeMode="cover"
      />

      <View className='px-[15px] mt-[8px]'>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>
            {item.address.suburb.substring(0, 8)}, {item.address.country.substring(0, 8)}
          </Text>
          {item.rating > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text className='font-[600]'>{item.rating} </Text>
              <AntDesign name="star" size={17} color="#6b7280" />
            </View>
          )}
        </View>
        <View className='flex-row items-center justify-between mt-[12px]'>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
            ${item.price} <Text className='text-gray-500 text-[13px]'>/night</Text>
          </Text>
          <Text className='text-white mt-[6px] bg-gray-400 w-[75px] font-[700] text-center text-[10px] rounded-md py-[2px]'>
            {item.property_type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const Home = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //const [errorStatus, setErrorSttaus] = useState('');
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
      } else {
        setListings((prev) => [...prev, ...newListings]);
      }
      setHasMore(page < response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch listings. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setCurrentPage(1);
    fetchListings(1, category);
  }, []);


  useEffect(() => {
    console.log(category)
    fetchListings(currentPage, category);
  }, [currentPage, category]);


  const loadMore = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /* if (error) {
     return (
       <div className='mt-[85px] min-h-screen md:mt-[95px]'> 
         <div className='top-[60px] w-full bg-white sticky'>
           <HorizontalScrollList setCategory={setCategory} />
         </div>
         <Homeloader />
       </div>
     );
   }*/

  return (
    <View className='flex-1 pt-[35px] bg-gray-50'>
      <StatusBar backgroundColor='#f9fafb' barStyle='light-content' />

      <Header heading={"home"} />
      <HorizontalScrollList setCategory={setCategory} />

      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>Loading...</Text>
        </View>
      ) :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listings}
          renderItem={(props) => renderItem({ ...props, router })}
          keyExtractor={item => item._id}
          numColumns={1}
        />
      }


      {listings.length === 0 && (
        <View style={{ marginTop: 150, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 15, marginTop: -70, paddingHorizontal: 55, backgroundColor: 'white', paddingTop: 18 }}>
            No listings found
          </Text>
        </View>
      )}

      {hasMore && (
        <View className='mx-auto mb-[8px]'>
          <TouchableOpacity
            onPress={loadMore}
            className='text-rose-700 mt-[10px] font-[600]'
            disabled={loading}
          >
            <Text style={{ color: '#E11D48', fontWeight: '600' }}>
              {loading ? 'Loading...' : 'Show More ...'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Home;