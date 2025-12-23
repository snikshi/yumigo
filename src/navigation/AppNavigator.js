import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native'; 
import { useAuth } from '../context/AuthContext'; 

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import FoodScreen from '../screens/FoodScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import CartScreen from '../screens/CartScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import RideScreen from '../screens/RideScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth(); 

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF9900" />
      </View>
    );
  }

  // 👇 NO NavigationContainer here (App.js handles it!)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // 🔓 LOGGED IN
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Food" component={FoodScreen} />
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
          <Stack.Screen name="History" component={OrderHistoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Ride" component={RideScreen} />
          <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
        </>
      ) : (
        // 🔒 LOGGED OUT
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator> 
  );
}