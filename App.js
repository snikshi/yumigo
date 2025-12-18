import React from 'react';
// We do NOT import NavigationContainer here anymore
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    // 👇 Replace with your real Publishable Key (pk_test_...)
    <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDTq4rkwe352PjdsgNgTaXoQsVSM92Tx0r84OdK6S4mjY3za3v16Qewjaz0wHFIZPLSjV00NB6O2Kk2">
      <CartProvider>
        {/* 👇 Just show the Navigator (It has its own Container inside) */}
        <AppNavigator />
      </CartProvider>
    </StripeProvider>
  );
}