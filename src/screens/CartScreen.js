import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../helpers/currency'; 

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to place an order.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        userId: user._id || "guest_user",
        items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: Number(item.price), // 👈 FORCE NUMBER
            image: item.image
        })),
        totalPrice: totalPrice,
        status: "Preparing"
      };

      const response = await fetch("https://yumigo-api.onrender.com/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const json = await response.json();

      if (json.success) {
        clearCart();
        navigation.navigate('TrackOrder');
      } else {
        Alert.alert("Order Failed", json.error || "Something went wrong.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
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
        renderItem={({ item }) => {
            // 👇 CALCULATE LINE TOTAL SAFELY
            const unitPrice = Number(item.price);
            const lineTotal = unitPrice * item.quantity;
            
            return (
              <View style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  
                  {/* 👇 SHOW THE MATH: ₹100 x 2 */}
                  <Text style={styles.mathText}>
                    {formatPrice(unitPrice)} x {item.quantity}
                  </Text>
                  
                  <Text style={styles.price}>{formatPrice(lineTotal)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeFromCart(item._id)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
        </View>
        
        <TouchableOpacity 
            style={[styles.checkoutButton, loading && { opacity: 0.7 }]} 
            onPress={handleCheckout}
            disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.checkoutText}>✅ Checkout & Pay</Text>
          )}
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
  mathText: { color: '#888', fontSize: 14, marginTop: 2 }, // 👈 New Style
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