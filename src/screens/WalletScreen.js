import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, 
  Modal, Alert, StatusBar, ImageBackground, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext'; 
import * as LocalAuthentication from 'expo-local-authentication'; // 👈 1. Import Security

export default function WalletScreen({ navigation }) {
  const { balance, transactions, addMoney } = useWallet();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  
  // 👇 Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  // 2. Check if phone has FaceID/Fingerprint
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasBiometrics(compatible && enrolled);
    })();
  }, []);

  // 3. The Function to Unlock Wallet
  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock your Yumigo Wallet',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setIsAuthenticated(true);
        Alert.alert("Unlocked", "Wallet access granted! 🔓");
      } else {
        Alert.alert("Failed", "Authentication failed. Try again.");
      }
    } catch (error) {
      console.log(error);
      // If error (e.g. no hardware), just unlock for demo
      setIsAuthenticated(true);
    }
  };

  const handleTopUp = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    addMoney(amount);
    setAmount('');
    setModalVisible(false);
    Alert.alert("Success", `₹${amount} added! 💰`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
      </View>

      {/* 💳 SECURE CARD UI */}
      <View style={styles.cardContainer}>
        <ImageBackground 
            source={{uri: 'https://images.squarespace-cdn.com/content/v1/546c18a6e4b05a70ad8190fe/1569818246696-YXA0I6KTXJNM5TX7OLZ1/Card%2BFront.png'}} 
            style={styles.card} 
            imageStyle={{borderRadius: 20}}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Total Balance</Text>
                
                {/* 👇 HIDDEN BALANCE LOGIC */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {isAuthenticated ? (
                        <Text style={styles.balance}>₹ {balance.toLocaleString()}</Text>
                    ) : (
                        <Text style={styles.balance}>₹ ****</Text>
                    )}
                    
                    {!isAuthenticated && (
                        <TouchableOpacity onPress={authenticate} style={styles.unlockBtn}>
                            <Ionicons name="eye-off" size={20} color="#fff" />
                            <Text style={styles.unlockText}>Tap to View</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                <View style={styles.cardFooter}>
                    <Text style={styles.cardNumber}>**** **** **** 1234</Text>
                    <Text style={styles.expiry}>12/28</Text>
                </View>
            </View>
        </ImageBackground>
      </View>

      {/* ACTIONS (Disabled until Unlocked) */}
      <View style={[styles.actionRow, !isAuthenticated && {opacity: 0.5}]}>
        <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => isAuthenticated ? setModalVisible(true) : authenticate()}
        >
            <View style={[styles.iconCircle, {backgroundColor: '#e8f5e9'}]}>
                <Ionicons name="add" size={24} color="green" />
            </View>
            <Text style={styles.actionText}>Top Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => !isAuthenticated && authenticate()}>
            <View style={[styles.iconCircle, {backgroundColor: '#e3f2fd'}]}>
                <Ionicons name="arrow-up" size={24} color="#2196f3" />
            </View>
            <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => !isAuthenticated && authenticate()}>
            <View style={[styles.iconCircle, {backgroundColor: '#fff3e0'}]}>
                <Ionicons name="qr-code" size={24} color="#ff9800" />
            </View>
            <Text style={styles.actionText}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* HISTORY */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {isAuthenticated ? (
             <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.txnRow}>
                        <View style={[styles.txnIcon, item.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
                            <Ionicons name={item.type === 'credit' ? "arrow-down" : "arrow-up"} size={16} color={item.type === 'credit' ? "green" : "red"} />
                        </View>
                        <View style={{flex: 1, marginLeft: 15}}>
                            <Text style={styles.txnTitle}>{item.title}</Text>
                            <Text style={styles.txnDate}>{item.date}</Text>
                        </View>
                        <Text style={[styles.txnAmount, item.type === 'credit' ? {color: 'green'} : {color: '#333'}]}>
                            {item.type === 'credit' ? '+' : '-'} ₹{item.amount}
                        </Text>
                    </View>
                )}
            />
        ) : (
            <View style={styles.lockedState}>
                <Ionicons name="lock-closed" size={40} color="#ccc" />
                <Text style={{color: '#888', marginTop: 10}}>Authenticate to view history</Text>
                <TouchableOpacity onPress={authenticate} style={styles.bigUnlockBtn}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Unlock Wallet</Text>
                </TouchableOpacity>
            </View>
        )}
       
      </View>

      {/* TOP UP MODAL */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Money</Text>
                <TextInput 
                    placeholder="Enter Amount" 
                    keyboardType="numeric"
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                />
                <TouchableOpacity style={styles.payBtn} onPress={handleTopUp}>
                    <Text style={styles.payText}>Proceed to Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 15}}>
                    <Text style={{color: 'red'}}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#000', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  
  cardContainer: { alignItems: 'center', marginTop: 10 },
  card: { width: '90%', height: 180, backgroundColor: '#1a1a1a', borderRadius: 20, padding: 25, justifyContent: 'space-between', elevation: 10 },
  cardContent: { flex: 1, justifyContent: 'space-between' },
  cardLabel: { color: '#aaa', fontSize: 14 },
  balance: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardNumber: { color: '#ddd', fontSize: 16, letterSpacing: 2 },
  expiry: { color: '#ddd' },

  unlockBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 10, marginLeft: 15 },
  unlockText: { color: '#fff', fontSize: 12, marginLeft: 5 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 25, paddingHorizontal: 20 },
  actionBtn: { alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5, elevation: 2 },
  actionText: { fontWeight: '600', color: '#333' },

  historyContainer: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, elevation: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  
  txnRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  txnIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  creditIcon: { backgroundColor: '#e8f5e9' },
  debitIcon: { backgroundColor: '#ffebee' },
  txnTitle: { fontWeight: 'bold', fontSize: 16 },
  txnDate: { color: '#888', fontSize: 12 },
  txnAmount: { fontWeight: 'bold', fontSize: 16 },

  lockedState: { alignItems: 'center', marginTop: 50 },
  bigUnlockBtn: { marginTop: 20, backgroundColor: '#000', padding: 15, borderRadius: 10, width: 200, alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', padding: 25, borderRadius: 15, elevation: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderBottomWidth: 1, borderColor: '#ccc', fontSize: 24, textAlign: 'center', marginBottom: 20, padding: 10 },
  payBtn: { backgroundColor: '#000', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  payText: { color: '#fff', fontWeight: 'bold' },
});