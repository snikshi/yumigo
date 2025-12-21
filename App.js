import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // 👈 THIS WAS MISSING
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    // 🔑 REPLACE WITH YOUR "pk_test_..." STRIPE KEY
    <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDTq4rkwe352PjdsgNgTaXoQsVSM92Tx0r84OdK6S4mjY3za3v16Qewjaz0wHFIZPLSjV00NB6O2Kk2">
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
             <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </StripeProvider>
  );
}