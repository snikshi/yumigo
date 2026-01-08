import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    ImageBackground, Image, Alert, TextInput, ActivityIndicator, 
    Modal, StatusBar 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication'; // Security
import * as Clipboard from 'expo-clipboard'; // For copying address
import { LinearGradient } from 'expo-linear-gradient'; // Ensure you have this installed

export default function WalletScreen({ navigation }) {
    // 🟢 Context Data
    const { balance, tokens, walletAddress, transactions, swapTokens, addMoney, loading } = useWallet();
    const { user } = useAuth();

    // 🟢 Local State
    const [swapAmount, setSwapAmount] = useState('');
    const [topUpAmount, setTopUpAmount] = useState('');
    const [topUpVisible, setTopUpVisible] = useState(false);
    
    // 🟢 Security State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasBiometrics, setHasBiometrics] = useState(false);

    // 1. Check Biometrics on Load
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setHasBiometrics(compatible && enrolled);
            
            // Optional: Auto-prompt on load
            // authenticate(); 
        })();
    }, []);

    // 2. Authentication Function
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
            // Fallback for simulators/no-hardware
            setIsAuthenticated(true); 
        }
    };

    // 3. Helper Functions
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(walletAddress);
        Alert.alert("Copied", "Wallet address copied to clipboard!");
    };

    const handleSwap = async () => {
        if (!isAuthenticated) {
            authenticate();
            return;
        }

        if (!swapAmount || isNaN(swapAmount) || Number(swapAmount) <= 0) {
            Alert.alert("Invalid Amount", "Please enter a valid token amount.");
            return;
        }
        
        const result = await swapTokens(swapAmount);
        if (result.success) {
            Alert.alert("Success 💱", result.message);
            setSwapAmount('');
        } else {
            Alert.alert("Failed", result.message);
        }
    };

    const handleTopUp = () => {
        if (!topUpAmount || isNaN(topUpAmount) || Number(topUpAmount) <= 0) return;
        addMoney(topUpAmount); // This calls the context function (mock or real)
        setTopUpAmount('');
        setTopUpVisible(false);
        Alert.alert("Success", `₹${topUpAmount} added! 💰`);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Crypto Wallet</Text>
                <TouchableOpacity onPress={authenticate}>
                    <Ionicons 
                        name={isAuthenticated ? "lock-open" : "lock-closed"} 
                        size={24} 
                        color={isAuthenticated ? "#4CAF50" : "#F44336"} 
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* 🟢 1. CRYPTO CARD (Secure View) */}
                <View style={styles.cardContainer}>
                    <LinearGradient colors={['#2c3e50', '#000000']} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>WEB3 VAULT</Text>
                            <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png'}} style={{width: 30, height: 30}} />
                        </View>

                        <View>
                            <Text style={styles.balanceLabel}>Fiat Balance</Text>
                            <Text style={styles.balanceValue}>
                                {isAuthenticated ? `₹${balance.toLocaleString()}` : '****'}
                            </Text>
                        </View>
                        
                        <View style={styles.addressRow}>
                            <Text style={styles.addressText}>
                                {isAuthenticated 
                                    ? (walletAddress ? `${walletAddress.substring(0, 10)}...${walletAddress.substring(walletAddress.length - 6)}` : "Generating...") 
                                    : "0x****************"
                                }
                            </Text>
                            <TouchableOpacity onPress={copyToClipboard} disabled={!isAuthenticated}>
                                <Ionicons name="copy-outline" size={16} color="#aaa" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {/* 🟢 2. TOKEN STATS */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>YUMI TOKENS</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.tokenValue}>
                                {isAuthenticated ? tokens : '**'}
                            </Text>
                            <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/6198/6198527.png'}} style={{width: 20, height: 20, marginLeft: 5}} />
                        </View>
                        <Text style={styles.statSub}>Value: ₹{isAuthenticated ? tokens * 1 : '**'}</Text>
                    </View>
                    <View style={[styles.statBox, {backgroundColor: '#e3f2fd'}]}>
                        <Text style={styles.statLabel}>STATUS</Text>
                        <Text style={[styles.tokenValue, {color: '#1565C0'}]}>GOLD</Text>
                        <Text style={styles.statSub}>2x Rewards Active</Text>
                    </View>
                </View>

                {/* 🟢 3. ACTIONS ROW */}
                <View style={[styles.actionRow, !isAuthenticated && {opacity: 0.6}]}>
                     <TouchableOpacity 
                        style={styles.actionBtn} 
                        onPress={() => isAuthenticated ? setTopUpVisible(true) : authenticate()}
                    >
                        <View style={[styles.iconCircle, {backgroundColor: '#e8f5e9'}]}>
                            <Ionicons name="add" size={24} color="green" />
                        </View>
                        <Text style={styles.actionText}>Add Money</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => !isAuthenticated && authenticate()}>
                        <View style={[styles.iconCircle, {backgroundColor: '#fff3e0'}]}>
                             <MaterialCommunityIcons name="bank-transfer" size={24} color="#ff9800" />
                        </View>
                        <Text style={styles.actionText}>Withdraw</Text>
                    </TouchableOpacity>
                </View>

                {/* 🟢 4. SWAP INTERFACE */}
                <View style={styles.actionSection}>
                    <Text style={styles.sectionTitle}>Swap YUMI for Cash</Text>
                    {isAuthenticated ? (
                        <>
                            <View style={styles.swapContainer}>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Enter Tokens"
                                    keyboardType="numeric"
                                    value={swapAmount}
                                    onChangeText={setSwapAmount}
                                />
                                <TouchableOpacity style={styles.swapBtn} onPress={handleSwap} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.swapBtnText}>SWAP 💱</Text>}
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.rateText}>Exchange Rate: 1 YUMI = ₹1.00</Text>
                        </>
                    ) : (
                        <TouchableOpacity onPress={authenticate} style={styles.lockedSwap}>
                            <Ionicons name="lock-closed" size={20} color="#666" />
                            <Text style={{color: '#666', marginLeft: 10}}>Unlock to Swap Tokens</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 🟢 5. HISTORY */}
                <View style={styles.historyContainer}>
                    <Text style={styles.sectionTitle}>Transaction History</Text>
                    {isAuthenticated ? (
                        transactions.length > 0 ? (
                            transactions.map((txn, index) => (
                                <View key={index} style={styles.txnRow}>
                                    <View style={styles.txnIcon}>
                                        <Ionicons 
                                            name={txn.isToken ? "gift" : txn.title.includes('Swap') ? "swap-horizontal" : "fast-food"} 
                                            size={20} 
                                            color="#555" 
                                        />
                                    </View>
                                    <View style={{flex: 1, marginLeft: 15}}>
                                        <Text style={styles.txnTitle}>{txn.title}</Text>
                                        <Text style={styles.txnDate}>{new Date(txn.date).toDateString()}</Text>
                                    </View>
                                    <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? 'green' : 'red' }]}>
                                        {txn.type === 'credit' ? '+' : '-'} {txn.isToken ? 'Y' : '₹'}{txn.amount}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{color: '#888', textAlign: 'center', marginTop: 20}}>No transactions yet.</Text>
                        )
                    ) : (
                        <View style={styles.lockedState}>
                            <Ionicons name="eye-off-outline" size={30} color="#ccc" />
                            <Text style={{color: '#888', marginTop: 10}}>History Hidden</Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            {/* TOP UP MODAL */}
            <Modal visible={topUpVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Top Up Wallet</Text>
                        <TextInput 
                            placeholder="Enter Amount (₹)" 
                            keyboardType="numeric"
                            style={styles.modalInput}
                            value={topUpAmount}
                            onChangeText={setTopUpAmount}
                        />
                        <TouchableOpacity style={styles.modalBtn} onPress={handleTopUp}>
                            <Text style={styles.modalBtnText}>PAY NOW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTopUpVisible(false)} style={{marginTop: 15}}>
                            <Text style={{color: 'red'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f2' },
    
    // Header
    header: { backgroundColor: '#1e1e1e', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

    // Card
    cardContainer: { alignItems: 'center', marginTop: 20 },
    card: { width: '90%', padding: 25, borderRadius: 20, elevation: 8, justifyContent: 'space-between', height: 180 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardLabel: { color: '#aaa', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    balanceLabel: { color: '#ccc', fontSize: 12, marginBottom: 5 },
    balanceValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    addressRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', padding: 8, borderRadius: 8, marginTop: 10 },
    addressText: { color: '#ddd', fontSize: 12, marginRight: 8, fontFamily: 'monospace' },

    // Stats
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25 },
    statBox: { width: '48%', backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 2 },
    statLabel: { fontSize: 10, color: '#888', fontWeight: 'bold' },
    tokenValue: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 5 },
    statSub: { fontSize: 11, color: '#666', marginTop: 2 },

    // Actions
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 25, paddingHorizontal: 20 },
    actionBtn: { alignItems: 'center' },
    iconCircle: { width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', marginBottom: 5, elevation: 2 },
    actionText: { fontWeight: '600', color: '#333', fontSize: 12 },

    // Swap Section
    actionSection: { paddingHorizontal: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    swapContainer: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, marginRight: 10, elevation: 1, fontSize: 16 },
    swapBtn: { backgroundColor: '#FF9900', padding: 15, borderRadius: 12, elevation: 2, minWidth: 100, alignItems: 'center' },
    swapBtnText: { color: '#fff', fontWeight: 'bold' },
    rateText: { fontSize: 12, color: '#888', marginTop: 8, marginLeft: 5 },
    lockedSwap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e0e0', padding: 15, borderRadius: 12, justifyContent: 'center' },

    // History
    historyContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, elevation: 5, minHeight: 300 },
    txnRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 15, marginBottom: 10 },
    txnIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 1 },
    txnTitle: { fontWeight: 'bold', color: '#333', fontSize: 14 },
    txnDate: { fontSize: 12, color: '#888' },
    txnAmount: { fontWeight: 'bold', fontSize: 16 },
    lockedState: { alignItems: 'center', marginTop: 30 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', width: '80%', padding: 25, borderRadius: 15, elevation: 10, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    modalInput: { width: '100%', borderBottomWidth: 1, borderColor: '#ccc', fontSize: 24, textAlign: 'center', marginBottom: 20, padding: 10 },
    modalBtn: { backgroundColor: '#000', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
    modalBtnText: { color: '#fff', fontWeight: 'bold' },
});