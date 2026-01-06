import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // 👇 YOUR RENDER URL
  const API_URL = "https://yumigo-api.onrender.com/api/auth"; 

  // 1. CHECK STORAGE ON APP START
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser)); 
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false); 
      }
    };
    loadUser();
  }, []);

  // 2. LOGIN
  const login = async (email, password) => {
    try {
      if (!email) return { success: false, message: "Email is required" };
      
      console.log("Logging in...", email); // Debug Log

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email?.trim(), password }), 
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debug Log

      if (response.ok && data.success) {
        // ✅ Login Success
        setUser(data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        // 🔑 SAVE TOKEN (Critical for new security)
        if (data.token) {
            await AsyncStorage.setItem('token', data.token);
        }
        
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch (e) {
      console.error("Login Error", e);
      return { success: false, message: "Server connection failed" };
    }
  };

  // 3. SIGNUP
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Auto-Login after Signup
        setUser(data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) await AsyncStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Signup failed" };
      }
    } catch (e) {
      return { success: false, message: "Could not connect to server" };
    }
  };

  // 4. LOGOUT
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user'); 
    await AsyncStorage.removeItem('token');
  };

  // 5. UPDATE USER
  const updateUser = async (updatedData) => {
      if (!user) return;
      try {
        // Optimistic Update
        const mergedUser = { ...user, ...updatedData };
        setUser(mergedUser);
        await AsyncStorage.setItem('user', JSON.stringify(mergedUser));

        // Sync with Server
        const token = await AsyncStorage.getItem('token'); // Get Token
        await fetch(`${API_URL}/update`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Send Token
          },
          body: JSON.stringify({ 
              userId: user._id || user.id, 
              ...updatedData 
          }),
        });
      } catch (e) {
          console.error("Update failed", e);
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);