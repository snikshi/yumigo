import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './src/navigation/AppNavigator';

import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { WalletProvider } from './src/context/WalletContext';

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDTq4rkwe352PjdsgNgTaXoQsVSM92Tx0r84OdK6S4mjY3za3v16Qewjaz0wHFIZPLSjV00NB6O2Kk2">
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <WalletProvider>
              <NavigationContainer>
                 <AppNavigator />
              </NavigationContainer>
            </WalletProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </StripeProvider>
  );
}