import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load User from Storage when App starts
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log("Failed to load user", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Login Function (Saves to Storage)
  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  // 3. Logout Function (Clears Storage)
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use it easily
export const useAuth = () => useContext(AuthContext);