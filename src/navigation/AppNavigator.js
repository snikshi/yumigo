import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // 👈 New Import
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import FoodScreen from '../screens/FoodScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellerScreen from '../screens/SellerScreen';
import RideScreen from '../screens/RideScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen'; // 👈 NEW

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // 👈 Create Stack

// 1. The Tabs (Bottom Bar)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF9900',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Food') iconName = focused ? 'restaurant' : 'restaurant-outline';
            else if (route.name === 'Ride') iconName = focused ? 'car-sport' : 'car-sport-outline';
            else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
            else if (route.name === 'Seller') iconName = focused ? 'briefcase' : 'briefcase-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
      <Tab.Screen name="Ride" component={RideScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Seller" component={SellerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 2. The Main Stack (This controls everything)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* The Tabs are the main screen */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* The Tracking screen sits "on top" of the tabs */}
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}