import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import config from '@//Config/Config';
import { useRouter } from 'expo-router';
import Loader from '@/components/Loader';

const ProductList = () => {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.REACT_APP_API_BASE_URL}/fetchproducts/products`);
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.REACT_APP_API_BASE_URL}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${config.REACT_APP_API_BASE_URL}/subcategories`);
        const filteredSubcategories = response.data.filter(subcat => subcat.category === selectedCategory);
        setSubcategories(filteredSubcategories);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  if (loading) return (
    <View className='h-screen flex items-center justify-center'>
         <Loader />
       </View>
  );
  if (error) return <Text>Error: {error}</Text>;

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'All' || product.subcategory === selectedSubcategory;
    return matchesCategory && matchesSubcategory;
  });

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleSubcategoryClick = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
  };

  const handleProductClick = (id) => {
    router.push(`/${id}`);
  };

  const renderProductItem = ({ item }) => {
    const discountedPrice = item.sale
      ? (item.price - (item.price * item.sale) / 100).toFixed(2)
      : item.price.toFixed(2);

    return (
      <TouchableOpacity
        onPress={() => handleProductClick(item._id)}
        className="p-2 pt-3 w-[48%] h-[310px] bg-white rounded-lg mx-[5px] mb-[10px] shadow-md"
      >
        <Image
          source={{ uri: `${config.REACT_APP_API_BASE_URL}/uploads/${item.image}` }}
          className="w-[160px] mx-auto h-[210px] object-cover rounded-lg mb-2"
        />
        <View className="p-2">
          <Text className="text-md font-medium text-red-900">
            {item.name.length > 22 ? `${item.name.substring(0, 22)}...` : item.name}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text>
              {item.sale ? <Text className="text-red-500 line-through text-[12px] my-2">Rs.{parseInt(item.price)}</Text> : <></>}
            </Text>
            <Text className="text-[17px] font-medium">
              <Text className="text-[12px] mr-[6px] font-normal">Rs.</Text>{parseInt(discountedPrice)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View className="flex w-full px-[8px] pt-[48px]">
        <Text className="text-2xl text-red-700 font-bold ">Catalog</Text>
        <View className="bg-gray-400 mx-auto w-[95%] mt-2 h-[3px]"></View>
        {/* Category filter */}
        <View className="px-[8px] mx-2 py-[8px] rounded-xl mt-[15px] bg-white">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row flex-wrap gap-2">
              <TouchableOpacity onPress={() => handleCategoryClick('All')}>
                <Text className={`px-3 py-1 rounded border border-gray-200 ${selectedCategory === 'All' ? 'bg-red-900 text-white' : 'bg-gray-200'}`}>
                  All Categories
                </Text>
              </TouchableOpacity>
              {categories.map(category => (
                <TouchableOpacity
                  key={category._id}
                  onPress={() => handleCategoryClick(category.name)}
                >
                  <Text className={`px-3 py-1 rounded border border-gray-200 ${selectedCategory === category.name ? 'bg-red-900 text-white' : 'bg-gray-200'}`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {selectedCategory !== 'All' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-[8px]">
              <View className="flex flex-row flex-wrap gap-x-2">
                <TouchableOpacity onPress={() => handleSubcategoryClick('All')}>
                  <Text className={`px-3 py-1 rounded border border-gray-200 ${selectedSubcategory === 'All' ? 'bg-red-900 text-white' : 'bg-gray-200'}`}>
                    All Sub-Categories
                  </Text>
                </TouchableOpacity>
                {subcategories.map(subcategory => (
                  <TouchableOpacity
                    key={subcategory._id}
                    onPress={() => handleSubcategoryClick(subcategory.name)}
                  >
                    <Text className={`px-3 py-1 rounded border border-gray-200 ${selectedSubcategory === subcategory.name ? 'bg-red-900 text-white' : 'bg-gray-200'}`}>
                      {subcategory.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
        {selectedCategory !== 'All' &&
          <View className="mt-[12px] py-[3px] ml-auto mr-2 pl-auto w-[130px] rounded-xl border border-red-400 bg-red-50">
            <Text className="text-[13px] font-medium text-center text-red-800">Filterd Results: <Text className="font-extrabold">{filteredProducts.length}</Text></Text>
          </View>
        }
        <View className='h-[12px] bg-gray-200'></View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProductList;
