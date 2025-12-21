import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../helpers/currency'; 
import { useStripe } from '@stripe/stripe-react-native'; // 👈 IMPORT STRIPE

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // 👈 STRIPE HOOKS
  const [loading, setLoading] = useState(false);

  // 👇 1. ASK SERVER FOR PAYMENT KEY
  const fetchPaymentIntent = async () => {
    try {
      const response = await fetch("https://yumigo-api.onrender.com/api/payments/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }) // Send total (e.g. 170)
      });
      
      const json = await response.json();
      return json.clientSecret;

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not talk to the bank (Server error).");
      return null;
    }
  };

  // 👇 2. HANDLE THE CHECKOUT PROCESS
  const handleCheckout = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to place an order.");
      return;
    }

    setLoading(true);

    // Step A: Get Key from Server
    const clientSecret = await fetchPaymentIntent();
    if (!clientSecret) {
        setLoading(false);
        return;
    }

    // Step B: Prepare the Payment Sheet
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: "Yumigo App",
      paymentIntentClientSecret: clientSecret,
    });

    if (initError) {
      Alert.alert("Error", "Could not open payment sheet.");
      setLoading(false);
      return;
    }

    // Step C: Open the Sheet!
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert("Payment Failed", paymentError.message);
      setLoading(false);
    } else {
      // ✅ PAYMENT SUCCESS! NOW PLACE ORDER
      await placeOrder();
    }
  };

  // 👇 3. SAVE ORDER TO DATABASE (Only runs after payment)
  const placeOrder = async () => {
    try {
      const orderPayload = {
        userId: user._id,
        items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: Number(item.price),
            image: item.image
        })),
        totalPrice: totalPrice,
        status: "Preparing"
      };

      const response = await fetch("https://yumigo-backend.onrender.com/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert("Success", "Payment Received & Order Placed! 🍔");
        clearCart();
        navigation.navigate('TrackOrder');
      } else {
        Alert.alert("Order Failed", json.error || "Something went wrong saving the order.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Payment went through, but order saving failed.");
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
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.mathText}>
                {formatPrice(item.price)} x {item.quantity}
              </Text>
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
        
        <TouchableOpacity 
            style={[styles.checkoutButton, loading && { opacity: 0.7 }]} 
            onPress={handleCheckout}
            disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.checkoutText}>💳 Pay & Checkout</Text>
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
  mathText: { color: '#888', fontSize: 14, marginTop: 2 },
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