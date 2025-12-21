import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    // 🔑 PASTE YOUR "pk_test_..." KEY HERE
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