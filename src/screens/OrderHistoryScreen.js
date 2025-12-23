import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../helpers/currency'; // Make sure this path is correct

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // ⚠️ USE YOUR CORRECT URL (yumigo-api)
      const response = await fetch(`https://yumigo-api.onrender.com/api/orders/user/${user._id}`);
      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderOrder = ({ item }) => {
    // Determine status color
    let statusColor = '#FF9900'; // Orange (Preparing)
    if (item.status === 'On the Way') statusColor = '#24963F'; // Green
    if (item.status === 'Delivered') statusColor = 'gray';

    return (
      <View style={styles.card}>
        <View style={styles.header}>
            <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
            <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
        </View>

{/* Only show Track button if active */}
        {(item.status === 'Preparing' || item.status === 'On the Way') && (
            <TouchableOpacity 
                style={styles.trackButton}
                onPress={() => navigation.navigate('TrackOrder', { order: item })} // 👈 Pass order data
            >
                <Text style={styles.trackText}>📍 Track Order</Text>
            </TouchableOpacity>
        )}
        
        {/* (Make sure this is inside the main <View style={styles.card}>) */}

        {/* List the food items */}
        {item.items.map((food, i) => (
            <Text key={i} style={styles.itemText}>
                {food.quantity}x {food.name}
            </Text>
        ))}

        <View style={styles.divider} />
        
        <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total Paid:</Text>
            <Text style={styles.totalPrice}>{formatPrice(item.totalPrice)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Past Orders</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#FF9900" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchHistory} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No orders yet. Go eat! 🍔</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { color: '#888', fontSize: 14 },
  status: { fontWeight: 'bold', fontSize: 16 },
  itemText: { fontSize: 16, color: '#333', marginLeft: 10, marginVertical: 2 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#666' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: 'green' },
  trackButton: { marginTop: 15, backgroundColor: '#eef6ff', padding: 10, borderRadius: 8, alignItems: 'center' },
trackText: { color: '#007AFF', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#aaa', fontSize: 18 }
  
});