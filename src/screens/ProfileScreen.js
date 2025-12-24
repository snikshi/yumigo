import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { balance, transactions, addMoney } = useWallet();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const handleAddMoney = () => {
    addMoney(amountInput);
    setAmountInput('');
    setModalVisible(false);
  };

  // 👇 SAFETY CHECK: Ensure we only render Strings
  const safeName = typeof user?.name === 'string' ? user.name : "Guest User";
  const safeEmail = typeof user?.email === 'string' ? user.email : "No Email";
  const safeBalance = typeof balance === 'number' ? balance.toLocaleString('en-IN') : '0';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatar} 
          />
          <View>
              {/* 👇 Using Safe Variables */}
              <Text style={styles.name}>{safeName}</Text>
              <Text style={styles.email}>{safeEmail}</Text>
              
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                  <Text style={styles.editLink}>Edit Profile</Text>
              </TouchableOpacity>
          </View>
        </View>

        {/* WALLET CARD */}
        <View style={styles.walletCard}>
          <View style={{flex: 1}}>
              <Text style={styles.walletLabel}>YUMIGO MONEY</Text>
              <Text style={styles.balance} numberOfLines={1} adjustsFontSizeToFit>
                ₹ {safeBalance}
              </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.addBtnText}>+ Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* MENU */}
        <Text style={styles.sectionTitle}>My Account</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('History')}>
            <View style={styles.menuIconBox}>
                <Ionicons name="receipt-outline" size={22} color="#333" />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Your Orders</Text>
                <Text style={styles.menuSubtext}>Track ongoing orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('RideHistory')}>
            <View style={styles.menuIconBox}>
                <Ionicons name="car-sport-outline" size={22} color="#333" />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Your Rides</Text>
                <Text style={styles.menuSubtext}>Ride history & details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Settings", "Coming Soon")}>
            <View style={styles.menuIconBox}>
                <Ionicons name="notifications-outline" size={22} color="#333" />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.transactionRow}>
                <View style={styles.iconBox}>
                    <Ionicons 
                        name={item.type === 'credit' ? "arrow-down" : "arrow-up"} 
                        size={18} 
                        color={item.type === 'credit' ? "green" : "red"} 
                    />
                </View>
                <View style={{flex: 1, marginLeft: 15}}>
                    <Text style={styles.transTitle}>{item.title}</Text>
                    <Text style={styles.transDate}>{item.date}</Text>
                </View>
                <Text style={[styles.transAmount, { color: item.type === 'credit' ? 'green' : 'red' }]}>
                    {item.type === 'credit' ? '+' : '-'} ₹{item.amount}
                </Text>
            </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Money to Wallet</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={amountInput}
                    onChangeText={setAmountInput}
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                        <Text style={{color: 'red'}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddMoney} style={styles.confirmBtn}>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>Add Money</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: '#fff' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#888' },
  editLink: { color: 'orange', fontWeight: 'bold', marginTop: 4 },
  walletCard: { backgroundColor: '#111', padding: 25, borderRadius: 20, margin: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  balance: { color: '#fff', fontSize: 24, fontWeight: 'bold', flex: 1 }, 
  addBtn: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginLeft: 10 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 10, color: '#333' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 20, backgroundColor: '#fff', marginBottom: 10, borderRadius: 12, elevation: 2 },
  menuIconBox: { width: 40, height: 40, backgroundColor: '#f0f0f0', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  menuSubtext: { fontSize: 12, color: '#888' },
  transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 10, marginBottom: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  transTitle: { fontSize: 14, fontWeight: '600' },
  transDate: { fontSize: 12, color: '#aaa' },
  transAmount: { fontSize: 14, fontWeight: 'bold' },
  logoutBtn: { marginTop: 20, alignItems: 'center', padding: 15, marginBottom: 20 },
  logoutText: { color: 'red', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 18, marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 10 },
  confirmBtn: { backgroundColor: 'green', padding: 10, borderRadius: 8, paddingHorizontal: 20 }
});