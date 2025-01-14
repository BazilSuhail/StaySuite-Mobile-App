import { Tabs } from 'expo-router';
import { useEffect } from 'react'; 
import { FontAwesome } from '@expo/vector-icons'; // Import vector icons
import { useDispatch } from 'react-redux';
import { initializeCart } from '@/hooks/cartSlice';
import { initializeAuth } from '@/hooks/authSlice';

export default function TabLayout() {
  const dispatch = useDispatch();

  // Use effect to dispatch initializeCart when the app starts
  useEffect(() => {
    dispatch(initializeAuth()); // Initialize auth state on app load
    dispatch(initializeCart());  // Initialize the cart when the app starts
  }, [dispatch]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#B91C1C', // red-700
        tabBarInactiveTintColor: '#6B7280', // gray-500
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // white
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="productlist"
        options={{
          title: 'Product List',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="shopping-cart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),
        }}
      /> 
    </Tabs>
  );
}
