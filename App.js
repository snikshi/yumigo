import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext'; // <--- 1. NEW IMPORT
import { StripeProvider } from '@stripe/stripe-react-native';
// FIXING THE BRAIN - FINAL UPDATE
import React from 'react';
// ... rest of code ...

export default function App() {
  return (
    // 👇 2. WRAP EVERYTHING IN AUTH PROVIDER
    <AuthProvider>
      <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDtq4rkwe352PjdsgNgTaXoQsVSM92Tx">
        <CartProvider>
           <AppNavigator />
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}