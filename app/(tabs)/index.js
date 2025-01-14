import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';  // Import FontAwesome5 from expo-vector-icons
import { useRouter } from 'expo-router';
import axios from 'axios'
import noResults from "@/assets/Assets/noResults.webp";
import config from '@/Config/Config';


const renderItem = ({ item, router }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/listing/${item._id}`)} // Using useRouter for navigation
      style={{
        overflow: 'hidden',
        marginTop: 15,
        cursor: 'pointer',
        marginHorizontal: 4,
      }}
    >
      <Image
        source={
          item.images.placePicture
            ? { uri: item.images.placePicture }
            : { uri: 'https://via.placeholder.com/300' }
        } className='h-[200px] w-full rounded-[15px]'
        resizeMode="cover"
      />

      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>
            {item.address.suburb.substring(0, 8)}, {item.address.country.substring(0, 8)}
          </Text>
          {item.rating > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{item.rating} </Text>
              <FontAwesome5 name="star" size={18} color="yellow" />
            </View>
          )}
        </View>
        <Text style={{ color: 'red', fontWeight: '700', fontSize: 12 }}>
          {item.property_type}
        </Text>
        <Text style={{ color: 'gray' }}>{item.category}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 6 }}>
          ${item.price} / night
        </Text>
      </View>
    </TouchableOpacity>
  )
};

const Home = () => {
  const router = useRouter();

  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //const [errorStatus, setErrorSttaus] = useState('');
  const [category, setCategory] = useState('All');
  const [searchParams, setSearchParams] = useState(null);

  const fetchListings = async (page, category) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BACKEND_URL}/air-bnb/home/listings`, { page, limit: 10, category });
      const newListings = response.data.listings;

      //console.log(newListings)
      if (page === 1) {
        setListings(newListings);
      }
      else {
        setListings((prev) => [...prev, ...newListings]);
      }
      setHasMore(page < response.data.totalPages);
    }
    catch (err) {
      setError(err)
      //setError('Failed to fetch listings. Please try again later.');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchListings(1, category);
  }, []);


  useEffect(() => {
    fetchListings(currentPage, category);
  }, [currentPage, category]);

  /*const loadMore = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };*/

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
    <View className='pb-[45px] pt-[35px] px-[15px]'>

      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>Loading...</Text>
        </View>
      ) :
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={1}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 45 }}
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
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <TouchableOpacity
            onPress={loadMore}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: 'white',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#f5f5f5',
              marginBottom: 25,
            }}
            disabled={loading}
          >
            <Text style={{ color: '#E11D48', fontWeight: '600' }}>
              {loading ? 'Loading...' : 'Show More'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Home;