import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import RideHistoryScreen from '../screens/RideHistoryScreen';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen'; // 👈 Imported here
import HomeScreen from '../screens/HomeScreen';
import FoodScreen from '../screens/FoodScreen';
import RideScreen from '../screens/RideScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellerScreen from '../screens/SellerScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import MenuScreen from '../screens/MenuScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF9900',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Food') iconName = 'fast-food';
          else if (route.name === 'Ride') iconName = 'car';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Seller') iconName = 'briefcase';
          else if (route.name === 'Profile') iconName = 'person';
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

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
       <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}