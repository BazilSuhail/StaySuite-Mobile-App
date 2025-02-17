import { useEffect, useState } from 'react'
import { View, Text, StatusBar, FlatList, SafeAreaView } from 'react-native'
import axios from 'axios'
import { useAuthContext } from '@/hooks/AuthProvider'
import FilterModal from '@/components/FilterModal'
import { Header } from '@/components/Header'
import config from '@/Config/Config'
import { Listing } from '@/components/Listing'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Search = () => {
  const insets = useSafeAreaInsets();
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

  return (
    <SafeAreaView className={`flex-1 pt-${insets.top} bg-gray-50`}>
      <StatusBar backgroundColor='#ffffff' barStyle='light-content' />

      {/* Filter Modal, ensure it has a higher z-index */}
      <View className="absolute pb-[10px] bg-white left-0 right-0 z-50">
        <FilterModal />
      </View>

      <View className="h-[60px] w-full"></View>

      {loading ?
        <View>
          <Text>Signing In...</Text>
        </View>
        :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={results}
          renderItem={(props) => Listing({ ...props, router })}
          keyExtractor={item => item._id}
          numColumns={1}
        />
      }
    </SafeAreaView>
  );
};

export default Search;
