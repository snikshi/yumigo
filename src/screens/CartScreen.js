import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
// 👇 Import Stripe Hook
import { useStripe } from '@stripe/stripe-react-native';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, totalPrice } = useCart();
  
  // 👇 Get Stripe Tools
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // 👇 THE PAYMENT FUNCTION
  const onCheckout = async () => {
    setLoading(true);
    try {
      // 1. Ask YOUR Server for permission (Payment Intent)
      // Make sure this IP (192.168.1.13) is correct!
      const response = await fetch('http://192.168.1.13:5000/api/payment/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        Alert.alert("Error", data.error || "Server error");
        setLoading(false);
        return;
      }

      // 2. Initialize the Payment Sheet
      const initResponse = await initPaymentSheet({
        merchantDisplayName: 'Yumigo Food',
        paymentIntentClientSecret: data.paymentIntent, // The secret from server
        defaultBillingDetails: {
            name: 'Test User'
        }
      });

      if (initResponse.error) {
        Alert.alert("Error", initResponse.error.message);
        setLoading(false);
        return;
      }

      // 3. Show the Payment Sheet to User
      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        Alert.alert("Payment failed", paymentResponse.error.message);
      } else {
        Alert.alert("Success!", "Order Confirmed! 🍔");
        // Optional: Clear cart here
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Order 🍔</Text>
      
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
            
            {/* 👇 THE PAY BUTTON */}
            <TouchableOpacity 
                style={styles.checkoutButton} 
                onPress={onCheckout}
                disabled={loading}
            >
              <Text style={styles.checkoutText}>
                {loading ? "Processing..." : "PAY NOW"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8', paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 50 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, color: 'green' },
  footer: { marginTop: 20, borderTopWidth: 1, borderColor: '#ddd', paddingTop: 20 },
  totalText: { fontSize: 24, fontWeight: 'bold', textAlign: 'right', marginBottom: 15 },
  checkoutButton: { backgroundColor: '#FF4B3A', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: 'white', fontSize: 20, fontWeight: 'bold' }
});