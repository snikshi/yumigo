import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, TextInput, 
  TouchableOpacity, FlatList, Image, SafeAreaView, Alert, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RideScreen() {
  const [selectedRide, setSelectedRide] = useState('1');

  // 🚗 The "Mock" Vehicles
  const rides = [
    { id: '1', name: 'Moto', price: '₹45', time: '3 min', icon: 'bicycle' },
    { id: '2', name: 'Auto', price: '₹85', time: '5 min', icon: 'alert-circle' }, // Using alert-circle as generic auto shape or similar
    { id: '3', name: 'Mini', price: '₹140', time: '8 min', icon: 'car-sport' },
    { id: '4', name: 'Prime', price: '₹190', time: '9 min', icon: 'car' },
  ];

  const handleBook = () => {
    Alert.alert("Searching...", "Connecting you to the nearest driver... 🚕");
    setTimeout(() => {
        Alert.alert("Driver Found!", "Ramesh (TS09 EA 1234) is arriving in 4 mins.");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🗺️ MAP BACKGROUND (The Visual Trick) */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.map}
      >
        {/* HEADER & SEARCH */}
        <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.searchBox}>
                <View style={styles.menuIcon}>
                    <Ionicons name="menu" size={24} color="#333" />
                </View>
                <View>
                    <Text style={styles.pickupText}>Current Location</Text>
                    <Text style={styles.dropText}>Where to?</Text>
                </View>
                <View style={styles.clockIcon}>
                    <Ionicons name="time" size={20} color="#333" />
                </View>
            </View>
        </SafeAreaView>
      </ImageBackground>

      {/* 🚙 BOTTOM SHEET (Vehicle Selection) */}
      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.sheetTitle}>Choose a ride</Text>
        
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rideList}
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={[styles.rideCard, selectedRide === item.id && styles.selectedRide]}
                onPress={() => setSelectedRide(item.id)}
            >
                <View style={styles.iconCircle}>
                    <Ionicons name={item.icon} size={28} color={selectedRide === item.id ? "#fff" : "#333"} />
                </View>
                <Text style={styles.rideName}>{item.name}</Text>
                <Text style={styles.rideTime}>{item.time}</Text>
                <Text style={styles.ridePrice}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.paymentRow}>
            <View style={styles.paymentMethod}>
                <Ionicons name="cash" size={20} color="green" />
                <Text style={styles.paymentText}> Cash</Text>
            </View>
            <Text style={styles.couponText}>Apply Coupon</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookText}>Book {rides.find(r => r.id === selectedRide)?.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, resizeMode: 'cover' }, // Takes up full screen background
  
  headerSafeArea: { margin: 20 },
  searchBox: { 
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', 
    padding: 15, borderRadius: 12, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10
  },
  menuIcon: { marginRight: 15 },
  pickupText: { color: 'green', fontSize: 12, fontWeight: 'bold' },
  dropText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  clockIcon: { marginLeft: 'auto', backgroundColor: '#eee', padding: 5, borderRadius: 20 },

  // Bottom Sheet
  bottomSheet: { 
    backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%', 
    borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20,
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15
  },
  dragHandle: { width: 40, height: 5, backgroundColor: '#ddd', alignSelf: 'center', borderRadius: 10, marginBottom: 15 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  rideList: { paddingBottom: 20 },
  rideCard: { 
    backgroundColor: '#f8f8f8', width: 100, height: 130, borderRadius: 15, 
    alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: '#eee' 
  },
  selectedRide: { backgroundColor: '#333', borderColor: '#333' }, // Dark mode for selected
  
  iconCircle: { marginBottom: 10 },
  rideName: { fontWeight: 'bold', fontSize: 16, color: '#888' },
  rideTime: { fontSize: 12, color: '#aaa', marginBottom: 5 },
  ridePrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  paymentMethod: { flexDirection: 'row', alignItems: 'center' },
  paymentText: { fontWeight: 'bold' },
  couponText: { color: 'blue', fontWeight: 'bold' },
  
  bookButton: { backgroundColor: '#333', padding: 18, borderRadius: 12, alignItems: 'center' },
  bookText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});