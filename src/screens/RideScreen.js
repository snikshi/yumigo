import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';


export default function RideScreen({ navigation }) {
  const [destination, setDestination] = useState('');
  const [region, setRegion] = useState({
    latitude: 17.440080, // Default: Hyderabad (You can change this)
    latitudeDelta: 0.0922,
    longitude: 78.348915,
    longitudeDelta: 0.0421,
  });
  
  const [route, setRoute] = useState(null); // Stores the ride path
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user} = useAuth();

  // 📍 1. SIMULATE "FINDING" A LOCATION
  const handleSearch = () => {
    Keyboard.dismiss();
    if (!destination) return;

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Create a fake "Drop Location" slightly away from the user
      const fakeDropLat = region.latitude + 0.02; // Move slightly North
      const fakeDropLng = region.longitude + 0.02; // Move slightly East

      setRoute({
        pickup: { latitude: region.latitude, longitude: region.longitude },
        drop: { latitude: fakeDropLat, longitude: fakeDropLng },
      });

      // Calculate fake price (₹15 per km roughly)
      setPrice(Math.floor(Math.random() * 50) + 100); // Random price ₹100-150
      setLoading(false);
    }, 1500);
  };

  // 🚕 2. CONFIRM RIDE
 // 👇 REAL BOOKING FUNCTION
  const bookRide = async () => {
    if (!user) {
        Alert.alert("Error", "Please login to book a ride.");
        return;
    }

    setLoading(true);

    try {
      // ⚠️ USE YOUR URL (yumigo-api)
      const response = await fetch("https://yumigo-api.onrender.com/api/rides/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user._id,
            pickup: { 
                latitude: region.latitude, 
                longitude: region.longitude,
                address: "Current Location" 
            },
            drop: { 
                latitude: route.drop.latitude, 
                longitude: route.drop.longitude,
                address: destination 
            },
            price: price
        })
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert(
            "Ride Confirmed! 🚕", 
            `Driver ${json.ride.driverName} (${json.ride.carNumber}) is coming!`
        );
        // Reset Screen
        setRoute(null);
        setDestination('');
        setPrice(null);
      } else {
        Alert.alert("Error", "Booking failed.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🗺️ MAP BACKGROUND */}
      <MapView 
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)} // Update region when user drags map
      >
        {/* User Marker */}
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
            <View style={styles.myLocation}>
                 <Ionicons name="person" size={15} color="white" />
            </View>
        </Marker>

        {/* Destination Marker & Route (Only if simulated) */}
        {route && (
            <>
                <Marker coordinate={route.drop} pinColor="red" />
                <Polyline 
                    coordinates={[route.pickup, route.drop]} 
                    strokeColor="black" 
                    strokeWidth={4} 
                    lineDashPattern={[1]}
                />
            </>
        )}
      </MapView>

      {/* 📦 SEARCH BOX CARD */}
      <View style={styles.searchCard}>
        <Text style={styles.greeting}>Where to? 🚕</Text>
        
        <View style={styles.inputRow}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput 
                style={styles.input} 
                placeholder="Enter destination (e.g., Office)"
                value={destination}
                onChangeText={setDestination}
            />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Find Ride</Text>}
        </TouchableOpacity>
      </View>

      {/* 💰 PRICE CARD (Pops up after search) */}
      {route && (
          <View style={styles.rideCard}>
              <View style={styles.rideInfo}>
                  <Text style={styles.carType}>UberGo 🚗</Text>
                  <Text style={styles.estTime}>5 mins away</Text>
              </View>
              <Text style={styles.price}>₹{price}</Text>
              
              <TouchableOpacity style={styles.bookBtn} onPress={bookRide}>
                  <Text style={styles.bookText}>Confirm Ride</Text>
              </TouchableOpacity>
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  myLocation: { backgroundColor: '#007AFF', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  
  // Search Box Styles
  searchCard: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 10 },
  greeting: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  inputRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 12, borderRadius: 10, alignItems: 'center' },
  input: { marginLeft: 10, flex: 1, fontSize: 16 },
  searchBtn: { backgroundColor: 'black', padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Bottom Ride Card Styles
  rideCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20 },
  rideInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  carType: { fontSize: 18, fontWeight: 'bold' },
  estTime: { marginLeft: 10, color: 'gray' },
  price: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  bookBtn: { backgroundColor: '#24963F', padding: 15, borderRadius: 10, alignItems: 'center' },
  bookText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});