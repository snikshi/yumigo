import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext'; // 👈 1. Import Wallet

export default function RideHistoryScreen({ route, navigation }) {
  const { vehicle, dropLocation } = route.params || {}; 
  const { payFromWallet } = useWallet(); // 👈 2. Get Payment Function
  
  const [status, setStatus] = useState('Searching'); 
  const [driver, setDriver] = useState(null);
  const [hasPaid, setHasPaid] = useState(false); // 👈 3. Prevent Double Payment

  // Simulate Ride
  useEffect(() => {
    setTimeout(() => {
        setDriver({ name: 'Raju Bhai', rating: 4.8, plate: 'TS-09-AB-1234', phone: '9876543210' });
        setStatus('Arriving');
    }, 3000);

    setTimeout(() => {
        setStatus('On Trip');
    }, 8000);

    setTimeout(() => {
        setStatus('Completed');
    }, 15000);
  }, []);

  // 👇 4. Handle Automatic Payment when Completed
  useEffect(() => {
    if (status === 'Completed' && !hasPaid) {
        const success = payFromWallet(vehicle.price);
        if (success) {
            setHasPaid(true);
            Alert.alert("Ride Completed", `You reached ${dropLocation}. ₹${vehicle.price} paid from Wallet. ✅`);
        } else {
            Alert.alert("Payment Error", "Could not deduct from wallet.");
        }
    }
  }, [status]);

  if (!vehicle) return <View style={styles.center}><Text>No ride details.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* MAP */}
      <View style={styles.mapContainer}>
        <Image source={{ uri: 'https://i.imgur.com/8J5f8lq.png' }} style={styles.mapImage} />
        
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
                {status === 'Searching' ? '🔍 Finding Driver...' :
                 status === 'Arriving' ? '🚖 Driver Arriving (2 min)' :
                 status === 'On Trip' ? '🛣️ On the way to ' + dropLocation :
                 '✅ Ride Completed'}
            </Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
            <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* DRIVER CARD */}
      {driver ? (
        <View style={styles.driverCard}>
            <View style={styles.driverRow}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3048/3048122.png' }} style={styles.driverIcon} />
                <View style={{flex: 1}}>
                    <Text style={styles.driverName}>{driver.name} ⭐ {driver.rating}</Text>
                    <Text style={styles.plate}>{driver.plate}</Text>
                    <Text style={styles.vehicleName}>{vehicle.name}</Text>
                </View>
                <View style={styles.callBtn}>
                    <Ionicons name="call" size={22} color="green" />
                </View>
            </View>

            <View style={styles.divider} />

            {status === 'Completed' ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={{color: 'green', fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>
                        Paid ₹{vehicle.price} ✅
                    </Text>
                    <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate('MainTabs')}>
                        <Text style={styles.payText}>Rate & Close</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={styles.otp}>OTP: 4589</Text>
            )}
        </View>
      ) : (
        <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Connecting to nearby drivers...</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapContainer: { flex: 1, backgroundColor: '#eee', position: 'relative' },
  mapImage: { width: '100%', height: '100%', opacity: 0.8 },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 5 },
  statusBadge: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, elevation: 5 },
  statusText: { color: '#fff', fontWeight: 'bold' },
  driverCard: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 20 },
  loadingCard: { backgroundColor: '#fff', padding: 40, borderTopLeftRadius: 25, borderTopRightRadius: 25, alignItems: 'center', height: 200 },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverIcon: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#eee' },
  driverName: { fontSize: 18, fontWeight: 'bold' },
  plate: { color: '#666', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  vehicleName: { color: '#888', fontSize: 12 },
  callBtn: { padding: 10, backgroundColor: '#e8f5e9', borderRadius: 25 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  otp: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', letterSpacing: 5 },
  payBtn: { backgroundColor: '#000', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%' },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});