import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext'; // <--- Import this

export default function App() {
  return (
    <CartProvider> 
      {/* Now the whole app has access to the Cart! */}
      <StatusBar style="dark" />
      <AppNavigator />
    </CartProvider>
  );
}