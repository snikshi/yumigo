import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    <AuthProvider>
      <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDtq4rkwe352PjdsgNgTaXoQsVSM92Tx">
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}