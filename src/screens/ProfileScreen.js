import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: 'destructive' }
    ]);
  };

  const renderOption = (icon, title, subtitle) => (
    <TouchableOpacity style={styles.optionRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color="#444" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. HEADER PROFILE */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.name}>{user?.name || "Boss User"}</Text>
            <Text style={styles.email}>{user?.email || "boss@yumigo.com"}</Text>
            <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. WALLET CARD */}
        <View style={styles.walletCard}>
            <View>
                <Text style={styles.walletLabel}>Yumigo Money</Text>
                <Text style={styles.walletBalance}>₹ 850.00</Text>
            </View>
            <TouchableOpacity style={styles.addMoneyBtn}>
                <Text style={styles.addMoneyText}>+ Add Money</Text>
            </TouchableOpacity>
        </View>

        {/* 3. MENU OPTIONS */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>MY ACCOUNT</Text>
            {renderOption("receipt-outline", "Your Orders", "Track ongoing orders")}
            {renderOption("heart-outline", "Favorite Restaurants", "3 saved places")}
            {renderOption("card-outline", "Payments & Refunds", "Manage cards")}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>SETTINGS</Text>
            {renderOption("notifications-outline", "Notifications")}
            {renderOption("globe-outline", "Language", "English")}
            {renderOption("help-circle-outline", "Help & Support")}
        </View>

        {/* 4. LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Yumigo v2.0 (Pro Build)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingBottom: 30 },
  
  // Header
  header: { flexDirection: 'row', padding: 20, alignItems: 'center', backgroundColor: '#fff', marginBottom: 15 },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15, backgroundColor: '#eee' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { color: '#888', marginBottom: 5 },
  editBtn: { alignSelf: 'flex-start' },
  editBtnText: { color: '#FF9900', fontWeight: 'bold' },

  // Wallet
  walletCard: { backgroundColor: '#333', marginHorizontal: 20, borderRadius: 15, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, elevation: 5 },
  walletLabel: { color: '#aaa', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  walletBalance: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  addMoneyBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  addMoneyText: { fontWeight: 'bold', color: '#333', fontSize: 12 },

  // Options
  section: { backgroundColor: '#fff', marginBottom: 15, paddingVertical: 10 },
  sectionTitle: { fontSize: 13, color: '#aaa', fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 10, marginTop: 5 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  iconContainer: { width: 40, alignItems: 'center' },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 16, color: '#333' },
  optionSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },

  // Logout
  logoutButton: { margin: 20, backgroundColor: '#FFF0F0', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FFDEDE' },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 },
  version: { textAlign: 'center', color: '#ccc', fontSize: 12 }
});