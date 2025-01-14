import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
//import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import config from '@//Config/Config';
import { useRouter } from 'expo-router';
import Loader from '@/components/Loader';

const Home = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 15,
    seconds: 10,
  });

  const categories = [
    { name: "Sports Wear", icon: "soccer-ball-o" },
    { name: "Active Wear", icon: "heartbeat" },
    { name: "Street Wear", icon: "street-view" },
    { name: "Fitness Wear", icon: "bicycle" },
    { name: "Gym Wear", icon: "futbol-o" },
  ];  

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        // Decrease seconds
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(interval);
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  //const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.REACT_APP_API_BASE_URL}/homeproducts`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <View className='h-screen flex items-center justify-center'>
         <Loader />
       </View>
  );
  if (error) return <Text>Error: {error}</Text>;

  const handlePress = (id) => {
    //console.log(id)
    router.push(`/${id}`);
  };

  const renderProductRow = (rowProducts, index) => (
    <View key={`row-${index}`} className="flex-row justify-between">
      {rowProducts.map((item) => {
        const discountedPrice = item.sale
          ? (item.price - (item.price * item.sale) / 100).toFixed(2)
          : item.price.toFixed(2);

        return (
          <TouchableOpacity
            key={item._id}
            onPress={() => handlePress(item._id)}
            className="p-2 w-[48%] bg-gray-100 rounded-lg m-1 shadow-md"
          >
            <Image
              source={{ uri: `${config.REACT_APP_API_BASE_URL}/uploads/${item.image}` }}
              className="w-full h-[210px] object-cover rounded-lg mb-2"
            />
            <View className="px-2">
              <Text className="text-md font-medium text-red-900">
                {item.name.length > 22 ? `${item.name.substring(0, 15)}...` : item.name}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text>
                  {item.sale !== 0 && (
                    <Text className="text-red-500 line-through text-[12px]">
                      Rs. {parseInt(item.price)}
                    </Text>
                  )}
                </Text>

                <Text className="text-[17px] font-medium">
                  Rs. {parseInt(discountedPrice)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );


  const rows = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(renderProductRow(products.slice(i, i + 2), i));
  }


  return (
    <SafeAreaView className="flex-1 pt-[45px] px-3" >
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="flex-row justify-between items-center  shadow-md">
          <TouchableOpacity className="bg-red-900 rounded-full h-[40px] w-[40px] flex justify-center items-center">
            <FontAwesome name="cog" size={23} color="white" />
          </TouchableOpacity>

          <View className="flex justify-center">
            <Text className="text-center text-[13px] text-gray-500 font-bold">Main Office</Text>
            <Text className="text-center text-[16px] font-medium">12th Street, Reiman Road</Text>
          </View>

          <TouchableOpacity className="bg-red-100 rounded-full h-[40px] w-[40px] flex justify-center items-center">
            <FontAwesome name="ellipsis-h" size={23} color="red" />
          </TouchableOpacity>
        </View>

        <View className="bg-gray-200 border border-gray-300 mt-[15px] flex-row justify-center items-center py-3 rounded-lg ">
          <FontAwesome name="search" size={19} color="#474747" />
          <Text className="font-medium text-search-color ml-[8px] text-[16px]">Search the Entire Catalog</Text>
        </View>

        <View className="bg-gray-500 mt-[15px] py-[25px] flex-row  items-center rounded-lg ">
          <Text className="font-medium text-gray-100 ml-[15px] text-[15px]">Delivery is</Text>
          <Text className="text-gray-700 bg-white rounded-[5px] px-1 font-bold ml-[8px] text-[14px]">50%</Text>
          <Text className="font-medium text-gray-100 ml-[8px] text-[15px]">Cheaper</Text>
        </View>


        <View className="bg-white rounded-lg mt-[15px] py-3">
          <View className=" flex-row  px-4 justify-between items-center rounded-lg ">
            <Text className="font-bold text-gray-700  text-[20px]">Trending Categories</Text>
            <Text className="font-medium text-search-color  text-[16px]">See All</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row mt-[15px]  px-2 flex-wrap gap-x-[4px]">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => handleCategoryClick(category.name)}
                >
                  <View className="mt-[10px] scale-[0.8] items-center">
                    <View className="w-[65px] h-[65px] rounded-full bg-gray-300 flex justify-center items-center">
                      <FontAwesome
                        name={category.icon}
                        size={32}
                        color="black"
                      />
                    </View>
                    <Text className="font-bold text-gray-600 mt-[7px]">{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="bg-white mt-[15px] py-3">
          <View className="flex-row px-4 justify-between items-center rounded-lg">
            <Text className="font-bold text-red-900 text-[18px]">Flash Sale !!</Text>
            <Text className="text-red-600 font-[600] text-[14px]"><Text className='text-[11px] font-extrabold text-red-400'>Ends In: </Text><Text className='underline'>{`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</Text></Text>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {rows.map((row, index) => (
              <View key={index}>
                {row}
              </View>
            ))}
          </ScrollView>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
