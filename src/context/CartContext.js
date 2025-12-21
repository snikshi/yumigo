import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {
    setCartItems((prevItems) => {
      // Check if item already exists
      const existingItem = prevItems.find((item) => item._id === food._id);
      
      if (existingItem) {
        // 👇 CRITICAL FIX: Update PRICE and IMAGE even if it exists!
        return prevItems.map((item) =>
          item._id === food._id 
            ? { ...item, ...food, quantity: item.quantity + 1 } // Update all details + quantity
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...food, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 👇 FORCE NUMBER CONVERSION HERE TOO
  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity, 
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);