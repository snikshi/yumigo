import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useAuth(); // We need setUser to update the app memory
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    console.log("DEBUG: User ID is:", user?._id || user?.id);
    setLoading(true);
    try {
      // ⚠️ USE YOUR URL (yumigo-api)
      const response = await fetch("https://yumigo-api.onrender.com/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            // 👇 TRY BOTH ID TYPES TO BE SAFE
            userId: user._id || user.id, 
            name: name,
            email: email
        })
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert("Success", "Profile Updated! ✅");
        
        // 🔄 Update the Global State so the new name shows everywhere immediately
        // We keep the old token, just update user info
        setUser({ ...user, name: json.user.name, email: json.user.email }); 
        
        navigation.goBack();
      } else {
        Alert.alert("Error", json.error || "Update failed");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Full Name"
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            placeholder="Email Address"
            keyboardType="email-address"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
        {loading ? (
            <ActivityIndicator color="white" />
        ) : (
            <Text style={styles.btnText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  saveBtn: { backgroundColor: '#FF9900', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});