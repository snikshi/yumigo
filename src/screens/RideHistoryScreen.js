import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps'; // 👈 1. IMPORT MAP
import { useWallet } from '../context/WalletContext'; 
import RideFoodPrompt from '../components/RideFoodPrompt'; 
import * as Notifications from 'expo-notifications';

// HYDERABAD COORDINATES (Default)
const INITIAL_REGION = {
    latitude: 17.3850,
    longitude: 78.4867,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export default function RideHistoryScreen({ route, navigation }) {
  const { vehicle, dropLocation, rideId, rideEta } = route.params || {}; 
  const { payFromWallet } = useWallet(); 
  const mapRef = useRef(null); // Ref to animate map

  const [status, setStatus] = useState('Searching'); 
  const [driver, setDriver] = useState(null);
  const [hasPaid, setHasPaid] = useState(false); 
  
  // Driver Position State (Animated later)
  const [driverLoc, setDriverLoc] = useState({ latitude: 17.3850, longitude: 78.4867 });

  // Simulate Ride Logic (Same as before)
 // Simulate Ride Logic
  useEffect(() => {
    // 1. Driver Found
    const timer1 = setTimeout(() => {
        setDriver({ name: 'Raju Bhai', rating: 4.8, plate: 'TS-09-AB-1234', phone: '9876543210' });
        setStatus('Arriving');
        
        // 🔔 TRIGGER NOTIFICATION
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Driver Found! 🚖",
                body: "Raju Bhai (TS-09-AB-1234) is arriving in 2 mins.",
                sound: 'default',
            },
            trigger: null, // Send immediately
        });

    }, 3000);

    // 2. Ride Starts
    const timer2 = setTimeout(() => {
        setStatus('On Trip');

        // 🔔 TRIGGER NOTIFICATION
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Trip Started 🏁",
                body: "You are on your way to the destination. Share your ride details for safety.",
            },
            trigger: null,
        });

    }, 8000);

    // 3. Ride Completed
    const timer3 = setTimeout(() => {
        setStatus('Completed');
        
        // 🔔 TRIGGER NOTIFICATION
        Notifications.scheduleNotificationAsync({
            content: {
                title: "You've Arrived! ✅",
                body: `Total fare is ₹${vehicle?.price || '0'}. Payment deducted from Wallet.`,
            },
            trigger: null,
        });

    }, 25000);

    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  // Handle Payment (Same as before)
  useEffect(() => {
    if (status === 'Completed' && !hasPaid && vehicle) {
        const success = payFromWallet(vehicle.price);
        if (success) {
            setHasPaid(true);
            Alert.alert("Ride Completed", `You reached ${dropLocation}. ₹${vehicle.price} paid from Wallet. ✅`);
        } 
    }
  }, [status]);

  const handleFoodSync = () => {
    // ✅ Correct - Go to Tabs first, then Home
navigation.navigate('MainTabs', { 
    screen: 'Home', 
    params: { 
        syncedRideId: rideId, 
        rideDuration: (rideEta || 45) + 15 
    }
});
  };

  if (!vehicle) return <View style={styles.center}><Text>No ride details.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 👇 REAL MAP VIEW */}
      <View style={styles.mapContainer}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_REGION}
        >
            {/* Pickup Marker */}
            <Marker coordinate={{ latitude: 17.3850, longitude: 78.4867 }} title="Pickup" pinColor="green" />

            {/* Drop Marker (Simulated offset) */}
            <Marker coordinate={{ latitude: 17.4200, longitude: 78.5000 }} title="Drop" pinColor="red" />

            {/* Driver Marker (Car Icon) */}
            {driver && (
                <Marker coordinate={driverLoc} title="Driver">
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png' }} style={{width: 40, height: 40}} />
                </Marker>
            )}

            {/* Route Line */}
            <Polyline 
                coordinates={[
                    { latitude: 17.3850, longitude: 78.4867 }, // Pickup
                    driverLoc, // Current Driver Pos
                    { latitude: 17.4200, longitude: 78.5000 }  // Drop
                ]}
                strokeColor="#000" 
                strokeWidth={3}
            />
        </MapView>
        
        {/* Status Badge */}
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
                {status === 'Searching' ? '🔍 Finding Driver...' :
                 status === 'Arriving' ? '🚖 Driver Arriving (2 min)' :
                 status === 'On Trip' ? '🛣️ On the way to Destination' :
                 '✅ Ride Completed'}
            </Text>
        </View>

        {/* Prompt */}
        {status === 'On Trip' && (
            <RideFoodPrompt rideEta={(rideEta || 45) + 10} onOrderPress={handleFoodSync} />
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
            <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* DRIVER INFO CARD (Same as before) */}
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
                    <Text style={{color: 'green', fontWeight: 'bold', fontSize: 18}}>Paid ₹{vehicle.price} ✅</Text>
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
  map: { width: '100%', height: '100%' }, // 👈 IMPORTANT FOR MAP TO SHOW
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
});