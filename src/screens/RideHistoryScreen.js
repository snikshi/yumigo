import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps'; 
import { useWallet } from '../context/WalletContext'; 
import RideFoodPrompt from '../components/RideFoodPrompt'; // Ensure this file exists in components
import * as Notifications from 'expo-notifications';

// Default Coordinates (Hyderabad)
const INITIAL_REGION = {
    latitude: 17.3850,
    longitude: 78.4867,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export default function RideHistoryScreen({ route, navigation }) {
  // 1. Get Params
  const { vehicle, dropLocation, rideId, rideEta } = route.params || {}; 
  const { payFromWallet } = useWallet(); 
  const mapRef = useRef(null);

  const [status, setStatus] = useState('Searching'); 
  const [driver, setDriver] = useState(null);
  const [hasPaid, setHasPaid] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(rideEta || 45); // Countdown state
  
  // Driver Position State
  const [driverLoc, setDriverLoc] = useState({ latitude: 17.3850, longitude: 78.4867 });

  // 2. Simulate Ride Logic & Notifications
  useEffect(() => {
    // A. Driver Found (3s)
    const timer1 = setTimeout(() => {
        setDriver({ name: 'Raju Bhai', rating: 4.8, plate: 'TS-09-AB-1234', phone: '9876543210' });
        setStatus('Arriving');
        
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Driver Found! 🚖",
                body: "Raju Bhai (TS-09-AB-1234) is arriving in 2 mins.",
                sound: 'default',
            },
            trigger: null,
        });
    }, 3000);

    // B. Ride Starts (8s)
    const timer2 = setTimeout(() => {
        setStatus('On Trip');
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Trip Started 🏁",
                body: "You are on your way. Hungry? Order food now to save time!",
            },
            trigger: null,
        });
    }, 8000);

    // C. Ride Completed (25s)
    const timer3 = setTimeout(() => {
        setStatus('Completed');
        Notifications.scheduleNotificationAsync({
            content: {
                title: "You've Arrived! ✅",
                body: `Total fare is ₹${vehicle?.price || '0'}. Payment deducted.`,
            },
            trigger: null,
        });
    }, 25000);

    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  // 3. Simulate Driver Movement & Timer
  useEffect(() => {
      if (status === 'Completed') return;

      const interval = setInterval(() => {
          // Move Driver
          setDriverLoc(prev => ({
              latitude: prev.latitude + 0.0005,
              longitude: prev.longitude + 0.0005,
          }));
          
          // Decrease Time
          setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 2000);

      return () => clearInterval(interval);
  }, [status]);

  // 4. Auto-Payment on Completion
  useEffect(() => {
    if (status === 'Completed' && !hasPaid && vehicle) {
        const success = payFromWallet(vehicle.price, `Ride to ${dropLocation || 'Dest'}`);
        if (success) {
            setHasPaid(true);
            Alert.alert("Ride Completed", `You reached destination. ₹${vehicle.price} paid from Wallet. ✅`);
        } 
    }
  }, [status]);

  // 5. Navigate to Home with Sync Data
  const handleFoodSync = () => {
    navigation.navigate('MainTabs', { 
        screen: 'Home', // Name of the tab
        params: { 
            syncedRideId: rideId, 
            rideDuration: timeLeft,
            dropLocation: dropLocation 
        }
    });
  };

  if (!vehicle) return <View style={styles.center}><Text>No ride details found.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_REGION}
        >
            <Marker coordinate={{ latitude: 17.3850, longitude: 78.4867 }} title="Pickup" pinColor="green" />
            <Marker coordinate={{ latitude: 17.4200, longitude: 78.5000 }} title="Drop" pinColor="red" />
            
            {driver && (
                <Marker coordinate={driverLoc} title="Driver">
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png' }} style={{width: 40, height: 40}} />
                </Marker>
            )}

            <Polyline 
                coordinates={[
                    { latitude: 17.3850, longitude: 78.4867 },
                    driverLoc,
                    { latitude: 17.4200, longitude: 78.5000 }
                ]}
                strokeColor="#000" 
                strokeWidth={3}
            />
        </MapView>
        
        {/* Top Status Pill */}
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
                {status === 'Searching' ? '🔍 Finding Driver...' :
                 status === 'Arriving' ? '🚖 Driver Arriving' :
                 status === 'On Trip' ? `🛣️ On Trip • ${timeLeft} min left` :
                 '✅ Ride Completed'}
            </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
            <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* DRIVER CARD */}
      {driver ? (
        <View style={styles.driverCard}>
            <View style={styles.driverRow}>
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} style={styles.driverIcon} />
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
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.otp}>OTP: 4589</Text>
                    {/* Prompt only shows during trip */}
                    {status === 'On Trip' && (
                         <TouchableOpacity style={styles.foodBtn} onPress={handleFoodSync}>
                             <Text style={{color:'#fff', fontWeight:'bold', fontSize:12}}>Order Food 🍔</Text>
                         </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
      ) : (
        <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Connecting to drivers...</Text>
        </View>
      )}

      {/* FLOATING PROMPT (If you prefer it floating outside the card) */}
      {status === 'On Trip' && (
          <RideFoodPrompt rideEta={timeLeft} onOrderPress={handleFoodSync} />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapContainer: { flex: 1, backgroundColor: '#eee', position: 'relative' },
  map: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 5 },
  statusBadge: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, elevation: 5 },
  statusText: { color: '#fff', fontWeight: 'bold' },
  driverCard: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 20, paddingBottom: 40 },
  loadingCard: { backgroundColor: '#fff', padding: 40, borderTopLeftRadius: 25, borderTopRightRadius: 25, alignItems: 'center', height: 200 },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverIcon: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#eee' },
  driverName: { fontSize: 18, fontWeight: 'bold' },
  plate: { color: '#666', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  vehicleName: { color: '#888', fontSize: 12 },
  callBtn: { padding: 10, backgroundColor: '#e8f5e9', borderRadius: 25 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  otp: { fontSize: 20, fontWeight: 'bold', letterSpacing: 2 },
  foodBtn: { backgroundColor: '#FF9900', paddingVertical:8, paddingHorizontal:15, borderRadius:20 }
});