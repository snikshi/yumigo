import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, SafeAreaView, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../helpers/currency';

export default function OrderHistoryScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // 👇 Asking the Server: "Give me all receipts for this User ID"
      const response = await fetch(`https://yumigo-api.onrender.com/api/orders/myorders/${user._id}`);
      const json = await response.json();
      
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9900" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>📜 Your Past Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders yet. Go eat something! 🍔</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header: Date & Status */}
            <View style={styles.row}>
              <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
              <Text style={[styles.status, { color: item.status === 'Delivered' ? 'green' : 'orange' }]}>
                {item.status}
              </Text>
            </View>

            {/* List of Items in that Order */}
            {item.items.map((food, index) => (
              <Text key={index} style={styles.itemText}>
                • {food.quantity} x {food.name}
              </Text>
            ))}

            <View style={styles.divider} />

            {/* Total Price */}
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalPrice}>{formatPrice(item.totalPrice)}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  list: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
  
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  status: { fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  
  itemText: { fontSize: 14, color: '#444', marginBottom: 4 },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalLabel: { fontSize: 14, color: '#333', fontWeight: 'bold' },
  totalPrice: { fontSize: 16, color: 'green', fontWeight: 'bold' }
});