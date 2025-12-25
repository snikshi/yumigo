import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Get the same user ID
import { Ionicons } from '@expo/vector-icons';

export default function YourRidesScreen() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      // 👇 FETCH RIDES FOR THIS USER ID
      const response = await fetch(`https://yumigo-api.onrender.com/api/rides/user/${user._id || user.id}`);
      const json = await response.json();
      setRides(json);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRide = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Ionicons name="car" size={24} color="black" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
          <Text style={[styles.status, { color: item.status === 'Completed' ? 'green' : 'orange' }]}>
            {item.status || "On the Way"}
          </Text>
        </View>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>

      <View style={styles.locationRow}>
        <View style={styles.dot} />
        <Text style={styles.address} numberOfLines={1}>{item.pickup?.address || "Pickup Location"}</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.locationRow}>
        <View style={[styles.dot, { backgroundColor: 'red' }]} />
        <Text style={styles.address} numberOfLines={1}>{item.drop?.address || "Drop Location"}</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="black" style={styles.center} />;
  if (rides.length === 0) return <View style={styles.center}><Text>No rides found.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Rides</Text>
      <FlatList 
        data={rides} 
        renderItem={renderRide} 
        keyExtractor={item => item._id} 
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  date: { fontSize: 12, color: '#888' },
  status: { fontWeight: 'bold', fontSize: 14, marginTop: 2 },
  price: { fontSize: 18, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'green', marginRight: 10 },
  line: { width: 1, height: 10, backgroundColor: '#ddd', marginLeft: 3.5, marginVertical: 2 },
  address: { color: '#555', fontSize: 14, flex: 1 },
});