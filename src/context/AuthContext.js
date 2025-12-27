import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // 👇 REPLACE THIS WITH YOUR ACTUAL RENDER URL
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

  // 2. LOGIN
  const login = async (email, password) => {
    try {
      if (!email) return { success: false, message: "Email is required" };

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email?.trim(), password }), 
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login Success: Save User to State & Storage
        setUser(data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
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

  // 5. UPDATE USER (Fixed for Image Persistence)
  const updateUser = async (updatedData) => {
      if (!user) return;

      try {
        // ✅ STEP A: Optimistic Update (Update Local App First)
        // This ensures the Image URI sticks instantly without waiting for Server
        const mergedUser = { ...user, ...updatedData };
        setUser(mergedUser);
        await AsyncStorage.setItem('user', JSON.stringify(mergedUser));

        // ✅ STEP B: Send changes to Backend (Background Sync)
        // We wrap this in a separate try/catch so UI update doesn't fail if server is down
        const response = await fetch(`${API_URL}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              userId: user._id || user.id, 
              ...updatedData 
              // Note: Sending local file URI to server won't upload the file, 
              // but it will save the string path if your DB schema allows it.
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log("Backend synced successfully");
        } else {
            console.warn("Backend update failed, but local data saved:", data.message);
        }

      } catch (e) {
          console.error("Update failed", e);
          // Note: We do NOT revert the user state here, so the user keeps their changes locally
          Alert.alert("Note", "Profile saved locally, but server sync failed.");
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);