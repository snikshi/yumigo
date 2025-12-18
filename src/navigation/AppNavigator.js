import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';

// Import all screens
import HomeScreen from '../screens/HomeScreen';
import FoodScreen from '../screens/FoodScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import CartScreen from '../screens/CartScreen'; // <--- Make sure this is imported

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. The Tabs (Bottom Bar)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF4B3A',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Food') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 2. The Main Stack (Holds Tabs + Details)
// ... existing imports ...

// 2. The Main Stack
export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* initialRouteName tells the app which screen to show first */}
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Register">
        
        {/* The Login/Register Screen */}
        <Stack.Screen name="Register" component={RegisterScreen} />
<Stack.Screen name="Login" component={LoginScreen} />

        {/* The Main App (Tabs) */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        {/* The Detail Screen */}
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}