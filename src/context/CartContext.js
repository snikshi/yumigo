import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === food._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...food, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== foodId));
  };

  // 👇 NEW FUNCTION: Wipes the cart clean
  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);