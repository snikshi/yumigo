import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../context/OrderContext'; // 👈 Get History

export default function OrderHistoryScreen({ navigation }) {
  const { orderHistory } = useOrder();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>

      <View style={styles.divider} />

      {/* Show first 2 items names */}
      {item.items.map((food, index) => (
        <Text key={index} style={styles.itemText}>
            {food.quantity} x {food.name}
        </Text>
      ))}

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ₹{item.totalPrice}</Text>
        {item.status !== 'Delivered' && (
            <TouchableOpacity 
                style={styles.trackBtn} 
                onPress={() => navigation.navigate('TrackOrder')}
            >
                <Text style={styles.trackText}>Track Live</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 5}}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Past Orders</Text>
        <View style={{width: 24}} /> 
      </View>

      <FlatList
        data={orderHistory}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
            <View style={styles.center}>
                <Text style={{color: '#888'}}>No orders yet. Hungry? 🍕</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

// Helper for status colors
const getStatusColor = (status) => {
    if (status === 'Delivered') return 'green';
    if (status === 'Order Placed') return 'red';
    return 'orange';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold' },
  
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  status: { fontWeight: 'bold', fontSize: 14 },
  
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  itemText: { fontSize: 16, color: '#333', marginBottom: 4 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  total: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  
  trackBtn: { backgroundColor: '#000', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  trackText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  center: { alignItems: 'center', marginTop: 50 }
});