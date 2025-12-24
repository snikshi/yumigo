import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useOrder } from '../context/OrderContext'; // 👈 Use Context

export default function SellerScreen() {
  const { liveOrder, updateOrderStatus } = useOrder();

  if (!liveOrder) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>No Active Orders 💤</Text>
        <Text style={styles.subText}>Wait for a customer to checkout.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👨‍🍳 Kitchen Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.orderId}>Order #{liveOrder.id}</Text>
        <Text style={styles.status}>Status: {liveOrder.status}</Text>
        
        <View style={styles.divider} />
        
        {liveOrder.items.map((item, i) => (
             <Text key={i} style={styles.item}>{item.quantity} x {item.name}</Text>
        ))}

        <Text style={styles.total}>Total: ₹{liveOrder.totalPrice}</Text>
      </View>

      <Text style={styles.label}>Update Status:</Text>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: 'orange' }]}
        onPress={() => updateOrderStatus('Preparing')}
      >
        <Text style={styles.btnText}>Start Cooking 🍳</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: 'blue' }]}
        onPress={() => updateOrderStatus('Out for Delivery')}
      >
        <Text style={styles.btnText}>Hand to Driver 🛵</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: 'green' }]}
        onPress={() => updateOrderStatus('Delivered')}
      >
        <Text style={styles.btnText}>Order Delivered ✅</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 24, fontWeight: 'bold', color: '#888' },
  subText: { color: '#aaa', marginTop: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 30, elevation: 3 },
  orderId: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 16, color: 'orange', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  item: { fontSize: 16, marginBottom: 5 },
  total: { fontSize: 18, fontWeight: 'bold', color: 'green', marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  btn: { padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});