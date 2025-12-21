import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 1. The Add Function
  const addToCart = (foodItem) => {
    // Check if item is already in cart
    const existingItem = cartItems.find((item) => item._id === foodItem._id);
    
    if (existingItem) {
      // If yes, just increase quantity
      setCartItems(cartItems.map((item) => 
        item._id === foodItem._id 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
      ));
    } else {
      // If no, add it as new
      setCartItems([...cartItems, { ...foodItem, quantity: 1 }]);
    }
    
    // Give feedback to user
    Alert.alert("Yum!", `${foodItem.name} added to cart.`);
  };

  // 2. The Remove Function
  const removeFromCart = (foodId) => {
    setCartItems(cartItems.filter((item) => item._id !== foodId));
  };

  // 3. The Total Price Calculator
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);