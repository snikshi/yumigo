import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RideHistoryScreen() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRides = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // ⚠️ USE YOUR CORRECT URL (yumigo-api)
      const response = await fetch(`https://yumigo-api.onrender.com/api/rides/user/${user._id}`);
      const json = await response.json();
      setRides(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const renderRide = ({ item }) => (
    <View style={styles.card}>
      {/* Header: Date & Price */}
      <View style={styles.header}>
        <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>

      {/* Driver Info */}
      <View style={styles.driverRow}>
        <Ionicons name="car-sport" size={20} color="#333" />
        <Text style={styles.driverText}>{item.driverName} • {item.carNumber}</Text>
      </View>

      <View style={styles.divider} />

      {/* Route Info */}
      <View style={styles.locationRow}>
        <Ionicons name="ellipse" size={12} color="green" />
        <Text style={styles.address} numberOfLines={1}>{item.pickup.address || "Current Location"}</Text>
      </View>
      
      <View style={styles.line} />
      
      <View style={styles.locationRow}>
        <Ionicons name="location" size={12} color="red" />
        <Text style={styles.address} numberOfLines={1}>{item.drop.address}</Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status || "Completed"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚕 My Rides</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="black" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={renderRide}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchRides} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No rides yet. Time to go somewhere! 🌍</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { color: '#888', fontSize: 14 },
  price: { fontWeight: 'bold', fontSize: 18, color: '#333' },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  driverText: { marginLeft: 10, fontWeight: 'bold', color: '#555' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  line: { height: 10, width: 1, backgroundColor: '#ccc', marginLeft: 5.5, marginVertical: 2 },
  address: { marginLeft: 10, color: '#444', flex: 1 },
  statusContainer: { alignSelf: 'flex-start', backgroundColor: '#eef6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 10 },
  statusText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#aaa', fontSize: 16 }
});