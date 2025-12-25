import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // 👇 REPLACE THIS URL WITH YOUR ACTUAL RENDER URL
  // (Check your Render Dashboard to see if it ends in .com or .app)
  const API_URL = "https://yumigo-api.onrender.com/api/auth"; 

  // 1. CHECK STORAGE ON APP START
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
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

  // 2. LOGIN (CONNECTED TO REAL BACKEND)
  const login = async (email, password) => {
    try {
      // 👇 SAFETY CHECK: If email is missing, stop immediately.
      if (!email) {
          return { success: false, message: "Email is required" };
      }

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 👇 The ?. prevents the crash even if email is weird
        body: JSON.stringify({ email: email?.trim(), password }), 
      });

      // ... rest of the code ...
      const data = await response.json();

      if (response.ok) {
        // ✅ Login Success: Save Real MongoDB User
        setUser(data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        // ❌ Login Failed: Show Server Message
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch (e) {
      console.error("Login Error", e);
      return { success: false, message: "Server connection failed" };
    }
  };

  // 3. SIGNUP (Now uses Context)
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
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
  };

  // 5. UPDATE USER
  const updateUser = async (updatedData) => {
      if (!user) return;
      try {
        const response = await fetch(`${API_URL}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id || user.id, ...updatedData }),
        });
        
        const data = await response.json();
        if (response.ok) {
          const newProfile = data.user;
          setUser(newProfile);
          await AsyncStorage.setItem('user', JSON.stringify(newProfile));
          Alert.alert("Success", "Profile Updated!");
        }
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