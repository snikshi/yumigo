import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, FlatList, SafeAreaView, Alert, StatusBar, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'; // 👈 THE REAL MAP

export default function RideScreen() {
  const [selectedRide, setSelectedRide] = useState('1');

  // 📍 Initial Location (Hyderabad - Charminar Area)
  const initialRegion = {
    latitude: 17.3616,
    longitude: 78.4747,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };

  const rides = [
    { id: '1', name: 'Moto', price: '₹45', time: '3 min', icon: 'bicycle' },
    { id: '2', name: 'Auto', price: '₹85', time: '5 min', icon: 'alert-circle' },
    { id: '3', name: 'Mini', price: '₹140', time: '8 min', icon: 'car-sport' },
    { id: '4', name: 'Prime', price: '₹190', time: '9 min', icon: 'car' },
  ];

  const handleBook = () => {
    Alert.alert("Requesting Ride...", "Connecting to nearby drivers...");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🗺️ REAL INTERACTIVE GOOGLE MAP */}
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        provider="google" // Forces Google Maps on both iOS and Android
      >
        {/* 📍 User Marker */}
        <Marker 
          coordinate={{ latitude: 17.3616, longitude: 78.4747 }} 
          title="You are here"
          description="Pickup Location"
          pinColor="blue"
        />

        {/* 🚕 Fake Driver Marker */}
        <Marker 
          coordinate={{ latitude: 17.3640, longitude: 78.4760 }} 
          title="Driver: Ramesh"
          description="Hero Splendor"
          pinColor="orange"
        />
      </MapView>

      {/* HEADER SEARCH */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.searchBox}>
            <TouchableOpacity style={styles.menuIcon}>
                <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>
            <View style={{flex: 1}}>
                <Text style={styles.pickupText}>Current Location</Text>
                <TextInput 
                    placeholder="Where to?" 
                    style={styles.input} 
                    placeholderTextColor="#333"
                />
            </View>
        </View>
      </SafeAreaView>

      {/* BOTTOM SHEET */}
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
                <Text style={[styles.rideName, selectedRide === item.id && {color: '#fff'}]}>{item.name}</Text>
                <Text style={[styles.rideTime, selectedRide === item.id && {color: '#ccc'}]}>{item.time}</Text>
                <Text style={[styles.ridePrice, selectedRide === item.id && {color: '#fff'}]}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookText}>Book {rides.find(r => r.id === selectedRide)?.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Map takes full screen
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  
  headerSafeArea: { position: 'absolute', top: 40, width: '100%', alignItems: 'center' },
  searchBox: { 
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', 
    width: '90%', padding: 10, borderRadius: 10, elevation: 5 
  },
  menuIcon: { marginRight: 15 },
  pickupText: { color: 'green', fontSize: 10, fontWeight: 'bold' },
  input: { fontSize: 18, fontWeight: 'bold', color: '#333', width: '100%' },

  bottomSheet: { 
    backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%', 
    borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, elevation: 20 
  },
  dragHandle: { width: 40, height: 4, backgroundColor: '#ddd', alignSelf: 'center', borderRadius: 10, marginBottom: 15 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  rideList: { paddingBottom: 20 },
  rideCard: { 
    backgroundColor: '#f2f2f2', width: 100, height: 120, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginRight: 10 
  },
  selectedRide: { backgroundColor: '#222' }, 
  
  iconCircle: { marginBottom: 8 },
  rideName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  rideTime: { fontSize: 11, color: '#666', marginBottom: 4 },
  ridePrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  bookButton: { backgroundColor: '#222', padding: 16, borderRadius: 10, alignItems: 'center' },
  bookText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});