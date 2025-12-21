import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
// REMOVED STRIPE FOR STABILITY 🛡️

export default function App() {
  return (
    <AuthProvider>
      {/* 👇 Direct connection: No Stripe blocking the way */}
      <CartProvider>
          <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}