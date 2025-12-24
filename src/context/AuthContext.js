import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

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

  // 2. LOGIN (Now uses YOUR email)
  const login = async (email, password) => {
    // We create a fresh user with the email YOU typed
    const newUser = { 
        id: Date.now().toString(), 
        name: 'New User', // Default name (you can edit this later)
        email: email,     // 👈 USES YOUR INPUT NOW
        phone: '',
        token: 'fake-jwt-token' 
    };

    setUser(newUser);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser)); 
    } catch (e) {
      console.error("Login save failed", e);
    }
  };

  // 3. LOGOUT
  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('user'); 
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // 4. UPDATE USER PROFILE (New Feature!)
  const updateUser = async (updatedData) => {
      if (!user) return;

      // Merge old data with new data
      const newProfile = { ...user, ...updatedData };
      
      setUser(newProfile); // Update State
      try {
          await AsyncStorage.setItem('user', JSON.stringify(newProfile)); // Update Storage
      } catch (e) {
          console.error("Update profile failed", e);
      }
  };

  // Signup can just use login logic for now
  const signup = (name, email, password) => login(email, password);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);