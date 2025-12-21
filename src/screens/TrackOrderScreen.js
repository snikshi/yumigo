import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, 
  Image, SafeAreaView, StatusBar, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrackOrderScreen({ navigation }) {
  const [status, setStatus] = useState("Preparing your food... 🍳");
  const [minutes, setMinutes] = useState(15);

  // ⏱️ Simulate the Order Progress
  useEffect(() => {
    setTimeout(() => setStatus("Driver assigned 🛵"), 2000);
    setTimeout(() => setStatus("Driver reached restaurant 🏬"), 5000);
    setTimeout(() => setStatus("Order picked up! On the way 🚀"), 8000);
    
    // Countdown timer simulation
    const timer = setInterval(() => {
      setMinutes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🗺️ MAP SIMULATION */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000' }} 
        style={styles.map}
      >
        <SafeAreaView style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.timeCard}>
                <Text style={styles.timeTitle}>Arriving in</Text>
                <Text style={styles.timeBig}>{minutes} mins</Text>
                <Text style={styles.statusText}>{status}</Text>
            </View>
        </SafeAreaView>
      </ImageBackground>

      {/* 🛵 DRIVER CARD */}
      <View style={styles.driverSheet}>
        <View style={styles.driverRow}>
            <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                style={styles.driverPic} 
            />
            <View style={styles.driverInfo}>
                <Text style={styles.driverName}>Ramesh Kumar</Text>
                <Text style={styles.driverRating}>⭐ 4.8 • Vaccine Taken 💉</Text>
                <Text style={styles.vehicleInfo}>Hero Splendor • TS 09 AB 1234</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.safetyText}>
            <Ionicons name="shield-checkmark" size={14} color="green" /> temperature checked at 98.4°F
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, resizeMode: 'cover' },
  header: { margin: 20, alignItems: 'center' },
  
  backButton: { position: 'absolute', left: 0, top: 10, backgroundColor: '#fff', padding: 10, borderRadius: 20, elevation: 5 },
  
  timeCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', width: '70%', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, marginTop: 50 },
  timeTitle: { color: '#888', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
  timeBig: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  statusText: { color: 'green', fontWeight: 'bold', fontSize: 12, marginTop: 5, textAlign: 'center' },

  driverSheet: { backgroundColor: '#fff', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverPic: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  driverRating: { color: '#666', fontSize: 12, marginTop: 2 },
  vehicleInfo: { color: '#aaa', fontSize: 12, marginTop: 2 },
  
  callButton: { backgroundColor: '#FF9900', padding: 12, borderRadius: 25 },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  safetyText: { textAlign: 'center', color: '#666', fontSize: 12 }
});