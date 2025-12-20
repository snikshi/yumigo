import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// 👇 IMPORT THE BRAIN
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 👇 GET THE SAVE FUNCTION
  const { loginUser } = useCart(); 
const { login } = useAuth();
  const handleLogin = async () => {
   // ... inside handleLogin ...
if (response.ok) {
    // 👇 THIS LINE IS CRITICAL - IT SAVES THE USER
    login(data.user); 
    
    Alert.alert("Success", "Welcome Back!");
    // ... navigation ...
}
    
    setLoading(true);

    try {
        // 1. Send Data to Backend
        // Make sure this IP is still correct!
        const response = await fetch('https://yumigo-api.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // 2. Check Response
        if (response.ok) {
            // 👇 SAVE USER TO MEMORY HERE
            loginUser(data.user); 
            
            Alert.alert("Welcome Back! 👋", "Login Successful");
            navigation.navigate('MainTabs'); 
        } else {
            Alert.alert("Login Failed", data.message || "Invalid credentials");
        }

    } catch (error) {
        Alert.alert("Error", "Could not connect to server.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back! 👋</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email Address" 
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>LOG IN</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#FF4B3A' },
  input: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#FF4B3A', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: 'gray' }
});