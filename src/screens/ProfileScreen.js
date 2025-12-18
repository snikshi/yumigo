import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext'; // Get the Brain
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const { user, logoutUser } = useCart();

  const handleLogout = () => {
    logoutUser();
    // Reset navigation so user can't go back
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
             <Ionicons name="person" size={50} color="white" />
        </View>
        {/* Display Real User Data */}
        <Text style={styles.name}>{user ? user.name : "Guest User"}</Text>
        <Text style={styles.email}>{user ? user.email : "Please log in"}</Text>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="gray" />
            <Text style={styles.menuText}>Settings</Text>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { backgroundColor: '#FF4B3A', padding: 30, paddingTop: 60, alignItems: 'center' },
  avatarContainer: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  email: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  menu: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 18, marginLeft: 15, color: '#333' },
  logoutButton: { marginTop: 30, backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  logoutText: { color: 'red', fontWeight: 'bold' }
});