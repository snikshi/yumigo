import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../helpers/currency'; 

// 👇 Notice: We only have ({ navigation }) ONCE here.
export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, totalPrice } = useCart();

  const handleCheckout = () => {
    // 👇 Navigate to the Tracking Screen
    navigation.navigate('TrackOrder'); 
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Your cart is empty 🍔</Text>
        <Text style={styles.subText}>Go add some tasty food!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Order</Text>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.quantity}>Qty: {item.quantity}</Text>
              <Text style={styles.price}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => removeFromCart(item._id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>✅ Checkout Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15, marginTop: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 24, fontWeight: 'bold', color: '#888' },
  subText: { fontSize: 16, color: '#aaa', marginTop: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  itemCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, elevation: 2, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  quantity: { color: '#666', marginTop: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: 'green', marginTop: 4 },
  removeButton: { backgroundColor: '#ffdede', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  removeText: { color: 'red', fontWeight: 'bold', fontSize: 12 },
  footer: { marginTop: 20, backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 5 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 20, fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: 'green' },
  checkoutButton: { backgroundColor: '#FF9900', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});