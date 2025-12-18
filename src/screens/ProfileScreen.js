import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // <--- 1. Import the tool

export default function ProfileScreen({ navigation }) {
  const { user, logoutUser } = useCart();
  const [image, setImage] = useState(null); // <--- 2. State to hold the photo

  const handleLogout = () => {
    logoutUser();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // <--- 3. The Function to Pick Image
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only pictures
      allowsEditing: true, // Let user crop
      aspect: [1, 1], // Square shape
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Save the image link
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        {/* 4. Clickable Avatar Area */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
             {image ? (
                 <Image source={{ uri: image }} style={styles.avatarImage} />
             ) : (
                 <Ionicons name="camera" size={40} color="white" />
             )}
        </TouchableOpacity>
        <Text style={{color: 'white', marginBottom: 10, fontSize: 12}}>Tap to change photo</Text>

        <Text style={styles.name}>{user ? user.name : "Guest User"}</Text>
        <Text style={styles.email}>{user ? user.email : "Please log in"}</Text>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="gray" />
            <Text style={styles.menuText}>Settings</Text>
        </View>
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
  avatarContainer: { width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 5, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  name: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  email: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  menu: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 18, marginLeft: 15, color: '#333' },
  logoutButton: { marginTop: 30, backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  logoutText: { color: 'red', fontWeight: 'bold' }
});