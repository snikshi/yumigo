import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    // 👇 The "Brain" (Auth) wraps everything
    <AuthProvider>
      {/* 👇 The "Payment System" wraps the Cart */}
      <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDtq4rkwe352PjdsgNgTaXoQsVSM92Tx">
        {/* 👇 The "Cart" wraps the Screens */}
        <CartProvider>
           <AppNavigator />
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}