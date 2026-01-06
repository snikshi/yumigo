import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Context Imports
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { WalletProvider } from './src/context/WalletContext'; // 👈 IMPORT THIS
import { ThemeProvider } from './src/context/ThemeContext';
import * as Notifications from 'expo-notifications';
import { AIProvider } from './src/context/AIContext';
import AIChatOverlay from './src/components/AIChatOverlay';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51Sfknu08capLH0moi2dLDTq4rkwe352PjdsgNgTaXoQsVSM92Tx0r84OdK6S4mjY3za3v16Qewjaz0wHFIZPLSjV00NB6O2Kk2">
      <AuthProvider>
        <ThemeProvider>
          {/* 👇 WALLET MOVED UP HERE (Safe Position) */}
          <WalletProvider>
            <AIProvider>
            <CartProvider>
              <OrderProvider>
                <NavigationContainer>
                   <AppNavigator />
                   <AIChatOverlay />
                </NavigationContainer>
              </OrderProvider>
            </CartProvider>
            </AIProvider>
          </WalletProvider>
        </ThemeProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </StripeProvider>
  );
}