import React, { useState, useEffect } from 'react';
import { 
    View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, Image, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function DeliveryScreen() { // 👈 Renamed Correctly
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // 1. FETCH AVAILABLE ORDERS
  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("https://yumigo-api.onrender.com/api/partner/available-orders");
      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. ACCEPT ORDER
  const acceptOrder = async (orderId) => {
    try {
      const response = await fetch("https://yumigo-api.onrender.com/api/partner/accept-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            orderId: orderId,
            driverId: user._id || user.id
        })
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert("Success", "You are now delivering this order! 🛵");
        fetchOrders(); // Refresh list
      } else {
        Alert.alert("Error", json.message || "Could not accept order.");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed.");
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={styles.iconBg}><Text>🍔</Text></View>
            <View style={{marginLeft: 10}}>
                <Text style={styles.orderId}>Order #{item._id.slice(-4)}</Text>
                <Text style={styles.restaurant}>From: {item.restaurantName || "Yumigo Kitchen"}</Text>
            </View>
        </View>
        <Text style={styles.price}>₹{item.totalPrice}</Text>
      </View>

      <View style={styles.divider} />
      
      <Text style={styles.itemsLabel}>Items to Pickup:</Text>
      {item.items.map((food, index) => (
        <Text key={index} style={styles.itemText}>
           • {food.quantity}x {food.name}
        </Text>
      ))}

      <View style={styles.addressBox}>
          <Ionicons name="location" size={16} color="#555" />
          <Text style={styles.addressText}>Drop: {item.address || "Customer Location"}</Text>
      </View>

      <TouchableOpacity 
        style={styles.acceptButton} 
        onPress={() => acceptOrder(item._id)}
      >
        <Text style={styles.acceptText}>ACCEPT DELIVERY 🚀</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#232f3e" />
      <View style={styles.header}>
          <Text style={styles.title}>Delivery Partner</Text>
          <View style={styles.onlineBadge}>
              <View style={styles.dot} />
              <Text style={styles.onlineText}>ONLINE</Text>
          </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={{padding: 20}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486744.png'}} style={{width:100, height:100, marginBottom:20, opacity:0.5}} />
            <Text style={styles.emptyText}>No orders waiting nearby.</Text>
            <Text style={styles.emptySub}>Relax and wait for the bell! 🔔</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#232f3e', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,255,0,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ff00', marginRight: 5 },
  onlineText: { color: '#00ff00', fontWeight: 'bold', fontSize: 12 },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBg: { width: 40, height: 40, backgroundColor: '#FFF8E1', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  restaurant: { fontSize: 12, color: '#888' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  
  itemsLabel: { fontWeight: 'bold', marginBottom: 5, color: '#555' },
  itemText: { color: '#666', fontSize: 14, marginBottom: 2 },
  
  addressBox: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  addressText: { marginLeft: 10, color: '#555', fontSize: 12 },

  acceptButton: { backgroundColor: '#000', padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptySub: { color: '#888', marginTop: 5 }
});