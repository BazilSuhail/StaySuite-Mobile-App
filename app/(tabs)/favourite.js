import { useState, useEffect } from 'react'
import axios from 'axios'
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import config from "@/Config/Config"
import { Header } from '@/components/Header'
import { Link, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Favourite = () => {
  const insets = useSafeAreaInsets();
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
      //console.log(listings)
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

  if (loading) {
    return (
      <ActivityIndicator />
    )
  }

  if (listings.length === 0) {
    return (
      <SafeAreaView className={`flex-1 pt-${insets.top} bg-white`}> 
          <StatusBar backgroundColor='#ffffff' barStyle='light-content' />
          <Header heading={"Favourites"} />
          <View className="w-full" >
            <View className="min-h-screen w-full flex justify-center items-center mix-blend-multiply">
              <View className="w-[180px] h-[220px] mt-[-85px]">
                <Image source={require('@/assets/Assets/wellcome-2.jpg')} alt="No Reservations" className="w-full h-full mix-blend-multiply" />
              </View>
              <Text className="text-rose-800 font-[600] text-[12px] mt-[8px] text-center">
                You Have no favourite Listings
              </Text>
              <Link href={'/'} replace={true}>
              <Text className='text-[13px] mt-[2px] font-[800] underline text-red-600'>Start Exploring Today !!</Text>
            </Link>
            </View>
          </View> 
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 pt-${insets.top} bg-gray-100`}>
      <StatusBar backgroundColor='#ffffff' barStyle='light-content' />
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
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                Show More
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Favourite;
