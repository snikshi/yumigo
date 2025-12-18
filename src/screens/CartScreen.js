import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext'; // Import the Brain
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { cart, removeFromCart, totalPrice } = useCart();

  // If cart is empty, show a nice message
  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="gray" />
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Order 🍔</Text>

      {/* List of Items */}
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()} // simple key
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total & Checkout Button */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => Alert.alert("Success", "Order sent to backend! (Coming soon)")}
        >
            <Text style={styles.checkoutText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { fontSize: 20, color: 'gray', marginTop: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 18, fontWeight: '500' },
  itemPrice: { color: 'gray' },
  footer: { marginTop: 20, borderTopWidth: 2, borderTopColor: '#eee', paddingTop: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalText: { fontSize: 22, fontWeight: 'bold' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: 'green' },
  checkoutButton: { backgroundColor: '#FF4B3A', padding: 15, borderRadius: 30, alignItems: 'center' },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});