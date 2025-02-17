import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'

// Updated categories with valid icon names and their respective families
const categories = [
  { name: 'All', iconFamily: MaterialCommunityIcons, iconName: 'view-grid' },
  { name: 'Mansions', iconFamily: FontAwesome5, iconName: 'landmark' },
  { name: 'Hotel', iconFamily: FontAwesome5, iconName: 'hotel' },
  { name: 'Castle', iconFamily: FontAwesome5, iconName: 'chess-rook' },
  { name: 'Villa', iconFamily: MaterialCommunityIcons, iconName: 'home-city' },
  { name: 'Apartment', iconFamily: FontAwesome5, iconName: 'building' },
  { name: 'House', iconFamily: FontAwesome5, iconName: 'home' },
  { name: 'Condo', iconFamily: FontAwesome5, iconName: 'building' },
  { name: 'Mountain', iconFamily: MaterialCommunityIcons, iconName: 'terrain' },
  { name: 'Cabin', iconFamily: MaterialCommunityIcons, iconName: 'home-outline' },
  { name: 'Beachfront', iconFamily: MaterialCommunityIcons, iconName: 'beach' },
  { name: 'Campground', iconFamily: FontAwesome5, iconName: 'campground' },
  { name: 'Room', iconFamily: MaterialCommunityIcons, iconName: 'bed' },
  { name: 'Warehouse', iconFamily: FontAwesome5, iconName: 'warehouse' },
  { name: 'Boat', iconFamily: FontAwesome5, iconName: 'ship' },
  { name: 'RV', iconFamily: FontAwesome5, iconName: 'caravan' },
  { name: 'Island', iconFamily: MaterialCommunityIcons, iconName: 'island' },
  { name: 'Eco', iconFamily: MaterialCommunityIcons, iconName: 'leaf' },
  { name: 'Poolside', iconFamily: MaterialCommunityIcons, iconName: 'pool' },
  { name: 'Pet', iconFamily: FontAwesome5, iconName: 'paw' },
  { name: 'Spa', iconFamily: MaterialCommunityIcons, iconName: 'spa' },
];<MaterialCommunityIcons name="beach" size={24} color="black" />

const HorizontalScrollList = ({ setCategory,activeCategory }) => {
  return (
    <View className='px-[18px] py-[12px] border-[1px] border-gray-100 bg-white'>
      <ScrollView horizontal contentContainerStyle={styles.scrollView} showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCategory(category.name)}
            style={styles.iconWrapper}
          >
            <category.iconFamily name={category.iconName} size={26} color={activeCategory === category ? '#B91C1C' : '#666'} />
            <Text style={styles.text}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom:10,
    width: '100%',
    
  },
  scrollView: {
    paddingHorizontal: 15,
    gap: 8,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  text: {
    fontSize: 10,
    color: '#666',
    fontWeight:600,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default HorizontalScrollList;
