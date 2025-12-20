import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
// We do NOT import NavigationContainer here anymore
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    // 👇 WRAP EVERYTHING IN AUTH PROVIDER
    <AuthProvider>
      <StripeProvider publishableKey="...">
        <CartProvider>
           <AppNavigator />
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}