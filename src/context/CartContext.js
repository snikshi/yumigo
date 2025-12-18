import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // <--- NEW: Store User Info

  // Cart Functions
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // User Functions
  const loginUser = (userData) => {
    setUser(userData); // Save user to memory
  };
  const logoutUser = () => {
    setUser(null); // Clear user
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalPrice, user, loginUser, logoutUser }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);