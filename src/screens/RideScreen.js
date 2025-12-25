import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext'; // 👈 1. Import Wallet
import { useAuth } from '../context/AuthContext'; // 👈 1. Import Auth

const VEHICLES = [
  { id: '1', name: 'Moto', price: 40, time: '3 min', image: 'https://cdn-icons-png.flaticon.com/512/3448/3448636.png' }, 
  { id: '2', name: 'Auto', price: 60, time: '5 min', image: 'https://cdn-icons-png.flaticon.com/512/2555/2555013.png' }, 
  { id: '3', name: 'Mini', price: 120, time: '7 min', image: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png' }, 
  { id: '4', name: 'Prime', price: 180, time: '8 min', image: 'https://cdn-icons-png.flaticon.com/512/5087/5087363.png' }, 
];

export default function RideScreen({ navigation }) {
  const { user } = useAuth(); // 👈 2. Get Real User Data
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // 👇 2. Get Balance
  const { balance } = useWallet();
// Inside RideScreen.js

// Inside RideScreen.js

const handleBook = async () => {
    // 1. Validation Checks
    if (!pickup || !drop) {
      Alert.alert("Missing Details", "Please enter Pickup and Drop locations.");
      return;
    }
    if (!selectedVehicle) {
      Alert.alert("Select Ride", "Please choose a vehicle type.");
      return;
    }
    // (Optional: Check Balance logic here)

    try {
        const response = await fetch("https://yumigo-api.onrender.com/api/rides/book", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user?._id || user?.id || "guest", // 👈 3. USE REAL ID HERE!
                pickup: { address: pickup },
                drop: { address: drop },
                price: selectedVehicle.price
            })
        });

        // Check if response is okay
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const json = await response.json();

        if (json.success) {
            // Success! Navigate
            navigation.navigate('RideHistory', { 
                vehicle: selectedVehicle,
                dropLocation: drop,
                rideId: json.ride._id,
                rideEta: parseInt(selectedVehicle.time) 
            });
        } else {
            Alert.alert("Booking Failed", "The server returned an error.");
        }
    } catch (err) {
        console.error("❌ Booking Error:", err);
        // This helps you see if it's a Timeout or DNS issue
        Alert.alert("Connection Error", "Could not connect to server. Is it waking up?");
    }




    // 👇 3. Check Wallet Balance BEFORE Booking
    if (balance < selectedVehicle.price) {
        Alert.alert(
            "Insufficient Balance", 
            `You need ₹${selectedVehicle.price} but you only have ₹${balance}. Please add money in Profile.`
        );
        return;
    }

    // Success - Go to Tracking
   // Inside RideScreen.js
navigation.navigate('RideHistory', { 
    vehicle: selectedVehicle,
    dropLocation: drop,
    rideId: json.ride._id, // 👈 Make sure this matches your backend response
    rideEta: parseInt(selectedVehicle.time) 
});
  };

  const renderVehicle = ({ item }) => {
    const isSelected = selectedVehicle?.id === item.id;
    return (
      <TouchableOpacity 
        style={[styles.vehicleCard, isSelected && styles.selectedCard]} 
        onPress={() => setSelectedVehicle(item)}
      >
        <Image source={{ uri: item.image }} style={styles.vehicleImage} />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.vehicleTime}>{item.time} away</Text>
        </View>
        <Text style={styles.vehiclePrice}>₹{item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* MAP BACKGROUND */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://i.imgur.com/8J5f8lq.png' }} 
          style={styles.mapImage} 
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* LOCATION INPUTS */}
      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
            <Ionicons name="radio-button-on" size={20} color="green" />
            <TextInput 
                style={styles.input} 
                placeholder="Pickup Location" 
                value={pickup}
                onChangeText={setPickup}
            />
        </View>
        <View style={styles.divider} />
        <View style={styles.inputRow}>
            <Ionicons name="location" size={20} color="red" />
            <TextInput 
                style={styles.input} 
                placeholder="Where to?" 
                value={drop}
                onChangeText={setDrop}
            />
        </View>
      </View>

      {/* VEHICLE LIST */}
      <View style={styles.bottomSheet}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
            <Text style={styles.sectionTitle}>Available Rides</Text>
            <Text style={{color: 'green', fontWeight: 'bold'}}>Wallet: ₹{balance}</Text>
        </View>
        
        <FlatList
          data={VEHICLES}
          keyExtractor={(item) => item.id}
          renderItem={renderVehicle}
          style={{ maxHeight: 250 }}
        />

        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Text style={styles.bookText}>
                {selectedVehicle ? `Book ${selectedVehicle.name} - ₹${selectedVehicle.price}` : "Select a Ride"}
            </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { flex: 1, backgroundColor: '#eee' },
  mapImage: { width: '100%', height: '100%', opacity: 0.7 },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', padding: 10, borderRadius: 20, elevation: 5 },
  inputCard: { position: 'absolute', top: 110, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, marginLeft: 10, fontSize: 16, paddingVertical: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginLeft: 30, marginVertical: 5 },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, elevation: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  vehicleCard: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#f9f9f9' },
  selectedCard: { borderColor: '#000', backgroundColor: '#eee', borderWidth: 2 },
  vehicleImage: { width: 50, height: 30, resizeMode: 'contain', marginRight: 15 },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: 16, fontWeight: 'bold' },
  vehicleTime: { fontSize: 12, color: '#666' },
  vehiclePrice: { fontSize: 16, fontWeight: 'bold' },
  bookBtn: { backgroundColor: '#000', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  bookText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});