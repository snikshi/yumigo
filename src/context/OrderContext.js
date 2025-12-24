import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext'; // 👈 1. Import Auth

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth(); // 👈 Get current user

  const [liveOrder, setLiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  // 👇 2. LOAD DATA (Specific to User)
  useEffect(() => {
    const loadData = async () => {
        if (!user || !user.id) {
            setLiveOrder(null);
            setOrderHistory([]);
            return;
        }

        try {
            // Unique Keys: e.g., "orders_history_123"
            const storedLive = await AsyncStorage.getItem(`orders_live_${user.id}`);
            const storedHistory = await AsyncStorage.getItem(`orders_history_${user.id}`);

            if (storedLive) setLiveOrder(JSON.parse(storedLive));
            else setLiveOrder(null); // Clear if none

            if (storedHistory) setOrderHistory(JSON.parse(storedHistory));
            else setOrderHistory([]); // Clear if none
        } catch (e) {
            console.error("Failed to load orders", e);
        }
    };
    loadData();
  }, [user]); // 👈 Run whenever User changes

  // 👇 3. SAVE DATA (Specific to User)
  const saveToStorage = async (currentLive, currentHistory) => {
      if (!user || !user.id) return;
      try {
          if (currentLive) {
            await AsyncStorage.setItem(`orders_live_${user.id}`, JSON.stringify(currentLive));
          } else {
            await AsyncStorage.removeItem(`orders_live_${user.id}`); 
          }
          await AsyncStorage.setItem(`orders_history_${user.id}`, JSON.stringify(currentHistory));
      } catch (e) {
          console.error("Failed to save orders", e);
      }
  };

  const startOrder = (items, total) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(Math.random() * 10000), 
      date: new Date().toDateString(),
      items: items,
      totalPrice: total,
      status: 'Order Placed',
    };

    const updatedHistory = [newOrder, ...orderHistory]; 

    setLiveOrder(newOrder);
    setOrderHistory(updatedHistory);
    saveToStorage(newOrder, updatedHistory);
  };

  const updateOrderStatus = (newStatus) => {
    if (liveOrder) {
      const updatedLive = { ...liveOrder, status: newStatus };
      
      const updatedHistory = orderHistory.map(order => 
        order.id === liveOrder.id ? updatedLive : order
      );

      setLiveOrder(updatedLive);
      setOrderHistory(updatedHistory);
      saveToStorage(updatedLive, updatedHistory);
    }
  };

  return (
    <OrderContext.Provider value={{ liveOrder, orderHistory, startOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);