import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth(); // 👈 Use the Auth Context we built earlier

  
// Inside handleLogin function:
const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
    }
    
    setLoading(true); // Show spinner
    
    // 👇 CALL THE NEW ASYNC LOGIN
    const result = await login(email, password);
    
    setLoading(false);

    if (result.success) {
       // ✅ Login Success!
        await login(result.user); // Save user to memory
        // Navigation happens automatically via AppNavigator if you set it up right, 
        // OR you can navigate manually:
        navigation.replace("MainTabs"); 
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back! 👋</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
       onChangeText={text => setEmail(text ? text.trim() : '')}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin} 
        disabled={loading}
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

  

<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
  <Text style={styles.link}>Don't have an account? Sign Up</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#FFF8DC', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#FF9900', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#007AFF' },
});