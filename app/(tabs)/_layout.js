import { Tabs } from 'expo-router';
import { Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#B91C1C', // red-700
        tabBarInactiveTintColor: '#6B7280', // gray-500
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // white
          borderTopLeftRadius: 15, // Rounded upper border
          borderTopRightRadius: 15, // Rounded upper border
          paddingTop: 2, // Top padding
          paddingBottom: 4,
        },
      }}

    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house-chimney" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmark" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: () => null, // Hide the label for "Search"
          tabBarIcon: ({ color }) => (
            <Feather
              name="search"
              size={30} // Larger icon size
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="book-bookmark" size={28} color={color} />
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
