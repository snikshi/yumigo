import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SellerScreen() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // 👇 1. FETCH AVAILABLE ORDERS
  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      // ⚠️ USE YOUR CORRECT RENDER URL (yumigo-api)
      const response = await fetch("https://yumigo-api.onrender.com/api/partner/available-orders");
      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch new orders");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 👇 2. ACCEPT AN ORDER
  const acceptOrder = async (orderId) => {
    try {
      const response = await fetch("https://yumigo-api.onrender.com/api/partner/accept-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            orderId: orderId,
            driverId: user._id // The logged-in user becomes the driver
        })
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert("Success", "You are now delivering this order! 🛵");
        fetchOrders(); // Refresh the list to remove the taken order
      } else {
        Alert.alert("Error", "Could not accept order.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server connection failed.");
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>Order #{item._id.slice(-4)}</Text>
        <Text style={styles.price}>₹{item.totalPrice}</Text>
      </View>

      <Text style={styles.status}>Status: {item.status}</Text>
      
      <Text style={styles.itemsLabel}>Items:</Text>
      {item.items.map((food, index) => (
        <Text key={index} style={styles.itemText}>
           • {food.quantity}x {food.name}
        </Text>
      ))}

      <TouchableOpacity 
        style={styles.acceptButton} 
        onPress={() => acceptOrder(item._id)}
      >
        <Text style={styles.acceptText}>✅ ACCEPT DELIVERY</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛵 Driver Dashboard</Text>
      <Text style={styles.subtitle}>Available Orders nearby:</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders waiting... take a break! ☕</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 18, fontWeight: 'bold', color: 'green' },
  status: { color: '#FF9900', fontWeight: 'bold', marginBottom: 10 },
  itemsLabel: { fontWeight: 'bold', marginTop: 5 },
  itemText: { color: '#555', marginLeft: 10 },
  acceptButton: { backgroundColor: '#24963F', padding: 12, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});