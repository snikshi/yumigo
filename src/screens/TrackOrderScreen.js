import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function TrackOrderScreen({ route, navigation }) {
  // We get the order details passed from the previous screen
  const { order } = route.params || {}; 

  // Simulation: Restaurant Location (e.g., Hyderabad)
  const restaurantLoc = {
    latitude: 17.440080, 
    longitude: 78.348915,
  };

  // Simulation: User Location (Slightly away)
  const userLoc = {
    latitude: 17.450380,
    longitude: 78.388415,
  };

  // If no order data passed (e.g., testing), show loading
  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Loading Order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🗺️ THE MAP */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (restaurantLoc.latitude + userLoc.latitude) / 2,
          longitude: (restaurantLoc.longitude + userLoc.longitude) / 2,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* 🏪 Restaurant Marker */}
        <Marker coordinate={restaurantLoc} title="Restaurant" description="Picking up food here">
            <View style={styles.markerContainer}>
                <Ionicons name="restaurant" size={20} color="white" />
            </View>
        </Marker>

        {/* 🏠 User Marker */}
        <Marker coordinate={userLoc} title="You" description="Delivery Location">
            <View style={[styles.markerContainer, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="home" size={20} color="white" />
            </View>
        </Marker>

        {/* 🛵 Driver Marker (Simulated at Restaurant start) */}
        {order.status === 'On the Way' && (
             <Marker coordinate={restaurantLoc} title="Driver" description="On the way!">
                <View style={[styles.markerContainer, { backgroundColor: 'black' }]}>
                    <Ionicons name="bicycle" size={20} color="white" />
                </View>
            </Marker>
        )}

        {/* 🛣️ Path Line */}
        <Polyline 
            coordinates={[restaurantLoc, userLoc]}
            strokeColor="#FF9900"
            strokeWidth={4}
        />
      </MapView>

      {/* 📦 STATUS CARD */}
      <View style={styles.card}>
        <Text style={styles.statusTitle}>Order Status</Text>
        <Text style={styles.statusText}>{order.status}</Text>
        
        <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.timeText}>Estimated Arrival: 15-20 mins</Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  markerContainer: { backgroundColor: '#FF9900', padding: 8, borderRadius: 20, elevation: 5 },
  card: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 10 },
  statusTitle: { fontSize: 16, color: '#888', fontWeight: 'bold' },
  statusText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginVertical: 5 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  timeText: { marginLeft: 5, color: '#666' },
  btn: { backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});