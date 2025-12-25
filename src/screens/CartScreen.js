import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStripe } from '@stripe/stripe-react-native'; 
import { useOrder } from '../context/OrderContext';
import { useWallet } from '../context/WalletContext'; // 👈 1. IMPORT WALLET

const formatPrice = (price) => `₹${price}`;

export default function CartScreen({ navigation, route }) {
  // 1.catch ride params (if coming from "hungry?" prompt)
  const { syncedRideId, rideDuration } = route.params ||{};
  const context = useCart();
  const cartItems = context.cart || context.cartItems || []; 
  const { removeFromCart, clearCart } = context;
  
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); 
  const { startOrder } = useOrder();
  
  // 👇 2. GET WALLET DATA
  const { balance, payFromWallet } = useWallet();

  const [loading, setLoading] = useState(false);

  // Calculate Total
  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  // --- STRIPE LOGIC (For Credit Card) ---
  const fetchPaymentIntent = async () => {
    try {
      const response = await fetch("https://yumigo-api.onrender.com/api/payments/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }) 
      });
      const json = await response.json();
      return json.clientSecret;
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server error");
      return null;
    }
  };

  const handleCardCheckout = async () => {
    if (!user) { Alert.alert("Login Required", "Please login."); return; }
    setLoading(true);

    const clientSecret = await fetchPaymentIntent();
    if (!clientSecret) { setLoading(false); return; }

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: "Yumigo App",
      paymentIntentClientSecret: clientSecret,
    });
    if (initError) { setLoading(false); return; }

    const { error: paymentError } = await presentPaymentSheet();
    if (paymentError) {
      Alert.alert("Payment Failed", paymentError.message);
      setLoading(false);
    } else {
      await placeOrder('Card'); // Pass 'Card' as method
    }
  };

  // --- 👇 NEW WALLET LOGIC ---
  const handleWalletCheckout = async () => {
    if (!user) { Alert.alert("Login Required", "Please login."); return; }
    
    // 1. Check if user has enough money
    if (balance < totalPrice) {
        Alert.alert("Insufficient Funds", "Please add money to your wallet via Profile.");
        return;
    }

    // 2. Attempt Payment
    const success = payFromWallet(totalPrice);
    
    if (success) {
        await placeOrder('Wallet'); // Pass 'Wallet' as method
    } else {
        Alert.alert("Error", "Wallet payment failed.");
    }
  };

  // --- COMMON ORDER LOGIC ---
  const placeOrder = async (method) => {
    setLoading(true);
    try { 
      // we call the API directly here to ensure we pass the 'rideId'
      const response = await fetch("https://yumigo-api.onrender.com/api/orders/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || user.id,
          items: cartItems,
          totalPrice: totalPrice,
          paymentMethod: method,

          // 🚨 THE MAGIC LINK! (Sends Ride Info to Backend)
          rideId: syncedRideId || null, 
          rideDuration: rideDuration || null 
        })
      });

      const json = await response.json();

      if (json.success) {
        // Show specific message (e.g., "Order Held" or "Order Placed")
        const successMsg = json.message || `Paid via ${method}! Order Placed 🚀`;
        Alert.alert("Success", successMsg);
        
        clearCart();
        navigation.navigate('TrackOrder'); // Or 'OrderHistory'
      } else {
        Alert.alert("Error", json.message || "Order saving failed.");
      }
      startOrder(cartItems, totalPrice);
      Alert.alert("Success", `Paid via ${method}! Order Placed 🚀`);
      clearCart();
      navigation.navigate('TrackOrder'); 
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Order saving failed.");
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
      {/* Show Sync Badge if linked to a ride */}
      {syncedRideId && (
        <View style={styles.syncBadge}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>⚡ Linked to your Ride</Text>
        </View>
      )}
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => (item._id || item.id || index).toString() + index}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.mathText}>{formatPrice(item.price)} x {item.quantity}</Text>
              <Text style={styles.price}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id || item._id)}>
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

        {/* 👇 WALLET SECTION */}
        <View style={styles.walletSection}>
            <Text style={styles.walletText}>Wallet Balance: <Text style={{fontWeight: 'bold', color: 'green'}}>₹{balance}</Text></Text>
            
            {/* Show Pay with Wallet Button ONLY if enough balance */}
            {balance >= totalPrice ? (
                <TouchableOpacity 
                    style={[styles.payButton, styles.walletBtn]} 
                    onPress={handleWalletCheckout}
                >
                    <Text style={styles.payText}>💳 Pay with Wallet</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.lowBalanceText}>Low Balance (Add money in Profile)</Text>
            )}
        </View>
        
        {/* STRIPE CARD BUTTON (Always Visible as Backup) */}
        <TouchableOpacity 
            style={[styles.payButton, styles.cardBtn, loading && { opacity: 0.7 }]} 
            onPress={handleCardCheckout}
            disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>🏦 Pay with Card (Stripe)</Text>}
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

  walletSection: { marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  walletText: { fontSize: 16, marginBottom: 10, color: '#555' },
  lowBalanceText: { color: 'red', fontStyle: 'italic', fontSize: 12 },

  payButton: { padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  walletBtn: { backgroundColor: '#111' }, // Black for Wallet
  cardBtn: { backgroundColor: '#FF9900' }, // Orange for Stripe
  payText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});